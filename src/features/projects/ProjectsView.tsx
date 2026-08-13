import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { projects } from "../../data";
import type { ProjectStatus } from "../../data/types";
import { statusOf } from "../../lib/status";
import { STATUS_META, STATUS_ORDER } from "../../lib/statusMeta";
import { ProjectCard } from "./ProjectCard";

const CATEGORIES = Array.from(new Set(projects.map((p) => p.category))).sort();

export function ProjectsView() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [status, setStatus] = useState<string>("all");

  // Precompute status once per project.
  const withStatus = useMemo(
    () => projects.map((p) => ({ project: p, status: statusOf(p) })),
    [],
  );

  // Only offer statuses that actually occur in the data.
  const presentStatuses = useMemo(() => {
    const set = new Set<ProjectStatus>(withStatus.map((w) => w.status));
    return STATUS_ORDER.filter((s) => set.has(s));
  }, [withStatus]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return withStatus.filter(({ project, status: s }) => {
      if (category !== "all" && project.category !== category) return false;
      if (status !== "all" && s !== status) return false;
      if (q) {
        const hay = (
          project.name +
          " " +
          project.location +
          " " +
          (project.note ?? "")
        ).toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [withStatus, query, category, status]);

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search
            size={16}
            strokeWidth={1.5}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search projects, locations, notes"
            className="w-full rounded-md border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none"
          />
        </div>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          aria-label="Filter by category"
          className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-blue-500 focus:outline-none"
        >
          <option value="all">All categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          aria-label="Filter by status"
          className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-blue-500 focus:outline-none"
        >
          <option value="all">All statuses</option>
          {presentStatuses.map((s) => (
            <option key={s} value={s}>
              {STATUS_META[s].label}
            </option>
          ))}
        </select>
      </div>

      <p className="text-sm text-slate-500">
        {filtered.length} of {projects.length} projects
      </p>

      {filtered.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-200 bg-white px-6 py-12 text-center">
          <p className="text-slate-600">No projects match these filters.</p>
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setCategory("all");
              setStatus("all");
            }}
            className="mt-2 text-sm text-blue-600 hover:underline"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {filtered.map(({ project }) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </section>
  );
}
