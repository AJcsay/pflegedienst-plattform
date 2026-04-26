import { Link } from "wouter";
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { CheckCircle2, ArrowRight, FileDown, FileText, Shield, Star, Globe2 } from "lucide-react";
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

const inputCls =
  "w-full px-4 py-3 rounded-xl border border-cm-teal-100 focus:border-cm-teal-300 focus:ring-2 focus:ring-cm-teal-100 outline-none transition";

const categoryLabels: Record<string, string> = {
  quality: "Qualität",
  supply: "Versorgung",
  contract: "Vertrag",
  other: "Sonstiges",
};

const KASSEN = ["AOK Hessen", "TK", "Barmer", "DAK", "IKK Classic", "BKK Verbund"];

const PILLARS = [
  { I: Star, t: "SGB V Versorgungsvertrag", d: "Zugelassen für häusliche Krankenpflege nach § 132a SGB V mit allen gesetzlichen Krankenkassen." },
  { I: Shield, t: "SGB XI Versorgungsvertrag", d: "Zugelassen nach § 72 SGB XI mit Landesrahmenvertrag Hessen für Pflegesachleistungen." },
  { I: Globe2, t: "DMP & Hospizdienste", d: "Kooperation mit Frankfurter Palliativnetz und ausgewählten Hospizdiensten im Rhein-Main-Gebiet." },
];

export default function PartnerKassen() {
  useSEO({
    title: "Krankenkassen & private Ärzte – CuraMain Partner",
    description: "Kooperation mit CuraMain: Krankenkassen & Privatpraxen im Rhein-Main-Gebiet. Qualitätsunterlagen, Versorgungsdokumente & Kooperationsverträge zum Download.",
    keywords: "Krankenkasse Pflegedienst Rhein-Main, Kooperation Pflegedienst Rhein-Main-Gebiet, CuraMain Kassen Partner",
    canonical: "https://www.curamain.de/partner/kassen",
  });

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    organization: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const { data: documents } = trpc.documents.list.useQuery();

  const mutation = trpc.contact.submit.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      toast.success("Ihre Anfrage wurde erfolgreich gesendet!");
    },
    onError: (err) => toast.error("Fehler: " + err.message),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if ((window as any).gtag) {
      (window as any).gtag("event", "partner_insurance_submission", {
        event_category: "engagement",
        event_label: "Partner Insurance Form",
        value: 1,
      });
    }
    mutation.mutate({ ...form, category: "insurance" });
  };

  if (submitted) {
    return (
      <div className="bg-cm-cream min-h-[60vh] flex items-center justify-center py-20">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-full bg-cm-teal-50 flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 className="h-8 w-8 text-cm-teal" />
          </div>
          <h2 className="h-serif text-3xl text-cm-ink mb-3">Vielen Dank!</h2>
          <p className="text-cm-ink/70 leading-relaxed">
            Ihre Anfrage ist bei uns eingegangen. Wir melden uns zeitnah bei Ihnen.
          </p>
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
            <Shield className="w-4 h-4 text-cm-teal" />
            Kassenzugelassen seit 2020
          </span>
          <h1 className="h-serif text-5xl lg:text-7xl text-cm-teal mt-6 mb-6 max-w-3xl leading-[1.05]">
            Kassen & Kooperation.
          </h1>
          <p className="text-lg text-cm-ink/80 max-w-2xl leading-relaxed">
            Kontaktieren Sie uns für eine partnerschaftliche Zusammenarbeit. Alle relevanten Versorgungsverträge und Vergütungsvereinbarungen sind hinterlegt.
          </p>
        </div>
      </section>

      <section className="container py-12 lg:py-14">
        <PartnerTabs active="kassen" />

        {/* 3 Pillars */}
        <div className="grid md:grid-cols-3 gap-5 mb-12">
          {PILLARS.map((p) => (
            <div key={p.t} className="bg-white p-7 rounded-3xl border border-cm-teal-100">
              <div className="w-12 h-12 rounded-2xl bg-cm-teal-50 flex items-center justify-center mb-4">
                <p.I className="w-6 h-6 text-cm-teal" />
              </div>
              <h3 className="font-semibold mb-2 text-cm-ink">{p.t}</h3>
              <p className="text-sm text-cm-ink/70">{p.d}</p>
            </div>
          ))}
        </div>

        {/* Kassen-Logos-Strip */}
        <div className="bg-white p-8 rounded-3xl border border-cm-teal-100 mb-12">
          <div className="text-center text-xs font-semibold uppercase tracking-[0.18em] text-cm-teal mb-5">
            Mit allen großen Pflegekassen abrechenbar
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 text-center text-sm text-cm-ink/70">
            {KASSEN.map((k) => (
              <div key={k} className="p-3 bg-cm-teal-50/40 rounded-xl">{k}</div>
            ))}
          </div>
        </div>

        {/* Form + Documents */}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white p-8 lg:p-10 rounded-3xl border border-cm-teal-100">
            <h2 className="h-serif text-2xl text-cm-ink mb-6">Kontaktformular</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-cm-ink/80 mb-1.5 block">Vorname *</label>
                  <input required value={form.firstName} onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))} className={inputCls} />
                </div>
                <div>
                  <label className="text-sm font-medium text-cm-ink/80 mb-1.5 block">Nachname *</label>
                  <input required value={form.lastName} onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))} className={inputCls} />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-cm-ink/80 mb-1.5 block">Organisation / Krankenkasse</label>
                <input value={form.organization} onChange={(e) => setForm((f) => ({ ...f, organization: e.target.value }))} className={inputCls} />
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
              <div>
                <label className="text-sm font-medium text-cm-ink/80 mb-1.5 block">Betreff</label>
                <input value={form.subject} onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))} className={inputCls} />
              </div>
              <div>
                <label className="text-sm font-medium text-cm-ink/80 mb-1.5 block">Nachricht *</label>
                <textarea required rows={5} value={form.message} onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))} placeholder="Beschreiben Sie Ihr Anliegen …" className={inputCls} />
              </div>
              <button
                type="submit"
                disabled={mutation.isPending}
                className="w-full bg-cm-teal hover:bg-cm-teal-500 disabled:opacity-60 text-white px-7 py-3.5 rounded-full font-medium shadow-md flex items-center justify-center gap-2 transition-colors"
              >
                {mutation.isPending ? "Wird gesendet …" : (<>Nachricht senden <ArrowRight className="w-4 h-4" /></>)}
              </button>
            </form>
          </div>

          {/* Dokumente Sidebar */}
          <aside>
            <div className="bg-cm-teal-50 p-6 rounded-3xl">
              <div className="flex items-center gap-2 mb-5">
                <FileText className="w-5 h-5 text-cm-teal" />
                <h3 className="h-serif text-xl text-cm-ink">Dokumente</h3>
              </div>
              {documents && documents.length > 0 ? (
                <div className="space-y-3">
                  {documents.map((doc) => (
                    <a
                      key={doc.id}
                      href={doc.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-start gap-3 p-3 rounded-2xl bg-white hover:shadow-md transition-shadow group"
                    >
                      <FileText className="w-5 h-5 text-cm-teal flex-shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-cm-ink group-hover:text-cm-teal-600 transition-colors">
                          {doc.title}
                        </div>
                        {doc.description && (
                          <div className="text-xs text-cm-ink/60 mt-0.5">{doc.description}</div>
                        )}
                        <div className="text-xs text-cm-ink/60 mt-1">
                          {categoryLabels[doc.category] || doc.category}
                          {doc.fileSize ? ` · ${(doc.fileSize / 1024 / 1024).toFixed(1)} MB` : ""}
                        </div>
                      </div>
                      <FileDown className="w-4 h-4 text-cm-ink/60 group-hover:text-cm-teal flex-shrink-0 mt-1" />
                    </a>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <FileText className="w-10 h-10 text-cm-teal-200 mx-auto mb-3" />
                  <p className="text-sm text-cm-ink/60">Aktuell keine Dokumente verfügbar.</p>
                </div>
              )}
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
