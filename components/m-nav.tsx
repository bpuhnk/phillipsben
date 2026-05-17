'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { navItems } from '@/lib/nav-items';

export default function MNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const hamburgerRef = useRef<HTMLButtonElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const close = useCallback(() => setOpen(false), []);

  // Body scroll lock
  useEffect(() => {
    if (!open) return;
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.documentElement.style.overflow = prev;
    };
  }, [open]);

  // Esc to close + restore focus to hamburger
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        close();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, close]);

  // Focus trap + initial focus
  useEffect(() => {
    if (!open || !overlayRef.current) return;
    const root = overlayRef.current;
    const selector =
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';
    const getFocusable = () =>
      Array.from(root.querySelectorAll<HTMLElement>(selector)).filter(
        (el) => !el.hasAttribute('inert')
      );

    const first = getFocusable()[0];
    first?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      const items = getFocusable();
      if (items.length === 0) return;
      const firstEl = items[0];
      const lastEl = items[items.length - 1];
      if (e.shiftKey && document.activeElement === firstEl) {
        e.preventDefault();
        lastEl.focus();
      } else if (!e.shiftKey && document.activeElement === lastEl) {
        e.preventDefault();
        firstEl.focus();
      }
    };
    root.addEventListener('keydown', onKey);
    return () => root.removeEventListener('keydown', onKey);
  }, [open]);

  // Restore focus to hamburger after closing (skip initial mount)
  const wasOpen = useRef(false);
  useEffect(() => {
    if (open) {
      wasOpen.current = true;
    } else if (wasOpen.current) {
      hamburgerRef.current?.focus({ preventScroll: true });
      wasOpen.current = false;
    }
  }, [open]);

  // Close on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <>
      <nav className="m-nav no-print" aria-label="Primary">
        <Link href="/" className="nav-brand m-nav-brand">
          <span className="dot" />
          ben phillips
        </Link>
        <button
          ref={hamburgerRef}
          type="button"
          className="m-nav-burger"
          aria-label="Menu"
          aria-expanded={open}
          aria-controls="m-nav-overlay"
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
        </button>
      </nav>

      {mounted &&
        open &&
        createPortal(
          <div
            id="m-nav-overlay"
            ref={overlayRef}
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            className="m-nav-overlay"
            onClick={(e) => {
              if (e.target === e.currentTarget) close();
            }}
          >
            <div className="m-nav-overlay-inner">
              <div className="m-nav-overlay-top">
                <span className="nav-brand m-nav-brand">
                  <span className="dot" />
                  ben phillips
                </span>
                <button
                  type="button"
                  className="m-nav-close"
                  aria-label="Close menu"
                  onClick={close}
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4">
                    <path d="M4 4L16 16M16 4L4 16" />
                  </svg>
                </button>
              </div>
              <ul className="m-nav-list">
                {navItems.map((it) => {
                  const active =
                    it.href === '/' ? pathname === '/' : pathname?.startsWith(it.href);
                  return (
                    <li key={it.href}>
                      <Link
                        href={it.href}
                        className={active ? 'active' : ''}
                        onClick={close}
                      >
                        {it.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
              <a
                href="/resume.pdf"
                className="nav-cta m-nav-cta"
                download
                onClick={close}
              >
                Resume
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.4">
                  <path d="M2 8L8 2M8 2H4M8 2V6" />
                </svg>
              </a>
              <div className="m-nav-social">
                <a href="https://github.com/bPuhnk" target="_blank" rel="noreferrer" onClick={close}>
                  GitHub ↗
                </a>
                <a
                  href="https://www.linkedin.com/in/ben-phillips-332a4826/"
                  target="_blank"
                  rel="noreferrer"
                  onClick={close}
                >
                  LinkedIn ↗
                </a>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
