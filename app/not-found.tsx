import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Not found',
  description: 'This page is still on the print bed.',
  robots: { index: false, follow: true },
};

const ROUTES = ['/BIO', '/PROJECTS', '/NOW', '/HOBBIES', '/USES', '/CONTACT'];

export default function NotFound() {
  return (
    <>
      <section className="section notfound-hero" style={{ paddingTop: 120, paddingBottom: 120, textAlign: 'center' }}>
        <div className="meta" style={{ letterSpacing: '.14em', marginBottom: 28 }}>
          HTTP/404 &nbsp;·&nbsp; NOT FOUND
        </div>
        <h1 className="display notfound-num" style={{ fontSize: 'clamp(120px, 32vw, 280px)', marginBottom: 28, letterSpacing: '-0.04em', lineHeight: 0.9 }}>
          4<i>0</i>4
        </h1>
        <p className="display-m notfound-tag" style={{ maxWidth: '22ch', margin: '0 auto 36px' }}>
          This page is still <i>on the print bed.</i>
        </p>
        <p className="notfound-body" style={{ fontSize: 15, color: 'var(--ink-2)', maxWidth: '52ch', margin: '0 auto 40px' }}>
          Either the URL is wrong, or I haven't written it yet. Both are
          equally likely. Try one of the links below — the dog says they
          all work.
        </p>
        <div className="notfound-ctas m-cta-stack" style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/" className="nav-cta">Back to home</Link>
          <a href="mailto:contact@phillipsben.com" className="nav-cta ghost">Send me the broken link →</a>
        </div>
      </section>

      <section className="section notfound-try" style={{ paddingTop: 0, paddingBottom: 48 }}>
        <div className="meta notfound-try-label" style={{ textAlign: 'center', marginBottom: 14 }}>OR TRY —</div>
        <div className="notfound-grid">
          {ROUTES.map((p) => (
            <Link key={p} href={p.toLowerCase()} className="notfound-grid-cell">
              {p} →
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
