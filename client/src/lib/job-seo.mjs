/**
 * CuraMain – Gemeinsame Logik für Stellenanzeigen.
 *
 * Wird von ZWEI Seiten genutzt und hält beide synchron:
 *   1. der React-App (Karriere-Übersicht, Stellenseite /karriere/<slug>/)
 *   2. dem Prerendering (scripts/prerender-routes.mjs) – schreibt Title, Description,
 *      Open-Graph-Bild und JobPosting-Daten (Google for Jobs) statisch ins HTML,
 *      damit Facebook, LinkedIn, WhatsApp & Co. eine korrekte Vorschau zeigen.
 *
 * Bewusst reines JavaScript (ESM), damit Node es ohne Build-Schritt laden kann.
 * Typen: job-seo.d.mts.
 */

export const ORIGIN = "https://www.curamain.de";

export const EMPLOYMENT_LABELS = {
  fulltime: "Vollzeit",
  parttime: "Teilzeit",
  minijob: "Minijob",
  internship: "Praktikum",
};

const SCHEMA_EMPLOYMENT = {
  fulltime: "FULL_TIME",
  parttime: "PART_TIME",
  minijob: "PART_TIME",
  internship: "INTERN",
};

/** Beschäftigungsarten einer Stelle (mehrere möglich, z. B. Minijob oder Teilzeit). */
export function jobTypes(job) {
  return Array.isArray(job.employmentTypes) && job.employmentTypes.length > 0
    ? job.employmentTypes
    : [job.employmentType];
}

/** Lesbares Label, z. B. „Minijob oder Teilzeit“. */
export function jobTypeLabel(job) {
  return jobTypes(job)
    .map((t) => EMPLOYMENT_LABELS[t] || t)
    .join(" oder ");
}

/** Pfad der Stellenseite – mit Schrägstrich am Ende, so wie der Server ihn ausliefert (kein Redirect). */
export function jobPath(job) {
  return `/karriere/${job.slug}/`;
}

export function jobUrl(job) {
  return ORIGIN + jobPath(job);
}

export function jobImageUrl(job) {
  return ORIGIN + (job.ogImage || "/og-image.jpg");
}

export function jobSeoTitle(job) {
  return `${job.title} · ${jobTypeLabel(job)} – Job bei CuraMain Frankfurt`;
}

function truncate(text, max) {
  const t = String(text).replace(/\s+/g, " ").trim();
  if (t.length <= max) return t;
  const cut = t.slice(0, max - 1);
  return cut.slice(0, cut.lastIndexOf(" ")).replace(/[,;:–-]\s*$/, "") + "…";
}

/** Teaser für Übersicht und Social-Media-Vorschau (max. 160 Zeichen). */
export function jobTeaser(job) {
  if (job.teaser) return truncate(job.teaser, 160);
  const firstSentence = String(job.intro || "").split(/(?<=[.!?])\s/)[0] || "";
  return truncate(firstSentence, 160);
}

export function jobSeoDescription(job) {
  return jobTeaser(job);
}

const escHtml = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function listHtml(heading, items) {
  if (!items || items.length === 0) return "";
  return `<h3>${escHtml(heading)}</h3><ul>${items.map((i) => `<li>${escHtml(i)}</li>`).join("")}</ul>`;
}

/**
 * Strukturierte Daten nach schema.org/JobPosting (Google for Jobs).
 * Keine Gehaltsangabe, solange die Anzeige selbst keine Zahl nennt.
 */
export function jobPostingSchema(job) {
  const description =
    (job.intro ? `<p>${escHtml(job.intro)}</p>` : "") +
    (job.scope ? `<p>Umfang: ${escHtml(job.scope)}</p>` : "") +
    listHtml("Ihre Aufgaben", job.tasks) +
    listHtml("Ihr Profil", job.profile) +
    listHtml("Das bieten wir Ihnen", job.offer);

  const employmentType = [...new Set(jobTypes(job).map((t) => SCHEMA_EMPLOYMENT[t]).filter(Boolean))];

  return {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description,
    identifier: { "@type": "PropertyValue", name: "CuraMain GmbH", value: String(job.id) },
    datePosted: job.publishedAt,
    employmentType: employmentType.length === 1 ? employmentType[0] : employmentType,
    hiringOrganization: {
      "@type": "Organization",
      name: "CuraMain GmbH",
      sameAs: ORIGIN,
      logo: `${ORIGIN}/img/logo.png`,
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Frankfurt am Main",
        addressRegion: "Hessen",
        addressCountry: "DE",
      },
    },
    directApply: true,
    url: jobUrl(job),
  };
}
