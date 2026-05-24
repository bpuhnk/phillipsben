#!/usr/bin/env python3
"""Stage the dashboard config for the merge/draft step, expanding
`claudeTopicsAllowlist` to automatically include every project that has a
published page under content/projects/.

Rationale: if a project is public on the site, it is by definition safe to name
on the public dashboard. So on-site presence *is* the allowlist. The static
`claudeTopicsAllowlist` in dashboard-config.json is kept as a hand-curated base
(e.g. "phillipsben.com" itself, or things you want nameable before they have a
page) and the project titles + slugs are merged on top of it. This removes the
old failure mode where a shipped project (e.g. Switchboard) had a live page but
was still genericized because nobody hand-edited the allowlist.

Reads : $PB_REPO/content/data/dashboard-config.json   (base + redaction rules)
        $PB_REPO/content/projects/*/index.mdx          (frontmatter title + dir slug)
Writes: $DASH_STAGE/config.json   (same shape; claudeTopicsAllowlist expanded)

On any read error it exits non-zero without writing, so the caller can fall
back to staging the raw config unchanged (an expanded allowlist is a nicety,
not load-bearing for a valid run).
"""
import glob
import json
import os
import re
import sys

REPO = os.environ.get("PB_REPO", os.path.expanduser("~/work/phillipsben"))
STAGE = os.environ.get("DASH_STAGE", "/tmp/dash")
CONFIG = os.path.join(REPO, "content", "data", "dashboard-config.json")
PROJECTS = os.path.join(REPO, "content", "projects")

TITLE_RE = re.compile(r"^title:\s*(.+?)\s*$", re.MULTILINE)


def project_names():
    """Yield (slug, title) name strings for every published project page."""
    names = []
    for mdx in sorted(glob.glob(os.path.join(PROJECTS, "*", "index.mdx"))):
        slug = os.path.basename(os.path.dirname(mdx))  # dir name == slug
        try:
            with open(mdx, encoding="utf-8") as fh:
                raw = fh.read()
        except OSError:
            raw = ""
        # Human title first so it wins the case-insensitive dedup over the slug
        # (we want "Switchboard", not "switchboard", as the nameable form).
        if raw.startswith("---"):
            m = TITLE_RE.search(raw.split("---", 2)[1])
            if m:
                names.append(m.group(1).strip().strip('"').strip("'"))
        names.append(slug)
    return names


def main():
    try:
        with open(CONFIG, encoding="utf-8") as fh:
            cfg = json.load(fh)
    except (OSError, json.JSONDecodeError) as exc:
        print(f"allowlist: FAILED to read dashboard-config.json ({exc}) — using raw config")
        sys.exit(1)

    base = list(cfg.get("claudeTopicsAllowlist", []))
    seen = {x.lower() for x in base}
    merged = list(base)
    added = 0
    for name in project_names():
        if name and name.lower() not in seen:
            merged.append(name)
            seen.add(name.lower())
            added += 1
    cfg["claudeTopicsAllowlist"] = merged

    os.makedirs(STAGE, exist_ok=True)
    out = os.path.join(STAGE, "config.json")
    with open(out, "w", encoding="utf-8") as fh:
        json.dump(cfg, fh, indent=2, ensure_ascii=False)
        fh.write("\n")

    n_pages = len(glob.glob(os.path.join(PROJECTS, "*", "index.mdx")))
    print(f"allowlist staged -> {out} "
          f"({len(base)} base + {added} new from {n_pages} project page(s) "
          f"= {len(merged)} nameable)")


if __name__ == "__main__":
    main()
