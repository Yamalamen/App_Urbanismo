// Genera:
//  dist/visor-novelda-demo.html  -> documento completo autocontenido (abrir con doble clic)
//  dist/visor-novelda-web.html   -> misma página sin <html>/<head>/<body>, para publicar como enlace
const fs = require("fs"), path = require("path");
const r = p => fs.readFileSync(path.join(__dirname, p), "utf8");
let html = r("src/index.html");
const parts = { "/*@@LEAFLET_CSS@@*/": r("vendor/leaflet.css"),
                "/*@@LEAFLET_JS@@*/": r("vendor/leaflet.js"),
                "/*@@CASOS_JS@@*/": r("src/casos.js") };
for (const [k, v] of Object.entries(parts)) {
  if (!html.includes(k)) throw new Error("Falta marcador " + k);
  if (/<\/script/i.test(v)) throw new Error("Contenido con </script>: " + k);
  html = html.split(k).join(v);
}
const out = path.join(__dirname, "dist");
fs.mkdirSync(out, { recursive: true });
fs.writeFileSync(path.join(out, "visor-novelda-demo.html"), html);
const cut = (a, b) => { const i = html.indexOf(a), j = html.indexOf(b); if (i < 0 || j < 0) throw new Error("marcador " + a); return html.slice(i + a.length, j); };
const title = html.match(/<title>[\s\S]*?<\/title>/)[0];
const web = title + "\n" + cut("<!--@@HEAD_START@@-->", "<!--@@HEAD_END@@-->") + cut("<!--@@BODY_START@@-->", "<!--@@BODY_END@@-->");
fs.writeFileSync(path.join(out, "visor-novelda-web.html"), web);
console.log("OK demo", (html.length / 1024).toFixed(0) + " KB · web", (web.length / 1024).toFixed(0) + " KB");
