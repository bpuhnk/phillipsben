import type { ReactNode } from 'react';

export type StatItem = { num: ReactNode; lbl: string };

export default function Stats({ items }: { items: StatItem[] }) {
  return (
    <div className="stats">
      {items.map((s, i) => (
        <div className="stat" key={i}>
          <div className="num">{s.num}</div>
          <div className="lbl">{s.lbl}</div>
        </div>
      ))}
    </div>
  );
}
