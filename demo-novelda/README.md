# Visor urbanístico de Novelda — demostración comercial

Demo guiada para presentar a una persona sin formación técnica (concejalía) el visor urbanístico de UrbanGPT para Novelda.

**Abrir:** `dist/visor-novelda-demo.html` (un único archivo; doble clic y se abre en el navegador, y con internet carga los mapas oficiales).
`dist/visor-novelda-web.html` es la versión que se publica como enlace: dentro del enlace no se cargan los mapas externos y se muestra un plano esquemático a escala.
Funciona sin internet. Con internet, además carga el callejero, la foto aérea y las parcelas del Catastro.

## Recorrido (autoguiado: no requiere explicación)
Primera visita: bienvenida de 4 pantallas. En cada paso, un recuadro 💡 explica qué se ve; en el paso 4, «Por qué le importa al Ayuntamiento». La primera vez se señala «Toque aquí» sobre un dato. Recuerda el progreso y ofrece «Continuar donde lo dejó». Botón «? Ayuda» siempre visible.
Bienvenida → 5 casos (vivienda en el centro, nave en el polígono Santa Fe, edificio patrimonial, suelo rural y sector urbanizable en obras) →
5 pasos por caso (¿dónde está? · ¿qué suelo es? · ¿qué le afecta? · ¿qué se puede hacer? · informe PDF) → resumen de beneficios.
También tiene un modo de exploración libre: se toca el mapa y se consulta la referencia catastral en directo.

## Qué es real y qué es de ejemplo (fail-closed)
| Dato | Estado | Fuente |
|---|---|---|
| Ubicación de los casos 1 a 4 | **Real** | OpenStreetMap/Nominatim, consultado el 12/11/2026 (los ID de OSM están en `src/casos.js`) |
| Instrumento vigente: Normas Subsidiarias de Novelda, aprobación definitiva por la CTU el 16/10/1992, con modificaciones | **Real** | novelda.es (NNSS.pdf; Modificación Puntual n.º 7 de las NNSS, publicada en 06/2026) |
| Nuevo Plan General | En tramitación; **estado actual NO ACREDITADO** | Noticia de VisualUrb (2023). Hay que verificarlo en el Ayuntamiento |
| Datos de parcela, clasificación, parámetros, cálculos, afecciones, respuestas, hitos de gestión y trámites | **EJEMPLO** (ilustrativo, no oficial; decisión de Jau del 12/11/2026) | Ninguna. Cada valor lleva en pantalla y en el informe la etiqueta «Ejemplo» |
| Ubicación del caso 5 (urbanizable) | **EJEMPLO**: ubicación ilustrativa | No corresponde a ningún sector real |
| Coherencia urbanística de los ejemplos | Comprobada con `node test/coherencia.test.js` (146 comprobaciones) | En suelo urbano no se niegan obras ordinarias; en SNU protegido no hay vivienda; en urbanizable no hay solar sin recepción de obras; no se supera la edificabilidad ni la parcela mínima |
| Capas de mapa (OSM, PNOA del IGN, WMS del Catastro) y consulta catastral en directo | **NO VERIFICADO** desde el entorno de desarrollo (sin red) | Hay que probarlo antes de la reunión, con la conexión del Ayuntamiento |

## Compilar
`node build.js` → incrusta Leaflet 1.9.4 (`vendor/`, licencia BSD-2) y `src/casos.js` en `dist/visor-novelda-demo.html`.
