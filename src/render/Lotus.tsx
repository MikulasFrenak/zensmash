/**
 * Blooming lotus mandala — the classic calm visual. Petals unfurl one by
 * one with progress, the whole flower turns imperceptibly slowly.
 * Must be used inside a Skia <Canvas>. Bloom/geometry math lives in
 * src/engine/mandala.ts — this is just the Skia mapping.
 */
import React from 'react';
import { Circle, Group, Path, RoundedRect } from '@shopify/react-native-skia';

import {
  FLOWER_SPECIES,
  mandalaLayout,
  teardropPath,
  trianglePath,
  PetalInstance,
} from '@/engine/mandala';
import { colors } from '@/theme/colors';

export { FLOWER_SPECIES };

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

/** One petal, rendered as whichever primitive shape this flower species uses. */
function Petal({ shape, length: l, width: w, color, fillOpacity, strokeColor, strokeOpacity, strokeWidth }: {
  shape: PetalInstance['shape'];
  length: number;
  width: number;
  color: string;
  fillOpacity: number;
  strokeColor: string;
  strokeOpacity: number;
  strokeWidth: number;
}) {
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

/** One ring's petals — outer uses sage strokes, inner uses forest, shine mode swaps both to white + rainbow fill. */
function PetalRing({ petals, palette, shine }: { petals: PetalInstance[]; palette: [string, string, string, string]; shine: boolean }) {
  return (
    <>
      {petals.map((p) => {
        if (!p.visible) return null;
        const strokeColor = shine ? '#FFFFFF' : p.ring === 'outer' ? colors.sage : colors.forest;
        const color = shine ? colors.rainbow[p.rainbowIndex] : palette[p.paletteIndex];
        return (
          <Group key={`${p.ring}${p.index}`} transform={[{ rotate: p.angle }, { scale: p.open }]} opacity={p.open}>
            <Petal
              shape={p.shape}
              length={p.length}
              width={p.width}
              color={color}
              fillOpacity={p.fillOpacity}
              strokeColor={strokeColor}
              strokeOpacity={p.strokeOpacity}
              strokeWidth={p.strokeWidth}
            />
          </Group>
        );
      })}
    </>
  );
}

export function Lotus({ cx, cy, size, progress, now, opacity = 1, shine = false, species = 0 }: Props) {
  const flower = FLOWER_SPECIES[species % FLOWER_SPECIES.length];
  const k = size / 100;
  const spin = ((now / 90000) % (Math.PI * 2)) * (180 / Math.PI); // one turn / 1.5 min
  const pulse = shine ? 1 + 0.03 * Math.sin(now / 260) : 1; // breathing shine
  const layout = mandalaLayout(flower, progress, shine);

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
      <PetalRing petals={layout.outer} palette={flower.palette} shine={shine} />
      <PetalRing petals={layout.inner} palette={flower.palette} shine={shine} />
      {/* heart of the flower */}
      {layout.heartOpacity > 0 && (
        <>
          <Circle cx={0} cy={0} r={shine ? 11 : 9} color="#FFE066" opacity={layout.heartOpacity} />
          <Circle cx={0} cy={0} r={shine ? 6 : 5} color="#FFD43B" opacity={layout.heartOpacity} />
        </>
      )}
    </Group>
  );
}
