# Hermes runbook — daily dashboard refresh

**This is your operational source of truth.** Re-read it every run; Ben
edits it here in the phillipsben repo rather than touching your cron config.

You are an instance of Claude Code running on host01. Cron fires you at
06:00 daily with a one-line prompt: *"Refresh the phillipsben.com
dashboard. Follow `plans/dashboard-plan/HERMES.md` in the bio repo."*

## Preconditions

Hermes's environment must have:

- Deploy key with write access to `bpuhnk/phillipsben` installed at
  `~/.ssh/id_ed25519_bio`, with SSH alias `github-phillipsben` configured
  in `~/.ssh/config` (already set up on host01).
- `node` ≥ 20 (for the validator).
- `python3` ≥ 3.10 (for the fetchers).
- Env vars: `GITHUB_TOKEN` (read:user + public_repo), `GITHUB_LOGIN=bPuhnk`,
  `SPOTIFY_CLIENT_ID`, `SPOTIFY_REFRESH_TOKEN` (Phase 4).

## Workflow

### 1. Clone or pull bio

```sh
mkdir -p ~/work && cd ~/work
[ -d phillipsben ] || git clone git@github-phillipsben:bpuhnk/phillipsben.git
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

Summarize Ben's recent Claude work for a public audience. Inputs come from
**two memory sources**, both visible inside your container:

| Source       | Path                                                   | Weight     |
|--------------|--------------------------------------------------------|------------|
| **pop-os**   | `/opt/data/snapshots/claude-memory/pop-os/projects/*/memory/*.md` | **Primary** |
| **host01**   | `~/.claude/projects/*/memory/*.md` (live)                | Supporting |

Only consider files modified in the last 7 days (`find … -mtime -7`).

**pop-os is the primary source** — that's where Ben's substantive dev work
happens. host01 memories cover Hermes-meta and host01↔pop-os plumbing;
weight them lightly, mostly for cross-host context.

If the pop-os snapshot is stale (no rsync run since yesterday), proceed
anyway with whatever the last snapshot has — but note `(snapshot stale,
last sync YYYY-MM-DD)` at the end of the `summary` so readers know.

**Read the allowlist first:**

```sh
cat content/data/dashboard-config.json
```

It has two fields you must honor:

- `claudeTopicsAllowlist` — projects you MAY name explicitly. Anything not
  on this list must be referred to generically ("a client project,"
  "internal tooling," "an experiment").
- `claudeRedactionRules` — additional rules to apply. Read them carefully
  and follow each one.

**Redaction prompt (use as your system instruction when drafting):**

> You are summarizing Ben's recent work with Claude for his PUBLIC
> dashboard. Output 2-4 short paragraphs of markdown in Ben's voice
> (conversational, dry, verbs over adjectives, no exclamation points).
>
> RULES:
> 1. Only mention projects by name if they appear in `claudeTopicsAllowlist`.
>    For everything else, use generic phrasing.
> 2. Apply every rule in `claudeRedactionRules` verbatim.
> 3. Weight pop-os memories heavily; host01 is supporting context only.
> 4. Skip anything that would be embarrassing if a recruiter or current
>    client read it.
> 5. Also output a `highlights` array of `{repo, oneLiner}` for items
>    where `repo` is in the allowlist. Cap at 4.

**Safety net — regex sweep BEFORE writing the file.** If your draft
`summary` matches any of these, redact and redraft:

| Pattern                          | Catches                          |
|----------------------------------|----------------------------------|
| `[A-Za-z0-9_-]{32,}`             | likely tokens, hashes, JWTs      |
| `sk-[A-Za-z0-9-]{20,}`           | OpenAI / Anthropic key prefixes  |
| `gh[pousr]_[A-Za-z0-9]{20,}`     | GitHub token prefixes            |
| `/(home\|Users\|var\|etc\|opt)/` | absolute filesystem paths        |
| `\b\d{1,3}(\.\d{1,3}){3}\b`      | IPv4 addresses                   |
| `[\w.+-]+@[\w-]+\.[\w.-]+`       | email addresses                  |
| `Transaxle Manufacturing of America\|\bTMA\b` | employer name (always strip) |

If a match is unavoidable (e.g. discussing a public hostname like
`phillipsben.com`), document why in the audit record.

**Audit record.** Append a one-line entry to
`~/.hermes/audit/dashboard-claude.jsonl`:

```json
{"date":"2026-05-19","sources":{"popOsFiles":12,"host01Files":3,"popOsStale":false},"summaryChars":820,"highlightsCount":3,"regexHits":[]}
```

This is local to Hermes (not committed) — gives Ben a way to spot-check
what's been published over time.

#### `dashboard-config.json`

Read-only for you. Ben edits this via `/admin`. Never write to it.

#### `dashboard-spotify.json`

Run the Spotify fetcher directly into the file — it produces fully-formed
JSON, no LLM step needed:

```sh
SPOTIFY_CLIENT_ID="$SPOTIFY_CLIENT_ID" \
SPOTIFY_REFRESH_TOKEN="$SPOTIFY_REFRESH_TOKEN" \
  python3 scripts/dashboard/fetch_spotify.py > content/data/dashboard-spotify.json
```

Failure handling:
- Non-zero exit → script already refused to write a partial payload.
  Leave the existing file alone.
- 401 from Spotify on token refresh → the refresh token has been revoked.
  Alert Ben; he'll re-run `scripts/dashboard/spotify_auth.py` locally to
  capture a fresh one.

**One-time setup (Ben, not Hermes):**

1. Register an app at https://developer.spotify.com/dashboard with
   redirect URI exactly `http://127.0.0.1:8888/callback`.
2. Locally: `SPOTIFY_CLIENT_ID=xxx python3 scripts/dashboard/spotify_auth.py`
3. Copy the printed refresh token into Hermes's secret store as
   `SPOTIFY_REFRESH_TOKEN` along with `SPOTIFY_CLIENT_ID`.

### 4. Validate

Before committing, every file you wrote must pass:

```sh
for f in content/data/dashboard-{github,news,currently,claude,spotify}.json; do
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
  In particular, **never write to `content/data/dashboard-config.json`** —
  that's Ben's allowlist, edited via `/admin`.
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
| Fetch Spotify (writes file directly) | `python3 scripts/dashboard/fetch_spotify.py > content/data/dashboard-spotify.json` |
| Read the allowlist                | `cat content/data/dashboard-config.json`       |
| List recent pop-os memories       | `find /opt/data/snapshots/claude-memory/pop-os/projects -name '*.md' -mtime -7` |
| List recent host01 memories       | `find ~/.claude/projects -name '*.md' -mtime -7` |
| See the schemas                   | `lib/site-schemas.ts` (search "Dashboard")     |
| See the page that consumes this   | `app/dashboard/page.tsx`                       |
