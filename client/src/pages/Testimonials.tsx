import { useEffect, useRef } from "react";
import { useSEO } from "@/hooks/useSEO";
import { Star, ExternalLink } from "lucide-react";

/**
 * Testimonials laufen über Google Reviews + Trustindex-Widget.
 *
 * Ablauf:
 *   1. Google-Business-Profil verifiziert
 *   2. Trustindex-Account verbindet das Profil
 *   3. Hier wird ein <script>-Snippet mit der Widget-ID injiziert
 *
 * Widget-ID setzen via Vite-Env: VITE_TRUSTINDEX_WIDGET_ID="abc123"
 * Solange keine ID vorhanden ist, zeigen wir einen DSGVO-freundlichen Fallback.
 */
const TRUSTINDEX_ID = import.meta.env.VITE_TRUSTINDEX_WIDGET_ID as string | undefined;
const GOOGLE_REVIEW_URL = import.meta.env.VITE_GOOGLE_REVIEW_URL as string | undefined;

export default function Testimonials() {
  useSEO({
    title: "Bewertungen & Testimonials – CuraMain",
    description: "Lesen Sie echte Bewertungen unserer Patient·innen auf Google. CuraMain – ambulanter Pflegedienst Rhein-Main-Gebiet.",
    keywords: "Bewertungen Pflegedienst, Google Reviews CuraMain, Erfahrungen ambulanter Pflegedienst",
    canonical: "https://www.curamain.de/testimonials",
  });

  const widgetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!TRUSTINDEX_ID || !widgetRef.current) return;
    const existing = document.querySelector<HTMLScriptElement>(
      `script[data-trustindex-id="${TRUSTINDEX_ID}"]`,
    );
    if (existing) return;

    const script = document.createElement("script");
    script.src = `https://cdn.trustindex.io/loader.js?${TRUSTINDEX_ID}`;
    script.async = true;
    script.defer = true;
    script.dataset.trustindexId = TRUSTINDEX_ID;
    widgetRef.current.appendChild(script);
  }, []);

  return (
    <div className="bg-cm-cream">
      {/* HERO */}
      <section
        className="relative min-h-[300px] hero-bg -mt-24 pt-24"
        style={{ background: "linear-gradient(135deg, #daedeb 0%, #f9f6f1 100%)" }}
      >
        <div className="relative z-10 container pt-6 pb-10">
          <span className="pill inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm border border-white/60 shadow-sm">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            Echte Stimmen unserer Patient·innen
          </span>
          <h1 className="h-serif text-5xl lg:text-7xl text-cm-teal mt-6 mb-6 max-w-3xl leading-[1.05]">
            Echte Stimmen.<br />Echte Erfahrungen.
          </h1>
          <p className="text-lg text-cm-ink/80 max-w-2xl leading-relaxed">
            Erfahren Sie, was unsere Patient·innen und ihre Angehörigen über uns sagen — direkt aus Google.
          </p>
        </div>
      </section>

      <div className="container py-12 lg:py-14">
        {TRUSTINDEX_ID ? (
          <div ref={widgetRef} className="min-h-[400px]" />
        ) : (
          <div className="bg-white rounded-3xl border border-cm-teal-100 p-10 lg:p-14 text-center max-w-2xl mx-auto">
            <Star className="w-12 h-12 text-yellow-400 fill-yellow-400 mx-auto mb-5" />
            <h2 className="h-serif text-3xl text-cm-ink mb-3">
              Bewertungen folgen in Kürze
            </h2>
            <p className="text-cm-ink/70 leading-relaxed mb-7">
              Wir sammeln aktuell Google-Bewertungen unserer Patient·innen und ihrer Angehörigen.
              Sobald die ersten freigegeben sind, erscheinen sie hier automatisch.
            </p>
            {GOOGLE_REVIEW_URL && (
              <a
                href={GOOGLE_REVIEW_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-cm-teal hover:bg-cm-teal-500 text-white px-6 py-3 rounded-full font-medium transition-colors"
              >
                Jetzt Google-Bewertung schreiben
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
