# Phase 1 — Foundations

## Goal

Lock the shared mobile patterns once so per-page phases stay small and
consistent. Audit what's already in `app/globals.css` `@media (max-width:
720px)` (currently L487–550) and extend with a small set of utility classes
the mockups reuse across pages.

## Files modified

### `app/globals.css`

Inside the existing `@media (max-width: 720px)` block, add (or formalize):

- `.m-scroll-strip` — horizontal-scroll row used for the landing skill strip,
  projects filter bar, project-detail TOC dock, hobbies index strip. Hides
  scrollbar (`scrollbar-width: none`, `::-webkit-scrollbar { display: none }`),
  `overflow-x: auto`, `white-space: nowrap`, `padding: 0 22px`. Container has
  `border-top` + `border-bottom: 1px solid var(--rule-2)`.

- `.m-stat-grid` — 2-column grid with hairline rules between cells. Used by
  bio stats and hobbies "local AI" stats. Already partially exists as `.stats`;
  generalize.

- `.m-tile-stack` — vertical stack of bordered cards/tiles, `gap: 14px`. Used
  by contact tiles and 404 quick-link grid (well, that's a 2-col grid — keep
  separate).

- `.m-link-list` — `<a>` list with `border-top: 1px solid var(--rule-2)` per
  item, `padding: 16px 0`, meta label above a display-serif title above a
  small description. Used by landing's "what's here", contact's "Elsewhere",
  uses' def rows.

- `.m-cta-stack` — vertical CTA group, `flex-direction: column`, `gap: 10px`,
  each child full-width `justify-content: center`, `padding: 11px 16px`. Used
  by landing, bio, 404.

- Section padding default at mobile: confirm `48px 22px` vertical/horizontal
  matches the mockups' `~32–40px 22px`. Mockups are tighter — propose
  reducing default mobile `.section` vertical to `40px 22px`, with override
  classes (`.section.loose`, `.section.tight`) where needed. **This is a
  global change — verify it doesn't regress already-correct pages.**

### Audit / cleanup

Walk the existing 720px block and delete any rules that are dead (selectors
not used by any current page). Specifically check `.tech-strip` — confirm
landing's tech strip uses this class, not an ad-hoc inline pattern.

### Naming convention

Mobile-only classes use the `m-` prefix to match the existing `m-nav` /
`m-foot` chrome. Shared classes (`section`, `chip`, `meta`, `kicker`) stay
unprefixed and pick up mobile rules from the `@media` block.

### `app/globals.css` ordering

Group the mobile block by **page section it serves**, not alphabetically.
Comments split it into: `/* chrome */`, `/* shared utilities */`, `/* landing
*/`, `/* bio */`, etc. Per-page phases append to the right section.

## Verification

- `npm run build` clean.
- Diff the rendered DOM/styles at 390px before vs after — every page should
  still render at least as correctly as it does today (no regressions). New
  utility classes have no consumers yet, so they're inert until phase 2+.
- No new console warnings from React (unused class names are fine).

## Notes for downstream phases

Each per-page phase should:
1. Open the relevant `MPage*` function in `/tmp/bio-update/design_handoff_phillipsben/mockups/pages-mobile.jsx`.
2. Walk top to bottom; for each section in the mockup, compare to the current
   page; identify diffs (font size, padding, hierarchy, missing strip /
   tile / band).
3. Add mobile overrides under the appropriate comment group in
   `globals.css`. Hoist inline `style` into a class only when mobile needs to
   override it.
4. Avoid touching desktop styles — if a desktop class needs renaming for
   clarity, do that in a separate commit on the same phase PR.
