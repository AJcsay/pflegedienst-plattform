#!/usr/bin/env bash
# CuraMain – einmaliges Herunterladen der Bilder von Manus-Cloudfront
# nach client/public/img/. Danach zeigen alle Pages auf /img/* statt
# auf das CDN.
#
# Usage:
#   bash scripts/download-images.sh
#
# Voraussetzung: curl im Pfad (auf macOS standardmäßig vorhanden).

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
TARGET="$ROOT/client/public/img"
mkdir -p "$TARGET"

CDN="https://d2xsxph8kpxj0f.cloudfront.net/310519663332473442/mPPhYwgpPecz3rTTMqZjFL"

declare -a FILES=(
  "hero.webp|hero-curamain-divers-7GKuGkPHamMonJ8tCN8dGE.webp"
  "behandlung.png|1_9zKTC85ulmJR4icRxmoTKa_1775907769962_na1fn_L2hvbWUvdWJ1bnR1L2N1cmFtYWluX2hvbWVfY2FyZQ_fd828362.png"
  "grundpflege.png|2_esuW4iLvagCFvHzAcbgNnR_1775907775672_na1fn_L2hvbWUvdWJ1bnR1L2N1cmFtYWluX2h5Z2llbmVfY2FyZQ_2291c2b0.png"
  "hauswirtschaft.png|3_z4iDfgYKlmKcvbqciG51t0_1775907776363_na1fn_L2hvbWUvdWJ1bnR1L2N1cmFtYWluX21lYWxfc2NlbmU_7fdf52ba.png"
  "beratung.png|4_SG8iDwrqiXZmnc07OoDVj2_1775907777133_na1fn_L2hvbWUvdWJ1bnR1L2N1cmFtYWluX2NhcmVfcGxhbg_a3923d20.png"
  "team.png|5_FpU4S7YbAhdIMgbPUTpABc_1775907771125_na1fn_L2hvbWUvdWJ1bnR1L2N1cmFtYWluX3RlYW0_38e8983c.png"
  "aktivierung.png|6_W8qvxUqAE3QNKZBqGnHTOj_1775907774556_na1fn_L2hvbWUvdWJ1bnR1L2N1cmFtYWluX3dlYnNpdGVfaW1hZ2U_f0d00ede.png"
  "palliativ.png|0_sjWBvfaeQIkjOPDNBmSidr_1775907774674_na1fn_L2hvbWUvdWJ1bnR1L2N1cmFtYWluX2hlcm9faW1hZ2U_a946dfec.png"
  "logo.png|CuraMain_Logo_optimized_7f0d04db.png"
)

for entry in "${FILES[@]}"; do
  local_name="${entry%%|*}"
  remote_name="${entry##*|}"
  echo "→ $local_name"
  curl -fsSL "$CDN/$remote_name" -o "$TARGET/$local_name"
done

echo ""
echo "Fertig. Bilder liegen in $TARGET"
echo ""
echo "Optional: PNG → WebP (kleinere Dateien). Voraussetzung: cwebp (brew install webp)."
echo "  for f in $TARGET/*.png; do cwebp -q 85 \"\$f\" -o \"\${f%.png}.webp\" && rm \"\$f\"; done"
echo ""
echo "Wenn Du auf .webp umstellst, Pages anpassen: in client/src/pages/{Home,Leistungen,UeberUns}.tsx"
echo "  /img/team.png  → /img/team.webp  usw."
