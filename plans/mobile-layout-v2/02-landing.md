# Phase 2 — Landing (`/`)

## Mockup

`MPageLanding` in `pages-mobile.jsx` (L88–209). Artboard: 390px.

## Sections in mockup order

1. **Hero** — `padding: 40px 22px 36px`. Kicker (●&nbsp;AVAILABLE · MAY 2026).
   `h1` at **60px** with the `<i>` italic break. Italic display lede at
   **17px**. Two stacked full-width CTAs ("See the work", "About me") with
   `padding: 11px 16px`.
2. **Currently card** — `var(--bg-2)` block with `padding: 22px`. Two stacked
   rows separated by `border-top: 1px solid var(--rule)`. Each row has a
   19px display title + tiny meta line.
3. **Skill strip** — horizontal-scroll row, font-mono 10px, `gap: 32px`,
   bordered top + bottom. Use `.m-scroll-strip`.
4. **What's here** — six-row link list with kicker `/route` in accent, 22px
   display title with `→`, 13px description. Use `.m-link-list`.
5. **Recent work** — `var(--bg-2)` band, vertical card stack `gap: 24px`.
   Each card has an `Img` placeholder (16:9) + body with year · status ·
   title · description. **No tag chips on landing recent cards** (chips show
   only on `/projects`).
6. **Philosophy** — dark band `background: var(--ink)`, color `var(--bg)`.
   Kicker `§ 02 · HOW I WORK`. 26px display quote with one accent-tinted
   `<i>`.

## Files modified

### `app/page.tsx`

- Audit current sections against the mockup. Likely fine for hero/currently/
  philosophy. Likely **missing** the "What's here" link list and the
  borderless skill strip at mobile (or they exist but desktop-styled).
- If "What's here" doesn't exist as a section today, add it (it's part of
  the desktop mockup too, so check `pages-main.jsx` and current `app/page.tsx`
  first — may already be there in a different form).
- Replace hardcoded inline styles for elements that need mobile overrides
  with classes (`landing-skill-strip`, `landing-whats-here`, `landing-currently`
  already exist; add `landing-recent-grid` if needed).

### `app/globals.css` (under landing comment group)

- `.landing-hero h1` at mobile: `font-size: 60px; letter-spacing: -0.025em`.
- `.landing-hero .lede` at mobile: `font-size: 17px`.
- `.landing-currently` already has mobile rules; verify padding matches.
- Skill strip uses `.m-scroll-strip`.
- "What's here" uses `.m-link-list`; verify accent-colored kicker route name
  + display title with trailing `→`.
- Recent work grid: `grid-template-columns: 1fr; gap: 24px` on mobile.
- Philosophy band: `padding: 48px 22px`; quote `font-size: 26px`.

## Verification

- DevTools at 390 × 844: side-by-side with `MPageLanding`.
- All six "what's here" links scroll into view, tap targets ≥ 44px.
- Skill strip scrolls horizontally with no visible scrollbar.
- Hero CTAs are full-width and tappable.
- Recent work cards stack vertically, image-on-top, then meta line + title +
  description.
- `npm run build` clean.
