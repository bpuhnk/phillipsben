# Mobile layout v2 — overview

## Why

The updated design handoff (`Bio (1).zip`, extracted to
`/tmp/bio-update/design_handoff_phillipsben/`) ships `mockups/pages-mobile.jsx`
with explicit 390px artboards for **all 9 pages**. The previous handoff only
had mobile mockups for 4. The README declares these layouts authoritative for
viewports < 720px.

The first `mobile-plan` rollout shipped mobile **chrome** (`m-nav`, `m-foot`)
and basic responsive stacking. Page bodies still mostly reflow desktop layout
via grid → column. This rollout brings each page up to mockup fidelity.

## Approach (locked with Ben)

- **CSS-only**, no separate mobile components. Mobile rules live in
  `app/globals.css` under `@media (max-width: 720px)`. Page-level inline
  `style` props get hoisted into classes only when mobile needs to override
  them.
- **One PR per phase**, each phase scoped to one page (or pair of small ones).
- Reference mockup is the source of truth — paddings, font sizes, hierarchy.

## Phase order

| # | Phase                          | Pages touched          |
|---|--------------------------------|------------------------|
| 1 | [Foundations](01-foundations.md) | shared CSS patterns, naming, audit |
| 2 | [Landing](02-landing.md)         | `/`                  |
| 3 | [Bio](03-bio.md)                 | `/bio`               |
| 4 | [Projects](04-projects.md)       | `/projects` + `/projects/[slug]` |
| 5 | [Now](05-now.md)                 | `/now`               |
| 6 | [Hobbies](06-hobbies.md)         | `/hobbies`           |
| 7 | [Uses](07-uses.md)               | `/uses`              |
| 8 | [Contact + 404](08-contact-404.md) | `/contact`, `/not-found` |

Foundations first so per-page phases can use shared utility classes (e.g.
`.m-scroll-strip`, `.m-stack-tiles`, `.m-stat-grid`). After phase 1, pages can
be tackled in any order — they don't depend on each other.

## Verification (every phase)

- `npm run build` clean.
- DevTools responsive mode at **390 × 844** (iPhone 14): compare side-by-side
  against the relevant `MPage*` artboard in `pages-mobile.jsx`.
- Test on real device once via Cloudflare Tunnel URL.
- Keyboard + screen-reader regression: nothing on mobile should remove an
  element that was a11y-meaningful on desktop (chrome nav landmarks, skip
  links, etc.).
- No new layout shift on mobile (verify with Lighthouse).

## Out of scope

- Tablet (720–1024px) is unchanged; mockups don't define a tablet layout.
- Desktop layouts (≥ 720px) — do not touch unless a class is shared and the
  fix is also desktop-correct.
- Adding/removing routes. (`/not-found` only.)
- New content. Use whatever copy currently lives in the page; layout-only.
