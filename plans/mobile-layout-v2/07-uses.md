# Phase 7 — Uses (`/uses`)

## Mockup

`MPageUses` in `pages-mobile.jsx` (L769–889).

## Sections in mockup order

1. **Title** — kicker `§ 01 · USES · THE BORING DETAILS`, `h1` at **56px**
   "Tools that survived _five years_ of opinions.", italic lede 16px.
2. **Development** — `h2` 26px with `§ 02` idx. Four rows, each with meta
   tag (EDITOR/TERMINAL/AGENTS/SOURCE) → 17px display title → 13px body.
   Border-top per row.
3. **Hardware** — `var(--bg-2)` band. `h2` 26px with `§ 03`. Two sub-blocks
   (`DESK`, `HOMELAB`) each with key/value rows: 110px label column, value
   column, hairline rules.
4. **Models & local AI** — `h2` 26px with `§ 04`. Six rows: accent meta
   (role tag) + 19px display name + 13px description. Border-top per row.
5. **Workshop** — `var(--bg-2)` band. `h2` 26px with `§ 05`. Five key/value
   rows: 130px label column.

## Files modified

### `app/uses/page.tsx`

- Audit current section list; likely matches desktop with some grid
  reflow. Expected mobile work: tighten key column widths, ensure the
  hardware DESK/HOMELAB sub-headers render as kicker meta labels above
  each block.
- Verify all 5 sections are present in the current implementation. If the
  mockup merges desktop sections, follow the mockup at < 720px.

### `app/globals.css` (under uses comment group)

- `.uses-dev-row`, `.uses-models-row`: border-top, padding 14px 0, kicker
  meta label above title.
- `.uses-hw-row`, `.uses-workshop-row`: `grid-template-columns: 110px 1fr`
  (hardware) / `130px 1fr` (workshop) at mobile.
- `.uses-page h1` mobile 56px.
- `.uses-page h2` mobile 26px.

## Verification

- 390 × 844 vs `MPageUses`.
- All 5 sections present with correct kicker numbering.
- Hardware section shows DESK then HOMELAB sub-blocks.
- No horizontal overflow on long values (e.g. "Custom build · Ryzen 7 · 64GB
  · P100").
- `npm run build` clean.
