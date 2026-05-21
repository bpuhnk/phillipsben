import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import SectionHead from '@/components/section-head';
import { getAllNow, getNowBySlug } from '@/lib/content';
import { pageMetadata } from '@/lib/seo';

export async function generateStaticParams() {
  const all = await getAllNow();
  return all.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const entry = await getNowBySlug(slug);
  if (!entry) return {};
  return pageMetadata({
    title: `Now — ${entry.frontmatter.updatedLabel}`,
    description: `A field note from ${entry.frontmatter.updatedLabel}.`,
    path: `/now/${slug}`,
  });
}

export default async function NowArchiveEntry({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const entry = await getNowBySlug(slug);
  if (!entry) notFound();
  const fm = entry.frontmatter;
  const updated = fm.updatedLabel.toUpperCase();

  return (
    <>
      <section className="section tight" style={{ paddingTop: 22, paddingBottom: 18 }}>
        <div className="meta">
          <Link href="/now">← NOW</Link>
          &nbsp;/&nbsp;
          <span style={{ color: 'var(--ink)' }}>{updated}</span>
        </div>
      </section>

      <section className="section" style={{ paddingBottom: 56 }}>
        <div className="kicker">§ 01 &nbsp;·&nbsp; FIELD NOTE · {updated}</div>
        <h1 className="display display-xl" style={{ marginTop: 24, marginBottom: 28 }}>
          What I was<br /><i>thinking about.</i>
        </h1>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="prose now-field">
          <MDXRemote source={entry.content} />
        </div>
      </section>

      <section className="section muted">
        <SectionHead title="Was reading." idx="§ 02" />
        <div className="now-reading">
          {fm.reading.map((r) => (
            <div key={`${r.kind}-${r.title}`} className="now-reading-item">
              <div className="meta now-reading-tag">{r.kind}</div>
              <h4 className="now-reading-title">{r.title}</h4>
              <p className="now-reading-note">{r.note}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="display-m" style={{ color: 'var(--ink-2)', maxWidth: '38ch' }}>
          <MDXRemote source={fm.notWorking} />
        </div>
        <p className="meta" style={{ marginTop: 40 }}>FROM {updated} · {fm.timezone.toUpperCase()}</p>
      </section>
    </>
  );
}
