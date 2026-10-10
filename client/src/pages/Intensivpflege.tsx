import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import {
  Wind, Activity, Utensils, HeartPulse, ShieldAlert, Users,
  ArrowRight, CheckCircle2, Phone, Hospital, MapPin, UserCheck, Info,
} from "lucide-react";
import { useSEO } from "@/hooks/useSEO";

/**
 * Außerklinische Intensivpflege (AKI) — eigene Leistungsseite, seit 10.10.2026.
 *
 * GF-Entscheide 10.10.2026: beworben wird AKI für ERWACHSENE, mit und ohne
 * Beatmung, Einsatzgebiet Frankfurt und Rhein-Main. Keine 24/7-Erreichbarkeits-
 * zusage (Bereitschaftsdienst nach § 8 Abs. 2 Vertrag § 132l steht noch nicht) —
 * zugesagt wird nur die 1:1-Versorgung vor Ort im Umfang der Verordnung.
 * Werberechtliche Leitplanken (HWG/UWG, AKI-RL): kein Weaning-Versprechen,
 * nicht „kostenlos“ (gesetzliche Zuzahlung), keine Intensiv-WG/Pflegeheime als
 * Leistungsorte, keine Erfolgsversprechen. Texte in i18n/locales/*.json.
 */

const PHOTOS = {
  hero: "/img/intensivpflege.webp",
  zweit: "/img/intensivpflege-beratung.webp",
};

const LEISTUNG_ICONS = [Wind, Activity, Utensils, HeartPulse, ShieldAlert, Users];

export default function Intensivpflege() {
  const { t } = useTranslation();

  useSEO({
    title: t("intensivpflege.seo.title"),
    description: t("intensivpflege.seo.description"),
    keywords: t("intensivpflege.seo.keywords"),
    canonical: "https://www.curamain.de/intensivpflege",
  });

  type Item = { title: string; desc: string };
  const leistungen = t("intensivpflege.leistungen.items", { returnObjects: true }) as Item[];
  const schritte = t("intensivpflege.ablauf.steps", { returnObjects: true }) as Item[];
  const klinikPunkte = t("intensivpflege.kliniken.points", { returnObjects: true }) as string[];

  return (
    <div className="bg-white">
      {/* HERO — dunkel wie die Startseite */}
      <section className="-mt-24 pt-24 cm-hero-dark overflow-hidden">
        <div className="container pt-14 lg:pt-20 pb-16 lg:pb-20 grid lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center">
          <div>
            <span className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white px-4 py-2 rounded-full text-[13px] font-semibold tracking-wide">
              <Wind className="w-4 h-4 text-cm-mint" aria-hidden="true" />
              {t("intensivpflege.hero.pill")}
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-[56px] text-white mt-6 mb-6 leading-[1.12]">
              {t("intensivpflege.hero.h1")}
            </h1>
            <p className="text-lg text-white/80 max-w-xl mb-8 leading-relaxed">
              {t("intensivpflege.hero.p")}
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/kontakt/patient?thema=intensivpflege"
                className="bg-cm-teal-500 hover:bg-cm-teal-600 text-white px-7 py-4 rounded-full font-bold flex items-center gap-2 transition-colors min-h-[48px] shadow-lg"
              >
                {t("intensivpflege.hero.ctaPrimary")}
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
              <a
                href="tel:+496979216147"
                className="border-[1.5px] border-white/45 hover:border-white text-white px-7 py-4 rounded-full font-bold flex items-center gap-2 transition-colors min-h-[48px]"
              >
                <Phone className="w-4 h-4" aria-hidden="true" />
                {t("intensivpflege.hero.ctaPhone")}
              </a>
            </div>
          </div>
          <div className="relative min-h-[300px] lg:min-h-[440px]">
            <div className="cm-blob absolute inset-0">
              <img
                src={PHOTOS.hero}
                alt={t("intensivpflege.hero.imgAlt")}
                loading="eager"
                style={{ objectPosition: "55% center" }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* LEISTUNGEN */}
      <section className="container py-14 lg:py-20">
        <div className="text-center max-w-3xl mx-auto">
          <span className="cm-badge">{t("intensivpflege.leistungen.label")}</span>
          <h2 className="text-3xl lg:text-4xl text-cm-ink mt-4">{t("intensivpflege.leistungen.h2")}</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-11">
          {leistungen.map((l, i) => {
            const Icon = LEISTUNG_ICONS[i] ?? CheckCircle2;
            return (
              <div key={l.title} className="bg-cm-cream rounded-3xl p-7">
                <div className="w-12 h-12 rounded-2xl bg-white shadow-[0_6px_18px_rgba(20,35,80,0.08)] flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-cm-teal-600" aria-hidden="true" />
                </div>
                <h3 className="text-[17px] text-cm-ink mb-2">{l.title}</h3>
                <p className="text-sm text-cm-ink/70 leading-relaxed">{l.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* FÜR WEN · WO · 1:1 */}
      <section className="bg-cm-cream py-14 lg:py-20">
        <div className="container grid lg:grid-cols-2 gap-10 lg:gap-14 items-start">
          <div>
            <span className="cm-badge">{t("intensivpflege.fuerWen.label")}</span>
            <h2 className="text-3xl lg:text-4xl text-cm-ink mt-4 mb-5">{t("intensivpflege.fuerWen.h2")}</h2>
            <p className="text-cm-ink/80 leading-relaxed mb-4">{t("intensivpflege.fuerWen.p1")}</p>
            <p className="text-cm-ink/70 leading-relaxed mb-6">{t("intensivpflege.fuerWen.p2")}</p>
            <div className="flex gap-3 bg-white border border-cm-teal-100 rounded-2xl p-5">
              <Info className="w-5 h-5 text-cm-teal-600 shrink-0 mt-0.5" aria-hidden="true" />
              <p className="text-sm text-cm-ink/75 leading-relaxed">{t("intensivpflege.fuerWen.entwoehnung")}</p>
            </div>
          </div>
          <div className="space-y-5">
            <div className="relative rounded-3xl overflow-hidden min-h-[240px]">
              <img
                src={PHOTOS.zweit}
                alt=""
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
            <div className="bg-white rounded-3xl p-7 border border-cm-teal-100">
              <div className="flex items-center gap-3 mb-2">
                <MapPin className="w-5 h-5 text-cm-teal-600" aria-hidden="true" />
                <h3 className="text-[17px] text-cm-ink">{t("intensivpflege.fuerWen.woH3")}</h3>
              </div>
              <p className="text-sm text-cm-ink/75 leading-relaxed">{t("intensivpflege.fuerWen.wo")}</p>
            </div>
            <div className="bg-cm-navy text-white rounded-3xl p-7 flex gap-5 items-center">
              <span className="text-4xl font-extrabold text-cm-mint shrink-0">1:1</span>
              <div>
                <h3 className="text-[17px] text-white mb-1">{t("intensivpflege.fuerWen.einsH3")}</h3>
                <p className="text-sm text-white/80 leading-relaxed">{t("intensivpflege.fuerWen.eins")}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ABLAUF + KOSTEN */}
      <section className="container py-14 lg:py-20">
        <div className="text-center max-w-3xl mx-auto">
          <span className="cm-badge">{t("intensivpflege.ablauf.label")}</span>
          <h2 className="text-3xl lg:text-4xl text-cm-ink mt-4">{t("intensivpflege.ablauf.h2")}</h2>
        </div>
        <ol className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-11">
          {schritte.map((s, i) => (
            <li key={s.title} className="bg-cm-cream rounded-3xl p-7 list-none">
              <span className="w-11 h-11 rounded-2xl bg-cm-navy text-white flex items-center justify-center font-extrabold text-lg mb-4">
                {i + 1}
              </span>
              <h3 className="text-[17px] text-cm-ink mb-2">{s.title}</h3>
              <p className="text-sm text-cm-ink/70 leading-relaxed">{s.desc}</p>
            </li>
          ))}
        </ol>
        <div className="mt-8 max-w-4xl mx-auto bg-white border border-cm-teal-100 border-l-4 border-l-cm-teal-500 rounded-2xl p-6 lg:p-7">
          <h3 className="text-[17px] text-cm-ink mb-2">{t("intensivpflege.kosten.h3")}</h3>
          <p className="text-sm text-cm-ink/75 leading-relaxed">{t("intensivpflege.kosten.p")}</p>
          <p className="text-xs text-cm-ink/60 mt-3">{t("intensivpflege.kosten.quelle")}</p>
        </div>
      </section>

      {/* FÜR KLINIKEN, PRAXEN & ÜBERLEITUNG */}
      <section className="cm-hero-dark py-14 lg:py-20">
        <div className="container grid lg:grid-cols-[1.1fr_0.9fr] gap-10 items-center">
          <div>
            <span className="cm-badge cm-badge-dark">{t("intensivpflege.kliniken.label")}</span>
            <h2 className="text-3xl lg:text-4xl text-white mt-4 mb-6">{t("intensivpflege.kliniken.h2")}</h2>
            <ul className="space-y-3">
              {klinikPunkte.map((p) => (
                <li key={p} className="flex gap-3 text-white/85">
                  <CheckCircle2 className="w-5 h-5 text-cm-mint shrink-0 mt-0.5" aria-hidden="true" />
                  <span className="leading-relaxed">{p}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col gap-3 lg:items-start">
            <Link
              href="/partner/zuweiser?versorgung=intensivpflege"
              className="bg-cm-teal-500 hover:bg-cm-teal-600 text-white px-7 py-4 rounded-full font-bold inline-flex items-center gap-2 transition-colors min-h-[48px]"
            >
              <Hospital className="w-4 h-4" aria-hidden="true" />
              {t("intensivpflege.kliniken.cta")}
            </Link>
            <Link
              href="/partner/kapazitaet?versorgung=intensivpflege"
              className="border-[1.5px] border-white/45 hover:border-white text-white px-7 py-4 rounded-full font-bold inline-flex items-center gap-2 transition-colors min-h-[48px]"
            >
              <UserCheck className="w-4 h-4" aria-hidden="true" />
              {t("intensivpflege.kliniken.cta2")}
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container py-14 lg:py-20 text-center">
        <h2 className="text-3xl lg:text-4xl text-cm-ink mb-4">{t("intensivpflege.cta.h2")}</h2>
        <p className="text-cm-ink/70 max-w-2xl mx-auto mb-8 leading-relaxed">{t("intensivpflege.cta.p")}</p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link
            href="/kontakt/patient?thema=intensivpflege"
            className="bg-cm-navy hover:bg-cm-navy-light text-white px-7 py-4 rounded-full font-bold inline-flex items-center gap-2 transition-colors min-h-[48px]"
          >
            {t("intensivpflege.cta.button")} <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
          <a
            href="tel:+496979216147"
            className="border-[1.5px] border-cm-navy/30 hover:border-cm-navy text-cm-navy px-7 py-4 rounded-full font-bold inline-flex items-center gap-2 transition-colors min-h-[48px]"
          >
            <Phone className="w-4 h-4" aria-hidden="true" />
            069 79 216 147
          </a>
        </div>
      </section>
    </div>
  );
}
