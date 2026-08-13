import type { Entity } from "../../data/types";
import { projectsOf } from "../../data";
import { AccountabilityBadge } from "../../components/AccountabilityBadge";
import { SourceLinks } from "../../components/SourceLinks";
import { VETTING_META } from "../../lib/vettingMeta";
import { useSelection } from "../linking/SelectionContext";

export function EntityCard({ entity }: { entity: Entity }) {
  const linked = projectsOf(entity);
  const { openEntity, openProject } = useSelection();

  return (
    <article className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-5">
      <header className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-medium">
            <button
              type="button"
              onClick={() => openEntity(entity.id)}
              className="rounded text-left text-slate-900 hover:text-blue-600 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              {entity.name}
            </button>
          </h3>
          <p className="text-sm text-slate-500">{entity.role}</p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1.5">
          <AccountabilityBadge status={entity.status} />
          {entity.track && (
            <span
              className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium ${VETTING_META[entity.track.vetting].badge}`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${VETTING_META[entity.track.vetting].dot}`}
              />
              {VETTING_META[entity.track.vetting].label}
            </span>
          )}
        </div>
      </header>

      <p className="text-sm text-slate-600">{entity.summary}</p>

      {linked.length > 0 && (
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
          <span className="text-slate-400">Linked projects:</span>
          {linked.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => openProject(p.id)}
              className="rounded border border-slate-200 px-2 py-0.5 text-slate-600 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              {p.name}
            </button>
          ))}
        </div>
      )}

      <footer className="mt-auto border-t border-slate-100 pt-3">
        <SourceLinks sources={entity.sources} />
      </footer>
    </article>
  );
}
