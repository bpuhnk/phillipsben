import type { Metadata } from 'next';
import Image from 'next/image';
import Chip from '@/components/chip';
import ImagePlaceholder from '@/components/image-placeholder';

export const metadata: Metadata = {
  title: 'Hobbies',
  description: '3D printers I have modded, smart-home tinkering, a local-AI homelab, and family.',
  alternates: { canonical: '/hobbies' },
};

export default function HobbiesPage() {
  return (
    <>
      <section className="section" style={{ paddingBottom: 56 }}>
        <div className="kicker">§ 01 &nbsp;·&nbsp; HOBBIES &nbsp;·&nbsp; OFF THE CLOCK</div>
        <h1 className="display" style={{ fontSize: 132, marginTop: 24, marginBottom: 28 }}>
          The reasons<br />
          the <i>garage light</i><br />
          is on at <i>11pm.</i>
        </h1>
        <p className="lede" style={{ maxWidth: '50ch' }}>
          Three threads: things that print plastic, things that blink LEDs,
          and things that run on a GPU that's older than my dog.
        </p>
      </section>

      <section
        className="section tight"
        style={{ paddingTop: 18, paddingBottom: 18, borderTop: '1px solid var(--rule-2)', borderBottom: '1px solid var(--rule-2)' }}
      >
        <div style={{ display: 'flex', gap: 48, fontFamily: 'var(--font-mono)', fontSize: 11.5, color: 'var(--ink-3)', letterSpacing: '.06em', flexWrap: 'wrap' }}>
          <span>① &nbsp; 3D PRINTING</span>
          <span>② &nbsp; EMBEDDED & SMART HOME</span>
          <span>③ &nbsp; LOCAL AI</span>
          <span>④ &nbsp; FAMILY & FAITH</span>
        </div>
      </section>

      <section className="section">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 64, alignItems: 'start' }}>
          <div>
            <span className="meta" style={{ color: 'var(--accent)' }}>① &nbsp; PRINTING</span>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 72, lineHeight: 0.98, marginTop: 16, marginBottom: 22 }}>
              Three printers,<br />
              <i>one ongoing</i><br />
              <i>argument</i> about<br />
              first layers.
            </h2>
            <p style={{ fontSize: 15, lineHeight: 1.6, color: 'var(--ink-2)', maxWidth: '38ch' }}>
              Started on an Anet A8 in pieces, ended up with a BLV AM8 in
              aluminum. The original Ender3 is the workhorse. The Creality K1
              prints things I forgot I needed by morning.
            </p>
          </div>
          <ImagePlaceholder label="The print farm — three machines on a steel bench · ambient afternoon light" ratio="4 / 3" />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, marginTop: 56 }}>
          {[
            { n: 'Anet A8 → BLV AM8', m: 'Linear rails, aluminum extrusions, Marlin 2', s: 'Heavily modified', y: '2018 → today', img: 'BLV AM8 · build-plate close-up' },
            { n: 'Creality Ender 3', m: 'Klipper, BLTouch, Sprite extruder', s: 'The reliable one', y: '2020 → today', img: 'Ender 3 · running a 30hr print' },
            { n: 'Creality K1', m: 'Stock firmware, fast benchies', s: 'The fast one', y: '2024 → today', img: 'K1 · enclosure-light glowing red' },
          ].map((p) => (
            <div key={p.n} className="proj-card" style={{ border: '1px solid var(--rule-2)' }}>
              <ImagePlaceholder label={p.img} ratio="4 / 3" />
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

      <section className="section muted">
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 64, alignItems: 'start' }}>
          <div>
            <span className="meta" style={{ color: 'var(--accent)' }}>② &nbsp; EMBEDDED & SMART HOME</span>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 72, lineHeight: 0.98, marginTop: 16, marginBottom: 22 }}>
              A house that<br />
              <i>knows things</i> —<br />
              but doesn't<br />
              <i>tell on you.</i>
            </h2>
            <p style={{ fontSize: 15, lineHeight: 1.6, color: 'var(--ink-2)', maxWidth: '42ch' }}>
              ESP32 nodes for the parts that need quick reflexes, Raspberry Pi
              for things that need a filesystem, and an Arduino in the box
              where the soldering iron lives. Everything talks MQTT, locally,
              over my own broker.
            </p>
            <div style={{ display: 'flex', gap: 8, marginTop: 22, flexWrap: 'wrap' }}>
              {['ESP32', 'ESPHome', 'Home Assistant', 'MQTT', 'Arduino', 'Raspberry Pi 5', 'KiCad', 'Soldering by lamp'].map((t) => (
                <Chip key={t}>{t}</Chip>
              ))}
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <ImagePlaceholder label="Breadboard close-up · LED test rig" ratio="1 / 1" />
            <ImagePlaceholder label="Enclosure print fresh off the K1" ratio="1 / 1" />
            <ImagePlaceholder label="Garage occupancy radar board" ratio="1 / 1" />
            <ImagePlaceholder label="Home Assistant dashboard · dim mode" ratio="1 / 1" />
          </div>
        </div>
      </section>

      <section className="section">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 64 }}>
          <div>
            <span className="meta" style={{ color: 'var(--accent)' }}>③ &nbsp; LOCAL AI</span>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 72, lineHeight: 0.98, marginTop: 16, marginBottom: 22 }}>
              A Pascal-era<br />
              GPU running<br />
              the future<br />
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
            <ImagePlaceholder label="The home rack — P100 visible, doors open, a labelled cable run · 4:3" ratio="4 / 3" />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0, marginTop: 24, borderTop: '1px solid var(--rule-2)', borderBottom: '1px solid var(--rule-2)' }}>
              {[
                { k: 'GPU', v: 'P100 16GB' },
                { k: 'RAM', v: '64 GB' },
                { k: 'MODELS', v: '7' },
                { k: 'POWER', v: '~180W' },
              ].map((s) => (
                <div key={s.k} style={{ padding: '18px 16px', borderRight: '1px solid var(--rule-2)' }}>
                  <div className="meta" style={{ marginBottom: 6 }}>{s.k}</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, letterSpacing: '-0.02em' }}>{s.v}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section dark" style={{ padding: 0 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.25fr 1fr', alignItems: 'stretch', minHeight: 640 }}>
          <div style={{ position: 'relative', overflow: 'hidden' }}>
            <Image
              src="/images/ben-matt-lights.jpeg"
              alt="Ben and his son at a holiday light display, fist-bumping between two stone thrones lit in green, blue and red."
              width={1200}
              height={900}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
            <div className="meta" style={{ position: 'absolute', bottom: 18, left: 22, color: 'rgba(255,255,255,.7)', textTransform: 'uppercase' }}>
              Fig. — with my son, December 2025.
            </div>
          </div>
          <div style={{ padding: '88px 64px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div className="kicker">④ &nbsp;·&nbsp; FAMILY & FAITH</div>
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
    </>
  );
}
