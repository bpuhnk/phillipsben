# phillipsben.com — Final Build Plan

## Context

Ben is building a personal site at https://phillipsben.com — a living résumé + portfolio for recruiters, hiring agencies, and ongoing project write-ups. The repo at `/media/bpuhnk/2016SRV/repos/bio` is empty (greenfield). Design is already complete: JSX mockups and `styles.css` live at `/tmp/bio-design/` (from a Claude design-canvas export). This plan ports those mockups into a production Next.js site, hosted in Docker behind Ben's existing Cloudflare tunnel.

Outcome: a single `docker compose up -d --build` deploy that ships v1 (8 pages + dynamic projects), generates a résumé PDF at build time, and uses the design system Ben has already approved visually.

## Decisions Locked (from Q&A)

| Topic | Decision |
| --- | --- |
| Stack pins | Use **latest stable** at scaffold time (`npm view <pkg> version`), not the plan's speculative pins. Pin actuals into `package.json`. |
| Hero variant | **Variant A** ("Available for select work") |
| Dark mode | **Skip for v1.** Light-themed `ember` palette only. No theme toggle, no `data-fonts` switcher. |
| Fonts | Instrument Serif (display) + Geist (body) + Geist Mono via `next/font/google`. |
| Project filters | Client component, **URL-synced** via `useSearchParams` (`?status=&tag=`). Shareable, back-button safe. |
| Resume PDF | **`/resume/print`** noindex route, print-optimized layout. Playwright renders to `public/resume.pdf` in `postbuild`. |
| Calendar | **Cal.com embed** (`@calcom/embed-react`) for `cal.com/bPuhnk` 30-min slot. **NOTE:** Ben must rotate the API key he pasted in chat (`cal_live_…`) — the embed widget doesn't need it. |
| Contact | `contact@phillipsben.com` (mailto), Cal.com embed, résumé download. |
| Socials | GitHub `@bPuhnk`, LinkedIn `ben-phillips-332a4826`. Drop Mastodon + RSS rows from mockup. |
| Featured projects | Frontmatter `featured: true` flag; landing renders first 3 flagged (sorted by date). Ben marks as he goes. |
| Bio stats | **3-up** (changed from 4): `15+ years .NET`, `2 industries`, `∞ spools`. |
| Mockup content | Bio timeline, skills chips, philosophy pullquote, hobbies copy — **ship verbatim**, Ben edits MDX post-launch. |
| OG image | **Single static** `public/og.png` (1200×630) for all routes. |
| `/now` | Seeded with mockup content; updated monthly. Frontmatter `updated` date renders in footer of page. Timezone America/Chicago. |
| Analytics | Plausible off; `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` env-gated. |
| Sitemap | All routes except `/resume/print` and 404. |
| Infra | Docker compose attaches to `external` network, name via `$CF_TUNNEL_NETWORK` (default `cloudflare-tunnel`). No published port. |
| Footer | 4 columns: Sections / Around the web / Working / Colophon. Exact copy from Q&A. |

## Project Scaffolding List (`content/projects/<slug>/index.mdx`)

Six MDX files, all real. Each seeded with frontmatter + a body stub. Ben writes the body when ready.

| Slug | Title | Status | Year | Source / Notes |
| --- | --- | --- | --- | --- |
| `hermes-agent` | Hermes-Agent | active | 2026 | Private, lives on host01. Body uses mockup's Problem/Approach/Box/Broke structure. GitHub link omitted (TODO). |
| `claude-orbiter` | Claude-Orbiter | active | 2026 | `github.com/bpuhnk/claude-orbiter`. Summary from repo: "Desktop visual orchestration app for Claude AI agents with CLI, SDK, terminals, and DevTools." |
| `theword-group` | TheWordGroup | active | 2026 | `github.com/bpuhnk/TheWordGroup`. Summary TBD (no README — Ben fills in). |
| `server-talk` | server-talk | active | 2026 | Summary from local notes: "Two Claude instances holding autonomous conversations via shared markdown vault." |
| `mcp-klipper` | MCP_Klipper | shipped | 2026-01 | `github.com/bpuhnk/mcp-klipper-docs`. |
| `blv-am8` | BLV AM8 | shipped | 2023 | Local repo `/media/bpuhnk/2016SRV/repos/AM8`. Hobby crossover (also referenced in `/hobbies`). |

The other 7 projects from the mockup (Aggregate Plant OS, QC Suite, Smart Shop, Weighbridge, Local-LLM notebook, Shift Reporting, Ender3 Klipper) are **dropped** from v1.

## Tech Stack (final)

- **Next.js** App Router, latest stable, TypeScript, `output: 'standalone'`.
- **Node 24 LTS** (image + local).
- **Tailwind CSS** latest stable (v4 if shipping; CSS-first config consumed from `globals.css`).
- **MDX** — `@next/mdx` for static route files (bio, hobbies, uses, landing, now, contact). `@mdx-js/mdx` `compileMDX` for dynamic `[slug]` projects. Frontmatter via `gray-matter`, validated with **Zod** in `lib/content.ts`.
- **Playwright** latest stable, only in builder stage (Microsoft image), not runtime.
- **`@calcom/embed-react`** on `/contact`.
- **`next-sitemap`** for sitemap/robots.
- **Fonts** via `next/font/google`: Instrument Serif, Geist, Geist Mono.

## Repository Layout

```
/
├── app/
│   ├── layout.tsx                 # shell: fonts, nav, footer, Plausible (env-gated)
│   ├── page.tsx                   # PageLanding (variant A)
│   ├── bio/page.tsx
│   ├── projects/page.tsx          # listing + <ProjectFilters>
│   ├── projects/[slug]/page.tsx   # generateStaticParams from content/projects
│   ├── now/page.tsx
│   ├── hobbies/page.tsx
│   ├── uses/page.tsx
│   ├── contact/page.tsx           # email + Cal.com embed + résumé card
│   ├── resume/print/page.tsx      # noindex, print stylesheet
│   ├── not-found.tsx              # Page404
│   ├── opengraph-image.tsx        # static fallback → public/og.png
│   └── globals.css                # palette + type tokens ported from styles.css
├── components/
│   ├── nav.tsx, footer.tsx
│   ├── section-head.tsx, chip.tsx
│   ├── project-card.tsx           # variants: grid | horizontal | minimal (via prop)
│   ├── project-filters.tsx        # 'use client', URL-synced
│   ├── timeline.tsx, stats.tsx (3-up), def-list.tsx, image-placeholder.tsx
│   ├── cal-embed.tsx              # 'use client', wraps @calcom/embed-react
│   └── mdx/                       # MDX shortcodes (Callout, Figure)
├── content/
│   ├── landing.mdx, bio.mdx, now.mdx, hobbies.mdx, uses.mdx, contact.mdx
│   └── projects/<slug>/index.mdx (+ assets)
├── design/reference/              # copied from /tmp/bio-design (styles.css + 3 JSX + images/)
├── lib/
│   ├── content.ts                 # gray-matter + Zod, getAllProjects, getProjectBySlug, etc.
│   └── og-types.ts
├── public/
│   ├── og.png                     # generated once, committed
│   ├── resume.pdf                 # build-time generated
│   └── images/                    # ben-headshot.png, ben-fullbody.png, ben-matt-lights.jpeg
├── scripts/
│   └── generate-pdf.mjs           # Playwright; runs in postbuild
├── next.config.mjs                # MDX + standalone
├── tailwind config (CSS-first if v4, else tailwind.config.ts)
├── Dockerfile, docker-compose.yml, .dockerignore
├── next-sitemap.config.mjs
├── .env.example                   # NEXT_PUBLIC_PLAUSIBLE_DOMAIN=, CF_TUNNEL_NETWORK=
├── README.md, tsconfig.json, package.json
```

## Key Implementation Notes

**Design tokens (`globals.css`):** Port `--bg`, `--bg-2`, `--bg-3`, `--ink`, `--ink-2`, `--ink-3`, `--rule`, `--rule-2`, `--accent`, `--accent-2` verbatim from `/tmp/bio-design/styles.css`. Drop the `[data-theme=ink|forest|plum]` alternates (not v1). Type primitives `.kicker`, `.display`, `.lede`, `.meta` become Tailwind component classes via `@layer components`.

**Components:** Port one-to-one from the JSX mockups in `pages-main.jsx` / `pages-more.jsx` / `pages-final.jsx`. The mockups already encode every visual decision; my job is to translate inline `style` props to Tailwind tokens (or keep inline where it's clearer). `<ProjectCard variant="grid|horizontal|minimal">` consumes the `[data-card]` variants. `<Stats>` becomes 3-up. The `[data-fonts]` switcher is **not** ported.

**MDX loader (`lib/content.ts`):** One module with these exports:
- `projectFrontmatterSchema` (Zod): title, slug, summary, status enum, techStack[], startDate, endDate?, links?, cover?, featured boolean.
- `getAllProjects()`: reads `content/projects/*/index.mdx`, parses frontmatter, returns typed array sorted by `startDate desc`.
- `getProjectBySlug(slug)`: returns `{ frontmatter, content }` for the `[slug]` route.
- `getPageContent(name)`: simple wrapper for static MDX (bio/now/hobbies/uses).

**Filters (`components/project-filters.tsx`):** `'use client'`. Reads `?status=` and `?tag=` from `useSearchParams`. Writes back via `router.replace` (shallow). Listing page is a server component that receives the full project list and a client `<ProjectFilters>` that re-renders the visible subset.

**PDF pipeline (`scripts/generate-pdf.mjs`):** Spawns `npm run start` against the standalone build on a random port, waits for ready, launches Playwright headless Chromium, navigates to `/resume/print`, calls `page.pdf({ format: 'Letter', printBackground: true, margin })`, writes to `public/resume.pdf`, kills the server. Wired as `"postbuild": "node scripts/generate-pdf.mjs"` in package.json. **Builder image:** `mcr.microsoft.com/playwright:v<latest>-noble`. Runner image: `node:24-alpine`, copies `.next/standalone` + `.next/static` + `public/`.

**Cal.com embed:** `<CalEmbed namespace="30min" calLink="bPuhnk/30min" />`. Lazy-loaded; falls back to a plain link if JS disabled.

**SEO:** `next-sitemap.config.mjs` excludes `/resume/print` and 404. `robots.txt` allows everything else. Each route exports `metadata` with title + description + canonical. OG image is a single static `public/og.png` referenced from `app/layout.tsx`.

**Docker:**
```yaml
services:
  phillipsben-com:
    build: .
    restart: unless-stopped
    networks: [tunnel]
    expose: ["3000"]
networks:
  tunnel:
    external: true
    name: ${CF_TUNNEL_NETWORK:-cloudflare-tunnel}
```

## Implementation Phases

1. **Scaffold.** `npx create-next-app@latest` (TS, App Router, Tailwind), Node 24, prune defaults, drop in fonts, port `globals.css` tokens, build `layout.tsx` shell (nav + footer empty-state).
2. **Design system.** Build the 9 primitive components from mockups. Visual spot-check each in isolation (a `/design/preview` dev-only route is fine; remove before deploy).
3. **MDX plumbing.** `next.config.mjs` MDX config, `lib/content.ts` with Zod schemas, seed all 6 page MDX + 6 project MDX with frontmatter + mockup-verbatim bodies.
4. **Pages.** Landing (variant A), Bio (3-up stats, timeline ported), Projects (listing + URL-synced filters), Project detail (sticky sidebar + body), Now (seeded), Hobbies, Uses, Contact (+ Cal.com embed), 404, `/resume/print`.
5. **PDF.** `scripts/generate-pdf.mjs` + `postbuild` wiring. Verify `public/resume.pdf` after `npm run build`.
6. **SEO + a11y pass.** `next-sitemap`, single OG, route `metadata`, Lighthouse audit, fix anything <95.
7. **Docker + deploy.** Multi-stage Dockerfile, `docker-compose.yml`, README deploy steps. Test `docker compose up --build` locally on port 3000.

## Critical Files

- `app/globals.css` — palette + type tokens.
- `app/layout.tsx` — fonts, shell, env-gated Plausible.
- `app/page.tsx`, `app/bio/page.tsx`, `app/projects/page.tsx`, `app/projects/[slug]/page.tsx`, `app/now/page.tsx`, `app/hobbies/page.tsx`, `app/uses/page.tsx`, `app/contact/page.tsx`, `app/resume/print/page.tsx`, `app/not-found.tsx`.
- `components/{nav,footer,section-head,chip,project-card,project-filters,timeline,stats,def-list,image-placeholder,cal-embed}.tsx`.
- `lib/content.ts` — single source of MDX truth.
- `scripts/generate-pdf.mjs` — Playwright PDF.
- `Dockerfile`, `docker-compose.yml`, `next-sitemap.config.mjs`, `.env.example`.

## Existing Assets to Reuse

- `/tmp/bio-design/styles.css` → ported into `app/globals.css` (palette + type primitives).
- `/tmp/bio-design/pages-*.jsx` → reference for every component + page (copy to `design/reference/`, do not import).
- `/tmp/bio-design/images/{ben-headshot.png, ben-fullbody.png, ben-matt-lights.jpeg}` → copy to `public/images/`.
- `/tmp/bio-design/uploads/IMG_0890.PNG` → **duplicate** of `ben-fullbody.png` (same MD5). Skip.
- Mockup JSX has the full Hermes-Agent body, hobbies copy, philosophy pullquote, bio timeline — port verbatim.

## Pre-implementation Action Items for Ben

1. **Rotate the Cal.com API key** that was pasted in chat — it is exposed.
2. Confirm `cal.com/bPuhnk` is the right public URL (or correct the slug).
3. Confirm `contact@phillipsben.com` mailbox exists (no MX work in this plan).
4. Confirm Docker network name on the server (default `cloudflare-tunnel` will be used otherwise).

## Verification Plan

End-to-end after Phase 7:

1. **Dev:** `npm run dev` → every route renders, nav links resolve, filters update URL, no console errors.
2. **Sample project flow:** `content/projects/claude-orbiter/index.mdx` appears on `/projects` with correct status chip + tags; `/projects/claude-orbiter` renders MDX body.
3. **Filters:** `?status=active` and `?tag=TypeScript` correctly subset the listing; deep-linked URL state survives reload.
4. **PDF:** `npm run build` produces `public/resume.pdf`; `/resume.pdf` serves it; PDF opens cleanly (single column, page breaks at section boundaries).
5. **Cal.com embed:** `/contact` renders the picker without console errors.
6. **Lighthouse (mobile):** ≥95 across Performance, Accessibility, Best Practices, SEO.
7. **Docker local:** `docker compose up --build`, `curl localhost:3000/` returns landing HTML, `curl localhost:3000/resume.pdf` returns PDF bytes.
8. **Deploy:** `git pull && docker compose up -d --build` on host, verify `https://phillipsben.com/` and `https://phillipsben.com/resume.pdf` via the existing Cloudflare tunnel.

## Out of Scope (deferred to v2)

- Blog / RSS / Mastodon.
- Dark-mode toggle + alternate palettes (ink/forest/plum).
- `[data-fonts]` font switching.
- CI/CD pipeline.
- Contact form (mailto is sufficient).
- The 7 dropped mockup projects.
- i18n, comments, testimonials.
