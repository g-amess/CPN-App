import type { Flashcard } from '../types'

/** Seeded from Developer Skilljar modules + exam domains. */
export const flashcards: Flashcard[] = [
  // M1
  { id: 'dfc-token', term: 'Token', def: 'Unit of input, output, and cost. Everything in the request (prompt, history, tools, results, output) counts in tokens.', track: 'build', group: 'm1', groupLabel: 'MSO Foundations' },
  { id: 'dfc-context-window', term: 'Context window', def: 'Fixed token budget for one request. Oversized input errors before generation; mid-generation overflow returns truncated output with model_context_window_exceeded.', track: 'build', group: 'm1', groupLabel: 'MSO Foundations' },
  { id: 'dfc-sampling', term: 'Sampling / non-determinism', def: 'Next tokens are drawn from a probability distribution, so identical prompts can differ in wording. Assert on properties or use evals — not exact text.', track: 'build', group: 'm1', groupLabel: 'MSO Foundations' },
  { id: 'dfc-model-vs-reason', term: 'Model choice vs reasoning mode', def: 'Which family member runs is separate from whether/how much it thinks (adaptive thinking / effort). Compose the two levers independently.', track: 'build', group: 'm1', groupLabel: 'MSO Foundations' },
  { id: 'dfc-batches', term: 'Message Batches API', def: 'Bulk offline submissions with polling (up to ~24h). Lower per-token cost; not the same as async/await concurrency or streaming.', track: 'build', group: 'm1', groupLabel: 'MSO Foundations' },
  // M2
  { id: 'dfc-four-techniques', term: 'Four prompt techniques', def: 'System prompt, XML boundaries, few-shot examples, and output constraints. Diagnose the failure, then add the missing technique.', track: 'build', group: 'm2', groupLabel: 'Prompting & Agents' },
  { id: 'dfc-stop-reason', term: 'stop_reason', def: 'Why generation stopped. In agent loops: continue on tool_use; finish on end_turn. Do not parse natural-language completion phrases.', track: 'build', group: 'm2', groupLabel: 'Prompting & Agents' },
  { id: 'dfc-tool-desc', term: 'Tool description', def: 'Primary signal Claude uses to select a tool. Vague or overlapping descriptions send calls to the wrong tool.', track: 'build', group: 'm2', groupLabel: 'Prompting & Agents' },
  { id: 'dfc-hitl', term: 'HITL (human-in-the-loop)', def: 'Human approval before consequential actions (writes, deletes, sends). Permission bypass that removes the gate is a production risk.', track: 'build', group: 'm2', groupLabel: 'Prompting & Agents' },
  { id: 'dfc-subagent', term: 'Subagent', def: 'Separate agent instance for a discrete subtask. Does not inherit parent history — configure tools and context explicitly.', track: 'build', group: 'm2', groupLabel: 'Prompting & Agents' },
  // M3
  { id: 'dfc-claude-md', term: 'CLAUDE.md', def: 'Durable project context auto-included for Claude Code. Keep it focused — an ever-growing file makes rules stop landing.', track: 'build', group: 'm3', groupLabel: 'Claude Code & MCP' },
  { id: 'dfc-hooks', term: 'Hooks', def: 'Deterministic pre/post tool commands. Can block actions (e.g. exit 2) when prompts alone are not enough.', track: 'build', group: 'm3', groupLabel: 'Claude Code & MCP' },
  { id: 'dfc-mcp', term: 'MCP', def: 'Model Context Protocol — standard layer for tools, resources, and prompts. Match transport/scope; never commit secrets in config.', track: 'build', group: 'm3', groupLabel: 'Claude Code & MCP' },
  // M4
  { id: 'dfc-eval', term: 'Eval suite', def: 'Fixed cases + grading that define "done" before deploy. Match grader to output type; calibrate judges on human labels.', track: 'build', group: 'm4', groupLabel: 'Production Engineering' },
  { id: 'dfc-retriable', term: 'Retriable vs terminal error', def: 'Transient failures may retry with backoff; validation/permission/business failures should not. Return structured metadata to the agent.', track: 'build', group: 'm4', groupLabel: 'Production Engineering' },
  { id: 'dfc-injection', term: 'Prompt injection', def: 'Untrusted fetched content that tries to give the agent orders. Treat external content as data, not instructions.', track: 'build', group: 'm4', groupLabel: 'Production Engineering' },
  // M5
  { id: 'dfc-accelerator', term: 'Accelerator', def: 'Working solution packaged for reuse: parameters for customer-specific parts, written assumptions, bundled eval.', track: 'build', group: 'm5', groupLabel: 'Accelerators & IP' },
  { id: 'dfc-pin', term: 'Pinned model ID vs alias', def: 'Aliases move to new recommended versions. Pin a full model ID so upgrades are deliberate and rollback is possible.', track: 'build', group: 'm5', groupLabel: 'Accelerators & IP' },
  { id: 'dfc-trust-boundary', term: 'Trust boundary', def: 'Seam where data crosses components/environments. Trust does not carry over — mark and scope each boundary.', track: 'build', group: 'm5', groupLabel: 'Accelerators & IP' },
  // Exam-track seeds
  { id: 'dfc-ex-agent-vs-wf', term: 'Agent vs workflow', def: 'Prefer a deterministic workflow when steps are known; use an open-ended agent when the path must be discovered.', track: 'exam', group: 'd1', groupLabel: 'Agents and Workflows' },
  { id: 'dfc-ex-mcp-scope', term: 'MCP server scope', def: 'Configure transport and visibility for the deployment (local vs remote, project vs user) and keep credentials out of committed files.', track: 'exam', group: 'd8', groupLabel: 'Tools and MCPs' },
]
