import { Link } from "wouter";
import {
  MapPin, PhoneIcon, Mail, ArrowRight, Stethoscope, Bike, Languages
} from "lucide-react";
import { useSEO } from "@/hooks/useSEO";

export default function Bornheim() {
  useSEO({
    title: "Ambulanter Pflegedienst Bornheim Frankfurt – CuraMain",
    description: "Pflege in Bornheim mit Geriatrie-Anbindung Sankt Katharinen. Mehrsprachig, kultursensibel, E-Bike-schnell. Kostenlose Beratung.",
    keywords: "Pflege Bornheim Frankfurt, Pflegedienst Bornheim, ambulante Pflege Bornheim, Sankt Katharinen, CuraMain",
    canonical: "https://www.curamain.de/pflege/bornheim",
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
            Versorgungsgebiet · Bornheim
          </span>
          <h1 className="h-serif text-5xl lg:text-7xl text-cm-teal mt-6 mb-6 max-w-3xl leading-[1.05]">
            Pflege in Bornheim — Bernemer Verlässlichkeit, kombiniert mit moderner Pflegeexpertise.
          </h1>
          <p className="text-lg text-cm-ink/80 max-w-2xl leading-relaxed">
            Von der Saalburgstraße bis zum Uhrtürmchen — Ihr Pflegedienst zwischen Sankt Katharinen und Bethanien.
          </p>
        </div>
      </section>

      {/* HAUPTTEXT */}
      <section className="container py-12 lg:py-14">
        <div className="max-w-3xl">
          <p className="text-lg text-cm-ink/85 leading-relaxed mb-6">
            Bornheim — &bdquo;Bernemer Zeil&rdquo; — ist einer der lebendigsten Stadtteile Frankfurts. Genau hier, an der Schnittstelle zwischen Tradition und urbanem Wandel, leben viele Menschen, die ihr ganzes Leben in diesem Quartier verbracht haben. Sie verdienen eine Pflege, die diesen Stadtteil ebenso versteht wie sie selbst.
          </p>
          <p className="text-lg text-cm-ink/80 leading-relaxed mb-6">
            Wir kennen Bornheim. Unsere Pflegekräfte fahren täglich vom Saalburgplatz zur Eulenburgstraße, vom Bornheim Mitte bis zur Berger Straße. Wir arbeiten Hand in Hand mit dem Sankt Katharinen Krankenhaus — eine der wenigen Frankfurter Kliniken mit eigener Geriatrie-Abteilung — und mit dem Bethanien-Krankenhaus an der Nordendgrenze.
          </p>
          <p className="text-lg text-cm-ink/80 leading-relaxed">
            Bornheims Mischung aus Altbauten und kompakten Wohnvierteln macht Hausbesuche per E-Bike besonders effizient. Wir kommen schneller, häufiger und mit mehr Zeit. Das ist kein Marketing, das ist Mathematik: weniger Anfahrt, mehr Pflegezeit. Versprochen.
          </p>
        </div>
      </section>

      {/* VORTEILE – 3 CARDS */}
      <section className="container pb-12 lg:pb-14">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="h-serif text-4xl lg:text-5xl text-cm-ink">Drei Gründe für CuraMain in Bornheim.</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          <div className="bg-white p-8 rounded-3xl border border-cm-teal-100">
            <div className="w-12 h-12 rounded-2xl bg-cm-teal-50 flex items-center justify-center mb-4">
              <Stethoscope className="w-6 h-6 text-cm-teal" />
            </div>
            <h3 className="h-serif text-xl text-cm-ink mb-3">Geriatrie-Anbindung Sankt Katharinen</h3>
            <p className="text-sm text-cm-ink/70 leading-relaxed">
              Bei Krankenhausaufenthalten in der Geriatrie sorgen wir für die nahtlose Anschlusspflege — ohne Versorgungslücke.
            </p>
          </div>
          <div className="bg-white p-8 rounded-3xl border border-cm-teal-100">
            <div className="w-12 h-12 rounded-2xl bg-cm-teal-50 flex items-center justify-center mb-4">
              <Bike className="w-6 h-6 text-cm-teal" />
            </div>
            <h3 className="h-serif text-xl text-cm-ink mb-3">Tour-Effizienz im Quartier</h3>
            <p className="text-sm text-cm-ink/70 leading-relaxed">
              Unsere E-Bikes kommen ohne Parkplatzsuche aus. Das spart 20 Minuten pro Besuch — Zeit, die Sie bekommen.
            </p>
          </div>
          <div className="bg-white p-8 rounded-3xl border border-cm-teal-100">
            <div className="w-12 h-12 rounded-2xl bg-cm-teal-50 flex items-center justify-center mb-4">
              <Languages className="w-6 h-6 text-cm-teal" />
            </div>
            <h3 className="h-serif text-xl text-cm-ink mb-3">Pflege aus Überzeugung — kultur- und geschlechtssensibel</h3>
            <p className="text-sm text-cm-ink/70 leading-relaxed">
              Egal ob türkische, arabische, polnische oder deutsche Wurzeln: Ihre Pflege spricht Ihre Sprache.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container pb-12 lg:pb-20">
        <div className="bg-cm-teal-50 rounded-3xl p-10 lg:p-12 text-center">
          <h2 className="h-serif text-3xl lg:text-4xl text-cm-ink mb-3">Bornheimer Pflege, persönlich erklärt</h2>
          <p className="text-cm-ink/70 mb-7 max-w-xl mx-auto">
            Vereinbaren Sie ein kostenloses Beratungsgespräch — telefonisch, per E-Mail oder bei Ihnen zu Hause.
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
