import type { ProjectStatus } from "../data/types";

// Status display metadata (see CLAUDE.md §4 status color map).
// Tailwind scans for literal class strings, so the full classes are spelled out
// here rather than composed from fragments.
export interface StatusMeta {
  label: string;
  badge: string; // pill classes
  dot: string; // status dot bg
  bar: string; // progress-bar fill bg
}

export const STATUS_META: Record<ProjectStatus, StatusMeta> = {
  completed: {
    label: "Completed",
    badge: "bg-green-50 text-green-700 border-green-200",
    dot: "bg-green-500",
    bar: "bg-green-500",
  },
  in_progress: {
    label: "In progress",
    badge: "bg-blue-50 text-blue-700 border-blue-200",
    dot: "bg-blue-500",
    bar: "bg-blue-600",
  },
  planning: {
    label: "Planning",
    badge: "bg-amber-50 text-amber-700 border-amber-200",
    dot: "bg-amber-500",
    bar: "bg-amber-500",
  },
  overdue: {
    label: "Overdue",
    badge: "bg-orange-50 text-orange-700 border-orange-200",
    dot: "bg-orange-500",
    bar: "bg-orange-500",
  },
  no_progress: {
    label: "No progress",
    badge: "bg-red-50 text-red-700 border-red-200",
    dot: "bg-red-500",
    bar: "bg-red-500",
  },
  ghost: {
    label: "Ghost project",
    badge: "bg-red-100 text-red-900 border-red-300",
    dot: "bg-red-800",
    bar: "bg-red-800",
  },
};

// Hex equivalents of the status colors, for contexts that can't use Tailwind
// classes (e.g. Leaflet map markers drawn via inline styles).
export const STATUS_HEX: Record<ProjectStatus, string> = {
  completed: "#22c55e", // green-500
  in_progress: "#2563eb", // blue-600
  planning: "#f59e0b", // amber-500
  overdue: "#f97316", // orange-500
  no_progress: "#ef4444", // red-500
  ghost: "#991b1b", // red-800
};

// All statuses in a sensible display order (used by filters).
export const STATUS_ORDER: ProjectStatus[] = [
  "completed",
  "in_progress",
  "planning",
  "overdue",
  "no_progress",
  "ghost",
];
