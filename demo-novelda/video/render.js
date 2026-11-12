// Renderiza dist/video.html fotograma a fotograma y lo codifica en H.264.
// Uso: node render.js [municipio] [fps] [salida.mp4] [--stills]
const { chromium } = require("playwright"); const { spawn } = require("child_process"); const path = require("path"), fs = require("fs");
(async () => {
  const muni = process.argv[2] || "Novelda", fps = +(process.argv[3] || 30);
  const out = process.argv[4] || path.join(__dirname, "dist", `video-${muni.toLowerCase().replace(/\s+/g,"-")}.mp4`);
  const stills = process.argv.includes("--stills");
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
  const errs = []; p.on("pageerror", e => errs.push(e.message));
  await p.goto("file://" + path.join(__dirname, "dist/video.html") + "?manual=1&municipio=" + encodeURIComponent(muni));
  await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(300);
  const total = await p.evaluate(() => window.VIDEO_TOTAL), N = Math.round(total * fps);
  const ff = spawn("ffmpeg", ["-y","-loglevel","error","-f","image2pipe","-framerate",String(fps),"-c:v","mjpeg","-i","-",
    "-c:v","libx264","-preset","medium","-crf","18","-pix_fmt","yuv420p","-movflags","+faststart",out], { stdio: ["pipe","inherit","inherit"] });
  const stillAt = stills ? new Set([2.5,8.5,15,22.5,30,40.5,51.5,58,67.5,77,83].map(s => Math.round(s*fps))) : new Set();
  for (let i = 0; i <= N; i++) {
    await p.evaluate(t => window.render(t), i / fps);
    const buf = await p.screenshot({ type: "jpeg", quality: 92 });
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once("drain", r));
    if (stillAt.has(i)) { fs.mkdirSync(path.join(__dirname,"dist/fotogramas"),{recursive:true}); fs.writeFileSync(path.join(__dirname,"dist/fotogramas",`escena-${String([...stillAt].indexOf(i)+1).padStart(2,"0")}.jpg`), buf); }
    if (i % 300 === 0) console.log(`fotograma ${i}/${N}`);
  }
  ff.stdin.end(); await new Promise(r => ff.on("close", r)); await b.close();
  console.log("OK", out, errs.length ? "ERRORES: " + errs.join(" | ") : "sin errores");
})();
