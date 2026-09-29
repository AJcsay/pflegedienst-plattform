export interface Job {
  id: number;
  /** URL-Kennung der Stellenseite: /karriere/<slug>/ – nach Veröffentlichung nicht mehr ändern (geteilte Links!) */
  slug: string;
  title: string;
  department?: string;
  location?: string;
  employmentType: "fulltime" | "parttime" | "minijob" | "internship" | string;
  /** Mehrere Beschäftigungsarten (z. B. Minijob oder Teilzeit); überschreibt employmentType für Filter und Anzeige */
  employmentTypes?: string[];
  /** Kurzer Anreißer für Karriere-Übersicht und Social-Media-Vorschau (max. ~160 Zeichen) */
  teaser?: string;
  /** Pfad zum Vorschaubild für Social Media (1200×630), z. B. /img/jobs/<slug>.jpg */
  ogImage?: string;
  startDate?: string;
  scope?: string;
  salary?: string;
  intro?: string;
  tasks?: string[];
  profile?: string[];
  offer?: string[];
  /** @deprecated durch intro/tasks/profile/offer ersetzt – bleibt für Abwärtskompatibilität optional */
  description?: string;
  requirements?: string;
  benefits?: string;
  active: boolean;
  publishedAt: string;
}

export interface JobsFile {
  jobs: Job[];
}

export interface Document {
  id: number;
  title: string;
  description?: string;
  category: "quality" | "supply" | "contract" | "other" | string;
  fileUrl: string | null;
  fileName?: string | null;
  fileSize?: number | null;
  publishedAt: string;
}

export interface DocumentsFile {
  documents: Document[];
}
