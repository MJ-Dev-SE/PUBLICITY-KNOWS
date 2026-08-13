import { useState } from "react";
import { Sparkles, ChevronDown, ChevronUp, AlertCircle } from "lucide-react";
import { askLLM, isKeyConfigured, type ChatMessage as LLMMessage } from "../../lib/groq";
import {
  buildSingleProjectContext,
  ANALYSIS_SYSTEM_PROMPT,
} from "../../lib/buildContext";

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

  if (!isKeyConfigured()) {
    return (
      <div className="flex items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-400">
        <Sparkles size={14} className="shrink-0" />
        AI analysis · add <code className="mx-0.5 font-mono text-xs">VITE_GROQ_API_KEY</code> to .env to enable
      </div>
    );
  }

  async function analyze() {
    setState("loading");
    setError("");
    try {
      const context = buildSingleProjectContext(projectId);
      const prompt = `${ANALYSIS_SYSTEM_PROMPT}\n\n${context}`;
      const text = await askLLM(
        prompt,
        [] as LLMMessage[],
        "Analyze this project. Cover: timeline issues, budget utilization, red flags, and people involved with their accountability status. End with a one-sentence civic takeaway.",
      );
      setResult(text);
      setState("done");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
      setState("error");
    }
  }

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
