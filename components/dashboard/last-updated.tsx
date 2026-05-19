function relativeTime(iso: string, now: Date = new Date()): string {
  const then = new Date(iso).getTime();
  const diffMs = now.getTime() - then;
  const mins = Math.round(diffMs / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  const days = Math.round(hours / 24);
  if (days < 30) return `${days} day${days === 1 ? '' : 's'} ago`;
  return new Date(iso).toISOString().slice(0, 10);
}

export default function LastUpdated({ iso }: { iso: string }) {
  return (
    <p className="meta" style={{ marginTop: 40 }}>
      LAST UPDATED · {relativeTime(iso).toUpperCase()} ·{' '}
      {new Date(iso).toISOString().slice(0, 16).replace('T', ' ')} UTC · BY HERMES
    </p>
  );
}
