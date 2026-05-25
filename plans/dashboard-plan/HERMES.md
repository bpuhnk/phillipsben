# Hermes runbook — daily dashboard refresh

**This is your operational source of truth.** Re-read it every run; Ben
edits it here in the phillipsben repo rather than touching your cron config.

You are an instance of Claude Code running on host01, fired daily by cron.
The mechanical work — syncing the repo, running the fetchers, assembling
schema-valid JSON, validating, checking freshness, committing, and pushing —
now lives in **`scripts/dashboard/refresh.sh`**. Your job is just the
*narrative*: read the staged inputs and write a handful of short artifacts.

> **Why it works this way:** the refresh used to be ~15 fiddly shell steps
> with long exact paths. That's exactly what a local model mangles (stray
> underscores, backticks in identifiers, heredoc quote corruption), and it
> "coped" by writing its own broken helper scripts. So all the fragile
> mechanics are in code now. **Run two commands, write five small files in
> between. Do not write to `content/data` directly. Do not author your own
> scripts.**

## The whole job

```sh
cd ~/work/phillipsben
bash scripts/dashboard/refresh.sh prep
#   …read the staged inputs, write the artifacts it lists (see below)…
bash scripts/dashboard/refresh.sh finalize
```

Then reply with **only** finalize's report (the freshness lines + pushed hash).

## Phase 1 — `prep` (mechanical, you just run it)

`prep` syncs the repo to `origin/main`, runs the three deterministic fetchers
into `/tmp/dash/`, builds a Claude-memory digest, stages the redaction
allowlist, and prints a brief. Read its output: it tells you which fetches
succeeded and which **FAILED**. A tile whose fetch failed will keep
yesterday's published data automatically — **do not fabricate a payload for
it; just skip its artifact.**

Staged inputs it produces (all short paths under `/tmp/dash/`):

| File           | What it is                                                   |
|----------------|--------------------------------------------------------------|
| `gh-raw.json`  | raw GitHub activity — `repos[].name`, `commits`, `_recent_messages` |
| `news-raw.json`| up to 20 HN candidates — `title`/`url`/`source`/`points`     |
| `mem.txt`      | recent Claude memory (≤7 days). **pop-os entries are PRIMARY**, host01 supporting. Headed by `### [pop-os] …` / `### [host01] …` |
| `config.json`  | `claudeTopicsAllowlist` + `claudeRedactionRules` — **honor every rule**. The allowlist is auto-expanded at `prep` time with the title + slug of every published `content/projects/*` page (on-site ⇒ nameable), merged onto the static base in `dashboard-config.json`. So if a project has a page, you may name it. |

## Phase 2 — the narrative (this is the part only you can do)

Write each of these with the **file tool** (never shell heredocs). Skip any
whose source fetch FAILED.

### `/tmp/dash/gh-sum.json` — repo summaries

```json
{ "<repo full_name>": "one sentence, past tense, ≤140 chars" }
```

One entry per repo in `gh-raw.json`, keyed by its `name`. Derive each summary
from that repo's `_recent_messages`. Voice examples:

- "Mobile-layout-v2 phases 1-8 landed; site copy moved into git-tracked content."
- "Tuned input shaper, retuned pressure advance for the BLV AM8."

(The merge step strips `_recent_messages` and stamps `updatedAt` for you.)

### `/tmp/dash/news-pick.json` — the 5 best stories

```json
[ { "url": "<from candidates>", "whyItMatters": "one sentence, ≤140 chars" } ]
```

Pick the **5** most genuinely interesting to someone doing AI engineering.
Higher `points` ≠ better. Skip drama/lawsuits/company gossip, crypto-AI
tokens, AI-marketing launches, and off-topic keyword matches. `whyItMatters`
is a pragmatic developer angle, e.g.:

- "Best evals overview I've seen this year — uses real PR-merge rate, not synthetic benchmarks."

(The merge step looks each `url` up in the candidates and carries over
`title`/`source`/`points`; you only supply `url` + `whyItMatters`.)

### `/tmp/dash/focus.txt` — what Ben's focused on

1–2 sentences, **present-tense, first-person** ("Shipping the public
dashboard…"), conversational. Derive from `gh-raw.json` (which repos got the
most commits) and the memory digest. Match the prior day's tone for
continuity. (The `reading` field is preserved automatically — you never touch it.)

### The Claude tile — NOT your job anymore

`claude.md` (summary) and `claude-hl.json` (highlights) are **pre-generated on
the host** by `~/.hermes/bin/gen-claude-summary.sh`, a separate cron that runs
Claude Code (Sonnet) ~09:45 — earlier than this refresh. It writes both files
to `~/.hermes/dashboard/claude-staging/`, applies the redaction sweep itself,
and `prep` copies today's file into the stage for you. **Do not write
`claude.md` or `claude-hl.json`** — if you do, you'll clobber the better
version. If no fresh staged file exists, `merge` keeps the published tile.

(Why: the local brain wrote flat, oversold prose and isn't safe to swap on the
shared GPU mid-run. Generating on a remote model off-box fixes both.)

## Phase 3 — `finalize` (mechanical, you just run it)

`finalize` merges your artifacts with the raw data into schema-valid
`content/data/dashboard-*.json`, validates each (a tile that fails validation
is reverted to its published version, not committed), prints a **freshness
report** (`FRESH` = rebuilt today, `kept` = left at a prior date), then
commits and pushes only if something changed. The push triggers the deploy
hook → Docker rebuild → live within ~1 minute.

**Relay finalize's report as your entire final message.** It is the ground
truth — do not summarize from memory, and never claim a tile updated when the
report says `kept`.

### If a tile reads `kept` and you expected `FRESH`

That means its fetch failed or you skipped its artifact. Check `prep`'s fetch
lines and the `/tmp/dash/*.err` files. Common cases:

- **Spotify 400 / "could not read token file"** → the rotating refresh token
  at `$SPOTIFY_TOKEN_FILE` is unreadable or revoked. It must stay owned by
  **your uid (1000)** — if anyone ran the fetcher as root it'll be root-owned;
  that needs a `chown` back. If genuinely revoked, alert Ben to re-run
  `scripts/dashboard/spotify_auth.py` locally.
- **GitHub/News fetch FAIL** → usually transient (rate limit / network).
  Leaving yesterday's data is the correct behavior; mention it and move on.

## Preconditions (host01 setup — already done)

- Deploy key with write access to `bpuhnk/phillipsben` at
  `~/.ssh/id_ed25519_bio`, SSH alias `github-phillipsben` in `~/.ssh/config`.
- `node` ≥ 20 (validator), `python3` ≥ 3.10 (fetchers). `prep` runs
  `npm install` once if `node_modules` is missing.
- Env: `GITHUB_TOKEN`, `GITHUB_LOGIN=bPuhnk`, `SPOTIFY_CLIENT_ID`,
  `SPOTIFY_REFRESH_TOKEN` (bootstrap), `SPOTIFY_TOKEN_FILE` (rotating token —
  must stay owned by uid 1000).

## Out of scope (do not do these)

- Write to `content/data/*` directly — `finalize` owns that.
- Author your own orchestration/helper scripts — use `refresh.sh`.
- Touch `content/data/dashboard-config.json` (Ben's allowlist, edited via `/admin`).
- Edit `lib/site-schemas.ts` — that's a code change; ask Ben.
- Open a PR or run a GitHub Action manually.

## Voice cheat-sheet

- Conversational, occasionally dry. Not corporate, not cute.
- Verbs over adjectives. "Shipped X" beats "successfully launched X."
- Specifics over abstractions. Name the tool/library/number.
- Never use: leverage, robust, seamless, world-class, journey, ecosystem,
  paradigm. Never open with "In today's…". Em dashes fine; exclamation points not.

## Quick reference

| Want to…                    | Run                                             |
|-----------------------------|-------------------------------------------------|
| Do the whole refresh        | `bash scripts/dashboard/refresh.sh prep` → write artifacts → `… finalize` |
| Test without committing     | `bash scripts/dashboard/refresh.sh dry`         |
| Validate one file           | `npx tsx scripts/dashboard/validate.ts <file>`  |
| See the schemas             | `lib/site-schemas.ts` (search "Dashboard")      |
| See the page that uses this | `app/dashboard/page.tsx`                        |
