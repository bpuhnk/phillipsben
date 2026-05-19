# Phase 2 — Hermes: GitHub + News + Currently

Wire Hermes to refresh the three public-data sections daily at 06:00. Lowest
risk class — no private context, no OAuth.

## Hermes-side work

Hermes owns scheduling and execution; this plan defines only the contract.

### Cron job (06:00 daily)

1. `git clone` the bio repo using a deploy key with write access scoped to
   `content/data/dashboard-*.json` only.
2. Generate the three JSON payloads (below).
3. Validate each payload locally against the Zod schemas (Hermes can run
   `npx tsx scripts/validate-dashboard.ts <file>` — see Bio-side work).
4. `git add content/data/dashboard-{github,news,currently}.json`
5. `git commit -m "chore(dashboard): daily refresh $(date -Idate)"`
6. `git push origin main` — triggers Docker rebuild via existing deploy hook.

### GitHub payload

- Query GitHub GraphQL `viewer.contributionsCollection` for the last 7 days.
- Group `commitContributionsByRepository` by repo.
- For each repo with ≥ 1 commit, fetch commit messages and ask LLM for a
  one-line `summary` ("Refactored auth flow; added 12 tests.").
- Compute totals: `commits` (sum), `prs` (PRs opened or merged in window),
  `repos` (count of repos with activity), `activeDays` (distinct days with
  any contribution).
- `weekStart` = ISO date 7 days before run.
- Write `dashboard-github.json` matching the schema from Phase 1.

### News payload

- Hacker News Algolia API:
  `https://hn.algolia.com/api/v1/search_by_date?tags=story&query=AI&numericFilters=points>100`
  with a 48-hour window.
- LLM picks 5 most relevant (filter out off-topic "AI" matches — crypto AI
  tokens, AI-themed product launches with no substance, etc.).
- For each, LLM writes a one-sentence `whyItMatters` blurb.
- Write `dashboard-news.json`.

### Currently payload

- LLM synthesizes 1–2 sentence `focus` from the GitHub data and the prior
  day's Claude memories (see Phase 3 — but `focus` can run before memories
  are wired by using GitHub data only).
- **Preserve the manual `reading` field.** Hermes must read the existing
  `dashboard-currently.json`, update only `updatedAt` + `focus`, leave
  `reading` untouched. This keeps the `/admin` edit flow working.
- Write `dashboard-currently.json`.

## Bio-side work

- `scripts/validate-dashboard.ts` — tiny CLI that takes a filename, reads it,
  parses against the matching Zod schema, exits 0/1. Lets Hermes fail fast
  before committing invalid data.
- Add `scripts/` to a glob in `.gitignore` only if it shouldn't ship in the
  Docker image (it probably should, for ops). Leave tracked.
- Document the data contract somewhere Hermes can read it. Either:
  - Reference Phase 1 schemas directly from Hermes (clone bio repo, parse
    `lib/site-schemas.ts`), or
  - Export schemas as a published JSON-Schema file at build time. Decide
    with Ben when implementing.

## Deploy hook

The existing Docker rebuild trigger needs to fire on push to `main`. Verify
the path. If a webhook doesn't already exist, options:

- GitHub Action that SSHes to the server and runs `docker compose up -d
  --build` (simplest).
- Webhook receiver on the server that does the same.

This is infrastructure work — confirm with Ben whether it exists before
adding it.

## Verification

- Run Hermes cron manually once, confirm commit lands on `main`.
- Confirm rebuild fires within ~1 minute of push.
- `/dashboard` reflects new GitHub data within ~5 minutes of cron run.
- Edit `dashboard-currently.reading` via `/admin`, run Hermes again,
  confirm `reading` survives the Hermes commit.
- Bad payload test: corrupt one of Hermes's outputs by hand, confirm
  `validate-dashboard.ts` rejects it before commit.

## Failure modes to handle

- Hermes can't reach GitHub API → skip that file's update, log, exit 0
  (don't break the dashboard for other sections).
- HN API returns < 5 results matching filter → pad with next-best, or write
  fewer items (Zod allows ≤ 5, not exactly 5).
- Git push race (Ben pushed in the meantime) → `git pull --rebase` then
  retry once.
