import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import {
  ArrowRight, Briefcase, MapPin, Heart,
  GraduationCap, Car, Calendar, Euro, Users, Coffee, Shield
} from "lucide-react";
import { useState } from "react";
import { useSEO } from "@/hooks/useSEO";

const PHOTOS = {
  team: "https://d2xsxph8kpxj0f.cloudfront.net/310519663332473442/mPPhYwgpPecz3rTTMqZjFL/5_FpU4S7YbAhdIMgbPUTpABc_1775907771125_na1fn_L2hvbWUvdWJ1bnR1L2N1cmFtYWluX3RlYW0_38e8983c.png",
};

const benefits = [
  { icon: Euro, title: "Übertarifliche Bezahlung", desc: "Attraktives Gehalt über Branchendurchschnitt plus Zulagen." },
  { icon: Calendar, title: "Flexible Dienstpläne", desc: "Wir berücksichtigen Ihre Wünsche bei der Dienstplangestaltung." },
  { icon: GraduationCap, title: "Fort- & Weiterbildung", desc: "Regelmäßige Schulungen auf unsere Kosten." },
  { icon: Car, title: "Dienstwagen", desc: "Firmenwagen auch zur privaten Nutzung verfügbar." },
  { icon: Coffee, title: "30 Tage Urlaub", desc: "Mehr Erholung für mehr Leistung." },
  { icon: Shield, title: "Altersvorsorge", desc: "Arbeitgeberfinanzierte betriebliche Altersvorsorge." },
  { icon: Users, title: "Starkes Team", desc: "Kollegiales Miteinander und regelmäßige Teamevents." },
  { icon: Heart, title: "Wertschätzung", desc: "Flache Hierarchien und offene Kommunikation." },
];

const employmentTypeLabels: Record<string, string> = {
  fulltime: "Vollzeit",
  parttime: "Teilzeit",
  minijob: "Minijob",
  internship: "Praktikum",
};

const filterOptions = [
  { value: "all", label: "Alle Stellen" },
  { value: "fulltime", label: "Vollzeit" },
  { value: "parttime", label: "Teilzeit" },
  { value: "minijob", label: "Minijob" },
  { value: "internship", label: "Praktikum" },
];

export default function Karriere() {
  useSEO({
    title: "Jobs & Karriere beim Pflegedienst – CuraMain",
    description: "Jetzt als Pflegefachkraft, Pflegehelfer oder in der Hauswirtschaft bei CuraMain im Rhein-Main-Gebiet bewerben. Übertarifliche Bezahlung, flexible Dienstpläne, Dienstwagen.",
    keywords: "Pflegejobs Rhein-Main, Pflegefachkraft Stelle Rhein-Main-Gebiet, Pflegedienst Karriere Frankfurt Offenbach Wiesbaden, CuraMain Jobs",
    canonical: "https://www.curamain.de/karriere",
  });

  const { data: jobs, isLoading } = trpc.jobs.list.useQuery();
  const [filterType, setFilterType] = useState<string>("all");

  const filteredJobs = jobs?.filter((job) => filterType === "all" || job.employmentType === filterType);

  return (
    <div className="bg-cm-cream">
      {/* HERO */}
      <section
        className="relative min-h-[360px] hero-bg -mt-24 pt-24"
        style={{ backgroundImage: `url(${PHOTOS.team}), linear-gradient(135deg, #daedeb, #f9f6f1)` }}
      >
        <div className="relative z-10 container pt-6 pb-10">
          <span className="pill inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm border border-white/60 shadow-sm">
            <Briefcase className="w-4 h-4 text-cm-teal" />
            Übertariflich · Dienstwagen · 30 Tage Urlaub
          </span>
          <h1 className="h-serif text-5xl lg:text-7xl text-cm-teal mt-6 mb-6 max-w-3xl leading-[1.05]">
            Karriere bei CuraMain.
          </h1>
          <p className="text-lg text-cm-ink/80 max-w-2xl leading-relaxed mb-6">
            Werden Sie Teil eines Teams, das Pflege mit Leidenschaft lebt. Wir suchen engagierte Fachkräfte, die den Unterschied machen wollen.
          </p>
          <Link
            href="/karriere/bewerbung"
            className="inline-flex items-center gap-2 bg-cm-teal hover:bg-cm-teal-500 text-white px-7 py-3.5 rounded-full font-medium shadow-lg transition-colors"
          >
            Jetzt bewerben <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* BENEFITS */}
      <section id="benefits" className="container py-12 lg:py-14">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-cm-teal">Warum CuraMain?</span>
          <h2 className="h-serif text-4xl lg:text-5xl text-cm-ink mt-3">Mehr als nur ein Arbeitsplatz.</h2>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {benefits.map((b) => (
            <div key={b.title} className="bg-white p-6 rounded-3xl border border-cm-teal-100">
              <div className="w-10 h-10 rounded-xl bg-cm-teal-50 flex items-center justify-center mb-3">
                <b.icon className="w-5 h-5 text-cm-teal" />
              </div>
              <h3 className="font-semibold mb-1.5 text-cm-ink">{b.title}</h3>
              <p className="text-xs text-cm-ink/70 leading-relaxed">{b.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* JOBS */}
      <section className="container pb-12 lg:pb-14">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-cm-teal">Offene Stellen</span>
          <h2 className="h-serif text-4xl lg:text-5xl text-cm-ink mt-3">Aktuelle Stellenangebote</h2>
        </div>

        {/* Filter Pills */}
        {jobs && jobs.length > 0 && (
          <div className="flex flex-wrap gap-2 justify-center mb-10">
            {filterOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setFilterType(opt.value)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                  filterType === opt.value
                    ? "bg-cm-teal text-white shadow-md"
                    : "bg-white border border-cm-teal-100 text-cm-ink hover:border-cm-teal-300"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}

        {isLoading ? (
          <div className="space-y-4 max-w-3xl mx-auto">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white p-6 rounded-3xl border border-cm-teal-100 animate-pulse">
                <div className="h-6 bg-cm-teal-50 rounded w-1/3 mb-3" />
                <div className="h-4 bg-cm-teal-50 rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : filteredJobs && filteredJobs.length > 0 ? (
          <div className="space-y-4 max-w-3xl mx-auto">
            {filteredJobs.map((job) => (
              <div
                key={job.id}
                className="bg-white p-7 rounded-3xl border border-cm-teal-100 hover:shadow-md transition-shadow flex flex-wrap items-center gap-4 justify-between"
              >
                <div className="flex-1 min-w-0">
                  <h3 className="h-serif text-2xl text-cm-ink mb-2">{job.title}</h3>
                  <div className="flex flex-wrap items-center gap-2">
                    {job.department && (
                      <span className="text-xs px-3 py-1 rounded-full bg-cm-teal-50 text-cm-teal-700 inline-flex items-center gap-1">
                        <Briefcase className="w-3 h-3" />
                        {job.department}
                      </span>
                    )}
                    {job.location && (
                      <span className="text-xs px-3 py-1 rounded-full bg-cm-teal-50 text-cm-teal-700 inline-flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {job.location}
                      </span>
                    )}
                    <span className="text-xs px-3 py-1 rounded-full bg-cm-teal-50 text-cm-teal-700">
                      {employmentTypeLabels[job.employmentType] || job.employmentType}
                    </span>
                  </div>
                </div>
                <Link
                  href={`/karriere/bewerbung?job=${job.id}`}
                  className="bg-cm-teal hover:bg-cm-teal-500 text-white px-6 py-2.5 rounded-full text-sm font-medium inline-flex items-center gap-1.5 transition-colors"
                >
                  Bewerben <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 max-w-2xl mx-auto bg-white rounded-3xl border border-cm-teal-100">
            <Briefcase className="w-12 h-12 text-cm-teal-200 mx-auto mb-4" />
            <h3 className="h-serif text-2xl text-cm-ink mb-2">Aktuell keine offenen Stellen</h3>
            <p className="text-cm-ink/70 mb-6">
              Senden Sie uns gerne eine Initiativbewerbung – wir freuen uns auf Sie!
            </p>
            <Link
              href="/karriere/bewerbung"
              className="inline-flex items-center gap-2 bg-cm-teal hover:bg-cm-teal-500 text-white px-6 py-3 rounded-full font-medium transition-colors"
            >
              Initiativbewerbung senden <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="container pb-12 lg:pb-20">
        <div
          className="rounded-3xl p-10 lg:p-16 text-center hero-bg hero-bg-dark"
          style={{ backgroundImage: `url(${PHOTOS.team})` }}
        >
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="h-serif text-4xl lg:text-5xl text-white mb-4">
              Bereit für den nächsten Schritt?
            </h2>
            <p className="text-white/90 text-lg mb-8 leading-relaxed">
              Bewerben Sie sich jetzt – schnell und unkompliziert über unser Online-Formular. Lebenslauf hochladen, Position wählen, abschicken.
            </p>
            <Link
              href="/karriere/bewerbung"
              className="inline-flex items-center gap-2 bg-white hover:bg-cm-teal-50 text-cm-teal-700 px-7 py-3.5 rounded-full font-medium shadow-lg transition-colors"
            >
              Jetzt bewerben <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
