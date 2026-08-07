#!/usr/bin/env python3
"""Polish generated Developer build modules + seed flashcards/practice/concepts."""
from __future__ import annotations

import json
import re
from pathlib import Path
from textwrap import dedent

ROOT = Path(__file__).resolve().parents[1]
MOD = ROOT / "src" / "content" / "developer" / "modules"
DEV = ROOT / "src" / "content" / "developer"

# Correct examRelevance + curated keyTakeaways (grounded in module recaps / teaching).
POLISH: dict[str, dict] = {
    "m1-mso-foundations.ts": {
        "how-llms-behave": {
            "exam": [{"domainId": "d5", "label": "LLM fundamentals · tokens, context, sampling"}],
            "takes": [
                "Think and budget in tokens — they meter cost and the context window.",
                "An oversized input errors before generation; hitting the ceiling mid-generation returns truncated output with model_context_window_exceeded.",
                "Sampling makes wording non-deterministic — assert on properties or use evals, not exact text.",
                "Newest Claude models may reject non-default temperature/top_p/top_k (400); confirm API support at build time.",
            ],
        },
        "models-and-reasoning": {
            "exam": [{"domainId": "d5", "label": "Model tiers vs reasoning mode"}],
            "takes": [
                "Claude tiers trade cost, latency, and capability: start with Sonnet; move up/down only when an eval says so.",
                "Model choice and reasoning mode are separate, composable levers.",
                "Adaptive thinking uses an effort setting; older budget_tokens is deprecated on newest models.",
                "Confirm current model IDs and thinking defaults at platform.claude.com/docs.",
            ],
        },
        "prompting-modes": {
            "exam": [{"domainId": "d6", "label": "Zero-/one-/multi-shot prompting"}],
            "takes": [
                "Zero-shot = instruction only; one-shot / multi-shot add worked examples in the prompt (not training data).",
                "Each example costs tokens on every call — add the fewest that make output reliable.",
                "A stronger model may succeed zero-shot where a cheaper model needs examples; decide both with an eval.",
            ],
        },
        "technical-substrate": {
            "exam": [{"domainId": "d2", "label": "SDK, streaming, async, Message Batches"}],
            "takes": [
                "SDK and raw REST hit the same Messages API; the SDK removes request boilerplate.",
                "Sync waits for the full response; streaming (SSE) delivers tokens as they generate.",
                "Async/await concurrency ≠ Message Batches: batch is for bulk offline work (up to 24h, lower per-token cost).",
            ],
        },
        "m1-takeaways": {
            "exam": None,
            "takes": [
                "Tokens are the unit of input, output, and cost.",
                "The context window is a fixed budget the application must manage.",
                "Sampling makes generation non-deterministic — evals, not exact-string tests.",
                "Model choice and reasoning mode are separate levers; escalate only where the eval requires it.",
                "Choose sync, streaming, async, or batch based on whether a user is waiting and whether work is real-time or bulk.",
            ],
        },
    },
    "m2-prompting-agents-tool-use.ts": {
        "prompting-craft": {
            "exam": [{"domainId": "d6", "label": "Prompt craft · system, XML, few-shot, constraints"}],
            "takes": [
                "Diagnose the failure mode first, then add the one missing technique — do not just lengthen the prompt.",
                "Four techniques: system prompt, XML boundaries, few-shot examples, output constraints.",
                "Structured outputs (JSON schema / strict tool use) enforce shape at generation time — still check stop_reason.",
            ],
        },
        "extended-thinking": {
            "exam": [{"domainId": "d5", "label": "Extended / adaptive thinking"}],
            "takes": [
                "Reasoning mode is per-call and independent of which model you chose.",
                "Spend thinking budget on hard multi-step work; skip it for lookups and simple classification.",
                "Handle thinking blocks correctly when you need to display or persist them.",
            ],
        },
        "tool-schemas": {
            "exam": [{"domainId": "d8", "label": "Tool schemas and the tool-use loop"}],
            "takes": [
                "The tool description is the primary selection signal — vague descriptions send Claude to the wrong tool.",
                "Drive the loop with stop_reason: tool_use continues; end_turn finishes.",
                "Every tool_use block needs a matching tool_result with the same id on the next user turn.",
            ],
        },
        "streaming": {
            "exam": [{"domainId": "d2", "label": "Streaming and partial output"}],
            "takes": [
                "Reassemble stream events into a complete message before committing tool calls to history.",
                "A half-written tool call left in history corrupts the next turn — recover or discard incomplete state.",
                "Streaming improves UX for long responses; it does not change the underlying Messages API contract.",
            ],
        },
        "context-engineering": {
            "exam": [{"domainId": "d6", "label": "Context-window management"}],
            "takes": [
                "Sessions that fit in development can exceed the window in production as history and tool results accumulate.",
                "Trim or summarize before each call — the model does not silently drop old turns.",
                "Pick the smallest model that meets the eval; context pressure and model tier interact.",
            ],
        },
        "agent-construction": {
            "exam": [{"domainId": "d1", "label": "Agent loop, orchestration, HITL"}],
            "takes": [
                "A production agent is a loop: call → inspect stop_reason → run tools → repeat, with hard iteration caps.",
                "Gate consequential actions (writes, deletes, sends) with human-in-the-loop approval.",
                "Wire tools and permissions explicitly — an agent that can edit production files must be constrained.",
            ],
        },
        "agent-memory": {
            "exam": [{"domainId": "d1", "label": "Agent memory scopes"}],
            "takes": [
                "Choose memory scope deliberately: session vs durable external store vs summary.",
                "Dumping all prior sessions into the window will fill it by session four.",
                "Subagents start clean — pass only the context they need.",
            ],
        },
        "multimodal-batch": {
            "exam": [{"domainId": "d2", "label": "Multimodal input and Message Batches"}],
            "takes": [
                "Encode images/PDFs the way the API expects for the modality — wrong encoding fails quietly or wastes tokens.",
                "A loop of synchronous calls is not a batch job; use Message Batches for bulk offline work.",
                "Batch trades latency (up to 24h) for lower per-token cost when no user is waiting.",
            ],
        },
        "m2-takeaways": {
            "exam": None,
            "takes": [
                "Diagnose prompt failures structurally — add the missing technique, not more words.",
                "Tool-use loops key off stop_reason and paired tool_result ids.",
                "Stream safely; manage context and memory so production sessions do not hit the ceiling.",
                "Agents need HITL gates on consequential actions and explicit memory scope.",
            ],
        },
    },
    "m3-claude-code-mcp.ts": {
        "permission-modes": {
            "exam": [{"domainId": "d3", "label": "Permission modes and human gates"}],
            "takes": [
                "Permission modes and settings define what Claude Code may do without asking.",
                "Bypass modes that remove the human gate also remove the last prompt that mattered for risky actions.",
                "Place human gates on consequential tools — do not rely on the model to refuse.",
            ],
        },
        "durable-context": {
            "exam": [{"domainId": "d3", "label": "CLAUDE.md, rules, hooks, subagents"}],
            "takes": [
                "CLAUDE.md and rules files are durable project context — keep them focused or rules stop landing.",
                "Hooks enforce deterministic policy prompts cannot guarantee.",
                "Subagents isolate noisy work; configure them explicitly with the tools they need.",
            ],
        },
        "packaging-workflows": {
            "exam": [{"domainId": "d3", "label": "Plugins, skills, and marketplace install"}],
            "takes": [
                "Package workflows as plugins (skills, commands) so others can install them.",
                "A plugin that only works on your machine usually hard-codes paths or secrets — fix the definition.",
                "Place skills in the runtime/scope the marketplace and team expect.",
            ],
        },
        "mcp-servers": {
            "exam": [{"domainId": "d8", "label": "MCP transport, scope, and secrets"}],
            "takes": [
                "Match MCP transport and scope to the deployment scenario.",
                "Never commit API keys in MCP config — use env expansion / secret stores.",
                "MCP standardizes tools/resources/prompts so you stop hand-rolling every integration.",
            ],
        },
        "enterprise-integration": {
            "exam": [{"domainId": "d7", "label": "Enterprise auth and identity"}],
            "takes": [
                "Staging OAuth that works can still fail in production when redirect URIs, audiences, or secrets differ.",
                "Authenticate Claude to enterprise systems with scoped identity — least privilege.",
                "Diagnose auth failures from traces: token, audience, and environment mismatch are common.",
            ],
        },
        "m3-takeaways": {
            "exam": None,
            "takes": [
                "Permission modes + human gates keep consequential actions safe.",
                "Durable context (CLAUDE.md, rules, hooks) must stay loadable and scoped.",
                "Package plugins portably; keep secrets out of MCP and repo config.",
                "Enterprise auth must match each environment’s identity configuration.",
            ],
        },
    },
    "m4-production-evals-security.ts": {
        "evals-judges": {
            "exam": [{"domainId": "d4", "label": "Evals and calibrated judges"}],
            "takes": [
                "Write the eval (and design doc) before you ship — define done as scores on fixed cases.",
                "Match grading to the task: exact match, code check, or LLM-as-judge calibrated on human labels.",
                "A demo that passes is not an eval — edge cases you never graded will fail in production.",
            ],
        },
        "testing-tracing": {
            "exam": [{"domainId": "d4", "label": "Test levels and tracing"}],
            "takes": [
                "Unit, functional, integration, and end-to-end tests catch different breaks.",
                "Silent failures often hide at integration seams where two green components hand off.",
                "Traces show which step produced the bad result — instrument before you need them.",
            ],
        },
        "failure-handling": {
            "exam": [{"domainId": "d4", "label": "Retriable vs terminal failures"}],
            "takes": [
                "Sort failures: retriable (transient) vs terminal (validation, permission, business).",
                "Return structured error metadata so the agent can decide to retry or stop.",
                "Paths that never failed in development still need production retry/backoff design.",
            ],
        },
        "model-selection-prod": {
            "exam": [{"domainId": "d5", "label": "Production model selection"}],
            "takes": [
                "Choose the model from the binding constraint: quality, latency, or cost — proven by eval.",
                "Do not upgrade tiers without evidence; do not downgrade without checking the quality drop.",
                "Confirm current model identifiers and platform availability at build time.",
            ],
        },
        "cost-orchestration": {
            "exam": [{"domainId": "d5", "label": "Cost, latency, and orchestration budgets"}],
            "takes": [
                "Instrument every call against cost and latency budgets.",
                "Parallel fan-out can triple the bill — use it only when the task needs it.",
                "Match agent type and cost levers to each subtask.",
            ],
        },
        "security": {
            "exam": [{"domainId": "d7", "label": "Prompt injection and secure configuration"}],
            "takes": [
                "Treat fetched content as data, not instructions — prompt injection rides in untrusted input.",
                "Scope identity, gate dangerous tools, and keep secrets out of prompts and logs.",
                "Assemble the minimal secure configuration that survives a regulated review.",
            ],
        },
        "m4-takeaways": {
            "exam": None,
            "takes": [
                "Set the standard with evals before you build.",
                "Match tests to failure types and trace seams.",
                "Handle retriable and terminal failures differently.",
                "Stay inside cost/latency budgets; defend trust boundaries against untrusted input.",
            ],
        },
    },
    "m5-accelerators-ip.ts": {
        "packaging-reuse": {
            "exam": [{"domainId": "d2", "label": "Packaging reusable accelerators"}],
            "takes": [
                "Package while the build is fresh — expose customer-specific parts as documented parameters.",
                "Bundle the eval and assumptions with the asset so the next team can configure, not rebuild.",
                "A template that ships fast but cannot be reused usually hard-codes the first customer.",
            ],
        },
        "contributing-back": {
            "exam": [{"domainId": "d2", "label": "Contribution readiness"}],
            "takes": [
                "Maintainers accept what they can verify: focused code, runnable example, test, assumptions, rights.",
                "Match the contribution to the right channel for its shape.",
                "A PR a reviewer cannot run sits at the back of the queue.",
            ],
        },
        "requirements-lifecycle": {
            "exam": [{"domainId": "d2", "label": "Requirements and systems lifecycle"}],
            "takes": [
                "Translate business needs into functional and infrastructure requirements for Claude apps.",
                "Place work correctly across build, deploy, operate, and maintain phases.",
                "Lifecycle mistakes show up as features that cannot be operated or audited later.",
            ],
        },
        "deployment-versioning": {
            "exam": [{"domainId": "d2", "label": "Deployment platforms and pinned model IDs"}],
            "takes": [
                "Choose the platform from cloud and compliance posture, then pin a specific model version.",
                "Aliases move — pinning cites a fixed edition so upgrades are deliberate.",
                "Keep the prior version available for rollback.",
            ],
        },
        "comparing-platforms": {
            "exam": [{"domainId": "d2", "label": "Latency, compliance, and cost comparison"}],
            "takes": [
                "Measure latency from the customer region, compliance against their certifications, and total cost per call.",
                "For regulated customers, compliance is usually pass-or-fail — raise it during scoping.",
                "Familiarity alone is not a platform decision.",
            ],
        },
        "trust-boundaries": {
            "exam": [{"domainId": "d7", "label": "Multi-component trust boundaries"}],
            "takes": [
                "Mark every seam where data crosses environments as a trust boundary.",
                "Scope each component to minimum access; trust does not carry over automatically.",
                "When a seam cannot be secured, assign a human owner rather than shipping it.",
            ],
        },
        "m5-takeaways": {
            "exam": None,
            "takes": [
                "Package accelerators with parameters, evals, and written assumptions.",
                "Contribute only what a maintainer can verify.",
                "Pin model versions; measure platform fit on latency, compliance, and cost.",
                "Mark every multi-component seam as a trust boundary.",
            ],
        },
    },
}


def clean_body(body: str) -> str:
    """Fix common scrape artifacts inside template literal bodies."""
    # Fix missing space between sentences jammed together
    body = re.sub(r"([a-z])([A-Z])", r"\1 \2", body)
    # Remove leading tab-label soup lines (short Title Case words jammed)
    lines = body.split("\n")
    if lines:
        first = lines[0].strip()
        if first and not first.startswith("#") and not first.startswith("This recap") and len(first) < 120:
            # Likely "Tokens Context Window Sampling Non-determinism"
            words = first.split()
            if len(words) >= 2 and all(w[:1].isupper() for w in words if w.isalpha()):
                lines = lines[1:]
                while lines and not lines[0].strip():
                    lines = lines[1:]
                body = "\n".join(lines)
    # Fix "## N" takeaway formatting → bold numbered items
    body = re.sub(
        r"^## (\d+)\n\n(.+)$",
        lambda m: f"**{m.group(1)}. {m.group(2).strip()}**",
        body,
        flags=re.M,
    )
    # Fix jammed period+Capital
    body = re.sub(r"\.([A-Z])", r". \1", body)
    return body.strip()


def replace_lesson_fields(src: str, lesson_id: str, takes: list[str], exam: list[dict] | None) -> str:
    # Find lesson block by id
    pat = re.compile(
        rf"(id: '{re.escape(lesson_id)}',.*?keyTakeaways: \[)(.*?)(\],)(\s*examRelevance: \[.*?\],)?",
        re.S,
    )

    def repl(m: re.Match) -> str:
        takes_js = ",\n".join(f"        {json.dumps(t)}" for t in takes)
        exam_block = ""
        if exam:
            exam_lines = ",\n".join(
                f'        {{ domainId: "{e["domainId"]}", label: {json.dumps(e["label"])} }}' for e in exam
            )
            exam_block = f",\n      examRelevance: [\n{exam_lines},\n      ]"
        return f"{m.group(1)}\n{takes_js},\n      ]{exam_block}"

    new_src, n = pat.subn(repl, src, count=1)
    if n != 1:
        print(f"  WARN: could not polish lesson {lesson_id} (matches={n})")
        return src
    return new_src


def polish_file(path: Path) -> None:
    name = path.name
    if name not in POLISH:
        return
    src = path.read_text(encoding="utf-8")
    # Clean bodies inside template literals — rough pass on whole file for jammed sentences
    # Only apply light clean to body sections
    def clean_tpl(m: re.Match) -> str:
        return "body: `" + clean_body(m.group(1)) + "`"

    src = re.sub(r"body: `(.*?)`", clean_tpl, src, flags=re.S)
    for lid, cfg in POLISH[name].items():
        src = replace_lesson_fields(src, lid, cfg["takes"], cfg.get("exam"))
    # Normalize indentation of lesson objects a bit
    path.write_text(src, encoding="utf-8")
    print(f"Polished {name}")


def write_build_track() -> None:
    (DEV / "buildTrack.ts").write_text(
        dedent(
            """\
            import type { BuildModule, Lesson } from '../types'
            import { m1 } from './modules/m1-mso-foundations'
            import { m2 } from './modules/m2-prompting-agents-tool-use'
            import { m3 } from './modules/m3-claude-code-mcp'
            import { m4 } from './modules/m4-production-evals-security'
            import { m5 } from './modules/m5-accelerators-ip'

            export const buildModules: BuildModule[] = [m1, m2, m3, m4, m5]

            export const allLessons: Lesson[] = buildModules.flatMap((m) => m.lessons)

            export const totalLessons = allLessons.length

            export function findLesson(moduleId: string, lessonId: string): Lesson | undefined {
              return buildModules.find((m) => m.id === moduleId)?.lessons.find((l) => l.id === lessonId)
            }

            export function lessonById(lessonId: string): Lesson | undefined {
              return allLessons.find((l) => l.id === lessonId)
            }

            export function moduleById(moduleId: string): BuildModule | undefined {
              return buildModules.find((m) => m.id === moduleId)
            }

            export const lessonOrder = buildModules.flatMap((m) =>
              m.lessons.map((l) => ({ moduleId: m.id, lessonId: l.id })),
            )

            export function adjacentLessons(moduleId: string, lessonId: string) {
              const i = lessonOrder.findIndex((x) => x.moduleId === moduleId && x.lessonId === lessonId)
              return {
                prev: i > 0 ? lessonOrder[i - 1] : undefined,
                next: i >= 0 && i < lessonOrder.length - 1 ? lessonOrder[i + 1] : undefined,
              }
            }
            """
        ),
        encoding="utf-8",
    )
    print("Rewrote buildTrack.ts")


def write_seeds() -> None:
    (DEV / "flashcards.ts").write_text(
        dedent(
            """\
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
              { id: 'dfc-eval', term: 'Eval suite', def: 'Fixed cases + grading that define \"done\" before deploy. Match grader to output type; calibrate judges on human labels.', track: 'build', group: 'm4', groupLabel: 'Production Engineering' },
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
            """
        ),
        encoding="utf-8",
    )

    (DEV / "practiceQuestions.ts").write_text(
        dedent(
            """\
            import type { PracticeQuestion } from '../types'

            /**
             * Seed practice items grounded in module checkpoints / quiz stems.
             * Official sample questions live in sampleQuestions.ts.
             */
            export const practiceQuestions: PracticeQuestion[] = [
              {
                id: 'dp1',
                source: 'practice',
                track: 'build',
                domainId: 'd5',
                question:
                  'A teammate says two identical prompts must return identical text. What is the most accurate response?',
                options: [
                  { key: 'A', text: 'That is true — the model is deterministic.' },
                  {
                    key: 'B',
                    text: 'Not necessarily — the model samples each next token, so wording can vary even when both answers are correct.',
                  },
                  { key: 'C', text: 'That is only true if streaming is off.' },
                  { key: 'D', text: 'That is only true on the largest model.' },
                ],
                correct: 'B',
                explanation:
                  'Generation samples from a probability distribution. Even temperature 0 improves repeatability without guaranteeing identical strings. Assert on properties or use evals.',
              },
              {
                id: 'dp2',
                source: 'practice',
                track: 'build',
                domainId: 'd5',
                question: 'Which statement best separates model choice from reasoning mode?',
                options: [
                  { key: 'A', text: 'They are the same setting.' },
                  { key: 'B', text: 'Extended thinking is a different model.' },
                  {
                    key: 'C',
                    text: 'Model choice picks which family member runs; reasoning/thinking is a per-call setting on supporting models.',
                  },
                  { key: 'D', text: 'Reasoning mode is fixed per account.' },
                ],
                correct: 'C',
                explanation:
                  'Pick the model for cost/latency/capability. Separately enable and calibrate thinking per request. The two levers compose.',
              },
              {
                id: 'dp3',
                source: 'practice',
                track: 'build',
                domainId: 'd6',
                question:
                  'A short, well-specified classification task returns the right answer zero-shot. What does adding three examples most likely do?',
                options: [
                  { key: 'A', text: 'Improve accuracy substantially.' },
                  { key: 'B', text: 'Add token cost on every call for little or no gain.' },
                  { key: 'C', text: 'Change the model being used.' },
                  { key: 'D', text: 'Disable sampling.' },
                ],
                correct: 'B',
                explanation:
                  'Examples cost tokens on every call. If zero-shot already meets the eval, extra shots usually buy cost without quality.',
              },
              {
                id: 'dp4',
                source: 'practice',
                track: 'build',
                domainId: 'd2',
                question: 'You must process thousands of inputs offline at the lowest cost. Which shape fits?',
                options: [
                  { key: 'A', text: 'Synchronous calls in a loop.' },
                  { key: 'B', text: 'Streaming.' },
                  { key: 'C', text: 'Batch submission with polling.' },
                  { key: 'D', text: 'A larger context window.' },
                ],
                correct: 'C',
                explanation:
                  'Message Batches are for bulk offline workloads: submit, poll, accept longer latency for lower per-token cost. Streaming helps interactive UX, not overnight bulk.',
              },
              {
                id: 'dp5',
                source: 'practice',
                track: 'build',
                domainId: 'd6',
                question:
                  'A long multi-turn agent session keeps failing after it worked in testing. What is the most likely budget at fault?',
                options: [
                  { key: 'A', text: 'Temperature — lower it as the session grows.' },
                  {
                    key: 'B',
                    text: 'The context window — history and tool results fill a fixed token budget until input is rejected or output truncates with model_context_window_exceeded.',
                  },
                  { key: 'C', text: 'There is no fixed budget; the window expands automatically.' },
                  { key: 'D', text: 'The model silently drops oldest turns, so no application action is needed.' },
                ],
                correct: 'B',
                explanation:
                  'The application must trim or summarize. The model does not auto-expand the window or silently drop history without consequence.',
              },
              {
                id: 'dp6',
                source: 'practice',
                track: 'exam',
                domainId: 'd8',
                question:
                  'Claude keeps calling the wrong tool even though both tools are listed. What should you fix first?',
                options: [
                  { key: 'A', text: 'Raise temperature so the model explores more tools.' },
                  {
                    key: 'B',
                    text: 'Rewrite the tool descriptions so each one’s purpose and when-to-use criteria are unambiguous.',
                  },
                  { key: 'C', text: 'Remove stop_reason handling from the loop.' },
                  { key: 'D', text: 'Switch to Message Batches for every tool call.' },
                ],
                correct: 'B',
                explanation:
                  'The description is the primary selection signal. Overlapping or vague descriptions cause mis-routing; sampling and batch APIs do not fix schema clarity.',
              },
              {
                id: 'dp7',
                source: 'practice',
                track: 'exam',
                domainId: 'd7',
                question:
                  'An agent fetches a web page and then tries to exfiltrate secrets from the system prompt. What is the primary mitigation?',
                options: [
                  { key: 'A', text: 'Trust fetched content because it came from HTTPS.' },
                  {
                    key: 'B',
                    text: 'Treat fetched content as untrusted data (not instructions), scope tools, and gate dangerous actions.',
                  },
                  { key: 'C', text: 'Disable evals so the judge cannot be poisoned.' },
                  { key: 'D', text: 'Pin a model alias instead of a full model ID.' },
                ],
                correct: 'B',
                explanation:
                  'Prompt injection arrives inside untrusted content. Defend with data-vs-instructions separation, least-privilege tools, and HITL on consequential actions.',
              },
              {
                id: 'dp8',
                source: 'practice',
                track: 'exam',
                domainId: 'd2',
                question:
                  'Production broke overnight after “no code changes.” Logs show the model string still says sonnet. What likely happened?',
                options: [
                  { key: 'A', text: 'Streaming was enabled by default.' },
                  {
                    key: 'B',
                    text: 'An alias resolved to a new recommended model version — pin a full model ID and keep the prior version for rollback.',
                  },
                  { key: 'C', text: 'Temperature 0 guarantees identical outputs forever.' },
                  { key: 'D', text: 'Message Batches automatically upgraded the model.' },
                ],
                correct: 'B',
                explanation:
                  'Aliases move. Pinning a specific model version makes upgrades deliberate and preserves a rollback path.',
              },
            ]
            """
        ),
        encoding="utf-8",
    )

    (DEV / "conceptIndex.ts").write_text(
        dedent(
            """\
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
            """
        ),
        encoding="utf-8",
    )
    print("Wrote flashcards, practiceQuestions, conceptIndex")


def main() -> None:
    for path in sorted(MOD.glob("m*.ts")):
        polish_file(path)
    write_build_track()
    write_seeds()


if __name__ == "__main__":
    main()
