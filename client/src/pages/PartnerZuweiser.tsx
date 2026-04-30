import { Link } from "wouter";
import { useState } from "react";
import { toast } from "sonner";
import { CheckCircle2, ArrowRight, Stethoscope, Building2, Hospital } from "lucide-react";
import { useSEO } from "@/hooks/useSEO";
import { submitContact } from "@/lib/api";
import HoneypotField from "@/components/HoneypotField";
import ConsentCheckbox from "@/components/ConsentCheckbox";

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

const inputCls =
  "w-full px-4 py-3 rounded-xl border border-cm-teal-100 focus:border-cm-teal-300 focus:ring-2 focus:ring-cm-teal-100 outline-none transition";

export default function PartnerZuweiser() {
  useSEO({
    title: "Zuweiser-Portal für Ärzte & Kliniken – CuraMain",
    description: "Patientenüberleitung an CuraMain: Zuweiser-Portal für Hausärzte, Fachärzte, Kliniken & Krankenhäuser im Rhein-Main-Gebiet. Schnelle Rückmeldung, zuverlässige ambulante Weiterversorgung.",
    keywords: "Zuweiser Pflegedienst Rhein-Main, Patientenüberleitung Rhein-Main-Gebiet, ambulante Pflege nach Klinik, CuraMain Partner",
    canonical: "https://www.curamain.de/partner/zuweiser",
  });

  const [form, setForm] = useState({
    referrerType: "doctor" as "doctor" | "clinic" | "hospital",
    institutionName: "",
    contactPerson: "",
    email: "",
    phone: "",
    patientName: "",
    patientInsurance: "",
    careLevel: "",
    careNeeds: "",
    urgency: "normal" as "normal" | "urgent" | "emergency",
    notes: "",
  });
  const [website, setWebsite] = useState("");
  const [consent, setConsent] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [pending, setPending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consent) {
      toast.error("Bitte bestätigen Sie die Datenschutzhinweise.");
      return;
    }
    if (window.gtag) {
      window.gtag("event", "partner_referral_submission", {
        event_category: "engagement",
        event_label: "Partner Referral Form",
        value: 1,
      });
    }

    setPending(true);
    const message = [
      `Einrichtungsart: ${form.referrerType}`,
      `Einrichtung: ${form.institutionName}`,
      `Ansprechpartner: ${form.contactPerson}`,
      form.patientName ? `Patient: ${form.patientName}` : "",
      form.patientInsurance ? `Versicherung: ${form.patientInsurance}` : "",
      form.careLevel ? `Pflegegrad: ${form.careLevel}` : "",
      `Dringlichkeit: ${form.urgency}`,
      form.careNeeds ? `Pflegebedarf: ${form.careNeeds}` : "",
      form.notes ? `Anmerkungen: ${form.notes}` : "",
    ].filter(Boolean).join("\n");

    const result = await submitContact({
      firstName: form.contactPerson.split(" ")[0] || form.contactPerson,
      lastName: form.contactPerson.split(" ").slice(1).join(" ") || "-",
      email: form.email,
      phone: form.phone || undefined,
      organization: form.institutionName,
      subject: `Patientenüberleitung (${form.urgency})`,
      message,
      category: "referral",
      website,
      extra: {
        referrerType: form.referrerType,
        urgency: form.urgency,
        careLevel: form.careLevel || undefined,
      },
    });
    setPending(false);
    if (result.success) {
      setSubmitted(true);
      toast.success("Zuweiser-Anfrage erfolgreich gesendet!");
    } else {
      toast.error("Fehler: " + result.error);
    }
  };

  if (submitted) {
    return (
      <div className="bg-cm-cream min-h-[60vh] flex items-center justify-center py-20">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-full bg-cm-teal-50 flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 className="h-8 w-8 text-cm-teal" />
          </div>
          <h2 className="h-serif text-3xl text-cm-ink mb-3">Anfrage eingegangen!</h2>
          <p className="text-cm-ink/70 leading-relaxed">
            Vielen Dank für Ihre Zuweiser-Anfrage. Wir bearbeiten diese umgehend und melden uns bei Ihnen.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-cm-cream">
      {/* HERO */}
      <section
        className="relative min-h-[300px] hero-bg -mt-24 pt-24"
        style={{ background: "linear-gradient(135deg, #daedeb 0%, #f9f6f1 100%)" }}
      >
        <div className="relative z-10 container pt-6 pb-10">
          <span className="pill inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm border border-white/60 shadow-sm">
            <Stethoscope className="w-4 h-4 text-cm-teal" />
            Für Hausärzte, Fachärzte & Kliniken
          </span>
          <h1 className="h-serif text-5xl lg:text-7xl text-cm-teal mt-6 mb-6 max-w-3xl leading-[1.05]">
            Patientenüberleitung.
          </h1>
          <p className="text-lg text-cm-ink/80 max-w-2xl leading-relaxed">
            Leiten Sie Patienten schnell und unkompliziert an uns über. Wir gewährleisten eine nahtlose Versorgungsübernahme.
          </p>
        </div>
      </section>

      <section className="container py-12 lg:py-14">
        <PartnerTabs active="zuweiser" />
        <h2 className="sr-only">Patient an CuraMain überleiten</h2>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white p-8 lg:p-10 rounded-3xl border border-cm-teal-100">
            <form onSubmit={handleSubmit} className="space-y-6">
              <HoneypotField value={website} onChange={setWebsite} />
              {/* Einrichtungsart */}
              <div>
                <label className="text-sm font-semibold text-cm-ink/80 mb-3 block">Einrichtungsart *</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { v: "doctor", l: "Arztpraxis", I: Stethoscope },
                    { v: "clinic", l: "Klinik", I: Building2 },
                    { v: "hospital", l: "Krankenhaus", I: Hospital },
                  ].map(({ v, l, I }) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, referrerType: v as any }))}
                      className={`p-4 rounded-2xl border text-sm font-medium flex flex-col items-center gap-2 transition-colors ${
                        form.referrerType === v
                          ? "bg-cm-teal-50 border-cm-teal-300 text-cm-teal-700"
                          : "bg-white border-cm-teal-100 text-cm-ink hover:border-cm-teal-300"
                      }`}
                    >
                      <I className="w-5 h-5" />
                      {l}
                    </button>
                  ))}
                </div>
              </div>

              {/* Einrichtung */}
              <div className="space-y-4">
                <h3 className="font-semibold text-cm-ink border-b border-cm-teal-100 pb-2">Ihre Einrichtung</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-cm-ink/80 mb-1.5 block">Name der Einrichtung *</label>
                    <input required value={form.institutionName} onChange={(e) => setForm((f) => ({ ...f, institutionName: e.target.value }))} className={inputCls} />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-cm-ink/80 mb-1.5 block">Ansprechpartner *</label>
                    <input required value={form.contactPerson} onChange={(e) => setForm((f) => ({ ...f, contactPerson: e.target.value }))} className={inputCls} />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-cm-ink/80 mb-1.5 block">E-Mail *</label>
                    <input type="email" required value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} className={inputCls} />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-cm-ink/80 mb-1.5 block">Telefon</label>
                    <input type="tel" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} className={inputCls} />
                  </div>
                </div>
              </div>

              {/* Patient */}
              <div className="space-y-4">
                <h3 className="font-semibold text-cm-ink border-b border-cm-teal-100 pb-2">Patientendaten (optional)</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-cm-ink/80 mb-1.5 block">Name des Patienten</label>
                    <input value={form.patientName} onChange={(e) => setForm((f) => ({ ...f, patientName: e.target.value }))} className={inputCls} />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-cm-ink/80 mb-1.5 block">Krankenversicherung</label>
                    <input value={form.patientInsurance} onChange={(e) => setForm((f) => ({ ...f, patientInsurance: e.target.value }))} className={inputCls} />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-cm-ink/80 mb-1.5 block">Pflegegrad</label>
                    <select value={form.careLevel} onChange={(e) => setForm((f) => ({ ...f, careLevel: e.target.value }))} className={inputCls + " bg-white"}>
                      <option value="">Bitte wählen</option>
                      <option value="none">Kein Pflegegrad</option>
                      <option value="1">Pflegegrad 1</option>
                      <option value="2">Pflegegrad 2</option>
                      <option value="3">Pflegegrad 3</option>
                      <option value="4">Pflegegrad 4</option>
                      <option value="5">Pflegegrad 5</option>
                      <option value="pending">Antrag gestellt</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-cm-ink/80 mb-1.5 block">Dringlichkeit</label>
                    <select value={form.urgency} onChange={(e) => setForm((f) => ({ ...f, urgency: e.target.value as any }))} className={inputCls + " bg-white"}>
                      <option value="normal">Normal</option>
                      <option value="urgent">Dringend</option>
                      <option value="emergency">Notfall</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-cm-ink/80 mb-1.5 block">Pflegebedarf</label>
                  <textarea rows={3} value={form.careNeeds} onChange={(e) => setForm((f) => ({ ...f, careNeeds: e.target.value }))} placeholder="Beschreiben Sie den Pflegebedarf …" className={inputCls} />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-cm-ink/80 mb-1.5 block">Weitere Anmerkungen</label>
                <textarea rows={3} value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} className={inputCls} />
              </div>

              <ConsentCheckbox checked={consent} onChange={setConsent} id="consent-zuweiser" />

              <button
                type="submit"
                disabled={pending}
                aria-busy={pending}
                className="w-full bg-cm-teal-600 hover:bg-cm-teal-700 disabled:opacity-60 text-white px-7 py-3.5 rounded-full font-medium shadow-md flex items-center justify-center gap-2 transition-colors min-h-[48px]"
              >
                {pending ? "Wird gesendet …" : (<>Anfrage absenden <ArrowRight className="w-4 h-4" /></>)}
              </button>
            </form>
          </div>

          <aside className="space-y-5">
            <div className="bg-cm-teal-50 p-6 rounded-3xl">
              <h3 className="h-serif text-xl text-cm-ink mb-3">Direkter Draht</h3>
              <div className="space-y-2 text-sm text-cm-ink/80">
                <div>📞 069 / 79 216 147</div>
                <div>✉ partner@curamain.de</div>
                <div>🕐 Mo–Fr 8:00–18:00</div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-cm-teal-100">
              <h3 className="font-semibold text-cm-ink mb-2">Versorgungsgebiet</h3>
              <p className="text-sm text-cm-ink/70">
                Frankfurt-Nordend-Ost, Bornheim, Ostend (Phase 1, ab Mai 2026). Erweiterung in Phase 2/3 geplant.
              </p>
            </div>
            <div className="bg-cm-ink text-white p-6 rounded-3xl">
              <h3 className="h-serif text-xl mb-2">Notfall-Übernahme</h3>
              <p className="text-sm text-white/80 mb-4">Rückmeldung innerhalb von 4 Stunden bei „Notfall"-Dringlichkeit.</p>
              <a
                href="tel:+496979216147"
                className="block w-full text-center bg-cm-mint hover:bg-cm-teal-300 text-cm-ink px-5 py-3 rounded-full font-medium transition-colors"
              >
                Sofort anrufen
              </a>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
