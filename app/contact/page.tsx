import type { Metadata } from 'next';
import SectionHead from '@/components/section-head';
import CalEmbed from '@/components/cal-embed';
import { getSiteCopy, getSiteData } from '@/lib/site-content';
import { contactTilesSchema, contactElsewhereSchema } from '@/lib/site-schemas';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Contact',
  description: 'Email, a calendar slot, a résumé. No contact form with twelve fields.',
  path: '/contact',
});

export default async function ContactPage() {
  const [copy, tiles, elsewhere] = await Promise.all([
    getSiteCopy('contact'),
    getSiteData('contact-tiles', contactTilesSchema),
    getSiteData('contact-elsewhere', contactElsewhereSchema),
  ]);
  const fm = copy.frontmatter;

  return (
    <>
      <section className="section" style={{ paddingBottom: 64 }}>
        <div className="kicker" dangerouslySetInnerHTML={{ __html: fm.kicker }} />
        <h1
          className="display display-xxl contact-page-h1"
          style={{ marginTop: 24, marginBottom: 32 }}
          dangerouslySetInnerHTML={{ __html: fm.headline }}
        />
        <p
          className="lede"
          style={{ maxWidth: '46ch' }}
          dangerouslySetInnerHTML={{ __html: fm.lede }}
        />
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="contact-tile-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
          {tiles.map((tile, i) => {
            const isDark = tile.variant === 'dark';
            const tileProps = isDark
              ? { className: 'contact-tile contact-tile-dark', style: { display: 'block', padding: 32, background: 'var(--ink)', color: 'var(--bg)' } as const }
              : { className: 'contact-tile', style: { display: 'block', padding: 32, border: '1px solid var(--rule)', background: 'var(--bg)' } as const };
            const kickerColor = isDark ? 'rgba(250,248,244,.5)' : undefined;
            const bodyColor = isDark ? 'rgba(250,248,244,.6)' : 'var(--ink-2)';
            return (
              <a
                key={i}
                href={tile.href}
                {...(tile.download ? { download: true } : {})}
                {...tileProps}
              >
                <div className="meta tile-kicker" style={{ marginBottom: 14, color: kickerColor }}>{tile.kicker}</div>
                <h3
                  className="tile-headline"
                  style={{ fontFamily: 'var(--font-display)', fontSize: 40, lineHeight: 1, marginBottom: 12 }}
                  dangerouslySetInnerHTML={{ __html: tile.headline }}
                />
                <p className="tile-body" style={{ fontSize: 13.5, color: bodyColor }}>
                  {tile.body}
                </p>
              </a>
            );
          })}
        </div>
      </section>

      <section className="section" id="book">
        <SectionHead title={fm.bookSectionTitle} idx={fm.bookSectionIdx} />
        <CalEmbed calLink={fm.calLink} namespace={fm.calNamespace} />
      </section>

      <section className="section">
        <SectionHead title={fm.elsewhereTitle} idx={fm.elsewhereIdx} />
        <ul className="contact-elsewhere" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {elsewhere.map((row) => (
            <li
              key={row.kicker}
              className="contact-elsewhere-row"
              style={{ display: 'grid', gridTemplateColumns: '120px 280px 1fr 40px', gap: 32, alignItems: 'baseline', padding: '24px 0', borderTop: '1px solid var(--rule-2)' }}
            >
              <span className="meta elsewhere-kicker">{row.kicker}</span>
              <a href={row.href} target="_blank" rel="noreferrer" className="elsewhere-value" style={{ fontFamily: 'var(--font-display)', fontSize: 26 }}>{row.value}</a>
              <span className="elsewhere-desc" style={{ fontSize: 13.5, color: 'var(--ink-2)' }}>{row.desc}</span>
              <a href={row.href} target="_blank" rel="noreferrer" className="elsewhere-arrow" style={{ fontFamily: 'var(--font-mono)', fontSize: 14, color: 'var(--accent)', textAlign: 'right' }}>↗</a>
            </li>
          ))}
        </ul>
      </section>

      <section className="section muted contact-honest">
        <div className="contact-honest-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: 64 }}>
          <div className="kicker" dangerouslySetInnerHTML={{ __html: fm.honestKicker }} />
          <ul className="contact-honest-list" style={{ listStyle: 'none', padding: 0, margin: 0, fontFamily: 'var(--font-display)', fontSize: 22, lineHeight: 1.45, color: 'var(--ink-2)' }}>
            {fm.honestNotes.map((note, i) => {
              const isLast = i === fm.honestNotes.length - 1;
              return (
                <li
                  key={i}
                  style={{
                    padding: '14px 0',
                    borderTop: '1px solid var(--rule)',
                    ...(isLast ? { borderBottom: '1px solid var(--rule)' } : {}),
                  }}
                  dangerouslySetInnerHTML={{ __html: note }}
                />
              );
            })}
          </ul>
        </div>
      </section>
    </>
  );
}
