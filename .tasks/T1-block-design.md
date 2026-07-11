# T1 — Block color & design evaluation ✅ DONE

**Outcome:** Option A confirmed after an ice-blue experiment (reverted — green is the brand; ice returns later as a Zen Pack theme). Final look: flat 2D glassy cubes — gradient face, top sheen, glass bubbles, soft shadow, squash on hit. 3D isometric faces were tried and rejected.

---

**Goal:** Blocks should feel tactile and pleasant, not flat. Decide palette direction.

## Options

### A. Stay green family, add depth (recommended)
Keep sage/mint shades, but make blocks look 3D: top highlight + bottom shadow edge (fake bevel), slight size/rotation jitter per block so the grid feels organic. Rainbow stays exclusive to shatter reward — strongest contrast, calmest base.

### B. Muted pastel multicolor
Soft pastel blues/pinks/yellows mixed with greens. Prettier screenshots, but dilutes the rainbow reward moment and drifts from the "calm green/white" identity.

### C. Material themes (later, monetizable)
Green base now; glass/ice/jelly/wood as unlockable "Zen Pack" materials (plan §6). A follows into C naturally.

## Decision
- [ ] Agreed option: ___

## Plan (for A)
1. `src/theme/colors.ts` — add per-face highlight/shadow derivation
2. `src/render/GameCanvas.tsx` — bevel edges (2 extra RoundedRects or gradient), per-block jitter
3. Device check: still calm? 60fps with full grid?
