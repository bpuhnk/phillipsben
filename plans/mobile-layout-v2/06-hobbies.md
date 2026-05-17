# Phase 6 — Hobbies (`/hobbies`)

## Mockup

`MPageHobbies` in `pages-mobile.jsx` (L628–765). Largest single-page change.

## Sections in mockup order

1. **Title** — kicker `§ 01 · HOBBIES · OFF THE CLOCK`, `h1` at **60px**
   "The reasons the _garage light_ is on at _11pm._", italic lede 16px.
2. **Index strip** — horizontal-scroll row of section numbers
   `① 3D PRINTING · ② EMBEDDED · ③ LOCAL AI · ④ FAMILY & FAITH`. Use
   `.m-scroll-strip`. Bordered top + bottom.
3. **3D printing** — accent meta `① PRINTING`, 40px display heading with
   italic break, hero `Img` (4:3), body paragraph, then **vertical card
   stack** of three printers (each with `Img` 4:3, year+status meta, name,
   description).
4. **Embedded & smart home** — `var(--bg-2)` band. Accent meta
   `② EMBEDDED & SMART HOME`, 40px heading, paragraph, **2×2 image grid**
   (1:1 aspect), tag chip row.
5. **Local AI** — accent meta `③ LOCAL AI`, 40px heading, hero `Img` (4:3),
   paragraph, **2×2 stats grid** (GPU / RAM / MODELS / POWER) with hairline
   rules.
6. **Family & faith** — dark band (`background: var(--ink)`,
   `color: var(--bg)`). **Full-bleed image at top**
   (`images/ben-matt-lights.jpeg`, 4:3 aspect), then `padding: 32px 22px
   40px`. Meta caption + kicker `④ FAMILY & FAITH` + 26px italic display
   paragraph with one accent-tinted `<i>`.

## Files modified

### `app/hobbies/page.tsx`

This is the page most likely to need new structural changes. Audit the
current implementation first; expect the index strip and the 2×2 image grid
to be missing.

- Add the index strip section near the top (4 anchors to in-page sections).
- Each numbered section: hoist inline styles into classes
  (`hobbies-section`, `hobbies-printer-card`, `hobbies-embedded-grid`,
  `hobbies-stat-grid`, `hobbies-family-band`).
- Family band: current uses `.family-band` (which has mobile rules) but the
  mockup is **full-bleed image** at the top of the dark band, not side-by-
  side. Mobile rule already does `min-height: 320px` for the image and
  stacks them — confirm aspect ratio matches `aspect-ratio: 4 / 3`.

### `app/globals.css` (under hobbies comment group)

- `.hobbies-index-strip` — uses `.m-scroll-strip` base.
- `.hobbies-section h2` mobile font-size 40px.
- `.hobbies-printer-card` mobile vertical stack.
- `.hobbies-embedded-grid` mobile: `grid-template-columns: 1fr 1fr; gap: 8px`,
  each cell square via `aspect-ratio: 1 / 1`.
- `.hobbies-stat-grid` reuses `.m-stat-grid` (2-col with hairlines).
- `.family-band-img` mobile: `aspect-ratio: 4 / 3`, full bleed.
- `.family-band-copy` mobile: dark text rendering.

## Verification

- 390 × 844 vs `MPageHobbies`.
- All 4 numbered sections render with accent meta labels.
- Index strip scrolls; tapping a label jumps to the section (anchor links).
- 2×2 image grid is exactly square cells.
- Family band: image fills the full viewport width with no horizontal scroll.
- Dark band copy is legible (white-on-near-black with sufficient contrast).
- `npm run build` clean.
