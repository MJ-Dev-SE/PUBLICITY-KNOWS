import type { ProjectStatus } from "../data/types";
import { STATUS_META } from "../lib/statusMeta";

export function StatusBadge({ status }: { status: ProjectStatus }) {
  const meta = STATUS_META[status];
  return (
    <span
      className={
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs " +
        meta.badge
      }
    >
      <span className={"h-1.5 w-1.5 rounded-full " + meta.dot} />
      {meta.label}
    </span>
  );
}

// Neutral chip for the "misreported" flag (distinct from status).
export function MisreportedBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-orange-200 bg-orange-50 px-2.5 py-0.5 text-xs text-orange-700">
      Misreported
    </span>
  );
}
