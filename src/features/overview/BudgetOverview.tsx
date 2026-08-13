import { lazy, Suspense } from "react";
import { Banknote, FolderOpen, Flag } from "lucide-react";
import { projects } from "../../data";
import { NATIONAL_BUDGET_2026 } from "../../data/budget";
import { isFlagged } from "../../lib/status";
import { count, pesoCompact } from "../../lib/format";
import { MetricCard } from "./MetricCard";

// Lazy-load the chart so recharts (a large dependency) stays out of the
// initial bundle and only loads when the overview is shown.
const SectorChart = lazy(() =>
  import("./SectorChart").then((m) => ({ default: m.SectorChart })),
);

export function BudgetOverview() {
  const flaggedCount = projects.filter((p) => isFlagged(p)).length;

  return (
    <section className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <MetricCard
          label="2026 national budget"
          value={pesoCompact(NATIONAL_BUDGET_2026)}
          sub="RA 12314, signed Jan 5, 2026"
          icon={<Banknote size={16} strokeWidth={1.5} />}
        />
        <MetricCard
          label="Projects tracked"
          value={count(projects.length)}
          sub="In this civic-education sample"
          icon={<FolderOpen size={16} strokeWidth={1.5} />}
        />
        <MetricCard
          label="Flagged projects"
          value={count(flaggedCount)}
          sub="Stalled, overdue, misreported, or ghost"
          icon={<Flag size={16} strokeWidth={1.5} />}
          tone="alert"
        />
      </div>

      <Suspense
        fallback={
          <div className="h-96 animate-pulse rounded-lg border border-slate-200 bg-white" />
        }
      >
        <SectorChart />
      </Suspense>
    </section>
  );
}
