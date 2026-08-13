// Display formatting helpers. Round all displayed numbers (see CLAUDE.md §10).

// Full peso amount with thousands separators, e.g. "₱96,500,000".
export function peso(n: number): string {
  return "₱" + Math.round(n).toLocaleString("en-US");
}

// Compact peso for cards and charts, e.g. "₱6.793T", "₱448B", "₱96.5M".
export function pesoCompact(n: number): string {
  const abs = Math.abs(n);
  if (abs >= 1e12) return "₱" + trim(n / 1e12, 3) + "T";
  if (abs >= 1e9) return "₱" + trim(n / 1e9, 1) + "B";
  if (abs >= 1e6) return "₱" + trim(n / 1e6, 1) + "M";
  if (abs >= 1e3) return "₱" + trim(n / 1e3, 0) + "K";
  return peso(n);
}

// Whole number with separators, e.g. "24,964".
export function count(n: number): string {
  return Math.round(n).toLocaleString("en-US");
}

// ISO date to a short readable form, e.g. "Jun 30, 2024".
export function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function trim(n: number, maxDecimals: number): string {
  return n.toLocaleString("en-US", { maximumFractionDigits: maxDecimals });
}
