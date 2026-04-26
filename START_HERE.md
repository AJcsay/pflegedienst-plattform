# 🚀 Claude Code Setup - Pflegedienst Plattform

**Willkommen!** Dieses Paket enthält die komplette Pflegedienst Plattform mit allen Dokumentationen für Claude Code.

---

## 📋 Was ist in diesem Paket?

```
pflegedienst-plattform/
├── 📖 DOKUMENTATION (Lese diese zuerst!)
│   ├── START_HERE.md (dieses Dokument)
│   ├── QUICK_START_CLAUDE.md (5-Minuten Überblick)
│   ├── CLAUDE_CODE_GUIDE.md (Ausführliche Anleitung)
│   ├── API_REFERENCE.md (Alle tRPC-Prozeduren)
│   ├── DATABASE_SCHEMA.md (Datenbank-Struktur)
│   └── todo.md (Projekt-Tracking)
│
├── 💻 QUELLCODE
│   ├── client/ (React Frontend)
│   ├── server/ (Express Backend + tRPC)
│   ├── drizzle/ (Datenbank-Schema)
│   ├── shared/ (Gemeinsame Types)
│   ├── package.json (Dependencies)
│   ├── tsconfig.json (TypeScript Config)
│   └── vite.config.ts (Vite Config)
```

---

## ⚡ Quick Start (3 Schritte)

### Schritt 1: Diesen Ordner in Claude Code öffnen
```
1. Öffne Claude Code (https://claude.ai)
2. Klick "Add Project" oder "Open Folder"
3. Wähle diesen "pflegedienst-plattform" Ordner
4. Claude Code analysiert automatisch die Struktur
```

### Schritt 2: Lese die Dokumentation
```
1. START_HERE.md (du liest gerade)
2. QUICK_START_CLAUDE.md (5 Minuten)
3. CLAUDE_CODE_GUIDE.md (Details)
```

### Schritt 3: Starte eine Anfrage
```
"Ich möchte die Admin-Page für Reminder Management 
unter /admin/reminders implementieren mit:
- Tabelle aller Reminders
- Status-Filter
- Statistiken
- Stornierungsfunktion"
```

---

## 🏗️ Projektarchitektur

```
Frontend (React 19 + Tailwind 4)
    ↓ (tRPC Client)
Backend (Express 4 + tRPC 11)
    ↓ (Drizzle ORM)
Database (SQLite/TiDB)
```

### Wichtigste Dateien

| Datei | Zweck | Bearbeiten? |
|-------|-------|-----------|
| `server/routers.ts` | API-Prozeduren | ✅ Ja |
| `server/db.ts` | Datenbankqueries | ✅ Ja |
| `client/src/pages/` | Page-Komponenten | ✅ Ja |
| `client/src/components/` | UI-Komponenten | ✅ Ja |
| `drizzle/schema.ts` | Datenbank-Schema | ✅ Ja |
| `server/_core/` | Framework-Plumbing | ❌ Nein |

---

## 📚 Dokumentation Übersicht

### 1. QUICK_START_CLAUDE.md
- 5-Minuten Setup
- Häufige Anfragen mit Vorlagen
- Debugging-Tipps
- Pro-Tips

### 2. CLAUDE_CODE_GUIDE.md
- GitHub-Integration (optional)
- Projektstruktur-Erklärung
- Workflow-Dokumentation
- Best Practices
- Sicherheit & Fehlerbehandlung

### 3. API_REFERENCE.md
- Alle tRPC-Prozeduren dokumentiert
- Input/Output Schemas
- Verwendungsbeispiele
- Error Handling
- Optimistic Updates

### 4. DATABASE_SCHEMA.md
- Alle 8 Datenbanktabellen
- Schemas und Indizes
- Beziehungen (Relationships)
- Query-Beispiele
- Advanced Queries

### 5. todo.md
- Projekt-Status
- Abgeschlossene Features
- Offene Tasks
- Bugs & Improvements

---

## 🎯 Häufige Anfragen an Claude Code

### Admin UI für Reminders
```
"Erstelle eine neue Admin-Page für Reminder Management:
- Route: /admin/reminders
- Tabelle mit allen Reminders (appointmentId, type, status, date)
- Status-Filter (pending, sent, failed, cancelled)
- Aktion zum Stornieren
- Statistiken oben (total, pending, sent, failed)
- Nutze DashboardLayout und shadcn/ui Table"
```

### Public Survey Page
```
"Erstelle die Public Survey Page unter /survey/:token:
- Wenn Survey nicht gefunden: Error-Seite
- Wenn bereits eingereicht: Danke-Seite
- Feedback-Form mit:
  * Gesamtbewertung (1-5 Sterne)
  * Bewertungen pro Kriterium (Qualität, Professionalität, Kommunikation)
  * Text-Feld für Kommentare
  * Checkbox 'Würde ich weiterempfehlen'
- Responsive Design
- 5+ Unit Tests"
```

### Feedback Analytics
```
"Erstelle Admin-Page für Feedback Analytics:
- Durchschnittliche Bewertung (große Anzeige)
- Bewertungen pro Kriterium (Chart)
- Trend-Daten (Chart über Zeit)
- Empfehlungsrate (%)
- CSV-Export-Button
- Nutze Recharts für Charts"
```

---

## 🔄 Workflow mit Claude Code

```
1. Öffne diesen Ordner in Claude Code
   ↓
2. Stelle eine spezifische Anfrage
   ↓
3. Claude Code generiert Code
   ↓
4. Review die Änderungen
   ↓
5. Lade die Dateien herunter
   ↓
6. Pushe zu GitHub/Manus
   ↓
7. Deploye die Änderungen
```

---

## 💡 Pro-Tipps für Claude Code

### 1. Sei spezifisch
❌ "Verbessere die Feedback-Page"
✅ "Füge eine Tabelle mit allen Feedback-Einträgen hinzu, sortiert nach Datum, mit Pagination"

### 2. Referenziere bestehenden Code
```
"Nutze das Pattern aus client/src/pages/AdminCampaigns.tsx 
für die neue Reminder-Management-Page"
```

### 3. Definiere Akzeptanzkriterien
```
"Die neue Page sollte:
- [ ] Alle Reminders in einer Tabelle anzeigen
- [ ] Status-Filter ermöglichen
- [ ] Reminders stornierbar machen
- [ ] 10+ Unit Tests haben
- [ ] Responsive auf Mobile sein"
```

### 4. Nutze die Dokumentation
```
"Schreibe einen neuen Email-Template nach dem Pattern 
in server/email-templates/appointment-reminder.html"
```

### 5. Iteriere
Wenn Claude nicht perfekt ist, gib Feedback und frag erneut:
```
"Das ist gut, aber:
1. Ändere die Tabellen-Spalten zu [...]
2. Nutze stattdessen die Button-Komponente von shadcn/ui
3. Füge Loading-States hinzu"
```

---

## 🔐 Wichtige Sicherheitshinweise

### Authentifizierung
- Nutze `protectedProcedure` für Admin-Features
- Nutze `publicProcedure` nur für öffentliche Daten
- `ctx.user` ist immer verfügbar in `protectedProcedure`

### Validierung
```typescript
// Immer Zod für Input-Validierung nutzen
export const myProcedure = protectedProcedure
  .input(z.object({
    email: z.string().email(),
    rating: z.number().min(1).max(5),
  }))
  .mutation(async ({ input }) => {
    // input ist jetzt type-safe
  });
```

### Fehlerbehandlung
```typescript
import { TRPCError } from "@trpc/server";

throw new TRPCError({
  code: "UNAUTHORIZED",
  message: "Only admins can do this",
});
```

---

## 📞 Debugging & Support

### Logs anschauen
```bash
# Dev Server Logs
tail -f .manus-logs/devserver.log

# Browser Console Logs
tail -f .manus-logs/browserConsole.log

# Network Requests
tail -f .manus-logs/networkRequests.log
```

### Tests ausführen
```bash
# Alle Tests
pnpm test

# Nur einen Test
pnpm test appointment-reminder.test.ts

# Watch Mode
pnpm test --watch
```

### TypeScript Fehler überprüfen
```bash
pnpm tsc --noEmit
```

---

## 📊 Aktuelle Projekt-Status

✅ **Backend (100% Complete)**
- Appointment Reminders mit Email-Integration
- Feedback Surveys mit automatischem Trigger
- Background Job Scheduler (15-Minuten-Cadence)
- Email-Templates (HTML)
- 160/160 Unit Tests bestanden

⏳ **Frontend (Zu implementieren)**
- Admin UI für Reminder Management
- Public Survey Page (/survey/:token)
- Feedback Analytics Dashboard
- Feedback Form Component

---

## 🚀 Nächste Schritte

1. **Öffne diesen Ordner in Claude Code**
   - https://claude.ai → Claude Code
   - Add Project → Wähle diesen Ordner

2. **Lese QUICK_START_CLAUDE.md**
   - 5-Minuten Überblick
   - Häufige Anfragen

3. **Starte deine erste Anfrage**
   - Nutze die Vorlagen oben
   - Sei spezifisch
   - Referenziere bestehenden Code

4. **Arbeite iterativ**
   - Claude generiert Code
   - Du reviewst
   - Du gibst Feedback
   - Claude verbessert

---

## 📖 Weitere Ressourcen

- **tRPC Docs:** https://trpc.io
- **Drizzle ORM:** https://orm.drizzle.team
- **Shadcn/ui:** https://ui.shadcn.com
- **Tailwind CSS 4:** https://tailwindcss.com
- **Vitest:** https://vitest.dev
- **React 19:** https://react.dev

---

## ❓ Häufig gestellte Fragen

**F: Kann ich bestehenden Code ändern?**
A: Ja! Nutze `server/routers.ts`, `server/db.ts`, `client/src/pages/`, etc. Ändere nicht `server/_core/`.

**F: Wie füge ich neue Datenbanktabellen hinzu?**
A: Bearbeite `drizzle/schema.ts`, dann führe `pnpm db:push` aus.

**F: Wie schreibe ich Tests?**
A: Erstelle `server/feature.test.ts` mit Vitest. Siehe `server/appointment-reminder.test.ts` als Beispiel.

**F: Wie deploye ich Änderungen?**
A: Pushe zu GitHub, dann deploye über Manus Management UI.

**F: Was ist wenn Claude Code einen Fehler macht?**
A: Gib Feedback und frag erneut. Claude lernt aus deinem Feedback.

---

## 🎉 Du bist bereit!

Öffne Claude Code und starte deine erste Anfrage. Die Dokumentation hat alles, was Claude Code braucht, um die Plattform zu verstehen und unterstützend weiterzuentwickeln.

**Viel Erfolg! 🚀**

---

**Letzte Aktualisierung:** April 2026
**Version:** 1.0.0
**Status:** Production Ready
