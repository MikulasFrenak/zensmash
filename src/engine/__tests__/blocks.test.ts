import {
  createGrid,
  hitBlock,
  refillIfEmpty,
  GRID_COLS,
  GRID_ROWS,
  TAPS_TO_BREAK,
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
});
