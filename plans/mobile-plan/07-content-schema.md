# Phase 7 — Markdown content schema hardening

## Goal

Ben's stated goal in the handoff: "drop in markdown files and those be used as sources for guides/projects." `lib/content.ts` exists today — this phase audits it against the README spec, locks the front-matter schema with Zod (already a dep), and makes adding a new project a true zero-code operation.

## Prerequisites

Phases 1–4 merged. Optional but recommended: Phase 5 (so SEO meta can pull from validated front-matter).

## Files modified

### `lib/content.ts`

- Read the current implementation. Confirm it loads `content/projects/**/index.mdx` and `content/now/*.md`.
- Add Zod schemas matching the README spec (handoff README "Markdown-driven content" §):
  ```ts
  const ProjectFrontmatter = z.object({
    title: z.string(),
    slug: z.string(),
    status: z.enum(['active', 'shipped', 'archived']),
    role: z.enum(['personal', 'work']),
    year: z.number().int(),
    tagline: z.string(),
    hero: z.string().optional(),
    tags: z.array(z.string()).default([]),
    stack: z.array(z.string()).default([]),
    host: z.string().optional(),
    benchStatus: z.string().optional(),
    prev: z.string().optional(),
    next: z.string().optional(),
  });
  const NowFrontmatter = z.object({ date: z.coerce.date() });
  ```
- Parse every loaded file through the schema; throw a clear error at build time with file path + field on mismatch. Build should fail loudly, not silently render broken cards.
- Add `getProjectBySlug(slug)`, `getAllProjects()`, `getFeaturedProjects(n)` (latter already exists per `app/page.tsx` import), `getProjectNeighbors(slug)` for prev/next nav, `getLatestNow()`, `getNowArchive()`.

### `content/projects/*/index.mdx`

- Audit the six existing project MDX files (blv-am8, claude-orbiter, hermes-agent, mcp-klipper, server-talk, theword-group). Fix any front-matter that doesn't match the schema; add `prev` / `next` slugs to enable the project-detail nav.

### `content/now/*.md`

- If none exist yet, create at least one seed file with today's date so `/now` renders.

### `app/projects/[slug]/page.tsx`

- Use `getProjectNeighbors(slug)` to populate prev/next instead of hardcoding.

### Optional: `content/guides/*.md` + `app/guides/[slug]/page.tsx`

- README mentions guides as a future content type. Out of scope for now unless Ben wants to ship a first guide. Mark as deferred.

## Verification

- `npm run build` succeeds with all existing MDX files passing validation.
- Intentionally break one file's front-matter (e.g. delete `status`); rebuild — clear error pointing at the file and missing field.
- All project cards on `/projects` render with correct status chip color + role label.
- Prev/next on `/projects/hermes-agent` navigates to the configured neighbors.
- `/now` renders the latest entry; older entries accessible via archive route (if implemented).
