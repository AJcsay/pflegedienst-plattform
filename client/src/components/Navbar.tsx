import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { useTranslation } from "react-i18next";
import {
  Heart, Menu, X, ChevronDown,
  Briefcase, Building2,
} from "lucide-react";

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [location] = useLocation();

  const isActive = (href: string) => location === href;

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  // Lock body scroll while mobile menu is open and close on ESC.
  useEffect(() => {
    if (!mobileOpen) return;

    const scrollY = window.scrollY;
    const body = document.body;
    const prev = {
      position: body.style.position,
      top: body.style.top,
      width: body.style.width,
      overflow: body.style.overflow,
    };
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.width = "100%";
    body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKey);

    return () => {
      body.style.position = prev.position;
      body.style.top = prev.top;
      body.style.width = prev.width;
      body.style.overflow = prev.overflow;
      window.scrollTo(0, scrollY);
      window.removeEventListener("keydown", onKey);
    };
  }, [mobileOpen]);

  // Nav groups – gebaut zur Laufzeit damit t() reagiert
  const navGroups = [
    {
      label: t("nav.groups.patients.label"),
      icon: Heart,
      items: [
        { label: t("nav.groups.patients.services"), href: "/leistungen" },
        { label: t("nav.groups.patients.faq"), href: "/faq" },
        { label: t("nav.groups.patients.downloads"), href: "/downloads" },
        { label: t("nav.groups.patients.contact"), href: "/kontakt/patient" },
      ],
    },
    {
      label: t("nav.groups.applicants.label"),
      icon: Briefcase,
      items: [
        { label: t("nav.groups.applicants.jobs"), href: "/karriere" },
        { label: t("nav.groups.applicants.apply"), href: "/karriere/bewerbung" },
        { label: t("nav.groups.applicants.benefits"), href: "/karriere#benefits" },
      ],
    },
    {
      label: t("nav.groups.partners.label"),
      icon: Building2,
      items: [
        { label: t("nav.groups.partners.doctors"), href: "/partner/zuweiser" },
        { label: t("nav.groups.partners.capacity"), href: "/partner/kapazitaet" },
        { label: t("nav.groups.partners.insurance"), href: "/partner/kassen" },
        { label: t("nav.groups.partners.documents"), href: "/partner/dokumente" },
      ],
    },
  ];

  const currentLang = i18n.language.startsWith("en") ? "en" : "de";

  const toggleLang = () => {
    const next = currentLang === "de" ? "en" : "de";
    i18n.changeLanguage(next);
  };

  return (
    <>
      <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[min(96%,1280px)]">
        <nav className="glass rounded-full shadow-[0_8px_32px_rgba(28,40,38,0.08)] border border-white/40 px-3 lg:px-4 py-2 flex items-center gap-2">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 px-2 lg:px-3 py-1.5 mr-1 shrink-0">
            <img
              src="/img/logo-transparent.png"
              alt="CuraMain"
              className="h-9 lg:h-10 w-auto"
            />
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-1 flex-1">
            <Link
              href="/"
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                isActive("/") ? "bg-cm-teal text-white" : "text-cm-ink hover:bg-cm-teal-50"
              }`}
            >
              {t("nav.home")}
            </Link>
            <Link
              href="/ueber-uns"
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                isActive("/ueber-uns") ? "bg-cm-teal text-white" : "text-cm-ink hover:bg-cm-teal-50"
              }`}
            >
              {t("nav.about")}
            </Link>

            {navGroups.map((group) => {
              const groupActive = group.items.some((i) => isActive(i.href));
              const isOpen = openDropdown === group.label;
              return (
                <div
                  key={group.label}
                  className="relative"
                  onMouseEnter={() => setOpenDropdown(group.label)}
                  onMouseLeave={() => setOpenDropdown(null)}
                  onKeyDown={(e) => { if (e.key === "Escape") setOpenDropdown(null); }}
                  onBlur={(e) => {
                    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                      setOpenDropdown(null);
                    }
                  }}
                >
                  <button
                    type="button"
                    aria-haspopup="menu"
                    aria-expanded={isOpen}
                    onClick={() => setOpenDropdown(isOpen ? null : group.label)}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                      groupActive || isOpen
                        ? "bg-cm-teal text-white"
                        : "text-cm-ink hover:bg-cm-teal-50"
                    }`}
                  >
                    <group.icon className="h-4 w-4" />
                    {group.label}
                    <ChevronDown
                      className={`h-3.5 w-3.5 transition-transform ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="absolute top-full left-0 pt-2 z-50">
                      <div className="glass rounded-2xl shadow-lg border border-white/40 py-2 min-w-[240px]">
                        {group.items.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            className={`block px-4 py-2.5 text-sm transition-colors ${
                              isActive(item.href)
                                ? "text-cm-teal-600 font-medium"
                                : "text-cm-ink hover:bg-cm-teal-50"
                            }`}
                            onClick={() => setOpenDropdown(null)}
                          >
                            {item.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* CTA + Sprachumschalter + Mobile toggle */}
          <div className="flex items-center gap-2 ml-auto">
            {/* Sprachumschalter DE | EN */}
            <button
              type="button"
              onClick={toggleLang}
              aria-label={currentLang === "de" ? "Switch to English" : "Auf Deutsch wechseln"}
              className="hidden sm:inline-flex items-center gap-1 px-3 py-2 rounded-full text-xs font-semibold tracking-wide border border-cm-teal-200 hover:border-cm-teal-400 text-cm-ink hover:bg-cm-teal-50 transition-colors select-none"
            >
              <span className={currentLang === "de" ? "text-cm-teal-700 font-bold" : "text-cm-ink/50"}>DE</span>
              <span className="text-cm-ink/30">|</span>
              <span className={currentLang === "en" ? "text-cm-teal-700 font-bold" : "text-cm-ink/50"}>EN</span>
            </button>

            <Link
              href="/kontakt/patient"
              className="hidden md:inline-flex bg-cm-teal hover:bg-cm-teal-500 text-white px-5 py-2.5 rounded-full text-sm font-medium shadow-md whitespace-nowrap transition-colors"
            >
              {t("nav.cta")}
            </Link>
            <button
              type="button"
              className="lg:hidden inline-flex items-center justify-center w-11 h-11 rounded-full hover:bg-cm-teal-50 transition-colors"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label={mobileOpen ? t("nav.menuClose") : t("nav.menuOpen")}
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>

        {/* Mobile nav */}
        {mobileOpen && (
          <div
            id="mobile-nav"
            className="lg:hidden glass mt-2 rounded-3xl shadow-lg border border-white/40 p-4 max-h-[calc(100dvh-6rem)] overflow-y-auto overscroll-contain"
          >
            <div className="space-y-1">
              <Link
                href="/"
                className="block px-4 py-2.5 text-sm font-medium rounded-full hover:bg-cm-teal-50"
                onClick={() => setMobileOpen(false)}
              >
                {t("nav.home")}
              </Link>
              <Link
                href="/ueber-uns"
                className="block px-4 py-2.5 text-sm font-medium rounded-full hover:bg-cm-teal-50"
                onClick={() => setMobileOpen(false)}
              >
                {t("nav.about")}
              </Link>
              {navGroups.map((group) => (
                <div key={group.label}>
                  <div className="px-4 pt-3 pb-1 text-xs font-semibold uppercase tracking-wider text-cm-teal-600">
                    {group.label}
                  </div>
                  {group.items.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="block px-4 py-2 ml-2 text-sm rounded-full hover:bg-cm-teal-50"
                      onClick={() => setMobileOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              ))}
              {/* Sprachumschalter im Mobile-Menü */}
              <div className="pt-2 px-4">
                <button
                  type="button"
                  onClick={() => { toggleLang(); setMobileOpen(false); }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold tracking-wide border border-cm-teal-200 hover:border-cm-teal-400 text-cm-ink hover:bg-cm-teal-50 transition-colors"
                >
                  <span className={currentLang === "de" ? "text-cm-teal-700 font-bold" : "text-cm-ink/50"}>DE</span>
                  <span className="text-cm-ink/30">|</span>
                  <span className={currentLang === "en" ? "text-cm-teal-700 font-bold" : "text-cm-ink/50"}>EN</span>
                </button>
              </div>
              <div className="pt-3">
                <Link
                  href="/kontakt/patient"
                  className="block w-full text-center bg-cm-teal hover:bg-cm-teal-500 text-white px-5 py-3 rounded-full font-medium shadow-md transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  {t("nav.cta")}
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Backdrop behind mobile menu (also closes on tap) */}
      {mobileOpen && (
        <button
          type="button"
          aria-label={t("nav.menuClose")}
          tabIndex={-1}
          onClick={() => setMobileOpen(false)}
          className="lg:hidden fixed inset-0 z-40 bg-black/30 backdrop-blur-[1px] cursor-default"
        />
      )}
    </>
  );
}
