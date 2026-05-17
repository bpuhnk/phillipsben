import type { ReactNode } from 'react';

export type DefRow = { dt: ReactNode; dd: ReactNode };

export default function DefList({
  rows,
  narrow,
  className,
}: {
  rows: DefRow[];
  narrow?: boolean;
  className?: string;
}) {
  const cls = ['deflist', className].filter(Boolean).join(' ');
  const rowCls = ['def', narrow ? 'narrow' : ''].filter(Boolean).join(' ');
  return (
    <dl className={cls}>
      {rows.map((r, i) => (
        <div className={rowCls} key={i}>
          <dt>{r.dt}</dt>
          <dd>{r.dd}</dd>
        </div>
      ))}
    </dl>
  );
}
