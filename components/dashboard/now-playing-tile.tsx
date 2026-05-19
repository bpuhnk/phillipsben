import type { DashboardSpotify } from '@/lib/site-schemas';

function shortTime(iso: string): string {
  const then = new Date(iso).getTime();
  const mins = Math.round((Date.now() - then) / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.round(hours / 24)}d ago`;
}

export default function NowPlayingTile({ spotify }: { spotify: DashboardSpotify }) {
  const headline = spotify.nowPlaying ?? spotify.recent[0] ?? null;
  const caption = spotify.nowPlaying ? 'PLAYING EARLIER TODAY' : 'RECENT LISTENING';
  const rest = spotify.nowPlaying ? spotify.recent.slice(0, 3) : spotify.recent.slice(1, 4);

  if (!headline) {
    return (
      <div>
        <div className="meta">RECENT LISTENING</div>
        <p style={{ marginTop: 12, color: 'var(--ink-3)' }}>Nothing to show.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="meta">{caption}</div>
      <div style={{ display: 'flex', gap: 14, marginTop: 12, alignItems: 'flex-start' }}>
        {headline.albumArt ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={headline.albumArt}
            alt={`${headline.track} album art`}
            width={64}
            height={64}
            style={{ flex: '0 0 auto', borderRadius: 2, display: 'block' }}
            loading="lazy"
          />
        ) : null}
        <div style={{ minWidth: 0 }}>
          <a
            href={headline.url}
            style={{
              display: 'block',
              fontFamily: 'var(--font-display)',
              fontSize: 22,
              lineHeight: 1.15,
            }}
          >
            {headline.track}
          </a>
          <div className="meta" style={{ marginTop: 4 }}>{headline.artist}</div>
        </div>
      </div>
      {rest.length > 0 ? (
        <ul
          style={{
            listStyle: 'none',
            padding: 0,
            margin: '20px 0 0',
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
            borderTop: '1px solid var(--rule)',
            paddingTop: 16,
          }}
        >
          {rest.map((t, i) => (
            <li key={`${t.url}-${i}`} style={{ fontSize: 13, color: 'var(--ink-2)' }}>
              <a href={t.url}>{t.track}</a>
              <span style={{ color: 'var(--ink-3)' }}> — {t.artist}</span>
              <span className="meta" style={{ marginLeft: 8 }}>{shortTime(t.playedAt)}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
