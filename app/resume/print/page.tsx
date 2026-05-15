export const dynamic = 'force-static';

export default function ResumePrint() {
  return (
    <article
      style={{
        maxWidth: 760,
        margin: '0 auto',
        padding: '48px 56px',
        fontFamily: 'var(--font-body)',
        fontSize: 11.5,
        color: 'var(--ink)',
        lineHeight: 1.45,
        background: 'white',
      }}
    >
      <header style={{ borderBottom: '2px solid var(--ink)', paddingBottom: 16, marginBottom: 24 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 38, lineHeight: 1, marginBottom: 6 }}>
          Ben Phillips
        </h1>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.1em', color: 'var(--ink-3)', textTransform: 'uppercase' }}>
          Architect / Software Engineer · .NET · Agentic Systems · Southeast USA
        </p>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--ink-2)', marginTop: 8 }}>
          contact@phillipsben.com · phillipsben.com · github.com/bPuhnk · linkedin.com/in/ben-phillips-332a4826
        </p>
      </header>

      <section style={{ marginBottom: 22 }}>
        <h2 style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--ink-3)', marginBottom: 8 }}>
          Summary
        </h2>
        <p style={{ fontSize: 12 }}>
          Full-stack software engineer with ~20 years inside the .NET ecosystem,
          building desktop applications and services for places where uptime
          matters more than novelty. Currently focused on agentic systems and
          local AI infrastructure.
        </p>
      </section>

      <section style={{ marginBottom: 22 }}>
        <h2 style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--ink-3)', marginBottom: 10 }}>
          Experience
        </h2>
        {[
          { y: '2024 — Now', h: 'Architect, Software Engineering', s: 'Heavy industrial · current role',
            p: 'Architecture across desktop, services, and an agentic layer for routing, summarization, and anomaly review.' },
          { y: '2018 — 2024', h: 'Senior Software Engineer', s: 'Transaxle manufacturing',
            p: 'Built and maintained a WPF + service-bus stack for line-side QC, gauge integration, and traceability.' },
          { y: '2012 — 2018', h: 'Software Engineer', s: 'Industrial aggregates',
            p: 'Plant-level applications for production reporting, weighbridge integration, dispatch.' },
          { y: '2007 — 2012', h: 'Developer', s: 'Mixed contract & in-house',
            p: 'WinForms apps for small businesses. Learned how to ship to people who will call on a Sunday.' },
        ].map((r) => (
          <div key={r.y} style={{ marginBottom: 12, paddingBottom: 10, borderBottom: '1px solid var(--rule-2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, lineHeight: 1.15 }}>{r.h}</h3>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--ink-3)' }}>{r.y}</span>
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--ink-3)', marginBottom: 4 }}>
              {r.s}
            </div>
            <p style={{ fontSize: 11.5, color: 'var(--ink-2)' }}>{r.p}</p>
          </div>
        ))}
      </section>

      <section style={{ marginBottom: 22 }}>
        <h2 style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--ink-3)', marginBottom: 8 }}>
          Skills
        </h2>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: 11.5 }}>
          <li><strong>Desktop:</strong> WPF, XAML, WinForms, Electron, MAUI</li>
          <li><strong>Services:</strong> ASP.NET, gRPC, RabbitMQ, SQL Server, OPC</li>
          <li><strong>Agentic / Local AI:</strong> Hermes-Agent, Ollama, ComfyUI, KoboldCPP, Pascal-era GPUs</li>
          <li><strong>Architecture:</strong> DDD, event sourcing, CQRS, modular monolith</li>
          <li><strong>Embedded:</strong> ESP32, Arduino, Raspberry Pi, MQTT, ESPHome</li>
          <li><strong>Legacy:</strong> VB6, Access, COM, legacy SQL — replaced without breaking the line</li>
        </ul>
      </section>

      <section>
        <h2 style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--ink-3)', marginBottom: 8 }}>
          Selected Projects
        </h2>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: 11.5 }}>
          <li style={{ marginBottom: 6 }}><strong>Hermes-Agent</strong> — home agent server (Python, FastAPI, Ollama).</li>
          <li style={{ marginBottom: 6 }}><strong>Claude-Orbiter</strong> — desktop orchestration app for Claude agents (TS, Electron).</li>
          <li style={{ marginBottom: 6 }}><strong>MCP_Klipper</strong> — MCP server exposing Klipper/Moonraker to LLM agents.</li>
          <li style={{ marginBottom: 6 }}><strong>BLV AM8</strong> — full Anet A8 → linear-rail AM8 conversion (Marlin 2).</li>
        </ul>
      </section>

      <footer style={{ marginTop: 32, paddingTop: 12, borderTop: '1px solid var(--rule-2)', fontFamily: 'var(--font-mono)', fontSize: 9.5, color: 'var(--ink-3)', textAlign: 'center' }}>
        Generated from phillipsben.com — full write-ups at /projects
      </footer>
    </article>
  );
}
