import type { RngState } from './rng';

export const SAVE_VERSION = 1;

export interface ClockState {
  /** How far the simulation has actually run (whole game minutes). Never decreases. */
  gameMinutes: number;
  /** Link between real time and game time: at real time anchorRealMs, the game was at anchorGameMinutes. */
  anchorRealMs: number;
  anchorGameMinutes: number;
  /** Debug speed multiplier. 1 = real time. */
  speed: number;
}

export interface Weather {
  gameDay: number;
  highC: number;
  lowC: number;
  condition: string;
}

export type LogKind = 'system' | 'briefing' | 'report' | 'block' | 'weather';

export interface LogEntry {
  t: number; // game minutes
  kind: LogKind;
  text: string;
}

/** Something due at a set game time (follow-ups, deadlines...). Kept sorted by `at`. */
export interface TimelineItem {
  at: number;
  kind: string;
  data?: Record<string, unknown>;
}

export interface PlayerAction {
  t: number;
  realMs: number;
  type: string;
  data?: Record<string, unknown>;
}

export interface GameState {
  version: number;
  packId: string;
  seed: string;
  rng: RngState;
  createdRealMs: number;
  clock: ClockState;
  weather: Weather | null;
  timeline: TimelineItem[];
  log: LogEntry[];
  actions: PlayerAction[];
  seasonOver: boolean;
}
