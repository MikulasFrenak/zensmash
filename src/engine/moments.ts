/**
 * T3: Happy moments — when and what to show after a break. Pure logic.
 */

export const MILESTONES = new Set([10, 25, 50, 100, 200, 500, 1000]);
const RANDOM_CHANCE = 1 / 5;

/** Always on the first break and milestones, otherwise ~1 in 5 breaks. */
export function shouldShowMoment(breakCount: number, rand: () => number = Math.random): boolean {
  if (breakCount === 1 || MILESTONES.has(breakCount)) return true;
  return rand() < RANDOM_CHANCE;
}

/** A line may repeat only after at least this many other lines were shown. */
export const NO_REPEAT_WINDOW = 5;

/**
 * Pick a line from the pool, excluding the most recently shown ones
 * (`recent` = indices, newest last). Falls back to the full pool if
 * the window would exclude everything.
 */
export function pickLine(
  pool: readonly string[],
  rand: () => number = Math.random,
  recent: readonly number[] = [],
): { text: string; index: number } {
  if (pool.length === 0) return { text: '', index: -1 };
  const blocked = new Set(recent.slice(-NO_REPEAT_WINDOW));
  const candidates: number[] = [];
  for (let i = 0; i < pool.length; i++) {
    if (!blocked.has(i)) candidates.push(i);
  }
  const pickFrom = candidates.length > 0 ? candidates : [...pool.keys()];
  const index = pickFrom[Math.floor(rand() * pickFrom.length)];
  return { text: pool[index], index };
}
