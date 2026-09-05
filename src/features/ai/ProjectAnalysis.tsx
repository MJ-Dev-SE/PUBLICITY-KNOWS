import { useState } from "react";
import { Sparkles, ChevronDown, ChevronUp, AlertCircle } from "lucide-react";
import { askAnalysis } from "../../lib/ai";
import { useAiEnabled } from "../../lib/useAiEnabled";

interface Props {
  projectId: string;
}

export function ProjectAnalysis({ projectId }: Props) {
  const [state, setState] = useState<
    "idle" | "loading" | "done" | "error"
  >("idle");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState(true);
  const aiEnabled = useAiEnabled();

  async function analyze() {
    setState("loading");
    setError("");
    try {
      const text = await askAnalysis(projectId);
      setResult(text);
      setState("done");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
      setState("error");
    }
  }

  if (!aiEnabled) return null;

  return (
    <div className="rounded-md border border-slate-200 bg-slate-50">
      {state === "idle" && (
        <button
          type="button"
          onClick={analyze}
          className="flex w-full items-center gap-2 px-3 py-2.5 text-sm text-slate-600 hover:bg-slate-100 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          <Sparkles size={14} className="text-violet-500 shrink-0" />
          Ask AI to analyze this project
        </button>
      )}

      {state === "loading" && (
        <div className="flex items-center gap-2 px-3 py-2.5 text-sm text-slate-500">
          <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-violet-400 border-t-transparent" />
          Analyzing…
        </div>
      )}

      {state === "error" && (
        <div className="px-3 py-2.5">
          <div className="flex items-start gap-2 text-sm text-red-600">
            <AlertCircle size={14} className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={() => setState("idle")}
            className="mt-1.5 text-xs text-slate-500 underline"
          >
            Try again
          </button>
        </div>
      )}

      {state === "done" && (
        <div>
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="flex w-full items-center justify-between gap-2 px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-t-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            <span className="flex items-center gap-2">
              <Sparkles size={14} className="text-violet-500 shrink-0" />
              AI analysis
            </span>
            {expanded ? (
              <ChevronUp size={14} className="text-slate-400" />
            ) : (
              <ChevronDown size={14} className="text-slate-400" />
            )}
          </button>

          {expanded && (
            <div className="border-t border-slate-200 px-3 py-3">
              <p className="whitespace-pre-wrap text-xs leading-relaxed text-slate-600">
                {result}
              </p>
              <p className="mt-2 text-[10px] text-slate-400">
                AI-generated · civic education only · not legal advice
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
