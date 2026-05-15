// scripts/generate-pdf.mjs
// Starts the standalone Next.js server on a random port, navigates Playwright
// to /resume/print, dumps page.pdf() to public/resume.pdf, then kills the server.

import { spawn } from 'node:child_process';
import { createServer } from 'node:net';
import { setTimeout as wait } from 'node:timers/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');

if (process.env.SKIP_PDF === '1') {
  console.log('[pdf] SKIP_PDF=1 — skipping résumé PDF generation.');
  process.exit(0);
}

async function findFreePort() {
  return new Promise((resolve, reject) => {
    const srv = createServer();
    srv.unref();
    srv.on('error', reject);
    srv.listen(0, () => {
      const port = srv.address().port;
      srv.close(() => resolve(port));
    });
  });
}

async function waitForReady(url, timeoutMs = 30000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url, { method: 'GET' });
      if (res.ok) return;
    } catch {}
    await wait(300);
  }
  throw new Error(`Timed out waiting for ${url}`);
}

async function main() {
  let playwright;
  try {
    playwright = await import('playwright');
  } catch {
    console.warn('[pdf] playwright not installed — skipping résumé PDF generation.');
    return;
  }

  const port = await findFreePort();
  const standalonePath = path.join(projectRoot, '.next', 'standalone', 'server.js');
  if (!fs.existsSync(standalonePath)) {
    console.warn(`[pdf] ${standalonePath} not found — did you run \`next build\`? Skipping.`);
    return;
  }

  // Mirror static assets that the standalone server expects under .next/standalone
  const standaloneNextStatic = path.join(projectRoot, '.next', 'standalone', '.next', 'static');
  const standalonePublic = path.join(projectRoot, '.next', 'standalone', 'public');
  if (!fs.existsSync(standaloneNextStatic)) {
    fs.mkdirSync(path.dirname(standaloneNextStatic), { recursive: true });
    fs.cpSync(path.join(projectRoot, '.next', 'static'), standaloneNextStatic, { recursive: true });
  }
  if (!fs.existsSync(standalonePublic)) {
    fs.cpSync(path.join(projectRoot, 'public'), standalonePublic, { recursive: true });
  }

  console.log(`[pdf] starting standalone server on :${port}`);
  const server = spawn('node', [standalonePath], {
    cwd: path.join(projectRoot, '.next', 'standalone'),
    env: { ...process.env, PORT: String(port), HOSTNAME: '127.0.0.1' },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  server.stdout.on('data', (d) => process.stdout.write(`[next] ${d}`));
  server.stderr.on('data', (d) => process.stderr.write(`[next] ${d}`));

  const url = `http://127.0.0.1:${port}/resume/print`;
  try {
    await waitForReady(url);
    const browser = await playwright.chromium.launch();
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    await page.goto(url, { waitUntil: 'networkidle' });
    await page.emulateMedia({ media: 'print' });
    const outPath = path.join(projectRoot, 'public', 'resume.pdf');
    await page.pdf({
      path: outPath,
      format: 'Letter',
      printBackground: true,
      margin: { top: '0.6in', bottom: '0.6in', left: '0.7in', right: '0.7in' },
    });
    await browser.close();
    console.log(`[pdf] wrote ${outPath}`);
  } finally {
    server.kill('SIGTERM');
  }
}

main().catch((e) => {
  console.error('[pdf] failed:', e);
  // Don't fail the whole build — the site still works without resume.pdf
  process.exit(0);
});
