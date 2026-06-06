/**
 * CuraMain – Statisches Prerendering nach dem Vite-Build.
 *
 * Für jede Route aus prerender-routes.mjs wird die gebaute dist/public/index.html
 * geklont und mit route-spezifischen Meta-Tags (Title, Description, Canonical,
 * Open Graph, Twitter) versehen unter dist/public/<route>/index.html abgelegt.
 * So liefert der statische All-Inkl-Host für jede URL bereits im initialen HTML
 * die korrekten Metadaten – auch für Crawler/Scraper ohne JavaScript-Rendering.
 * Die React-App übernimmt anschließend wie gewohnt (useSEO setzt identische Werte).
 *
 * Zusätzlich wird dist/public/sitemap.xml aus derselben Route-Map erzeugt.
 *
 * Aufruf: automatisch via `npm run build` (vite build && node scripts/prerender.mjs).
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { routes } from "./prerender-routes.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
// DIST kann für Tests via PRERENDER_DIST überschrieben werden; Standard = dist/public.
const DIST = process.env.PRERENDER_DIST || join(__dirname, "..", "dist", "public");
const ORIGIN = "https://www.curamain.de";

const escAttr = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const escHtml = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function setTitle(html, title) {
  return html.replace(/<title>[\s\S]*?<\/title>/, `<title>${escHtml(title)}</title>`);
}
function setMetaName(html, name, content) {
  const tag = `<meta name="${name}" content="${escAttr(content)}" />`;
  const re = new RegExp(`<meta name="${name}"[^>]*>`);
  return re.test(html) ? html.replace(re, tag) : html.replace("</head>", `    ${tag}\n  </head>`);
}
function setMetaProp(html, prop, content) {
  const tag = `<meta property="${prop}" content="${escAttr(content)}" />`;
  const re = new RegExp(`<meta property="${prop}"[^>]*>`);
  return re.test(html) ? html.replace(re, tag) : html.replace("</head>", `    ${tag}\n  </head>`);
}
function setCanonical(html, href) {
  const tag = `<link rel="canonical" href="${escAttr(href)}" />`;
  return /<link rel="canonical"[^>]*>/.test(html)
    ? html.replace(/<link rel="canonical"[^>]*>/, tag)
    : html.replace("</head>", `    ${tag}\n  </head>`);
}

let template;
try {
  template = readFileSync(join(DIST, "index.html"), "utf8");
} catch {
  console.error("[prerender] dist/public/index.html nicht gefunden – bitte zuerst `vite build` ausführen.");
  process.exit(1);
}

let written = 0;
for (const r of routes) {
  const canonical = r.canonical || ORIGIN + (r.path === "/" ? "/" : r.path);
  let html = template;
  html = setTitle(html, r.title);
  html = setMetaName(html, "description", r.description);
  if (r.keywords) html = setMetaName(html, "keywords", r.keywords);
  html = setCanonical(html, canonical);
  html = setMetaProp(html, "og:title", r.title);
  html = setMetaProp(html, "og:description", r.description);
  html = setMetaProp(html, "og:url", canonical);
  html = setMetaName(html, "twitter:title", r.title);
  html = setMetaName(html, "twitter:description", r.description);

  const outPath =
    r.path === "/" ? join(DIST, "index.html") : join(DIST, r.path.replace(/^\//, ""), "index.html");
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, html, "utf8");
  written++;
}

// sitemap.xml aus derselben Route-Map (inSitemap !== false)
const today = new Date().toISOString().slice(0, 10);
const urls = routes
  .filter((r) => r.inSitemap !== false)
  .map((r) => {
    const loc = r.canonical || ORIGIN + (r.path === "/" ? "/" : r.path);
    const priority = r.priority || "0.6";
    return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
  })
  .join("\n");
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
writeFileSync(join(DIST, "sitemap.xml"), sitemap, "utf8");

console.log(`[prerender] ${written} Routen gerendert, sitemap.xml mit ${routes.filter((r) => r.inSitemap !== false).length} URLs (lastmod ${today}).`);
