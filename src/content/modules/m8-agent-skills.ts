import type { BuildModule } from '../types'

export const m8: BuildModule = {
  id: 'm8',
  title: 'Agent Skills',
  blurb:
    'Package reusable expertise in a folder + SKILL.md so Claude applies a workflow consistently — with three-layer progressive disclosure, multi-file resources, and clear rules for when to use a skill versus CLAUDE.md, rules, hooks, or subagents.',
  lessons: [
    {
      id: 'what-are-skills',
      moduleId: 'm8',
      title: 'What Are Skills?',
      summary: 'A folder + SKILL.md that teaches Claude a task once; three-layer progressive disclosure keeps it cheap.',
      body: `An **Agent Skill** is a folder containing a \`SKILL.md\` file that packages reusable instructions — and optionally scripts and resources — so Claude performs a specific kind of task consistently. The core idea: stop re-explaining the same workflow every time. Teach Claude once, in a file, and let it apply that knowledge automatically when a matching task appears.

## A skill prepares Claude; a tool returns a result

A tool *executes* and returns a value. A skill instead **prepares** Claude to solve a problem: it injects instructions and can modify the execution context (which tools or model are available), then lets Claude continue. Claude reaches a skill through a built-in **\`Skill\` tool**, but you never call it manually — Claude scans the available skills and invokes the relevant one on its own (you can watch it choose in its chain of thought).

## Three-layer progressive disclosure

This is the efficiency mechanism that makes many skills affordable:

- **Metadata** — the \`name\` and \`description\` from the frontmatter. Loaded into the system prompt at startup for **every** installed skill. This is how Claude knows what each skill is for without reading them all.
- **Instructions** — the body of \`SKILL.md\`. Loaded **only when that skill is triggered**.
- **Resources** — files in \`references/\`, \`assets/\`, \`scripts/\`. Loaded **only if and when needed** during execution.

So dozens of skills can be installed while costing almost no context until one is actually used. Skills can also bundle **executable code** (e.g. a Python script) that Claude runs at its discretion — without reading the script or its data into context — which is cheaper and more deterministic than doing the work through token generation.

Skills work across the Claude apps, Claude Code, and the API. In Claude Code they are **filesystem-based** — just folders on disk, with no upload step.`,
      keyTakeaways: [
        'A skill = a folder + a SKILL.md; it prepares Claude rather than returning a result.',
        'Three layers: metadata (always loaded) → instructions (on trigger) → resources (on demand).',
        'Claude auto-invokes skills via the built-in Skill tool; metadata is what lets it choose.',
        'Skills keep context lean and can bundle deterministic, runnable code.',
      ],
      diagrams: [
        {
          kind: 'mermaid',
          title: 'Three-layer progressive disclosure',
          code: `flowchart TD
  subgraph L1["Layer 1 — Metadata (always loaded, all skills)"]
    M["name + description<br/>in the system prompt"]
  end
  subgraph L2["Layer 2 — Instructions (loaded on trigger)"]
    B["SKILL.md body"]
  end
  subgraph L3["Layer 3 — Resources (loaded on demand)"]
    R["references/ · scripts/ · assets/"]
  end
  M -->|"Claude matches a task"| B
  B -->|"only if needed"| R`,
        },
      ],
      examRelevance: [
        { domainId: 'd3', taskId: 't3.2', label: 'Skills vs CLAUDE.md — on-demand vs always-loaded' },
        { domainId: 'd1', taskId: 't1.3', label: 'Skills can run in / pair with subagents' },
      ],
    },
    {
      id: 'creating-first-skill',
      moduleId: 'm8',
      title: 'Creating Your First Skill',
      summary: 'The minimum is a folder with one SKILL.md — frontmatter (name, description) + a Markdown body.',
      body: `The smallest possible skill is a directory with one \`SKILL.md\` file. The file has two parts: **YAML frontmatter** (metadata) and a **Markdown body** (the instructions).

## The two required fields

- **\`name\`** — a short identifier (lowercase letters, numbers, hyphens).
- **\`description\`** — what the skill does **and when to use it**.

The **directory name doubles as a slash command** you can type to invoke the skill directly, while the **\`description\` is what lets Claude load it automatically.** Of the two, the description is the single most important thing you write — **vague descriptions are the #1 reason a skill never triggers.** Write it like a router instruction: state the purpose and the situations that should activate it, including the words a user would actually say (e.g. *"Use when the user asks what changed, wants a commit message, or asks to review their diff"*).

## Where it lives

- **Personal skill** — \`~/.claude/skills/<name>/SKILL.md\`. Available across all your projects, not shared.
- **Project skill** — \`.claude/skills/<name>/SKILL.md\`. Committed to the repo and shared with your team via version control.

(This is the same project-vs-user scoping the exam tests for commands and skills in Domain 3.)

## Dynamic context injection

A line beginning with \`!\` runs a shell command and inlines its output **before** Claude reads the file — so the skill can act on live state (see the code example). Keep \`SKILL.md\` focused; a common guideline is **under ~500 lines**. When it grows past that, the question isn't "how do I tighten the prose" — it's "what belongs in \`references/\`?"`,
      keyTakeaways: [
        'Minimum skill = a folder + SKILL.md with name + description.',
        'The description drives auto-triggering — make it specific and include when/keywords.',
        'Personal skills live in ~/.claude/skills/; shared ones in .claude/skills/ (committed).',
        '!`command` injects live shell output; keep SKILL.md under ~500 lines.',
      ],
      diagrams: [
        {
          kind: 'mermaid',
          title: 'SKILL.md anatomy',
          code: `flowchart TD
  Dir["skills/summarize-changes/  (folder name = /slash command)"] --> File["SKILL.md"]
  File --> FM["YAML frontmatter<br/>name · description · (optional config)"]
  File --> Body["Markdown body<br/>the instructions (+ optional !command injection)"]
  Dir --> Ref["references/  — docs, schemas (read on demand)"]
  Dir --> Scr["scripts/  — code Claude runs as a tool"]
  Dir --> Ass["assets/  — templates, fonts"]`,
        },
      ],
      code: [
        {
          lang: 'markdown',
          title: '~/.claude/skills/summarize-changes/SKILL.md',
          code: `---
description: Summarizes uncommitted changes and flags anything risky. Use when the user asks what changed, wants a commit message, or asks to review their diff.
---

## Current changes
!\`git diff HEAD\`

## Instructions
Summarize the changes above in two or three bullet points, then list any risks
(missing error handling, hardcoded values, tests that need updating). If the diff
is empty, say there are no uncommitted changes.`,
        },
      ],
      examRelevance: [
        { domainId: 'd3', taskId: 't3.2', label: 'Project vs user scope; SKILL.md frontmatter' },
        { domainId: 'd2', taskId: 't2.1', label: 'A skill’s description is like a tool description' },
      ],
    },
    {
      id: 'config-multi-file-skills',
      moduleId: 'm8',
      title: 'Configuration & Multi-File Skills',
      summary: 'Optional frontmatter (allowed-tools, context: fork, argument-hint, model) and splitting heavy content into references/scripts/assets.',
      body: `Beyond \`name\` and \`description\`, frontmatter offers optional fields that control how a skill runs:

- **\`allowed-tools\`** — restrict the tools the skill may use, following **least privilege**. Examples: \`Read,Write,Edit,Glob,Grep\`, or scoped Bash like \`Bash(git status:*),Bash(git diff:*),Read,Grep\`. Granting \`Bash\` broadly is unnecessary surface area when the skill only needs a couple of commands.
- **\`context: fork\`** (with \`agent:\`) — run the skill in an **isolated sub-agent** so its (often verbose) output never pollutes your main conversation. The built-in \`Explore\` and \`Plan\` agents skip \`CLAUDE.md\` and git status to stay lean, so a forked skill sees only its own \`SKILL.md\` and the agent's system prompt; results are summarized back to your main thread.
- **\`argument-hint\`** — prompt the developer for required parameters when they invoke the skill without arguments.
- **\`model\`** — which model the skill uses; defaults to \`inherit\` (the session's current model), but a complex skill (e.g. code review) can request a more capable one.
- **\`version\`** — metadata for tracking changes.

## Multi-file skills

This is where progressive disclosure earns its keep. The \`SKILL.md\` body loads on **every** activation, but heavy material loads only when needed:

- **\`references/\`** — docs, schemas, long checklists (read as reference).
- **\`scripts/\`** — code Claude runs **as a tool**.
- **\`assets/\`** — templates, fonts.

Identical content costs tokens on every use if it sits in the body, but almost nothing if it sits in \`references/\` — and across many skills that compounds. Decide explicitly whether a script is meant to be **run** (a tool) or **read** (reference), and say so.`,
      keyTakeaways: [
        'allowed-tools scopes permissions (least privilege); prefer scoped Bash over broad Bash.',
        'context: fork + agent isolates verbose work in a subagent; results summarize back.',
        'argument-hint / $ARGUMENTS handle parameters; model defaults to inherit.',
        'Put heavy content in references/, runnable code in scripts/, templates in assets/.',
      ],
      code: [
        {
          lang: 'markdown',
          title: 'A forked skill taking input via $ARGUMENTS',
          code: `---
name: deep-research
description: Research a topic thoroughly across the codebase
context: fork
agent: Explore
---

Research $ARGUMENTS thoroughly:
1. Find relevant files using Glob and Grep
2. Read and analyze the code
3. Summarize findings with specific file references`,
        },
        {
          lang: 'markdown',
          title: 'Frontmatter with scoped tools + argument hint',
          code: `---
name: code-review
description: Reviews a file for bugs and security issues. Use when asked to review code or check a diff.
allowed-tools: Read, Grep, Glob, Bash(git diff:*)
argument-hint: <path to the file or directory to review>
model: inherit
version: 1
---

Review $ARGUMENTS for correctness bugs and security issues, then list findings
by severity with a file:line reference and a suggested fix for each.`,
        },
      ],
      examRelevance: [
        { domainId: 'd3', taskId: 't3.2', label: 'context: fork, allowed-tools, argument-hint (tested directly)' },
        { domainId: 'd1', taskId: 't1.5', label: 'Least-privilege tool scoping' },
      ],
    },
    {
      id: 'skills-vs-features',
      moduleId: 'm8',
      title: 'Skills vs. Other Claude Code Features',
      summary: 'CLAUDE.md (always-on) vs rules (path-conditional) vs hooks (deterministic) vs subagents (isolation) vs commands — and when a skill is right.',
      body: `Skills overlap with several other customization mechanisms; **choosing the right one is the real skill.**

- **CLAUDE.md** is always-on context loaded every session — use it for **universal, project-wide standards** that should apply to everything. Skills are **on-demand**: loaded only when a task matches. Use a skill for task-specific expertise, not for rules that should always be in effect.
- **\`.claude/rules/\`** files load **conditionally based on glob path patterns** in their frontmatter — the right tool for conventions tied to a file *type or location* (e.g. all \`**/*.test.tsx\`). Rules activate from file paths; skills activate from the model's reading of the task.
- **Hooks** are **deterministic** shell commands that run before/after tool calls and can **block** them (exit code 2). They are guaranteed enforcement of policy. Skills are not event-driven and don't block — they inject capability/instructions. **If a rule must always hold, use a hook; if you want Claude to know *how* to do something well, use a skill.**
- **Subagents** are separate agent configurations with isolated context. Skills and subagents **compose**: a skill with \`context: fork\` runs *in* a subagent, and a custom subagent can use skills as reference material for expert, isolated delegation.
- **Custom slash commands** (\`.claude/commands/\`) are simpler prompt files. A skill's folder name also becomes a slash command, but skills are **richer** — frontmatter, bundled resources, progressive disclosure.

## Quick decision guide

> Always-on standards → **CLAUDE.md** · Conventions by file path → **\`.claude/rules/\`** · Guaranteed pre/post enforcement → **hooks** · Task-specific expertise Claude should invoke when relevant → **skills** · Isolated delegated work → **subagents** (often paired with a forked skill).`,
      keyTakeaways: [
        'CLAUDE.md = always on; .claude/rules/ = path-conditional; hooks = deterministic enforcement.',
        'Skills = model-invoked, task-specific expertise (they don’t block — hooks do).',
        'Subagents = isolation, and skills + subagents compose (context: fork runs in a subagent).',
        'A skill folder is also a slash command, but richer than a plain command file.',
      ],
      diagrams: [
        {
          kind: 'mermaid',
          title: 'Which mechanism? A decision guide',
          code: `flowchart TD
  Q{What do you need?} --> A[Standards that always apply]
  Q --> B[Conventions for a file type/path]
  Q --> C[A rule that MUST hold every time]
  Q --> D[Expertise Claude invokes when relevant]
  Q --> E[Isolated delegated work]
  A --> CM[CLAUDE.md]
  B --> RU[.claude/rules/ glob paths]
  C --> HK[Hook - blocks on exit 2]
  D --> SK[Skill - SKILL.md]
  E --> SA[Subagent + forked skill]`,
        },
      ],
      examRelevance: [
        { domainId: 'd3', taskId: 't3.2', label: 'Choosing skills vs CLAUDE.md vs rules vs commands' },
        { domainId: 'd1', taskId: 't1.5', label: 'Hooks for deterministic enforcement' },
      ],
    },
    {
      id: 'sharing-skills',
      moduleId: 'm8',
      title: 'Sharing Skills',
      summary: 'Distribute via version control, plugins/marketplace, manual install, or org-wide managed settings — and vet skills like software.',
      body: `Skills are designed to spread your team's expertise. Four distribution paths, from local to organization-wide:

- **Version control (team).** Put skills in the project's \`.claude/skills/\` and commit them; teammates get them on clone/pull. Claude Code **watches** skill directories, so adding or editing a \`SKILL.md\` under \`~/.claude/skills/\`, the project \`.claude/skills/\`, or a \`.claude/skills/\` in an \`--add-dir\` directory takes effect **within the current session**. Creating a *top-level skills directory that didn't exist at startup* requires a **restart** so it can be watched.
- **Plugins / marketplace (broad).** Add a \`.claude-plugin/plugin.json\` to a skill folder and it loads as a **plugin**, which can also bundle agents, hooks, and MCP servers. Install published plugins with \`/plugin install <name>@<marketplace>\` — e.g. \`/plugin install document-skills@anthropic-agent-skills\` from Anthropic's public skills marketplace.
- **Manual install.** Drop a skill folder into \`~/.claude/skills/\`.
- **Organization-wide.** Enterprise **managed settings** deploy skills across an org. Anthropic has added org-wide management, a directory of partner-built skills, and published Agent Skills as an **open standard** for cross-platform portability.

## In the Agent SDK

The Claude Agent SDK exposes the same support: load filesystem skills with \`setting_sources=["user", "project"]\` and include \`"Skill"\` in \`allowed_tools\`.

## Security matters here

Skills can **execute code** and may touch sensitive data, so treat installing a skill like **installing software** — only use trusted sources, and be especially careful before wiring third-party skills into production systems or anything with access to sensitive data.`,
      keyTakeaways: [
        'Commit to .claude/skills/ for the team; package as a plugin for broad reach; managed settings for org-wide.',
        'Edits to a SKILL.md apply within the session; a brand-new top-level skills dir needs a restart.',
        'The Agent SDK mirrors it: setting_sources=["user","project"] + "Skill" in allowed_tools.',
        'Skills run code — vet them like installing software, especially near sensitive data.',
      ],
      code: [
        {
          lang: 'bash',
          title: 'Installing a published skill plugin',
          code: `# Install from Anthropic's public skills marketplace
/plugin install document-skills@anthropic-agent-skills`,
        },
      ],
      examRelevance: [
        { domainId: 'd3', taskId: 't3.2', label: 'Project vs user vs org distribution of skills' },
        { domainId: 'd1', taskId: 't1.3', label: 'Agent SDK: setting_sources + "Skill" in allowed_tools' },
      ],
    },
    {
      id: 'troubleshooting-skills',
      moduleId: 'm8',
      title: 'Troubleshooting Skills',
      summary: 'Common failure modes — triggering (the description), YAML/frontmatter limits, selection conflicts, reload rules, runtime, context bloat.',
      body: `A practical diagnostic guide for the common failure modes.

- **Skill won't trigger.** Almost always **the description**. Make it specific and include *when* to use it plus the keywords a user would say. Then confirm the plumbing: the **\`Skill\` tool must be enabled** (in \`allowedTools\`), and the file must exist — check with \`ls .claude/skills/*/SKILL.md\` and \`ls ~/.claude/skills/*/SKILL.md\`.
- **Frontmatter / YAML errors.** Invalid YAML or missing required fields breaks loading. Constraints to respect: \`name\` ≤ **64 characters**, lowercase letters/numbers/hyphens only, no XML tags, and no reserved words (\`anthropic\`, \`claude\`); \`description\` non-empty and ≤ **1024 characters**.
- **Priority / selection conflicts.** When two skills match a request, near-identical descriptions cause the wrong one to load — **differentiate them** so each clearly states its distinct purpose (the same discipline used for distinguishing similar tools).
- **Changes not taking effect.** \`SKILL.md\` text edits apply within the session; a brand-new top-level skills directory needs a **restart**; for a skill that is also a plugin, changes to \`hooks/\`, \`.mcp.json\`, \`agents/\`, or output styles need **\`/reload-plugins\`**.
- **Runtime errors.** If a bundled script fails, check the script itself and make sure \`allowed-tools\` grants what it needs (e.g. \`Bash\`).
- **\`context: fork\` isn't isolating as expected.** Ensure an \`agent\` type is set, and remember the \`Explore\`/\`Plan\` agents deliberately skip \`CLAUDE.md\` and git status.
- **Context bloat.** If a skill eats too much context, move heavy material into \`references/\` and keep \`SKILL.md\` lean.`,
      keyTakeaways: [
        'Fix triggering by fixing the description (and enabling the Skill tool in allowedTools).',
        'Validate frontmatter: name ≤ 64 chars (lowercase/numbers/hyphens, no reserved words), description ≤ 1024.',
        'Disambiguate competing skills the way you disambiguate similar tools.',
        'Know the reload rules; scope allowed-tools to what bundled scripts actually need.',
      ],
      examRelevance: [
        { domainId: 'd2', taskId: 't2.1', label: 'Disambiguating near-identical descriptions' },
        { domainId: 'd3', taskId: 't3.2', label: 'Frontmatter validity and reload behavior' },
      ],
    },
  ],
}
