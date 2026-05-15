# phillipsben.com

Personal site — living résumé + project write-ups. Next.js (App Router) + MDX,
deployed behind a Cloudflare tunnel via Docker Compose.

## Local development

```bash
cp .env.example .env
npm install
npm run dev          # http://localhost:3000
```

## Build + résumé PDF

```bash
npm run build
# postbuild runs next-sitemap and Playwright → public/resume.pdf
```

`SKIP_PDF=1 npm run build` to skip Playwright (CI / quick smoke).

## Deploy

```bash
cp .env.example .env  # set CF_TUNNEL_NETWORK if not "cloudflare-tunnel"
docker compose up -d --build
```

The container exposes port 3000 on the external `cloudflare-tunnel` network —
no published host port. Point your Cloudflare tunnel at
`http://phillipsben-com:3000`.

## Content

- **Pages** — `app/<route>/page.tsx`. Copy lives in the page files (port from
  `design/reference/`). MDX scaffolding is wired up for project bodies.
- **Projects** — drop a folder under `content/projects/<slug>/` with an
  `index.mdx`. Frontmatter is validated in `lib/content.ts` (Zod). Set
  `featured: true` to surface on the landing page.

## Decisions reference

Locked decisions live in
`nimbalyst-local/plans/grill-me-until-we-adaptive-nova.md`. Ben must rotate the
Cal.com API key that was pasted in chat; the embed widget does not need it.

## Pre-launch checklist

- [ ] Rotate exposed Cal.com API key.
- [ ] Drop `public/og.png` (1200×630) — referenced by `app/layout.tsx`.
- [ ] Confirm `cal.com/bpuhnk/30min` slot exists.
- [ ] Confirm `contact@phillipsben.com` mailbox.
- [ ] Confirm docker network `${CF_TUNNEL_NETWORK}` is attached to the tunnel.

## Out of scope (v2)

Blog, RSS, Mastodon, dark mode, contact form, the seven dropped mockup projects.
