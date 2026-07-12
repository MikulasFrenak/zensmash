/**
 * Blooming lotus mandala — the classic calm visual. Petals unfurl one by
 * one with progress, the whole flower turns imperceptibly slowly.
 * Must be used inside a Skia <Canvas>.
 */
import React from 'react';
import { Circle, Group, Path, RoundedRect } from '@shopify/react-native-skia';

import { colors } from '@/theme/colors';

interface Props {
  cx: number;
  cy: number;
  size: number;
  /** 0..1 — how much of the flower has bloomed */
  progress: number;
  /** timestamp for the slow rotation */
  now: number;
  opacity?: number;
  /** finale: full vivid rainbow colors + golden shine */
  shine?: boolean;
  /** which flower species to render — pick once per session, see FLOWER_SPECIES */
  species?: number;
}

type PetalShape = 'teardrop' | 'circle' | 'rect' | 'triangle';

interface FlowerSpecies {
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
function teardropPath(l: number, w: number): string {
  return `M 0 0 C ${-w} ${-l * 0.35} ${-w * 0.7} ${-l * 0.8} 0 ${-l} C ${w * 0.7} ${-l * 0.8} ${w} ${-l * 0.35} 0 0 Z`;
}

/** Spiky triangle petal pointing up from origin, length l, half-width w. */
function trianglePath(l: number, w: number): string {
  return `M 0 ${-l} L ${-w} 0 L ${w} 0 Z`;
}

interface PetalProps {
  shape: PetalShape;
  length: number;
  width: number;
  color: string;
  fillOpacity: number;
  strokeColor: string;
  strokeOpacity: number;
  strokeWidth: number;
}

/** One petal, rendered as whichever primitive shape this flower species uses. */
function Petal({ shape, length: l, width: w, color, fillOpacity, strokeColor, strokeOpacity, strokeWidth }: PetalProps) {
  if (shape === 'circle') {
    const cy = -l * 0.6;
    return (
      <>
        <Circle cx={0} cy={cy} r={w} color={color} opacity={fillOpacity} />
        <Circle cx={0} cy={cy} r={w} style="stroke" strokeWidth={strokeWidth} color={strokeColor} opacity={strokeOpacity} />
      </>
    );
  }
  if (shape === 'rect') {
    const rectProps = { x: -w, y: -l, width: w * 2, height: l, r: w * 0.4 };
    return (
      <>
        <RoundedRect {...rectProps} color={color} opacity={fillOpacity} />
        <RoundedRect {...rectProps} style="stroke" strokeWidth={strokeWidth} color={strokeColor} opacity={strokeOpacity} />
      </>
    );
  }
  const path = shape === 'triangle' ? trianglePath(l, w) : teardropPath(l, w);
  return (
    <>
      <Path path={path} color={color} opacity={fillOpacity} />
      <Path path={path} style="stroke" strokeWidth={strokeWidth} color={strokeColor} opacity={strokeOpacity} />
    </>
  );
}

export function Lotus({ cx, cy, size, progress, now, opacity = 1, shine = false, species = 0 }: Props) {
  const flower = FLOWER_SPECIES[species % FLOWER_SPECIES.length];
  const { outerShape, innerShape, outerCount: OUTER, innerCount: INNER, outerPetal, innerPetal, palette } = flower;
  const k = size / 100;
  const spin = ((now / 90000) % (Math.PI * 2)) * (180 / Math.PI); // one turn / 1.5 min
  const total = OUTER + INNER;
  const bloomed = progress * total;
  const pulse = shine ? 1 + 0.03 * Math.sin(now / 260) : 1; // breathing shine

  return (
    <Group
      transform={[
        { translateX: cx },
        { translateY: cy },
        { scale: k * pulse },
        { rotate: (spin * Math.PI) / 180 },
      ]}
      opacity={opacity}
    >
      {/* outer ring */}
      {Array.from({ length: OUTER }, (_, i) => {
        const open = Math.min(1, Math.max(0, bloomed - i));
        if (open <= 0.02) return null;
        const angle = (Math.PI * 2 * i) / OUTER;
        return (
          <Group
            key={`o${i}`}
            transform={[{ rotate: angle }, { scale: open }]}
            opacity={open}
          >
            <Petal
              shape={outerShape}
              length={outerPetal[0]}
              width={outerPetal[1]}
              color={shine ? colors.rainbow[i % 7] : palette[i % 4]}
              fillOpacity={shine ? 0.85 : 1}
              strokeColor={shine ? '#FFFFFF' : colors.sage}
              strokeOpacity={0.7}
              strokeWidth={1.4}
            />
          </Group>
        );
      })}
      {/* inner ring, offset between outer petals */}
      {Array.from({ length: INNER }, (_, i) => {
        const open = Math.min(1, Math.max(0, bloomed - OUTER - i));
        if (open <= 0.02) return null;
        const angle = (Math.PI * 2 * i) / INNER + Math.PI / INNER;
        return (
          <Group
            key={`n${i}`}
            transform={[{ rotate: angle }, { scale: open }]}
            opacity={open}
          >
            <Petal
              shape={innerShape}
              length={innerPetal[0]}
              width={innerPetal[1]}
              color={shine ? colors.rainbow[(i + 3) % 7] : palette[(i + 1) % 4]}
              fillOpacity={shine ? 0.9 : 1}
              strokeColor={shine ? '#FFFFFF' : colors.forest}
              strokeOpacity={0.35}
              strokeWidth={1.2}
            />
          </Group>
        );
      })}
      {/* heart of the flower */}
      {bloomed > 0.5 && (
        <>
          <Circle cx={0} cy={0} r={shine ? 11 : 9} color="#FFE066" opacity={Math.min(1, bloomed / 3)} />
          <Circle cx={0} cy={0} r={shine ? 6 : 5} color="#FFD43B" opacity={Math.min(1, bloomed / 3)} />
        </>
      )}
    </Group>
  );
}
