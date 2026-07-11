/**
 * S1–S3 + T1 (3D depth) + T2 (procedural cracks) + T3 (happy moments).
 */
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { View, useWindowDimensions } from 'react-native';
import { Canvas, RoundedRect, Path, Circle } from '@shopify/react-native-skia';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

import {
  Block,
  createGrid,
  hitBlock,
  refillIfEmpty,
  GRID_COLS,
  GRID_ROWS,
} from '@/engine/blocks';
import { crackPaths } from '@/engine/cracks';
import { shouldShowMoment, pickLine } from '@/engine/moments';
import { hashString } from '@/engine/rng';
import { MOMENTS, Locale } from '@/i18n/moments';
import { colors } from '@/theme/colors';
import { feelHit, feelShatter } from '@/feel/haptics';
import { FloatingMoment } from './FloatingMoment';

const GAP = 10;

interface Particle {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  born: number;
}

interface Moment {
  key: number;
  text: string;
  x: number;
  y: number;
}

const PARTICLE_LIFE_MS = 900;
const PARTICLES_PER_BURST = 14;

export function GameCanvas({
  locale,
  onBlockBroken,
}: {
  locale: Locale;
  onBlockBroken?: () => void;
}) {
  const { width, height } = useWindowDimensions();
  const [blocks, setBlocks] = useState<Block[]>(createGrid);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [moment, setMoment] = useState<Moment | null>(null);
  const [breaks, setBreaks] = useState(0);
  const [, forceFrame] = useState(0);
  const lastLineIndex = useRef(-1);

  const blockSize = (width - GAP * (GRID_COLS + 1)) / GRID_COLS;
  const fieldTop = (height - (blockSize + GAP) * GRID_ROWS) / 2;

  const blockRect = useCallback(
    (b: Block) => {
      // T1: subtle deterministic jitter so the grid feels organic
      const jx = ((hashString(b.id) % 5) - 2) * 0.8;
      const jy = ((hashString(b.id + 'y') % 5) - 2) * 0.8;
      return {
        x: GAP + b.col * (blockSize + GAP) + jx,
        y: fieldTop + b.row * (blockSize + GAP) + jy,
        size: blockSize,
      };
    },
    [blockSize, fieldTop],
  );

  const spawnBurst = useCallback((cx: number, cy: number) => {
    const now = Date.now();
    const burst: Particle[] = Array.from({ length: PARTICLES_PER_BURST }, (_, i) => {
      const angle = (Math.PI * 2 * i) / PARTICLES_PER_BURST + Math.random() * 0.5;
      const speed = 90 + Math.random() * 140;
      return {
        id: `p${now}-${i}`,
        x: cx,
        y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 60,
        color: colors.rainbow[i % colors.rainbow.length],
        born: now,
      };
    });
    setParticles((p) => [...p, ...burst]);
    const tick = () => {
      const alive = Date.now() - now < PARTICLE_LIFE_MS;
      forceFrame((f) => f + 1);
      if (alive) requestAnimationFrame(tick);
      else setParticles((p) => p.filter((pt) => Date.now() - pt.born < PARTICLE_LIFE_MS));
    };
    requestAnimationFrame(tick);
  }, []);

  const maybeShowMoment = useCallback(
    (cx: number, cy: number, count: number) => {
      if (moment || !shouldShowMoment(count)) return;
      const picked = pickLine(MOMENTS[locale], Math.random, lastLineIndex.current);
      lastLineIndex.current = picked.index;
      setMoment({ key: Date.now(), text: picked.text, x: cx, y: cy });
    },
    [locale, moment],
  );

  // Background rainbow (T3+): one arc per break-milestone, sweeping as you smash.
  const rainbowArcs = useMemo(() => {
    const cx = width / 2;
    const cy = height + width * 0.35;
    const stroke = 13;
    const rBase = cy - (fieldTop + 30);
    const startA = (196 * Math.PI) / 180;
    const endA = (344 * Math.PI) / 180;

    return colors.rainbow.map((color, i) => {
      // color i starts appearing after i*7 breaks, fully swept at +50
      const p = Math.min(1, Math.max(0, (breaks - i * 7) / 50));
      if (p <= 0) return null;
      const r = rBase - i * (stroke + 1);
      const a1 = startA;
      const a2 = startA + p * (endA - startA);
      const x1 = cx + r * Math.cos(a1);
      const y1 = cy + r * Math.sin(a1);
      const x2 = cx + r * Math.cos(a2);
      const y2 = cy + r * Math.sin(a2);
      const largeArc = a2 - a1 > Math.PI ? 1 : 0;
      return {
        d: `M ${x1.toFixed(1)} ${y1.toFixed(1)} A ${r.toFixed(1)} ${r.toFixed(1)} 0 ${largeArc} 1 ${x2.toFixed(1)} ${y2.toFixed(1)}`,
        color,
        stroke,
      };
    });
  }, [breaks, width, height, fieldTop]);

  const handleTap = useCallback(
    (tx: number, ty: number) => {
      const target = blocks.find((b) => {
        const r = blockRect(b);
        return tx >= r.x && tx <= r.x + r.size && ty >= r.y && ty <= r.y + r.size;
      });
      if (!target) return;

      const r = blockRect(target);
      const rel = { x: (tx - r.x) / r.size, y: (ty - r.y) / r.size };
      const result = hitBlock(blocks, target.id, rel);

      if (result.destroyed) {
        feelShatter();
        spawnBurst(r.x + r.size / 2, r.y + r.size / 2);
        const count = breaks + 1;
        setBreaks(count);
        maybeShowMoment(r.x + r.size / 2, r.y + r.size / 2, count);
        onBlockBroken?.();
      } else {
        feelHit();
      }
      setBlocks(refillIfEmpty(result.blocks));
    },
    [blocks, blockRect, spawnBurst, maybeShowMoment, onBlockBroken],
  );

  const tap = useMemo(
    () =>
      Gesture.Tap()
        .runOnJS(true)
        .onEnd((e) => {
          handleTap(e.x, e.y);
        }),
    [handleTap],
  );

  const now = Date.now();

  return (
    <View style={{ flex: 1 }}>
      <GestureDetector gesture={tap}>
        <Canvas style={{ flex: 1, backgroundColor: colors.background }}>
          {/* Background rainbow, built line by line from your breaks */}
          {rainbowArcs.map(
            (arc, i) =>
              arc && (
                <Path
                  key={`arc${i}`}
                  path={arc.d}
                  style="stroke"
                  strokeWidth={arc.stroke}
                  strokeCap="round"
                  color={arc.color}
                  opacity={0.3}
                />
              ),
          )}
          {blocks.map((b) => {
            const r = blockRect(b);
            return (
              <React.Fragment key={b.id}>
                {/* base */}
                <RoundedRect
                  x={r.x}
                  y={r.y}
                  width={r.size}
                  height={r.size}
                  r={12}
                  color={colors.blockFaces[b.colorIndex]}
                />
                {/* T1: top highlight (light from above) */}
                <RoundedRect
                  x={r.x + 3}
                  y={r.y + 3}
                  width={r.size - 6}
                  height={r.size * 0.42}
                  r={9}
                  color="#FFFFFF"
                  opacity={0.28}
                />
                {/* T1: bottom shadow edge */}
                <RoundedRect
                  x={r.x + 3}
                  y={r.y + r.size * 0.66}
                  width={r.size - 6}
                  height={r.size * 0.3}
                  r={9}
                  color={colors.forest}
                  opacity={0.12}
                />
                {/* T2: crack systems, one per received hit */}
                {b.cracks.map((c, ci) =>
                  crackPaths(c, r.size).map((d, pi) => (
                    <React.Fragment key={`${b.id}-c${ci}-p${pi}`}>
                      {/* light chip offset for depth */}
                      <Path
                        path={d}
                        style="stroke"
                        strokeWidth={2.5}
                        strokeCap="round"
                        strokeJoin="round"
                        color="#FFFFFF"
                        opacity={0.5}
                        transform={[{ translateX: r.x + 1 }, { translateY: r.y + 1.5 }]}
                      />
                      <Path
                        path={d}
                        style="stroke"
                        strokeWidth={ci === 0 ? 1.8 : 2.4}
                        strokeCap="round"
                        strokeJoin="round"
                        color={colors.blockCrack}
                        opacity={0.85}
                        transform={[{ translateX: r.x }, { translateY: r.y }]}
                      />
                    </React.Fragment>
                  )),
                )}
              </React.Fragment>
            );
          })}

          {/* Rainbow reward burst */}
          {particles.map((p) => {
            const t = (now - p.born) / 1000;
            if (t * 1000 > PARTICLE_LIFE_MS) return null;
            const x = p.x + p.vx * t;
            const y = p.y + p.vy * t + 220 * t * t; // gravity
            const fade = 1 - (t * 1000) / PARTICLE_LIFE_MS;
            return (
              <Circle key={p.id} cx={x} cy={y} r={4 * fade + 1} color={p.color} opacity={fade} />
            );
          })}
        </Canvas>
      </GestureDetector>

      {/* T3: happy moment overlay */}
      {moment && (
        <FloatingMoment
          key={moment.key}
          text={moment.text}
          x={moment.x}
          y={moment.y}
          onDone={() => setMoment(null)}
        />
      )}
    </View>
  );
}
