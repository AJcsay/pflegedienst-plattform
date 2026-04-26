import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { FileText, FileDown, ArrowRight, Lock } from "lucide-react";
import { useSEO } from "@/hooks/useSEO";

const PartnerTabs = ({ active }: { active: string }) => (
  <div className="flex flex-wrap gap-2 mb-10 justify-center">
    {[
      { id: "zuweiser", label: "Patientenüberleitung", href: "/partner/zuweiser" },
      { id: "kapazitaet", label: "Kapazitätsabfrage", href: "/partner/kapazitaet" },
      { id: "kassen", label: "Kassen & Kooperation", href: "/partner/kassen" },
      { id: "dokumente", label: "Dokumente", href: "/partner/dokumente" },
    ].map((t) =>
      active === t.id ? (
        <button key={t.id} className="bg-cm-teal text-white px-5 py-2.5 rounded-full text-sm font-medium shadow-md">
          {t.label}
        </button>
      ) : (
        <Link
          key={t.id}
          href={t.href}
          className="bg-white border border-cm-teal-100 hover:border-cm-teal-300 px-5 py-2.5 rounded-full text-sm font-medium text-cm-ink transition-colors"
        >
          {t.label}
        </Link>
      )
    )}
  </div>
);

const categoryLabels: Record<string, string> = {
  quality: "Qualität",
  supply: "Versorgung",
  contract: "Vertrag",
  other: "Sonstiges",
};

const categoryColors: Record<string, string> = {
  quality: "bg-green-50 text-green-700",
  supply: "bg-cm-teal-50 text-cm-teal-700",
  contract: "bg-amber-50 text-amber-700",
  other: "bg-gray-50 text-gray-700",
};

export default function PartnerDokumente() {
  useSEO({
    title: "Partner-Dokumente & Qualitätsunterlagen – CuraMain",
    description: "Qualitätsunterlagen & Versorgungsdokumente von CuraMain im Rhein-Main-Gebiet. Kooperationsverträge, Zertifikate & Leistungsunterlagen für Partner zum Download.",
    keywords: "CuraMain Qualitätsunterlagen, Pflegedienst Dokumente Rhein-Main, Kooperationsvertrag Pflege Rhein-Main-Gebiet",
    canonical: "https://www.curamain.de/partner/dokumente",
  });

  const { user, loading: authLoading } = useAuth();
  const { data: documents, isLoading } = trpc.documents.list.useQuery();

  if (authLoading) {
    return (
      <div className="bg-cm-cream min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 rounded-full border-4 border-cm-teal border-t-transparent animate-spin mx-auto mb-4" />
          <p className="text-cm-ink/60">Wird geladen …</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bg-cm-cream min-h-[60vh] flex items-center justify-center py-20">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-full bg-cm-teal-50 flex items-center justify-center mx-auto mb-5">
            <Lock className="h-8 w-8 text-cm-teal" />
          </div>
          <h2 className="h-serif text-3xl text-cm-ink mb-3">Anmeldung erforderlich</h2>
          <p className="text-cm-ink/70 mb-6">
            Der Zugriff auf Partner-Dokumente ist nur für angemeldete Benutzer verfügbar.
          </p>
          <a
            href={getLoginUrl()}
            className="inline-flex items-center gap-2 bg-cm-teal hover:bg-cm-teal-500 text-white px-6 py-3 rounded-full font-medium transition-colors"
          >
            Anmelden <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-cm-cream">
      <section
        className="relative min-h-[300px] hero-bg -mt-24 pt-24"
        style={{ background: "linear-gradient(135deg, #daedeb 0%, #f9f6f1 100%)" }}
      >
        <div className="relative z-10 container pt-6 pb-10">
          <span className="pill inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm border border-white/60 shadow-sm">
            <FileText className="w-4 h-4 text-cm-teal" />
            Stets aktuell · DSGVO-konform
          </span>
          <h1 className="h-serif text-5xl lg:text-7xl text-cm-teal mt-6 mb-6 max-w-3xl leading-[1.05]">
            Qualitäts- & Versorgungsunterlagen.
          </h1>
          <p className="text-lg text-cm-ink/80 max-w-2xl leading-relaxed">
            Hier finden Sie alle relevanten Dokumente für die Zusammenarbeit mit CuraMain.
          </p>
        </div>
      </section>

      <section className="container py-12 lg:py-14">
        <PartnerTabs active="dokumente" />

        {isLoading ? (
          <div className="space-y-4 max-w-3xl mx-auto">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white p-6 rounded-3xl border border-cm-teal-100 animate-pulse">
                <div className="h-5 bg-cm-teal-50 rounded w-1/3 mb-2" />
                <div className="h-4 bg-cm-teal-50 rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : documents && documents.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-5 max-w-4xl mx-auto">
            {documents.map((doc) => (
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
                        categoryColors[doc.category] || categoryColors.other
                      }`}
                    >
                      {categoryLabels[doc.category] || doc.category}
                    </span>
                    {doc.fileName && (
                      <span className="text-xs text-cm-ink/50">{doc.fileName}</span>
                    )}
                    {doc.fileSize && (
                      <span className="text-xs text-cm-ink/50">
                        · {(doc.fileSize / 1024 / 1024).toFixed(1)} MB
                      </span>
                    )}
                  </div>
                  <span className="inline-flex items-center gap-1.5 text-sm text-cm-teal-600 font-medium">
                    <FileDown className="w-4 h-4" />
                    Download
                  </span>
                </div>
              </a>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 max-w-2xl mx-auto bg-white rounded-3xl border border-cm-teal-100">
            <FileText className="w-12 h-12 text-cm-teal-200 mx-auto mb-4" />
            <h3 className="h-serif text-2xl text-cm-ink mb-2">Aktuell keine Dokumente verfügbar</h3>
            <p className="text-cm-ink/70">
              Wenden Sie sich an unser Team, falls Sie spezifische Unterlagen benötigen.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
