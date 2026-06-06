import { Link } from "wouter";
import { useSEO } from "@/hooks/useSEO";

/**
 * HINWEIS (nicht sichtbar): Diese Datenschutzerklärung deckt die aktuell auf der
 * Website eingesetzten Verarbeitungen ab (Kontakt-/Bewerbungsformular, Server-Logs,
 * einwilligungsbasiertes Google Analytics, eingebettete Google-Maps-Karte, Hosting).
 * Vor dem Go-Live von der/dem Datenschutzbeauftragten bzw. einer Fachkanzlei
 * gegenlesen lassen. Den offiziellen DSB-Kontakt in Abschnitt 1 ergänzen, sobald
 * die Bestellung abgeschlossen ist.
 */
export default function Datenschutz() {
  useSEO({
    title: "Datenschutzerklärung – CuraMain",
    description:
      "Datenschutzerklärung von CuraMain. Informationen zur Verarbeitung Ihrer Daten gemäß DSGVO – Kontaktformular, Google Analytics, Google Maps und Ihre Rechte.",
  });

  return (
    <div className="py-16 lg:py-20">
      <div className="container max-w-3xl">
        <h1 className="text-4xl font-bold text-foreground mb-8">Datenschutzerklärung</h1>

        <div className="space-y-8 text-foreground">
          <section>
            <h2 className="text-2xl font-semibold mb-4">1. Verantwortlicher</h2>
            <div className="space-y-2">
              <p>Verantwortlich für die Datenverarbeitung auf dieser Website ist:</p>
              <p><strong>CuraMain GmbH</strong></p>
              <p>Berger Straße 69<br />60316 Frankfurt am Main<br />Deutschland</p>
              <p><strong>E-Mail:</strong> <a href="mailto:info@curamain.de" className="text-primary hover:underline">info@curamain.de</a></p>
              <p><strong>Telefon:</strong> 069 / 79 216 147</p>
              <p className="text-sm text-muted-foreground">
                Fragen zum Datenschutz sowie – nach dessen Bestellung – unsere·n Datenschutzbeauftragte·n erreichen Sie unter <a href="mailto:info@curamain.de" className="text-primary hover:underline">info@curamain.de</a>.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">2. Grundlagen und Rechtsgrundlagen der Verarbeitung</h2>
            <div className="space-y-4 text-sm text-muted-foreground">
              <p>Wir verarbeiten personenbezogene Daten nur, soweit dies zur Erfüllung unserer vertraglichen und gesetzlichen Pflichten oder auf Grundlage Ihrer Einwilligung erforderlich ist. Die Verarbeitung erfolgt nach der Datenschutz-Grundverordnung (DSGVO) und dem Bundesdatenschutzgesetz (BDSG).</p>
              <p>Rechtsgrundlagen sind insbesondere:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Art. 6 Abs. 1 lit. a DSGVO</strong> – Ihre Einwilligung (z. B. Google Analytics, Karten­einbettung).</li>
                <li><strong>Art. 6 Abs. 1 lit. b DSGVO</strong> – Anbahnung oder Erfüllung eines Vertrags (z. B. Bearbeitung Ihrer Anfrage oder Bewerbung).</li>
                <li><strong>Art. 6 Abs. 1 lit. f DSGVO</strong> – berechtigtes Interesse (z. B. sicherer und stabiler Betrieb der Website).</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">3. Hosting und Server-Logdateien</h2>
            <div className="space-y-4 text-sm text-muted-foreground">
              <p>Unsere Website wird bei einem deutschen Dienstleister gehostet (ALL-INKL.COM – Neue Medien Münnich, Hauptstraße 68, 02742 Friedersdorf). Der Anbieter verarbeitet Daten in unserem Auftrag auf Grundlage eines Vertrags zur Auftragsverarbeitung gemäß Art. 28 DSGVO.</p>
              <p>Bei jedem Aufruf werden automatisch Server-Logdateien erfasst (IP-Adresse, Datum und Uhrzeit, abgerufene Seite, Browsertyp, Betriebssystem). Diese Daten dienen dem sicheren Betrieb und der Fehleranalyse (Art. 6 Abs. 1 lit. f DSGVO) und werden nach kurzer Zeit gelöscht.</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">4. Kontakt- und Bewerbungsformular</h2>
            <div className="space-y-4 text-sm text-muted-foreground">
              <p><strong>Kontaktformular:</strong> Wenn Sie unser Kontaktformular nutzen, verarbeiten wir Ihren Namen, Ihre Telefonnummer und/oder E-Mail-Adresse sowie Ihre Nachricht, um Ihre Anfrage zu bearbeiten und mit Ihnen Kontakt aufzunehmen (Art. 6 Abs. 1 lit. b und lit. f DSGVO). Pflichtangaben sind so gekennzeichnet bzw. ergeben sich aus dem Zweck der Anfrage.</p>
              <p><strong>Bewerbungsformular:</strong> Bei einer Bewerbung verarbeiten wir die von Ihnen übermittelten Daten (Name, Kontaktdaten, Lebenslauf und weitere Angaben) ausschließlich zur Durchführung des Bewerbungsverfahrens (Art. 6 Abs. 1 lit. b DSGVO i. V. m. § 26 BDSG). Hochgeladene Dokumente werden geschützt gespeichert und nicht öffentlich zugänglich gemacht.</p>
              <p>Hinweis zu Gesundheitsdaten: Bitte übermitteln Sie über die Formulare keine besonderen Kategorien personenbezogener Daten (z. B. Diagnosen). Solche Angaben besprechen wir mit Ihnen persönlich im Rahmen der Pflegeberatung.</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">5. Einwilligung und Cookies</h2>
            <div className="space-y-4 text-sm text-muted-foreground">
              <p>Für nicht technisch notwendige Dienste (Google Analytics, Google-Maps-Einbettung) holen wir vorab Ihre Einwilligung über unseren Einwilligungs-Banner ein (§ 25 TDDDG, Art. 6 Abs. 1 lit. a DSGVO). Ohne Ihre Zustimmung werden diese Dienste nicht geladen und keine entsprechenden Cookies gesetzt.</p>
              <p>Ihre Entscheidung speichern wir lokal in Ihrem Browser (Local Storage, Schlüssel „cm-consent-v1"), damit der Banner nicht bei jedem Besuch erneut erscheint. Sie können Ihre Einwilligung jederzeit mit Wirkung für die Zukunft widerrufen, indem Sie die in Ihrem Browser gespeicherten Website-Daten löschen; beim nächsten Besuch erscheint der Banner erneut.</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">6. Google Analytics</h2>
            <div className="space-y-4 text-sm text-muted-foreground">
              <p>Nach Ihrer ausdrücklichen Einwilligung nutzen wir Google Analytics, einen Webanalysedienst der Google Ireland Limited (Gordon House, Barrow Street, Dublin 4, Irland). Google Analytics hilft uns zu verstehen, wie unsere Website genutzt wird, um sie zu verbessern. Rechtsgrundlage ist Ihre Einwilligung (Art. 6 Abs. 1 lit. a DSGVO).</p>
              <p>Wir haben die IP-Anonymisierung aktiviert („anonymize_ip"), sodass Ihre IP-Adresse gekürzt verarbeitet wird. Vor Ihrer Einwilligung wird kein Analyse-Skript geladen.</p>
              <p>Im Rahmen der Nutzung kann es zu einer Übermittlung von Daten an Server der Google LLC in den USA kommen. Die Übermittlung in die USA stützt sich auf die Standardvertragsklauseln der EU-Kommission (Art. 46 DSGVO) bzw. das EU-US Data Privacy Framework. Ein Drittland kann ein vom EU-Recht abweichendes Datenschutzniveau aufweisen.</p>
              <p>Sie können Ihre Einwilligung jederzeit widerrufen (siehe Abschnitt 5) oder die Erfassung durch Google Analytics über ein <a href="https://tools.google.com/dlpage/gaoptout" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Browser-Add-on</a> unterbinden. Weitere Informationen: <a href="https://policies.google.com/privacy" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Datenschutzerklärung von Google</a>.</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">7. Google Maps</h2>
            <div className="space-y-4 text-sm text-muted-foreground">
              <p>Auf unserer Kontaktseite binden wir eine Karte von Google Maps ein, um Ihnen unseren Standort anzuzeigen. Die Karte wird erst geladen, nachdem Sie der Einbettung zugestimmt bzw. sie aktiv aufgerufen haben (Art. 6 Abs. 1 lit. a DSGVO). Beim Laden kann Google Ihre IP-Adresse verarbeiten und Daten an Server in den USA übermitteln (Standardvertragsklauseln, Art. 46 DSGVO).</p>
              <p>Anbieter ist die Google Ireland Limited. Weitere Informationen finden Sie in der <a href="https://policies.google.com/privacy" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Datenschutzerklärung von Google</a>.</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">8. Speicherdauer</h2>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>Wir speichern personenbezogene Daten nur so lange, wie es für den jeweiligen Zweck erforderlich ist oder gesetzliche Aufbewahrungsfristen es vorgeben. Kontaktanfragen löschen wir spätestens nach 90 Tagen, Bewerbungsunterlagen nach 6 Monaten, sofern keine Einstellung erfolgt und Sie keiner längeren Speicherung zugestimmt haben.</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">9. Ihre Rechte</h2>
            <div className="space-y-4 text-sm text-muted-foreground">
              <p>Sie haben jederzeit das Recht auf Auskunft (Art. 15), Berichtigung (Art. 16), Löschung (Art. 17), Einschränkung der Verarbeitung (Art. 18), Datenübertragbarkeit (Art. 20) sowie auf Widerspruch gegen die Verarbeitung (Art. 21 DSGVO). Eine erteilte Einwilligung können Sie jederzeit mit Wirkung für die Zukunft widerrufen.</p>
              <p>Zur Ausübung Ihrer Rechte genügt eine Nachricht an <a href="mailto:info@curamain.de" className="text-primary hover:underline">info@curamain.de</a>.</p>
              <p><strong>Beschwerderecht:</strong> Sie haben das Recht, sich bei einer Datenschutz-Aufsichtsbehörde zu beschweren. Die für uns zuständige Behörde ist:</p>
              <p className="not-italic">
                Der Hessische Beauftragte für Datenschutz und Informationsfreiheit<br />
                Postfach 3163, 65021 Wiesbaden<br />
                Telefon: 0611 1408-0<br />
                E-Mail: <a href="mailto:poststelle@datenschutz.hessen.de" className="text-primary hover:underline">poststelle@datenschutz.hessen.de</a>
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">10. Datensicherheit</h2>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>Wir setzen technische und organisatorische Maßnahmen ein, um Ihre Daten vor unbefugtem Zugriff, Verlust oder Missbrauch zu schützen. Alle Datenübertragungen auf dieser Website erfolgen verschlüsselt (SSL/TLS).</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">11. Externe Links</h2>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>Unsere Website enthält Links zu externen Websites. Auf deren Datenverarbeitung haben wir keinen Einfluss; es gelten die Datenschutzerklärungen der jeweiligen Anbieter.</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">12. Änderungen dieser Datenschutzerklärung</h2>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>Wir passen diese Datenschutzerklärung an, wenn sich die Rechtslage oder unsere Verarbeitungen ändern. Es gilt jeweils die auf dieser Seite veröffentlichte Fassung.</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">13. Kontakt</h2>
            <p>Für Fragen zum Datenschutz erreichen Sie uns unter <a href="mailto:info@curamain.de" className="text-primary hover:underline">info@curamain.de</a> oder 069 / 79 216 147. Unser <Link href="/impressum" className="text-primary hover:underline">Impressum</Link> finden Sie hier.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
