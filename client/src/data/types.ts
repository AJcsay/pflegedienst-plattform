export interface Job {
  id: number;
  title: string;
  department?: string;
  location?: string;
  employmentType: "fulltime" | "parttime" | "minijob" | "internship" | string;
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
  fileUrl: string;
  fileName?: string;
  fileSize?: number | null;
  publishedAt: string;
}

export interface DocumentsFile {
  documents: Document[];
}
