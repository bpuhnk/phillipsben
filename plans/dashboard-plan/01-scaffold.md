# Phase 1 — Page scaffold + schemas + seeded JSON

Ship the `/dashboard` route end-to-end with hand-written seed JSON. No Hermes
integration yet. After this phase the page is visually complete and the data
contract is locked.

## New files

### Content (seed values)

- `content/data/dashboard-claude.json`
  ```json
  {
    "updatedAt": "2026-05-18T06:00:00Z",
    "summary": "Markdown narrative paragraph(s).",
    "highlights": [
      { "repo": "phillipsben.com", "oneLiner": "Built the dashboard page." }
    ]
  }
  ```

- `content/data/dashboard-github.json`
  ```json
  {
    "updatedAt": "2026-05-18T06:00:00Z",
    "weekStart": "2026-05-11",
    "totals": { "commits": 0, "prs": 0, "repos": 0, "activeDays": 0 },
    "repos": [
      { "name": "owner/repo", "url": "https://...", "commits": 0, "summary": "..." }
    ]
  }
  ```

- `content/data/dashboard-news.json`
  ```json
  {
    "updatedAt": "2026-05-18T06:00:00Z",
    "items": [
      { "title": "...", "url": "https://...", "source": "Hacker News", "points": 0, "whyItMatters": "..." }
    ]
  }
  ```
  Validate `items.length <= 5`.

- `content/data/dashboard-currently.json`
  ```json
  {
    "updatedAt": "2026-05-18T06:00:00Z",
    "focus": "One-paragraph focus statement.",
    "reading": { "title": "...", "author": "...", "url": null, "coverUrl": null }
  }
  ```

- `content/data/dashboard-spotify.json`
  ```json
  {
    "updatedAt": "2026-05-18T06:00:00Z",
    "nowPlaying": null,
    "recent": [
      { "track": "...", "artist": "...", "playedAt": "2026-05-18T05:42:00Z", "url": "https://..." }
    ]
  }
  ```

- `content/site/dashboard.mdx` — hero/intro copy, editable in `/admin`.

### Page + components

- `app/dashboard/page.tsx` — async RSC. Calls `getDashboardData()`, composes
  sections. Adds `export const metadata` (title, description, OG).
- `components/dashboard/now-playing-tile.tsx` — small visual tile, album art
  + track + artist + relative time. Falls back gracefully when `nowPlaying`
  is null (show top item from `recent`).
- `components/dashboard/last-updated.tsx` — server component, formats the
  composite `lastUpdated` as relative time ("3 hours ago"). Pure function of
  the input timestamp + page render time (which is build time for SSG).

## Modified files

- `lib/site-schemas.ts` — add 5 Zod schemas (one per dashboard JSON file).
  Follow the existing schema-naming convention used for `navSchema`,
  `homeCardsSchema`, etc. Export a composite `dashboardSchemas` object.
- `lib/site-content.ts` — add `getDashboardData()` that:
  1. Reads all 5 JSON files in parallel via `fs.promises.readFile`.
  2. Parses each through its Zod schema (throws on invalid).
  3. Returns `{ claude, github, news, currently, spotify, lastUpdated }`
     where `lastUpdated` is the max of the 5 `updatedAt` values.
- `content/data/nav.json` — add `{ "label": "Dashboard", "href": "/dashboard" }`
  in the appropriate slot (check existing order with Ben before deciding).
- `public/admin/config.yml` — add ONE Decap collection for
  `dashboard-currently.json` with fields for `focus`, `reading.title`,
  `reading.author`, `reading.url`, `reading.coverUrl`. Do NOT expose the
  other four files — they're Hermes-owned and concurrent edits would conflict.

## Layout (top to bottom)

```
<SectionHead> from dashboard.mdx hero
┌─────────────────────────────────────────────────────┐
│ Currently  │  Reading  │  Recent Listening (Spotify) │   3-col grid → stacks on mobile
└─────────────────────────────────────────────────────┘
<Stats> — 4 tiles: commits, PRs, repos touched, active days
<SectionHead "This Week on GitHub">
  Grid of repo cards (reuse ProjectCard shape: title, one-liner, count chip)
<SectionHead "Recent Claude Work">
  Rendered markdown from claude.summary + bullet list of highlights
<SectionHead "AI News">
  Numbered list of 5 items, each with title link, source <Chip>, whyItMatters
<LastUpdated /> in footer area
```

## Reuse checklist (verify before adding anything new)

- `components/section-head.tsx` — every section header
- `components/stats.tsx` — shipping stats tiles
- `components/project-card.tsx` — GitHub repo cards (may need slim variant)
- `components/chip.tsx` — source tags on news items
- `components/def-list.tsx` — "currently" key/value rendering

## Verification

- `npm run build` succeeds with seed data.
- `.next/server/app/dashboard.html` exists after build.
- Manually edit `content/data/dashboard-currently.json`, rebuild, confirm UI
  reflects the change.
- Visit `/admin` in dev, confirm only `dashboard-currently` is editable.
- Lighthouse on `/dashboard` matches scores of other pages (still SSG).
- Nav link visible on every page.
- Mobile (390 × 844): 3-col currently/reading/spotify grid stacks vertically;
  no horizontal scroll.

## Out of scope (this phase)

- Hermes itself — all JSON written by hand.
- Real Spotify / GitHub / news API calls.
- Memory summarization.
