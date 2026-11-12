# Kit para el vídeo comercial · Visor Urbanístico (UrbanGPT · PeritiaUrbana)

Todo lo necesario para producir un vídeo de unos 85 s, genérico para cualquier ayuntamiento, a partir de la demo preparada para Novelda.

## Contenido
| Archivo | Para qué sirve |
|---|---|
| `01_PROMPT_LOVABLE_VIDEO.md` | Prompt listo para pegar en Lovable: guion de 11 escenas, marca, reglas, controles y criterios de aceptación. |
| `02_GUION_PRESENTACION.md` | Guion de 5 minutos de la demo en directo: mensajes y preguntas probables. |
| `03_IDENTIDAD_DE_MARCA.md` | Colores, tipografías, tono y mensajes clave. |
| `04_CASOS_DE_EJEMPLO.md` | Contenido completo y coherente de los 5 casos (vivienda, nave, edificio protegido, suelo rural y sector en desarrollo). |
| `05_REGLAS_DE_VERACIDAD.md` | Lo que el vídeo nunca puede afirmar. |
| `06_video_referencia/` | **Vídeo final con música y locución** (Novelda y genérico «su municipio»), subtítulos `.srt` y fotogramas clave. |
| `07_capturas_demo/` | Capturas a 1920×1080 de la demo interactiva, como referencia visual de la interfaz real. |
| `08_demo_interactiva/visor-novelda-demo.html` | La demo completa en un solo archivo (doble clic para abrirla). |
| `09_AUDIO_Y_LICENCIAS.md` | Origen de la música (composición propia) y de la voz (Kokoro, Apache-2.0). |

## Para otro ayuntamiento
- **Vídeo de referencia:** se vuelve a renderizar con `node render.js "Nombre del municipio"`. El código está en el repositorio, en `demo-novelda/video/`.
- **Versión de Lovable:** abrid la página con `?municipio=Nombre&grabar=1` y grabadla.

## Pendiente de decisión (Jau)
2. El contacto que aparece en el cierre.
3. Voz: la locución actual es sintética. Si se prefiere una voz humana, hay que regrabarla siguiendo el `.srt`.
