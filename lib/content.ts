import fs from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';
import { z } from 'zod';
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
});

export type ProjectFrontmatter = z.infer<typeof projectFrontmatterSchema>;
export type Project = { frontmatter: ProjectFrontmatter; content: string };

const PROJECTS_DIR = path.join(process.cwd(), 'content', 'projects');

async function readProject(slug: string): Promise<Project | null> {
  const file = path.join(PROJECTS_DIR, slug, 'index.mdx');
  let raw: string;
  try {
    raw = await fs.readFile(file, 'utf8');
  } catch {
    return null;
  }
  const parsed = matter(raw);
  const fm = projectFrontmatterSchema.parse({ ...parsed.data, slug });
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
