import type { Metadata } from 'next';
import { MDXRemote } from 'next-mdx-remote/rsc';
import SectionHead from '@/components/section-head';
import Stats from '@/components/stats';
import Chip from '@/components/chip';
import LastUpdated from '@/components/dashboard/last-updated';
import NowPlayingTile from '@/components/dashboard/now-playing-tile';
import { getSiteCopy, getDashboardData } from '@/lib/site-content';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Dashboard',
  description: 'A live update on work and life — refreshed daily by Hermes-Agent.',
  path: '/dashboard',
});

export default async function DashboardPage() {
  const [copy, data] = await Promise.all([
    getSiteCopy('dashboard'),
    getDashboardData(),
  ]);
  const fm = copy.frontmatter;
  const { claude, github, news, currently, spotify, lastUpdated } = data;

  return (
    <>
      {/* HERO */}
      <section className="section" style={{ paddingBottom: 56 }}>
        <div className="kicker" dangerouslySetInnerHTML={{ __html: fm.kicker }} />
        <h1
          className="display display-xxl"
          style={{ marginTop: 24, marginBottom: 28 }}
          dangerouslySetInnerHTML={{ __html: fm.headline }}
        />
        <p
          className="lede"
          style={{ maxWidth: '46ch' }}
          dangerouslySetInnerHTML={{ __html: fm.lede }}
        />
      </section>

      {/* CURRENTLY · READING · LISTENING */}
      <section className="section muted dashboard-currently-grid" style={{ paddingTop: 56, paddingBottom: 56 }}>
        <div>
          <div className="meta">CURRENTLY</div>
          <p style={{ marginTop: 12, fontFamily: 'var(--font-display)', fontSize: 22, lineHeight: 1.3 }}>
            {currently.focus}
          </p>
        </div>
        <div>
          <div className="meta">READING</div>
          <div
            style={{
              marginTop: 12,
              fontFamily: 'var(--font-display)',
              fontSize: 22,
              lineHeight: 1.15,
            }}
          >
            {currently.reading.url ? (
              <a href={currently.reading.url}>{currently.reading.title}</a>
            ) : (
              currently.reading.title
            )}
          </div>
          <div className="meta" style={{ marginTop: 4 }}>{currently.reading.author}</div>
        </div>
        <NowPlayingTile spotify={spotify} />
      </section>

      {/* SHIPPING STATS */}
      <section className="section" style={{ paddingTop: 56, paddingBottom: 56 }}>
        <SectionHead title="Shipping this week." idx="§ 01 · GITHUB" />
        <Stats
          items={[
            { num: github.totals.commits, lbl: 'COMMITS' },
            { num: github.totals.prs, lbl: 'PRS' },
            { num: github.totals.repos, lbl: 'REPOS TOUCHED' },
            { num: github.totals.activeDays, lbl: 'ACTIVE DAYS' },
          ]}
        />
      </section>

      {/* GITHUB REPOS */}
      <section className="section muted" style={{ paddingTop: 56, paddingBottom: 56 }}>
        <SectionHead title="Where the commits went." idx="§ 02 · BY REPO" />
        <div className="dashboard-repo-grid">
          {github.repos.map((r) => (
            <a key={r.name} href={r.url} className="dashboard-repo-card">
              <div className="meta">{r.commits} COMMITS</div>
              <h3
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 24,
                  lineHeight: 1.1,
                  marginTop: 8,
                  marginBottom: 10,
                }}
              >
                {r.name.split('/').pop()}
              </h3>
              <p style={{ color: 'var(--ink-2)' }}>{r.summary}</p>
            </a>
          ))}
        </div>
      </section>

      {/* CLAUDE WORK */}
      <section className="section" style={{ paddingTop: 56, paddingBottom: 56 }}>
        <SectionHead title="Recent Claude work." idx="§ 03 · SUMMARIZED" />
        <div className="prose" style={{ marginTop: 24, maxWidth: '64ch' }}>
          <MDXRemote source={claude.summary} />
        </div>
        {claude.highlights.length > 0 ? (
          <ul
            style={{
              listStyle: 'none',
              padding: 0,
              marginTop: 32,
              borderTop: '1px solid var(--rule)',
            }}
          >
            {claude.highlights.map((h, i) => (
              <li
                key={i}
                style={{
                  borderBottom: '1px solid var(--rule)',
                  padding: '16px 0',
                  display: 'grid',
                  gridTemplateColumns: '220px 1fr',
                  gap: 36,
                }}
              >
                <div className="meta">{h.repo}</div>
                <div style={{ color: 'var(--ink-2)' }}>{h.oneLiner}</div>
              </li>
            ))}
          </ul>
        ) : null}
      </section>

      {/* AI NEWS */}
      <section className="section muted" style={{ paddingTop: 56, paddingBottom: 56 }}>
        <SectionHead title="In the feeds." idx="§ 04 · AI NEWS" />
        <ol className="dashboard-news-list">
          {news.items.map((n, i) => (
            <li key={n.url} className="dashboard-news-item">
              <div className="dashboard-news-num">{String(i + 1).padStart(2, '0')}</div>
              <div>
                <a
                  href={n.url}
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 22,
                    lineHeight: 1.2,
                    display: 'block',
                  }}
                >
                  {n.title}
                </a>
                <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
                  <Chip>{n.source}</Chip>
                  {n.points > 0 ? <Chip>{n.points} pts</Chip> : null}
                </div>
                <p style={{ marginTop: 10, color: 'var(--ink-2)' }}>{n.whyItMatters}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <LastUpdated iso={lastUpdated} />
      </section>
    </>
  );
}
