# Content source — index

These files are the **single source of truth** for the learning app. Read all four in full before writing any code.

| File | What it is | Feeds |
|---|---|---|
| `building-with-the-claude-api.md` | "Building with the Claude API" course notes (~30+ topics). Each `<note title="...">` is one lesson. | Build Track |
| `claude-code-in-action.md` | "Claude Code in Action" course notes (CLAUDE.md, plan/thinking modes, custom commands, hooks, SDK, GitHub). | Build Track |
| `introduction-to-mcp.md` | "Introduction to MCP" course notes (clients/servers, tools/resources/prompts, inspector, 3-primitive review). | Build Track |
| `claude-certified-architect-foundations-exam-guide.md` | The "Claude Certified Architect – Foundations" exam guide: 5 weighted domains, 6 scenarios, ~30 task statements, 12 sample questions (with answers + explanations), 4 prep exercises, appendix (technologies / in-scope / out-of-scope). | Exam Track |

## Notes on the notes files
- Each notes file opens with a `<critical>…</critical>` block. That is a **course-export instruction to the reader/AI**, not lesson content. Do **not** surface it in the app. The lessons are the `<note>` / `<transcript>` blocks.

## The overlap gap (important for content)
The notes are an introductory *builder* course; the exam is a more advanced *architect* certification. They only partly overlap:
- **Exam-only (barely/never in the notes)** — Claude **Agent SDK** (AgentDefinition, `Task`-based subagent spawning, `fork_session`, `--resume`), coordinator/subagent orchestration, `.claude/rules/` glob scoping, CI/CD flags (`-p`, `--output-format json`, `--json-schema`), the **Message Batches API**, structured error metadata (`isError`, `errorCategory`, `isRetryable`).
- **Notes-only (explicitly OUT of exam scope)** — vision/images, streaming, prompt-caching internals, embeddings/vector-DB details, computer use, tokenization specifics. Teach these in the Build Track but mark them clearly as out of scope for the exam.

Write thorough, accurate teaching content to bridge the exam-only gaps. Never contradict or alter the sources.
