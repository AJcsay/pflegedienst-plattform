import { Calendar, Clock, MapPin, Euro, ClipboardList, GraduationCap, Gift, CheckCircle2 } from "lucide-react";
import type { Job } from "@/data/types";

/**
 * Vollständiger Anzeigentext einer Stelle (Eckdaten, Einleitung, Aufgaben, Profil, Angebot).
 * Genutzt von der Stellenseite /karriere/<slug>/.
 */
export default function JobPostingContent({ job }: { job: Job }) {
  return (
    <>
      {/* Eckdaten */}
      <div className="grid sm:grid-cols-2 gap-3 mb-8 p-5 rounded-2xl bg-cm-teal-50/60 border border-cm-teal-100">
        {job.startDate && (
          <div className="flex items-start gap-2 text-sm text-cm-ink">
            <Calendar className="w-4 h-4 text-cm-teal mt-0.5 shrink-0" />
            <span><strong className="font-semibold">Eintritt:</strong> ab {job.startDate}</span>
          </div>
        )}
        {job.scope && (
          <div className="flex items-start gap-2 text-sm text-cm-ink">
            <Clock className="w-4 h-4 text-cm-teal mt-0.5 shrink-0" />
            <span><strong className="font-semibold">Umfang:</strong> {job.scope}</span>
          </div>
        )}
        {job.location && (
          <div className="flex items-start gap-2 text-sm text-cm-ink">
            <MapPin className="w-4 h-4 text-cm-teal mt-0.5 shrink-0" />
            <span><strong className="font-semibold">Standort:</strong> {job.location}</span>
          </div>
        )}
        {job.salary && (
          <div className="flex items-start gap-2 text-sm text-cm-ink">
            <Euro className="w-4 h-4 text-cm-teal mt-0.5 shrink-0" />
            <span><strong className="font-semibold">Vergütung:</strong> {job.salary}</span>
          </div>
        )}
      </div>

      {job.intro && <p className="text-cm-ink/80 text-lg leading-relaxed mb-8">{job.intro}</p>}

      <Section title="Ihre Aufgaben" icon={ClipboardList} items={job.tasks} />
      <Section title="Ihr Profil" icon={GraduationCap} items={job.profile} />
      <Section title="Das bieten wir Ihnen" icon={Gift} items={job.offer} />
    </>
  );
}

function Section({
  title,
  icon: Icon,
  items,
}: {
  title: string;
  icon: typeof ClipboardList;
  items?: string[];
}) {
  if (!items || items.length === 0) return null;
  return (
    <div className="mb-8">
      <h2 className="flex items-center gap-2 text-xl font-semibold text-cm-ink mb-4">
        <Icon className="w-5 h-5 text-cm-teal" /> {title}
      </h2>
      <ul className="space-y-2.5">
        {items.map((t, i) => (
          <li key={i} className="flex items-start gap-2.5 text-cm-ink/80 leading-relaxed">
            <CheckCircle2 className="w-4 h-4 text-cm-teal mt-1 shrink-0" />
            <span>{t}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
