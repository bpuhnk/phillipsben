# Phase 2 — Landing + Bio

## Goal

Convert the two highest-traffic pages to match the mobile mockups. Both have explicit `MPageLanding` / `MPageBio` references in `pages-mobile.jsx` — follow them.

## Prerequisites

Phase 1 merged: `.display-*` tiers exist in `app/globals.css`, `MNav`/`MFoot` ship, `ben-fullbody.png` is in `public/images/`.

## Files modified

### `app/page.tsx` (Landing)

- Replace inline `fontSize: 132` (line ~32) with `className="display display-xxl"`.
- Convert the `1fr 320px` grid (line ~22) to a single-column layout at `<720px`: the "Currently" right column moves to a `var(--bg-2)` card below the hero (per `pages-mobile.jsx:112-128`). Use a CSS class rather than inline style so the grid → stack transition is media-query-driven, not JS.
- Skill strip (if/when added): horizontal-scroll row at `<720px` using `overflow-x: auto; scrollbar-width: none; -ms-overflow-style: none` and `::-webkit-scrollbar { display: none }` (per `pages-mobile.jsx:130-142`).
- Mobile CTAs: stack the two `nav-cta` buttons full-width with `justify-content: center`.

### `app/bio/page.tsx`

- Add `className="display display-xl"` (or `display-l` per ramp judgement) on the page H1; drop inline size.
- Cutout image (`ben-fullbody.png`) — on mobile, render in a centered `var(--bg-2)` band ABOVE the lede (per `pages-mobile.jsx:226-237`); on desktop, keep it in the right column. Use a CSS-driven order swap (`flex-direction: column` + `order` or `grid-template-areas` with media query).
- Stats: with the new `.stats` rule from Phase 1, this collapses automatically — just verify the 4 stats render as 2×2 (per `pages-mobile.jsx:256-276`).
- Quick facts list: borderless `<ul>` with `border-top` per item (per `pages-mobile.jsx:247-252`). Likely already correct; verify line heights.

## Verification

- Visual diff at 360 / 414 / 768 / 1280 / 1440 widths against `MPageLanding` / `MPageBio`.
- `ben-fullbody.png` served (200, not 404); has descriptive `alt`.
- No horizontal page scroll at 360px.
- Hero headline scales smoothly when you drag the viewport from 360 → 1440 (no jump at the 720 breakpoint).
- "Currently" card readable at 360px; both items visible without truncation.
- Stats render 2×2 on mobile, 3-up on desktop.
