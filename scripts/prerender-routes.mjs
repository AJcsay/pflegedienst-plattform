/**
 * Zentrale Route-Meta-Map für das Prerendering (scripts/prerender.mjs).
 *
 * Single Source of Truth für die statisch ins HTML geschriebenen Meta-Tags
 * (Title, Description, Canonical, OG) UND die sitemap.xml.
 *
 * WICHTIG: Bei neuen Seiten/Routen hier einen Eintrag ergänzen und die Werte
 * mit dem useSEO(...) der jeweiligen Seite synchron halten. Dynamische Routen
 * (z. B. /pflegedienst/:city) und noindex-Seiten (404) werden bewusst NICHT
 * vorgerendert.
 */
export const routes = [
  {
    path: "/",
    title: "CuraMain – Pflege & Teilhabe in Frankfurt | Nordend · Bornheim · Ostend",
    description: "CuraMain: Pflege & Teilhabe in Frankfurt – Nordend, Bornheim & Ostend. Grundpflege, Behandlungspflege, kultursensible Begleitung. Kassenzugelassen. ☎ 069 79 216 147",
    keywords: "Pflege und Teilhabe Frankfurt, Pflegedienst Frankfurt, ambulanter Pflegedienst Frankfurt, häusliche Pflege Frankfurt, kultursensible Pflege Frankfurt, mehrsprachiger Pflegedienst, Grundpflege Frankfurt, Behandlungspflege Frankfurt, CuraMain",
    priority: "1.0",
  },
  {
    path: "/leistungen",
    title: "Pflege & Teilhabe Frankfurt – Behandlungspflege, Grundpflege & mehr | CuraMain",
    description: "Pflege und Teilhabe in Frankfurt: Behandlungspflege (SGB V), Grundpflege (SGB XI), Verhinderungspflege, Beratungsbesuche § 37.3 & kultursensible Betreuung. Kassenzugelassen.",
    priority: "0.8",
  },
  {
    path: "/faq",
    title: "Häufige Fragen zur ambulanten Pflege in Frankfurt – CuraMain",
    description: "Antworten auf häufige Fragen zu Pflegegraden, Kosten, Leistungen und Antragstellung. CuraMain berät Sie kostenlos in Frankfurt – Nordend, Bornheim & Ostend. ☎ 069 79 216 147",
    priority: "0.7",
  },
  {
    path: "/testimonials",
    title: "Bewertungen & Testimonials – CuraMain",
    description: "Lesen Sie echte Bewertungen unserer Patient·innen auf Google. CuraMain – ambulanter Pflegedienst Rhein-Main-Gebiet.",
    priority: "0.6",
  },
  {
    path: "/kontakt/patient",
    title: "Kostenlose Pflegeberatung anfragen – CuraMain",
    description: "Fordern Sie jetzt Ihre kostenlose Erstberatung bei CuraMain im Rhein-Main-Gebiet an. Wir beraten Sie zu Pflegeleistungen, Pflegegraden und Kosten.",
    priority: "0.8",
  },
  {
    path: "/ueber-uns",
    title: "Über CuraMain – Pflege & Teilhabe in Frankfurt mit 13+ Jahren Erfahrung",
    description: "CuraMain Frankfurt: Gegründet von erfahrenen Pflegefachpersonen mit über 13 Jahren Praxis in Nordend, Bornheim und Ostend. Unsere Werte, unser Team und unsere Vision: Pflege und Teilhabe über alle Lebensphasen.",
    priority: "0.7",
  },
  {
    path: "/karriere",
    title: "Jobs & Karriere beim Pflegedienst – CuraMain",
    description: "Jetzt als Pflegefachperson, Pflegeassistent·in oder in der Hauswirtschaft bei CuraMain in Frankfurt-Bornheim/Nordend bewerben. Übertarifliche Bezahlung, E-Bike-Touren statt Pkw-Stress, flexible Dienstpläne.",
    priority: "0.7",
  },
  {
    path: "/karriere/bewerbung",
    title: "Jetzt bewerben beim Pflegedienst – CuraMain",
    description: "Bewerben Sie sich jetzt bei CuraMain im Rhein-Main-Gebiet. Pflegefachperson, Pflegeassistent·in oder Hauswirtschaft – Lebenslauf hochladen und Teil unseres Teams werden.",
    priority: "0.6",
  },
  {
    path: "/bewerbung",
    canonical: "https://www.curamain.de/karriere/bewerbung",
    title: "Jetzt bewerben beim Pflegedienst – CuraMain",
    description: "Bewerben Sie sich jetzt bei CuraMain im Rhein-Main-Gebiet. Pflegefachperson, Pflegeassistent·in oder Hauswirtschaft – Lebenslauf hochladen und Teil unseres Teams werden.",
    inSitemap: false,
  },
  {
    path: "/partner/zuweiser",
    title: "Zuweiser-Portal für Ärzte & Kliniken – CuraMain",
    description: "Patientenüberleitung an CuraMain Frankfurt: Zuweiser-Portal für Hausärzte, Fachärzte & Kliniken. Rückmeldung in 4h, nahtlose ambulante Weiterversorgung in Nordend, Bornheim & Ostend.",
    priority: "0.6",
  },
  {
    path: "/partner/kapazitaet",
    title: "Kapazitätsabfrage ambulante Pflege – CuraMain",
    description: "Pflegekapazitäten im Rhein-Main-Gebiet: Fragen Sie jetzt verfügbare Kapazitäten bei CuraMain an. Schnelle Rückmeldung für Kliniken, Ärzte, Krankenkassen & Kooperationspartner.",
    priority: "0.6",
  },
  {
    path: "/partner/kassen",
    title: "Krankenkassen & private Ärzte – CuraMain Partner",
    description: "Kooperation mit CuraMain: Krankenkassen & Privatpraxen im Rhein-Main-Gebiet. Qualitätsunterlagen, Versorgungsdokumente & Kooperationsverträge zum Download.",
    priority: "0.6",
  },
  {
    path: "/partner/dokumente",
    title: "Partner-Dokumente & Qualitätsunterlagen – CuraMain",
    description: "Qualitätsunterlagen & Versorgungsdokumente von CuraMain im Rhein-Main-Gebiet. Kooperationsverträge, Zertifikate & Leistungsunterlagen für Partner zum Download.",
    priority: "0.6",
  },
  {
    path: "/pflege/nordend-ost",
    title: "Pflegedienst Frankfurt Nordend-Ost – in unter 10 Min. bei Ihnen | CuraMain",
    description: "Ambulanter Pflegedienst Frankfurt Nordend-Ost: Berger Straße 69, direkt am Bürgerhospital. Mehrsprachig, kassenzugelassen, E-Bike-schnell. ☎ 069 79 216 147",
    priority: "0.9",
  },
  {
    path: "/pflege/bornheim",
    title: "Pflegedienst Frankfurt Bornheim – mehrsprachig & kassenzugelassen | CuraMain",
    description: "Ambulanter Pflegedienst Frankfurt-Bornheim: Geriatrie-Anbindung Sankt Katharinen, mehrsprachig, kultursensibel. Kostenlose Erstberatung. ☎ 069 79 216 147",
    priority: "0.9",
  },
  {
    path: "/pflege/ostend",
    title: "Pflegedienst Frankfurt Ostend – Klinik Rotes Kreuz & EZB-Quartier | CuraMain",
    description: "Ambulanter Pflegedienst Frankfurt-Ostend: Klinik-Anbindung Rotes Kreuz, mehrsprachig, per E-Bike in unter 10 Min. Kostenlose Erstberatung. ☎ 069 79 216 147",
    priority: "0.9",
  },
  {
    path: "/pflege/sachsenhausen",
    title: "Ambulanter Pflegedienst Sachsenhausen Frankfurt – kultursensibel & kassenzugelassen | CuraMain",
    description: "Ambulanter Pflegedienst Frankfurt-Sachsenhausen: Häusliche Pflege am Museumsufer, mehrsprachig, kultursensibel. Kostenlose Erstberatung. ☎ 069 79 216 147",
    priority: "0.9",
  },
  {
    path: "/pflege/westend",
    title: "Ambulanter Pflegedienst Westend Frankfurt – mehrsprachig & kassenzugelassen | CuraMain",
    description: "Ambulanter Pflegedienst Frankfurt-Westend: Häusliche Pflege am Palmengarten, kultursensibel, mehrsprachig. Uniklinik-Anbindung. ☎ 069 79 216 147",
    priority: "0.9",
  },
  {
    path: "/pflege/bockenheim",
    title: "Ambulanter Pflegedienst Bockenheim Frankfurt – mehrsprachig & kassenzugelassen | CuraMain",
    description: "Ambulanter Pflegedienst Frankfurt-Bockenheim: Häusliche Pflege am Bürgerhospital, mehrsprachig, kultursensibel. Kostenlose Erstberatung. ☎ 069 79 216 147",
    priority: "0.9",
  },
  {
    path: "/frankfurt",
    title: "Ambulanter Pflegedienst Frankfurt am Main – CuraMain | Kassenzugelassen",
    description: "CuraMain: Ihr ambulanter Pflegedienst in Frankfurt am Main. Grundpflege, Behandlungspflege & Betreuung in Nordend, Bornheim, Ostend und allen Stadtteilen. Kassenzugelassen. ☎ 069 79 216 147",
    priority: "0.8",
  },
  {
    path: "/offenbach",
    title: "Ambulanter Pflegedienst Offenbach am Main | CuraMain",
    description: "CuraMain betreut Pflegebedürftige in Offenbach am Main und Umgebung. Häusliche Pflege, Behandlungspflege, Betreuung – mehrsprachig & individuell.",
    priority: "0.7",
  },
  {
    path: "/impressum",
    title: "Impressum – CuraMain",
    description: "Impressum und Kontaktdaten von CuraMain, ambulanter Pflegedienst im Rhein-Main-Gebiet.",
    priority: "0.2",
  },
  {
    path: "/datenschutz",
    title: "Datenschutzerklärung – CuraMain",
    description: "Datenschutzerklärung von CuraMain. Informationen zur Verarbeitung Ihrer Daten gemäß DSGVO – Kontaktformular, Google Analytics, Google Maps und Ihre Rechte.",
    priority: "0.2",
  },
];
