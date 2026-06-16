import { useState } from "react";
import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { CheckCircle2, ArrowRight, Users, Shield, Heart } from "lucide-react";
import { submitContact } from "@/lib/api";
import HoneypotField from "@/components/HoneypotField";

// Trust-Punkte (Reihenfolge entspricht i18n home.quickContact.points)
const POINT_ICONS = [Users, Shield, Heart];

/**
 * Kompaktes Inline-Schnellkontakt-Formular für die Startseite.
 * Nutzt denselben Endpunkt + dieselbe DSGVO-/Honeypot-/gtag-Logik wie
 * KontaktPatient (submitContact, category "patient"). Sprachregel-konform:
 * keine Einzelsprachen, BEEP („Pflegeteam"/„Pflegefachperson").
 */
export default function QuickContact() {
  const { t } = useTranslation();

  const points = t("home.quickContact.points", { returnObjects: true }) as string[];

  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "", consent: false });
  const [website, setWebsite] = useState(""); // Honeypot
  const [submitted, setSubmitted] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!form.phone && !form.email) {
      setError(t("kontakt.form.errorNoContact"));
      return;
    }
    if (!form.consent) {
      setError(t("kontakt.form.errorNoConsent"));
      return;
    }
    if (window.gtag) {
      window.gtag("event", "contact_patient_submission", {
        event_category: "engagement",
        event_label: "Home Quick Contact",
        value: 1,
      });
    }
    setPending(true);
    const [first, ...rest] = form.name.trim().split(/\s+/);
    const result = await submitContact({
      firstName: first || form.name,
      lastName: rest.join(" ") || "-",
      email: form.email,
      phone: form.phone || undefined,
      message: form.message,
      category: "patient",
      website,
    });
    setPending(false);
    if (result.success) {
      setSubmitted(true);
      toast.success(t("kontakt.form.successToast"));
    } else {
      setError(t("kontakt.form.errorSending") + result.error);
      toast.error(t("kontakt.form.errorToast") + result.error);
    }
  };

  return (
    <section className="container pb-12 lg:pb-20">
      <div className="grid lg:grid-cols-2 gap-8 lg:gap-10 items-stretch bg-cm-cream rounded-3xl p-6 sm:p-8 lg:p-12">
        {/* Links: Pitch + Trust-Punkte */}
        <div className="flex flex-col justify-center">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-cm-teal">
            {t("home.quickContact.label")}
          </span>
          <h2 className="text-3xl lg:text-4xl font-semibold text-cm-navy mt-3 mb-4 tracking-tight">
            {t("home.quickContact.h2")}
          </h2>
          <p className="text-cm-ink/70 leading-relaxed mb-6 max-w-md">
            {t("home.quickContact.p")}
          </p>
          <ul className="space-y-3">
            {points.map((p, i) => {
              const Icon = POINT_ICONS[i] ?? CheckCircle2;
              return (
                <li key={p} className="flex items-center gap-3 text-cm-ink">
                  <span className="w-9 h-9 rounded-xl bg-cm-teal-50 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-cm-teal" aria-hidden="true" />
                  </span>
                  <span className="font-medium">{p}</span>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Rechts: Formular-Karte */}
        <div className="bg-white rounded-2xl border border-cm-teal-100 p-6 sm:p-8">
          {submitted ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-8">
              <div className="w-14 h-14 rounded-full bg-cm-teal-50 flex items-center justify-center mb-4">
                <CheckCircle2 className="h-7 w-7 text-cm-teal" aria-hidden="true" />
              </div>
              <h3 className="text-2xl font-semibold text-cm-navy mb-2">{t("home.quickContact.successH2")}</h3>
              <p className="text-cm-ink/70 leading-relaxed max-w-sm">{t("home.quickContact.successP")}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div>
                <h3 className="text-lg font-semibold text-cm-ink">{t("home.quickContact.formTitle")}</h3>
                <p className="text-sm text-cm-ink/70 mt-1">{t("home.quickContact.formHint")}</p>
              </div>
              <HoneypotField value={website} onChange={setWebsite} />
              <div>
                <label htmlFor="qc-name" className="text-sm font-medium text-cm-ink/80 mb-1.5 block">
                  {t("home.quickContact.name")} <span aria-hidden="true">*</span>
                </label>
                <input
                  id="qc-name"
                  required
                  autoComplete="name"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder={t("home.quickContact.namePlaceholder")}
                  className="w-full px-4 py-3 rounded-xl border border-cm-teal-100 focus:border-cm-teal-300 focus:ring-2 focus:ring-cm-teal-100 outline-none transition"
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="qc-phone" className="text-sm font-medium text-cm-ink/80 mb-1.5 block">
                    {t("home.quickContact.phone")} <span aria-hidden="true">*</span>
                  </label>
                  <input
                    id="qc-phone"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    value={form.phone}
                    onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                    placeholder={t("home.quickContact.phonePlaceholder")}
                    aria-describedby="qc-help"
                    className="w-full px-4 py-3 rounded-xl border border-cm-teal-100 focus:border-cm-teal-300 focus:ring-2 focus:ring-cm-teal-100 outline-none transition"
                  />
                </div>
                <div>
                  <label htmlFor="qc-email" className="text-sm font-medium text-cm-ink/80 mb-1.5 block">
                    {t("home.quickContact.email")}{" "}
                    <span className="text-cm-ink/50">{t("home.quickContact.emailOptional")}</span>
                  </label>
                  <input
                    id="qc-email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    placeholder={t("home.quickContact.emailPlaceholder")}
                    aria-describedby="qc-help"
                    className="w-full px-4 py-3 rounded-xl border border-cm-teal-100 focus:border-cm-teal-300 focus:ring-2 focus:ring-cm-teal-100 outline-none transition"
                  />
                </div>
              </div>
              <p id="qc-help" className="text-xs text-cm-ink/70">{t("home.quickContact.contactHelp")}</p>
              <div>
                <label htmlFor="qc-message" className="text-sm font-medium text-cm-ink/80 mb-1.5 block">
                  {t("home.quickContact.message")} <span aria-hidden="true">*</span>
                </label>
                <textarea
                  id="qc-message"
                  required
                  rows={3}
                  value={form.message}
                  onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                  placeholder={t("home.quickContact.messagePlaceholder")}
                  className="w-full px-4 py-3 rounded-xl border border-cm-teal-100 focus:border-cm-teal-300 focus:ring-2 focus:ring-cm-teal-100 outline-none transition"
                />
              </div>
              <label className="flex items-start gap-3 text-sm text-cm-ink/80 leading-relaxed">
                <input
                  type="checkbox"
                  required
                  checked={form.consent}
                  onChange={(e) => setForm((f) => ({ ...f, consent: e.target.checked }))}
                  className="mt-1 w-5 h-5 rounded border-cm-teal-300 text-cm-teal-700 focus:ring-2 focus:ring-cm-teal-300"
                />
                <span>
                  {t("kontakt.form.consent").split("<1>")[0]}
                  <Link href="/datenschutz" className="underline hover:text-cm-teal-700">
                    {t("kontakt.form.consent").split("<1>")[1]?.split("</1>")[0]}
                  </Link>
                  {t("kontakt.form.consent").split("</1>")[1]}{" "}
                  <span aria-hidden="true">*</span>
                </span>
              </label>
              <div role="status" aria-live="polite" className="min-h-[1.25rem] text-sm">
                {error && <span className="text-red-600">{error}</span>}
                {pending && <span className="text-cm-ink/70">{t("kontakt.form.submitting")}</span>}
              </div>
              <button
                type="submit"
                disabled={pending}
                aria-busy={pending}
                className="w-full bg-cm-teal-600 hover:bg-cm-teal-700 disabled:opacity-60 text-white px-7 py-3.5 rounded-full font-medium shadow-md flex items-center justify-center gap-2 transition-colors min-h-[48px]"
              >
                {pending
                  ? t("kontakt.form.submitting")
                  : (<>{t("home.quickContact.submit")} <ArrowRight className="w-4 h-4" aria-hidden="true" /></>)}
              </button>
              <p className="text-xs text-cm-ink/70 text-center">{t("home.quickContact.subline")}</p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
