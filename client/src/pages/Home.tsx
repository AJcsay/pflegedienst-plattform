import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import {
  Heart, Shield, Phone, ArrowRight, CheckCircle2,
  Star, Quote, Users, Stethoscope, HandHeart,
} from "lucide-react";
import { useSEO } from "@/hooks/useSEO";

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

// Icon-Mapping für Service-Karten (Reihenfolge entspricht JSON-Array)
const SERVICE_ICONS = [Stethoscope, HandHeart, Heart, Users];

export default function Home() {
  const { t } = useTranslation();

  useSEO({
    title: t("home.seo.title"),
    description: t("home.seo.description"),
    keywords: t("home.seo.keywords"),
    canonical: "https://www.curamain.de",
  });

  const stats = t("home.stats", { returnObjects: true }) as Array<{ value: string; label: string }>;
  const serviceItems = t("home.services.items", { returnObjects: true }) as Array<{ title: string; sub: string; desc: string }>;
  const culturePoints = t("home.culture.points", { returnObjects: true }) as Array<{ title: string; desc: string }>;
  const teilhabeItems = t("home.teilhabe.items", { returnObjects: true }) as Array<{ title: string; desc: string }>;
  const coverageAreas = t("home.coverage.areas", { returnObjects: true }) as Array<{ slug: string; name: string; sub: string }>;
  const testimonials = t("home.testimonials.items", { returnObjects: true }) as Array<{ name: string; role: string; text: string }>;

  return (
    <div className="bg-white">
      {/* ─────────────────────────────────────────── */}
      {/* HERO — zentriert, hell, mit Bild-Trio       */}
      {/* ─────────────────────────────────────────── */}
      <section className="-mt-24 pt-24 bg-white">
        <div className="container pt-10 lg:pt-16 pb-10 text-center">
          <span className="inline-flex items-center gap-2 bg-cm-teal-50 text-cm-teal-700 px-4 py-2 rounded-full text-sm font-medium">
            <Heart className="w-4 h-4" fill="currentColor" aria-hidden="true" />
            {t("home.hero.pill")}
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-cm-navy mt-6 mb-5 max-w-3xl mx-auto leading-[1.1] tracking-tight">
            {t("home.hero.h1")}
          </h1>
          <p className="text-lg text-cm-ink/70 max-w-2xl mx-auto mb-7 leading-relaxed">
            {t("home.hero.p")}
          </p>
          <div className="flex flex-wrap gap-3 justify-center mb-4">
            <Link
              href="/kontakt/patient"
              className="bg-cm-teal-600 hover:bg-cm-teal-700 text-white px-7 py-3.5 rounded-xl font-medium shadow-lg flex items-center gap-2 transition-colors min-h-[48px]"
            >
              {t("home.hero.ctaPrimary")}
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
            <a
              href="tel:+496979216147"
              className="border border-cm-navy text-cm-navy px-7 py-3.5 rounded-xl font-medium flex items-center gap-2 hover:bg-cm-teal-50 transition-colors min-h-[48px]"
            >
              <Phone className="w-4 h-4" aria-hidden="true" />
              {t("home.hero.ctaPhone")}
            </a>
          </div>
          <p className="text-sm text-cm-ink/70 mb-8 inline-flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-cm-teal-700" aria-hidden="true" />
            {t("home.hero.subline")}
          </p>
          {/* Bild-Trio */}
          <div className="grid grid-cols-[1fr_1.4fr_1fr] gap-3 lg:gap-4 items-center max-w-4xl mx-auto">
            <img
              src={PHOTOS.behandlung}
              alt=""
              loading="eager"
              className="w-full h-40 sm:h-48 lg:h-60 object-cover rounded-2xl"
            />
            <img
              src={PHOTOS.hero}
              alt="Pflegefachperson von CuraMain bei der häuslichen Pflege"
              loading="eager"
              className="w-full h-48 sm:h-56 lg:h-72 object-cover rounded-2xl"
            />
            <img
              src={PHOTOS.beratung}
              alt=""
              loading="eager"
              className="w-full h-40 sm:h-48 lg:h-60 object-cover rounded-2xl"
            />
          </div>
        </div>
        {/* Stats-Leiste */}
        <div className="container pb-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto">
            {stats.map((s) => (
              <div key={s.label} className="bg-cm-cream rounded-2xl px-4 py-4 text-center">
                <div className="text-2xl lg:text-3xl font-semibold text-cm-navy">{s.value}</div>
                <div className="text-xs text-cm-ink/70 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────── */}
      {/* LEISTUNGEN-TEASER                           */}
      {/* ─────────────────────────────────────────── */}
      <section className="container py-12 lg:py-20">
        <div className="max-w-2xl mb-10">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-cm-teal">{t("home.services.label")}</span>
          <h2 className="text-3xl lg:text-4xl font-semibold text-cm-navy mt-3 mb-4 tracking-tight">
            {t("home.services.h2")}
          </h2>
          <p className="text-cm-ink/70 leading-relaxed">
            {t("home.services.p")}
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {serviceItems.map((s, i) => {
            const Icon = SERVICE_ICONS[i];
            return (
              <Link
                key={s.title}
                href="/leistungen"
                className="group bg-white p-7 rounded-2xl border border-cm-teal-100 hover:border-cm-teal-300 hover:shadow-lg transition"
              >
                <div className="w-12 h-12 rounded-xl bg-cm-teal-50 flex items-center justify-center mb-5">
                  <Icon className="w-6 h-6 text-cm-teal" aria-hidden="true" />
                </div>
                <h3 className="font-semibold text-lg mb-1.5 text-cm-ink">{s.title}</h3>
                <p className="text-xs uppercase tracking-wider text-cm-teal-600 mb-2">{s.sub}</p>
                <p className="text-sm text-cm-ink/70 leading-relaxed">{s.desc}</p>
              </Link>
            );
          })}
        </div>
        <div className="text-center mt-10">
          <Link
            href="/leistungen"
            className="inline-flex items-center gap-2 text-cm-teal-600 hover:text-cm-teal-700 font-medium"
          >
            {t("home.services.cta")} <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>
      </section>

      {/* ─────────────────────────────────────────── */}
      {/* KULTURSENSIBLE PFLEGE (Split mit Bild)      */}
      {/* ─────────────────────────────────────────── */}
      <section className="container pb-12 lg:pb-20">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <img
            src={PHOTOS.team}
            alt="Das internationale Pflegeteam von CuraMain"
            loading="lazy"
            className="w-full h-72 lg:h-[420px] object-cover rounded-2xl"
          />
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-cm-teal">{t("home.culture.label")}</span>
            <h2 className="text-3xl lg:text-4xl font-semibold text-cm-navy mt-3 mb-5 tracking-tight">
              {t("home.culture.h2a")}{t("home.culture.h2b")}
            </h2>
            <p className="text-cm-ink/70 leading-relaxed mb-6">
              {t("home.culture.p")}
            </p>
            <ul className="space-y-3">
              {culturePoints.map((p) => (
                <li key={p.title} className="flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-cm-teal flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <span className="font-medium text-cm-ink">{p.title}</span>
                    <span className="text-cm-ink/70"> – {p.desc}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────── */}
      {/* PFLEGE & TEILHABE — IN VORBEREITUNG         */}
      {/* ─────────────────────────────────────────── */}
      <section className="container pb-12 lg:pb-20">
        <div className="bg-white border border-cm-teal-100 rounded-2xl p-8 lg:p-12">
          <div className="max-w-3xl mb-8">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-cm-teal">{t("home.teilhabe.label")}</span>
            <h2 className="text-3xl lg:text-4xl font-semibold text-cm-navy mt-3 mb-4 tracking-tight">
              {t("home.teilhabe.h2")}
            </h2>
            <p className="text-cm-ink/70 leading-relaxed">
              {t("home.teilhabe.p")}
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {teilhabeItems.map((f) => (
              <div key={f.title} className="bg-cm-cream/60 border border-cm-teal-100 rounded-2xl p-5">
                <div className="text-xs uppercase tracking-wider text-cm-teal-600 font-medium mb-2">{t("home.teilhabe.badge")}</div>
                <h3 className="font-semibold text-cm-ink mb-2 leading-snug">{f.title}</h3>
                <p className="text-sm text-cm-ink/70 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/kontakt/patient?thema=teilhabe"
              className="bg-cm-teal-600 hover:bg-cm-teal-700 text-white px-6 py-3 rounded-xl font-medium shadow-sm inline-flex items-center gap-2 transition-colors"
            >
              {t("home.teilhabe.cta")} <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
            <span className="text-xs text-cm-ink/70 self-center">
              {t("home.teilhabe.note")}
            </span>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────── */}
      {/* VERSORGUNGSGEBIET (lokale Stadt-Links)      */}
      {/* ─────────────────────────────────────────── */}
      <section className="container pb-12 lg:pb-20">
        <div className="bg-white border border-cm-teal-100 rounded-2xl p-8 lg:p-10">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-cm-teal">{t("home.coverage.label")}</span>
              <h2 className="text-2xl lg:text-3xl font-semibold text-cm-navy mt-2 tracking-tight">{t("home.coverage.h2")}</h2>
            </div>
          </div>
          <p className="text-cm-ink/70 leading-relaxed mb-6 max-w-2xl">
            {t("home.coverage.p")}
          </p>
          <div className="grid sm:grid-cols-3 gap-3">
            {coverageAreas.map((c) => (
              <Link
                key={c.slug}
                href={`/pflege/${c.slug}`}
                className="group bg-cm-cream/60 hover:bg-cm-teal-50 border border-cm-teal-100 hover:border-cm-teal-300 rounded-2xl p-5 transition-colors"
              >
                <div className="font-semibold text-cm-ink group-hover:text-cm-teal-700 mb-1 flex items-center gap-2">
                  {c.name}
                  <ArrowRight className="w-4 h-4 opacity-60 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
                </div>
                <div className="text-xs text-cm-ink/70">{c.sub}</div>
              </Link>
            ))}
          </div>
          <div className="mt-4 text-right">
            <Link
              href="/frankfurt"
              className="inline-flex items-center gap-2 text-cm-teal-600 hover:text-cm-teal-700 font-medium text-sm"
            >
              {t("home.coverage.cta")} <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────── */}
      {/* TESTIMONIALS                                */}
      {/* ─────────────────────────────────────────── */}
      <section className="container pb-12 lg:pb-20">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-cm-teal">{t("home.testimonials.label")}</span>
          <h2 className="text-3xl lg:text-4xl font-semibold text-cm-navy mt-3 tracking-tight">
            {t("home.testimonials.h2").split("\n").map((line, i) => (
              <span key={i}>{line}{i === 0 && <br />}</span>
            ))}
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {testimonials.map((testimonial) => (
            <div key={testimonial.name} className="bg-white p-7 rounded-2xl border border-cm-teal-100 relative">
              <Quote className="w-7 h-7 text-cm-teal-200 absolute top-5 right-5" aria-hidden="true" />
              <div className="flex gap-0.5 mb-4 text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" aria-hidden="true" />
                ))}
              </div>
              <p className="text-cm-ink/80 italic leading-relaxed mb-5">„{testimonial.text}"</p>
              <div className="border-t border-cm-teal-100 pt-4">
                <div className="font-semibold text-cm-ink">{testimonial.name}</div>
                <div className="text-xs text-cm-ink/70 mt-0.5">{testimonial.role}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link
            href="/testimonials"
            className="inline-flex items-center gap-2 text-cm-teal-600 hover:text-cm-teal-700 font-medium"
          >
            {t("home.testimonials.cta")} <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>
      </section>

      {/* ─────────────────────────────────────────── */}
      {/* CTA-Banner — tiefes Tannen-Teal             */}
      {/* ─────────────────────────────────────────── */}
      <section className="container pb-12 lg:pb-20">
        <div className="rounded-2xl p-10 lg:p-16 text-center bg-cm-pine">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-semibold text-white mb-5 tracking-tight">
              {t("home.ctaBanner.h2")}
            </h2>
            <p className="text-cm-mint-light text-lg mb-8 leading-relaxed">
              {t("home.ctaBanner.p")}
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link
                href="/kontakt/patient"
                className="bg-cm-mint hover:bg-cm-mint-dark text-cm-pine-deep px-7 py-3.5 rounded-xl font-medium shadow-lg inline-flex items-center gap-2 transition-colors"
              >
                {t("home.ctaBanner.book")} <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
              <a
                href="tel:+496979216147"
                className="border border-cm-teal-400 text-white px-7 py-3.5 rounded-xl font-medium inline-flex items-center gap-2 hover:bg-white/10 transition-colors"
              >
                <Phone className="w-4 h-4" aria-hidden="true" />
                {t("home.ctaBanner.phone")}
              </a>
            </div>
            <div className="mt-6 flex flex-wrap gap-3 justify-center text-sm text-white/80">
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
