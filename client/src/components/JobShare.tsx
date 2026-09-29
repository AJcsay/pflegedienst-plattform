import { useEffect, useState } from "react";
import { Link2, Share2, Mail, Check } from "lucide-react";
import { toast } from "sonner";
import type { Job } from "@/data/types";
import { jobUrl } from "@/lib/jobs";

/**
 * Teilen-Leiste für eine Stellenanzeige.
 * Reine Links (keine Fremd-Skripte, keine Cookies) – verträgt sich mit CSP und Consent-Banner.
 * Jeder Kanal bekommt UTM-Parameter, damit in der Statistik sichtbar wird, woher Bewerber·innen kommen.
 */
function withUtm(url: string, source: string) {
  const u = new URL(url);
  u.searchParams.set("utm_source", source);
  u.searchParams.set("utm_medium", "social");
  u.searchParams.set("utm_campaign", "stellenanzeige");
  return u.toString();
}

export default function JobShare({ job }: { job: Job }) {
  const url = jobUrl(job);
  const text = `Wir suchen: ${job.title} bei CuraMain in Frankfurt`;
  const [copied, setCopied] = useState(false);
  const [canNativeShare, setCanNativeShare] = useState(false);

  useEffect(() => {
    setCanNativeShare(typeof navigator !== "undefined" && typeof navigator.share === "function");
  }, []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Link kopiert");
      setTimeout(() => setCopied(false), 2500);
    } catch {
      toast.message("Link zum Kopieren", { description: url });
    }
  };

  const nativeShare = async () => {
    try {
      await navigator.share({ title: job.title, text, url: withUtm(url, "native_share") });
    } catch {
      /* abgebrochen – nichts zu tun */
    }
  };

  const channels = [
    { label: "WhatsApp", href: `https://wa.me/?text=${encodeURIComponent(`${text}: ${withUtm(url, "whatsapp")}`)}` },
    { label: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(withUtm(url, "facebook"))}` },
    { label: "LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(withUtm(url, "linkedin"))}` },
  ];

  const btn =
    "inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium border border-cm-teal-100 bg-white text-cm-ink hover:border-cm-teal-300 transition-colors";

  return (
    <div className="flex flex-wrap items-center gap-2" aria-label="Stellenanzeige teilen">
      <button type="button" onClick={copy} className={btn}>
        {copied ? <Check className="w-4 h-4 text-cm-teal" /> : <Link2 className="w-4 h-4 text-cm-teal" />}
        {copied ? "Kopiert" : "Link kopieren"}
      </button>
      {canNativeShare && (
        <button type="button" onClick={nativeShare} className={btn}>
          <Share2 className="w-4 h-4 text-cm-teal" /> Teilen …
        </button>
      )}
      {channels.map((c) => (
        <a key={c.label} href={c.href} target="_blank" rel="noopener noreferrer" className={btn}>
          {c.label}
        </a>
      ))}
      <a
        href={`mailto:?subject=${encodeURIComponent(text)}&body=${encodeURIComponent(`${text}:\n${withUtm(url, "email")}`)}`}
        className={btn}
      >
        <Mail className="w-4 h-4 text-cm-teal" /> E-Mail
      </a>
    </div>
  );
}
