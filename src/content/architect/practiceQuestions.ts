import type { PracticeQuestion } from '../types'

// Practice questions authored for this app — NOT from the official guide.
// Each has one correct answer, three plausible distractors, and an explanation
// grounded in the source material. Domain ids enable weighted scoring.

export const practiceQuestions: PracticeQuestion[] = [
  // ---- Domain 1: Agentic Architecture & Orchestration ----
  {
    id: 'p1',
    source: 'practice',
    track: 'exam',
    domainId: 'd1',
    question:
      'Your agentic loop decides the task is finished by scanning the assistant’s latest text for the phrase "task complete." Occasionally the model writes that phrase mid-task and the loop exits early. What is the correct fix?',
    options: [
      { key: 'A', text: 'Terminate the loop based on stop_reason: continue on "tool_use" and stop on "end_turn".' },
      { key: 'B', text: 'Increase max_tokens so the model has room to finish before saying "task complete."' },
      { key: 'C', text: 'Lower the temperature so the model phrases its completion signal more consistently.' },
      { key: 'D', text: 'Add a hard cap of 10 iterations as the primary stopping mechanism.' },
    ],
    correct: 'A',
    explanation:
      'The reliable termination signal is the structured stop_reason field, not natural-language text. Continue while stop_reason is "tool_use" and stop on "end_turn." Parsing assistant text for completion (the current bug), tuning tokens/temperature, or using an arbitrary iteration cap as the primary stop are all named anti-patterns.',
  },
  {
    id: 'p2',
    source: 'practice',
    track: 'exam',
    domainId: 'd1',
    question:
      'In a coordinator–subagent research system, a synthesis subagent produces a report but omits key facts the web-search subagent had found. The search subagent’s output was correct. What is the most likely cause?',
    options: [
      { key: 'A', text: 'The search subagent’s findings were not explicitly passed into the synthesis subagent’s prompt.' },
      { key: 'B', text: 'Subagents automatically share memory, so the synthesis agent overwrote the search results.' },
      { key: 'C', text: 'The synthesis subagent inherited too much of the coordinator’s history and got distracted.' },
      { key: 'D', text: 'The coordinator’s allowedTools did not include "Read".' },
    ],
    correct: 'A',
    explanation:
      'Subagents run with isolated context and do not automatically inherit the coordinator’s history or each other’s outputs. Anything the synthesis agent needs must be placed directly in its prompt. Option B is the opposite of how subagents work; C misstates inheritance; D is unrelated to passing findings.',
  },
  {
    id: 'p3',
    source: 'practice',
    track: 'exam',
    domainId: 'd1',
    question:
      'You are comparing two refactoring strategies and want each explored independently, both starting from the same completed codebase analysis. Which mechanism fits best?',
    options: [
      { key: 'A', text: 'fork_session to branch from the shared analysis baseline into independent explorations.' },
      { key: 'B', text: '--resume the same named session twice so both strategies share one history.' },
      { key: 'C', text: 'Run both strategies in one session and rely on the model to keep them separate.' },
      { key: 'D', text: 'Start each strategy from a completely empty session with no analysis.' },
    ],
    correct: 'A',
    explanation:
      'fork_session creates independent branches from a shared baseline — ideal for exploring divergent approaches without cross-contamination. Resuming the same session shares history (B); one session risks the branches bleeding together (C); and discarding the analysis wastes the shared baseline (D).',
  },
  // ---- Domain 2: Tool Design & MCP Integration ----
  {
    id: 'p4',
    source: 'practice',
    track: 'exam',
    domainId: 'd2',
    question:
      'A subagent calls an MCP tool that fails because of a momentary upstream timeout. Which tool response best lets the agent decide what to do next?',
    options: [
      {
        key: 'A',
        text: 'isError true with errorCategory "transient" and isRetryable true, plus a human-readable description.',
      },
      { key: 'B', text: 'A generic "Operation failed" string with no metadata.' },
      { key: 'C', text: 'An empty result set marked as a successful query.' },
      { key: 'D', text: 'A business-rule violation message with isRetryable false.' },
    ],
    correct: 'A',
    explanation:
      'Structured error metadata — category plus an isRetryable flag — lets the agent retry a transient failure rather than guessing. A generic message (B) hides the recovery signal; marking failure as success (C) suppresses the error; and a non-retryable business error (D) mischaracterizes a transient timeout.',
  },
  {
    id: 'p5',
    source: 'practice',
    track: 'exam',
    domainId: 'd2',
    question:
      'You want a shared MCP server available to the whole team via version control, authenticated with a token that must not be committed. How do you configure it?',
    options: [
      { key: 'A', text: 'Add it to project-scoped .mcp.json using ${TOKEN} environment-variable expansion.' },
      { key: 'B', text: 'Add it to user-scoped ~/.claude.json with the token hard-coded.' },
      { key: 'C', text: 'Hard-code the token directly in .mcp.json so teammates get it automatically.' },
      { key: 'D', text: 'Put the token in CLAUDE.md so it loads as context on every request.' },
    ],
    correct: 'A',
    explanation:
      'Project-scoped .mcp.json is committed and shared with the team, and environment-variable expansion (e.g. ${TOKEN}) keeps the secret out of source control. User-scope (B) isn’t shared; hard-coding the token (C) or putting it in CLAUDE.md (D) leaks the secret into version control.',
  },
  {
    id: 'p6',
    source: 'practice',
    track: 'exam',
    domainId: 'd2',
    question:
      'You must guarantee the model extracts metadata before any enrichment tool runs. Which tool_choice setting achieves this?',
    options: [
      { key: 'A', text: 'Forced selection: {"type": "tool", "name": "extract_metadata"} on the first turn.' },
      { key: 'B', text: 'tool_choice: "auto" so the model decides the order itself.' },
      { key: 'C', text: 'tool_choice: "any" to ensure some tool is called.' },
      { key: 'D', text: 'Remove all other tools so only extract_metadata exists for the whole session.' },
    ],
    correct: 'A',
    explanation:
      'Forcing a specific tool ({"type":"tool","name":...}) guarantees extract_metadata runs first; subsequent steps proceed in follow-up turns. "auto" leaves ordering to the model (B); "any" guarantees a call but not which tool (C); removing the other tools entirely (D) breaks the rest of the workflow.',
  },
  // ---- Domain 3: Claude Code Configuration & Workflows ----
  {
    id: 'p7',
    source: 'practice',
    track: 'exam',
    domainId: 'd3',
    question:
      'A new teammate isn’t getting the project’s coding standards even though they work for everyone else. The standards live in ~/.claude/CLAUDE.md on each existing developer’s machine. What’s the fix?',
    options: [
      { key: 'A', text: 'Move the standards into a project-level CLAUDE.md committed to the repository.' },
      { key: 'B', text: 'Ask the teammate to restart Claude Code to reload memory.' },
      { key: 'C', text: 'Email the teammate the standards to paste into each prompt.' },
      { key: 'D', text: 'Add the standards to the teammate’s ~/.claude/CLAUDE.md only.' },
    ],
    correct: 'A',
    explanation:
      'User-level (~/.claude/CLAUDE.md) settings are personal and not shared via version control, which is exactly why the new teammate is missing them. Project-level CLAUDE.md is committed and shared with everyone. The other options are workarounds that don’t address the scope mistake.',
  },
  {
    id: 'p8',
    source: 'practice',
    track: 'exam',
    domainId: 'd3',
    question:
      'A skill performs verbose codebase analysis whose output would clutter the main conversation. Which frontmatter option keeps that output isolated?',
    options: [
      { key: 'A', text: 'context: fork to run the skill in an isolated sub-agent context.' },
      { key: 'B', text: 'allowed-tools to restrict which tools the skill may use.' },
      { key: 'C', text: 'argument-hint to prompt for parameters when invoked bare.' },
      { key: 'D', text: 'Moving the skill to ~/.claude/skills/ so only you run it.' },
    ],
    correct: 'A',
    explanation:
      'context: fork runs the skill in an isolated sub-agent so its verbose output does not pollute the main session. allowed-tools restricts tool access (B), argument-hint prompts for parameters (C), and relocating the skill changes scope, not output isolation (D).',
  },
  {
    id: 'p9',
    source: 'practice',
    track: 'exam',
    domainId: 'd3',
    question:
      'Your CI job runs `claude "review this PR"` and hangs waiting for input. You also need machine-parseable findings to post as inline comments. What combination is correct?',
    options: [
      { key: 'A', text: 'Use -p for non-interactive mode and --output-format json with --json-schema for structured findings.' },
      { key: 'B', text: 'Set CLAUDE_HEADLESS=true and parse stdout with a regex.' },
      { key: 'C', text: 'Use the --batch flag and poll for the result.' },
      { key: 'D', text: 'Redirect stdin from /dev/null and screen-scrape the terminal output.' },
    ],
    correct: 'A',
    explanation:
      'The -p (--print) flag runs Claude Code non-interactively, and --output-format json with --json-schema produces machine-parseable structured findings suitable for automated PR comments. The other options reference non-existent flags/variables or fragile workarounds.',
  },
  // ---- Domain 4: Prompt Engineering & Structured Output ----
  {
    id: 'p10',
    source: 'practice',
    track: 'exam',
    domainId: 'd4',
    question:
      'An extraction schema marks every field "required." For documents missing a phone number, the model invents one. What schema change best prevents fabrication?',
    options: [
      { key: 'A', text: 'Make fields that may be absent nullable/optional so the model can return null.' },
      { key: 'B', text: 'Add "be accurate, do not make up data" to the system prompt.' },
      { key: 'C', text: 'Lower the temperature to 0 so the output is deterministic.' },
      { key: 'D', text: 'Retry the extraction until a non-empty phone number appears.' },
    ],
    correct: 'A',
    explanation:
      'Required fields pressure the model to fabricate values when the source lacks them. Making such fields nullable/optional lets the model return null honestly. A prompt reminder (B) is weaker than schema design; temperature (C) doesn’t address the structural pressure; and retrying for data that isn’t present (D) is futile.',
  },
  {
    id: 'p11',
    source: 'practice',
    track: 'exam',
    domainId: 'd4',
    question:
      'A nightly job generates a technical-debt report reviewed the next morning; latency is irrelevant and cost matters. Which API approach fits?',
    options: [
      { key: 'A', text: 'The Message Batches API, for ~50% cost savings with a tolerant latency window.' },
      { key: 'B', text: 'Synchronous real-time calls, to be safe.' },
      { key: 'C', text: 'The Message Batches API with a real-time timeout fallback.' },
      { key: 'D', text: 'Streaming responses to reduce perceived latency.' },
    ],
    correct: 'A',
    explanation:
      'A non-blocking, latency-tolerant overnight job is the ideal case for the Message Batches API’s ~50% savings and up-to-24-hour window. Real-time calls (B) waste the savings; a fallback (C) adds needless complexity; streaming (D) addresses perceived latency, not cost, and isn’t the relevant lever here.',
  },
  {
    id: 'p12',
    source: 'practice',
    track: 'exam',
    domainId: 'd4',
    question:
      'A code-review prompt produces too many false positives on a "comment accuracy" category, eroding developer trust. Which is the most effective improvement?',
    options: [
      {
        key: 'A',
        text: 'Replace the vague instruction with an explicit criterion: flag a comment only when its claimed behavior contradicts the actual code.',
      },
      { key: 'B', text: 'Add "be conservative and only report high-confidence findings."' },
      { key: 'C', text: 'Ask the model to self-rate confidence and drop anything below 8/10.' },
      { key: 'D', text: 'Switch to a larger model with a bigger context window.' },
    ],
    correct: 'A',
    explanation:
      'Specific categorical criteria outperform vague hedges for precision. "Be conservative" / "high-confidence only" (B) and self-rated confidence (C) are exactly the general instructions shown not to improve precision, and a bigger model (D) doesn’t fix unclear criteria.',
  },
  {
    id: 'p13',
    source: 'practice',
    track: 'exam',
    domainId: 'd4',
    question:
      'You need guaranteed schema-valid JSON output and want to eliminate JSON syntax errors entirely. What’s the most reliable approach?',
    options: [
      { key: 'A', text: 'Define a tool with a JSON schema and read the structured data from the tool_use response.' },
      { key: 'B', text: 'Ask for JSON in the prompt and run json.loads, retrying on parse errors.' },
      { key: 'C', text: 'Prefill an opening ```json fence and stop at the closing fence.' },
      { key: 'D', text: 'Lower temperature to 0 and request "valid JSON only."' },
    ],
    correct: 'A',
    explanation:
      'tool_use with a JSON schema is the most reliable path and eliminates JSON syntax errors (though not semantic errors). The prefill+stop trick (C) and prompt-only requests (B, D) are lighter but don’t guarantee schema compliance the way a tool schema does.',
  },
  // ---- Domain 5: Context Management & Reliability ----
  {
    id: 'p14',
    source: 'practice',
    track: 'exam',
    domainId: 'd5',
    question:
      'Over a long support conversation, the agent forgets the exact refund amount and promised date because summaries blurred them. What’s the best mitigation?',
    options: [
      {
        key: 'A',
        text: 'Extract transactional facts (amount, date, order number) into a persistent "case facts" block included in every prompt, outside the summarized history.',
      },
      { key: 'B', text: 'Stop summarizing and always send the entire raw transcript.' },
      { key: 'C', text: 'Instruct the model to "remember important numbers."' },
      { key: 'D', text: 'Place the most important facts in the exact middle of the prompt.' },
    ],
    correct: 'A',
    explanation:
      'A persistent case-facts block keeps precise values out of lossy summarization. Sending the entire raw transcript (B) doesn’t scale and worsens lost-in-the-middle; a prompt reminder (C) is unreliable; and the middle is the worst position for retention (D).',
  },
  {
    id: 'p15',
    source: 'practice',
    track: 'exam',
    domainId: 'd5',
    question:
      'A customer opens by saying "Just connect me to a human." The issue looks simple. What should the agent do?',
    options: [
      { key: 'A', text: 'Honor the explicit request and escalate immediately without first attempting investigation.' },
      { key: 'B', text: 'Attempt to resolve it first and escalate only if it fails.' },
      { key: 'C', text: 'Run sentiment analysis to decide whether the request is genuine.' },
      { key: 'D', text: 'Ask the customer to confirm three times before escalating.' },
    ],
    correct: 'A',
    explanation:
      'An explicit request for a human is an escalation trigger to honor immediately. Investigating first (B) ignores the stated preference; sentiment analysis (C) is an unreliable proxy and irrelevant to an explicit request; and repeated confirmation (D) adds friction.',
  },
  {
    id: 'p16',
    source: 'practice',
    track: 'exam',
    domainId: 'd5',
    question:
      'Your extraction system reports 97% overall accuracy, so a manager wants to drop human review. What should you check first?',
    options: [
      {
        key: 'A',
        text: 'Segment accuracy by document type and field — the aggregate can mask poor performance on specific segments.',
      },
      { key: 'B', text: 'Nothing — 97% comfortably exceeds typical thresholds.' },
      { key: 'C', text: 'Increase the sample size until accuracy reaches 99%.' },
      { key: 'D', text: 'Switch to a larger model to push accuracy higher.' },
    ],
    correct: 'A',
    explanation:
      'Aggregate metrics can hide a document type or field that performs badly, so you must segment accuracy by type and field before reducing review. Trusting the aggregate (B), chasing a higher overall number (C), or swapping models (D) all ignore the segmentation risk.',
  },
  // ---- Build-track practice ----
  {
    id: 'p17',
    source: 'practice',
    track: 'build',
    domainId: 'd4',
    scenarioTitle: 'Build Track — Foundations',
    question:
      'You want deterministic, reproducible output from Claude for a factual data-extraction task. Which temperature setting is most appropriate?',
    options: [
      { key: 'A', text: 'Temperature near 0, which always selects the highest-probability token.' },
      { key: 'B', text: 'Temperature near 1, for more creative variation.' },
      { key: 'C', text: 'Temperature exactly 0.5, the neutral midpoint.' },
      { key: 'D', text: 'Temperature above 1 to force consistency.' },
    ],
    correct: 'A',
    explanation:
      'Temperature 0 is deterministic — it always picks the top-probability token — which suits factual/extraction tasks needing consistency. High temperature (B) adds creativity/variation; 0.5 (C) still allows variation; and temperature is bounded 0–1, so "above 1" (D) isn’t valid.',
  },
  {
    id: 'p18',
    source: 'practice',
    track: 'build',
    domainId: 'd2',
    scenarioTitle: 'Build Track — RAG',
    question:
      'Pure semantic (embedding) search keeps missing documents that contain a rare exact keyword from the query. What’s the standard remedy?',
    options: [
      { key: 'A', text: 'Add BM25 lexical search in parallel and merge results (hybrid search), e.g. via Reciprocal Rank Fusion.' },
      { key: 'B', text: 'Increase the number of chunks returned by the vector search to 50.' },
      { key: 'C', text: 'Switch to a larger embedding model and re-embed everything.' },
      { key: 'D', text: 'Remove the rare keyword from the query before embedding it.' },
    ],
    correct: 'A',
    explanation:
      'Semantic search can miss exact-term matches; BM25 lexical search excels at them. Running both in parallel and merging (hybrid search, often with RRF) gives the best of both. Returning more chunks (B) adds noise, a bigger embedder (C) doesn’t fix lexical blind spots, and stripping the keyword (D) discards the signal.',
  },
  {
    id: 'p19',
    source: 'practice',
    track: 'build',
    domainId: 'd3',
    scenarioTitle: 'Build Track — MCP',
    question:
      'In MCP, you need Claude to be able to perform an action on demand (it decides when), versus exposing a document list your app injects into prompts. Which primitives fit, respectively?',
    options: [
      { key: 'A', text: 'A tool for the action (model-controlled) and a resource for the document list (app-controlled).' },
      { key: 'B', text: 'A resource for the action and a prompt for the document list.' },
      { key: 'C', text: 'A prompt for both, since prompts are the most flexible primitive.' },
      { key: 'D', text: 'A tool for both, since tools can also expose data catalogs.' },
    ],
    correct: 'A',
    explanation:
      'Tools are model-controlled (Claude decides when to call them) — right for an on-demand action. Resources are app-controlled and proactively provide data (a document list your app injects) — right for the catalog. Prompts are user-controlled workflows, not a fit for either here.',
  },
  {
    id: 'p20',
    source: 'practice',
    track: 'build',
    domainId: 'd1',
    scenarioTitle: 'Build Track — Tool Use',
    question:
      'When sending a tool result back to Claude, what must the tool_result block include so Claude pairs it with the right request, and where does it go?',
    options: [
      { key: 'A', text: 'A tool_use_id matching the original tool_use block, placed in a user message.' },
      { key: 'B', text: 'The tool name only, placed in the assistant message.' },
      { key: 'C', text: 'A new randomly generated id, placed in the system prompt.' },
      { key: 'D', text: 'No id; ordering alone determines which result matches which request.' },
    ],
    correct: 'A',
    explanation:
      'The tool_result must carry a tool_use_id matching the original tool_use block (so simultaneous calls pair correctly) and is sent in a user message, not the assistant message. Names or positional ordering aren’t reliable identifiers, and the id must match the request’s id, not be newly generated.',
  },
  // ---- Build-track practice: Agent Skills (Domain 3) ----
  {
    id: 'p21',
    source: 'practice',
    track: 'build',
    domainId: 'd3',
    scenarioTitle: 'Build Track — Agent Skills',
    question:
      'A teammate’s skill exists in .claude/skills/ but Claude never invokes it automatically. What is the most likely cause and fix?',
    options: [
      { key: 'A', text: 'The description is vague — make it specific and state when to use it, including the keywords a user would say.' },
      { key: 'B', text: 'The SKILL.md body is too short — pad it out to several hundred lines.' },
      { key: 'C', text: 'Skills only trigger from a slash command — auto-invocation isn’t supported.' },
      { key: 'D', text: 'The skill must be moved to ~/.claude/skills/ to be discoverable.' },
    ],
    correct: 'A',
    explanation:
      'A vague description is the #1 reason a skill never triggers — the description is what lets Claude auto-load it, so it must state the purpose and the situations/keywords that should activate it. (Also confirm the Skill tool is enabled and the file exists.) Padding the body (B) doesn’t help; skills do auto-invoke, not only via slash command (C); and a project-scoped .claude/skills/ skill is discoverable without moving it (D).',
  },
  {
    id: 'p22',
    source: 'practice',
    track: 'build',
    domainId: 'd3',
    scenarioTitle: 'Build Track — Agent Skills',
    question:
      'You need a rule that ALWAYS blocks commits touching a secrets file — it must hold every time, deterministically. Skill or hook?',
    options: [
      { key: 'A', text: 'A hook — deterministic shell command that runs before the tool and can block it (exit code 2).' },
      { key: 'B', text: 'A skill — Claude will read its instructions and reliably refuse.' },
      { key: 'C', text: 'A skill with context: fork so the check runs in isolation.' },
      { key: 'D', text: 'CLAUDE.md, since always-on context guarantees enforcement.' },
    ],
    correct: 'A',
    explanation:
      'Hooks provide guaranteed, deterministic enforcement and can block a tool call (exit code 2); skills inject capability/instructions but don’t block and aren’t event-driven, so they can’t guarantee a rule holds every time. CLAUDE.md is always-loaded guidance, not enforcement. If a rule must always hold, use a hook; if you want Claude to know how to do something well, use a skill.',
  },
  {
    id: 'p23',
    source: 'practice',
    track: 'build',
    domainId: 'd3',
    scenarioTitle: 'Build Track — Agent Skills',
    question:
      'A codebase-analysis skill produces very verbose output that clutters the main conversation. Which frontmatter setting keeps that output isolated, and what’s the catch?',
    options: [
      { key: 'A', text: 'context: fork with an agent: type — it runs in an isolated sub-agent and summarizes back; the Explore/Plan agents skip CLAUDE.md and git status.' },
      { key: 'B', text: 'allowed-tools: none — disabling tools hides the output.' },
      { key: 'C', text: 'model: inherit — running on the session model suppresses verbosity.' },
      { key: 'D', text: 'version: 2 — bumping the version compacts the output.' },
    ],
    correct: 'A',
    explanation:
      'context: fork (with an agent type) runs the skill in an isolated sub-agent so verbose output never pollutes the main thread; results are summarized back. Note the built-in Explore/Plan agents deliberately skip CLAUDE.md and git status. allowed-tools (B) scopes permissions, model (C) selects a model, and version (D) is just tracking metadata — none isolate output.',
  },
]
