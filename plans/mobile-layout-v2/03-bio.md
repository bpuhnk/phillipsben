# Phase 3 — Bio (`/bio`)

## Mockup

`MPageBio` in `pages-mobile.jsx` (L213–318).

## Sections in mockup order

1. **Title** — kicker `§ 01 · BIOGRAPHY`, `h1` at **52px** "A long résumé,
   _told slowly._"
2. **Portrait** — `var(--bg-2)` block, `height: 360px`, image
   `images/ben-fullbody.png` `object-fit: contain`, `height: 96%`. Small
   meta caption top-left: "FIG. — CHRISTMAS, 2024."
3. **Intro paragraph** — italic display, 19px, then `QUICK FACTS` meta + 4-row
   `<ul>` with hairline borders. List items at 13px.
4. **Stats 2×2** — grid with hairline rules between cells. Display-serif
   numbers at 40px (`∞` in accent italic). Meta label below.
5. **Career timeline** — kicker `§ 02 Career.`. Five rows, each with year
   meta, 19px display heading, secondary meta line, 13px description. Border
   hairline between rows.
6. **Family band** — `var(--bg-2)` section, kicker `§ 03 · OFF THE CLOCK`,
   22px italic display copy.
7. **CTAs** — two stacked: "Download résumé (PDF)" (solid), "Read /now →"
   (outline). `.m-cta-stack`.

## Files modified

### `app/bio/page.tsx`

- Confirm portrait section uses `bio-hero` / `bio-hero-img` classes (existing
  rules already stack and reorder on mobile). Verify height=360px and
  centered image align with mockup.
- Verify quick facts `<ul>` exists or add it.
- Stats use `.stats` / `.stat` (already 2-col on mobile via foundations).
- Timeline uses `.tl-row` (already 1-col on mobile). Verify heading sizes
  match (mockup: 19px display).
- Family band copy section: confirm exists.
- Add `.m-cta-stack` to the bottom CTA pair.

### `app/globals.css` (under bio comment group)

- `.bio-hero h1` at mobile: `font-size: 52px`.
- `.bio-hero-img` at mobile: `min-height: 360px`, centered image (current
  rule has `align-items: flex-end` — verify the contained image looks right).
- `.bio-quick-facts li` at mobile: `padding: 10px 0; font-size: 13px`.
- `.stats` cell on mobile: number `font-size: 40px`.
- `.tl-content h4` at mobile: `font-size: 19px`.
- Family band copy section: italic display 22px, `padding: 44px 22px`.

## Verification

- 390 × 844 vs `MPageBio` artboard.
- Portrait image renders correctly (path: `/images/ben-fullbody.png`).
- All 5 timeline entries stack vertically and are tappable if linked.
- Stats grid is exactly 2×2 with hairlines.
- Both CTAs full-width.
- `npm run build` clean.
