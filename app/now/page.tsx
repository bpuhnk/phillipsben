import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import SectionHead from '@/components/section-head';
import DefList from '@/components/def-list';
import { getLatestNow } from '@/lib/content';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Now',
  description: "What I'm actually doing this month. A snapshot, not a feed.",
  path: '/now',
});

export default async function NowPage() {
  const entry = await getLatestNow();
  if (!entry) notFound();
  const fm = entry.frontmatter;
  const updated = fm.updatedLabel.toUpperCase();

  return (
    <>
      <section className="section" style={{ paddingBottom: 56 }}>
        <div className="kicker">§ 01 &nbsp;·&nbsp; NOW · UPDATED {updated}</div>
        <h1 className="display display-xxl" style={{ marginTop: 24, marginBottom: 28 }}>
          What I'm <i>actually</i><br />doing this month.
        </h1>
        <p className="lede" style={{ maxWidth: '46ch' }}>
          A snapshot, not a feed. If you're reading this and the date's gone stale, give me a nudge.
        </p>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <SectionHead title="Working on." idx="§ 02" />
        <DefList
          rows={fm.working.map((item) => ({
            dt: item.kind,
            dd: (
              <>
                <h5>{item.title}</h5>
                <p>{item.body}</p>
                {item.meta ? <div className="item-meta">{item.meta}</div> : null}
              </>
            ),
          }))}
        />
      </section>

      <section className="section muted">
        <SectionHead title="Reading & learning." idx="§ 03" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32 }}>
          {fm.reading.map((r) => (
            <div key={`${r.kind}-${r.title}`} style={{ borderTop: '1px solid var(--rule)', paddingTop: 16 }}>
              <div className="meta" style={{ marginBottom: 10 }}>{r.kind}</div>
              <h4 style={{ fontFamily: 'var(--font-display)', fontSize: 24, lineHeight: 1.15, marginBottom: 6 }}>{r.title}</h4>
              <p style={{ fontSize: 13, color: 'var(--ink-2)' }}>{r.note}</p>
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
    </>
  );
}
