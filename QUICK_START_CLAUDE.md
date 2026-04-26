# Quick Start: Claude Code Integration

Schnelleinstieg für die Weiterentwicklung mit Claude Code.

---

## 🚀 5-Minuten Setup

### 1. Exportiere zu GitHub
```
Management UI → More (⋯) → GitHub → Export
```

### 2. Öffne Claude Code
```
https://claude.ai → Claude Code (Beta)
```

### 3. Verbinde dein Repo
```
Add Repository → Paste GitHub Link
```

### 4. Starte deine erste Anfrage
```
"Erstelle eine Admin-Page für Reminder Management 
unter /admin/reminders mit Tabelle, Filter und Statistiken"
```

---

## 📚 Wichtigste Dateien

| Datei | Zweck | Bearbeiten? |
|-------|-------|-----------|
| `server/routers.ts` | API-Prozeduren (tRPC) | ✅ Ja |
| `server/db.ts` | Datenbankqueries | ✅ Ja |
| `client/src/pages/` | Page-Komponenten | ✅ Ja |
| `client/src/components/` | UI-Komponenten | ✅ Ja |
| `drizzle/schema.ts` | Datenbank-Schema | ✅ Ja |
| `server/_core/` | Framework-Plumbing | ❌ Nein |
| `vite.config.ts` | Vite-Konfiguration | ❌ Nein |

---

## 🎯 Häufige Anfragen

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

## 🔄 Workflow

```
1. Anfrage an Claude Code
   ↓
2. Claude generiert Code
   ↓
3. Review die Änderungen
   ↓
4. Teste lokal (optional)
   ↓
5. Pushe zu GitHub
   ↓
6. Deploye zu Manus
```

---

## ✅ Checkliste für neue Features

Bevor du Claude Code fragst, stelle sicher:

- [ ] Feature ist in `todo.md` dokumentiert
- [ ] Anforderungen sind spezifisch (nicht vage)
- [ ] Akzeptanzkriterien sind definiert
- [ ] Bestehender Code ist referenziert
- [ ] Tests sind erwünscht

---

## 🐛 Debugging

### Tests ausführen
```bash
pnpm test
```

### TypeScript Fehler
```bash
pnpm tsc --noEmit
```

### Dev Server Logs
```bash
tail -f .manus-logs/devserver.log
```

---

## 📖 Dokumentation

- **CLAUDE_CODE_GUIDE.md** - Ausführliche Integration
- **API_REFERENCE.md** - Alle tRPC-Prozeduren
- **DATABASE_SCHEMA.md** - Datenbank-Struktur
- **README.md** - Template-Dokumentation

---

## 💡 Pro-Tipps

1. **Nutze Kontext:** Referenziere bestehende Pages
   ```
   "Nutze das Pattern aus client/src/pages/AdminCampaigns.tsx"
   ```

2. **Sei spezifisch:** Nicht "verbessere die Page", sondern "füge Pagination hinzu"

3. **Definiere Tests:** "Schreibe 5+ Unit Tests für..."

4. **Nutze Templates:** "Nutze das Email-Template Pattern aus appointment-reminder.html"

5. **Iteriere:** Wenn Claude nicht perfekt ist, gib Feedback und frag erneut

---

## 🚀 Nächste Schritte

1. Exportiere zu GitHub
2. Öffne Claude Code
3. Wähle eine Anfrage aus "Häufige Anfragen"
4. Starte die Entwicklung!

**Viel Erfolg! 🎉**
