import fs from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';
import { type ZodSchema } from 'zod';
import {
  homeFrontmatterSchema,
  bioFrontmatterSchema,
  contactFrontmatterSchema,
  type HomeFrontmatter,
  type BioFrontmatter,
  type ContactFrontmatter,
} from './site-schemas';

const SITE_DIR = path.join(process.cwd(), 'content', 'site');
const DATA_DIR = path.join(process.cwd(), 'content', 'data');

function parseOrThrow<T>(schema: ZodSchema<T>, data: unknown, file: string): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    const issues = result.error.issues
      .map((i) => `  - ${i.path.join('.') || '(root)'}: ${i.message}`)
      .join('\n');
    throw new Error(`Invalid content in ${file}:\n${issues}`);
  }
  return result.data;
}

type CopyMap = {
  home: HomeFrontmatter;
  bio: BioFrontmatter;
  contact: ContactFrontmatter;
};

const copySchemas = {
  home: homeFrontmatterSchema,
  bio: bioFrontmatterSchema,
  contact: contactFrontmatterSchema,
} as const;

export async function getSiteCopy<K extends keyof CopyMap>(
  slug: K,
): Promise<{ frontmatter: CopyMap[K]; content: string }> {
  const file = path.join(SITE_DIR, `${slug}.mdx`);
  const raw = await fs.readFile(file, 'utf8');
  const parsed = matter(raw);
  const fm = parseOrThrow(copySchemas[slug] as unknown as ZodSchema<CopyMap[K]>, parsed.data, file);
  return { frontmatter: fm, content: parsed.content };
}

export async function getSiteData<T>(name: string, schema: ZodSchema<T>): Promise<T> {
  const file = path.join(DATA_DIR, `${name}.json`);
  const raw = await fs.readFile(file, 'utf8');
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch (err) {
    throw new Error(`Invalid JSON in ${file}: ${(err as Error).message}`);
  }
  return parseOrThrow(schema, data, file);
}
