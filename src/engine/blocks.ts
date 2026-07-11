/**
 * Pure game logic — no React, no rendering. Unit-testable (S1/S2/S5).
 */
import { CrackOrigin } from './cracks';

export const GRID_COLS = 5;
export const GRID_ROWS = 7;
export const TAPS_TO_BREAK = 3;

export interface Block {
  id: string;
  col: number;
  row: number;
  /** 0 = intact … TAPS_TO_BREAK = destroyed */
  damage: number;
  colorIndex: number;
  /** T2: one crack system per received hit */
  cracks: CrackOrigin[];
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

/**
 * Apply one tap of damage to the block with the given id.
 * `point` is the tap position relative to the block (0..1) — seeds the crack.
 */
export function hitBlock(
  blocks: Block[],
  id: string,
  point?: { x: number; y: number },
): HitResult {
  const target = blocks.find((b) => b.id === id);
  if (!target) return { blocks, hit: null, destroyed: false };

  const damage = target.damage + 1;
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
