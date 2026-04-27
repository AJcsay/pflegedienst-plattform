import { Link } from "wouter";
import {
  Stethoscope, HandHeart, UserCheck, CalendarCheck, Heart, Users,
  ArrowRight, CheckCircle2, Phone
} from "lucide-react";
import { useSEO } from "@/hooks/useSEO";
import { useSearch } from "wouter";
import { useEffect } from "react";

const PHOTOS = {
  hero: "/img/beratung.webp",
  behandlung: "/img/behandlung.webp",
  grundpflege: "/img/grundpflege.webp",
  hauswirtschaft: "/img/hauswirtschaft.webp",
  team: "/img/team.webp",
  aktivierung: "/img/aktivierung.webp",
  heroNew: "/img/palliativ.webp",
};

const fullServices = [
  {
    id: "behandlungspflege",
    icon: Stethoscope,
    title: "Behandlungspflege",
    sub: "SGB V – Medizinische Versorgung",
    description: "Unsere examinierten Pflegefachkräfte führen alle ärztlich verordneten medizinischen Maßnahmen professionell und zuverlässig durch.",
    details: ["Wundversorgung und Verbandswechsel", "Injektionen und Infusionen", "Medikamentengabe und -überwachung", "Blutdruck- und Blutzuckermessung", "Katheter- und Stomaversorgung", "An- und Ausziehen von Kompressionsstrümpfen"],
    img: PHOTOS.behandlung,
  },
  {
    id: "grundpflege",
    icon: HandHeart,
    title: "Grundpflege",
    sub: "SGB XI – Körperpflege & Mobilisation",
    description: "Wir unterstützen Sie einfühlsam bei den täglichen Verrichtungen und achten dabei stets auf Ihre Selbstbestimmung und Würde.",
    details: ["Körperpflege und Hygiene", "Hilfe beim An- und Auskleiden", "Mobilisation und Lagerung", "Hilfe bei der Nahrungsaufnahme", "Begleitung bei Toilettengängen", "Betten und Lagern"],
    img: PHOTOS.grundpflege,
  },
];

const compactServices = [
  {
    id: "verhinderungspflege",
    icon: UserCheck,
    title: "Verhinderungspflege",
    sub: "SGB XI – Vertretung",
    description: "Wenn die reguläre Pflegeperson verhindert ist, übernehmen wir die Versorgung – zuverlässig und vertraut.",
    badge: "Bis 6 Wochen pro Jahr · Pflegekasse",
  },
  {
    id: "beratung",
    icon: CalendarCheck,
    title: "Beratungsbesuche § 37.3",
    sub: "SGB XI – Pflichtberatung",
    description: "Regelmäßige Pflegeberatung für Pflegegeldempfänger – wir beraten Sie zu Hause und sichern die Qualität der Pflege.",
    badge: "Kostenübernahme durch die Pflegekasse",
  },
  {
    id: "palliativ",
    icon: Heart,
    title: "Palliativpflege",
    sub: "Würdevolle Begleitung",
    description: "Einfühlsame Begleitung in der letzten Lebensphase. Wir sorgen für Schmerzlinderung und Lebensqualität.",
    badge: "24-Stunden-Erreichbarkeit",
  },
  {
    id: "hauswirtschaft",
    icon: Users,
    title: "Hauswirtschaftliche Versorgung",
    sub: "Unterstützung im Alltag",
    description: "Einkauf, Reinigung, Wäsche, Mahlzeiten – wir entlasten Sie im Alltag, damit Sie sich erholen können.",
    badge: "Abrechnung über § 45b SGB XI möglich",
  },
];

export default function Leistungen() {
  useSEO({
    title: "Pflegeleistungen & Kultursensible Pflege im Rhein-Main-Gebiet – CuraMain",
    description: "Umfassende Pflegeleistungen im Rhein-Main-Gebiet: Behandlungspflege, Grundpflege, Verhinderungspflege, Palliativpflege & kultursensible Betreuung. Kassenzugelassen.",
    keywords: "Pflegeleistungen Rhein-Main, kultursensible Pflege Rhein-Main-Gebiet, interkulturelle Pflege, Grundpflege, Behandlungspflege, Verhinderungspflege, Palliativpflege, ambulante Pflege Rhein-Main",
    canonical: "https://www.curamain.de/leistungen",
  });

  const searchString = useSearch();
  const searchParams = new URLSearchParams(searchString);
  const section = searchParams.get("section");

  useEffect(() => {
    if (!section) return;
    const t = setTimeout(() => {
      const el = document.getElementById(section);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 200);
    return () => clearTimeout(t);
  }, [section]);

  return (
    <div className="bg-cm-cream">
      {/* HERO */}
      <section
        className="relative min-h-[360px] hero-bg -mt-24 pt-24"
        style={{ backgroundImage: `url(${PHOTOS.hero}), linear-gradient(135deg, #daedeb, #f9f6f1)` }}
      >
        <div className="relative z-10 container pt-6 pb-10">
          <span className="pill inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm border border-white/60 shadow-sm">
            <CheckCircle2 className="w-4 h-4 text-cm-teal" />
            Mit allen Pflegekassen abrechenbar
          </span>
          <h1 className="h-serif text-5xl lg:text-7xl text-cm-teal mt-6 mb-6 max-w-3xl leading-[1.05]">
            Unsere Pflegeleistungen.
          </h1>
          <p className="text-lg text-cm-ink/80 max-w-2xl leading-relaxed">
            Wir bieten ein umfassendes Spektrum an ambulanten Pflegeleistungen – individuell abgestimmt und mit allen Pflegekassen abrechenbar.
          </p>
        </div>
      </section>

      {/* HAUPT-SERVICES (2 große Split-Sektionen) */}
      <section className="container py-12 lg:py-14 space-y-6">
        {fullServices.map((s, i) => (
          <div
            key={s.id}
            id={s.id}
            className="grid lg:grid-cols-2 gap-0 bg-white rounded-3xl overflow-hidden border border-cm-teal-100"
          >
            <div
              className={`p-10 lg:p-14 ${i % 2 === 1 ? "lg:order-2" : ""}`}
            >
              <div className="w-12 h-12 rounded-2xl bg-cm-teal-50 flex items-center justify-center mb-5">
                <s.icon className="w-6 h-6 text-cm-teal" />
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
              style={{ backgroundImage: `url(${s.img})` }}
            />
          </div>
        ))}
      </section>

      {/* WEITERE LEISTUNGEN (4 kompakte Cards) */}
      <section className="container pb-12 lg:pb-14">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-cm-teal">Weitere Angebote</span>
          <h2 className="h-serif text-4xl lg:text-5xl text-cm-ink mt-3">Spezialisierte Pflegeleistungen.</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-5">
          {compactServices.map((s) => (
            <div key={s.id} id={s.id} className="bg-white p-8 rounded-3xl border border-cm-teal-100">
              <div className="w-12 h-12 rounded-2xl bg-cm-teal-50 flex items-center justify-center mb-4">
                <s.icon className="w-6 h-6 text-cm-teal" />
              </div>
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-cm-teal">{s.sub}</span>
              <h3 className="h-serif text-2xl text-cm-ink mt-2 mb-3">{s.title}</h3>
              <p className="text-sm text-cm-ink/70 mb-3 leading-relaxed">{s.description}</p>
              <p className="text-xs text-cm-teal-600 font-medium">{s.badge}</p>
            </div>
          ))}
        </div>
      </section>

      {/* KULTURSENSIBLE PFLEGE */}
      <section className="container pb-12 lg:pb-14">
        <div className="grid lg:grid-cols-2 gap-0 bg-cm-ink text-white rounded-3xl overflow-hidden">
          <div className="p-10 lg:p-14 flex flex-col justify-center">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-cm-mint">Vielfalt</span>
            <h2 className="h-serif text-4xl lg:text-5xl mt-3 mb-5 leading-[1.05]">
              Kultursensible Pflege –{" "}
              <span className="text-cm-mint">für jeden Menschen.</span>
            </h2>
            <p className="text-white/80 leading-relaxed mb-7">
              Das Rhein-Main-Gebiet ist eine der vielfältigsten Regionen Deutschlands. Unser mehrsprachiges Team respektiert religiöse Bedürfnisse, Geschlechtssensibilität und kulturelle Traditionen.
            </p>
            <ul className="space-y-3 text-sm text-white/85">
              <li className="flex gap-3"><CheckCircle2 className="w-5 h-5 text-cm-mint flex-shrink-0" /><span><strong className="text-white">7+ Sprachen</strong> – Deutsch, Arabisch, Türkisch, Russisch, Polnisch, Englisch, Französisch</span></li>
              <li className="flex gap-3"><CheckCircle2 className="w-5 h-5 text-cm-mint flex-shrink-0" /><span><strong className="text-white">Religiöse Bedürfnisse</strong> – Gebetszeiten, Ramadan, halal/koschere Ernährung</span></li>
              <li className="flex gap-3"><CheckCircle2 className="w-5 h-5 text-cm-mint flex-shrink-0" /><span><strong className="text-white">Geschlechtssensibel</strong> – Auf Wunsch ausschließlich weibliche oder männliche Pflegekräfte</span></li>
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
          <h2 className="h-serif text-3xl lg:text-4xl text-cm-ink mb-3">Welche Pflege benötigen Sie?</h2>
          <p className="text-cm-ink/70 mb-7 max-w-xl mx-auto">
            Lassen Sie sich kostenlos und unverbindlich beraten. Wir finden gemeinsam die passende Versorgung.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/kontakt/patient"
              className="bg-cm-teal hover:bg-cm-teal-500 text-white px-7 py-3 rounded-full font-medium shadow-md inline-flex items-center gap-2 transition-colors"
            >
              Kostenlose Erstberatung <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="tel:+4969792 16147"
              className="bg-white border border-cm-teal-100 hover:border-cm-teal-300 text-cm-ink px-7 py-3 rounded-full font-medium inline-flex items-center gap-2 transition-colors"
            >
              <Phone className="w-4 h-4 text-cm-teal" />
              069 / 79 216 147
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
