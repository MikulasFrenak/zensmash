import { pickDifferent } from '../rng';

describe('pickDifferent', () => {
  it('never returns the excluded index', () => {
    for (let i = 0; i < 50; i++) {
      const index = pickDifferent(10, 3, Math.random);
      expect(index).not.toBe(3);
      expect(index).toBeGreaterThanOrEqual(0);
      expect(index).toBeLessThan(10);
    }
  });

  it('falls back to 0 when there is only one option', () => {
    expect(pickDifferent(1, 0)).toBe(0);
  });

  it('is deterministic given a seeded rand', () => {
    expect(pickDifferent(6, 2, () => 0)).toBe(0);
    expect(pickDifferent(6, 2, () => 0.999)).toBe(5);
  });
});
