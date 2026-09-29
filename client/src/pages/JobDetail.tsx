import { Link, useParams } from "wouter";
import { ArrowLeft, ArrowRight, Briefcase, MapPin, Calendar, Clock } from "lucide-react";
import { useSEO } from "@/hooks/useSEO";
import JobPostingContent from "@/components/JobPostingContent";
import JobShare from "@/components/JobShare";
import {
  findJobBySlug,
  jobImageUrl,
  jobSeoDescription,
  jobSeoTitle,
  jobTypeLabel,
  jobUrl,
  ACTIVE_JOBS,
  jobPath,
} from "@/lib/jobs";

/**
 * Stellenseite /karriere/<slug>/ – eigene, teilbare URL je Stellenanzeige.
 * Die Meta-Tags (Title, Description, OG-Bild, JobPosting) stehen zusätzlich statisch
 * im vorgerenderten HTML (scripts/prerender-routes.mjs) – dort lesen Social-Media-Crawler.
 */
export default function JobDetail() {
  const params = useParams<{ slug: string }>();
  const job = findJobBySlug(params.slug);
  const available = !!job && job.active;

  useSEO(
    available
      ? {
          title: jobSeoTitle(job),
          description: jobSeoDescription(job),
          canonical: jobUrl(job),
          image: jobImageUrl(job),
        }
      : {
          title: "Stelle nicht mehr ausgeschrieben – CuraMain",
          description: "Diese Stellenanzeige ist nicht mehr aktiv. Alle offenen Stellen bei CuraMain finden Sie auf unserer Karriereseite.",
          noindex: true,
        },
  );

  if (!available) {
    return (
      <div className="bg-cm-cream">
        <section className="container py-16 lg:py-24">
          <div className="text-center max-w-2xl mx-auto bg-white rounded-3xl border border-cm-teal-100 p-10">
            <Briefcase className="w-12 h-12 text-cm-teal-200 mx-auto mb-4" />
            <h1 className="h-serif text-3xl lg:text-4xl text-cm-ink mb-3">
              {job ? `${job.title} – diese Anzeige ist nicht mehr aktiv` : "Diese Stelle gibt es nicht mehr"}
            </h1>
            <p className="text-cm-ink/70 mb-8 leading-relaxed">
              Die Anzeige ist nicht mehr aktiv. Schauen Sie gern in unsere aktuellen Stellenangebote –
              oder senden Sie uns eine Initiativbewerbung.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link
                href="/karriere"
                className="inline-flex items-center gap-2 bg-cm-teal hover:bg-cm-teal-500 text-white px-6 py-3 rounded-full font-medium transition-colors"
              >
                Offene Stellen ansehen <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/karriere/bewerbung"
                className="inline-flex items-center gap-2 bg-white border border-cm-teal-100 hover:border-cm-teal-300 text-cm-ink px-6 py-3 rounded-full font-medium transition-colors"
              >
                Initiativbewerbung
              </Link>
            </div>
          </div>
        </section>
      </div>
    );
  }

  const applyHref = `/karriere/bewerbung?job=${job.id}`;
  const otherJobs = ACTIVE_JOBS.filter((j) => j.id !== job.id);

  return (
    <div className="bg-cm-cream">
      {/* KOPF */}
      <section className="container pt-8 pb-8 lg:pt-12">
        <Link href="/karriere" className="inline-flex items-center gap-1.5 text-sm text-cm-teal-700 hover:text-cm-teal mb-6">
          <ArrowLeft className="w-4 h-4" /> Alle Stellen
        </Link>
        <span className="block text-xs font-semibold uppercase tracking-[0.18em] text-cm-teal mb-3">
          Wir suchen · ab {job.startDate}
        </span>
        <h1 className="h-serif text-4xl lg:text-6xl text-cm-ink mb-5 max-w-4xl leading-[1.08]">{job.title}</h1>
        <div className="flex flex-wrap items-center gap-2 mb-8">
          {job.department && (
            <span className="text-xs px-3 py-1 rounded-full bg-white border border-cm-teal-100 text-cm-teal-700 inline-flex items-center gap-1">
              <Briefcase className="w-3 h-3" /> {job.department}
            </span>
          )}
          {job.location && (
            <span className="text-xs px-3 py-1 rounded-full bg-white border border-cm-teal-100 text-cm-teal-700 inline-flex items-center gap-1">
              <MapPin className="w-3 h-3" /> {job.location}
            </span>
          )}
          <span className="text-xs px-3 py-1 rounded-full bg-white border border-cm-teal-100 text-cm-teal-700 inline-flex items-center gap-1">
            <Clock className="w-3 h-3" /> {jobTypeLabel(job)}
          </span>
          {job.startDate && (
            <span className="text-xs px-3 py-1 rounded-full bg-white border border-cm-teal-100 text-cm-teal-700 inline-flex items-center gap-1">
              <Calendar className="w-3 h-3" /> ab {job.startDate}
            </span>
          )}
        </div>
        <Link
          href={applyHref}
          className="inline-flex items-center gap-2 bg-cm-teal hover:bg-cm-teal-500 text-white px-7 py-3.5 rounded-full font-medium shadow-lg transition-colors"
        >
          Jetzt bewerben <ArrowRight className="w-4 h-4" />
        </Link>
      </section>

      {/* ANZEIGE */}
      <section className="container pb-12">
        <article className="bg-white rounded-3xl border border-cm-teal-100 p-7 lg:p-12 max-w-4xl">
          {job.ogImage && (
            <img
              src={job.ogImage}
              alt=""
              width={1200}
              height={630}
              className="w-full h-auto rounded-2xl mb-8 border border-cm-teal-100"
              loading="eager"
            />
          )}
          <JobPostingContent job={job} />

          <div className="border-t border-cm-teal-100 pt-8 mt-2">
            <h2 className="h-serif text-3xl text-cm-ink mb-3">Klingt nach Ihnen?</h2>
            <p className="text-cm-ink/75 leading-relaxed mb-6">
              Die Bewerbung dauert nur wenige Minuten: Name und Kontaktdaten genügen, ein Lebenslauf ist willkommen.
              Oder rufen Sie uns einfach an: <a href="tel:+496979216147" className="text-cm-teal-700 font-medium underline underline-offset-2">069 / 79 216 147</a>.
            </p>
            <Link
              href={applyHref}
              className="inline-flex items-center gap-2 bg-cm-teal hover:bg-cm-teal-500 text-white px-7 py-3.5 rounded-full font-medium shadow-lg transition-colors"
            >
              Auf diese Stelle bewerben <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="border-t border-cm-teal-100 pt-6 mt-8">
            <p className="text-sm font-semibold text-cm-ink mb-3">Kennen Sie jemanden, der passt? Anzeige teilen:</p>
            <JobShare job={job} />
          </div>
        </article>
      </section>

      {/* WEITERE STELLEN */}
      {otherJobs.length > 0 && (
        <section className="container pb-16 lg:pb-20">
          <h2 className="h-serif text-3xl text-cm-ink mb-5">Weitere offene Stellen</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl">
            {otherJobs.map((j) => (
              <Link
                key={j.id}
                href={jobPath(j)}
                className="block bg-white rounded-3xl border border-cm-teal-100 p-6 hover:shadow-md hover:border-cm-teal-300 transition-all"
              >
                <span className="block font-semibold text-cm-ink mb-1">{j.title}</span>
                <span className="text-sm text-cm-ink/65">{jobTypeLabel(j)} · ab {j.startDate}</span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
