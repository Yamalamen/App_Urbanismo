/*
 * CASOS DE DEMOSTRACIÓN — Visor urbanístico de Novelda (UrbanGPT)
 *
 * REGLA DE ESTE FICHERO (fail-closed):
 *  - tipo "real":    dato con fuente verificable, citada en `fuente`.
 *  - tipo "ejemplo": valor ILUSTRATIVO para enseñar cómo se verá la respuesta.
 *                    NO es dato oficial. En el visor contratado se sustituirá
 *                    por el valor extraído del planeamiento de Novelda.
 *  - tipo "pendiente": comprobación que el visor final hará; hoy NO EVALUADA.
 *
 * Ubicaciones: OpenStreetMap / Nominatim, consultado 2026-11-12.
 * Instrumento vigente citado: Revisión de las Normas Subsidiarias de
 * Planeamiento de Novelda, aprobación definitiva CTU 16/10/1992, con
 * modificaciones posteriores (p. ej. Modificación Puntual n.º 7, publicada en
 * novelda.es en 2026-06). Fuentes: novelda.es/wp-content/uploads/2025/01/NNSS.pdf
 * y novelda.es/wp-content/uploads/2026/06/Modificacion_Puntual_7-NNSS.pdf.
 */
window.NOVELDA_DEMO = {
  municipio: "Novelda",
  centro: [38.3842, -0.7674],
  zoomInicial: 14,
  instrumento: {
    nombre: "Normas Subsidiarias de Planeamiento de Novelda",
    detalle: "Aprobación definitiva: Comisión Territorial de Urbanismo, 16/10/1992, con sus modificaciones posteriores.",
    nota: "Novelda tramita un nuevo Plan General. El visor final mostrará el planeamiento vigente y, por separado, el que esté en tramitación."
  },
  casos: [
    {
      id: "centro",
      icono: "🏠",
      titulo: "Quiero reformar mi casa en el centro",
      persona: "Una vecina con una vivienda junto a la Plaça d'Espanya",
      lugar: "Entorno de la Plaça d'Espanya (Ajuntament de Novelda)",
      coords: [38.38621, -0.76490],
      fuenteLugar: "OpenStreetMap, vía 43104084",
      zoom: 18,
      suelo: {
        titular: "Suelo urbano · zona residencial del casco",
        explicacion: "Es suelo de ciudad ya construida: se puede edificar y reformar cumpliendo las normas de la zona.",
        tipo: "ejemplo"
      },
      afecciones: [
        { nombre: "Protección de patrimonio cercano", estado: "pendiente" },
        { nombre: "Zona inundable", estado: "pendiente" },
        { nombre: "Carreteras y servidumbres", estado: "pendiente" }
      ],
      puede: [
        { texto: "Reformar el interior de la vivienda", valor: "Sí, con licencia o declaración responsable", tipo: "ejemplo" },
        { texto: "Añadir una planta", valor: "Según la altura máxima de la zona", tipo: "ejemplo" },
        { texto: "Altura máxima", valor: "3 plantas", tipo: "ejemplo" },
        { texto: "Uso permitido", valor: "Vivienda y pequeño comercio", tipo: "ejemplo" }
      ],
      tramite: "Licencia de obra menor o mayor, según el alcance de la reforma."
    },
    {
      id: "industrial",
      icono: "🏭",
      titulo: "Mi empresa quiere ampliar la nave",
      persona: "Un empresario del Polígono industrial Santa Fe",
      lugar: "Polígono industrial Santa Fe",
      coords: [38.38492, -0.77646],
      fuenteLugar: "OpenStreetMap, vía 43117114",
      zoom: 17,
      suelo: {
        titular: "Suelo urbano · uso industrial",
        explicacion: "Zona pensada para naves y actividad económica. La ampliación depende de cuánto se puede ocupar la parcela.",
        tipo: "ejemplo"
      },
      afecciones: [
        { nombre: "Zona inundable", estado: "pendiente" },
        { nombre: "Carreteras y servidumbres", estado: "pendiente" },
        { nombre: "Líneas eléctricas", estado: "pendiente" }
      ],
      puede: [
        { texto: "Ampliar la nave", valor: "Sí, hasta la ocupación máxima de la parcela", tipo: "ejemplo" },
        { texto: "Ocupación máxima", valor: "70 % de la parcela", tipo: "ejemplo" },
        { texto: "Separación a linderos", valor: "5 metros", tipo: "ejemplo" },
        { texto: "Usos permitidos", valor: "Industria, almacén y talleres", tipo: "ejemplo" }
      ],
      tramite: "Licencia de obra mayor y, según la actividad, licencia o comunicación ambiental."
    },
    {
      id: "patrimonio",
      icono: "🏛️",
      titulo: "¿Este edificio está protegido?",
      persona: "Un comprador interesado en un edificio modernista de la calle Major",
      lugar: "Casa Museo Modernista · Carrer Major, 24",
      coords: [38.38701, -0.76552],
      fuenteLugar: "OpenStreetMap, nodo 2318211088",
      zoom: 18,
      suelo: {
        titular: "Suelo urbano · edificio catalogado",
        explicacion: "Los edificios con valor histórico tienen reglas especiales: qué se puede tocar y qué hay que conservar.",
        tipo: "ejemplo"
      },
      afecciones: [
        { nombre: "Catálogo de bienes protegidos", estado: "pendiente" },
        { nombre: "Entorno de protección", estado: "pendiente" },
        { nombre: "Zona inundable", estado: "pendiente" }
      ],
      puede: [
        { texto: "Conservar la fachada", valor: "Obligatorio", tipo: "ejemplo" },
        { texto: "Reformar el interior", valor: "Sí, respetando los elementos protegidos", tipo: "ejemplo" },
        { texto: "Demoler", valor: "No permitido", tipo: "ejemplo" },
        { texto: "Informe previo de Patrimonio", valor: "Necesario", tipo: "ejemplo" }
      ],
      tramite: "Licencia de obra con informe previo sobre los elementos protegidos."
    },
    {
      id: "rural",
      icono: "🌳",
      titulo: "¿Puedo construir en el campo?",
      persona: "Una familia con un terreno cerca del Santuario de la Magdalena",
      lugar: "Entorno del Santuario de la Magdalena",
      coords: [38.40816, -0.79215],
      fuenteLugar: "OpenStreetMap, vía 67563821",
      zoom: 16,
      suelo: {
        titular: "Suelo no urbanizable (rural) · paraje protegido",
        explicacion: "Es suelo rural: no es ciudad. Construir aquí está muy limitado y solo se admiten casos concretos.",
        tipo: "ejemplo"
      },
      afecciones: [
        { nombre: "Protección paisajística", estado: "pendiente" },
        { nombre: "Montes y espacios naturales", estado: "pendiente" },
        { nombre: "Riesgo de incendio forestal", estado: "pendiente" }
      ],
      puede: [
        { texto: "Construir una vivienda nueva", valor: "Muy restringido", tipo: "ejemplo" },
        { texto: "Parcela mínima", valor: "10.000 m²", tipo: "ejemplo" },
        { texto: "Casetas agrícolas", valor: "Con condiciones", tipo: "ejemplo" },
        { texto: "Usos permitidos", valor: "Agrícola y forestal", tipo: "ejemplo" }
      ],
      tramite: "Consulta previa al Ayuntamiento; en muchos casos, autorización de la Generalitat."
    }
  ]
};
