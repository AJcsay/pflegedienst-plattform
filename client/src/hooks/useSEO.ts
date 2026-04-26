import { useEffect } from "react";

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  canonical?: string;
  /** Vollständige URL eines Teaser-Bildes (1200×630 empfohlen). Fällt auf globales OG-Image zurück. */
  image?: string;
  /** true verhindert Indexierung dieser einzelnen Seite (z. B. 404 / Admin) */
  noindex?: boolean;
}

const DEFAULT_TITLE =
  "CuraMain – Ambulanter Pflegedienst im Rhein-Main-Gebiet";
const DEFAULT_IMAGE = "https://www.curamain.de/og-image.jpg";

/** Meta-Tag per Attribute upserten; gibt das Element zurück. */
function upsertMeta(
  selector: string,
  attr: "name" | "property",
  attrValue: string,
  content: string,
): HTMLMetaElement {
  let el = document.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, attrValue);
    document.head.appendChild(el);
  }
  el.content = content;
  return el;
}

function upsertLink(rel: string, href: string): HTMLLinkElement {
  let el = document.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.rel = rel;
    document.head.appendChild(el);
  }
  el.href = href;
  return el;
}

/**
 * Setzt seitenspezifische SEO-Meta-Tags (Title, Description, OG, Twitter, Canonical, Robots).
 * Title 30–60 Zeichen, Description 50–160 Zeichen empfohlen.
 *
 * WICHTIG: Bei einer Single-Page-App reicht das nur für Nutzer-Interaktion und moderne Crawler.
 * Für optimale SEO zusätzlich Prerendering/SSR einplanen (siehe REPORT.md).
 */
export function useSEO({
  title,
  description,
  keywords,
  canonical,
  image,
  noindex,
}: SEOProps) {
  useEffect(() => {
    const imageUrl = image || DEFAULT_IMAGE;

    document.title = title;

    upsertMeta('meta[name="description"]', "name", "description", description);

    if (keywords) {
      upsertMeta('meta[name="keywords"]', "name", "keywords", keywords);
    }

    // Open Graph
    upsertMeta('meta[property="og:title"]', "property", "og:title", title);
    upsertMeta(
      'meta[property="og:description"]',
      "property",
      "og:description",
      description,
    );
    upsertMeta('meta[property="og:image"]', "property", "og:image", imageUrl);
    if (canonical) {
      upsertMeta('meta[property="og:url"]', "property", "og:url", canonical);
    }

    // Twitter Card
    upsertMeta(
      'meta[name="twitter:title"]',
      "name",
      "twitter:title",
      title,
    );
    upsertMeta(
      'meta[name="twitter:description"]',
      "name",
      "twitter:description",
      description,
    );
    upsertMeta(
      'meta[name="twitter:image"]',
      "name",
      "twitter:image",
      imageUrl,
    );

    // Canonical
    if (canonical) {
      upsertLink("canonical", canonical);
    }

    // Robots (nur anfassen wenn explizit gewünscht — sonst bleibt der Wert aus index.html bestehen)
    if (noindex) {
      upsertMeta(
        'meta[name="robots"]',
        "name",
        "robots",
        "noindex, nofollow",
      );
    }

    return () => {
      // Basis-Zustand wiederherstellen, falls keine Folgeseite selbst setSEO aufruft
      document.title = DEFAULT_TITLE;
      if (noindex) {
        upsertMeta('meta[name="robots"]', "name", "robots", "index, follow");
      }
    };
  }, [title, description, keywords, canonical, image, noindex]);
}
