import { Link } from "wouter";
import {
  Heart, Shield, Phone, ArrowRight, CheckCircle2,
  Award, Star, Quote, Users, Stethoscope, HandHeart, Globe2
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

const services = [
  { title: "Behandlungspflege", sub: "SGB V – Medizinische Versorgung", desc: "Wundversorgung, Injektionen, Medikamentengabe – durch examinierte Fachkräfte nach ärztlicher Verordnung.", icon: Stethoscope, img: PHOTOS.behandlung },
  { title: "Grundpflege", sub: "SGB XI – Körperpflege", desc: "Körperpflege, Mobilisation, Ernährung – würdevoll und einfühlsam.", icon: HandHeart, img: PHOTOS.grundpflege },
  { title: "Beratungsbesuche", sub: "§ 37.3 SGB XI", desc: "Pflichtberatung für Pflegegeldempfänger – kostenlos und kompetent.", icon: Heart, img: PHOTOS.beratung },
  { title: "Hauswirtschaftliche Unterstützung", sub: "Entlastung im Alltag", desc: "Einkauf, Reinigung, Wäsche, Mahlzeiten – wir entlasten Sie im Alltag.", icon: Users, img: PHOTOS.hauswirtschaft },
];

const testimonials = [
  {
    name: "Fatima A.",
    role: "Tochter eines Patienten, Nordend-Ost",
    text: "Mein Vater spricht kaum Deutsch – das war für uns immer ein Problem. Bei CuraMain wurde uns sofort eine arabischsprachige Pflegekraft zugeteilt. Er fühlt sich endlich verstanden und gut versorgt.",
  },
  {
    name: "Dr. Markus R.",
    role: "Allgemeinarzt, Frankfurt-Bornheim",
    text: "Ich überweise seit über einem Jahr Patienten an CuraMain. Die Rückmeldungen sind durchweg positiv: pünktlich, dokumentiert und immer erreichbar. Für meine Praxis ein verlässlicher Partner.",
  },
  {
    name: "Renate H.",
    role: "Patientin, Bornheim",
    text: "Nach meiner Hüft-OP wollte ich so schnell wie möglich nach Hause. CuraMain hat die Entlassung mit der Klinik koordiniert und war schon am ersten Tag da. Ich hätte nicht gedacht, dass das so reibungslos klappt.",
  },
];

const stats = [
  { value: "4,8★", label: "Patientenzufriedenheit" },
  { value: "150+", label: "Versorgte Patienten" },
  { value: "5+", label: "Jahre Erfahrung" },
  { value: "100%", label: "Kassenzulassung" },
];

export default function Home() {
  useSEO({
    title: "CuraMain – Ambulanter Pflegedienst im Rhein-Main-Gebiet",
    description: "CuraMain: Professioneller ambulanter Pflegedienst im Rhein-Main-Gebiet. Grundpflege, Behandlungspflege & kultursensible Betreuung – persönlich, zuverlässig, mehrsprachig.",
    keywords: "Pflegedienst Frankfurt, ambulante Pflege Frankfurt, kultursensible Pflege, Pflegedienst Nordend-Ost, Pflegedienst Bornheim, Pflegedienst Ostend, Grundpflege, Behandlungspflege, Verhinderungspflege, CuraMain",
    canonical: "https://www.curamain.de",
  });

  return (
    <div className="bg-cm-cream">
      {/* ─────────────────────────────────────────── */}
      {/* HERO mit Bild + integrierte Stats-Karten   */}
      {/* ─────────────────────────────────────────── */}
      <section
        className="relative min-h-[680px] lg:min-h-[760px] hero-bg flex flex-col -mt-24 pt-24"
        style={{ backgroundImage: `url(${PHOTOS.hero}), linear-gradient(135deg, #daedeb, #f9f6f1)` }}
      >
        <div className="relative z-10 container pt-8 pb-8 flex-1">
          <span className="pill inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm border border-white/60 shadow-sm">
            <Heart className="w-4 h-4 text-cm-teal" fill="currentColor" />
            Ihr Ambulanter Pflegedienst im Rhein-Main-Gebiet
          </span>
          <h1 className="h-serif text-5xl lg:text-7xl text-cm-teal mt-6 mb-6 max-w-3xl leading-[1.05]">
            Weil Ihr Zuhause der beste Ort zum Heilen ist.
          </h1>
          <p className="text-lg text-cm-ink/80 max-w-xl mb-8 leading-relaxed">
            Professionelle, kultursensible Pflege – direkt bei Ihnen zu Hause im Rhein-Main-Gebiet. Unser mehrsprachiges Team begleitet Sie mit Kompetenz, Herz und echtem Verständnis für Ihre Bedürfnisse.
          </p>
          <div className="flex flex-wrap gap-3 mb-6">
            <Link
              href="/kontakt/patient"
              className="bg-cm-teal-600 hover:bg-cm-teal-700 text-white px-7 py-3.5 rounded-full font-medium shadow-lg flex items-center gap-2 transition-colors min-h-[48px]"
            >
              Kostenloses Erstgespräch anfordern
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="tel:+496979216147"
              className="pill border border-white/60 px-7 py-3.5 rounded-full font-medium flex items-center gap-2 shadow-sm min-h-[48px]"
            >
              <Phone className="w-4 h-4 text-cm-teal-700" />
              069 79 216 147
            </a>
          </div>
          <p className="text-sm text-cm-ink/70 mb-6 inline-flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-cm-teal-700" aria-hidden="true" />
            Kostenlos &amp; unverbindlich · Mehrsprachig · Antwort innerhalb 24h
          </p>
          {/* Trust-Block über Fold: Kassenzulassung + Sprachen + Region */}
          <div className="flex flex-wrap gap-2">
            <span className="pill border border-white/60 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm shadow-sm">
              <Shield className="w-3.5 h-3.5 text-cm-teal-700" />
              Kassenzugelassen (§ 132a SGB V · § 72 SGB XI)
            </span>
            <span className="pill border border-white/60 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm shadow-sm">
              <Globe2 className="w-3.5 h-3.5 text-cm-teal-700" />
              7+ Sprachen
            </span>
            <span className="pill border border-white/60 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm shadow-sm">
              <Award className="w-3.5 h-3.5 text-cm-teal-700" />
              5+ Jahre im Rhein-Main-Gebiet
            </span>
          </div>
        </div>
        {/* Stats-Karten am unteren Hero-Rand */}
        <div className="relative z-10 container pb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {stats.map((s) => (
              <div
                key={s.label}
                className="glass border border-white/50 rounded-2xl px-4 py-4 text-center shadow-sm"
              >
                <div className="h-serif text-3xl lg:text-4xl font-semibold text-cm-teal-600">{s.value}</div>
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
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-cm-teal">Was wir leisten</span>
          <h2 className="h-serif text-4xl lg:text-5xl text-cm-ink mt-3 mb-4">
            Pflege, die den ganzen Menschen sieht.
          </h2>
          <p className="text-cm-ink/70 leading-relaxed">
            Von der medizinischen Behandlungspflege bis zur hauswirtschaftlichen Unterstützung – wir betreuen Sie mit allen Pflegeleistungen aus einer Hand.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {services.map((s) => (
            <Link
              key={s.title}
              href="/leistungen"
              className="group bg-white p-7 rounded-3xl border border-cm-teal-100 hover:border-cm-teal-300 hover:shadow-lg transition"
            >
              <div className="w-12 h-12 rounded-2xl bg-cm-teal-50 flex items-center justify-center mb-5">
                <s.icon className="w-6 h-6 text-cm-teal" />
              </div>
              <h3 className="font-semibold text-lg mb-1.5 text-cm-ink">{s.title}</h3>
              <p className="text-xs uppercase tracking-wider text-cm-teal-600 mb-2">{s.sub}</p>
              <p className="text-sm text-cm-ink/70 leading-relaxed">{s.desc}</p>
            </Link>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link
            href="/leistungen"
            className="inline-flex items-center gap-2 text-cm-teal-600 hover:text-cm-teal-700 font-medium"
          >
            Alle Leistungen ansehen <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* ─────────────────────────────────────────── */}
      {/* KULTURSENSIBLE PFLEGE (Split mit Bild)      */}
      {/* ─────────────────────────────────────────── */}
      <section className="container pb-12 lg:pb-20">
        <div className="grid lg:grid-cols-2 gap-0 bg-white rounded-3xl overflow-hidden border border-cm-teal-100">
          <div className="p-10 lg:p-14 flex flex-col justify-center">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-cm-teal">Kultursensibel</span>
            <h2 className="h-serif text-4xl lg:text-5xl text-cm-ink mt-3 mb-5">
              Vielfalt ist <span className="text-cm-teal-600">unsere Stärke.</span>
            </h2>
            <p className="text-cm-ink/70 leading-relaxed mb-6">
              Das Rhein-Main-Gebiet ist eine der vielfältigsten Regionen Deutschlands. Bei CuraMain spiegelt sich diese Vielfalt in unserem Team wider – wir sprechen über 7 Sprachen und respektieren religiöse, kulturelle und geschlechtssensible Bedürfnisse.
            </p>
            <ul className="space-y-2.5">
              {[
                { t: "Mehrsprachiges Team", d: "Deutsch, Arabisch, Türkisch, Russisch, Polnisch, Englisch, Französisch." },
                { t: "Religiös sensibel", d: "Gebetszeiten, Ramadan, halal/koschere Ernährung." },
                { t: "Geschlechtssensibel", d: "Auf Wunsch ausschließlich weibliche oder männliche Pflegekräfte." },
              ].map((p) => (
                <li key={p.t} className="flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-cm-teal flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-medium text-cm-ink">{p.t}</span>
                    <span className="text-cm-ink/70"> – {p.d}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div
            className="hero-bg min-h-[360px] lg:min-h-full"
            style={{ backgroundImage: `url(${PHOTOS.team})` }}
          />
        </div>
      </section>

      {/* ─────────────────────────────────────────── */}
      {/* VERSORGUNGSGEBIET (lokale Stadt-Links)      */}
      {/* ─────────────────────────────────────────── */}
      <section className="container pb-12 lg:pb-20">
        <div className="bg-white border border-cm-teal-100 rounded-3xl p-8 lg:p-10">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-cm-teal">Versorgungsgebiet</span>
              <h2 className="h-serif text-3xl lg:text-4xl text-cm-ink mt-2">Pflege im Bornheim-Nordend-Heimrevier</h2>
            </div>
          </div>
          <p className="text-cm-ink/70 leading-relaxed mb-6 max-w-2xl">
            Aus der Berger Straße 69 versorgen wir das Heimrevier rund um Nordend-Ost, Bornheim und Ostend – mit E-Bike-Touren, kurzen Anfahrtszeiten und festen Tourenplänen.
          </p>
          <div className="grid sm:grid-cols-3 gap-3">
            {[
              { slug: "nordend-ost", name: "Nordend-Ost", sub: "Vom Merianplatz bis zum Bürgerhospital" },
              { slug: "bornheim", name: "Bornheim", sub: "Saalburgstraße · Bornheim Mitte · Sankt Katharinen" },
              { slug: "ostend", name: "Ostend", sub: "EZB-Quartier · Habsburgerallee · Klinik Rotes Kreuz" },
            ].map((c) => (
              <Link
                key={c.slug}
                href={`/pflege/${c.slug}`}
                className="group bg-cm-cream/60 hover:bg-cm-teal-50 border border-cm-teal-100 hover:border-cm-teal-300 rounded-2xl p-5 transition-colors"
              >
                <div className="font-semibold text-cm-ink group-hover:text-cm-teal-700 mb-1 flex items-center gap-2">
                  {c.name}
                  <ArrowRight className="w-4 h-4 opacity-60 group-hover:translate-x-0.5 transition-transform" />
                </div>
                <div className="text-xs text-cm-ink/60">{c.sub}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────── */}
      {/* TESTIMONIALS                                */}
      {/* ─────────────────────────────────────────── */}
      <section className="container pb-12 lg:pb-20">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-cm-teal">Stimmen</span>
          <h2 className="h-serif text-4xl lg:text-5xl text-cm-ink mt-3">
            Echte Erfahrungen.<br />Echte Menschen.
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {testimonials.map((t) => (
            <div key={t.name} className="bg-white p-7 rounded-3xl border border-cm-teal-100 relative">
              <Quote className="w-7 h-7 text-cm-teal-200 absolute top-5 right-5" />
              <div className="flex gap-0.5 mb-4 text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-cm-ink/80 italic leading-relaxed mb-5">„{t.text}"</p>
              <div className="border-t border-cm-teal-100 pt-4">
                <div className="font-semibold text-cm-ink">{t.name}</div>
                <div className="text-xs text-cm-ink/60 mt-0.5">{t.role}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link
            href="/testimonials"
            className="inline-flex items-center gap-2 text-cm-teal-600 hover:text-cm-teal-700 font-medium"
          >
            Alle Bewertungen lesen <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* ─────────────────────────────────────────── */}
      {/* CTA-Banner                                  */}
      {/* ─────────────────────────────────────────── */}
      <section className="container pb-12 lg:pb-20">
        <div
          className="rounded-3xl p-10 lg:p-16 text-center hero-bg hero-bg-dark"
          style={{ backgroundImage: `url(${PHOTOS.beratung})` }}
        >
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="h-serif text-4xl lg:text-5xl text-white mb-5">
              Lassen Sie uns sprechen.
            </h2>
            <p className="text-white/90 text-lg mb-8 leading-relaxed">
              Die Erstberatung ist kostenlos, mehrsprachig und unverbindlich. Wir kommen auch zu Ihnen nach Hause.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link
                href="/kontakt/patient"
                className="bg-white hover:bg-cm-teal-50 text-cm-teal-700 px-7 py-3.5 rounded-full font-medium shadow-lg inline-flex items-center gap-2 transition-colors"
              >
                Termin vereinbaren <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="tel:+496979216147"
                className="bg-white/15 backdrop-blur border border-white/30 text-white px-7 py-3.5 rounded-full font-medium inline-flex items-center gap-2 hover:bg-white/25 transition-colors"
              >
                <Phone className="w-4 h-4" />
                069 / 79 216 147
              </a>
            </div>
            <div className="mt-6 flex flex-wrap gap-3 justify-center text-sm text-white/80">
              <span className="flex items-center gap-1.5"><Users className="w-4 h-4" />7+ Sprachen</span>
              <span className="flex items-center gap-1.5"><Shield className="w-4 h-4" />Kassenzugelassen</span>
              <span className="flex items-center gap-1.5"><Heart className="w-4 h-4" />Mo–Fr 8:00–18:00, Notfall 24/7</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
