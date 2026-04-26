import { useSEO } from "@/hooks/useSEO";

export default function Impressum() {
  useSEO({
    title: "Impressum – CuraMain Pflegedienst",
    description: "Impressum und Kontaktdaten von CuraMain, ambulanter Pflegedienst im Rhein-Main-Gebiet.",
  });

  return (
    <div className="py-16 lg:py-20">
      <div className="container max-w-3xl">
        <h1 className="text-4xl font-bold text-foreground mb-8">Impressum</h1>

        <div className="space-y-8 text-foreground">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Angaben gemäß § 5 TMG</h2>
            <div className="space-y-2">
              <p><strong>CuraMain GmbH</strong></p>
              <p>Berger Straße 69<br />60316 Frankfurt am Main<br />Deutschland</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Kontakt</h2>
            <div className="space-y-2">
              <p><strong>Telefon:</strong> 069 / 79 216 147</p>
              <p><strong>E-Mail:</strong> <a href="mailto:info@curamain.de" className="text-primary hover:underline">info@curamain.de</a></p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Geschäftsführung</h2>
            <p>Geschäftsführer: [Name eintragen]</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Registereintrag</h2>
            <div className="space-y-2">
              <p><strong>Registergericht:</strong> Amtsgericht Frankfurt am Main</p>
              <p><strong>Handelsregister-Nummer:</strong> [HRB-Nummer eintragen]</p>
              <p><strong>Umsatzsteuer-ID:</strong> [USt-ID eintragen]</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Berufsbezeichnung und Berufsrechtliches</h2>
            <div className="space-y-2">
              <p>CuraMain ist ein ambulanter Pflegedienst und unterliegt den Bestimmungen des Sozialgesetzbuches (SGB V, SGB XI) sowie dem Pflegeberufegesetz (PflBG).</p>
              <p><strong>Zuständige Behörde:</strong> Hessisches Ministerium für Soziales und Integration</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Haftungsausschluss</h2>
            <div className="space-y-4 text-sm text-muted-foreground">
              <p><strong>Haftung für Inhalte:</strong> Die Inhalte unserer Seiten wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen. Als Diensteanbieter sind wir gemäß § 7 Abs. 1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.</p>

              <p><strong>Haftung für Links:</strong> Unsere Website enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich. Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße überprüft. Rechtswidrige Inhalte waren zum Zeitpunkt der Verlinkung nicht erkennbar. Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist jedoch ohne konkrete Anhaltspunkte einer Rechtsverletzung nicht zumutbar. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Links umgehend entfernen.</p>

              <p><strong>Urheberrecht:</strong> Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des Autors oder Urhebers. Downloads und Kopien dieser Seite sind nur für den privaten, nicht kommerziellen Gebrauch gestattet.</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Datenschutz</h2>
            <p>Informationen zum Datenschutz finden Sie in unserer <a href="/datenschutz" className="text-primary hover:underline">Datenschutzerklärung</a>.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Streitbeilegung</h2>
            <p>Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit: <a href="https://ec.europa.eu/consumers/odr" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">https://ec.europa.eu/consumers/odr</a>. Unsere E-Mail-Adresse finden Sie oben im Impressum.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
