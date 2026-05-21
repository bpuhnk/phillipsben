import fs from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';
import { z, type ZodSchema } from 'zod';

export const projectFrontmatterSchema = z.object({
  title: z.string(),
  slug: z.string(),
  summary: z.string(),
  status: z.enum(['active', 'shipped', 'archived']),
  techStack: z.array(z.string()).default([]),
  role: z.string().optional(),
  startDate: z.string(),
  endDate: z.string().optional(),
  featured: z.boolean().default(false),
  links: z
    .object({
      github: z.string().url().optional(),
      site: z.string().url().optional(),
    })
    .optional(),
  cover: z.string().optional(),
  heroImage: z
    .object({
      src: z.string(),
      alt: z.string(),
    })
    .optional(),
});

export type ProjectFrontmatter = z.infer<typeof projectFrontmatterSchema>;
export type Project = { frontmatter: ProjectFrontmatter; content: string };

const PROJECTS_DIR = path.join(process.cwd(), 'content', 'projects');
const NOW_DIR = path.join(process.cwd(), 'content', 'now');

function parseOrThrow<T>(schema: ZodSchema<T>, data: unknown, file: string): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    const issues = result.error.issues
      .map((i) => `  - ${i.path.join('.') || '(root)'}: ${i.message}`)
      .join('\n');
    throw new Error(`Invalid front-matter in ${file}:\n${issues}`);
  }
  return result.data;
}

async function readProject(slug: string): Promise<Project | null> {
  const file = path.join(PROJECTS_DIR, slug, 'index.mdx');
  let raw: string;
  try {
    raw = await fs.readFile(file, 'utf8');
  } catch {
    return null;
  }
  const parsed = matter(raw);
  const fm = parseOrThrow(projectFrontmatterSchema, { ...parsed.data, slug }, file);
  return { frontmatter: fm, content: parsed.content };
}

export async function getAllProjects(): Promise<Project[]> {
  const entries = await fs.readdir(PROJECTS_DIR, { withFileTypes: true });
  const slugs = entries.filter((e) => e.isDirectory()).map((e) => e.name);
  const projects = await Promise.all(slugs.map((s) => readProject(s)));
  return projects
    .filter((p): p is Project => p !== null)
    .sort((a, b) => (a.frontmatter.startDate < b.frontmatter.startDate ? 1 : -1));
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  return readProject(slug);
}

export async function getFeaturedProjects(limit = 3): Promise<Project[]> {
  const all = await getAllProjects();
  const featured = all.filter((p) => p.frontmatter.featured);
  return (featured.length ? featured : all).slice(0, limit);
}

export async function getProjectNeighbors(
  slug: string,
): Promise<{ prev: Project | null; next: Project | null }> {
  const all = await getAllProjects();
  const idx = all.findIndex((p) => p.frontmatter.slug === slug);
  if (idx === -1) return { prev: null, next: null };
  return {
    prev: idx > 0 ? all[idx - 1] : null,
    next: idx < all.length - 1 ? all[idx + 1] : null,
  };
}

const nowReadingSchema = z.object({
  kind: z.string(),
  title: z.string(),
  note: z.string(),
});

// The long-form "field note" is the markdown body of each entry (NowEntry.content).
// The dashboard owns live status; /now is the reflective counterpart.
export const nowFrontmatterSchema = z.object({
  date: z.coerce.date(),
  updatedLabel: z.string(),
  timezone: z.string().default('America/Chicago'),
  reading: z.array(nowReadingSchema).default([]),
  notWorking: z.string(),
});

export type NowFrontmatter = z.infer<typeof nowFrontmatterSchema>;
export type NowEntry = { slug: string; frontmatter: NowFrontmatter; content: string };

async function readNow(filename: string): Promise<NowEntry | null> {
  const file = path.join(NOW_DIR, filename);
  let raw: string;
  try {
    raw = await fs.readFile(file, 'utf8');
  } catch {
    return null;
  }
  const parsed = matter(raw);
  const fm = parseOrThrow(nowFrontmatterSchema, parsed.data, file);
  return { slug: filename.replace(/\.mdx?$/, ''), frontmatter: fm, content: parsed.content };
}

export async function getAllNow(): Promise<NowEntry[]> {
  let files: string[];
  try {
    files = await fs.readdir(NOW_DIR);
  } catch {
    return [];
  }
  const md = files.filter((f) => /\.mdx?$/.test(f));
  const entries = await Promise.all(md.map((f) => readNow(f)));
  return entries
    .filter((e): e is NowEntry => e !== null)
    .sort((a, b) => b.frontmatter.date.getTime() - a.frontmatter.date.getTime());
}

export async function getLatestNow(): Promise<NowEntry | null> {
  const all = await getAllNow();
  return all[0] ?? null;
}

export async function getNowArchive(): Promise<NowEntry[]> {
  const all = await getAllNow();
  return all.slice(1);
}

export async function getNowBySlug(slug: string): Promise<NowEntry | null> {
  const all = await getAllNow();
  return all.find((e) => e.slug === slug) ?? null;
}
