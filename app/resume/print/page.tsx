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
          Full-stack software engineer with sixteen years building .NET
          software — desktop applications, services, and integrations for places
          where uptime matters more than novelty. Recent work spans solutions
          architecture, IT/OT integration, and production AI: an in-house LLM
          assistant and a set of MCP servers for safe LLM access to internal systems.
        </p>
      </section>

      <section style={{ marginBottom: 22 }}>
        <h2 style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--ink-3)', marginBottom: 10 }}>
          Experience
        </h2>
        {[
          { y: '2018 — Now', h: 'Application Developer', s: 'Tier-1 transaxle supplier (manufacturing)',
            p: 'Sole primary developer across a 25+ application portfolio. Drove source control, dev environment, and framework modernization from a 2018 .NET 3.5 starting point. Recent: solutions architecture, IT/OT integration, in-house LLM assistant and MCP servers. Certified ISO 9001:2015 internal QMS auditor.' },
          { y: '2014 — 2018', h: 'Software Developer', s: 'Oldcastle Materials Group (now CRH)',
            p: 'Middleware applications, then the QuoteToCash Silverlight sales system, then telematics integration on MuleSoft with BA / PM / business owners. Promoted junior → mid-level.' },
          { y: '2010 — 2014', h: 'IT Support & Junior .NET Developer', s: 'Sturgis Web Services',
            p: 'First professional .NET role. SSIS / ETL pipelines for county tax-payment data; direct work with county staff nationwide on data import.' },
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
          <li><strong>Desktop:</strong> WinForms, WPF, Blazor Server, Electron, WebView2</li>
          <li><strong>Services &amp; integration:</strong> C#, VB.NET, ASP.NET Core, SignalR, RabbitMQ, SQL Server, EF Core</li>
          <li><strong>AI &amp; LLM:</strong> Ollama, Gemma, OpenWebUI, MCP, RAG, AD-gated access</li>
          <li><strong>Architecture:</strong> multi-tier systems, distributed monitoring, IT/OT bridge, profile-based delivery</li>
          <li><strong>Platform &amp; libraries:</strong> Serilog, NuGet, .NET Standard 2.0, shared API contracts, PLC comms</li>
          <li><strong>Quality &amp; process:</strong> ISO 9001:2015 internal QMS audit</li>
        </ul>
      </section>

      <section>
        <h2 style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--ink-3)', marginBottom: 8 }}>
          Selected Projects
        </h2>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: 11.5 }}>
          <li style={{ marginBottom: 6 }}><strong>Internal MCP Servers</strong> — MCP servers giving LLM clients auth-gated access to internal AD, databases, and files (C#, Active Directory).</li>
          <li style={{ marginBottom: 6 }}><strong>Cervi</strong> — in-house RAG LLM assistant for service-ticket triage, deployed CPU-only (Ollama, Gemma, RAG).</li>
          <li style={{ marginBottom: 6 }}><strong>Workstation Toolbar</strong> — workstation appbar rebuilt into a four-tier system across ~100 machines (.NET 8, React, SignalR).</li>
          <li style={{ marginBottom: 6 }}><strong>QIA</strong> — shop-floor quality inspection app; 8 lines, ~900 units/day, 6→1 line-agnostic refactor (VB.NET, WinForms, PLC).</li>
        </ul>
      </section>

      <footer style={{ marginTop: 32, paddingTop: 12, borderTop: '1px solid var(--rule-2)', fontFamily: 'var(--font-mono)', fontSize: 9.5, color: 'var(--ink-3)', textAlign: 'center' }}>
        Generated from phillipsben.com — full write-ups at /projects
      </footer>
    </article>
  );
}
