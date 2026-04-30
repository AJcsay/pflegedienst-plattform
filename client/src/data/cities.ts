export interface City {
  slug: string;
  name: string;
  /** Lokal verankerte H1 (z. B. "Ambulante Pflege in Frankfurt am Main"). */
  heroTitle: string;
  /** Lead-Absatz unter H1 (~250 Zeichen). */
  intro: string;
  /** Stadtteile / Ortsteile, die wir versorgen. */
  districts: string[];
  /** Bekannte Krankenhäuser / Kliniken in der Stadt (für Patientenüberleitungen). */
  hospitals: string[];
  /** Lokale Besonderheiten / Touch-Points im Service-Bereich. */
  highlights: string[];
  /** Geografische Koordinaten (Stadtmitte) für Schema.org/GeoCoordinates. */
  geo: { lat: number; lng: number };
  /** Anfahrt aus Sicht der Frankfurt-Berger-Straße: typische Fahrzeit zum Hauptbahnhof o. ä. */
  travelHint: string;
}

// Phase-1-Versorgungsgebiete (Strategie 2026-04-30):
// Nordend-Ost · Bornheim · Ostend (Heimrevier um Berger Str. 69).
// Offenbach, Hanau, Sachsenhausen, Bockenheim sind NICHT Phase 1 — kommen später.
export const CITIES: City[] = [
  {
    slug: "frankfurt",
    name: "Frankfurt am Main",
    heroTitle: "Ambulante Pflege in Frankfurt – Nordend-Ost · Bornheim · Ostend",
    intro:
      "Direkt aus dem Standort Berger Straße 69 versorgen wir Patientinnen und Patienten im Heimrevier rund um Bornheim und Nordend – mit Grund- und Behandlungspflege, kultursensibel und in sieben Sprachen.",
    districts: [
      "Nordend-Ost",
      "Bornheim",
      "Ostend",
    ],
    hospitals: [
      "Bürgerhospital Frankfurt (Nordend-West)",
      "Sankt Katharinen-Krankenhaus (Bornheim, mit eigener Geriatrie)",
      "Bethanien-Krankenhaus (Nordendgrenze)",
      "Klinik Rotes Kreuz (Ostend)",
    ],
    highlights: [
      "Wir sind Vertragspartner aller gesetzlichen Krankenkassen in Hessen (§ 132a SGB V & § 72 SGB XI).",
      "E-Bike-Touren in Nordend-Ost, Bornheim und Ostend – meist innerhalb von 24 Stunden ein Erstgespräch vor Ort möglich.",
      "Mehrsprachiges Team mit Deutsch, Türkisch, Arabisch, Russisch, Polnisch, Englisch und Französisch.",
    ],
    geo: { lat: 50.1234, lng: 8.7045 },
    travelHint: "Hauptstandort Berger Straße 69 – wir sind in unter 10 Minuten in jedem Phase-1-Stadtteil.",
  },
];

export function findCity(slug: string): City | undefined {
  return CITIES.find((c) => c.slug === slug);
}
