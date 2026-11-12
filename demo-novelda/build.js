// Genera un único HTML autocontenido: dist/visor-novelda-demo.html
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
fs.mkdirSync(path.join(__dirname, "dist"), { recursive: true });
fs.writeFileSync(path.join(__dirname, "dist/visor-novelda-demo.html"), html);
console.log("OK", (html.length / 1024).toFixed(0) + " KB");
