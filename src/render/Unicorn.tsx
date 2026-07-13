/**
 * ZenSmash unicorn — front-facing chibi, maximum good feel. Big sparkly
 * eyes, open laughing mouth, striped horn, rainbow crown of curls, blush
 * on both cheeks, sparkles everywhere.
 * Drawn in a 100×100 unit space, scaled to `size`. `Unicorn` must be used
 * inside a Skia <Canvas>; `UnicornBadge` is a standalone view for overlays.
 */
import React from 'react';
import {
  Canvas,
  Circle,
  Group,
  LinearGradient,
  Path,
  vec,
} from '@shopify/react-native-skia';

import { colors } from '@/theme/colors';

interface Props {
  x?: number;
  y?: number;
  size: number;
  opacity?: number;
}

/** Rainbow crown — curls across the top of the head, red to violet. */
const CROWN: [number, number, number][] = [
  [22, 32, 8.5],
  [30, 24, 8.5],
  [40, 19, 8.5],
  [50, 17, 9],
  [60, 19, 8.5],
  [70, 24, 8.5],
  [78, 32, 8.5],
];

/** Hanging curls down the right side. */
const SIDE_CURLS: [number, number, number][] = [
  [83, 44, 7],
  [85, 56, 6],
];

/** Little 4-point sparkle. */
function sparkle(x: number, y: number, s: number): string {
  return `M ${x} ${y - s} L ${x + s * 0.3} ${y - s * 0.3} L ${x + s} ${y} L ${x + s * 0.3} ${y + s * 0.3} L ${x} ${y + s} L ${x - s * 0.3} ${y + s * 0.3} L ${x - s} ${y} L ${x - s * 0.3} ${y - s * 0.3} Z`;
}

export function Unicorn({ x = 0, y = 0, size, opacity = 1 }: Props) {
  const k = size / 100;
  return (
    <Group transform={[{ translateX: x }, { translateY: y }, { scale: k }]} opacity={opacity}>
      {/* ears */}
      <Path path="M 16 36 L 23 16 L 34 31 Z" color="#FFFFFF" />
      <Path path="M 20 32 L 24 21 L 30 29 Z" color={colors.sage} />
      <Path path="M 66 31 L 77 16 L 84 36 Z" color="#FFFFFF" />
      <Path path="M 70 29 L 76 21 L 80 32 Z" color={colors.sage} />

      {/* head (mint rim, white face) */}
      <Circle cx={50} cy={58} r={29} color={colors.mint} />
      <Circle cx={50} cy={58} r={27.5} color="#FFFFFF" />

      {/* big horn — on top of the head, its base tucked under the mane */}
      <Path path="M 42 30 L 50 0 L 58 30 Z">
        <LinearGradient
          start={vec(50, 0)}
          end={vec(50, 30)}
          colors={['#DA77F2', '#66D9E8', '#FFE066', '#FF6B6B']}
        />
      </Path>
      <Path
        path="M 45 16 L 55 11"
        style="stroke"
        strokeWidth={2.2}
        strokeCap="round"
        color="#FFFFFF"
        opacity={0.65}
      />
      <Path
        path="M 47 8 L 53 5"
        style="stroke"
        strokeWidth={1.8}
        strokeCap="round"
        color="#FFFFFF"
        opacity={0.65}
      />

      {/* rainbow crown of curls, over the head's top edge */}
      {CROWN.map(([cx, cy, r], i) => (
        <Circle key={`crown${i}`} cx={cx} cy={cy} r={r} color={colors.rainbow[i]} />
      ))}
      {SIDE_CURLS.map(([cx, cy, r], i) => (
        <Circle key={`side${i}`} cx={cx} cy={cy} r={r} color={colors.rainbow[(i + 5) % 7]} />
      ))}

      {/* big sparkly eyes */}
      <Circle cx={37} cy={54} r={6.5} color={colors.textPrimary} />
      <Circle cx={39} cy={52} r={2.2} color="#FFFFFF" />
      <Circle cx={35.5} cy={56.5} r={1.1} color="#FFFFFF" />
      <Circle cx={63} cy={54} r={6.5} color={colors.textPrimary} />
      <Circle cx={65} cy={52} r={2.2} color="#FFFFFF" />
      <Circle cx={61.5} cy={56.5} r={1.1} color="#FFFFFF" />

      {/* laughing open mouth + tongue */}
      <Path path="M 40 68 Q 50 83 60 68 Q 50 73 40 68 Z" color={colors.textPrimary} />
      <Circle cx={50} cy={74} r={3.4} color="#FF8FA3" />

      {/* nostrils + double blush */}
      <Circle cx={45} cy={64.5} r={1.5} color={colors.textSecondary} />
      <Circle cx={55} cy={64.5} r={1.5} color={colors.textSecondary} />
      <Circle cx={26} cy={64} r={5.5} color="#FFB3C1" opacity={0.65} />
      <Circle cx={74} cy={64} r={5.5} color="#FFB3C1" opacity={0.65} />

      {/* sparkles — a bit of magic */}
      <Path path={sparkle(10, 22, 4)} color="#FFE066" opacity={0.9} />
      <Path path={sparkle(90, 20, 3.2)} color="#66D9E8" opacity={0.9} />
      <Path path={sparkle(93, 60, 3.5)} color="#DA77F2" opacity={0.85} />
      <Path path={sparkle(7, 62, 3)} color="#8CE99A" opacity={0.85} />
      <Path path={sparkle(50, 94, 3)} color="#FFA94D" opacity={0.8} />
    </Group>
  );
}

/** Standalone unicorn for RN overlays (outside a Canvas). */
export function UnicornBadge({ size }: { size: number }) {
  return (
    <Canvas style={{ width: size, height: size }}>
      <Unicorn size={size} />
    </Canvas>
  );
}
