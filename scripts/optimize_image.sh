#!/usr/bin/env bash
# Make web-ready versions of a photo: NAME-800.webp, NAME-1600.webp, NAME-2400.webp and a NAME.jpg fallback.
# Usage: scripts/optimize_image.sh path/to/source.png name
set -euo pipefail
src="$1"; name="$2"
out="$(cd "$(dirname "$0")/.." && pwd)/assets/img"
for w in 800 1600 2400; do
  convert "$src" -auto-orient -strip -resize "${w}x>" -quality 78 -define webp:method=6 "$out/$name-$w.webp"
done
convert "$src" -auto-orient -strip -resize "1600x>" -quality 80 -interlace Plane "$out/$name.jpg"
ls -la "$out/$name"*
