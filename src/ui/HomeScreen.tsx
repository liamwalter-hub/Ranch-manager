import { MINUTES_PER_DAY, formatTime, nextBlockStart, toGameDate, BLOCK_LABELS } from '../engine/calendar';
import { describeWeather } from '../engine/sim';
import { game, pack, type Snapshot } from '../platform/controller';
import { LogList } from './LogList';

export function HomeScreen({ snap }: { snap: Snapshot }) {
  const state = snap.state!;
  const now = state.clock.gameMinutes;
  const dayStart = Math.floor(now / MINUTES_PER_DAY) * MINUTES_PER_DAY;
  // Show today's entries (since midnight), newest first; fall back to the last few.
  let entries = state.log.filter(e => e.t >= dayStart);
  if (entries.length < 3) entries = state.log.slice(-5);
  const next = nextBlockStart(now);
  const nextLabel = `${BLOCK_LABELS[next.block]} at ${formatTime(toGameDate(pack.calendar.start, next.at))}`;

  return (
    <>
      {state.seasonOver && (
        <section className="card accent-card">
          <h2 className="card__title">Season complete</h2>
          <p>Calving season is over and you've reached the end of the first playable season. More of the ranch year is on its way.</p>
        </section>
      )}

      <section className="card">
        <h2 className="card__title">Weather today</h2>
        <p className="big-line">{describeWeather(pack, state.weather)}</p>
      </section>

      <section className="card">
        <h2 className="card__title">Inbox</h2>
        <p className="muted">No decisions waiting. (Decisions arrive in the next build.)</p>
        <div className="ff">
          <button className="btn btn--primary" onClick={() => game.nextDecision()}>
            Next decision
            <small>up to {nextLabel}</small>
          </button>
          <button className="btn" onClick={() => game.nextDay()}>
            Next day
            <small>to 06:00 briefing</small>
          </button>
        </div>
      </section>

      <section className="card">
        <h2 className="card__title">Today on the ranch</h2>
        <LogList entries={[...entries].reverse()} />
      </section>
    </>
  );
}
