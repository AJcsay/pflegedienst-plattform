import { Link } from "wouter";
import { Heart, Users, Award, Shield, ArrowRight, Target, Eye } from "lucide-react";
import { useSEO } from "@/hooks/useSEO";

const PHOTOS = {
  team: "/img/team.png",
};

const values = [
  { icon: Heart, title: "Menschlichkeit", desc: "Jeder Mensch verdient eine Pflege, die seine Würde und Individualität respektiert." },
  { icon: Shield, title: "Zuverlässigkeit", desc: "Pünktlichkeit, Verbindlichkeit und Beständigkeit sind die Grundpfeiler unserer Arbeit." },
  { icon: Users, title: "Teamgeist", desc: "Nur gemeinsam können wir die beste Versorgung für unsere Patienten sicherstellen." },
  { icon: Award, title: "Qualität", desc: "Kontinuierliche Weiterbildung und höchste Standards in der Pflege sind unser Anspruch." },
];

const milestones = [
  { year: "2020", text: "Gründung von CuraMain im Rhein-Main-Gebiet – mit dem Ziel, ambulante Pflege menschlicher und moderner zu gestalten." },
  { year: "2021", text: "Erste Kassenzulassung und Aufbau eines qualifizierten Pflegeteams." },
  { year: "2022", text: "Erweiterung des Leistungsangebots: Behandlungspflege, Palliativpflege und Hauswirtschaft." },
  { year: "2023", text: "Wachstum auf über 80 betreute Patienten und Ausbau der Kooperationen mit Kliniken und Hausärzten." },
  { year: "2024", text: "Einführung digitaler Pflegeprozesse und Launch der neuen Online-Plattform für Patienten, Bewerber und Partner." },
  { year: "2025", text: "Kontinuierliches Wachstum – mit dem Anspruch, der vertrauenswürdigste Pflegedienst im Rhein-Main-Gebiet zu werden." },
];

export default function UeberUns() {
  useSEO({
    title: "Über CuraMain – Ambulanter Pflegedienst im Rhein-Main-Gebiet",
    description: "CuraMain: Ambulanter Pflegedienst im Rhein-Main-Gebiet, gegründet 2020. Lernen Sie unser Team, unsere Werte und unsere Geschichte kennen.",
    keywords: "CuraMain über uns, Pflegedienst Rhein-Main Geschichte, ambulante Pflege Team Rhein-Main-Gebiet",
    canonical: "https://www.curamain.de/ueber-uns",
  });

  return (
    <div className="bg-cm-cream">
      {/* HERO */}
      <section
        className="relative min-h-[360px] hero-bg -mt-24 pt-24"
        style={{ backgroundImage: `url(${PHOTOS.team}), linear-gradient(135deg, #daedeb, #f9f6f1)` }}
      >
        <div className="relative z-10 container pt-6 pb-10">
          <span className="pill inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm border border-white/60 shadow-sm">
            <Heart className="w-4 h-4 text-cm-teal" fill="currentColor" />
            Gegründet 2020 · Frankfurt am Main
          </span>
          <h1 className="h-serif text-5xl lg:text-7xl text-cm-teal mt-6 mb-6 max-w-3xl leading-[1.05]">
            Pflege aus Überzeugung.
          </h1>
          <p className="text-lg text-cm-ink/80 max-w-2xl leading-relaxed">
            CuraMain steht für moderne ambulante Pflege im Rhein-Main-Gebiet. Seit unserer Gründung wachsen wir stetig – angetrieben von echter Menschlichkeit und dem Anspruch, Pflege würdevoll und professionell zu gestalten.
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
            <h3 className="h-serif text-3xl text-cm-ink mb-3">Unsere Mission</h3>
            <p className="text-cm-ink/70 leading-relaxed">
              Menschen so lange wie möglich selbstbestimmt in ihrem vertrauten Zuhause leben zu lassen – mit professioneller, kultursensibler Pflege, die den ganzen Menschen sieht.
            </p>
          </div>
          <div className="bg-white p-8 rounded-3xl border border-cm-teal-100">
            <div className="w-12 h-12 rounded-2xl bg-cm-teal-50 flex items-center justify-center mb-5">
              <Eye className="w-6 h-6 text-cm-teal" />
            </div>
            <h3 className="h-serif text-3xl text-cm-ink mb-3">Unsere Vision</h3>
            <p className="text-cm-ink/70 leading-relaxed">
              Der vertrauenswürdigste Pflegedienst im Rhein-Main-Gebiet zu sein – bekannt für Qualität, Menschlichkeit und kulturelle Vielfalt.
            </p>
          </div>
        </div>

        {/* WERTE */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-cm-teal">Was uns antreibt</span>
          <h2 className="h-serif text-4xl lg:text-5xl text-cm-ink mt-3">Unsere vier Werte.</h2>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {values.map((v) => (
            <div key={v.title} className="bg-white p-6 rounded-3xl border border-cm-teal-100 text-center">
              <div className="w-14 h-14 rounded-2xl bg-cm-teal-50 flex items-center justify-center mx-auto mb-4">
                <v.icon className="w-7 h-7 text-cm-teal" />
              </div>
              <h3 className="font-semibold text-lg mb-2 text-cm-ink">{v.title}</h3>
              <p className="text-sm text-cm-ink/70 leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* MEILENSTEINE */}
      <section className="container pb-12 lg:pb-20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-cm-teal">Unser Weg</span>
          <h2 className="h-serif text-4xl lg:text-5xl text-cm-ink mt-3">Meilensteine.</h2>
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
          <h2 className="h-serif text-3xl lg:text-4xl text-cm-ink mb-4">Lernen Sie uns kennen.</h2>
          <p className="text-cm-ink/70 mb-7 max-w-xl mx-auto">
            Persönliches Gespräch, Hausbesuch oder Telefonberatung – wir nehmen uns Zeit für Sie.
          </p>
          <Link
            href="/kontakt/patient"
            className="inline-flex items-center gap-2 bg-cm-teal hover:bg-cm-teal-500 text-white px-7 py-3.5 rounded-full font-medium shadow-md transition-colors"
          >
            Erstberatung anfragen <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
