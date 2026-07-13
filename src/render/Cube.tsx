/**
 * One glass cube: drop-in landing, hit squash-and-stretch, and its crack
 * systems. Drop/squash math lives in src/engine/cubeMotion.ts — this is
 * just the Skia mapping. Must be used inside a Skia <Canvas>.
 */
import React from 'react';
import { Circle, Group, LinearGradient, Path, RoundedRect, vec } from '@shopify/react-native-skia';

import { Block } from '@/engine/blocks';
import { crackPaths } from '@/engine/cracks';
import { dropInOffset, squashStretch, LastHit } from '@/engine/cubeMotion';
import { hashString } from '@/engine/rng';
import { colors } from '@/theme/colors';

interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

interface Props {
  block: Block;
  rect: Rect;
  now: number;
  dropStart: number;
  hit: LastHit | null;
}

export function Cube({ block: b, rect: r, now, dropStart, hit }: Props) {
  const dy = dropInOffset(b.row, b.col, r.y, r.h, now, dropStart);
  const y = r.y + dy;
  const { sx, sy } = squashStretch(hit, b.id, now);

  return (
    <Group transform={[{ scaleX: sx }, { scaleY: sy }]} origin={vec(r.x + r.w / 2, y + r.h)}>
      {/* soft drop shadow */}
      <RoundedRect x={r.x + 2} y={y + 4} width={r.w} height={r.h} r={14} color={colors.forest} opacity={0.12} />
      {/* translucent face with vertical light gradient */}
      <RoundedRect x={r.x} y={y} width={r.w} height={r.h} r={14} opacity={0.9}>
        <LinearGradient
          start={vec(r.x, y)}
          end={vec(r.x, y + r.h)}
          colors={[colors.blockFaceTops[b.colorIndex], colors.blockFaces[b.colorIndex]]}
        />
      </RoundedRect>
      {/* thin top sheen */}
      <RoundedRect
        x={r.x + 4}
        y={y + 3}
        width={r.w - 8}
        height={Math.max(6, r.h * 0.16)}
        r={7}
        color="#FFFFFF"
        opacity={0.3}
      />
      {/* tiny glass bubbles — deterministic per block */}
      {[0, 1, 2, 3, 4, 5, 6].map((k) => {
        const hb = hashString(`${b.id}bub${k}`);
        const bx = r.x + r.w * (0.12 + (hb % 72) / 100);
        const by = y + r.h * (0.22 + ((hb >> 6) % 64) / 100);
        const br = 1.2 + ((hb >> 12) % 26) / 10;
        return <Circle key={`bub${k}`} cx={bx} cy={by} r={br} color="#FFFFFF" opacity={0.22 + ((hb >> 18) % 14) / 100} />;
      })}
      {/* T2: crack systems, one per received hit — deeper hits crack harder */}
      {b.cracks.map((c, ci) =>
        crackPaths(c, r.w, r.h).map((d, pi) => (
          <React.Fragment key={`${b.id}-c${ci}-p${pi}`}>
            {/* light chip offset for depth */}
            <Path
              path={d}
              style="stroke"
              strokeWidth={2.2 + ci * 0.3}
              strokeCap="round"
              strokeJoin="round"
              color="#FFFFFF"
              opacity={0.5}
              transform={[{ translateX: r.x + 1 }, { translateY: y + 1.5 }]}
            />
            <Path
              path={d}
              style="stroke"
              strokeWidth={1.4 + ci * 0.35}
              strokeCap="round"
              strokeJoin="round"
              color={colors.blockCrack}
              opacity={0.85}
              transform={[{ translateX: r.x }, { translateY: y }]}
            />
          </React.Fragment>
        )),
      )}
    </Group>
  );
}
