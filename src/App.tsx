import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { BudgetOverview } from "./features/overview/BudgetOverview";
import { ProjectsView } from "./features/projects/ProjectsView";
import { AccountabilityView } from "./features/accountability/AccountabilityView";
import { ChatPanel } from "./features/ai/ChatPanel";

// Lazy-load the map so Leaflet stays out of the initial bundle.
const MapView = lazy(() =>
  import("./features/map/MapView").then((m) => ({ default: m.MapView })),
);
import {
  SelectionProvider,
  useSelection,
} from "./features/linking/SelectionContext";
import { DetailDrawer } from "./features/linking/DetailDrawer";
import { Footer } from "./components/Footer";
import { readUrl, writeUrl, type Tab } from "./lib/urlState";

const TABS: { id: Tab; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "projects", label: "Projects" },
  { id: "map", label: "Map" },
  { id: "accountability", label: "Accountability" },
];

function App() {
  // Read the initial view + open detail from the URL once (deep linking).
  const initial = useMemo(() => readUrl(), []);
  return (
    <SelectionProvider initialSelection={initial.selection}>
      <AppShell initialTab={initial.tab} />
    </SelectionProvider>
  );
}

function AppShell({ initialTab }: { initialTab: Tab }) {
  const [tab, setTab] = useState<Tab>(initialTab);
  const { selection, openProject, openEntity, close } = useSelection();

  // Keep the URL in sync with the current view + open detail (shareable links).
  useEffect(() => {
    writeUrl({ tab, selection });
  }, [tab, selection]);

  // Sync back when the user navigates with the browser back/forward buttons.
  useEffect(() => {
    const onPop = () => {
      const next = readUrl();
      setTab(next.tab);
      if (next.selection?.type === "project") openProject(next.selection.id);
      else if (next.selection?.type === "entity") openEntity(next.selection.id);
      else close();
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [openProject, openEntity, close]);

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-5xl px-6 pt-4">
          <h1 className="text-lg font-medium text-slate-900">Budget Watch PH</h1>
          <p className="text-sm text-slate-500">
            Where the Philippine national budget goes, and who is involved.
          </p>
          <nav
            aria-label="Views"
            className="mt-3 -mb-px flex gap-1 overflow-x-auto"
          >
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                aria-current={tab === t.id ? "page" : undefined}
                className={
                  "shrink-0 border-b-2 px-3 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 " +
                  (tab === t.id
                    ? "border-blue-600 text-slate-900"
                    : "border-transparent text-slate-500 hover:text-slate-900")
                }
              >
                {t.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-8">
        {tab === "overview" && <BudgetOverview />}
        {tab === "projects" && <ProjectsView />}
        {tab === "map" && (
          <Suspense
            fallback={
              <div className="h-[480px] animate-pulse rounded-lg border border-slate-200 bg-white" />
            }
          >
            <MapView />
          </Suspense>
        )}
        {tab === "accountability" && <AccountabilityView />}
      </main>

      <Footer />
      <DetailDrawer />
      <ChatPanel />
    </div>
  );
}

export default App;
