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

export const CITIES: City[] = [
  {
    slug: "frankfurt",
    name: "Frankfurt am Main",
    heroTitle: "Ambulante Pflege in Frankfurt am Main",
    intro:
      "Direkt aus dem Bornheimer Standort versorgen wir Patientinnen und Patienten in ganz Frankfurt – mit Grund- und Behandlungspflege, kultursensibel und in sieben Sprachen.",
    districts: [
      "Bornheim",
      "Nordend",
      "Sachsenhausen",
      "Ostend",
      "Bockenheim",
      "Gallus",
      "Höchst",
      "Riederwald",
    ],
    hospitals: [
      "Universitätsklinikum Frankfurt",
      "Markus Krankenhaus",
      "Sankt Katharinen-Krankenhaus",
      "Bürgerhospital",
      "Klinikum Frankfurt Höchst",
    ],
    highlights: [
      "Wir sind Vertragspartner aller gesetzlichen Krankenkassen in Hessen (§ 132a SGB V & § 72 SGB XI).",
      "Tägliche Touren in Bornheim und Nordend – meist innerhalb von 24 Stunden ein Erstgespräch vor Ort möglich.",
      "Mehrsprachiges Team mit Deutsch, Türkisch, Arabisch, Russisch, Polnisch, Englisch und Französisch.",
    ],
    geo: { lat: 50.1109, lng: 8.6821 },
    travelHint: "Hauptstandort Berger Straße 69 – wir sind in 5–20 Minuten in jedem Frankfurter Stadtteil.",
  },
  {
    slug: "offenbach",
    name: "Offenbach am Main",
    heroTitle: "Ambulanter Pflegedienst in Offenbach",
    intro:
      "In Offenbach betreuen wir die Stadtteile Innenstadt, Bürgel, Bieber und Tempelsee. Schnelle Übernahme nach Klinikaufenthalt oder bei akut steigendem Pflegebedarf – auf Wunsch mehrsprachig.",
    districts: ["Innenstadt", "Bürgel", "Bieber", "Tempelsee", "Rumpenheim", "Lauterborn"],
    hospitals: ["Sana Klinikum Offenbach", "Ketteler Krankenhaus"],
    highlights: [
      "Enge Zusammenarbeit mit dem Sana Klinikum Offenbach für nahtlose Entlassungen ins häusliche Umfeld.",
      "Für Bornheim/Bürgel-Anbindung: in der Regel binnen 4 Stunden vor Ort bei Notfall-Übernahmen.",
      "Tägliche Touren – 7 Tage die Woche, auch an Feiertagen.",
    ],
    geo: { lat: 50.0956, lng: 8.7761 },
    travelHint: "Von der Berger Straße ca. 20 Minuten – wir versorgen Offenbach werktäglich.",
  },
  {
    slug: "hanau",
    name: "Hanau",
    heroTitle: "Häusliche Pflege in Hanau und Maintal",
    intro:
      "Vom Stadtzentrum Hanau bis nach Maintal-Bischofsheim und Bad Vilbel – wir betreuen Patient*innen im östlichen Rhein-Main-Gebiet mit qualifizierter Behandlungspflege und kultursensibler Grundpflege.",
    districts: ["Hanau-Innenstadt", "Großauheim", "Steinheim", "Wolfgang", "Lamboy", "Maintal-Bischofsheim", "Bad Vilbel"],
    hospitals: ["Klinikum Hanau", "St. Vinzenz-Krankenhaus Hanau"],
    highlights: [
      "Kooperation mit dem Klinikum Hanau für Patientenüberleitungen.",
      "Fester Tourenplan in Hanau-Innenstadt, Großauheim und Maintal-Bischofsheim.",
      "Spezialisiert auf Wundversorgung und Diabetes-Behandlungspflege.",
    ],
    geo: { lat: 50.1357, lng: 8.9151 },
    travelHint: "Aus Frankfurt-Bornheim erreichen wir Hanau und Maintal in 25–35 Minuten.",
  },
];

export function findCity(slug: string): City | undefined {
  return CITIES.find((c) => c.slug === slug);
}
