/*
 * CASOS DE DEMOSTRACIÓN — Visor urbanístico de Novelda (UrbanGPT)
 *
 * Decisión de Jau (2026-11-12): mostrar valores de ejemplo ETIQUETADOS, con todos
 * los campos completos y coherentes entre sí.
 *
 * REGLA DE ESTE FICHERO:
 *  - real: true  -> dato con fuente verificable (citada).
 *  - resto        -> VALOR DE EJEMPLO, ilustrativo y NO oficial. En el visor
 *                    contratado se sustituye por el dato del planeamiento de Novelda.
 *
 * Coherencia interna exigida (y comprobada por test/coherencia.test.js):
 *  - En suelo urbano la edificación es posible según la norma de zona.
 *  - En suelo no urbanizable protegido no se admite vivienda nueva.
 *  - En suelo urbanizable no es solar hasta que se reciben las obras de urbanización.
 *  - Lo construido o proyectado no supera ocupación ni edificabilidad de ejemplo.
 *  - Ningún uso aparece a la vez como permitido y prohibido.
 *
 * Ubicaciones reales: OpenStreetMap/Nominatim, consultado 2026-11-12 (salvo el
 * caso 5, cuya ubicación es ilustrativa y así se indica).
 * Instrumento vigente (real): Revisión de las Normas Subsidiarias de Planeamiento
 * de Novelda, aprobación definitiva CTU 16/10/1992, con modificaciones posteriores.
 */
window.NOVELDA_DEMO = {
  municipio: "Novelda",
  centro: [38.3872, -0.7720],
  zoomInicial: 14,
  instrumento: {
    nombre: "Normas Subsidiarias de Planeamiento de Novelda",
    detalle: "Aprobación definitiva por la Comisión Territorial de Urbanismo el 16/10/1992, con sus modificaciones posteriores.",
    nota: "Novelda tramita un nuevo Plan General. El visor final mostrará el planeamiento vigente y, por separado, el que esté en tramitación."
  },

  /* Explicaciones en lenguaje claro: se muestran al tocar cada dato. */
  glosario: {
    "Clase de suelo": "La categoría básica del terreno: urbano (ciudad ya hecha), urbanizable (futura ciudad) o no urbanizable (campo).",
    "Zona": "El barrio o área de la norma urbanística. Cada zona tiene sus propias reglas de altura, usos y tamaño.",
    "Superficie de la parcela": "Los metros cuadrados del terreno, según el Catastro.",
    "Superficie construida": "Los metros cuadrados ya edificados, sumando todas las plantas.",
    "Altura máxima": "Cuántas plantas y cuántos metros puede tener un edificio como máximo.",
    "Edificabilidad": "Cuántos metros cuadrados se pueden construir en total por cada metro cuadrado de parcela.",
    "Ocupación máxima": "Qué parte del terreno puede quedar cubierta por el edificio, vista desde arriba.",
    "Fondo edificable": "Hasta cuántos metros, medidos desde la fachada, se puede construir.",
    "Separación a linderos": "La distancia mínima que hay que dejar entre el edificio y los límites de la parcela.",
    "Parcela mínima": "El tamaño mínimo que debe tener un terreno para poder construir o dividirlo.",
    "Usos permitidos": "Las actividades que se pueden desarrollar: vivienda, comercio, industria, etc.",
    "Usos prohibidos": "Las actividades que la norma no admite en esta zona.",
    "Nivel de protección": "El grado de protección de un edificio catalogado: integral, parcial o ambiental.",
    "Construcción máxima": "La superficie máxima que se permite construir en este tipo de suelo.",
    "Uso actual": "El uso del inmueble según el Catastro.",
    "Año de construcción": "El año de construcción que figura en el Catastro.",
    "Situación de las obras": "Si las calles, redes y servicios del ámbito están terminados y recibidos por el Ayuntamiento."
  },

  casos: [
    /* ------------------------------------------------------------------ */
    {
      id: "centro",
      icono: "🏠",
      titulo: "Quiero reformar mi casa en el centro",
      persona: "Una vecina con una vivienda de dos plantas junto a la Plaça d'Espanya",
      lugar: "Entorno de la Plaça d'Espanya",
      coords: [38.38621, -0.76490],
      real: { lugar: "OpenStreetMap, vía 43104084 (Ajuntament de Novelda, Plaça d'Espanya)" },
      zoom: 18,
      parcela: [
        ["Superficie de la parcela", "140 m²"],
        ["Superficie construida", "210 m² (planta baja y primera)"],
        ["Uso actual", "Residencial"],
        ["Año de construcción", "1958"]
      ],
      suelo: {
        clase: "Suelo urbano",
        zona: "Casco tradicional",
        explicacion: "Es suelo de ciudad ya construida. Se puede edificar y reformar cumpliendo las reglas de la zona del casco."
      },
      parametros: [
        ["Altura máxima", "3 plantas (10 m)"],
        ["Edificabilidad", "2,5 m² construidos por m² de parcela"],
        ["Fondo edificable", "15 m desde la fachada"],
        ["Ocupación máxima", "100 % en planta baja"],
        ["Usos permitidos", "Vivienda, comercio en planta baja y oficinas"],
        ["Usos prohibidos", "Industria y talleres molestos"]
      ],
      calculo: {
        titulo: "¿Cuánto más se puede construir?",
        pasos: [
          "Máximo permitido: 140 m² × 2,5 = 350 m²",
          "Ya construido: 210 m²",
          "Margen disponible: 350 − 210 = 140 m² (cabe una planta más)"
        ]
      },
      afecciones: [
        { nombre: "Entorno de edificios protegidos", estado: "afecta", detalle: "Está cerca de edificios catalogados del casco. La fachada debe armonizar con su entorno." },
        { nombre: "Área de vigilancia arqueológica", estado: "afecta", detalle: "Si se excava (sótano o cimentación nueva), hace falta control arqueológico." },
        { nombre: "Zona inundable", estado: "no_afecta", detalle: "La parcela queda fuera de las zonas inundables oficiales." },
        { nombre: "Carreteras y servidumbres", estado: "no_afecta", detalle: "No hay carreteras ni servidumbres que limiten esta parcela." }
      ],
      puede: [
        { pregunta: "¿Puedo reformar el interior?", resp: "si", detalle: "Sí. Basta con una declaración responsable si no se toca la estructura." },
        { pregunta: "¿Puedo añadir una planta?", resp: "condiciones", detalle: "Sí, hasta 3 plantas en total, con una fachada que armonice con el entorno protegido." },
        { pregunta: "¿Puedo convertir la planta baja en un comercio?", resp: "si", detalle: "Sí. El comercio en planta baja está permitido en esta zona." },
        { pregunta: "¿Puedo abrir un taller?", resp: "no", detalle: "No. La norma de la zona prohíbe los talleres molestos." }
      ],
      tramites: [
        "Reforma interior sin tocar la estructura: declaración responsable de obra menor.",
        "Nueva planta: licencia de obra mayor con proyecto técnico.",
        "Si hay excavación: control arqueológico previo."
      ]
    },

    /* ------------------------------------------------------------------ */
    {
      id: "industrial",
      icono: "🏭",
      titulo: "Mi empresa quiere ampliar la nave",
      persona: "Un empresario con una nave de 600 m² en el Polígono industrial Santa Fe",
      lugar: "Polígono industrial Santa Fe",
      coords: [38.38492, -0.77646],
      real: { lugar: "OpenStreetMap, vía 43117114 (Polígono industrial Santa Fe)" },
      zoom: 17,
      parcela: [
        ["Superficie de la parcela", "1.200 m²"],
        ["Superficie construida", "600 m² (nave en una planta)"],
        ["Uso actual", "Industrial"],
        ["Año de construcción", "1994"]
      ],
      suelo: {
        clase: "Suelo urbano",
        zona: "Industrial",
        explicacion: "Es una zona ya urbanizada para naves y actividad económica. Se puede ampliar mientras no se pase de lo que permite la parcela."
      },
      parametros: [
        ["Altura máxima", "2 plantas (10 m)"],
        ["Edificabilidad", "1,0 m² construido por m² de parcela"],
        ["Ocupación máxima", "70 % de la parcela"],
        ["Separación a linderos", "5 m a la calle y 3 m al resto de linderos"],
        ["Parcela mínima", "500 m²"],
        ["Usos permitidos", "Industria, almacenes, talleres y oficinas de la propia empresa"],
        ["Usos prohibidos", "Vivienda"]
      ],
      calculo: {
        titulo: "¿Cuánto se puede ampliar?",
        pasos: [
          "Ocupación máxima en planta: 1.200 m² × 70 % = 840 m²",
          "Ya ocupado: 600 m²  →  ampliación en planta: 840 − 600 = 240 m²",
          "Total construible: 1.200 m² × 1,0 = 1.200 m²  →  caben además 360 m² en una entreplanta"
        ]
      },
      afecciones: [
        { nombre: "Colector de saneamiento municipal", estado: "afecta", detalle: "Un colector pasa por el fondo de la parcela: no se puede edificar en una franja de 3 m." },
        { nombre: "Zona inundable", estado: "no_afecta", detalle: "Fuera de las zonas inundables oficiales." },
        { nombre: "Líneas eléctricas de alta tensión", estado: "no_afecta", detalle: "No hay líneas de alta tensión sobre la parcela." },
        { nombre: "Carreteras y servidumbres", estado: "no_afecta", detalle: "La parcela da a calles del polígono, sin carreteras próximas." }
      ],
      puede: [
        { pregunta: "¿Puedo ampliar la nave?", resp: "si", detalle: "Sí, hasta 240 m² más en planta, respetando 3 m libres sobre el colector." },
        { pregunta: "¿Puedo hacer una entreplanta de oficinas?", resp: "si", detalle: "Sí, hasta 360 m², dentro del total construible de la parcela." },
        { pregunta: "¿Puedo dividir la parcela en dos?", resp: "si", detalle: "Sí, porque cada mitad tendría 600 m², por encima de la parcela mínima de 500 m²." },
        { pregunta: "¿Puedo hacer una vivienda en la nave?", resp: "no", detalle: "No. La vivienda está prohibida en la zona industrial." }
      ],
      tramites: [
        "Ampliación: licencia de obra mayor con proyecto técnico.",
        "Si cambia la actividad: licencia o comunicación ambiental, según la actividad."
      ]
    },

    /* ------------------------------------------------------------------ */
    {
      id: "patrimonio",
      icono: "🏛️",
      titulo: "¿Este edificio está protegido?",
      persona: "Una persona interesada en un edificio modernista de la calle Major",
      lugar: "Casa Museo Modernista · Carrer Major, 24",
      coords: [38.38701, -0.76552],
      real: { lugar: "OpenStreetMap, nodo 2318211088 (Casa Museo Modernista)" },
      zoom: 18,
      parcela: [
        ["Superficie de la parcela", "420 m²"],
        ["Superficie construida", "980 m² (planta baja y dos plantas)"],
        ["Uso actual", "Cultural"],
        ["Año de construcción", "1903"]
      ],
      suelo: {
        clase: "Suelo urbano",
        zona: "Casco tradicional · edificio catalogado",
        explicacion: "Es un edificio con valor histórico incluido en el catálogo de protección. Hay que conservarlo y cualquier obra necesita autorización especial."
      },
      parametros: [
        ["Nivel de protección", "Integral: se conserva el edificio completo"],
        ["Altura máxima", "La existente: no se puede aumentar"],
        ["Edificabilidad", "La existente: no se puede ampliar"],
        ["Usos permitidos", "Cultural, museo, vivienda y oficinas"],
        ["Usos prohibidos", "Industria y cualquier uso que obligue a alterar el edificio"]
      ],
      calculo: {
        titulo: "¿Qué obras se admiten?",
        pasos: [
          "Conservación y mantenimiento: sí",
          "Restauración de elementos originales: sí",
          "Ampliación, nuevas plantas o demolición: no"
        ]
      },
      afecciones: [
        { nombre: "Catálogo de bienes protegidos", estado: "afecta", detalle: "Edificio catalogado con protección integral." },
        { nombre: "Área de vigilancia arqueológica", estado: "afecta", detalle: "Cualquier excavación requiere control arqueológico." },
        { nombre: "Zona inundable", estado: "no_afecta", detalle: "Fuera de las zonas inundables oficiales." },
        { nombre: "Carreteras y servidumbres", estado: "no_afecta", detalle: "Sin servidumbres que limiten el inmueble." }
      ],
      puede: [
        { pregunta: "¿Puedo demolerlo?", resp: "no", detalle: "No. La protección integral impide la demolición." },
        { pregunta: "¿Puedo añadir una planta?", resp: "no", detalle: "No. No se puede aumentar ni la altura ni el volumen existentes." },
        { pregunta: "¿Puedo adaptarlo a vivienda u oficinas?", resp: "condiciones", detalle: "Sí, siempre que se conserven fachadas, estructura y elementos interiores protegidos." },
        { pregunta: "¿Puedo restaurar la fachada?", resp: "si", detalle: "Sí, con los materiales y colores originales." }
      ],
      tramites: [
        "Licencia de obra con informe previo sobre los elementos protegidos.",
        "Posibles ayudas a la rehabilitación de patrimonio: consultar convocatorias."
      ]
    },

    /* ------------------------------------------------------------------ */
    {
      id: "rural",
      icono: "🌳",
      titulo: "¿Puedo construir en el campo?",
      persona: "Una familia con un terreno de 15.000 m² cerca del Santuario de la Magdalena",
      lugar: "Entorno del Santuario de la Magdalena",
      coords: [38.40816, -0.79215],
      real: { lugar: "OpenStreetMap, vía 67563821 (Santuario de la Magdalena)" },
      zoom: 16,
      parcela: [
        ["Superficie de la parcela", "15.000 m²"],
        ["Superficie construida", "0 m² (terreno sin construcciones)"],
        ["Uso actual", "Agrario (almendro y olivo)"],
        ["Año de construcción", "No aplica: sin construcciones"]
      ],
      suelo: {
        clase: "Suelo no urbanizable",
        zona: "Protección paisajística",
        explicacion: "Es suelo rural protegido por su valor de paisaje. No es ciudad ni lo será: solo se admiten usos agrícolas y forestales."
      },
      parametros: [
        ["Parcela mínima", "10.000 m² para casetas agrícolas"],
        ["Construcción máxima", "Caseta de aperos de hasta 20 m²"],
        ["Altura máxima", "1 planta (3,5 m)"],
        ["Separación a linderos", "10 m a todos los linderos"],
        ["Usos permitidos", "Agrícola y forestal"],
        ["Usos prohibidos", "Vivienda nueva, industria y almacenes no agrícolas"]
      ],
      calculo: {
        titulo: "¿Cumple para una caseta de aperos?",
        pasos: [
          "Parcela: 15.000 m², mayor que el mínimo de 10.000 m²: cumple",
          "Caseta de 20 m² como máximo, en 1 planta",
          "Separación de 10 m a todos los linderos"
        ]
      },
      afecciones: [
        { nombre: "Protección paisajística", estado: "afecta", detalle: "Las construcciones deben integrarse en el paisaje: materiales y colores tradicionales." },
        { nombre: "Terreno forestal", estado: "afecta", detalle: "Parte de la parcela es terreno forestal: no se puede talar sin autorización." },
        { nombre: "Riesgo de incendio forestal", estado: "afecta", detalle: "Hay que mantener una franja limpia de vegetación alrededor de cualquier construcción." },
        { nombre: "Zona inundable", estado: "no_afecta", detalle: "Terreno en ladera, fuera de las zonas inundables oficiales." }
      ],
      puede: [
        { pregunta: "¿Puedo construir una casa?", resp: "no", detalle: "No. En suelo rural protegido no se admite la vivienda nueva." },
        { pregunta: "¿Puedo hacer una caseta de aperos?", resp: "condiciones", detalle: "Sí, de hasta 20 m², porque la parcela supera los 10.000 m²." },
        { pregunta: "¿Puedo vallar la finca?", resp: "condiciones", detalle: "Sí, con valla diáfana o vegetal que no impida el paso de la fauna." },
        { pregunta: "¿Puedo seguir cultivando?", resp: "si", detalle: "Sí. El uso agrícola es el propio de este suelo." }
      ],
      tramites: [
        "Caseta de aperos: licencia municipal de obra.",
        "Talas o actuaciones en terreno forestal: autorización autonómica."
      ]
    },

    /* ------------------------------------------------------------------ */
    {
      id: "urbanizable",
      icono: "🏗️",
      titulo: "He comprado en una zona nueva: ¿cuándo puedo construir?",
      persona: "Un matrimonio que ha comprado una parcela en un sector residencial en obras",
      lugar: "Sector residencial de ejemplo (borde norte)",
      coords: [38.39330, -0.76380],
      real: null,
      zoom: 17,
      parcela: [
        ["Superficie de la parcela", "300 m²"],
        ["Superficie construida", "0 m² (parcela vacía)"],
        ["Uso actual", "Suelo sin edificar"],
        ["Año de construcción", "No aplica: sin construcciones"]
      ],
      suelo: {
        clase: "Suelo urbanizable",
        zona: "Residencial · vivienda unifamiliar",
        explicacion: "Es suelo que se está convirtiendo en ciudad. Hasta que las calles y los servicios estén terminados y los reciba el Ayuntamiento, todavía no es solar."
      },
      gestion: [
        { hito: "Plan parcial (ordenación del sector)", estado: "hecho", detalle: "Aprobado" },
        { hito: "Programa de actuación (quién urbaniza)", estado: "hecho", detalle: "Aprobado" },
        { hito: "Reparcelación (reparto de parcelas)", estado: "hecho", detalle: "Aprobada e inscrita" },
        { hito: "Proyecto de urbanización", estado: "hecho", detalle: "Aprobado" },
        { hito: "Obras de urbanización", estado: "en_curso", detalle: "En ejecución (80 %)" },
        { hito: "Recepción de las obras por el Ayuntamiento", estado: "pendiente", detalle: "Pendiente" },
        { hito: "Condición de solar", estado: "pendiente", detalle: "Todavía no" }
      ],
      parametros: [
        ["Altura máxima", "2 plantas (7 m)"],
        ["Edificabilidad", "0,8 m² construidos por m² de parcela"],
        ["Ocupación máxima", "50 % de la parcela"],
        ["Separación a linderos", "3 m a la calle y 3 m al fondo"],
        ["Parcela mínima", "250 m²"],
        ["Usos permitidos", "Vivienda unifamiliar"],
        ["Usos prohibidos", "Industria y talleres"]
      ],
      calculo: {
        titulo: "¿Qué casa cabe?",
        pasos: [
          "Total construible: 300 m² × 0,8 = 240 m²",
          "Ocupación en planta: 300 m² × 50 % = 150 m² como máximo",
          "Por ejemplo: 120 m² en planta baja + 120 m² en planta alta = 240 m²"
        ]
      },
      afecciones: [
        { nombre: "Línea eléctrica de media tensión", estado: "afecta", detalle: "Cruza el sector. El proyecto de urbanización prevé enterrarla antes de terminar las obras." },
        { nombre: "Zona inundable", estado: "no_afecta", detalle: "Fuera de las zonas inundables oficiales." },
        { nombre: "Vías pecuarias", estado: "no_afecta", detalle: "No hay vías pecuarias en el sector." },
        { nombre: "Carreteras y servidumbres", estado: "no_afecta", detalle: "El sector no linda con carreteras." }
      ],
      puede: [
        { pregunta: "¿Puedo construir ya?", resp: "condiciones", detalle: "Solo si se pide licencia para edificar a la vez que se urbaniza, con garantía. Si no, hay que esperar a que se reciban las obras." },
        { pregunta: "¿Puedo hacer una casa de dos plantas?", resp: "si", detalle: "Sí, hasta 240 m² en total y 150 m² de ocupación en planta." },
        { pregunta: "¿Puedo dividir la parcela?", resp: "no", detalle: "No: cada parte tendría 150 m², por debajo de la parcela mínima de 250 m²." },
        { pregunta: "¿Puedo vivir en ella antes de que acaben las calles?", resp: "no", detalle: "No: hace falta que la urbanización esté recibida para obtener la licencia de primera ocupación." }
      ],
      tramites: [
        "Licencia de obra mayor con proyecto técnico.",
        "Si se construye antes de recibir las obras: edificación simultánea a la urbanización, con garantía.",
        "Al terminar: licencia de primera ocupación."
      ]
    }
  ]
};
