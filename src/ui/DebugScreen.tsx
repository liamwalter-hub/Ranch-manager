import { useState } from 'react';
import { formatDateTime, minutesForDate, toGameDate } from '../engine/calendar';
import { game, pack, type Snapshot } from '../platform/controller';

const SPEEDS = [
  { speed: 1, label: '1×', note: 'real time' },
  { speed: 60, label: '60×', note: '1 hour per minute' },
  { speed: 360, label: '360×', note: '6 hours per minute' },
  { speed: 1440, label: '1440×', note: '1 day per minute' },
];

export function DebugScreen({ snap }: { snap: Snapshot }) {
  const state = snap.state!;
  const start = pack.calendar.start;
  const now = toGameDate(start, state.clock.gameMinutes);
  const [date, setDate] = useState(`${now.year}-${String(now.month).padStart(2, '0')}-${String(now.day).padStart(2, '0')}`);
  const [time, setTime] = useState('06:00');
  const [seed, setSeed] = useState('');
  const [section, setSection] = useState<string>('clock');
  const [error, setError] = useState('');

  const jump = () => {
    const [y, m, d] = date.split('-').map(Number);
    const [hh, mm] = time.split(':').map(Number);
    const target = minutesForDate(start, y, m, d) + hh * 60 + mm;
    if (!(target > state.clock.gameMinutes)) {
      setError('You can only jump forwards: the clock never goes backwards.');
      return;
    }
    setError('');
    game.jumpTo(target);
  };

  const inspect: Record<string, unknown> = {
    clock: state.clock,
    weather: state.weather,
    rng: { seed: state.seed, ...state.rng },
    timeline: state.timeline,
    actions: state.actions,
    log: state.log.slice(-40),
  };

  return (
    <>
      <section className="card">
        <h2 className="card__title">Speed</h2>
        <div className="seg">
          {SPEEDS.map(s => (
            <button key={s.speed} className={`seg__btn ${state.clock.speed === s.speed ? 'is-active' : ''}`} onClick={() => game.setSpeed(s.speed)}>
              {s.label}
            </button>
          ))}
        </div>
        <p className="muted">{SPEEDS.find(s => s.speed === state.clock.speed)?.note ?? `${state.clock.speed}×`}. Faster speeds keep running after you close the app.</p>
      </section>

      <section className="card">
        <h2 className="card__title">Jump to date</h2>
        <p className="muted">Now: {formatDateTime(now)}. Everything in between is simulated.</p>
        <div className="btn-row">
          <input className="input" type="date" value={date} onChange={e => setDate(e.target.value)} />
          <input className="input" type="time" value={time} onChange={e => setTime(e.target.value)} />
          <button className="btn btn--primary" onClick={jump}>Jump</button>
        </div>
        {error && <p className="warn">{error}</p>}
      </section>

      <section className="card">
        <h2 className="card__title">New game with a seed</h2>
        <p className="muted">The same seed and the same decisions always give the same game. Current seed: <code>{state.seed}</code></p>
        <div className="btn-row">
          <input className="input" placeholder="seed (blank = random)" value={seed} onChange={e => setSeed(e.target.value)} />
          <button className="btn btn--danger" onClick={() => { if (confirm('Start a new game?')) game.newGame(seed.trim() || undefined); }}>Start</button>
        </div>
      </section>

      <section className="card">
        <h2 className="card__title">Inspect state</h2>
        <div className="seg seg--wrap">
          {Object.keys(inspect).map(k => (
            <button key={k} className={`seg__btn ${section === k ? 'is-active' : ''}`} onClick={() => setSection(k)}>{k}</button>
          ))}
        </div>
        <pre className="pre">{JSON.stringify(inspect[section], null, 2)}</pre>
        <p className="muted">Fire a specific event arrives with the event engine (M2).</p>
      </section>
    </>
  );
}
