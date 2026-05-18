import type { Metadata } from 'next';
import Link from 'next/link';
import SectionHead from '@/components/section-head';
import ProjectCard from '@/components/project-card';
import { getFeaturedProjects } from '@/lib/content';
import { getSiteCopy, getSiteData } from '@/lib/site-content';
import { homeTechStripSchema, homeCardsSchema } from '@/lib/site-schemas';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Ben Phillips — Engineer',
  description: 'Software for things that actually have to work.',
  path: '/',
});

export default async function Landing() {
  const [featured, copy, techStrip, cards] = await Promise.all([
    getFeaturedProjects(3),
    getSiteCopy('home'),
    getSiteData('home-tech-strip', homeTechStripSchema),
    getSiteData('home-cards', homeCardsSchema),
  ]);
  const fm = copy.frontmatter;

  return (
    <>
      {/* HERO — variant A */}
      <section className="section" style={{ paddingTop: 88, paddingBottom: 56 }}>
        <div className="landing-hero">
          <div>
            <div className="kicker" dangerouslySetInnerHTML={{ __html: fm.kicker }} />
            <h1
              className="display display-xxl"
              style={{ marginTop: 24, marginBottom: 28 }}
              dangerouslySetInnerHTML={{ __html: fm.headline }}
            />
            <p
              className="lede"
              style={{ maxWidth: '38ch' }}
              dangerouslySetInnerHTML={{ __html: fm.tagline }}
            />
          </div>
          <div className="landing-currently">
            <div className="meta">{fm.currentlyLabel}</div>
            {fm.currently.map((c, i) => (
              <div key={i} style={{ borderTop: '1px solid var(--rule)', paddingTop: 16 }}>
                <div
                  style={{ fontFamily: 'var(--font-display)', fontSize: 22, lineHeight: 1.15, marginBottom: 6 }}
                  dangerouslySetInnerHTML={{ __html: c.title }}
                />
                <div className="meta">{c.meta}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* tech strip */}
      <section className="section tight landing-tech-strip-section">
        <div className="tech-strip">
          {techStrip.map((s) => <span key={s}>{s}</span>)}
        </div>
      </section>

      {/* WHAT'S HERE */}
      <section className="section">
        <SectionHead title={fm.whatsHereTitle} idx={fm.whatsHereIdx} />
        <div className="landing-whats-here">
          {cards.map((c) => (
            <Link href={c.href} key={c.n} className="landing-whats-here-item">
              <div className="meta wh-kicker">{c.n}</div>
              <h3 className="wh-title">{c.t} →</h3>
              <p className="wh-desc">{c.d}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* RECENT */}
      <section className="section muted">
        <div className="section-head">
          <h2>{fm.recentTitle}</h2>
          <Link href="/projects" className="meta" style={{ color: 'var(--ink-2)' }}>{fm.recentMoreLabel}</Link>
        </div>
        <div className="landing-recent-grid">
          {featured.map((p) => (
            <ProjectCard key={p.frontmatter.slug} project={p} />
          ))}
        </div>
      </section>

      {/* PHILOSOPHY */}
      <section className="section dark">
        <div className="landing-philosophy">
          <div>
            <div className="kicker" dangerouslySetInnerHTML={{ __html: fm.philosophyKicker }} />
            <p className="meta" style={{ color: 'rgba(250,248,244,.5)', marginTop: 20 }}>
              <Link href={fm.philosophyReadMoreHref}>{fm.philosophyReadMoreLabel}</Link>
            </p>
          </div>
          <div>
            <p
              className="landing-philosophy-quote"
              dangerouslySetInnerHTML={{ __html: fm.philosophyQuote }}
            />
          </div>
        </div>
      </section>
    </>
  );
}
