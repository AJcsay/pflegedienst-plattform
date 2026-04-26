import { useSEO } from "@/hooks/useSEO";

export default function Datenschutz() {
  useSEO({
    title: "Datenschutzerklärung – CuraMain Pflegedienst",
    description: "Datenschutzerklärung von CuraMain. Informationen zur Verarbeitung Ihrer Daten gemäß DSGVO.",
  });

  return (
    <div className="py-16 lg:py-20">
      <div className="container max-w-3xl">
        <h1 className="text-4xl font-bold text-foreground mb-8">Datenschutzerklärung</h1>

        <div className="space-y-8 text-foreground">
          <section>
            <h2 className="text-2xl font-semibold mb-4">1. Verantwortlicher</h2>
            <div className="space-y-2">
              <p><strong>CuraMain GmbH</strong></p>
              <p>Berger Straße 69<br />60316 Frankfurt am Main<br />Deutschland</p>
              <p><strong>E-Mail:</strong> <a href="mailto:info@curamain.de" className="text-primary hover:underline">info@curamain.de</a></p>
              <p><strong>Telefon:</strong> 069 / 79 216 147</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">2. Allgemeine Informationen zur Datenverarbeitung</h2>
            <div className="space-y-4 text-sm text-muted-foreground">
              <p>Wir verarbeiten personenbezogene Daten nur, soweit dies zur Erfüllung unserer vertraglichen Verpflichtungen, zur Erfüllung gesetzlicher Pflichten oder mit Ihrer Einwilligung erforderlich ist. Die Verarbeitung erfolgt auf Grundlage der Datenschutz-Grundverordnung (DSGVO) und des Bundesdatenschutzgesetzes (BDSG).</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">3. Erhobene Daten und Zweck</h2>
            <div className="space-y-4 text-sm text-muted-foreground">
              <p><strong>Kontaktformulare:</strong> Wenn Sie unser Kontaktformular ausfüllen, erheben wir Ihren Namen, Ihre E-Mail-Adresse, Telefonnummer und Nachricht. Diese Daten werden zur Bearbeitung Ihrer Anfrage und zur Kontaktaufnahme verwendet.</p>

              <p><strong>Bewerbungsformular:</strong> Bei einer Bewerbung erheben wir Ihren Namen, E-Mail-Adresse, Telefonnummer, Lebenslauf und weitere Informationen. Diese werden ausschließlich zur Bearbeitung Ihrer Bewerbung verwendet.</p>

              <p><strong>Server-Logdateien:</strong> Bei jedem Besuch unserer Website werden automatisch Informationen wie IP-Adresse, Browser-Typ, Zugriffsdatum und -uhrzeit erfasst. Diese Daten dienen der Sicherheit und Optimierung unserer Website.</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">4. Speicherdauer</h2>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>Ihre Daten werden nur so lange gespeichert, wie dies für den Zweck der Verarbeitung erforderlich ist. Kontaktanfragen werden nach 90 Tagen gelöscht, Bewerbungen nach 6 Monaten, sofern keine Einstellung erfolgt ist.</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">5. Ihre Rechte</h2>
            <div className="space-y-4 text-sm text-muted-foreground">
              <p>Sie haben das Recht, Auskunft über Ihre bei uns gespeicherten Daten zu erhalten, diese zu berichtigen oder zu löschen. Sie können außerdem der Verarbeitung widersprechen oder eine Kopie Ihrer Daten anfordern. Um diese Rechte geltend zu machen, kontaktieren Sie uns unter <a href="mailto:info@curamain.de" className="text-primary hover:underline">info@curamain.de</a>.</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">6. Sicherheit</h2>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>Wir setzen technische und organisatorische Maßnahmen ein, um Ihre Daten vor unbefugtem Zugriff, Verlust oder Beschädigung zu schützen. Alle Datenübertragungen erfolgen verschlüsselt (SSL/TLS).</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">7. Externe Links</h2>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>Unsere Website enthält Links zu externen Websites. Wir sind nicht verantwortlich für die Datenschutzpraktiken dieser Websites. Bitte lesen Sie deren Datenschutzerklärungen.</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">8. Änderungen dieser Datenschutzerklärung</h2>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>Wir behalten uns vor, diese Datenschutzerklärung jederzeit anzupassen. Änderungen werden auf dieser Seite veröffentlicht. Ihre fortgesetzte Nutzung der Website gilt als Akzeptanz der aktualisierten Erklärung.</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">9. Kontakt</h2>
            <p>Für Fragen zum Datenschutz kontaktieren Sie uns unter <a href="mailto:info@curamain.de" className="text-primary hover:underline">info@curamain.de</a> oder 069 / 79 216 147.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
