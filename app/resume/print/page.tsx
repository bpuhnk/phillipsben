import { getSiteData } from '@/lib/site-content';
import { resumeSchema } from '@/lib/site-schemas';

export const dynamic = 'force-static';

export default async function ResumePrint() {
  const resume = await getSiteData('resume', resumeSchema);

  return (
    <article
      style={{
        maxWidth: 760,
        margin: '0 auto',
        padding: '48px 56px',
        fontFamily: 'var(--font-body)',
        fontSize: 11.5,
        color: 'var(--ink)',
        lineHeight: 1.45,
        background: 'white',
      }}
    >
      <header style={{ borderBottom: '2px solid var(--ink)', paddingBottom: 16, marginBottom: 24 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 38, lineHeight: 1, marginBottom: 6 }}>
          {resume.header.name}
        </h1>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.1em', color: 'var(--ink-3)', textTransform: 'uppercase' }}>
          {resume.header.title}
        </p>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--ink-2)', marginTop: 8 }}>
          {resume.header.contact}
        </p>
      </header>

      <section style={{ marginBottom: 22 }}>
        <h2 style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--ink-3)', marginBottom: 8 }}>
          Summary
        </h2>
        <p style={{ fontSize: 12 }}>{resume.summary}</p>
      </section>

      <section style={{ marginBottom: 22 }}>
        <h2 style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--ink-3)', marginBottom: 10 }}>
          Experience
        </h2>
        {resume.experience.map((r) => (
          <div key={r.y} style={{ marginBottom: 12, paddingBottom: 10, borderBottom: '1px solid var(--rule-2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, lineHeight: 1.15 }}>{r.h}</h3>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--ink-3)' }}>{r.y}</span>
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--ink-3)', marginBottom: 4 }}>
              {r.s}
            </div>
            <p style={{ fontSize: 11.5, color: 'var(--ink-2)' }}>{r.p}</p>
          </div>
        ))}
      </section>

      <section style={{ marginBottom: 22 }}>
        <h2 style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--ink-3)', marginBottom: 8 }}>
          Skills
        </h2>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: 11.5 }}>
          {resume.skills.map((s) => (
            <li key={s.label}><strong>{s.label}:</strong> {s.body}</li>
          ))}
        </ul>
      </section>

      <section>
        <h2 style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--ink-3)', marginBottom: 8 }}>
          Selected Projects
        </h2>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: 11.5 }}>
          {resume.selectedProjects.map((p) => (
            <li key={p.name} style={{ marginBottom: 6 }}><strong>{p.name}</strong> — {p.desc}</li>
          ))}
        </ul>
      </section>

      <footer style={{ marginTop: 32, paddingTop: 12, borderTop: '1px solid var(--rule-2)', fontFamily: 'var(--font-mono)', fontSize: 9.5, color: 'var(--ink-3)', textAlign: 'center' }}>
        Generated from phillipsben.com — full write-ups at /projects
      </footer>
    </article>
  );
}
