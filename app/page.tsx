import type { Metadata } from 'next';
import Link from 'next/link';
import SectionHead from '@/components/section-head';
import ProjectCard from '@/components/project-card';
import { getFeaturedProjects } from '@/lib/content';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Ben Phillips — Engineer',
  description: 'Software for things that actually have to work.',
  path: '/',
});

export default async function Landing() {
  const featured = await getFeaturedProjects(3);

  return (
    <>
      {/* HERO — variant A */}
      <section className="section" style={{ paddingTop: 88, paddingBottom: 56 }}>
        <div className="landing-hero">
          <div>
            <div className="kicker">
              <span style={{ color: 'var(--accent)' }}>●</span>
              &nbsp; AVAILABLE FOR SELECT WORK · MAY 2026
            </div>
            <h1 className="display display-xxl" style={{ marginTop: 24, marginBottom: 28 }}>
              Software for<br />
              things that <i>actually<br />have to work.</i>
            </h1>
            <p className="lede" style={{ maxWidth: '38ch' }}>
              Full-stack engineer, twenty years deep in .NET and desktop apps —
              now building agentic systems where they belong: on the factory floor,
              in the workshop, on your own machine.
            </p>
          </div>
          <div className="landing-currently">
            <div className="meta">CURRENTLY</div>
            <div style={{ borderTop: '1px solid var(--rule)', paddingTop: 16 }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, lineHeight: 1.15, marginBottom: 6 }}>
                Building <i>Hermes-Agent</i> on a home Ubuntu box.
              </div>
              <div className="meta">See /now →</div>
            </div>
            <div style={{ borderTop: '1px solid var(--rule)', paddingTop: 16 }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, lineHeight: 1.15, marginBottom: 6 }}>
                Tuning a <i>BLV AM8</i>, finally dialed.
              </div>
              <div className="meta">First clean 0.16mm benchy in ~9 min.</div>
            </div>
          </div>
        </div>
      </section>

      {/* tech strip */}
      <section className="section tight landing-tech-strip-section">
        <div className="tech-strip">
          <span>.NET · 20 YRS</span>
          <span>WPF · WINFORMS · ELECTRON</span>
          <span>AGENTIC PROGRAMMING</span>
          <span>ESP32 · RPi · ARDUINO</span>
          <span>LOCAL LLMs · P100 · OLLAMA</span>
          <span>SE USA</span>
        </div>
      </section>

      {/* WHAT'S HERE */}
      <section className="section">
        <SectionHead title="What's on the site." idx="§ 01 / GUIDE" />
        <div className="landing-whats-here">
          {[
            { n: '/bio', t: 'Biography', d: 'The twenty-year version. Industries, roles, tools, and a short version for the recruiter in a hurry.', href: '/bio' },
            { n: '/projects', t: 'Projects', d: 'Completed and active work. Each entry has a write-up, the constraints, and what I learned.', href: '/projects' },
            { n: '/now', t: 'Now', d: "What I'm focused on this month. Updated as it changes. A snapshot, not a feed.", href: '/now' },
            { n: '/hobbies', t: 'Hobbies', d: "3D printers I've modded, smart-home tinkering, a local-AI homelab, and family.", href: '/hobbies' },
            { n: '/uses', t: 'Uses', d: 'Hardware, software, models, filaments. The boring details that take years to settle on.', href: '/uses' },
            { n: '/contact', t: 'Contact', d: 'Email, calendar, résumé. The fastest way to reach me. No forms with twelve fields.', href: '/contact' },
          ].map((c) => (
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
          <h2>Recent work.</h2>
          <Link href="/projects" className="meta" style={{ color: 'var(--ink-2)' }}>All projects →</Link>
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
            <div className="kicker">§ 02 &nbsp;·&nbsp; HOW I WORK</div>
            <p className="meta" style={{ color: 'rgba(250,248,244,.5)', marginTop: 20 }}>
              <Link href="/bio">Read more in /bio →</Link>
            </p>
          </div>
          <div>
            <p className="landing-philosophy-quote">
              I'm less interested in which framework
              than in <i style={{ color: '#E8B895' }}>what the seam looks like</i> when
              the people who run the line take it over,
              and what it costs us when something fails
              at 3 a.m.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
