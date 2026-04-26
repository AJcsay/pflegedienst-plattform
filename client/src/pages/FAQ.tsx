import { Link } from "wouter";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ArrowRight, Phone, HelpCircle } from "lucide-react";
import { useSEO } from "@/hooks/useSEO";
import { useState } from "react";
import faqData from "@/data/faq.json";

export default function FAQ() {
  const [activeCategory, setActiveCategory] = useState("pflegegrade");

  useSEO({
    title: "Häufige Fragen zur ambulanten Pflege – CuraMain Rhein-Main",
    description: "Antworten auf häufige Fragen rund um ambulante Pflege, Pflegegrade, Kosten, Leistungen und Antragstellung. CuraMain berät Sie kostenlos im Rhein-Main-Gebiet.",
    keywords: "Pflegedienst FAQ, Pflegegrad beantragen, Pflegekosten, ambulante Pflege Fragen, kultursensible Pflege, Verhinderungspflege, CuraMain",
    canonical: "https://www.curamain.de/faq",
  });

  const currentCategory = faqData.categories.find((cat) => cat.id === activeCategory);

  return (
    <div className="bg-cm-cream">
      {/* HERO */}
      <section
        className="relative min-h-[300px] hero-bg -mt-24 pt-24"
        style={{ background: "linear-gradient(135deg, #daedeb 0%, #f9f6f1 100%)" }}
      >
        <div className="relative z-10 container pt-6 pb-10 max-w-4xl">
          <span className="pill inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm border border-white/60 shadow-sm">
            <HelpCircle className="w-4 h-4 text-cm-teal" />
            Antworten zur ambulanten Pflege
          </span>
          <h1 className="h-serif text-5xl lg:text-7xl text-cm-teal mt-6 mb-6 leading-[1.05]">
            Häufige Fragen.
          </h1>
          <p className="text-lg text-cm-ink/80 max-w-2xl leading-relaxed">
            Hier finden Sie umfassende Antworten zu Pflegegraden, Kosten, Antragstellung und unseren Leistungen.
          </p>
        </div>
      </section>

      {/* KATEGORIEN-PILLS */}
      <section className="container py-10 max-w-4xl">
        <div className="flex flex-wrap gap-2">
          {faqData.categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                activeCategory === category.id
                  ? "bg-cm-teal text-white shadow-md"
                  : "bg-white border border-cm-teal-100 text-cm-ink hover:border-cm-teal-300"
              }`}
            >
              {category.title}
            </button>
          ))}
        </div>
      </section>

      {/* AKKORDEON */}
      <section className="container pb-12 max-w-4xl">
        {currentCategory && (
          <div className="mb-8">
            <h2 className="h-serif text-3xl lg:text-4xl text-cm-ink mb-2">{currentCategory.title}</h2>
            <p className="text-cm-ink/70 text-lg">{currentCategory.description}</p>
          </div>
        )}

        {currentCategory && (
          <Accordion type="single" collapsible className="space-y-3">
            {currentCategory.questions.map((faq) => (
              <AccordionItem
                key={faq.id}
                value={faq.id}
                className="bg-white border border-cm-teal-100 rounded-2xl px-6 data-[state=open]:shadow-md transition-shadow"
              >
                <AccordionTrigger className="text-left text-base font-medium py-5 hover:no-underline text-cm-ink">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-cm-ink/75 leading-relaxed pb-5">
                  <div className="whitespace-pre-wrap">
                    {faq.answer.split("\n\n").map((paragraph, idx) => (
                      <div key={idx} className="mb-4">
                        {paragraph.split("\n").map((line, lineIdx) => (
                          <div key={lineIdx} className="mb-2">
                            {line.startsWith("**") && line.endsWith("**") ? (
                              <strong className="text-cm-ink">{line.replace(/\*\*/g, "")}</strong>
                            ) : line.startsWith("✓") ? (
                              <div className="flex gap-2">
                                <span className="text-cm-teal">✓</span>
                                <span>{line.substring(1).trim()}</span>
                              </div>
                            ) : line.startsWith("|") ? (
                              <div className="my-4 overflow-x-auto">
                                <table className="w-full text-sm border-collapse">
                                  <tbody>
                                    {paragraph.split("\n").map(
                                      (row, rowIdx) =>
                                        row.startsWith("|") && (
                                          <tr key={rowIdx} className="border-b border-cm-teal-100">
                                            {row.split("|").slice(1, -1).map((cell: string, cellIdx: number) => (
                                              <td
                                                key={cellIdx}
                                                className={`px-3 py-2 text-left ${
                                                  rowIdx === 0 ? "font-bold text-cm-ink bg-cm-teal-50" : ""
                                                }`}
                                              >
                                                {cell.trim().replace(/---/g, "").replace(/:/g, "")}
                                              </td>
                                            ))}
                                          </tr>
                                        )
                                    )}
                                  </tbody>
                                </table>
                              </div>
                            ) : (
                              <p>{line}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </section>

      {/* CTA */}
      <section className="container pb-12 lg:pb-20 max-w-4xl">
        <div className="rounded-3xl bg-cm-teal-50 p-10 text-center">
          <h3 className="h-serif text-2xl lg:text-3xl text-cm-ink mb-3">Frage nicht beantwortet?</h3>
          <p className="text-cm-ink/70 mb-6">
            Wir beraten Sie kostenlos und unverbindlich. Mehrsprachig, telefonisch oder bei Ihnen zu Hause.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/kontakt/patient"
              className="bg-cm-teal hover:bg-cm-teal-500 text-white px-7 py-3 rounded-full font-medium shadow-md inline-flex items-center gap-2 transition-colors"
            >
              Beratung anfragen <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="tel:+4969792 16147"
              className="bg-white border border-cm-teal-100 hover:border-cm-teal-300 text-cm-ink px-7 py-3 rounded-full font-medium inline-flex items-center gap-2 transition-colors"
            >
              <Phone className="w-4 h-4 text-cm-teal" />
              069 / 79 216 147
            </a>
          </div>
        </div>
      </section>

      {/* FAQ Schema for Rich Snippets */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": faqData.categories.flatMap((category) =>
            category.questions.map((faq) => ({
              "@type": "Question",
              "name": faq.question,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer.replace(/\*\*/g, "").replace(/\n/g, " "),
              },
            }))
          ),
        })}
      </script>
    </div>
  );
}
