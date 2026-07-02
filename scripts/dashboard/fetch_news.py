#!/usr/bin/env python3
"""
Fetch AI-related stories from Hacker News (Algolia API) for the last 48h
and emit a candidate list to stdout. Hermes/LLM picks 5 + writes the
`whyItMatters` blurb on each.

The output is a JSON ARRAY of up to 20 candidates — NOT the final
dashboard-news.json shape. Hermes is expected to:
  1. Pick the 5 best by relevance (not raw points).
  2. Write `whyItMatters` (one sentence each).
  3. Wrap in {updatedAt, items: [...]} and validate.

Usage:
  python3 scripts/dashboard/fetch_news.py > candidates.json
"""
from __future__ import annotations

import json
import sys
import time
import urllib.parse
import urllib.request
from datetime import datetime, timedelta, timezone

# OR-of-keywords. HN's search is keyword-broad; LLM curates.
QUERIES = ["AI", "LLM", "GPT", "Claude", "Anthropic", "OpenAI"]
MIN_POINTS = 100
HOURS_BACK = 48
MAX_RESULTS = 20

# Off-topic strings to drop pre-LLM (cuts noise; LLM does the rest).
EXCLUDE_SUBSTR = (
    "ai token", "ai coin", "$ai", "aipac",
)


def search(query: str, since_ts: int) -> list[dict]:
    url = (
        "https://hn.algolia.com/api/v1/search?"
        + urllib.parse.urlencode({
            "query": query,
            "tags": "story",
            # Algolia's HN index stopped allowing `points` in numericFilters
            # (HTTP 400 since ~2026-06-17); points are filtered locally in main().
            "numericFilters": f"created_at_i>{since_ts}",
            "hitsPerPage": 50,
        })
    )
    req = urllib.request.Request(url, headers={"User-Agent": "phillipsben-dashboard"})
    with urllib.request.urlopen(req, timeout=30) as resp:
        return json.loads(resp.read().decode("utf-8")).get("hits", [])


def main() -> int:
    since = int(time.time()) - HOURS_BACK * 3600
    seen: dict[str, dict] = {}
    for q in QUERIES:
        try:
            hits = search(q, since)
        except Exception as e:
            print(f"warn: query {q!r} failed: {e}", file=sys.stderr)
            continue
        for h in hits:
            oid = str(h.get("objectID"))
            if oid in seen:
                continue
            if int(h.get("points") or 0) < MIN_POINTS:
                continue
            title = (h.get("title") or "").strip()
            if not title:
                continue
            lower = title.lower()
            if any(bad in lower for bad in EXCLUDE_SUBSTR):
                continue
            url = h.get("url") or f"https://news.ycombinator.com/item?id={oid}"
            seen[oid] = {
                "title": title,
                "url": url,
                "source": "Hacker News",
                "points": int(h.get("points") or 0),
                "createdAt": datetime.fromtimestamp(
                    int(h.get("created_at_i")), tz=timezone.utc
                ).strftime("%Y-%m-%dT%H:%M:%SZ"),
                "hnUrl": f"https://news.ycombinator.com/item?id={oid}",
                "whyItMatters": "",  # LLM fills
            }
    candidates = sorted(seen.values(), key=lambda c: c["points"], reverse=True)[:MAX_RESULTS]
    json.dump(candidates, sys.stdout, indent=2)
    sys.stdout.write("\n")
    return 0


if __name__ == "__main__":
    sys.exit(main())
