export interface Job {
  id: number;
  title: string;
  department?: string;
  location?: string;
  employmentType: "fulltime" | "parttime" | "minijob" | "internship" | string;
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
