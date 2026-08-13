import type { AccountabilityStatus, EntityKind } from "../data/types";

// Accountability status display metadata (see CLAUDE.md §4 + §7).
// IMPORTANT (§7.5): `no_adverse_findings` is neutral, NOT praise. It must use
// slate/neutral styling (never green) and the literal label below.
export interface AccountabilityMeta {
  label: string;
  badge: string; // literal Tailwind classes
  dot: string;
}

export const ACCOUNTABILITY_META: Record<
  AccountabilityStatus,
  AccountabilityMeta
> = {
  // Red family — adverse official status.
  blacklisted: {
    label: "Blacklisted",
    badge: "bg-red-50 text-red-700 border-red-200",
    dot: "bg-red-500",
  },
  charged: {
    label: "Charged",
    badge: "bg-red-50 text-red-700 border-red-200",
    dot: "bg-red-500",
  },
  dismissed: {
    label: "Dismissed",
    badge: "bg-red-50 text-red-700 border-red-200",
    dot: "bg-red-500",
  },
  // Amber — process ongoing.
  subpoenaed: {
    label: "Subpoenaed",
    badge: "bg-amber-50 text-amber-700 border-amber-200",
    dot: "bg-amber-500",
  },
  under_investigation: {
    label: "Under investigation",
    badge: "bg-amber-50 text-amber-700 border-amber-200",
    dot: "bg-amber-500",
  },
  // Blue — running the cleanup / oversight.
  leading_cleanup: {
    label: "Leading cleanup",
    badge: "bg-blue-50 text-blue-700 border-blue-200",
    dot: "bg-blue-500",
  },
  // Slate/neutral — NOT an endorsement.
  no_adverse_findings: {
    label: "No adverse findings reported",
    badge: "bg-slate-50 text-slate-600 border-slate-200",
    dot: "bg-slate-400",
  },
};

export const KIND_LABEL: Record<EntityKind, string> = {
  contractor: "Contractors",
  agency_official: "Agencies & officials",
  lawmaker: "Lawmakers",
  oversight: "Oversight & cleanup",
};

// Display order for the grouped sections.
export const KIND_ORDER: EntityKind[] = [
  "contractor",
  "agency_official",
  "lawmaker",
  "oversight",
];
