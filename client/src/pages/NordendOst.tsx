import { Link } from "wouter";
import {
  MapPin, PhoneIcon, Mail, ArrowRight, Bike, Building2, Languages
} from "lucide-react";
import { useSEO } from "@/hooks/useSEO";

export default function NordendOst() {
  useSEO({
    title: "Ambulanter Pflegedienst Nordend-Ost Frankfurt – CuraMain",
    description: "Pflege in Nordend-Ost: persönlich, mehrsprachig, in unter 10 Min. bei Ihnen. Direkt am Bürgerhospital. Jetzt Beratung anfragen.",
    keywords: "Pflege Nordend-Ost Frankfurt, Pflegedienst Nordend, ambulante Pflege Nordend-Ost, CuraMain Berger Straße",
    canonical: "https://www.curamain.de/pflege/nordend-ost",
  });

  return (
    <div className="bg-cm-cream">
      {/* HERO */}
      <section
        className="relative min-h-[360px] hero-bg -mt-24 pt-24"
        style={{ background: "linear-gradient(135deg, #daedeb 0%, #f9f6f1 100%)" }}
      >
        <div className="relative z-10 container pt-6 pb-10">
          <span className="pill inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm border border-white/60 shadow-sm">
            <MapPin className="w-4 h-4 text-cm-teal" />
            Versorgungsgebiet · Nordend-Ost
          </span>
          <h1 className="h-serif text-5xl lg:text-7xl text-cm-teal mt-6 mb-6 max-w-3xl leading-[1.05]">
            Pflege im Nordend-Ost — vor Ort, persönlich und in unter 10 Minuten bei Ihnen.
          </h1>
          <p className="text-lg text-cm-ink/80 max-w-2xl leading-relaxed">
            Vom Merianplatz bis zum Bürgerhospital — Ihr ambulanter Pflegedienst direkt an der Berger Straße.
          </p>
        </div>
      </section>

      {/* HAUPTTEXT */}
      <section className="container py-12 lg:py-14">
        <div className="max-w-3xl">
          <p className="text-lg text-cm-ink/85 leading-relaxed mb-6">
            Das Nordend-Ost ist unser Zuhause. Unsere Geschäftsstelle in der Berger Straße 69 liegt mitten im Stadtteil — keine 200 Meter vom Merianplatz, fünf Minuten vom Bürgerhospital. Diese Nähe ist kein Zufall. Sie ist die Grundlage dafür, dass wir bei Ihnen sind, wenn es zählt.
          </p>
          <p className="text-lg text-cm-ink/80 leading-relaxed mb-6">
            Im Nordend-Ost lebt eine Generation, die diesen Stadtteil aufgebaut hat. Viele unserer Patientinnen und Patienten wohnen seit Jahrzehnten in den Altbauten zwischen Friedberger Anlage und Höhenstraße. Wir kennen die Hausflure, die Aufzüge, die Wege. Wir wissen, welche Hausarztpraxis montags Sprechstunde hat und wo das Bürgerhospital nach einer OP die Anschlussversorgung übergibt.
          </p>
          <p className="text-lg text-cm-ink/80 leading-relaxed">
            Mit dem E-Bike erreichen wir jedes Haus im Nordend-Ost in unter 10 Minuten — auch im Berufsverkehr. Das bedeutet: pünktliche Pflege, mehr Zeit am Bett, weniger Stress. Pflege, wie sie sich anfühlen sollte.
          </p>
        </div>
      </section>

      {/* VORTEILE – 3 CARDS */}
      <section className="container pb-12 lg:pb-14">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="h-serif text-4xl lg:text-5xl text-cm-ink">Drei Gründe für CuraMain im Nordend-Ost.</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          <div className="bg-white p-8 rounded-3xl border border-cm-teal-100">
            <div className="w-12 h-12 rounded-2xl bg-cm-teal-50 flex items-center justify-center mb-4">
              <Bike className="w-6 h-6 text-cm-teal" />
            </div>
            <h3 className="h-serif text-xl text-cm-ink mb-3">Anfahrt unter 10 Minuten — auch im Berufsverkehr</h3>
            <p className="text-sm text-cm-ink/70 leading-relaxed">
              Unsere E-Bike-Touren umfahren den Stau auf der Friedberger Landstraße. Sie warten nicht.
            </p>
          </div>
          <div className="bg-white p-8 rounded-3xl border border-cm-teal-100">
            <div className="w-12 h-12 rounded-2xl bg-cm-teal-50 flex items-center justify-center mb-4">
              <Building2 className="w-6 h-6 text-cm-teal" />
            </div>
            <h3 className="h-serif text-xl text-cm-ink mb-3">Direkter Draht zum Bürgerhospital</h3>
            <p className="text-sm text-cm-ink/70 leading-relaxed">
              Bei Krankenhauseinweisungen, Entlassungen oder Wundnachversorgung sind wir die natürliche ambulante Anschlusslösung.
            </p>
          </div>
          <div className="bg-white p-8 rounded-3xl border border-cm-teal-100">
            <div className="w-12 h-12 rounded-2xl bg-cm-teal-50 flex items-center justify-center mb-4">
              <Languages className="w-6 h-6 text-cm-teal" />
            </div>
            <h3 className="h-serif text-xl text-cm-ink mb-3">Mehrsprachige Versorgung — bei Ihnen zu Hause</h3>
            <p className="text-sm text-cm-ink/70 leading-relaxed">
              Pflege auf Deutsch, Türkisch, Arabisch, Russisch, Polnisch und vier weiteren Sprachen — kultursensibel und geschlechtssensibel.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container pb-12 lg:pb-20">
        <div className="bg-cm-teal-50 rounded-3xl p-10 lg:p-12 text-center">
          <h2 className="h-serif text-3xl lg:text-4xl text-cm-ink mb-3">Kostenloses Erstgespräch im Nordend-Ost vereinbaren</h2>
          <p className="text-cm-ink/70 mb-7 max-w-xl mx-auto">
            Telefonisch, per E-Mail oder bei Ihnen zu Hause — wie es für Sie am besten passt.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/kontakt/patient"
              className="bg-cm-teal hover:bg-cm-teal-500 text-white px-7 py-3 rounded-full font-medium shadow-md inline-flex items-center gap-2 transition-colors"
            >
              Anfrage absenden <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="tel:+4969792 16147"
              className="bg-white border border-cm-teal-100 hover:border-cm-teal-300 text-cm-ink px-7 py-3 rounded-full font-medium inline-flex items-center gap-2 transition-colors"
            >
              <PhoneIcon className="w-4 h-4 text-cm-teal" />
              069 / 79 216 147
            </a>
          </div>
        </div>
      </section>

      {/* KONTAKT-INFO */}
      <section className="container pb-12 lg:pb-20">
        <div className="bg-cm-ink text-white rounded-3xl p-10 lg:p-14">
          <h2 className="h-serif text-3xl lg:text-4xl mb-8">So erreichen Sie uns.</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="flex gap-4">
              <PhoneIcon className="w-6 h-6 text-cm-mint flex-shrink-0" />
              <div>
                <p className="font-medium mb-1">Telefon</p>
                <a href="tel:+4969792 16147" className="text-cm-mint hover:underline">
                  069 / 79 216 147
                </a>
                <p className="text-white/70 text-sm mt-1">Mo–Fr 8:00–18:00 · Notfall 24/7</p>
              </div>
            </div>
            <div className="flex gap-4">
              <Mail className="w-6 h-6 text-cm-mint flex-shrink-0" />
              <div>
                <p className="font-medium mb-1">E-Mail</p>
                <a href="mailto:info@curamain.de" className="text-cm-mint hover:underline">
                  info@curamain.de
                </a>
                <p className="text-white/70 text-sm mt-1">Antwort innerhalb von 24h</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
