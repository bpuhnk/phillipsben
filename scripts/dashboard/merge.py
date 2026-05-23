#!/usr/bin/env python3
"""Deterministically assemble content/data/dashboard-*.json from raw fetcher
output + the small LLM-authored artifacts staged in $DASH_STAGE (/tmp/dash).

Design intent: ALL schema shaping, field-stripping, and `updatedAt` stamping
lives here — never in the model's tool calls. Per tile, build only if its
inputs are present; otherwise leave the published file untouched (so the
dashboard keeps yesterday's data instead of going blank). A single bad tile
never aborts the others; we report per-tile status and exit non-zero only on
a truly unexpected error.

Inputs (under $DASH_STAGE):
  gh-raw.json    raw output of fetch_github.py
  gh-sum.json    {"<repo full_name>": "summary", ...}        (LLM)
  news-raw.json  raw output of fetch_news.py (candidate list)
  news-pick.json [{"url": "...", "whyItMatters": "..."}]      (LLM, <=5)
  focus.txt      currently.focus prose                        (LLM)
  claude.md      claude.summary markdown                      (LLM)
  claude-hl.json [{"repo": "...", "oneLiner": "..."}]          (LLM, <=4, optional)
  spotify.json   final-form output of fetch_spotify.py
"""
import datetime
import json
import os
import sys

STAGE = os.environ.get("DASH_STAGE", "/tmp/dash")
REPO = os.environ.get("PB_REPO", os.path.expanduser("~/work/phillipsben"))
DATA = os.path.join(REPO, "content", "data")
NOW = datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


def _stage(name):
    return os.path.join(STAGE, name)


def _data(name):
    return os.path.join(DATA, name)


def load_json(path):
    try:
        with open(path, encoding="utf-8") as fh:
            return json.load(fh)
    except FileNotFoundError:
        return None


def read_text(path):
    try:
        with open(path, encoding="utf-8") as fh:
            return fh.read().strip()
    except FileNotFoundError:
        return None


def write_data(name, obj):
    with open(_data(name), "w", encoding="utf-8") as fh:
        json.dump(obj, fh, indent=2, ensure_ascii=False)
        fh.write("\n")


def build_github():
    raw = load_json(_stage("gh-raw.json"))
    if raw is None:
        return "skip", "no gh-raw.json (fetch failed) — kept published"
    sums = load_json(_stage("gh-sum.json")) or {}
    prev = load_json(_data("dashboard-github.json")) or {}
    prev_sum = {r.get("name"): r.get("summary", "") for r in prev.get("repos", [])}
    repos = []
    for r in raw.get("repos", []):
        name = r.get("name")
        summary = sums.get(name) or prev_sum.get(name) or ""
        repos.append({
            "name": name,
            "url": r.get("url"),
            "commits": int(r.get("commits", 0)),
            "summary": str(summary).strip(),
        })
    totals = raw.get("totals", {})
    write_data("dashboard-github.json", {
        "updatedAt": NOW,
        "weekStart": raw.get("weekStart") or prev.get("weekStart") or "",
        "totals": {
            "commits": int(totals.get("commits", 0)),
            "prs": int(totals.get("prs", 0)),
            "repos": int(totals.get("repos", 0)),
            "activeDays": int(totals.get("activeDays", 0)),
        },
        "repos": repos,
    })
    missing = [r["name"] for r in repos if not r["summary"]]
    detail = f"built {len(repos)} repo(s)"
    if missing:
        detail += f"; {len(missing)} missing summary (fell back/blank)"
    return "build", detail


def build_news():
    raw = load_json(_stage("news-raw.json"))
    picks = load_json(_stage("news-pick.json"))
    if raw is None:
        return "skip", "no news-raw.json (fetch failed) — kept published"
    if not picks:
        return "skip", "no news-pick.json (LLM picks missing) — kept published"
    by_url = {c.get("url"): c for c in raw}
    items = []
    for p in picks[:5]:
        c = by_url.get(p.get("url"))
        if not c:
            continue
        items.append({
            "title": c.get("title"),
            "url": c.get("url"),
            "source": c.get("source", "Hacker News"),
            "points": int(c.get("points", 0)),
            "whyItMatters": str(p.get("whyItMatters", "")).strip(),
        })
    if not items:
        return "skip", "no picks matched candidates — kept published"
    write_data("dashboard-news.json", {"updatedAt": NOW, "items": items})
    return "build", f"built {len(items)} item(s)"


def build_currently():
    focus = read_text(_stage("focus.txt"))
    prev = load_json(_data("dashboard-currently.json"))
    if focus is None:
        return "skip", "no focus.txt — kept published"
    if prev is None:
        return "skip", "no existing currently file to source 'reading' from"
    reading = prev.get("reading") or {
        "title": "", "author": "", "url": None, "coverUrl": None,
    }
    write_data("dashboard-currently.json", {
        "updatedAt": NOW, "focus": focus, "reading": reading,
    })
    return "build", "built (reading preserved)"


def build_claude():
    summary = read_text(_stage("claude.md"))
    if summary is None:
        return "skip", "no claude.md — kept published"
    hls = load_json(_stage("claude-hl.json")) or []
    highlights = []
    for h in hls[:4]:
        if isinstance(h, dict) and h.get("repo") and h.get("oneLiner"):
            highlights.append({"repo": h["repo"], "oneLiner": h["oneLiner"]})
    write_data("dashboard-claude.json", {
        "updatedAt": NOW, "summary": summary, "highlights": highlights,
    })
    return "build", f"built ({len(highlights)} highlight(s))"


def build_spotify():
    sp = load_json(_stage("spotify.json"))
    if sp is None:
        return "skip", "no spotify.json (fetch failed) — kept published"
    write_data("dashboard-spotify.json", sp)  # already final-form
    return "build", "built (fetcher output)"


BUILDERS = [
    ("github", build_github),
    ("news", build_news),
    ("currently", build_currently),
    ("claude", build_claude),
    ("spotify", build_spotify),
]


def main():
    hard_error = False
    print("MERGE REPORT")
    for tile, fn in BUILDERS:
        try:
            status, detail = fn()
        except Exception as exc:  # noqa: BLE001 - report, do not abort siblings
            status, detail = "error", f"{type(exc).__name__}: {exc}"
            hard_error = True
        print(f"  {tile:10s} {status:6s} {detail}")
    sys.exit(1 if hard_error else 0)


if __name__ == "__main__":
    main()
