import { useState, useRef, useMemo } from "react";
import { useSearch } from "wouter";
import { useSEO } from "@/hooks/useSEO";
import { toast } from "sonner";
import { CheckCircle2, Upload, FileText, X, ArrowRight, Briefcase } from "lucide-react";
import jobsData from "@/data/jobs.json";
import type { Job } from "@/data/types";
import { submitBewerbung } from "@/lib/api";
import HoneypotField from "@/components/HoneypotField";
import ConsentCheckbox from "@/components/ConsentCheckbox";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

const allJobs: Job[] = (jobsData as { jobs: Job[] }).jobs.filter((j) => j.active);

export default function Bewerbung() {
  useSEO({
    title: "Jetzt bewerben beim Pflegedienst – CuraMain",
    description: "Bewerben Sie sich jetzt bei CuraMain im Rhein-Main-Gebiet. Pflegefachkraft, Pflegehelfer oder Hauswirtschaft – Lebenslauf hochladen und Teil unseres Teams werden.",
    keywords: "Bewerbung Pflegedienst Rhein-Main, Pflegekraft bewerben Rhein-Main-Gebiet, CuraMain Stelle bewerben",
    canonical: "https://www.curamain.de/karriere/bewerbung",
  });

  const searchString = useSearch();
  const params = useMemo(() => new URLSearchParams(searchString), [searchString]);
  const preselectedJobId = params.get("job");

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
    jobPostingId: preselectedJobId || "",
  });
  const [website, setWebsite] = useState("");
  const [consent, setConsent] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [pending, setPending] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > MAX_FILE_SIZE) {
      toast.error("Die Datei darf maximal 10 MB groß sein.");
      return;
    }
    const ext = f.name.split(".").pop()?.toLowerCase();
    if (!["pdf", "doc", "docx"].includes(ext || "")) {
      toast.error("Bitte laden Sie eine PDF- oder Word-Datei hoch.");
      return;
    }
    setFile(f);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consent) {
      toast.error("Bitte bestätigen Sie die Datenschutzhinweise.");
      return;
    }
    if (window.gtag) {
      window.gtag("event", "application_submission", {
        event_category: "engagement",
        event_label: "Application Form",
        value: 1,
      });
    }

    setPending(true);

    const jobIdNum =
      form.jobPostingId && form.jobPostingId !== "none" ? Number(form.jobPostingId) : undefined;
    const jobTitle = jobIdNum ? allJobs.find((j) => j.id === jobIdNum)?.title : undefined;

    const result = await submitBewerbung(
      {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone || undefined,
        message: form.message || undefined,
        jobPostingId: jobIdNum,
        jobTitle,
        website,
      },
      file,
    );

    setPending(false);

    if (result.success) {
      setSubmitted(true);
      toast.success("Ihre Bewerbung wurde erfolgreich eingereicht!");
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
          <h2 className="h-serif text-3xl text-cm-ink mb-3">Bewerbung eingegangen!</h2>
          <p className="text-cm-ink/70 leading-relaxed">
            Vielen Dank für Ihre Bewerbung. Wir prüfen Ihre Unterlagen und melden uns zeitnah bei Ihnen.
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
            <Briefcase className="w-4 h-4 text-cm-teal" />
            Lebenslauf hochladen · 5 Minuten
          </span>
          <h1 className="h-serif text-5xl lg:text-7xl text-cm-teal mt-6 mb-6 max-w-3xl leading-[1.05]">
            {preselectedJobId ? "Jetzt bewerben." : "Schnellbewerbung."}
          </h1>
          <p className="text-lg text-cm-ink/80 max-w-2xl leading-relaxed">
            Füllen Sie das Formular aus und laden Sie Ihren Lebenslauf hoch. Wir melden uns schnellstmöglich bei Ihnen.
          </p>
        </div>
      </section>

      {/* FORMULAR */}
      <section className="container py-12 lg:py-14 max-w-3xl">
        <div className="bg-white p-8 lg:p-10 rounded-3xl border border-cm-teal-100">
          <form onSubmit={handleSubmit} className="space-y-5">
            <HoneypotField value={website} onChange={setWebsite} />
            {/* Job */}
            {allJobs.length > 0 && (
              <div>
                <label className="text-sm font-medium text-cm-ink/80 mb-1.5 block">Stelle (optional)</label>
                <select
                  value={form.jobPostingId}
                  onChange={(e) => setForm((f) => ({ ...f, jobPostingId: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-cm-teal-100 bg-white focus:border-cm-teal-300 focus:ring-2 focus:ring-cm-teal-100 outline-none transition"
                >
                  <option value="">Initiativbewerbung</option>
                  {allJobs.map((job) => (
                    <option key={job.id} value={String(job.id)}>
                      {job.title}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="text-sm font-medium text-cm-ink/80 mb-1.5 block">Vorname *</label>
                <input
                  id="firstName"
                  required
                  autoComplete="given-name"
                  value={form.firstName}
                  onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
                  placeholder="Max"
                  className="w-full px-4 py-3 rounded-xl border border-cm-teal-100 focus:border-cm-teal-300 focus:ring-2 focus:ring-cm-teal-100 outline-none transition"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="text-sm font-medium text-cm-ink/80 mb-1.5 block">Nachname *</label>
                <input
                  id="lastName"
                  required
                  autoComplete="family-name"
                  value={form.lastName}
                  onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))}
                  placeholder="Mustermann"
                  className="w-full px-4 py-3 rounded-xl border border-cm-teal-100 focus:border-cm-teal-300 focus:ring-2 focus:ring-cm-teal-100 outline-none transition"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="email" className="text-sm font-medium text-cm-ink/80 mb-1.5 block">E-Mail *</label>
                <input
                  id="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  placeholder="max@beispiel.de"
                  className="w-full px-4 py-3 rounded-xl border border-cm-teal-100 focus:border-cm-teal-300 focus:ring-2 focus:ring-cm-teal-100 outline-none transition"
                />
              </div>
              <div>
                <label htmlFor="phone" className="text-sm font-medium text-cm-ink/80 mb-1.5 block">Telefon</label>
                <input
                  id="phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                  placeholder="0151 …"
                  className="w-full px-4 py-3 rounded-xl border border-cm-teal-100 focus:border-cm-teal-300 focus:ring-2 focus:ring-cm-teal-100 outline-none transition"
                />
              </div>
            </div>

            {/* File-Upload */}
            <div>
              <label className="text-sm font-medium text-cm-ink/80 mb-1.5 block">Lebenslauf (PDF oder Word, max. 10 MB)</label>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                className="hidden"
              />
              {file ? (
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-cm-teal-50 border border-cm-teal-100">
                  <FileText className="h-5 w-5 text-cm-teal flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-cm-ink truncate">{file.name}</div>
                    <div className="text-xs text-cm-ink/60">{(file.size / 1024 / 1024).toFixed(1)} MB</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setFile(null);
                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
                    className="p-1.5 rounded-full hover:bg-white transition-colors"
                  >
                    <X className="h-4 w-4 text-cm-ink/60" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full p-8 border-2 border-dashed border-cm-teal-200 rounded-2xl text-center bg-cm-teal-50/40 hover:bg-cm-teal-50 transition-colors"
                >
                  <Upload className="h-10 w-10 text-cm-teal mx-auto mb-3" />
                  <div className="font-medium text-cm-ink mb-1">Klicken oder ziehen Sie Ihren Lebenslauf hierher</div>
                  <div className="text-xs text-cm-ink/60">PDF, DOC oder DOCX · max. 10 MB</div>
                </button>
              )}
            </div>

            <div>
              <label htmlFor="message" className="text-sm font-medium text-cm-ink/80 mb-1.5 block">Anschreiben / Nachricht</label>
              <textarea
                id="message"
                rows={5}
                value={form.message}
                onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                placeholder="Warum wollen Sie zu CuraMain? Erzählen Sie uns etwas über sich und Ihre Motivation …"
                className="w-full px-4 py-3 rounded-xl border border-cm-teal-100 focus:border-cm-teal-300 focus:ring-2 focus:ring-cm-teal-100 outline-none transition"
              />
            </div>

            <ConsentCheckbox checked={consent} onChange={setConsent} id="consent-bewerbung" />
            <button
              type="submit"
              disabled={pending}
              aria-busy={pending}
              className="w-full bg-cm-teal-600 hover:bg-cm-teal-700 disabled:opacity-60 text-white px-7 py-3.5 rounded-full font-medium shadow-md flex items-center justify-center gap-2 transition-colors min-h-[48px]"
            >
              {pending ? "Wird gesendet …" : (<>Bewerbung absenden <ArrowRight className="w-4 h-4" /></>)}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
