#!/bin/bash
# Records every Dutch text of Leren.be with the Flemish macOS voice "Ellen" (nl_BE)
# and writes audio/nl/<hash>.m4a + audio/nl/manifest.json.
#
# Run on a Mac, from the repo folder:   bash tools/make-audio.sh
# First install the voice once: System Settings → Accessibility → Spoken Content →
#   System voice → Manage Voices… → Dutch (Belgium) → Ellen.
set -e
cd "$(dirname "$0")/.."
VOICE="${VOICE:-Ellen}"     # VOICE=Xander bash tools/make-audio.sh  → Dutch (Netherlands)
RATE="${RATE:-150}"         # words per minute; 150 = calm, clear pace for beginners
OUT=audio/nl
if ! say -v '?' | grep -q "^$VOICE "; then
  echo "Voice \"$VOICE\" is not installed. Install it in System Settings → Accessibility → Spoken Content → Manage Voices… (Dutch)."; exit 1
fi
total=$(wc -l < "$OUT/texts.tsv" | tr -d ' '); n=0
while IFS=$'\t' read -r h t; do
  n=$((n+1)); [ -z "$h" ] && continue
  if [ ! -s "$OUT/$h.m4a" ]; then
    say -v "$VOICE" -r "$RATE" -o "/tmp/leren-$h.aiff" -- "$t"
    afconvert -f m4af -d aac -b 48000 "/tmp/leren-$h.aiff" "$OUT/$h.m4a"
    rm -f "/tmp/leren-$h.aiff"
  fi
  printf "\r%d / %d" "$n" "$total"
done < "$OUT/texts.tsv"
echo
# manifest = list of hashes that have a file
( printf "["; first=1
  for f in "$OUT"/*.m4a; do b=$(basename "$f" .m4a); if [ $first = 1 ]; then first=0; else printf ","; fi; printf '"%s"' "$b"; done
  printf "]\n" ) > "$OUT/manifest.json"
echo "Done: $(ls "$OUT"/*.m4a | wc -l | tr -d ' ') files. Now upload the audio/nl folder to GitHub."
