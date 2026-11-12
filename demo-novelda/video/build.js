// Incrusta las tipografías (OFL) en el HTML del vídeo -> dist/video.html (autocontenido)
const fs = require("fs"), path = require("path");
const F = [["Fraunces",600,"fraunces-latin-600-normal"],["Fraunces",700,"fraunces-latin-700-normal"],
  ["Inter",400,"inter-latin-400-normal"],["Inter",500,"inter-latin-500-normal"],["Inter",600,"inter-latin-600-normal"],
  ["Inter",700,"inter-latin-700-normal"],["Inter",800,"inter-latin-800-normal"],["JetBrains Mono",500,"jetbrains-mono-latin-500-normal"]];
const css = F.map(([f,w,n]) => `@font-face{font-family:"${f}";font-weight:${w};font-style:normal;font-display:block;src:url(data:font/woff2;base64,${fs.readFileSync(path.join(__dirname,"fonts",n+".woff2")).toString("base64")}) format("woff2")}`).join("\n");
let html = fs.readFileSync(path.join(__dirname,"src/video.html"),"utf8");
if(!html.includes("/*@@FONTS@@*/")) throw new Error("marcador");
html = html.replace("/*@@FONTS@@*/", () => css);
fs.mkdirSync(path.join(__dirname,"dist"),{recursive:true});
fs.writeFileSync(path.join(__dirname,"dist/video.html"), html);
const cut=(a,b)=>html.slice(html.indexOf(a)+a.length, html.indexOf(b));
fs.writeFileSync(path.join(__dirname,"dist/video-web.html"), html.match(/<title>[\s\S]*?<\/title>/)[0]+"\n"+cut("<!--@@HEAD_START@@-->","<!--@@HEAD_END@@-->")+cut("<!--@@BODY_START@@-->","<!--@@BODY_END@@-->"));
console.log("OK", (html.length/1024).toFixed(0)+" KB");
