import { getEntity, getProject } from "../data";
import type { Selection } from "../features/linking/SelectionContext";

export type Tab = "overview" | "projects" | "map" | "accountability";

const TABS: Tab[] = ["overview", "projects", "map", "accountability"];

export interface UrlState {
  tab: Tab;
  selection: Selection;
}

// Read the current view + open detail from the URL query string. Unknown or
// stale ids are ignored so a shared link never opens a missing item.
export function readUrl(): UrlState {
  const p = new URLSearchParams(window.location.search);

  const tabParam = p.get("tab");
  const tab: Tab = TABS.includes(tabParam as Tab) ? (tabParam as Tab) : "overview";

  const project = p.get("project");
  const entity = p.get("entity");

  let selection: Selection = null;
  if (project && getProject(project)) {
    selection = { type: "project", id: project };
  } else if (entity && getEntity(entity)) {
    selection = { type: "entity", id: entity };
  }

  return { tab, selection };
}

// Reflect the current view + open detail back into the URL (shareable, no reload).
export function writeUrl({ tab, selection }: UrlState): void {
  const p = new URLSearchParams();
  if (tab !== "overview") p.set("tab", tab);
  if (selection?.type === "project") p.set("project", selection.id);
  if (selection?.type === "entity") p.set("entity", selection.id);

  const qs = p.toString();
  const url = qs ? `${window.location.pathname}?${qs}` : window.location.pathname;
  window.history.replaceState(null, "", url);
}
