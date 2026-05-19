# Phase 3 — Hermes: Claude memory summarization

Generate the "Recent Claude Work" section from Claude Code memory files
across **two hosts**: pop-os (primary, where the substantive GPU/dev work
happens) and host01 (secondary, mostly Hermes-meta and host01↔pop-os
interactions). Higher risk because memories may contain client names,
credentials, internal URLs, and half-formed ideas. Ships only after Phase
2 is stable.

## Inputs

Two memory sources, both visible inside the Hermes container:

- **pop-os (primary)** — daily rsync snapshot at
  `~/snapshots/claude-memory/pop-os/projects/*/memory/*.md`. Refreshed by
  a host01 cron at `05:45 UTC` that pulls `bpuhnk@pop-os:~/.claude/projects/`
  over a dedicated SSH key (`~/.ssh/id_ed25519_popos` inside the
  container, alias `pop-os`). If the snapshot is stale (rsync failed),
  Hermes should still proceed using whatever the last successful snapshot
  contains — log the staleness in the audit record.
- **host01 (secondary)** — live read from `~/.claude/projects/*/memory/*.md`
  (already bind-mounted into the container as part of the gateway setup;
  this is also where Hermes's own agent memories live, so it doubles as
  the "what did Hermes itself do" source). Use this primarily for context
  about interactions between hosts — deploy plumbing, Hermes-side
  decisions — not as a co-equal source. **Weight pop-os memories more
  heavily** in the summary; host01 should be supporting detail at most.

In both cases, only consider files modified in the last 7 days.

- `content/data/dashboard-config.json` (new file, owned by Ben, edited
  manually) containing an allowlist:
  ```json
  {
    "claudeTopicsAllowlist": ["phillipsben.com", "hermes-agent", "..."],
    "claudeRedactionRules": [
      "strip absolute paths",
      "strip API keys, tokens, URLs to internal services",
      "generic-ize any client/project name not in allowlist"
    ]
  }
  ```

## New / modified files

- `content/data/dashboard-config.json` — new, ships with allowlist seeded.
- `lib/site-schemas.ts` — add `dashboardConfigSchema`.
- `lib/site-content.ts` — `getDashboardData()` does NOT need to load config
  (config is Hermes-only input, not page render input). Skip the loader.
- `public/admin/config.yml` — add a collection for `dashboard-config` so
  Ben can edit the allowlist from `/admin` without a code change.

## Hermes-side work

### Redaction prompt skeleton

```
You are summarizing Ben's recent work with Claude for a PUBLIC dashboard.

Rules:
- Output 2-4 short paragraphs of markdown, conversational tone.
- Only mention projects by name if they appear in the allowlist below.
  For everything else, use generic phrasing: "a client project," "internal
  tooling," "an experiment."
- Never include: file paths, URLs, API keys, credentials, client names,
  unreleased product names, names of people other than Ben.
- Skip anything that would be embarrassing if a recruiter or current
  client read it.
- Also output a `highlights` array of {repo, oneLiner} for items where
  `repo` is in the allowlist.

Allowlist: <from dashboard-config.json>
Memory excerpts: <last 7 days of memory files>
```

### Output

Write `dashboard-claude.json` matching the schema from Phase 1. Hermes
commits straight to `main` per locked decision (no PR gate).

## Safety net

- Post-generation regex sweep on `summary` for obvious leaks:
  - `/[A-Z0-9]{20,}/` (likely tokens)
  - `/\/(home|Users|var|etc)\//` (absolute paths)
  - `/sk-[a-zA-Z0-9]{20,}/` (API key prefixes)
  - emails, IPs
- If any match, refuse to commit, log the offending text, alert Ben.
- Keep the last 7 days of generated summaries in Hermes's own state so Ben
  can audit what's been published.

## Verification

- Seed allowlist with 1 repo. Run Hermes manually with memories from a day
  where you discussed multiple projects.
  - Expected: the allowlisted repo is named explicitly; the others appear
    as "a client project" or are dropped from `highlights`.
- Add an obvious credential-looking string to a test memory file. Confirm
  the regex sweep catches it and Hermes refuses to commit.
- Confirm `dashboard-claude.json` validates against Zod.
- Confirm `/dashboard` renders the markdown summary correctly (no raw `**`,
  no broken links).

## Out of scope

- Past-summary archive UI (memories are summarized fresh each day, prior
  days' summaries are not kept on the dashboard).
- Multi-tier allowlists (e.g. "public" vs "friends-only"). Single public
  allowlist only.
