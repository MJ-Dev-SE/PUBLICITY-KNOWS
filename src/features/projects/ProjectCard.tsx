import { Users } from "lucide-react";
import type { Project } from "../../data/types";
import { statusOf } from "../../lib/status";
import { STATUS_META } from "../../lib/statusMeta";
import { formatDate, peso, pesoCompact } from "../../lib/format";
import { StatusBadge, MisreportedBadge } from "../../components/StatusBadge";
import { ProgressBar } from "../../components/ProgressBar";
import { SourceLinks } from "../../components/SourceLinks";
import { useSelection } from "../linking/SelectionContext";

export function ProjectCard({ project }: { project: Project }) {
  const status = statusOf(project);
  const meta = STATUS_META[status];
  const { openProject } = useSelection();
  const peopleCount = project.peopleIds.length;

  return (
    <article className="flex flex-col gap-4 rounded-lg border border-slate-200 bg-white p-5">
      <header className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-medium">
            <button
              type="button"
              onClick={() => openProject(project.id)}
              className="rounded text-left text-slate-900 hover:text-blue-600 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              {project.name}
            </button>
          </h3>
          <p className="text-sm text-slate-500">{project.location}</p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1.5">
          <StatusBadge status={status} />
          {project.misreported && <MisreportedBadge />}
        </div>
      </header>

      <div className="flex items-center gap-2 text-xs text-slate-500">
        <span className="rounded border border-slate-200 px-2 py-0.5">
          {project.category}
        </span>
        {peopleCount > 0 && (
          <button
            type="button"
            onClick={() => openProject(project.id)}
            className="inline-flex items-center gap-1 rounded px-2 py-0.5 text-blue-600 hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            <Users size={13} strokeWidth={1.5} />
            {peopleCount} {peopleCount === 1 ? "person" : "people"} involved
          </button>
        )}
      </div>

      <div>
        <div className="mb-1 flex items-center justify-between text-xs text-slate-500">
          <span>Progress</span>
          <span>{Math.round(project.progress)}%</span>
        </div>
        <ProgressBar value={project.progress} barClass={meta.bar} />
      </div>

      <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
        <div>
          <dt className="text-xs text-slate-400">Allocated</dt>
          <dd className="text-slate-900">{pesoCompact(project.allocated)}</dd>
        </div>
        <div>
          <dt className="text-xs text-slate-400">Spent</dt>
          <dd className="text-slate-900">{pesoCompact(project.spent)}</dd>
        </div>
        <div>
          <dt className="text-xs text-slate-400">Proposed timeline</dt>
          <dd className="text-slate-700">
            {formatDate(project.proposedStart)} – {formatDate(project.proposedEnd)}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-slate-400">Actual start</dt>
          <dd className="text-slate-700">
            {project.actualStart ? formatDate(project.actualStart) : "Not started"}
          </dd>
        </div>
      </dl>

      {project.note && (
        <p className="rounded-md bg-slate-50 px-3 py-2 text-sm text-slate-600">
          {project.note}
        </p>
      )}

      <footer className="mt-auto border-t border-slate-100 pt-3">
        <SourceLinks sources={project.sources} />
      </footer>

      <span className="sr-only">Full allocated amount: {peso(project.allocated)}</span>
    </article>
  );
}
