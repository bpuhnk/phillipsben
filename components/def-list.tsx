import type { ReactNode } from 'react';

export type DefRow = { dt: ReactNode; dd: ReactNode };

export default function DefList({ rows, narrow }: { rows: DefRow[]; narrow?: boolean }) {
  return (
    <dl className="deflist">
      {rows.map((r, i) => (
        <div className="def" key={i} style={narrow ? { gridTemplateColumns: '110px 1fr' } : undefined}>
          <dt>{r.dt}</dt>
          <dd>{r.dd}</dd>
        </div>
      ))}
    </dl>
  );
}
