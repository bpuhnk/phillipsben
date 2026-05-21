export default function LastUpdated({ iso }: { iso: string }) {
  // Static stamp, not a relative "x min ago": the dashboard is a static page
  // baked when Hermes last ran, so a live-looking "1 min ago" is misleading.
  const stamp = new Date(iso).toISOString().slice(0, 16).replace('T', ' ');
  return (
    <p className="meta" style={{ marginTop: 40 }}>
      UPDATED · {stamp} UTC · BY HERMES
    </p>
  );
}
