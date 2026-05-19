#!/usr/bin/env -S npx tsx
// Validates a dashboard JSON file against its Zod schema.
// Usage:  npx tsx scripts/dashboard/validate.ts <path-to-dashboard-*.json>
// Exits 0 on success, 1 on failure (with field-level errors on stderr).
//
// Hermes runs this BEFORE git commit. A non-zero exit means do not commit.

import fs from 'node:fs';
import path from 'node:path';
import {
  dashboardClaudeSchema,
  dashboardGithubSchema,
  dashboardNewsSchema,
  dashboardCurrentlySchema,
  dashboardSpotifySchema,
} from '../../lib/site-schemas';

const SCHEMAS = {
  'dashboard-claude': dashboardClaudeSchema,
  'dashboard-github': dashboardGithubSchema,
  'dashboard-news': dashboardNewsSchema,
  'dashboard-currently': dashboardCurrentlySchema,
  'dashboard-spotify': dashboardSpotifySchema,
} as const;

const file = process.argv[2];
if (!file) {
  console.error('Usage: validate.ts <path-to-dashboard-*.json>');
  process.exit(2);
}

const stem = path.basename(file, '.json') as keyof typeof SCHEMAS;
const schema = SCHEMAS[stem];
if (!schema) {
  console.error(`No schema for "${stem}". Expected one of: ${Object.keys(SCHEMAS).join(', ')}`);
  process.exit(2);
}

let raw: string;
try {
  raw = fs.readFileSync(file, 'utf8');
} catch (err) {
  console.error(`Cannot read ${file}: ${(err as Error).message}`);
  process.exit(1);
}

let data: unknown;
try {
  data = JSON.parse(raw);
} catch (err) {
  console.error(`Invalid JSON in ${file}: ${(err as Error).message}`);
  process.exit(1);
}

const result = schema.safeParse(data);
if (!result.success) {
  console.error(`Validation failed for ${file}:`);
  for (const issue of result.error.issues) {
    const where = issue.path.join('.') || '(root)';
    console.error(`  - ${where}: ${issue.message}`);
  }
  process.exit(1);
}

console.log(`OK: ${file}`);
process.exit(0);
