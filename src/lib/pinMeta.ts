import type { PinPrecision } from "../data/types";

// Honest labels for what a map pin actually represents (see §7).
export const PIN_META: Record<
  PinPrecision,
  { label: string; hint: string; badge: string; dot: string }
> = {
  exact: {
    label: "Exact site",
    hint: "Pinned on the project location.",
    badge: "bg-green-50 text-green-700 border-green-200",
    dot: "bg-green-500",
  },
  approximate: {
    label: "Approximate area",
    hint: "Near the site at town/barangay level — Street View shows the area, not the exact structure.",
    badge: "bg-amber-50 text-amber-700 border-amber-200",
    dot: "bg-amber-500",
  },
  sample: {
    label: "Sample site",
    hint: "One real reported site; the program itself runs nationwide.",
    badge: "bg-blue-50 text-blue-700 border-blue-200",
    dot: "bg-blue-500",
  },
  office: {
    label: "Agency office",
    hint: "Pinned at the implementing agency's office — this is not a project site.",
    badge: "bg-slate-100 text-slate-600 border-slate-200",
    dot: "bg-slate-400",
  },
};

export function precisionOf(c?: {
  precision?: PinPrecision;
}): PinPrecision {
  return c?.precision ?? "approximate";
}
