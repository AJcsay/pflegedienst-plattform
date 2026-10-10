// KI-Kennzeichnung fuer Fotos (Art. 50 Abs. 4 KI-VO, seit 02.08.2026).
// Regel: 05_Marketing/_Bildarchiv/KI_BILDER_REGEL.md — Kennzeichen im Bild,
// ohne Interaktion sichtbar; EU-Basisicon "AI" + Klartext.
// Der Eltern-Container muss position:relative haben.
type Props = { className?: string };

export default function KiMarke({ className = "top-3 right-3" }: Props) {
  return (
    <span
      className={`cm-ki-marke absolute z-20 ${className}`}
      role="note"
      aria-label="KI-generiertes Symbolbild"
    >
      <span className="cm-ki-ai" aria-hidden="true">AI</span>
      <span aria-hidden="true">KI-generiert</span>
    </span>
  );
}
