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

/** Pick a line from the pool, avoiding immediate repetition. */
export function pickLine(
  pool: readonly string[],
  rand: () => number = Math.random,
  lastIndex = -1,
): { text: string; index: number } {
  if (pool.length === 0) return { text: '', index: -1 };
  if (pool.length === 1) return { text: pool[0], index: 0 };
  let index = Math.floor(rand() * pool.length);
  if (index === lastIndex) index = (index + 1) % pool.length;
  return { text: pool[index], index };
}
