"""
Descarga la ortofoto real del PNOA (IGN) para el visor de Novelda y la deja lista para incrustar.

Fuente: Instituto Geográfico Nacional, servicio WMS «PNOA máxima actualidad»
        https://www.ign.es/wms-inspire/pnoa-ma  (capa OI.OrthoimageCoverage)
Licencia: CC BY 4.0 (atribución «PNOA cedido por © Instituto Geográfico Nacional»).

Cada imagen se pide en EPSG:3857 (la proyección del mapa web), así encaja píxel a píxel.
Salida: assets/orto/<id>.jpg y assets/orto/orto.json con encuadres, resolución y fecha de descarga.
Uso: python3 tools/descarga_orto.py
"""
import json, math, os, sys, urllib.request, datetime

WMS = "https://www.ign.es/wms-inspire/pnoa-ma"
R = 6378137.0
BASE = os.path.join(os.path.dirname(__file__), "..")

def merc(lat, lon):
    return R * math.radians(lon), R * math.log(math.tan(math.pi / 4 + math.radians(lat) / 2))

def latlon(x, y):
    return math.degrees(2 * math.atan(math.exp(y / R)) - math.pi / 2), math.degrees(x / R)

def casos():
    # Lee las coordenadas de src/casos.js (fuente única de los ejemplos)
    import subprocess
    js = ("const vm=require('vm');const c={window:{}};"
          "vm.runInNewContext(require('fs').readFileSync(process.argv[1],'utf8'),c);"
          "console.log(JSON.stringify(c.window.NOVELDA_DEMO.casos.map(x=>({id:x.id,coords:x.coords}))))")
    out = subprocess.run(["node", "-e", js, os.path.join(BASE, "src", "casos.js")], capture_output=True, text=True, check=True)
    return json.loads(out.stdout)

def pide(nombre, x0, y0, x1, y1, ancho, alto, calidad):
    url = (f"{WMS}?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=OI.OrthoimageCoverage&STYLES="
           f"&CRS=EPSG:3857&BBOX={x0:.2f},{y0:.2f},{x1:.2f},{y1:.2f}&WIDTH={ancho}&HEIGHT={alto}&FORMAT=image/jpeg")
    with urllib.request.urlopen(url, timeout=120) as r:
        if r.headers.get("Content-Type", "").split(";")[0] != "image/jpeg":
            raise RuntimeError(f"{nombre}: respuesta inesperada {r.headers.get('Content-Type')}")
        data = r.read()
    destino = os.path.join(BASE, "assets", "orto", f"{nombre}.jpg")
    # Recompresión para que el visor sea ligero (Pillow si está; si no, se guarda tal cual)
    try:
        from PIL import Image
        import io
        im = Image.open(io.BytesIO(data)).convert("RGB")
        im.save(destino, "JPEG", quality=calidad, optimize=True, progressive=True)
    except ImportError:
        open(destino, "wb").write(data)
    s, w = latlon(x0, y0); n, e = latlon(x1, y1)
    res = (x1 - x0) / ancho
    print(f"{nombre}: {ancho}x{alto} px · {res:.2f} m/px (Mercator) · {os.path.getsize(destino)//1024} KB")
    return {"id": nombre, "bounds": [[s, w], [n, e]], "px": [ancho, alto], "m_px": round(res, 3), "archivo": f"{nombre}.jpg"}

def main():
    os.makedirs(os.path.join(BASE, "assets", "orto"), exist_ok=True)
    cs = casos()
    capas = []
    # 1) Vista general: todos los ejemplos con margen (≈ 2 m/px)
    xs, ys = zip(*[merc(*c["coords"]) for c in cs])
    m = 900
    x0, x1, y0, y1 = min(xs) - m, max(xs) + m, min(ys) - m, max(ys) + m
    ancho = 2400; alto = int(round(ancho * (y1 - y0) / (x1 - x0)))
    capas.append(pide("general", x0, y0, x1, y1, ancho, alto, 70) | {"nivel": 0})
    # 2) Casco urbano (≈ 0,9 m/px)
    cx, cy = merc(38.3860, -0.7660); h = 900
    capas.append(pide("casco", cx - h, cy - h, cx + h, cy + h, 2000, 2000, 72) | {"nivel": 1})
    # 3) Detalle de cada ejemplo (≈ 0,3 m/px; el rural, más amplio)
    for c in cs:
        cx, cy = merc(*c["coords"])
        h = 320 if c["id"] == "rural" else 220
        capas.append(pide(c["id"], cx - h, cy - h, cx + h, cy + h, 1400, 1400, 74) | {"nivel": 2})
    meta = {"fuente": "PNOA máxima actualidad · © Instituto Geográfico Nacional (CC BY 4.0)",
            "servicio": WMS + " (OI.OrthoimageCoverage, EPSG:3857)",
            "descargado": datetime.date.today().isoformat(), "capas": capas}
    json.dump(meta, open(os.path.join(BASE, "assets", "orto", "orto.json"), "w"), ensure_ascii=False, indent=1)
    total = sum(os.path.getsize(os.path.join(BASE, "assets", "orto", c["archivo"])) for c in capas)
    print(f"Total: {total/1024/1024:.1f} MB")

if __name__ == "__main__":
    main()
