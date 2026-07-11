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

  it('picks a line and avoids immediate repeats', () => {
    const pool = ['a', 'b', 'c'];
    const { index } = pickLine(pool, () => 0, 0); // would pick 0, was 0 → shifts
    expect(index).toBe(1);
  });

  it('handles empty and single pools', () => {
    expect(pickLine([]).index).toBe(-1);
    expect(pickLine(['only']).text).toBe('only');
  });
});
