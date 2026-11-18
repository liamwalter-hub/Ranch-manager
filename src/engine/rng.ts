/**
 * Seeded random number generator (sfc32). Its whole state is four numbers kept
 * in the game state, so a save continues the exact same random sequence.
 */
export interface RngState { a: number; b: number; c: number; d: number }

export function seedRng(seed: string): RngState {
  // cyrb128 hash of the seed string -> four 32-bit numbers.
  let h1 = 1779033703, h2 = 3144134277, h3 = 1013904242, h4 = 2773480762;
  for (let i = 0; i < seed.length; i++) {
    const k = seed.charCodeAt(i);
    h1 = h2 ^ Math.imul(h1 ^ k, 597399067);
    h2 = h3 ^ Math.imul(h2 ^ k, 2869860233);
    h3 = h4 ^ Math.imul(h3 ^ k, 951274213);
    h4 = h1 ^ Math.imul(h4 ^ k, 2716044179);
  }
  h1 = Math.imul(h3 ^ (h1 >>> 18), 597399067);
  h2 = Math.imul(h4 ^ (h2 >>> 22), 2869860233);
  h3 = Math.imul(h1 ^ (h3 >>> 17), 951274213);
  h4 = Math.imul(h2 ^ (h4 >>> 19), 2716044179);
  const rng = { a: (h1 ^ h2 ^ h3 ^ h4) >>> 0, b: (h2 ^ h1) >>> 0, c: (h3 ^ h1) >>> 0, d: (h4 ^ h1) >>> 0 };
  for (let i = 0; i < 15; i++) random(rng); // warm up
  return rng;
}

/** Returns a number in [0, 1) and advances the state in place. */
export function random(s: RngState): number {
  s.a >>>= 0; s.b >>>= 0; s.c >>>= 0; s.d >>>= 0;
  const t = (s.a + s.b) | 0;
  s.a = s.b ^ (s.b >>> 9);
  s.b = (s.c + (s.c << 3)) | 0;
  s.c = (s.c << 21) | (s.c >>> 11);
  s.d = (s.d + 1) | 0;
  const r = (t + s.d) | 0;
  s.c = (s.c + r) | 0;
  return (r >>> 0) / 4294967296;
}

export function randInt(s: RngState, min: number, max: number): number {
  return min + Math.floor(random(s) * (max - min + 1));
}

/** Roughly bell-shaped value: mean ± spread (sum of three uniforms). */
export function randAround(s: RngState, mean: number, spread: number): number {
  const u = (random(s) + random(s) + random(s)) / 3; // 0..1, peaked at 0.5
  return mean + (u * 2 - 1) * spread;
}

export function weightedPick<K extends string>(s: RngState, weights: Record<K, number>): K {
  const entries = Object.entries(weights) as [K, number][];
  const total = entries.reduce((sum, [, w]) => sum + w, 0);
  let roll = random(s) * total;
  for (const [k, w] of entries) {
    roll -= w;
    if (roll < 0) return k;
  }
  return entries[entries.length - 1][0];
}
