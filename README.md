# Budget Watch PH

**Where does ₱6.793 trillion go?**  A single-page web app that maps the Philippine 2026 National Budget (RA 12314) — the projects it funds, the agencies and people attached to them, and which projects show no progress on the ground.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?logo=tailwindcss&logoColor=white)
![Leaflet](https://img.shields.io/badge/Leaflet-map-199900?logo=leaflet&logoColor=white)

**[Live demo](https://publicity-knows.vercel.app)**

**[▶ Live demo](https://publicity-knows.vercel.app)**

---

## ⚖️ Read this first

> This is a **civic-education project, not a legal record.**
>
> - Accountability statuses (`charged`, `subpoenaed`, `under investigation`) are **official records, not verdicts**. Everyone named is presumed innocent.
> - `no adverse findings` is a **neutral** status — it is not an endorsement.
> - Contractor vetting signals are a *check-the-record-before-the-bid* transparency indicator derived from public record only.
> - Map pins declare their own precision: an **office** pin is the implementing agency's office, not a project site; a **sample** pin is one real site of a nationwide program.
>
> Every project and entity in the dataset carries a `sources[]` list of real article URLs, and the UI stamps the data's `DATA_AS_OF` date on every view.

---

## Features

| View | What it does |
| --- | --- |
| **Overview** | Budget-wide breakdown with charts — where the money is allotted and how much of it has visible progress. |
| **Projects** | Every tracked project with derived status: completed, in progress, planning, overdue, no progress, or ghost. |
| **Map** | Leaflet map of project locations, each pin labelled with its own precision so the map never overstates what it knows. |
| **Accountability** | The people and agencies linked to each project, with official-record status and a permanent presumption-of-innocence disclaimer. |
| **AI assistant** | Ask questions about the budget in English or Filipino/Taglish. The model only ever sees the curated dataset — it cannot invent projects. |

### Status is computed, not stored

`statusOf(project)` derives status from dates, progress and a ghost flag. The rule that matters most: **proposed start date passed + no actual start = `no_progress`** — money allotted, nothing built.

---

## Tech stack

- **Framework** — React 19 + TypeScript, built with Vite 8
- **Styling** — Tailwind CSS v4 (theme in `src/index.css`, no separate config file)
- **Maps** — react-leaflet, lazy-loaded so Leaflet stays out of the initial bundle
- **Charts** — Recharts · **Icons** — lucide-react
- **AI** — Groq (`llama-3.3-70b-versatile`) via an OpenAI-compatible endpoint
- **Data** — hand-curated, fully typed seed files. No backend in v1.

---

## Getting started

```bash
git clone https://github.com/MJ-Dev-SE/PUBLICITY-KNOWS.git
cd PUBLICITY-KNOWS
npm install
npm run dev          # http://localhost:5173
```

### Environment

The AI features need a free Groq API key. Create a `.env` file in the project root (it is gitignored):

```env
VITE_GROQ_API_KEY=gsk_your_key_here
```

Get one at [console.groq.com/keys](https://console.groq.com/keys). Without a key the app still runs — the chat and analysis panels render a *not configured* state instead of failing.

### Scripts

```bash
npm run dev       # Vite dev server with HMR
npm run build     # typecheck (tsc -b) then production build → dist/
npm run lint      # ESLint over the repo
npm run preview   # serve the production build locally
```

`npm run build` is the type-check gate — there is no test runner configured yet.

---

## Project structure

```
src/
  data/        typed seed data (projects, entities, sources) — no React imports,
               so a real API can replace this layer without touching the UI
  lib/         status derivation, presentation metadata, formatting, Groq client
  features/    one self-contained folder per view:
               overview · projects · map · accountability · ai · linking
  index.css    Tailwind v4 theme tokens
```

**Cross-feature linking.** A single `SelectionContext` holds *what detail is open*, so any card anywhere can open any project or entity drawer. That selection is mirrored into the URL query string (`?tab=&project=&entity=`), which makes every view deep-linkable and shareable — and unknown ids in a shared link are ignored rather than throwing.

---

## Design

A deliberately flat, public-utility look: white surfaces, slate text, two font weights, no gradients, no heavy shadows, sentence case throughout. Every enum in the data model has a matching metadata table that owns its label and colour, so the UI never switches on a raw enum — and adding a new status is a compile error until its label is written.

---

## Roadmap

- [ ] Move the curated dataset behind a real API
- [ ] Browser back/forward through tabs (currently `replaceState`)
- [ ] Automated tests around status derivation
- [ ] Expand coverage beyond the initial 8 projects / 25 entities

---

## Author

**MJ** · [@MJ-Dev-SE](https://github.com/MJ-Dev-SE) · markjerohm@gmail.com

Corrections to the dataset are welcome — open an issue with a source link.
