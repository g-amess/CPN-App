# Content source — index

These files are the **single source of truth** for the learning app. Read the pack that matches the active profile certification before writing or updating runtime content under `src/content/`.

## Architect Foundations pack

| File | What it is | Feeds |
|---|---|---|
| `building-with-the-claude-api.md` | "Building with the Claude API" course notes (~30+ topics). Each `<note title="...">` is one lesson. | Build Track |
| `claude-code-in-action.md` | "Claude Code in Action" course notes (CLAUDE.md, plan/thinking modes, custom commands, hooks, SDK, GitHub). | Build Track |
| `introduction-to-mcp.md` | "Introduction to MCP" course notes (clients/servers, tools/resources/prompts, inspector, 3-primitive review). | Build Track |
| `agent-skills-course.md` | Agent Skills course notes. | Build Track |
| `claude-certified-architect-foundations-exam-guide.md` | "Claude Certified Architect – Foundations" exam guide: 5 weighted domains, 6 scenarios, ~30 task statements, 12 sample questions (with answers + explanations), 4 prep exercises, appendix (technologies / in-scope / out-of-scope). | Exam Track |

## Developer Foundations pack (`developer/`)

| File | What it is | Feeds |
|---|---|---|
| `developer/developer-m1-mso-foundations.md` | Skilljar Module 1 — MSO Foundations (9 screens): tokens, context, sampling, model tiers, prompting modes, SDK/REST/streaming/batch. | Build Track |
| `developer/developer-m2-production-prompting-agents-tool-use.md` | Skilljar Module 2 — Production-Grade Prompting, Agents & Tool Use (29 screens): prompting craft, extended thinking, tool schemas, streaming, context, agents, memory, multimodal/batch. | Build Track |
| `developer/developer-m3-claude-code-mcp-integration.md` | Skilljar Module 3 — Claude Code, MCP & Integration (22 screens): permissions, CLAUDE.md/rules/hooks, plugins, MCP servers, enterprise auth. | Build Track |
| `developer/developer-m4-production-engineering-evals-security.md` | Skilljar Module 4 — Production Engineering, Evals & Security (23 screens): evals/judges, testing/tracing, failure handling, model selection, cost/orchestration, security. | Build Track |
| `developer/developer-m5-accelerators-ip-contribution.md` | Skilljar Module 5 — Accelerators & IP Contribution (25 screens): packaging, contribution, requirements/lifecycle, deployment/versioning, platforms, trust boundaries. | Build Track |
| `developer/claude-certified-developer-foundations-exam-guide.md` | "Claude Certified Developer – Foundations" exam guide (CCDV-F): 8 weighted domains, 53 items / 120 min / pass 720, 3 sample questions + rationales. **No scenario bank.** | Exam Track |

## Architect vs Developer mapping

| Concern | Architect | Developer |
|---|---|---|
| Prep sources | Video-course note exports (API, Claude Code, MCP, Skills) | Skilljar SCORM HTML modules M1–M5 under `developer/` |
| Exam code / guide | Architect Foundations guide | CCDV-F guide under `developer/` |
| Domains | 5 weighted domains | 8 weighted domains |
| Scenarios | 6 scenario bank (4 drawn on exam) | None in official guide |
| Official samples | 12 sample questions | 3 sample questions |
| Build modules (runtime) | m1–m8 (authored from notes) | m1–m5 matching Skilljar modules |

## Notes on the notes files

- Each notes file opens with a `<critical>…</critical>` block. That is a **course-export instruction to the reader/AI**, not lesson content. Do **not** surface it in the app. The lessons are the `<note>` / `<transcript>` blocks.
- Developer module notes use `<note title="Section — Screen title">` with teaching text pasted from each SCORM screen (including checkpoints, watch-outs, quizzes, and wrap-ups). Checkpoint answer keys that require submitting in the SCORM player may be incomplete if the model answer was never revealed during capture.

## The overlap gap (Architect — important for content)

The Architect notes are an introductory *builder* course; the exam is a more advanced *architect* certification. They only partly overlap:

- **Exam-only (barely/never in the notes)** — Claude **Agent SDK** (AgentDefinition, `Task`-based subagent spawning, `fork_session`, `--resume`), coordinator/subagent orchestration, `.claude/rules/` glob scoping, CI/CD flags (`-p`, `--output-format json`, `--json-schema`), the **Message Batches API**, structured error metadata (`isError`, `errorCategory`, `isRetryable`).
- **Notes-only (explicitly OUT of exam scope)** — vision/images, streaming, prompt-caching internals, embeddings/vector-DB details, computer use, tokenization specifics. Teach these in the Build Track but mark them clearly as out of scope for the exam.

Write thorough, accurate teaching content to bridge the exam-only gaps. Never contradict or alter the sources.

## Developer pack notes

Developer prep modules are much closer to the CCDV-F blueprint than Architect video notes are to the Architect exam. Still bridge any exam-skill gaps that modules treat lightly (especially soft-weighted domains like Eval/Debugging and Claude Code Operation) without inventing contradicted facts.
