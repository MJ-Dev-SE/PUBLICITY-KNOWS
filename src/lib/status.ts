import type { Project, ProjectStatus } from "../data/types";

// "Today" for status calculations.
// Uses the live system clock (per project decision). Kept as a single function
// so it can be swapped for a fixed date or an API-provided clock later without
// touching callers.
export function today(): Date {
  return new Date();
}

// Core status rule (see CLAUDE.md §6).
// Key rule: if the proposed start date has passed and there is still no recorded
// actualStart, the project is "no_progress" — money allotted, time elapsed,
// nothing built.
export function statusOf(p: Project, now: Date = today()): ProjectStatus {
  const start = new Date(p.proposedStart);
  const end = new Date(p.proposedEnd);

  if (p.ghost) return "ghost";
  if (p.progress >= 100) return "completed";
  if (!p.actualStart) {
    return now > start ? "no_progress" : "planning";
  }
  if (now > end && p.progress < 100) return "overdue";
  return "in_progress";
}

// Statuses that count as "flagged" — money allotted but the project is stalled,
// non-existent, or overdue. Misreported projects are also flagged regardless of
// status (reported done, evidence says otherwise).
const FLAGGED_STATUSES = new Set<ProjectStatus>([
  "ghost",
  "no_progress",
  "overdue",
]);

export function isFlagged(p: Project, now: Date = today()): boolean {
  return FLAGGED_STATUSES.has(statusOf(p, now)) || Boolean(p.misreported);
}
