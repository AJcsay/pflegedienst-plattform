// Globale Typdeklarationen — z.B. Drittanbieter-Skripte (gtag.js).

declare global {
  interface Window {
    gtag?: (
      command: "event" | "config" | "set" | "consent" | "js",
      ...args: unknown[]
    ) => void;
    dataLayer?: unknown[];
  }
}

export {};
