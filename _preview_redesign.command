#!/bin/zsh
# ─────────────────────────────────────────────────────────────
# CuraMain — Redesign 2026-07 VORSCHAU (kein Deployment!)
# Doppelklick: startet den lokalen Dev-Server auf dem Branch
# redesign-2026-07 und öffnet die Seite im Browser.
# Beenden: Ctrl+C im Terminal-Fenster.
# ─────────────────────────────────────────────────────────────
set -e
cd "$(dirname "$0")"

echo "── CuraMain Redesign-Vorschau ──────────────────────────"
AKTUELL=$(git rev-parse --abbrev-ref HEAD)
echo "Aktueller Branch: $AKTUELL"

if [ "$AKTUELL" != "redesign-2026-07" ]; then
  echo "Wechsle auf Branch redesign-2026-07 …"
  git checkout redesign-2026-07
fi

echo ""
echo "Starte Vorschau-Server (http://localhost:5173) …"
echo "WICHTIG: Das ist NUR eine lokale Vorschau — curamain.de bleibt unverändert."
echo ""
npm run dev -- --open
