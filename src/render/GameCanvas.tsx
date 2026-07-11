/**
 * S1–S3 + T1 (3D depth) + T2 (procedural cracks) + T3 (happy moments).
 */
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Text, View, useWindowDimensions } from 'react-native';
import {
  BlurMask,
  Canvas,
  Circle,
  LinearGradient,
  Path,
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
import { feelHit, feelShatter } from '@/feel';
import { getSettings } from '@/state/settings';
import { FloatingMoment } from './FloatingMoment';
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
/** breaks needed for a full rainbow (last stripe fully vivid) — one session */
const RAINBOW_FULL = (7 - 1) * 2 + 15;

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
  const [dropStart, setDropStart] = useState(() => Date.now());
  const [, forceFrame] = useState(0);
  const lastLineIndex = useRef(-1);

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
      const picked = pickLine(MOMENTS[locale], Math.random, lastLineIndex.current);
      lastLineIndex.current = picked.index;
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
      // stripe i starts charging after i*2 breaks, fully vivid ~15 later
      const p = Math.min(1, Math.max(0, (shown - i * 2) / 15));
      const r = rBase - i * (stroke - 3); // slight overlap → colors blend
      const pt = (a: number) =>
        `${(cx + r * Math.cos(a)).toFixed(1)} ${(cy + r * Math.sin(a)).toFixed(1)}`;
      return {
        // two half-arcs (SVG A can't exceed 180° reliably)
        d: `M ${pt(startA)} A ${r.toFixed(1)} ${r.toFixed(1)} 0 0 1 ${pt(midA)} A ${r.toFixed(1)} ${r.toFixed(1)} 0 0 1 ${pt(endA)}`,
        color,
        stroke,
        alpha: 0.06 + 0.42 * p, // ghost of the whole rainbow, filling with color
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
        } else {
          showMoment(r.x + r.w / 2, r.y + r.h / 2);
        }
        const count = breaks + 1;
        setBreaks(count);
        if (count >= RAINBOW_FULL) {
          // let the last charge sparks land, then celebrate
          setTimeout(() => setDone(true), 900);
        }
        onBlockBroken?.();
      } else {
        feelHit();
        // chips fly out of the crack — bigger hits chip more often
        if (getSettings().particles && Math.random() < 0.75) {
          spawnChips(tx, ty, target.colorIndex);
        }
      }
      if (result.destroyed && result.blocks.length === 0) setDropStart(Date.now()); // S5
      setBlocks(refillIfEmpty(result.blocks));
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

  const unicornProgress = Math.min(1, displayedBreaks.current / RAINBOW_FULL);
  const unicornSize = width * 0.6;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* the unicorn slowly materializes behind the blocks as you smash */}
      {unicornProgress > 0.02 && (
        <Text
          pointerEvents="none"
          style={{
            position: 'absolute',
            left: width / 2 - unicornSize / 2,
            top: fieldTop + ((blockH + GAP) * GRID_ROWS) / 2 - unicornSize / 2,
            fontSize: unicornSize,
            opacity: unicornProgress * 0.85,
          }}
        >
          🦄
        </Text>
      )}

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
        <Canvas style={{ flex: 1, backgroundColor: 'transparent' }}>
          {/* Background rainbow, built line by line from your breaks */}
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
              <BlurMask blur={5} style="normal" />
            </Path>
          ))}

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
            const off = Math.min(GAP - 3, r.w * 0.11); // subtle isometric depth
            return (
              <React.Fragment key={b.id}>
                {/* soft ground shadow (light from top-left) */}
                <RoundedRect
                  x={r.x + 5}
                  y={y + 7}
                  width={r.w}
                  height={r.h}
                  r={12}
                  color={colors.forest}
                  opacity={0.10}
                />
                {/* top face */}
                <Path
                  path={`M ${r.x + 2} ${y} L ${r.x + off} ${y - off} L ${r.x + r.w + off - 2} ${y - off} L ${r.x + r.w - 2} ${y} Z`}
                  color={colors.blockFaceTops[b.colorIndex]}
                />
                {/* right side face */}
                <Path
                  path={`M ${r.x + r.w} ${y + 2} L ${r.x + r.w + off} ${y - off + 2} L ${r.x + r.w + off} ${y + r.h - off} L ${r.x + r.w} ${y + r.h - 2} Z`}
                  color={colors.blockSides[b.colorIndex]}
                />
                {/* translucent face with vertical light gradient */}
                <RoundedRect x={r.x} y={y} width={r.w} height={r.h} r={12} opacity={0.85}>
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
            // begin a fresh cycle: rainbow and unicorn fade back to ghost
            setDone(false);
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
