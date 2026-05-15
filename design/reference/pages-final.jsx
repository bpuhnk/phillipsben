// pages-final.jsx — Hobbies, Uses, Contact, 404

// ───────────────────────────────────────────── HOBBIES

function PageHobbies() {
  return (
    <div className="page" data-screen-label="06 Hobbies">
      <Nav active="Hobbies" />

      <section className="section" style={{ paddingBottom: 56 }}>
        <K>§ 01 &nbsp;·&nbsp; HOBBIES &nbsp;·&nbsp; OFF THE CLOCK</K>
        <h1 className="display" style={{ fontSize: 132, marginTop: 24, marginBottom: 28 }}>
          The reasons<br/>
          the <i>garage light</i><br/>
          is on at <i>11pm.</i>
        </h1>
        <p className="lede" style={{ maxWidth: '50ch' }}>
          Three threads: things that print plastic, things that blink LEDs,
          and things that run on a GPU that's older than my dog.
        </p>
      </section>

      {/* index strip */}
      <section className="section tight" style={{ paddingTop: 18, paddingBottom: 18, borderTop: '1px solid var(--rule-2)', borderBottom: '1px solid var(--rule-2)' }}>
        <div style={{ display: 'flex', gap: 48, fontFamily: 'var(--font-mono)', fontSize: 11.5, color: 'var(--ink-3)', letterSpacing: '.06em' }}>
          <span>① &nbsp; 3D PRINTING</span>
          <span>② &nbsp; EMBEDDED &amp; SMART HOME</span>
          <span>③ &nbsp; LOCAL AI</span>
          <span>④ &nbsp; FAMILY &amp; FAITH</span>
        </div>
      </section>

      {/* 3D printing */}
      <section className="section">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 64, alignItems: 'start' }}>
          <div>
            <span className="meta" style={{ color: 'var(--accent)' }}>① &nbsp; PRINTING</span>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 72, lineHeight: 0.98, marginTop: 16, marginBottom: 22 }}>
              Three printers,<br/>
              <i>one ongoing</i><br/>
              <i>argument</i> about<br/>
              first layers.
            </h2>
            <p style={{ fontSize: 15, lineHeight: 1.6, color: 'var(--ink-2)', maxWidth: '38ch' }}>
              Started on an Anet A8 in pieces, ended up with a BLV AM8 in
              aluminum. The original Ender3 is the workhorse. The Creality K1
              prints things I forgot I needed by morning.
            </p>
          </div>
          <Img label="The print farm — three machines on a steel bench · ambient afternoon light" ratio="4 / 3" />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, marginTop: 56 }}>
          {[
            { n: 'Anet A8 → BLV AM8', m: 'Linear rails, aluminum extrusions, Marlin 2', s: 'Heavily modified', y: '2018 → today', img: 'BLV AM8 · build-plate close-up' },
            { n: 'Creality Ender 3', m: 'Klipper, BLTouch, Sprite extruder', s: 'The reliable one', y: '2020 → today', img: 'Ender 3 · running a 30hr print' },
            { n: 'Creality K1', m: 'Stock firmware, fast benchies', s: 'The fast one', y: '2024 → today', img: 'K1 · enclosure-light glowing red' },
          ].map(p => (
            <div key={p.n} className="proj-card" style={{ border: '1px solid var(--rule-2)' }}>
              <Img label={p.img} ratio="4 / 3" />
              <div className="body">
                <div className="row">
                  <span>{p.y}</span><span>·</span>
                  <span style={{ color: 'var(--accent)' }}>{p.s.toUpperCase()}</span>
                </div>
                <h4 className="title" style={{ fontSize: 22 }}>{p.n}</h4>
                <p className="desc">{p.m}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* embedded */}
      <section className="section muted">
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 64, alignItems: 'start' }}>
          <div>
            <span className="meta" style={{ color: 'var(--accent)' }}>② &nbsp; EMBEDDED &amp; SMART HOME</span>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 72, lineHeight: 0.98, marginTop: 16, marginBottom: 22 }}>
              A house that<br/>
              <i>knows things</i> —<br/>
              but doesn't<br/>
              <i>tell on you.</i>
            </h2>
            <p style={{ fontSize: 15, lineHeight: 1.6, color: 'var(--ink-2)', maxWidth: '42ch' }}>
              ESP32 nodes for the parts that need quick reflexes, Raspberry Pi
              for things that need a filesystem, and an Arduino in the box
              where the soldering iron lives. Everything talks MQTT, locally,
              over my own broker.
            </p>
            <div style={{ display: 'flex', gap: 8, marginTop: 22, flexWrap: 'wrap' }}>
              {['ESP32', 'ESPHome', 'Home Assistant', 'MQTT', 'Arduino', 'Raspberry Pi 5', 'KiCad', 'Soldering by lamp'].map(t => (
                <span key={t} className="chip">{t}</span>
              ))}
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Img label="Breadboard close-up · LED test rig" ratio="1 / 1" />
            <Img label="Enclosure print fresh off the K1" ratio="1 / 1" />
            <Img label="Garage occupancy radar board" ratio="1 / 1" />
            <Img label="Home Assistant dashboard · dim mode" ratio="1 / 1" />
          </div>
        </div>
      </section>

      {/* local AI */}
      <section className="section">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 64 }}>
          <div>
            <span className="meta" style={{ color: 'var(--accent)' }}>③ &nbsp; LOCAL AI</span>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 72, lineHeight: 0.98, marginTop: 16, marginBottom: 22 }}>
              A Pascal-era<br/>
              GPU running<br/>
              the future<br/>
              <i>in my closet.</i>
            </h2>
            <p style={{ fontSize: 15, lineHeight: 1.6, color: 'var(--ink-2)', maxWidth: '38ch' }}>
              An NVIDIA P100 picked up cheap, a small Ubuntu box, and a stack
              of front-ends — SillyTavern, ComfyUI, KoboldCPP, Ollama —
              wrapped by my Hermes-Agent on top.
            </p>
            <p style={{ fontSize: 15, lineHeight: 1.6, color: 'var(--ink-2)', maxWidth: '38ch', marginTop: 14 }}>
              I run Gemma for fast work, Llama-3 for code and reasoning, Mythos
              for anything that needs a voice. The point isn't to beat the
              hosted models — it's that nothing leaves the house.
            </p>
          </div>
          <div>
            <Img label="The home rack — P100 visible, doors open, a labelled cable run · 4:3" ratio="4 / 3" />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0, marginTop: 24, borderTop: '1px solid var(--rule-2)', borderBottom: '1px solid var(--rule-2)' }}>
              {[
                { k: 'GPU', v: 'P100 16GB' },
                { k: 'RAM', v: '64 GB' },
                { k: 'MODELS', v: '7' },
                { k: 'POWER', v: '~180W' },
              ].map(s => (
                <div key={s.k} style={{ padding: '18px 16px', borderRight: '1px solid var(--rule-2)' }}>
                  <div className="meta" style={{ marginBottom: 6 }}>{s.k}</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, letterSpacing: '-0.02em' }}>{s.v}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* family / faith — uses the lights photo full-bleed against the dark band.
          Night-RGB photography reads as intentional against #1A1816; pairs nicely
          with the LED / embedded thread two sections up. */}
      <section className="section dark" style={{ padding: 0 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.25fr 1fr', alignItems: 'stretch', minHeight: 640 }}>
          <div style={{ position: 'relative', overflow: 'hidden' }}>
            <img
              src="images/ben-matt-lights.jpeg"
              alt="Ben and his son at a holiday light display, fist-bumping between two stone thrones lit in green, blue and red."
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
            <div style={{ position: 'absolute', bottom: 18, left: 22, fontFamily: 'var(--font-mono)', fontSize: 10.5, letterSpacing: '.1em', color: 'rgba(255,255,255,.7)', textTransform: 'uppercase' }}>
              Fig. — with my son, December 2025.
            </div>
          </div>
          <div style={{ padding: '88px 64px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <K>④ &nbsp;·&nbsp; FAMILY &amp; FAITH</K>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: 42, lineHeight: 1.15, letterSpacing: '-0.02em', marginTop: 22 }}>
              Married twenty years, a daughter in college, a son
              nearly there, a dog who is unreasonably opinionated
              about supper. We're Christians, southerners, and
              quiet about both — we mostly just <i style={{ color: '#E8B895' }}>show up</i>.
            </p>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'rgba(250,248,244,0.55)', marginTop: 32, maxWidth: '46ch', lineHeight: 1.55 }}>
              I'm always happy to talk about churches that take
              both questions and people seriously, dogs that run
              the household, and what teenagers think about right
              now.
            </p>
          </div>
        </div>
      </section>

      <Foot />
    </div>
  );
}

// ───────────────────────────────────────────── USES

function PageUses() {
  return (
    <div className="page" data-screen-label="07 Uses">
      <Nav active="Uses" />

      <section className="section" style={{ paddingBottom: 56 }}>
        <K>§ 01 &nbsp;·&nbsp; USES &nbsp;·&nbsp; THE BORING DETAILS</K>
        <h1 className="display" style={{ fontSize: 124, marginTop: 24, marginBottom: 28 }}>
          Tools that survived<br/>
          <i>five years</i> of<br/>
          opinions.
        </h1>
        <p className="lede" style={{ maxWidth: '50ch' }}>
          Hardware, software, models, filaments. The list is short because
          most things were tried and quietly retired.
        </p>
      </section>

      {/* Editor + dev env */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="section-head">
          <h2>Development.</h2>
          <span className="idx">§ 02</span>
        </div>
        <dl className="deflist">
          <div className="def">
            <dt>EDITOR</dt>
            <dd>
              <h5>Visual Studio · JetBrains Rider · VS Code</h5>
              <p>Visual Studio for the big .NET stuff, Rider when I want refactoring that doesn't blink, VS Code for everything else.</p>
            </dd>
          </div>
          <div className="def">
            <dt>TERMINAL</dt>
            <dd>
              <h5>Windows Terminal · zsh on the Ubuntu box</h5>
              <p>Prompt is plain. Aliases are short. tmux for anything that takes longer than tea.</p>
            </dd>
          </div>
          <div className="def">
            <dt>AGENTS</dt>
            <dd>
              <h5>Claude Code · Hermes-Agent · Copilot at the office</h5>
              <p>Different tools for different reach. Local for personal projects, hosted at work where the policy says so.</p>
            </dd>
          </div>
          <div className="def">
            <dt>SOURCE</dt>
            <dd>
              <h5>Git · GitHub · self-hosted Gitea</h5>
              <p>Gitea for things I'd rather not put in the cloud, GitHub for the rest.</p>
            </dd>
          </div>
        </dl>
      </section>

      <section className="section muted">
        <div className="section-head">
          <h2>Hardware.</h2>
          <span className="idx">§ 03</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
          <div>
            <div className="meta" style={{ marginBottom: 14 }}>DESK</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {[
                ['Workstation', 'Custom build · Ryzen 7 · 64GB · P100 for local models'],
                ['Display', '32" 4K · matte · honest colors'],
                ['Keyboard', 'Mechanical, brown switches, nothing fancy'],
                ['Mouse', 'Logitech MX Master · still the one'],
                ['Audio', 'Audeze open-backs · for thinking music'],
              ].map(([k, v]) => (
                <li key={k} style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: 16, padding: '14px 0', borderTop: '1px solid var(--rule-2)' }}>
                  <span className="meta">{k.toUpperCase()}</span>
                  <span style={{ fontSize: 14, color: 'var(--ink-2)' }}>{v}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="meta" style={{ marginBottom: 14 }}>HOMELAB</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {[
                ['Server', 'Ubuntu 24.04 LTS · the AI box'],
                ['GPU', 'NVIDIA Tesla P100, 16 GB'],
                ['Storage', 'A pair of mirrored 8TB drives, an SSD for hot models'],
                ['Network', 'Ubiquiti UDM-Pro · a couple of access points'],
                ['Backup', 'Off-site, encrypted, monthly snapshot'],
              ].map(([k, v]) => (
                <li key={k} style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: 16, padding: '14px 0', borderTop: '1px solid var(--rule-2)' }}>
                  <span className="meta">{k.toUpperCase()}</span>
                  <span style={{ fontSize: 14, color: 'var(--ink-2)' }}>{v}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <h2>Models & local AI.</h2>
          <span className="idx">§ 04</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
          {[
            { n: 'Gemma', r: 'fast / short tasks', d: 'Summaries, classification, quick rewrites. The default.' },
            { n: 'Llama 3', r: 'code & reasoning', d: 'Anything that needs a real chain of thought, and most of the code.' },
            { n: 'Mythos', r: 'voice & drafting', d: 'When I need a draft that doesn\'t sound like a help-desk reply.' },
            { n: 'Ollama', r: 'runner', d: 'Local model server. Boring on purpose.' },
            { n: 'ComfyUI', r: 'images', d: 'Anything image-shaped. Nodes everywhere.' },
            { n: 'KoboldCPP / SillyTavern', r: 'experiments', d: 'For when an idea is weird enough to need its own sandbox.' },
          ].map(m => (
            <div key={m.n} style={{ borderTop: '1px solid var(--rule)', paddingTop: 16 }}>
              <div className="meta" style={{ color: 'var(--accent)', marginBottom: 10 }}>{m.r.toUpperCase()}</div>
              <h4 style={{ fontFamily: 'var(--font-display)', fontSize: 28, marginBottom: 8 }}>{m.n}</h4>
              <p style={{ fontSize: 13.5, color: 'var(--ink-2)' }}>{m.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section muted">
        <div className="section-head">
          <h2>Workshop.</h2>
          <span className="idx">§ 05</span>
        </div>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {[
            ['PRINTERS', 'BLV AM8 (Anet A8 chassis), Ender 3, Creality K1'],
            ['SLICER', 'OrcaSlicer · profiles per machine in source control, naturally'],
            ['FILAMENT', 'Polymaker PLA for the line, Polymaker ABS for the heat, ASA when it lives outside'],
            ['MICROCONTROLLERS', 'ESP32 (S3, C3), Pi Pico W, the occasional Arduino Nano'],
            ['BENCH', 'A Hakko iron, a Saleae Logic 8, more multimeters than is reasonable'],
          ].map(([k, v]) => (
            <li key={k} style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 24, padding: '18px 0', borderTop: '1px solid var(--rule-2)' }}>
              <span className="meta">{k}</span>
              <span style={{ fontSize: 14.5, color: 'var(--ink-2)' }}>{v}</span>
            </li>
          ))}
        </ul>
      </section>

      <Foot />
    </div>
  );
}

// ───────────────────────────────────────────── CONTACT

function PageContact() {
  return (
    <div className="page" data-screen-label="08 Contact">
      <Nav active="Contact" />

      <section className="section" style={{ paddingBottom: 64 }}>
        <K><span style={{ color: 'var(--accent)' }}>●</span> &nbsp; OPEN TO INTERESTING WORK · MAY 2026</K>
        <h1 className="display" style={{ fontSize: 144, marginTop: 24, marginBottom: 32 }}>
          Let's <i>talk.</i>
        </h1>
        <p className="lede" style={{ maxWidth: '46ch' }}>
          The fastest way is email. The second-fastest is a 30-minute call. There
          is no contact form with twelve required fields.
        </p>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
          <a href="#" style={{ display: 'block', padding: 32, border: '1px solid var(--rule)', background: 'var(--bg)' }}>
            <div className="meta" style={{ marginBottom: 14 }}>① &nbsp; EMAIL</div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 40, lineHeight: 1, marginBottom: 12 }}>
              hello@<br/>phillipsben.<i>com</i>
            </h3>
            <p style={{ fontSize: 13.5, color: 'var(--ink-2)' }}>
              I read everything. I usually reply inside two days, faster if it's interesting.
            </p>
          </a>
          <a href="#" style={{ display: 'block', padding: 32, border: '1px solid var(--rule)', background: 'var(--bg)' }}>
            <div className="meta" style={{ marginBottom: 14 }}>② &nbsp; CALENDAR</div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 40, lineHeight: 1, marginBottom: 12 }}>
              Book a <i>30-min</i><br/>chat →
            </h3>
            <p style={{ fontSize: 13.5, color: 'var(--ink-2)' }}>
              Tuesdays & Thursdays, US Eastern. No agenda needed. Camera optional.
            </p>
          </a>
          <a href="#" style={{ display: 'block', padding: 32, background: 'var(--ink)', color: 'var(--bg)' }}>
            <div className="meta" style={{ marginBottom: 14, color: 'rgba(250,248,244,.5)' }}>③ &nbsp; RÉSUMÉ</div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 40, lineHeight: 1, marginBottom: 12 }}>
              Download <i>PDF</i><br/>résumé →
            </h3>
            <p style={{ fontSize: 13.5, color: 'rgba(250,248,244,.6)' }}>
              One page. Two if you count the cover. Updated May 2026.
            </p>
          </a>
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <h2>Elsewhere.</h2>
          <span className="idx">§ 02</span>
        </div>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {[
            ['GITHUB',   '@phillipsben',                'Most personal projects, plus a long history of small tools.'],
            ['LINKEDIN', '/in/phillipsben',             'For when you need the formal version.'],
            ['MASTODON', '@phillipsben@hachyderm.io',   'Occasional posts about builds and books.'],
            ['RSS',      'phillipsben.com/feed.xml',    'Every project write-up, /now updates, and the rare essay.'],
          ].map(([k, v, d]) => (
            <li key={k} style={{ display: 'grid', gridTemplateColumns: '120px 280px 1fr 40px', gap: 32, alignItems: 'baseline', padding: '24px 0', borderTop: '1px solid var(--rule-2)' }}>
              <span className="meta">{k}</span>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 26 }}>{v}</span>
              <span style={{ fontSize: 13.5, color: 'var(--ink-2)' }}>{d}</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 14, color: 'var(--accent)', textAlign: 'right' }}>↗</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="section muted">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: 64 }}>
          <K>§ 03 &nbsp;·&nbsp; A FEW HONEST NOTES</K>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontFamily: 'var(--font-display)', fontSize: 22, lineHeight: 1.45, color: 'var(--ink-2)' }}>
            <li style={{ padding: '14px 0', borderTop: '1px solid var(--rule)' }}>I'm not actively job-hunting, but I'm always open to <i>interesting</i> work.</li>
            <li style={{ padding: '14px 0', borderTop: '1px solid var(--rule)' }}>I live in the Southeast US — happy to travel, happiest remote.</li>
            <li style={{ padding: '14px 0', borderTop: '1px solid var(--rule)' }}>I don't take work that asks me to compromise on the family rhythm.</li>
            <li style={{ padding: '14px 0', borderTop: '1px solid var(--rule)', borderBottom: '1px solid var(--rule)' }}>If you're a recruiter sending a script — please at least <i>read</i> the site first.</li>
          </ul>
        </div>
      </section>

      <Foot />
    </div>
  );
}

// ───────────────────────────────────────────── 404

function Page404() {
  return (
    <div className="page" data-screen-label="09 404">
      <Nav active="" />
      <section className="section" style={{ paddingTop: 120, paddingBottom: 120, textAlign: 'center' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--ink-3)', letterSpacing: '.14em', marginBottom: 28 }}>
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
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <a href="#" className="nav-cta">Back to home</a>
          <a href="#" className="nav-cta" style={{ background: 'transparent', color: 'var(--ink)' }}>Send me the broken link →</a>
        </div>
        <div style={{ marginTop: 88, display: 'flex', gap: 56, justifyContent: 'center', fontFamily: 'var(--font-mono)', fontSize: 11.5, color: 'var(--ink-3)', letterSpacing: '.06em' }}>
          <span>TRY /BIO</span>
          <span>TRY /PROJECTS</span>
          <span>TRY /NOW</span>
          <span>TRY /HOBBIES</span>
          <span>TRY /USES</span>
        </div>
      </section>
      <Foot />
    </div>
  );
}

window.PageHobbies = PageHobbies;
window.PageUses = PageUses;
window.PageContact = PageContact;
window.Page404 = Page404;
