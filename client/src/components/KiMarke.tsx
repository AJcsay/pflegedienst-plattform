// KI-Hinweis fuer Fotos (Art. 50 Abs. 4 KI-VO). GF-Entscheid 10.10.2026: auf der
// Webseite nur ein kleines, halbtransparentes "KI" in der Bildecke.
// Der Eltern-Container muss position:relative haben.
type Props = { className?: string };

export default function KiMarke({ className = "bottom-2 right-3" }: Props) {
  return (
    <span
      className={`cm-ki-marke absolute z-20 ${className}`}
      role="note"
      aria-label="KI-generiertes Symbolbild"
    >
      <span aria-hidden="true">KI</span>
    </span>
  );
}
