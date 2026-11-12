#!/usr/bin/env bash
# Empaqueta el kit del vídeo en dist/kit-video-visor-urbanistico.zip
set -euo pipefail
cd "$(dirname "$0")"
T=$(mktemp -d); K="$T/kit-video-visor-urbanistico"; mkdir -p "$K/06_video_referencia/fotogramas" "$K/07_capturas_demo" "$K/08_demo_interactiva"
cp zip-src/00_LEEME.md zip-src/03_IDENTIDAD_DE_MARCA.md zip-src/04_CASOS_DE_EJEMPLO.md zip-src/05_REGLAS_DE_VERACIDAD.md "$K/"
cp PROMPT_LOVABLE_VIDEO.md "$K/01_PROMPT_LOVABLE_VIDEO.md"; cp GUION.md "$K/02_GUION_PRESENTACION.md"
cp video/dist/video-novelda-final.mp4 "$K/06_video_referencia/video-novelda.mp4"; cp video/dist/video-generico-final.mp4 "$K/06_video_referencia/video-generico.mp4"
cp video/dist/video-novelda-final.srt "$K/06_video_referencia/video-novelda.srt"; cp video/dist/video-generico-final.srt "$K/06_video_referencia/video-generico.srt"
cp zip-src/09_AUDIO_Y_LICENCIAS.md "$K/"
cp video/dist/fotogramas/*.jpg "$K/06_video_referencia/fotogramas/" 2>/dev/null || true
cp zip-src/07_capturas_demo/*.png "$K/07_capturas_demo/"; cp dist/visor-novelda-demo.html "$K/08_demo_interactiva/"
rm -f dist/kit-video-visor-urbanistico.zip; (cd "$T" && zip -qr -9 - kit-video-visor-urbanistico) > dist/kit-video-visor-urbanistico.zip
rm -rf "$T"; unzip -l dist/kit-video-visor-urbanistico.zip | tail -n +1
