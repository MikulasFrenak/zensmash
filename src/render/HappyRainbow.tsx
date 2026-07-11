/**
 * The happy ending badge: a rainbow stretching between two fluffy clouds,
 * with the smiling sun peeking over the top. Everything the sky has,
 * in one peaceful picture.
 * Drawn in a 100×100 unit space. `HappyRainbowBadge` is standalone.
 */
import React from 'react';
import { Canvas, Circle, Group, Path } from '@shopify/react-native-skia';

import { colors } from '@/theme/colors';

interface Props {
  x?: number;
  y?: number;
  size: number;
  opacity?: number;
}

function sparkle(x: number, y: number, s: number): string {
  return `M ${x} ${y - s} L ${x + s * 0.3} ${y - s * 0.3} L ${x + s} ${y} L ${x + s * 0.3} ${y + s * 0.3} L ${x} ${y + s} L ${x - s * 0.3} ${y + s * 0.3} L ${x - s} ${y} L ${x - s * 0.3} ${y - s * 0.3} Z`;
}

export function HappyRainbow({ x = 0, y = 0, size, opacity = 1 }: Props) {
  const k = size / 100;
  const cx = 50;
  const cy = 74;
  return (
    <Group transform={[{ translateX: x }, { translateY: y }, { scale: k }]} opacity={opacity}>
      {/* smiling sun peeking over the rainbow */}
      <Circle cx={74} cy={26} r={12} color="#FFE066" />
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
        const a = (Math.PI * 2 * i) / 8;
        return (
          <Path
            key={`ray${i}`}
            path={`M ${74 + Math.cos(a) * 15} ${26 + Math.sin(a) * 15} L ${74 + Math.cos(a) * 20} ${26 + Math.sin(a) * 20}`}
            style="stroke"
            strokeWidth={2.6}
            strokeCap="round"
            color="#FFE066"
          />
        );
      })}
      {/* sun's happy face */}
      <Path
        path="M 69 24 Q 70.5 26.5 72 24"
        style="stroke"
        strokeWidth={1.6}
        strokeCap="round"
        color="#B8860B"
      />
      <Path
        path="M 76 24 Q 77.5 26.5 79 24"
        style="stroke"
        strokeWidth={1.6}
        strokeCap="round"
        color="#B8860B"
      />
      <Path
        path="M 70 29 Q 74 33 78 29"
        style="stroke"
        strokeWidth={1.8}
        strokeCap="round"
        color="#B8860B"
      />

      {/* rainbow — half arcs from cloud to cloud */}
      {colors.rainbow.map((c, i) => {
        const r = 40 - i * 3.5;
        return (
          <Path
            key={`arc${i}`}
            path={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
            style="stroke"
            strokeWidth={3.6}
            strokeCap="butt"
            color={c}
          />
        );
      })}

      {/* fluffy clouds anchoring the rainbow ends */}
      {[12, 88].map((ccx, i) => (
        <React.Fragment key={`cl${i}`}>
          <Circle cx={ccx} cy={cy} r={10} color="#FFFFFF" />
          <Circle cx={ccx + 9} cy={cy + 2} r={8} color="#FFFFFF" />
          <Circle cx={ccx - 9} cy={cy + 2} r={7.5} color="#FFFFFF" />
          <Circle cx={ccx + 2} cy={cy - 6} r={7} color="#FFFFFF" />
        </React.Fragment>
      ))}

      {/* a bit of magic */}
      <Path path={sparkle(22, 30, 3.6)} color="#DA77F2" opacity={0.9} />
      <Path path={sparkle(38, 16, 3)} color="#66D9E8" opacity={0.9} />
      <Path path={sparkle(90, 48, 3)} color="#8CE99A" opacity={0.85} />
    </Group>
  );
}

/** Standalone badge for RN overlays (outside a Canvas). */
export function HappyRainbowBadge({ size }: { size: number }) {
  return (
    <Canvas style={{ width: size, height: size }}>
      <HappyRainbow size={size} />
    </Canvas>
  );
}
