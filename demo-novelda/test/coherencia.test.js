// Comprueba que los valores de ejemplo son urbanísticamente coherentes entre sí.
// Ejecutar: node test/coherencia.test.js
const fs = require("fs"), path = require("path"), vm = require("vm");
const ctx = { window: {} }; vm.runInNewContext(fs.readFileSync(path.join(__dirname, "../src/casos.js"), "utf8"), ctx);
const D = ctx.window.NOVELDA_DEMO; let fallos = 0, checks = 0;
const ok = (c, msg) => { checks++; if (!c) { fallos++; console.log("FAIL", msg); } };
const num = s => parseFloat(String(s).replace(/\./g, "").replace(",", "."));
const get = (pares, k) => (pares.find(p => p[0] === k) || [])[1];
ok(D.casos.length === 5, "Debe haber 5 ejemplos");
const ESTADOS_AF = ["afecta", "no_afecta"], RESP = ["si", "no", "condiciones"];
for (const c of D.casos) {
  const id = c.id;
  for (const k of ["id","icono","titulo","persona","lugar","coords","parcela","suelo","parametros","calculo","afecciones","puede","tramites"])
    ok(c[k] !== undefined && c[k] !== "" && c[k] !== null, `${id}: campo ${k} vacío`);
  for (const k of ["Superficie de la parcela","Superficie construida","Uso actual","Año de construcción"]) ok(get(c.parcela, k), `${id}: falta ${k}`);
  ok(c.coords[0] > 38.34 && c.coords[0] < 38.45 && c.coords[1] > -0.87 && c.coords[1] < -0.72, `${id}: coordenadas fuera de Novelda`);
  ok(c.afecciones.length >= 3 && c.afecciones.every(a => ESTADOS_AF.includes(a.estado) && a.detalle), `${id}: afecciones incompletas`);
  ok(c.puede.length >= 3 && c.puede.every(q => RESP.includes(q.resp) && q.detalle), `${id}: respuestas incompletas`);
  ok(c.parametros.every(p => p[1]), `${id}: parámetro vacío`);
  const sup = num(get(c.parcela, "Superficie de la parcela")), cons = num(get(c.parcela, "Superficie construida"));
  const edif = num(get(c.parametros, "Edificabilidad")), ocu = num(get(c.parametros, "Ocupación máxima"));
  if (edif > 0) ok(cons <= sup * edif + 1e-6, `${id}: lo construido supera la edificabilidad`);
  const pmin = num(get(c.parametros, "Parcela mínima")); if (pmin > 0) ok(sup >= pmin, `${id}: parcela menor que la mínima`);
  const permit = (get(c.parametros, "Usos permitidos") || "").toLowerCase(), prohib = (get(c.parametros, "Usos prohibidos") || "").toLowerCase();
  for (const u of ["vivienda", "industria", "comercio", "oficinas"]) ok(!(new RegExp("\\b" + u + "\\b").test(permit) && new RegExp("^" + u + "\\b|, " + u + "\\b").test(prohib)), `${id}: '${u}' permitido y prohibido a la vez`);
  const casa = c.puede.find(q => /construir una casa|vivienda en la nave/i.test(q.pregunta));
  if (c.suelo.clase === "Suelo urbano") ok(!c.puede.some(q => /reformar|ampliar|planta baja/i.test(q.pregunta) && q.resp === "no"), `${id}: en suelo urbano se niega una obra ordinaria`);
  if (c.suelo.clase === "Suelo no urbanizable") { ok(casa && casa.resp === "no", `${id}: SNU protegido no puede admitir vivienda nueva`); ok(/vivienda/.test(prohib), `${id}: SNU debe prohibir vivienda`); }
  if (c.suelo.clase === "Suelo urbanizable") {
    ok(Array.isArray(c.gestion), `${id}: urbanizable sin cadena de gestión`);
    const rec = c.gestion.find(g => /Recepción/.test(g.hito)), solar = c.gestion.find(g => /solar/.test(g.hito));
    ok(!(solar.estado === "hecho" && rec.estado !== "hecho"), `${id}: solar sin recepción de obras`);
    const ya = c.puede.find(q => /construir ya/i.test(q.pregunta)); ok(ya && ya.resp !== "si", `${id}: no puede decir que se construye ya sin solar`);
  }
  if (/vivienda/.test(prohib)) ok(!c.puede.some(q => /vivienda|casa/i.test(q.pregunta) && q.resp === "si"), `${id}: vivienda prohibida pero respondida como sí`);
  if (/Protección integral|Integral/.test(get(c.parametros, "Nivel de protección") || "")) ok(c.puede.find(q => /demoler/i.test(q.pregunta)).resp === "no", `${id}: integral no admite demolición`);
}
// Cálculos explícitos de ejemplo
const ind = D.casos.find(c => c.id === "industrial"); ok(1200 * 0.7 - 600 === 240 && 1200 * 1.0 - 840 === 360, "industrial: cálculo");
const cen = D.casos.find(c => c.id === "centro"); ok(140 * 2.5 - 210 === 140, "centro: cálculo");
const urb = D.casos.find(c => c.id === "urbanizable"); ok(300 * 0.8 === 240 && 300 * 0.5 === 150 && 120 <= 150, "urbanizable: cálculo");
console.log(`${checks - fallos}/${checks} comprobaciones OK`); process.exit(fallos ? 1 : 0);
