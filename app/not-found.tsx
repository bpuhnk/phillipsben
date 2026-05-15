import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="section" style={{ paddingTop: 120, paddingBottom: 120, textAlign: 'center' }}>
      <div className="meta" style={{ letterSpacing: '.14em', marginBottom: 28 }}>
        HTTP/404 &nbsp;·&nbsp; NOT FOUND
      </div>
      <h1 className="display" style={{ fontSize: 280, marginBottom: 28, letterSpacing: '-0.04em' }}>
        4<i>0</i>4
      </h1>
      <p style={{ fontFamily: 'var(--font-display)', fontSize: 44, lineHeight: 1.2, maxWidth: '22ch', margin: '0 auto 36px' }}>
        This page is still <i>on the print bed.</i>
      </p>
      <p style={{ fontSize: 15, color: 'var(--ink-2)', maxWidth: '52ch', margin: '0 auto 40px' }}>
        Either the URL is wrong, or I haven't written it yet. Both are
        equally likely. Try one of the links below — the dog says they
        all work.
      </p>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
        <Link href="/" className="nav-cta">Back to home</Link>
        <a href="mailto:contact@phillipsben.com" className="nav-cta ghost">Send me the broken link →</a>
      </div>
      <div
        style={{
          marginTop: 88,
          display: 'flex',
          gap: 56,
          justifyContent: 'center',
          fontFamily: 'var(--font-mono)',
          fontSize: 11.5,
          color: 'var(--ink-3)',
          letterSpacing: '.06em',
          flexWrap: 'wrap',
        }}
      >
        <Link href="/bio">TRY /BIO</Link>
        <Link href="/projects">TRY /PROJECTS</Link>
        <Link href="/now">TRY /NOW</Link>
        <Link href="/hobbies">TRY /HOBBIES</Link>
        <Link href="/uses">TRY /USES</Link>
      </div>
    </section>
  );
}
