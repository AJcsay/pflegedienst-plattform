import { useState } from "react";
import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Phone, Mail, MapPin, Clock, CheckCircle2, Send, Calendar, ArrowRight } from "lucide-react";
import { useSEO } from "@/hooks/useSEO";
import { submitContact } from "@/lib/api";
import HoneypotField from "@/components/HoneypotField";

// Externe Termin-Buchung. Sobald die Zeeg-URL feststeht, hier eintragen.
// Beispiel: "https://zeeg.me/curamain/erstberatung"
const ZEEG_URL = import.meta.env.VITE_ZEEG_URL as string | undefined;

export default function KontaktPatient() {
  const { t } = useTranslation();

  useSEO({
    title: t("kontakt.seo.title"),
    description: t("kontakt.seo.description"),
    keywords: t("kontakt.seo.keywords"),
    canonical: "https://www.curamain.de/kontakt/patient",
  });

  // Markenregel: mindestens fünf Sprachen (aus i18n)
  type District = { value: string; label: string };
  const SPRACHEN = t("kontakt.languages", { returnObjects: true }) as string[];
  const STADTTEILE = t("kontakt.districts", { returnObjects: true }) as District[];

  const [form, setForm] = useState({ name: "", email: "", phone: "", stadtteil: "", message: "", consent: false });
  const [website, setWebsite] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("contact");
  const [mapLoaded, setMapLoaded] = useState(false);

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
        event_label: "Patient Contact Form",
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
      message: form.stadtteil ? `[Stadtteil: ${form.stadtteil}] ${form.message}` : form.message,
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

  if (submitted) {
    return (
      <div className="bg-cm-cream min-h-[60vh] flex items-center justify-center py-20">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-full bg-cm-teal-50 flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 className="h-8 w-8 text-cm-teal" />
          </div>
          <h2 className="h-serif text-3xl text-cm-ink mb-3">{t("kontakt.success.h2")}</h2>
          <p className="text-cm-ink/70 leading-relaxed">
            {t("kontakt.success.p")}
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
            {t("kontakt.hero.pill")}
          </span>
          <h1 className="h-serif text-5xl lg:text-7xl text-cm-teal mt-6 mb-6 max-w-3xl leading-[1.05]">
            {t("kontakt.hero.h1")}
          </h1>
          <p className="text-lg text-cm-ink/80 max-w-2xl leading-relaxed">
            {t("kontakt.hero.p")}
          </p>
        </div>
      </section>

      {/* FORM + INFO */}
      <section className="container py-12 lg:py-14 grid lg:grid-cols-3 gap-8">
        <h2 className="sr-only">{t("kontakt.form.srLabel")}</h2>
        {/* FORMULAR */}
        <div className="lg:col-span-2 bg-white p-8 lg:p-10 rounded-3xl border border-cm-teal-100">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 bg-cm-teal-50 rounded-full p-1">
              <TabsTrigger value="contact" className="rounded-full data-[state=active]:bg-white">
                <Send className="w-4 h-4 mr-2" />
                {t("kontakt.form.tabs.contact")}
              </TabsTrigger>
              <TabsTrigger value="appointment" className="rounded-full data-[state=active]:bg-white">
                <Calendar className="w-4 h-4 mr-2" />
                {t("kontakt.form.tabs.appointment")}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="contact" className="mt-0">
              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                <HoneypotField value={website} onChange={setWebsite} />
                <p className="text-sm text-cm-ink/70">{t("kontakt.form.hint")}</p>
                <div>
                  <label htmlFor="name" className="text-sm font-medium text-cm-ink/80 mb-1.5 block">
                    {t("kontakt.form.name")} <span aria-hidden="true">*</span>
                  </label>
                  <input
                    id="name"
                    required
                    autoComplete="name"
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    placeholder="Max Mustermann"
                    className="w-full px-4 py-3 rounded-xl border border-cm-teal-100 focus:border-cm-teal-300 focus:ring-2 focus:ring-cm-teal-100 outline-none transition"
                  />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="phone" className="text-sm font-medium text-cm-ink/80 mb-1.5 block">
                      {t("kontakt.form.phone")} <span aria-hidden="true">*</span>
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      value={form.phone}
                      onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                      placeholder="0151 …"
                      aria-describedby="contact-help"
                      className="w-full px-4 py-3 rounded-xl border border-cm-teal-100 focus:border-cm-teal-300 focus:ring-2 focus:ring-cm-teal-100 outline-none transition"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="text-sm font-medium text-cm-ink/80 mb-1.5 block">
                      {t("kontakt.form.email")}{" "}
                      <span className="text-cm-ink/50">{t("kontakt.form.emailOptional")}</span>
                    </label>
                    <input
                      id="email"
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      value={form.email}
                      onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                      placeholder="max@beispiel.de"
                      aria-describedby="contact-help"
                      className="w-full px-4 py-3 rounded-xl border border-cm-teal-100 focus:border-cm-teal-300 focus:ring-2 focus:ring-cm-teal-100 outline-none transition"
                    />
                  </div>
                </div>
                <p id="contact-help" className="text-xs text-cm-ink/70">{t("kontakt.form.contactHelp")}</p>
                <div>
                  <label htmlFor="stadtteil" className="text-sm font-medium text-cm-ink/80 mb-1.5 block">
                    {t("kontakt.form.district")}
                  </label>
                  <select
                    id="stadtteil"
                    value={form.stadtteil}
                    onChange={(e) => setForm((f) => ({ ...f, stadtteil: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-cm-teal-100 focus:border-cm-teal-300 focus:ring-2 focus:ring-cm-teal-100 outline-none transition bg-white"
                  >
                    <option value="">{t("kontakt.form.districtPlaceholder")}</option>
                    {STADTTEILE.map((s) => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                  {form.stadtteil === "anderer" && (
                    <p className="mt-2 text-xs text-cm-ink/70 leading-relaxed bg-cm-teal-50 rounded-xl px-4 py-3">
                      {t("kontakt.form.districtOtherHint")}
                    </p>
                  )}
                </div>
                <div>
                  <label htmlFor="message" className="text-sm font-medium text-cm-ink/80 mb-1.5 block">
                    {t("kontakt.form.message")} <span aria-hidden="true">*</span>
                  </label>
                  <textarea
                    id="message"
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                    placeholder={t("kontakt.form.messagePlaceholder")}
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
                    : (<>{t("kontakt.form.submit")} <ArrowRight className="w-4 h-4" /></>)
                  }
                </button>
                <p className="text-xs text-cm-ink/70 text-center">{t("kontakt.form.subline")}</p>
              </form>
            </TabsContent>

            <TabsContent value="appointment" className="mt-0">
              {ZEEG_URL ? (
                <div className="rounded-2xl overflow-hidden border border-cm-teal-100 bg-white">
                  <iframe
                    src={ZEEG_URL}
                    title={t("kontakt.appointment.iframeTitle")}
                    className="w-full"
                    style={{ height: "720px", border: 0 }}
                    loading="lazy"
                  />
                </div>
              ) : (
                <div className="text-center py-12 px-6 bg-cm-teal-50/40 rounded-2xl border border-dashed border-cm-teal-200">
                  <Calendar className="w-10 h-10 text-cm-teal mx-auto mb-4" />
                  <h3 className="h-serif text-2xl text-cm-ink mb-2">
                    {t("kontakt.appointment.comingSoonTitle")}
                  </h3>
                  <p className="text-cm-ink/70 mb-6 max-w-md mx-auto">
                    {t("kontakt.appointment.comingSoonText")}
                  </p>
                  <a
                    href="tel:+496979216147"
                    className="inline-flex items-center gap-2 bg-cm-teal hover:bg-cm-teal-500 text-white px-6 py-3 rounded-full font-medium transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    {t("kontakt.appointment.callButton")}
                  </a>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* SIDEBAR */}
        <div className="space-y-5">
          <div className="bg-cm-teal-50 p-6 rounded-3xl">
            <h3 className="h-serif text-xl text-cm-ink mb-4">{t("kontakt.sidebar.reachUs")}</h3>
            <div className="space-y-3 text-sm">
              <a href="tel:+496979216147" className="flex gap-3 hover:text-cm-teal-600 transition-colors">
                <Phone className="w-5 h-5 text-cm-teal flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-medium text-cm-ink">{t("kontakt.sidebar.phone")}</div>
                  <div className="text-cm-ink/70 text-xs">{t("kontakt.sidebar.phoneHours")}</div>
                </div>
              </a>
              <a href="mailto:info@curamain.de" className="flex gap-3 hover:text-cm-teal-600 transition-colors">
                <Mail className="w-5 h-5 text-cm-teal flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-medium text-cm-ink">info@curamain.de</div>
                  <div className="text-cm-ink/70 text-xs">{t("kontakt.sidebar.emailReply")}</div>
                </div>
              </a>
              <div className="flex gap-3">
                <MapPin className="w-5 h-5 text-cm-teal flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-medium text-cm-ink">{t("kontakt.sidebar.address")}</div>
                  <div className="text-cm-ink/70 text-xs">{t("kontakt.sidebar.city")}</div>
                </div>
              </div>
              <div className="flex gap-3">
                <Clock className="w-5 h-5 text-cm-teal flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-medium text-cm-ink">{t("kontakt.sidebar.officeHours")}</div>
                  <div className="text-cm-ink/70 text-xs">{t("kontakt.sidebar.officeHoursVal")}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-cm-teal-100">
            <h3 className="h-serif text-xl text-cm-ink mb-2">{t("kontakt.sidebar.multilingual")}</h3>
            <p className="text-sm text-cm-ink/70 mb-3">{t("kontakt.sidebar.multilingualLabel")}</p>
            <div className="flex flex-wrap gap-2">
              {SPRACHEN.map((s) => (
                <span key={s} className="text-xs px-3 py-1 rounded-full bg-cm-teal-50 text-cm-teal-700">
                  {s}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-cm-ink text-white p-6 rounded-3xl">
            <h3 className="h-serif text-xl mb-2">{t("kontakt.sidebar.emergency")}</h3>
            <p className="text-sm text-white/80 mb-4">{t("kontakt.sidebar.emergencyText")}</p>
            <a
              href="tel:+496979216147"
              className="block w-full text-center bg-cm-mint hover:bg-cm-teal-300 text-cm-ink px-5 py-3 rounded-full font-medium transition-colors"
            >
              <Phone className="w-4 h-4 inline mr-2" />
              {t("kontakt.sidebar.callNow")}
            </a>
          </div>
        </div>
      </section>

      {/* MAP */}
      <section className="container pb-12 lg:pb-20">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-cm-teal">{t("kontakt.map.label")}</span>
          <h2 className="h-serif text-3xl lg:text-4xl text-cm-ink mt-3">{t("kontakt.map.h2")}</h2>
        </div>
        <div className="rounded-3xl overflow-hidden border border-cm-teal-100 h-96">
          {mapLoaded ? (
            <iframe
              src="https://www.google.com/maps?q=Berger%20Stra%C3%9Fe%2069,%2060316%20Frankfurt%20am%20Main&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={t("kontakt.map.iframeTitle")}
            />
          ) : (
            <button
              type="button"
              onClick={() => setMapLoaded(true)}
              className="w-full h-full flex flex-col items-center justify-center gap-3 bg-cm-teal-50 hover:bg-cm-teal-100 text-cm-ink transition-colors text-center px-6"
            >
              <MapPin className="w-8 h-8 text-cm-teal" />
              <span className="font-medium">{t("kontakt.map.loadButton")}</span>
              <span className="text-sm text-cm-ink/70 max-w-md leading-relaxed">
                {t("kontakt.map.loadConsent")}{" "}
                <Link href="/datenschutz" className="underline hover:text-cm-teal-700">
                  {t("kontakt.map.loadConsentLink")}
                </Link>.
              </span>
            </button>
          )}
        </div>
        <div className="mt-6 text-center">
          <p className="text-cm-ink/70 mb-4">{t("kontakt.map.address")}</p>
          <a
            href="https://maps.google.com/?q=Berger+Stra%C3%9Fe+69,+60316+Frankfurt+am+Main"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-cm-teal hover:bg-cm-teal-500 text-white px-6 py-2.5 rounded-full text-sm font-medium transition-colors"
          >
            {t("kontakt.map.openMaps")} <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </section>
    </div>
  );
}
