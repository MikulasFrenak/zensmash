import {
  createGrid,
  hitBlock,
  isFocusedHit,
  refillIfEmpty,
  GRID_COLS,
  GRID_ROWS,
  TAPS_TO_BREAK,
  FOCUS_WINDOW_MS,
  FOCUS_PROXIMITY,
} from '../blocks';

describe('blocks engine', () => {
  it('creates a full grid', () => {
    expect(createGrid()).toHaveLength(GRID_COLS * GRID_ROWS);
  });

  it('damages a block on hit', () => {
    const grid = createGrid();
    const { blocks, destroyed } = hitBlock(grid, grid[0].id);
    expect(destroyed).toBe(false);
    expect(blocks.find((b) => b.id === grid[0].id)?.damage).toBe(1);
  });

  it(`destroys a block after ${TAPS_TO_BREAK} taps`, () => {
    let grid = createGrid();
    const id = grid[0].id;
    let destroyed = false;
    for (let i = 0; i < TAPS_TO_BREAK; i++) {
      const r = hitBlock(grid, id);
      grid = r.blocks;
      destroyed = r.destroyed;
    }
    expect(destroyed).toBe(true);
    expect(grid.find((b) => b.id === id)).toBeUndefined();
  });

  it('records a crack with the tap point on non-destroying hits', () => {
    const grid = createGrid();
    const { blocks } = hitBlock(grid, grid[0].id, { x: 0.3, y: 0.7 });
    const b = blocks.find((x) => x.id === grid[0].id)!;
    expect(b.cracks).toHaveLength(1);
    expect(b.cracks[0]).toMatchObject({ x: 0.3, y: 0.7 });
  });

  it('refills only when empty', () => {
    expect(refillIfEmpty([])).toHaveLength(GRID_COLS * GRID_ROWS);
    const grid = createGrid();
    expect(refillIfEmpty(grid)).toBe(grid);
  });

  it('applies a custom damage amount, e.g. a focused-hit bonus', () => {
    const grid = createGrid();
    const { blocks } = hitBlock(grid, grid[0].id, undefined, 2);
    expect(blocks.find((b) => b.id === grid[0].id)?.damage).toBe(2);
  });

  it('destroys early when a bonus hit pushes damage past TAPS_TO_BREAK', () => {
    let grid = createGrid();
    const id = grid[0].id;
    const r1 = hitBlock(grid, id); // damage 1
    grid = r1.blocks;
    const r2 = hitBlock(grid, id, undefined, TAPS_TO_BREAK); // way past the threshold
    expect(r2.destroyed).toBe(true);
  });
});

describe('isFocusedHit', () => {
  const rel = { x: 0.5, y: 0.5 };

  it('is false with no previous hit', () => {
    expect(isFocusedHit(null, 'b1', rel, 1000)).toBe(false);
  });

  it('is false on a different block', () => {
    const prev = { id: 'b1', time: 1000, rel };
    expect(isFocusedHit(prev, 'b2', rel, 1100)).toBe(false);
  });

  it('is false outside the time window', () => {
    const prev = { id: 'b1', time: 1000, rel };
    expect(isFocusedHit(prev, 'b1', rel, 1000 + FOCUS_WINDOW_MS + 1)).toBe(false);
  });

  it('is false outside the proximity radius', () => {
    const prev = { id: 'b1', time: 1000, rel };
    const far = { x: rel.x + FOCUS_PROXIMITY + 0.05, y: rel.y };
    expect(isFocusedHit(prev, 'b1', far, 1100)).toBe(false);
  });

  it('is true for a soon, nearby repeat tap on the same block', () => {
    const prev = { id: 'b1', time: 1000, rel };
    const near = { x: rel.x + 0.05, y: rel.y - 0.05 };
    expect(isFocusedHit(prev, 'b1', near, 1000 + FOCUS_WINDOW_MS - 10)).toBe(true);
  });
});
