import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { entities } from "../../data";
import type { EntityKind } from "../../data/types";
import { KIND_LABEL, KIND_ORDER } from "../../lib/accountabilityMeta";
import { Disclaimer } from "./Disclaimer";
import { EntityCard } from "./EntityCard";

export function AccountabilityView() {
  const [query, setQuery] = useState("");
  const [kind, setKind] = useState<string>("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return entities.filter((e) => {
      if (kind !== "all" && e.kind !== kind) return false;
      if (q) {
        const hay = (e.name + " " + e.role + " " + e.summary).toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [query, kind]);

  const kindsToShow: EntityKind[] =
    kind === "all" ? KIND_ORDER : [kind as EntityKind];

  return (
    <section className="space-y-6">
      <Disclaimer />

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
            placeholder="Search people, roles, status"
            className="w-full rounded-md border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none"
          />
        </div>

        <select
          value={kind}
          onChange={(e) => setKind(e.target.value)}
          aria-label="Filter by type"
          className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-blue-500 focus:outline-none"
        >
          <option value="all">All types</option>
          {KIND_ORDER.map((k) => (
            <option key={k} value={k}>
              {KIND_LABEL[k]}
            </option>
          ))}
        </select>
      </div>

      <p className="text-sm text-slate-500">
        {filtered.length} of {entities.length} people and organizations
      </p>

      {filtered.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-200 bg-white px-6 py-12 text-center">
          <p className="text-slate-600">No one matches these filters.</p>
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setKind("all");
            }}
            className="mt-2 text-sm text-blue-600 hover:underline"
          >
            Clear filters
          </button>
        </div>
      ) : (
        kindsToShow.map((k) => {
          const group = filtered.filter((e) => e.kind === k);
          if (group.length === 0) return null;
          return (
            <div key={k} className="space-y-3">
              <h2 className="text-sm font-medium text-slate-500">
                {KIND_LABEL[k]}
                <span className="ml-1.5 text-slate-400">({group.length})</span>
              </h2>
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                {group.map((e) => (
                  <EntityCard key={e.id} entity={e} />
                ))}
              </div>
            </div>
          );
        })
      )}
    </section>
  );
}
