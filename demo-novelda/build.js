// Genera la demo en un único HTML autocontenido, con dos marcas:
//  dist/visor-novelda-ayuntamiento.html -> marca del Ayuntamiento de Novelda (archivo para la presentación; NO se publica como enlace)
//  dist/visor-novelda-demo.html         -> marca UrbanGPT · PeritiaUrbana (documento completo)
//  dist/visor-novelda-web.html          -> marca UrbanGPT, sin <html>/<head>/<body>, para publicar como enlace
// Escudo: si existe marcas/escudo-novelda.png (con autorización del Ayuntamiento), se incrusta en la versión del Ayuntamiento.
const fs = require("fs"), path = require("path");
const r = p => fs.readFileSync(path.join(__dirname, p), "utf8");
const F = [["Fraunces",600,"fraunces-latin-600-normal"],["Fraunces",700,"fraunces-latin-700-normal"],
  ["Inter",400,"inter-latin-400-normal"],["Inter",500,"inter-latin-500-normal"],["Inter",600,"inter-latin-600-normal"],
  ["Inter",700,"inter-latin-700-normal"],["Inter",800,"inter-latin-800-normal"],["JetBrains Mono",500,"jetbrains-mono-latin-500-normal"],
  ["Oswald",400,"oswald-latin-400-normal"],["Oswald",500,"oswald-latin-500-normal"],["Oswald",600,"oswald-latin-600-normal"]];
const fonts = F.map(([f,w,n]) => `@font-face{font-family:"${f}";font-weight:${w};font-style:normal;font-display:swap;src:url(data:font/woff2;base64,${fs.readFileSync(path.join(__dirname,"video/fonts",n+".woff2")).toString("base64")}) format("woff2")}`).join("\n");
const MARCAS = JSON.parse(r("marcas/marcas.json"));
function compila(marca){
  let html = r("src/index.html");
  const m = Object.assign({}, MARCAS[marca]);
  if (m.escudo) { const e = path.join(__dirname, m.escudo); if (fs.existsSync(e)) m.logo = "data:image/png;base64," + fs.readFileSync(e).toString("base64"); delete m.escudo; }
  const parts = { "/*@@FONTS@@*/": fonts, "/*@@THEME@@*/": r(`marcas/${marca}.css`),
                  "/*@@LEAFLET_CSS@@*/": r("vendor/leaflet.css"), "/*@@LEAFLET_JS@@*/": r("vendor/leaflet.js"),
                  "/*@@MARCA_JS@@*/": "window.MARCA=" + JSON.stringify(m) + ";", "/*@@CASOS_JS@@*/": r("src/casos.js") };
  for (const [k, v] of Object.entries(parts)) {
    if (!html.includes(k)) throw new Error("Falta marcador " + k);
    if (/<\/script/i.test(v)) throw new Error("Contenido con </script>: " + k);
    html = html.split(k).join(v);
  }
  if (marca === "novelda") html = html.replace(/<title>[^<]*<\/title>/, "<title>Visor Urbanístico · Ayuntamiento de Novelda (demostración)</title>");
  return html;
}
const out = path.join(__dirname, "dist"); fs.mkdirSync(out, { recursive: true });
const ayto = compila("novelda"), ugpt = compila("urbangpt");
fs.writeFileSync(path.join(out, "visor-novelda-ayuntamiento.html"), ayto);
fs.writeFileSync(path.join(out, "visor-novelda-demo.html"), ugpt);
const cut = (h, a, b) => { const i = h.indexOf(a), j = h.indexOf(b); if (i < 0 || j < 0) throw new Error("marcador " + a); return h.slice(i + a.length, j); };
const web = ugpt.match(/<title>[\s\S]*?<\/title>/)[0] + "\n" + cut(ugpt, "<!--@@HEAD_START@@-->", "<!--@@HEAD_END@@-->") + cut(ugpt, "<!--@@BODY_START@@-->", "<!--@@BODY_END@@-->");
fs.writeFileSync(path.join(out, "visor-novelda-web.html"), web);
console.log("OK ayuntamiento", (ayto.length/1024).toFixed(0)+" KB · urbangpt", (ugpt.length/1024).toFixed(0)+" KB · web", (web.length/1024).toFixed(0)+" KB");
