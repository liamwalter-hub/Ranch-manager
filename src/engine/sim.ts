import { produce } from 'immer';
import type { Pack } from '../content/schema';
import {
  BLOCK_LABELS, MINUTES_PER_DAY, formatDate, minutesForDate, nextBlockStart, nextMorning, toGameDate, type Block,
} from './calendar';
import { reanchor } from './clock';
import { randAround, seedRng, weightedPick } from './rng';
import { SAVE_VERSION, type GameState, type LogEntry, type LogKind } from './types';

const MAX_LOG = 2000;

function log(state: GameState, t: number, kind: LogKind, text: string) {
  state.log.push({ t, kind, text });
  if (state.log.length > MAX_LOG) state.log.splice(0, state.log.length - MAX_LOG);
}

export function seasonEndMinutes(pack: Pack): number {
  const { start, seasonEnd } = pack.calendar;
  return minutesForDate(start, start.year, seasonEnd.month, seasonEnd.day) + 18 * 60;
}

// ---------- New game ----------

export interface NewGameOptions {
  pack: Pack;
  seed: string;
  realNowMs: number;
  /** Player's local time of day in minutes (0-1439). The game starts on day 1 at this time. */
  localMinuteOfDay: number;
}

export function newGame({ pack, seed, realNowMs, localMinuteOfDay }: NewGameOptions): GameState {
  const start = Math.max(0, Math.min(MINUTES_PER_DAY - 1, Math.floor(localMinuteOfDay)));
  const base: GameState = {
    version: SAVE_VERSION,
    packId: pack.id,
    seed,
    rng: seedRng(seed),
    createdRealMs: realNowMs,
    clock: { gameMinutes: start, anchorRealMs: realNowMs, anchorGameMinutes: start, speed: 1 },
    weather: null,
    timeline: [],
    log: [],
    actions: [],
    seasonOver: false,
  };
  return produce(base, s => {
    log(s, start, 'system', `You take over ${pack.name}. The keys are yours.`);
    rollWeather(s, pack, start);
    morningBriefing(s, pack, start, true);
  });
}

// ---------- Things that happen at set times ----------

function rollWeather(s: GameState, pack: Pack, t: number) {
  const d = toGameDate(pack.calendar.start, t);
  const table = pack.weather.byMonth[String(d.month)] ?? Object.values(pack.weather.byMonth)[0];
  const high = Math.round(randAround(s.rng, table.high.mean, table.high.spread));
  const low = Math.min(high - 2, Math.round(randAround(s.rng, table.low.mean, table.low.spread)));
  const condition = weightedPick(s.rng, table.conditions);
  s.weather = { gameDay: d.gameDay, highC: high, lowC: low, condition };
}

function cToF(c: number) { return Math.round(c * 9 / 5 + 32); }

export function describeWeather(pack: Pack, w: GameState['weather']): string {
  if (!w) return 'No forecast';
  const label = pack.weather.labels[w.condition] ?? w.condition;
  return `${label}. High ${w.highC}°C (${cToF(w.highC)}°F), low ${w.lowC}°C (${cToF(w.lowC)}°F)`;
}

function morningBriefing(s: GameState, pack: Pack, t: number, opening = false) {
  const d = toGameDate(pack.calendar.start, t);
  const heading = opening ? `Opening briefing: ${formatDate(d)} (day ${d.gameDay})` : `Morning briefing: ${formatDate(d)} (day ${d.gameDay})`;
  log(s, t, 'briefing', `${heading}. Weather: ${describeWeather(pack, s.weather)}.`);
}

function onBlockStart(s: GameState, pack: Pack, t: number, block: Block) {
  if (block === 'morning') {
    rollWeather(s, pack, t);
    morningBriefing(s, pack, t);
  } else if (block === 'evening') {
    const d = toGameDate(pack.calendar.start, t);
    log(s, t, 'report', `End-of-day report: ${formatDate(d)}. A quiet day on the ranch.`);
  } else {
    log(s, t, 'block', `${BLOCK_LABELS[block]}.`);
  }
  if (!s.seasonOver && t >= seasonEndMinutes(pack)) {
    s.seasonOver = true;
    log(s, t, 'system', 'Calving season is over. That is the end of the first playable season.');
  }
}

// ---------- Advancing time ----------

export interface AdvanceResult {
  state: GameState;
  /** Log entries created during this advance (for "while you were away"). */
  newEntries: LogEntry[];
}

/**
 * Runs the simulation forward to `target` game minutes, processing every block
 * start and timeline item in order. The result is identical whether this is
 * called once for a long span or many times for short ones.
 */
export function advanceTo(state: GameState, pack: Pack, target: number): AdvanceResult {
  const to = Math.floor(target);
  if (to <= state.clock.gameMinutes) return { state, newEntries: [] };
  const next = produce(state, s => {
    let now = s.clock.gameMinutes;
    for (;;) {
      const block = nextBlockStart(now);
      const item = s.timeline[0];
      const nextAt = Math.min(block.at, item ? item.at : Infinity);
      if (nextAt > to) break;
      now = nextAt;
      s.clock.gameMinutes = now;
      // Timeline items due at the same moment as a block start run first.
      while (s.timeline.length && s.timeline[0].at <= now) {
        s.timeline.shift(); // M2 adds handlers for follow-ups and deadlines.
      }
      if (block.at === now) onBlockStart(s, pack, now, block.block);
    }
    s.clock.gameMinutes = to;
  });
  const newEntries = next.log.filter(e => e.t > state.clock.gameMinutes && e.t <= to);
  return { state: next, newEntries };
}

// ---------- Fast forward ----------

/** "Next decision": run to the next decision, capped at the next block start. */
export function nextDecisionTarget(state: GameState): number {
  // M2: stop earlier when a decision arrives. For now, the next block start.
  return nextBlockStart(state.clock.gameMinutes).at;
}

/** "Next day": run to the next 06:00 (M2 adds stopping for urgent decisions). */
export function nextDayTarget(state: GameState): number {
  return nextMorning(state.clock.gameMinutes);
}

export function fastForward(state: GameState, pack: Pack, target: number, realNowMs: number, type: string): AdvanceResult {
  const result = advanceTo(state, pack, target);
  const state2 = produce(result.state, s => {
    reanchor(s.clock, realNowMs, s.clock.gameMinutes);
    s.actions.push({ t: s.clock.gameMinutes, realMs: realNowMs, type, data: { target } });
  });
  return { state: state2, newEntries: result.newEntries };
}

export function setSpeed(state: GameState, speed: number, realNowMs: number): GameState {
  return produce(state, s => {
    reanchor(s.clock, realNowMs, s.clock.gameMinutes);
    s.clock.speed = speed;
  });
}
