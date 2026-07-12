#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────
# CuraMain — Redesign 2026-07 LIVE-DEPLOY (Doppelklick im Finder)
#
# Voraussetzung: Merge + Build sind bereits erledigt (Session 50).
# Dieses Skript macht nur noch:
#   1. git push origin main  (GitHub-Backup)
#   2. FTPS-Spiegelung dist/public/ → All-Inkl /curamain.de/
#   3. Live-Verifikation (Asset-Check auf www.curamain.de)
#
# Das FTP-Passwort wird zur Laufzeit abgefragt — NIE gespeichert.
# ─────────────────────────────────────────────────────────────────
set -euo pipefail
export PATH=/opt/homebrew/bin:/opt/homebrew/sbin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin

cd "$(dirname "$0")"
echo ""
echo "  CuraMain Redesign-Deploy — $(date '+%Y-%m-%d %H:%M')"
echo ""

# ── Vorab-Prüfung: richtiger Branch + Build vorhanden ───────────
BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [ "$BRANCH" != "main" ]; then
  echo "FEHLER: Branch ist '$BRANCH', erwartet 'main'. Abbruch."; exit 1
fi
if [ ! -f dist/public/index.html ] || [ ! -f dist/public/.htaccess ] || [ ! -f dist/public/php/contact.php ]; then
  echo "FEHLER: dist/public/ unvollständig (index.html/.htaccess/php fehlen). Erst bauen!"; exit 1
fi
JSREF=$(grep -o 'assets/index-[^"]*\.js' dist/public/index.html | head -1)
echo "  Branch: main ✓   Build: $JSREF ✓"

# ── 1. GitHub-Push ───────────────────────────────────────────────
echo ""
echo "── 1/3 git push origin main ──"
git push origin main
echo "  ✅ gepusht → github.com/AJcsay/pflegedienst-plattform"

# ── 2. FTPS-Deploy ───────────────────────────────────────────────
echo ""
echo "── 2/3 FTPS-Deploy → All-Inkl /curamain.de/ ──"
if ! command -v lftp &>/dev/null; then
  echo "FEHLER: lftp nicht installiert (brew install lftp). Abbruch."; exit 1
fi
cd dist/public
read -r -s -p "  All-Inkl FTP-Passwort für w01e2ff7: " FTP_PASS; echo
lftp -e "
set ftp:ssl-force true
set ftp:ssl-protect-data true
set ftp:passive-mode true
set ssl:verify-certificate no
set net:max-retries 3
set net:timeout 30
open -u 'w01e2ff7,${FTP_PASS}' ftp://w01e2ff7.kasserver.com
mirror --reverse --delete --verbose --exclude-glob '.git*' --exclude-glob 'node_modules/' ./ /curamain.de/
bye
" 2>&1 | tee /tmp/curamain-website-deploy.log
unset FTP_PASS
cd ../..

# ── 3. Live-Verifikation ────────────────────────────────────────
echo ""
echo "── 3/3 Live-Verifikation ──"
sleep 3
HTTP=$(curl -s -o /dev/null -w "%{http_code}" "https://www.curamain.de/$JSREF")
if [ "$HTTP" = "200" ]; then
  echo "  ✅ VERIFY OK — https://www.curamain.de/$JSREF (HTTP 200)"
  echo ""
  echo "  🎉 Redesign ist LIVE: https://www.curamain.de"
  echo "  Tipp: Hard-Reload (Cmd+Shift+R) wegen Service-Worker-Cache."
else
  echo "  ⚠️  VERIFY FEHLGESCHLAGEN (HTTP $HTTP) — Log: /tmp/curamain-website-deploy.log"
fi
echo ""
read -p "Enter drücken zum Beenden..." _
