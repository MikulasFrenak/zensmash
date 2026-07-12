/** Deterministic small PRNG (mulberry32) — pure, testable. */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function hashString(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Pick a random index in [0, count), never `exclude` — for "always something new" variety pickers. */
export function pickDifferent(count: number, exclude: number, rand: () => number = Math.random): number {
  if (count <= 1) return 0;
  let index = Math.floor(rand() * (count - 1));
  if (index >= exclude) index += 1;
  return index;
}
