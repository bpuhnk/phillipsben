import type { Metadata } from 'next';
import SectionHead from '@/components/section-head';
import CalEmbed from '@/components/cal-embed';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Contact',
  description: 'Email, a calendar slot, a résumé. No contact form with twelve fields.',
  path: '/contact',
});

export default function ContactPage() {
  return (
    <>
      <section className="section" style={{ paddingBottom: 64 }}>
        <div className="kicker">
          <span style={{ color: 'var(--accent)' }}>●</span>
          &nbsp; OPEN TO INTERESTING WORK · MAY 2026
        </div>
        <h1 className="display display-xxl" style={{ marginTop: 24, marginBottom: 32 }}>
          Let's <i>talk.</i>
        </h1>
        <p className="lede" style={{ maxWidth: '46ch' }}>
          The fastest way is email. The second-fastest is a 30-minute call. There
          is no contact form with twelve required fields.
        </p>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
          <a
            href="mailto:contact@phillipsben.com"
            style={{ display: 'block', padding: 32, border: '1px solid var(--rule)', background: 'var(--bg)' }}
          >
            <div className="meta" style={{ marginBottom: 14 }}>① &nbsp; EMAIL</div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 40, lineHeight: 1, marginBottom: 12 }}>
              contact@<br />phillipsben.<i>com</i>
            </h3>
            <p style={{ fontSize: 13.5, color: 'var(--ink-2)' }}>
              I read everything. I usually reply inside two days, faster if it's interesting.
            </p>
          </a>
          <a
            href="#book"
            style={{ display: 'block', padding: 32, border: '1px solid var(--rule)', background: 'var(--bg)' }}
          >
            <div className="meta" style={{ marginBottom: 14 }}>② &nbsp; CALENDAR</div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 40, lineHeight: 1, marginBottom: 12 }}>
              Book a <i>30-min</i><br />chat →
            </h3>
            <p style={{ fontSize: 13.5, color: 'var(--ink-2)' }}>
              Tuesdays & Thursdays, US Central. No agenda needed. Camera optional.
            </p>
          </a>
          <a
            href="/resume.pdf"
            download
            style={{ display: 'block', padding: 32, background: 'var(--ink)', color: 'var(--bg)' }}
          >
            <div className="meta" style={{ marginBottom: 14, color: 'rgba(250,248,244,.5)' }}>③ &nbsp; RÉSUMÉ</div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 40, lineHeight: 1, marginBottom: 12 }}>
              Download <i>PDF</i><br />résumé →
            </h3>
            <p style={{ fontSize: 13.5, color: 'rgba(250,248,244,.6)' }}>
              One page. Two if you count the cover. Updated May 2026.
            </p>
          </a>
        </div>
      </section>

      <section className="section" id="book">
        <SectionHead title="Book a 30-min chat." idx="§ 02" />
        <CalEmbed calLink="bpuhnk/30min" namespace="30min" />
      </section>

      <section className="section">
        <SectionHead title="Elsewhere." idx="§ 03" />
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {[
            ['GITHUB', '@bPuhnk', 'Most personal projects, plus a long history of small tools.', 'https://github.com/bPuhnk'],
            ['LINKEDIN', '/in/ben-phillips-332a4826', 'For when you need the formal version.', 'https://www.linkedin.com/in/ben-phillips-332a4826/'],
          ].map(([k, v, d, href]) => (
            <li
              key={k}
              style={{ display: 'grid', gridTemplateColumns: '120px 280px 1fr 40px', gap: 32, alignItems: 'baseline', padding: '24px 0', borderTop: '1px solid var(--rule-2)' }}
            >
              <span className="meta">{k}</span>
              <a href={href} target="_blank" rel="noreferrer" style={{ fontFamily: 'var(--font-display)', fontSize: 26 }}>{v}</a>
              <span style={{ fontSize: 13.5, color: 'var(--ink-2)' }}>{d}</span>
              <a href={href} target="_blank" rel="noreferrer" style={{ fontFamily: 'var(--font-mono)', fontSize: 14, color: 'var(--accent)', textAlign: 'right' }}>↗</a>
            </li>
          ))}
        </ul>
      </section>

      <section className="section muted">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: 64 }}>
          <div className="kicker">§ 04 &nbsp;·&nbsp; A FEW HONEST NOTES</div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontFamily: 'var(--font-display)', fontSize: 22, lineHeight: 1.45, color: 'var(--ink-2)' }}>
            <li style={{ padding: '14px 0', borderTop: '1px solid var(--rule)' }}>I'm not actively job-hunting, but I'm always open to <i>interesting</i> work.</li>
            <li style={{ padding: '14px 0', borderTop: '1px solid var(--rule)' }}>I live in the Southeast US — happy to travel, happiest remote.</li>
            <li style={{ padding: '14px 0', borderTop: '1px solid var(--rule)' }}>I don't take work that asks me to compromise on the family rhythm.</li>
            <li style={{ padding: '14px 0', borderTop: '1px solid var(--rule)', borderBottom: '1px solid var(--rule)' }}>If you're a recruiter sending a script — please at least <i>read</i> the site first.</li>
          </ul>
        </div>
      </section>
    </>
  );
}
