from pathlib import Path

root = Path(r"c:\Users\DanielCilliers\.cursor\projects\CPN-App\content-source\developer")
for p in root.glob("*.md"):
    t = p.read_text(encoding="utf-8")
    fixed = (
        t.replace("\u2013", "-")
        .replace("\u2014", "-")
        .replace("\u2019", "'")
        .replace("\u201c", '"')
        .replace("\u201d", '"')
        .replace("\ufeff", "")
    )
    if fixed != t:
        p.write_text(fixed, encoding="utf-8")
        print("fixed", p.name)
    else:
        print("ok", p.name)
