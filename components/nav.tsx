'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { navItems } from '@/lib/nav-items';
import type { NavData } from '@/lib/site-schemas';

export default function Nav({ data }: { data: NavData }) {
  const pathname = usePathname();
  return (
    <nav className="nav no-print">
      <Link href="/" className="nav-brand">
        <span className="dot" />
        {data.brand}<i>{data.brandSuffix}</i>
      </Link>
      <div className="nav-links">
        {navItems.map((it) => {
          const active =
            it.href === '/' ? pathname === '/' : pathname?.startsWith(it.href);
          return (
            <Link key={it.href} href={it.href} className={active ? 'active' : ''}>
              {it.label}
            </Link>
          );
        })}
      </div>
      <a href={data.ctaHref} className="nav-cta" download>
        {data.ctaLabel}
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.4">
          <path d="M2 8L8 2M8 2H4M8 2V6" />
        </svg>
      </a>
    </nav>
  );
}
