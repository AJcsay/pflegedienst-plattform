import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import {
  Heart, Shield, Phone, ArrowRight, CheckCircle2,
  Star, Quote, Users, Home as HomeIcon, Languages, Clock,
} from "lucide-react";
import { useSEO } from "@/hooks/useSEO";
import QuickContact from "@/components/QuickContact";

// Lokale Bilder (in client/public/img/, siehe scripts/download-images.sh)
const PHOTOS = {
  hero: "/img/hero.webp",
  behandlung: "/img/behandlung.webp",
  grundpflege: "/img/grundpflege.webp",
  hauswirtschaft: "/img/hauswirtschaft.webp",
  beratung: "/img/beratung.webp",
  team: "/img/team.webp",
  aktivierung: "/img/aktivierung.webp",
};

// Foto-Mapping für die gekippten Leistungs-Karten (Reihenfolge = JSON-Array)
const SERVICE_PHOTOS = [
  PHOTOS.behandlung,
  PHOTOS.grundpflege,
  PHOTOS.beratung,
  PHOTOS.hauswirtschaft,
];

// Icons für die schwebenden Hero-Karten (Reihenfolge = JSON-Array)
const FLOAT_ICONS = [HomeIcon, Languages, Clock];

export default function Home() {
  const { t } = useTranslation();

  useSEO({
    title: t("home.seo.title"),
    description: t("home.seo.description"),
    keywords: t("home.seo.keywords"),
    canonical: "https://www.curamain.de",
  });

  const stats = t("home.stats", { returnObjects: true }) as Array<{ value: string; label: string }>;
  const heroCards = t("home.hero.cards", { returnObjects: true }) as Array<{ title: string; sub: string }>;
  const bandRow1 = t("home.band.row1", { returnObjects: true }) as string[];
  const bandRow2 = t("home.band.row2", { returnObjects: true }) as string[];
  const serviceItems = t("home.services.items", { returnObjects: true }) as Array<{ title: string; sub: string; desc: string }>;
  const culturePoints = t("home.culture.points", { returnObjects: true }) as Array<{ title: string; desc: string }>;
  const teamMembers = t("home.team.members", { returnObjects: true }) as Array<{ initials: string; name: string; role: string; tag: string }>;
  const teilhabeItems = t("home.teilhabe.items", { returnObjects: true }) as Array<{ title: string; desc: string }>;
  const coverageAreas = t("home.coverage.areas", { returnObjects: true }) as Array<{ slug: string; name: string; sub: string }>;
  const testimonials = t("home.testimonials.items", { returnObjects: true }) as Array<{ name: string; role: string; text: string }>;
  const processSteps = t("home.process.steps", { returnObjects: true }) as Array<{ title: string; desc: string }>;

  return (
    <div className="bg-white">
      {/* ─────────────────────────────────────────── */}
      {/* HERO — dunkel (Navy) mit Foto-Blob          */}
      {/* ─────────────────────────────────────────── */}
      <section className="-mt-24 pt-24 cm-hero-dark overflow-hidden">
        <div className="container pt-14 lg:pt-20 pb-16 lg:pb-24 grid lg:grid-cols-[1.15fr_0.85fr] gap-12 items-center">
          <div>
            <span className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white px-4 py-2 rounded-full text-[13px] font-semibold tracking-wide">
              <Heart className="w-4 h-4 text-cm-mint" fill="currentColor" aria-hidden="true" />
              {t("home.hero.pill")}
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-[56px] text-white mt-6 mb-6 max-w-3xl leading-[1.12]">
              {t("home.hero.h1a")}{" "}
              <em className="cm-accent-dark">{t("home.hero.h1b")}</em>
            </h1>
            <p className="text-lg text-white/80 max-w-xl mb-8 leading-relaxed">
              {t("home.hero.p")}
            </p>
            <div className="flex flex-wrap gap-3 mb-4">
              <Link
                href="/kontakt/patient"
                className="bg-cm-teal-500 hover:bg-cm-teal-600 text-white px-7 py-4 rounded-full font-bold flex items-center gap-2 transition-colors min-h-[48px] shadow-lg"
              >
                {t("home.hero.ctaPrimary")}
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
              <a
                href="tel:+496979216147"
                className="border-[1.5px] border-white/45 hover:border-white text-white px-7 py-4 rounded-full font-bold flex items-center gap-2 transition-colors min-h-[48px]"
              >
                <Phone className="w-4 h-4" aria-hidden="true" />
                {t("home.hero.ctaPhone")}
              </a>
            </div>
            <p className="text-sm text-white/70 mb-10 inline-flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-cm-mint" aria-hidden="true" />
              {t("home.hero.subline")}
            </p>
            {/* Kennzahlen-Reihe im Hero */}
            <div className="flex flex-wrap gap-x-9 gap-y-5">
              {stats.map((s) => (
                <div key={s.label}>
                  <div className="text-2xl lg:text-3xl font-extrabold text-white">
                    {s.value.replace(/[+★%]/g, "")}
                    <span className="text-cm-mint">{s.value.match(/[+★%]+/)?.[0] ?? ""}</span>
                  </div>
                  <div className="text-[13px] text-white/60 mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Foto-Blob mit Zierring + schwebenden Karten */}
          <div className="relative min-h-[420px] lg:min-h-[480px] hidden md:block">
            <div className="cm-ring w-[210px] h-[210px] -top-6 -right-4" aria-hidden="true" />
            <div className="cm-blob absolute inset-0">
              <img
                src={PHOTOS.hero}
                alt="Pflegefachperson von CuraMain im Gespräch mit einer Patientin zu Hause"
                loading="eager"
                style={{ objectPosition: "38% center" }}
              />
            </div>
            {heroCards.map((c, i) => {
              const Icon = FLOAT_ICONS[i] ?? Heart;
              const pos = ["top-[8%] -left-[6%]", "bottom-[16%] -right-[4%]", "-bottom-[2%] left-[12%]"][i] ?? "";
              return (
                <div key={c.title} className={`cm-float ${pos} max-w-[220px]`}>
                  <div className="w-9 h-9 rounded-[10px] bg-cm-teal-50 flex items-center justify-center shrink-0">
                    <Icon className="w-[18px] h-[18px] text-cm-teal-600" aria-hidden="true" />
                  </div>
                  <div className="leading-snug">
                    {c.title}
                    <small className="block font-medium text-[11.5px] text-cm-ink/60">{c.sub}</small>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────── */}
      {/* LEISTUNGEN — gekippte Foto-Karten           */}
      {/* ─────────────────────────────────────────── */}
      <section className="container py-14 lg:py-20 text-center">
        <span className="cm-badge">{t("home.services.label")}</span>
        <h2 className="text-3xl lg:text-4xl text-cm-ink mt-4 mb-4">
          {t("home.services.h2")}
        </h2>
        <p className="text-cm-ink/70 leading-relaxed max-w-2xl mx-auto">
          {t("home.services.p")}
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-11">
          {serviceItems.map((s, i) => (
            <Link
              key={s.title}
              href="/leistungen"
              className="cm-tilt group relative rounded-2xl overflow-hidden min-h-[300px] flex items-end shadow-[0_8px_26px_rgba(20,35,80,0.10)]"
            >
              <img
                src={SERVICE_PHOTOS[i] ?? PHOTOS.team}
                alt=""
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div
                className="absolute inset-0"
                style={{ background: "linear-gradient(rgba(14,31,74,0) 35%, rgba(14,31,74,0.82) 100%)" }}
                aria-hidden="true"
              />
              <div className="relative w-full p-5 text-left text-white">
                <b className="block text-[16px] leading-tight">{s.title}</b>
                <span className="text-xs opacity-80">{s.sub}</span>
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-10">
          <Link
            href="/leistungen"
            className="inline-flex items-center gap-2 bg-cm-navy hover:bg-cm-navy-light text-white px-7 py-3.5 rounded-full font-bold transition-colors"
          >
            {t("home.services.cta")} <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>
      </section>

      {/* ─────────────────────────────────────────── */}
      {/* LAUFENDE DIAGONAL-BÄNDER                    */}
      {/* ─────────────────────────────────────────── */}
      <div className="relative h-[190px] overflow-hidden my-4" aria-hidden="true">
        <div className="cm-band cm-band-teal top-[38px]">
          <div className="cm-band-inner">
            {[...bandRow1, ...bandRow1].map((w, i) => (
              <span key={`${w}-${i}`}>{w}</span>
            ))}
          </div>
        </div>
        <div className="cm-band cm-band-navy top-[92px]">
          <div className="cm-band-inner">
            {[...bandRow2, ...bandRow2].map((w, i) => (
              <span key={`${w}-${i}`}>{w}</span>
            ))}
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────── */}
      {/* KULTURSENSIBLE PFLEGE (Split, Cream)        */}
      {/* ─────────────────────────────────────────── */}
      <section className="bg-cm-cream py-14 lg:py-20">
        <div className="container grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          <div className="relative rounded-3xl overflow-hidden min-h-[340px] lg:min-h-[420px]">
            <img
              src={PHOTOS.team}
              alt="Das internationale Pflegeteam von CuraMain"
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute bottom-5 left-5 right-5 bg-white/95 rounded-2xl px-5 py-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-cm-teal-500 text-white flex items-center justify-center shrink-0">
                <Languages className="w-5 h-5" aria-hidden="true" />
              </div>
              <div className="text-sm font-bold text-cm-navy leading-snug">
                {t("home.hero.cards.1.title")}
                <span className="block font-medium text-cm-ink/60 text-xs">{t("home.hero.cards.1.sub")}</span>
              </div>
            </div>
          </div>
          <div>
            <span className="cm-badge">{t("home.culture.label")}</span>
            <h2 className="text-3xl lg:text-4xl text-cm-ink mt-4 mb-5">
              {t("home.culture.h2a")}{t("home.culture.h2b")}
            </h2>
            <p className="text-cm-ink/70 leading-relaxed mb-7">
              {t("home.culture.p")}
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              {culturePoints.map((p) => (
                <div key={p.title} className="bg-white border border-cm-teal-100 rounded-2xl p-5">
                  <CheckCircle2 className="w-5 h-5 text-cm-teal-500 mb-2.5" aria-hidden="true" />
                  <span className="block font-bold text-[15px] text-cm-ink mb-1">{p.title}</span>
                  <span className="text-[13px] text-cm-ink/70 leading-relaxed">{p.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────── */}
      {/* TEAM — Fotos folgen (Initialen-Platzhalter) */}
      {/* ─────────────────────────────────────────── */}
      <section className="container py-14 lg:py-20 text-center">
        <span className="cm-badge">{t("home.team.label")}</span>
        <h2 className="text-3xl lg:text-4xl text-cm-ink mt-4 mb-3">
          {t("home.team.h2a")} <em className="cm-accent">{t("home.team.h2b")}</em>
        </h2>
        <p className="text-cm-ink/70 max-w-xl mx-auto">{t("home.team.p")}</p>
        <div className="grid sm:grid-cols-3 gap-6 mt-11 max-w-4xl mx-auto">
          {teamMembers.map((m, i) => (
            <div
              key={m.name + i}
              className="rounded-3xl border border-cm-teal-100 bg-white overflow-hidden hover:-translate-y-1.5 hover:shadow-[0_16px_40px_rgba(20,35,80,0.13)] transition"
            >
              <div className={`relative h-52 flex items-center justify-center ${i % 2 === 0 ? "bg-cm-teal-50" : "bg-cm-teal-100"}`}>
                <span className="absolute top-3.5 left-3.5 bg-white rounded-full text-[11.5px] font-bold px-3 py-1 text-cm-navy shadow-sm">
                  {m.tag}
                </span>
                <div className="w-[88px] h-[88px] rounded-full bg-cm-navy text-white text-[28px] font-extrabold flex items-center justify-center shadow-lg">
                  {m.initials}
                </div>
              </div>
              <div className="p-5">
                <b className="block text-[17px] text-cm-ink">{m.name}</b>
                <span className="inline-block mt-2 bg-cm-teal-50 text-cm-teal-700 text-[12.5px] font-bold px-3.5 py-1 rounded-full">
                  {m.role}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─────────────────────────────────────────── */}
      {/* PROZESS — Schritte (Cream-Karten)           */}
      {/* ─────────────────────────────────────────── */}
      <section className="container pb-14 lg:pb-20 text-center">
        <span className="cm-badge">{t("home.process.label")}</span>
        <h2 className="text-3xl lg:text-4xl text-cm-ink mt-4 mb-4">
          {t("home.process.h2")}
        </h2>
        <p className="text-cm-ink/70 max-w-2xl mx-auto">{t("home.process.p")}</p>
        <ol className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-11 text-left">
          {processSteps.map((step, i) => (
            <li key={step.title} className="bg-cm-cream rounded-3xl p-7 relative list-none">
              <span className="absolute top-5 right-5 bg-cm-teal-500 text-white text-[11.5px] font-extrabold px-3 py-1 rounded-full">
                {i + 1}
              </span>
              <span className="w-12 h-12 rounded-2xl bg-white shadow-[0_6px_18px_rgba(20,35,80,0.08)] flex items-center justify-center text-cm-navy font-extrabold text-lg mb-4">
                {i + 1}
              </span>
              <h3 className="text-[17px] text-cm-ink mb-2">{step.title}</h3>
              <p className="text-sm text-cm-ink/70 leading-relaxed">{step.desc}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* ─────────────────────────────────────────── */}
      {/* PFLEGE & TEILHABE — IN VORBEREITUNG         */}
      {/* ─────────────────────────────────────────── */}
      <section className="container pb-14 lg:pb-20">
        <div className="text-center max-w-3xl mx-auto">
          <span className="cm-badge">{t("home.teilhabe.label")}</span>
          <h2 className="text-3xl lg:text-4xl text-cm-ink mt-4 mb-4">
            {t("home.teilhabe.h2")}
          </h2>
          <p className="text-cm-ink/70 leading-relaxed">
            {t("home.teilhabe.p")}
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-10">
          {teilhabeItems.map((f) => (
            <div key={f.title} className="border-[1.5px] border-dashed border-cm-teal-300 rounded-2xl p-5 bg-white">
              <div className="inline-block bg-cm-teal-50 text-cm-teal-700 text-[11px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full mb-3">
                {t("home.teilhabe.badge")}
              </div>
              <h3 className="text-[16px] text-cm-ink mb-1.5 leading-snug">{f.title}</h3>
              <p className="text-[13px] text-cm-ink/70 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap gap-4 justify-center items-center">
          <Link
            href="/kontakt/patient?thema=teilhabe"
            className="bg-cm-teal-500 hover:bg-cm-teal-600 text-white px-7 py-3.5 rounded-full font-bold inline-flex items-center gap-2 transition-colors"
          >
            {t("home.teilhabe.cta")} <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
          <span className="text-xs text-cm-ink/70">
            {t("home.teilhabe.note")}
          </span>
        </div>
      </section>

      {/* ─────────────────────────────────────────── */}
      {/* WARUM CURAMAIN — dunkle Sektion + Coverage  */}
      {/* ─────────────────────────────────────────── */}
      <section className="cm-hero-dark py-14 lg:py-20">
        <div className="container">
          <div className="text-center">
            <span className="cm-badge cm-badge-dark">{t("home.coverage.label")}</span>
            <h2 className="text-3xl lg:text-4xl text-white mt-4 mb-4">
              {t("home.coverage.h2")}
            </h2>
            <p className="text-white/70 max-w-2xl mx-auto">{t("home.coverage.p")}</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-4 mt-10">
            {coverageAreas.map((c) => (
              <Link
                key={c.slug}
                href={`/pflege/${c.slug}`}
                className="group bg-white/[0.07] hover:bg-white/[0.14] border border-white/15 rounded-2xl p-6 transition-colors"
              >
                <div className="font-bold text-white text-lg mb-1 flex items-center gap-2">
                  {c.name}
                  <ArrowRight className="w-4 h-4 text-cm-mint opacity-70 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
                </div>
                <div className="text-[13px] text-white/60">{c.sub}</div>
              </Link>
            ))}
          </div>
          <div className="mt-6 text-center">
            <Link
              href="/frankfurt"
              className="inline-flex items-center gap-2 text-cm-mint hover:text-white font-bold text-sm transition-colors"
            >
              {t("home.coverage.cta")} <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────── */}
      {/* TESTIMONIALS                                */}
      {/* ─────────────────────────────────────────── */}
      <section className="bg-cm-cream py-14 lg:py-20">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-11">
            <span className="cm-badge">{t("home.testimonials.label")}</span>
            <h2 className="text-3xl lg:text-4xl text-cm-ink mt-4">
              {t("home.testimonials.h2").split("\n").map((line, i) => (
                <span key={i}>{line}{i === 0 && <br />}</span>
              ))}
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {testimonials.map((testimonial) => (
              <div key={testimonial.name} className="bg-white p-7 rounded-3xl border border-cm-teal-100 relative">
                <Quote className="w-7 h-7 text-cm-teal-200 absolute top-5 right-5" aria-hidden="true" />
                <div className="flex gap-0.5 mb-4 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" aria-hidden="true" />
                  ))}
                </div>
                <p className="text-cm-ink/80 leading-relaxed mb-5">„{testimonial.text}"</p>
                <div className="border-t border-cm-teal-100 pt-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-cm-navy text-white font-extrabold text-sm flex items-center justify-center shrink-0">
                    {testimonial.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                  </div>
                  <div>
                    <div className="font-bold text-cm-ink text-sm">{testimonial.name}</div>
                    <div className="text-xs text-cm-ink/60 mt-0.5">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              href="/testimonials"
              className="inline-flex items-center gap-2 text-cm-teal-700 hover:text-cm-navy font-bold"
            >
              {t("home.testimonials.cta")} <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────── */}
      {/* INLINE-SCHNELLKONTAKT (eigenes Formular)    */}
      {/* ─────────────────────────────────────────── */}
      <QuickContact />

      {/* ─────────────────────────────────────────── */}
      {/* CTA-Banner — Teal→Navy-Verlauf              */}
      {/* ─────────────────────────────────────────── */}
      <section className="container pb-14 lg:pb-20">
        <div
          className="rounded-3xl p-10 lg:p-16 text-center"
          style={{ background: "linear-gradient(120deg, var(--cm-teal-500), var(--cm-navy))" }}
        >
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl lg:text-4xl text-white mb-5">
              {t("home.ctaBanner.h2")}
            </h2>
            <p className="text-white/85 text-lg mb-8 leading-relaxed">
              {t("home.ctaBanner.p")}
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link
                href="/kontakt/patient"
                className="bg-white hover:bg-cm-teal-50 text-cm-navy px-7 py-3.5 rounded-full font-bold shadow-lg inline-flex items-center gap-2 transition-colors"
              >
                {t("home.ctaBanner.book")} <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
              <a
                href="tel:+496979216147"
                className="border-[1.5px] border-white/50 hover:border-white text-white px-7 py-3.5 rounded-full font-bold inline-flex items-center gap-2 transition-colors"
              >
                <Phone className="w-4 h-4" aria-hidden="true" />
                {t("home.ctaBanner.phone")}
              </a>
            </div>
            <div className="mt-6 flex flex-wrap gap-4 justify-center text-sm text-white/80">
              <span className="flex items-center gap-1.5"><Users className="w-4 h-4" aria-hidden="true" />{t("home.ctaBanner.badge1")}</span>
              <span className="flex items-center gap-1.5"><Shield className="w-4 h-4" aria-hidden="true" />{t("home.ctaBanner.badge2")}</span>
              <span className="flex items-center gap-1.5"><Heart className="w-4 h-4" aria-hidden="true" />{t("home.ctaBanner.badge3")}</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
