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
    <>
      <section className="section" style={{ paddingBottom: 56 }}>
        <div className="kicker">§ 01 &nbsp;·&nbsp; USES &nbsp;·&nbsp; THE BORING DETAILS</div>
        <h1 className="display display-xxl" style={{ marginTop: 24, marginBottom: 28 }}>
          Tools that survived<br />
          <i>five years</i> of<br />
          opinions.
        </h1>
        <p className="lede" style={{ maxWidth: '50ch' }}>
          Hardware, software, models, filaments. The list is short because
          most things were tried and quietly retired.
        </p>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <SectionHead title="Development." idx="§ 02" />
        <DefList
          rows={[
            { dt: 'EDITOR', dd: (<><h5>Visual Studio · JetBrains Rider · VS Code</h5><p>Visual Studio for the big .NET stuff, Rider when I want refactoring that doesn't blink, VS Code for everything else.</p></>) },
            { dt: 'TERMINAL', dd: (<><h5>Windows Terminal · zsh on the Ubuntu box</h5><p>Prompt is plain. Aliases are short. tmux for anything that takes longer than tea.</p></>) },
            { dt: 'AGENTS', dd: (<><h5>Claude Code · Hermes-Agent · Copilot at the office</h5><p>Different tools for different reach. Local for personal projects, hosted at work where the policy says so.</p></>) },
            { dt: 'SOURCE', dd: (<><h5>Git · GitHub · self-hosted Gitea</h5><p>Gitea for things I'd rather not put in the cloud, GitHub for the rest.</p></>) },
          ]}
        />
      </section>

      <section className="section muted">
        <SectionHead title="Hardware." idx="§ 03" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
          {[
            {
              k: 'DESK',
              items: [
                ['Workstation', 'Custom build · Ryzen 7 · 64GB · P100 for local models'],
                ['Display', '32" 4K · matte · honest colors'],
                ['Keyboard', 'Mechanical, brown switches, nothing fancy'],
                ['Mouse', 'Logitech MX Master · still the one'],
                ['Audio', 'Audeze open-backs · for thinking music'],
              ],
            },
            {
              k: 'HOMELAB',
              items: [
                ['Server', 'Ubuntu 24.04 LTS · the AI box'],
                ['GPU', 'NVIDIA Tesla P100, 16 GB'],
                ['Storage', 'A pair of mirrored 8TB drives, an SSD for hot models'],
                ['Network', 'Ubiquiti UDM-Pro · a couple of access points'],
                ['Backup', 'Off-site, encrypted, monthly snapshot'],
              ],
            },
          ].map(({ k, items }) => (
            <div key={k}>
              <div className="meta" style={{ marginBottom: 14 }}>{k}</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {items.map(([kk, v]) => (
                  <li
                    key={kk}
                    style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: 16, padding: '14px 0', borderTop: '1px solid var(--rule-2)' }}
                  >
                    <span className="meta">{kk.toUpperCase()}</span>
                    <span style={{ fontSize: 14, color: 'var(--ink-2)' }}>{v}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <SectionHead title="Models & local AI." idx="§ 04" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
          {[
            { n: 'Gemma', r: 'fast / short tasks', d: 'Summaries, classification, quick rewrites. The default.' },
            { n: 'Llama 3', r: 'code & reasoning', d: 'Anything that needs a real chain of thought, and most of the code.' },
            { n: 'Mythos', r: 'voice & drafting', d: "When I need a draft that doesn't sound like a help-desk reply." },
            { n: 'Ollama', r: 'runner', d: 'Local model server. Boring on purpose.' },
            { n: 'ComfyUI', r: 'images', d: 'Anything image-shaped. Nodes everywhere.' },
            { n: 'KoboldCPP / SillyTavern', r: 'experiments', d: 'For when an idea is weird enough to need its own sandbox.' },
          ].map((m) => (
            <div key={m.n} style={{ borderTop: '1px solid var(--rule)', paddingTop: 16 }}>
              <div className="meta" style={{ color: 'var(--accent)', marginBottom: 10 }}>{m.r.toUpperCase()}</div>
              <h4 style={{ fontFamily: 'var(--font-display)', fontSize: 28, marginBottom: 8 }}>{m.n}</h4>
              <p style={{ fontSize: 13.5, color: 'var(--ink-2)' }}>{m.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section muted">
        <SectionHead title="Workshop." idx="§ 05" />
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {[
            ['PRINTERS', 'BLV AM8 (Anet A8 chassis), Ender 3, Creality K1'],
            ['SLICER', 'OrcaSlicer · profiles per machine in source control, naturally'],
            ['FILAMENT', 'Polymaker PLA for the line, Polymaker ABS for the heat, ASA when it lives outside'],
            ['MICROCONTROLLERS', 'ESP32 (S3, C3), Pi Pico W, the occasional Arduino Nano'],
            ['BENCH', 'A Hakko iron, a Saleae Logic 8, more multimeters than is reasonable'],
          ].map(([k, v]) => (
            <li
              key={k}
              style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 24, padding: '18px 0', borderTop: '1px solid var(--rule-2)' }}
            >
              <span className="meta">{k}</span>
              <span style={{ fontSize: 14.5, color: 'var(--ink-2)' }}>{v}</span>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
