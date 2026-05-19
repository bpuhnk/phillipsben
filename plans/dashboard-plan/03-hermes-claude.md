# Phase 3 — Hermes: Claude memory summarization

Generate the "Recent Claude Work" section from `~/.claude/projects/*/memory/`
files. Higher risk because memories may contain client names, credentials,
internal URLs, and half-formed ideas. Ships only after Phase 2 is stable.

## Inputs

- Memory files modified in the last 7 days under `~/.claude/projects/*/memory/`.
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
