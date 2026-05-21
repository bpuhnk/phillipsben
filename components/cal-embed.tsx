'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';

const CalInline = dynamic(() => import('./cal-inline'), { ssr: false });

const HEIGHT = 620;

export default function CalEmbed({
  calLink = 'bpuhnk/15min',
  namespace = '15min',
}: {
  calLink?: string;
  namespace?: string;
}) {
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    if (shouldLoad) return;
    const el = sentinelRef.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') {
      setShouldLoad(true);
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShouldLoad(true);
          obs.disconnect();
        }
      },
      { rootMargin: '400px 0px' },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [shouldLoad]);

  return (
    <>
      <noscript>
        <a href={`https://cal.com/${calLink}`} className="nav-cta">
          Book on cal.com →
        </a>
      </noscript>
      <div ref={sentinelRef} style={{ width: '100%', minHeight: HEIGHT }}>
        {shouldLoad ? (
          <CalInline calLink={calLink} namespace={namespace} height={HEIGHT} />
        ) : (
          <div
            aria-hidden
            style={{ width: '100%', height: HEIGHT, background: 'var(--bg-2)' }}
          />
        )}
      </div>
    </>
  );
}
