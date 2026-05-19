# Hermes runbook — daily dashboard refresh

**This is your operational source of truth.** Re-read it every run; Ben
edits it here in the bio repo rather than touching your cron config.

You are an instance of Claude Code running on host01. Cron fires you at
06:00 daily with a one-line prompt: *"Refresh the phillipsben.com
dashboard. Follow `plans/dashboard-plan/HERMES.md` in the bio repo."*

## Preconditions

Hermes's environment must have:

- `git` configured with a deploy key that can push to `bPuhnk/phillipsben:main`,
  scoped (ideally) to `content/data/dashboard-*.json` only.
- `node` ≥ 20 (for the validator).
- `python3` ≥ 3.10 (for the fetchers).
- Env vars: `GITHUB_TOKEN` (read:user + public_repo), `GITHUB_LOGIN=bPuhnk`.

## Workflow

### 1. Clone or pull bio

```sh
cd /var/lib/hermes/work
[ -d phillipsben ] || git clone git@github.com:bPuhnk/phillipsben.git
cd phillipsben && git fetch && git checkout main && git reset --hard origin/main
npm install --no-audit --no-fund   # only if package-lock changed
```

### 2. Run the deterministic fetchers

```sh
mkdir -p /tmp/hermes-dashboard
python3 scripts/dashboard/fetch_github.py > /tmp/hermes-dashboard/github-raw.json
python3 scripts/dashboard/fetch_news.py   > /tmp/hermes-dashboard/news-candidates.json
```

If either fails (network, rate limit), skip that file's update for today.
Do NOT commit a partial / empty payload — leave the existing JSON untouched
so the dashboard keeps showing yesterday's data.

### 3. Fill in the narrative fields (the LLM part — you)

Read each fetcher's output. Produce the four JSON payloads below, writing
them to the corresponding files under `content/data/`.

#### `dashboard-github.json`

Start from `github-raw.json`. For each repo entry:

- `summary`: one sentence, past tense, ≤ 140 chars. Derive from
  `_recent_messages`. Examples of voice:
  - "Mobile-layout-v2 phases 1-8 landed; site copy moved into git-tracked content."
  - "Tuned input shaper, retuned pressure advance for the BLV AM8."
- **Strip the `_recent_messages` field before writing** — it's not in the schema.

Keep `totals` and `weekStart` as the script produced them.

#### `dashboard-news.json`

From `news-candidates.json` (up to 20 candidates):

- Pick **5** most genuinely interesting to someone working in AI engineering.
  Higher `points` ≠ better. Skip:
  - Drama / lawsuits / company gossip with no technical content
  - Crypto-AI tokens, AI-themed marketing launches
  - Off-topic matches (the keyword search is broad)
- For each pick, write `whyItMatters`: one sentence, ≤ 140 chars,
  pragmatic developer angle. Examples:
  - "Counter-evidence to the framework-pile-on trend in retrieval — worth reading for anyone building search."
  - "Best evals overview I've seen this year — uses real PR-merge rate, not synthetic benchmarks."
- Drop the `createdAt` and `hnUrl` fields when writing — they're not in the schema.
  Keep `title`, `url`, `source`, `points`, `whyItMatters`.

#### `dashboard-currently.json`

**Critical: preserve the manual `reading` field.** Read the existing file,
keep `reading` as-is, update only `updatedAt` and `focus`.

- `focus`: 1–2 sentences on what Ben is focused on this week. Derive from
  `github-raw.json` (which repos got the most commits, what shipped) and
  `dashboard-claude.json` (which you'll write in Phase 3). Until Phase 3
  is live, derive from GitHub only.
- Voice: present-tense, first-person ("Shipping the public dashboard…"),
  conversational. Match the tone of the prior day's `focus` for continuity.

#### `dashboard-claude.json`

**Phase 3 only.** In Phase 2 leave this file untouched.

#### `dashboard-spotify.json`

**Phase 4 only.** In Phase 2 leave this file untouched.

### 4. Validate

Before committing, every file you wrote must pass:

```sh
for f in content/data/dashboard-{github,news,currently}.json; do
  npx tsx scripts/dashboard/validate.ts "$f" || exit 1
done
```

If any fail, **do not commit**. Re-read the validator's field-level error,
fix the offending field, validate again. If you can't fix it in 2 retries,
abort the run and alert Ben via your usual channel — leave yesterday's
dashboard in place.

### 5. Commit and push

```sh
TODAY=$(date -u +%Y-%m-%d)
git add content/data/dashboard-*.json
git diff --cached --quiet && { echo "no changes"; exit 0; }   # nothing to do
git commit -m "chore(dashboard): daily refresh ${TODAY}

Refreshed by Hermes-Agent. See plans/dashboard-plan/HERMES.md."
git push origin main
```

Push triggers the deploy hook → Docker rebuild → live within minutes.

### 6. On race (rare)

If `git push` rejects because Ben pushed in the meantime:

```sh
git pull --rebase origin main
# Re-validate (Ben might have edited dashboard-currently.reading via /admin)
npx tsx scripts/dashboard/validate.ts content/data/dashboard-currently.json
git push origin main
```

Retry **once**. If it still fails, abort and alert Ben.

## Voice cheat-sheet

Ben's site voice across all sections:

- Conversational, occasionally dry. Not corporate, not cute.
- Verbs over adjectives. "Shipped X" beats "successfully launched X."
- Specifics over abstractions. Name the tool/library/number, not the category.
- Never use the words: leverage, robust, seamless, world-class, journey,
  ecosystem, paradigm. Never start a sentence with "In today's…".
- Em dashes are fine. Exclamation points are not.

## Out-of-scope (do not do these)

- Touch any file outside `content/data/dashboard-{github,news,currently,claude,spotify}.json`.
- Edit `lib/site-schemas.ts` even if validation feels too strict — that's
  a code change, ask Ben.
- Open a PR or run any GitHub Action manually.
- Commit a payload that strips/changes a field you don't recognize. If the
  schema accepts something you don't understand, leave it untouched in
  whatever state the previous run produced.

## Quick reference

| Want to…                          | Run                                            |
|-----------------------------------|------------------------------------------------|
| Validate one file                 | `npx tsx scripts/dashboard/validate.ts <file>` |
| Fetch GitHub activity             | `python3 scripts/dashboard/fetch_github.py`    |
| Fetch HN candidates               | `python3 scripts/dashboard/fetch_news.py`      |
| See the schemas                   | `lib/site-schemas.ts` (search "Dashboard")     |
| See the page that consumes this   | `app/dashboard/page.tsx`                       |
