import { useEffect, useState } from "react";
import { Link } from "wouter";

const STORAGE_KEY = "cm-consent-v1";

declare global {
  interface Window {
    __loadAnalytics?: () => void;
  }
}

export default function ConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const v = localStorage.getItem(STORAGE_KEY);
      if (!v) setVisible(true);
    } catch {
      setVisible(true);
    }
  }, []);

  if (!visible) return null;

  const decide = (accept: boolean) => {
    try {
      localStorage.setItem(STORAGE_KEY, accept ? "accepted" : "rejected");
    } catch {}
    if (accept && typeof window.__loadAnalytics === "function") {
      window.__loadAnalytics();
    }
    setVisible(false);
  };

  return (
    <div
      role="dialog"
      aria-labelledby="consent-title"
      aria-describedby="consent-desc"
      className="fixed bottom-0 inset-x-0 z-[60] p-3 sm:p-5"
    >
      <div className="mx-auto max-w-3xl bg-white rounded-3xl shadow-[0_8px_32px_rgba(28,40,38,0.18)] border border-cm-teal-100 p-5 sm:p-6">
        <h2 id="consent-title" className="font-semibold text-cm-ink mb-1.5">
          Wir respektieren Ihre Privatsphäre
        </h2>
        <p id="consent-desc" className="text-sm text-cm-ink/70 leading-relaxed">
          Wir nutzen Cookies und Google Analytics, um unsere Seite zu verbessern.
          Sie können selbst entscheiden – beide Optionen sind gleichwertig. Mehr in der{" "}
          <Link href="/datenschutz" className="underline hover:text-cm-teal-700">
            Datenschutzerklärung
          </Link>
          .
        </p>
        <div className="mt-4 flex flex-col sm:flex-row gap-2.5">
          <button
            type="button"
            onClick={() => decide(false)}
            className="flex-1 px-5 py-3 rounded-full font-medium border border-cm-teal-200 text-cm-ink hover:bg-cm-teal-50 min-h-[44px] transition-colors"
          >
            Ablehnen
          </button>
          <button
            type="button"
            onClick={() => decide(true)}
            className="flex-1 px-5 py-3 rounded-full font-medium bg-cm-teal-600 hover:bg-cm-teal-700 text-white min-h-[44px] transition-colors"
          >
            Akzeptieren
          </button>
        </div>
      </div>
    </div>
  );
}
