import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import {
  Stethoscope, HandHeart, UserCheck, CalendarCheck, Users,
  ArrowRight, CheckCircle2, Phone
} from "lucide-react";
import { useSEO } from "@/hooks/useSEO";
import { useSearch } from "wouter";
import { useEffect } from "react";

const PHOTOS = {
  hero: "/img/beratung.webp",
  behandlung: "/img/behandlung.webp",
  grundpflege: "/img/grundpflege.webp",
  team: "/img/team.webp",
};

// Icon-Mapping für fullServices (Reihenfolge entspricht JSON-Array)
const FULL_SERVICE_ICONS = [Stethoscope, HandHeart];
const FULL_SERVICE_IMGS = [PHOTOS.behandlung, PHOTOS.grundpflege];

// Icon-Mapping für compactServices
const COMPACT_SERVICE_ICONS = [UserCheck, CalendarCheck, Users];

export default function Leistungen() {
  const { t } = useTranslation();

  useSEO({
    title: t("leistungen.seo.title"),
    description: t("leistungen.seo.description"),
    keywords: t("leistungen.seo.keywords"),
    canonical: "https://www.curamain.de/leistungen",
  });

  const searchString = useSearch();
  const searchParams = new URLSearchParams(searchString);
  const section = searchParams.get("section");

  useEffect(() => {
    if (!section) return;
    const timer = setTimeout(() => {
      const el = document.getElementById(section);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 200);
    return () => clearTimeout(timer);
  }, [section]);

  type FullService = { id: string; title: string; sub: string; description: string; details: string[] };
  type CompactService = { id: string; title: string; sub: string; description: string; badge: string };
  type TeilhabeItem = { title: string; sub: string; desc: string };
  type CulturePoint = { title: string; desc: string };

  const fullServices = t("leistungen.fullServices", { returnObjects: true }) as FullService[];
  const compactItems = t("leistungen.compactServices.items", { returnObjects: true }) as CompactService[];
  const teilhabeItems = t("leistungen.teilhabe.items", { returnObjects: true }) as TeilhabeItem[];
  const culturePoints = t("leistungen.culture.points", { returnObjects: true }) as CulturePoint[];

  return (
    <div className="bg-cm-cream">
      {/* HERO */}
      <section
        className="relative min-h-[420px] hero-bg -mt-24 pt-24"
        style={{ backgroundImage: `url(${PHOTOS.hero}), linear-gradient(135deg, #daedeb, #f9f6f1)` }}
      >
        <div className="relative z-10 container pt-6 pb-10">
          <span className="pill inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm border border-white/60 shadow-sm">
            <CheckCircle2 className="w-4 h-4 text-cm-teal" />
            {t("leistungen.hero.pill")}
          </span>
          <h1 className="h-serif text-5xl lg:text-7xl text-cm-teal mt-6 mb-6 max-w-5xl leading-[1.05]">
            {t("leistungen.hero.h1")}
          </h1>
          <p className="text-lg lg:text-xl text-cm-ink/80 max-w-3xl leading-relaxed">
            {t("leistungen.hero.p")}
          </p>
        </div>
      </section>

      {/* HAUPT-SERVICES (2 große Split-Sektionen) */}
      <section className="container py-12 lg:py-14 space-y-6">
        {fullServices.map((s, i) => {
          const Icon = FULL_SERVICE_ICONS[i];
          const img = FULL_SERVICE_IMGS[i];
          return (
            <div
              key={s.id}
              id={s.id}
              className="grid lg:grid-cols-2 gap-0 bg-white rounded-3xl overflow-hidden border border-cm-teal-100"
            >
              <div className={`p-10 lg:p-14 ${i % 2 === 1 ? "lg:order-2" : ""}`}>
                <div className="w-12 h-12 rounded-2xl bg-cm-teal-50 flex items-center justify-center mb-5">
                  <Icon className="w-6 h-6 text-cm-teal" />
                </div>
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-cm-teal">{s.sub}</span>
                <h2 className="h-serif text-4xl text-cm-ink mt-2 mb-4">{s.title}</h2>
                <p className="text-cm-ink/70 mb-6 leading-relaxed">{s.description}</p>
                <ul className="space-y-2 text-sm">
                  {s.details.map((d) => (
                    <li key={d} className="flex gap-2.5">
                      <CheckCircle2 className="w-5 h-5 text-cm-teal flex-shrink-0" />
                      <span className="text-cm-ink/80">{d}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div
                className={`hero-bg min-h-[320px] ${i % 2 === 1 ? "lg:order-1" : ""}`}
                style={{ backgroundImage: `url(${img})` }}
              />
            </div>
          );
        })}
      </section>

      {/* WEITERE LEISTUNGEN (kompakte Cards) */}
      <section className="container pb-12 lg:pb-14">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-cm-teal">{t("leistungen.compactServices.label")}</span>
          <h2 className="h-serif text-4xl lg:text-5xl text-cm-ink mt-3">{t("leistungen.compactServices.h2")}</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-5">
          {compactItems.map((s, i) => {
            const Icon = COMPACT_SERVICE_ICONS[i];
            return (
              <div key={s.id} id={s.id} className="bg-white p-8 rounded-3xl border border-cm-teal-100">
                <div className="w-12 h-12 rounded-2xl bg-cm-teal-50 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-cm-teal" />
                </div>
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-cm-teal">{s.sub}</span>
                <h3 className="h-serif text-2xl text-cm-ink mt-2 mb-3">{s.title}</h3>
                <p className="text-sm text-cm-ink/70 mb-3 leading-relaxed">{s.description}</p>
                <p className="text-xs text-cm-teal-600 font-medium">{s.badge}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* IN VORBEREITUNG — PFLEGE & TEILHABE */}
      <section id="teilhabe" className="container pb-12 lg:pb-14">
        <div className="bg-white border border-cm-teal-100 rounded-3xl p-8 lg:p-12">
          <div className="max-w-3xl mb-8">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-cm-teal">{t("leistungen.teilhabe.label")}</span>
            <h2 className="h-serif text-4xl lg:text-5xl text-cm-ink mt-3 mb-4">
              {t("leistungen.teilhabe.h2")}
            </h2>
            <p className="text-cm-ink/70 leading-relaxed">
              {t("leistungen.teilhabe.p")}
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            {teilhabeItems.map((f) => (
              <div key={f.title} className="bg-cm-cream/60 border border-cm-teal-100 rounded-2xl p-6">
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-cm-teal">{f.sub}</span>
                <h3 className="h-serif text-2xl text-cm-ink mt-2 mb-3">{f.title}</h3>
                <p className="text-sm text-cm-ink/70 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/kontakt/patient?thema=teilhabe"
              className="bg-cm-teal-600 hover:bg-cm-teal-700 text-white px-6 py-3 rounded-full font-medium shadow-sm inline-flex items-center gap-2 transition-colors"
            >
              {t("leistungen.teilhabe.cta")} <ArrowRight className="w-4 h-4" />
            </Link>
            <span className="text-xs text-cm-ink/70 self-center max-w-md">
              {t("leistungen.teilhabe.note")}
            </span>
          </div>
        </div>
      </section>

      {/* KULTURSENSIBLE PFLEGE */}
      <section className="container pb-12 lg:pb-14">
        <div className="grid lg:grid-cols-2 gap-0 bg-cm-ink text-white rounded-3xl overflow-hidden">
          <div className="p-10 lg:p-14 flex flex-col justify-center">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-cm-mint">{t("leistungen.culture.label")}</span>
            <h2 className="h-serif text-4xl lg:text-5xl mt-3 mb-5 leading-[1.05]">
              {t("leistungen.culture.h2a")}
              <span className="text-cm-mint">{t("leistungen.culture.h2b")}</span>
            </h2>
            <p className="text-white/80 leading-relaxed mb-7">
              {t("leistungen.culture.p")}
            </p>
            <ul className="space-y-3 text-sm text-white/85">
              {culturePoints.map((p) => (
                <li key={p.title} className="flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-cm-mint flex-shrink-0" />
                  <span>
                    <strong className="text-white">{p.title}</strong>
                    {" – "}{p.desc}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div
            className="hero-bg min-h-[360px]"
            style={{ backgroundImage: `url(${PHOTOS.team})` }}
          />
        </div>
      </section>

      {/* CTA */}
      <section className="container pb-12 lg:pb-20">
        <div className="bg-cm-teal-50 rounded-3xl p-10 lg:p-12 text-center">
          <h2 className="h-serif text-3xl lg:text-4xl text-cm-ink mb-3">{t("leistungen.cta.h2")}</h2>
          <p className="text-cm-ink/70 mb-7 max-w-xl mx-auto">
            {t("leistungen.cta.p")}
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/kontakt/patient"
              className="bg-cm-teal hover:bg-cm-teal-500 text-white px-7 py-3 rounded-full font-medium shadow-md inline-flex items-center gap-2 transition-colors"
            >
              {t("leistungen.cta.primary")} <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="tel:+496979216147"
              className="bg-white border border-cm-teal-100 hover:border-cm-teal-300 text-cm-ink px-7 py-3 rounded-full font-medium inline-flex items-center gap-2 transition-colors"
            >
              <Phone className="w-4 h-4 text-cm-teal" />
              {t("leistungen.cta.phone")}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
