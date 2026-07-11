/**
 * Blooming lotus mandala — the classic calm visual. Petals unfurl one by
 * one with progress, the whole flower turns imperceptibly slowly.
 * Must be used inside a Skia <Canvas>.
 */
import React from 'react';
import { Circle, Group, Path } from '@shopify/react-native-skia';

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
}

const OUTER = 10;
const INNER = 8;
const PETAL_PASTELS = ['#CDEBD8', '#FFE3EC', '#D9F2E6', '#FFF3D6'];

/** Teardrop petal pointing up from origin, length l, half-width w. */
function petal(l: number, w: number): string {
  return `M 0 0 C ${-w} ${-l * 0.35} ${-w * 0.7} ${-l * 0.8} 0 ${-l} C ${w * 0.7} ${-l * 0.8} ${w} ${-l * 0.35} 0 0 Z`;
}

export function Lotus({ cx, cy, size, progress, now, opacity = 1, shine = false }: Props) {
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
            <Path
              path={petal(46, 13)}
              color={shine ? colors.rainbow[i % 7] : PETAL_PASTELS[i % 4]}
              opacity={shine ? 0.85 : 1}
            />
            <Path
              path={petal(46, 13)}
              style="stroke"
              strokeWidth={1.4}
              color={shine ? '#FFFFFF' : colors.sage}
              opacity={0.7}
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
            <Path
              path={petal(30, 10)}
              color={shine ? colors.rainbow[(i + 3) % 7] : PETAL_PASTELS[(i + 1) % 4]}
              opacity={shine ? 0.9 : 1}
            />
            <Path
              path={petal(30, 10)}
              style="stroke"
              strokeWidth={1.2}
              color={shine ? '#FFFFFF' : colors.forest}
              opacity={0.35}
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
