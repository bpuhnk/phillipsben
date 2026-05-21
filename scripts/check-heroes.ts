#!/usr/bin/env -S npx tsx
// Hero-image invariant guard + reporter.
//
// Runs as part of `prebuild` (after the knowledge pack). FAILS THE BUILD if a
// FEATURED project has no usable heroImage — featured projects appear on the
// home strip and must never fall back to the dashed placeholder. Standard
// projects may have a generated hero, a real photo, or none.
//
// Also runs standalone as a report:  npm run heroes:check
// It lists every project's hero status and, for anything missing/broken, prints
// the exact hero-gen.py + duotone.py commands to produce it (featured -> accent,
// standard -> duo). It does NOT generate anything — generation is an explicit,
// GPU-bound step run by hand, never a side effect of the build.

import fs from 'node:fs';
import path from 'node:path';
import { getAllProjects } from '../lib/content';

const ROOT = process.cwd();
const PUBLIC = path.join(ROOT, 'public');

type Row = { slug: string; featured: boolean; hero?: string; fileOk: boolean };

function fixCommands(slug: string, featured: boolean): string {
  const map = featured ? 'accent' : 'duo';
  return [
    `  # ${slug} (${featured ? 'featured -> accent' : 'standard -> duo'})`,
    `  python3 scripts/comfy/hero-gen.py --slug ${slug} --seed 1 --out scripts/comfy/out/${slug}-raw.png`,
    `  python3 scripts/comfy/duotone.py --in scripts/comfy/out/${slug}-raw.png --map ${map} --out scripts/comfy/out/${slug}-final.png`,
    `  # then: convert to public/images/projects/${slug}.webp and add the heroImage frontmatter`,
  ].join('\n');
}

async function main(): Promise<void> {
  const projects = await getAllProjects();
  const rows: Row[] = projects.map((p) => {
    const fm = p.frontmatter;
    const hero = fm.heroImage?.src;
    const fileOk = hero ? fs.existsSync(path.join(PUBLIC, hero.replace(/^\//, ''))) : false;
    return { slug: fm.slug, featured: fm.featured, hero, fileOk };
  });

  const pad = (s: string, n: number): string => s.padEnd(n);
  console.log(`\nHero images — ${rows.length} projects\n`);
  for (const r of rows) {
    const treat = r.featured ? 'accent' : 'duo';
    const status = r.hero
      ? r.fileOk
        ? 'ok'
        : 'FILE MISSING'
      : r.featured
        ? 'MISSING (featured)'
        : 'none (ok)';
    console.log(`  ${pad(r.slug, 22)} ${pad(r.featured ? 'featured' : 'standard', 9)} ${pad(treat, 7)} ${status}`);
  }

  // Hard violations: a featured project without a usable hero.
  const violations = rows.filter((r) => r.featured && !(r.hero && r.fileOk));
  // Broken references: any project pointing at a hero file that doesn't exist.
  const brokenRefs = rows.filter((r) => !r.featured && r.hero && !r.fileOk);

  if (violations.length || brokenRefs.length) {
    console.log('\nTo fix (run from repo root, then re-run the build):\n');
    for (const r of [...violations, ...brokenRefs]) console.log(fixCommands(r.slug, r.featured) + '\n');
  }

  if (violations.length) {
    console.error(`✗ ${violations.length} featured project(s) without a usable hero image: ${violations.map((r) => r.slug).join(', ')}`);
    console.error('  Featured projects appear on the home strip and must have a hero. See commands above.\n');
    process.exit(1);
  }
  if (brokenRefs.length) {
    console.error(`✗ ${brokenRefs.length} project(s) reference a missing hero file: ${brokenRefs.map((r) => r.slug).join(', ')}\n`);
    process.exit(1);
  }
  console.log('\n✓ every featured project has a hero image; no broken references.\n');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
