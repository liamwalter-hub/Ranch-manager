import { formatDateTime, formatTime, toGameDate } from '../engine/calendar';
import type { LogEntry } from '../engine/types';
import { pack } from '../platform/controller';

const KIND_LABEL: Record<string, string> = { briefing: 'Briefing', report: 'Report', block: 'Clock', system: 'Ranch', weather: 'Weather' };

export function LogList({ entries, showDate = false }: { entries: LogEntry[]; showDate?: boolean }) {
  if (!entries.length) return <p className="muted">Nothing yet.</p>;
  return (
    <ul className="log">
      {entries.map((e, i) => {
        const d = toGameDate(pack.calendar.start, e.t);
        return (
          <li key={`${e.t}-${i}`} className={`log__item log__item--${e.kind}`}>
            <div className="log__meta">
              <span>{showDate ? formatDateTime(d) : formatTime(d)}</span>
              <span className="log__kind">{KIND_LABEL[e.kind] ?? e.kind}</span>
            </div>
            <div>{e.text}</div>
          </li>
        );
      })}
    </ul>
  );
}
