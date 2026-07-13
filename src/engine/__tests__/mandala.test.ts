import {
  FLOWER_SPECIES,
  mandalaLayout,
  teardropPath,
  trianglePath,
  MIN_VISIBLE_OPEN,
} from '../mandala';

describe('FLOWER_SPECIES', () => {
  it('always uses a teardrop outer ring so every species reads as a flower', () => {
    for (const flower of FLOWER_SPECIES) {
      expect(flower.outerShape).toBe('teardrop');
    }
  });

  it('gives every species a 4-color palette', () => {
    for (const flower of FLOWER_SPECIES) {
      expect(flower.palette).toHaveLength(4);
    }
  });
});

describe('teardropPath / trianglePath', () => {
  it('starts and ends a teardrop at the origin (petal base pinned to the stem)', () => {
    const d = teardropPath(40, 12);
    expect(d.startsWith('M 0 0')).toBe(true);
    expect(d.trim().endsWith('Z')).toBe(true);
  });

  it('points a triangle petal straight up by -length', () => {
    const d = trianglePath(30, 10);
    expect(d).toContain('M 0 -30');
  });
});

describe('mandalaLayout', () => {
  const flower = FLOWER_SPECIES[0]; // Mint Bloom: 10 outer, 8 inner

  it('has every petal closed at progress 0', () => {
    const layout = mandalaLayout(flower, 0, false);
    expect(layout.outer.every((p) => p.open === 0 && !p.visible)).toBe(true);
    expect(layout.inner.every((p) => p.open === 0 && !p.visible)).toBe(true);
    expect(layout.heartOpacity).toBe(0);
  });

  it('opens every petal, and the heart, by progress 1', () => {
    const layout = mandalaLayout(flower, 1, false);
    expect(layout.outer.every((p) => p.open === 1 && p.visible)).toBe(true);
    expect(layout.inner.every((p) => p.open === 1 && p.visible)).toBe(true);
    expect(layout.heartOpacity).toBeGreaterThan(0);
  });

  it('blooms the outer ring one petal at a time before the inner ring starts', () => {
    // partway through the outer ring only
    const partial = mandalaLayout(flower, 3.4 / (flower.outerCount + flower.innerCount), false);
    expect(partial.outer[0].open).toBe(1); // fully open
    expect(partial.outer[3].open).toBeGreaterThan(0);
    expect(partial.outer[3].open).toBeLessThan(1);
    expect(partial.outer[4].open).toBe(0); // not reached yet
    expect(partial.inner.every((p) => p.open === 0)).toBe(true);
  });

  it('treats a petal as invisible until it clears the minimum-open threshold', () => {
    const total = flower.outerCount + flower.innerCount;
    const justUnder = mandalaLayout(flower, (MIN_VISIBLE_OPEN * 0.5) / total, false);
    expect(justUnder.outer[0].open).toBeLessThanOrEqual(MIN_VISIBLE_OPEN);
    expect(justUnder.outer[0].visible).toBe(false);
  });

  it('swaps to the rainbow palette only in shine mode', () => {
    const normal = mandalaLayout(flower, 1, false);
    const shine = mandalaLayout(flower, 1, true);
    expect(normal.outer[0].fillOpacity).toBe(1);
    expect(shine.outer[0].fillOpacity).toBeLessThan(1);
    // paletteIndex/rainbowIndex are always computed — it's the renderer's
    // choice of which one to use that makes it "shine"
    expect(normal.outer[0].paletteIndex).toBe(shine.outer[0].paletteIndex);
  });

  it('offsets the inner ring angle so petals interleave with the outer ring', () => {
    const layout = mandalaLayout(flower, 1, false);
    expect(layout.inner[0].angle).toBeCloseTo(Math.PI / flower.innerCount);
  });
});
