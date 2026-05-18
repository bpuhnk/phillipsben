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
  bookSectionTitle: z.string().default('Book a 30-min chat.'),
  bookSectionIdx: z.string().default('§ 02'),
  calLink: z.string().default('bpuhnk/30min'),
  calNamespace: z.string().default('30min'),
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
