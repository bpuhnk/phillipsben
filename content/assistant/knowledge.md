<!--
  Assistant knowledge base — hand-written connective narrative for the
  "Talk to virtual me" career assistant on phillipsben.com.

  This file is folded into the knowledge pack ALONGSIDE the project pages,
  bio, résumé, and /now entry (those are pulled in programmatically — don't
  duplicate them here). Keep this file to the prose a hiring manager asks
  for that ISN'T already a project page: who Ben is, his career arc, how he
  works, and what he's looking for.

  REDACTION: never name the current employer. Refer to it generically as
  "a Tier-1 transaxle supplier" / "a manufacturing client." The generic word
  "transaxle" is fine; the company's actual name is not. The build-time guard
  in scripts/build-knowledge-pack.ts will fail the build if the forbidden
  name slips in.

  REVIEW: sections marked [REVIEW] are Ben's voice/intent — confirm or rewrite
  before launch (Phase 05).
-->

# About Ben Phillips

Ben Phillips is a full-stack software engineer with sixteen years building .NET
software — mostly desktop applications and integration systems for a manufacturing
environment where things have to keep running through shift changes, network blips,
and the occasional thing nobody planned for. He titles himself a **Solutions
Architect**, and the through-line of his work is integration: making separate
systems, teams, and now AI models talk to each other reliably.

He is 41, lives in a small town in the Southeast United States, has been married
twenty years, has two teenagers and a Jack Russell, and is a Christian — something he
says shows up in how he works as much as anywhere else.

## How he works

Ben's tagline for the site is "software for things that actually have to work," and
that is the honest summary of his taste. He optimizes for uptime over novelty, for
boring interfaces between teams, and for software that survives contact with a real
shop floor. One of his desktop apps runs three continuous shifts without a restart;
that is the kind of constraint he designs for. He is comfortable in legacy code —
"speaks fluent legacy" — and has spent much of his career modernizing systems in
place rather than greenfield rewrites.

## Career arc

- **2010–2014 — Sturgis Web Services (IT Support & Junior .NET Developer).** First
  professional .NET role: half IT support, half development. Owned the ETL side —
  SSIS pipelines importing county tax-payment data — and worked directly with county
  staff across the country on getting their data in clean. The support half taught him
  early what it costs when the people relying on your software can't do their job
  without it.
- **2014–2018 — Oldcastle Materials Group (now CRH), Software Developer.** Started as
  a junior on middleware applications at one of the world's largest aggregate
  producers, moved to QuoteToCash (a Silverlight sales-quoting system used by reps
  nationwide), then was promoted to mid-level and put on the Telematics team building
  telematics integration in MuleSoft alongside the BA, PM, and business owners.
- **2018–now — a Tier-1 transaxle supplier to a major agricultural / outdoor-equipment
  OEM, Application Developer.** Sole primary developer for the company's internal
  software. Walked into a codebase with no source control, no dev environment, and
  .NET 3.5 — drove source-control adoption, stood up a real dev environment, and built
  or rescued most of a 25+ application portfolio. Recent focus is solutions
  architecture, IT/OT integration, and the company's early AI surface: its first
  in-house LLM assistant and a small set of Model Context Protocol (MCP) servers for
  safe, auth-gated LLM access to internal systems. Certified internal QMS Auditor
  (ISO 9001:2015) since 2018.

## What he's strongest at

- **Desktop applications** that have to stay running through a shift change — WinForms,
  WPF, Blazor Server, Electron, WebView2.
- **Services & integrations** — C#, VB.NET, ASP.NET Core, message buses, SQL Server,
  plus the older surface: PLCs, label printers, ERP systems, telematics, and the
  occasional binary protocol that predates current memory.
- **AI & LLM engineering** — an in-house LLM assistant in production, MCP servers for
  safe LLM access to internal systems, knowledge-base ingestion pipelines, system-prompt
  design, and a reusable chat control that lets legacy WinForms apps embed assistants
  without being rewritten. (This very site assistant is another example: a bounded,
  retrieval-grounded bot he built and hosts himself.)
- **Solutions architecture & integration** — boring interfaces between teams,
  distributed monitoring, profile-based delivery, multi-tier systems, and the IT/OT
  bridge into a Factory Automation team's industrial-PLC platform. A recent flagship is
  a four-tier integration system deployed on ~100 workstations.
- **Platform & library engineering** — the shared libraries the rest of a codebase
  depends on: centralized logging via a custom Serilog DB sink, the environment/config
  library the whole stack reads from, shared API-contract envelopes adopted cross-team,
  and a PLC communication wrapper.
- **Quality & process** — certified internal QMS Auditor (ISO 9001:2015); the audit
  role and the developer role inform each other.

## His home lab (the honest end-to-end story)

Outside work, Ben runs his own local-AI stack on a Tesla P100 in his closet, behind a
tunnel. **Switchboard** is a FastAPI service he wrote that arbitrates that single GPU —
checking VRAM, evicting the resident model, and routing each request to the right
backend so several front-ends can share one card. This site's assistant runs on that
stack: his model server, his assistant, his curated knowledge base. (A separate
third-party agent framework, hermes-agent, drives the site's daily dashboard — that is
a different, unrelated job.)

## What he's looking for [REVIEW]

Ben is open to Solutions Architect and senior/staff engineering roles where the work is
real integration — IT/OT, distributed systems, production AI, and modernizing systems
that have to keep running. He values teams that ship software people depend on over
software that just demos well. For specifics — availability, location, compensation —
the right move is to book a short call via the contact page rather than ask the bot to
speculate.
