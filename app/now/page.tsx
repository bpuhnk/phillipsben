import type { Metadata } from 'next';
import SectionHead from '@/components/section-head';
import DefList from '@/components/def-list';

export const metadata: Metadata = {
  title: 'Now',
  description: "What I'm actually doing this month. A snapshot, not a feed.",
  alternates: { canonical: '/now' },
};

// Updated monthly; America/Chicago timezone.
const UPDATED = 'May 12, 2026';

export default function NowPage() {
  return (
    <>
      <section className="section" style={{ paddingBottom: 56 }}>
        <div className="kicker">§ 01 &nbsp;·&nbsp; NOW · UPDATED {UPDATED.toUpperCase()}</div>
        <h1 className="display" style={{ fontSize: 132, marginTop: 24, marginBottom: 28 }}>
          What I'm <i>actually</i><br />doing this month.
        </h1>
        <p className="lede" style={{ maxWidth: '46ch' }}>
          A snapshot, not a feed. If you're reading this and the date's gone stale, give me a nudge.
        </p>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <SectionHead title="Working on." idx="§ 02" />
        <DefList
          rows={[
            {
              dt: 'WORK',
              dd: (
                <>
                  <h5>Tool-use layer for Hermes-Agent</h5>
                  <p>Letting the agent call out to a small set of well-defined tools — file search, calendar, shop sensors — without losing the plot.</p>
                  <div className="item-meta">Python · FastAPI · Ollama · my Ubuntu box</div>
                </>
              ),
            },
            {
              dt: 'WORK',
              dd: (
                <>
                  <h5>Replacing a thirty-year-old QC station</h5>
                  <p>The kind of project where the hardest part is convincing everyone that the new thing won't also be in production for thirty years.</p>
                  <div className="item-meta">WPF · service bus · gauge integrations</div>
                </>
              ),
            },
            {
              dt: 'HOME',
              dd: (
                <>
                  <h5>BLV AM8 fine-tune pass</h5>
                  <p>Input shaping dialed; running a 0.16mm benchy bench against the K1. Mostly an excuse to stand in the garage at 10pm.</p>
                  <div className="item-meta">Marlin · accelerometer · spreadsheet</div>
                </>
              ),
            },
            {
              dt: 'HOME',
              dd: (
                <>
                  <h5>Garage occupancy sensor</h5>
                  <p>An ESP32 + mmWave radar so the shop lights know when I'm out there. Half the fun is the false-positive log.</p>
                  <div className="item-meta">ESP32 · ESPHome · MQTT</div>
                </>
              ),
            },
          ]}
        />
      </section>

      <section className="section muted">
        <SectionHead title="Reading & learning." idx="§ 03" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32 }}>
          {[
            ['READING', 'Designing Data-Intensive Applications', 'Re-read, twice a year, every year.'],
            ['WATCHING', 'Talks from LocalLLaMA meetups', "Mostly to figure out what I'm doing wrong with my router."],
            ['LEARNING', 'Rust, again, for real this time', "For a small daemon I don't want to babysit."],
          ].map(([k, t, p]) => (
            <div key={k} style={{ borderTop: '1px solid var(--rule)', paddingTop: 16 }}>
              <div className="meta" style={{ marginBottom: 10 }}>{k}</div>
              <h4 style={{ fontFamily: 'var(--font-display)', fontSize: 24, lineHeight: 1.15, marginBottom: 6 }}>{t}</h4>
              <p style={{ fontSize: 13, color: 'var(--ink-2)' }}>{p}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <SectionHead title="Not working on." idx="§ 04" />
        <p style={{ fontFamily: 'var(--font-display)', fontSize: 32, lineHeight: 1.35, color: 'var(--ink-2)', maxWidth: '38ch' }}>
          Anything that pulls me away from supper. Twenty years in,
          I've learned to <i>protect the evenings</i> and trust morning Ben
          to figure out the hard parts.
        </p>
        <p className="meta" style={{ marginTop: 40 }}>UPDATED {UPDATED.toUpperCase()} · AMERICA/CHICAGO</p>
      </section>
    </>
  );
}
