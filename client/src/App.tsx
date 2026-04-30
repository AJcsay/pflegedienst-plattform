import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import NotFound from "@/pages/NotFound";
import { Route, Switch, useLocation } from "wouter";
import { useEffect } from "react";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Leistungen from "./pages/Leistungen";
import FAQ from "./pages/FAQ";
import Testimonials from "./pages/Testimonials";
import KontaktPatient from "./pages/KontaktPatient";
import NordendOst from "./pages/NordendOst";
import Bornheim from "./pages/Bornheim";
import Ostend from "./pages/Ostend";
import UeberUns from "./pages/UeberUns";
import Karriere from "./pages/Karriere";
import Bewerbung from "./pages/Bewerbung";
import PartnerZuweiser from "./pages/PartnerZuweiser";
import PartnerKapazitaet from "./pages/PartnerKapazitaet";
import PartnerKassen from "./pages/PartnerKassen";
import PartnerDokumente from "./pages/PartnerDokumente";
import Impressum from "./pages/Impressum";
import Datenschutz from "./pages/Datenschutz";

function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="pt-24">{children}</main>
      <Footer />
    </>
  );
}

function HashScrollHandler() {
  const [location] = useLocation();

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (!hash) return;

    let attempts = 0;
    const maxAttempts = 20;

    const scrollToHash = () => {
      const element = document.getElementById(hash);
      if (!element) {
        if (attempts < maxAttempts) {
          attempts++;
          setTimeout(scrollToHash, 100);
        }
        return;
      }

      const navbarHeight = 80;
      const rect = element.getBoundingClientRect();
      const scrollTop = window.scrollY + rect.top - navbarHeight;
      window.scrollTo({ top: scrollTop, behavior: "smooth" });
    };

    setTimeout(scrollToHash, 100);
  }, [location]);

  return null;
}

function Router() {
  return (
    <Switch>
      {/* Public pages */}
      <Route path="/">{() => <PublicLayout><Home /></PublicLayout>}</Route>
      <Route path="/leistungen">{() => <PublicLayout><Leistungen /></PublicLayout>}</Route>
      <Route path="/pflege/nordend-ost">{() => <PublicLayout><NordendOst /></PublicLayout>}</Route>
      <Route path="/pflege/bornheim">{() => <PublicLayout><Bornheim /></PublicLayout>}</Route>
      <Route path="/pflege/ostend">{() => <PublicLayout><Ostend /></PublicLayout>}</Route>
      <Route path="/faq">{() => <PublicLayout><FAQ /></PublicLayout>}</Route>
      <Route path="/testimonials">{() => <PublicLayout><Testimonials /></PublicLayout>}</Route>
      <Route path="/kontakt/patient">{() => <PublicLayout><KontaktPatient /></PublicLayout>}</Route>
      <Route path="/ueber-uns">{() => <PublicLayout><UeberUns /></PublicLayout>}</Route>

      {/* Career */}
      <Route path="/karriere">{() => <PublicLayout><Karriere /></PublicLayout>}</Route>
      <Route path="/bewerbung">{() => <PublicLayout><Bewerbung /></PublicLayout>}</Route>
      <Route path="/karriere/bewerbung">{() => <PublicLayout><Bewerbung /></PublicLayout>}</Route>

      {/* Partners */}
      <Route path="/partner/zuweiser">{() => <PublicLayout><PartnerZuweiser /></PublicLayout>}</Route>
      <Route path="/partner/kapazitaet">{() => <PublicLayout><PartnerKapazitaet /></PublicLayout>}</Route>
      <Route path="/partner/kassen">{() => <PublicLayout><PartnerKassen /></PublicLayout>}</Route>
      <Route path="/partner/dokumente">{() => <PublicLayout><PartnerDokumente /></PublicLayout>}</Route>

      {/* Legal pages */}
      <Route path="/impressum">{() => <PublicLayout><Impressum /></PublicLayout>}</Route>
      <Route path="/datenschutz">{() => <PublicLayout><Datenschutz /></PublicLayout>}</Route>

      <Route path="/404">{() => <PublicLayout><NotFound /></PublicLayout>}</Route>
      <Route>{() => <PublicLayout><NotFound /></PublicLayout>}</Route>
    </Switch>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <HashScrollHandler />
          <Router />
          <Toaster richColors position="top-right" />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
