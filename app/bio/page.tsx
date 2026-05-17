import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import SectionHead from '@/components/section-head';
import Stats from '@/components/stats';
import Timeline from '@/components/timeline';
import Chip from '@/components/chip';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Bio',
  description: 'Full-stack software engineer, almost twenty years in .NET. The long version of the résumé.',
  path: '/bio',
});

const careerRows = [
  {
    y: '2024 — Now',
    h: 'Architect, Software Engineering',
    s: 'Heavy industrial · current role',
    p: 'Owning architecture across desktop, services, and increasingly an agentic layer that handles routing, summarization, and anomaly review. Less framework debate, more deciding what the seams look like.',
  },
  {
    y: '2018 — 2024',
    h: 'Senior Software Engineer',
    s: 'Transaxle manufacturing',
    p: 'Built and maintained a WPF + service-bus stack covering line-side QC, gauge integration, and traceability. Helped retire two decades of VB6.',
  },
  {
    y: '2012 — 2018',
    h: 'Software Engineer',
    s: 'Industrial aggregates',
    p: 'Plant-level applications for production reporting, weighbridge integration, and dispatch. WinForms, then WPF, then services, then services-talking-to-services.',
  },
  {
    y: '2007 — 2012',
    h: 'Developer',
    s: 'Mixed contract & in-house',
    p: 'WinForms apps for small businesses across the region. Learned how to ship to people who will call you on a Sunday if it breaks.',
  },
  {
    y: '2005',
    h: 'Started writing C#',
    s: 'Self-taught, then formal',
    p: 'A first .NET 1.1 project, an old Dell, and a stack of paperback books. Twenty years later, the books are still on the shelf.',
  },
];

const skills = [
  { t: 'Desktop applications', d: 'WPF, WinForms, Electron. Single-window apps that have to stay running through a shift change.', tags: ['WPF', 'XAML', 'Electron', 'WinForms', 'MAUI'] },
  { t: 'Services & integrations', d: 'C#, ASP.NET, message buses, SQL Server, talking to PLCs and gauges that pre-date my career.', tags: ['ASP.NET', 'gRPC', 'RabbitMQ', 'SQL Server', 'OPC'] },
  { t: 'Agentic & local AI', d: 'Designing systems where the agent is part of the architecture, not a chatbot bolted on the side.', tags: ['Hermes-Agent', 'Ollama', 'ComfyUI', 'KoboldCPP', 'P100'] },
  { t: 'Architecture & seams', d: 'Boring interfaces between teams, ownership boundaries, who owns what when something breaks.', tags: ['DDD', 'Event sourcing', 'CQRS', 'Modular monolith'] },
  { t: 'Embedded & smart home', d: 'ESP32, Arduino, Raspberry Pi. Tying physical things to dashboards and back again.', tags: ['ESP32', 'Arduino', 'RPi', 'MQTT', 'ESPHome'] },
  { t: 'Legacy whisperer', d: 'Reading VB6, Access databases, undocumented binary protocols. Replacing them without breaking the line.', tags: ['VB6', 'Access', 'COM', 'Legacy SQL', 'Migrations'] },
];

export default function BioPage() {
  return (
    <>
      <section className="section" style={{ paddingBottom: 64 }}>
        <div className="kicker">§ 01 &nbsp;·&nbsp; BIOGRAPHY</div>
        <h1 className="display display-xl" style={{ marginTop: 24, marginBottom: 32, maxWidth: '14ch' }}>
          A long résumé, <i>told slowly.</i>
        </h1>
        <div className="bio-hero">
          <div>
            <p className="lede" style={{ maxWidth: '44ch', marginBottom: 48 }}>
              I'm Ben Phillips — a full-stack software engineer who has spent
              almost twenty years inside the .NET ecosystem, mostly building
              desktop applications for places where software has to keep running
              whether the network is up or not.
            </p>
            <div className="meta" style={{ marginBottom: 12 }}>QUICK FACTS</div>
            <ul className="bio-quick-facts">
              <li>41 years old · Southeast USA</li>
              <li>Married 20 years · two teenagers · one Jack Russell</li>
              <li>Christian; tries to live like it</li>
              <li>Works in C#, TypeScript, Python; speaks fluent legacy</li>
            </ul>
          </div>
          <div className="bio-hero-img">
            <Image
              src="/images/ben-fullbody.png"
              alt="Ben Phillips, in a tan blazer and snowflake-print tie."
              width={440}
              height={880}
              style={{ width: '100%', maxWidth: 440, maxHeight: 880, objectFit: 'contain', objectPosition: 'center top', display: 'block', height: 'auto' }}
              priority
            />
            <div className="meta" style={{ position: 'absolute', bottom: 4, right: 8, textTransform: 'uppercase' }}>
              Fig. — Christmas, 2024.
            </div>
          </div>
        </div>
      </section>

      <section className="section tight" style={{ paddingTop: 0 }}>
        <Stats
          items={[
            { num: <>15<i>+ years</i></>, lbl: '.NET' },
            { num: '2', lbl: 'Industries deep' },
            { num: <i>∞</i>, lbl: 'Spools spent' },
          ]}
        />
      </section>

      <section className="section">
        <SectionHead title="Career, year by year." idx="§ 02 / TIMELINE" />
        <Timeline rows={careerRows} />
      </section>

      <section className="section muted">
        <SectionHead title="What I'm good at." idx="§ 03 / SKILLS" />
        <div className="bio-skills-grid">
          {skills.map((s) => (
            <div key={s.t} className="bio-skill">
              <h4>{s.t}</h4>
              <p>{s.d}</p>
              <div className="bio-skill-tags">
                {s.tags.map((t) => <Chip key={t}>{t}</Chip>)}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="bio-family-band">
          <div>
            <div className="kicker">§ 04 &nbsp;·&nbsp; OFF THE CLOCK</div>
            <h2 className="bio-family-band-head">
              The <i>rest of it.</i>
            </h2>
          </div>
          <p className="bio-family-band-copy">
            I've been married twenty years. We have a daughter who's nineteen,
            a son who's seventeen, and a nine-year-old Jack Russell who runs
            the house. I'm a Christian — that shows up in how I work as much as
            anywhere else. We live in a small town in the Southeast and we
            mean it when we say we like the quiet life.
          </p>
        </div>
        <div className="bio-cta-row m-cta-stack">
          <a href="/resume.pdf" className="nav-cta" download>Download résumé (PDF)</a>
          <Link href="/now" className="nav-cta ghost">Read /now →</Link>
        </div>
      </section>
    </>
  );
}
