/**
 * API-Helper für die statischen All-Inkl-PHP-Endpunkte.
 *
 * In Production werden Anfragen an /api/contact.php bzw. /api/bewerbung.php
 * direkt vom Webspace beantwortet. Lokal (vite dev) gibt es keine PHP —
 * dort liefern die Helper einen "Demo-Modus"-Toast und werfen keinen
 * Netzwerkfehler.
 */

const isDev = import.meta.env.DEV;

export type ContactCategory =
  | "patient"
  | "referral"
  | "capacity"
  | "insurance"
  | "general";

export interface ContactPayload {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  category: ContactCategory;
  // optional Felder für Partner-spezifische Anfragen
  organization?: string;
  extra?: Record<string, unknown>;
}

export interface BewerbungPayload {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  message?: string;
  jobPostingId?: number;
  jobTitle?: string;
}

interface ApiOk {
  success: true;
}

interface ApiErr {
  success: false;
  error: string;
}

type ApiResponse = ApiOk | ApiErr;

async function postJson(url: string, body: unknown): Promise<ApiResponse> {
  if (isDev) {
    // Lokaler Dev-Modus: PHP-Endpunkte existieren nicht. Erfolgreich tun, in Konsole loggen.
    console.info(`[DEV] Skipping POST ${url}`, body);
    return { success: true };
  }

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    let errMsg = `HTTP ${res.status}`;
    try {
      const data = (await res.json()) as ApiErr;
      if (data?.error) errMsg = data.error;
    } catch {
      // ignore parse errors
    }
    return { success: false, error: errMsg };
  }

  try {
    return (await res.json()) as ApiResponse;
  } catch {
    return { success: true };
  }
}

export async function submitContact(payload: ContactPayload): Promise<ApiResponse> {
  return postJson("/api/contact.php", payload);
}

export async function submitBewerbung(
  payload: BewerbungPayload,
  cv: File | null,
): Promise<ApiResponse> {
  if (isDev) {
    console.info("[DEV] Skipping POST /api/bewerbung.php", payload, cv?.name);
    return { success: true };
  }

  const fd = new FormData();
  for (const [key, value] of Object.entries(payload)) {
    if (value === undefined || value === null) continue;
    fd.append(key, String(value));
  }
  if (cv) fd.append("cv", cv, cv.name);

  const res = await fetch("/api/bewerbung.php", {
    method: "POST",
    body: fd,
  });

  if (!res.ok) {
    let errMsg = `HTTP ${res.status}`;
    try {
      const data = (await res.json()) as ApiErr;
      if (data?.error) errMsg = data.error;
    } catch {
      // ignore
    }
    return { success: false, error: errMsg };
  }

  try {
    return (await res.json()) as ApiResponse;
  } catch {
    return { success: true };
  }
}
