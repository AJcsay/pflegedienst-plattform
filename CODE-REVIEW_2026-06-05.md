# CuraMain Website — Code-Review

*Erstellt: 2026-06-05 · Geprüft: `07_Webseite/pflegedienst-plattform/` · Stack: React 19 · Vite 7 · Tailwind 4 · TypeScript 5.9 · wouter · Radix/shadcn · statisches Hosting (All-Inkl) + PHP-Form-Endpoints*

> **Hinweis zum Gültigkeitsbereich:** Geprüft wurde der **Code im Repo** (Single Source of Truth). Die Live-Seite kann abweichen, da laut `_STATUS.md` Deploys über den Mac-Build + FTPS-Flow laufen und teils HRB-getaktet sind. Firmierungs- und Sprach-Befunde existieren im Code und stehen mit hoher Wahrscheinlichkeit auch live. Fixes bitte nach Umsetzung gegen die Live-Seite verifizieren und über den dokumentierten Deploy-Weg ausrollen.

---

## Executive Summary

Die Seite ist **handwerklich auf gutem Niveau**: konsolidiertes `MedicalBusiness`-Schema, einwilligungsgesteuertes Google Analytics (TDDDG-konform gegated), durchdachte PHP-Sicherheit (Origin-Check, Rate-Limiting, Honeypot, Header-Injection-Schutz, Magic-Byte-MIME-Prüfung beim CV-Upload), Skip-Link, formularseitige Barrierefreiheit (Labels, `aria-live`), bereits WCAG-AA-korrigierte Teal-Kontraste, PWA mit Network-First-Service-Worker.

Gefunden wurden **1 kritischer, 7 hohe, 6 mittlere und 4 niedrige Befunde**. Der kritische Punkt kostet direkt Patient·innen-Anfragen; mehrere hohe Befunde sind rechtlich/markenrelevant und mit überschaubarem Aufwand behebbar.

| Schwere | Anzahl | Kernthemen |
|---|---|---|
| 🔴 Kritisch | 1 | Kontaktformular bricht bei Telefon-only-Anfragen |
| 🟠 Hoch | 7 | Alt-Firmierung, Datenschutz-Lücke, Sprachen-Markenverstoß, Maps-Consent, FAQ-Bug, Tastatur-Navi, CV-Schutz |
| 🟡 Mittel | 6 | Kein Prerendering, doppeltes FAQ-Schema, BEEP, Reduced-Motion, Kontraste, docx-MIME |
| 🟢 Niedrig | 4 | Sitemap-Datum, Impressum-Ergänzungen, SW-Versionierung, keywords-Meta |

---

## 🔴 Kritisch

### K1 — Kontaktformular bricht bei „Telefon statt E-Mail"
**Wo:** `client/src/pages/KontaktPatient.tsx` (E-Mail als „optional" deklariert, Validierung „Telefon **oder** E-Mail") ↔ `php/contact.php:100-109` (E-Mail ist **Pflicht** + `FILTER_VALIDATE_EMAIL`).
**Problem:** Das Frontend bewirbt E-Mail ausdrücklich als optional und lässt Telefon-only-Anfragen zu. Das Backend lehnt jede Anfrage ohne gültige E-Mail mit „Pflichtfelder fehlen" / „Ungültige E-Mail-Adresse" ab. Genau die ältere, telefonaffine Zielgruppe ohne E-Mail verliert ihre Anfrage — bei einem Pflegedienst ist das Formular der zentrale Akquise-Kanal.
**Fix:** `contact.php` so anpassen, dass **E-Mail ODER Telefon** genügt; E-Mail nur validieren, wenn gesetzt. (Frontend bleibt wie es ist.)
```php
if ($firstName === '' || $message === '' || ($email === '' && $phone === '')) { … fehlt … }
if ($email !== '' && !filter_var($email, FILTER_VALIDATE_EMAIL)) { … ungültig … }
```
Optional `lib/api.ts`: `email` im `ContactPayload` auf `string` ohne Pflichtcharakter behandeln (leerer String erlaubt).

---

## 🟠 Hoch

### H1 — Alt-Firmierung „CuraMain Pflegedienst GmbH" an 6 öffentlichen Stellen
**Wo:** `client/index.html:13` (`author`-Meta), `client/index.html:116` (JSON-LD `name`), `client/src/data/faq.json:139`, `client/src/pages/FAQ.tsx:76`, `client/src/pages/Frankfurt.tsx:165`, `client/src/pages/Offenbach.tsx:20`.
**Problem:** Projektweite Regel ist **„CuraMain GmbH"** (bzw. „CuraMain GmbH i. G." auf rechtsverbindlichen Dokumenten). Die Firmierungs-Korrektur aus Session 20.1 betraf nur die `.docx`-Welt — die Website wurde nie gepatcht. Falscher Firmenname im Schema/Meta ist auch SEO-/Trust-relevant.
**Fix:** Überall „Pflegedienst GmbH" → „CuraMain GmbH". Im sichtbaren Fließtext (FAQ/Frankfurt/Offenbach) „CuraMain GmbH" bzw. schlicht „CuraMain"; im Schema/`author` „CuraMain GmbH".

### H2 — Datenschutzerklärung ist unvollständig (Abmahn-Risiko)
**Wo:** `client/src/pages/Datenschutz.tsx`.
**Problem:** Der Consent-Banner nennt ausdrücklich „Cookies und Google Analytics" und verlinkt die Datenschutzseite — die Seite **schweigt** dazu. Es fehlen: Google-Analytics-Abschnitt (Zweck, Anbieter Google, **Drittlandtransfer USA**, Rechtsgrundlage Art. 6 Abs. 1 lit. a — Einwilligung, Opt-out/Widerruf), Cookie-/`localStorage`-Hinweis, **Beschwerderecht bei der Aufsichtsbehörde** (Der Hessische Beauftragte für Datenschutz und Informationsfreiheit, Art. 13/14 DSGVO), Rechtsgrundlagen je Verarbeitung, ggf. Nennung des **Datenschutzbeauftragten**. Für einen Dienst, der mit Gesundheitsdaten arbeitet, ist das in DE ein realistisches Abmahn-Thema. *(Positiv: GA selbst lädt sauber erst nach Opt-in — die Lücke ist die fehlende Transparenz, nicht illegales Tracking.)*
**Fix:** Datenschutzerklärung um die genannten Abschnitte ergänzen; mit Steuerberater/DSB gegenprüfen lassen (DSB ist laut Tracker „vorbereitet").

### H3 — Sprachen: Markenverstoß + Inkonsistenz über mehrere Seiten
**Wo:** `client/src/pages/KontaktPatient.tsx:10` = **7 Sprachen** `["Deutsch, Englisch, Türkisch, Arabisch, Russisch, Polnisch, Französisch"]` (öffentliche Sidebar); `faq.json:80` = `Deutsch, Arabisch, Türkisch, Russisch, Polnisch`; `faq.json:139` = `Deutsch, Englisch und Französisch`. Korrekt dagegen: `Westend.tsx:88` / `Ostend.tsx:77` („mindestens fünf Sprachen, darunter Englisch, Spanisch und Arabisch").
**Problem:** Markenregel ist **mindestens fünf Sprachen, fest verankert Englisch · Spanisch · Arabisch** (zwei weitere flexibel) — und **nie** Türkisch/Russisch/Polnisch namentlich auflisten oder 7 nennen. Aktuell wird **Spanisch (Kernsprache) ausgelassen**, dafür Nicht-Kernsprachen genannt; gleichzeitig widersprechen sich drei Seiten (7 vs. 5 vs. 3 Sprachen). Wettbewerbsrechtlich (§ 5 UWG) ist Über-/Falschauszeichnung der Sprachfähigkeit angreifbar.
**Fix:** Überall auf die Marken-Formel vereinheitlichen: „mindestens fünf Sprachen — fest Englisch, Spanisch und Arabisch, zwei weitere je nach Team". `SPRACHEN`-Konstante entsprechend ersetzen.

### H4 — Google-Maps-Einbettung ohne Einwilligung + Platzhalter-Koordinaten
**Wo:** `client/src/pages/KontaktPatient.tsx:340-349` (iframe `google.com/maps/embed`).
**Problem:** Die Karte lädt **unbedingt beim Seitenaufruf** (Google-Cookies, US-Transfer) — ohne Consent-Gate, anders als GA. Zusätzlich sind die Embed-Parameter **Platzhalter** (`!4v1234567890`, Fake-Place-ID `0x…0e0e0e0e0e0d`) → die Karte zeigt vermutlich den falschen Pin.
**Fix:** „Click-to-load"-Pattern (Karte erst nach Klick/Consent laden) **oder** statisches Vorschaubild + Link „In Google Maps öffnen" (Link existiert bereits). Echte Embed-URL für Berger Str. 69 generieren.

### H5 — FAQ.tsx: TypeScript-Fehler **und** Accordion-Funktionsbug
**Wo:** `client/src/pages/FAQ.tsx:163-164`; `client/src/data/faq.json` (Kategorie `frankfurt`: 3 Fragen **ohne** `id`).
**Problem:** `tsc --noEmit` schlägt mit 2 Fehlern fehl (`Property 'id' does not exist…`) → `pnpm check` ist rot. Zur Laufzeit erhalten in der Kategorie „frankfurt" alle 3 Accordion-Items `value={undefined}` → Radix kann sie nicht eindeutig auseinanderhalten (Auf-/Zuklappen defekt).
**Fix:** Den 3 `frankfurt`-Fragen in `faq.json` `id`-Werte geben (z. B. `frankfurt-1…3`), **oder** im Render `value={faq.id ?? \`${activeCategory}-${index}\`}` als Fallback. Empfehlung: IDs in der JSON ergänzen (sauberer + Anker-fähig).

### H6 — Desktop-Navigation per Tastatur nicht bedienbar
**Wo:** `client/src/components/Navbar.tsx:115-161`.
**Problem:** Die Dropdowns („Für Patienten/Bewerber/Partner") öffnen ausschließlich per `onMouseEnter/Leave`. Der `<button>` hat **kein** `onClick`, kein `onFocus`, kein `aria-haspopup`/`aria-expanded`. Tastatur- und Screenreader-Nutzer·innen kommen an die Untermenüs nicht heran — relevant für BFSG (Barrierefreiheitsstärkungsgesetz, seit 06/2025) und die Zielgruppe 65+. *(Das mobile Menü ist dagegen vorbildlich: `aria-expanded`, `aria-controls`, ESC, Scroll-Lock.)*
**Fix:** Button per `onClick` togglen, `aria-haspopup="menu"` + `aria-expanded={openDropdown===group.label}` setzen, mit `Escape`/`onBlur` schließen, Items als Links fokussierbar (sind sie). Hover als Zusatz beibehalten.

### H7 — CV-Uploads: Schutz hängt an manuellem Schritt, keine Löschroutine
**Wo:** `php/bewerbung.php:29,139-162`, `php/uploads.htaccess`.
**Problem:** Lebensläufe (Bewerber-PII) werden unter `…/uploads/bewerbungen/` **innerhalb des Webroots** abgelegt. Der Zugriffsschutz besteht nur, wenn die mitgelieferte `uploads.htaccess` nach Deployment **manuell** als `/uploads/.htaccess` platziert wird (Kommentar Zeile 1). Wird das vergessen, sind CVs theoretisch abrufbar (Dateinamen-Token mit 64 Bit machen Enumeration unwahrscheinlich, aber kein Garant). Zudem werden Dateien **nie gelöscht**, obwohl die Datenschutzseite „Bewerbungen nach 6 Monaten" verspricht.
**Fix:** (1) Verifizieren, dass `/uploads/.htaccess` (`Require all denied`) live aktiv ist — idealerweise außerhalb des Webroots speichern. (2) Cron/Skript zur automatischen Löschung > 6 Monate. *(Klein: `finfo` liefert für `.docx` teils `application/zip` → siehe M6.)*

---

## 🟡 Mittel

### M1 — SPA ohne Prerendering/SSR: seitenspezifische Meta nur clientseitig
**Wo:** `client/src/hooks/useSEO.ts` (per `useEffect`); der Hook dokumentiert die Einschränkung selbst.
**Problem:** Jede Route wird vom statischen Host mit **derselben** `index.html` (Startseiten-Title/-Description) ausgeliefert; korrekte Per-Seiten-Meta entstehen erst nach JS-Ausführung. Google rendert JS meist, aber Social-Scraper (WhatsApp/LinkedIn/Facebook-OG) und schwächere Crawler sehen für **alle** URLs die Startseiten-Vorschau. Für lokale SEO (Stadtteilseiten) verschenkt das Reichweite.
**Fix:** Statisches Prerendering pro Route beim Build (z. B. `vite-plugin-prerender`/`react-snap`/eigenes Render-Skript) → echte `<title>`/OG/JSON-LD im initialen HTML. Größter SEO-Hebel mit einmaligem Setup.

### M2 — Doppeltes FAQPage-JSON-LD auf `/faq`
**Wo:** `FAQ.tsx:18-106` (hartcodiert, 9 Fragen, via `useEffect`) **und** `FAQ.tsx:248-263` (generiert aus `faq.json`, ~22 Fragen).
**Problem:** Zwei `FAQPage`-Schemas auf einer Seite → Google kann es als doppelt/widersprüchlich werten; der hartcodierte Block driftet vom Inhalt ab und enthält zudem die Alt-Firmierung (H1).
**Fix:** Hartcodierten `useEffect`-Block entfernen, **ein** aus `faq.json` generiertes `FAQPage`-Schema behalten.

### M3 — BEEP-Sprachregelung: „Pflegefachkraft" statt „Pflegefachperson"
**Wo:** `client/src/data/jobs.json` (mehrfach, ~8 Stellen), `Karriere.tsx:46-47`, `Bewerbung.tsx:19`, `Frankfurt.tsx:165`; außerdem „Pflegehelfer" statt „Pflegeassistent·in".
**Problem:** Verstößt gegen die durchgängige BEEP-Regel (Pflegefach**person**, Mittelpunkt-Form). Teils schon korrekt (`jobs.json` nutzt „Patient·innen").
**Abwägung:** Im **sichtbaren** Text → „Pflegefachperson". Im unsichtbaren **`keywords`-Meta** (`Karriere.tsx:47`) ist „Pflegefachkraft" der reale Such-Term — hier ggf. bewusst beide Begriffe führen (SEO), Body-Copy aber BEEP-konform.
**Fix:** Body/Stellentitel auf „Pflegefachperson" / „Pflegeassistent·in"; keywords-Meta nach Wunsch dual.

### M4 — `prefers-reduced-motion` fehlt vollständig
**Wo:** keine Treffer in `client/src/` (Smooth-Scroll in `App.tsx`, Transitions, `embla`-Carousel, `tailwindcss-animate`).
**Problem:** Nutzer·innen mit vestibulären Beschwerden (in der Zielgruppe nicht selten) erhalten keine reduzierten Animationen — WCAG 2.3.3.
**Fix:** Globale `@media (prefers-reduced-motion: reduce)`-Regel in `index.css` (Transitions/Animations neutralisieren) und Smooth-Scroll im `ScrollHandler` konditional auf `behavior:"auto"` umstellen.

### M5 — Niedrige Kontraste bei Kleintext
**Wo:** `Footer.tsx:80` (`text-white/50`, `text-xs` für Copyright/Impressum/Datenschutz) auf `--cm-ink #1c2826`; diverse `text-cm-ink/60` Hilfetexte auf Weiß.
**Problem:** Weiß bei 50 % Deckkraft auf Fast-Schwarz bzw. `cm-ink/60` auf Weiß liegt für kleine Schrift grenzwertig unter 4,5:1 (WCAG AA). *(Die Teal-Flächen wurden bereits korrekt auf `cm-teal-600` angehoben — siehe `index.css:298`.)*
**Fix:** Footer-Kleintext auf mind. `text-white/70`, Hilfetexte auf `cm-ink/70`+ anheben; mit Kontrast-Checker gegen 4,5:1 prüfen.

### M6 — `.docx`-Uploads können fälschlich abgelehnt werden
**Wo:** `php/bewerbung.php:131-137`.
**Problem:** `finfo` erkennt `.docx` je nach Server teils als `application/zip` (DOCX = ZIP-Container) → legitime Bewerbung scheitert mit „MIME-Typ nicht erlaubt".
**Fix:** `application/zip` für die Extension `docx` zusätzlich zulassen (Extension + Magic-Byte kombiniert prüfen).

---

## 🟢 Niedrig

- **N1 — Sitemap veraltet:** `client/public/sitemap.xml` `lastmod` ≤ 2026-05-18; „Pflege und Teilhabe"-Stand nicht reflektiert. Beim nächsten Deploy `lastmod` aktualisieren.
- **N2 — Impressum-Ergänzungen:** `Impressum.tsx` — optional „Inhaltlich Verantwortlicher gem. § 18 Abs. 2 MStV" und (falls bestellt) Datenschutzbeauftragte·r ergänzen. Meta-Title „…CuraMain Pflegedienst" ist ok (Keyword), nicht Firmierung.
- **N3 — Service-Worker-Versionierung:** `service-worker.js` `SW_VERSION` bei **jedem** Deploy hochzählen (im File dokumentiert) — als festen Schritt in den Deploy-Flow aufnehmen, sonst Stale-Content-Risiko.
- **N4 — `keywords`-Meta:** in `index.html`/`useSEO` ohne Ranking-Wert (von Google ignoriert) — unschädlich, kann bleiben.

---

## ✅ Was bereits gut gelöst ist (nicht anfassen)

- **JSON-LD `MedicalBusiness`** in `index.html` (Adresse, Geo, Telefon) — solide lokale SEO-Basis.
- **Google Analytics einwilligungsgesteuert** (`__loadAnalytics` erst nach Opt-in, `anonymize_ip`, TDDDG-§25-konform).
- **PHP-Sicherheit:** Origin-Check, IP-Rate-Limiting, Honeypot, CR/LF-Header-Injection-Schutz, `move_uploaded_file` + Zufalls-Token, **Magic-Byte-MIME-Prüfung** statt Client-Vertrauen.
- **Barrierefreiheit-Grundlagen:** Skip-Link, `lang="de"`, Formular-Labels/`autoComplete`/`aria-live`/`aria-describedby`, 44–48 px Touch-Targets, ESC + Scroll-Lock im Mobile-Menü, `:focus-visible`-Outline.
- **Consent-Banner** mit gleichwertigen „Ablehnen"/„Akzeptieren"-Buttons (DSGVO-konforme Gleichwertigkeit).
- **`target="_blank"`** überall mit `rel="noopener noreferrer"`; nur 1 kontrollierter `dangerouslySetInnerHTML`.
- **PWA/Service-Worker** Network-First für HTML/JS/CSS (frische Inhalte nach Deploy), API-/Admin-Routen vom Caching ausgenommen.
- **Teal-Kontrast** bereits auf WCAG-AA angehoben.

---

## Empfohlene Umsetzungs-Reihenfolge

1. **Batch A — Schnell-Fixes (rechtlich/Akquise, geringes Risiko):** K1 (Formular), H1 (Firmierung), H3 (Sprachen), H5 (FAQ-Bug), M3 (BEEP). Reine Text-/Logik-Änderungen, kein Architektur-Eingriff. ✅ Erledigt
2. **Batch B — Recht & Datenschutz:** H2 (Datenschutzerklärung), H4/H2-Maps (H... Maps-Consent), H7 (CV-Schutz + Löschroutine). Teils mit Steuerberater/DSB-Gegenlesung. ✅ Erledigt
3. **Batch C — Barrierefreiheit & Technik:** H6 (Tastatur-Navi), M4 (Reduced-Motion), M5 (Kontraste), M2 (FAQ-Schema), M6 (docx-MIME). ✅ Erledigt (2026-06-06)
4. **Batch D — SEO-Hebel (eigene Mini-Session):** M1 (Prerendering) + N1 (Sitemap). ✅ Erledigt

**Deploy:** Alle Änderungen über den dokumentierten Weg — Mac `_run_build.command` → FTPS-Upload (Sandbox) → Live-Bundle-Hash prüfen → `_git_commit_push.command`. Vor Live-Gang `pnpm check` grün (nach H5) und visuelle Stichprobe.

---

## Batch-C-Implementierungs-Log (2026-06-06)

### H6 — Tastatur-Navigation (`Navbar.tsx`) ✅
- `type="button"` auf alle Dropdown-Buttons ergänzt
- `aria-haspopup="menu"` + `aria-expanded={isOpen}` gesetzt
- `onClick`-Toggle: `setOpenDropdown(isOpen ? null : group.label)`
- `onKeyDown` auf dem Container-`<div>`: schließt bei `Escape`
- `onBlur` auf dem Container-`<div>`: schließt wenn `relatedTarget` außerhalb des Containers
- Hover (`onMouseEnter/Leave`) als Zusatz beibehalten
- Isomorphe `isOpen`-Variable für konsistente Darstellung des ChevronDown

### M2 — Doppeltes FAQPage-JSON-LD (`FAQ.tsx`) ✅
- Hartcodierten `useEffect`-Block mit 9 statischen FAQPage-Fragen vollständig entfernt (89 Zeilen)
- Ungenutztes `useEffect`-Import entfernt
- Dynamisch aus `faq.json` generiertes `<script type="application/ld+json">` bleibt erhalten (vollständige ~22 Fragen aus allen Kategorien, korrekte Firmierung)

### M4 — `prefers-reduced-motion` (`index.css` + `App.tsx`) ✅
- CSS: `@media (prefers-reduced-motion: reduce)` Block am Ende von `index.css` ergänzt — `animation-duration`, `transition-duration`, `transition-delay` auf `0.01ms/0ms` + `scroll-behavior: auto`
- JS: `ScrollHandler` in `App.tsx` prüft `window.matchMedia("(prefers-reduced-motion: reduce)").matches` vor `window.scrollTo({ behavior: "smooth" })` → bei Reduce auf `"auto"` umgestellt

### M5 — Kontraste (`Footer.tsx` + 9 Dateien) ✅
- `Footer.tsx` Z. 80: `text-white/50` → `text-white/70` (Bottom-Bar `text-xs`, Kontrast 4.7:1 → 7.6:1)
- Globale Ersetzung `text-cm-ink/60` → `text-cm-ink/70` in allen 24 Vorkommen über 9 Dateien (KontaktPatient, Bewerbung, Home, Frankfurt, Offenbach, Leistungen, PartnerKassen, PartnerKapazitaet, FAQ). Bei 60 % Deckkraft auf Weiß: ~3.7:1 (unter AA), bei 70 %: ~5.1:1 (WCAG AA bestanden)

### M6 — `.docx`-MIME-Normalisierung (`bewerbung.php`) ✅
- MIME-Normalisierung vor dem Allow-Check: `if ($ext === 'docx' && $mime === 'application/zip') { $mime = '...vnd.openxmlformats...'; }`
- Kombinierter Extension+Magic-Byte-Check: Sicherheit bleibt erhalten (`.docx`-Extension muss stimmen), falsch-negative Ablehnungen entfallen
- Korrekter Content-Type im E-Mail-Anhang durch Normalisierung vor der Nutzung von `$mime`

### Verifikation ✅
- `tsc --noEmit`: **0 Fehler**
- `npm run build`: **✓ built in 1.80s**, 23 Routen gerendert

---

## Batch A/B/D-Implementierungs-Log (2026-06-06, Session „Modell 4.8")

> Hinweis: Batch C + i18n wurden **parallel in einer zweiten Session** umgesetzt (siehe Log oben + `client/src/i18n/`). Dieser Log dokumentiert A/B/D. Integrierter Stand verifiziert: `tsc --noEmit` = 0, `vite build` = exit 0.

**Batch A ✅** — K1 `contact.php` (E-Mail ODER Telefon, bedingte Validierung + bedingter Reply-To); H1 Firmierung → „CuraMain GmbH" (6 Stellen, 0 Reste); H3 Sprachen-Formel „mind. fünf — Englisch · Spanisch · Arabisch (+ weitere)" (auch in i18n-Locales de/en, markenkonform); H5 `faq.json` frankfurt-Kategorie (title + description + IDs) → tsc-Fehler 2→0; M3 BEEP „Pflegefachperson" (jobs.json + Karriere/Bewerbung/Frankfurt), keywords-Meta dual. **Bonus:** Falschnummer „30 123 456"→„79 216 147" (4×), Offenbach `/kontakt`-404→`/kontakt/patient` (2×), „1.693 ₼"→„€", Encoding-Tippfehler (før/Eingeschränkte/schafft), 3 kaputte Unicode-Escapes in `index.html` (Rüsselsheim/Rödelheim/Höchst).

**Batch B ✅** — H2 Datenschutzerklärung komplett neu (GA mit Einwilligung/anonymize_ip/Google Ireland/USA-SCC, Cookies/localStorage, Google Maps, Rechtsgrundlagen Art. 6, Hosting/Auftragsverarbeitung, Beschwerderecht + **HBDI-Anschrift Postfach 3163, 65021 Wiesbaden** — Umzug 16.03.2026 verifiziert) → **vor Go-Live DSB/Fachkanzlei gegenlesen**; Maps Click-to-Load + echte Adress-URL; H7 `php/cleanup-uploads.php` (Cron, Token-Schutz, 183 Tage). **OPS-offen:** `/uploads/.htaccess` live prüfen, Cron-Token setzen, Uploads idealerweise außerhalb Webroot.

**Batch D ✅ (sandbox-getestet)** — `scripts/prerender.mjs` + `scripts/prerender-routes.mjs`: 23 Routen als statische `index.html` mit korrektem Title/Description/Canonical/OG; `sitemap.xml` build-generiert (lastmod heute). In `package.json` `build` verdrahtet. Testbuild: 23 Routen + 22 Sitemap-URLs, Bundle 684 kB (gzip 186 kB).

### ⚠️ Deploy-Hinweis (wichtig)
Der Arbeitsbaum vereint **nicht-committet**: meine A/B/D-Fixes + den parallelen **Batch-C/i18n-Refactor** (react-i18next DE/EN + Sprachumschalter) + den **Session-21-„Pflege und Teilhabe"-Pivot**. Ein Deploy schiebt ALLES live. Vor Deploy: gesamten `git diff` sichten, i18n-Vollständigkeit (alle Seiten DE/EN) bestätigen, dann Mac-Build (`npm run build` baut jetzt inkl. Prerender) → FTPS → Bundle-Hash prüfen → commit/push. **Marken-/BEEP-Checks künftig auch in `client/src/i18n/locales/{de,en}.json` durchführen.**
