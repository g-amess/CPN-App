# Claude Mastery — Build & Architect Exam Prep

An interactive, self-contained single-page app that teaches two bodies of material:

- **Build with the API** — the "Building with the Claude API" course (foundations, prompt engineering & evaluation, tool use, RAG, advanced capabilities, MCP, Claude Code & agents, and **Agent Skills**).
- **Architect Exam Prep** — the **Claude Certified Architect – Foundations** certification: 5 weighted domains, 6 scenarios, ~30 task statements, the 12 official sample questions, 4 preparation exercises, and the appendix.

Everything runs **client-side only** — no backend, no network/API calls at runtime. All progress (lessons completed, flashcard schedule, quiz history, theme, last location) persists in `localStorage`.

## Run it

```bash
npm install
npm run dev      # start the dev server (Vite prints the local URL)
```

Production build / preview:

```bash
npm run build    # type-checks (tsc --noEmit) then builds to dist/
npm run preview  # serve the built app locally
```

Requirements: Node 18+ (developed on Node 24, npm 11).

## Features

- **Lessons + diagrams** — one lesson per source note, with Mermaid process/flow/sequence diagrams (API request flow, tool-use loop, multi-tool chaining, 7-step RAG flow, hybrid retrieval + RRF, MCP client↔server sequence, the agentic loop, coordinator↔subagent hub-and-spoke) and hand-authored interactive SVGs (temperature distribution, embedding space, token stream). Mark lessons complete; out-of-scope exam topics are clearly flagged.
- **Flashcards** — a term→definition deck across both tracks with an SM-2-style spaced-repetition scheduler (Again/Hard/Good/Easy), a daily due queue, new/due/learned counts, and track/group filters. Keyboard: Space flips, 1–4 grade.
- **Quizzes** — the **12 official sample questions verbatim** (with correct answers + explanations and per-domain scoring), plus authored practice questions labelled *"Practice — not from the official guide,"* including a **mixed mode with a domain-weighted score** mirroring the exam's 27/18/20/20/15 weighting. Quiz history persists.
- **Scenario simulations** — interactive decision walkthroughs for all 6 exam scenarios, reusing the official question stems where they exist and revealing the reasoning/tradeoffs.
- **Code walkthroughs** — step-by-step annotated, reveal-as-you-go walkthroughs (tool-use loop, RAG pipeline, MCP `@mcp.tool` server, the agentic loop).
- **Shared tools** — a searchable A–Z **Concept Index** with cross-links, client-side **search** across lessons/concepts/questions, a **Dashboard** (progress per track, flashcards due, weakest domains, an **exam-readiness gauge**, reset), light/dark theme, and **Exam relevance** cross-links between tracks.

## Local profiles (no accounts, no backend)

A lightweight, entirely local "sign-in": each person on a device gets their own namespaced progress — **no passwords, no server, no network calls**.

- On first load, create a profile (or continue as **Guest**). Switch / create / rename / delete profiles from the avatar menu in the top bar.
- All per-profile state (lessons completed, flashcard schedule, quiz history, onboarding flag) is stored under a `cma:profile:{id}` key; the active profile and registry live in `cma:profiles`; theme is a device-global preference (`cma:theme`).
- Any progress from a previous single-bucket version is **migrated automatically** into a default profile on first run — nothing is lost.
- **Export / Import**: download the active profile's progress as JSON for backup, and import it back (validated) — the way to move progress to another device.
- A **first-run onboarding** modal (reopenable from the `?` button), a **flashcard export** to tab-separated `.txt` (Quizlet-ready), and a **"report a content issue"** control (opens a `mailto:` draft with a copy-to-clipboard fallback — no network).

> **Your progress is stored locally in your browser on this device — it is per-browser, not synced across devices or people (by design).** Clearing site data clears progress; use Export/Import for backup and device migration.

## Deploy (static, no secrets)

The app is fully static. `npm run build`, then host `dist/` on any static host. SPA-fallback config is included so client-side deep links don't 404:

- **Vercel** — `vercel.json` rewrites all paths to `/index.html`.
- **Netlify** — `public/_redirects` (`/* /index.html 200`, copied into `dist/`).

## Tech stack

Vite · React · TypeScript · Tailwind CSS · React Router · `mermaid` · `react-markdown` + `remark-gfm` · `react-syntax-highlighter` · `lucide-react`.

## Project structure

```
content-source/        Read-only source of truth (do not edit)
src/
  content/             Typed content data (the bulk of the work)
    modules/m1..m7     Build-track lessons, one file per module
    buildTrack.ts      Aggregates modules + lookup helpers
    examTrack.ts       Domains, task statements, scenarios, exercises, reference
    sampleQuestions.ts The 12 official questions (verbatim)
    practiceQuestions.ts  Authored practice questions
    scenarios.ts       6 scenario simulations
    codeWalkthroughs.ts   Annotated step-by-step code
    flashcards.ts      Spaced-repetition deck
    conceptIndex.ts    A–Z concept index
  lib/                 useLocalStorage, progress store, SM-2 (srs), search, quiz scoring
  components/          Reusable UI (Diagram, Markdown, QuizRunner, ScenarioSim, Flashcard, …)
  pages/               Route pages (Dashboard, BuildLesson, Domain, quizzes, …)
```

## Content fidelity

The four files in `content-source/` are authoritative. The 12 official sample questions, their correct answers, and explanations are reproduced **verbatim**. Added explanatory prose bridges the topics the exam tests but the course notes barely cover (Claude Agent SDK, coordinator/subagent orchestration, `.claude/rules/`, CI/CD flags, the Message Batches API, structured MCP error metadata) without contradicting the sources.
