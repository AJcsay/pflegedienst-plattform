/**
 * Löscht den Inhalt von dist/public/ vor dem Vite-Build,
 * behält aber .gitkeep (damit Git das leere Verzeichnis trackt).
 * Nötig weil Vite's emptyOutDir auf dem macOS-Mount .gitkeep nicht löschen kann.
 */
import { readdirSync, rmSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST = join(__dirname, "..", "dist", "public");

if (!existsSync(DIST)) {
  console.log("[clean-dist] dist/public/ existiert noch nicht – skip.");
  process.exit(0);
}

const entries = readdirSync(DIST, { withFileTypes: true });
let removed = 0;
for (const entry of entries) {
  if (entry.name === ".gitkeep") continue;
  rmSync(join(DIST, entry.name), { recursive: true, force: true });
  removed++;
}
console.log(`[clean-dist] ${removed} Einträge aus dist/public/ gelöscht (.gitkeep behalten).`);
