import type { Job } from "@/data/types";

export declare const ORIGIN: string;
export declare const EMPLOYMENT_LABELS: Record<string, string>;
export declare function jobTypes(job: Job): string[];
export declare function jobTypeLabel(job: Job): string;
export declare function jobPath(job: Job): string;
export declare function jobUrl(job: Job): string;
export declare function jobImageUrl(job: Job): string;
export declare function jobSeoTitle(job: Job): string;
export declare function jobTeaser(job: Job): string;
export declare function jobSeoDescription(job: Job): string;
export declare function jobPostingSchema(job: Job): Record<string, unknown>;
