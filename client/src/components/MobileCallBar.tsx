import { Link, useLocation } from "wouter";
import { Phone, Calendar } from "lucide-react";

/**
 * Persistente CTA-Leiste am unteren Bildschirmrand auf Mobilgeräten.
 * Wird auf der Kontaktseite ausgeblendet (Doppelung), und auf Legal-Seiten reduziert.
 */
export default function MobileCallBar() {
  const [location] = useLocation();

  // Auf der Kontaktseite zeigen wir die Leiste nicht (Nutzer ist bereits am Ziel).
  if (location === "/kontakt/patient") return null;

  return (
    <div
      className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur border-t border-cm-teal-100 shadow-[0_-4px_16px_rgba(28,40,38,0.06)] pb-[env(safe-area-inset-bottom)]"
      role="region"
      aria-label="Schnellkontakt"
    >
      <div className="flex gap-2 p-2.5">
        <a
          href="tel:+496979216147"
          className="flex-1 flex items-center justify-center gap-2 bg-white border border-cm-teal-200 text-cm-ink rounded-full px-4 py-3 font-medium min-h-[48px] hover:bg-cm-teal-50 transition-colors"
          aria-label="Jetzt anrufen unter 069 79 216 147"
        >
          <Phone className="w-4 h-4 text-cm-teal-700" aria-hidden="true" />
          Anrufen
        </a>
        <Link
          href="/kontakt/patient"
          className="flex-1 flex items-center justify-center gap-2 bg-cm-teal-600 hover:bg-cm-teal-700 text-white rounded-full px-4 py-3 font-medium min-h-[48px] transition-colors"
        >
          <Calendar className="w-4 h-4" aria-hidden="true" />
          Erstgespräch
        </Link>
      </div>
    </div>
  );
}
