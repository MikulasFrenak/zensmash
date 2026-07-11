# T2 — Realistic crack rendering

**Goal:** Damage should read as *cracking material*, not pen scratches. Cracks should feel physical.

## Options

### A. Procedural cracks from tap point (recommended)
Generate a jagged polyline path radiating from where you actually tapped: 2–4 branches, random angular jitter per segment, thinner toward the tips. Second hit adds a second crack system. Drawn as Skia `Path` with round caps + a faint white "chip" offset for depth.
+ Reacts to tap position (very satisfying), fully dynamic, no assets
− Needs tuning so it doesn't look like lightning

### B. Hand-designed crack shapes
3–4 pre-made crack SVG paths per damage stage, randomly rotated/scaled.
+ Full art control, guaranteed pretty
− Static (ignores tap position), needs design work per material later

### C. Shard preview (fragmentation)
At damage 2, visually split the block into 3–4 shards with visible seams — the block *pre-shatters*, then bursts on the final tap. Pairs perfectly with a future matter-js debris upgrade (S3+).
+ Most physical, best telegraphing of "one more tap"
− Most work; better as a follow-up on top of A

## Decision
- [ ] Agreed option: ___

## Plan (for A)
1. `src/engine/cracks.ts` — pure crack-geometry generator (seeded by tap point + block id) with unit tests
2. `src/render/GameCanvas.tsx` — render crack systems as Skia Paths; store tap point in engine hit result
3. `src/engine/blocks.ts` — extend `Block` with crack seeds/tap points
4. Device check: crack shapes read as material damage at real size
