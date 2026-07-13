/**
 * Blooming lotus mandala — pure petal geometry and bloom-order math, no
 * rendering imports. Rendered by src/render/Lotus.tsx.
 */

export type PetalShape = 'teardrop' | 'circle' | 'rect' | 'triangle';

export interface FlowerSpecies {
  name: string;
  /** outer ring is always the dominant silhouette — keep it 'teardrop' (leaf-like) so the whole thing still reads as a flower */
  outerShape: PetalShape;
  /** inner ring can be a fun accent shape (circle/triangle/rect look bad as a WHOLE flower on their own, fine as a small inner accent) */
  innerShape: PetalShape;
  outerCount: number;
  innerCount: number;
  outerPetal: [length: number, width: number];
  innerPetal: [length: number, width: number];
  /** 4 soft pastel tones, same lightness/softness family as the game's calm palette */
  palette: [string, string, string, string];
}

export const FLOWER_SPECIES: FlowerSpecies[] = [
  {
    name: 'Mint Bloom',
    outerShape: 'teardrop',
    innerShape: 'teardrop',
    outerCount: 10,
    innerCount: 8,
    outerPetal: [46, 13],
    innerPetal: [30, 10],
    palette: ['#CDEBD8', '#FFE3EC', '#D9F2E6', '#FFF3D6'],
  },
  {
    name: 'Lavender Dream',
    outerShape: 'teardrop',
    innerShape: 'teardrop',
    outerCount: 8,
    innerCount: 6,
    outerPetal: [40, 18],
    innerPetal: [26, 14],
    palette: ['#E5D9F2', '#FFF3D6', '#D9F2E6', '#D6EAF8'],
  },
  {
    name: 'Peach Sunset',
    outerShape: 'teardrop',
    innerShape: 'teardrop',
    outerCount: 12,
    innerCount: 10,
    outerPetal: [50, 9],
    innerPetal: [32, 7],
    palette: ['#FFE0CC', '#FFE3EC', '#D9F2E6', '#FFF9E3'],
  },
  {
    name: 'Sky Meadow',
    outerShape: 'teardrop',
    innerShape: 'teardrop',
    outerCount: 14,
    innerCount: 12,
    outerPetal: [38, 11],
    innerPetal: [24, 8],
    palette: ['#D6EAF8', '#CDEBD8', '#FFF3D6', '#E8F5E9'],
  },
  {
    name: 'Rose Garden',
    outerShape: 'teardrop',
    innerShape: 'teardrop',
    outerCount: 6,
    innerCount: 5,
    outerPetal: [56, 15],
    innerPetal: [36, 11],
    palette: ['#FFE3EC', '#F8D7E3', '#D9F2E6', '#FFF9E3'],
  },
  {
    name: 'Citrus Fresh',
    outerShape: 'teardrop',
    innerShape: 'teardrop',
    outerCount: 9,
    innerCount: 7,
    outerPetal: [42, 16],
    innerPetal: [28, 12],
    palette: ['#FFF3D6', '#D9F2E6', '#FFE0CC', '#CDEBD8'],
  },
  {
    name: 'Garden Mix',
    outerShape: 'teardrop',
    innerShape: 'circle',
    outerCount: 10,
    innerCount: 8,
    outerPetal: [44, 13],
    innerPetal: [16, 8], // [distance from center, circle radius]
    palette: ['#CDEBD8', '#FFE3EC', '#D6EAF8', '#FFF3D6'],
  },
  {
    name: 'Trio Bloom',
    outerShape: 'teardrop',
    innerShape: 'triangle',
    outerCount: 8,
    innerCount: 7,
    outerPetal: [48, 15],
    innerPetal: [26, 7], // [length, half-width]
    palette: ['#E5D9F2', '#FFE3EC', '#D9F2E6', '#FFF9E3'],
  },
  {
    name: 'Ribbon Trim',
    outerShape: 'teardrop',
    innerShape: 'rect',
    outerCount: 9,
    innerCount: 7,
    outerPetal: [46, 14],
    innerPetal: [20, 6], // [length, half-width]
    palette: ['#FFE0CC', '#CDEBD8', '#D6EAF8', '#FFF9E3'],
  },
  {
    name: 'Confetti Bloom',
    outerShape: 'teardrop',
    innerShape: 'circle',
    outerCount: 12,
    innerCount: 10,
    outerPetal: [40, 10],
    innerPetal: [14, 6],
    palette: ['#FFF3D6', '#FFE3EC', '#D6EAF8', '#D9F2E6'],
  },
  {
    name: 'Spiky Heart',
    outerShape: 'teardrop',
    innerShape: 'triangle',
    outerCount: 6,
    innerCount: 6,
    outerPetal: [54, 16],
    innerPetal: [22, 8],
    palette: ['#FFE3EC', '#E5D9F2', '#FFF3D6', '#CDEBD8'],
  },
  {
    // ~30 petals total, thick and fairly uniform between rings — a dense,
    // single-mass mandala rather than a clearly-tiered big/small look.
    name: 'Full Mandala',
    outerShape: 'teardrop',
    innerShape: 'teardrop',
    outerCount: 16,
    innerCount: 14,
    outerPetal: [34, 14],
    innerPetal: [26, 12],
    palette: ['#FFE0CC', '#FFF3D6', '#FFE3EC', '#F8D7E3'],
  },
  {
    // Few, wide petals — the outer ring itself is the showy, medium-width
    // silhouette rather than the usual big-outer/small-inner tiering.
    name: 'Simple Grace',
    outerShape: 'teardrop',
    innerShape: 'teardrop',
    outerCount: 7,
    innerCount: 5,
    outerPetal: [44, 20],
    innerPetal: [24, 16],
    palette: ['#D6EAF8', '#E5D9F2', '#E8F5E9', '#D9F2E6'],
  },
];

/** Teardrop petal pointing up from origin, length l, half-width w. */
export function teardropPath(l: number, w: number): string {
  return `M 0 0 C ${-w} ${-l * 0.35} ${-w * 0.7} ${-l * 0.8} 0 ${-l} C ${w * 0.7} ${-l * 0.8} ${w} ${-l * 0.35} 0 0 Z`;
}

/** Spiky triangle petal pointing up from origin, length l, half-width w. */
export function trianglePath(l: number, w: number): string {
  return `M 0 ${-l} L ${-w} 0 L ${w} 0 Z`;
}

/** Below this, a petal is still fully closed and shouldn't be drawn. */
export const MIN_VISIBLE_OPEN = 0.02;

export interface PetalInstance {
  ring: 'outer' | 'inner';
  index: number;
  /** rotation, radians, placing this petal around the flower's center */
  angle: number;
  /** 0 (closed) .. 1 (fully open) */
  open: number;
  visible: boolean;
  shape: PetalShape;
  length: number;
  width: number;
  /** index into the species' own 4-color palette (non-shine mode) */
  paletteIndex: number;
  /** index into the 7-color rainbow palette (finale shine mode) */
  rainbowIndex: number;
  fillOpacity: number;
  strokeOpacity: number;
  strokeWidth: number;
}

function ringPetals(
  ring: 'outer' | 'inner',
  count: number,
  otherRingCount: number,
  shape: PetalShape,
  [length, width]: [number, number],
  bloomed: number,
  shine: boolean,
): PetalInstance[] {
  const bloomOffset = ring === 'outer' ? 0 : otherRingCount;
  const angleOffset = ring === 'outer' ? 0 : Math.PI / count;
  return Array.from({ length: count }, (_, i) => {
    const open = Math.min(1, Math.max(0, bloomed - bloomOffset - i));
    return {
      ring,
      index: i,
      angle: (Math.PI * 2 * i) / count + angleOffset,
      open,
      visible: open > MIN_VISIBLE_OPEN,
      shape,
      length,
      width,
      paletteIndex: ring === 'outer' ? i % 4 : (i + 1) % 4,
      rainbowIndex: ring === 'outer' ? i % 7 : (i + 3) % 7,
      fillOpacity: shine ? (ring === 'outer' ? 0.85 : 0.9) : 1,
      strokeOpacity: ring === 'outer' ? 0.7 : 0.35,
      strokeWidth: ring === 'outer' ? 1.4 : 1.2,
    };
  });
}

export interface MandalaLayout {
  outer: PetalInstance[];
  inner: PetalInstance[];
  /** 0 = hidden, otherwise the heart's opacity once enough petals have bloomed */
  heartOpacity: number;
}

/**
 * Full petal-by-petal bloom state for one flower species at a given
 * progress (0..1). Outer ring blooms first, one petal at a time, then the
 * inner ring; the heart fades in once roughly half the flower has opened.
 */
export function mandalaLayout(flower: FlowerSpecies, progress: number, shine: boolean): MandalaLayout {
  const total = flower.outerCount + flower.innerCount;
  const bloomed = progress * total;
  return {
    outer: ringPetals('outer', flower.outerCount, flower.innerCount, flower.outerShape, flower.outerPetal, bloomed, shine),
    inner: ringPetals('inner', flower.innerCount, flower.outerCount, flower.innerShape, flower.innerPetal, bloomed, shine),
    heartOpacity: bloomed > 0.5 ? Math.min(1, bloomed / 3) : 0,
  };
}
