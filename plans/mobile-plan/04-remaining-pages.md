# Phase 4 — Remaining pages (Now, Hobbies, Uses, Contact, 404)

## Goal

Apply the patterns established in Phases 1–3 to the five pages that don't have explicit mobile mockups. The README is clear: "they should use the same patterns from the mobile components (compact `MNav`, stacked sections, horizontally-scrolling chip rows, `MFoot`) — they're already single-column-friendly on desktop."

## Prerequisites

Phases 1–3 merged.

## Files modified

### `app/now/page.tsx`

- Replace inline display `fontSize`s with `.display-l` / `.display-m` tier classes.
- Section padding inherits the Phase 1 `.section` mobile rule (22px horizontal, 40–48px vertical).
- Preserve the existing ">60 days stale → amber" indicator behavior. Verify it still triggers if the latest `content/now/*.md` is older than 60 days.

### `app/hobbies/page.tsx`

- Same display-tier swap.
- **Wire `ben-matt-lights.jpeg`** into the Family & Faith dark section as a half-bleed image against `var(--ink)` (per README "Image strategy" table). Use `next/image` with `priority={false}`, `sizes="(max-width: 720px) 100vw, 50vw"`.
- Confirm dark-band sections invert text color correctly (already covered by `.section.dark` at `app/globals.css:147-148`).

### `app/uses/page.tsx`

- Display-tier swap.
- `.deflist` collapses to single column via the Phase 1 mobile rule — verify.

### `app/contact/page.tsx`

- Display-tier swap.
- Cal.com embed (`components/cal-embed.tsx`) — verify it renders without horizontal scroll at 360px. May need `min-width: 0` on its parent or an explicit width override on the embed.

### `app/not-found.tsx`

- Display-tier swap. Keep "still on the print bed" copy.

## Verification

- Walk all 9 routes at 360 / 768 / 1440px; no overflow on any.
- `grep -rn "fontSize:" app/` returns only intentional one-offs (small UI labels, meta text), not display headings.
- `/hobbies` Family section: `ben-matt-lights.jpeg` loads, fills the dark band, doesn't push horizontal scroll.
- `/contact` Cal embed loads on mobile and is usable (large enough tap targets, no horizontal scroll).
- `/now` stale-indicator behavior preserved.
- Final pass: Lighthouse mobile audit on `/`, `/projects`, `/projects/hermes-agent`, `/now`, `/hobbies`. Target ≥ 95 performance / 100 accessibility on each.
- Real-device smoke test on whatever phone is handy.
- `npm run build` clean; `postbuild` (`next-sitemap` + `scripts/generate-pdf.mjs`) still succeeds.
