#!/usr/bin/env python3
"""
Generate Developer build-track TypeScript modules from scraped Skilljar notes.

Maps major teaching sections → Lesson objects (architect shape).
Checkpoints / quizzes / complete screens are skipped or folded into takeaways.
"""
from __future__ import annotations

import json
import re
from pathlib import Path
from textwrap import dedent

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "content-source" / "developer"
OUT = ROOT / "src" / "content" / "developer" / "modules"

# Per-module lesson plan: (lesson_id, title, summary, note_title_substrings for body, takeaway_note_substring or None)
# Body is merged from matching teaching notes (first match preferred for primary; watch-outs appended).

MODULE_PLANS: dict[str, dict] = {
    "m1": {
        "file": "developer-m1-mso-foundations.md",
        "out": "m1-mso-foundations.ts",
        "title": "MSO Foundations",
        "blurb": (
            "Model fundamentals and technical substrate: tokens, context windows, sampling, "
            "model tiers vs reasoning modes, prompting modes, and how developers reach Claude."
        ),
        "lessons": [
            {
                "id": "how-llms-behave",
                "title": "How LLMs Behave",
                "summary": "Tokens, the fixed context-window budget, sampling, and why non-determinism changes testing.",
                "bodies": ["How LLMs Behave - How LLMs behave"],
                "exam": [{"domainId": "d2", "label": "API mechanics · tokens & context"}],
            },
            {
                "id": "models-and-reasoning",
                "title": "Models & Reasoning Modes",
                "summary": "Claude model tiers (Fable–Haiku) versus per-call reasoning/adaptive thinking as separate levers.",
                "bodies": ["Models & Reasoning - Model options"],
                "exam": [{"domainId": "d2", "label": "Model selection vs reasoning mode"}],
            },
            {
                "id": "prompting-modes",
                "title": "Prompting Modes",
                "summary": "Zero-shot, one-shot, and multi-shot — trading example tokens for output reliability.",
                "bodies": ["Prompting Modes - Prompting modes"],
                "exam": [{"domainId": "d2", "label": "Prompting modes and eval-driven escalation"}],
            },
            {
                "id": "technical-substrate",
                "title": "Technical Substrate",
                "summary": "SDK vs REST, sync vs streaming, async concurrency, and the Message Batches API.",
                "bodies": ["Technical Substrate - The technical substrate"],
                "exam": [{"domainId": "d2", "label": "SDK, streaming, async, and batch patterns"}],
            },
            {
                "id": "m1-takeaways",
                "title": "Module Recap",
                "summary": "Five takeaways that form the shared vocabulary for the rest of the Developer course.",
                "bodies": ["Five Takeaways - Recap"],
                "takeaways_only": True,
            },
        ],
        "quiz_notes": ["Quiz - Module quiz", "Predict the Behavior - Exercise"],
    },
    "m2": {
        "file": "developer-m2-production-prompting-agents-tool-use.md",
        "out": "m2-prompting-agents-tool-use.ts",
        "title": "Production-Grade Prompting, Agents & Tool Use",
        "blurb": (
            "Prompt craft, extended thinking, tool schemas, streaming, context engineering, "
            "agent construction, memory scopes, and multimodal/batch ingestion."
        ),
        "lessons": [
            {
                "id": "prompting-craft",
                "title": "Prompting Craft",
                "summary": "System prompts, XML structure, few-shot examples, and output constraints that stay lean.",
                "bodies": [
                    "Prompting Craft - System prompts",
                    "Prompting Craft - The prompt that grew longer",
                ],
                "exam": [{"domainId": "d2", "label": "Production prompting craft"}],
            },
            {
                "id": "extended-thinking",
                "title": "Extended Thinking",
                "summary": "Turning reasoning on, calibrating effort, and reading thinking blocks back correctly.",
                "bodies": ["Extended Thinking - Extended Thinking"],
                "exam": [{"domainId": "d2", "label": "Adaptive/extended thinking"}],
            },
            {
                "id": "tool-schemas",
                "title": "Tool-Use & Schema Design",
                "summary": "Tool definitions, the tool-use loop, calling patterns, and descriptions that select the right tool.",
                "bodies": [
                    "Tool-use and Schema Design - Tool Schemas",
                    "Tool-use and Schema Design - The description that sent",
                ],
                "exam": [{"domainId": "d3", "label": "Tool schema design"}],
            },
            {
                "id": "streaming",
                "title": "Streaming Responses",
                "summary": "Consuming partial output safely and recovering when a stream leaves incomplete tool calls.",
                "bodies": [
                    "Streaming Responses - Streaming responses",
                    "Streaming Responses - The stream that left",
                ],
                "exam": [{"domainId": "d2", "label": "Streaming and partial output"}],
            },
            {
                "id": "context-engineering",
                "title": "Context Engineering",
                "summary": "Model selection and keeping multi-turn sessions inside the context budget in production.",
                "bodies": [
                    "Context Engineering - Model selection",
                    "Context Engineering - The session that ran fine",
                ],
                "exam": [{"domainId": "d1", "label": "Context-window management"}],
            },
            {
                "id": "agent-construction",
                "title": "Agent Construction",
                "summary": "The agent loop, wiring paths, orchestration, and human-in-the-loop gates for risky actions.",
                "bodies": [
                    "Agent Construction - Building a production agent",
                    "Agent Construction - The agent that edited",
                ],
                "exam": [{"domainId": "d1", "label": "Agent construction and HITL"}],
            },
            {
                "id": "agent-memory",
                "title": "Agent Memory",
                "summary": "Choosing the right scope for state that must survive sessions without filling the window.",
                "bodies": [
                    "Agent Memory - Choosing the right scope",
                    "Agent Memory - The agent that filled",
                ],
                "exam": [{"domainId": "d1", "label": "Agent memory patterns"}],
            },
            {
                "id": "multimodal-batch",
                "title": "Multimodal & Batch Ingestion",
                "summary": "Images, PDFs, and high-volume processing — including when batch is actually batch.",
                "bodies": [
                    "Multimodal and Batch Ingestion - Images",
                    "Multimodal and Batch Ingestion - The batch job",
                ],
                "exam": [{"domainId": "d2", "label": "Multimodal input and Message Batches"}],
            },
            {
                "id": "m2-takeaways",
                "title": "Module Recap",
                "summary": "Eight takeaways — one per enabling objective — plus key terms from this module.",
                "bodies": ["Eight takeaways - Eight takeaways", "Key Terms - Key terms"],
                "takeaways_only": True,
            },
        ],
    },
    "m3": {
        "file": "developer-m3-claude-code-mcp-integration.md",
        "out": "m3-claude-code-mcp.ts",
        "title": "Claude Code, MCP & Integration",
        "blurb": (
            "Permission modes and human gates, durable project context, plugin packaging, "
            "MCP servers, and enterprise authentication without leaking credentials."
        ),
        "lessons": [
            {
                "id": "permission-modes",
                "title": "Permission Modes & Human Gates",
                "summary": "Claude Code agent loop, permission modes, settings, and where a human gate belongs.",
                "bodies": [
                    "Permission Modes & Human Gates - Claude Code agent loop",
                    "Permission Modes & Human Gates - The bypass mode",
                ],
                "exam": [{"domainId": "d4", "label": "Claude Code permissions and HITL"}],
            },
            {
                "id": "durable-context",
                "title": "Durable Project Context",
                "summary": "CLAUDE.md, rules files, hooks, and subagents — keeping durable guidance loadable and scoped.",
                "bodies": [
                    "Durable Project Context - Durable project context",
                    "Durable Project Context - The CLAUDE.md that kept growing",
                ],
                "exam": [{"domainId": "d4", "label": "CLAUDE.md, rules, hooks, subagents"}],
            },
            {
                "id": "packaging-workflows",
                "title": "Packaging Workflows as Plugins",
                "summary": "Skills, custom commands, and marketplace install — packaging that works on every machine.",
                "bodies": [
                    "Packaging Workflows - Packaging a workflow",
                    "Packaging Workflows - The plugin that installed",
                ],
                "exam": [{"domainId": "d4", "label": "Plugins, skills, and commands"}],
            },
            {
                "id": "mcp-servers",
                "title": "MCP Servers",
                "summary": "Transport, scope, and configuration — including keeping secrets out of committed config.",
                "bodies": [
                    "MCP Servers - Building and configuring",
                    "MCP Servers - The API key that traveled",
                ],
                "exam": [{"domainId": "d3", "label": "MCP transport, scope, and secrets"}],
            },
            {
                "id": "enterprise-integration",
                "title": "Enterprise Integration",
                "summary": "Connecting Claude to enterprise systems and authenticating securely across environments.",
                "bodies": [
                    "Enterprise Integration - Connecting Claude",
                    "Enterprise Integration - The OAuth connection",
                ],
                "exam": [{"domainId": "d2", "label": "Enterprise auth and integration"}],
            },
            {
                "id": "m3-takeaways",
                "title": "Module Recap",
                "summary": "Seven key takeaways and key terms for Claude Code, MCP, and enterprise integration.",
                "bodies": ["Key Takeaways - Seven key takeaways", "Key Terms - Key terms"],
                "takeaways_only": True,
            },
        ],
    },
    "m4": {
        "file": "developer-m4-production-engineering-evals-security.md",
        "out": "m4-production-evals-security.ts",
        "title": "Production Engineering, Evals & Security",
        "blurb": (
            "Evals and judges, testing and tracing, failure handling, model selection, "
            "cost and orchestration budgets, and security boundaries that hold in production."
        ),
        "lessons": [
            {
                "id": "evals-judges",
                "title": "Evals & Judges",
                "summary": "Define done before you ship — eval suites and calibrated model-graded judges.",
                "bodies": [
                    "Evals & Judges - Defining done",
                    "Watch Out Evals & Judges",
                ],
                "exam": [{"domainId": "d5", "label": "Evals and judges"}],
            },
            {
                "id": "testing-tracing",
                "title": "Testing & Tracing",
                "summary": "Unit, integration, and end-to-end tests plus tracing so seam failures are diagnosable.",
                "bodies": [
                    "Testing & Tracing - Testing and tracing",
                    "Watch Out Testing & Tracing",
                ],
                "exam": [{"domainId": "d5", "label": "Testing levels and tracing"}],
            },
            {
                "id": "failure-handling",
                "title": "Failure Handling",
                "summary": "Surviving production tool errors with structured retries and recovery paths.",
                "bodies": [
                    "Failure Handling - Surviving production failure",
                    "Watch Out Failure Handling",
                ],
                "exam": [{"domainId": "d5", "label": "Tool errors and retries"}],
            },
            {
                "id": "model-selection-prod",
                "title": "Model Selection in Production",
                "summary": "Choose the model from cost, latency, and quality constraints — driven by eval evidence.",
                "bodies": ["Model Selection - Model selection in production"],
                "exam": [{"domainId": "d5", "label": "Production model selection"}],
            },
            {
                "id": "cost-orchestration",
                "title": "Cost & Orchestration",
                "summary": "Keep cost, latency, and reliability in budget across agents and fan-out patterns.",
                "bodies": [
                    "Cost & Orchestration - Keeping cost",
                    "Watch Out Cost & Orchestration",
                ],
                "exam": [{"domainId": "d1", "label": "Orchestration cost levers"}],
            },
            {
                "id": "security",
                "title": "Security",
                "summary": "Secure integrations against untrusted input and keep regulated review boundaries intact.",
                "bodies": [
                    "Security - Securing the integration",
                    "Watch Out Security",
                ],
                "exam": [{"domainId": "d6", "label": "Prompt injection and trust boundaries"}],
            },
            {
                "id": "m4-takeaways",
                "title": "Module Recap",
                "summary": "Key takeaways and terms for production engineering, evals, and security.",
                "bodies": ["Recap - Key takeaways", "Key Terms - Key terms"],
                "takeaways_only": True,
            },
        ],
    },
    "m5": {
        "file": "developer-m5-accelerators-ip-contribution.md",
        "out": "m5-accelerators-ip.ts",
        "title": "Accelerators & IP Contribution",
        "blurb": (
            "Package reusable accelerators, contribute verifiable assets, map requirements and lifecycle, "
            "choose deployment platforms, version what ships, and mark trust boundaries."
        ),
        "lessons": [
            {
                "id": "packaging-reuse",
                "title": "Packaging for Reuse",
                "summary": "Turn a working build into an accelerator the next engagement can start from.",
                "bodies": [
                    "Packaging for Reuse - Packaging a working build",
                    "Packaging for Reuse - The template that shipped",
                ],
                "exam": [{"domainId": "d8", "label": "Accelerator packaging"}],
            },
            {
                "id": "contributing-back",
                "title": "Contributing Back",
                "summary": "Move an asset from private reuse into shared infrastructure a maintainer can verify.",
                "bodies": [
                    "Contributing Back - Moving an asset",
                    "Contributing Back - The pull request",
                ],
                "exam": [{"domainId": "d8", "label": "IP contribution readiness"}],
            },
            {
                "id": "requirements-lifecycle",
                "title": "Requirements & Lifecycle",
                "summary": "From business requirements to functional/infrastructure requirements and lifecycle phases.",
                "bodies": [
                    "Requirements & Lifecycle - From business requirements",
                    "Requirements & Lifecycle - Systems lifecycle",
                ],
                "exam": [{"domainId": "d2", "label": "Requirements and systems lifecycle"}],
            },
            {
                "id": "deployment-versioning",
                "title": "Deployment & Versioning",
                "summary": "Choose where a Claude workload runs and pin versions so alias moves do not break production.",
                "bodies": [
                    "Deployment & Versioning - Choosing where",
                    "Deployment & Versioning - The deployment that broke",
                ],
                "exam": [{"domainId": "d2", "label": "Deployment platforms and version pins"}],
            },
            {
                "id": "comparing-platforms",
                "title": "Comparing Platforms",
                "summary": "Compare platforms on latency, compliance, and cost so the choice survives review.",
                "bodies": [
                    "Comparing Platforms - Comparing platforms",
                    "Comparing Platforms - The platform picked",
                ],
                "exam": [{"domainId": "d7", "label": "Platform comparison"}],
            },
            {
                "id": "trust-boundaries",
                "title": "Trust Boundaries",
                "summary": "Coordinate several Claude deployments with explicit trust boundaries under review.",
                "bodies": [
                    "Trust Boundaries - Coordinating several",
                    "Trust Boundaries - The seam nobody marked",
                ],
                "exam": [{"domainId": "d6", "label": "Multi-component trust boundaries"}],
            },
            {
                "id": "m5-takeaways",
                "title": "Module Recap",
                "summary": "Key takeaways and terms for accelerators, contribution, platforms, and trust.",
                "bodies": ["All topics - Key takeaways", "Key Terms - Key terms"],
                "takeaways_only": True,
            },
        ],
    },
}


def parse_notes(path: Path) -> dict[str, str]:
    text = path.read_text(encoding="utf-8")
    return {t: b.strip() for t, b in re.findall(r'<note title="([^"]+)">\s*(.*?)\s*</note>', text, re.S)}


def clean_body(raw: str) -> str:
    """Turn scraped HTML-ish text into readable markdown-ish prose."""
    # Normalize whitespace
    t = raw.replace("\r\n", "\n").replace("\r", "\n")
    # Drop common chrome
    for drop in [
        r"← Previous",
        r"Next →",
        r"Screen \d+ of \d+",
        r"☰ CONTENTS",
        r"Submit quiz",
        r"Skip for now",
        r"Submit\n",
        r"PROGRESS\n\d+%",
        r"Reset progress",
    ]:
        t = re.sub(drop, "", t)
    # Collapse runs of blank lines / spaces
    lines = []
    for line in t.split("\n"):
        line = line.rstrip()
        # skip pure progress chrome lines
        if re.fullmatch(r"(Teaching|Watch Out|Checkpoint|Quiz|Exercise|Recap|Module Complete).*", line) and len(line) < 80:
            # keep if it looks like a real heading with content later
            pass
        lines.append(line)
    t = "\n".join(lines)
    # Insert paragraph breaks: sequences of short title-like lines followed by long prose
    # Heuristic: blank line between dense blocks
    t = re.sub(r"\n{3,}", "\n\n", t)
    # Soft-wrap: if we see Tab-like titles (short lines before long paragraphs), promote to ##
    parts = []
    paras = re.split(r"\n\s*\n", t)
    for para in paras:
        para = para.strip()
        if not para:
            continue
        # Single short line → treat as heading if < 60 chars and no period mid
        if "\n" not in para and len(para) < 70 and not para.endswith("."):
            # avoid promoting garbage
            if not re.match(r"^(Try it now|Submit|Skip|Question \d)", para):
                parts.append(f"## {para}")
                continue
        # Multi-line: first short line may be a subheading
        plines = [ln.strip() for ln in para.split("\n") if ln.strip()]
        if len(plines) >= 2 and len(plines[0]) < 60 and not plines[0].endswith(".") and len(plines[1]) > 80:
            parts.append(f"## {plines[0]}\n\n{' '.join(plines[1:])}")
        else:
            parts.append(" ".join(plines))
    body = "\n\n".join(parts)
    body = re.sub(r"\n{3,}", "\n\n", body).strip()
    return body


def extract_takeaways(raw: str) -> list[str]:
    """Pull numbered takeaways from recap screens."""
    cleaned = clean_body(raw)
    items: list[str] = []
    # Pattern: leading number then text
    for m in re.finditer(
        r"(?:^|\n)\s*(\d+)\s*\n?\s*(.+?)(?=(?:\n\s*\d+\s*\n)|$)",
        cleaned,
        re.S,
    ):
        text = re.sub(r"\s+", " ", m.group(2)).strip()
        # Stop at "What comes next" / Sources
        for stop in ["What comes next", "Sources", "You can now", "Key terms"]:
            if stop in text:
                text = text.split(stop)[0].strip()
        if 20 < len(text) < 500:
            items.append(text)
    if items:
        return items[:10]
    # Fallback: split sentences from cleaned body
    sentences = re.split(r"(?<=[.!?])\s+", cleaned.replace("\n", " "))
    return [s.strip() for s in sentences if 40 < len(s.strip()) < 280][:6]


def find_note(notes: dict[str, str], substr: str) -> str | None:
    for title, body in notes.items():
        if substr in title:
            return body
    return None


def ts_string(s: str) -> str:
    """Escape for a TypeScript template literal."""
    return s.replace("\\", "\\\\").replace("`", "\\`").replace("${", "\\${")


def lesson_takeaways_from_body(body: str, explicit: list[str] | None = None) -> list[str]:
    if explicit:
        return explicit
    # Derive 3–5 concise takeaways from ## headings + first sentences
    headings = re.findall(r"^## (.+)$", body, re.M)
    takes: list[str] = []
    for h in headings[:5]:
        # Find paragraph after heading
        m = re.search(rf"## {re.escape(h)}\n\n(.+?)(?=\n\n## |\Z)", body, re.S)
        if m:
            first = re.split(r"(?<=[.!?])\s+", m.group(1).strip())[0]
            if len(first) > 30:
                takes.append(first[:240])
            else:
                takes.append(h)
        else:
            takes.append(h)
    if len(takes) < 2:
        # First sentences of body
        plain = re.sub(r"^## .+$", "", body, flags=re.M)
        sentences = re.split(r"(?<=[.!?])\s+", plain.replace("\n", " ").strip())
        takes = [s.strip() for s in sentences if len(s.strip()) > 40][:4]
    return takes[:5]


def generate_module(mid: str, plan: dict) -> str:
    notes = parse_notes(SRC / plan["file"])
    lessons_ts: list[str] = []
    for lesson in plan["lessons"]:
        chunks: list[str] = []
        for substr in lesson["bodies"]:
            raw = find_note(notes, substr)
            if not raw:
                print(f"  WARN {mid}/{lesson['id']}: missing note matching {substr!r}")
                continue
            chunks.append(clean_body(raw))
        if not chunks:
            body = f"_Content pending for {lesson['title']}._"
            takeaways = ["Content pending — re-run generator after notes are complete."]
        elif lesson.get("takeaways_only"):
            # Prefer extract from first (recap) note
            takeaways = extract_takeaways(find_note(notes, lesson["bodies"][0]) or chunks[0])
            # Body: cleaned recap + optional key terms
            intro = (
                f"This recap closes **{plan['title']}**. Internalize these takeaways — "
                "they are the durable skills the rest of the course (and the exam domains) build on."
            )
            body = intro + "\n\n" + "\n\n".join(chunks)
            if not takeaways:
                takeaways = lesson_takeaways_from_body(chunks[0])
        else:
            body = "\n\n".join(chunks)
            takeaways = lesson_takeaways_from_body(body)

        exam_block = ""
        if lesson.get("exam"):
            exam_lines = ",\n".join(
                f'        {{ domainId: "{e["domainId"]}", label: "{e["label"]}" }}' for e in lesson["exam"]
            )
            exam_block = f",\n      examRelevance: [\n{exam_lines},\n      ]"

        takes_js = ",\n".join(f"        '{ts_string(t).replace(chr(39), chr(92)+chr(39))}'" for t in takeaways)
        # Prefer double-quoted JS strings for takeaways to avoid quote hell
        takes_js = ",\n".join(json.dumps(t) for t in takeaways)

        lessons_ts.append(
            dedent(
                f"""
                {{
                  id: '{lesson["id"]}',
                  moduleId: '{mid}',
                  title: {json.dumps(lesson["title"])},
                  summary: {json.dumps(lesson["summary"])},
                  body: `{ts_string(body)}`,
                  keyTakeaways: [
                    {takes_js},
                  ]{exam_block},
                }}
                """
            ).rstrip()
        )

    lessons_joined = ",\n".join(lessons_ts)
    return (
        f"import type {{ BuildModule }} from '../../types'\n\n"
        f"export const {mid}: BuildModule = {{\n"
        f"  id: '{mid}',\n"
        f"  title: {json.dumps(plan['title'])},\n"
        f"  blurb: {json.dumps(plan['blurb'])},\n"
        f"  lessons: [\n{lessons_joined},\n  ],\n"
        f"}}\n"
    )


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    exports = []
    for mid, plan in MODULE_PLANS.items():
        print(f"Generating {mid}…")
        src = generate_module(mid, plan)
        out_path = OUT / plan["out"]
        out_path.write_text(src, encoding="utf-8")
        print(f"  wrote {out_path.relative_to(ROOT)} ({src.count('id:')} lessons approx)")
        exports.append((mid, plan["out"]))

    # Update buildTrack to import real modules
    build_track = ROOT / "src" / "content" / "developer" / "buildTrack.ts"
    imports = "\n".join(
        f"import {{ {mid} }} from './modules/{fname.replace('.ts', '')}'"
        for mid, fname in exports
    )
    build_track.write_text(
        dedent(
            f"""\
            import type {{ BuildModule, Lesson }} from '../types'
            {imports}

            export const buildModules: BuildModule[] = [m1, m2, m3, m4, m5]

            export const allLessons: Lesson[] = buildModules.flatMap((m) => m.lessons)

            export const totalLessons = allLessons.length

            export function findLesson(moduleId: string, lessonId: string): Lesson | undefined {{
              return buildModules.find((m) => m.id === moduleId)?.lessons.find((l) => l.id === lessonId)
            }}

            export function lessonById(lessonId: string): Lesson | undefined {{
              return allLessons.find((l) => l.id === lessonId)
            }}

            export function moduleById(moduleId: string): BuildModule | undefined {{
              return buildModules.find((m) => m.id === moduleId)
            }}

            export const lessonOrder = buildModules.flatMap((m) => m.lessons.map((l) => ({{ moduleId: m.id, lessonId: l.id }})))

            export function adjacentLessons(moduleId: string, lessonId: string) {{
              const i = lessonOrder.findIndex((x) => x.moduleId === moduleId && x.lessonId === lessonId)
              return {{
                prev: i > 0 ? lessonOrder[i - 1] : undefined,
                next: i >= 0 && i < lessonOrder.length - 1 ? lessonOrder[i + 1] : undefined,
              }}
            }}
            """
        ),
        encoding="utf-8",
    )
    print("Updated buildTrack.ts")

    # Delete stubs if present
    stubs = OUT / "stubs.ts"
    if stubs.exists():
        stubs.unlink()
        print("Removed stubs.ts")


if __name__ == "__main__":
    main()
