import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import Chip from '@/components/chip';
import ImagePlaceholder from '@/components/image-placeholder';
import DefList from '@/components/def-list';
import { getAllProjects, getProjectBySlug } from '@/lib/content';

export async function generateStaticParams() {
  const all = await getAllProjects();
  return all.map((p) => ({ slug: p.frontmatter.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return {};
  return {
    title: project.frontmatter.title,
    description: project.frontmatter.summary,
    alternates: { canonical: `/projects/${slug}` },
  };
}

export default async function ProjectDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  const all = await getAllProjects();
  const idx = all.findIndex((p) => p.frontmatter.slug === slug);
  const prev = idx > 0 ? all[idx - 1] : null;
  const next = idx >= 0 && idx < all.length - 1 ? all[idx + 1] : null;

  const fm = project.frontmatter;
  const year = fm.startDate.slice(0, 4);

  return (
    <>
      <section className="section tight" style={{ paddingTop: 22, paddingBottom: 18 }}>
        <div className="meta">
          <Link href="/projects">PROJECTS</Link>
          &nbsp;/&nbsp;
          <span style={{ color: 'var(--ink)' }}>{fm.title.toUpperCase()}</span>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 16 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 64 }}>
          <div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 28, flexWrap: 'wrap' }}>
              <Chip pulse={fm.status === 'active'}>{fm.status.toUpperCase()}</Chip>
              <Chip>{year}</Chip>
              {fm.role ? <Chip>{fm.role.split('—')[0].trim()}</Chip> : null}
            </div>
            <h1 className="display" style={{ fontSize: 96, marginBottom: 28 }}>
              {fm.title}
            </h1>
            <p className="lede" style={{ maxWidth: '40ch' }}>{fm.summary}</p>
          </div>
          <div>
            <DefList
              narrow
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
        <ImagePlaceholder label={`Hero — ${fm.title} · 16:9 photograph`} height={520} />
        <div className="meta" style={{ marginTop: 12 }}>FIG. 01 — {year}.</div>
      </section>

      <section className="section" style={{ paddingTop: 32 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr', gap: 48 }}>
          <aside style={{ position: 'sticky', top: 24, alignSelf: 'start' }}>
            <div className="meta" style={{ marginBottom: 16 }}>CONTENTS</div>
            <p className="meta" style={{ color: 'var(--ink-2)' }}>
              Status: <span style={{ color: 'var(--accent)' }}>{fm.status}</span>
            </p>
          </aside>
          <article className="prose">
            <MDXRemote source={project.content} />
          </article>
        </div>
      </section>

      {(prev || next) && (
        <section className="section muted">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
            {prev ? (
              <Link href={`/projects/${prev.frontmatter.slug}`}>
                <div className="meta" style={{ marginBottom: 8 }}>← PREVIOUS</div>
                <h4 style={{ fontFamily: 'var(--font-display)', fontSize: 32 }}>{prev.frontmatter.title}</h4>
                <p style={{ fontSize: 13, color: 'var(--ink-2)', marginTop: 6 }}>{prev.frontmatter.summary}</p>
              </Link>
            ) : <span />}
            {next ? (
              <Link href={`/projects/${next.frontmatter.slug}`} style={{ textAlign: 'right' }}>
                <div className="meta" style={{ marginBottom: 8 }}>NEXT →</div>
                <h4 style={{ fontFamily: 'var(--font-display)', fontSize: 32 }}>{next.frontmatter.title}</h4>
                <p style={{ fontSize: 13, color: 'var(--ink-2)', marginTop: 6 }}>{next.frontmatter.summary}</p>
              </Link>
            ) : <span />}
          </div>
        </section>
      )}
    </>
  );
}
