# Audio del vídeo: origen y licencias

## Música
- **Composición original**, creada y sintetizada nota a nota por código (`video/audio/audio.py`). No usa samples, loops ni pistas de terceros.
- Es obra propia: **no requiere licencia** de ninguna entidad de gestión ni de bibliotecas musicales.
- Estructura narrativa:
  - 0–5 s: pad abierto y tres notas, una por pregunta.
  - 5–12 s: tono menor y oscuro, sin pulso (el problema).
  - 12 s: se abre en Do mayor (la presentación del visor).
  - 18–79 s: pulso suave con la progresión I–V–vi–IV a 96 ppm.
  - 77 s: subida hacia el final.
  - 79 s: acorde final que resuelve.
- La música baja automáticamente unos 13 dB mientras habla la voz.

## Locución
- **Voz sintética** generada localmente con **Kokoro-82M** (licencia **Apache-2.0**, que permite el uso comercial), voz española `em_alex`.
- Inteligibilidad comprobada: se transcribió cada frase de la mezcla final con un reconocedor de voz independiente (Whisper), y el texto coincide con el guion.
- Si se prefiere una voz humana, el guion exacto con tiempos está en los subtítulos `.srt`, y basta con regrabarlo sobre los mismos tiempos.

## Nivel
- Mezcla normalizada a **−16 LUFS** (estándar para web, redes y proyección), con pico real de −1,5 dBTP, en AAC estéreo a 48 kHz.
