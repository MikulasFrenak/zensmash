import { shouldShowMoment, pickLine, MILESTONES } from '../moments';

describe('moments engine', () => {
  it('always shows on milestones', () => {
    for (const m of MILESTONES) {
      expect(shouldShowMoment(m, () => 0.99)).toBe(true);
    }
  });

  it('always shows on the very first break', () => {
    expect(shouldShowMoment(1, () => 0.99)).toBe(true);
  });

  it('shows randomly ~1 in 5 otherwise', () => {
    expect(shouldShowMoment(3, () => 0.01)).toBe(true);
    expect(shouldShowMoment(3, () => 0.99)).toBe(false);
  });

  it('never picks a line shown within the no-repeat window', () => {
    const pool = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const recent = [0, 1, 2];
    for (let i = 0; i < 50; i++) {
      const { index } = pickLine(pool, Math.random, recent);
      expect(recent).not.toContain(index);
    }
  });

  it('falls back to the full pool when everything is blocked', () => {
    const pool = ['a', 'b'];
    const { index } = pickLine(pool, () => 0, [0, 1, 0, 1, 0]);
    expect(index).toBeGreaterThanOrEqual(0);
  });

  it('handles empty and single pools', () => {
    expect(pickLine([]).index).toBe(-1);
    expect(pickLine(['only']).text).toBe('only');
  });
});
