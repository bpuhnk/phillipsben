'use client';

import { useEffect } from 'react';
import Cal, { getCalApi } from '@calcom/embed-react';

export default function CalEmbed({
  calLink = 'bpuhnk/30min',
  namespace = '30min',
}: {
  calLink?: string;
  namespace?: string;
}) {
  useEffect(() => {
    (async () => {
      const cal = await getCalApi({ namespace });
      cal('ui', { hideEventTypeDetails: false, layout: 'month_view' });
    })();
  }, [namespace]);

  return (
    <>
      <noscript>
        <a href={`https://cal.com/${calLink}`} className="nav-cta">
          Book on cal.com →
        </a>
      </noscript>
      <Cal
        namespace={namespace}
        calLink={calLink}
        style={{ width: '100%', height: '620px', overflow: 'scroll' }}
        config={{ layout: 'month_view' }}
      />
    </>
  );
}
