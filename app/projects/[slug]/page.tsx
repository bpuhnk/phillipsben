import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import type { ComponentProps, ReactNode } from 'react';
import Chip from '@/components/chip';
import ImagePlaceholder from '@/components/image-placeholder';
import DefList from '@/components/def-list';
import ProjectToc from '@/components/project-toc';
import { getAllProjects, getProjectBySlug, getProjectNeighbors } from '@/lib/content';
import { extractH2, slugify } from '@/lib/toc';
import { pageMetadata } from '@/lib/seo';

export async function generateStaticParams() {
  const all = await getAllProjects();
  return all.map((p) => ({ slug: p.frontmatter.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return {};
  return pageMetadata({
    title: project.frontmatter.title,
    description: project.frontmatter.summary,
    path: `/projects/${slug}`,
  });
}

function flatten(node: ReactNode): string {
  if (node == null || typeof node === 'boolean') return '';
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(flatten).join('');
  if (typeof node === 'object' && 'props' in (node as object)) {
    return flatten((node as { props: { children?: ReactNode } }).props.children);
  }
  return '';
}

const mdxComponents = {
  h2: ({ children, ...props }: ComponentProps<'h2'>) => (
    <h2 id={slugify(flatten(children))} {...props}>
      {children}
    </h2>
  ),
};

export default async function ProjectDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  const { prev, next } = await getProjectNeighbors(slug);

  const fm = project.frontmatter;
  const year = fm.startDate.slice(0, 4);
  const toc = extractH2(project.content);

  return (
    <>
      <section className="section tight" style={{ paddingTop: 22, paddingBottom: 18 }}>
        <div className="meta">
          <Link href="/projects">← PROJECTS</Link>
          &nbsp;/&nbsp;
          <span style={{ color: 'var(--ink)' }}>{fm.title.toUpperCase()}</span>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 16 }}>
        <div className="project-hero">
          <div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 28, flexWrap: 'wrap' }}>
              <Chip pulse={fm.status === 'active'}>{fm.status.toUpperCase()}</Chip>
              <Chip>{year}</Chip>
              {fm.role ? <Chip>{fm.role.split('—')[0].trim()}</Chip> : null}
            </div>
            <h1 className="display display-xl" style={{ marginBottom: 28 }}>
              {fm.title}
            </h1>
            <p className="lede" style={{ maxWidth: '40ch' }}>{fm.summary}</p>
          </div>
          <div>
            <DefList
              narrow
              className="project-meta-dl"
              rows={[
                ...(fm.role ? [{ dt: 'Role', dd: fm.role }] : []),
                { dt: 'Stack', dd: fm.techStack.join(', ') },
                { dt: 'Status', dd: <span style={{ color: 'var(--accent)' }}>{fm.status}</span> },
                ...(fm.links?.github
                  ? [{ dt: 'Source', dd: <a href={fm.links.github} target="_blank" rel="noreferrer">GitHub ↗</a> }]
                  : []),
                ...(fm.links?.site
                  ? [{ dt: 'Site', dd: <a href={fm.links.site} target="_blank" rel="noreferrer">{fm.links.site} ↗</a> }]
                  : []),
              ]}
            />
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 24, paddingBottom: 32 }}>
        <ImagePlaceholder label={`Hero — ${fm.title} · 16:9 photograph`} height={520} className="project-hero-img" />
        <div className="meta" style={{ marginTop: 12 }}>FIG. 01 — {year}.</div>
      </section>

      <ProjectToc items={toc} variant="dock" />

      <section className="section" style={{ paddingTop: 32 }}>
        <div className="project-body">
          <ProjectToc items={toc} variant="aside" />
          <article className="prose">
            <MDXRemote source={project.content} components={mdxComponents} />
          </article>
        </div>
      </section>

      {(prev || next) && (
        <section className="section muted">
          <div className="proj-nav">
            {prev ? (
              <Link href={`/projects/${prev.frontmatter.slug}`} className="proj-nav-prev">
                <div className="meta proj-nav-label">← PREVIOUS</div>
                <h4 className="proj-nav-title">{prev.frontmatter.title}</h4>
                <p className="proj-nav-desc">{prev.frontmatter.summary}</p>
              </Link>
            ) : <span />}
            {next ? (
              <Link href={`/projects/${next.frontmatter.slug}`} className="proj-nav-next">
                <div className="meta proj-nav-label">NEXT →</div>
                <h4 className="proj-nav-title">{next.frontmatter.title}</h4>
                <p className="proj-nav-desc">{next.frontmatter.summary}</p>
              </Link>
            ) : <span />}
          </div>
        </section>
      )}
    </>
  );
}
