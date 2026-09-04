# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

**Budget Watch PH** — a single-page React app that visualizes where the Philippine 2026 national budget (₱6.793 trillion, RA 12314) goes and who is involved. It is a civic-education demo, not a legal record. There is **no backend in v1**: all data is hand-curated in typed seed files under [src/data/](src/data/) (8 projects, 25 entities).

> Two doc notes: (1) many source files cite "CLAUDE.md §4/§5/§6/§7/§9/§10". Those refer to an earlier spec doc that no longer lives in the repo; the rules they reference are summarized below. (2) [README.md](README.md) is the untouched Vite starter template — nothing project-specific in it.

## Commands

```bash
npm run dev      # Vite dev server (HMR), http://localhost:5173
npm run build    # tsc -b (typecheck) then vite build → dist/
npm run lint     # eslint over the repo
npm run preview  # serve the production build locally
```

There is no test runner configured. `npm run build` is the gate for type errors — run it after any non-trivial change.

## Environment

The AI features need a Groq API key in `.env` (gitignored). See [.env.example](.env.example):

```
GROQ_API_KEY=gsk_...
```

**The missing `VITE_` prefix is deliberate — keep it that way.** Vite inlines every `VITE_*` variable into the client bundle at build time, so the previous `VITE_GROQ_API_KEY` shipped the key in plain text to every visitor: readable in the JS bundle, and visible in the Network tab because the browser called `api.groq.com` directly with it. The key is now read only by [api/analyze.ts](api/analyze.ts) and never reaches the browser. Never give a secret a `VITE_` prefix.

Get a key free at https://console.groq.com/keys. On Vercel: Project → Settings → Environment Variables → add `GROQ_API_KEY`, then redeploy.

Locally, `npm run dev` (plain Vite) does **not** serve `/api`, so the enabled-check fails and the AI UI simply stays hidden while the rest of the app works. Use `vercel dev` to develop the AI features.

### AI request path ([api/analyze.ts](api/analyze.ts))

`GET /api/analyze` → `{ enabled }`, which is how the client decides whether to render any AI UI at all (see `useAiEnabled`). `POST /api/analyze` runs one analysis or chat turn.

Two rules the endpoint exists to enforce:
- **The server owns the system prompt.** The client sends only `{mode, projectId, messages, lang}` — never prompt text. Prompts are rebuilt here from the same seed data via `buildContext`. Accepting a client-supplied prompt would turn this into a free general-purpose LLM running on your quota.
- **Requests are capped and rate limited** (12 per IP per 10 min, ≤12 history turns, ≤2000 chars each). The limiter is an in-memory `Map`, so it is per-instance and best-effort — it stops casual hammering, not a determined attacker. Move it to Vercel KV / Upstash if this ever takes real traffic.

## Architecture

### Data layer ([src/data/](src/data/))
- Plain TypeScript, **no React imports** — kept decoupled so a real API/DB can replace it later.
- [types.ts](src/data/types.ts) defines the core model: `Project`, `Entity`, `Source`, plus the nested `Bidding` (procurement + `BidFlag` red flags), `MediaItem`, `Coords`/`PinPrecision`, and `ContractorTrack` (vetting) shapes and their enums.
- `Project` and `Entity` link to each other by id (`peopleIds` ↔ `projectIds`), forming a bidirectional graph.
- **Always import from [src/data/index.ts](src/data/index.ts)**, never the raw seed files. It exposes the lookup helpers `getProject`, `getEntity`, `peopleOf(project)`, `projectsOf(entity)` (all resolve ids and silently drop dangling ones) and the `DATA_AS_OF` stamp.
- Every `Project` and `Entity` carries a `sources: Source[]` of real article URLs. New or edited data must come with sources — the header comment in [projects.ts](src/data/projects.ts) documents, item by item, where the seed was **corrected** against reporting and why. Follow that pattern rather than silently editing a figure.
- `DATA_AS_OF` is rendered in the UI (footer + accountability disclaimer); bump it when the data changes.

### Derived status ([src/lib/status.ts](src/lib/status.ts))
Project status is **computed, not stored.** `statusOf(project)` derives one of `completed | in_progress | planning | overdue | no_progress | ghost` from dates, progress, and the `ghost` flag. Key rule: proposed start passed + no `actualStart` ⇒ `no_progress` (money allotted, nothing built). `isFlagged()` marks ghost/no_progress/overdue projects plus any `misreported` one. `today()` is the single seam for "now" — swap it here, not in callers.

### Presentation metadata (`src/lib/*Meta.ts`)
Every enum in the data model has a matching `Record<Enum, {label, badge, dot, …}>` module — [statusMeta.ts](src/lib/statusMeta.ts), [accountabilityMeta.ts](src/lib/accountabilityMeta.ts), [bidMeta.ts](src/lib/bidMeta.ts), [vettingMeta.ts](src/lib/vettingMeta.ts), [pinMeta.ts](src/lib/pinMeta.ts). These are the single source of truth for user-facing labels and colors; components read them instead of switching on the enum. Two constraints:
- **Spell out full Tailwind class strings** in these tables (`"bg-red-50 text-red-700 border-red-200"`). Tailwind's scanner only sees literals — composed fragments get purged.
- For contexts that can't use Tailwind classes (Leaflet markers drawn with inline styles), use the parallel hex map `STATUS_HEX`. Keep the two in sync.

Adding an enum member means updating its `*Meta` record — the `Record<>` type makes the compiler catch it.

### Features ([src/features/](src/features/))
Each tab is a self-contained feature folder: `overview`, `projects`, `map`, `accountability`, plus cross-cutting `ai` and `linking`. [App.tsx](src/App.tsx) is the shell: tab state + a lazy-loaded `MapView` (keeps Leaflet out of the initial bundle; `leaflet/dist/leaflet.css` is imported inside [ProjectsMap.tsx](src/features/map/ProjectsMap.tsx) so it rides along with the lazy chunk).

Fixed overlays sit on an explicit z-index ladder above Leaflet's panes: detail drawer `z-[1000]`, chat panel `z-[1999]`, chat toggle `z-[2000]`.

### Cross-feature linking ([src/features/linking/](src/features/linking/))
- `SelectionContext` holds the single "what detail is open" selection (`{type, id} | null`) and exposes `openProject` / `openEntity` / `close`. Any card anywhere can open a detail drawer through it.
- [urlState.ts](src/lib/urlState.ts) mirrors `{tab, selection}` into the URL query string (`?tab=&project=&entity=`) so views are deep-linkable and shareable. `App.tsx` wires `readUrl`/`writeUrl` + a `popstate` listener. Stale or unknown ids in a URL are ignored, so a shared link never opens a missing item. Note `writeUrl` uses `history.replaceState`, so in-app navigation does **not** push history entries — the `popstate` handler exists but browser back/forward won't step through tabs today. Switch to `pushState` if that behavior is wanted.

### AI layer ([api/analyze.ts](api/analyze.ts), [src/lib/ai.ts](src/lib/ai.ts), [src/lib/buildContext.ts](src/lib/buildContext.ts), [src/features/ai/](src/features/ai/))
- The serverless function calls Groq's OpenAI-compatible chat endpoint (model `llama-3.3-70b-versatile`, temp 0.3). The browser only calls `/api/analyze` via `askAnalysis()` / `askChat()` in `src/lib/ai.ts`; errors surface as `LLMError` carrying visitor-safe wording. (`src/lib/groq.ts` is gone — it was the browser-side caller that required the exposed key.)
- The model only ever sees the curated dataset: `buildProjectContext()` (whole dataset, for chat) / `buildSingleProjectContext(id)` (one project + its people, for analysis) serialize projects+entities into the prompt. **Both are now called on the server**, so the prompt cannot be tampered with from the client.
- Both AI components render nothing until `useAiEnabled()` confirms the server has a key, so a deployment without one shows no AI affordances at all rather than a broken or "not configured" control.
- `CHAT_SYSTEM_PROMPT` / `ANALYSIS_SYSTEM_PROMPT` carry hard guardrails: never say "guilty," frame accountability statuses as official records not verdicts (allegations stay allegations), no legal/financial advice, answer only from provided data. `languageDirective(lang)` is appended for the auto/EN/Filipino-Taglish reply toggle.

## Conventions

- **Stack:** React 19 + TypeScript + Vite 8 + Tailwind CSS v4 (via `@tailwindcss/vite`, no separate config file — theme lives in [src/index.css](src/index.css)). Icons: `lucide-react`. Charts: `recharts`. Maps: `react-leaflet`.
- `vite.config.ts` dedupes/pre-bundles `react`, `react-dom`, `recharts` — recharts otherwise triggers a duplicate-React "Invalid hook call." Don't remove that config.
- **Formatting:** all displayed numbers and dates go through [src/lib/format.ts](src/lib/format.ts) (`peso`, `pesoCompact`, `count`, `formatDate`). Displayed figures are rounded; don't hand-format currency inline.
- **Design system:** flat public-utility look — white surfaces, slate text on `slate-50`, only two font weights (400/500), no gradients, no heavy shadows, sentence case everywhere. Interactive elements carry `focus-visible:ring-*`.

## Editorial rules (non-negotiable)

This app names real people in ongoing cases. Anything touching accountability, contractors, or map pins must preserve these distinctions — mirror the language already in `types.ts` comments, the `*Meta` labels, and the system prompts:

- **Alleged ≠ proven.** Statuses like `charged`, `subpoenaed`, `under_investigation` are official records, not verdicts. Never phrase anything as guilt.
- `no_adverse_findings` is **neutral, not praise** — it must keep slate styling (never green) and its literal label.
- The contractor `VettingSignal` is a "check the record before the bid" transparency indicator derived from public record only — not a verdict and not an endorsement.
- Map pins declare their own honesty via `PinPrecision`: an `office` pin is the implementing agency's office, **not** a project site; `sample` is one real site of a nationwide program. Keep the precision badge and hint visible wherever pins are shown.
- The presumption-of-innocence [Disclaimer](src/features/accountability/Disclaimer.tsx) stays visible on the accountability view, and the [Footer](src/components/Footer.tsx) disclaimer stays on every view.
- Media is linked or embedded from the source (official YouTube embeds are fine) — never copy copyrighted media into the repo.
