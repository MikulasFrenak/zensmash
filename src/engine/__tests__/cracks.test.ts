import { crackPaths } from '../cracks';

describe('cracks engine', () => {
  const origin = { x: 0.5, y: 0.5, seed: 42 };

  it('is deterministic for the same seed', () => {
    expect(crackPaths(origin, 64)).toEqual(crackPaths(origin, 64));
  });

  it('differs for different seeds', () => {
    expect(crackPaths(origin, 64)).not.toEqual(crackPaths({ ...origin, seed: 43 }, 64));
  });

  it('generates 3-4 branches starting at the tap point', () => {
    const paths = crackPaths(origin, 64);
    expect(paths.length).toBeGreaterThanOrEqual(3);
    expect(paths.length).toBeLessThanOrEqual(4);
    for (const p of paths) expect(p.startsWith('M 32.0 32.0')).toBe(true);
  });

  it('keeps all points inside the block', () => {
    for (const seed of [1, 2, 3, 99, 12345]) {
      for (const p of crackPaths({ x: 0.9, y: 0.1, seed }, 64)) {
        const nums = p.match(/-?\d+(\.\d+)?/g)!.map(Number);
        for (const n of nums) {
          expect(n).toBeGreaterThanOrEqual(0);
          expect(n).toBeLessThanOrEqual(64);
        }
      }
    }
  });
});
