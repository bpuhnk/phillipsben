#!/usr/bin/env python3
"""
Fetch the last 7 days of GitHub activity and emit a candidate
dashboard-github.json payload to stdout.

The `summary` field on each repo is left as an empty string — Hermes/LLM
fills those in after reading commit messages. Everything else is filled.

Env:
  GITHUB_TOKEN    Personal access token with read:user + public repo access.
  GITHUB_LOGIN    GitHub username to query (defaults to authenticated user).

Usage:
  GITHUB_TOKEN=ghp_... python3 scripts/dashboard/fetch_github.py > out.json
"""
from __future__ import annotations

import json
import os
import sys
import urllib.request
from datetime import datetime, timedelta, timezone

GRAPHQL_URL = "https://api.github.com/graphql"

QUERY = """
query($login: String!, $from: DateTime!, $to: DateTime!) {
  user(login: $login) {
    contributionsCollection(from: $from, to: $to) {
      totalCommitContributions
      totalPullRequestContributions
      contributionCalendar {
        weeks { contributionDays { contributionCount date } }
      }
      commitContributionsByRepository(maxRepositories: 25) {
        contributions { totalCount }
        repository {
          nameWithOwner
          url
          isPrivate
          defaultBranchRef {
            target {
              ... on Commit {
                history(first: 20, since: $from, until: $to) {
                  nodes { messageHeadline committedDate }
                }
              }
            }
          }
        }
      }
    }
  }
}
"""


def graphql(token: str, query: str, variables: dict) -> dict:
    body = json.dumps({"query": query, "variables": variables}).encode("utf-8")
    req = urllib.request.Request(
        GRAPHQL_URL,
        data=body,
        headers={
            "Authorization": f"bearer {token}",
            "Content-Type": "application/json",
            "User-Agent": "phillipsben-dashboard-fetcher",
        },
    )
    with urllib.request.urlopen(req, timeout=30) as resp:
        payload = json.loads(resp.read().decode("utf-8"))
    if "errors" in payload:
        raise RuntimeError(f"GraphQL errors: {payload['errors']}")
    return payload["data"]


def authenticated_login(token: str) -> str:
    data = graphql(token, "query { viewer { login } }", {})
    return data["viewer"]["login"]


def main() -> int:
    token = os.environ.get("GITHUB_TOKEN")
    if not token:
        print("error: GITHUB_TOKEN not set", file=sys.stderr)
        return 2

    login = os.environ.get("GITHUB_LOGIN") or authenticated_login(token)

    now = datetime.now(timezone.utc).replace(microsecond=0)
    week_ago = now - timedelta(days=7)
    iso = lambda dt: dt.strftime("%Y-%m-%dT%H:%M:%SZ")

    data = graphql(
        token,
        QUERY,
        {"login": login, "from": iso(week_ago), "to": iso(now)},
    )
    cc = data["user"]["contributionsCollection"]

    # Active days = count of days in window with > 0 contributions.
    active_days = sum(
        1
        for week in cc["contributionCalendar"]["weeks"]
        for day in week["contributionDays"]
        if day["contributionCount"] > 0
    )

    repos = []
    for r in cc["commitContributionsByRepository"]:
        repo = r["repository"]
        if repo["isPrivate"]:
            continue  # public dashboard, public repos only
        repos.append({
            "name": repo["nameWithOwner"],
            "url": repo["url"],
            "commits": r["contributions"]["totalCount"],
            "summary": "",  # LLM fills this from the recent_messages below
            "_recent_messages": [
                n["messageHeadline"]
                for n in (
                    repo.get("defaultBranchRef", {})
                    or {}
                ).get("target", {}).get("history", {}).get("nodes", [])
            ],
        })
    repos.sort(key=lambda r: r["commits"], reverse=True)

    out = {
        "updatedAt": iso(now),
        "weekStart": week_ago.date().isoformat(),
        "totals": {
            "commits": cc["totalCommitContributions"],
            "prs": cc["totalPullRequestContributions"],
            "repos": len(repos),
            "activeDays": active_days,
        },
        "repos": repos,
    }
    json.dump(out, sys.stdout, indent=2)
    sys.stdout.write("\n")
    return 0


if __name__ == "__main__":
    sys.exit(main())
