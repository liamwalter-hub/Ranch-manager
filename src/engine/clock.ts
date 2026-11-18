import type { ClockState } from './types';

/**
 * Where the game clock *should* be at a given real time.
 * Never earlier than what has already been simulated, so the clock cannot run
 * backwards even if the phone's clock is changed.
 */
export function targetGameMinutes(clock: ClockState, realMs: number): number {
  const elapsedMin = ((realMs - clock.anchorRealMs) / 60000) * clock.speed;
  return Math.max(clock.gameMinutes, clock.anchorGameMinutes + elapsedMin);
}

/**
 * Re-link real time to the game clock at `gameMinutes` (after fast forward, a
 * speed change, or if the phone's clock has gone backwards).
 */
export function reanchor(clock: ClockState, realMs: number, gameMinutes = clock.gameMinutes): void {
  clock.anchorRealMs = realMs;
  clock.anchorGameMinutes = gameMinutes;
}
