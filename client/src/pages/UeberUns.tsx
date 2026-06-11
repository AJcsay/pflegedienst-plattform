import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { Heart, Users, Award, Shield, ArrowRight, Target, Eye } from "lucide-react";
import { useSEO } from "@/hooks/useSEO";

const PHOTOS = {
  team: "/img/team.webp",
};

// Icon-Mapping für die 4 Kernwerte (Reihenfolge entspricht JSON-Array)
const VALUE_ICONS = [Heart, Shield, Users, Award];

export default function UeberUns() {
  const { t } = useTranslation();

  useSEO({
    title: t("ueberUns.seo.title"),
    description: t("ueberUns.seo.description"),
    keywords: t("ueberUns.seo.keywords"),
    canonical: "https://www.curamain.de/ueber-uns",
  });

  type ValueItem = { title: string; desc: string };
  type MilestoneItem = { year: string; text: string };

  const values = t("ueberUns.values.items", { returnObjects: true }) as ValueItem[];
  const milestones = t("ueberUns.milestones.items", { returnObjects: true }) as MilestoneItem[];

  return (
    <div className="bg-cm-cream">
      {/* HERO */}
      <section
        className="relative min-h-[420px] hero-bg -mt-24 pt-24"
        style={{ backgroundImage: `url(${PHOTOS.team}), linear-gradient(135deg, #daedeb, #f9f6f1)` }}
      >
        <div className="relative z-10 container pt-6 pb-10">
          <span className="pill inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm border border-white/60 shadow-sm">
            <Heart className="w-4 h-4 text-cm-teal" fill="currentColor" />
            {t("ueberUns.hero.pill")}
          </span>
          <h1 className="h-serif text-5xl lg:text-7xl text-cm-teal mt-6 mb-6 max-w-5xl leading-[1.05]">
            {t("ueberUns.hero.h1a")}<br className="hidden lg:block" />
            <span className="text-cm-teal-600">{t("ueberUns.hero.h1b")}</span>
          </h1>
          <p className="text-lg lg:text-xl text-cm-ink/80 max-w-3xl leading-relaxed">
            {t("ueberUns.hero.p")}
          </p>
        </div>
      </section>

      {/* MISSION & VISION */}
      <section className="container py-12 lg:py-14">
        <div className="grid md:grid-cols-2 gap-6 mb-16">
          <div className="bg-white p-8 rounded-3xl border border-cm-teal-100">
            <div className="w-12 h-12 rounded-2xl bg-cm-teal-50 flex items-center justify-center mb-5">
              <Target className="w-6 h-6 text-cm-teal" />
            </div>
            <h2 className="h-serif text-3xl text-cm-ink mb-3">{t("ueberUns.mission.h2")}</h2>
            <p className="text-cm-ink/70 leading-relaxed">
              {t("ueberUns.mission.p")}
            </p>
          </div>
          <div className="bg-white p-8 rounded-3xl border border-cm-teal-100">
            <div className="w-12 h-12 rounded-2xl bg-cm-teal-50 flex items-center justify-center mb-5">
              <Eye className="w-6 h-6 text-cm-teal" />
            </div>
            <h2 className="h-serif text-3xl text-cm-ink mb-3">{t("ueberUns.vision.h2")}</h2>
            <p className="text-cm-ink/70 leading-relaxed">
              {t("ueberUns.vision.p")}
            </p>
          </div>
        </div>

        {/* WERTE */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-cm-teal">{t("ueberUns.values.label")}</span>
          <h2 className="h-serif text-4xl lg:text-5xl text-cm-ink mt-3">{t("ueberUns.values.h2")}</h2>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {values.map((v, i) => {
            const Icon = VALUE_ICONS[i];
            return (
              <div key={v.title} className="bg-white p-6 rounded-3xl border border-cm-teal-100 text-center">
                <div className="w-14 h-14 rounded-2xl bg-cm-teal-50 flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-7 h-7 text-cm-teal" />
                </div>
                <h3 className="font-semibold text-lg mb-2 text-cm-ink">{v.title}</h3>
                <p className="text-sm text-cm-ink/70 leading-relaxed">{v.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* MEILENSTEINE */}
      <section className="container pb-12 lg:pb-20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-cm-teal">{t("ueberUns.milestones.label")}</span>
          <h2 className="h-serif text-4xl lg:text-5xl text-cm-ink mt-3">{t("ueberUns.milestones.h2")}</h2>
        </div>
        <div className="bg-white rounded-3xl border border-cm-teal-100 p-8 lg:p-12">
          <div className="relative max-w-3xl mx-auto">
            <div className="absolute left-7 top-2 bottom-2 w-px bg-cm-teal-100" />
            <div className="space-y-7">
              {milestones.map((m) => (
                <div key={m.year} className="flex gap-5 relative">
                  <div className="w-14 h-14 rounded-full bg-cm-teal-50 border-2 border-cm-teal-100 flex items-center justify-center flex-shrink-0 relative z-10">
                    <span className="h-serif text-base font-semibold text-cm-teal-600">{m.year}</span>
                  </div>
                  <div className="flex-1 pt-3">
                    <p className="text-cm-ink/80 leading-relaxed">{m.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container pb-12 lg:pb-20">
        <div className="bg-cm-teal-50 rounded-3xl p-10 lg:p-12 text-center">
          <h2 className="h-serif text-3xl lg:text-4xl text-cm-ink mb-4">{t("ueberUns.cta.h2")}</h2>
          <p className="text-cm-ink/70 mb-7 max-w-xl mx-auto">
            {t("ueberUns.cta.p")}
          </p>
          <Link
            href="/kontakt/patient"
            className="inline-flex items-center gap-2 bg-cm-teal hover:bg-cm-teal-500 text-white px-7 py-3.5 rounded-full font-medium shadow-md transition-colors"
          >
            {t("ueberUns.cta.button")} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
