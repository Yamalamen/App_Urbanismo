"""
Banda sonora del vídeo del Visor Urbanístico: locución + música original + mezcla.

- Locución: Kokoro-82M (licencia Apache-2.0), voz española "em_alex", generada localmente.
- Música: compuesta y sintetizada aquí (numpy), nota a nota. Obra original: sin licencias de terceros.
- Mezcla: la música se atenúa (ducking) cuando habla la voz; normalización final con ffmpeg (loudnorm).

Uso:
  python audio.py <dir_kokoro> <municipio> <salida.wav> [--solo-musica salida_musica.wav]
"""
import sys, json, numpy as np, soundfile as sf

SR = 44100
DUR = [5, 7, 6, 8, 8, 10, 10, 7, 9, 9, 6]
START = np.concatenate([[0], np.cumsum(DUR)[:-1]]).tolist()   # 0,5,12,18,26,34,44,54,61,70,79
TOTAL = float(sum(DUR))                                         # 85 s

def guion(muni: str):
    m = muni.strip()
    M = m[0].upper() + m[1:]
    # (escena, retardo dentro de la escena en s, texto). Cada frase cabe en su escena.
    return [
        (0, 0.35, "¿Puedo reformar mi casa? ¿Ampliar mi nave? ¿Este edificio está protegido?"),
        (1, 0.45, "Hoy, para saberlo, hay que pedir cita, llamar... o descifrar cientos de páginas de normas."),
        (2, 0.9,  f"Presentamos el Visor Urbanístico de {m}."),
        (3, 0.6,  "Basta con escribir la dirección. El visor encuentra la parcela al instante."),
        (4, 0.6,  "Y explica qué tipo de suelo es, en lenguaje claro, sin tecnicismos."),
        (5, 0.6,  "Muestra qué le afecta. Y solo dice «no le afecta» cuando lo ha comprobado con la fuente oficial."),
        (6, 0.6,  "Responde a lo que de verdad importa: qué se puede hacer, con la cuenta hecha."),
        (7, 0.6,  "Y el vecino se lleva un informe con las fuentes que lo respaldan."),
        (8, 0.6,  "Para vecinos, empresas, compradores y técnicos. En el centro, en el polígono o en el campo."),
        (9, 0.6,  "Para el Ayuntamiento: menos consultas en el mostrador, más transparencia, y preparado para el nuevo planeamiento."),
        (10, 0.5, "Su municipio, ahora en un clic." if m.lower() in ("su municipio", "tu municipio") else f"{M}, en un clic."),
    ]

# ------------------------------------------------------------------ voz
def locucion(kdir: str, muni: str):
    from kokoro_onnx import Kokoro
    k = Kokoro(f"{kdir}/kokoro-v1.0.onnx", f"{kdir}/voices-v1.0.bin")
    pista = np.zeros(int(TOTAL * SR) + SR, dtype=np.float32)
    informe = []
    for esc, ret, txt in guion(muni):
        hueco = DUR[esc] - ret - 0.35            # tiempo disponible antes del cambio de escena
        vel = 1.0
        while True:
            a, sr = k.create(txt.replace("«", "").replace("»", ""), voice="em_alex", speed=vel, lang="es")
            if len(a) / sr <= hueco or vel >= 1.18: break
            vel = round(vel + 0.04, 2)
        a = resample(a.astype(np.float32), sr, SR)
        a = recorta_silencio(a)
        t0 = int((START[esc] + ret) * SR)
        pista[t0:t0 + len(a)] += a
        informe.append({"escena": esc + 1, "inicio_s": round(START[esc] + ret, 2), "dur_s": round(len(a) / SR, 2),
                        "hueco_s": round(hueco, 2), "velocidad": vel, "cabe": len(a) / SR <= hueco + 0.05, "texto": txt})
    return pista[: int(TOTAL * SR)], informe

def resample(x, sr_in, sr_out):
    if sr_in == sr_out: return x
    n = int(len(x) * sr_out / sr_in)
    return np.interp(np.linspace(0, len(x) - 1, n), np.arange(len(x)), x).astype(np.float32)

def recorta_silencio(a, umbral=0.004):
    idx = np.where(np.abs(a) > umbral)[0]
    if len(idx) == 0: return a
    return a[max(0, idx[0] - int(0.02 * SR)): idx[-1] + int(0.12 * SR)]

# ------------------------------------------------------------------ música
def midi(n): return 440.0 * 2 ** ((n - 69) / 12)

def env(n, a, r):
    e = np.ones(n, dtype=np.float32)
    na, nr = min(n, int(a * SR)), min(n, int(r * SR))
    if na: e[:na] = np.linspace(0, 1, na)
    if nr: e[-nr:] *= np.linspace(1, 0, nr)
    return e

def lowpass(x, fc):
    # filtro de un polo, suficiente para suavizar los pads
    a = np.exp(-2 * np.pi * fc / SR)
    y = np.empty_like(x); acc = 0.0
    b = 1 - a
    for i in range(len(x)):  # vectorización innecesaria: 85 s de audio se procesan en segundos
        acc = b * x[i] + a * acc; y[i] = acc
    return y

def pad(notas, dur, vol, brillo=1800, ataque=0.8, rel=1.2):
    n = int(dur * SR); t = np.arange(n) / SR; s = np.zeros(n, dtype=np.float32)
    for nt in notas:
        for det in (-0.06, 0.0, 0.07):              # tres osciladores levemente desafinados (coro)
            f = midi(nt + det)
            s += (2 * ((t * f) % 1) - 1).astype(np.float32) * 0.33   # diente de sierra
    s = lowpass(s / max(1, len(notas)), brillo)
    return s * env(n, ataque, rel) * vol

def pluck(nt, dur, vol):
    n = int(dur * SR); t = np.arange(n) / SR; f = midi(nt)
    s = (np.sin(2 * np.pi * f * t) + 0.35 * np.sin(4 * np.pi * f * t) + 0.12 * np.sin(6 * np.pi * f * t)).astype(np.float32)
    return s * np.exp(-t * 5.5).astype(np.float32) * env(n, 0.004, 0.05) * vol

def bajo(nt, dur, vol):
    n = int(dur * SR); t = np.arange(n) / SR
    return np.sin(2 * np.pi * midi(nt) * t).astype(np.float32) * env(n, 0.03, 0.25) * vol

def tick(vol):
    n = int(0.05 * SR); rng = np.random.default_rng(3)
    s = rng.standard_normal(n).astype(np.float32); s = s - lowpass(s, 6000)   # ruido agudo
    return s * np.exp(-np.arange(n) / SR * 90).astype(np.float32) * vol

def riser(dur, vol):
    n = int(dur * SR); rng = np.random.default_rng(7)
    s = rng.standard_normal(n).astype(np.float32)
    s = lowpass(s, 2500) * np.linspace(0, 1, n) ** 2
    return s * vol

def pon(buf, x, t):
    i = int(t * SR); j = min(len(buf), i + len(x))
    if j > i: buf[i:j] += x[: j - i]

def musica():
    L = int(TOTAL * SR) + SR
    m = np.zeros(L, dtype=np.float32)
    # Progresión en Do mayor: I - V - vi - IV  (Do, Sol, Lam, Fa). Pulso a 96 ppm desde la presentación.
    PROG = [[60, 64, 67, 72], [59, 62, 67, 71], [57, 60, 64, 69], [57, 60, 65, 69]]
    RAIZ = [48, 43, 45, 41]
    # 0–5 s · preguntas: un pad sereno y abierto (Fa add9), curiosidad
    pon(m, pad([53, 60, 64, 67], 5.4, 0.20, 1400, 1.2, 1.0), 0.0)
    for k, nt in enumerate([72, 76, 79]):            # tres notas: una por pregunta
        pon(m, pluck(nt, 1.6, 0.10), 0.5 + 1.15 * k)
    # 5–12 s · problema: menor, oscuro y sin pulso (Lam → Fa)
    pon(m, pad([45, 52, 57, 60], 3.8, 0.20, 700, 0.8, 1.2), 5.0)
    pon(m, pad([41, 48, 53, 57], 3.8, 0.20, 650, 0.8, 1.6), 8.6)
    pon(m, riser(1.6, 0.05), 10.4)
    for k, nt in enumerate([72, 76, 79, 84]):         # destello al aparecer el producto
        pon(m, pluck(nt, 2.2, 0.07), 12.0 + 0.06 * k)
    # 12 s · presentación: se abre a Do mayor con brillo
    beat = 60 / 96; compas = 4 * beat
    t, i = 12.0, 0
    while t < 79.0:
        ac = PROG[i % 4]; raiz = RAIZ[i % 4]
        dur = min(compas, 79.0 - t)
        brillo = 2200 if t < 70 else 3000
        pon(m, pad(ac, dur + 0.6, 0.16, brillo, 0.35 if i else 0.08, 0.6), t)
        if 12.0 <= t < 18.0:                          # presentación: se abre con bajo y arpegio lento (negras)
            pon(m, bajo(raiz, dur, 0.15), t)
            for b in range(4):
                if t + b * beat < 18.0: pon(m, pluck(ac[b % 4] + 12, 1.2, 0.06), t + b * beat)
        if t >= 18.0:                                 # desde «escribe tu dirección»: pulso suave
            pon(m, bajo(raiz, dur, 0.17), t)
            arp = [ac[0] + 12, ac[1] + 12, ac[2] + 12, ac[1] + 12]
            for b in range(8):
                tb = t + b * beat / 2
                if tb < 79.0:
                    pon(m, pluck(arp[b % 4], 0.9, 0.065 if t < 70 else 0.08), tb)
                    if b % 2 == 1: pon(m, tick(0.025), tb)
        t += compas; i += 1
    pon(m, riser(2.2, 0.06), 76.8)                     # subida hacia el cierre
    # 79 s · cierre: Do add9 que resuelve y se apaga
    pon(m, pad([48, 55, 60, 62, 64, 67], 6.2, 0.15, 2000, 0.9, 4.5), 79.0)
    pon(m, bajo(36, 5.0, 0.14), 79.0)
    for k, nt in enumerate([72, 79, 84]):
        pon(m, pluck(nt, 2.5, 0.09), 81.6 + 0.18 * k)
    # eco ligero para dar espacio
    d = int(0.29 * SR); eco = np.zeros_like(m); eco[d:] = m[:-d] * 0.22
    m = m + eco
    m = m[: int(TOTAL * SR)]
    return m / (np.max(np.abs(m)) + 1e-9) * 0.5

# ------------------------------------------------------------------ mezcla
def ducking(voz, profundidad_db=-13.0):
    ventana = int(0.25 * SR)
    envv = np.convolve(np.abs(voz), np.ones(ventana) / ventana, mode="same")
    activo = (envv > 0.004).astype(np.float32)
    suav = np.convolve(activo, np.ones(int(0.3 * SR)) / int(0.3 * SR), mode="same")   # rampas de 0,3 s
    return 10 ** (profundidad_db * np.clip(suav, 0, 1) / 20)

def main():
    kdir, muni, salida = sys.argv[1], sys.argv[2], sys.argv[3]
    m = musica()
    if "--solo-musica" in sys.argv:
        sf.write(sys.argv[sys.argv.index("--solo-musica") + 1], np.stack([m, m], 1), SR, subtype="PCM_24")
    voz, informe = locucion(kdir, muni)
    voz = voz / (np.max(np.abs(voz)) + 1e-9) * 0.8
    mus = m * ducking(voz)
    # estéreo: voz al centro; música con leve ensanchado
    retraso = int(0.012 * SR)
    musL = mus; musR = np.concatenate([np.zeros(retraso, np.float32), mus[:-retraso]])
    L = voz + musL * 0.55; R = voz + musR * 0.55
    st = np.stack([L, R], 1); st = st / (np.max(np.abs(st)) + 1e-9) * 0.89
    fin = int(1.2 * SR); st[-fin:] *= np.linspace(1, 0, fin)[:, None]
    sf.write(salida, st, SR, subtype="PCM_24")
    sf.write(salida.replace(".wav", "-voz.wav"), voz, SR, subtype="PCM_24")
    print(json.dumps(informe, ensure_ascii=False, indent=1))

if __name__ == "__main__":
    main()
