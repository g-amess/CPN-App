<!--
MODULE: Agent Skills (new Build-Track module — place after "Claude Code & Agents").
PROVENANCE: The Skilljar course "Introduction to agent skills" gates its lesson text behind a
login, so this module is AUTHORED from Anthropic's official documentation, mirroring that
course's six-lesson curriculum (What are skills? / Creating your first skill / Configuration and
multi-file skills / Skills vs. other Claude Code features / Sharing skills / Troubleshooting
skills). It is accurate to the docs, not a copy of the course's wording. Sources:
  - Claude Code skills: https://code.claude.com/docs/en/skills
  - Agent Skills overview: https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview
  - Engineering blog: https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills
  - Product announcement: https://claude.com/blog/skills
  - Skills repo / marketplace: https://github.com/anthropics/skills
EXAM RELEVANCE: cross-link these lessons to Exam-Track Domain 3 (esp. Task Statement 3.2 —
SKILL.md frontmatter context:fork / allowed-tools / argument-hint, and skills vs. CLAUDE.md),
and lightly to Domain 2 (skill descriptions ↔ tool descriptions) and Domain 1 (skills + subagents).
The fidelity rules from CLAUDE-CODE-BUILD-PROMPT.md §1 still apply.
-->
<notes>

<note title="What are skills?">
Agent Skill = a folder containing a `SKILL.md` file that packages reusable instructions (and optionally scripts and resources) so Claude performs a specific kind of task consistently. The core idea: stop re-explaining the same workflow every time — teach Claude once, in a file, and let it apply that knowledge automatically when a matching task comes up.

How a skill differs from a normal tool: a tool executes and returns a result; a skill *prepares* Claude to solve a problem by injecting instructions and modifying its execution context (e.g. which tools/model it may use), then letting it continue. Claude reaches a skill through a built-in `Skill` tool, but you never call it manually — Claude scans available skills and invokes the relevant one on its own. You can watch it pick a skill in its chain of thought.

The key efficiency mechanism is **three-layer progressive disclosure**:
- Metadata (the `name` and `description` from the frontmatter) is loaded into the system prompt at startup for every installed skill. This is how Claude knows what each skill is for without reading all of them.
- Instructions (the body of `SKILL.md`) load only when that skill is triggered.
- Resources (files in `references/`, `assets/`, `scripts/`) load only if and when they're needed during execution.

This means dozens of skills can be installed while costing almost no context until one is actually used. Skills can also bundle executable code (e.g. a Python script) that Claude runs at its discretion — without reading the script or its data into context — which is cheaper and more deterministic than doing the work via token generation.

Skills work across Claude apps, Claude Code, and the API. In Claude Code they are filesystem-based: just folders on disk, no upload step.

Key takeaways: a skill is a folder + a `SKILL.md`; metadata is always loaded, the rest is lazy; skills prepare Claude rather than returning a result; they keep context lean and can include deterministic code.
</note>

<note title="Creating your first skill">
The smallest possible skill is a directory with one `SKILL.md` file. The file has two parts: YAML frontmatter (metadata) and a Markdown body (the instructions).

Required frontmatter is just two fields:
- `name` — a short identifier (lowercase letters, numbers, hyphens).
- `description` — what the skill does **and when to use it**.

The directory name doubles as a slash command you can type to invoke the skill directly, while the `description` is what lets Claude load it automatically. Of the two, the description is the single most important thing you write: vague descriptions are the #1 reason a skill never triggers. Write it like a router instruction — state the purpose and the situations that should activate it, including the words a user would actually use ("Use when the user asks what changed, wants a commit message, or asks to review their diff").

Where to put it:
- Personal skill: `~/.claude/skills/<name>/SKILL.md` — available across all your projects, not shared.
- Project skill: `.claude/skills/<name>/SKILL.md` — committed to the repo and shared with your team via version control.

A complete first skill, using dynamic context injection (a `!` line runs a shell command and inlines its output before Claude reads the file):

```markdown
---
description: Summarizes uncommitted changes and flags anything risky. Use when the user asks what changed, wants a commit message, or asks to review their diff.
---

## Current changes
!`git diff HEAD`

## Instructions
Summarize the changes above in two or three bullet points, then list any risks
(missing error handling, hardcoded values, tests that need updating). If the diff
is empty, say there are no uncommitted changes.
```

Save that to `~/.claude/skills/summarize-changes/SKILL.md` and Claude will load it when you ask about your changes — or you can run `/summarize-changes`.

Best practice: keep `SKILL.md` focused (a common guideline is under ~500 lines). When it grows past that, the question isn't "how do I tighten the prose" — it's "what belongs in `references/`?"

Key takeaways: minimum skill = folder + `SKILL.md` with `name` + `description`; the description drives auto-triggering; personal skills live in `~/.claude/skills/`, shared ones in `.claude/skills/`; `!`command`` injects live context.
</note>

<note title="Configuration and multi-file skills">
Beyond `name` and `description`, frontmatter offers optional fields that control how a skill runs:

- `allowed-tools` — restrict the tools the skill may use, following least privilege. Examples: `Read,Write,Edit,Glob,Grep`, or scoped Bash like `Bash(git status:*),Bash(git diff:*),Read,Grep`. Granting `Bash` broadly is unnecessary surface area when the skill only needs a couple of commands.
- `context: fork` (with `agent:`) — run the skill in an **isolated sub-agent** so its (often verbose) output never pollutes your main conversation. The built-in `Explore` and `Plan` agents skip `CLAUDE.md` and git status to stay lean, so a forked skill sees only its own `SKILL.md` and the agent's system prompt; results are summarized back to your main thread.
- `argument-hint` — prompt the developer for required parameters when they invoke the skill without arguments.
- `model` — which model the skill uses; defaults to `inherit` (the session's current model), but a complex skill (e.g. code review) can request a more capable one.
- `version` — metadata for tracking changes.

A forked research skill that takes input via the `$ARGUMENTS` placeholder:

```markdown
---
name: deep-research
description: Research a topic thoroughly across the codebase
context: fork
agent: Explore
---

Research $ARGUMENTS thoroughly:
1. Find relevant files using Glob and Grep
2. Read and analyze the code
3. Summarize findings with specific file references
```

**Multi-file skills** are where progressive disclosure earns its keep. The `SKILL.md` body loads on every activation, but heavy material placed in `references/` (docs, schemas, long checklists), `scripts/` (code Claude runs as a tool), and `assets/` (templates, fonts) loads only when needed. Identical content costs tokens on every use if it sits in the body, but almost nothing if it sits in `references/` — and across many skills that compounds. Decide explicitly whether a script is meant to be **run** as a tool or **read** as reference, and say so.

Key takeaways: `allowed-tools` scopes permissions; `context: fork` + `agent` isolates verbose work; `argument-hint`/`$ARGUMENTS` handle parameters; put heavy content in `references/`, runnable code in `scripts/`, templates in `assets/`.
</note>

<note title="Skills vs. other Claude Code features">
Skills overlap with several other customization mechanisms; choosing the right one is the real skill.

- **CLAUDE.md** is always-on context loaded every session — use it for universal, project-wide standards that should apply to everything. **Skills** are on-demand: loaded only when a task matches. Use a skill for task-specific expertise, not for rules that should always be in effect.
- **`.claude/rules/`** files load conditionally based on glob path patterns in their frontmatter — the right tool for conventions tied to a file *type or location* (e.g. all `**/*.test.tsx`). Rules activate from file paths; skills activate from the model's reading of the task.
- **Hooks** are deterministic shell commands that run before/after tool calls and can *block* them (exit code 2). They are guaranteed enforcement of policy. Skills are not event-driven and don't block — they inject capability/instructions. If a rule must always hold, use a hook; if you want Claude to know *how* to do something well, use a skill.
- **Subagents** are separate agent configurations with isolated context. Skills and subagents compose: a skill with `context: fork` runs *in* a subagent, and conversely a custom subagent can use skills as reference material for expert, isolated delegation.
- **Custom slash commands** (`.claude/commands/`) are simpler prompt files. A skill's folder name also becomes a slash command, but skills are richer — frontmatter, bundled resources, progressive disclosure.

Quick decision guide: always-on standards → `CLAUDE.md`; conventions by file path → `.claude/rules/`; guaranteed pre/post enforcement → hooks; task-specific expertise Claude should invoke when relevant → skills; isolated delegated work → subagents (often paired with a forked skill).

Key takeaways: `CLAUDE.md` = always on; rules = path-conditional; hooks = deterministic enforcement; skills = model-invoked expertise; subagents = isolation — and skills + subagents combine.
</note>

<note title="Sharing skills">
Skills are designed to spread your team's expertise. Four distribution paths, from local to organization-wide:

- **Version control (team).** Put skills in the project's `.claude/skills/` and commit them; teammates get them on clone/pull. Claude Code watches skill directories, so adding or editing a `SKILL.md` under `~/.claude/skills/`, the project `.claude/skills/`, or a `.claude/skills/` in an `--add-dir` directory takes effect within the current session. Creating a top-level skills directory that didn't exist at startup requires a restart so it can be watched.
- **Plugins / marketplace (broad).** Add a `.claude-plugin/plugin.json` to a skill folder and it loads as a plugin, which can also bundle agents, hooks, and MCP servers. Install published plugins with `/plugin install <name>@<marketplace>` — e.g. `/plugin install document-skills@anthropic-agent-skills` from Anthropic's public skills marketplace.
- **Manual install.** Drop a skill folder into `~/.claude/skills/`.
- **Organization-wide.** Enterprise **managed settings** deploy skills across an org. Anthropic has added org-wide management, a directory of partner-built skills, and published Agent Skills as an open standard for cross-platform portability.

The Claude Agent SDK exposes the same support: load filesystem skills with `setting_sources=["user", "project"]` and include `"Skill"` in `allowed_tools`.

**Security matters here.** Skills can execute code and may touch sensitive data, so treat installing a skill like installing software — only use trusted sources, and be especially careful before wiring third-party skills into production systems or anything with access to sensitive data.

Key takeaways: commit to a repo for the team; package as a plugin for broad reach; managed settings for org-wide; the SDK mirrors all of it; vet skills like software.
</note>

<note title="Troubleshooting skills">
A practical diagnostic guide for the common failure modes.

- **Skill won't trigger.** Almost always the description. Make it specific and include *when* to use it plus the keywords a user would say. Then confirm the plumbing: the `Skill` tool must be enabled (it must be in `allowedTools`), and the file must exist — check with `ls .claude/skills/*/SKILL.md` and `ls ~/.claude/skills/*/SKILL.md`.
- **Frontmatter / YAML errors.** Invalid YAML or missing required fields will break loading. Constraints to respect: `name` ≤ 64 characters, lowercase letters/numbers/hyphens only, no XML tags, and no reserved words (`anthropic`, `claude`); `description` non-empty and ≤ 1024 characters.
- **Priority / selection conflicts.** When two skills match a request, near-identical descriptions cause the wrong one to load — differentiate them so each clearly states its distinct purpose (the same discipline used for distinguishing similar tools).
- **Changes not taking effect.** `SKILL.md` text edits apply within the session; a brand-new top-level skills directory needs a restart; for a skill that is also a plugin, changes to `hooks/`, `.mcp.json`, `agents/`, or output styles need `/reload-plugins`.
- **Runtime errors.** If a bundled script fails, check the script itself and make sure `allowed-tools` grants what it needs (e.g. `Bash`).
- **`context: fork` isn't isolating as expected.** Ensure an `agent` type is set, and remember the `Explore`/`Plan` agents deliberately skip `CLAUDE.md` and git status.
- **Context bloat.** If a skill eats too much context, move heavy material into `references/` and keep `SKILL.md` lean.

Key takeaways: fix triggering by fixing the description (and enabling the `Skill` tool); validate frontmatter against the name/description limits; disambiguate competing skills; know the reload rules; scope `allowed-tools` to what scripts actually need.
</note>

</notes>
