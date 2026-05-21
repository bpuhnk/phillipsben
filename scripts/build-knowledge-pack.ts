#!/usr/bin/env -S npx tsx
// Assembles the career-assistant knowledge pack from the site's OWN published
// content (projects, bio, résumé, /now) plus the hand-written assistant doc,
// runs a redaction guard, and emits lib/assistant/knowledge-pack.generated.ts.
//
// Usage:  npx tsx scripts/build-knowledge-pack.ts
// Runs automatically as the `prebuild` step. Exits non-zero (failing the build)
// if a forbidden employer string ever leaks into the pack.
//
// See plans/personal-assistant/01-knowledge-pack.md.

import fs from 'node:fs';
import path from 'node:path';
import { getAllProjects, getLatestNow } from '../lib/content';
import { getSiteCopy, getSiteData } from '../lib/site-content';
import {
  bioCareerSchema,
  bioSkillsSchema,
  resumeSchema,
} from '../lib/site-schemas';

const ROOT = process.cwd();
const KNOWLEDGE_DOC = path.join(ROOT, 'content', 'assistant', 'knowledge.md');
const OUT_FILE = path.join(ROOT, 'lib', 'assistant', 'knowledge-pack.generated.ts');

// ── Redaction guard ──────────────────────────────────────────────
// The generic word "transaxle" is PUBLIC (Ben's résumé says "Tier-1 transaxle
// supplier") and must NOT trip the guard. Only the employer's full company name
// and its standalone acronym are forbidden. Those identifiers are kept OUT of
// this public source: each token is stored base64-encoded and the patterns are
// rebuilt in memory at build time, so the plaintext never appears in the repo.
// The acronym is matched word-bounded and case-sensitive so it can't false-
// positive on ordinary words that merely contain those three letters.
const dec = (b64: string): string => Buffer.from(b64, 'base64').toString('utf8');
const [T_AXLE, MFG, OF, AMERICA, ACRONYM] = [
  'dHJhbnNheGxl',
  'bWFudWZhY3R1cmluZw==',
  'b2Y=',
  'YW1lcmljYQ==',
  'VE1B',
].map(dec);
const FORBIDDEN: { label: string; re: RegExp }[] = [
  {
    label: 'employer full name',
    re: new RegExp(`${T_AXLE}\\s+${MFG}(?:\\s+${OF}\\s+${AMERICA})?`, 'i'),
  },
  { label: 'employer acronym', re: new RegExp(`\\b${ACRONYM}\\b`) },
];

function assertClean(pack: string): void {
  const hits: string[] = [];
  for (const { label, re } of FORBIDDEN) {
    const m = pack.match(re);
    if (m) {
      const at = pack.indexOf(m[0]);
      const snippet = pack.slice(Math.max(0, at - 40), at + m[0].length + 40).replace(/\s+/g, ' ');
      hits.push(`  - ${label}: matched "${m[0]}" near …${snippet}…`);
    }
  }
  if (hits.length) {
    console.error('[knowledge-pack] REDACTION GUARD FAILED — forbidden employer reference in the pack:');
    console.error(hits.join('\n'));
    console.error('Refer to the employer generically (e.g. "a Tier-1 transaxle supplier"). Build aborted.');
    process.exit(1);
  }
}

function stripComments(md: string): string {
  return md.replace(/<!--[\s\S]*?-->/g, '').trim();
}

async function buildPack(): Promise<string> {
  const [projects, bio, career, skills, resume, now] = await Promise.all([
    getAllProjects(),
    getSiteCopy('bio'),
    getSiteData('bio-career', bioCareerSchema),
    getSiteData('bio-skills', bioSkillsSchema),
    getSiteData('resume', resumeSchema),
    getLatestNow(),
  ]);

  const knowledge = stripComments(fs.readFileSync(KNOWLEDGE_DOC, 'utf8'));

  const parts: string[] = [];

  parts.push('# KNOWLEDGE PACK — Ben Phillips');
  parts.push(
    'Everything below is the published content of phillipsben.com. Answer only from it.',
  );

  parts.push('\n---\n## Narrative\n');
  parts.push(knowledge);

  parts.push('\n---\n## Bio\n');
  parts.push(bio.frontmatter.lede.trim());
  parts.push(`\nQuick facts: ${bio.frontmatter.quickFacts.join('; ')}`);
  parts.push(`\nOff the clock: ${bio.frontmatter.familyCopy.trim()}`);

  parts.push('\n---\n## Career timeline\n');
  for (const c of career) {
    parts.push(`### ${c.h} — ${c.y}\n${c.s}\n${c.p}`);
  }

  parts.push('\n---\n## Skills\n');
  for (const s of skills) {
    parts.push(`### ${s.t}\n${s.d}\nTech: ${s.tags.join(', ')}`);
  }

  parts.push('\n---\n## Résumé\n');
  parts.push(`${resume.header.name} — ${resume.header.title}`);
  parts.push(`Summary: ${resume.summary}`);
  parts.push('Experience:');
  for (const e of resume.experience) {
    parts.push(`- ${e.h} (${e.y}), ${e.s}: ${e.p}`);
  }
  parts.push('Skills:');
  for (const s of resume.skills) {
    parts.push(`- ${s.label}: ${s.body}`);
  }
  parts.push('Selected projects:');
  for (const p of resume.selectedProjects) {
    parts.push(`- ${p.name} — ${p.desc}`);
  }

  parts.push('\n---\n## Projects\n');
  for (const p of projects) {
    const fm = p.frontmatter;
    parts.push(`### ${fm.title} (${fm.status}) — /projects/${fm.slug}/`);
    parts.push(fm.summary.trim());
    if (fm.role) parts.push(`Role: ${fm.role}`);
    if (fm.techStack.length) parts.push(`Tech: ${fm.techStack.join(', ')}`);
    parts.push(p.content.trim());
  }

  if (now) {
    parts.push('\n---\n## Currently (from /now)\n');
    parts.push(`As of ${now.frontmatter.updatedLabel}:`);
    for (const w of now.frontmatter.working) {
      parts.push(`- ${w.title}: ${w.body}`);
    }
    parts.push(`Not working on: ${now.frontmatter.notWorking.trim()}`);
  }

  return parts.join('\n');
}

async function main() {
  const pack = await buildPack();
  assertClean(pack);

  const banner =
    '// AUTO-GENERATED by scripts/build-knowledge-pack.ts — do not edit by hand.\n' +
    '// Regenerated on each build (prebuild). Edit the source content instead.\n';
  const body =
    `${banner}\nexport const KNOWLEDGE_PACK = ${JSON.stringify(pack)};\n\n` +
    `export const KNOWLEDGE_PACK_BUILT_AT = ${JSON.stringify(new Date().toISOString())};\n`;

  fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true });
  fs.writeFileSync(OUT_FILE, body, 'utf8');

  console.log(
    `[knowledge-pack] OK — ${pack.length} chars (~${Math.round(pack.length / 4)} tokens) → ${path.relative(ROOT, OUT_FILE)}`,
  );
}

main().catch((err) => {
  console.error('[knowledge-pack] build failed:', err);
  process.exit(1);
});
