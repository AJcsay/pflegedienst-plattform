# Claude Code Integration Guide - Pflegedienst Plattform

Dieses Dokument zeigt dir, wie du die Pflegedienst Plattform mit Claude Code oder anderen AI-Tools weiter verbessern kannst.

---

## 🎯 Schnelle Übersicht

Die Plattform ist **vollständig dokumentiert** und **produktionsreif strukturiert**. Du kannst Claude Code direkt mit deinem Projekt verbinden und es weiterentwickeln.

### Aktuelle Architektur
```
Frontend (React 19 + Tailwind 4)
    ↓
tRPC Client (Type-safe API)
    ↓
Backend (Express 4 + tRPC 11)
    ↓
Database (SQLite/TiDB + Drizzle ORM)
```

---

## 📋 Methode 1: GitHub Repository (Empfohlen)

### Schritt 1: Code zu GitHub exportieren
1. Öffne die **Management UI** → **More (⋯)** → **GitHub**
2. Wähle deinen GitHub-Account und Repo-Namen
3. Klick "Export" → Code wird zu GitHub gepusht

### Schritt 2: Mit Claude Code öffnen
1. Gehe zu [Claude.ai](https://claude.ai)
2. Öffne **Claude Code** (Beta)
3. Klick "Add Repository"
4. Paste dein GitHub-Repo-Link
5. Claude hat jetzt **vollständigen Zugriff** auf deinen Code

### Schritt 3: Anfragen an Claude stellen
```
"Implementiere die Admin UI für Reminder Management"
"Erstelle die Public Survey Page unter /survey/:token"
"Schreibe Unit Tests für die neue Feedback-Analytics"
```

**Vorteile:**
- ✅ Vollständige Codebase-Analyse
- ✅ Kontextuelle Verbesserungen
- ✅ Konsistente Architektur
- ✅ Automatische Tests

---

## 📋 Methode 2: Direkter Code-Export (Für lokale Bearbeitung)

### Schritt 1: Code herunterladen
1. Management UI → **More (⋯)** → **Download as ZIP**
2. Entpacke die ZIP-Datei lokal

### Schritt 2: Mit Claude Code arbeiten
1. Öffne Claude Code
2. Drag-and-Drop deine Projektordner
3. Claude analysiert die Struktur automatisch

### Schritt 3: Änderungen zurück hochladen
1. Claude generiert die modifizierten Dateien
2. Lade sie lokal herunter
3. Pushe sie zu GitHub oder Manus

---

## 🏗️ Projektstruktur für Claude Code

Claude Code versteht diese Struktur automatisch:

```
pflegedienst-plattform/
├── client/                    # React Frontend
│   ├── src/
│   │   ├── pages/            # Page-level components
│   │   ├── components/       # Reusable UI components
│   │   ├── hooks/            # Custom React hooks
│   │   ├── lib/trpc.ts       # tRPC client setup
│   │   └── App.tsx           # Routes & layout
│   └── index.html
├── server/                    # Express Backend
│   ├── routers.ts            # tRPC procedures (API contracts)
│   ├── db.ts                 # Database query helpers
│   ├── email-service.ts      # Email sending
│   ├── appointment-reminder-service.ts
│   ├── feedback-survey-service.ts
│   ├── appointment-reminder-scheduler.ts
│   ├── email-templates/      # HTML email templates
│   ├── _core/                # Framework plumbing (don't edit)
│   └── *.test.ts             # Unit tests (Vitest)
├── drizzle/
│   └── schema.ts             # Database tables & types
├── shared/                   # Shared constants & types
├── package.json
├── vite.config.ts
├── tsconfig.json
└── todo.md                   # Project tracking
```

**Wichtig:** Nur diese Dateien bearbeiten:
- ✅ `client/src/pages/*` - Neue Pages
- ✅ `client/src/components/*` - Neue UI-Komponenten
- ✅ `server/routers.ts` - Neue API-Prozeduren
- ✅ `server/db.ts` - Neue Query-Helper
- ✅ `server/*.ts` (nicht `_core/`) - Services & Jobs
- ✅ `drizzle/schema.ts` - Neue Datenbank-Tabellen
- ✅ `server/*.test.ts` - Tests

**Nicht bearbeiten:**
- ❌ `server/_core/*` - Framework-Plumbing
- ❌ `vite.config.ts` - Vite-Konfiguration
- ❌ `package.json` - Dependencies (nur wenn nötig)

---

## 🔧 Häufige Anfragen an Claude Code

### 1. Frontend-Features hinzufügen

**Anfrage:**
```
"Erstelle eine neue Admin-Page für Reminder Management unter 
/admin/reminders mit:
- Tabelle aller Reminders (mit Pagination)
- Status-Filter (pending, sent, failed)
- Aktion zum Stornieren von Reminders
- Statistiken (gesamt, versendet, fehlgeschlagen)

Nutze die bestehende DashboardLayout und shadcn/ui Komponenten."
```

**Claude wird:**
1. ✅ Neue Page unter `client/src/pages/AdminReminders.tsx` erstellen
2. ✅ tRPC-Hooks für Daten-Fetching nutzen
3. ✅ Shadcn/ui Table-Komponente verwenden
4. ✅ Route in `App.tsx` registrieren
5. ✅ Styling mit Tailwind 4 anwenden

### 2. Backend-Prozeduren erweitern

**Anfrage:**
```
"Füge eine neue tRPC-Prozedur hinzu:
reminders.reschedule - Erlaubt Admins, Reminders zu verschieben

Input: { reminderId: string, newScheduledAt: Date }
Output: { success: boolean, message: string }

Nutze die bestehende Struktur in server/routers.ts"
```

**Claude wird:**
1. ✅ Neue Prozedur in `server/routers.ts` hinzufügen
2. ✅ Validierung mit Zod hinzufügen
3. ✅ Datenbankupdate durchführen
4. ✅ Error-Handling implementieren

### 3. Tests schreiben

**Anfrage:**
```
"Schreibe Unit Tests für die neue reschedule-Funktion.
Teste:
- Erfolgreiche Umplanung
- Fehler bei ungültiger ID
- Fehler bei Termin in der Vergangenheit
- Datenbankupdate-Verifikation"
```

**Claude wird:**
1. ✅ Test-Datei unter `server/reminders.reschedule.test.ts` erstellen
2. ✅ Vitest-Syntax verwenden
3. ✅ Alle Edge-Cases abdecken
4. ✅ Datenbank-Cleanup durchführen

### 4. Datenbank-Schema erweitern

**Anfrage:**
```
"Füge eine neue Tabelle 'appointmentNotes' hinzu:
- id (primary key)
- appointmentId (foreign key)
- adminId (foreign key zu users)
- content (text)
- createdAt
- updatedAt

Generiere die Migration mit pnpm db:push"
```

**Claude wird:**
1. ✅ Tabelle in `drizzle/schema.ts` definieren
2. ✅ Beziehungen (relations) einrichten
3. ✅ Migration durchführen
4. ✅ Query-Helper in `server/db.ts` hinzufügen

---

## 📚 Wichtige Dokumentation für Claude

Teile diese Infos mit Claude, wenn du spezifische Features brauchst:

### tRPC-Struktur
```typescript
// Beispiel: Neue Prozedur
export const appRouter = router({
  reminders: router({
    list: adminProcedure
      .input(z.object({ limit: z.number().optional() }))
      .query(async ({ input, ctx }) => {
        // ctx.user ist automatisch verfügbar
        // Nutze getDb() für Datenbankzugriff
      }),
  }),
});
```

### Frontend-Hooks
```typescript
// Daten fetchen
const { data, isLoading } = trpc.reminders.list.useQuery({});

// Daten mutieren (mit optimistic updates)
const mutation = trpc.reminders.reschedule.useMutation({
  onMutate: (newData) => {
    // Optimistic update
  },
  onError: () => {
    // Rollback
  },
});
```

### Email-Templates
Alle Email-Templates sind HTML-Dateien unter `server/email-templates/`:
- `appointment-confirmation.html`
- `appointment-reminder.html`
- `feedback-survey.html`

Nutze `{{variableName}}` für Platzhalter.

### Datenbank-Queries
```typescript
// Beispiel aus server/db.ts
export async function getAppointmentReminders(appointmentId: number) {
  const db = await getDb();
  return db
    .select()
    .from(appointmentReminders)
    .where(eq(appointmentReminders.appointmentId, appointmentId));
}
```

---

## 🚀 Workflow mit Claude Code

### Schritt 1: Anforderung definieren
```
"Ich möchte eine Feedback-Analytics-Page für Admins.
Sie sollte zeigen:
- Durchschnittliche Bewertung (1-5 Sterne)
- Bewertungen pro Kriterium (Qualität, Professionalität, Kommunikation)
- Charts mit Trend-Daten
- Exportfunktion (CSV)"
```

### Schritt 2: Claude generiert Code
Claude wird:
1. Neue Page unter `client/src/pages/AdminFeedbackAnalytics.tsx`
2. Neue tRPC-Prozedur `feedback.analyticsData`
3. Charts mit Plotly/Recharts
4. CSV-Export-Funktion
5. Tests für neue Prozeduren

### Schritt 3: Code reviewen
- Überprüfe die Struktur
- Teste lokal (wenn möglich)
- Gib Feedback an Claude

### Schritt 4: Zu GitHub pushen
```bash
git add .
git commit -m "Add feedback analytics dashboard"
git push
```

### Schritt 5: Zu Manus deployen
1. Management UI → **Preview**
2. Teste die neue Page
3. Klick "Publish" wenn alles funktioniert

---

## 📝 Best Practices für Claude Code

### 1. Sei spezifisch
❌ "Verbessere die Feedback-Page"
✅ "Füge eine Tabelle mit allen Feedback-Einträgen hinzu, sortiert nach Datum, mit Pagination (20 pro Seite)"

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
in server/email-templates/appointment-confirmation.html"
```

---

## 🔐 Sicherheit & Best Practices

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

## 📞 Support & Debugging

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

## 🎓 Beispiel-Anfrage an Claude Code

```
"Ich möchte die Public Survey Page unter /survey/:token implementieren.

Anforderungen:
1. Route: /survey/:token
2. Wenn Survey nicht gefunden: Error-Seite anzeigen
3. Wenn Survey bereits eingereicht: Danke-Seite anzeigen
4. Feedback-Form mit:
   - Gesamtbewertung (1-5 Sterne)
   - Bewertungen pro Kriterium (Qualität, Professionalität, Kommunikation)
   - Text-Feld für Kommentare
   - Checkbox 'Würde ich weiterempfehlen'
   - Submit-Button
5. Validierung: Alle Felder erforderlich außer Kommentare
6. Nach Submit: Danke-Seite mit Bestätigung
7. Responsive Design (Mobile-first)
8. Nutze shadcn/ui Komponenten
9. Schreibe 5+ Unit Tests

Referenz-Pages:
- client/src/pages/Home.tsx für Layout-Pattern
- client/src/components/DashboardLayout.tsx für Styling"
```

Claude wird dann:
1. ✅ Neue Page erstellen
2. ✅ tRPC-Hook für Daten-Fetching nutzen
3. ✅ Form mit Validierung implementieren
4. ✅ Tests schreiben
5. ✅ Responsive Design sicherstellen

---

## 🎯 Nächste Schritte

1. **Exportiere zu GitHub** (Methode 1 oben)
2. **Öffne Claude Code** und verbinde dein Repo
3. **Definiere deine nächste Anforderung** (z.B. Admin UI für Reminders)
4. **Lass Claude Code generieren**
5. **Review & Test lokal**
6. **Pushe zu GitHub**
7. **Deploye zu Manus**

---

## 📖 Zusätzliche Ressourcen

- **tRPC Docs:** https://trpc.io
- **Drizzle ORM:** https://orm.drizzle.team
- **Shadcn/ui:** https://ui.shadcn.com
- **Tailwind CSS 4:** https://tailwindcss.com
- **Vitest:** https://vitest.dev

---

**Viel Erfolg bei der Weiterentwicklung! 🚀**
