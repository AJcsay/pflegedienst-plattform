import { createRoot } from "react-dom/client";
import App from "./App";
// i18n – muss vor App-Render initialisiert sein
import "./i18n/index";
// Self-hosted fonts (DSGVO-konform, kein Google-CDN-Request).
import "@fontsource-variable/inter/index.css";
import "@fontsource/cormorant-garamond/400.css";
import "@fontsource/cormorant-garamond/500.css";
import "@fontsource/cormorant-garamond/600.css";
import "./index.css";

const rootEl = document.getElementById("root");
if (!rootEl) {
  throw new Error("Root element #root not found");
}

createRoot(rootEl).render(<App />);
