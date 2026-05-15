'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const items = [
  { label: 'Index', href: '/' },
  { label: 'Bio', href: '/bio' },
  { label: 'Projects', href: '/projects' },
  { label: 'Now', href: '/now' },
  { label: 'Hobbies', href: '/hobbies' },
  { label: 'Uses', href: '/uses' },
  { label: 'Contact', href: '/contact' },
];

export default function Nav() {
  const pathname = usePathname();
  return (
    <nav className="nav no-print">
      <Link href="/" className="nav-brand">
        <span className="dot" />
        ben phillips<i>&nbsp;/ engineer</i>
      </Link>
      <div className="nav-links">
        {items.map((it) => {
          const active =
            it.href === '/' ? pathname === '/' : pathname?.startsWith(it.href);
          return (
            <Link key={it.href} href={it.href} className={active ? 'active' : ''}>
              {it.label}
            </Link>
          );
        })}
      </div>
      <a href="/resume.pdf" className="nav-cta" download>
        Resume
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.4">
          <path d="M2 8L8 2M8 2H4M8 2V6" />
        </svg>
      </a>
    </nav>
  );
}
