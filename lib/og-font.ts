import { readFile } from 'node:fs/promises';
import path from 'node:path';

let cache: { regular: ArrayBuffer; italic: ArrayBuffer } | null = null;

function toArrayBuffer(buf: Buffer): ArrayBuffer {
  return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength) as ArrayBuffer;
}

export async function loadInstrumentSerif() {
  if (cache) return cache;
  const dir = path.join(
    process.cwd(),
    'node_modules',
    '@fontsource',
    'instrument-serif',
    'files'
  );
  const [reg, ita] = await Promise.all([
    readFile(path.join(dir, 'instrument-serif-latin-400-normal.woff')),
    readFile(path.join(dir, 'instrument-serif-latin-400-italic.woff')),
  ]);
  cache = { regular: toArrayBuffer(reg), italic: toArrayBuffer(ita) };
  return cache;
}
