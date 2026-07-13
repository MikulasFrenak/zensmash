/**
 * Pure per-cube animation math — drop-in easing and hit squash/stretch.
 * No React/rendering imports. Consumed by src/render/Cube.tsx.
 */

/** How long a freshly-dropped cube takes to land. */
export const DROP_MS = 700;

/** How long the squash-and-stretch pulse lasts after a (non-breaking) hit. */
export const SQUASH_MS = 140;

/** Max squash amount — kept subtle per the "no more than 4%" design rule. */
export const SQUASH_AMOUNT = 0.04;

/**
 * Vertical offset (px, always <= 0) for a cube staggered-dropping in from
 * above the field. `restY` is the cube's landed y position and `restH` its
 * height — together they set how far above the field the drop starts.
 */
export function dropInOffset(
  row: number,
  col: number,
  restY: number,
  restH: number,
  now: number,
  dropStart: number,
): number {
  const delay = row * 55 + col * 25;
  const p = Math.min(1, Math.max(0, (now - dropStart - delay) / DROP_MS));
  const ease = 1 - Math.pow(1 - p, 3);
  return -(restY + restH + 40) * (1 - ease);
}

export interface LastHit {
  id: string;
  time: number;
  rel: { x: number; y: number };
}

/** Squash-and-stretch scale for a cube, briefly after it's tapped (not broken). */
export function squashStretch(hit: LastHit | null, blockId: string, now: number): { sx: number; sy: number } {
  if (!hit || hit.id !== blockId) return { sx: 1, sy: 1 };
  const dt = now - hit.time;
  if (dt < 0 || dt >= SQUASH_MS) return { sx: 1, sy: 1 };
  const q = Math.sin((Math.PI * dt) / SQUASH_MS) * SQUASH_AMOUNT;
  return { sx: 1 + q * 0.5, sy: 1 - q };
}
