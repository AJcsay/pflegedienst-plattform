# Claude Code Project Index

Dieser Index hilft Claude Code, die Plattform-Struktur schnell zu verstehen.

---

## 📂 Projektstruktur

```
pflegedienst-plattform/
│
├── 📖 DOKUMENTATION
│   ├── START_HERE.md ⭐ LESE ZUERST
│   ├── QUICK_START_CLAUDE.md (5 Min Überblick)
│   ├── CLAUDE_CODE_GUIDE.md (Ausführliche Anleitung)
│   ├── API_REFERENCE.md (Alle API-Prozeduren)
│   ├── DATABASE_SCHEMA.md (Datenbank-Struktur)
│   ├── CLAUDE_CODE_INDEX.md (dieses Dokument)
│   └── todo.md (Projekt-Status)
│
├── 💻 FRONTEND (React 19 + Tailwind 4)
│   └── client/
│       ├── src/
│       │   ├── pages/ ⭐ NEUE PAGES HIER
│       │   │   ├── Home.tsx (Landing Page)
│       │   │   ├── AdminDashboard.tsx (Admin Home)
│       │   │   ├── AdminCampaigns.tsx (Email-Kampagnen)
│       │   │   ├── AdminAppointments.tsx (Termine)
│       │   │   ├── AdminUsers.tsx (Benutzer)
│       │   │   ├── AdminSettings.tsx (Einstellungen)
│       │   │   └── [NEUE PAGES HIER]
│       │   ├── components/ ⭐ UI-KOMPONENTEN
│       │   │   ├── DashboardLayout.tsx (Admin Layout)
│       │   │   ├── AIChatBox.tsx (Chat Interface)
│       │   │   ├── Map.tsx (Google Maps)
│       │   │   └── ui/ (shadcn/ui Komponenten)
│       │   ├── hooks/ (Custom React Hooks)
│       │   ├── contexts/ (React Contexts)
│       │   ├── lib/
│       │   │   └── trpc.ts (tRPC Client Setup)
│       │   ├── App.tsx (Routes & Layout)
│       │   ├── main.tsx (React Entry Point)
│       │   └── index.css (Global Styles)
│       ├── public/
│       │   ├── favicon.ico
│       │   └── robots.txt
│       └── index.html
│
├── 🔧 BACKEND (Express 4 + tRPC 11)
│   └── server/
│       ├── routers.ts ⭐ NEUE API-PROZEDUREN HIER
│       │   ├── appointments (Termine)
│       │   ├── campaigns (Email-Kampagnen)
│       │   ├── reminders (Erinnerungen)
│       │   ├── feedback (Feedback-Umfragen)
│       │   ├── adminUsers (Admin-Benutzer)
│       │   ├── auth (Authentifizierung)
│       │   └── system (System-Funktionen)
│       │
│       ├── db.ts ⭐ NEUE QUERY-HELPER HIER
│       │   ├── getAppointments()
│       │   ├── getCampaigns()
│       │   ├── getReminders()
│       │   ├── getFeedback()
│       │   └── [NEUE QUERIES HIER]
│       │
│       ├── email-service.ts ⭐ EMAIL-FUNKTIONEN
│       │   ├── sendAppointmentConfirmation()
│       │   ├── sendAppointmentReminder24h()
│       │   ├── sendAppointmentReminder1h()
│       │   └── sendFeedbackSurveyEmail()
│       │
│       ├── appointment-reminder-service.ts
│       │   ├── generateAppointmentReminders()
│       │   ├── sendPendingReminders()
│       │   ├── cancelReminder()
│       │   └── getReminderStats()
│       │
│       ├── feedback-survey-service.ts
│       │   ├── createFeedbackSurvey()
│       │   ├── submitFeedback()
│       │   ├── getFeedbackStats()
│       │   └── getAverageCriteriaRating()
│       │
│       ├── appointment-reminder-scheduler.ts
│       │   ├── startAppointmentReminderScheduler()
│       │   ├── stopAppointmentReminderScheduler()
│       │   └── getReminderSchedulerStatus()
│       │
│       ├── campaign-scheduler-job.ts
│       │   ├── startCampaignScheduler()
│       │   └── stopCampaignScheduler()
│       │
│       ├── email-templates/ ⭐ EMAIL-TEMPLATES
│       │   ├── appointment-confirmation.html
│       │   ├── appointment-reminder.html
│       │   ├── feedback-survey.html
│       │   └── [NEUE TEMPLATES HIER]
│       │
│       ├── *.test.ts ⭐ UNIT TESTS
│       │   ├── appointment-reminder.test.ts
│       │   ├── feedback-survey.test.ts
│       │   ├── auth.logout.test.ts
│       │   ├── admin-users.test.ts
│       │   ├── campaigns.test.ts
│       │   ├── email-service.test.ts
│       │   ├── password-reset.test.ts
│       │   └── [NEUE TESTS HIER]
│       │
│       ├── _core/ ❌ NICHT BEARBEITEN
│       │   ├── index.ts (Server Startup)
│       │   ├── context.ts (tRPC Context)
│       │   ├── oauth.ts (OAuth Integration)
│       │   ├── vite.ts (Vite Setup)
│       │   ├── env.ts (Environment Variables)
│       │   ├── llm.ts (LLM Integration)
│       │   ├── voiceTranscription.ts
│       │   ├── imageGeneration.ts
│       │   ├── map.ts (Maps Integration)
│       │   └── notification.ts (Owner Notifications)
│       │
│       └── tracking-routes.ts (Email Tracking)
│
├── 🗄️ DATABASE (Drizzle ORM)
│   └── drizzle/
│       ├── schema.ts ⭐ DATENBANK-SCHEMA
│       │   ├── users
│       │   ├── appointments
│       │   ├── emailCampaigns
│       │   ├── campaignRecipients
│       │   ├── emailTracking
│       │   ├── appointmentReminders
│       │   ├── appointmentFeedback
│       │   ├── adminUsers
│       │   └── [NEUE TABELLEN HIER]
│       │
│       └── migrations/ (Auto-generated)
│
├── 📦 SHARED
│   └── shared/
│       ├── constants.ts (Gemeinsame Konstanten)
│       └── types.ts (Gemeinsame Types)
│
├── ⚙️ KONFIGURATION
│   ├── package.json (Dependencies)
│   ├── tsconfig.json (TypeScript Config)
│   ├── vite.config.ts (Vite Config)
│   └── vitest.config.ts (Vitest Config)
│
└── 📋 PROJEKTMANAGEMENT
    ├── todo.md (Projekt-Status)
    └── CLAUDE_CODE_INDEX.md (dieses Dokument)
```

---

## 🎯 Häufige Aufgaben & Wo Sie Implementiert Werden

### Neue Admin-Page hinzufügen
1. Erstelle `client/src/pages/AdminNewFeature.tsx`
2. Importiere in `client/src/App.tsx` und registriere Route
3. Nutze `DashboardLayout` für Konsistenz
4. Nutze `trpc.feature.useQuery()` für Daten

### Neue API-Prozedur hinzufügen
1. Definiere in `server/routers.ts`
2. Nutze `protectedProcedure` oder `publicProcedure`
3. Validiere Input mit Zod
4. Nutze Query-Helper aus `server/db.ts`
5. Schreibe Tests in `server/feature.test.ts`

### Neue Datenbanktabelle hinzufügen
1. Definiere in `drizzle/schema.ts`
2. Führe `pnpm db:push` aus
3. Erstelle Query-Helper in `server/db.ts`
4. Nutze in tRPC-Prozeduren

### Neue Email-Template hinzufügen
1. Erstelle `server/email-templates/feature.html`
2. Nutze `{{variableName}}` für Platzhalter
3. Erstelle Funktion in `server/email-service.ts`
4. Nutze in Services/Procedures

### Neue Tests schreiben
1. Erstelle `server/feature.test.ts`
2. Nutze Vitest Syntax
3. Teste alle Edge-Cases
4. Führe `pnpm test` aus

---

## 🔗 Wichtige Beziehungen

### Frontend → Backend
```
React Component (client/src/pages/)
    ↓ (tRPC Hook)
tRPC Procedure (server/routers.ts)
    ↓ (Database Query)
Query Helper (server/db.ts)
    ↓ (Drizzle ORM)
Database Table (drizzle/schema.ts)
```

### Email-Workflow
```
Event (z.B. Appointment Created)
    ↓
Service Function (server/email-service.ts)
    ↓
Email Template (server/email-templates/)
    ↓
Nodemailer (SMTP)
    ↓
Recipient Email
```

### Reminder-Workflow
```
Scheduler (every 15 minutes)
    ↓
generateAppointmentReminders()
    ↓
sendPendingReminders()
    ↓
sendAppointmentReminder24h/1h()
    ↓
Email Template
    ↓
Recipient Email
```

### Feedback-Workflow
```
Appointment Completed
    ↓
day_after Reminder Triggered
    ↓
createFeedbackSurvey()
    ↓
sendFeedbackSurveyEmail()
    ↓
Public Survey Page (/survey/:token)
    ↓
submitFeedback()
    ↓
Database (appointmentFeedback)
```

---

## 📊 Datenbank-Tabellen Übersicht

| Tabelle | Zweck | Beziehungen |
|---------|-------|------------|
| `users` | Manus OAuth Benutzer | 1:N adminUsers |
| `appointments` | Termine & Anfragen | 1:N reminders, feedback, tracking |
| `emailCampaigns` | Email-Marketing | 1:N recipients, tracking |
| `campaignRecipients` | Kampagnen-Empfänger | N:1 campaigns |
| `emailTracking` | Email-Öffnungen/Klicks | N:1 campaigns, appointments |
| `appointmentReminders` | Automatische Erinnerungen | N:1 appointments |
| `appointmentFeedback` | Feedback nach Terminen | N:1 appointments |
| `adminUsers` | Admin-Authentifizierung | N:1 users |

---

## 🔐 Authentifizierung & Autorisierung

### Procedure Types
```typescript
publicProcedure          // Jeder kann zugreifen
protectedProcedure       // Nur angemeldete Benutzer
adminProcedure           // Nur Admins (custom)
```

### User Roles
```typescript
"admin"   // Admin-Benutzer (kann alles)
"owner"   // Owner (volle Kontrolle)
"user"    // Normaler Benutzer (Manus OAuth)
```

### Zugriff prüfen
```typescript
if (ctx.user.role !== 'admin') {
  throw new TRPCError({ code: 'FORBIDDEN' });
}
```

---

## 🧪 Testing

### Test-Struktur
```typescript
describe("Feature Name", () => {
  let testData: any;

  beforeAll(async () => {
    // Setup
  });

  afterAll(async () => {
    // Cleanup
  });

  it("should do something", async () => {
    // Test
    expect(result).toBe(expected);
  });
});
```

### Test-Befehle
```bash
pnpm test                    # Alle Tests
pnpm test feature.test.ts    # Spezifischer Test
pnpm test --watch           # Watch Mode
```

---

## 🚀 Deployment

### Lokal testen
```bash
pnpm install
pnpm dev
```

### Zu GitHub pushen
```bash
git add .
git commit -m "Feature: Add reminder management"
git push
```

### Zu Manus deployen
1. Management UI → Preview
2. Teste die Änderungen
3. Klick "Publish"

---

## 📞 Wichtige Kontakte

- **Datenbank:** SQLite/TiDB (Manus-managed)
- **Email:** Nodemailer (SMTP)
- **Auth:** Manus OAuth
- **Storage:** S3 (Manus-managed)
- **LLM:** Claude API (Manus-managed)

---

## 🎓 Beispiel-Anfrage an Claude Code

```
"Ich möchte die Admin-Page für Reminder Management implementieren.

Anforderungen:
1. Route: /admin/reminders
2. Tabelle mit Columns: appointmentId, reminderType, status, scheduledAt
3. Status-Filter (pending, sent, failed, cancelled)
4. Aktion zum Stornieren von Reminders
5. Statistiken oben (total, pending, sent, failed)
6. Pagination (20 pro Seite)
7. Responsive Design
8. 5+ Unit Tests

Nutze:
- DashboardLayout (client/src/components/DashboardLayout.tsx)
- shadcn/ui Table Komponente
- trpc.reminders.* Prozeduren
- Tailwind 4 für Styling"
```

---

## ✅ Checkliste für neue Features

- [ ] Feature in `todo.md` dokumentiert
- [ ] Anforderungen spezifisch definiert
- [ ] Akzeptanzkriterien klar
- [ ] Bestehender Code referenziert
- [ ] Tests geplant
- [ ] API-Prozeduren definiert
- [ ] Datenbank-Schema aktualisiert
- [ ] Email-Templates (falls nötig)
- [ ] Dokumentation aktualisiert

---

## 🎯 Nächste Schritte

1. **Öffne diesen Ordner in Claude Code**
2. **Lese START_HERE.md**
3. **Lese QUICK_START_CLAUDE.md**
4. **Starte eine Anfrage** (nutze Beispiel oben)
5. **Arbeite iterativ** mit Claude Code

---

**Viel Erfolg! 🚀**

---

**Letzte Aktualisierung:** April 2026
**Version:** 1.0.0
