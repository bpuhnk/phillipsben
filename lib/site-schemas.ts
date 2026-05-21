import { z } from 'zod';

// MDX frontmatter schemas — body is a prose block rendered via <MDXRemote />.
// Small inline-format fields accept literal <i> and <br> HTML tags.

const currentlyItem = z.object({
  title: z.string(),
  meta: z.string(),
});

export const homeFrontmatterSchema = z.object({
  kicker: z.string(),
  headline: z.string(),
  tagline: z.string(),
  currentlyLabel: z.string().default('CURRENTLY'),
  currently: z.array(currentlyItem).default([]),
  recentTitle: z.string().default('Recent work.'),
  recentMoreLabel: z.string().default('All projects →'),
  philosophyKicker: z.string(),
  philosophyReadMoreLabel: z.string(),
  philosophyReadMoreHref: z.string(),
  philosophyQuote: z.string(),
  whatsHereTitle: z.string().default("What's on the site."),
  whatsHereIdx: z.string().default('§ 01 / GUIDE'),
});

export const bioFrontmatterSchema = z.object({
  kicker: z.string(),
  headline: z.string(),
  lede: z.string(),
  quickFactsLabel: z.string().default('QUICK FACTS'),
  quickFacts: z.array(z.string()).default([]),
  heroImage: z.object({
    src: z.string(),
    alt: z.string(),
    caption: z.string(),
    width: z.number().default(440),
    height: z.number().default(880),
  }),
  stats: z
    .array(z.object({ num: z.string(), lbl: z.string() }))
    .default([]),
  timelineTitle: z.string().default('Career, year by year.'),
  timelineIdx: z.string().default('§ 02 / TIMELINE'),
  skillsTitle: z.string().default("What I'm good at."),
  skillsIdx: z.string().default('§ 03 / SKILLS'),
  familyKicker: z.string(),
  familyHead: z.string(),
  familyCopy: z.string(),
  ctaDownloadLabel: z.string().default('Download résumé (PDF)'),
  ctaNowLabel: z.string().default('Read /now →'),
});

export const contactFrontmatterSchema = z.object({
  kicker: z.string(),
  headline: z.string(),
  lede: z.string(),
  bookSectionTitle: z.string().default('Book a 15-min chat.'),
  bookSectionIdx: z.string().default('§ 02'),
  calLink: z.string().default('bpuhnk/15min'),
  calNamespace: z.string().default('15min'),
  elsewhereTitle: z.string().default('Elsewhere.'),
  elsewhereIdx: z.string().default('§ 03'),
  honestKicker: z.string(),
  honestNotes: z.array(z.string()).default([]),
});

// JSON schemas

export const homeTechStripSchema = z.array(z.string());

export const homeCardsSchema = z.array(
  z.object({
    n: z.string(),
    t: z.string(),
    d: z.string(),
    href: z.string(),
  }),
);

export const bioCareerSchema = z.array(
  z.object({
    y: z.string(),
    h: z.string(),
    s: z.string(),
    p: z.string(),
  }),
);

export const bioSkillsSchema = z.array(
  z.object({
    t: z.string(),
    d: z.string(),
    tags: z.array(z.string()).default([]),
  }),
);

export const contactTilesSchema = z.array(
  z.object({
    kicker: z.string(),
    headline: z.string(),
    body: z.string(),
    href: z.string(),
    variant: z.enum(['light', 'dark']).default('light'),
    download: z.boolean().default(false),
  }),
);

export const resumeSchema = z.object({
  header: z.object({
    name: z.string(),
    title: z.string(),
    contact: z.string(),
  }),
  summary: z.string(),
  experience: z.array(
    z.object({ y: z.string(), h: z.string(), s: z.string(), p: z.string() }),
  ),
  skills: z.array(z.object({ label: z.string(), body: z.string() })),
  selectedProjects: z.array(z.object({ name: z.string(), desc: z.string() })),
});

export const assistantSchema = z.object({
  band: z.object({
    kicker: z.string(),
    headline: z.string(),
    placeholder: z.string(),
    suggestedQuestions: z.array(z.string()).min(1),
  }),
  systemPrompt: z.string(),
  disclaimer: z.string(),
  refusal: z.string(),
  turnCap: z.number().int().positive().default(5),
});

export const contactElsewhereSchema = z.array(
  z.object({
    kicker: z.string(),
    value: z.string(),
    desc: z.string(),
    href: z.string(),
  }),
);

export const footerSchema = z.object({
  brand: z.string(),
  tagline: z.string(),
  sections: z.array(
    z.object({
      heading: z.string(),
      links: z.array(
        z.object({
          label: z.string(),
          href: z.string(),
          external: z.boolean().default(false),
          download: z.boolean().default(false),
        }),
      ),
    }),
  ),
  copyright: z.string(),
  colophon: z.string(),
});

export const navSchema = z.object({
  brand: z.string(),
  brandSuffix: z.string(),
  ctaLabel: z.string(),
  ctaHref: z.string(),
});

// ── Dashboard ────────────────────────────────────────────────
// Five JSON payloads, all Hermes-owned except dashboard-currently
// (manual via /admin).

export const dashboardFrontmatterSchema = z.object({
  kicker: z.string(),
  headline: z.string(),
  lede: z.string(),
});

const isoDateTime = z.string().datetime({ offset: true });

export const dashboardClaudeSchema = z.object({
  updatedAt: isoDateTime,
  summary: z.string(),
  highlights: z
    .array(z.object({ repo: z.string(), oneLiner: z.string() }))
    .default([]),
});

export const dashboardGithubSchema = z.object({
  updatedAt: isoDateTime,
  weekStart: z.string(),
  totals: z.object({
    commits: z.number().int().nonnegative(),
    prs: z.number().int().nonnegative(),
    repos: z.number().int().nonnegative(),
    activeDays: z.number().int().nonnegative(),
  }),
  repos: z
    .array(
      z.object({
        name: z.string(),
        url: z.string().url(),
        commits: z.number().int().nonnegative(),
        summary: z.string(),
      }),
    )
    .default([]),
});

export const dashboardNewsSchema = z.object({
  updatedAt: isoDateTime,
  items: z
    .array(
      z.object({
        title: z.string(),
        url: z.string().url(),
        source: z.string(),
        points: z.number().int().nonnegative().default(0),
        whyItMatters: z.string(),
      }),
    )
    .max(5),
});

export const dashboardCurrentlySchema = z.object({
  updatedAt: isoDateTime,
  focus: z.string(),
  reading: z.object({
    title: z.string(),
    author: z.string(),
    url: z.string().url().nullable().default(null),
    coverUrl: z.string().url().nullable().default(null),
  }),
});

const spotifyTrackBase = {
  track: z.string(),
  artist: z.string(),
  albumArt: z.string().url().nullable().default(null),
  url: z.string().url(),
};

export const dashboardSpotifySchema = z.object({
  updatedAt: isoDateTime,
  nowPlaying: z.object(spotifyTrackBase).nullable().default(null),
  recent: z
    .array(z.object({ ...spotifyTrackBase, playedAt: isoDateTime }))
    .default([]),
});

// Phase 3 — Hermes-only input file. Owned by Ben (via /admin), read by
// Hermes during the daily redaction step. Not loaded by the dashboard page.
export const dashboardConfigSchema = z.object({
  claudeTopicsAllowlist: z.array(z.string()).default([]),
  claudeRedactionRules: z.array(z.string()).default([]),
});

export type DashboardFrontmatter = z.infer<typeof dashboardFrontmatterSchema>;
export type DashboardClaude = z.infer<typeof dashboardClaudeSchema>;
export type DashboardGithub = z.infer<typeof dashboardGithubSchema>;
export type DashboardNews = z.infer<typeof dashboardNewsSchema>;
export type DashboardCurrently = z.infer<typeof dashboardCurrentlySchema>;
export type DashboardSpotify = z.infer<typeof dashboardSpotifySchema>;
export type DashboardConfig = z.infer<typeof dashboardConfigSchema>;

export type HomeFrontmatter = z.infer<typeof homeFrontmatterSchema>;
export type BioFrontmatter = z.infer<typeof bioFrontmatterSchema>;
export type ContactFrontmatter = z.infer<typeof contactFrontmatterSchema>;
export type FooterData = z.infer<typeof footerSchema>;
export type NavData = z.infer<typeof navSchema>;
export type HomeCards = z.infer<typeof homeCardsSchema>;
export type BioCareer = z.infer<typeof bioCareerSchema>;
export type BioSkills = z.infer<typeof bioSkillsSchema>;
export type ContactTiles = z.infer<typeof contactTilesSchema>;
export type ContactElsewhere = z.infer<typeof contactElsewhereSchema>;
export type Resume = z.infer<typeof resumeSchema>;
export type Assistant = z.infer<typeof assistantSchema>;
