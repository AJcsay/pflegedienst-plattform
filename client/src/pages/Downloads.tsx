import { Link } from "wouter";
import { FileText, FileDown, Phone, Languages } from "lucide-react";
import { useSEO } from "@/hooks/useSEO";
import downloadsData from "@/data/downloads.json";
import type { Document } from "@/data/types";

const categoryLabels: Record<string, string> = {
  infoblatt: "Infoblatt",
  checkliste: "Checkliste",
  wegweiser: "Wegweiser",
  vorsorge: "Vorsorge",
  vorlage: "Vorlage zum Ausfüllen",
};

const categoryColors: Record<string, string> = {
  infoblatt: "bg-cm-teal-50 text-cm-teal-700",
  checkliste: "bg-green-50 text-green-700",
  wegweiser: "bg-amber-50 text-amber-700",
  vorsorge: "bg-indigo-50 text-indigo-700",
  vorlage: "bg-rose-50 text-rose-700",
};

const downloads: Document[] = (downloadsData as { downloads: Document[] }).downloads;

export default function Downloads() {
  useSEO({
    title: "Downloads & Ratgeber – Checklisten & Infoblätter zur Pflege | CuraMain",
    description:
      "Kostenlose Ratgeber von CuraMain Frankfurt: Checkliste Krankenhausentlassung, Wegweiser Pflegegrad, Patientenverfügung, Vorsorgevollmacht & mehr als PDF herunterladen.",
    keywords:
      "Pflege Downloads Frankfurt, Checkliste Krankenhausentlassung, Pflegegrad beantragen PDF, Patientenverfügung Wegweiser, Vorsorgevollmacht Infoblatt, Betreuungsverfügung, Pflegedienst Ratgeber, CuraMain Downloads",
    canonical: "https://www.curamain.de/downloads",
  });

  return (
    <div className="bg-cm-cream">
      <section
        className="relative min-h-[300px] hero-bg -mt-24 pt-24"
        style={{ background: "linear-gradient(135deg, #daedeb 0%, #f9f6f1 100%)" }}
      >
        <div className="relative z-10 container pt-6 pb-10">
          <span className="pill inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm border border-white/60 shadow-sm">
            <FileText className="w-4 h-4 text-cm-teal" />
            Kostenlos · Zum Ausdrucken & Abhaken
          </span>
          <h1 className="h-serif text-5xl lg:text-7xl text-cm-teal mt-6 mb-6 max-w-3xl leading-[1.05]">
            Downloads & Ratgeber.
          </h1>
          <p className="text-lg text-cm-ink/80 max-w-2xl leading-relaxed">
            Gute Pflege beginnt mit guten Informationen. Hier finden Sie unsere Checklisten,
            Wegweiser und Infoblätter für Patient·innen und Angehörige — kostenlos als PDF.
          </p>
        </div>
      </section>

      <section className="container py-12 lg:py-14">
        <h2 className="sr-only">Dokumente zum Download</h2>

        <div className="grid md:grid-cols-2 gap-5 max-w-4xl mx-auto">
          {downloads.map((doc) => (
            <a
              key={doc.id}
              href={doc.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white p-6 rounded-3xl border border-cm-teal-100 hover:shadow-md transition-shadow group flex items-start gap-4"
            >
              <div className="w-12 h-12 rounded-2xl bg-cm-teal-50 flex items-center justify-center flex-shrink-0">
                <FileText className="w-6 h-6 text-cm-teal" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-cm-ink mb-1 group-hover:text-cm-teal-600 transition-colors">
                  {doc.title}
                </h3>
                {doc.description && (
                  <p className="text-sm text-cm-ink/70 mb-2">{doc.description}</p>
                )}
                <div className="flex items-center gap-2 flex-wrap mb-2">
                  <span
                    className={`text-xs px-3 py-0.5 rounded-full ${
                      categoryColors[doc.category] || "bg-gray-50 text-gray-700"
                    }`}
                  >
                    {categoryLabels[doc.category] || doc.category}
                  </span>
                  <span className="text-xs text-cm-ink/50">PDF</span>
                </div>
                <span className="inline-flex items-center gap-1.5 text-sm text-cm-teal-600 font-medium">
                  <FileDown className="w-4 h-4" />
                  Kostenlos herunterladen
                </span>
              </div>
            </a>
          ))}
        </div>

        <div className="max-w-4xl mx-auto mt-10 bg-white rounded-3xl border border-cm-teal-100 p-8 lg:p-10">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-cm-teal-50 flex items-center justify-center flex-shrink-0">
              <Languages className="w-6 h-6 text-cm-teal" />
            </div>
            <div>
              <h2 className="h-serif text-2xl text-cm-ink mb-2">
                Lieber persönlich — und in Ihrer Sprache?
              </h2>
              <p className="text-cm-ink/75 leading-relaxed mb-5">
                Jedes dieser Themen erklären wir Ihnen gern in Ruhe bei Ihnen zu Hause —
                auf Deutsch, Englisch, Spanisch oder Arabisch. Das Erstgespräch ist
                kostenlos und unverbindlich.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/kontakt/patient"
                  className="bg-cm-teal text-white px-6 py-3 rounded-full text-sm font-medium shadow-md hover:bg-cm-teal-600 transition-colors"
                >
                  Kostenlose Beratung anfragen
                </Link>
                <a
                  href="tel:+496979216147"
                  className="inline-flex items-center gap-2 bg-white border border-cm-teal-200 hover:border-cm-teal-300 px-6 py-3 rounded-full text-sm font-medium text-cm-ink transition-colors"
                >
                  <Phone className="w-4 h-4 text-cm-teal" />
                  069 / 79 216 147
                </a>
              </div>
            </div>
          </div>
        </div>

        <p className="max-w-4xl mx-auto mt-6 text-xs text-cm-ink/50 leading-relaxed">
          Hinweis: Alle Angaben mit Stand Juni 2026, sorgfältig recherchiert und ohne Gewähr.
          Leistungsbeträge der Pflegeversicherung können sich durch Gesetzesänderungen anpassen —
          die jeweils aktuellen Werte nennen wir Ihnen gern im Gespräch. Die Vorlagen zur Vorsorge
          basieren auf den amtlichen Mustern und Textbausteinen des Bundesministeriums der Justiz
          (www.bmj.de) und ersetzen keine Rechtsberatung — bei komplexen Konstellationen wenden Sie
          sich an Notariat, Rechtsanwält·innen oder einen anerkannten Betreuungsverein.
        </p>
      </section>
    </div>
  );
}
