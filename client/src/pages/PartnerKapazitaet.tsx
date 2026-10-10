import { Link, useSearch } from "wouter";
import { useState } from "react";
import { toast } from "sonner";
import { CheckCircle2, ArrowRight, Activity } from "lucide-react";
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


export default function PartnerKapazitaet() {
  useSEO({
    title: "Kapazitätsabfrage ambulante Pflege – CuraMain",
    description: "Pflegekapazitäten im Rhein-Main-Gebiet: Fragen Sie jetzt verfügbare Kapazitäten bei CuraMain an. Schnelle Rückmeldung für Kliniken, Ärzte, Krankenkassen & Kooperationspartner.",
    keywords: "Pflegekapazität Rhein-Main, ambulante Pflege Kapazität Rhein-Main-Gebiet, CuraMain Partner Anfrage",
    canonical: "https://www.curamain.de/partner/kapazitaet",
  });

  const [form, setForm] = useState({
    institutionName: "",
    contactPerson: "",
    email: "",
    phone: "",
    // ?versorgung=intensivpflege (Link von /intensivpflege) waehlt die Pflegeart vor
    careType: new URLSearchParams(useSearch()).get("versorgung") === "intensivpflege" ? "intensivpflege" : "",
    region: "",
    numberOfPatients: "",
    desiredStartDate: "",
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
      window.gtag("event", "partner_capacity_submission", {
        event_category: "engagement",
        event_label: "Partner Capacity Form",
        value: 1,
      });
    }

    setPending(true);
    const message = [
      `Einrichtung: ${form.institutionName}`,
      `Ansprechpartner: ${form.contactPerson}`,
      form.careType ? `Pflegeart: ${form.careType}` : "",
      form.region ? `Region/PLZ: ${form.region}` : "",
      form.numberOfPatients ? `Anzahl Patienten: ${form.numberOfPatients}` : "",
      form.desiredStartDate ? `Gewünschter Beginn: ${form.desiredStartDate}` : "",
      form.notes ? `Anmerkungen: ${form.notes}` : "",
    ].filter(Boolean).join("\n");

    const result = await submitContact({
      firstName: form.contactPerson.split(" ")[0] || form.contactPerson,
      lastName: form.contactPerson.split(" ").slice(1).join(" ") || "-",
      email: form.email,
      phone: form.phone || undefined,
      organization: form.institutionName,
      subject: "Kapazitätsabfrage",
      message,
      category: "capacity",
      website,
      extra: {
        careType: form.careType || undefined,
        region: form.region || undefined,
        numberOfPatients: form.numberOfPatients ? Number(form.numberOfPatients) : undefined,
        desiredStartDate: form.desiredStartDate || undefined,
      },
    });
    setPending(false);
    if (result.success) {
      setSubmitted(true);
      toast.success("Kapazitätsabfrage erfolgreich gesendet!");
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
            Wir prüfen unsere Kapazitäten und melden uns schnellstmöglich bei Ihnen.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-cm-cream">
      <section
        className="relative min-h-[380px] hero-bg -mt-24 pt-24"
        style={{ background: "linear-gradient(135deg, #daedeb 0%, #f9f6f1 100%)" }}
      >
        <div className="relative z-10 container pt-6 pb-10">
          <span className="pill inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm border border-white/60 shadow-sm">
            <Activity className="w-4 h-4 text-cm-teal" />
            Für Kliniken, Praxen & Kassen
          </span>
          <h1 className="h-serif text-5xl lg:text-7xl text-cm-teal mt-6 mb-6 max-w-5xl leading-[1.05]">
            Kapazitätsabfrage.
          </h1>
          <p className="text-lg lg:text-xl text-cm-ink/80 max-w-3xl leading-relaxed">
            Fragen Sie konkret an — für häusliche Pflege und außerklinische Intensivpflege. Wir melden uns innerhalb von 24 Stunden an Werktagen.
          </p>
        </div>
      </section>

      <section className="container py-12 lg:py-14">
        <PartnerTabs active="kapazitaet" />
        <h2 className="sr-only">Aktuelle Kapazitäten und Anfrage</h2>

        {/* 10.10.2026 (GF): keine festen Auslastungswerte nach außen — Kapazität nur auf konkrete Anfrage */}
        {/* Anfrage-Formular */}
        <div className="bg-white p-8 lg:p-10 rounded-3xl border border-cm-teal-100 max-w-3xl mx-auto">
          <h3 className="h-serif text-2xl text-cm-ink mb-6">Kapazität konkret anfragen</h3>
          <form onSubmit={handleSubmit} className="space-y-5">
            <HoneypotField value={website} onChange={setWebsite} />
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-cm-ink/80 mb-1.5 block">Einrichtung / Organisation *</label>
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
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-cm-ink/80 mb-1.5 block">Pflegeart</label>
                <select value={form.careType} onChange={(e) => setForm((f) => ({ ...f, careType: e.target.value }))} className={inputCls + " bg-white"}>
                  <option value="">Bitte wählen</option>
                  <option value="grundpflege">Grundpflege</option>
                  <option value="behandlungspflege">Behandlungspflege</option>
                  <option value="intensivpflege">Außerklinische Intensivpflege (Erwachsene)</option>
                  <option value="verhinderungspflege">Verhinderungspflege</option>
                  <option value="hauswirtschaft">Hauswirtschaft</option>
                  <option value="kombination">Kombination</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-cm-ink/80 mb-1.5 block">Region / PLZ</label>
                <input value={form.region} onChange={(e) => setForm((f) => ({ ...f, region: e.target.value }))} placeholder="z. B. Frankfurt-Nordend-Ost" className={inputCls} />
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-cm-ink/80 mb-1.5 block">Anzahl Patienten</label>
                <input type="number" min="1" value={form.numberOfPatients} onChange={(e) => setForm((f) => ({ ...f, numberOfPatients: e.target.value }))} className={inputCls} />
              </div>
              <div>
                <label className="text-sm font-medium text-cm-ink/80 mb-1.5 block">Gewünschter Beginn</label>
                <input type="date" value={form.desiredStartDate} onChange={(e) => setForm((f) => ({ ...f, desiredStartDate: e.target.value }))} className={inputCls} />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-cm-ink/80 mb-1.5 block">Weitere Anmerkungen</label>
              <textarea rows={4} value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} className={inputCls} />
            </div>
            <ConsentCheckbox checked={consent} onChange={setConsent} id="consent-kapazitaet" />
            <button
              type="submit"
              disabled={pending}
              aria-busy={pending}
              className="w-full bg-cm-teal-600 hover:bg-cm-teal-700 disabled:opacity-60 text-white px-7 py-3.5 rounded-full font-medium shadow-md flex items-center justify-center gap-2 transition-colors min-h-[48px]"
            >
              {pending ? "Wird gesendet …" : (<>Kapazität anfragen <ArrowRight className="w-4 h-4" /></>)}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
