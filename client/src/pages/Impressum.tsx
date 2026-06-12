import { Link } from "wouter";
import { useSEO } from "@/hooks/useSEO";

export default function Impressum() {
  useSEO({
    title: "Impressum – CuraMain GmbH",
    description: "Impressum und Kontaktdaten der CuraMain GmbH, ambulanter Pflegedienst in Frankfurt am Main.",
  });

  return (
    <div className="py-16 lg:py-20">
      <div className="container max-w-3xl">
        <h1 className="text-4xl font-bold text-foreground mb-8">Impressum</h1>

        <div className="space-y-8 text-foreground">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Angaben gemäß § 5 DDG</h2>
            <div className="space-y-2">
              <p><strong>CuraMain GmbH</strong></p>
              <p>Berger Straße 69<br />60316 Frankfurt am Main<br />Deutschland</p>
              <p>Sitz der Gesellschaft: Frankfurt am Main</p>
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
            <h2 className="text-2xl font-semibold mb-4">Vertretungsberechtigte Geschäftsführung</h2>
            <p>Geschäftsführer: Alie Junior Sesay (einzelvertretungsberechtigt)</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Registereintrag</h2>
            <div className="space-y-2">
              <p><strong>Registergericht:</strong> Amtsgericht Frankfurt am Main</p>
              <p><strong>Handelsregister-Nummer:</strong> HRB 143464</p>
              <p><strong>Umsatzsteuer-ID:</strong> wird nach Erteilung ergänzt</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Berufsbezeichnung und Berufsrechtliches</h2>
            <div className="space-y-2">
              <p>Die CuraMain GmbH betreibt einen ambulanten Pflegedienst und unterliegt den Bestimmungen des Sozialgesetzbuches (SGB V, SGB XI) sowie dem Pflegeberufegesetz (PflBG).</p>
              <p><strong>Zuständige Aufsichtsbehörde:</strong> Regierungspräsidium Gießen — Hessische Betreuungs- und Pflegeaufsicht (HGBP), Landgraf-Philipp-Platz 1–7, 35390 Gießen</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Haftungsausschluss</h2>
            <div className="space-y-4 text-sm text-muted-foreground">
              <p><strong>Haftung für Inhalte:</strong> Die Inhalte unserer Seiten wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen. Als Diensteanbieter sind wir für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Wir sind jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.</p>

              <p><strong>Haftung für Links:</strong> Unsere Website enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich. Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße überprüft. Rechtswidrige Inhalte waren zum Zeitpunkt der Verlinkung nicht erkennbar. Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist jedoch ohne konkrete Anhaltspunkte einer Rechtsverletzung nicht zumutbar. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Links umgehend entfernen.</p>

              <p><strong>Urheberrecht:</strong> Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des Autors oder Urhebers. Downloads und Kopien dieser Seite sind nur für den privaten, nicht kommerziellen Gebrauch gestattet.</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Datenschutz</h2>
            <p>Informationen zum Datenschutz finden Sie in unserer <Link href="/datenschutz" className="text-primary hover:underline">Datenschutzerklärung</Link>.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Verbraucherstreitbeilegung</h2>
            <p>Wir sind nicht verpflichtet und nicht bereit, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen. Bei Anliegen wenden Sie sich bitte direkt an uns — wir finden gemeinsam eine Lösung.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
