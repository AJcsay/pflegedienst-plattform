import { Link } from "wouter";
import {
  MapPin, PhoneIcon, Mail, ArrowRight, Stethoscope, Heart, Languages
} from "lucide-react";
import { useSEO } from "@/hooks/useSEO";
import { useEffect } from "react";

export default function Sachsenhausen() {
  useSEO({
    title: "Ambulanter Pflegedienst Sachsenhausen Frankfurt – kultursensibel & kassenzugelassen | CuraMain",
    description: "Ambulanter Pflegedienst Frankfurt-Sachsenhausen: Häusliche Pflege am Museumsufer, mehrsprachig, kultursensibel. Kostenlose Erstberatung. ☎ 069 79 216 147",
    keywords: "Pflegedienst Frankfurt Sachsenhausen, ambulante Pflege Sachsenhausen, häusliche Pflege Sachsenhausen Frankfurt, Pflegedienst Museumsufer Frankfurt, CuraMain Sachsenhausen",
    canonical: "https://www.curamain.de/pflege/sachsenhausen",
  });

  useEffect(() => {
    const schema = {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "@id": "https://www.curamain.de/pflege/sachsenhausen#local",
      "name": "CuraMain – Ambulanter Pflegedienst Frankfurt Sachsenhausen",
      "description": "Ambulanter Pflegedienst in Frankfurt-Sachsenhausen. Häusliche Pflege am Museumsufer, mehrsprachig, kultursensibel, kassenzugelassen.",
      "url": "https://www.curamain.de/pflege/sachsenhausen",
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
      "geo": { "@type": "GeoCoordinates", "latitude": 50.0980, "longitude": 8.6840 },
      "areaServed": { "@type": "Place", "name": "Frankfurt-Sachsenhausen" },
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
    script.id = "local-schema-sachsenhausen";
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);
    return () => {
      const el = document.getElementById("local-schema-sachsenhausen");
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
            Versorgungsgebiet · Sachsenhausen
          </span>
          <h1 className="h-serif text-5xl lg:text-7xl text-cm-teal mt-6 mb-6 max-w-5xl leading-[1.05]">
            Ambulanter Pflegedienst Sachsenhausen — Pflege mit der Wärme des Südufers.
          </h1>
          <p className="text-lg lg:text-xl text-cm-ink/80 max-w-3xl leading-relaxed">
            Vom Museumsufer bis zur Dreieichstraße — professionelle häusliche Pflege, kultursensibel und menschlich, direkt in Ihrem Stadtteil.
          </p>
        </div>
      </section>

      {/* HAUPTTEXT */}
      <section className="container py-12 lg:py-14">
        <div className="max-w-3xl">
          <p className="text-lg text-cm-ink/85 leading-relaxed mb-6">
            Sachsenhausen ist mehr als das Apfelwein-Viertel — es ist ein Stadtteil mit Geschichte, Charakter und einer Gemeinschaft, die füreinander einsteht. Zwischen dem Museumsufer mit seinen weltberühmten Kulturhäusern und den ruhigen Gassen rund um die Schifferstraße und Dreieichstraße leben Menschen, die ihr ganzes Leben hier verbracht haben. Genau ihnen gilt unsere ungeteilte Aufmerksamkeit.
          </p>
          <p className="text-lg text-cm-ink/80 leading-relaxed mb-6">
            CuraMain versorgt Patient·innen in Sachsenhausen mit professioneller häuslicher Pflege — von der Behandlungspflege nach Krankenhausaufenthalt über die tägliche Grundpflege bis hin zu aktivierenden Betreuungsangeboten nach § 45b SGB XI. Wir arbeiten eng mit Hausarztpraxen im Stadtteil zusammen und koordinieren Anschlusspflege nach Aufenthalten im Krankenhaus Sachsenhausen. Unser Ziel: keine Versorgungslücke, kein Papierstress für Sie oder Ihre Angehörigen.
          </p>
          <p className="text-lg text-cm-ink/80 leading-relaxed mb-6">
            Sachsenhausen ist eines der vielfältigsten Quartiere Frankfurts. Hier leben Menschen mit Wurzeln aus aller Welt — und genau das spiegelt unser Team wider. Wir pflegen in mindestens fünf Sprachen, darunter Englisch, Spanisch und Arabisch, und bringen kulturelle Sensibilität in jeden Hausbesuch mit. Für uns bedeutet würdevolle Pflege, dass Ihre Herkunft, Ihre Gewohnheiten und Ihre persönlichen Überzeugungen respektiert werden — ohne Wenn und Aber.
          </p>
          <p className="text-lg text-cm-ink/80 leading-relaxed">
            Unsere Pflegefachpersonen erreichen die meisten Adressen in Sachsenhausen in unter 15 Minuten von unserem Standort in der Berger Straße 69. Per E-Bike umfahren wir mühelos den Innenstadtverkehr, kommen zuverlässig und pünktlich — und haben dadurch mehr Zeit für das, was wirklich zählt: Sie.
          </p>
        </div>
      </section>

      {/* LEISTUNGEN */}
      <section className="container pb-12 lg:pb-14">
        <div className="max-w-3xl">
          <h2 className="h-serif text-3xl lg:text-4xl text-cm-ink mb-6">
            Unsere Leistungen in Sachsenhausen
          </h2>
          <p className="text-cm-ink/75 mb-6 leading-relaxed">
            Alle Leistungen werden über Ihre Pflegekasse abgerechnet — CuraMain ist bei allen gesetzlichen Krankenkassen zugelassen. Wir übernehmen die gesamte Korrespondenz mit Ihrer Kasse.
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { title: "Behandlungspflege", desc: "Wundversorgung, Injektionen, Medikamentengabe, Kathetermanagement — qualifiziert und sorgfältig." },
              { title: "Grundpflege", desc: "Körperpflege, An- und Auskleiden, Unterstützung beim Essen und Trinken — respektvoll und würdevoll." },
              { title: "Hauswirtschaftliche Unterstützung", desc: "Einkaufen, Kochen, Wäsche, Reinigung — damit Ihr Zuhause Ihr Zuhause bleibt." },
              { title: "Beratungsbesuche § 37.3 SGB XI", desc: "Regelmäßige Pflegeberatung für Bezieher·innen von Pflegegeld — kostenlos im Rahmen der Versicherungsleistung." },
              { title: "Aktivierung & Betreuung § 45b SGB XI", desc: "Gedächtnistraining, Alltagsbegleitung, soziale Aktivierung — gegen Isolation, für Lebensqualität." },
              { title: "Kostenlose Erstberatung", desc: "Wir kommen zu Ihnen nach Hause, klären den Pflegebedarf und begleiten Sie bei der Antragstellung — ohne Verpflichtung." },
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
          <h2 className="h-serif text-4xl lg:text-5xl text-cm-ink">Drei Gründe für CuraMain in Sachsenhausen.</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          <div className="bg-white p-8 rounded-3xl border border-cm-teal-100">
            <div className="w-12 h-12 rounded-2xl bg-cm-teal-50 flex items-center justify-center mb-4">
              <Stethoscope className="w-6 h-6 text-cm-teal" />
            </div>
            <h3 className="h-serif text-xl text-cm-ink mb-3">Nahtlose Anschlusspflege</h3>
            <p className="text-sm text-cm-ink/70 leading-relaxed">
              Nach einem Krankenhausaufenthalt organisieren wir den Übergang in die häusliche Pflege — ohne Wartezeit, ohne Versorgungslücke.
            </p>
          </div>
          <div className="bg-white p-8 rounded-3xl border border-cm-teal-100">
            <div className="w-12 h-12 rounded-2xl bg-cm-teal-50 flex items-center justify-center mb-4">
              <Heart className="w-6 h-6 text-cm-teal" />
            </div>
            <h3 className="h-serif text-xl text-cm-ink mb-3">Pflege, die den Menschen sieht</h3>
            <p className="text-sm text-cm-ink/70 leading-relaxed">
              Wir pflegen nicht nach Protokoll, sondern nach Mensch. Ihre Geschichte, Ihre Gewohnheiten und Ihre Würde stehen im Mittelpunkt jedes Besuchs.
            </p>
          </div>
          <div className="bg-white p-8 rounded-3xl border border-cm-teal-100">
            <div className="w-12 h-12 rounded-2xl bg-cm-teal-50 flex items-center justify-center mb-4">
              <Languages className="w-6 h-6 text-cm-teal" />
            </div>
            <h3 className="h-serif text-xl text-cm-ink mb-3">Fünf Sprachen, eine Haltung</h3>
            <p className="text-sm text-cm-ink/70 leading-relaxed">
              Englisch, Spanisch, Arabisch und mehr: Unser mehrsprachiges Team pflegt Sie in Ihrer Sprache — kultursensibel und geschlechtssensibel.
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
            <Link href="/pflege/westend" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-cm-teal-200 text-cm-teal text-sm hover:bg-cm-teal hover:text-white transition-colors">
              <MapPin className="w-3.5 h-3.5" /> Westend
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
          <h2 className="h-serif text-3xl lg:text-4xl text-cm-ink mb-3">Pflege in Sachsenhausen — persönlich erklärt</h2>
          <p className="text-cm-ink/70 mb-7 max-w-xl mx-auto">
            Vereinbaren Sie ein kostenloses Beratungsgespräch — telefonisch, per E-Mail oder bei Ihnen zu Hause in Sachsenhausen.
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
