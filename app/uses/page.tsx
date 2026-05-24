import type { Metadata } from 'next';
import SectionHead from '@/components/section-head';
import DefList from '@/components/def-list';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Uses',
  description: 'Hardware, software, models, filaments. The boring details that take years to settle on.',
  path: '/uses',
});

export default function UsesPage() {
  return (
    <div className="uses-page">
      <section className="section" style={{ paddingBottom: 56 }}>
        <div className="kicker">§ 01 &nbsp;·&nbsp; USES &nbsp;·&nbsp; WHAT RUNS WHERE</div>
        <h1 className="display display-xxl" style={{ marginTop: 24, marginBottom: 28 }}>
          Everything I<br />
          <i>actually</i> run.
        </h1>
        <p className="lede" style={{ maxWidth: '52ch' }}>
          Two machines, a pile of local models, and a garage of printers.
          The honest inventory — not the wishlist.
        </p>
      </section>

      <section className="section uses-dev" style={{ paddingTop: 0 }}>
        <SectionHead title="Development." idx="§ 02" />
        <DefList
          rows={[
            { dt: 'EDITOR', dd: (<><h5>VS Code</h5><p>One editor now. The rest got tried and quietly retired — which is the whole theme of this page.</p></>) },
            { dt: 'TERMINAL', dd: (<><h5>bash on Pop!_OS</h5><p>Prompt is plain. Aliases are short. tmux for anything that outlasts the kettle.</p></>) },
            { dt: 'AGENTS', dd: (<><h5>Claude Code · Hermes-Agent</h5><p>Claude Code at the desk — it's writing this. Hermes-Agent runs the dashboard on its own schedule.</p></>) },
            { dt: 'SOURCE', dd: (<><h5>Git · GitHub</h5><p>Git for everything. GitHub for the parts that are meant to be seen.</p></>) },
          ]}
        />
      </section>

      <section className="section muted uses-hw">
        <SectionHead title="Hardware." idx="§ 03" />
        <p className="lede" style={{ maxWidth: '54ch', fontSize: 16, marginTop: -4, marginBottom: 30 }}>
          Two machines, opposite jobs. One is all muscle and rarely awake.
          The other is a 2012 laptop that never sleeps and quietly runs
          everything — including this site.
        </p>
        <div className="uses-hw-grid">
          {[
            {
              k: 'WORKSTATION · pop-os',
              items: [
                ['OS', 'Pop!_OS 24.04 LTS'],
                ['CPU', 'Ryzen 5 3600X · 6 cores / 12 threads'],
                ['Memory', '32 GB'],
                ['Display', 'GeForce GTX 1660 SUPER · 6 GB'],
                ['Compute', 'Tesla P100 · 16 GB · the local-AI muscle'],
                ['Storage', 'NVMe boot · working disks for models & data'],
              ],
            },
            {
              k: 'ALWAYS-ON · host01',
              items: [
                ['Machine', "Dell Latitude E6430 · a 2012 laptop that won't quit"],
                ['OS', 'Ubuntu 24.04 LTS'],
                ['CPU', 'Core i7-3740QM · 4 cores / 8 threads'],
                ['Memory', '8 GB'],
                ['Disk', '450 GB SSD'],
                ['Runs', 'This site, tunnels, home automation, AI front-ends & a handful of self-hosted apps — 24/7'],
              ],
            },
          ].map(({ k, items }) => (
            <div key={k} className="uses-hw-block">
              <div className="meta uses-hw-label">{k}</div>
              <ul className="uses-hw-list">
                {items.map(([kk, v]) => (
                  <li key={kk} className="uses-hw-row">
                    <span className="meta">{kk.toUpperCase()}</span>
                    <span className="uses-hw-val">{v}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="meta" style={{ marginTop: 28, color: 'var(--ink-2)' }}>
          ON DECK&nbsp;·&nbsp;Dell PowerEdge R610 · dual Xeon · ECC DDR3 — the
          rack meant to take the always-on load off the laptop.
        </p>
      </section>

      <section className="section uses-models">
        <SectionHead title="Models & local AI." idx="§ 04" />
        <div className="uses-models-grid">
          {[
            { n: 'Switchboard', r: 'router', d: 'My FastAPI front door to the P100. Picks the model per request and preempts the toys when real work shows up.' },
            { n: 'Ollama', r: 'runner', d: 'Serves the language models. Boring on purpose.' },
            { n: 'Gemma 4 · Mistral Nemo', r: 'language', d: 'The workhorses — a small Gemma for quick passes, a custom Nemo build behind the site assistant.' },
            { n: 'ComfyUI · SDXL', r: 'images', d: 'Dreamshaper and Juggernaut checkpoints. Every hero image and duotone on this site came out of here.' },
            { n: 'Whisper · Kokoro', r: 'voice', d: 'faster-whisper listening, Kokoro talking back. Speech in, speech out.' },
            { n: 'KoboldCPP · SillyTavern', r: 'sandbox', d: 'For when an idea is weird enough to need its own corner.' },
          ].map((m) => (
            <div key={m.n} className="uses-models-row">
              <div className="meta uses-models-role">{m.r.toUpperCase()}</div>
              <h4 className="uses-models-name">{m.n}</h4>
              <p className="uses-models-desc">{m.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section muted uses-workshop">
        <SectionHead title="Workshop." idx="§ 05" />
        <p className="lede" style={{ maxWidth: '54ch', fontSize: 16, marginTop: -4, marginBottom: 30 }}>
          Four printers in the garage — three FDM, one resin — and the slow
          accretion of bits and fasteners that every workshop becomes.
        </p>
        <ul className="uses-workshop-list">
          {[
            ['PRINTERS', 'BLV AM8 (Anet A8 chassis) · Ender 3 · Creality K1 · Creality Halot (resin)'],
            ['FIRMWARE', 'Klipper on the BLV (Moonraker + Mainsail), Marlin on the Ender 3, stock on the K1'],
            ['SLICER', 'OrcaSlicer across the FDM machines'],
            ['FILAMENT', 'Polymaker — PLA, ASA, PETG, and CF-reinforced nylon (PA6 / PA12)'],
            ['ELECTRONICS', 'ESP32 (WROOM, S3), Raspberry Pi 1–4 (a 5 is overdue), the odd Arduino'],
            ['BENCH', 'Soldering irons, multimeters, a 150 W variable supply, hex & Torx bits galore — and metric fasteners in every size, everywhere'],
          ].map(([k, v]) => (
            <li key={k} className="uses-workshop-row">
              <span className="meta">{k}</span>
              <span className="uses-workshop-val">{v}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
