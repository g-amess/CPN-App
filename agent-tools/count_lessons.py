#!/usr/bin/env python3
from pathlib import Path
import re

for p in sorted(Path("src/content/developer/modules").glob("m*.ts")):
    t = p.read_text(encoding="utf-8")
    mid = re.search(r"id: '(m\d)'", t)
    if not mid:
        continue
    lesson_ids = re.findall(r"^\s+id: '([a-z0-9-]+)',", t, re.M)
    lesson_ids = [x for x in lesson_ids if x != mid.group(1)]
    print(f"{p.name}: {len(lesson_ids)} lessons -> {', '.join(lesson_ids)}")
