import { projects } from "../../data";
import type { Coords, Project } from "../../data/types";
import { statusOf } from "../../lib/status";
import { STATUS_HEX, STATUS_META } from "../../lib/statusMeta";
import { PIN_META, precisionOf } from "../../lib/pinMeta";
import { ProjectsMap } from "./ProjectsMap";

type Located = Project & { coords: Coords };

const located = projects.filter((p): p is Located => Boolean(p.coords));

// Statuses actually present among the pinned projects, for the legend.
const legendStatuses = Array.from(new Set(located.map((p) => statusOf(p))));

// Pin-precision levels actually present, for the honesty legend.
const legendPrecisions = Array.from(
  new Set(located.map((p) => precisionOf(p.coords))),
);

export function MapView() {
  return (
    <section className="space-y-4">
      <div className="rounded-lg border border-slate-200 bg-white p-5">
        <h2 className="text-base font-medium text-slate-900">
          Project locations
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          All 8 tracked projects on the map. <strong>Satellite is the default
          view</strong> — for these projects it is the best way to check whether
          a structure actually exists (it is how the ghost projects were
          exposed). Each pin is labelled by how precise it is; Street View (in a
          pin) only shows the nearby road where Google has driven.
        </p>

        <div className="mt-4 h-[480px] overflow-hidden rounded-md border border-slate-200">
          <ProjectsMap projects={located} />
        </div>

        {/* Status legend */}
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-slate-500">
          {legendStatuses.map((s) => (
            <span key={s} className="inline-flex items-center gap-1.5">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: STATUS_HEX[s] }}
              />
              {STATUS_META[s].label}
            </span>
          ))}
        </div>

        {/* Pin-precision legend (honesty about what each pin means) */}
        <div className="mt-2 border-t border-slate-100 pt-2">
          <p className="mb-1 text-[11px] font-medium text-slate-400">
            Pin precision
          </p>
          <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-slate-500">
            {legendPrecisions.map((p) => (
              <span
                key={p}
                className="inline-flex items-center gap-1.5"
                title={PIN_META[p].hint}
              >
                <span className={`h-2.5 w-2.5 rounded-full ${PIN_META[p].dot}`} />
                {PIN_META[p].label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
