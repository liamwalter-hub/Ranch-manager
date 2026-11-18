import { useRef } from 'react';
import { BLOCK_LABELS, formatDate, formatTime, toGameDate } from '../engine/calendar';
import type { GameState } from '../engine/types';
import { pack } from '../platform/controller';

/** Ranch name, game date and time. Tapping the name five times toggles the debug tab. */
export function TopBar({ state, displayMinutes, onSecretTap }: { state: GameState; displayMinutes: number; onSecretTap: () => void }) {
  const d = toGameDate(pack.calendar.start, displayMinutes);
  const taps = useRef<number[]>([]);
  const tap = () => {
    const now = Date.now();
    taps.current = [...taps.current.filter(t => now - t < 2000), now];
    if (taps.current.length >= 5) {
      taps.current = [];
      onSecretTap();
    }
  };
  return (
    <header className="topbar">
      <div className="topbar__row">
        <div className="topbar__title" onClick={tap}>{pack.name}</div>
        <div className="topbar__time">{formatTime(d)}</div>
      </div>
      <div className="topbar__row topbar__sub">
        <span>{formatDate(d)} · Day {d.gameDay}</span>
        <span>{BLOCK_LABELS[d.block]}{state.clock.speed !== 1 ? ` · ${state.clock.speed}×` : ''}</span>
      </div>
    </header>
  );
}
