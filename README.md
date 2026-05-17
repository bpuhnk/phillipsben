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

## Analytics

Cloudflare Web Analytics is the chosen provider. Because traffic is already
proxied through Cloudflare Tunnel, server-side metrics work automatically —
enable in the Cloudflare dashboard (Analytics → Web Analytics → Add site) for
`phillipsben.com`. No script tag required. The `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`
env hook in `app/layout.tsx` stays as a dormant opt-in if you ever want to
switch.

## Decisions reference

Phased rollout plan lives in `plans/mobile-plan/` (overview + numbered phase
docs).

## Pre-launch checklist

- [ ] Rotate exposed Cal.com API key.
- [ ] Confirm `cal.com/bpuhnk/30min` slot exists.
- [ ] Confirm `contact@phillipsben.com` mailbox.
- [ ] Confirm docker network `${CF_TUNNEL_NETWORK}` is attached to the tunnel.
- [ ] On server: `git pull && docker compose up -d --build`.
- [ ] Enable Cloudflare Web Analytics for `phillipsben.com`.
- [ ] Smoke-test from a phone on cellular (not LAN-cached).

## Out of scope (v2)

Blog, Mastodon, dark mode, contact form, the seven dropped mockup projects.
(RSS shipped — `/feed.xml`. OG images are generated dynamically per route.)
