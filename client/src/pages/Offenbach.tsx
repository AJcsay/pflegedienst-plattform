import { Link } from "wouter";
import { MapPin, PhoneIcon, Mail, ArrowRight, CheckCircle, Languages, Shield, Clock } from "lucide-react";
import { useSEO } from "@/hooks/useSEO";
import { useEffect } from "react";

export default function Offenbach() {
  useSEO({
    title: "Ambulanter Pflegedienst Offenbach am Main | CuraMain",
    description:
      "CuraMain Pflegedienst betreut Pflegebedürftige in Offenbach am Main und Umgebung. Häusliche Pflege, Behandlungspflege, Betreuung – mehrsprachig & individuell.",
    keywords:
      "Pflegedienst Offenbach, ambulante Pflege Offenbach am Main, häusliche Pflege Offenbach, Pflegekasse Offenbach, Behandlungspflege Offenbach",
    canonical: "https://www.curamain.de/offenbach",
  });

  useEffect(() => {
    const schema = {
      "@context": "https://schema.org",
      "@type": "MedicalBusiness",
      name: "CuraMain GmbH",
      url: "https://www.curamain.de",
      telephone: "+496979216147",
      email: "info@curamain.de",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Bergerstraße 69",
        addressLocality: "Frankfurt am Main",
        postalCode: "60316",
        addressCountry: "DE",
      },
      areaServed: [
        { "@type": "City", name: "Offenbach am Main" },
        { "@type": "City", name: "Frankfurt am Main" },
      ],
    };

    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Bietet CuraMain Pflege in Offenbach am Main an?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Ja. CuraMain Pflegedienst hat seinen Sitz in Frankfurt am Main und versorgt auch Pflegebedürftige in Offenbach am Main und den angrenzenden Stadtteilen. Unser Team kommt direkt zu Ihnen nach Hause.",
          },
        },
        {
          "@type": "Question",
          name: "Welche Leistungen bietet CuraMain in Offenbach an?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Wir bieten häusliche Grundpflege, Behandlungspflege nach SGB XI und SGB V, Betreuungsleistungen sowie kultursensible Pflege in mehreren Sprachen an.",
          },
        },
        {
          "@type": "Question",
          name: "Wie schnell kann die Pflege in Offenbach starten?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "In der Regel können wir innerhalb weniger Tage nach dem ersten Beratungsgespräch mit der Pflege beginnen. Kontaktieren Sie uns für eine unverbindliche Erstberatung.",
          },
        },
        {
          "@type": "Question",
          name: "Übernimmt die Pflegekasse die Kosten für Pflege in Offenbach?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Ja, sofern ein anerkannter Pflegegrad vorliegt, übernimmt die gesetzliche Pflegekasse die Kosten für ambulante Pflegeleistungen bis zur Höhe der jeweiligen Sachleistungsbeträge nach § 36 SGB XI.",
          },
        },
        {
          "@type": "Question",
          name: "Spricht das Pflegeteam auch andere Sprachen als Deutsch?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Unser Team ist international aufgestellt und vielsprachig im Alltag. Wir legen großen Wert auf kultursensible Pflege.",
          },
        },
      ],
    };

    const scriptMain = document.createElement("script");
    scriptMain.type = "application/ld+json";
    scriptMain.id = "offenbach-schema";
    scriptMain.textContent = JSON.stringify(schema);
    document.head.appendChild(scriptMain);

    const scriptFaq = document.createElement("script");
    scriptFaq.type = "application/ld+json";
    scriptFaq.id = "offenbach-faq-schema";
    scriptFaq.textContent = JSON.stringify(faqSchema);
    document.head.appendChild(scriptFaq);

    return () => {
      document.getElementById("offenbach-schema")?.remove();
      document.getElementById("offenbach-faq-schema")?.remove();
    };
  }, []);

  const leistungen = [
    {
      icon: <Shield className="w-6 h-6 text-cm-teal" />,
      title: "Grundpflege",
      text: "Körperpflege, An- und Auskleiden sowie Unterstützung bei der Ernährung – individuell und würdevoll.",
    },
    {
      icon: <Clock className="w-6 h-6 text-cm-teal" />,
      title: "Behandlungspflege",
      text: "Medizinische Leistungen wie Wundversorgung, Medikamentengabe und Injektionen auf ärztliche Anordnung.",
    },
    {
      icon: <CheckCircle className="w-6 h-6 text-cm-teal" />,
      title: "Betreuungsleistungen",
      text: "Gesellschaft, Alltagsbegleitung und Unterstützung nach § 45b SGB XI für mehr Lebensqualität.",
    },
    {
      icon: <Languages className="w-6 h-6 text-cm-teal" />,
      title: "Kultursensible Pflege",
      text: "Vielsprachiges Team — Vertrauen durch Verständnis.",
    },
    {
      icon: <MapPin className="w-6 h-6 text-cm-teal" />,
      title: "Hausbesuche in Offenbach",
      text: "Unser Team kommt direkt zu Ihnen. Wir versorgen Pflegebedürftige in Offenbach und Umgebung.",
    },
  ];

  const pflegegrade = [
    { grad: 1, betrag: "125 €", info: "Eingeschränkte Alltagskompetenz" },
    { grad: 2, betrag: "724 €", info: "Erhebliche Beeinträchtigung" },
    { grad: 3, betrag: "1.363 €", info: "Schwere Beeinträchtigung" },
    { grad: 4, betrag: "1.693 €", info: "Schwerste Beeinträchtigung" },
    { grad: 5, betrag: "2.095 €", info: "Besondere Pflegebedürftigkeit" },
  ];

  const faqItems = [
    {
      frage: "Bietet CuraMain Pflege in Offenbach am Main an?",
      antwort:
        "Ja. CuraMain hat seinen Sitz in Frankfurt am Main und versorgt auch Pflegebedürftige in Offenbach am Main und den angrenzenden Stadtteilen. Unser Team kommt direkt zu Ihnen nach Hause.",
    },
    {
      frage: "Welche Leistungen bietet CuraMain in Offenbach an?",
      antwort:
        "Wir bieten häusliche Grundpflege, Behandlungspflege nach SGB XI und SGB V, Betreuungsleistungen sowie kultursensible Pflege in mehreren Sprachen an.",
    },
    {
      frage: "Wie schnell kann die Pflege in Offenbach starten?",
      antwort:
        "In der Regel können wir innerhalb weniger Tage nach dem ersten Beratungsgespräch mit der Pflege beginnen. Kontaktieren Sie uns für eine unverbindliche Erstberatung.",
    },
    {
      frage: "Übernimmt die Pflegekasse die Kosten für Pflege in Offenbach?",
      antwort:
        "Ja, sofern ein anerkannter Pflegegrad vorliegt, übernimmt die gesetzliche Pflegekasse die Kosten für ambulante Pflegeleistungen bis zur Höhe der jeweiligen Sachleistungsbeträge nach § 36 SGB XI.",
    },
    {
      frage: "Spricht das Pflegeteam auch andere Sprachen als Deutsch?",
      antwort:
        "Unser Team ist international aufgestellt und vielsprachig im Alltag. Wir legen großen Wert auf kultursensible Pflege.",
    },
  ];

  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-cm-cream py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block bg-cm-teal text-white text-sm font-medium px-4 py-1 rounded-full mb-6">
            Ambulante Pflege · Offenbach am Main
          </span>
          <h1 className="h-serif text-4xl md:text-5xl text-cm-ink font-bold leading-tight mb-6">
            Ambulanter Pflegedienst<br />Offenbach am Main
          </h1>
          <p className="text-lg text-cm-ink/70 max-w-2xl mx-auto mb-8">
            CuraMain Pflegedienst versorgt Pflegebedürftige in Offenbach am Main
            und den angrenzenden Stadtteilen. Wir kommen direkt zu Ihnen nach
            Hause – zuverlässig, mehrsprachig und auf Augenhöhe.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/kontakt/patient"
              className="bg-cm-teal text-white px-8 py-3 rounded-full font-medium hover:bg-cm-teal/90 transition-colors inline-flex items-center gap-2"
            >
              Jetzt Beratung anfragen <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="tel:+496979216147"
              className="border border-cm-teal text-cm-teal px-8 py-3 rounded-full font-medium hover:bg-cm-teal/5 transition-colors inline-flex items-center gap-2"
            >
              <PhoneIcon className="w-4 h-4" /> 069 79216147
            </a>
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto prose prose-lg text-cm-ink/80">
          <h2 className="h-serif text-3xl text-cm-ink font-bold mb-6">
            Häusliche Pflege in Offenbach am Main
          </h2>
          <p>
            Offenbach am Main und Frankfurt am Main liegen direkt nebeneinander –
            deshalb versorgt CuraMain Pflegedienst auch Pflegebedürftige in
            Offenbach. Unser Team ist von Frankfurt aus schnell bei Ihnen und
            bietet dieselbe Qualität wie in unserem Kerngebiet.
          </p>
          <p>
            Ob Unterstützung bei der Körperpflege, medizinische
            Behandlungspflege oder einfach eine verlässliche Begleitung im
            Alltag – wir passen unsere Leistungen an Ihre Bedürfnisse an.
            Ein anerkannter Pflegegrad ist Voraussetzung für die Kostenübernahme
            durch die Pflegekasse; wir beraten Sie gerne bei allen Fragen rund
            um Pflegegrade und Leistungsansprüche.
          </p>
          <p>
            Unser mehrsprachiges Team ermöglicht es, Pflegebedürftige und
            Angehörige in ihrer jeweiligen Muttersprache zu betreuen. Das schafft
            Vertrauen – gerade in einer so persönlichen Situation wie der
            häuslichen Pflege.
          </p>
        </div>
      </section>

      {/* Leistungen */}
      <section className="bg-cm-mint py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="h-serif text-3xl text-cm-ink font-bold text-center mb-12">
            Unsere Leistungen in Offenbach
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {leistungen.map((l, i) => (
              <div
                key={i}
                className="bg-white rounded-3xl p-6 shadow-sm border border-cm-teal-100"
              >
                <div className="mb-4">{l.icon}</div>
                <h3 className="font-semibold text-cm-ink text-lg mb-2">
                  {l.title}
                </h3>
                <p className="text-cm-ink/70 text-sm">{l.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pflegegrade */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="h-serif text-3xl text-cm-ink font-bold text-center mb-4">
            Sachleistungsbeträge nach § 36 SGB XI
          </h2>
          <p className="text-center text-cm-ink/70 mb-10 text-sm">
            Diese Beträge gelten für ambulante Pflegesachleistungen. Ihre
            Pflegekasse übernimmt die Kosten bis zu den jeweiligen Höchstgrenzen.
          </p>
          <div className="overflow-hidden rounded-3xl border border-cm-teal-100">
            <table className="w-full text-sm">
              <thead className="bg-cm-teal text-white">
                <tr>
                  <th className="text-left px-6 py-4 font-medium">Pflegegrad</th>
                  <th className="text-left px-6 py-4 font-medium">Sachleistung / Monat</th>
                  <th className="text-left px-6 py-4 font-medium">Beschreibung</th>
                </tr>
              </thead>
              <tbody>
                {pflegegrade.map((p, i) => (
                  <tr
                    key={p.grad}
                    className={i % 2 === 0 ? "bg-white" : "bg-cm-cream/40"}
                  >
                    <td className="px-6 py-4 font-semibold text-cm-teal">
                      Grad {p.grad}
                    </td>
                    <td className="px-6 py-4 font-medium text-cm-ink">
                      {p.betrag}
                    </td>
                    <td className="px-6 py-4 text-cm-ink/70">{p.info}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-cm-cream py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="h-serif text-3xl text-cm-ink font-bold text-center mb-10">
            Häufige Fragen – Pflege in Offenbach am Main
          </h2>
          <div className="space-y-4">
            {faqItems.map((f, i) => (
              <div
                key={i}
                className="bg-white rounded-3xl p-6 border border-cm-teal-100"
              >
                <h3 className="font-semibold text-cm-ink mb-2">{f.frage}</h3>
                <p className="text-cm-ink/70 text-sm leading-relaxed">
                  {f.antwort}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="h-serif text-3xl text-cm-ink font-bold mb-4">
            Pflege in Offenbach anfragen
          </h2>
          <p className="text-cm-ink/70 mb-8">
            Kontaktieren Sie uns für ein unverbindliches Erstgespräch. Wir
            beraten Sie zu Pflegegraden, Leistungsansprüchen und unserem Angebot
            in Offenbach am Main.
          </p>
          <Link
            href="/kontakt/patient"
            className="bg-cm-teal text-white px-10 py-4 rounded-full font-medium hover:bg-cm-teal/90 transition-colors inline-flex items-center gap-2 text-lg"
          >
            Jetzt Kontakt aufnehmen <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Kontakt dark */}
      <section className="bg-cm-ink text-white py-16 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="flex flex-col items-center gap-3">
            <PhoneIcon className="w-7 h-7 text-cm-teal" />
            <p className="font-medium">Telefon</p>
            <a
              href="tel:+496979216147"
              className="text-cm-teal hover:underline"
            >
              069 79216147
            </a>
          </div>
          <div className="flex flex-col items-center gap-3">
            <Mail className="w-7 h-7 text-cm-teal" />
            <p className="font-medium">E-Mail</p>
            <a
              href="mailto:info@curamain.de"
              className="text-cm-teal hover:underline"
            >
              info@curamain.de
            </a>
          </div>
          <div className="flex flex-col items-center gap-3">
            <MapPin className="w-7 h-7 text-cm-teal" />
            <p className="font-medium">Adresse</p>
            <address className="not-italic text-white/70 text-sm">
              Bergerstraße 69<br />60316 Frankfurt am Main
            </address>
          </div>
        </div>
      </section>
    </main>
  );
}
