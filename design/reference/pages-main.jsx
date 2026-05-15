// pages.jsx — all page components for phillipsben.com mockups
// Each <Page*> renders inside a DCArtboard. Pages share <Nav> and <Foot>.

// ───────────────────────────────────────────── shared

function Nav({ active }) {
  const items = ['Index', 'Bio', 'Projects', 'Now', 'Hobbies', 'Uses', 'Contact'];
  return (
    <nav className="nav">
      <a href="#" className="nav-brand">
        <span className="dot" />
        ben phillips<i>&nbsp;/ engineer</i>
      </a>
      <div className="nav-links">
        {items.map(it => (
          <a key={it} href="#" className={active === it ? 'active' : ''}>{it}</a>
        ))}
      </div>
      <a href="#" className="nav-cta">
        Resume
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M2 8L8 2M8 2H4M8 2V6"/></svg>
      </a>
    </nav>
  );
}

function Foot() {
  return (
    <footer className="foot">
      <div>
        <div className="nav-brand" style={{ marginBottom: 14 }}>
          <span className="dot" />
          <span style={{ fontSize: 18 }}>ben phillips</span>
        </div>
        <p style={{ fontSize: 12, color: 'var(--ink-3)', maxWidth: '24ch' }}>
          Engineer, tinkerer, husband, dad. Building from a small town in the Southeast.
        </p>
      </div>
      <div>
        <h5>Site</h5>
        <ul>
          <li><a href="#">Bio</a></li>
          <li><a href="#">Projects</a></li>
          <li><a href="#">Now</a></li>
          <li><a href="#">Hobbies</a></li>
          <li><a href="#">Uses</a></li>
        </ul>
      </div>
      <div>
        <h5>Elsewhere</h5>
        <ul>
          <li><a href="#">GitHub ↗</a></li>
          <li><a href="#">LinkedIn ↗</a></li>
          <li><a href="#">Mastodon ↗</a></li>
          <li><a href="#">RSS ↗</a></li>
        </ul>
      </div>
      <div>
        <h5>Direct</h5>
        <ul>
          <li><a href="#">hello@phillipsben.com</a></li>
          <li><a href="#">Download résumé (PDF)</a></li>
          <li><a href="#">Book a 30-min chat</a></li>
        </ul>
      </div>
      <div className="foot-bottom">
        <span>© 2026 Ben Phillips · phillipsben.com</span>
        <span>v.2026.05 · Hand-built, no tracking</span>
      </div>
    </footer>
  );
}

// kicker with dot separators
function K({ children }) { return <div className="kicker">{children}</div>; }

// inline placeholder image
function Img({ label, ratio = '16 / 10', height, dark }) {
  return (
    <div className={'imgph' + (dark ? ' dark' : '')} style={{ aspectRatio: ratio, height }}>
      <span>{label}</span>
    </div>
  );
}

// ───────────────────────────────────────────── LANDING

function PageLanding({ heroVariant = 'A' }) {
  return (
    <div className="page" data-screen-label="01 Index">
      <Nav active="Index" />

      {/* HERO */}
      {heroVariant === 'A' && (
        <section className="section" style={{ paddingTop: 88, paddingBottom: 56 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 64, alignItems: 'end' }}>
            <div>
              <K><span style={{ color: 'var(--accent)' }}>●</span> &nbsp; AVAILABLE FOR SELECT WORK · MAY 2026</K>
              <h1 className="display" style={{ fontSize: 132, marginTop: 24, marginBottom: 28 }}>
                Software for<br/>
                things that <i>actually<br/>have to work.</i>
              </h1>
              <p className="lede" style={{ maxWidth: '38ch' }}>
                Full-stack engineer, twenty years deep in .NET and desktop apps —
                now building agentic systems where they belong: on the factory floor,
                in the workshop, on your own machine.
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18, paddingBottom: 12 }}>
              <div style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--ink-3)', letterSpacing: '.04em' }}>
                CURRENTLY
              </div>
              <div style={{ borderTop: '1px solid var(--rule)', paddingTop: 16 }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, lineHeight: 1.15, marginBottom: 6 }}>
                  Building <i>Hermes-Agent</i> on a home Ubuntu box.
                </div>
                <div className="meta">Updated 3 days ago — see /now →</div>
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
      )}

      {heroVariant === 'B' && (
        <section className="section" style={{ paddingTop: 120, paddingBottom: 80, textAlign: 'center' }}>
          <K>BENJAMIN PHILLIPS &nbsp;·&nbsp; PHILLIPSBEN.COM &nbsp;·&nbsp; EST. 2005</K>
          <h1 className="display" style={{ fontSize: 168, marginTop: 36, marginBottom: 36 }}>
            <i>Twenty years</i><br/>
            building things<br/>
            that <i>don't break.</i>
          </h1>
          <p className="lede" style={{ maxWidth: '52ch', margin: '0 auto' }}>
            A portfolio of desktop software, embedded systems, and a stubborn
            love of solving the problem that's actually in front of you.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 40 }}>
            <a href="#" className="nav-cta">See the work</a>
            <a href="#" className="nav-cta" style={{ background: 'transparent', color: 'var(--ink)' }}>About me</a>
          </div>
        </section>
      )}

      {heroVariant === 'C' && (
        <section className="section" style={{ paddingTop: 72, paddingBottom: 56 }}>
          <K>INDEX &nbsp;·&nbsp; 2026 EDITION</K>
          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 56, marginTop: 28, alignItems: 'center' }}>
            <h1 className="display" style={{ fontSize: 112 }}>
              Hi — I'm Ben.<br/>
              I write <i>software</i> for<br/>
              manufacturing,<br/>
              <i>machines</i>, and the<br/>
              people who run them.
            </h1>
            <div style={{ position: 'relative', height: 560, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
              <div style={{ position: 'absolute', inset: '36px 0 0 0', background: 'var(--bg-2)' }} />
              <img
                src="images/ben-headshot.png"
                alt="Ben Phillips, portrait."
                style={{ position: 'relative', maxWidth: '92%', maxHeight: '100%', objectFit: 'contain', display: 'block' }}
              />
              <div style={{ position: 'absolute', top: 14, left: 16, fontFamily: 'var(--font-mono)', fontSize: 10.5, letterSpacing: '.1em', color: 'var(--ink-3)' }}>FIG. 01 — MAY 2026.</div>
            </div>
          </div>
        </section>
      )}

      {/* divider strip */}
      <section className="section tight" style={{ borderTop: '1px solid var(--rule-2)', borderBottom: '1px solid var(--rule-2)', paddingTop: 22, paddingBottom: 22 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: 'var(--font-mono)', fontSize: 11.5, color: 'var(--ink-3)', letterSpacing: '.06em' }}>
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
        <div className="section-head">
          <h2>What's on the site.</h2>
          <span className="idx">§ 01 / GUIDE</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 40 }}>
          {[
            { n: '/bio', t: 'Biography', d: 'The twenty-year version. Industries, roles, tools, and a short version for the recruiter in a hurry.' },
            { n: '/projects', t: 'Projects', d: 'Completed and active work. Each entry has a write-up, the constraints, and what I learned.' },
            { n: '/now', t: 'Now', d: 'What I\'m focused on this month. Updated as it changes. A snapshot, not a feed.' },
            { n: '/hobbies', t: 'Hobbies', d: '3D printers I\'ve modded, smart-home tinkering, a local-AI homelab, and family.' },
            { n: '/uses', t: 'Uses', d: 'Hardware, software, models, filaments. The boring details that take years to settle on.' },
            { n: '/contact', t: 'Contact', d: 'Email, calendar, résumé. The fastest way to reach me. No forms with twelve fields.' },
          ].map(c => (
            <a href="#" key={c.n} style={{ display: 'block', borderTop: '1px solid var(--ink)', paddingTop: 18 }}>
              <div className="meta" style={{ marginBottom: 12, color: 'var(--accent)' }}>{c.n}</div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 32, lineHeight: 1, marginBottom: 10 }}>{c.t} →</h3>
              <p style={{ fontSize: 13.5, color: 'var(--ink-2)' }}>{c.d}</p>
            </a>
          ))}
        </div>
      </section>

      {/* RECENT WORK strip */}
      <section className="section muted">
        <div className="section-head">
          <h2>Recent work.</h2>
          <a href="#" className="meta" style={{ color: 'var(--ink-2)' }}>All projects →</a>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
          {[
            { y: '2026', s: 'ACTIVE', t: 'Hermes-Agent', d: 'A home agent server orchestrating local models for tool-use, indexing, and routine automations.' },
            { y: '2025', s: 'SHIPPED', t: 'Aggregate Plant OS', d: 'A WPF + service-bus stack replacing a 90s control room. Six sites, four years of uptime.' },
            { y: '2025', s: 'SHIPPED', t: 'Transaxle QC Suite', d: 'Electron app for line-side inspection — gauge data, photos, signed off and on the network.' },
          ].map(p => (
            <article key={p.t} className="proj-card">
              <Img label={p.t + ' — product shot · 16:10 hero'} />
              <div className="body">
                <div className="row">
                  <span>{p.y}</span><span>·</span>
                  <span style={{ color: 'var(--accent)' }}>{p.s}</span>
                </div>
                <h3 className="title">{p.t}</h3>
                <p className="desc">{p.d}</p>
                <div className="tags">
                  <span className="chip">C#</span>
                  <span className="chip">WPF</span>
                  <span className="chip">Electron</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* PHILOSOPHY */}
      <section className="section dark">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: 80, alignItems: 'start' }}>
          <div>
            <K>§ 02 &nbsp;·&nbsp; HOW I WORK</K>
            <p className="meta" style={{ color: 'rgba(250,248,244,.5)', marginTop: 20 }}>
              Read more in /bio →
            </p>
          </div>
          <div>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: 44, lineHeight: 1.1, letterSpacing: '-0.02em' }}>
              I'm less interested in which framework
              than in <i style={{ color: '#E8B895' }}>what the seam looks like</i> when
              the people who run the line take it over,
              and what it costs us when something fails
              at 3 a.m.
            </p>
          </div>
        </div>
      </section>

      <Foot />
    </div>
  );
}

// ───────────────────────────────────────────── BIO

function PageBio() {
  return (
    <div className="page" data-screen-label="02 Bio">
      <Nav active="Bio" />

      <section className="section" style={{ paddingBottom: 64 }}>
        <K>§ 01 &nbsp;·&nbsp; BIOGRAPHY</K>
        <div style={{ display: 'grid', gridTemplateColumns: '1.35fr 1fr', gap: 56, marginTop: 24, alignItems: 'start' }}>
          <div>
            <h1 className="display" style={{ fontSize: 104, marginBottom: 40, maxWidth: '14ch' }}>
              A long résumé, <i>told slowly.</i>
            </h1>
            <p className="lede" style={{ maxWidth: '44ch', marginBottom: 48 }}>
              I'm Ben Phillips — a full-stack software engineer who has spent
              almost twenty years inside the .NET ecosystem, mostly building
              desktop applications for places where software has to keep running
              whether the network is up or not.
            </p>
            <div className="meta" style={{ marginBottom: 12 }}>QUICK FACTS</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: 14, color: 'var(--ink-2)', maxWidth: '46ch' }}>
              <li style={{ padding: '10px 0', borderTop: '1px solid var(--rule-2)' }}>41 years old · Southeast USA</li>
              <li style={{ padding: '10px 0', borderTop: '1px solid var(--rule-2)' }}>Married 20 years · two teenagers · one Jack Russell</li>
              <li style={{ padding: '10px 0', borderTop: '1px solid var(--rule-2)' }}>Christian; tries to live like it</li>
              <li style={{ padding: '10px 0', borderTop: '1px solid var(--rule-2)', borderBottom: '1px solid var(--rule-2)' }}>Works in C#, TypeScript, Python; speaks fluent legacy</li>
            </ul>
          </div>
          {/* Editorial cutout — transparent PNG floats on the cream surface */}
          <div style={{ position: 'relative', alignSelf: 'stretch', display: 'flex', justifyContent: 'center' }}>
            <img
              src="images/ben-fullbody.png"
              alt="Ben Phillips, in a tan blazer and snowflake-print tie."
              style={{ width: '100%', maxWidth: 440, maxHeight: 880, objectFit: 'contain', objectPosition: 'center top', display: 'block' }}
            />
            <div style={{ position: 'absolute', bottom: 4, right: 8, fontFamily: 'var(--font-mono)', fontSize: 10.5, letterSpacing: '.1em', color: 'var(--ink-3)', textTransform: 'uppercase' }}>
              Fig. — Christmas, 2024.
            </div>
          </div>
        </div>
      </section>

      <section className="section tight" style={{ paddingTop: 0 }}>
        <div className="stats">
          <div className="stat"><div className="num">20<i>+</i></div><div className="lbl">Years in .NET</div></div>
          <div className="stat"><div className="num">6</div><div className="lbl">Plants shipped to</div></div>
          <div className="stat"><div className="num">2</div><div className="lbl">Industries deep</div></div>
          <div className="stat"><div className="num"><i>∞</i></div><div className="lbl">Filament spools spent</div></div>
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <h2>Career, year by year.</h2>
          <span className="idx">§ 02 / TIMELINE</span>
        </div>
        <div className="timeline">
          {[
            { y: '2024 — Now', h: 'Architect, Software Engineering', s: 'Heavy industrial · current role',
              p: 'Owning architecture across desktop, services, and increasingly an agentic layer that handles routing, summarization, and anomaly review. Less framework debate, more deciding what the seams look like.' },
            { y: '2018 — 2024', h: 'Senior Software Engineer', s: 'Transaxle manufacturing',
              p: 'Built and maintained a WPF + service-bus stack covering line-side QC, gauge integration, and traceability. Helped retire two decades of VB6.' },
            { y: '2012 — 2018', h: 'Software Engineer', s: 'Industrial aggregates',
              p: 'Plant-level applications for production reporting, weighbridge integration, and dispatch. WinForms, then WPF, then services, then services-talking-to-services.' },
            { y: '2007 — 2012', h: 'Developer', s: 'Mixed contract & in-house',
              p: 'WinForms apps for small businesses across the region. Learned how to ship to people who will call you on a Sunday if it breaks.' },
            { y: '2005', h: 'Started writing C#', s: 'Self-taught, then formal',
              p: 'A first .NET 1.1 project, an old Dell, and a stack of paperback books. Twenty years later, the books are still on the shelf.' },
          ].map(r => (
            <div className="tl-row" key={r.y}>
              <div className="tl-year">{r.y}</div>
              <div className="tl-content">
                <h4>{r.h}</h4>
                <div className="sub">{r.s}</div>
                <p>{r.p}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section muted">
        <div className="section-head">
          <h2>What I'm good at.</h2>
          <span className="idx">§ 03 / SKILLS</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32 }}>
          {[
            { t: 'Desktop applications', d: 'WPF, WinForms, Electron. Single-window apps that have to stay running through a shift change.', tags: ['WPF', 'XAML', 'Electron', 'WinForms', 'MAUI'] },
            { t: 'Services & integrations', d: 'C#, ASP.NET, message buses, SQL Server, talking to PLCs and gauges that pre-date my career.', tags: ['ASP.NET', 'gRPC', 'RabbitMQ', 'SQL Server', 'OPC'] },
            { t: 'Agentic & local AI', d: 'Designing systems where the agent is part of the architecture, not a chatbot bolted on the side.', tags: ['Hermes-Agent', 'Ollama', 'ComfyUI', 'KoboldCPP', 'P100'] },
            { t: 'Architecture & seams', d: 'Boring interfaces between teams, ownership boundaries, who owns what when something breaks.', tags: ['DDD', 'Event sourcing', 'CQRS', 'Modular monolith'] },
            { t: 'Embedded & smart home', d: 'ESP32, Arduino, Raspberry Pi. Tying physical things to dashboards and back again.', tags: ['ESP32', 'Arduino', 'RPi', 'MQTT', 'ESPHome'] },
            { t: 'Legacy whisperer', d: 'Reading VB6, Access databases, undocumented binary protocols. Replacing them without breaking the line.', tags: ['VB6', 'Access', 'COM', 'Legacy SQL', 'Migrations'] },
          ].map(s => (
            <div key={s.t} style={{ borderTop: '1px solid var(--rule)', paddingTop: 18 }}>
              <h4 style={{ fontFamily: 'var(--font-display)', fontSize: 24, marginBottom: 8 }}>{s.t}</h4>
              <p style={{ fontSize: 13.5, color: 'var(--ink-2)', marginBottom: 14 }}>{s.d}</p>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {s.tags.map(t => <span key={t} className="chip">{t}</span>)}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 64 }}>
          <div>
            <K>§ 04 &nbsp;·&nbsp; OFF THE CLOCK</K>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 60, lineHeight: 1, marginTop: 16 }}>
              The <i>rest of it.</i>
            </h2>
          </div>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: 26, lineHeight: 1.4, color: 'var(--ink-2)' }}>
            I've been married twenty years. We have a daughter who's nineteen,
            a son who's seventeen, and a nine-year-old Jack Russell who runs
            the house. I'm a Christian — that shows up in how I work as much as
            anywhere else. We live in a small town in the Southeast and we
            mean it when we say we like the quiet life.
          </p>
        </div>
        <div style={{ marginTop: 56, display: 'flex', gap: 14 }}>
          <a href="#" className="nav-cta">Download résumé (PDF)</a>
          <a href="#" className="nav-cta" style={{ background: 'transparent', color: 'var(--ink)' }}>Read /now →</a>
        </div>
      </section>

      <Foot />
    </div>
  );
}

window.PageLanding = PageLanding;
window.PageBio = PageBio;
window.Nav = Nav;
window.Foot = Foot;
window.K = K;
window.Img = Img;
