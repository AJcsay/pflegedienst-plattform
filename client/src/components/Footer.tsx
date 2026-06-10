import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { Phone, Mail, MapPin, Clock } from "lucide-react";

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-cm-pine-deep text-white/80 mt-12 lg:mt-20">
      <div className="container py-14 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-2 space-y-4">
            <img
              src="/img/logo-transparent.png"
              alt="CuraMain"
              className="h-14 w-auto max-w-xs brightness-0 invert opacity-90"
            />
            <p className="text-sm leading-relaxed text-white/60 max-w-md">
              {t("footer.tagline")}
            </p>
            <div className="space-y-2 text-sm pt-2">
              <a href="tel:+496979216147" className="flex items-center gap-2.5 py-2 hover:text-cm-mint transition-colors">
                <Phone className="h-4 w-4 shrink-0 text-cm-mint" />
                069 / 79 216 147
              </a>
              <a href="mailto:info@curamain.de" className="flex items-center gap-2.5 py-2 hover:text-cm-mint transition-colors">
                <Mail className="h-4 w-4 shrink-0 text-cm-mint" />
                info@curamain.de
              </a>
              <div className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 shrink-0 text-cm-mint mt-0.5" />
                <span>Berger Str. 69, 60316 Frankfurt am Main</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="h-4 w-4 shrink-0 text-cm-mint" />
                {t("footer.hours")}
              </div>
            </div>
            <div className="pt-4">
              <img
                src="/bpa-mitglied.jpg"
                alt="Mitglied im bpa – Bundesverband privater Anbieter sozialer Dienste e. V."
                className="h-20 w-auto rounded bg-white/95 p-2"
              />
            </div>
          </div>

          {/* Seiten */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-cm-mint">{t("footer.pagesLabel")}</h4>
            <div className="space-y-2 text-sm">
              <Link href="/ueber-uns" className="block py-2 hover:text-cm-mint transition-colors">{t("footer.links.about")}</Link>
              <Link href="/leistungen" className="block py-2 hover:text-cm-mint transition-colors">{t("footer.links.services")}</Link>
              <Link href="/faq" className="block py-2 hover:text-cm-mint transition-colors">{t("footer.links.faq")}</Link>
              <Link href="/downloads" className="block py-2 hover:text-cm-mint transition-colors">{t("footer.links.downloads")}</Link>
              <Link href="/testimonials" className="block py-2 hover:text-cm-mint transition-colors">{t("footer.links.testimonials")}</Link>
              <Link href="/kontakt/patient" className="block py-2 hover:text-cm-mint transition-colors">{t("footer.links.contact")}</Link>
            </div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-cm-mint pt-3">{t("footer.coverageLabel")}</h4>
            <div className="space-y-2 text-sm">
              <Link href="/pflege/nordend-ost" className="block py-2 hover:text-cm-mint transition-colors">{t("footer.links.nordend")}</Link>
              <Link href="/pflege/bornheim" className="block py-2 hover:text-cm-mint transition-colors">{t("footer.links.bornheim")}</Link>
              <Link href="/pflege/ostend" className="block py-2 hover:text-cm-mint transition-colors">{t("footer.links.ostend")}</Link>
            </div>
          </div>

          {/* Karriere & Partner */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-cm-mint">{t("footer.careerLabel")}</h4>
            <div className="space-y-2 text-sm">
              <Link href="/karriere" className="block py-2 hover:text-cm-mint transition-colors">{t("footer.links.jobs")}</Link>
              <Link href="/karriere/bewerbung" className="block py-2 hover:text-cm-mint transition-colors">{t("footer.links.apply")}</Link>
              <Link href="/partner/zuweiser" className="block py-2 hover:text-cm-mint transition-colors">{t("footer.links.doctors")}</Link>
              <Link href="/partner/kapazitaet" className="block py-2 hover:text-cm-mint transition-colors">{t("footer.links.capacity")}</Link>
              <Link href="/partner/kassen" className="block py-2 hover:text-cm-mint transition-colors">{t("footer.links.insurance")}</Link>
              <Link href="/partner/dokumente" className="block py-2 hover:text-cm-mint transition-colors">{t("footer.links.documents")}</Link>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/70">
          <span>
            {t("footer.copyright", { year: new Date().getFullYear() })}
          </span>
          <div className="flex items-center gap-5">
            <Link href="/impressum" className="inline-block py-2 hover:text-cm-mint transition-colors">{t("footer.links.imprint")}</Link>
            <Link href="/datenschutz" className="inline-block py-2 hover:text-cm-mint transition-colors">{t("footer.links.privacy")}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
