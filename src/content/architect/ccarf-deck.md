<!--
CCAR-F KNOWN-FACTS FLASHCARD DECK
FORMAT SPEC (for the parser in ../parseFlashcards.ts):
- Each card = one line starting "Q:" (front) immediately followed by one line starting "A:" (back).
- No answer contains a line break; every A: is a single line.
- Lines starting with "#" are CATEGORY headers, not cards. Apply the most recent header as the card's category (capture it at parse time before shuffling).
- Blank lines separate cards and are ignored. Lines in <!-- --> are comments; ignore.
- All answers are in EXAM-GUIDE framing. Where current docs diverge, the divergence cards say so explicitly.
-->

# Exam Logistics

Q: How many items are on the CCAR-F exam and how long do you get?
A: 60 items in 120 minutes (about 2 minutes per item).

Q: What is the passing score for CCAR-F and on what scale?
A: 720 out of 1000 (scaled score, range 100–1000).

Q: How many scenarios appear on the exam and from how many are they drawn?
A: 4 scenarios are presented, drawn at random from a bank of 6.

Q: What are the two question formats on CCAR-F?
A: Multiple-choice (select one) and multiple-response (select N — the item states how many).

Q: What are the five domains and their weights?
A: D1 Agentic Architecture & Orchestration 27%, D2 Tool Design & MCP 18%, D3 Claude Code Config & Workflows 20%, D4 Prompt Engineering & Structured Output 20%, D5 Context Management & Reliability 15%.

Q: Name the six exam scenarios.
A: (1) Customer Support Resolution Agent, (2) Code Generation with Claude Code, (3) Multi-Agent Research System, (4) Developer Productivity, (5) Claude Code for CI/CD, (6) Structured Data Extraction.

Q: What is the CCAR-F exam fee and credential validity period?
A: $125 USD; the credential is valid for 12 months.

Q: What are the CCAR-F retake waiting periods?
A: 14 days after the first fail, 30 after the second, 90 after the third; max 4 attempts per rolling 12 months.

# Foundations / API

Q: Which Claude model family is for deepest reasoning on complex multi-step tasks (higher cost/latency)?
A: Opus.

Q: Which Claude model family is the balanced default with strong coding?
A: Sonnet.

Q: Which Claude model family is fastest and cheapest for high-volume, real-time work?
A: Haiku.

Q: Is the Anthropic Messages API stateful or stateless, and what does that require of you?
A: Stateless — you must resend the full conversation history with every request.

Q: What does the max_tokens parameter control?
A: A hard ceiling on generated tokens — it is a limit, not a target length.

Q: What does temperature 0 guarantee, and what does it NOT guarantee?
A: Deterministic token sampling; it does NOT guarantee rule/policy compliance (the model can still choose a disallowed action).

Q: What is the prompt-based (non-tool) trick to get raw structured output with no commentary?
A: Prefill the assistant turn with an opening delimiter and set a closing stop sequence (weaker than tool_use).

# Agentic Loop & stop_reason

Q: List the stop_reason values you should know.
A: tool_use, end_turn, max_tokens, stop_sequence.

Q: Which stop_reason means the agentic loop should continue and execute the requested tool(s)?
A: tool_use.

Q: Which stop_reason means the agentic loop should terminate and present the final answer?
A: end_turn.

Q: Which stop_reason indicates truncation (hit the generation cap), NOT task completion?
A: max_tokens.

Q: What signal must drive agentic loop control flow (not the assistant's text)?
A: The structural stop_reason field.

Q: In the agentic loop, what happens to a tool's result each iteration?
A: It is appended to the conversation history so the model can reason about the next action.

# Subagents & Orchestration

Q: On the exam, what tool spawns subagents, and what must allowedTools include?
A: The Task tool; the coordinator's allowedTools must include "Task".

Q: EXAM vs DOCS: what is the subagent-spawning tool called on the exam vs in current docs?
A: Exam answer = "Task"; current Claude Code/Agent SDK renamed it "Agent". Answer Task on the exam.

Q: Do subagents inherit the coordinator's conversation history?
A: No — subagents have isolated context; only the prompt string is passed in and only their final message returns.

Q: How do you pass prior findings to a subagent (e.g., synthesis)?
A: Include them explicitly in the subagent's prompt — they are not inherited.

Q: What three fields does the exam's AgentDefinition configure per subagent?
A: A description (when to use it), a system prompt, and tool restrictions.

Q: How do you spawn subagents to run in parallel?
A: Emit multiple Task tool calls in a SINGLE coordinator response (not one per turn).

Q: What is the exam's coordinator–subagent communication model?
A: Hub-and-spoke — all communication routes through the coordinator; subagents do not talk to each other directly.

Q: EXAM vs DOCS: how do subagents communicate on the exam vs in current docs?
A: Exam = strict hub-and-spoke through the coordinator; current docs add a SendMessage tool for direct agent-to-agent messaging. Answer hub-and-spoke.

Q: What is the most common root cause of a multi-agent report missing whole subtopics?
A: Overly narrow task decomposition by the coordinator (not the downstream agents).

# Hooks

Q: Which hook fires BEFORE a tool call and is the enforcement primitive?
A: PreToolUse (can allow, deny, or ask).

Q: Which hook fires AFTER a successful tool call and can transform results but can't stop the call?
A: PostToolUse.

Q: Which hook gates the end of a turn (can refuse to finish)?
A: Stop.

Q: What hook exit code BLOCKS the action and feeds stderr back to Claude?
A: Exit code 2.

Q: Does hook exit code 1 block the action?
A: No — exit 1 does NOT block; Claude runs the command anyway (exit 0 = success).

Q: What permissionDecision values can a PreToolUse hook return?
A: allow, deny, or ask.

Q: Where should a rule that must NEVER be skipped (e.g., never push to main) live?
A: In a hook (deterministic code), not in CLAUDE.md (which is only guidance).

# tool_choice & Structured Output

Q: What does tool_choice "auto" allow?
A: The model may call a tool OR return plain text.

Q: What does tool_choice "any" force?
A: The model must call some tool (it chooses which), never plain text.

Q: What does tool_choice {"type":"tool","name":"..."} force?
A: The model must call that specific named tool.

Q: What does tool_choice "none" do?
A: Prevents the model from calling any tool that turn.

Q: What flag added to a tool_choice limits the model to at most one tool call?
A: disable_parallel_tool_use: true.

Q: What tool property guarantees schema validation on the tool name and inputs?
A: strict: true.

Q: What is the most reliable way to guarantee schema-valid, syntax-error-free structured output?
A: Tool use (tool_use) with a JSON schema as the tool's input_schema.

Q: Does tool_use eliminate SEMANTIC errors (e.g., totals that don't sum)?
A: No — it eliminates SYNTAX errors only; semantic errors need a separate validation step.

Q: How do you stop the model fabricating values for fields that may be absent?
A: Make those schema fields optional/nullable so it can return null.

Q: What enum patterns handle ambiguity and extensibility in extraction schemas?
A: An "unclear" value for ambiguous cases and an "other" + detail-string pattern for extensible categories.

# Validation, Retry & Batch

Q: What should a retry-with-error-feedback request contain?
A: The original document, the failed extraction, and the specific validation errors.

Q: When is retrying an extraction ineffective?
A: When the required information is simply absent from the source (retries fix format/structural errors, not missing data).

Q: What cost saving does the Message Batches API give?
A: About 50%.

Q: What is the Batch API processing window and SLA?
A: Up to 24 hours, with no guaranteed latency SLA (most finish sooner, but you can't rely on it).

Q: What field correlates batch requests to responses?
A: custom_id (results are NOT matched by submission order/position).

Q: EXAM: does the Batch API support multi-turn tool calling within a single request?
A: No (per the exam guide — answer "no multi-turn tool calling in a batch request").

Q: What workloads suit the Batch API vs the synchronous API?
A: Batch = latency-tolerant/non-blocking (overnight reports, audits); synchronous = blocking (pre-merge checks).

# MCP Errors & Concepts

Q: What flag communicates an MCP tool failure back to the agent?
A: The isError flag.

Q: What errorCategory values should a structured MCP error use?
A: transient, validation, business, permission.

Q: What boolean tells the agent whether an MCP error is worth retrying?
A: isRetryable.

Q: Which error category is retryable and which is not?
A: transient = retryable; business/policy violation = not retryable.

Q: What is the difference between an access failure and a valid empty result?
A: Access failure (e.g., timeout) needs a retry decision; a valid empty result is a successful query that simply found no matches.

Q: What are the three MCP server primitives and who controls each?
A: Tools (model-controlled), resources (app-controlled), prompts (user-controlled).

Q: What MCP primitive exposes content catalogs to cut exploratory tool calls?
A: MCP resources.

Q: What is the primary mechanism an LLM uses to select between tools?
A: The tool descriptions.

# Built-in Tools

Q: Which built-in tool searches file CONTENTS for a pattern (string, function name, error)?
A: Grep.

Q: Which built-in tool matches file PATHS/names by pattern (e.g., **/*.test.tsx)?
A: Glob.

Q: Which built-in tool makes a targeted edit using a unique text match?
A: Edit.

Q: What is the fallback when Edit's anchor text is not unique?
A: Read the full file, then Write the complete modified content.

Q: What is the recommended way to build codebase understanding (vs reading everything upfront)?
A: Incrementally: Grep to find entry points, then Read selectively to trace flows.

# CLAUDE.md & Config Files

Q: What is the exam's CLAUDE.md hierarchy (three levels)?
A: User (~/.claude/CLAUDE.md), project (.claude/CLAUDE.md or root CLAUDE.md), directory (subdirectory CLAUDE.md).

Q: Which CLAUDE.md level is shared with the team via version control?
A: Project-level.

Q: Which CLAUDE.md level is personal and NOT shared via version control?
A: User-level (~/.claude/CLAUDE.md).

Q: A new teammate isn't getting team standards — what's the usual cause and fix?
A: The standards are in user-level config (not shared); move them to project-level CLAUDE.md.

Q: What does settings.json hold — and what does it NOT hold?
A: Permissions and tool configuration; it does NOT hold standards/conventions prose (that's CLAUDE.md).

Q: What syntax imports external files into CLAUDE.md, and does it reduce context?
A: @import; it expands inline at launch and organizes content but does NOT reduce total context.

Q: What command shows which memory files a session has loaded?
A: /memory.

Q: EXAM vs DOCS: how does the exam frame the CLAUDE.md hierarchy vs current docs?
A: Exam = user/project/directory; current docs add managed-policy and local layers. Answer user/project/directory.

# Slash Commands, Skills & Rules

Q: Where do team-wide (shared) custom slash commands live?
A: .claude/commands/ (project-scoped, shared via version control).

Q: Where do personal (unshared) custom slash commands live?
A: ~/.claude/commands/.

Q: Where do skills live and what file defines one?
A: In .claude/skills/, defined by a SKILL.md file.

Q: What SKILL.md frontmatter key runs a skill in an isolated sub-agent context?
A: context: fork.

Q: What SKILL.md frontmatter key restricts which tools a skill may use?
A: allowed-tools.

Q: What SKILL.md frontmatter key prompts the developer for required parameters when invoked bare?
A: argument-hint.

Q: Where do path-specific rules live and how are they scoped?
A: In .claude/rules/ files with YAML frontmatter containing a paths: glob pattern.

Q: When should you use a path-scoped rule instead of a directory CLAUDE.md?
A: When the convention must apply to files spread across many directories (e.g., **/*.test.* for scattered tests).

Q: Skills vs CLAUDE.md — when does each load?
A: Skills load on-demand (task-specific); CLAUDE.md is always loaded (universal standards).

Q: EXAM vs DOCS: are custom slash commands and skills the same or distinct?
A: Exam treats them as distinct (.claude/commands/ vs .claude/skills/); current docs merged commands into skills. Answer "distinct".

Q: Two non-existent Claude Code features often used as distractors?
A: A .claude/config.json "commands array" and defining commands inside CLAUDE.md — neither exists.

# Plan Mode & CI

Q: When should you use plan mode?
A: For complex/architectural/multi-file changes or when there are multiple valid approaches — safe read-only exploration first.

Q: When should you use direct execution?
A: For simple, well-scoped changes (e.g., a single-file bug fix with a clear stack trace).

Q: What subagent isolates verbose discovery output and returns summaries?
A: The Explore subagent.

Q: What flag runs Claude Code non-interactively (so a CI job doesn't hang)?
A: -p (or --print).

Q: What two flags produce structured, machine-parseable CI output?
A: --output-format json together with --json-schema.

Q: Three non-existent CI flags/vars used as distractors?
A: CLAUDE_HEADLESS env var, a --batch flag, and --headless — none exist (< /dev/null is a hack, not the documented approach).

Q: Why is the session that generated code weak at reviewing its own code?
A: It retains its own reasoning and won't question its decisions — use a fresh, independent instance.

# Sessions: Resume / Fork / Fresh

Q: What command resumes a specific named prior session?
A: claude --resume <session-name>.

Q: What does --continue do (vs --resume)?
A: --continue reopens the most recent session in the current directory; --resume <name> reopens a specific named one.

Q: What does fork_session (Py) / forkSession (TS) create?
A: An independent branch from a shared baseline — a new session ID; the original is unchanged (two independent sessions).

Q: Does forking branch the filesystem?
A: No — it branches conversation history, not the filesystem; file edits a forked agent makes are real.

Q: DECISION: prior context is still valid — resume, fork, or fresh?
A: Resume.

Q: DECISION: prior tool results are stale because files changed substantially — resume, fork, or fresh?
A: Start a fresh session with an injected structured summary, and name the changed files.

Q: DECISION: you want to compare two divergent approaches from one good baseline — resume, fork, or fresh?
A: fork_session.

# Context Management & Reliability

Q: What is the reliable way to preserve exact transactional facts across a long session?
A: A persistent "case-facts" block (amounts, dates, order numbers) injected every prompt, kept OUTSIDE the summarized history.

Q: What is the "lost in the middle" effect?
A: Models reliably use info at the start and end of long inputs but may omit details from the middle (put key findings first).

Q: What command compacts a filling conversation so an extended session can continue?
A: /compact.

Q: What persists key findings across context boundaries during long exploration?
A: Scratchpad files.

Q: How should a subagent report a failure to enable coordinator recovery?
A: Return structured error context: failure type, attempted query, partial results, and possible alternatives.

Q: Two error-propagation anti-patterns to avoid?
A: Returning empty-as-success (silent suppression) and terminating the whole workflow on a single failure.

# Escalation & Human Review

Q: What are the valid escalation triggers?
A: An explicit customer request for a human, a policy gap/exception, or inability to make meaningful progress.

Q: If a customer explicitly demands a human on an issue the agent could solve, what should it do?
A: Escalate immediately, honoring the request, without first investigating (plus a structured handoff).

Q: Why are sentiment and self-reported confidence bad escalation triggers?
A: They are unreliable proxies for actual case complexity.

Q: When a customer lookup returns multiple matches, what should the agent do?
A: Ask for an additional identifier rather than guessing heuristically.

Q: What must a structured handoff summary contain for a human who lacks the transcript?
A: Customer ID, root-cause analysis so far, relevant amounts/order numbers, and the recommended action.

Q: Before automating high-confidence extractions, what must you verify?
A: Accuracy segmented by document type and field (aggregate accuracy can hide failing segments).

Q: What sampling method keeps measuring error rates after human review is reduced?
A: Stratified random sampling of high-confidence extractions.

# Prompt Engineering & Review

Q: How many few-shot examples are recommended for ambiguous scenarios?
A: 2–4 targeted examples that show the reasoning for the choice.

Q: How many concrete input/output examples best clarify a transformation?
A: 2–3.

Q: What beats "be conservative / only high-confidence" for reducing false positives?
A: Explicit categorical criteria — which issue types to report vs skip, with concrete boundaries.

Q: A finding category is 70% false positives and eroding trust in other categories — what do you do?
A: Temporarily disable that category to protect trust while you fix its prompts.

Q: How do you get consistent severity classification from a reviewer?
A: Define explicit severity criteria with concrete code examples for each level.

Q: What review architecture avoids attention dilution on a large multi-file PR?
A: Per-file local passes plus a separate cross-file integration pass.

Q: Prompt chaining vs dynamic decomposition — when do you use each?
A: Prompt chaining for predictable fixed multi-aspect work; dynamic/adaptive decomposition when the next step depends on what you find.

# Enforcement (deterministic vs probabilistic)

Q: To guarantee a tool sequence (e.g., verify identity before a refund), what do you use?
A: A programmatic prerequisite gate (e.g., a PreToolUse hook) that blocks the downstream tool until the prerequisite completes.

Q: To guarantee a business rule like "no autonomous refund over $500", what do you use?
A: A tool-call interception hook that blocks the call and redirects to escalation (not a prompt instruction).

Q: What PostToolUse hook use normalizes heterogeneous tool data formats?
A: Intercepting tool results to normalize formats (e.g., Unix timestamps, ISO-8601, numeric codes) before the model sees them.

Q: The recurring exam principle when two answers look valid?
A: Structural/deterministic beats reactive/probabilistic (and pick the simplest architecture that reliably works).
