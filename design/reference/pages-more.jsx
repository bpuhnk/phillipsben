// pages-more.jsx — Projects, ProjectDetail, Now, Hobbies, Uses, Contact, 404

// ───────────────────────────────────────────── PROJECTS INDEX

function PageProjects() {
  const projects = [
    { y: '2026', s: 'ACTIVE',   t: 'Hermes-Agent',          d: 'A home agent server orchestrating local models for tool-use, indexing, and routine automations on my Ubuntu box.', tags: ['Python', 'Ollama', 'Linux'], role: 'Personal' },
    { y: '2025', s: 'SHIPPED',  t: 'Aggregate Plant OS',    d: 'A WPF + service-bus stack replacing a 90s control room. Six sites, four years of uptime, one very nervous launch weekend.', tags: ['C#', 'WPF', 'RabbitMQ'], role: 'Work' },
    { y: '2025', s: 'SHIPPED',  t: 'Transaxle QC Suite',    d: 'Electron app for line-side inspection — gauge data, photos, signed off and on the network.', tags: ['Electron', 'TypeScript'], role: 'Work' },
    { y: '2025', s: 'ACTIVE',   t: 'Smart Shop',            d: 'ESP32 nodes around the garage: LEDs, sensors, occupancy, all reporting to Home Assistant via MQTT.', tags: ['ESP32', 'MQTT', 'ESPHome'], role: 'Personal' },
    { y: '2024', s: 'SHIPPED',  t: 'Weighbridge Bridge',    d: 'A small service that talks to scales nobody wanted to touch, then exposes them as a clean HTTP API.', tags: ['C#', '.NET 8', 'COM'], role: 'Work' },
    { y: '2024', s: 'ARCHIVED', t: 'Local-LLM Notebook',    d: 'An experimental WPF notebook for prompting Ollama with project-scoped context. Replaced by my agent setup.', tags: ['WPF', 'Ollama'], role: 'Personal' },
    { y: '2023', s: 'SHIPPED',  t: 'BLV AM8 Conversion',    d: 'Took an Anet A8 to a fully linear-rail BLV AM8. Documented every step, printed the brackets on the original.', tags: ['3D Print', 'Marlin'], role: 'Personal' },
    { y: '2022', s: 'SHIPPED',  t: 'Shift Reporting Tool',  d: 'A reporting layer over a tangled SQL view. Saved supervisors about 45 minutes a shift, every shift.', tags: ['C#', 'SQL', 'WPF'], role: 'Work' },
    { y: '2021', s: 'ARCHIVED', t: 'Ender3 Klipper Mod',    d: 'Klipper, BLTouch, Sprite extruder. The first printer I owned that I trust with a 36-hour print.', tags: ['Klipper', 'Hardware'], role: 'Personal' },
  ];

  return (
    <div className="page" data-screen-label="03 Projects">
      <Nav active="Projects" />

      <section className="section" style={{ paddingBottom: 48 }}>
        <K>§ 01 &nbsp;·&nbsp; PROJECTS</K>
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 64, marginTop: 24, alignItems: 'end' }}>
          <h1 className="display" style={{ fontSize: 104 }}>
            The work — <i>professional,<br/>personal,</i> and the odd thing<br/>in between.
          </h1>
          <p className="lede" style={{ maxWidth: '42ch' }}>
            Every project has a write-up: the constraint, the approach, the parts that broke,
            and what I'd do differently next time.
          </p>
        </div>
      </section>

      {/* filter bar */}
      <section className="section tight" style={{ paddingTop: 24, paddingBottom: 24, borderTop: '1px solid var(--rule-2)', borderBottom: '1px solid var(--rule-2)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 24 }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <span className="meta">FILTER —</span>
            <span className="chip solid">All</span>
            <span className="chip">Active · 2</span>
            <span className="chip">Shipped · 5</span>
            <span className="chip">Archived · 2</span>
            <span style={{ width: 1, height: 18, background: 'var(--rule)', margin: '0 8px' }} />
            <span className="chip">Work</span>
            <span className="chip">Personal</span>
          </div>
          <div style={{ display: 'flex', gap: 14, alignItems: 'center', fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-3)' }}>
            <span>SORT: NEWEST</span>
            <span>·</span>
            <span>VIEW: GRID</span>
          </div>
        </div>
      </section>

      <section className="section">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, rowGap: 56 }}>
          {projects.map(p => (
            <article key={p.t} className="proj-card">
              <Img label={p.t + ' — hero shot'} />
              <div className="body">
                <div className="row">
                  <span>{p.y}</span><span>·</span>
                  <span style={{ color: p.s === 'ACTIVE' ? 'var(--accent)' : 'var(--ink-3)' }}>
                    {p.s === 'ACTIVE' && <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: 3, background: 'var(--accent)', marginRight: 6, verticalAlign: 'middle' }} />}
                    {p.s}
                  </span>
                  <span>·</span>
                  <span>{p.role.toUpperCase()}</span>
                </div>
                <h3 className="title">{p.t}</h3>
                <p className="desc">{p.d}</p>
                <div className="tags">
                  {p.tags.map(t => <span key={t} className="chip">{t}</span>)}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section muted" style={{ paddingTop: 64, paddingBottom: 64 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <K>ARCHIVE</K>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 36, marginTop: 12 }}>
              Older projects, in a list. <i>No pictures.</i>
            </h3>
          </div>
          <a href="#" className="nav-cta" style={{ background: 'transparent', color: 'var(--ink)' }}>Browse archive →</a>
        </div>
      </section>

      <Foot />
    </div>
  );
}

// ───────────────────────────────────────────── PROJECT DETAIL

function PageProjectDetail() {
  return (
    <div className="page" data-screen-label="04 Project Detail">
      <Nav active="Projects" />

      {/* breadcrumb + meta strip */}
      <section className="section tight" style={{ paddingTop: 22, paddingBottom: 18 }}>
        <div className="meta">
          <a href="#">PROJECTS</a> &nbsp;/&nbsp; <span style={{ color: 'var(--ink)' }}>HERMES-AGENT</span>
        </div>
      </section>

      {/* HERO */}
      <section className="section" style={{ paddingTop: 16 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 64 }}>
          <div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 28 }}>
              <span className="chip"><span className="pulse" />ACTIVE</span>
              <span className="chip">2026</span>
              <span className="chip">Personal</span>
            </div>
            <h1 className="display" style={{ fontSize: 108, marginBottom: 28 }}>
              Hermes-<i>Agent.</i>
            </h1>
            <p className="lede" style={{ maxWidth: '40ch' }}>
              A home agent server: one Ubuntu box, a Pascal-era GPU, and a stack
              of local models cooperating on the parts of my workflow that don't
              need to leave the house.
            </p>
          </div>
          <div>
            <dl className="deflist" style={{ marginTop: 0 }}>
              <div className="def" style={{ gridTemplateColumns: '110px 1fr' }}>
                <dt>Role</dt>
                <dd>Solo — design, code, deploy</dd>
              </div>
              <div className="def" style={{ gridTemplateColumns: '110px 1fr' }}>
                <dt>Stack</dt>
                <dd>Python, FastAPI, Ollama, Postgres, Caddy</dd>
              </div>
              <div className="def" style={{ gridTemplateColumns: '110px 1fr' }}>
                <dt>Host</dt>
                <dd>Ubuntu 24.04 · NVIDIA P100 16GB</dd>
              </div>
              <div className="def" style={{ gridTemplateColumns: '110px 1fr' }}>
                <dt>Status</dt>
                <dd style={{ color: 'var(--accent)' }}>v0.4 · adding tool-use this month</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      {/* big hero image */}
      <section className="section" style={{ paddingTop: 24, paddingBottom: 32 }}>
        <Img label="Hero — the home server rack, doors open, P100 visible · 16:9 photograph" height={520} />
        <div className="meta" style={{ marginTop: 12 }}>FIG. 01 — THE BOX, MAY 2026.</div>
      </section>

      {/* body */}
      <section className="section" style={{ paddingTop: 32 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr', gap: 48 }}>
          <aside style={{ position: 'sticky', top: 24, alignSelf: 'start' }}>
            <div className="meta" style={{ marginBottom: 16 }}>CONTENTS</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: 13, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <li style={{ color: 'var(--accent)' }}>① The problem</li>
              <li>② Approach</li>
              <li>③ What's in the box</li>
              <li>④ What broke</li>
              <li>⑤ Where it's going</li>
            </ul>
          </aside>
          <article style={{ maxWidth: '64ch' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 44, lineHeight: 1, marginBottom: 20 }}>
              ① &nbsp; <i>The problem.</i>
            </h2>
            <p style={{ fontSize: 17, lineHeight: 1.65, color: 'var(--ink-2)', marginBottom: 18 }}>
              I do a lot of small, repeatable things at the edges of my day — summarizing the
              week, drafting a project log, tagging photos, kicking off a print, reminding
              myself to log a service hour for the dog. None of them are hard. All of them
              add up.
            </p>
            <p style={{ fontSize: 17, lineHeight: 1.65, color: 'var(--ink-2)', marginBottom: 18 }}>
              The catch is that I don't want them in someone else's data center. Some of it
              is family stuff; some is unfinished work I'd rather not type into a hosted box.
              So the question became: how cheap is it, in 2026, to run a useful agent at
              home — and what would I actually trust it to do?
            </p>

            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 44, lineHeight: 1, marginTop: 56, marginBottom: 20 }}>
              ② &nbsp; <i>Approach.</i>
            </h2>
            <p style={{ fontSize: 17, lineHeight: 1.65, color: 'var(--ink-2)', marginBottom: 22 }}>
              One small FastAPI service per capability, an event log in Postgres,
              a router that picks the right local model for the job. Gemma for the lightweight
              work, Llama for anything reasoning-heavy, a Mythos variant for narrative drafting.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, margin: '32px 0' }}>
              <Img label="Architecture diagram — services + router + model pool" ratio="4 / 3" />
              <Img label="Screenshot — agent dashboard, dark theme" ratio="4 / 3" />
            </div>

            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 44, lineHeight: 1, marginTop: 32, marginBottom: 20 }}>
              ③ &nbsp; <i>What's in the box.</i>
            </h2>
            <dl className="deflist">
              <div className="def">
                <dt>GPU</dt>
                <dd>
                  <h5>NVIDIA Tesla P100, 16 GB</h5>
                  <p>Pascal-era, cheap on the used market, surprisingly capable for 7B–13B models with quantization.</p>
                </dd>
              </div>
              <div className="def">
                <dt>Models</dt>
                <dd>
                  <h5>Gemma · Llama · Mythos</h5>
                  <p>Routed by task: Gemma for short summaries, Llama-3 for code and reasoning, Mythos when I need a draft with some voice.</p>
                </dd>
              </div>
              <div className="def">
                <dt>Front-ends</dt>
                <dd>
                  <h5>SillyTavern · ComfyUI · KoboldCPP · Ollama</h5>
                  <p>Each tool is good at one thing. The agent is the layer that decides which one to call and stitches the results back together.</p>
                </dd>
              </div>
            </dl>

            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 44, lineHeight: 1, marginTop: 56, marginBottom: 20 }}>
              ④ &nbsp; <i>What broke.</i>
            </h2>
            <p style={{ fontSize: 17, lineHeight: 1.65, color: 'var(--ink-2)' }}>
              Pretty much everything you'd expect: VRAM exhaustion the first time I asked it
              to keep two models warm, queue starvation when batched requests came in faster
              than the slowest model, a memorable Sunday where the router happily called itself.
              The fixes were boring, which is the goal.
            </p>
          </article>
        </div>
      </section>

      {/* prev / next */}
      <section className="section muted">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
          <a href="#" style={{ display: 'block' }}>
            <div className="meta" style={{ marginBottom: 8 }}>← PREVIOUS</div>
            <h4 style={{ fontFamily: 'var(--font-display)', fontSize: 32 }}>Transaxle QC Suite</h4>
            <p style={{ fontSize: 13, color: 'var(--ink-2)', marginTop: 6 }}>Line-side inspection in Electron.</p>
          </a>
          <a href="#" style={{ display: 'block', textAlign: 'right' }}>
            <div className="meta" style={{ marginBottom: 8 }}>NEXT →</div>
            <h4 style={{ fontFamily: 'var(--font-display)', fontSize: 32 }}>Smart Shop</h4>
            <p style={{ fontSize: 13, color: 'var(--ink-2)', marginTop: 6 }}>ESP32 nodes around the garage.</p>
          </a>
        </div>
      </section>

      <Foot />
    </div>
  );
}

// ───────────────────────────────────────────── NOW

function PageNow() {
  return (
    <div className="page" data-screen-label="05 Now">
      <Nav active="Now" />

      <section className="section" style={{ paddingBottom: 56 }}>
        <K>§ 01 &nbsp;·&nbsp; NOW · UPDATED MAY 12, 2026</K>
        <h1 className="display" style={{ fontSize: 132, marginTop: 24, marginBottom: 28 }}>
          What I'm <i>actually</i><br/>doing this month.
        </h1>
        <p className="lede" style={{ maxWidth: '46ch' }}>
          A snapshot, not a feed. If you're reading this and the date's gone stale, give me a nudge.
        </p>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="section-head">
          <h2>Working on.</h2>
          <span className="idx">§ 02</span>
        </div>
        <dl className="deflist">
          <div className="def">
            <dt>WORK</dt>
            <dd>
              <h5>Tool-use layer for Hermes-Agent</h5>
              <p>Letting the agent call out to a small set of well-defined tools — file search, calendar, shop sensors — without losing the plot.</p>
              <div className="item-meta">Python · FastAPI · Ollama · my Ubuntu box</div>
            </dd>
          </div>
          <div className="def">
            <dt>WORK</dt>
            <dd>
              <h5>Replacing a thirty-year-old QC station</h5>
              <p>The kind of project where the hardest part is convincing everyone that the new thing won't also be in production for thirty years.</p>
              <div className="item-meta">WPF · service bus · gauge integrations</div>
            </dd>
          </div>
          <div className="def">
            <dt>HOME</dt>
            <dd>
              <h5>BLV AM8 fine-tune pass</h5>
              <p>Input shaping dialed; running a 0.16mm benchy bench against the K1. Mostly an excuse to stand in the garage at 10pm.</p>
              <div className="item-meta">Marlin · accelerometer · spreadsheet</div>
            </dd>
          </div>
          <div className="def">
            <dt>HOME</dt>
            <dd>
              <h5>Garage occupancy sensor</h5>
              <p>An ESP32 + mmWave radar so the shop lights know when I'm out there. Half the fun is the false-positive log.</p>
              <div className="item-meta">ESP32 · ESPHome · MQTT</div>
            </dd>
          </div>
        </dl>
      </section>

      <section className="section muted">
        <div className="section-head">
          <h2>Reading & learning.</h2>
          <span className="idx">§ 03</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32 }}>
          <div style={{ borderTop: '1px solid var(--rule)', paddingTop: 16 }}>
            <div className="meta" style={{ marginBottom: 10 }}>READING</div>
            <h4 style={{ fontFamily: 'var(--font-display)', fontSize: 24, lineHeight: 1.15, marginBottom: 6 }}>Designing Data-Intensive Applications</h4>
            <p style={{ fontSize: 13, color: 'var(--ink-2)' }}>Re-read, twice a year, every year.</p>
          </div>
          <div style={{ borderTop: '1px solid var(--rule)', paddingTop: 16 }}>
            <div className="meta" style={{ marginBottom: 10 }}>WATCHING</div>
            <h4 style={{ fontFamily: 'var(--font-display)', fontSize: 24, lineHeight: 1.15, marginBottom: 6 }}>Talks from LocalLLaMA meetups</h4>
            <p style={{ fontSize: 13, color: 'var(--ink-2)' }}>Mostly to figure out what I'm doing wrong with my router.</p>
          </div>
          <div style={{ borderTop: '1px solid var(--rule)', paddingTop: 16 }}>
            <div className="meta" style={{ marginBottom: 10 }}>LEARNING</div>
            <h4 style={{ fontFamily: 'var(--font-display)', fontSize: 24, lineHeight: 1.15, marginBottom: 6 }}>Rust, again, for real this time</h4>
            <p style={{ fontSize: 13, color: 'var(--ink-2)' }}>For a small daemon I don't want to babysit.</p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <h2>Not working on.</h2>
          <span className="idx">§ 04</span>
        </div>
        <p style={{ fontFamily: 'var(--font-display)', fontSize: 32, lineHeight: 1.35, color: 'var(--ink-2)', maxWidth: '38ch' }}>
          Anything that pulls me away from supper. Twenty years in,
          I've learned to <i>protect the evenings</i> and trust morning Ben
          to figure out the hard parts.
        </p>
      </section>

      <Foot />
    </div>
  );
}

window.PageProjects = PageProjects;
window.PageProjectDetail = PageProjectDetail;
window.PageNow = PageNow;
