import { describe, expect, it } from 'vitest';
import { montanaPack as pack } from '../src/content/montana';
import { targetGameMinutes } from '../src/engine/clock';
import { random, seedRng } from '../src/engine/rng';
import { advanceTo, fastForward, newGame, nextDayTarget, nextDecisionTarget, setSpeed } from '../src/engine/sim';

const REAL = 1_800_000_000_000;
const fresh = (seed = 'test', minuteOfDay = 9 * 60) =>
  newGame({ pack, seed, realNowMs: REAL, localMinuteOfDay: minuteOfDay });

describe('seeded random numbers', () => {
  it('same seed gives the same sequence', () => {
    const a = seedRng('x'), b = seedRng('x'), c = seedRng('y');
    const seqA = Array.from({ length: 5 }, () => random(a));
    expect(Array.from({ length: 5 }, () => random(b))).toEqual(seqA);
    expect(Array.from({ length: 5 }, () => random(c))).not.toEqual(seqA);
  });
});

describe('new game', () => {
  it('starts on day 1 at the local time of day, with an opening briefing', () => {
    const s = fresh('a', 21 * 60 + 15);
    expect(s.clock.gameMinutes).toBe(21 * 60 + 15);
    expect(s.log.some(e => e.kind === 'briefing' && e.text.startsWith('Opening briefing: Monday 1 March'))).toBe(true);
    expect(s.weather).not.toBeNull();
  });
});

describe('advancing time', () => {
  it('one long advance equals many short ones (determinism)', () => {
    const target = 20 * 1440 + 333;
    const once = advanceTo(fresh(), pack, target).state;
    let chunked = fresh();
    let t = chunked.clock.gameMinutes;
    let step = 1;
    while (t < target) {
      t = Math.min(target, t + step);
      chunked = advanceTo(chunked, pack, t).state;
      step = (step * 7 + 13) % 997 + 1; // irregular chunk sizes
    }
    expect(chunked).toEqual(once);
  });

  it('produces three block events per day', () => {
    const s0 = fresh('b', 0);
    const { newEntries } = advanceTo(s0, pack, 1440);
    expect(newEntries.map(e => e.kind)).toEqual(['briefing', 'block', 'report']);
  });

  it('never runs backwards', () => {
    const s = advanceTo(fresh(), pack, 2000).state;
    expect(advanceTo(s, pack, 100).state.clock.gameMinutes).toBe(2000);
    // Phone clock set back an hour: target stays at what has been simulated.
    expect(targetGameMinutes(s.clock, REAL - 3_600_000)).toBeGreaterThanOrEqual(2000);
  });

  it('follows real time at 1:1, and faster with the debug multiplier', () => {
    const s = fresh('c', 600);
    expect(targetGameMinutes(s.clock, REAL + 90 * 60_000)).toBe(690);
    const fast = setSpeed(s, 60, REAL);
    expect(targetGameMinutes(fast.clock, REAL + 60_000)).toBe(660);
  });
});

describe('fast forward', () => {
  it('Next decision stops at the next block start', () => {
    const s = fresh('d', 9 * 60 + 30);
    expect(nextDecisionTarget(s)).toBe(12 * 60);
  });

  it('Next day goes to 06:00 tomorrow and the clock carries on from there', () => {
    const s = fresh('e', 9 * 60);
    const target = nextDayTarget(s);
    expect(target).toBe(1440 + 6 * 60);
    const { state } = fastForward(s, pack, target, REAL + 5000, 'nextDay');
    expect(state.clock.gameMinutes).toBe(target);
    // Five real minutes later the game is five minutes further on.
    expect(targetGameMinutes(state.clock, REAL + 5000 + 5 * 60_000)).toBe(target + 5);
    expect(state.actions).toHaveLength(1);
  });

  it('ends the season in mid-April', () => {
    const { state } = advanceTo(fresh(), pack, 60 * 1440);
    expect(state.seasonOver).toBe(true);
  });
});
