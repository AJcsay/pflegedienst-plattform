interface Props {
  checked: boolean;
  onChange: (v: boolean) => void;
  id?: string;
}

/**
 * DSGVO-Einwilligung – wird unter jedem Lead-Formular angezeigt.
 * Pflichtfeld; Form sollte bei !checked nicht abschicken.
 */
export default function ConsentCheckbox({ checked, onChange, id = "consent" }: Props) {
  return (
    <label htmlFor={id} className="flex items-start gap-3 text-sm text-cm-ink/80 leading-relaxed">
      <input
        id={id}
        type="checkbox"
        required
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-1 w-5 h-5 rounded border-cm-teal-300 text-cm-teal-700 focus:ring-2 focus:ring-cm-teal-300"
      />
      <span>
        Ich habe die{" "}
        <a href="/datenschutz" className="underline hover:text-cm-teal-700">
          Datenschutzhinweise
        </a>{" "}
        gelesen und bin einverstanden, dass meine Angaben zur Bearbeitung dieser Anfrage verarbeitet werden. <span aria-hidden="true">*</span>
      </span>
    </label>
  );
}
