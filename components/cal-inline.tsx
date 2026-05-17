'use client';

import { useEffect } from 'react';
import Cal, { getCalApi } from '@calcom/embed-react';

export default function CalInline({
  calLink,
  namespace,
  height,
}: {
  calLink: string;
  namespace: string;
  height: number;
}) {
  useEffect(() => {
    (async () => {
      const cal = await getCalApi({ namespace });
      cal('ui', { hideEventTypeDetails: false, layout: 'month_view' });
    })();
  }, [namespace]);

  return (
    <Cal
      namespace={namespace}
      calLink={calLink}
      style={{ width: '100%', height: `${height}px`, overflow: 'scroll' }}
      config={{ layout: 'month_view' }}
    />
  );
}
