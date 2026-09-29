/**
 * CuraMain – Vorschaubilder (1200×630) für Stellenanzeigen erzeugen.
 *
 * Für jede aktive Stelle in client/src/data/jobs.json mit Feld "ogImage" wird ein
 * Bild in CuraMain-Optik gerendert (Foto links, Teal-Fläche mit Titel rechts) und unter
 * client/public/<ogImage> abgelegt. Diese Bilder zeigen Facebook, LinkedIn, WhatsApp & Co.
 * als Vorschau, wenn der Link /karriere/<slug>/ geteilt wird.
 *
 * NICHT Teil von `build` – nur bei neuer oder geänderter Stelle ausführen:
 *   node scripts/build-job-og-images.mjs
 * Voraussetzung: Playwright-Chromium (devDependency @playwright/test).
 * Chromium-Pfad optional über PW_CHROMIUM=/pfad/zu/chromium.
 */
import { readFileSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { chromium } from "@playwright/test";
import { jobTypeLabel } from "../client/src/lib/job-seo.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const PUBLIC = join(ROOT, "client", "public");
const jobs = JSON.parse(readFileSync(join(ROOT, "client", "src", "data", "jobs.json"), "utf8")).jobs;

/** Foto je Stelle (liegt in client/public/img). */
/** Foto je Stelle (liegt in client/public/img) und horizontaler Bildausschnitt in %. */
const PHOTO = {
  "pflegefachperson-vollzeit": ["img/behandlung.webp", 50],
  "pflegefachperson-teilzeit": ["img/grundpflege.webp", 50],
  pflegeassistenz: ["img/aktivierung.webp", 50],
  "haushaltshilfe-reinigungskraft": ["img/hauswirtschaft.webp", 58],
};

const font = (p) => pathToFileURL(join(ROOT, "node_modules", p)).href;
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function html(job) {
  const [photoFile, photoX] = PHOTO[job.slug] || ["img/team.webp", 50];
  const photo = pathToFileURL(join(PUBLIC, photoFile)).href;
  const logo = pathToFileURL(join(PUBLIC, "img", "logo-transparent.png")).href;
  const title = job.title.replace(/\s*m\/w\/d\s*$/, "");
  // Festes Eintrittsdatum nicht ins Bild backen – es veraltet, das Bild bleibt. Nur „ab sofort“ zeigen.
  const facts = [jobTypeLabel(job), job.location, job.startDate === "sofort" ? "ab sofort" : null].filter(Boolean);
  return `<!doctype html><html lang="de"><head><meta charset="utf-8"><style>
@font-face{font-family:Corm;src:url(${font("@fontsource/cormorant-garamond/files/cormorant-garamond-latin-600-normal.woff2")})}
@font-face{font-family:Inter;src:url(${font("@fontsource-variable/inter/files/inter-latin-wght-normal.woff2")});font-weight:100 900}
*{margin:0;padding:0;box-sizing:border-box}
body{width:1200px;height:630px;display:flex;font-family:Inter,sans-serif;overflow:hidden;background:#fbf7f1}
.photo{width:540px;height:630px;background:url(${photo}) ${photoX}% center/cover no-repeat}
.panel{flex:1;height:630px;padding:48px 56px 44px;display:flex;flex-direction:column;color:#fff;
  background:linear-gradient(160deg,#0b8286 0%,#086b6f 55%,#0a4f52 100%)}
.top{display:flex;align-items:center;gap:16px}
.top img{height:58px;background:#fff;border-radius:14px;padding:6px 10px}
.brand{font-size:15px;font-weight:600;letter-spacing:.16em;text-transform:uppercase;opacity:.9}
.kicker{margin-top:auto;font-size:18px;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:#4ed6db}
h1{font-family:Corm,serif;font-weight:600;font-size:60px;line-height:1.02;margin:12px 0 8px}
.mwd{font-size:22px;opacity:.85;margin-bottom:26px}
.facts{display:flex;flex-wrap:wrap;gap:10px}
.facts span{font-size:19px;font-weight:500;padding:8px 16px;border-radius:999px;background:rgba(255,255,255,.14);border:1px solid rgba(255,255,255,.28)}
.foot{margin-top:auto;padding-top:26px;font-size:20px;font-weight:600;display:flex;justify-content:space-between;opacity:.95}
</style></head><body>
<div class="photo"></div>
<div class="panel">
  <div class="top"><img src="${logo}" alt=""><span class="brand">CuraMain · Pflege und Teilhabe</span></div>
  <div class="kicker">Wir suchen Sie</div>
  <h1>${esc(title)}</h1>
  <div class="mwd">(m/w/d)</div>
  <div class="facts">${facts.map((f) => `<span>${esc(f)}</span>`).join("")}</div>
  <div class="foot"><span>curamain.de/karriere</span><span>069 / 79 216 147</span></div>
</div></body></html>`;
}

const browser = await chromium.launch(process.env.PW_CHROMIUM ? { executablePath: process.env.PW_CHROMIUM } : {});
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
let n = 0;
for (const job of jobs.filter((j) => j.active && j.ogImage)) {
  const out = join(PUBLIC, job.ogImage.replace(/^\//, ""));
  mkdirSync(dirname(out), { recursive: true });
  // Über eine temporäre Datei laden – file://-Bilder und -Schriften werden von about:blank aus blockiert
  const tmp = join(tmpdir(), `curamain-og-${job.slug}.html`);
  writeFileSync(tmp, html(job), "utf8");
  await page.goto(pathToFileURL(tmp).href, { waitUntil: "load" });
  rmSync(tmp);
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: out, type: "jpeg", quality: 88 });
  console.log(`[og] ${job.slug} → ${out.replace(ROOT + "/", "")}`);
  n++;
}
await browser.close();
console.log(`[og] ${n} Vorschaubilder erzeugt.`);
