// Minimal, anonymized query log for the career assistant.
//
// We record the question (the visitor's own input — useful to learn what hiring
// managers ask) plus a timestamp and which provider answered. NO IP, NO request
// headers, NO PII — nothing that identifies the visitor. Best-effort and silent:
// logging must never break a request.
//
// v1 appends JSONL to a gitignored file. The richer "weekly summary to the
// dashboard via hermes ingestion" is a separate, later job.

import fs from 'node:fs/promises';
import path from 'node:path';

const LOG_FILE = path.join(process.cwd(), 'data', 'ask-log.jsonl');

export interface AskLogEntry {
  ts: string;
  question: string;
  provider: 'local' | 'haiku' | 'none';
}

export async function logAsk(entry: Omit<AskLogEntry, 'ts'>): Promise<void> {
  try {
    const line = JSON.stringify({ ts: new Date().toISOString(), ...entry }) + '\n';
    await fs.mkdir(path.dirname(LOG_FILE), { recursive: true });
    await fs.appendFile(LOG_FILE, line, 'utf8');
  } catch {
    // Never let logging failure surface to the visitor.
  }
}
