#!/usr/bin/env bash
# Une el vídeo mudo con la banda sonora, normalizada a -16 LUFS (redes y presentaciones), y genera los subtítulos .srt.
# Uso: ./mux.sh video.mp4 mezcla.wav informe.json salida.mp4
set -euo pipefail
ffmpeg -y -v error -i "$1" -i "$2" -map 0:v -map 1:a -c:v copy -af "loudnorm=I=-16:TP=-1.5:LRA=11" -ar 48000 -c:a aac -b:a 192k -shortest -movflags +faststart "$4"
python3 - "$3" "${4%.mp4}.srt" <<'PY'
import json,sys
d=json.load(open(sys.argv[1],encoding="utf-8")); f=lambda s:"%02d:%02d:%02d,%03d"%(s//3600,s%3600//60,int(s%60),round((s-int(s))*1000))
open(sys.argv[2],"w",encoding="utf-8").write("\n".join(f"{i}\n{f(x['inicio_s'])} --> {f(x['inicio_s']+x['dur_s'])}\n{x['texto']}\n" for i,x in enumerate(d,1)))
PY
echo "OK $4"
