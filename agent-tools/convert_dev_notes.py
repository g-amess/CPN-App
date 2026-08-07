#!/usr/bin/env python3
"""Convert scraped Developer module JSON into notes-format markdown."""
from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(r"c:\Users\DanielCilliers\.cursor\projects\CPN-App")
SRC = ROOT / "agent-tools"
OUT = ROOT / "content-source" / "developer"

MODULES = [
    {
        "json": "dev-m1-screens.json",
        "out": "developer-m1-mso-foundations.md",
        "heading": "Developer Module 1 — MSO Foundations",
        "critical": (
            "Below are notes scraped from the Claude Certified Developer – Foundations "
            "prep course (Skilljar SCORM HTML module: MSO Foundations). "
            "Use these notes as a resource to answer the user's question. "
            "Write your answer as a standalone response - do not refer directly to these notes "
            "unless specifically requested by the user."
        ),
    },
    {
        "json": "dev-m2-screens.json",
        "out": "developer-m2-production-prompting-agents-tool-use.md",
        "heading": "Developer Module 2 — Production-Grade Prompting, Agents & Tool Use",
        "critical": (
            "Below are notes scraped from the Claude Certified Developer – Foundations "
            "prep course (Skilljar SCORM HTML module: Production-Grade Prompting, Agents & Tool Use). "
            "Use these notes as a resource to answer the user's question. "
            "Write your answer as a standalone response - do not refer directly to these notes "
            "unless specifically requested by the user."
        ),
    },
    {
        "json": "dev-m3-screens.json",
        "out": "developer-m3-claude-code-mcp-integration.md",
        "heading": "Developer Module 3 — Claude Code, MCP & Integration",
        "critical": (
            "Below are notes scraped from the Claude Certified Developer – Foundations "
            "prep course (Skilljar SCORM HTML module: Claude Code, MCP & Integration). "
            "Use these notes as a resource to answer the user's question. "
            "Write your answer as a standalone response - do not refer directly to these notes "
            "unless specifically requested by the user."
        ),
    },
    {
        "json": "dev-m4-screens.json",
        "out": "developer-m4-production-engineering-evals-security.md",
        "heading": "Developer Module 4 — Production Engineering, Evals & Security",
        "critical": (
            "Below are notes scraped from the Claude Certified Developer – Foundations "
            "prep course (Skilljar SCORM HTML module: Production Engineering, Evals & Security). "
            "Use these notes as a resource to answer the user's question. "
            "Write your answer as a standalone response - do not refer directly to these notes "
            "unless specifically requested by the user."
        ),
    },
    {
        "json": "dev-m5-screens.json",
        "out": "developer-m5-accelerators-ip-contribution.md",
        "heading": "Developer Module 5 — Accelerators & IP Contribution",
        "critical": (
            "Below are notes scraped from the Claude Certified Developer – Foundations "
            "prep course (Skilljar SCORM HTML module: Accelerators & IP Contribution). "
            "Use these notes as a resource to answer the user's question. "
            "Write your answer as a standalone response - do not refer directly to these notes "
            "unless specifically requested by the user."
        ),
    },
]


def clean_meta(meta: str) -> str:
    meta = (meta or "").strip()
    # Insert spaces between glued CamelCase / labels: TeachingHow -> Teaching · How
    meta = re.sub(
        r"^(Teaching|Watch Out|Checkpoint|Quiz|Exercise|Recap|Glossary|Module Complete|ORIENTATION|Cumulative|Diagnose|Assemble)",
        r"\1",
        meta,
        flags=re.I,
    )
    # Split glued type+section: TeachingHow LLMs -> Teaching · How LLMs
    meta = re.sub(
        r"^(Teaching|Watch Out|Checkpoint|Quiz|Exercise|Recap|Glossary|Module Complete|Cumulative)([A-Z])",
        r"\1 · \2",
        meta,
    )
    # Time glue: ·12 min / Behave·12 -> Behave · 12
    meta = re.sub(r"·(\d)", r" · \1", meta)
    meta = re.sub(r"(\D)·(\d)", r"\1 · \2", meta)
    meta = re.sub(r"\s+", " ", meta).strip()
    return meta


def section_label(meta: str, title: str) -> str:
    meta = clean_meta(meta)
    # Prefer a short section from meta when present
    # Examples: "Teaching · How LLMs Behave · 12 min"
    parts = [p.strip() for p in re.split(r"·", meta) if p.strip()]
    # Drop time parts
    parts = [p for p in parts if not re.match(r"^\d+\s*MIN$", p, re.I) and not re.match(r"^\d+\s*min$", p, re.I)]
    if len(parts) >= 2:
        # type + section
        label = f"{parts[0]} — {title}".strip(" —")
        # If second part looks like a section name and not MODULE N / ORIENTATION alone
        if parts[1] and parts[1].upper() not in {"MODULE 1", "MODULE 2", "MODULE 3", "MODULE 4", "MODULE 5", "DEVELOPER PATH"}:
            if parts[0].lower() in {
                "teaching",
                "watch out",
                "checkpoint",
                "quiz",
                "exercise",
                "recap",
                "glossary",
                "module complete",
                "cumulative",
                "orientation",
            }:
                label = f"{parts[1]} — {title}"
            else:
                label = f"{parts[0]} — {title}"
        return label
    if parts:
        return f"{parts[0]} — {title}"
    return title


def clean_body(text: str, title: str, meta: str) -> str:
    t = text or ""
    # Normalize newlines
    t = t.replace("\r\n", "\n").replace("\r", "\n")
    lines = t.split("\n")
    # Drop leading meta/title echo lines when they duplicate headers
    cleaned = []
    skip_prefixes = []
    meta_c = clean_meta(meta).replace(" · ", "").replace(" ", "")
    title_c = (title or "").strip()
    for i, line in enumerate(lines):
        s = line.strip()
        if not cleaned:
            # skip early chrome lines that are just meta fragments / title
            if not s:
                continue
            if s == title_c:
                continue
            if s.upper() in {"MODULE 1", "MODULE 2", "MODULE 3", "MODULE 4", "MODULE 5"}:
                continue
            if re.match(r"^(ORIENTATION|Teaching|Watch Out|Checkpoint|Quiz|Exercise|Recap|Glossary|Module Complete|Cumulative)", s, re.I) and len(s) < 120:
                # Likely the glued meta line at top
                continue
            if s in {"·", "2 MIN", "3 MIN", "4 MIN", "5 MIN", "8 MIN", "10 MIN", "12 MIN", "13 MIN", "16 MIN", "20 MIN", "22 MIN"}:
                continue
            if re.match(r"^\d+\s*MIN$", s, re.I):
                continue
        cleaned.append(line)
    body = "\n".join(cleaned).strip()
    # Collapse 3+ blank lines
    body = re.sub(r"\n{3,}", "\n\n", body)
    return body


def convert_one(spec: dict) -> dict:
    data = json.loads((SRC / spec["json"]).read_text(encoding="utf-8"))
    screens = data.get("screens") or []
    parts = ["<notes>", f"<critical>\n{spec['critical']}\n</critical>"]
    # Optional splash overview as first note
    splash = (data.get("splashText") or "").strip()
    if splash:
        # Keep only TOC / intro portion before the duplicated progress chrome if possible
        splash_body = splash
        # Truncate at PROGRESS if present (sidebar chrome duplicated in splash)
        if "\nPROGRESS\n" in splash_body:
            splash_body = splash_body.split("\nPROGRESS\n", 1)[0].strip()
        parts.append(
            f'<note title="Overview — {spec["heading"]}">\n{splash_body}\n</note>'
        )
    for s in screens:
        title = (s.get("title") or f"Screen {s.get('index')}").strip()
        meta = s.get("meta") or ""
        note_title = section_label(meta, title)
        body = clean_body(s.get("text") or "", title, meta)
        parts.append(f'<note title="{note_title}">\n{body}\n</note>')
    parts.append("</notes>\n")
    out_path = OUT / spec["out"]
    out_path.write_text("\n\n".join(parts), encoding="utf-8")
    return {
        "file": spec["out"],
        "screens": len(screens),
        "moduleTitle": data.get("moduleTitle"),
        "titles": [s.get("title") for s in screens],
    }


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    summary = []
    for spec in MODULES:
        summary.append(convert_one(spec))
    print(json.dumps(summary, indent=2, ensure_ascii=False))


if __name__ == "__main__":
    main()
