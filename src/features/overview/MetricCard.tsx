import type { ReactNode } from "react";

interface MetricCardProps {
  label: string;
  value: string;
  sub?: string;
  icon?: ReactNode;
  // Optional accent for the value (e.g. flagged count in red). Defaults to slate.
  tone?: "default" | "alert";
}

export function MetricCard({
  label,
  value,
  sub,
  icon,
  tone = "default",
}: MetricCardProps) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5">
      <div className="flex items-center gap-2 text-slate-500">
        {icon}
        <span className="text-sm">{label}</span>
      </div>
      <div
        className={
          "mt-2 text-3xl font-medium " +
          (tone === "alert" ? "text-red-600" : "text-slate-900")
        }
      >
        {value}
      </div>
      {sub && <p className="mt-1 text-sm text-slate-500">{sub}</p>}
    </div>
  );
}
