export type TimelineRow = { y: string; h: string; s: string; p: string };

export default function Timeline({ rows }: { rows: TimelineRow[] }) {
  return (
    <div className="timeline">
      {rows.map((r) => (
        <div className="tl-row" key={r.y + r.h}>
          <div className="tl-year">{r.y}</div>
          <div className="tl-content">
            <h4>{r.h}</h4>
            <div className="sub">{r.s}</div>
            <p>{r.p}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
