import { formatDateTime, toGameDate } from '../engine/calendar';
import { game, pack, type AwaySummary } from '../platform/controller';
import { LogList } from './LogList';

function describeSpan(minutes: number): string {
  const days = Math.floor(minutes / 1440);
  const hours = Math.floor((minutes % 1440) / 60);
  const parts = [];
  if (days) parts.push(`${days} day${days === 1 ? '' : 's'}`);
  if (hours || !days) parts.push(`${hours} hour${hours === 1 ? '' : 's'}`);
  return parts.join(' and ');
}

export function AwaySheet({ away }: { away: AwaySummary }) {
  const from = toGameDate(pack.calendar.start, away.fromMinutes);
  const to = toGameDate(pack.calendar.start, away.toMinutes);
  return (
    <div className="sheet-backdrop">
      <div className="sheet" role="dialog" aria-label="While you were away">
        <h2 className="sheet__title">While you were away</h2>
        <p className="muted">
          You were gone {describeSpan(away.toMinutes - away.fromMinutes)} ({formatDateTime(from)} to {formatDateTime(to)}).
          Walt kept things running.
        </p>
        <div className="sheet__body">
          <LogList entries={away.entries.filter(e => e.kind !== 'block').reverse()} showDate />
        </div>
        <button className="btn btn--primary btn--wide" onClick={() => game.dismissAway()}>Back to work</button>
      </div>
    </div>
  );
}
