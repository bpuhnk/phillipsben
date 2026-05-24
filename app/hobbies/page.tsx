import type { Metadata } from 'next';
import Image from 'next/image';
import Chip from '@/components/chip';
import DuoPhoto from '@/components/duo-photo';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Hobbies',
  description: '3D printers I have modded, smart-home tinkering, a local-AI homelab, and family.',
  path: '/hobbies',
});

export default function HobbiesPage() {
  return (
    <div className="hobbies-page">
      <section className="section" style={{ paddingBottom: 56 }}>
        <div className="kicker">§ 01 &nbsp;·&nbsp; HOBBIES &nbsp;·&nbsp; OFF THE CLOCK</div>
        <h1 className="display display-xxl" style={{ marginTop: 24, marginBottom: 28 }}>
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
        className="section tight hobbies-index-strip"
        style={{ paddingTop: 18, paddingBottom: 18, borderTop: '1px solid var(--rule-2)', borderBottom: '1px solid var(--rule-2)' }}
      >
        <div className="hobbies-index-strip-inner">
          <a href="#printing">① &nbsp; 3D PRINTING</a>
          <a href="#embedded">② &nbsp; EMBEDDED & SMART HOME</a>
          <a href="#local-ai">③ &nbsp; LOCAL AI</a>
          <a href="#family">④ &nbsp; FAMILY & FAITH</a>
        </div>
      </section>

      <section id="printing" className="section">
        <div className="hobbies-printing-hero">
          <div>
            <span className="meta" style={{ color: 'var(--accent)' }}>① &nbsp; PRINTING</span>
            <h2 className="display-xl hobbies-h2" style={{ marginTop: 16, marginBottom: 22 }}>
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
          <DuoPhoto
            src="/images/hobbies/printing-hero.webp"
            alt="Three 3D printers on a steel workbench in afternoon light."
            label="The print farm — three machines on a steel bench · ambient afternoon light"
            ratio="4 / 3"
          />
        </div>

        <div className="hobbies-printer-grid">
          {[
            { n: 'Anet A8 → BLV AM8', m: 'Linear rails, aluminum extrusions, Klipper + Mainsail', s: 'Heavily modified', y: '2018 → today', file: 'am8', alt: 'Close-up of the BLV AM8 build plate.', img: 'BLV AM8 · build-plate close-up' },
            { n: 'Creality Ender 3', m: 'Marlin, BLTouch, E3D hotend', s: 'The reliable one', y: '2020 → today', file: 'ender3', alt: 'The Ender 3 mid-way through a long print.', img: 'Ender 3 · running a 30hr print' },
            { n: 'Creality K1', m: 'Stock firmware, fast benchies', s: 'The fast one', y: '2024 → today', file: 'k1', alt: 'The Creality K1 with its enclosure light glowing.', img: 'K1 · enclosure-light glowing red' },
          ].map((p) => (
            <div key={p.n} className="proj-card" style={{ border: '1px solid var(--rule-2)' }}>
              <DuoPhoto src={`/images/hobbies/${p.file}.webp`} alt={p.alt} label={p.img} ratio="4 / 3" />
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

      <section id="embedded" className="section muted">
        <div className="hobbies-embedded-hero">
          <div>
            <span className="meta" style={{ color: 'var(--accent)' }}>② &nbsp; EMBEDDED & SMART HOME</span>
            <h2 className="display-xl hobbies-h2" style={{ marginTop: 16, marginBottom: 22 }}>
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
            <div className="hobbies-embedded-chips">
              {['ESP32', 'ESPHome', 'Home Assistant', 'MQTT', 'Arduino', 'Raspberry Pi 4', 'KiCad', 'Soldering by lamp'].map((t) => (
                <Chip key={t}>{t}</Chip>
              ))}
            </div>
          </div>
          <div className="hobbies-embedded-grid">
            <DuoPhoto src="/images/hobbies/breadboard.webp" alt="Breadboard with an LED test rig wired up." label="Breadboard close-up · LED test rig" ratio="1 / 1" />
            <DuoPhoto src="/images/hobbies/enclosure.webp" alt="A freshly printed electronics enclosure off the K1." label="Enclosure print fresh off the K1" ratio="1 / 1" />
            <DuoPhoto src="/images/hobbies/radar.webp" alt="The ESP32 mmWave garage-occupancy radar board." label="Garage occupancy radar board" ratio="1 / 1" />
            <DuoPhoto src="/images/hobbies/home-assistant.webp" alt="A Home Assistant dashboard in dim mode." label="Home Assistant dashboard · dim mode" ratio="1 / 1" />
          </div>
        </div>
      </section>

      <section id="local-ai" className="section">
        <div className="hobbies-ai-hero">
          <div>
            <span className="meta" style={{ color: 'var(--accent)' }}>③ &nbsp; LOCAL AI</span>
            <h2 className="display-xl hobbies-h2" style={{ marginTop: 16, marginBottom: 22 }}>
              A Pascal-era<br />
              GPU running<br />
              the future<br />
              <i>in my closet.</i>
            </h2>
            <p style={{ fontSize: 15, lineHeight: 1.6, color: 'var(--ink-2)', maxWidth: '38ch' }}>
              An NVIDIA P100 picked up cheap, riding shotgun in my Pop!_OS
              workstation, and a stack of front-ends — SillyTavern, ComfyUI,
              KoboldCPP, Ollama — fronted by my own Switchboard broker.
            </p>
            <p style={{ fontSize: 15, lineHeight: 1.6, color: 'var(--ink-2)', maxWidth: '38ch', marginTop: 14 }}>
              I run Gemma 4 for fast work and Nemo for longer conversations, with
              smaller models handling speech-to-text, text-to-speech, embeddings,
              and image generation. The point isn't to beat the hosted models —
              it's that nothing leaves the house.
            </p>
          </div>
          <div>
            <DuoPhoto
              src="/images/hobbies/rack.webp"
              alt="The Pop!_OS workstation with the Tesla P100 card visible inside the open case."
              label="The workstation — Tesla P100 visible inside the case · 4:3"
              ratio="4 / 3"
            />
            <div className="hobbies-ai-stats m-stat-grid">
              {[
                { k: 'GPU', v: 'P100 16GB' },
                { k: 'RAM', v: '32 GB' },
                { k: 'MODALITIES', v: '5' },
                { k: 'POWER', v: '~180W' },
              ].map((s) => (
                <div key={s.k} className="hobbies-ai-stat">
                  <div className="meta">{s.k}</div>
                  <div className="hobbies-ai-stat-val">{s.v}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="family" className="section dark" style={{ padding: 0 }}>
        <div className="family-band">
          <div className="family-band-img">
            <Image
              src="/images/ben-matt-lights.jpeg"
              alt="Ben and his son at a holiday light display, fist-bumping between two stone thrones lit in green, blue and red."
              width={1200}
              height={900}
              sizes="(max-width: 720px) 100vw, 50vw"
              priority={false}
            />
            <div className="meta family-band-fig-overlay">
              Fig. — with my son, December 2025.
            </div>
          </div>
          <div className="family-band-copy">
            <div className="meta family-band-fig-inline">FIG. — WITH MY SON, DECEMBER 2025.</div>
            <div className="kicker">④ &nbsp;·&nbsp; FAMILY & FAITH</div>
            <p className="display-m" style={{ marginTop: 22 }}>
              Married twenty years. Our daughter spends her days
              teaching other people's little ones now; our son is
              still a teenager, in no particular hurry to be
              otherwise; the dog stays unreasonably opinionated
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
    </div>
  );
}
