/**
 * T2: Procedural crack geometry — jagged branching cracks radiating from
 * the tap point. Pure math, no rendering imports.
 */
import { mulberry32 } from './rng';

export interface CrackOrigin {
  /** relative position inside the block, 0..1 */
  x: number;
  y: number;
  seed: number;
}

const MIN_BRANCHES = 3;
const MAX_BRANCHES = 4;
const SEGMENTS_PER_BRANCH = 4;

/**
 * Generate crack branches as SVG path strings for a block of `size` px.
 * Coordinates are local to the block (0..size), clamped inside with margin.
 */
export function crackPaths(origin: CrackOrigin, size: number): string[] {
  const rand = mulberry32(origin.seed);
  const branches = MIN_BRANCHES + Math.floor(rand() * (MAX_BRANCHES - MIN_BRANCHES + 1));
  const margin = 3;
  const clamp = (v: number) => Math.min(size - margin, Math.max(margin, v));

  const paths: string[] = [];
  const baseAngle = rand() * Math.PI * 2;

  for (let b = 0; b < branches; b++) {
    let x = origin.x * size;
    let y = origin.y * size;
    // spread branches roughly evenly, with jitter
    let angle = baseAngle + (Math.PI * 2 * b) / branches + (rand() - 0.5) * 0.9;
    let d = `M ${x.toFixed(1)} ${y.toFixed(1)}`;

    for (let s = 0; s < SEGMENTS_PER_BRANCH; s++) {
      const len = size * (0.08 + rand() * 0.1) * (1 - s * 0.15); // shorter toward tip
      angle += (rand() - 0.5) * 1.1; // jagged direction changes
      x = clamp(x + Math.cos(angle) * len);
      y = clamp(y + Math.sin(angle) * len);
      d += ` L ${x.toFixed(1)} ${y.toFixed(1)}`;
    }
    paths.push(d);
  }
  return paths;
}
