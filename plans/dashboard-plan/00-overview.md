# Dashboard page — overview

## Why

Add a public `/dashboard` page that gives visitors a "live update of work and
life," refreshed daily at 6:00 AM by the Hermes Agent (cron). Aggregates:

- Sanitized summary of recent Claude work (from `~/.claude/projects/*/memory/`)
- Daily snapshot of GitHub activity across public repos
- Top 5 AI news stories (Hacker News, filtered)
- Short "currently focused on" paragraph
- Shipping stats (commits this week, repos touched, active days)
- Spotify recent listening tile
- Manually-curated "now reading" entry
- "Last updated" timestamp

Hermes treats the repo as its CMS: clone → regenerate JSON → commit → push.
Push triggers Docker rebuild and redeploys the static site, mirroring the
pattern established in commit `ec8cd5d` (git-tracked content with `/admin`).

## Approach (locked with Ben)

- **Site stays pure SSG.** No API routes, no runtime fetching. Hermes writes
  to `content/data/dashboard-*.json`, Next renders at build time.
- **Hermes is the source of truth** for everything except `dashboard-currently`
  (reading + focus override), which Ben edits via `/admin`.
- **One PR per phase.** Phase 1 ships the page with seeded JSON (visually
  complete, no live data). Phases 2–4 wire Hermes feeds one risk class at a
  time: public-data first, private-context second, OAuth-heavy last.
- **Update cadence:** all sections refresh daily at 06:00 via Hermes cron.
- **Privacy:** Claude memory summarization runs the redaction LLM with a
  topics allowlist in `content/data/dashboard-config.json`. Commits go
  straight to `main` (no PR gate) — trust the redaction.
- **Reuse, don't rebuild.** Use `components/section-head.tsx`,
  `components/stats.tsx`, `components/project-card.tsx`, `components/chip.tsx`,
  `components/def-list.tsx`. Only add new components if reuse genuinely fails.

## Phase order

| # | Phase                                          | Risk class           |
|---|------------------------------------------------|----------------------|
| 1 | [Page scaffold + schemas + seeded JSON](01-scaffold.md) | none — pure UI |
| 2 | [Hermes: GitHub + News + Currently](02-hermes-public.md) | low — public data |
| 3 | [Hermes: Claude memory summarization](03-hermes-claude.md) | high — private context |
| 4 | [Hermes: Spotify integration](04-spotify.md)   | medium — OAuth refresh token |

Phases run sequentially. Phase 1 ships an instantly-useful page with hand-
written seed data. Phases 2–4 each replace seeded JSON with Hermes-generated
content — the page contract never changes after Phase 1.

## Verification (every phase)

- `npm run build` clean, no Zod schema errors.
- `/dashboard` renders at 390 × 844 (mobile) and ≥ 1024px (desktop) without
  layout breaks.
- Nav entry visible site-wide.
- `/admin` shows only `dashboard-currently` (Hermes-owned files excluded).
- After Phases 2–4: confirm a Hermes commit lands, deploy hook fires,
  deployed `/dashboard` reflects the new JSON within minutes.

## Out of scope

- Real-time updates ("now playing" will be up to 24h stale by design — label
  the Spotify tile "recent listening," not "now playing").
- Authentication / private dashboard view.
- Historical archive of past daily snapshots.
- Hermes itself — runtime / scheduling / secret management is owned by the
  Hermes project. This plan defines only the data contract Hermes writes to.
