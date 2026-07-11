# T3 — Happy moments after breaks ✅ DONE (evolved)

**Outcome:** Evolved beyond the original plan — every break rewards: hidden emoji prize (~1 in 6) or a phrase riding a flying cloud (not a popup). Native pools of 23–27 lines × 8 languages in `src/i18n/moments.ts`. Language switch lives in the 🌿 menu.

---

**Goal:** After breaking a block, occasionally delight the player with a short funny/positive line. Leave happier than you came.

## Design constraints (from CLAUDE.md)
- Calm is a feature: no popups/modals, nothing to dismiss, nothing blocking the smashing flow.
- Suggested form: small text that floats up from the broken block and fades (~1.5 s), like the particles.

## Options

### Frequency
- A. Every break — spammy, jokes lose value fast
- B. Random ~1 in 8 breaks + guaranteed on milestones (10th, 25th, 50th…) **(recommended)**
- C. Only at session end (summary screen S7)

### Content tone
- A. Short jokes/puns ("Block had it coming", "That one insulted your Wi-Fi")
- B. Warm affirmations ("Breathe out 🌿", "You're doing great")
- C. Mixed pool, weighted toward funny **(recommended)** — jokes surprise, affirmations soothe

### Language
- English only / Slovak only / both pools (device locale?) — **TBD with Mikulas**

## Decision
- [ ] Frequency: ___
- [ ] Tone: ___
- [ ] Language: ___

## Plan
1. `src/engine/moments.ts` — pure: pool of lines, `pickMoment(breakCount)` with frequency rule + unit tests
2. `src/render/FloatingText.tsx` — Skia text drifting up + fading
3. Wire into `GameCanvas` on destroy; never two at once
