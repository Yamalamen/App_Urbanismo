// Genera los informes PDF de los 5 casos de la demo (formato A4) para valorar forma y formato.
// Uso: node tools/informes_pdf.js   ->  dist/informes/*.pdf
const fs = require("fs"), path = require("path"), vm = require("vm");
const { chromium } = require("playwright");
const B = path.join(__dirname, ".."), r = p => fs.readFileSync(path.join(B, p));
const ctx = { window: {} }; vm.runInNewContext(r("src/casos.js").toString(), ctx); const D = ctx.window.NOVELDA_DEMO;
const orto = JSON.parse(r("assets/orto/orto.json"));
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const font = (f, w, n) => `@font-face{font-family:"${f}";font-weight:${w};src:url(data:font/woff2;base64,${r("video/fonts/" + n + ".woff2").toString("base64")}) format("woff2")}`;
const E = { afecta: "Le afecta", no_afecta: "No le afecta", si: "Sí", no: "No", condiciones: "Con condiciones", hecho: "Hecho", en_curso: "En curso", pendiente: "Pendiente" };
const F_NORMA = `${D.instrumento.nombre} (artículo de la norma de zona)`, F_CAT = "Sede Electrónica del Catastro", F_AFE = "Cartografía oficial del organismo competente";
const hoy = new Date().toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric" });
const CSS = `
${font("Oswald",400,"oswald-latin-400-normal")}${font("Oswald",500,"oswald-latin-500-normal")}${font("Inter",400,"inter-latin-400-normal")}${font("Inter",600,"inter-latin-600-normal")}${font("Inter",700,"inter-latin-700-normal")}${font("JetBrains Mono",500,"jetbrains-mono-latin-500-normal")}
@page{size:A4;margin:16mm 15mm 18mm}
*{box-sizing:border-box} body{margin:0;font-family:Inter,sans-serif;font-size:9.6pt;line-height:1.42;color:#1d2417}
.informe{page-break-after:always} .informe:last-child{page-break-after:auto}
.cab{display:flex;align-items:center;gap:10px;border-bottom:2.5pt solid #617852;padding-bottom:8px}
.sello{width:34px;height:34px;border-radius:50%;background:#617852;color:#fff;display:grid;place-items:center;font-family:Oswald;font-weight:500;font-size:15pt}
.cab b{font-family:Oswald;font-weight:500;font-size:13pt;display:block;line-height:1.1}.cab small{color:#59634f;font-size:8pt}
.ref{margin-left:auto;text-align:right;font-family:"JetBrains Mono";font-size:7.4pt;color:#59634f;line-height:1.5}
.eyebrow{font-family:"JetBrains Mono";font-size:7.2pt;letter-spacing:.16em;text-transform:uppercase;color:#216073;margin-top:14px}
h1{font-family:Oswald;font-weight:500;font-size:21pt;margin:2px 0 2px;line-height:1.15}
.sub{color:#59634f;margin-bottom:10px}
.dos{display:grid;grid-template-columns:1fr 1fr;gap:12px;align-items:start}
.foto{position:relative;border-radius:8px;overflow:hidden;border:1pt solid #dfe6d3;aspect-ratio:1/0.78}
.foto img{position:absolute;left:50%;top:50%;width:200%;transform:translate(-50%,-50%)}
.foto .pin{position:absolute;left:50%;top:50%;width:16px;height:16px;margin:-8px 0 0 -8px;border-radius:50%;background:#c4562c;border:3px solid #fff;box-shadow:0 0 0 1.5px #c4562c}
.foto .pie{position:absolute;left:0;right:0;bottom:0;background:rgba(255,255,255,.88);font-size:6.6pt;padding:2px 6px;color:#333}
.resumen{background:#eef5db;border-radius:8px;padding:11px 13px}
.resumen .t{font-family:Oswald;font-weight:500;font-size:14pt;line-height:1.15}.resumen p{margin:5px 0 0}
.claves{display:grid;gap:5px;margin-top:9px}
.clave{display:flex;justify-content:space-between;gap:8px;align-items:center;background:#fff;border:1pt solid #dfe6d3;border-radius:6px;padding:5px 8px;font-size:8.8pt}
h2{font-family:Oswald;font-weight:500;font-size:11.5pt;margin:15px 0 4px;color:#46593a;break-after:avoid;border-bottom:1pt solid #dfe6d3;padding-bottom:2px}
h2 span{font-family:"JetBrains Mono";font-size:8pt;color:#216073;margin-right:6px}
table{width:100%;border-collapse:collapse;font-size:8.8pt} tr{break-inside:avoid}
th{font-family:"JetBrains Mono";font-weight:500;font-size:6.6pt;letter-spacing:.12em;text-transform:uppercase;color:#59634f;text-align:left;padding:4px 5px;border-bottom:1pt solid #dfe6d3}
td{padding:5px;border-bottom:.6pt solid #e7ecdd;vertical-align:top} td.k{color:#59634f;width:27%} td.f{color:#59634f;font-size:7.4pt;width:30%} td.v{font-weight:600}
.chip{display:inline-block;border-radius:99px;padding:1px 8px;font-weight:700;font-size:8pt;white-space:nowrap}
.si,.no_afecta,.hecho{background:#e1f2e7;color:#237a49}.no,.afecta{background:#fbe5e2;color:#b3372b}.condiciones,.en_curso{background:#fdf1d3;color:#9a6700}.pendiente{background:#e7ecdd;color:#59634f}
.ej{font-family:"JetBrains Mono";font-size:6.2pt;background:#fff1cc;color:#7a5300;border-radius:3px;padding:1px 4px;margin-left:4px;vertical-align:middle;white-space:nowrap}
.real{background:#e0f2e6;color:#1d6a3a}
.calc{font-family:"JetBrains Mono";font-size:8.4pt;background:#1d2417;color:#eef5db;border-radius:8px;padding:9px 12px;break-inside:avoid;margin-top:4px}
.calc b{font-family:Inter;display:block;color:#b9d79a;font-size:8pt;letter-spacing:.06em;text-transform:uppercase;margin-bottom:3px}
ul{margin:4px 0;padding-left:16px}
.sec{break-inside:avoid}
.aviso{margin-top:14px;border:1pt solid #c4562c;border-radius:8px;padding:8px 11px;font-size:8pt;break-inside:avoid}
.aviso b{color:#c4562c}
.marca{position:fixed;left:0;right:0;top:42%;text-align:center;font-family:Oswald;font-weight:500;font-size:92pt;color:#c4562c;opacity:.07;transform:rotate(-28deg);pointer-events:none;letter-spacing:.06em}
`;
const ej = '<span class="ej">EJEMPLO</span>', real = '<span class="ej real">DATO REAL</span>';
const chip = e => `<span class="chip ${e}">${E[e]}</span>`;
function informe(c, i) {
  const src = "data:image/jpeg;base64," + r("assets/orto/" + c.id + ".jpg").toString("base64");
  const nAf = c.afecciones.filter(a => a.estado === "afecta").length;
  const fila = (k, v, f) => `<tr><td class="k">${esc(k)}</td><td class="v">${v}</td><td class="f">${esc(f)}</td></tr>`;
  let n = 0; const h2 = t => `${n ? '</div>' : ''}<div class="sec"><h2><span>${++n}</span>${t}</h2>`;
  return `<section class="informe">
  <div class="cab"><div class="sello">N</div><div><b>Ayuntamiento de Novelda</b><small>Visor Urbanístico · Informe urbanístico orientativo</small></div>
    <div class="ref">Ref. DEMO-NOV-${String(i + 1).padStart(3, "0")}<br>Emitido el ${hoy}<br>Documento de demostración</div></div>
  <div class="eyebrow">Informe de parcela · ejemplo ${i + 1} de ${D.casos.length}</div>
  <h1>${esc(c.lugar)}</h1>
  <div class="sub">Consulta: «${esc(c.titulo)}» · ${esc(c.persona)}</div>
  <div class="dos">
    <div class="foto"><img src="${src}" alt=""><div class="pin"></div><div class="pie">Ortofoto PNOA © Instituto Geográfico Nacional · descargada el ${orto.descargado.split("-").reverse().join("/")}</div></div>
    <div><div class="resumen"><div class="eyebrow" style="margin:0">Resumen</div><div class="t">${esc(c.suelo.clase)} · ${esc(c.suelo.zona)} ${ej}</div><p>${esc(c.suelo.explicacion)}</p></div>
      <div class="claves">${c.puede.map(q => `<div class="clave"><span>${esc(q.pregunta)}</span>${chip(q.resp)}</div>`).join("")}
        <div class="clave"><span>Afecciones que le afectan</span><b>${nAf} de ${c.afecciones.length}</b></div></div></div>
  </div>
  ${h2("Identificación de la parcela")}
  <table><tr><th>Dato</th><th>Valor</th><th>Fuente en el visor definitivo</th></tr>
    <tr><td class="k">Ubicación</td><td class="v">${esc(c.lugar)} ${c.real ? real : ej}<br><span style="font-weight:400;font-family:'JetBrains Mono';font-size:7.6pt">${c.coords[0].toFixed(5)}, ${c.coords[1].toFixed(5)} (WGS84)</span></td><td class="f">${c.real ? esc(c.real.lugar) : "Ubicación ilustrativa: no corresponde a un sector real"}</td></tr>
    ${c.parcela.map(p => fila(p[0], esc(p[1]) + ej, F_CAT)).join("")}</table>
  ${h2("Clasificación y calificación del suelo")}
  <table><tr><th>Dato</th><th>Valor</th><th>Fuente en el visor definitivo</th></tr>
    ${fila("Clase de suelo", esc(c.suelo.clase) + ej, F_NORMA)}${fila("Zona", esc(c.suelo.zona) + ej, F_NORMA)}
    ${fila("Planeamiento vigente", esc(D.instrumento.nombre) + real, D.instrumento.detalle)}</table>
  ${c.gestion ? h2("Estado de desarrollo del sector") + `<table><tr><th>Hito</th><th>Estado</th><th>Detalle</th></tr>${c.gestion.map(g => `<tr><td class="k" style="width:50%">${esc(g.hito)}</td><td>${chip(g.estado)}${ej}</td><td class="f">${esc(g.detalle)}</td></tr>`).join("")}</table><p style="font-size:8pt;color:#59634f;margin:4px 0 0">Cada hito se comprueba por separado: un plan aprobado no implica obras terminadas ni condición de solar.</p>` : ""}
  ${h2("Afecciones")}
  <table><tr><th>Afección</th><th>Resultado</th><th>Detalle</th></tr>
    ${c.afecciones.map(a => `<tr><td class="k">${esc(a.nombre)}</td><td style="white-space:nowrap">${chip(a.estado)}${ej}</td><td>${esc(a.detalle)}</td></tr>`).join("")}</table>
  <p style="font-size:8pt;color:#59634f;margin:4px 0 0">Fuente en el visor definitivo: ${F_AFE.toLowerCase()}, cruzada con la geometría de la parcela. «No le afecta» solo se emite cuando el cruce se ha ejecutado sobre fuente suficiente; lo no comprobado figura como «pendiente».</p>
  ${h2("Qué se puede hacer")}
  <table><tr><th>Pregunta</th><th>Respuesta</th><th>Explicación</th></tr>
    ${c.puede.map(q => `<tr><td class="k">${esc(q.pregunta)}</td><td style="white-space:nowrap">${chip(q.resp)}${ej}</td><td>${esc(q.detalle)}</td></tr>`).join("")}</table>
  <div class="calc"><b>${esc(c.calculo.titulo)} · valores de ejemplo</b>${c.calculo.pasos.map(esc).join("<br>")}</div>
  ${h2("Parámetros urbanísticos aplicables")}
  <table><tr><th>Parámetro</th><th>Valor</th><th>Fuente en el visor definitivo</th></tr>${c.parametros.map(p => fila(p[0], esc(p[1]) + ej, F_NORMA)).join("")}</table>
  ${h2("Trámite orientativo")}<ul>${c.tramites.map(t => `<li>${esc(t)} ${ej}</li>`).join("")}</ul>
  </div><div class="aviso"><b>Documento de demostración, sin validez.</b> Los valores marcados como EJEMPLO son ilustrativos y no proceden del planeamiento de Novelda; los marcados como DATO REAL tienen la fuente indicada. En el servicio definitivo, cada dato citará documento, artículo y fecha. Este informe es orientativo y no sustituye a la cédula urbanística, la licencia ni los certificados municipales.</div>
</section>`;
}
(async () => {
  const out = path.join(B, "dist/informes"); fs.mkdirSync(out, { recursive: true });
  const b = await chromium.launch();
  const pdf = async (html, file) => { const p = await b.newPage(); await p.setContent(`<!doctype html><html lang="es"><head><meta charset="utf-8"><style>${CSS}</style></head><body><div class="marca">EJEMPLO</div>${html}</body></html>`); await p.evaluate(() => document.fonts.ready);
    await p.pdf({ path: path.join(out, file), format: "A4", printBackground: true, preferCSSPageSize: true, displayHeaderFooter: true, headerTemplate: "<span></span>",
      footerTemplate: `<div style="width:100%;font-size:7px;color:#59634f;padding:0 15mm;display:flex;justify-content:space-between;font-family:sans-serif"><span>Visor Urbanístico de Novelda · UrbanGPT · PeritiaUrbana · Demostración: datos urbanísticos de ejemplo</span><span>Página <span class="pageNumber"></span> de <span class="totalPages"></span></span></div>` });
    await p.close(); console.log("OK", file); };
  for (let i = 0; i < D.casos.length; i++) await pdf(informe(D.casos[i], i), `informe-${i + 1}-${D.casos[i].id}.pdf`);
  await pdf(D.casos.map(informe).join(""), "informes-demo-novelda.pdf");
  await b.close();
})();
