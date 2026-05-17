# Phase 5 — Now (`/now`)

## Mockup

`MPageNow` in `pages-mobile.jsx` (L551–624).

## Sections in mockup order

1. **Title** — kicker `§ 01 · NOW · UPDATED MAY 12, 2026`, `h1` at **60px**
   "What I'm _actually_ doing this month.", italic display lede 17px.
2. **Working on** — `h2` display 28px with `§ 02` idx. Four list rows,
   each: kicker tag (WORK/HOME) → 20px display title → 13.5px body → tiny
   meta line. Border-top per row.
3. **Reading & learning** — `var(--bg-2)` band, `h2` 28px with `§ 03`. Three
   rows: kicker tag → 20px display title → 13px body. Border between rows.
4. **Not working on** — white band, `h2` 28px with `§ 04`. Single italic
   display paragraph at 22px.

## Files modified

### `app/now/page.tsx`

Phase 7 of the previous rollout already converted `/now` to markdown-driven
with structured working/reading sections. So most data shape is correct.
Mobile work is layout/typography only.

- Verify the working list renders one entry per `<DefList>` row with the
  kicker tag, title, body, meta. Mobile rule should stack these tight
  (current `DefList` uses `.def` which is already 1-col on mobile).
- Reading section: current implementation is a 3-col CSS grid. Mobile needs
  to switch to a vertical list with border-top between items.

### `app/globals.css` (under now comment group)

- `.now-working .def dt` mobile font-size 10px, `.dd h5` 20px.
- `.now-reading` grid: on mobile, `grid-template-columns: 1fr`, items get
  `border-top: 1px solid var(--rule)` + `padding-top: 16px` per item; remove
  the 32px column gap.
- Not-working paragraph: ensure mobile font-size matches mockup 22px (the
  `display-m` class may already be close).

## Verification

- 390 × 844 vs `MPageNow`.
- Latest now entry (`content/now/2026-05.md`) renders top-to-bottom in order.
- All four working items visible with the right tag colors.
- Reading section is a vertical list on mobile (no 3-col grid).
- `npm run build` clean.
