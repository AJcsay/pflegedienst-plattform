#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────
# CuraMain — Redesign 2026-07 LIVE-DEPLOY v2 (Doppelklick im Finder)
#
# v2 (Reparatur 13.07.): Erst-Deploy übertrug Sandbox-Dateirechte
# (600) → Apache 403 auf allen Dateien. Dieses Skript:
#   1. repariert die Rechte auf dem Server SOFORT (chmod -R 755)
#   2. setzt lokale Rechte auf 644/755 (greift am Mac)
#   3. spiegelt mit --no-perms (Server-Standardrechte, nie wieder 600)
#   4. pusht git + verifiziert live
#
# Das FTP-Passwort wird zur Laufzeit abgefragt — NIE gespeichert.
# ─────────────────────────────────────────────────────────────────
set -euo pipefail
export PATH=/opt/homebrew/bin:/opt/homebrew/sbin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin

cd "$(dirname "$0")"
echo ""
echo "  CuraMain Redesign-Deploy v2 (403-Fix) — $(date '+%Y-%m-%d %H:%M')"
echo ""

# ── Vorab-Prüfung ────────────────────────────────────────────────
BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [ "$BRANCH" != "main" ]; then
  echo "FEHLER: Branch ist '$BRANCH', erwartet 'main'. Abbruch."; exit 1
fi
if [ ! -f dist/public/index.html ] || [ ! -f dist/public/.htaccess ] || [ ! -f dist/public/php/contact.php ]; then
  echo "FEHLER: dist/public/ unvollständig. Abbruch."; exit 1
fi
if ! command -v lftp &>/dev/null; then
  echo "FEHLER: lftp nicht installiert (brew install lftp). Abbruch."; exit 1
fi
JSREF=$(grep -o 'assets/index-[^"]*\.js' dist/public/index.html | head -1)
echo "  Branch: main ✓   Build: $JSREF ✓"

# ── 1. Lokale Dateirechte reparieren (greift am Mac) ────────────
echo ""
echo "── 1/4 Lokale Rechte: Dateien 644, Ordner 755 ──"
find dist/public -type d -exec chmod 755 {} +
find dist/public -type f -exec chmod 644 {} +
OFFEN=$(find dist/public ! -perm -o=r | wc -l | tr -d ' ')
echo "  Nicht world-readable: $OFFEN (sollte 0 sein)"

# ── 2.+3. Server-Reparatur + Spiegelung ─────────────────────────
echo ""
echo "── 2/4 Server-chmod (Sofort-Fix 403) + 3/4 Mirror --no-perms ──"
read -r -s -p "  All-Inkl FTP-Passwort für w01e2ff7: " FTP_PASS; echo
cd dist/public
lftp -e "
set ftp:ssl-force true
set ftp:ssl-protect-data true
set ftp:passive-mode true
set ssl:verify-certificate no
set net:max-retries 3
set net:timeout 30
open -u 'w01e2ff7,${FTP_PASS}' ftp://w01e2ff7.kasserver.com
echo '--- Sofort-Fix: chmod -R 755 /curamain.de ---'
chmod -R 755 /curamain.de
echo '--- Spiegelung (ohne Rechte-Übertragung) ---'
mirror --reverse --delete --verbose --no-perms --exclude-glob '.git*' --exclude-glob 'node_modules/' ./ /curamain.de/
echo '--- Rechte-Nachlauf (neu hochgeladene Dateien) ---'
chmod -R 755 /curamain.de
bye
" 2>&1 | tee /tmp/curamain-website-deploy.log
unset FTP_PASS
cd ../..

# ── 4. GitHub-Push + Live-Verifikation ──────────────────────────
echo ""
echo "── 4/4 git push + Live-Verifikation ──"
git push origin main || echo "  (Push übersprungen/bereits aktuell)"
sleep 3
HTTP_INDEX=$(curl -s -o /dev/null -w "%{http_code}" "https://www.curamain.de/")
HTTP_ASSET=$(curl -s -o /dev/null -w "%{http_code}" "https://www.curamain.de/$JSREF")
echo "  Startseite: HTTP $HTTP_INDEX · Asset: HTTP $HTTP_ASSET"
if [ "$HTTP_INDEX" = "200" ] && [ "$HTTP_ASSET" = "200" ]; then
  echo ""
  echo "  ✅ VERIFY OK — Redesign ist LIVE: https://www.curamain.de"
  echo "  Tipp: Cmd+Shift+R (Service-Worker-Cache)."
else
  echo ""
  echo "  ⚠️  VERIFY WEITER FEHLGESCHLAGEN — Log: /tmp/curamain-website-deploy.log"
  echo "  Bitte die letzten Log-Zeilen an Claude geben."
fi
echo ""
read -p "Enter drücken zum Beenden..." _
