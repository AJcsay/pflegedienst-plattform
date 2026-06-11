import { Link } from "wouter";
import {
  MapPin, PhoneIcon, Mail, ArrowRight, Stethoscope, Shield, Languages
} from "lucide-react";
import { useSEO } from "@/hooks/useSEO";
import { useEffect } from "react";

export default function Westend() {
  useSEO({
    title: "Ambulanter Pflegedienst Westend Frankfurt – mehrsprachig & kassenzugelassen | CuraMain",
    description: "Ambulanter Pflegedienst Frankfurt-Westend: Häusliche Pflege am Palmengarten, kultursensibel, mehrsprachig. Uniklinik-Anbindung. ☎ 069 79 216 147",
    keywords: "Pflegedienst Frankfurt Westend, ambulante Pflege Westend Frankfurt, häusliche Pflege Westend, Pflegedienst Palmengarten Frankfurt, Pflegedienst Grüneburgpark Frankfurt, CuraMain Westend",
    canonical: "https://www.curamain.de/pflege/westend",
  });

  useEffect(() => {
    const schema = {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "@id": "https://www.curamain.de/pflege/westend#local",
      "name": "CuraMain – Ambulanter Pflegedienst Frankfurt Westend",
      "description": "Ambulanter Pflegedienst in Frankfurt-Westend. Häusliche Pflege am Palmengarten und Grüneburgpark, mehrsprachig, kultursensibel, kassenzugelassen.",
      "url": "https://www.curamain.de/pflege/westend",
      "telephone": "+49 69 79216147",
      "email": "info@curamain.de",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Berger Straße 69",
        "addressLocality": "Frankfurt am Main",
        "addressRegion": "Hessen",
        "postalCode": "60316",
        "addressCountry": "DE"
      },
      "geo": { "@type": "GeoCoordinates", "latitude": 50.1170, "longitude": 8.6693 },
      "areaServed": { "@type": "Place", "name": "Frankfurt-Westend" },
      "openingHoursSpecification": [
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday"],
          "opens": "08:00",
          "closes": "18:00"
        }
      ],
      "parentOrganization": { "@id": "https://www.curamain.de/#business" }
    };
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = "local-schema-westend";
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);
    return () => {
      const el = document.getElementById("local-schema-westend");
      if (el) el.remove();
    };
  }, []);

  return (
    <div className="bg-cm-cream">
      {/* HERO */}
      <section
        className="relative min-h-[420px] hero-bg -mt-24 pt-24"
        style={{ background: "linear-gradient(135deg, #daedeb 0%, #f9f6f1 100%)" }}
      >
        <div className="relative z-10 container pt-6 pb-10">
          <span className="pill inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm border border-white/60 shadow-sm">
            <MapPin className="w-4 h-4 text-cm-teal" />
            Versorgungsgebiet · Westend
          </span>
          <h1 className="h-serif text-5xl lg:text-7xl text-cm-teal mt-6 mb-6 max-w-5xl leading-[1.05]">
            Ambulanter Pflegedienst Westend Frankfurt — Verlässlichkeit im grünsten Viertel der Stadt.
          </h1>
          <p className="text-lg lg:text-xl text-cm-ink/80 max-w-3xl leading-relaxed">
            Zwischen Palmengarten, Grüneburgpark und Bockenheimer Landstraße — häusliche Pflege, die das ruhige Westend versteht und schätzt.
          </p>
        </div>
      </section>

      {/* HAUPTTEXT */}
      <section className="container py-12 lg:py-14">
        <div className="max-w-3xl">
          <p className="text-lg text-cm-ink/85 leading-relaxed mb-6">
            Das Westend ist Frankfurts ruhigster Charakter — großzügige Altbauwohnungen, breite Alleen, der Palmengarten als grüne Lunge des Viertels und eine gewachsene Nachbarschaft, in der viele ältere Menschen seit Jahrzehnten zu Hause sind. Für genau diese Menschen sind wir da: zuverlässig, diskret und mit dem Respekt, den ein Leben lang gelebte Selbstständigkeit verdient.
          </p>
          <p className="text-lg text-cm-ink/80 leading-relaxed mb-6">
            Im Westend pflegen wir in modernen und altehrwürdigen Wohnungen gleichermaßen — und wir wissen, dass Pflege hier oft bedeutet, behutsam in ein eingespieltes Leben einzutreten. Unsere Pflegefachpersonen kommen pünktlich, bereiten sich auf jede Patient·in individuell vor und koordinieren eng mit Hausarztpraxen sowie der nahegelegenen Universitätsklinik Frankfurt. Die Uniklinik mit ihrem breiten Fachspektrum ist eines der wichtigsten medizinischen Zentren Hessens — wir sorgen dafür, dass der Übergang zwischen Klinik und Zuhause reibungslos verläuft.
          </p>
          <p className="text-lg text-cm-ink/80 leading-relaxed mb-6">
            Das Westend ist ein internationales Viertel — Konsulate, internationale Familien, Menschen aus allen Teilen der Welt haben hier ihr Zuhause gefunden. Unser mehrsprachiges Team pflegt in mindestens fünf Sprachen, darunter Englisch, Spanisch und Arabisch, und bringt kulturelle Sensibilität als festen Bestandteil jeder Pflegebeziehung mit. Niemand soll wegen der Sprache oder Herkunft auf professionelle häusliche Pflege verzichten müssen.
          </p>
          <p className="text-lg text-cm-ink/80 leading-relaxed">
            Von unserem Standort in der Berger Straße 69 sind wir im Westend in unter 20 Minuten — per E-Bike zuverlässig auch dann, wenn der Berufsverkehr auf der Bockenheimer Landstraße stockt. Mehr Pünktlichkeit, mehr Pflegezeit, mehr Vertrauen.
          </p>
        </div>
      </section>

      {/* LEISTUNGEN */}
      <section className="container pb-12 lg:pb-14">
        <div className="max-w-3xl">
          <h2 className="h-serif text-3xl lg:text-4xl text-cm-ink mb-6">
            Unsere Leistungen im Westend
          </h2>
          <p className="text-cm-ink/75 mb-6 leading-relaxed">
            Als kassenzugelassener Pflegedienst rechnen wir alle Leistungen direkt mit Ihrer Pflegekasse ab. Wir begleiten Sie von der Pflegegrad-Beantragung bis zur laufenden Versorgung.
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { title: "Behandlungspflege", desc: "Wundversorgung, Injektionen, Medikamentengabe, Kathetermanagement — nach ärztlicher Verordnung, qualifiziert durchgeführt." },
              { title: "Grundpflege", desc: "Körperpflege, An- und Auskleiden, Unterstützung beim Essen und Trinken — mit Respekt für Ihre gewohnten Abläufe." },
              { title: "Hauswirtschaftliche Unterstützung", desc: "Einkaufen, Kochen, Wäsche, Reinigung — damit Ihr Westend-Zuhause so bleibt, wie es immer war." },
              { title: "Beratungsbesuche § 37.3 SGB XI", desc: "Pflegeberatung für Bezieher·innen von Pflegegeld — kostenlos, regelmäßig, verbindlich." },
              { title: "Aktivierung & Betreuung § 45b SGB XI", desc: "Gedächtnistraining, Spaziergänge, Alltagsbegleitung — Lebensqualität bewahren und fördern." },
              { title: "Kostenlose Erstberatung", desc: "Wir kommen zu Ihnen nach Hause, schauen gemeinsam auf den Pflegebedarf und erklären alle Möglichkeiten — ohne jede Verpflichtung." },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-2xl p-6 border border-cm-teal-100">
                <h3 className="font-semibold text-cm-ink mb-2">{item.title}</h3>
                <p className="text-sm text-cm-ink/70 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VORTEILE – 3 CARDS */}
      <section className="container pb-12 lg:pb-14">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="h-serif text-4xl lg:text-5xl text-cm-ink">Drei Gründe für CuraMain im Westend.</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          <div className="bg-white p-8 rounded-3xl border border-cm-teal-100">
            <div className="w-12 h-12 rounded-2xl bg-cm-teal-50 flex items-center justify-center mb-4">
              <Stethoscope className="w-6 h-6 text-cm-teal" />
            </div>
            <h3 className="h-serif text-xl text-cm-ink mb-3">Uniklinik-Anbindung Frankfurt</h3>
            <p className="text-sm text-cm-ink/70 leading-relaxed">
              Wir koordinieren den nahtlosen Übergang von der Universitätsklinik Frankfurt in Ihre häusliche Versorgung — persönlich und ohne Wartezeit.
            </p>
          </div>
          <div className="bg-white p-8 rounded-3xl border border-cm-teal-100">
            <div className="w-12 h-12 rounded-2xl bg-cm-teal-50 flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-cm-teal" />
            </div>
            <h3 className="h-serif text-xl text-cm-ink mb-3">Diskretion & Verlässlichkeit</h3>
            <p className="text-sm text-cm-ink/70 leading-relaxed">
              Wir treten behutsam in Ihren Alltag ein, respektieren Ihre Privatsphäre und halten jeden Termin — weil Vertrauen die Grundlage jeder Pflegebeziehung ist.
            </p>
          </div>
          <div className="bg-white p-8 rounded-3xl border border-cm-teal-100">
            <div className="w-12 h-12 rounded-2xl bg-cm-teal-50 flex items-center justify-center mb-4">
              <Languages className="w-6 h-6 text-cm-teal" />
            </div>
            <h3 className="h-serif text-xl text-cm-ink mb-3">International & kultursensibel</h3>
            <p className="text-sm text-cm-ink/70 leading-relaxed">
              Im internationalen Westend pflegen wir in fünf Sprachen — Ihre Herkunft bestimmt nicht die Qualität Ihrer Pflege.
            </p>
          </div>
        </div>
      </section>

      {/* WEITERE STADTTEILE */}
      <section className="container pb-12 lg:pb-14">
        <div className="max-w-3xl">
          <h2 className="h-serif text-2xl text-cm-ink mb-4">Weitere Versorgungsgebiete in Frankfurt</h2>
          <p className="text-cm-ink/70 mb-5 text-sm leading-relaxed">
            CuraMain versorgt Patient·innen in mehreren Frankfurter Stadtteilen. Mehr über unsere Arbeit in Ihrer Nachbarschaft:
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/pflege/sachsenhausen" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-cm-teal-200 text-cm-teal text-sm hover:bg-cm-teal hover:text-white transition-colors">
              <MapPin className="w-3.5 h-3.5" /> Sachsenhausen
            </Link>
            <Link href="/pflege/bockenheim" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-cm-teal-200 text-cm-teal text-sm hover:bg-cm-teal hover:text-white transition-colors">
              <MapPin className="w-3.5 h-3.5" /> Bockenheim
            </Link>
            <Link href="/pflege/bornheim" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-cm-teal-200 text-cm-teal text-sm hover:bg-cm-teal hover:text-white transition-colors">
              <MapPin className="w-3.5 h-3.5" /> Bornheim
            </Link>
            <Link href="/pflege/nordend-ost" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-cm-teal-200 text-cm-teal text-sm hover:bg-cm-teal hover:text-white transition-colors">
              <MapPin className="w-3.5 h-3.5" /> Nordend-Ost
            </Link>
            <Link href="/pflege/ostend" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-cm-teal-200 text-cm-teal text-sm hover:bg-cm-teal hover:text-white transition-colors">
              <MapPin className="w-3.5 h-3.5" /> Ostend
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container pb-12 lg:pb-20">
        <div className="bg-cm-teal-50 rounded-3xl p-10 lg:p-12 text-center">
          <h2 className="h-serif text-3xl lg:text-4xl text-cm-ink mb-3">Pflege im Westend — persönlich erklärt</h2>
          <p className="text-cm-ink/70 mb-7 max-w-xl mx-auto">
            Vereinbaren Sie ein kostenloses Beratungsgespräch — telefonisch, per E-Mail oder bei Ihnen zu Hause im Westend.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/kontakt/patient"
              className="bg-cm-teal hover:bg-cm-teal-500 text-white px-7 py-3 rounded-full font-medium shadow-md inline-flex items-center gap-2 transition-colors"
            >
              Anfrage absenden <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="tel:+496979216147"
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
                <a href="tel:+496979216147" className="text-cm-mint hover:underline">
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
