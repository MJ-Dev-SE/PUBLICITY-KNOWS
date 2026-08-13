import type { ProjectOutcome, VettingSignal } from "../data/types";

// Display metadata for the contractor vetting signal (see §7 framing).
// Full class strings are spelled out so Tailwind's scanner keeps them.
export const VETTING_META: Record<
  VettingSignal,
  { label: string; badge: string; dot: string }
> = {
  strong: {
    label: "Strong track record",
    badge: "bg-green-50 text-green-700 border-green-200",
    dot: "bg-green-500",
  },
  mixed: {
    label: "Mixed / flagged",
    badge: "bg-amber-50 text-amber-700 border-amber-200",
    dot: "bg-amber-500",
  },
  adverse: {
    label: "Adverse findings",
    badge: "bg-red-50 text-red-700 border-red-200",
    dot: "bg-red-500",
  },
};

export const OUTCOME_META: Record<
  ProjectOutcome,
  { label: string; chip: string }
> = {
  success: { label: "Completed", chip: "bg-green-50 text-green-700" },
  ongoing: { label: "Ongoing", chip: "bg-blue-50 text-blue-700" },
  delayed: { label: "Delayed", chip: "bg-amber-50 text-amber-700" },
  flagged: { label: "Flagged", chip: "bg-orange-50 text-orange-700" },
  ghost: { label: "Ghost / non-existent", chip: "bg-red-50 text-red-700" },
};
