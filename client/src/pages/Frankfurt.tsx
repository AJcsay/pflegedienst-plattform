import { Link } from "wouter";
import { MapPin, PhoneIcon, Mail, ArrowRight, CheckCircle, Languages, Shield, Clock } from "lucide-react";
import { useSEO } from "@/hooks/useSEO";
import { useEffect } from "react";

export default function Frankfurt() {
  useSEO({
    title: "Ambulanter Pflegedienst Frankfurt am Main – CuraMain | Kassenzugelassen",
    description: "CuraMain: Ihr ambulanter Pflegedienst in Frankfurt am Main. Grundpflege, Behandlungspflege & Betreuung in Nordend, Bornheim, Ostend und allen Stadtteilen. Kassenzugelassen. ☎ 069 79 216 147",
    keywords: "Pflegedienst Frankfurt am Main, ambulante Pflege Frankfurt, häusliche Pflege Frankfurt, Pflegedienst Frankfurt kassenzugelassen, Grundpflege Frankfurt, Behandlungspflege Frankfurt, Pflegegrade Frankfurt, CuraMain Frankfurt",
    canonical: "https://www.curamain.de/frankfurt",
  });

  useEffect(() => {
    const localSchema = {
      "@context": "https://schema.org",
      "@type": "MedicalBusiness",
      "@id": "https://www.curamain.de/frankfurt#local",
      "name": "CuraMain – Ambulanter Pflegedienst Frankfurt am Main",
      "description": "Ambulanter Pflegedienst in Frankfurt am Main. Professionelle Grundpflege, Behandlungspflege und Betreuung – mehrsprachig, kultursensibel, kassenzugelassen.",
      "url": "https://www.curamain.de/frankfurt",
      "telephone": "+49 69 79216147",
      "email": "info@curamain.de",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Berger Straße 69",
        "addressLocality": "Frankfurt am Main",
        "postalCode": "60316",
        "addressCountry": "DE"
      },
      "areaServed": { "@type": "City", "name": "Frankfurt am Main" },
      "parentOrganization": { "@id": "https://www.curamain.de/#business" }
    };

    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Welche Pflegekassen rechnet CuraMain ab?",
          "acceptedAnswer": { "@type": "Answer", "text": "CuraMain rechnet mit allen gesetzlichen Pflegekassen ab – darunter AOK, TK, Barmer, DAK, IKK und alle weiteren gesetzlichen Kassen. Privat versicherte Patienten werden ebenfalls betreut." }
        },
        {
          "@type": "Question",
          "name": "Wie schnell kann CuraMain mit der Pflege beginnen?",
          "acceptedAnswer": { "@type": "Answer", "text": "In der Regel können wir innerhalb weniger Tage nach dem Erstgespräch mit der Pflege beginnen. Kontaktieren Sie uns telefonisch oder per E-Mail – wir koordinieren alles Weitere schnell und unkompliziert." }
        },
        {
          "@type": "Question",
          "name": "In welchen Stadtteilen ist CuraMain in Frankfurt tätig?",
          "acceptedAnswer": { "@type": "Answer", "text": "CuraMain ist aktuell vor allem in Frankfurt-Nordend, Frankfurt-Bornheim und Frankfurt-Ostend tätig. Für weitere Frankfurter Stadtteile nehmen Sie bitte Kontakt auf – wir prüfen die Versorgungsmöglichkeit individuell." }
        },
        {
          "@type": "Question",
          "name": "Was kostet ambulante Pflege in Frankfurt?",
          "acceptedAnswer": { "@type": "Answer", "text": "Die Kosten für ambulante Pflege hängen vom Pflegegrad und den benötigten Leistungen ab. Die Pflegekasse übernimmt gemäß §36 SGB XI Sachleistungsbeträge zwischen 724 € (Pflegegrad 2) und 2.095 € (Pflegegrad 5) pro Monat. CuraMain berät Sie kostenlos über Ihre individuelle Kostenstruktur." }
        },
        {
          "@type": "Question",
          "name": "Spricht das CuraMain-Team Deutsch und andere Sprachen?",
          "acceptedAnswer": { "@type": "Answer", "text": "Ja, unser Pflegeteam ist mehrsprachig. Neben Deutsch sprechen wir Englisch, Spanisch, Arabisch und weitere Sprachen — mindestens fünf insgesamt. Kultursensible Pflege ist für uns selbstverständlich." }
        }
      ]
    };

    const s1 = document.createElement("script");
    s1.type = "application/ld+json";
    s1.id = "local-schema-frankfurt";
    s1.textContent = JSON.stringify(localSchema);
    document.head.appendChild(s1);

    const s2 = document.createElement("script");
    s2.type = "application/ld+json";
    s2.id = "faq-schema-frankfurt";
    s2.textContent = JSON.stringify(faqSchema);
    document.head.appendChild(s2);

    return () => {
      const e1 = document.getElementById("local-schema-frankfurt"); if (e1) e1.remove();
      const e2 = document.getElementById("faq-schema-frankfurt"); if (e2) e2.remove();
    };
  }, []);

  const leistungen = [
    { title: "Grundpflege", text: "Körperpflege, Waschen, An- und Auskleiden, Ernährungsunterstützung – würdevoll und individuell abgestimmt." },
    { title: "Behandlungspflege", text: "Wundversorgung, Injektionen, Medikamentengabe nach ärztlicher Verordnung – abgerechnet über die Krankenkasse." },
    { title: "Betreuung & Alltagsbegleitung", text: "Gesellschaft, Gespräche, gemeinsame Aktivitäten – für mehr Lebensqualität im Alltag." },
    { title: "Verhinderungspflege", text: "Wenn Angehörige ausfallen oder Urlaub machen: Wir übernehmen zuverlässig und unkompliziert." },
    { title: "24h-Rufbereitschaft", text: "Rund um die Uhr erreichbar für Notfälle – damit Sie und Ihre Familie sicher schlafen können." },
  ];

  const pflegegrade = [
    { grad: "Pflegegrad 1", betrag: "125 €", info: "Geringe Beeinträchtigung" },
    { grad: "Pflegegrad 2", betrag: "724 €", info: "Erhebliche Beeinträchtigung" },
    { grad: "Pflegegrad 3", betrag: "1.363 €", info: "Schwere Beeinträchtigung" },
    { grad: "Pflegegrad 4", betrag: "1.693 €", info: "Schwerste Beeinträchtigung" },
    { grad: "Pflegegrad 5", betrag: "2.095 €", info: "Schwerste Beeintr. + Besonderheiten" },
  ];

  const faqs = [
    {
      q: "Welche Pflegekassen rechnet CuraMain ab?",
      a: "CuraMain rechnet mit allen gesetzlichen Pflegekassen ab – darunter AOK, TK, Barmer, DAK, IKK und alle weiteren gesetzlichen Kassen. Privat versicherte Patienten werden ebenfalls betreut."
    },
    {
      q: "Wie schnell kann CuraMain mit der Pflege beginnen?",
      a: "In der Regel können wir innerhalb weniger Tage nach dem Erstgespräch mit der Pflege beginnen. Kontaktieren Sie uns telefonisch oder per E-Mail – wir koordinieren alles Weitere schnell und unkompliziert."
    },
    {
      q: "In welchen Stadtteilen ist CuraMain in Frankfurt tätig?",
      a: "CuraMain ist aktuell vor allem in Frankfurt-Nordend, Frankfurt-Bornheim und Frankfurt-Ostend tätig. Für weitere Frankfurter Stadtteile nehmen Sie bitte Kontakt auf – wir prüfen die Versorgungsmöglichkeit individuell."
    },
    {
      q: "Was kostet ambulante Pflege in Frankfurt?",
      a: "Die Kosten für ambulante Pflege hängen vom Pflegegrad und den benötigten Leistungen ab. Die Pflegekasse übernimmt gemäß §36 SGB XI Sachleistungsbeträge zwischen 724 € (Pflegegrad 2) und 2.095 € (Pflegegrad 5) pro Monat. CuraMain berät Sie kostenlos über Ihre individuelle Kostenstruktur."
    },
    {
      q: "Spricht das CuraMain-Team Deutsch und andere Sprachen?",
      a: "Ja, unser Pflegeteam ist mehrsprachig. Neben Deutsch sprechen wir Englisch, Spanisch, Arabisch und weitere Sprachen — mindestens fünf insgesamt. Kultursensible Pflege ist für uns selbstverständlich."
    },
  ];

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
            Ambulante Pflege · Frankfurt am Main
          </span>
          <h1 className="h-serif text-5xl lg:text-7xl text-cm-teal mt-6 mb-6 max-w-5xl leading-[1.05]">
            Ihr ambulanter Pflegedienst in Frankfurt am Main.
          </h1>
          <p className="text-lg lg:text-xl text-cm-ink/80 max-w-3xl leading-relaxed">
            CuraMain versorgt pflegebedürftige Menschen in Frankfurt – persönlich, mehrsprachig und kassenzugelassen. Unser Standort in der Berger Straße 69 liegt mitten im Versorgungsgebiet.
          </p>
          <div className="flex flex-wrap gap-3 mt-8">
            <Link
              href="/kontakt/patient"
              className="bg-cm-teal hover:bg-cm-teal-500 text-white px-7 py-3 rounded-full font-medium shadow-md inline-flex items-center gap-2 transition-colors"
            >
              Kostenlose Erstberatung <ArrowRight className="w-4 h-4" />
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

      {/* INTRO */}
      <section className="container py-12 lg:py-14">
        <div className="max-w-3xl">
          <p className="text-lg text-cm-ink/85 leading-relaxed mb-6">
            CuraMain ist ein ambulanter Pflegedienst mit Sitz in Frankfurt am Main. Wir versorgen pflegebedürftige Menschen in ihrem gewohnten Zuhause – würdevoll, zuverlässig und professionell. Unser Team besteht aus examinierten Pflegefachpersonen mit Herz für den Beruf.
          </p>
          <p className="text-lg text-cm-ink/80 leading-relaxed mb-6">
            Unsere aktiven Versorgungsgebiete liegen in Frankfurt-Nordend, Frankfurt-Bornheim und Frankfurt-Ostend. Von unserem Standort an der Berger Straße 69 erreichen wir diese Stadtteile schnell und effizient – per E-Bike, ohne lange Anfahrtszeiten.
          </p>
          <p className="text-lg text-cm-ink/80 leading-relaxed">
            Wir pflegen Menschen unterschiedlichster Herkunft und Lebenssituation. Unser mehrsprachiges Team kommuniziert auf Deutsch, Englisch, Spanisch, Arabisch und weiteren Sprachen – kultursensibel und mit Respekt vor individuellen Gewohnheiten und Werten.
          </p>
        </div>
      </section>

      {/* EINSATZGEBIETE */}
      <section className="container pb-12 lg:pb-14">
        <div className="bg-white border border-cm-teal-100 rounded-3xl p-8 lg:p-10">
          <div className="mb-6">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-cm-teal">Versorgungsgebiete</span>
            <h2 className="h-serif text-3xl lg:text-4xl text-cm-ink mt-2">Aktive Einsatzgebiete in Frankfurt.</h2>
            <p className="text-cm-ink/70 mt-3 max-w-2xl">
              Unsere Pflegekräfte sind täglich in diesen Stadtteilen unterwegs. Für weitere Gebiete in Frankfurt und Umgebung sprechen Sie uns an.
            </p>
          </div>
          <div className="grid sm:grid-cols-3 gap-3 mb-6">
            {[
              { slug: "nordend-ost", name: "Nordend-Ost", sub: "Vom Merianplatz bis zum Bürgerhospital" },
              { slug: "bornheim", name: "Bornheim", sub: "Saalburgstraße · Bornheim Mitte · Sankt Katharinen" },
              { slug: "ostend", name: "Ostend", sub: "EZB-Quartier · Habsburgerallee · Klinik Rotes Kreuz" },
            ].map((c) => (
              <Link
                key={c.slug}
                href={"/pflege/" + c.slug}
                className="group bg-cm-cream/60 hover:bg-cm-teal-50 border border-cm-teal-100 hover:border-cm-teal-300 rounded-2xl p-5 transition-colors"
              >
                <div className="font-semibold text-cm-ink group-hover:text-cm-teal-700 mb-1 flex items-center gap-2">
                  {c.name}
                  <ArrowRight className="w-4 h-4 opacity-60 group-hover:translate-x-0.5 transition-transform" />
                </div>
                <div className="text-xs text-cm-ink/70">{c.sub}</div>
              </Link>
            ))}
          </div>
          <p className="text-sm text-cm-ink/70">
            Weitere Frankfurter Stadtteile auf Anfrage – wir prüfen die Versorgung individuell.
          </p>
        </div>
      </section>

      {/* LEISTUNGEN */}
      <section className="container pb-12 lg:pb-14">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-cm-teal">Leistungen</span>
          <h2 className="h-serif text-4xl lg:text-5xl text-cm-ink mt-3">Was wir für Sie tun.</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {leistungen.map((l) => (
            <div key={l.title} className="bg-white p-7 rounded-3xl border border-cm-teal-100">
              <CheckCircle className="w-6 h-6 text-cm-teal mb-4" />
              <h3 className="h-serif text-xl text-cm-ink mb-3">{l.title}</h3>
              <p className="text-sm text-cm-ink/70 leading-relaxed">{l.text}</p>
            </div>
          ))}
          <div className="bg-white p-7 rounded-3xl border border-cm-teal-100">
            <Languages className="w-6 h-6 text-cm-teal mb-4" />
            <h3 className="h-serif text-xl text-cm-ink mb-3">Kultursensible Pflege</h3>
            <p className="text-sm text-cm-ink/70 leading-relaxed">Mehrsprachig, respektvoll, individuell – wir pflegen Sie in Ihrer Sprache und nach Ihren Werten.</p>
          </div>
        </div>
        <div className="mt-6 text-center">
          <Link href="/leistungen" className="inline-flex items-center gap-2 text-cm-teal hover:underline font-medium">
            Alle Leistungen im Überblick <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* PFLEGEGRADE */}
      <section className="container pb-12 lg:pb-14">
        <div className="bg-cm-teal-50 rounded-3xl p-8 lg:p-10">
          <div className="mb-8">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-cm-teal">Finanzierung</span>
            <h2 className="h-serif text-3xl lg:text-4xl text-cm-ink mt-2">Pflegegrade & Kostenübernahme.</h2>
            <p className="text-cm-ink/70 mt-3 max-w-2xl">
              Die Pflegekasse übernimmt ambulante Sachleistungen gemäß §36 SGB XI. Die monatlichen Höchstbeträge nach Pflegegrad:
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
            {pflegegrade.map((p) => (
              <div key={p.grad} className="bg-white rounded-2xl p-5 border border-cm-teal-100 text-center">
                <div className="text-xs font-semibold text-cm-teal uppercase tracking-wide mb-2">{p.grad}</div>
                <div className="h-serif text-2xl text-cm-ink mb-1">{p.betrag}</div>
                <div className="text-xs text-cm-ink/70">{p.info}</div>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-3 items-center">
            <Shield className="w-5 h-5 text-cm-teal flex-shrink-0" />
            <p className="text-sm text-cm-ink/70">
              CuraMain ist bei allen gesetzlichen Pflegekassen zugelassen. Wir unterstützen Sie auch bei der Antragstellung und bei Fragen zur Kostenübernahme.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="container pb-12 lg:pb-14">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-cm-teal">Häufige Fragen</span>
            <h2 className="h-serif text-4xl lg:text-5xl text-cm-ink mt-3">Fragen & Antworten.</h2>
          </div>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <div key={faq.q} className="bg-white rounded-2xl border border-cm-teal-100 p-6">
                <h3 className="font-semibold text-cm-ink mb-3">{faq.q}</h3>
                <p className="text-cm-ink/70 leading-relaxed text-sm">{faq.a}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 text-center">
            <Link href="/faq" className="inline-flex items-center gap-2 text-cm-teal hover:underline font-medium">
              Weitere Fragen im FAQ <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container pb-12 lg:pb-20">
        <div className="bg-cm-teal-50 rounded-3xl p-10 lg:p-12 text-center">
          <Clock className="w-8 h-8 text-cm-teal mx-auto mb-4" />
          <h2 className="h-serif text-3xl lg:text-4xl text-cm-ink mb-3">Jetzt Beratungsgespräch vereinbaren.</h2>
          <p className="text-cm-ink/70 mb-7 max-w-xl mx-auto">
            Kostenlos und unverbindlich – telefonisch, per E-Mail oder bei Ihnen zu Hause in Frankfurt.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/kontakt/patient"
              className="bg-cm-teal hover:bg-cm-teal-500 text-white px-7 py-3 rounded-full font-medium shadow-md inline-flex items-center gap-2 transition-colors"
            >
              Anfrage senden <ArrowRight className="w-4 h-4" />
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

      {/* KONTAKT */}
      <section className="container pb-12 lg:pb-20">
        <div className="bg-cm-ink text-white rounded-3xl p-10 lg:p-14">
          <h2 className="h-serif text-3xl lg:text-4xl mb-8">So erreichen Sie uns.</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="flex gap-4">
              <PhoneIcon className="w-6 h-6 text-cm-mint flex-shrink-0" />
              <div>
                <p className="font-medium mb-1">Telefon</p>
                <a href="tel:+496979216147" className="text-cm-mint hover:underline">069 / 79 216 147</a>
                <p className="text-white/70 text-sm mt-1">Mo–Fr 8:00–18:00 · Notfall 24/7</p>
              </div>
            </div>
            <div className="flex gap-4">
              <Mail className="w-6 h-6 text-cm-mint flex-shrink-0" />
              <div>
                <p className="font-medium mb-1">E-Mail</p>
                <a href="mailto:info@curamain.de" className="text-cm-mint hover:underline">info@curamain.de</a>
                <p className="text-white/70 text-sm mt-1">Antwort innerhalb von 24h</p>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
