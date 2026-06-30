import type { BuildModule } from '../types'

export const m7: BuildModule = {
  id: 'm7',
  title: 'Claude Code & Agents',
  blurb:
    'Claude Code as a collaborative engineer — context (CLAUDE.md), plan/thinking modes, custom commands, MCP, GitHub, hooks, and the SDK — plus the workflow and agent patterns that underpin the Architect exam.',
  lessons: [
    {
      id: 'coding-assistant',
      moduleId: 'm7',
      title: 'What is a Coding Assistant?',
      summary: 'Tool use is what turns a text model into something that can act on a codebase.',
      body: `A **coding assistant** uses a language model to write code and complete development tasks. Its core process:

1. Receive a task (e.g. fix a bug from an error message).
2. The model **gathers context** (reads files, understands the codebase).
3. It **formulates a plan**.
4. It **takes action** (updates files, runs tests).

The key limitation: language models only process **text in, text out** — they can't directly read files, run commands, or touch external systems. The bridge is the **tool-use system**: the assistant appends instructions telling the model how to format action requests; the model responds with a formatted request; the assistant executes the real action and feeds results back for the final response.

## Why Claude

- Superior tool-use ability — better at understanding tool functions and combining them for complex tasks.
- **Extensible** — easy to add new tools.
- **Security** — direct code search rather than indexing that ships your codebase to external servers.

The takeaway: tool-use *quality* directly determines coding-assistant effectiveness. This is the same agentic loop from the Tool Use module, now pointed at a codebase — and it maps onto the exam's built-in tools (Read/Write/Edit/Bash/Grep/Glob).`,
      keyTakeaways: [
        'Models are text-only; tool use lets them read files, run commands, and act.',
        'Claude\'s tool-use strength and extensibility make it adaptable.',
        'Code search (not external indexing) is more secure.',
      ],
      examRelevance: [{ domainId: 'd2', taskId: 't2.5', label: 'Built-in tools: Read/Write/Edit/Bash/Grep/Glob' }],
    },
    {
      id: 'cc-in-action',
      moduleId: 'm7',
      title: 'Claude Code in Action',
      summary: 'Setup, /init, memory, and two effective prompting workflows.',
      body: `**Claude Code** is a terminal-based coding assistant that acts as a **collaborative engineer**, not just a code generator — handling project setup, feature design, writing code, testing, deployment, and fixing production errors. (It and **Computer Use** are Anthropic's two showcased apps; Claude Code is the agent-architecture example.)

## Setup

Install Node.js, run \`npm install\` to install Claude Code, then run \`claude\` to log in. Ask Claude to read the README and run setup. Run **\`/init\`** so Claude scans the codebase for architecture and style and creates a **CLAUDE.md** file that's automatically included as context in future requests.

## Two prompting workflows

**Method 1 — three-step:**
1. Identify relevant files; have Claude analyze them.
2. Describe the feature; have Claude **plan** a solution (no code yet).
3. Have Claude implement the plan.

**Method 2 — test-driven:**
1. Provide context.
2. Ask Claude to suggest tests.
3. Select and implement chosen tests.
4. Have Claude write code until tests pass.

## Demonstrated power

Claude optimized the **Chalk** library (429M weekly downloads) for a **3.9× throughput** improvement using benchmarks and profiling; ran churn analysis on streaming CSV data in Jupyter; and via the **Playwright MCP server** drove a browser to screenshot and iteratively restyle UI.

Core principle: **Claude Code is an effort multiplier** — more detailed instructions yield significantly better results. Treat it as a collaborator.`,
      keyTakeaways: [
        '/init creates CLAUDE.md, auto-included as context thereafter.',
        'Two workflows: analyze→plan→implement, and test-driven (tests→code-until-pass).',
        'It\'s an effort multiplier — detail in, quality out.',
      ],
      examRelevance: [{ domainId: 'd3', taskId: 't3.5', label: 'Test-driven iteration & interview pattern' }],
    },
    {
      id: 'cc-adding-context',
      moduleId: 'm7',
      title: 'Adding & Controlling Context',
      summary: 'CLAUDE.md hierarchy, the # memory shortcut, and @ file mentions.',
      body: `Context management is critical: too much irrelevant info **decreases** performance, so the goal is *just enough* relevant context.

## CLAUDE.md

The **\`/init\`** command analyzes the whole codebase on first run and creates **CLAUDE.md** with a project summary, architecture, and key files — included in every request. There are **three levels**:

- **Project level** — shared with the team, committed to source control.
- **Local level** — personal instructions, not committed.
- **Machine/user level** — global instructions across all projects.

## Shortcuts

- **\`#\` (memory mode)** — intelligently edit CLAUDE.md files with natural-language requests.
- **\`@\` (file mention)** — include specific files in a request, giving targeted context instead of letting Claude search.

Best practice: reference critical files (like a database schema) in CLAUDE.md so they're always available.

This is the builder's view of the exam's **CLAUDE.md hierarchy** (user/project/directory) and the diagnostic that a "missing" team rule usually lives at the wrong scope. The exam adds **\`@import\`** for modularity and **\`.claude/rules/\`** for topic-specific or path-scoped rules.`,
      keyTakeaways: [
        'Three CLAUDE.md levels: project (shared), local, machine/user (global).',
        '# edits memory in natural language; @ mentions specific files.',
        'Reference critical files in CLAUDE.md so they\'re always in context.',
      ],
      examRelevance: [
        { domainId: 'd3', taskId: 't3.1', label: 'CLAUDE.md hierarchy & scoping' },
        { domainId: 'd3', taskId: 't3.3', label: '.claude/rules/ path-scoped conventions' },
      ],
    },
    {
      id: 'cc-making-changes',
      moduleId: 'm7',
      title: 'Making Changes — Plan & Thinking Modes',
      summary: 'Plan mode handles breadth; thinking mode handles depth.',
      body: `Claude Code has two performance-boosting modes plus screenshot support.

- **Screenshots** — paste with **Control-V** (not Command-V on macOS) so Claude can see the exact UI element to change.
- **Plan Mode** — toggle with **Shift+Tab twice**. Claude researches more files and produces a detailed implementation plan *before* executing.
- **Thinking Mode** — triggered by phrases like "ultrathink"; gives Claude an extended reasoning budget for tricky logic.

## When to use which

- **Planning = breadth.** Multi-step tasks needing wide codebase understanding.
- **Thinking = depth.** Tricky logic or debugging a specific issue.
- They **combine** for complex tasks, and both consume extra tokens (a cost consideration).

Claude can also stage/commit changes with descriptive messages.

This is exactly the exam's **plan mode vs direct execution** decision (Domain 3): plan mode for large-scale, multi-file, architecturally significant work (sample Question 5's monolith→microservices); direct execution for small, well-scoped changes. The exam also adds the **Explore subagent** for isolating verbose discovery.`,
      keyTakeaways: [
        'Plan mode (Shift+Tab twice) = breadth/research before changes.',
        'Thinking mode (e.g. "ultrathink") = depth for tricky logic.',
        'Both cost extra tokens; combine for complex tasks.',
      ],
      examRelevance: [{ domainId: 'd3', taskId: 't3.4', label: 'Plan mode vs direct execution' }],
    },
    {
      id: 'cc-controlling-context',
      moduleId: 'm7',
      title: 'Controlling Context',
      summary: 'Escape, double-escape, /compact, and /clear to keep the session focused.',
      body: `Techniques to steer and prune the conversation:

- **Escape** — stop Claude mid-response to redirect. Press once to interrupt.
- **Escape + Memory** — powerful error prevention: stop Claude, then add a memory (via \`#\`) about a repeated mistake to prevent recurrence.
- **Double Escape** — conversation **rewind**: shows previous messages and lets you jump back to an earlier point, keeping relevant context and skipping irrelevant back-and-forth.
- **\`/compact\`** — summarizes the conversation history while **preserving Claude's learned knowledge** of the current task. Use when Claude has gained expertise but the conversation is cluttered.
- **\`/clear\`** — deletes the entire history for a fresh start. Use when switching to a completely unrelated task.

These maintain focus, reduce distracting context, preserve relevant knowledge, and prevent repeated errors — most valuable in long conversations and at task transitions.

On the exam this is the **context management** toolkit: **\`/compact\`** to reclaim context during long exploration, plus the broader practice of trimming verbose output and persisting key findings (scratchpad files) to fight context degradation and lost-in-the-middle.`,
      keyTakeaways: [
        'Escape interrupts; double-escape rewinds; # adds preventive memory.',
        '/compact summarizes but keeps task knowledge; /clear wipes for a new task.',
        'Used to keep long sessions focused — an exam context-management theme.',
      ],
      examRelevance: [
        { domainId: 'd5', taskId: 't5.4', label: '/compact and managing large-codebase context' },
        { domainId: 'd5', taskId: 't5.1', label: 'Trimming context to preserve key facts' },
      ],
    },
    {
      id: 'cc-custom-commands',
      moduleId: 'm7',
      title: 'Custom Commands',
      summary: 'Reusable slash commands defined as markdown files with $ARGUMENTS.',
      body: `**Custom commands** are user-defined automations invoked with a forward slash.

- **Location** — \`.claude/commands/\` in the project directory.
- **Naming** — the filename becomes the command name (\`audit.md\` → \`/audit\`).
- **Activation** — restart Claude Code after creating command files.
- **Structure** — a markdown file containing instructions for Claude to execute.
- **Arguments** — use the **\`$ARGUMENTS\`** placeholder to accept runtime parameters (file paths, descriptive text, etc.).

Use cases: automating repetitive tasks like dependency auditing, test generation, or fixing vulnerabilities. Invoke with \`/commandname\`, optionally followed by an argument string.

For the exam, remember the **scope rule** (sample Question 4): **\`.claude/commands/\`** is project-scoped and shared via version control; **\`~/.claude/commands/\`** is personal. The exam also pairs commands with **skills** (\`.claude/skills/\` + \`SKILL.md\` frontmatter: \`context: fork\`, \`allowed-tools\`, \`argument-hint\`).`,
      keyTakeaways: [
        'Commands live in .claude/commands/ as markdown; filename = command name.',
        'Use $ARGUMENTS for runtime parameters; restart to activate.',
        'Project scope = shared via git; user scope (~/.claude/commands/) = personal.',
      ],
      code: [
        {
          lang: 'markdown',
          title: '.claude/commands/audit.md',
          code: `Audit the dependencies in $ARGUMENTS for known vulnerabilities.
List each issue with its severity and a suggested fix.`,
        },
      ],
      examRelevance: [
        { domainId: 'd3', taskId: 't3.2', label: 'Custom commands & skills (project vs user scope)' },
      ],
    },
    {
      id: 'cc-mcp-servers',
      moduleId: 'm7',
      title: 'Extending Claude Code with MCP Servers',
      summary: 'claude mcp add wires external tools (e.g. Playwright) into Claude Code.',
      body: `Claude Code embeds an **MCP client**, so it can connect to MCP servers (local or remote) to expand its capabilities in real time without core modifications.

## Installation & permissions

- Add a server: \`claude mcp add [name] [start-command]\`.
- Restart Claude Code to access new capabilities.
- Initial tool use requires approval; auto-approve by adding \`"MCP__[servername]"\` (or the specific tool) to the **\`allow\` array** in \`settings.local.json\`.

## Example

The **Playwright MCP server** lets Claude control a browser: navigate to \`localhost:3000\`, generate a UI component, analyze its styling, then **automatically refine its own generation prompt** based on the visual feedback — producing markedly better styling.

Common use cases: production monitoring (Sentry), project management (Jira), communication (Slack), and custom workflow tools.

The exam extends this into **server scoping** — project-level **\`.mcp.json\`** (shared) vs user-level **\`~/.claude.json\`** (personal) — and **environment-variable expansion** (\`\${GITHUB_TOKEN}\`) so credentials never get committed.`,
      keyTakeaways: [
        'claude mcp add wires in external tools; restart to load them.',
        'Auto-approve tools via the allow array in settings.local.json.',
        'Exam: .mcp.json (project) vs ~/.claude.json (user) + env-var expansion.',
      ],
      examRelevance: [{ domainId: 'd2', taskId: 't2.4', label: 'MCP server scoping & env-var expansion' }],
    },
    {
      id: 'cc-github',
      moduleId: 'm7',
      title: 'GitHub Integration',
      summary: 'Claude Code inside GitHub Actions: @-mention tasks and automatic PR review.',
      body: `Claude Code's official **GitHub integration** runs Claude inside GitHub Actions.

## Setup

Run **\`/install github app\`**, install the Claude Code app on GitHub, add your API key. An auto-generated pull request adds two GitHub Actions.

## Default actions

1. **Mention support** — \`@claude\` in issues/PRs to assign tasks.
2. **PR review** — automatic code review on new pull requests.

## Customization

Actions are customizable via config files in \`.github/workflows\`. You can pass **custom instructions** (context/directions) and integrate **MCP servers** (e.g. Playwright for browser testing — spin up a dev server, let Claude visit the app, test functionality, and build checklists).

## Permissions

You must **explicitly list all permissions** for Claude Code in the actions, and **each MCP server tool requires individual permission listing** (no shortcuts).

This is the gateway to the exam's **CI/CD** domain — automated review, test generation, and PR feedback — where the **\`-p\` flag** and **\`--output-format json\`/\`--json-schema\`** become essential.`,
      keyTakeaways: [
        '/install github app adds @claude mention tasks and auto PR review.',
        'Customize via .github/workflows; integrate MCP servers for testing.',
        'Permissions must be explicit; each MCP tool listed individually.',
      ],
      examRelevance: [{ domainId: 'd3', taskId: 't3.6', label: 'Claude Code in CI/CD pipelines' }],
    },
    {
      id: 'cc-hooks',
      moduleId: 'm7',
      title: 'Hooks',
      summary: 'Commands that run before/after tools — block actions or feed back errors.',
      body: `**Hooks** are commands that run **before or after** Claude executes tools.

- **Pre-tool-use hooks** — run *before* execution; can **inspect and block** operations and send an error message to Claude.
- **Post-tool-use hooks** — run *after* execution; can't block, but can perform follow-up operations and provide feedback.

## How they work

Configured in the settings file (global/project/personal) via manual editing or the **\`/hooks\`** command. Each hook has a **matcher** (which tools to target, e.g. \`"read|grep"\`) and a **command** to run. The command:

1. Receives the tool call as **JSON via stdin** (session id, tool name, input, file path).
2. Parses it.
3. **Exits with a code**: \`0\` = allow; \`2\` = block (pre-hooks only). On exit 2, **stderr** is sent to Claude as feedback.

## Examples

- **Block sensitive files** — a pre-hook watching \`read|grep\` that exits 2 if the path includes \`.env\` (and logs why via \`console.error\`). Restart Claude after hook changes.
- **TypeScript type-check hook** — a post-hook running \`tsc --noEmit\` after edits; type errors are fed back so Claude fixes call sites automatically.
- **Duplicate-code prevention** — a post-hook that launches a *second* Claude instance (via the SDK) to review changes in a critical directory and, if it finds duplication, exits 2 with feedback so the original reuses existing code. Watch only critical directories to limit overhead.

Hooks are **automated feedback loops** that catch Claude's common weaknesses. On the exam, hooks are the tool for **deterministic guarantees** (PostToolUse normalization, tool-call interception to block policy violations) — the answer whenever a rule must hold *every* time, not *most* of the time.`,
      keyTakeaways: [
        'Pre-hooks can block (exit 2 → stderr to Claude); post-hooks give feedback.',
        'Matcher + command; tool call arrives as JSON on stdin.',
        'Exam: hooks give deterministic guarantees vs probabilistic prompting.',
      ],
      code: [
        {
          lang: 'javascript',
          title: 'A pre-tool-use hook blocking .env access',
          code: `// .claude/hooks/read_hook.js  (matcher: "read|grep")
let data = ''
process.stdin.on('data', (c) => (data += c))
process.stdin.on('end', () => {
  const { tool_input } = JSON.parse(data)
  const path = tool_input.file_path || tool_input.path || ''
  if (path.includes('.env')) {
    console.error('Blocked: .env files are off-limits.')
    process.exit(2)   // block + send stderr to Claude
  }
  process.exit(0)     // allow
})`,
        },
      ],
      examRelevance: [{ domainId: 'd1', taskId: 't1.5', label: 'Agent SDK hooks for interception & normalization' }],
    },
    {
      id: 'cc-sdk',
      moduleId: 'm7',
      title: 'The Claude Code SDK',
      summary: 'Programmatic Claude Code (CLI/TS/Python), read-only by default.',
      body: `The **Claude Code SDK** is a programmatic interface to Claude Code via CLI, TypeScript, or Python libraries — with the **same tools** as the terminal version.

- **Primary use case** — integrating Claude Code into larger pipelines/workflows to add intelligence to existing processes.
- **Default permissions** — **read-only** (files, directories, grep). Write permissions must be enabled manually, e.g. via \`options.allowTools\` (adding tools like \`"edit"\`) or \`.claude\` directory settings.
- **Output** — shows the raw, message-by-message conversation between local Claude Code and the model, with the final response as the last message.

Best suited for **helper commands, scripts, and hooks** inside existing projects rather than standalone use. (The duplicate-code-prevention hook from the previous lesson uses the SDK to launch a reviewing instance.)

This is the builder-facing cousin of the **Claude Agent SDK** the exam centers on — the SDK that exposes the **agentic loop**, **\`allowedTools\`**, **hooks**, and **\`Task\`-based subagent spawning**.`,
      keyTakeaways: [
        'The SDK exposes Claude Code\'s tools via CLI/TS/Python.',
        'Read-only by default; enable writes via allowTools/settings.',
        'Best for embedding intelligence into scripts, hooks, and pipelines.',
      ],
      examRelevance: [{ domainId: 'd1', taskId: 't1.3', label: 'allowedTools & subagent spawning (Agent SDK)' }],
    },
    {
      id: 'agents-and-workflows',
      moduleId: 'm7',
      title: 'Agents and Workflows',
      summary: 'Workflows for known steps; agents for unknown ones — plus evaluator-optimizer.',
      body: `**Workflows** and **agents** are two strategies for tasks Claude can't finish in a single request.

> Decision rule: use a **workflow** when you precisely understand the task and know the exact sequence of steps. Use an **agent** when the details are unclear.

A **workflow** is a series of Claude calls for a problem with predetermined steps.

## Example: image → 3D model converter

1. Claude describes the uploaded image in detail.
2. Claude uses the CADQuery Python library to model the object.
3. Render the model.
4. Claude compares the rendering to the original image.
5. If inaccurate, repeat from step 2 with feedback.

This is the **evaluator-optimizer** pattern:
- **Producer** — generates output (Claude + CADQuery).
- **Evaluator** — assesses quality (the comparison step).
- The loop continues until the evaluator accepts the output.

Key point: workflow *patterns* are implementation templates — identifying one doesn't implement it; you still write the code.

The diagram shows the **agentic loop** keyed on \`stop_reason\` — the spine of any agent.`,
      keyTakeaways: [
        'Workflow = known steps; agent = unknown steps.',
        'Evaluator-optimizer: producer generates, evaluator judges, loop until accepted.',
        'Patterns are templates — you still implement them.',
      ],
      diagrams: [
        {
          kind: 'mermaid',
          title: 'The agentic loop (stop_reason)',
          code: `flowchart TD
  Start([User task]) --> Call[Call Claude with tools]
  Call --> SR{stop_reason?}
  SR -- tool_use --> Run[Execute tool / append tool_result]
  Run --> Call
  SR -- end_turn --> Done([Final answer])`,
        },
      ],
      examRelevance: [
        { domainId: 'd1', taskId: 't1.1', label: 'Agentic loop control flow' },
        { domainId: 'd1', taskId: 't1.6', label: 'Fixed pipelines vs adaptive decomposition' },
      ],
    },
    {
      id: 'parallelization-workflows',
      moduleId: 'm7',
      title: 'Parallelization Workflows',
      summary: 'Split one complex task into parallel subtasks, then aggregate.',
      body: `A **parallelization workflow** breaks one complex task into multiple **simultaneous** subtasks, then aggregates the results.

> Example — material selection. Instead of one large prompt asking Claude to choose between metal/polymer/ceramic/composite against all criteria at once, run **separate parallel requests**, each evaluating one material's suitability, then a final **aggregation** step compares them.

Structure: **Input → multiple parallel subtasks → aggregator → final output.**

Benefits:
- **Focus** — each subtask handles one analysis instead of juggling many.
- **Modularity** — individual prompts can be improved/evaluated separately.
- **Scalability** — easy to add subtasks without affecting existing ones.
- **Quality** — reduces confusion from overly complex single prompts.

The principle: decompose complex decisions into specialized parallel analyses, then synthesize. This is the builder root of the exam's **parallel subagents** (the coordinator emits multiple \`Task\` calls in one response) — see the hub-and-spoke diagram in *Agents and Tools*.`,
      keyTakeaways: [
        'Parallelize independent subtasks, then aggregate.',
        'Gains: focus, modularity, scalability, quality.',
        'Maps to parallel subagents via multiple Task calls (exam).',
      ],
      diagrams: [
        {
          kind: 'mermaid',
          title: 'Parallelization + aggregation',
          code: `flowchart TD
  In[Input] --> A[Subtask A]
  In --> B[Subtask B]
  In --> C[Subtask C]
  A --> Agg[Aggregator]
  B --> Agg
  C --> Agg
  Agg --> Out[Final output]`,
        },
      ],
      examRelevance: [{ domainId: 'd1', taskId: 't1.2', label: 'Partitioning scope across parallel subagents' }],
    },
    {
      id: 'chaining-workflows',
      moduleId: 'm7',
      title: 'Chaining Workflows',
      summary: 'Sequential focused steps instead of one constraint-heavy prompt.',
      body: `A **chaining workflow** breaks a large task into a series of **distinct sequential steps** rather than one complex prompt — each call focuses on one subtask.

> Example: user enters a topic → search trending topics → Claude selects the most interesting → Claude researches it → Claude writes a script → generate video → post to social media.

Primary use case: when Claude **consistently ignores constraints** in a long prompt despite repetition — common with prompts full of "don't do X" requirements (don't mention AI, no emojis, professional tone). Claude violates some constraints no matter how you repeat them.

The chaining solution: **Step 1** — send the initial prompt, accept imperfect output. **Step 2** — a follow-up prompt asking Claude to rewrite based on the **specific violations** found.

The insight: even a trivial-seeming workflow becomes essential when a single pass can't satisfy many interacting constraints. This is the builder seed of the exam's **prompt chaining** decomposition (e.g. per-file review passes, sample Question 12).`,
      keyTakeaways: [
        'Chaining = sequential focused steps, each handling one subtask.',
        'Great when a single prompt drops constraints — split into generate + fix.',
        'Maps to the exam\'s prompt-chaining / multi-pass review.',
      ],
      examRelevance: [
        { domainId: 'd1', taskId: 't1.4', label: 'Enforcement & handoff in multi-step workflows' },
        { domainId: 'd1', taskId: 't1.6', label: 'Prompt chaining decomposition' },
      ],
    },
    {
      id: 'routing-workflows',
      moduleId: 'm7',
      title: 'Routing Workflows',
      summary: 'Categorize the input, then route to a specialized pipeline.',
      body: `A **routing workflow** categorizes user input to pick the right processing pipeline.

Mechanism: an initial Claude call **categorizes** the input into predefined genres; based on that category, the system routes to a **specialized pipeline** with customized prompts/tools.

> Example flow: user enters "Python functions" → Claude categorizes it as "educational" → the system uses an education-specific prompt template → Claude generates a script with an educational tone and structure.

Benefits: output matches the topic's nature. Programming topics get educational treatment (definitions, explanations); entertainment topics get trendy, engaging language.

Structure: **one routing step → multiple specialized pipelines**, each with prompts/tools tuned to its category.

This anticipates the exam's coordinator that **dynamically selects which subagents to invoke** based on query requirements, rather than always running the full pipeline.`,
      keyTakeaways: [
        'Routing classifies input, then dispatches to a specialized pipeline.',
        'Each pipeline has prompts/tools tuned to its category.',
        'Mirrors a coordinator choosing subagents by query type.',
      ],
      diagrams: [
        {
          kind: 'mermaid',
          title: 'Routing to specialized pipelines',
          code: `flowchart TD
  In[User input] --> R{Classify}
  R -- educational --> P1[Educational pipeline]
  R -- entertainment --> P2[Entertainment pipeline]
  R -- technical --> P3[Technical pipeline]`,
        },
      ],
      examRelevance: [{ domainId: 'd1', taskId: 't1.2', label: 'Coordinator dynamically selecting subagents' }],
    },
    {
      id: 'agents-and-tools',
      moduleId: 'm7',
      title: 'Agents and Tools',
      summary: 'Give agents abstract, composable tools — and route subagents through a coordinator.',
      body: `**Agents** create plans to complete tasks using provided tools — effective when the exact steps are unknown. **Workflows** are better when the steps are known.

Key differences: workflows need predetermined steps; agents **dynamically plan** with available tools. Agents are flexible across many tasks with one toolset and can combine tools in unexpected ways.

## The tool-abstraction principle

Provide **generic/abstract** tools, not hyper-specialized ones. Claude Code uses \`bash\`, \`web_fetch\`, \`file_write\` (abstract) rather than \`refactor_tool\`, \`install_dependencies\` (specialized). Abstract tools combine to solve a wide variety of tasks — e.g. \`get_current_datetime\` + \`add_duration\` + \`set_reminder\` cover many time-related needs.

Design approach: give the agent a **small set of flexible tools** it can piece together. This enables dynamic problem-solving and unexpected use cases.

> Exam nuance: this "small set" matters quantitatively — too many tools (18 vs 4–5) **degrades selection reliability**, and an agent with out-of-role tools misuses them.

For multi-agent systems, the exam's **hub-and-spoke** architecture routes *all* subagent communication through a coordinator (observability, consistent error handling, controlled information flow). Subagents don't talk to each other directly.`,
      keyTakeaways: [
        'Agents plan dynamically; give them abstract, composable tools.',
        'A small flexible toolset beats many specialized ones (and aids selection).',
        'Multi-agent: route everything through a coordinator (hub-and-spoke).',
      ],
      diagrams: [
        {
          kind: 'mermaid',
          title: 'Coordinator ↔ subagent hub-and-spoke',
          code: `flowchart TD
  C((Coordinator)) --> S1[Web search subagent]
  C --> S2[Document analysis subagent]
  C --> S3[Synthesis subagent]
  C --> S4[Report subagent]
  S1 -. results .-> C
  S2 -. results .-> C
  S3 -. results .-> C
  S4 -. results .-> C`,
        },
      ],
      examRelevance: [
        { domainId: 'd2', taskId: 't2.3', label: 'Tool distribution & least privilege' },
        { domainId: 'd1', taskId: 't1.2', label: 'Hub-and-spoke orchestration' },
      ],
    },
    {
      id: 'environment-inspection',
      moduleId: 'm7',
      title: 'Environment Inspection',
      summary: 'Agents check the results of their actions to understand and adapt.',
      body: `**Environment inspection** is agents evaluating their environment and the results of their actions to understand progress and handle errors.

Core idea: after each action, agents need feedback **beyond the basic tool return** to understand the new state.

Examples:
- **Computer use** — Claude takes a screenshot after every action (typing, clicking) to see how the environment changed, since it can't predict the exact result of, say, a button click.
- **Code editing** — before modifying a file, the agent reads its current contents to understand the existing state.
- **Social-media video agent** — uses Whisper CPP via bash to generate timestamped captions and verify dialogue placement, and FFmpeg to extract screenshots at intervals to inspect visual results, validating before posting.

The benefit: inspection lets agents gauge progress, detect errors, and adapt to unexpected results rather than operating blindly.

This is the builder counterpart of the exam's reliability themes — distinguishing real failures from valid-but-empty results, and verifying state before acting.`,
      keyTakeaways: [
        'Agents inspect action results to understand the new environment state.',
        'Screenshot-after-action and read-before-edit are canonical examples.',
        'Inspection enables error detection and adaptation, not blind operation.',
      ],
      examRelevance: [{ domainId: 'd5', taskId: 't5.2', label: 'Verifying state; distinguishing failure from empty results' }],
    },
    {
      id: 'workflows-vs-agents',
      moduleId: 'm7',
      title: 'Workflows vs Agents',
      summary: 'Prioritize reliable workflows; use agents only when flexibility is essential.',
      body: `A direct comparison.

- **Workflows** — pre-defined series of Claude calls with known exact steps.
- **Agents** — flexible, using basic tools that Claude combines to complete unknown tasks.

## Differences

- **Task division** — workflows break big tasks into specific subtasks → higher focus and accuracy. Agents handle varied challenges creatively without predetermined steps.
- **Testing/evaluation** — workflows are **easier to test** (known sequence). Agents are **harder** (unpredictable path).
- **User experience** — workflows require specific inputs. Agents create their own inputs from user queries and can request more when needed.
- **Success rates** — workflows have **higher** completion rates (structured). Agents have **lower** rates (delegated complexity).

## Recommendation

**Prioritize workflows for reliability.** Use agents only when flexibility is truly required. Users want products that work 100% of the time over "fancy" agents.

> Core principle: **solve problems reliably first, innovation second.**

This judgment — reliability over cleverness — runs through the entire Architect exam: deterministic enforcement over hopeful prompting, scoped tools over many, explicit criteria over vague instructions.`,
      keyTakeaways: [
        'Workflows: reliable, testable, structured. Agents: flexible but riskier.',
        'Default to workflows; reach for agents only when flexibility is essential.',
        'Reliability first, innovation second — the exam\'s through-line.',
      ],
      examRelevance: [{ domainId: 'd1', taskId: 't1.6', label: 'Choosing fixed pipelines vs adaptive agents' }],
    },
    {
      id: 'parallelizing-cc',
      moduleId: 'm7',
      title: 'Parallelizing Claude Code',
      summary: 'Run multiple Claude instances safely with git work trees.',
      body: `**Parallelizing Claude Code** means running multiple Claude instances simultaneously on different tasks.

The core problem: multiple instances modifying the **same files** at once creates conflicts and invalid code.

The solution: **git work trees** — a feature that creates complete project copies in separate directories, each tied to a different git branch, giving each instance an **isolated workspace**.

## Workflow

Create a work tree → assign a task to a Claude instance → it works in isolation → commit changes → merge back to main.

- **Custom commands** can automate work-tree creation/management via \`.claude/commands\` markdown files using the \`$ARGUMENTS\` placeholder.
- Claude **automatically resolves merge conflicts** during the merge.
- Claude handles **work-tree cleanup** after a feature completes.

The payoff: a single developer commands a virtual team of engineers — productivity scales with your capacity to manage simultaneous tasks.

This is the practical, file-isolation analogue of the exam's **session forking** (\`fork_session\`) for exploring divergent approaches from a shared baseline.`,
      keyTakeaways: [
        'Git work trees give each Claude instance an isolated workspace.',
        'Create → assign → work → commit → merge; Claude resolves conflicts and cleans up.',
        'Conceptually parallels fork_session for divergent exploration (exam).',
      ],
      examRelevance: [{ domainId: 'd1', taskId: 't1.7', label: 'fork_session for parallel exploration' }],
    },
    {
      id: 'automated-debugging',
      moduleId: 'm7',
      title: 'Automated Debugging',
      summary: 'A scheduled pipeline that finds production errors and opens fix PRs.',
      body: `**Automated debugging** uses Claude to detect, analyze, and fix production errors without manual intervention.

## Workflow

1. A **GitHub Action runs daily** to check production.
2. It **fetches CloudWatch logs** from the last 24 hours.
3. Claude **identifies errors and deduplicates** them.
4. Claude **analyzes each error and generates fixes**.
5. It **creates a pull request** with proposed solutions.

## Components

GitHub Actions (scheduling), AWS CLI (log retrieval), Claude Code (analysis + fixes), CloudWatch (monitoring).

## Benefits

Catches **production-only** errors (issues absent in dev), reduces manual log hunting, provides context-aware fixes with explanations, and produces reviewable PRs.

Common case: **configuration errors between environments** — invalid model IDs, API keys, etc. that work locally but fail in production.

This is a concrete instance of the exam's **CI/CD integration** domain (running Claude Code non-interactively with **\`-p\`**, structured JSON output for automated PR comments).`,
      keyTakeaways: [
        'Scheduled action → fetch logs → dedupe → analyze → open fix PR.',
        'Catches prod-only config errors that pass locally.',
        'A real CI/CD application of non-interactive Claude Code.',
      ],
      examRelevance: [{ domainId: 'd3', taskId: 't3.6', label: 'CI/CD: non-interactive Claude Code, structured output' }],
    },
    {
      id: 'computer-use',
      moduleId: 'm7',
      title: 'Computer Use',
      summary: 'Claude controls a screen via screenshots + actions in a Docker container.',
      outOfScope: true,
      outOfScopeNote: 'Computer use (browser/desktop automation) is explicitly OUT of scope for the Architect exam.',
      body: `**Computer use** is Claude's ability to interact with computer interfaces through visual observation and control actions.

## Capabilities

Takes screenshots, clicks buttons, types text, navigates interfaces, follows multi-step instructions autonomously, and performs QA testing/automation.

## How it works (it's just tool use)

Computer use follows the **identical tool-use flow**: a special (small) tool schema is sent to Claude and expands behind the scenes into a larger structure including an **action** function with arguments (mouse move, left click, screenshot, type, etc.). Claude sends a tool_use request; **developers fulfill it** via a computing environment — typically a **Docker container** that executes the programmatic key presses and mouse movements — and the result goes back to Claude.

Key point: **Claude doesn't directly manipulate the computer.** Computer use = the tool system + a developer-provided environment. Anthropic ships a reference implementation (a Docker container with pre-built mouse/keyboard code) you can run with Docker and a simple command.

Use cases: automated QA testing of web apps, UI interaction testing, repetitive task automation, and bug identification through systematic testing.`,
      keyTakeaways: [
        'Computer use is tool use: a schema with screenshot/click/type actions.',
        'Claude requests actions; a Docker environment executes them and returns results.',
        'Claude never touches the machine directly — the environment does.',
      ],
    },
  ],
}
