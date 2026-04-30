import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Phone, Mail, MapPin, Clock, CheckCircle2, Send, Calendar, ArrowRight } from "lucide-react";
import { useSEO } from "@/hooks/useSEO";
import { submitContact } from "@/lib/api";
import HoneypotField from "@/components/HoneypotField";

const SPRACHEN = ["Deutsch", "Englisch", "Türkisch", "Arabisch", "Russisch", "Polnisch", "Französisch"];

// Externe Termin-Buchung. Sobald die Zeeg-URL feststeht, hier eintragen.
// Beispiel: "https://zeeg.me/curamain/erstberatung"
const ZEEG_URL = import.meta.env.VITE_ZEEG_URL as string | undefined;

export default function KontaktPatient() {
  useSEO({
    title: "Kostenlose Pflegeberatung anfragen – CuraMain",
    description: "Fordern Sie jetzt Ihre kostenlose Erstberatung bei CuraMain im Rhein-Main-Gebiet an. Wir beraten Sie zu Pflegeleistungen, Pflegegraden und Kosten.",
    keywords: "Pflegeberatung Rhein-Main, Erstberatung Pflegedienst Rhein-Main-Gebiet, Pflegedienst Kontakt, CuraMain",
    canonical: "https://www.curamain.de/kontakt/patient",
  });

  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", phone: "", subject: "", message: "", stadtteil: "" });
  const [website, setWebsite] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [pending, setPending] = useState(false);
  const [activeTab, setActiveTab] = useState("contact");

  const STADTTEILE = [
    { value: "nordend-ost", label: "Nordend-Ost" },
    { value: "bornheim", label: "Bornheim" },
    { value: "ostend", label: "Ostend" },
    { value: "other", label: "Anderer Stadtteil – bitte Anfrage senden" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (window.gtag) {
      window.gtag("event", "contact_patient_submission", {
        event_category: "engagement",
        event_label: "Patient Contact Form",
        value: 1,
      });
    }
    setPending(true);
    const result = await submitContact({ ...form, category: "patient", website });
    setPending(false);
    if (result.success) {
      setSubmitted(true);
      toast.success("Ihre Anfrage wurde erfolgreich gesendet!");
    } else {
      toast.error("Fehler beim Senden: " + result.error);
    }
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
            Ihre Anfrage für eine kostenlose Erstberatung ist bei uns eingegangen. Wir melden uns innerhalb von 24 Stunden bei Ihnen.
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
            <CheckCircle2 className="w-4 h-4 text-cm-teal" />
            Kostenlos & unverbindlich
          </span>
          <h1 className="h-serif text-5xl lg:text-7xl text-cm-teal mt-6 mb-6 max-w-3xl leading-[1.05]">
            Kostenlose Erstberatung.
          </h1>
          <p className="text-lg text-cm-ink/80 max-w-2xl leading-relaxed">
            Füllen Sie das Formular aus – wir melden uns zeitnah bei Ihnen. Mehrsprachig verfügbar.
          </p>
        </div>
      </section>

      {/* FORM + INFO */}
      <section className="container py-12 lg:py-14 grid lg:grid-cols-3 gap-8">
        {/* FORMULAR */}
        <div className="lg:col-span-2 bg-white p-8 lg:p-10 rounded-3xl border border-cm-teal-100">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 bg-cm-teal-50 rounded-full p-1">
              <TabsTrigger value="contact" className="rounded-full data-[state=active]:bg-white">
                <Send className="w-4 h-4 mr-2" />
                Kontaktformular
              </TabsTrigger>
              <TabsTrigger value="appointment" className="rounded-full data-[state=active]:bg-white">
                <Calendar className="w-4 h-4 mr-2" />
                Termin vereinbaren
              </TabsTrigger>
            </TabsList>

            <TabsContent value="contact" className="mt-0">
              <form onSubmit={handleSubmit} className="space-y-4">
                <HoneypotField value={website} onChange={setWebsite} />
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="text-sm font-medium text-cm-ink/80 mb-1.5 block">Vorname *</label>
                    <input
                      id="firstName"
                      required
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
                      value={form.phone}
                      onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                      placeholder="0151 …"
                      className="w-full px-4 py-3 rounded-xl border border-cm-teal-100 focus:border-cm-teal-300 focus:ring-2 focus:ring-cm-teal-100 outline-none transition"
                    />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="stadtteil" className="text-sm font-medium text-cm-ink/80 mb-1.5 block">Stadtteil *</label>
                    <select
                      id="stadtteil"
                      required
                      value={form.stadtteil}
                      onChange={(e) => setForm((f) => ({ ...f, stadtteil: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl border border-cm-teal-100 focus:border-cm-teal-300 focus:ring-2 focus:ring-cm-teal-100 outline-none transition"
                    >
                      <option value="">– Wählen Sie einen Stadtteil –</option>
                      {STADTTEILE.map((st) => (
                        <option key={st.value} value={st.value}>{st.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="subject" className="text-sm font-medium text-cm-ink/80 mb-1.5 block">Betreff</label>
                    <input
                      id="subject"
                      value={form.subject}
                      onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
                      placeholder="z. B. Erstberatung Grundpflege"
                      className="w-full px-4 py-3 rounded-xl border border-cm-teal-100 focus:border-cm-teal-300 focus:ring-2 focus:ring-cm-teal-100 outline-none transition"
                    />
                  </div>
                </div>
                {form.stadtteil === "other" && (
                  <div className="bg-cm-teal-50 border border-cm-teal-200 rounded-xl p-4 text-sm text-cm-ink/70">
                    <strong>Hinweis:</strong> Aktuell versorgen wir primär Nordend-Ost, Bornheim und Ostend. Wir prüfen Ihre Anfrage individuell und melden uns innerhalb von 48 Stunden.
                  </div>
                )}
                <div>
                  <label htmlFor="message" className="text-sm font-medium text-cm-ink/80 mb-1.5 block">Ihre Nachricht *</label>
                  <textarea
                    id="message"
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                    placeholder="Beschreiben Sie kurz Ihre Situation und Ihren Pflegebedarf …"
                    className="w-full px-4 py-3 rounded-xl border border-cm-teal-100 focus:border-cm-teal-300 focus:ring-2 focus:ring-cm-teal-100 outline-none transition"
                  />
                </div>
                <button
                  type="submit"
                  disabled={pending}
                  className="w-full bg-cm-teal hover:bg-cm-teal-500 disabled:opacity-60 text-white px-7 py-3.5 rounded-full font-medium shadow-md flex items-center justify-center gap-2 transition-colors"
                >
                  {pending ? "Wird gesendet …" : (<>Nachricht senden <ArrowRight className="w-4 h-4" /></>)}
                </button>
              </form>
            </TabsContent>

            <TabsContent value="appointment" className="mt-0">
              {ZEEG_URL ? (
                <div className="rounded-2xl overflow-hidden border border-cm-teal-100 bg-white">
                  <iframe
                    src={ZEEG_URL}
                    title="Termin vereinbaren – CuraMain"
                    className="w-full"
                    style={{ height: "720px", border: 0 }}
                    loading="lazy"
                  />
                </div>
              ) : (
                <div className="text-center py-12 px-6 bg-cm-teal-50/40 rounded-2xl border border-dashed border-cm-teal-200">
                  <Calendar className="w-10 h-10 text-cm-teal mx-auto mb-4" />
                  <h3 className="h-serif text-2xl text-cm-ink mb-2">
                    Online-Buchung kommt in Kürze
                  </h3>
                  <p className="text-cm-ink/70 mb-6 max-w-md mx-auto">
                    Bis dahin freuen wir uns über Ihren Anruf oder das Kontaktformular. Wir melden uns innerhalb von 24 Stunden mit einem Terminvorschlag.
                  </p>
                  <a
                    href="tel:+4969792 16147"
                    className="inline-flex items-center gap-2 bg-cm-teal hover:bg-cm-teal-500 text-white px-6 py-3 rounded-full font-medium transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    069 / 79 216 147
                  </a>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* SIDEBAR */}
        <div className="space-y-5">
          <div className="bg-cm-teal-50 p-6 rounded-3xl">
            <h3 className="h-serif text-xl text-cm-ink mb-4">So erreichen Sie uns</h3>
            <div className="space-y-3 text-sm">
              <a href="tel:+4969792 16147" className="flex gap-3 hover:text-cm-teal-600 transition-colors">
                <Phone className="w-5 h-5 text-cm-teal flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-medium text-cm-ink">069 / 79 216 147</div>
                  <div className="text-cm-ink/60 text-xs">Mo–Fr 8:00–18:00 · Notfall 24/7</div>
                </div>
              </a>
              <a href="mailto:info@curamain.de" className="flex gap-3 hover:text-cm-teal-600 transition-colors">
                <Mail className="w-5 h-5 text-cm-teal flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-medium text-cm-ink">info@curamain.de</div>
                  <div className="text-cm-ink/60 text-xs">Antwort innerhalb von 24h</div>
                </div>
              </a>
              <div className="flex gap-3">
                <MapPin className="w-5 h-5 text-cm-teal flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-medium text-cm-ink">Berger Str. 69</div>
                  <div className="text-cm-ink/60 text-xs">60316 Frankfurt am Main</div>
                </div>
              </div>
              <div className="flex gap-3">
                <Clock className="w-5 h-5 text-cm-teal flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-medium text-cm-ink">Bürozeiten</div>
                  <div className="text-cm-ink/60 text-xs">Mo–Fr 8:00–18:00 Uhr</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-cm-teal-100">
            <h3 className="h-serif text-xl text-cm-ink mb-2">Mehrsprachig</h3>
            <p className="text-sm text-cm-ink/70 mb-3">Wir beraten in:</p>
            <div className="flex flex-wrap gap-2">
              {SPRACHEN.map((s) => (
                <span key={s} className="text-xs px-3 py-1 rounded-full bg-cm-teal-50 text-cm-teal-700">
                  {s}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-cm-ink text-white p-6 rounded-3xl">
            <h3 className="h-serif text-xl mb-2">Notfall?</h3>
            <p className="text-sm text-white/80 mb-4">Unsere 24/7-Notfallbereitschaft ist jederzeit für Sie erreichbar.</p>
            <a
              href="tel:+4969792 16147"
              className="block w-full text-center bg-cm-mint hover:bg-cm-teal-300 text-cm-ink px-5 py-3 rounded-full font-medium transition-colors"
            >
              <Phone className="w-4 h-4 inline mr-2" />
              Jetzt anrufen
            </a>
          </div>
        </div>
      </section>

      {/* MAP */}
      <section className="container pb-12 lg:pb-20">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-cm-teal">Standort</span>
          <h2 className="h-serif text-3xl lg:text-4xl text-cm-ink mt-3">Besuchen Sie uns.</h2>
        </div>
        <div className="rounded-3xl overflow-hidden border border-cm-teal-100 h-96">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2556.7644854444587!2d8.689!3d50.1109!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47bd0e0e0e0e0e0d%3A0x0!2sCuraMain%20-%20Ambulanter%20Pflegedienst!5e0!3m2!1sde!2sde!4v1234567890"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen={true}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="CuraMain Standort"
          />
        </div>
        <div className="mt-6 text-center">
          <p className="text-cm-ink/70 mb-4">Berger Straße 69, 60316 Frankfurt am Main</p>
          <a
            href="https://maps.google.com/?q=Berger+Stra%C3%9Fe+69,+60316+Frankfurt+am+Main"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-cm-teal hover:bg-cm-teal-500 text-white px-6 py-2.5 rounded-full text-sm font-medium transition-colors"
          >
            In Google Maps öffnen <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </section>
    </div>
  );
}
