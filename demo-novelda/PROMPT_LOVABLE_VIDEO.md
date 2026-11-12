# Instrucciones para Lovable · Vídeo comercial del Visor Urbanístico municipal

> **Cómo usarlo:** copia todo el bloque «PROMPT» en un proyecto nuevo de Lovable.
> Lovable no exporta vídeo: construye una **página animada que se reproduce sola, como un vídeo**. El MP4 se obtiene grabándola en pantalla (ver «Cómo obtener el MP4», al final).
> Antes de pegarlo, revisa los 3 puntos marcados con **[DECIDE JAU]**.

---

## PROMPT (copiar desde aquí)

Construye una **pieza de vídeo animada, de tipo comercial**, que presente un producto llamado **Visor Urbanístico**, de **UrbanGPT · PeritiaUrbana**. Debe ser una página web que se reproduce sola como un vídeo, de unos **85 segundos**, en formato **16:9 (1920×1080)**, pensada para grabarla en pantalla y presentarla a ayuntamientos.

### 1. Objetivo y público
- **Público:** alcaldes, concejales y técnicos municipales, en su mayoría **sin conocimientos urbanísticos ni informáticos**.
- **Mensaje único:** «Cualquier vecino escribe su dirección y sabe, en lenguaje claro, qué puede hacer en su parcela, con el documento oficial que lo respalda».
- **Tono:** moderno, sereno, de confianza institucional. Ritmo ágil, pero se lee todo. Nada de efectos estridentes.
- **Genérico:** debe servir para cualquier municipio. El nombre del municipio es un parámetro.

### 2. Parámetros (objeto de configuración en un único fichero `config.ts`)
```ts
export const CONFIG = {
  municipio: "tu municipio",      // se puede cambiar por URL: ?municipio=Novelda
  marca: "UrbanGPT · PeritiaUrbana",
  web: "peritiaurbana.com",
  referencia: "Ya en funcionamiento en Elche", // [DECIDE JAU] texto exacto, o null para ocultarlo
  contacto: null,                  // [DECIDE JAU] p. ej. "Nombre · teléfono · email", o null
  duracionesSeg: [5,7,6,8,8,10,10,7,9,9,6] // una por escena
};
```
- Lee `?municipio=` y `?grabar=1` de la URL. Con `grabar=1` se oculta toda la interfaz de control y el vídeo arranca solo tras 1 segundo en negro.

### 3. Identidad visual (obligatoria)
- **Colores:**
  - fondo cálido `#F9F5F3`, tinta `#0B0B0B` y verde de marca `#15603A`;
  - acento `#C4562C`, solo para el punto de la parcela y los avisos;
  - estados: «Sí / No le afecta» en verde `#237A49`, «No / Le afecta» en rojo `#B3372B` y «Con condiciones» en ámbar `#9A6700`.
- **Tipografía:** titulares en **Fraunces** (serif), texto en **Inter** y cifras y cálculos en **JetBrains Mono**.
- **Formas:** tarjetas blancas con radio de 14 px, sombra suave y bordes `#E6DED9`. Mucho aire y una sola idea por pantalla.
- **Ilustraciones:** todas en **SVG propio**: un plano urbano estilizado (manzanas, calles, un río, un polígono industrial, campo con árboles), un móvil, un PDF y personas sencillas. **Sin fotos de stock ni imágenes externas.**
- **No uses** escudos, logotipos ni nombres de ayuntamientos reales, ni mapas reales de ningún municipio.

### 4. Reglas de veracidad (no negociables)
1. **Todos los datos urbanísticos que aparezcan son ficticios.** Pon una marca discreta y fija en la esquina inferior derecha: «Datos ilustrativos».
2. **No inventes cifras de impacto.** Nada de «-70 % de consultas», «ahorro de X €» ni «miles de usuarios». Los beneficios se expresan de forma cualitativa.
3. **No digas** que el visor sustituye a la cédula urbanística, la licencia o los certificados. En el cierre debe aparecer, pequeño: «Información orientativa. No sustituye cédula, licencia ni certificado municipal».
4. Usa siempre **«planeamiento vigente»**, nunca «el PGOU»: hay municipios con Normas Subsidiarias.
5. El mensaje de rigor debe verse con claridad: **«Solo decimos "no le afecta" cuando está comprobado»**.

### 5. Guion escena a escena (texto en pantalla exacto)
Cada escena es un componente. Usa transiciones suaves de 400 a 600 ms: fundido con desplazamiento corto y zoom de cámara sobre el plano. Los textos entran palabra a palabra o línea a línea.

| # | Seg | Visual y animación | Texto en pantalla |
|---|---|---|---|
| 1 | 0–5 | Fondo cálido. Aparecen 3 bocadillos de personas distintas (vecina, empresario, comprador), uno tras otro. | «¿Puedo reformar mi casa?» · «¿Puedo ampliar mi nave?» · «¿Este edificio está protegido?» |
| 2 | 5–12 | Escena del problema, en gris apagado: cola en un mostrador, teléfono sonando y un documento de normas de «300 páginas» que se apila. | «Hoy, para saberlo, hay que pedir cita, llamar… o descifrar cientos de páginas.» |
| 3 | 12–18 | Corte a color: el logotipo tipográfico y el nombre del producto se dibujan. | «Visor Urbanístico de **{municipio}**» · debajo: «Toda la información urbanística, clara y en un clic.» |
| 4 | 18–26 | Un móvil en el centro. Se teclea «Calle Mayor, 12» y la cámara se acerca al plano SVG hasta resaltar una parcela con contorno naranja pulsante. | «1 · Escribe tu dirección» |
| 5 | 26–34 | Aparece una tarjeta junto a la parcela: «Suelo urbano · Casco tradicional», con una explicación de una línea. | «2 · Descubre qué suelo es, sin tecnicismos» |
| 6 | 34–44 | Lista de 4 afecciones que se rellenan una a una con su estado (2 «Le afecta» en rojo y 2 «No le afecta» en verde). Una lupa pasa sobre el verde y aparece un sello: «Comprobado con fuente oficial». | «3 · Mira qué le afecta» · luego: «Solo decimos "no le afecta" cuando está comprobado.» |
| 7 | 44–54 | Preguntas con respuestas en forma de chip (Sí / No / Con condiciones). Después, un cálculo en mono que se escribe: `1.200 m² × 70 % = 840 m²` · `840 − 600 = 240 m² más`. | «4 · Sabe qué puede hacer, con la cuenta hecha» |
| 8 | 54–61 | Un PDF sale del móvil. En sus líneas aparecen etiquetas de fuente: «Norma · artículo · fecha». | «5 · Y se lleva un informe con sus fuentes» |
| 9 | 61–70 | Carrusel rápido de 5 tarjetas sobre el plano: 🏠 Vivienda en el centro · 🏭 Nave industrial · 🏛️ Edificio protegido · 🌳 Suelo rural · 🏗️ Zona en desarrollo (con una barra de hitos: plan ✓, reparto ✓, obras 80 %, recepción pendiente). | «Para vecinos, empresas, compradores y técnicos» |
| 10 | 70–79 | Cuatro beneficios que entran de uno en uno, con icono lineal. | «Menos consultas en el mostrador» · «Más transparencia: cada dato con su documento» · «Fácil para cualquiera, también desde el móvil» · «Preparado para el nuevo planeamiento» |
| 11 | 79–85 | Cierre limpio. Si `referencia` no es null, aparece una línea pequeña con ese texto; si `contacto` no es null, aparece también. | «**{municipio}**, en un clic.» · «{marca} · {web}» · aviso legal pequeño (punto 4.3) |

**Texto en pantalla:** máximo **9 palabras por línea** y **2 líneas por escena**, con tamaño mínimo de 44 px a 1080p. El vídeo debe entenderse **sin sonido**.

### 6. Controles (ocultos con `?grabar=1`)
- Barra inferior discreta con **play/pausa** (barra espaciadora), **reiniciar** (tecla R), indicador de escena «4/11» y una línea de progreso.
- Un selector para probar el municipio: un campo de texto que actualiza el nombre en directo.
- Escenario fijo de 16:9, centrado y escalado para caber en cualquier pantalla, con bandas negras si hace falta.

### 7. Música y locución (opcional)
- **Sin audio por defecto.** Deja preparado un `<audio>` opcional que lea `/musica.mp3` si existe, con fundido de entrada y salida.
- Añade en `/guion-locucion.txt` el texto de locución de la sección 9 de este documento.

### 8. Implementación técnica
- React + TypeScript + Tailwind + **Framer Motion**. Una sola ruta `/` que es el vídeo.
- **Motor de línea de tiempo:** un array de escenas `{id, duracion, componente}`; el reloj se basa en `requestAnimationFrame` y permite pausar y reanudar sin desincronizar las animaciones.
- **Rendimiento:** 60 fps a 1920×1080. Anima solo `transform` y `opacity`, nunca `width`, `height` ni `top`.
- **Accesibilidad:** con `prefers-reduced-motion`, sustituye los movimientos por fundidos.
- **Sin backend, sin base de datos, sin autenticación** y sin llamadas a servicios externos.

### 9. Criterios de aceptación
- [ ] Se reproduce sola de principio a fin en 85 s (±3 s), sin saltos ni parpadeos.
- [ ] Con `?municipio=Novelda` el nombre cambia en las escenas 3 y 11, y con `?municipio=Elche` también.
- [ ] Con `?grabar=1` no se ve ningún control ni cursor.
- [ ] Ningún escudo, logotipo municipal, mapa real ni foto externa.
- [ ] La marca «Datos ilustrativos» se ve durante todo el vídeo.
- [ ] No aparece ninguna cifra de impacto inventada ni el término «PGOU».
- [ ] Todo el texto se lee en una pantalla de portátil a 2 metros de distancia.
- [ ] El aviso legal aparece en la escena final.

## (fin del PROMPT)

---

## Locución opcional (≈ 85 s, voz cálida y pausada)

> ¿Puedo reformar mi casa? ¿Puedo ampliar mi nave? ¿Este edificio está protegido?
> Hoy, para saberlo, hay que pedir cita, llamar… o descifrar cientos de páginas de normas.
> Presentamos el Visor Urbanístico de [municipio].
> Escribe tu dirección. El visor encuentra tu parcela y te dice qué tipo de suelo es, sin tecnicismos.
> Te muestra qué le afecta. Y solo te dice «no le afecta» cuando lo ha comprobado con la fuente oficial.
> Responde a lo que de verdad quieres saber, con la cuenta hecha.
> Y te llevas un informe con las fuentes que lo respaldan.
> Para vecinos, empresas, compradores y técnicos.
> Menos consultas en el mostrador, más transparencia, y preparado para el nuevo planeamiento.
> [Municipio], en un clic. UrbanGPT · PeritiaUrbana.

## Cómo obtener el MP4
1. Abre la página publicada en Chrome con `?municipio=Novelda&grabar=1`.
2. Pon la ventana a pantalla completa (F11) en una pantalla de 1920×1080, o usa el modo dispositivo de Chrome a 1920×1080.
3. Graba con **OBS Studio** (gratuito; fuente «Captura de ventana», 1920×1080, 60 fps) o con la grabación de pantalla del sistema operativo.
4. Recorta el segundo negro inicial. Para otro ayuntamiento, basta con cambiar `?municipio=` y volver a grabar.

## [DECIDE JAU] antes de pegarlo en Lovable
1. **`referencia`**: ¿mantenemos «Ya en funcionamiento en Elche»? Solo si es cierto y se puede decir públicamente.
2. **`contacto`**: nombre, teléfono y email que aparecerán al final, o null.
3. **Música**: si se usa, debe ser libre de derechos o con licencia comercial.
