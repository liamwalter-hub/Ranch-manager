import { useSyncExternalStore } from 'react';
import { montanaPack as pack } from '../content/montana';
import { targetGameMinutes } from '../engine/clock';
import {
  advanceTo, fastForward, newGame, nextDayTarget, nextDecisionTarget, setSpeed,
} from '../engine/sim';
import type { GameState, LogEntry } from '../engine/types';
import { produce } from 'immer';
import { deleteAllSaves, loadGame, saveGame } from './storage';

export interface AwaySummary {
  fromMinutes: number;
  toMinutes: number;
  entries: LogEntry[];
}

export interface Snapshot {
  status: 'loading' | 'ready' | 'error';
  error?: string;
  state: GameState | null;
  /** Smoothly moving clock for display (may be a fraction ahead of the simulation). */
  displayMinutes: number;
  away: AwaySummary | null;
  restoredFromBackup: boolean;
}

/** Long enough away to deserve a summary: at least one block start passed. */
function awayWorthShowing(entries: LogEntry[]) {
  return entries.some(e => e.kind === 'briefing' || e.kind === 'report' || e.kind === 'block');
}

function localMinuteOfDay(d = new Date()) {
  return d.getHours() * 60 + d.getMinutes();
}

/**
 * Owns the live game: loads it, keeps the clock running while the app is open,
 * applies player actions and saves to the device.
 */
class GameController {
  private snap: Snapshot = { status: 'loading', state: null, displayMinutes: 0, away: null, restoredFromBackup: false };
  private listeners = new Set<() => void>();
  private timer: number | undefined;
  private saving = Promise.resolve();

  subscribe = (fn: () => void) => {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  };
  getSnapshot = () => this.snap;

  private emit(patch: Partial<Snapshot>) {
    this.snap = { ...this.snap, ...patch };
    this.listeners.forEach(fn => fn());
  }

  private persist(state: GameState) {
    this.saving = this.saving.then(() => saveGame(state)).catch(err => console.error('Save failed', err));
  }

  async start() {
    try {
      const loaded = await loadGame();
      const state = loaded?.state ?? newGame({ pack, seed: randomSeed(), realNowMs: Date.now(), localMinuteOfDay: localMinuteOfDay() });
      this.emit({ status: 'ready', state, restoredFromBackup: !!loaded?.fromBackup, displayMinutes: state.clock.gameMinutes });
      this.catchUp(true);
      if (!loaded) this.persist(state);
    } catch (e) {
      this.emit({ status: 'error', error: e instanceof Error ? e.message : String(e) });
      return;
    }
    this.timer = window.setInterval(() => this.catchUp(false), 250);
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') this.catchUp(true);
      else if (this.snap.state) this.persist(this.snap.state);
    });
  }

  /** Bring the simulation up to the present. `returning` = the player has just come back. */
  catchUp(returning: boolean) {
    const state = this.snap.state;
    if (!state) return;
    const target = targetGameMinutes(state.clock, Date.now());
    if (Math.floor(target) <= state.clock.gameMinutes) {
      this.emit({ displayMinutes: target });
      return;
    }
    const from = state.clock.gameMinutes;
    const { state: next, newEntries } = advanceTo(state, pack, target);
    const patch: Partial<Snapshot> = { state: next, displayMinutes: target };
    if (returning && awayWorthShowing(newEntries)) {
      const prev = this.snap.away;
      patch.away = {
        fromMinutes: prev?.fromMinutes ?? from,
        toMinutes: next.clock.gameMinutes,
        entries: [...(prev?.entries ?? []), ...newEntries],
      };
    }
    this.emit(patch);
    if (newEntries.length) this.persist(next);
  }

  dismissAway() {
    this.emit({ away: null });
  }

  nextDecision() { this.fastForward(nextDecisionTarget, 'nextDecision'); }
  nextDay() { this.fastForward(nextDayTarget, 'nextDay'); }

  jumpTo(targetMinutes: number) {
    this.fastForward(() => targetMinutes, 'debugJump');
  }

  private fastForward(pick: (s: GameState) => number, type: string) {
    this.catchUp(false);
    const state = this.snap.state;
    if (!state) return;
    const { state: next } = fastForward(state, pack, pick(state), Date.now(), type);
    this.emit({ state: next, displayMinutes: next.clock.gameMinutes });
    this.persist(next);
  }

  setSpeed(speed: number) {
    this.catchUp(false);
    if (!this.snap.state) return;
    const next = setSpeed(this.snap.state, speed, Date.now());
    this.emit({ state: next });
    this.persist(next);
  }

  async newGame(seed = randomSeed()) {
    await deleteAllSaves();
    const state = newGame({ pack, seed, realNowMs: Date.now(), localMinuteOfDay: localMinuteOfDay() });
    this.emit({ state, displayMinutes: state.clock.gameMinutes, away: null });
    this.persist(state);
  }

  loadState(state: GameState) {
    // Imported saves keep their game time; real time links up from now.
    const relinked = produce(state, s => {
      s.clock.anchorRealMs = Date.now();
      s.clock.anchorGameMinutes = s.clock.gameMinutes;
    });
    this.emit({ state: relinked, displayMinutes: relinked.clock.gameMinutes, away: null });
    this.persist(relinked);
  }

  stop() { window.clearInterval(this.timer); }
}

function randomSeed() {
  return Math.random().toString(36).slice(2, 10);
}

export const game = new GameController();
export { pack };

export function useGame(): Snapshot {
  return useSyncExternalStore(game.subscribe, game.getSnapshot);
}
