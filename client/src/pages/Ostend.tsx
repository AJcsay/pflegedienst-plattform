import { Link } from "wouter";
import {
  MapPin, PhoneIcon, Mail, ArrowRight, Bike, Hospital, Languages
} from "lucide-react";
import { useSEO } from "@/hooks/useSEO";

export default function Ostend() {
  useSEO({
    title: "Ambulanter Pflegedienst Ostend Frankfurt – CuraMain",
    description: "Pflege im Ostend: vom EZB-Quartier bis zum Zoo. 7+ Sprachen, Klinik-Anbindung, ohne Verkehrsstress per E-Bike.",
    keywords: "Pflege Ostend Frankfurt, Pflegedienst Ostend, ambulante Pflege Ostend, EZB Quartier, CuraMain",
    canonical: "https://www.curamain.de/pflege/ostend",
  });

  return (
    <div className="bg-cm-cream">
      {/* HERO */}
      <section
        className="relative min-h-[360px] hero-bg -mt-24 pt-24"
        style={{ background: "linear-gradient(135deg, #daedeb 0%, #f9f6f1 100%)" }}
      >
        <div className="relative z-10 container pt-6 pb-10">
          <span className="pill inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm border border-white/60 shadow-sm">
            <MapPin className="w-4 h-4 text-cm-teal" />
            Versorgungsgebiet · Ostend
          </span>
          <h1 className="h-serif text-5xl lg:text-7xl text-cm-teal mt-6 mb-6 max-w-3xl leading-[1.05]">
            Pflege im Ostend — vom EZB-Quartier bis zum Zoo, schnell und persönlich bei Ihnen.
          </h1>
          <p className="text-lg text-cm-ink/80 max-w-2xl leading-relaxed">
            Wo neue Wohnviertel auf gewachsene Nachbarschaften treffen — Pflege, die mitwächst.
          </p>
        </div>
      </section>

      {/* HAUPTTEXT */}
      <section className="container py-12 lg:py-14">
        <div className="max-w-3xl">
          <p className="text-lg text-cm-ink/85 leading-relaxed mb-6">
            Das Ostend hat sich in den letzten zehn Jahren stärker verändert als fast jeder andere Frankfurter Stadtteil. Die Europäische Zentralbank, neue Wohnquartiere am Osthafen, der Zoo, das Hanauer Landstraßen-Quartier — und gleichzeitig Generationen von Familien, die hier seit Jahrzehnten leben. Unsere Pflege wird beidem gerecht.
          </p>
          <p className="text-lg text-cm-ink/80 leading-relaxed mb-6">
            Aus der Berger Straße 69 sind wir in unter 12 Minuten am Ostpark, an der Klinik des Roten Kreuzes oder in den ruhigen Wohnstraßen rund um die Habsburgerallee. Mit dem E-Bike kommen wir auch dort an, wo Autos im EZB-Berufsverkehr feststecken. Unsere Pflegekräfte sprechen die Sprachen der vielfältigen Ostend-Bevölkerung — von Türkisch und Arabisch bis Russisch und Polnisch.
          </p>
          <p className="text-lg text-cm-ink/80 leading-relaxed">
            Im Ostend bedeutet Pflege Anschluss: Anschluss an das Krankenhaus, Anschluss an die Hausarztpraxis und vor allem Anschluss an die Menschen, die Sie täglich begleiten.
          </p>
        </div>
      </section>

      {/* VORTEILE – 3 CARDS */}
      <section className="container pb-12 lg:pb-14">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="h-serif text-4xl lg:text-5xl text-cm-ink">Drei Gründe für CuraMain im Ostend.</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          <div className="bg-white p-8 rounded-3xl border border-cm-teal-100">
            <div className="w-12 h-12 rounded-2xl bg-cm-teal-50 flex items-center justify-center mb-4">
              <Bike className="w-6 h-6 text-cm-teal" />
            </div>
            <h3 className="h-serif text-xl text-cm-ink mb-3">EZB-Verkehr? Nicht unser Problem.</h3>
            <p className="text-sm text-cm-ink/70 leading-relaxed">
              Während andere Pflegedienste im Stau stehen, fahren wir mit dem E-Bike um den Stau herum.
            </p>
          </div>
          <div className="bg-white p-8 rounded-3xl border border-cm-teal-100">
            <div className="w-12 h-12 rounded-2xl bg-cm-teal-50 flex items-center justify-center mb-4">
              <Hospital className="w-6 h-6 text-cm-teal" />
            </div>
            <h3 className="h-serif text-xl text-cm-ink mb-3">Klinik Rotes Kreuz als Partner</h3>
            <p className="text-sm text-cm-ink/70 leading-relaxed">
              Direkter Übergang aus stationärer Versorgung in qualifizierte häusliche Pflege.
            </p>
          </div>
          <div className="bg-white p-8 rounded-3xl border border-cm-teal-100">
            <div className="w-12 h-12 rounded-2xl bg-cm-teal-50 flex items-center justify-center mb-4">
              <Languages className="w-6 h-6 text-cm-teal" />
            </div>
            <h3 className="h-serif text-xl text-cm-ink mb-3">Vielsprachige Versorgung im vielsprachigsten Stadtteil</h3>
            <p className="text-sm text-cm-ink/70 leading-relaxed">
              Wir pflegen in 7+ Sprachen — weil Ihre Würde nicht von Ihrer Muttersprache abhängen darf.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container pb-12 lg:pb-20">
        <div className="bg-cm-teal-50 rounded-3xl p-10 lg:p-12 text-center">
          <h2 className="h-serif text-3xl lg:text-4xl text-cm-ink mb-3">Ihre Pflege im Ostend</h2>
          <p className="text-cm-ink/70 mb-7 max-w-xl mx-auto">
            Beratung kostenlos — vor Ort oder telefonisch. Antwort innerhalb von 48 Stunden.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/kontakt/patient"
              className="bg-cm-teal hover:bg-cm-teal-500 text-white px-7 py-3 rounded-full font-medium shadow-md inline-flex items-center gap-2 transition-colors"
            >
              Anfrage absenden <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="tel:+4969792 16147"
              className="bg-white border border-cm-teal-100 hover:border-cm-teal-300 text-cm-ink px-7 py-3 rounded-full font-medium inline-flex items-center gap-2 transition-colors"
            >
              <PhoneIcon className="w-4 h-4 text-cm-teal" />
              069 / 79 216 147
            </a>
          </div>
        </div>
      </section>

      {/* KONTAKT-INFO */}
      <section className="container pb-12 lg:pb-20">
        <div className="bg-cm-ink text-white rounded-3xl p-10 lg:p-14">
          <h2 className="h-serif text-3xl lg:text-4xl mb-8">So erreichen Sie uns.</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="flex gap-4">
              <PhoneIcon className="w-6 h-6 text-cm-mint flex-shrink-0" />
              <div>
                <p className="font-medium mb-1">Telefon</p>
                <a href="tel:+4969792 16147" className="text-cm-mint hover:underline">
                  069 / 79 216 147
                </a>
                <p className="text-white/70 text-sm mt-1">Mo–Fr 8:00–18:00 · Notfall 24/7</p>
              </div>
            </div>
            <div className="flex gap-4">
              <Mail className="w-6 h-6 text-cm-mint flex-shrink-0" />
              <div>
                <p className="font-medium mb-1">E-Mail</p>
                <a href="mailto:info@curamain.de" className="text-cm-mint hover:underline">
                  info@curamain.de
                </a>
                <p className="text-white/70 text-sm mt-1">Antwort innerhalb von 24h</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
