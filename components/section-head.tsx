import Link from 'next/link';
import type { ReactNode } from 'react';

export default function SectionHead({ title, idx, href }: { title: ReactNode; idx?: string; href?: string }) {
  return (
    <div className="section-head">
      <h2>{title}</h2>
      {idx ? (
        href ? (
          <Link href={href} className="idx">{idx}</Link>
        ) : (
          <span className="idx">{idx}</span>
        )
      ) : null}
    </div>
  );
}
