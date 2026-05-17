'use client';

import { useActiveHeading } from '@/hooks/use-active-heading';
import type { TocItem } from '@/lib/toc';

type Props = { items: TocItem[]; variant: 'aside' | 'dock' };

export default function ProjectToc({ items, variant }: Props) {
  const active = useActiveHeading(items.map((i) => i.id));
  if (items.length === 0) return null;

  if (variant === 'dock') {
    return (
      <nav className="toc-dock" aria-label="Section navigation">
        <div className="toc-dock-scroll">
          {items.map((it) => (
            <a
              key={it.id}
              href={`#${it.id}`}
              style={{ color: active === it.id ? 'var(--accent)' : 'var(--ink-3)' }}
            >
              {it.text.toUpperCase()}
            </a>
          ))}
        </div>
      </nav>
    );
  }

  return (
    <aside className="toc-aside">
      <div className="meta" style={{ marginBottom: 16 }}>CONTENTS</div>
      <ul>
        {items.map((it) => (
          <li key={it.id}>
            <a
              href={`#${it.id}`}
              className="meta"
              style={{ color: active === it.id ? 'var(--accent)' : 'var(--ink-3)' }}
            >
              {it.text.toUpperCase()}
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
}
