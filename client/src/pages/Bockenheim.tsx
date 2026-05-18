import { Link } from "wouter";
import {
  MapPin, PhoneIcon, Mail, ArrowRight, Bike, Hospital, Languages
} from "lucide-react";
import { useSEO } from "@/hooks/useSEO";
import { useEffect } from "react";

export default function Bockenheim() {
  useSEO({
    title: "Ambulanter Pflegedienst Bockenheim Frankfurt – mehrsprachig & kassenzugelassen | CuraMain",
    description: "Ambulanter Pflegedienst Frankfurt-Bockenheim: Häusliche Pflege am Bürgerhospital, mehrsprachig, kultursensibel. Kostenlose Erstberatung. ☎ 069 79 216 147",
    keywords: "Pflegedienst Frankfurt Bockenheim, ambulante Pflege Bockenheim, häusliche Pflege Bockenheim Frankfurt, Pflegedienst Bürgerhospital Frankfurt, Pflegedienst Bockenheimer Warte, CuraMain Bockenheim",
    canonical: "https://www.curamain.de/pflege/bockenheim",
  });

  useEffect(() => {
    const schema = {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "@id": "https://www.curamain.de/pflege/bockenheim#local",
      "name": "CuraMain – Ambulanter Pflegedienst Frankfurt Bockenheim",
      "description": "Ambulanter Pflegedienst in Frankfurt-Bockenheim. Bürgerhospital-Anbindung, mehrsprachig, kultursensibel, kassenzugelassen.",
      "url": "https://www.curamain.de/pflege/bockenheim",
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
      "geo": { "@type": "GeoCoordinates", "latitude": 50.1160, "longitude": 8.6535 },
      "areaServed": { "@type": "Place", "name": "Frankfurt-Bockenheim" },
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
    script.id = "local-schema-bockenheim";
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);
    return () => {
      const el = document.getElementById("local-schema-bockenheim");
      if (el) el.remove();
    };
  }, []);

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
            Versorgungsgebiet · Bockenheim
          </span>
          <h1 className="h-serif text-5xl lg:text-7xl text-cm-teal mt-6 mb-6 max-w-3xl leading-[1.05]">
            Ambulanter Pflegedienst Bockenheim — lebendiges Viertel, verlässliche Pflege.
          </h1>
          <p className="text-lg text-cm-ink/80 max-w-2xl leading-relaxed">
            Von der Bockenheimer Warte bis zur Leipziger Straße — professionelle häusliche Pflege, die Bockenheims bunte Mischung aus Tradition und Vielfalt kennt und schätzt.
          </p>
        </div>
      </section>

      {/* HAUPTTEXT */}
      <section className="container py-12 lg:py-14">
        <div className="max-w-3xl">
          <p className="text-lg text-cm-ink/85 leading-relaxed mb-6">
            Bockenheim ist Frankfurts lebendigstes Quartier — ein Viertel, in dem Generationen von Familien, Handwerker·innen und langjährige Nachbarn gleichzeitig leben. Die Bockenheimer Warte als Wahrzeichen, die Vielfalt der Leipziger Straße und die ruhigen Nebenstraßen rund um den Merianplatz prägen einen Stadtteil, der immer in Bewegung ist. Und genau deshalb braucht er einen Pflegedienst, der genauso verlässlich ist wie das Viertel selbst.
          </p>
          <p className="text-lg text-cm-ink/80 leading-relaxed mb-6">
            CuraMain versorgt Patient·innen in Bockenheim mit dem vollen Leistungsumfang häuslicher Pflege — von der Behandlungspflege nach Krankenhausaufenthalt über tägliche Grundpflege bis hin zu Aktivierung und Betreuung nach § 45b SGB XI. Wir arbeiten eng mit dem Bürgerhospital Frankfurt zusammen, das als wichtigstes Krankenhaus im Viertel für viele Patient·innen erste Anlaufstelle ist. Nach einem stationären Aufenthalt dort sorgen wir für den nahtlosen Übergang in Ihr gewohntes Zuhause.
          </p>
          <p className="text-lg text-cm-ink/80 leading-relaxed mb-6">
            Bockenheim ist eines der vielfältigsten Viertel Frankfurts — kulturell, sprachlich und in jeder Hinsicht. Unser Team pflegt in mindestens fünf Sprachen, darunter Englisch, Spanisch und Arabisch, und bringt eine kultursensible Grundhaltung in jede Pflegebeziehung mit. Das bedeutet: Wir respektieren Ihre Gewohnheiten, Ihre Traditionen und Ihre Vorstellungen von guter Pflege — und passen uns an, nicht Sie an uns.
          </p>
          <p className="text-lg text-cm-ink/80 leading-relaxed">
            Mit dem E-Bike sind unsere Pflegefachpersonen trotz des lebhaften Bockenheimer Stadtverkehrs schnell und pünktlich bei Ihnen. Kein Stau, kein Parkplatzproblem — nur mehr Zeit für echte Pflege. Von unserem Standort in der Berger Straße 69 erreichen wir Bockenheim in der Regel in unter 20 Minuten.
          </p>
        </div>
      </section>

      {/* LEISTUNGEN */}
      <section className="container pb-12 lg:pb-14">
        <div className="max-w-3xl">
          <h2 className="h-serif text-3xl lg:text-4xl text-cm-ink mb-6">
            Unsere Leistungen in Bockenheim
          </h2>
          <p className="text-cm-ink/75 mb-6 leading-relaxed">
            Als kassenzugelassener Pflegedienst rechnen wir direkt mit Ihrer Pflegekasse ab — Sie müssen sich um nichts kümmern. Wir begleiten Sie von der ersten Beratung bis zur laufenden Pflege.
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { title: "Behandlungspflege", desc: "Wundversorgung, Injektionen, Medikamentengabe, Kathetermanagement — nach ärztlicher Verordnung, fachgerecht ausgeführt." },
              { title: "Grundpflege", desc: "Körperpflege, An- und Auskleiden, Unterstützung beim Essen und Trinken — nach Ihrem Takt, mit unserem Einfühlungsvermögen." },
              { title: "Hauswirtschaftliche Unterstützung", desc: "Einkaufen, Kochen, Wäsche, Reinigung — Bockenheims Märkte und Läden kennen wir gut." },
              { title: "Beratungsbesuche § 37.3 SGB XI", desc: "Pflegeberatung für Bezieher·innen von Pflegegeld — kostenlos, regelmäßig und verbindlich." },
              { title: "Aktivierung & Betreuung § 45b SGB XI", desc: "Gedächtnistraining, Spaziergänge, gemeinsames Kochen — weil aktiv bleiben so wichtig ist wie Pflege selbst." },
              { title: "Kostenlose Erstberatung", desc: "Wir kommen zu Ihnen nach Hause, klären gemeinsam den Bedarf und erklären alle Möglichkeiten — völlig unverbindlich." },
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
          <h2 className="h-serif text-4xl lg:text-5xl text-cm-ink">Drei Gründe für CuraMain in Bockenheim.</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          <div className="bg-white p-8 rounded-3xl border border-cm-teal-100">
            <div className="w-12 h-12 rounded-2xl bg-cm-teal-50 flex items-center justify-center mb-4">
              <Hospital className="w-6 h-6 text-cm-teal" />
            </div>
            <h3 className="h-serif text-xl text-cm-ink mb-3">Bürgerhospital-Anbindung</h3>
            <p className="text-sm text-cm-ink/70 leading-relaxed">
              Wir koordinieren den Übergang vom Bürgerhospital Frankfurt direkt in Ihre häusliche Pflege — schnell, persönlich und ohne Versorgungslücke.
            </p>
          </div>
          <div className="bg-white p-8 rounded-3xl border border-cm-teal-100">
            <div className="w-12 h-12 rounded-2xl bg-cm-teal-50 flex items-center justify-center mb-4">
              <Bike className="w-6 h-6 text-cm-teal" />
            </div>
            <h3 className="h-serif text-xl text-cm-ink mb-3">Schnell trotz Stadtverkehr</h3>
            <p className="text-sm text-cm-ink/70 leading-relaxed">
              Mit dem E-Bike kommen wir pünktlich, auch wenn Bockenheims belebte Straßen für Autos zur Herausforderung werden. Weniger Anfahrtszeit — mehr Zeit für Sie.
            </p>
          </div>
          <div className="bg-white p-8 rounded-3xl border border-cm-teal-100">
            <div className="w-12 h-12 rounded-2xl bg-cm-teal-50 flex items-center justify-center mb-4">
              <Languages className="w-6 h-6 text-cm-teal" />
            </div>
            <h3 className="h-serif text-xl text-cm-ink mb-3">Vielfalt als Stärke</h3>
            <p className="text-sm text-cm-ink/70 leading-relaxed">
              Unser mehrsprachiges Team pflegt in mindestens fünf Sprachen — weil Bockenheims Vielfalt auch in der Pflege sichtbar sein darf.
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
            <Link href="/pflege/westend" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-cm-teal-200 text-cm-teal text-sm hover:bg-cm-teal hover:text-white transition-colors">
              <MapPin className="w-3.5 h-3.5" /> Westend
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
          <h2 className="h-serif text-3xl lg:text-4xl text-cm-ink mb-3">Pflege in Bockenheim — persönlich erklärt</h2>
          <p className="text-cm-ink/70 mb-7 max-w-xl mx-auto">
            Vereinbaren Sie ein kostenloses Beratungsgespräch — telefonisch, per E-Mail oder direkt bei Ihnen zu Hause in Bockenheim.
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
