/**
 * S1–S3 + T1 (3D depth) + T2 (procedural cracks) + T3 (happy moments).
 */
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Platform, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import {
  BlurMask,
  Canvas,
  Circle,
  Group,
  LinearGradient,
  Path,
  RadialGradient,
  RoundedRect,
  vec,
} from '@shopify/react-native-skia';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

import {
  Block,
  createGrid,
  hitBlock,
  refillIfEmpty,
  GRID_COLS,
  GRID_ROWS,
  TAPS_TO_BREAK,
} from '@/engine/blocks';
import { crackPaths } from '@/engine/cracks';
import { pickLine } from '@/engine/moments';
import { hashString } from '@/engine/rng';
import { MOMENTS, Locale } from '@/i18n/moments';
import { colors } from '@/theme/colors';
import { feelBloom, feelHit, feelShatter, feelPrize } from '@/feel';
import { getSettings } from '@/state/settings';
import { addToCollection } from '@/state/collection';
import { FloatingMoment } from './FloatingMoment';
import { Lotus } from './Lotus';
import { PrizePop } from './PrizePop';
import { UnicornDone } from '@/ui/UnicornDone';

const GAP = 14;

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

interface Prize {
  key: number;
  emoji: string;
  x: number;
  y: number;
}

const PARTICLE_LIFE_MS = 900;
const PARTICLES_PER_BURST = 14;
const DROP_MS = 700;
const CHARGE_MS = 850;
/**
 * Breaks needed for a full rainbow = two full fields of cubes (2 × 15).
 * The celebration lands exactly as the second field clears.
 */
const RAINBOW_FULL = GRID_COLS * GRID_ROWS * 2;
/** last stripe joins at (7-1)*2 = 12 → sweep length fills the rest */
const STRIPE_SWEEP = RAINBOW_FULL - 12;

interface Charger {
  id: string;
  sx: number;
  sy: number;
  color: string;
  wobble: number;
  born: number;
}

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
  const [prizes, setPrizes] = useState<Prize[]>([]);
  const [chargers, setChargers] = useState<Charger[]>([]);
  const [breaks, setBreaks] = useState(0);
  const [done, setDone] = useState(false);
  const [finale, setFinale] = useState(false);
  const [dropStart, setDropStart] = useState(() => Date.now());
  const [, forceFrame] = useState(0);
  const recentLines = useRef<number[]>([]);
  const lastHit = useRef<{ id: string; time: number } | null>(null);

  // Ambient sky: gentle 20fps tick so sun and clouds levitate softly
  React.useEffect(() => {
    const id = setInterval(() => forceFrame((f) => f + 1), 50);
    return () => clearInterval(id);
  }, []);

  // S5: drive re-renders while blocks are dropping in (mount + every refill)
  React.useEffect(() => {
    let raf: number;
    const tick = () => {
      forceFrame((f) => f + 1);
      if (Date.now() - dropStart < DROP_MS + 500) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [dropStart]);

  // Cubes: square blocks sized to fit both width and the lower 2/3 of the screen
  const sizeByW = (width - GAP * (GRID_COLS + 1)) / GRID_COLS;
  const sizeByH = (height * 0.64 - GAP * (GRID_ROWS - 1)) / GRID_ROWS;
  const blockW = Math.min(sizeByW, sizeByH);
  const blockH = blockW;
  const fieldLeft = (width - (blockW * GRID_COLS + GAP * (GRID_COLS - 1))) / 2;
  // grid sits lower so the rainbow has sky above it
  const fieldTop = (height - (blockH + GAP) * GRID_ROWS) / 2 + height * 0.06;

  const blockRect = useCallback(
    (b: Block) => {
      // T1: subtle deterministic jitter so the grid feels organic
      const jx = ((hashString(b.id) % 5) - 2) * 0.8;
      const jy = ((hashString(b.id + 'y') % 5) - 2) * 0.8;
      return {
        x: fieldLeft + b.col * (blockW + GAP) + jx,
        y: fieldTop + b.row * (blockH + GAP) + jy,
        w: blockW,
        h: blockH,
      };
    },
    [blockW, blockH, fieldLeft, fieldTop],
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

  // Ice chips: small shards jump out where you hit (non-breaking taps).
  const spawnChips = useCallback((cx: number, cy: number, colorIndex: number) => {
    const now = Date.now();
    const count = 2 + Math.floor(Math.random() * 3); // 2–4 chips
    const chipColors = [colors.blockFaceTops[colorIndex], colors.blockSides[colorIndex], '#FFFFFF'];
    const chips: Particle[] = Array.from({ length: count }, (_, i) => {
      const angle = -Math.PI / 2 + (Math.random() - 0.5) * 1.6; // mostly upward
      const speed = 120 + Math.random() * 160;
      return {
        id: `chip${now}-${i}`,
        x: cx,
        y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color: chipColors[i % chipColors.length],
        born: now,
      };
    });
    setParticles((p) => [...p, ...chips]);
    const tick = () => {
      const alive = Date.now() - now < PARTICLE_LIFE_MS;
      forceFrame((f) => f + 1);
      if (alive) requestAnimationFrame(tick);
      else setParticles((p) => p.filter((pt) => Date.now() - pt.born < PARTICLE_LIFE_MS));
    };
    requestAnimationFrame(tick);
  }, []);

  // Rainbow charge: sparks stream from the broken cube up into the rainbow.
  const spawnCharge = useCallback((cx: number, cy: number) => {
    const now = Date.now();
    const stream: Charger[] = colors.rainbow.map((color, i) => ({
      id: `ch${now}-${i}`,
      sx: cx,
      sy: cy,
      color,
      wobble: (Math.random() - 0.5) * 60,
      born: now + i * 40, // staggered trail
    }));
    setChargers((c) => [...c, ...stream]);
    const tick = () => {
      const alive = Date.now() - now < CHARGE_MS + 7 * 40;
      forceFrame((f) => f + 1);
      if (alive) requestAnimationFrame(tick);
      else setChargers((c) => c.filter((ch) => Date.now() - ch.born < CHARGE_MS));
    };
    requestAnimationFrame(tick);
  }, []);

  // No prize inside? Then you get a joke — every break rewards something.
  const showMoment = useCallback(
    (cx: number, cy: number) => {
      if (moment) return;
      const picked = pickLine(MOMENTS[locale], Math.random, recentLines.current);
      recentLines.current = [...recentLines.current, picked.index].slice(-8);
      setMoment({ key: Date.now(), text: picked.text, x: cx, y: cy });
    },
    [locale, moment],
  );

  // Background rainbow: builds as you smash, sweep animates smoothly.
  const displayedBreaks = useRef(0);
  React.useEffect(() => {
    let raf: number;
    const tick = () => {
      const diff = breaks - displayedBreaks.current;
      if (Math.abs(diff) < 0.01) {
        displayedBreaks.current = breaks;
        return;
      }
      displayedBreaks.current += diff * 0.07; // gentle ease toward target
      forceFrame((f) => f + 1);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [breaks]);

  // Fluffy clouds — new random sky every time you start the game
  const clouds = useMemo(
    () =>
      Array.from({ length: 5 }, (_, i) => ({
        cx: 30 + Math.random() * (width - 60),
        cy: 26 + Math.random() * Math.max(60, fieldTop * 0.75),
        s: 0.65 + Math.random() * 0.5,
        phase: Math.random() * Math.PI * 2,
        speed: 2600 + Math.random() * 1800,
      })),
    [width, fieldTop],
  );

  // Footer meadow — grass tufts with flowers along the bottom edge,
  // randomized each game start
  const grassTufts = useMemo(
    () =>
      Array.from({ length: 9 }, (_, i) => ({
        cx: (width / 9) * i + Math.random() * (width / 9),
        cy: height - 2 - Math.random() * 8,
        s: 0.7 + Math.random() * 0.6,
        phase: Math.random() * Math.PI * 2,
        speed: 2400 + Math.random() * 1600,
        pink: i % 2 === 0,
      })),
    [width, height],
  );

  // Gentle rain: a short soft shower every now and then, watering the meadow
  const [rainUntil, setRainUntil] = useState(0);
  React.useEffect(() => {
    const id = setInterval(() => {
      if (Math.random() < 0.5) setRainUntil(Date.now() + 5000);
    }, 50000);
    return () => clearInterval(id);
  }, []);

  // Rainbow = progress bar of color: arcs are always full, each stripe
  // saturates from ghost-faint to vivid as you smash. Red first.
  const rainbowApex = fieldTop * 0.38;
  const rainbowArcs = (() => {
    const shown = displayedBreaks.current;
    const cx = width / 2;
    const cy = height + width * 0.35;
    const stroke = 24;
    const rBase = cy - rainbowApex;
    const startA = (198 * Math.PI) / 180;
    const endA = (342 * Math.PI) / 180;
    const midA = (startA + endA) / 2;

    return colors.rainbow.map((color, i) => {
      // stripe i starts charging after i*2 breaks, all vivid at RAINBOW_FULL
      const p = Math.min(1, Math.max(0, (shown - i * 2) / STRIPE_SWEEP));
      const r = rBase - i * stroke; // bands touch cleanly, no muddy overlap
      const pt = (a: number) =>
        `${(cx + r * Math.cos(a)).toFixed(1)} ${(cy + r * Math.sin(a)).toFixed(1)}`;
      return {
        // two half-arcs (SVG A can't exceed 180° reliably)
        d: `M ${pt(startA)} A ${r.toFixed(1)} ${r.toFixed(1)} 0 0 1 ${pt(midA)} A ${r.toFixed(1)} ${r.toFixed(1)} 0 0 1 ${pt(endA)}`,
        color,
        stroke,
        alpha: 0.05 + 0.5 * p, // ghost of the whole rainbow, filling with color
      };
    });
  })();

  const handleTap = useCallback(
    (tx: number, ty: number) => {
      const target = blocks.find((b) => {
        const r = blockRect(b);
        return tx >= r.x && tx <= r.x + r.w && ty >= r.y && ty <= r.y + r.h;
      });
      if (!target) return;

      const r = blockRect(target);
      const rel = { x: (tx - r.x) / r.w, y: (ty - r.y) / r.h };
      const result = hitBlock(blocks, target.id, rel);

      if (result.destroyed) {
        feelShatter();
        if (getSettings().particles) {
          spawnBurst(r.x + r.w / 2, r.y + r.h / 2);
          spawnCharge(r.x + r.w / 2, r.y + r.h / 2);
        }
        if (target.prize) {
          const p: Prize = {
            key: Date.now(),
            emoji: target.prize,
            x: r.x + r.w / 2,
            y: r.y + r.h / 2,
          };
          setPrizes((ps) => [...ps, p]);
          addToCollection(target.prize);
          feelPrize(); // whooooaaa!
        } else {
          showMoment(r.x + r.w / 2, r.y + r.h / 2);
        }
        const count = breaks + 1;
        setBreaks(count);
        if (count >= RAINBOW_FULL) {
          // finale: no new cubes — the mandala shines, then the results come
          setFinale(true);
          feelBloom();
          setTimeout(() => setDone(true), 4500);
        }
        onBlockBroken?.();
      } else {
        feelHit();
        lastHit.current = { id: target.id, time: Date.now() }; // squash!
        // chips fly out of the crack — bigger hits chip more often
        if (getSettings().particles && Math.random() < 0.75) {
          spawnChips(tx, ty, target.colorIndex);
        }
      }
      const isFinale = result.destroyed && breaks + 1 >= RAINBOW_FULL;
      if (!isFinale && result.destroyed && result.blocks.length === 0) {
        setDropStart(Date.now()); // S5
      }
      // during the finale the field stays empty — the mandala takes the stage
      setBlocks(isFinale ? result.blocks : refillIfEmpty(result.blocks));
    },
    [blocks, breaks, blockRect, spawnBurst, spawnCharge, spawnChips, showMoment, onBlockBroken],
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

  const progress = Math.min(1, displayedBreaks.current / RAINBOW_FULL);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* hidden prizes — showing through the translucent cube as it cracks */}
      {blocks.map((b) => {
        if (!b.prize || b.damage === 0) return null;
        const r = blockRect(b);
        return (
          <Text
            key={`prize-${b.id}`}
            pointerEvents="none"
            style={{
              position: 'absolute',
              left: r.x + r.w / 2 - r.h * 0.3,
              top: r.y + r.h / 2 - r.h * 0.34,
              fontSize: r.h * 0.5,
              opacity: (b.damage / TAPS_TO_BREAK) * 0.9,
            }}
          >
            {b.prize}
          </Text>
        );
      })}
      <GestureDetector gesture={tap}>
        <Canvas
          style={StyleSheet.flatten([
            { flex: 1, backgroundColor: 'transparent' },
            // RN's CursorValue type only lists 'auto' | 'pointer', but
            // react-native-web accepts the full CSS cursor value set at
            // runtime — cast needed since the type defs haven't caught up.
            Platform.select({ web: { cursor: 'grab' }, default: {} }) as object,
          ])}
        >
          {/* Background rainbow — deepest layer of the sky */}
          {rainbowArcs.map((arc, i) => (
            <Path
              key={`arc${i}`}
              path={arc.d}
              style="stroke"
              strokeWidth={arc.stroke}
              strokeCap="round"
              color={arc.color}
              opacity={arc.alpha}
            >
              {/* soft edges — neighbouring colors melt into each other */}
              <BlurMask blur={2} style="normal" />
            </Path>
          ))}

          {/* smiling sun — levitating gently in the corner */}
          {(() => {
            const sunX = width - 52 + Math.sin(now / 2100) * 3;
            const sunY = 66 + Math.sin(now / 1400) * 6;
            return (
              <>
                <Circle cx={sunX} cy={sunY} r={22} color="#FFE066" opacity={0.9} />
                {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
                  const a = (Math.PI * 2 * i) / 8 + now / 9000; // slow ray spin
                  return (
                    <Path
                      key={`ray${i}`}
                      path={`M ${sunX + Math.cos(a) * 28} ${sunY + Math.sin(a) * 28} L ${sunX + Math.cos(a) * 36} ${sunY + Math.sin(a) * 36}`}
                      style="stroke"
                      strokeWidth={4}
                      strokeCap="round"
                      color="#FFE066"
                      opacity={0.8}
                    />
                  );
                })}
                <Path
                  path={`M ${sunX - 8} ${sunY - 2} Q ${sunX - 6} ${sunY + 2} ${sunX - 4} ${sunY - 2}`}
                  style="stroke"
                  strokeWidth={2.4}
                  strokeCap="round"
                  color="#B8860B"
                  opacity={0.7}
                />
                <Path
                  path={`M ${sunX + 4} ${sunY - 2} Q ${sunX + 6} ${sunY + 2} ${sunX + 8} ${sunY - 2}`}
                  style="stroke"
                  strokeWidth={2.4}
                  strokeCap="round"
                  color="#B8860B"
                  opacity={0.7}
                />
                <Path
                  path={`M ${sunX - 6} ${sunY + 6} Q ${sunX} ${sunY + 12} ${sunX + 6} ${sunY + 6}`}
                  style="stroke"
                  strokeWidth={2.6}
                  strokeCap="round"
                  color="#B8860B"
                  opacity={0.7}
                />
              </>
            );
          })()}

          {/* fluffy clouds levitating across the sky */}
          {clouds.map((c, i) => {
            const dx = Math.sin(now / c.speed + c.phase) * 12;
            const dy = Math.sin(now / (c.speed * 0.6) + c.phase * 1.7) * 5;
            const cx = c.cx + dx;
            const cy = c.cy + dy;
            return (
              <React.Fragment key={`cloud${i}`}>
                {/* subtle shadow under the cloud for visibility */}
                <Circle cx={cx} cy={cy + 6 * c.s} r={17 * c.s} color={colors.forest} opacity={0.06} />
                <Circle cx={cx} cy={cy} r={16 * c.s} color="#FFFFFF" opacity={0.95} />
                <Circle cx={cx + 15 * c.s} cy={cy + 3 * c.s} r={13 * c.s} color="#FFFFFF" opacity={0.95} />
                <Circle cx={cx - 15 * c.s} cy={cy + 4 * c.s} r={12 * c.s} color="#FFFFFF" opacity={0.95} />
                <Circle cx={cx + 4 * c.s} cy={cy - 7 * c.s} r={11 * c.s} color="#FFFFFF" opacity={0.95} />
              </React.Fragment>
            );
          })}

          {/* gentle rain — a soft shower waters the meadow */}
          {now < rainUntil &&
            Array.from({ length: 16 }, (_, k) => {
              const seed = hashString(`drop${k}`);
              const dxr = ((seed % 100) / 100) * width;
              const fall = (now / (2.2 + (k % 5) * 0.3) + seed) % (height * 0.85);
              const fade = Math.min(1, (rainUntil - now) / 900, (now - (rainUntil - 5000)) / 900);
              return (
                <Path
                  key={`drop${k}`}
                  path={`M ${dxr} ${60 + fall} L ${dxr - 1.5} ${60 + fall + 9}`}
                  style="stroke"
                  strokeWidth={2}
                  strokeCap="round"
                  color={colors.blockFaces[2]}
                  opacity={0.38 * Math.max(0, fade)}
                />
              );
            })}

          {/* footer meadow — grass and flowers swaying by the buttons */}
          {grassTufts.map((g, i) => {
            const sway = Math.sin(now / g.speed + g.phase) * 3;
            const gx = g.cx;
            const gy = g.cy;
            const s = g.s;
            return (
              <React.Fragment key={`grass${i}`}>
                {/* mound sitting on the bottom edge */}
                <Circle cx={gx} cy={gy + 4 * s} r={10 * s} color={colors.sage} />
                <Circle cx={gx + 9 * s} cy={gy + 6 * s} r={8 * s} color={colors.blockFaces[2]} />
                <Circle cx={gx - 9 * s} cy={gy + 6 * s} r={8 * s} color={colors.mint} />
                {/* blades swaying in the breeze */}
                <Path
                  path={`M ${gx - 4 * s} ${gy - 2 * s} Q ${gx - 6 * s + sway} ${gy - 14 * s} ${gx - 3 * s + sway} ${gy - 18 * s}`}
                  style="stroke"
                  strokeWidth={2 * s}
                  strokeCap="round"
                  color={colors.forest}
                  opacity={0.8}
                />
                <Path
                  path={`M ${gx + 1 * s} ${gy - 3 * s} Q ${gx + 1 * s + sway} ${gy - 16 * s} ${gx + 3 * s + sway} ${gy - 21 * s}`}
                  style="stroke"
                  strokeWidth={2 * s}
                  strokeCap="round"
                  color={colors.forest}
                  opacity={0.8}
                />
                <Path
                  path={`M ${gx + 5 * s} ${gy - 2 * s} Q ${gx + 7 * s + sway} ${gy - 12 * s} ${gx + 6 * s + sway} ${gy - 15 * s}`}
                  style="stroke"
                  strokeWidth={1.8 * s}
                  strokeCap="round"
                  color={colors.forest}
                  opacity={0.7}
                />
                {/* flower blooms as your session progresses */}
                {progress * 9 > i + 0.5 && (
                  <>
                    {[0, 1, 2, 3, 4].map((p) => {
                      const a = (Math.PI * 2 * p) / 5;
                      return (
                        <Circle
                          key={`petal${p}`}
                          cx={gx + 3 * s + sway + Math.cos(a) * 3.6 * s}
                          cy={gy - 22 * s + Math.sin(a) * 3.6 * s}
                          r={2.5 * s}
                          color={g.pink ? '#FFB3C1' : '#FFFFFF'}
                        />
                      );
                    })}
                    <Circle cx={gx + 3 * s + sway} cy={gy - 22 * s} r={2.3 * s} color="#FFE066" />
                  </>
                )}
              </React.Fragment>
            );
          })}

          {/* sunrise glow — the world warms up as stress leaves */}
          {progress > 0.02 && (
            <Circle
              cx={width / 2}
              cy={fieldTop + ((blockH + GAP) * GRID_ROWS) / 2}
              r={width * 0.85}
              opacity={progress * 0.45}
            >
              <RadialGradient
                c={vec(width / 2, fieldTop + ((blockH + GAP) * GRID_ROWS) / 2)}
                r={width * 0.85}
                colors={['rgba(255, 224, 102, 0.55)', 'rgba(255, 224, 102, 0)']}
              />
            </Circle>
          )}

          {/* blooming lotus mandala — one petal at a time, behind the cubes.
              At the finale it shines in full rainbow color. */}
          {progress > 0.02 && (
            <Lotus
              cx={width / 2}
              cy={fieldTop + ((blockH + GAP) * GRID_ROWS) / 2}
              size={(blockW * GRID_COLS + GAP * (GRID_COLS - 1)) * 1.15}
              progress={progress}
              now={now}
              opacity={finale ? 0.95 : 0.55}
              shine={finale}
            />
          )}

          {/* fireflies — more of them the calmer you get */}
          {Array.from({ length: Math.floor(progress * 9) }, (_, k) => {
            const seed = hashString(`fly${k}`);
            const fx =
              ((seed % 100) / 100) * width + Math.sin(now / (2200 + (seed % 900)) + k) * 24;
            const rise = ((now / (28 - (k % 7)) + seed) % (height * 0.9));
            const fy = height - rise;
            const tw = 0.35 + 0.3 * Math.sin(now / 300 + k * 1.7); // twinkle
            return (
              <Circle
                key={`fly${k}`}
                cx={fx}
                cy={fy}
                r={2.2 + (seed % 3) * 0.6}
                color={colors.rainbow[seed % 7]}
                opacity={Math.max(0.1, tw) * Math.min(1, rise / 80)}
              />
            );
          })}

          {/* rainbow charge sparks flying up from broken cubes */}
          {chargers.map((ch) => {
            const t = (now - ch.born) / CHARGE_MS;
            if (t < 0 || t > 1) return null;
            const ease = t * t * (3 - 2 * t);
            const tx = width / 2 + ch.wobble * 2;
            const x = ch.sx + (tx - ch.sx) * ease + Math.sin(t * Math.PI * 3) * ch.wobble * (1 - t) * 0.4;
            const y = ch.sy + (rainbowApex + 20 - ch.sy) * ease;
            return (
              <Circle
                key={ch.id}
                cx={x}
                cy={y}
                r={3.5 * (1 - t) + 1.5}
                color={ch.color}
                opacity={0.9 * (1 - t * t)}
              />
            );
          })}
          {blocks.map((b) => {
            const r = blockRect(b);
            // S5: staggered drop-in from above with ease-out
            const delay = b.row * 55 + b.col * 25;
            const p = Math.min(1, Math.max(0, (Date.now() - dropStart - delay) / DROP_MS));
            const ease = 1 - Math.pow(1 - p, 3);
            const dy = -(r.y + r.h + 40) * (1 - ease);
            const y = r.y + dy;
            // squash & stretch on hit — impact you can see
            let sx = 1;
            let sy = 1;
            const hit = lastHit.current;
            if (hit && hit.id === b.id) {
              const dt = now - hit.time;
              if (dt >= 0 && dt < 140) {
                // gentle press — subtle, not rubbery
                const q = Math.sin((Math.PI * dt) / 140) * 0.04;
                sx = 1 + q * 0.5;
                sy = 1 - q;
              }
            }
            return (
              <Group
                key={b.id}
                transform={[{ scaleX: sx }, { scaleY: sy }]}
                origin={vec(r.x + r.w / 2, y + r.h)}
              >
                {/* soft drop shadow */}
                <RoundedRect
                  x={r.x + 2}
                  y={y + 4}
                  width={r.w}
                  height={r.h}
                  r={14}
                  color={colors.forest}
                  opacity={0.12}
                />
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
                  opacity={0.30}
                />
                {/* tiny glass bubbles — deterministic per block */}
                {[0, 1, 2, 3, 4, 5, 6].map((k) => {
                  const hb = hashString(`${b.id}bub${k}`);
                  const bx = r.x + r.w * (0.12 + (hb % 72) / 100);
                  const by = y + r.h * (0.22 + ((hb >> 6) % 64) / 100);
                  const br = 1.2 + ((hb >> 12) % 26) / 10;
                  return (
                    <Circle
                      key={`bub${k}`}
                      cx={bx}
                      cy={by}
                      r={br}
                      color="#FFFFFF"
                      opacity={0.22 + ((hb >> 18) % 14) / 100}
                    />
                  );
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

      {/* freed prizes */}
      {prizes.map((p) => (
        <PrizePop
          key={p.key}
          emoji={p.emoji}
          x={p.x}
          y={p.y}
          onDone={() => setPrizes((ps) => ps.filter((q) => q.key !== p.key))}
        />
      ))}

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

      {/* rainbow complete — you are a little unicorn now */}
      {done && (
        <UnicornDone
          locale={locale}
          broken={breaks}
          onClose={() => {
            // begin a fresh cycle: rainbow and mandala fade back to ghost
            setDone(false);
            setFinale(false);
            setBreaks(0);
            displayedBreaks.current = 0;
            setBlocks(createGrid());
            setDropStart(Date.now());
          }}
        />
      )}
    </View>
  );
}
