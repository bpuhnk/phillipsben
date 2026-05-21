import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import SectionHead from '@/components/section-head';
import { getLatestNow, getNowArchive } from '@/lib/content';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Now',
  description: "A field note on the season — what I'm thinking about, not just shipping. The live status board is /dashboard.",
  path: '/now',
});

export default async function NowPage() {
  const [entry, archive] = await Promise.all([getLatestNow(), getNowArchive()]);
  if (!entry) notFound();
  const fm = entry.frontmatter;
  const updated = fm.updatedLabel.toUpperCase();

  return (
    <>
      <section className="section" style={{ paddingBottom: 56 }}>
        <div className="kicker">§ 01 &nbsp;·&nbsp; NOW · {updated}</div>
        <h1 className="display display-xxl" style={{ marginTop: 24, marginBottom: 28 }}>
          A field note,<br />not a <i>feed.</i>
        </h1>
        <p className="lede" style={{ maxWidth: '48ch' }}>
          A few paragraphs on where my head is this season — the <i>why</i> behind the work.
          For the live, daily version — commits, listening, what&apos;s shipping — see the{' '}
          <Link href="/dashboard">dashboard</Link>.
        </p>
      </section>

      <section className="section now-field-section" style={{ paddingTop: 0 }}>
        <SectionHead title="The note." idx="§ 02" />
        <div className="prose now-field">
          <MDXRemote source={entry.content} />
        </div>
      </section>

      <section className="section muted">
        <SectionHead title="Reading & learning." idx="§ 03" />
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
        <SectionHead title="Not working on." idx="§ 04" />
        <div className="display-m" style={{ color: 'var(--ink-2)', maxWidth: '38ch' }}>
          <MDXRemote source={fm.notWorking} />
        </div>
        <p className="meta" style={{ marginTop: 40 }}>UPDATED {updated} · {fm.timezone.toUpperCase()}</p>
      </section>

      {archive.length > 0 ? (
        <section className="section muted">
          <SectionHead title="Earlier notes." idx="§ 05 · ARCHIVE" />
          <ul className="now-archive">
            {archive.map((e) => (
              <li key={e.slug} className="now-archive-row">
                <Link href={`/now/${e.slug}`}>
                  <span className="meta now-archive-date">{e.frontmatter.updatedLabel}</span>
                  <span className="now-archive-arrow">→</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </>
  );
}
