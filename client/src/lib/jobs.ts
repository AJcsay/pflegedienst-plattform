import jobsData from "@/data/jobs.json";
import type { Job } from "@/data/types";

/** Alle Stellen aus jobs.json (auch inaktive – für die „nicht mehr ausgeschrieben“-Seite). */
export const ALL_JOBS: Job[] = (jobsData as { jobs: Job[] }).jobs;

/** Nur aktuell ausgeschriebene Stellen. */
export const ACTIVE_JOBS: Job[] = ALL_JOBS.filter((j) => j.active);

export function findJobBySlug(slug: string | undefined): Job | undefined {
  if (!slug) return undefined;
  const s = decodeURIComponent(slug).toLowerCase().replace(/\/+$/, "");
  return ALL_JOBS.find((j) => j.slug === s);
}

export {
  ORIGIN,
  EMPLOYMENT_LABELS,
  jobTypes,
  jobTypeLabel,
  jobPath,
  jobUrl,
  jobImageUrl,
  jobSeoTitle,
  jobTeaser,
  jobSeoDescription,
} from "./job-seo.mjs";
