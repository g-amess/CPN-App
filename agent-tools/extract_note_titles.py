#!/usr/bin/env python3
"""Summarize note titles and word counts from developer module markdown."""
from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "content-source" / "developer"

for p in sorted(SRC.glob("developer-m*.md")):
    text = p.read_text(encoding="utf-8")
    notes = re.findall(r'<note title="([^"]+)">\s*(.*?)\s*</note>', text, re.S)
    print(f"\n===== {p.name}: {len(notes)} notes =====")
    for title, body in notes:
        words = len(body.split())
        print(f"  [{words:4d}w] {title[:100]}")
