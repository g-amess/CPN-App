import type { ConceptEntry } from '../types'

/** Lightweight A–Z index for Developer Foundations. */
export const conceptIndex: ConceptEntry[] = [
  { term: 'Accelerator', blurb: 'Reusable packaged solution with parameters, assumptions, and a bundled eval.', links: [{ label: 'Packaging for Reuse', to: '/build/m5/packaging-reuse' }] },
  { term: 'Adaptive thinking', blurb: 'Per-call reasoning mode; tune depth with effort. Separate from which model you pick.', links: [{ label: 'Models & Reasoning', to: '/build/m1/models-and-reasoning' }, { label: 'Extended Thinking', to: '/build/m2/extended-thinking' }] },
  { term: 'Agent loop', blurb: 'Call Claude → inspect stop_reason → run tools → repeat until end_turn.', links: [{ label: 'Agent Construction', to: '/build/m2/agent-construction' }, { label: 'Domain 1', to: '/exam/domain/d1' }] },
  { term: 'CLAUDE.md', blurb: 'Durable project context for Claude Code — keep it focused so rules keep landing.', links: [{ label: 'Durable Project Context', to: '/build/m3/durable-context' }, { label: 'Domain 3', to: '/exam/domain/d3' }] },
  { term: 'Context window', blurb: 'Fixed token budget for one request; application must trim/summarize history.', links: [{ label: 'How LLMs Behave', to: '/build/m1/how-llms-behave' }, { label: 'Context Engineering', to: '/build/m2/context-engineering' }] },
  { term: 'Eval / judge', blurb: 'Fixed cases + grading that define done; calibrate LLM judges on human labels.', links: [{ label: 'Evals & Judges', to: '/build/m4/evals-judges' }, { label: 'Domain 4', to: '/exam/domain/d4' }] },
  { term: 'HITL', blurb: 'Human approval before consequential actions.', links: [{ label: 'Agent Construction', to: '/build/m2/agent-construction' }, { label: 'Permission Modes', to: '/build/m3/permission-modes' }] },
  { term: 'Hooks', blurb: 'Deterministic pre/post tool enforcement in Claude Code.', links: [{ label: 'Durable Project Context', to: '/build/m3/durable-context' }, { label: 'Domain 7', to: '/exam/domain/d7' }] },
  { term: 'MCP', blurb: 'Model Context Protocol for tools, resources, and prompts.', links: [{ label: 'MCP Servers', to: '/build/m3/mcp-servers' }, { label: 'Domain 8', to: '/exam/domain/d8' }] },
  { term: 'Message Batches', blurb: 'Bulk offline API: submit, poll, lower cost, longer latency.', links: [{ label: 'Technical Substrate', to: '/build/m1/technical-substrate' }, { label: 'Multimodal & Batch', to: '/build/m2/multimodal-batch' }] },
  { term: 'model_context_window_exceeded', blurb: 'Stop reason when generation hits the context ceiling mid-response.', links: [{ label: 'How LLMs Behave', to: '/build/m1/how-llms-behave' }] },
  { term: 'Pinned model ID', blurb: 'Fixed model version vs moving alias — required for controlled production upgrades.', links: [{ label: 'Deployment & Versioning', to: '/build/m5/deployment-versioning' }] },
  { term: 'Prompt injection', blurb: 'Untrusted content that tries to instruct the agent; treat as data, gate tools.', links: [{ label: 'Security', to: '/build/m4/security' }, { label: 'Domain 7', to: '/exam/domain/d7' }] },
  { term: 'stop_reason', blurb: 'Structured signal for agent loops: tool_use vs end_turn (and truncation/refusal cases).', links: [{ label: 'Tool-Use & Schema Design', to: '/build/m2/tool-schemas' }] },
  { term: 'Structured outputs', blurb: 'API-enforced JSON schema / strict tool args — still check stop_reason for refusal/truncation.', links: [{ label: 'Prompting Craft', to: '/build/m2/prompting-craft' }] },
  { term: 'Subagent', blurb: 'Isolated agent for a subtask; does not inherit parent context automatically.', links: [{ label: 'Agent Memory', to: '/build/m2/agent-memory' }, { label: 'Domain 1', to: '/exam/domain/d1' }] },
  { term: 'Token', blurb: 'Unit of processing, pricing, and context budget.', links: [{ label: 'How LLMs Behave', to: '/build/m1/how-llms-behave' }] },
  { term: 'Trust boundary', blurb: 'Seam between components/environments where trust must be re-established.', links: [{ label: 'Trust Boundaries', to: '/build/m5/trust-boundaries' }, { label: 'Domain 7', to: '/exam/domain/d7' }] },
  { term: 'Zero / one / multi-shot', blurb: 'How many worked examples sit in the prompt — trade tokens for structure reliability.', links: [{ label: 'Prompting Modes', to: '/build/m1/prompting-modes' }, { label: 'Domain 6', to: '/exam/domain/d6' }] },
]
