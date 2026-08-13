import { ExternalLink } from "lucide-react";
import type { Source } from "../data/types";

export function SourceLinks({ sources }: { sources: Source[] }) {
  if (sources.length === 0) return null;
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
      <span className="text-slate-400">Sources:</span>
      {sources.map((s) => (
        <a
          key={s.url}
          href={s.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-blue-600 hover:underline"
        >
          {s.outlet}
          <ExternalLink size={12} strokeWidth={1.5} />
        </a>
      ))}
    </div>
  );
}
