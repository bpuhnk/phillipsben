export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[①-⑳]/g, '')
    .replace(/[^\p{Letter}\p{Number}\s-]/gu, '')
    .trim()
    .replace(/\s+/g, '-');
}

export type TocItem = { id: string; text: string };

export function extractH2(source: string): TocItem[] {
  const items: TocItem[] = [];
  let inFence = false;
  for (const raw of source.split('\n')) {
    if (/^\s*```/.test(raw)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;
    const m = raw.match(/^##\s+(.+?)\s*#*\s*$/);
    if (!m) continue;
    const text = m[1].replace(/\.+$/, '').trim();
    items.push({ id: slugify(text), text });
  }
  return items;
}
