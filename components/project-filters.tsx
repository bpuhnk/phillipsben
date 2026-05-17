'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useMemo } from 'react';
import type { Project } from '@/lib/content';
import ProjectCard from './project-card';

type Props = { projects: Project[] };

const STATUSES = ['active', 'shipped', 'archived'] as const;
type Status = (typeof STATUSES)[number];

export default function ProjectFilters({ projects }: Props) {
  const router = useRouter();
  const params = useSearchParams();
  const status = (params.get('status') as Status | null) ?? null;
  const tag = params.get('tag');

  const allTags = useMemo(() => {
    const s = new Set<string>();
    for (const p of projects) p.frontmatter.techStack.forEach((t) => s.add(t));
    return Array.from(s).sort();
  }, [projects]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { active: 0, shipped: 0, archived: 0 };
    for (const p of projects) c[p.frontmatter.status] = (c[p.frontmatter.status] ?? 0) + 1;
    return c;
  }, [projects]);

  const update = useCallback(
    (key: 'status' | 'tag', value: string | null) => {
      const sp = new URLSearchParams(params.toString());
      if (value) sp.set(key, value);
      else sp.delete(key);
      const qs = sp.toString();
      router.replace(qs ? `/projects?${qs}` : '/projects', { scroll: false });
    },
    [params, router],
  );

  const filtered = useMemo(
    () =>
      projects.filter((p) => {
        if (status && p.frontmatter.status !== status) return false;
        if (tag && !p.frontmatter.techStack.includes(tag)) return false;
        return true;
      }),
    [projects, status, tag],
  );

  return (
    <>
      <section className="filter-bar">
        <div className="filter-bar-inner">
          <span className="meta filter-bar-label">FILTER —</span>
          <button
            type="button"
            className={`chip ${!status ? 'solid' : ''}`}
            onClick={() => update('status', null)}
          >
            All
          </button>
          {STATUSES.map((s) => (
            <button
              key={s}
              type="button"
              className={`chip ${status === s ? 'solid' : ''}`}
              onClick={() => update('status', status === s ? null : s)}
            >
              {s[0].toUpperCase() + s.slice(1)} · {counts[s] ?? 0}
            </button>
          ))}
          {allTags.length > 0 ? <span className="filter-sep" /> : null}
          {allTags.map((t) => (
            <button
              key={t}
              type="button"
              className={`chip ${tag === t ? 'solid' : ''}`}
              onClick={() => update('tag', tag === t ? null : t)}
            >
              {t}
            </button>
          ))}
        </div>
      </section>

      <section className="section">
        {filtered.length === 0 ? (
          <p className="lede" style={{ textAlign: 'center', padding: '32px 0' }}>
            Nothing matches. <button type="button" className="chip" onClick={() => router.replace('/projects')}>Clear filters</button>
          </p>
        ) : (
          <div className="project-grid">
            {filtered.map((p) => (
              <ProjectCard key={p.frontmatter.slug} project={p} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
