interface ProgressBarProps {
  value: number; // 0–100
  barClass?: string; // fill color class, defaults to blue
}

export function ProgressBar({ value, barClass = "bg-blue-600" }: ProgressBarProps) {
  const pct = Math.max(0, Math.min(100, Math.round(value)));
  return (
    <div
      className="h-2 w-full overflow-hidden rounded-full bg-slate-100"
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className={"h-full rounded-full " + barClass}
        style={{ width: pct + "%" }}
      />
    </div>
  );
}
