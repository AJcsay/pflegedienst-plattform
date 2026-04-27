# CuraMain – Webseite

Statische React-Seite (Vite + Tailwind) für [curamain.de](https://www.curamain.de).
Deployment-Ziel: All-Inkl Premium (Webspace + 2 PHP-Endpunkte).

## Stack

- **Frontend:** React 19 + Vite 7 + TypeScript + Tailwind 4
- **Routing:** wouter (SPA)
- **Daten:** statische JSON-Files in `client/src/data/`
- **Backend:** 2 PHP-Skripte für Kontaktformular (`/api/contact.php`) + Bewerbung (`/api/bewerbung.php`)
- **Termine:** Zeeg-Embed (DSGVO, Server in Deutschland)
- **Bewertungen:** Google Reviews via Trustindex-Widget
- **Hosting:** All-Inkl Premium (statisch + PHP)

## Lokale Entwicklung

```bash
npm install
npm run dev          # http://localhost:5173
```

In der lokalen Entwicklung sind die PHP-Endpunkte natürlich nicht erreichbar.
`client/src/lib/api.ts` erkennt `import.meta.env.DEV` und tut, als wäre die
Anfrage erfolgreich (loggt aber nach `console.info`).

### Build & Preview

```bash
npm run check        # tsc --noEmit
npm run build        # → dist/public/
npm run preview      # serviert dist/public/ statisch
```

## Deployment

### Voraussetzungen vor dem ersten Live-Gang

- Domain `curamain.de` zeigt auf den All-Inkl-Webspace
- Email-Postfächer angelegt: `info@`, `bewerbung@`, `partner@`, `no-reply@curamain.de`
- E-Mail-Versand auf All-Inkl getestet (PHP `mail()` aktiv)
- Lokale Bilder vorhanden (siehe unten "Bilder migrieren")
- Impressum-Platzhalter gefüllt (HRB, USt-ID)
- Optional: Zeeg-URL und Trustindex-Widget-ID in `.env`

### Verzeichnisstruktur auf All-Inkl

```
htdocs/
├── index.html              ← aus dist/public/
├── assets/                 ← aus dist/public/assets/ (gehashed, immutable)
├── img/                    ← aus client/public/img/  (siehe unten)
├── dokumente/              ← Partner-Downloads (manuell hochladen)
├── .htaccess               ← aus htdocs.htaccess (umbenennen)
├── api/
│   ├── contact.php
│   ├── bewerbung.php
│   └── .htaccess           ← aus php/.htaccess
└── uploads/
    └── bewerbungen/
        └── .htaccess       ← aus php/uploads.htaccess (umbenennen)
```

### Manueller Erst-Deploy

1. `bash scripts/download-images.sh` ausführen → Bilder landen in `client/public/img/`
2. `npm run build`
3. Per FileZilla / SFTP folgendes nach All-Inkl hochladen:
   - Inhalt von `dist/public/` → `/htdocs/`
   - `htdocs.htaccess` → `/htdocs/.htaccess`
   - Inhalt von `php/` → `/htdocs/api/`
   - `php/uploads.htaccess` → `/htdocs/uploads/.htaccess` (Verzeichnis vorher anlegen)

### Auto-Deploy (GitHub-Actions)

`.github/workflows/deploy.yml` ist vorbereitet, aber **standardmäßig
deaktiviert** (nur `workflow_dispatch`).

Aktivierung:
1. Secrets im Repo setzen: `ALLINKL_HOST`, `ALLINKL_USER`, `ALLINKL_PASS`
2. In `deploy.yml` den `push:`-Trigger einkommentieren
3. Erstes Mal manuell „Run workflow" auslösen, um zu prüfen

## Bilder migrieren

Die Manus-Cloudfront-URLs werden im Code nicht mehr verwendet. Lade die
Originalbilder einmalig herunter:

```bash
bash scripts/download-images.sh
```

Optional PNG → WebP konvertieren (kleinere Dateien). Anweisung am Ende des
Skripts.

## Inhalte pflegen

| Datei                                | Zweck                                     |
| ------------------------------------ | ----------------------------------------- |
| `client/src/data/jobs.json`          | Stellenangebote (Karriere-Seite + Bewerbung) |
| `client/src/data/documents.json`     | Partner-Dokumente (PDFs in `/dokumente/`) |
| `client/src/data/faq.json`           | FAQ-Inhalte                               |
| `client/src/pages/Impressum.tsx`     | Impressum (vor Live-Gang anpassen!)       |

Änderung → commit → push. Bei aktiviertem Auto-Deploy wird sofort live.

## Build-Output-Größe (Stand Migration)

Nach Manus-Cleanup: ~135 kB gzipped JS, ~20 kB gzipped CSS.
