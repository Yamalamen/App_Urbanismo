# Visor urbanístico de Novelda — demostración comercial

Demo guiada para presentar a una persona sin formación técnica (concejalía) el visor urbanístico de UrbanGPT para Novelda.

**Abrir:** `dist/visor-novelda-demo.html`. Es un único archivo: doble clic y se abre en cualquier navegador.
Funciona sin internet. Con internet, además carga el callejero, la foto aérea y las parcelas del Catastro.

## Recorrido
Bienvenida → 4 casos (vivienda en el centro, nave en el polígono Santa Fe, edificio patrimonial, suelo rural) →
5 pasos por caso (¿dónde está? · ¿qué suelo es? · ¿qué le afecta? · ¿qué se puede hacer? · informe PDF) → resumen de beneficios.
También tiene un modo de exploración libre: se toca el mapa y se consulta la referencia catastral en directo.

## Qué es real y qué es de ejemplo (fail-closed)
| Dato | Estado | Fuente |
|---|---|---|
| Ubicación de los 4 casos | **Real** | OpenStreetMap/Nominatim, consultado el 12/11/2026 (los ID de OSM están en `src/casos.js`) |
| Instrumento vigente: Normas Subsidiarias de Novelda, aprobación definitiva por la CTU el 16/10/1992, con modificaciones | **Real** | novelda.es (NNSS.pdf; Modificación Puntual n.º 7 de las NNSS, publicada en 06/2026) |
| Nuevo Plan General | En tramitación; **estado actual NO ACREDITADO** | Noticia de VisualUrb (2023). Hay que verificarlo en el Ayuntamiento |
| Clasificación, usos, alturas, ocupación, parcela mínima y trámites | **EJEMPLO** (ilustrativo, no oficial) | Ninguna. Cada valor lleva en pantalla y en el informe la etiqueta «Ejemplo» |
| Afecciones | **PENDIENTE / NO EVALUADO** | En ningún caso se muestra «no afecta» |
| Capas de mapa (OSM, PNOA del IGN, WMS del Catastro) y consulta catastral en directo | **NO VERIFICADO** desde el entorno de desarrollo (sin red) | Hay que probarlo antes de la reunión, con la conexión del Ayuntamiento |

## Compilar
`node build.js` → incrusta Leaflet 1.9.4 (`vendor/`, licencia BSD-2) y `src/casos.js` en `dist/visor-novelda-demo.html`.
