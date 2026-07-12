/**
 * Pure game logic — no React, no rendering. Unit-testable (S1/S2/S5).
 */
import { CrackOrigin } from './cracks';

export const GRID_COLS = 3;
export const GRID_ROWS = 5;
export const TAPS_TO_BREAK = 5;

/** Funny objects hiding inside surprise blocks (~1 in 6). */
export const PRIZES = ['🦆', '🧦', '🍩', '🥑', '🐢', '🍕', '🎈', '🧸', '🌵', '🛁', '🐙', '🧀'];
const PRIZE_CHANCE = 1 / 6;

export interface Block {
  id: string;
  col: number;
  row: number;
  /** 0 = intact … TAPS_TO_BREAK = destroyed */
  damage: number;
  colorIndex: number;
  /** T2: one crack system per received hit */
  cracks: CrackOrigin[];
  /** surprise inside — revealed as the block cracks, pops free on break */
  prize?: string;
}

let nextId = 0;
const makeId = () => `b${nextId++}`;

export function createBlock(col: number, row: number): Block {
  return {
    id: makeId(),
    col,
    row,
    damage: 0,
    colorIndex: Math.floor(Math.random() * 4),
    cracks: [],
    prize:
      Math.random() < PRIZE_CHANCE
        ? PRIZES[Math.floor(Math.random() * PRIZES.length)]
        : undefined,
  };
}

export function createGrid(): Block[] {
  const blocks: Block[] = [];
  for (let row = 0; row < GRID_ROWS; row++) {
    for (let col = 0; col < GRID_COLS; col++) {
      blocks.push(createBlock(col, row));
    }
  }
  return blocks;
}

export interface HitResult {
  blocks: Block[];
  hit: Block | null;
  destroyed: boolean;
}

/** A second tap on the same spot, this soon after the first, lands a focused hit worth more damage. */
export const FOCUS_WINDOW_MS = 450;
export const FOCUS_PROXIMITY = 0.15; // relative (0..1) block-space distance
export const FOCUS_BONUS_DAMAGE = 2;

/**
 * Whether `id`/`rel`/`now` qualifies as a focused hit against the previous
 * tap — same block, soon after, and close to the same spot on it.
 */
export function isFocusedHit(
  prev: { id: string; time: number; rel: { x: number; y: number } } | null,
  id: string,
  rel: { x: number; y: number },
  now: number,
): boolean {
  if (!prev || prev.id !== id) return false;
  if (now - prev.time > FOCUS_WINDOW_MS) return false;
  const dx = rel.x - prev.rel.x;
  const dy = rel.y - prev.rel.y;
  return Math.sqrt(dx * dx + dy * dy) <= FOCUS_PROXIMITY;
}

/**
 * Apply one tap of damage to the block with the given id.
 * `point` is the tap position relative to the block (0..1) — seeds the crack.
 * `amount` lets a focused hit (see isFocusedHit) count for more than 1.
 */
export function hitBlock(
  blocks: Block[],
  id: string,
  point?: { x: number; y: number },
  amount = 1,
): HitResult {
  const target = blocks.find((b) => b.id === id);
  if (!target) return { blocks, hit: null, destroyed: false };

  const damage = target.damage + amount;
  if (damage >= TAPS_TO_BREAK) {
    return {
      blocks: blocks.filter((b) => b.id !== id),
      hit: target,
      destroyed: true,
    };
  }

  const crack: CrackOrigin = {
    x: point?.x ?? 0.5,
    y: point?.y ?? 0.5,
    seed: (Math.random() * 0xffffffff) >>> 0,
  };
  const updated: Block = { ...target, damage, cracks: [...target.cracks, crack] };
  return {
    blocks: blocks.map((b) => (b.id === id ? updated : b)),
    hit: updated,
    destroyed: false,
  };
}

/** S5: when the field is empty, a fresh grid drops in. */
export function refillIfEmpty(blocks: Block[]): Block[] {
  return blocks.length === 0 ? createGrid() : blocks;
}
