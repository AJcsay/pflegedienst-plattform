import { Link, useRoute } from "wouter";
import { ArrowRight, Phone, MapPin, Stethoscope, Heart, Globe2, Shield, CheckCircle2 } from "lucide-react";
import { useSEO } from "@/hooks/useSEO";
import { findCity } from "@/data/cities";
import NotFound from "./NotFound";

/**
 * Stadt-Landingpage – ein eindeutiger URL pro Versorgungsstadt für lokale Suche.
 * Inhalte aus client/src/data/cities.ts.
 */
export default function Pflegedienst() {
  const [, params] = useRoute<{ city: string }>("/pflegedienst/:city");
  const city = params?.city ? findCity(params.city) : undefined;

  // Hooks must run unconditionally — call useSEO before the early-return.
  useSEO({
    title: city
      ? `${city.heroTitle} – CuraMain Pflegedienst`
      : "Pflegedienst – CuraMain",
    description: city
      ? `Ambulante Pflege in ${city.name}: Grund- & Behandlungspflege, kultursensibel und mehrsprachig. CuraMain ist Vertragspartner aller gesetzlichen Krankenkassen.`
      : "CuraMain – ambulanter Pflegedienst im Rhein-Main-Gebiet.",
    keywords: city
      ? `Pflegedienst ${city.name}, ambulante Pflege ${city.name}, häusliche Pflege ${city.name}, CuraMain ${city.name}`
      : undefined,
    canonical: city
      ? `https://www.curamain.de/pflegedienst/${city.slug}`
      : undefined,
    noindex: !city,
  });

  if (!city) return <NotFound />;

  // schema.org/MedicalBusiness mit areaServed = aktuelle Stadt
  const ldJson = {
    "@context": "https://schema.org",
    "@type": ["MedicalBusiness", "LocalBusiness"],
    "@id": `https://www.curamain.de/pflegedienst/${city.slug}#business`,
    name: `CuraMain Pflegedienst – ${city.name}`,
    url: `https://www.curamain.de/pflegedienst/${city.slug}`,
    telephone: "+49 69 79216147",
    email: "info@curamain.de",
    medicalSpecialty: "Nursing",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Berger Straße 69",
      addressLocality: "Frankfurt am Main",
      postalCode: "60316",
      addressCountry: "DE",
    },
    areaServed: {
      "@type": "City",
      name: city.name,
      geo: {
        "@type": "GeoCoordinates",
        latitude: city.geo.lat,
        longitude: city.geo.lng,
      },
    },
    knowsLanguage: ["de", "en", "ar", "tr", "ru", "pl"],
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "08:00",
        closes: "18:00",
      },
    ],
  };

  return (
    <div className="bg-cm-cream">
      {/* HERO */}
      <section
        className="relative min-h-[300px] hero-bg -mt-24 pt-24"
        style={{ background: "linear-gradient(135deg, #daedeb 0%, #f9f6f1 100%)" }}
      >
        <div className="relative z-10 container pt-6 pb-10">
          <span className="pill inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm border border-white/60 shadow-sm">
            <MapPin className="w-4 h-4 text-cm-teal-700" />
            {city.name}
          </span>
          <h1 className="h-serif text-5xl lg:text-7xl text-cm-teal mt-6 mb-6 max-w-3xl leading-[1.05]">
            {city.heroTitle}
          </h1>
          <p className="text-lg text-cm-ink/80 max-w-2xl leading-relaxed mb-6">
            {city.intro}
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/kontakt/patient"
              className="bg-cm-teal-600 hover:bg-cm-teal-700 text-white px-7 py-3.5 rounded-full font-medium shadow-lg flex items-center gap-2 transition-colors min-h-[48px]"
            >
              Kostenloses Erstgespräch anfordern
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="tel:+496979216147"
              className="pill border border-white/60 px-7 py-3.5 rounded-full font-medium flex items-center gap-2 shadow-sm min-h-[48px]"
            >
              <Phone className="w-4 h-4 text-cm-teal-700" />
              069 79 216 147
            </a>
          </div>
        </div>
      </section>

      {/* VERSORGTE STADTTEILE */}
      <section className="container py-12 lg:py-14 max-w-4xl">
        <h2 className="h-serif text-3xl lg:text-4xl text-cm-ink mb-3">Diese Stadtteile in {city.name} versorgen wir täglich</h2>
        <p className="text-cm-ink/70 mb-6 leading-relaxed">
          {city.travelHint}
        </p>
        <div className="flex flex-wrap gap-2 mb-10">
          {city.districts.map((d) => (
            <span
              key={d}
              className="bg-white border border-cm-teal-100 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm shadow-sm"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-cm-teal-700" />
              {d}
            </span>
          ))}
        </div>

        {/* HIGHLIGHTS */}
        <div className="bg-white rounded-3xl border border-cm-teal-100 p-7 lg:p-9 mb-10">
          <h3 className="font-semibold text-lg text-cm-ink mb-4">Was Sie in {city.name} von CuraMain erwarten können</h3>
          <ul className="space-y-3">
            {city.highlights.map((h) => (
              <li key={h} className="flex gap-3">
                <Shield className="w-5 h-5 text-cm-teal-700 flex-shrink-0 mt-0.5" />
                <span className="text-cm-ink/80 leading-relaxed">{h}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* LEISTUNGEN */}
        <div className="grid sm:grid-cols-3 gap-4 mb-10">
          {[
            { I: Stethoscope, t: "Behandlungspflege", d: "Wundversorgung, Injektionen, Medikamentengabe – nach ärztlicher Verordnung." },
            { I: Heart, t: "Grundpflege", d: "Körperpflege, Mobilisation, Ernährung – würdevoll und einfühlsam." },
            { I: Globe2, t: "Kultursensibel", d: "Mehrsprachig, religiös und geschlechtssensibel auf Wunsch." },
          ].map(({ I, t, d }) => (
            <div key={t} className="bg-white rounded-2xl border border-cm-teal-100 p-5">
              <div className="w-10 h-10 rounded-xl bg-cm-teal-50 flex items-center justify-center mb-3">
                <I className="w-5 h-5 text-cm-teal-700" />
              </div>
              <h4 className="font-semibold text-cm-ink mb-1">{t}</h4>
              <p className="text-sm text-cm-ink/70 leading-relaxed">{d}</p>
            </div>
          ))}
        </div>

        {/* KLINIK-PARTNER */}
        {city.hospitals.length > 0 && (
          <div className="bg-cm-teal-50 rounded-3xl p-7 lg:p-9 mb-10">
            <h3 className="font-semibold text-lg text-cm-ink mb-3">Patientenüberleitung aus diesen Kliniken in {city.name}</h3>
            <p className="text-cm-ink/75 mb-4 leading-relaxed">
              Wir haben Erfahrung in der nahtlosen Übernahme von Patient*innen direkt nach dem Klinikaufenthalt:
            </p>
            <div className="flex flex-wrap gap-2">
              {city.hospitals.map((h) => (
                <span key={h} className="bg-white border border-cm-teal-200 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm">
                  {h}
                </span>
              ))}
            </div>
            <Link href="/partner/zuweiser" className="mt-5 inline-flex items-center gap-2 text-cm-teal-700 hover:text-cm-teal-700 font-medium underline">
              Für Ärzte &amp; Kliniken: Patient*in überleiten <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}

        {/* CTA */}
        <div className="rounded-3xl bg-cm-ink text-white p-9 text-center">
          <h3 className="h-serif text-2xl lg:text-3xl text-white mb-3">
            Sie suchen einen Pflegedienst in {city.name}?
          </h3>
          <p className="text-white/85 mb-6 max-w-xl mx-auto leading-relaxed">
            Vereinbaren Sie ein kostenloses Erstgespräch. Mehrsprachig, telefonisch oder bei Ihnen zu Hause – auch am Wochenende erreichbar.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/kontakt/patient"
              className="bg-white hover:bg-cm-teal-50 text-cm-teal-700 px-7 py-3 rounded-full font-medium inline-flex items-center gap-2 transition-colors min-h-[48px]"
            >
              Erstgespräch anfragen <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="tel:+496979216147"
              className="bg-white/15 backdrop-blur border border-white/30 text-white px-7 py-3 rounded-full font-medium inline-flex items-center gap-2 hover:bg-white/25 transition-colors min-h-[48px]"
            >
              <Phone className="w-4 h-4" />
              069 79 216 147
            </a>
          </div>
        </div>
      </section>

      <script type="application/ld+json">
        {JSON.stringify(ldJson)}
      </script>
    </div>
  );
}
