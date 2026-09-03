import type { Flashcard } from '../types'
import ccarfDeck from './ccarf-deck.md?raw'
import { parseFlashcardDeck } from '../parseFlashcards'

// Build-track cards are authored inline; exam-track cards are parsed from
// `ccarf-deck.md` so the CCAR-F deck has a single source of truth.
// `group` is a module id (build) or `ccarf-<category>` (exam); groupLabel is the display name.

const buildCards: Flashcard[] = [
  // ---- Build: Foundations (m1) ----
  { id: 'fc-opus', term: 'Opus', def: 'The highest-intelligence Claude model family, for complex multi-step reasoning; trades off higher cost and latency.', track: 'build', group: 'm1', groupLabel: 'Foundations' },
  { id: 'fc-sonnet', term: 'Sonnet', def: 'The balanced Claude model — strong intelligence, speed, and cost, with strong coding ability. The practical default.', track: 'build', group: 'm1', groupLabel: 'Foundations' },
  { id: 'fc-haiku', term: 'Haiku', def: 'The fastest, most cost-efficient Claude model — best for real-time interactions and high-volume processing.', track: 'build', group: 'm1', groupLabel: 'Foundations' },
  { id: 'fc-max-tokens', term: 'max_tokens', def: 'A safety ceiling on generation length — NOT a target length. The model may stop earlier.', track: 'build', group: 'm1', groupLabel: 'Foundations' },
  { id: 'fc-tokenization', term: 'Tokenization', def: 'The first text-generation stage: breaking input into tokens (words, word-parts, symbols, spaces).', track: 'build', group: 'm1', groupLabel: 'Foundations' },
  { id: 'fc-contextualization', term: 'Contextualization', def: 'Adjusting a token’s embedding based on neighboring tokens to determine its precise meaning.', track: 'build', group: 'm1', groupLabel: 'Foundations' },
  { id: 'fc-stateless', term: 'API statelessness', def: 'The Anthropic API stores no messages — you must resend the entire conversation history with every request.', track: 'build', group: 'm1', groupLabel: 'Foundations' },
  { id: 'fc-system-prompt', term: 'System prompt', def: 'A string (passed via the system arg) that controls HOW Claude responds — role, tone, behavior — not what it responds.', track: 'build', group: 'm1', groupLabel: 'Foundations' },
  { id: 'fc-temperature', term: 'Temperature', def: 'A 0–1 dial on randomness in next-token selection. 0 = deterministic (top token); higher = more varied/creative.', track: 'build', group: 'm1', groupLabel: 'Foundations' },
  { id: 'fc-prefill', term: 'Prefilling', def: 'Adding an assistant message yourself so Claude continues from your exact text — steering response direction.', track: 'build', group: 'm1', groupLabel: 'Foundations' },
  { id: 'fc-stop-seq', term: 'Stop sequence', def: 'A string that halts generation when produced; the string itself is excluded from the output.', track: 'build', group: 'm1', groupLabel: 'Foundations' },

  // ---- Build: Prompt Engineering & Evaluation (m2) ----
  { id: 'fc-eval', term: 'Prompt evaluation', def: 'Automated, objective scoring of prompts via a pipeline (dataset → responses → grader) instead of eyeballing outputs.', track: 'build', group: 'm2', groupLabel: 'Prompt Engineering & Evaluation' },
  { id: 'fc-model-grader', term: 'Model-based grading', def: 'An extra LLM call that scores an output. Ask for reasoning + score (not a bare number) to avoid middling defaults.', track: 'build', group: 'm2', groupLabel: 'Prompt Engineering & Evaluation' },
  { id: 'fc-code-grader', term: 'Code-based grading', def: 'Programmatic validation (e.g. parse JSON/Python/regex → 10 or 0). Combine with model score: (model+syntax)/2.', track: 'build', group: 'm2', groupLabel: 'Prompt Engineering & Evaluation' },
  { id: 'fc-clear-direct', term: 'Clear & direct', def: 'Lead with an action verb + precise task + output spec in the first line — the most important part of a prompt.', track: 'build', group: 'm2', groupLabel: 'Prompt Engineering & Evaluation' },
  { id: 'fc-being-specific', term: 'Being specific', def: 'Add Type A (attribute) guidelines and/or Type B (reasoning-step) guidelines to steer the output.', track: 'build', group: 'm2', groupLabel: 'Prompt Engineering & Evaluation' },
  { id: 'fc-xml-tags', term: 'XML tags', def: 'Descriptive tags (e.g. <my_code>, <docs>) that mark content boundaries in a prompt so Claude groups information correctly.', track: 'build', group: 'm2', groupLabel: 'Prompt Engineering & Evaluation' },
  { id: 'fc-few-shot', term: 'Few-shot prompting', def: 'Providing examples (one-shot/multi-shot) to lock in format and handle corner cases; include reasoning on why each is ideal.', track: 'build', group: 'm2', groupLabel: 'Prompt Engineering & Evaluation' },

  // ---- Build: Tool Use (m3) ----
  { id: 'fc-tool-use', term: 'Tool use', def: 'The mechanism that lets Claude request external data/actions: prompt+schemas → Claude asks → you run it → return result → final answer.', track: 'build', group: 'm3', groupLabel: 'Tool Use' },
  { id: 'fc-tool-schema', term: 'Tool schema', def: 'A JSON-schema spec with name, description, and input_schema. The description is the primary tool-selection signal.', track: 'build', group: 'm3', groupLabel: 'Tool Use' },
  { id: 'fc-stop-reason', term: 'stop_reason', def: 'The field saying why Claude stopped. "tool_use" → it wants a tool; "end_turn" → it’s done. The agentic loop keys on it.', track: 'build', group: 'm3', groupLabel: 'Tool Use' },
  { id: 'fc-tool-result', term: 'tool_result block', def: 'Carries tool_use_id (matching the request), content (stringified), and is_error. Sent in a USER message.', track: 'build', group: 'm3', groupLabel: 'Tool Use' },
  { id: 'fc-tool-use-id', term: 'tool_use_id', def: 'The id that pairs a tool_result with its originating tool_use request — essential for simultaneous tool calls.', track: 'build', group: 'm3', groupLabel: 'Tool Use' },
  { id: 'fc-tool-choice', term: 'tool_choice', def: '"auto" (text or tool), "any" (must call some tool), or forced {"type":"tool","name":...} (must call that tool).', track: 'build', group: 'm3', groupLabel: 'Tool Use' },
  { id: 'fc-batch-tool', term: 'Batch tool', def: 'A meta-tool taking a list of invocations so Claude runs multiple tools in one cycle (parallel-ish). Not the Message Batches API.', track: 'build', group: 'm3', groupLabel: 'Tool Use' },
  { id: 'fc-fine-grained', term: 'Fine-grained tool calling', def: 'fine_grained:true disables API-side JSON validation so tool-argument chunks stream immediately (you handle invalid JSON).', track: 'build', group: 'm3', groupLabel: 'Tool Use' },

  // ---- Build: RAG (m4) ----
  { id: 'fc-rag', term: 'RAG', def: 'Retrieval Augmented Generation: chunk documents, retrieve only the relevant chunks, and include those in the prompt.', track: 'build', group: 'm4', groupLabel: 'RAG' },
  { id: 'fc-chunking', term: 'Chunking', def: 'Splitting documents for retrieval: size-based (+overlap), structure-based (headers), or semantic. No universal best.', track: 'build', group: 'm4', groupLabel: 'RAG' },
  { id: 'fc-embedding', term: 'Text embedding', def: 'A numeric vector representing text meaning; similar texts get similar vectors, enabling semantic (meaning) search.', track: 'build', group: 'm4', groupLabel: 'RAG' },
  { id: 'fc-cosine', term: 'Cosine similarity', def: 'Cosine of the angle between vectors (-1 to 1); closer to 1 = more similar. Cosine distance = 1 − similarity.', track: 'build', group: 'm4', groupLabel: 'RAG' },
  { id: 'fc-bm25', term: 'BM25', def: 'A lexical (keyword) search algorithm that weights rare terms higher; complements semantic search’s exact-match blind spots.', track: 'build', group: 'm4', groupLabel: 'RAG' },
  { id: 'fc-rrf', term: 'Reciprocal Rank Fusion (RRF)', def: 'Merges ranked lists by summing 1/(rank+1) per document across methods; docs ranking high in multiple lists win.', track: 'build', group: 'm4', groupLabel: 'RAG' },
  { id: 'fc-reranking', term: 'Reranking', def: 'A post-retrieval LLM pass that reorders candidates by true relevance — more accurate, but adds latency.', track: 'build', group: 'm4', groupLabel: 'RAG' },
  { id: 'fc-contextual-retrieval', term: 'Contextual retrieval', def: 'Prepending generated situating context to each chunk before embedding, so chunks retain ties to the whole document.', track: 'build', group: 'm4', groupLabel: 'RAG' },

  // ---- Build: Advanced (m5) ----
  { id: 'fc-extended-thinking', term: 'Extended thinking', def: 'A reasoning budget (min 1024 tokens; max_tokens must exceed it) before the final answer. Use after prompt optimization.', track: 'build', group: 'm5', groupLabel: 'Advanced Capabilities' },
  { id: 'fc-citations', term: 'Citations', def: 'Enable with citations:{enabled:true} + a source title; responses link statements to page/char locations in the source.', track: 'build', group: 'm5', groupLabel: 'Advanced Capabilities' },
  { id: 'fc-prompt-caching', term: 'Prompt caching', def: 'Reuses the processing of repeated input (≥1024 tokens) to cut cost/latency. Order: tools → system → messages. (Exam: just know it exists.)', track: 'build', group: 'm5', groupLabel: 'Advanced Capabilities' },
  { id: 'fc-files-api', term: 'Files API', def: 'Upload files once and reference them by file ID in later requests instead of resending raw data.', track: 'build', group: 'm5', groupLabel: 'Advanced Capabilities' },
  { id: 'fc-code-execution', term: 'Code execution', def: 'A server tool running Python in a network-isolated Docker container; data in/out via the Files API.', track: 'build', group: 'm5', groupLabel: 'Advanced Capabilities' },

  // ---- Build: MCP (m6) ----
  { id: 'fc-mcp', term: 'MCP', def: 'Model Context Protocol — a standard layer exposing tools, resources, and prompts via a server so you stop hand-writing integration code.', track: 'build', group: 'm6', groupLabel: 'MCP' },
  { id: 'fc-mcp-client', term: 'MCP client', def: 'A transport-agnostic intermediary between your server and an MCP server; it facilitates list-tools/call-tool, not the execution itself.', track: 'build', group: 'm6', groupLabel: 'MCP' },
  { id: 'fc-mcp-tool-decorator', term: '@mcp.tool', def: 'A decorator that auto-generates a tool’s JSON schema from a typed Python function (using Field() for arg descriptions).', track: 'build', group: 'm6', groupLabel: 'MCP' },
  { id: 'fc-mcp-resource', term: 'MCP resource', def: 'App-controlled data exposed via @mcp.resource at a URI (direct or templated). Provides data proactively (e.g. catalogs).', track: 'build', group: 'm6', groupLabel: 'MCP' },
  { id: 'fc-mcp-prompt', term: 'MCP prompt', def: 'A server-authored, tested prompt template returning ready messages; surfaced to users as slash commands. User-controlled.', track: 'build', group: 'm6', groupLabel: 'MCP' },
  { id: 'fc-mcp-primitives', term: 'The 3 MCP primitives', def: 'Tools (model-controlled), resources (app-controlled), prompts (user-controlled).', track: 'build', group: 'm6', groupLabel: 'MCP' },
  { id: 'fc-mcp-inspector', term: 'MCP Inspector', def: 'An in-browser debugger (mcp dev server.py) for manually testing an MCP server’s tools/resources/prompts before app integration.', track: 'build', group: 'm6', groupLabel: 'MCP' },

  // ---- Build: Claude Code & Agents (m7) ----
  { id: 'fc-claude-md', term: 'CLAUDE.md', def: 'Auto-included project context created by /init. Levels: project (shared), local, machine/user (global).', track: 'build', group: 'm7', groupLabel: 'Claude Code & Agents' },
  { id: 'fc-plan-mode', term: 'Plan mode', def: 'Shift+Tab twice — Claude researches and produces a detailed plan before changing code. For breadth/architecture.', track: 'build', group: 'm7', groupLabel: 'Claude Code & Agents' },
  { id: 'fc-thinking-mode', term: 'Thinking mode', def: 'Triggered by phrases like "ultrathink" — extended reasoning budget for depth/tricky logic.', track: 'build', group: 'm7', groupLabel: 'Claude Code & Agents' },
  { id: 'fc-custom-command', term: 'Custom command', def: 'A markdown file in .claude/commands/ invoked via /name, with a $ARGUMENTS placeholder for runtime parameters.', track: 'build', group: 'm7', groupLabel: 'Claude Code & Agents' },
  { id: 'fc-hooks', term: 'Hooks', def: 'Commands run before/after tools. Pre-hooks can block (exit 2 → stderr to Claude); post-hooks give feedback. Deterministic.', track: 'build', group: 'm7', groupLabel: 'Claude Code & Agents' },
  { id: 'fc-evaluator-optimizer', term: 'Evaluator-optimizer', def: 'A workflow pattern: a producer generates output, an evaluator assesses it, looping until the evaluator accepts.', track: 'build', group: 'm7', groupLabel: 'Claude Code & Agents' },
  { id: 'fc-workflow-vs-agent', term: 'Workflow vs agent', def: 'Workflow = known steps (reliable, testable). Agent = unknown steps (flexible, riskier). Prefer workflows for reliability.', track: 'build', group: 'm7', groupLabel: 'Claude Code & Agents' },
  { id: 'fc-tool-abstraction', term: 'Tool abstraction principle', def: 'Give agents small, abstract, composable tools (bash, file_write) rather than many hyper-specialized ones.', track: 'build', group: 'm7', groupLabel: 'Claude Code & Agents' },
  { id: 'fc-worktrees', term: 'Git work trees', def: 'Isolated project copies (per branch) that let multiple Claude instances work in parallel without file conflicts.', track: 'build', group: 'm7', groupLabel: 'Claude Code & Agents' },
]

const examCards: Flashcard[] = parseFlashcardDeck(ccarfDeck, { track: 'exam', idPrefix: 'ccarf' })

export const flashcards: Flashcard[] = [...buildCards, ...examCards]
