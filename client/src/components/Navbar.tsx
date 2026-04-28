import { useState } from "react";
import { Link, useLocation } from "wouter";
import {
  Heart, Menu, X, ChevronDown,
  Briefcase, Building2,
} from "lucide-react";

const navGroups = [
  {
    label: "Für Patienten",
    icon: Heart,
    items: [
      { label: "Unsere Leistungen", href: "/leistungen" },
      { label: "Häufige Fragen", href: "/faq" },
      { label: "Erstberatung anfordern", href: "/kontakt/patient" },
    ],
  },
  {
    label: "Für Bewerber",
    icon: Briefcase,
    items: [
      { label: "Stellenangebote", href: "/karriere" },
      { label: "Schnellbewerbung", href: "/karriere/bewerbung" },
      { label: "Benefits & Vorteile", href: "/karriere#benefits" },
    ],
  },
  {
    label: "Für Partner",
    icon: Building2,
    items: [
      { label: "Ärzte & Kliniken", href: "/partner/zuweiser" },
      { label: "Kapazitätsabfrage", href: "/partner/kapazitaet" },
      { label: "Krankenkassen", href: "/partner/kassen" },
      { label: "Dokumente", href: "/partner/dokumente" },
    ],
  },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [location] = useLocation();

  const isActive = (href: string) => location === href;

  return (
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
            Startseite
          </Link>
          <Link
            href="/ueber-uns"
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
              isActive("/ueber-uns") ? "bg-cm-teal text-white" : "text-cm-ink hover:bg-cm-teal-50"
            }`}
          >
            Über uns
          </Link>

          {navGroups.map((group) => {
            const groupActive = group.items.some((i) => isActive(i.href));
            return (
              <div
                key={group.label}
                className="relative"
                onMouseEnter={() => setOpenDropdown(group.label)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <button
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                    groupActive || openDropdown === group.label
                      ? "bg-cm-teal text-white"
                      : "text-cm-ink hover:bg-cm-teal-50"
                  }`}
                >
                  <group.icon className="h-4 w-4" />
                  {group.label}
                  <ChevronDown
                    className={`h-3.5 w-3.5 transition-transform ${
                      openDropdown === group.label ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openDropdown === group.label && (
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

        {/* CTA + Mobile toggle */}
        <div className="flex items-center gap-2 ml-auto">
          <Link
            href="/kontakt/patient"
            className="hidden md:inline-flex bg-cm-teal hover:bg-cm-teal-500 text-white px-5 py-2.5 rounded-full text-sm font-medium shadow-md whitespace-nowrap transition-colors"
          >
            Kostenlose Erstberatung
          </Link>
          <button
            className="lg:hidden p-2 rounded-full hover:bg-cm-teal-50 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Menü schließen" : "Menü öffnen"}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="lg:hidden glass mt-2 rounded-3xl shadow-lg border border-white/40 p-4">
          <div className="space-y-1">
            <Link
              href="/"
              className="block px-4 py-2.5 text-sm font-medium rounded-full hover:bg-cm-teal-50"
              onClick={() => setMobileOpen(false)}
            >
              Startseite
            </Link>
            <Link
              href="/ueber-uns"
              className="block px-4 py-2.5 text-sm font-medium rounded-full hover:bg-cm-teal-50"
              onClick={() => setMobileOpen(false)}
            >
              Über uns
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
            <div className="pt-3">
              <Link
                href="/kontakt/patient"
                className="block w-full text-center bg-cm-teal hover:bg-cm-teal-500 text-white px-5 py-3 rounded-full font-medium shadow-md transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                Kostenlose Erstberatung
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
