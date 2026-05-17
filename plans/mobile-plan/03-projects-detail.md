# Phase 3 — Projects index + Project detail

## Goal

Convert the `/projects` index and `/projects/[slug]` template to match `MPageProjects` / `MPageProjectDetail`. The non-trivial pieces are the horizontal-scrolling filter bar and the sticky horizontal TOC dock.

## Prerequisites

Phase 1 merged. Phase 2 not strictly required but recommended for `.display-*` patterns to be settled.

## Files modified

### `components/project-filters.tsx`

- At `<720px`, render the chip filters in a horizontally-scrollable row with the visual `Work | Personal` separator bar (per `pages-mobile.jsx:347-357`).
- Use `overflow-x: auto; white-space: nowrap; scrollbar-width: none` + webkit scrollbar hide; chip font size drops to ~9.5px on mobile.
- Preserve existing desktop layout above 720; current `components/project-filters.tsx` is 113 lines — likely simplest to add a wrapper div whose flex direction / wrap rules change via media query, not to fork the component.

### `components/project-card.tsx`

- Keep `.grid` variant. Verify `aspect-ratio: 16 / 10` image renders without distortion at 360px width.
- Confirm tag chip wrapping (`flex-wrap: wrap`) doesn't push the card over the viewport edge.

### `app/projects/page.tsx`

- Card grid: 3 columns desktop → 1 column at `<720px` (CSS `grid-template-columns`).
- Header H1 uses `.display .display-l` (or per ramp).

### `app/projects/[slug]/page.tsx`

- Desktop has a sticky sidebar TOC (verify current state); mobile needs a sticky horizontal-scroll TOC dock (per `pages-mobile.jsx:454-463`).
- Both should drive the **same** `IntersectionObserver`-based active-section state. Extract that into `hooks/use-active-heading.ts` (new file, client) returning the current active id; render either sidebar or horizontal dock based on viewport.
- Breadcrumb meta row at top of mobile (← PROJECTS / HERMES-AGENT) per `pages-mobile.jsx:403-407`.
- Prev/next section as full-width stacked blocks at `<720px` (per `pages-mobile.jsx:526-537`).
- Verify `.prose` rules in `app/globals.css:260-269` render at acceptable mobile widths; lower `.prose h2` from 44px → use `.display-m` clamp tier.

## Verification

- Filter taps work end-to-end; if filters update URL/query params, that still happens on mobile.
- TOC active state updates as you scroll on mobile; sticky position holds on iOS Safari (check no ancestor has `overflow: hidden` or `transform` that breaks `position: sticky`).
- Render one project from MDX (`content/projects/hermes-agent/index.mdx`) at 360px and 1440px and visually compare to mockup.
- Prev/next links render and navigate correctly.
- Long project titles (>40 chars) don't overflow the card at 360px.
