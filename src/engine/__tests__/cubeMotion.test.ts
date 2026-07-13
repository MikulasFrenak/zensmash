import { dropInOffset, squashStretch, DROP_MS, SQUASH_MS } from '../cubeMotion';

describe('dropInOffset', () => {
  const restY = 200;
  const restH = 80;

  it('starts well above the landed position at the moment of drop', () => {
    const offset = dropInOffset(0, 0, restY, restH, /* now */ 0, /* dropStart */ 0);
    expect(offset).toBeCloseTo(-(restY + restH + 40));
  });

  it('lands exactly at rest once its drop duration has elapsed', () => {
    const offset = dropInOffset(0, 0, restY, restH, DROP_MS, 0);
    expect(offset).toBeCloseTo(0);
  });

  it('stays landed after its drop duration, never overshooting', () => {
    const offset = dropInOffset(0, 0, restY, restH, DROP_MS * 5, 0);
    expect(offset).toBeCloseTo(0);
  });

  it('staggers later rows and columns so they start dropping later', () => {
    const now = 30; // past row 0's delay (0ms), before row 1's (55ms)
    const row0 = dropInOffset(0, 0, restY, restH, now, 0);
    const row1 = dropInOffset(1, 0, restY, restH, now, 0);
    // row 1 hasn't started moving yet, so it's still at its full offset
    expect(row1).toBeCloseTo(-(restY + restH + 40));
    // row 0 has had time to ease in, so it's closer to rest than row 1
    expect(Math.abs(row0)).toBeLessThan(Math.abs(row1));
  });
});

describe('squashStretch', () => {
  it('leaves the cube at rest scale with no hit recorded', () => {
    expect(squashStretch(null, 'b1', 1000)).toEqual({ sx: 1, sy: 1 });
  });

  it('leaves other cubes untouched when a different cube was hit', () => {
    const hit = { id: 'other', time: 1000, rel: { x: 0.5, y: 0.5 } };
    expect(squashStretch(hit, 'b1', 1010)).toEqual({ sx: 1, sy: 1 });
  });

  it('squashes wide and short partway through the pulse', () => {
    const hit = { id: 'b1', time: 1000, rel: { x: 0.5, y: 0.5 } };
    const { sx, sy } = squashStretch(hit, 'b1', 1000 + SQUASH_MS / 2);
    expect(sx).toBeGreaterThan(1);
    expect(sy).toBeLessThan(1);
  });

  it('returns to rest scale once the pulse window has passed', () => {
    const hit = { id: 'b1', time: 1000, rel: { x: 0.5, y: 0.5 } };
    expect(squashStretch(hit, 'b1', 1000 + SQUASH_MS)).toEqual({ sx: 1, sy: 1 });
  });

  it('ignores a hit timestamped after `now` (stale/out-of-order state)', () => {
    const hit = { id: 'b1', time: 1000, rel: { x: 0.5, y: 0.5 } };
    expect(squashStretch(hit, 'b1', 999)).toEqual({ sx: 1, sy: 1 });
  });
});
