import type { Domain, ExamScenario, Exercise } from './types'

// Exam metadata reproduced from the official guide.
export const examMeta = {
  title: 'Claude Certified Architect – Foundations',
  format: 'Multiple choice — one correct response and three distractors per question.',
  scoring:
    'Scaled score 100–1,000. Minimum passing score is 720. Pass/fail designation against a standard set by subject-matter experts. Unanswered questions are scored as incorrect; there is no penalty for guessing.',
  scenarioNote:
    'The exam uses scenario-based questions. During the exam, 4 scenarios are presented, picked at random from the full set of 6.',
  version: 'Version 0.1 — Last Updated Feb 10 2025',
}

export const domains: Domain[] = [
  {
    id: 'd1',
    num: 1,
    title: 'Agentic Architecture & Orchestration',
    weight: 27,
    blurb:
      'The largest domain. Covers the agentic loop, coordinator–subagent orchestration, subagent spawning and context passing, workflow enforcement, Agent SDK hooks, task decomposition, and session state.',
    tasks: [
      {
        id: 't1.1',
        title: 'Design and implement agentic loops for autonomous task execution',
        knowledge: [
          'The agentic loop lifecycle: sending requests to Claude, inspecting stop_reason ("tool_use" vs "end_turn"), executing requested tools, and returning results for the next iteration',
          'How tool results are appended to conversation history so the model can reason about the next action',
          'The distinction between model-driven decision-making (Claude reasons about which tool to call next based on context) and pre-configured decision trees or tool sequences',
        ],
        skills: [
          'Implementing agentic loop control flow that continues when stop_reason is "tool_use" and terminates when stop_reason is "end_turn"',
          'Adding tool results to conversation context between iterations so the model can incorporate new information into its reasoning',
          'Avoiding anti-patterns such as parsing natural language signals to determine loop termination, setting arbitrary iteration caps as the primary stopping mechanism, or checking for assistant text content as a completion indicator',
        ],
        explanation:
          'The agentic loop is the single most important pattern on this exam. It is a `while` loop: call the model, look at `stop_reason`, and act. When `stop_reason === "tool_use"`, you run the requested tool(s), append a `tool_result` block (matched by `tool_use_id`) to the message history, and call the model again. When `stop_reason === "end_turn"`, the model has finished and you exit. The control signal is **structured metadata** (`stop_reason`), never the prose. The named anti-patterns all substitute a fragile signal for that reliable one: scanning the assistant’s text for phrases like "I am done", or capping iterations as the primary stop condition. An iteration cap is fine as a safety backstop, but it must not be the thing that decides the task is complete.',
        buildLinks: [
          { moduleId: 'm3', lessonId: 'implementing-multiple-turns', label: 'Implementing Multiple Turns' },
          { moduleId: 'm3', lessonId: 'multi-turn-tools', label: 'Multi-Turn Conversations with Tools' },
        ],
      },
      {
        id: 't1.2',
        title: 'Orchestrate multi-agent systems with coordinator-subagent patterns',
        knowledge: [
          'Hub-and-spoke architecture where a coordinator agent manages all inter-subagent communication, error handling, and information routing',
          'How subagents operate with isolated context—they do not inherit the coordinator’s conversation history automatically',
          'The role of the coordinator in task decomposition, delegation, result aggregation, and deciding which subagents to invoke based on query complexity',
          'Risks of overly narrow task decomposition by the coordinator, leading to incomplete coverage of broad research topics',
        ],
        skills: [
          'Designing coordinator agents that analyze query requirements and dynamically select which subagents to invoke rather than always routing through the full pipeline',
          'Partitioning research scope across subagents to minimize duplication (e.g., assigning distinct subtopics or source types to each agent)',
          'Implementing iterative refinement loops where the coordinator evaluates synthesis output for gaps, re-delegates to search and analysis subagents with targeted queries, and re-invokes synthesis until coverage is sufficient',
          'Routing all subagent communication through the coordinator for observability, consistent error handling, and controlled information flow',
        ],
        explanation:
          'In a hub-and-spoke design the **coordinator is the hub**: subagents never talk to each other directly, they report back to the coordinator, which routes information and handles errors centrally. This gives you observability and one place to enforce policy. The exam repeatedly tests the failure mode from sample Question 7: if the coordinator decomposes a broad topic too narrowly (e.g., "creative industries" → only digital art, graphic design, photography), the subagents will each succeed at their assigned slice yet the overall result misses whole domains. The fix lives in the coordinator’s decomposition and its iterative-refinement loop (detect coverage gaps, re-delegate), not in blaming a downstream subagent.',
        buildLinks: [
          { moduleId: 'm7', lessonId: 'parallelization-workflows', label: 'Parallelization Workflows' },
          { moduleId: 'm7', lessonId: 'workflows-vs-agents', label: 'Workflows vs Agents' },
        ],
      },
      {
        id: 't1.3',
        title: 'Configure subagent invocation, context passing, and spawning',
        knowledge: [
          'The Task tool as the mechanism for spawning subagents, and the requirement that allowedTools must include "Task" for a coordinator to invoke subagents',
          'That subagent context must be explicitly provided in the prompt—subagents do not automatically inherit parent context or share memory between invocations',
          'The AgentDefinition configuration including descriptions, system prompts, and tool restrictions for each subagent type',
          'Fork-based session management for exploring divergent approaches from a shared analysis baseline',
        ],
        skills: [
          'Including complete findings from prior agents directly in the subagent’s prompt (e.g., passing web search results and document analysis outputs to the synthesis subagent)',
          'Using structured data formats to separate content from metadata (source URLs, document names, page numbers) when passing context between agents to preserve attribution',
          'Spawning parallel subagents by emitting multiple Task tool calls in a single coordinator response rather than across separate turns',
          'Designing coordinator prompts that specify research goals and quality criteria rather than step-by-step procedural instructions, to enable subagent adaptability',
        ],
        explanation:
          'This is largely **exam-only** territory the builder notes do not cover, so learn it explicitly. In the Claude Agent SDK, a coordinator spawns subagents through the **`Task` tool** — and its `allowedTools` list must literally include `"Task"` or it cannot delegate. Each subagent is a fresh context: it does **not** inherit the coordinator’s history, so every fact it needs must be placed in its prompt. **Parallel** subagents are launched by emitting **multiple `Task` calls in one response** (not one per turn). An **`AgentDefinition`** declares each subagent type — its description, system prompt, and tool restrictions. Coordinator prompts should state goals and quality bars, not rigid step-by-step scripts, so subagents can adapt.',
        buildLinks: [{ moduleId: 'm7', lessonId: 'agents-and-tools', label: 'Agents and Tools' }],
      },
      {
        id: 't1.4',
        title: 'Implement multi-step workflows with enforcement and handoff patterns',
        knowledge: [
          'The difference between programmatic enforcement (hooks, prerequisite gates) and prompt-based guidance for workflow ordering',
          'When deterministic compliance is required (e.g., identity verification before financial operations), prompt instructions alone have a non-zero failure rate',
          'Structured handoff protocols for mid-process escalation that include customer details, root cause analysis, and recommended actions',
        ],
        skills: [
          'Implementing programmatic prerequisites that block downstream tool calls until prerequisite steps have completed (e.g., blocking process_refund until get_customer has returned a verified customer ID)',
          'Decomposing multi-concern customer requests into distinct items, then investigating each in parallel using shared context before synthesizing a unified resolution',
          'Compiling structured handoff summaries (customer ID, root cause, refund amount, recommended action) when escalating to human agents who lack access to the conversation transcript',
        ],
        explanation:
          'The central principle (tested by sample Question 1) is **deterministic vs probabilistic compliance**. When a step ordering is business-critical — verify identity before issuing a refund — prompt instructions are not enough, because even a well-prompted model fails some non-zero fraction of the time. A **programmatic prerequisite gate** (or a hook) that blocks `process_refund` until `get_customer` has returned a verified ID gives a guarantee prompting cannot. For escalation, build a **structured handoff summary** (customer ID, root cause, amount, recommended action) because the human receiving it has no access to the conversation transcript.',
        buildLinks: [{ moduleId: 'm7', lessonId: 'chaining-workflows', label: 'Chaining Workflows' }],
      },
      {
        id: 't1.5',
        title: 'Apply Agent SDK hooks for tool call interception and data normalization',
        knowledge: [
          'Hook patterns (e.g., PostToolUse) that intercept tool results for transformation before the model processes them',
          'Hook patterns that intercept outgoing tool calls to enforce compliance rules (e.g., blocking refunds above a threshold)',
          'The distinction between using hooks for deterministic guarantees versus relying on prompt instructions for probabilistic compliance',
        ],
        skills: [
          'Implementing PostToolUse hooks to normalize heterogeneous data formats (Unix timestamps, ISO 8601, numeric status codes) from different MCP tools before the agent processes them',
          'Implementing tool call interception hooks that block policy-violating actions (e.g., refunds exceeding $500) and redirect to alternative workflows (e.g., human escalation)',
          'Choosing hooks over prompt-based enforcement when business rules require guaranteed compliance',
        ],
        explanation:
          'Agent SDK hooks are deterministic interception points around tool calls. A **`PostToolUse`** hook fires after a tool returns and can transform the result before the model sees it — the canonical use is **normalizing heterogeneous formats** (one MCP tool returns Unix timestamps, another ISO-8601, another numeric status codes) into one shape so the agent reasons over consistent data. A **tool-call interception hook** fires before a call and can **block** a policy-violating action (e.g., a refund over $500) and redirect to escalation. The decision rule mirrors Task 1.4: when a rule must hold every time, use a hook, not a prompt.',
      },
      {
        id: 't1.6',
        title: 'Design task decomposition strategies for complex workflows',
        knowledge: [
          'When to use fixed sequential pipelines (prompt chaining) versus dynamic adaptive decomposition based on intermediate findings',
          'Prompt chaining patterns that break reviews into sequential steps (e.g., analyze each file individually, then run a cross-file integration pass)',
          'The value of adaptive investigation plans that generate subtasks based on what is discovered at each step',
        ],
        skills: [
          'Selecting task decomposition patterns appropriate to the workflow: prompt chaining for predictable multi-aspect reviews, dynamic decomposition for open-ended investigation tasks',
          'Splitting large code reviews into per-file local analysis passes plus a separate cross-file integration pass to avoid attention dilution',
          'Decomposing open-ended tasks (e.g., "add comprehensive tests to a legacy codebase") by first mapping structure, identifying high-impact areas, then creating a prioritized plan that adapts as dependencies are discovered',
        ],
        explanation:
          'Match the decomposition shape to how predictable the work is. When the steps are known up front (a multi-aspect code review), use **fixed prompt chaining**: a deterministic sequence of focused passes. When the work is open-ended (explore a legacy codebase and add tests), use **dynamic/adaptive decomposition**: map structure first, then generate subtasks from what you discover. Sample Question 12 is the chaining case — split a 14-file review into per-file local passes plus one cross-file integration pass to beat attention dilution.',
        buildLinks: [{ moduleId: 'm7', lessonId: 'agents-and-workflows', label: 'Agents and Workflows' }],
      },
      {
        id: 't1.7',
        title: 'Manage session state, resumption, and forking',
        knowledge: [
          'Named session resumption using --resume <session-name> to continue a specific prior conversation',
          'fork_session for creating independent branches from a shared analysis baseline to explore divergent approaches',
          'The importance of informing the agent about changes to previously analyzed files when resuming sessions after code modifications',
          'Why starting a new session with a structured summary is more reliable than resuming with stale tool results',
        ],
        skills: [
          'Using --resume with session names to continue named investigation sessions across work sessions',
          'Using fork_session to create parallel exploration branches (e.g., comparing two testing strategies or refactoring approaches from a shared codebase analysis)',
          'Choosing between session resumption (when prior context is mostly valid) and starting fresh with injected summaries (when prior tool results are stale)',
          'Informing a resumed session about specific file changes for targeted re-analysis rather than requiring full re-exploration',
        ],
        explanation:
          'Two distinct mechanisms, both **exam-only**. **`--resume <session-name>`** continues a specific named conversation later — useful for long investigations across work sessions. **`fork_session`** branches from a shared baseline so you can explore divergent approaches in parallel (e.g., two refactoring strategies) without one polluting the other. The judgment the exam tests: resume only when prior context is **still mostly valid**; when prior tool results are **stale** (files changed since), it is more reliable to start fresh and inject a structured summary, or at minimum tell the resumed session exactly which files changed so it re-analyses only those.',
      },
    ],
  },
  {
    id: 'd2',
    num: 2,
    title: 'Tool Design & MCP Integration',
    weight: 18,
    blurb:
      'Designing tool interfaces and descriptions, structured MCP error responses, distributing tools across agents, configuring MCP servers, and using the built-in tools (Read/Write/Edit/Bash/Grep/Glob).',
    tasks: [
      {
        id: 't2.1',
        title: 'Design effective tool interfaces with clear descriptions and boundaries',
        knowledge: [
          'Tool descriptions as the primary mechanism LLMs use for tool selection; minimal descriptions lead to unreliable selection among similar tools',
          'The importance of including input formats, example queries, edge cases, and boundary explanations in tool descriptions',
          'How ambiguous or overlapping tool descriptions cause misrouting (e.g., analyze_content vs analyze_document with near-identical descriptions)',
          'The impact of system prompt wording on tool selection: keyword-sensitive instructions can create unintended tool associations',
        ],
        skills: [
          'Writing tool descriptions that clearly differentiate each tool’s purpose, expected inputs, outputs, and when to use it versus similar alternatives',
          'Renaming tools and updating descriptions to eliminate functional overlap (e.g., renaming analyze_content to extract_web_results with a web-specific description)',
          'Splitting generic tools into purpose-specific tools with defined input/output contracts (e.g., splitting a generic analyze_document into extract_data_points, summarize_content, and verify_claim_against_source)',
          'Reviewing system prompts for keyword-sensitive instructions that might override well-written tool descriptions',
        ],
        explanation:
          'The model selects tools almost entirely from their **descriptions**, so the description is the interface. Sample Question 2 makes the point: two tools with one-line descriptions and similar inputs get confused; the highest-leverage fix is to expand each description with input formats, example queries, edge cases, and explicit "use this vs. that" boundaries. When overlap persists, **rename** for specificity (`analyze_content` → `extract_web_results`) or **split** a vague tool into purpose-specific tools with clear contracts. Watch the system prompt too: keyword-heavy wording can create unintended tool associations that override good descriptions.',
        buildLinks: [{ moduleId: 'm3', lessonId: 'tool-schemas', label: 'Tool Schemas' }],
      },
      {
        id: 't2.2',
        title: 'Implement structured error responses for MCP tools',
        knowledge: [
          'The MCP isError flag pattern for communicating tool failures back to the agent',
          'The distinction between transient errors (timeouts, service unavailability), validation errors (invalid input), business errors (policy violations), and permission errors',
          'Why uniform error responses (generic "Operation failed") prevent the agent from making appropriate recovery decisions',
          'The difference between retryable and non-retryable errors, and how returning structured metadata prevents wasted retry attempts',
        ],
        skills: [
          'Returning structured error metadata including errorCategory (transient/validation/permission), isRetryable boolean, and human-readable descriptions',
          'Including retriable: false flags and customer-friendly explanations for business rule violations so the agent can communicate appropriately',
          'Implementing local error recovery within subagents for transient failures, propagating to the coordinator only errors that cannot be resolved locally along with partial results and what was attempted',
          'Distinguishing between access failures (needing retry decisions) and valid empty results (representing successful queries with no matches)',
        ],
        explanation:
          'A tool failure is information the agent must reason over, so it must be **structured**, not a generic "Operation failed". MCP signals failure with the **`isError`** flag; alongside it, return metadata: an **`errorCategory`** (transient / validation / business / permission), an **`isRetryable`** boolean, and a human-readable description. This lets the agent act correctly — retry a transient timeout, but explain (not retry) a business-rule violation. A crucial distinction: an **access failure** (timeout) is not the same as a **valid empty result** (the query succeeded, there were just no matches); collapsing them causes wrong recovery. This connects to multi-agent error propagation in Domain 5.',
        buildLinks: [{ moduleId: 'm3', lessonId: 'sending-tool-results', label: 'Sending Tool Results' }],
      },
      {
        id: 't2.3',
        title: 'Distribute tools appropriately across agents and configure tool choice',
        knowledge: [
          'The principle that giving an agent access to too many tools (e.g., 18 instead of 4-5) degrades tool selection reliability by increasing decision complexity',
          'Why agents with tools outside their specialization tend to misuse them (e.g., a synthesis agent attempting web searches)',
          'Scoped tool access: giving agents only the tools needed for their role, with limited cross-role tools for specific high-frequency needs',
          'tool_choice configuration options: "auto", "any", and forced tool selection ({"type": "tool", "name": "..."})',
        ],
        skills: [
          'Restricting each subagent’s tool set to those relevant to its role, preventing cross-specialization misuse',
          'Replacing generic tools with constrained alternatives (e.g., replacing fetch_url with load_document that validates document URLs)',
          'Providing scoped cross-role tools for high-frequency needs (e.g., a verify_fact tool for the synthesis agent) while routing complex cases through the coordinator',
          'Using tool_choice forced selection to ensure a specific tool is called first (e.g., forcing extract_metadata before enrichment tools), then processing subsequent steps in follow-up turns',
          'Setting tool_choice: "any" to guarantee the model calls a tool rather than returning conversational text',
        ],
        explanation:
          'Fewer, well-scoped tools beat a large pile. Past roughly a handful, extra tools degrade selection reliability by inflating decision complexity, and an agent given tools outside its role tends to misuse them (the synthesis agent that starts doing web searches). Apply **least privilege**: give each subagent only what its role needs, plus a narrow scoped tool for a genuine high-frequency cross-role need — this is exactly sample Question 9’s `verify_fact` answer. Know the three **`tool_choice`** modes: **`"auto"`** (model may answer in text or call a tool), **`"any"`** (must call some tool — use to guarantee structured output), and **forced** `{"type":"tool","name":"..."}` (must call that specific tool — use to run, say, `extract_metadata` first).',
        buildLinks: [
          { moduleId: 'm3', lessonId: 'tools-for-structured-data', label: 'Tools for Structured Data' },
          { moduleId: 'm3', lessonId: 'using-multiple-tools', label: 'Using Multiple Tools' },
        ],
      },
      {
        id: 't2.4',
        title: 'Integrate MCP servers into Claude Code and agent workflows',
        knowledge: [
          'MCP server scoping: project-level (.mcp.json) for shared team tooling vs user-level (~/.claude.json) for personal/experimental servers',
          'Environment variable expansion in .mcp.json (e.g., ${GITHUB_TOKEN}) for credential management without committing secrets',
          'That tools from all configured MCP servers are discovered at connection time and available simultaneously to the agent',
          'MCP resources as a mechanism for exposing content catalogs (e.g., issue summaries, documentation hierarchies, database schemas) to reduce exploratory tool calls',
        ],
        skills: [
          'Configuring shared MCP servers in project-scoped .mcp.json with environment variable expansion for authentication tokens',
          'Configuring personal/experimental MCP servers in user-scoped ~/.claude.json',
          'Enhancing MCP tool descriptions to explain capabilities and outputs in detail, preventing the agent from preferring built-in tools (like Grep) over more capable MCP tools',
          'Choosing existing community MCP servers over custom implementations for standard integrations (e.g., Jira), reserving custom servers for team-specific workflows',
          'Exposing content catalogs as MCP resources to give agents visibility into available data without requiring exploratory tool calls',
        ],
        explanation:
          'Scope decides sharing: a project-level **`.mcp.json`** is committed so the whole team gets the same servers, while user-level **`~/.claude.json`** holds personal/experimental servers. Keep secrets out of source control with **environment-variable expansion** like `${GITHUB_TOKEN}`. All configured servers are discovered at connection time and their tools are available simultaneously. Two adoption tips: write rich tool descriptions so the agent prefers a capable MCP tool over a built-in like Grep, and expose **MCP resources** as content catalogs (issue lists, schemas, doc trees) so the agent can see what exists without burning exploratory tool calls.',
        buildLinks: [
          { moduleId: 'm6', lessonId: 'mcp-defining-resources', label: 'Defining Resources (MCP)' },
          { moduleId: 'm7', lessonId: 'cc-mcp-servers', label: 'Extending Claude Code with MCP Servers' },
        ],
      },
      {
        id: 't2.5',
        title: 'Select and apply built-in tools (Read, Write, Edit, Bash, Grep, Glob) effectively',
        knowledge: [
          'Grep for content search (searching file contents for patterns like function names, error messages, or import statements)',
          'Glob for file path pattern matching (finding files by name or extension patterns)',
          'Read/Write for full file operations; Edit for targeted modifications using unique text matching',
          'When Edit fails due to non-unique text matches, using Read + Write as a fallback for reliable file modifications',
        ],
        skills: [
          'Selecting Grep for searching code content across a codebase (e.g., finding all callers of a function, locating error messages)',
          'Selecting Glob for finding files matching naming patterns (e.g., **/*.test.tsx)',
          'Using Read to load full file contents followed by Write when Edit cannot find unique anchor text',
          'Building codebase understanding incrementally: starting with Grep to find entry points, then using Read to follow imports and trace flows, rather than reading all files upfront',
          'Tracing function usage across wrapper modules by first identifying all exported names, then searching for each name across the codebase',
        ],
        explanation:
          'Know which built-in tool fits which job. **Grep** searches file *contents* (function names, error strings, imports); **Glob** matches file *paths/names* (`**/*.test.tsx`). **Read/Write** handle whole files; **Edit** does targeted edits but needs a **unique** anchor string — when the anchor is not unique, fall back to Read-then-Write. The strategic skill is incremental exploration: Grep to entry points, Read to follow imports and trace flows, rather than reading everything up front (which exhausts context).',
        buildLinks: [{ moduleId: 'm7', lessonId: 'coding-assistant', label: 'What is a Coding Assistant?' }],
      },
    ],
  },
  {
    id: 'd3',
    num: 3,
    title: 'Claude Code Configuration & Workflows',
    weight: 20,
    blurb:
      'CLAUDE.md hierarchy and modular organization, custom slash commands and skills, path-specific rules, plan mode vs direct execution, iterative refinement, and CI/CD integration.',
    tasks: [
      {
        id: 't3.1',
        title: 'Configure CLAUDE.md files with appropriate hierarchy, scoping, and modular organization',
        knowledge: [
          'The CLAUDE.md configuration hierarchy: user-level (~/.claude/CLAUDE.md), project-level (.claude/CLAUDE.md or root CLAUDE.md), and directory-level (subdirectory CLAUDE.md files)',
          'That user-level settings apply only to that user—instructions in ~/.claude/CLAUDE.md are not shared with teammates via version control',
          'The @import syntax for referencing external files to keep CLAUDE.md modular (e.g., importing specific standards files relevant to each package)',
          '.claude/rules/ directory for organizing topic-specific rule files as an alternative to a monolithic CLAUDE.md',
        ],
        skills: [
          'Diagnosing configuration hierarchy issues (e.g., a new team member not receiving instructions because they’re in user-level rather than project-level configuration)',
          'Using @import to selectively include relevant standards files in each package’s CLAUDE.md based on maintainer domain knowledge',
          'Splitting large CLAUDE.md files into focused topic-specific files in .claude/rules/ (e.g., testing.md, api-conventions.md, deployment.md)',
          'Using the /memory command to verify which memory files are loaded and diagnose inconsistent behavior across sessions',
        ],
        explanation:
          'CLAUDE.md is layered: **user-level** (`~/.claude/CLAUDE.md`, personal, *not* shared via git), **project-level** (`.claude/CLAUDE.md` or root `CLAUDE.md`, committed, shared with the team), and **directory-level** (a CLAUDE.md inside a subdirectory). The classic diagnostic (a teammate "isn’t getting" a rule) is almost always a **scope** mistake — the rule lives in user-level config instead of project-level. Keep files modular with **`@import`** to pull in standards files, or split a bloated CLAUDE.md into topic files under **`.claude/rules/`**. Use **`/memory`** to see exactly which memory files are currently loaded.',
        buildLinks: [{ moduleId: 'm7', lessonId: 'cc-adding-context', label: 'Adding & Controlling Context' }],
      },
      {
        id: 't3.2',
        title: 'Create and configure custom slash commands and skills',
        knowledge: [
          'Project-scoped commands in .claude/commands/ (shared via version control) vs user-scoped commands in ~/.claude/commands/ (personal)',
          'Skills in .claude/skills/ with SKILL.md files that support frontmatter configuration including context: fork, allowed-tools, and argument-hint',
          'The context: fork frontmatter option for running skills in an isolated sub-agent context, preventing skill outputs from polluting the main conversation',
          'Personal skill customization: creating personal variants in ~/.claude/skills/ with different names to avoid affecting teammates',
        ],
        skills: [
          'Creating project-scoped slash commands in .claude/commands/ for team-wide availability via version control',
          'Using context: fork to isolate skills that produce verbose output (e.g., codebase analysis) or exploratory context (e.g., brainstorming alternatives) from the main session',
          'Configuring allowed-tools in skill frontmatter to restrict tool access during skill execution (e.g., limiting to file write operations to prevent destructive actions)',
          'Using argument-hint frontmatter to prompt developers for required parameters when they invoke the skill without arguments',
          'Choosing between skills (on-demand invocation for task-specific workflows) and CLAUDE.md (always-loaded universal standards)',
        ],
        explanation:
          'Same scope rule as CLAUDE.md: **`.claude/commands/`** is project-scoped and shared via git (sample Question 4’s answer); **`~/.claude/commands/`** is personal. **Skills** live in **`.claude/skills/`** as `SKILL.md` files with frontmatter: **`context: fork`** runs the skill in an isolated sub-agent so its verbose output never pollutes the main conversation; **`allowed-tools`** restricts what the skill may do; **`argument-hint`** prompts for parameters when invoked bare. The design choice to remember: **skills** are invoked on demand for specific workflows, while **CLAUDE.md** is always-loaded universal context — don’t put always-needed standards in a skill, and don’t bloat CLAUDE.md with niche task workflows.',
        buildLinks: [
          { moduleId: 'm7', lessonId: 'cc-custom-commands', label: 'Custom Commands' },
          { moduleId: 'm8', lessonId: 'config-multi-file-skills', label: 'Skills: Configuration & Multi-File' },
          { moduleId: 'm8', lessonId: 'skills-vs-features', label: 'Skills vs. Other Features' },
        ],
      },
      {
        id: 't3.3',
        title: 'Apply path-specific rules for conditional convention loading',
        knowledge: [
          '.claude/rules/ files with YAML frontmatter paths fields containing glob patterns for conditional rule activation',
          'How path-scoped rules load only when editing matching files, reducing irrelevant context and token usage',
          'The advantage of glob-pattern rules over directory-level CLAUDE.md files for conventions that span multiple directories (e.g., test files spread throughout a codebase)',
        ],
        skills: [
          'Creating .claude/rules/ files with YAML frontmatter path scoping (e.g., paths: ["terraform/**/*"]) so rules load only when editing matching files',
          'Using glob patterns in path-specific rules to apply conventions to files by type regardless of directory location (e.g., **/*.test.tsx for all test files)',
          'Choosing path-specific rules over subdirectory CLAUDE.md files when conventions must apply to files spread across the codebase',
        ],
        explanation:
          'A **`.claude/rules/`** file carries YAML frontmatter with a **`paths`** glob list (e.g., `paths: ["terraform/**/*"]`); the rule loads **only** when the file being edited matches, which keeps irrelevant context and tokens out of the session. This is sample Question 6’s answer and its key advantage: a **glob pattern like `**/*.test.tsx` follows files by type wherever they live**, whereas a directory-level CLAUDE.md only applies to one folder. When conventions must span scattered files (tests next to their components throughout the tree), path-scoped rules beat per-directory CLAUDE.md files.',
        buildLinks: [{ moduleId: 'm7', lessonId: 'cc-custom-commands', label: 'Custom Commands' }],
      },
      {
        id: 't3.4',
        title: 'Determine when to use plan mode vs direct execution',
        knowledge: [
          'Plan mode is designed for complex tasks involving large-scale changes, multiple valid approaches, architectural decisions, and multi-file modifications',
          'Direct execution is appropriate for simple, well-scoped changes (e.g., adding a single validation check to one function)',
          'Plan mode enables safe codebase exploration and design before committing to changes, preventing costly rework',
          'The Explore subagent for isolating verbose discovery output and returning summaries to preserve main conversation context',
        ],
        skills: [
          'Selecting plan mode for tasks with architectural implications (e.g., microservice restructuring, library migrations affecting 45+ files, choosing between integration approaches with different infrastructure requirements)',
          'Selecting direct execution for well-understood changes with clear scope (e.g., a single-file bug fix with a clear stack trace, adding a date validation conditional)',
          'Using the Explore subagent for verbose discovery phases to prevent context window exhaustion during multi-phase tasks',
          'Combining plan mode for investigation with direct execution for implementation (e.g., planning a library migration, then executing the planned approach)',
        ],
        explanation:
          'Choose by **complexity and uncertainty**. Plan mode is for large-scale, multi-file, architecturally significant work with multiple valid approaches (sample Question 5’s monolith→microservices) — it lets Claude explore and design before touching code, avoiding costly rework. Direct execution fits small, well-scoped changes with a clear target (a one-file bug fix from a stack trace). The two combine: plan the migration, then execute it directly. For noisy discovery phases, delegate to the **Explore subagent** so verbose output stays out of the main context and only a summary returns.',
        buildLinks: [{ moduleId: 'm7', lessonId: 'cc-making-changes', label: 'Making Changes (Plan & Thinking)' }],
      },
      {
        id: 't3.5',
        title: 'Apply iterative refinement techniques for progressive improvement',
        knowledge: [
          'Concrete input/output examples as the most effective way to communicate expected transformations when prose descriptions are interpreted inconsistently',
          'Test-driven iteration: writing test suites first, then iterating by sharing test failures to guide progressive improvement',
          'The interview pattern: having Claude ask questions to surface considerations the developer may not have anticipated before implementing',
          'When to provide all issues in a single message (interacting problems) versus fixing them sequentially (independent problems)',
        ],
        skills: [
          'Providing 2-3 concrete input/output examples to clarify transformation requirements when natural language descriptions produce inconsistent results',
          'Writing test suites covering expected behavior, edge cases, and performance requirements before implementation, then iterating by sharing test failures',
          'Using the interview pattern to surface design considerations (e.g., cache invalidation strategies, failure modes) before implementing solutions in unfamiliar domains',
          'Providing specific test cases with example input and expected output to fix edge case handling (e.g., null values in migration scripts)',
          'Addressing multiple interacting issues in a single detailed message when fixes interact, versus sequential iteration for independent issues',
        ],
        explanation:
          'When prose is interpreted inconsistently, **show, don’t tell**: 2–3 concrete input/output examples pin down the transformation far better than more adjectives. **Test-driven iteration** writes the suite first, then feeds failures back as the improvement signal. The **interview pattern** has Claude ask you clarifying questions before coding to surface considerations you hadn’t flagged (cache invalidation, failure modes) — valuable in unfamiliar domains. And batch fixes by dependency: **interacting** issues go in one message so fixes are coordinated; **independent** issues are cleaner to fix sequentially.',
        buildLinks: [
          { moduleId: 'm2', lessonId: 'providing-examples', label: 'Providing Examples' },
          { moduleId: 'm7', lessonId: 'cc-in-action', label: 'Claude Code in Action' },
        ],
      },
      {
        id: 't3.6',
        title: 'Integrate Claude Code into CI/CD pipelines',
        knowledge: [
          'The -p (or --print) flag for running Claude Code in non-interactive mode in automated pipelines',
          '--output-format json and --json-schema CLI flags for enforcing structured output in CI contexts',
          'CLAUDE.md as the mechanism for providing project context (testing standards, fixture conventions, review criteria) to CI-invoked Claude Code',
          'Session context isolation: why the same Claude session that generated code is less effective at reviewing its own changes compared to an independent review instance',
        ],
        skills: [
          'Running Claude Code in CI with the -p flag to prevent interactive input hangs',
          'Using --output-format json with --json-schema to produce machine-parseable structured findings for automated posting as inline PR comments',
          'Including prior review findings in context when re-running reviews after new commits, instructing Claude to report only new or still-unaddressed issues to avoid duplicate comments',
          'Providing existing test files in context so test generation avoids suggesting duplicate scenarios already covered by the test suite',
          'Documenting testing standards, valuable test criteria, and available fixtures in CLAUDE.md to improve test generation quality and reduce low-value test output',
        ],
        explanation:
          'CI is non-interactive, so the **`-p` / `--print`** flag is mandatory — it processes the prompt, prints to stdout, and exits instead of waiting for input (sample Question 10). For machine-parseable findings (posting inline PR comments), combine **`--output-format json`** with **`--json-schema`**. Feed project context through **CLAUDE.md** (testing standards, fixtures, review criteria) so CI runs match team conventions. And respect **session isolation**: the session that *wrote* the code is a poor reviewer of it because it carries the generation reasoning — use an independent instance for review (ties into Domain 4’s multi-instance review).',
        buildLinks: [{ moduleId: 'm7', lessonId: 'automated-debugging', label: 'Automated Debugging' }],
      },
    ],
  },
  {
    id: 'd4',
    num: 4,
    title: 'Prompt Engineering & Structured Output',
    weight: 20,
    blurb:
      'Explicit criteria to cut false positives, few-shot prompting, enforcing structured output with tool_use + JSON schemas, validation/retry loops, batch processing, and multi-pass review architectures.',
    tasks: [
      {
        id: 't4.1',
        title: 'Design prompts with explicit criteria to improve precision and reduce false positives',
        knowledge: [
          'The importance of explicit criteria over vague instructions (e.g., "flag comments only when claimed behavior contradicts actual code behavior" vs "check that comments are accurate")',
          'How general instructions like "be conservative" or "only report high-confidence findings" fail to improve precision compared to specific categorical criteria',
          'The impact of false positive rates on developer trust: high false positive categories undermine confidence in accurate categories',
        ],
        skills: [
          'Writing specific review criteria that define which issues to report (bugs, security) versus skip (minor style, local patterns) rather than relying on confidence-based filtering',
          'Temporarily disabling high false-positive categories to restore developer trust while improving prompts for those categories',
          'Defining explicit severity criteria with concrete code examples for each severity level to achieve consistent classification',
        ],
        explanation:
          'Precision comes from **specific categorical criteria**, not vague hedges. "Be conservative" or "only high-confidence findings" don’t move the needle; "flag a comment only when the claimed behavior contradicts the actual code behavior" does. This matters because **false positives are contagious to trust** — one noisy category makes developers distrust the accurate ones. Practical moves: define exactly which categories to report vs skip, attach concrete code examples to each severity level, and temporarily disable a high-false-positive category while you fix its prompt rather than letting it poison adoption.',
        buildLinks: [{ moduleId: 'm2', lessonId: 'being-specific', label: 'Being Specific' }],
      },
      {
        id: 't4.2',
        title: 'Apply few-shot prompting to improve output consistency and quality',
        knowledge: [
          'Few-shot examples as the most effective technique for achieving consistently formatted, actionable output when detailed instructions alone produce inconsistent results',
          'The role of few-shot examples in demonstrating ambiguous-case handling (e.g., tool selection for ambiguous requests, branch-level test coverage gaps)',
          'How few-shot examples enable the model to generalize judgment to novel patterns rather than matching only pre-specified cases',
          'The effectiveness of few-shot examples for reducing hallucination in extraction tasks (e.g., handling informal measurements, varied document structures)',
        ],
        skills: [
          'Creating 2-4 targeted few-shot examples for ambiguous scenarios that show reasoning for why one action was chosen over plausible alternatives',
          'Including few-shot examples that demonstrate specific desired output format (location, issue, severity, suggested fix) to achieve consistency',
          'Providing few-shot examples distinguishing acceptable code patterns from genuine issues to reduce false positives while enabling generalization',
          'Using few-shot examples to demonstrate correct handling of varied document structures (inline citations vs bibliographies, methodology sections vs embedded details)',
          'Adding few-shot examples showing correct extraction from documents with varied formats to address empty/null extraction of required fields',
        ],
        explanation:
          'Few-shot examples are the most reliable way to get consistent, well-formatted, actionable output when instructions alone waver. The exam stresses that good examples **show the reasoning** for picking one action over plausible alternatives — that is what lets the model **generalize** judgment to novel cases instead of pattern-matching only the examples. Use 2–4 targeted examples for ambiguous scenarios, demonstrate the exact output shape (location, issue, severity, suggested fix), and include examples that distinguish acceptable patterns from genuine issues to cut false positives. For extraction, examples covering varied document structures reduce hallucination and empty-field errors.',
        buildLinks: [{ moduleId: 'm2', lessonId: 'providing-examples', label: 'Providing Examples' }],
      },
      {
        id: 't4.3',
        title: 'Enforce structured output using tool use and JSON schemas',
        knowledge: [
          'Tool use (tool_use) with JSON schemas as the most reliable approach for guaranteed schema-compliant structured output, eliminating JSON syntax errors',
          'The distinction between tool_choice: "auto" (model may return text instead of calling a tool), "any" (model must call a tool but can choose which), and forced tool selection (model must call a specific named tool)',
          'That strict JSON schemas via tool use eliminate syntax errors but do not prevent semantic errors (e.g., line items that don’t sum to total, values in wrong fields)',
          'Schema design considerations: required vs optional fields, enum fields with "other" + detail string patterns for extensible categories',
        ],
        skills: [
          'Defining extraction tools with JSON schemas as input parameters and extracting structured data from the tool_use response',
          'Setting tool_choice: "any" to guarantee structured output when multiple extraction schemas exist and the document type is unknown',
          'Forcing a specific tool with tool_choice: {"type": "tool", "name": "extract_metadata"} to ensure a particular extraction runs before enrichment steps',
          'Designing schema fields as optional (nullable) when source documents may not contain the information, preventing the model from fabricating values to satisfy required fields',
          'Adding enum values like "unclear" for ambiguous cases and "other" + detail fields for extensible categorization',
          'Including format normalization rules in prompts alongside strict output schemas to handle inconsistent source formatting',
        ],
        explanation:
          'For guaranteed schema-compliant output, define a **tool with a JSON schema** and read the structured data from the `tool_use` block — this eliminates JSON *syntax* errors entirely. But it does **not** prevent *semantic* errors (line items not summing to the total, a value in the wrong field), so still validate meaning. Pair the schema with the right **`tool_choice`**: `"any"` when several extraction schemas exist and you just need *some* structured call; forced selection to run a specific extractor first. Design schemas defensively: make fields the document may lack **nullable** so the model returns `null` instead of fabricating, and use **`"other"` + detail** / `"unclear"` enums for extensible or ambiguous categories.',
        buildLinks: [
          { moduleId: 'm3', lessonId: 'tools-for-structured-data', label: 'Tools for Structured Data' },
          { moduleId: 'm1', lessonId: 'structured-data', label: 'Structured Data' },
        ],
      },
      {
        id: 't4.4',
        title: 'Implement validation, retry, and feedback loops for extraction quality',
        knowledge: [
          'Retry-with-error-feedback: appending specific validation errors to the prompt on retry to guide the model toward correction',
          'The limits of retry: retries are ineffective when the required information is simply absent from the source document (vs format or structural errors)',
          'Feedback loop design: tracking which code constructs trigger findings (detected_pattern field) to enable systematic analysis of dismissal patterns',
          'The difference between semantic validation errors (values don’t sum, wrong field placement) and schema syntax errors (eliminated by tool use)',
        ],
        skills: [
          'Implementing follow-up requests that include the original document, the failed extraction, and specific validation errors for model self-correction',
          'Identifying when retries will be ineffective (e.g., information exists only in an external document not provided) versus when they will succeed (format mismatches, structural output errors)',
          'Adding detected_pattern fields to structured findings to enable analysis of false positive patterns when developers dismiss findings',
          'Designing self-correction validation flows: extracting "calculated_total" alongside "stated_total" to flag discrepancies, adding "conflict_detected" booleans for inconsistent source data',
        ],
        explanation:
          'When validation fails, **retry with the specific error fed back** — include the original document, the failed extraction, and the exact validation message so the model can self-correct. The critical judgment: retries fix **format/structural** errors but **cannot conjure information that isn’t in the source**; if a required value lives only in a document you never provided, retrying just wastes calls. Build validation into the schema itself — extract `calculated_total` alongside `stated_total` to surface arithmetic conflicts, add a `conflict_detected` boolean for inconsistent sources, and a `detected_pattern` field so you can analyze which constructs produce dismissed findings.',
        buildLinks: [
          { moduleId: 'm2', lessonId: 'code-based-grading', label: 'Code Based Grading' },
          { moduleId: 'm2', lessonId: 'model-based-grading', label: 'Model Based Grading' },
        ],
      },
      {
        id: 't4.5',
        title: 'Design efficient batch processing strategies',
        knowledge: [
          'The Message Batches API: 50% cost savings, up to 24-hour processing window, no guaranteed latency SLA',
          'Batch processing is appropriate for non-blocking, latency-tolerant workloads (overnight reports, weekly audits, nightly test generation) and inappropriate for blocking workflows (pre-merge checks)',
          'The batch API does not support multi-turn tool calling within a single request (cannot execute tools mid-request and return results)',
          'custom_id fields for correlating batch request/response pairs',
        ],
        skills: [
          'Matching API approach to workflow latency requirements: synchronous API for blocking pre-merge checks, batch API for overnight/weekly analysis',
          'Calculating batch submission frequency based on SLA constraints (e.g., 4-hour windows to guarantee 30-hour SLA with 24-hour batch processing)',
          'Handling batch failures: resubmitting only failed documents (identified by custom_id) with appropriate modifications (e.g., chunking documents that exceeded context limits)',
          'Using prompt refinement on a sample set before batch-processing large volumes to maximize first-pass success rates and reduce iterative resubmission costs',
        ],
        explanation:
          'The **Message Batches API** is **exam-only** and worth memorizing precisely: ~**50% cost savings**, a processing window of **up to 24 hours**, and **no guaranteed latency SLA**. That profile makes it ideal for non-blocking, latency-tolerant work (overnight reports, weekly audits) and unsuitable for anything blocking, like a pre-merge check where a developer is waiting (sample Question 11). Two more facts the exam uses: it does **not** support multi-turn tool calling within a single request, and you correlate each request to its response with a **`custom_id`** — which is also how you resubmit only the documents that failed.',
        buildLinks: [{ moduleId: 'm3', lessonId: 'batch-tool', label: 'The Batch Tool' }],
      },
      {
        id: 't4.6',
        title: 'Design multi-instance and multi-pass review architectures',
        knowledge: [
          'Self-review limitations: a model retains reasoning context from generation, making it less likely to question its own decisions in the same session',
          'Independent review instances (without prior reasoning context) are more effective at catching subtle issues than self-review instructions or extended thinking',
          'Multi-pass review: splitting large reviews into per-file local analysis passes plus cross-file integration passes to avoid attention dilution and contradictory findings',
        ],
        skills: [
          'Using a second independent Claude instance to review generated code without the generator’s reasoning context',
          'Splitting large multi-file reviews into focused per-file passes for local issues plus separate integration passes for cross-file data flow analysis',
          'Running verification passes where the model self-reports confidence alongside each finding to enable calibrated review routing',
        ],
        explanation:
          'Two architectural moves. First, **independent review beats self-review**: the instance that generated the code carries its own reasoning and is unlikely to question its decisions, so a *fresh* instance (no prior context) catches subtle bugs that self-review and even extended thinking miss. Second, **multi-pass beats single-pass** on large changes (sample Question 12): split into per-file local passes plus a separate cross-file integration pass to avoid attention dilution and the contradictory findings that come from cramming everything into one pass.',
        buildLinks: [{ moduleId: 'm2', lessonId: 'prompt-evaluation', label: 'Prompt Evaluation' }],
      },
    ],
  },
  {
    id: 'd5',
    num: 5,
    title: 'Context Management & Reliability',
    weight: 15,
    blurb:
      'Preserving critical information across long interactions, escalation and ambiguity resolution, error propagation in multi-agent systems, large-codebase context, human review/confidence calibration, and provenance.',
    tasks: [
      {
        id: 't5.1',
        title: 'Manage conversation context to preserve critical information across long interactions',
        knowledge: [
          'Progressive summarization risks: condensing numerical values, percentages, dates, and customer-stated expectations into vague summaries',
          'The "lost in the middle" effect: models reliably process information at the beginning and end of long inputs but may omit findings from middle sections',
          'How tool results accumulate in context and consume tokens disproportionately to their relevance (e.g., 40+ fields per order lookup when only 5 are relevant)',
          'The importance of passing complete conversation history in subsequent API requests to maintain conversational coherence',
        ],
        skills: [
          'Extracting transactional facts (amounts, dates, order numbers, statuses) into a persistent "case facts" block included in each prompt, outside summarized history',
          'Extracting and persisting structured issue data (order IDs, amounts, statuses) into a separate context layer for multi-issue sessions',
          'Trimming verbose tool outputs to only relevant fields before they accumulate in context (e.g., keeping only return-relevant fields from order lookups)',
          'Placing key findings summaries at the beginning of aggregated inputs and organizing detailed results with explicit section headers to mitigate position effects',
          'Requiring subagents to include metadata (dates, source locations, methodological context) in structured outputs to support accurate downstream synthesis',
          'Modifying upstream agents to return structured data (key facts, citations, relevance scores) instead of verbose content and reasoning chains when downstream agents have limited context budgets',
        ],
        explanation:
          'Long contexts lose precise facts in two ways: **progressive summarization** quietly turns "$1,247.50 refund expected by Friday" into "customer wants a refund soon", and the **lost-in-the-middle** effect means content buried mid-input is more likely to be dropped than content at the start or end. Defenses: extract hard facts (amounts, dates, order numbers, statuses) into a persistent **"case facts" block** that rides outside the summarized history; **trim verbose tool outputs** to only relevant fields before they pile up (an order lookup with 40+ fields when 5 matter); and **order inputs position-aware** — key summaries first, detailed sections with explicit headers.',
        buildLinks: [
          { moduleId: 'm4', lessonId: 'contextual-retrieval', label: 'Contextual Retrieval' },
          { moduleId: 'm7', lessonId: 'cc-controlling-context', label: 'Controlling Context' },
        ],
      },
      {
        id: 't5.2',
        title: 'Design effective escalation and ambiguity resolution patterns',
        knowledge: [
          'Appropriate escalation triggers: customer requests for a human, policy exceptions/gaps (not just complex cases), and inability to make meaningful progress',
          'The distinction between escalating immediately when a customer explicitly demands it versus offering to resolve when the issue is straightforward',
          'Why sentiment-based escalation and self-reported confidence scores are unreliable proxies for actual case complexity',
          'How multiple customer matches require clarification (requesting additional identifiers) rather than heuristic selection',
        ],
        skills: [
          'Adding explicit escalation criteria with few-shot examples to the system prompt demonstrating when to escalate versus resolve autonomously',
          'Honoring explicit customer requests for human agents immediately without first attempting investigation',
          'Acknowledging frustration while offering resolution when the issue is within the agent’s capability, escalating only if the customer reiterates their preference',
          'Escalating when policy is ambiguous or silent on the customer’s specific request (e.g., competitor price matching when policy only addresses own-site adjustments)',
          'Instructing the agent to ask for additional identifiers when tool results return multiple matches, rather than selecting based on heuristics',
        ],
        explanation:
          'Escalate on the **right triggers**: an explicit request for a human (honor it *immediately*, don’t investigate first), a **policy gap or exception** (the policy is silent on competitor price-matching), or genuine **inability to progress** — not merely "this feels hard". The exam is emphatic that **sentiment and self-reported confidence are bad proxies** for complexity (sample Question 3): a frustrated customer with an easy problem shouldn’t auto-escalate, and the model is often confidently wrong on hard cases. When a lookup returns **multiple matches**, ask for an additional identifier rather than guessing with a heuristic. Encode all of this as explicit criteria plus few-shot examples.',
        buildLinks: [{ moduleId: 'm7', lessonId: 'environment-inspection', label: 'Environment Inspection' }],
      },
      {
        id: 't5.3',
        title: 'Implement error propagation strategies across multi-agent systems',
        knowledge: [
          'Structured error context (failure type, attempted query, partial results, alternative approaches) as enabling intelligent coordinator recovery decisions',
          'The distinction between access failures (timeouts needing retry decisions) and valid empty results (successful queries with no matches)',
          'Why generic error statuses ("search unavailable") hide valuable context from the coordinator',
          'Why silently suppressing errors (returning empty results as success) or terminating entire workflows on single failures are both anti-patterns',
        ],
        skills: [
          'Returning structured error context including failure type, what was attempted, partial results, and potential alternatives to enable coordinator recovery',
          'Distinguishing access failures from valid empty results in error reporting so the coordinator can make appropriate decisions',
          'Having subagents implement local recovery for transient failures and only propagate errors they cannot resolve, including what was attempted and partial results',
          'Structuring synthesis output with coverage annotations indicating which findings are well-supported versus which topic areas have gaps due to unavailable sources',
        ],
        explanation:
          'This is sample Question 8 generalized. When a subagent fails, return **structured error context** — failure type, the attempted query, any partial results, and possible alternatives — so the coordinator can decide intelligently (retry differently, try another source, or proceed with partial results). Two anti-patterns to reject: **silently suppressing** the error (returning empty results marked as success, which hides the failure) and **terminating the whole workflow** on one failure. Subagents should attempt **local recovery** for transient issues and only escalate what they truly can’t resolve, carrying partial results and what was tried. Annotate synthesis with coverage gaps where sources were unavailable.',
        buildLinks: [{ moduleId: 'm3', lessonId: 'sending-tool-results', label: 'Sending Tool Results' }],
      },
      {
        id: 't5.4',
        title: 'Manage context effectively in large codebase exploration',
        knowledge: [
          'Context degradation in extended sessions: models start giving inconsistent answers and referencing "typical patterns" rather than specific classes discovered earlier',
          'The role of scratchpad files for persisting key findings across context boundaries',
          'Subagent delegation for isolating verbose exploration output while the main agent coordinates high-level understanding',
          'Structured state persistence for crash recovery: each agent exports state to a known location, and the coordinator loads a manifest on resume',
        ],
        skills: [
          'Spawning subagents to investigate specific questions (e.g., "find all test files," "trace refund flow dependencies") while the main agent preserves high-level coordination',
          'Having agents maintain scratchpad files recording key findings, referencing them for subsequent questions to counteract context degradation',
          'Summarizing key findings from one exploration phase before spawning sub-agents for the next phase, injecting summaries into initial context',
          'Designing crash recovery using structured agent state exports (manifests) that the coordinator loads on resume and injects into agent prompts',
        ],
        explanation:
          'In long exploration sessions, watch for **context degradation**: the model starts giving inconsistent answers and citing "typical patterns" instead of the specific classes it found earlier — a sign real findings have fallen out of context. Counter it by **persisting findings to scratchpad files** and referencing them later, **delegating verbose discovery to subagents** so only summaries return to the main agent, and **summarizing each phase before starting the next**. For long-running multi-agent jobs, design **crash recovery** with structured state exports (a manifest the coordinator reloads on resume and re-injects). `/compact` also helps reclaim context mid-session.',
        buildLinks: [{ moduleId: 'm7', lessonId: 'cc-controlling-context', label: 'Controlling Context' }],
      },
      {
        id: 't5.5',
        title: 'Design human review workflows and confidence calibration',
        knowledge: [
          'The risk that aggregate accuracy metrics (e.g., 97% overall) may mask poor performance on specific document types or fields',
          'Stratified random sampling for measuring error rates in high-confidence extractions and detecting novel error patterns',
          'Field-level confidence scores calibrated using labeled validation sets for routing review attention',
          'The importance of validating accuracy by document type and field segment before automating high-confidence extractions',
        ],
        skills: [
          'Implementing stratified random sampling of high-confidence extractions for ongoing error rate measurement and novel pattern detection',
          'Analyzing accuracy by document type and field to verify consistent performance across all segments before reducing human review',
          'Having models output field-level confidence scores, then calibrating review thresholds using labeled validation sets',
          'Routing extractions with low model confidence or ambiguous/contradictory source documents to human review, prioritizing limited reviewer capacity',
        ],
        explanation:
          'Aggregate accuracy lies. "97% overall" can hide a field or document type that performs terribly, so **segment accuracy by document type and field** before trusting automation. Use **stratified random sampling** (not just spot checks) to keep measuring error rates in high-confidence extractions and catch novel failure patterns. Have the model emit **field-level confidence scores**, then **calibrate thresholds against a labeled validation set** rather than trusting raw scores — and route low-confidence or contradictory-source extractions to humans, spending scarce reviewer time where it matters.',
        buildLinks: [{ moduleId: 'm2', lessonId: 'eval-workflow', label: 'A Typical Eval Workflow' }],
      },
      {
        id: 't5.6',
        title: 'Preserve information provenance and handle uncertainty in multi-source synthesis',
        knowledge: [
          'How source attribution is lost during summarization steps when findings are compressed without preserving claim-source mappings',
          'The importance of structured claim-source mappings that the synthesis agent must preserve and merge when combining findings',
          'How to handle conflicting statistics from credible sources: annotating conflicts with source attribution rather than arbitrarily selecting one value',
          'Temporal data: requiring publication/collection dates in structured outputs to prevent temporal differences from being misinterpreted as contradictions',
        ],
        skills: [
          'Requiring subagents to output structured claim-source mappings (source URLs, document names, relevant excerpts) that downstream agents preserve through synthesis',
          'Structuring reports with explicit sections distinguishing well-established findings from contested ones, preserving original source characterizations and methodological context',
          'Completing document analysis with conflicting values included and explicitly annotated, letting the coordinator decide how to reconcile before passing to synthesis',
          'Requiring subagents to include publication or data collection dates in structured outputs to enable correct temporal interpretation',
        ],
        explanation:
          'Provenance is fragile: a naive summarization step compresses "Source A says X, Source B says Y" into "the data shows X" and the attribution is gone. Require subagents to emit **structured claim-source mappings** (claim, excerpt, source URL/document, date) that downstream agents **preserve and merge** rather than flatten. When credible sources **conflict**, *annotate both with attribution* instead of arbitrarily picking one, and structure the report to separate **well-established** from **contested** findings. Always carry **publication/collection dates** so a difference in timing isn’t misread as a contradiction.',
        buildLinks: [{ moduleId: 'm4', lessonId: 'reranking-results', label: 'Reranking Results' }],
      },
    ],
  },
]

export const examScenarios: ExamScenario[] = [
  {
    id: 's1',
    num: 1,
    title: 'Customer Support Resolution Agent',
    context:
      'You are building a customer support resolution agent using the Claude Agent SDK. The agent handles high-ambiguity requests like returns, billing disputes, and account issues. It has access to your backend systems through custom MCP tools (get_customer, lookup_order, process_refund, escalate_to_human). Your target is 80%+ first-contact resolution while knowing when to escalate.',
    primaryDomains: ['d1', 'd2', 'd5'],
  },
  {
    id: 's2',
    num: 2,
    title: 'Code Generation with Claude Code',
    context:
      'You are using Claude Code to accelerate software development. Your team uses it for code generation, refactoring, debugging, and documentation. You need to integrate it into your development workflow with custom slash commands, CLAUDE.md configurations, and understand when to use plan mode vs direct execution.',
    primaryDomains: ['d3', 'd5'],
  },
  {
    id: 's3',
    num: 3,
    title: 'Multi-Agent Research System',
    context:
      'You are building a multi-agent research system using the Claude Agent SDK. A coordinator agent delegates to specialized subagents: one searches the web, one analyzes documents, one synthesizes findings, and one generates reports. The system researches topics and produces comprehensive, cited reports.',
    primaryDomains: ['d1', 'd2', 'd5'],
  },
  {
    id: 's4',
    num: 4,
    title: 'Developer Productivity with Claude',
    context:
      'You are building developer productivity tools using the Claude Agent SDK. The agent helps engineers explore unfamiliar codebases, understand legacy systems, generate boilerplate code, and automate repetitive tasks. It uses the built-in tools (Read, Write, Bash, Grep, Glob) and integrates with MCP servers.',
    primaryDomains: ['d2', 'd3', 'd1'],
  },
  {
    id: 's5',
    num: 5,
    title: 'Claude Code for Continuous Integration',
    context:
      'You are integrating Claude Code into your CI/CD pipeline. The system runs automated code reviews, generates test cases, and provides feedback on pull requests. You need to design prompts that provide actionable feedback and minimize false positives.',
    primaryDomains: ['d3', 'd4'],
  },
  {
    id: 's6',
    num: 6,
    title: 'Structured Data Extraction',
    context:
      'You are building a structured data extraction system using Claude. The system extracts information from unstructured documents, validates the output using JSON schemas, and maintains high accuracy. It must handle edge cases gracefully and integrate with downstream systems.',
    primaryDomains: ['d4', 'd5'],
  },
]

export const exercises: Exercise[] = [
  {
    id: 'e1',
    num: 1,
    title: 'Build a Multi-Tool Agent with Escalation Logic',
    objective:
      'Practice designing an agentic loop with tool integration, structured error handling, and escalation patterns.',
    steps: [
      'Define 3-4 MCP tools with detailed descriptions that clearly differentiate each tool’s purpose, expected inputs, and boundary conditions. Include at least two tools with similar functionality that require careful description to avoid selection confusion.',
      'Implement an agentic loop that checks stop_reason to determine whether to continue tool execution or present the final response. Handle both "tool_use" and "end_turn" stop reasons correctly.',
      'Add structured error responses to your tools: include errorCategory (transient/validation/permission), isRetryable boolean, and human-readable descriptions. Test that the agent handles each error type appropriately (retrying transient errors, explaining business errors to the user).',
      'Implement a programmatic hook that intercepts tool calls to enforce a business rule (e.g., blocking operations above a threshold amount), redirecting to an escalation workflow when triggered.',
      'Test with multi-concern messages (e.g., requests involving multiple issues) and verify the agent decomposes the request, handles each concern, and synthesizes a unified response.',
    ],
    domains: ['d1', 'd2', 'd5'],
  },
  {
    id: 'e2',
    num: 2,
    title: 'Configure Claude Code for a Team Development Workflow',
    objective:
      'Practice configuring CLAUDE.md hierarchies, custom slash commands, path-specific rules, and MCP server integration for a multi-developer project.',
    steps: [
      'Create a project-level CLAUDE.md with universal coding standards and testing conventions. Verify that instructions placed at the project level are consistently applied across all team members.',
      'Create .claude/rules/ files with YAML frontmatter glob patterns for different code areas (e.g., paths: ["src/api/**/*"] for API conventions, paths: ["**/*.test.*"] for testing conventions). Test that rules load only when editing matching files.',
      'Create a project-scoped skill in .claude/skills/ with context: fork and allowed-tools restrictions. Verify the skill runs in isolation without polluting the main conversation context.',
      'Configure an MCP server in .mcp.json with environment variable expansion for credentials. Add a personal experimental MCP server in ~/.claude.json and verify both are available simultaneously.',
      'Test plan mode versus direct execution on tasks of varying complexity: a single-file bug fix, a multi-file library migration, and a new feature with multiple valid implementation approaches. Observe when plan mode provides value.',
    ],
    domains: ['d3', 'd2'],
  },
  {
    id: 'e3',
    num: 3,
    title: 'Build a Structured Data Extraction Pipeline',
    objective:
      'Practice designing JSON schemas, using tool_use for structured output, implementing validation-retry loops, and designing batch processing strategies.',
    steps: [
      'Define an extraction tool with a JSON schema containing required and optional fields, an enum with an "other" + detail string pattern, and nullable fields for information that may not exist in source documents. Process documents where some fields are absent and verify the model returns null rather than fabricating values.',
      'Implement a validation-retry loop: when Pydantic or JSON schema validation fails, send a follow-up request including the document, the failed extraction, and the specific validation error. Track which errors are resolvable via retry (format mismatches) versus which are not (information absent from source).',
      'Add few-shot examples demonstrating extraction from documents with varied formats (e.g., inline citations vs bibliographies, narrative descriptions vs structured tables) and verify improved handling of structural variety.',
      'Design a batch processing strategy: submit a batch of 100 documents using the Message Batches API, handle failures by custom_id, resubmit failed documents with modifications (e.g., chunking oversized documents), and calculate total processing time relative to SLA constraints.',
      'Implement a human review routing strategy: have the model output field-level confidence scores, route low-confidence extractions to human review, and analyze accuracy by document type and field to verify consistent performance.',
    ],
    domains: ['d4', 'd5'],
  },
  {
    id: 'e4',
    num: 4,
    title: 'Design and Debug a Multi-Agent Research Pipeline',
    objective:
      'Practice orchestrating subagents, managing context passing, implementing error propagation, and handling synthesis with provenance tracking.',
    steps: [
      'Build a coordinator agent that delegates to at least two subagents (e.g., web search and document analysis). Ensure the coordinator’s allowedTools includes "Task" and that each subagent receives its research findings directly in its prompt rather than relying on automatic context inheritance.',
      'Implement parallel subagent execution by having the coordinator emit multiple Task tool calls in a single response. Measure the latency improvement compared to sequential execution.',
      'Design structured output for subagents that separates content from metadata: each finding should include a claim, evidence excerpt, source URL/document name, and publication date. Verify that the synthesis subagent preserves source attribution when combining findings.',
      'Implement error propagation: simulate a subagent timeout and verify the coordinator receives structured error context (failure type, attempted query, partial results). Test that the coordinator can proceed with partial results and annotate the final output with coverage gaps.',
      'Test with conflicting source data (e.g., two credible sources with different statistics) and verify the synthesis output preserves both values with source attribution rather than arbitrarily selecting one, and structures the report to distinguish well-established from contested findings.',
    ],
    domains: ['d1', 'd2', 'd5'],
  },
]

export const reference = {
  technologies: [
    {
      name: 'Claude Agent SDK',
      detail:
        'Agent definitions, agentic loops, stop_reason handling, hooks (PostToolUse, tool call interception), subagent spawning via Task tool, allowedTools configuration',
    },
    {
      name: 'Model Context Protocol (MCP)',
      detail:
        'MCP servers, MCP tools, MCP resources, isError flag, tool descriptions, tool distribution, .mcp.json configuration, environment variable expansion',
    },
    {
      name: 'Claude Code',
      detail:
        'CLAUDE.md configuration hierarchy (user/project/directory), .claude/rules/ with YAML frontmatter path-scoping, .claude/commands/ for slash commands, .claude/skills/ with SKILL.md frontmatter (context: fork, allowed-tools, argument-hint), plan mode, direct execution, /memory command, /compact, --resume, fork_session, Explore subagent',
    },
    {
      name: 'Claude Code CLI',
      detail: '-p / --print flag for non-interactive mode, --output-format json, --json-schema for structured CI output',
    },
    {
      name: 'Claude API',
      detail:
        'tool_use with JSON schemas, tool_choice options ("auto", "any", forced tool selection), stop_reason values ("tool_use", "end_turn"), max_tokens, system prompts',
    },
    {
      name: 'Message Batches API',
      detail:
        '50% cost savings, up to 24-hour processing window, custom_id for request/response correlation, polling for completion, no multi-turn tool calling support',
    },
    {
      name: 'JSON Schema',
      detail:
        'Required vs optional fields, enum types, nullable fields, "other" + detail string patterns, strict mode for syntax error elimination',
    },
    { name: 'Pydantic', detail: 'Schema validation, semantic validation errors, validation-retry loops' },
    {
      name: 'Built-in tools',
      detail: 'Read, Write, Edit, Bash, Grep, Glob — their purposes and selection criteria',
    },
    {
      name: 'Few-shot prompting',
      detail: 'Targeted examples for ambiguous scenarios, format demonstration, generalization to novel patterns',
    },
    { name: 'Prompt chaining', detail: 'Sequential task decomposition into focused passes' },
    {
      name: 'Context window management',
      detail: 'Token budgets, progressive summarization, lost-in-the-middle effects, context extraction, scratchpad files',
    },
    {
      name: 'Session management',
      detail: 'Session resumption, fork_session, named sessions, session context isolation',
    },
    {
      name: 'Confidence scoring',
      detail: 'Field-level confidence, calibration with labeled validation sets, stratified sampling for error rate measurement',
    },
  ],
  inScope: [
    'Agentic loop implementation: Control flow based on stop_reason, tool result handling, loop termination conditions',
    'Multi-agent orchestration: Coordinator-subagent patterns, task decomposition, parallel subagent execution, iterative refinement loops',
    'Subagent context management: Explicit context passing, structured state persistence, crash recovery using manifests',
    'Tool interface design: Writing effective tool descriptions, splitting vs consolidating tools, tool naming to reduce ambiguity',
    'MCP tool and resource design: Resources for content catalogs, tools for actions, description quality for adoption',
    'MCP server configuration: Project vs user scope, environment variable expansion, multi-server simultaneous access',
    'Error handling and propagation: Structured error responses, transient vs business vs permission errors, local recovery before escalation',
    'Escalation decision-making: Explicit criteria, honoring customer preferences, policy gap identification',
    'CLAUDE.md configuration: Hierarchy (user/project/directory), @import patterns, .claude/rules/ with glob patterns',
    'Custom commands and skills: Project vs user scope, context: fork, allowed-tools, argument-hint frontmatter',
    'Plan mode vs direct execution: Complexity assessment, architectural decisions, single-file changes',
    'Iterative refinement: Input/output examples, test-driven iteration, interview pattern, sequential vs parallel issue resolution',
    'Structured output via tool_use: Schema design, tool_choice configuration, nullable fields to prevent hallucination',
    'Few-shot prompting: Ambiguous scenario targeting, format consistency, false positive reduction',
    'Batch processing: Message Batches API appropriateness, latency tolerance assessment, failure handling by custom_id',
    'Context window optimization: Trimming verbose tool outputs, structured fact extraction, position-aware input ordering',
    'Human review workflows: Confidence calibration, stratified sampling, accuracy segmentation by document type and field',
    'Information provenance: Claim-source mappings, temporal data handling, conflict annotation, coverage gap reporting',
  ],
  outOfScope: [
    'Fine-tuning Claude models or training custom models',
    'Claude API authentication, billing, or account management',
    'Detailed implementation of specific programming languages or frameworks (beyond what’s needed for tool and schema configuration)',
    'Deploying or hosting MCP servers (infrastructure, networking, container orchestration)',
    'Claude’s internal architecture, training process, or model weights',
    'Constitutional AI, RLHF, or safety training methodologies',
    'Embedding models or vector database implementation details',
    'Computer use (browser automation, desktop interaction)',
    'Vision/image analysis capabilities',
    'Streaming API implementation or server-sent events',
    'Rate limiting, quotas, or API pricing calculations',
    'OAuth, API key rotation, or authentication protocol details',
    'Specific cloud provider configurations (AWS, GCP, Azure)',
    'Performance benchmarking or model comparison metrics',
    'Prompt caching implementation details (beyond knowing it exists)',
    'Token counting algorithms or tokenization specifics',
  ],
}
