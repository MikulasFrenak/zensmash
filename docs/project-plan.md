# ZenSmash — Project Plan
*Working title. A stress-relief mobile game: tap, smash, breathe out.*

Structured per the [ai-delivery-playbook](https://github.com/MikulasFrenak/ai-delivery-playbook) lifecycle: **Requirements → Architecture → Implementation → Verification → Release**.

---

## 1. Vision

A dead-simple mobile game where you break cubes/blocks with taps. No score pressure, no timers, no fail state. You open it stressed, you smash things for two minutes, you leave calmer. The whole product is the *feeling*: juicy destruction physics, satisfying haptics and sound, and a design that soothes.

**Success criterion for v1:** a session feels good. Everything else is secondary.

### Design direction

- **Palette:** calm green + white base (sage, mint, soft off-white). Rainbow appears only as *reward* — particle bursts when blocks shatter. Calm canvas, joyful explosions.
- **Feel ("game juice"):** screen-shake-free (calm!), but heavy on particles, squash-and-stretch, satisfying crack sounds, and haptic feedback per hit.
- **Tone:** rounded corners, soft shadows, generous whitespace, breathing-slow ambient animations between smashes.
- **Optional zen extras (post-MVP):** ambient soundscape, "breathe" idle animation, end-of-session "you broke 47 blocks 🌈 feel better?" summary.

---

## 2. Requirements (Lifecycle: Requirements)

Per the playbook, each Story below gets `analyze-story` treatment (summary, testable AC, split into subtasks) as a GitHub Issue before implementation.

### Epic 1 — Core smash loop (MVP)

| Story | Acceptance criteria (testable) |
|---|---|
| S1: Block field | A grid/stack of 3D-looking cubes renders at 60fps on mid-range devices |
| S2: Tap to crack | Tapping a block damages it (visual crack states), 2–3 taps destroys it |
| S3: Shatter effect | Destruction spawns physics debris + rainbow particle burst, cleaned up after ~2s |
| S4: Haptics + sound | Each hit triggers light haptic; destruction triggers medium haptic + crack sound |
| S5: Endless refill | New blocks drop in with soft physics when field empties |

### Epic 2 — Calm shell

| Story | Acceptance criteria |
|---|---|
| S6: Home screen | Green/white minimal home, one big "Play" (or no menu at all — open straight into the field) |
| S7: Session end | Gentle summary screen (blocks broken, time), no scores/leaderboards |
| S8: Settings | Sound/haptics/particles toggles; respects system reduce-motion |

### Epic 3 — Release readiness

| Story | Acceptance criteria |
|---|---|
| S9: App icon + store assets | Icon, screenshots, store descriptions in EN (+CZ/SK?) |
| S10: Privacy & compliance | Privacy policy URL, Play Data Safety form, App Store privacy labels — accurate (top rejection reason in 2026) |
| S11: Monetization v1 | See §6 |

**Explicit non-goals for MVP:** accounts, multiplayer, levels, achievements, cloud save, ads in v1.

---

## 3. Architecture (Lifecycle: Architecture)

Per the methodology: 2–3 approaches, trade-offs, one recommendation, explicit sign-off before code.

### Options considered

| Approach | Pros | Cons |
|---|---|---|
| **A. React Native + Expo + Skia + Reanimated + Matter.js** ✅ | Your stack of choice; Skia is GPU-accelerated 2D (~750k weekly downloads, the credible native rendering path in RN); Reanimated 4 `useFrameCallback` gives a real game loop on the UI thread; Matter.js handles debris physics; Expo EAS makes store builds/submissions nearly turnkey | 2D-ish only; hundreds of simultaneous physics bodies would strain it — fine for this game's modest object counts |
| B. Unity / Godot | Best physics + particles, true 3D shatter | New toolchain, heavier app, overkill for a tap game; slower for you to iterate |
| C. RN + Phaser-in-WebView | Full game framework | WebView jank, haptics/audio latency — kills the core "feel" |

**Recommendation: Option A.** This game is exactly the profile the RN ecosystem recommends RN for in 2026: casual, event-driven, modest object counts. Expo also gives OTA updates for tuning game-feel post-launch without store review.

### Stack

- **Expo SDK (latest) + TypeScript**, EAS Build/Submit for stores
- **@shopify/react-native-skia** — rendering (blocks, cracks, particles)
- **react-native-reanimated v4** — game loop (`useFrameCallback`) + animations
- **react-native-gesture-handler** — taps
- **matter-js** — 2D physics for debris/refill drops
- **expo-haptics**, **expo-av / expo-audio** — feel
- **zustand** (or plain context) — tiny state: settings, session stats

### Architecture sketch

```
app/
  (screens: index → game, settings)   ← standard RN views
src/
  engine/    game loop, physics world (matter-js), entity state
  render/    Skia canvas: Block, CrackOverlay, ParticleBurst
  feel/      haptics.ts, sound.ts (single "juice" API: hit(), shatter())
  theme/     colors (sage/mint/white + rainbow ramp), motion tokens
```

Hybrid pattern (recommended practice): standard Views for shell/navigation, one full-screen Skia canvas for the game.

---

## 4. GitHub project setup

1. **Repo:** `MikulasFrenak/zensmash` (private until launch). `main` protected; short-lived feature branches; PRs per playbook `commit`/`pr-update` skills.
2. **CLAUDE.md** documenting conventions (branching, testing, styling) — a playbook prerequisite.
3. **GitHub Project (board):** columns Backlog → Ready → In progress → Verify → Done; Stories S1–S11 as Issues, labeled by Epic.
4. **`.tasks/` folder** for per-task plan files, per `create-task`.
5. **CI (GitHub Actions):** lint + typecheck + unit tests on PR; EAS build on tag.

---

## 5. Verification (Lifecycle: Verification)

- Unit tests for engine logic (damage states, refill rules) inside `implement-task`.
- **Real-device feel checks** are the real gate — game juice can't be verified in a simulator: haptics, audio latency, 60fps under a full particle burst on a mid-range Android.
- Note: the playbook's `verify-browser` skill is Chrome-DevTools based; for this project the equivalent is Expo Dev Client on-device + React DevTools/Perf monitor. *(Candidate new playbook skill: `verify-device`.)*

---

## 6. Monetization & store release (Lifecycle: Release)

### Monetization — recommended path

**v1: completely free, no ads.** Stress-relief + interstitial ads is a contradiction; protect the core feeling and reviews.
**v1.x:** one-time IAP "Zen Pack" (~$1.99–2.99): extra block materials (glass, ice, jelly), soundscapes, rainbow themes. Optional *tip jar*. No subscriptions, no consumables, no ads — this is also the best fit for store ratings in the "relax" category.

Free-with-no-digital-sales triggers no commission; once IAP ships, both stores take 15% at indie scale (Apple: enroll manually in the **Small Business Program** — not automatic; Google: 15% on first $1M automatically).

### Store checklist

| | Apple App Store | Google Play |
|---|---|---|
| Account | $99/year | $25 one-time |
| Review time | ~24–48 h | hours–days |
| **Gotcha** | Privacy labels must match behavior | **New personal accounts: closed test with ≥12 testers opted in for 14 consecutive days before production access** — and Google checks for *real engagement*, not just headcount |
| Build/submit | EAS Submit | EAS Submit |

**Google Play testing plan:** recruit 12–15 friends/colleagues early (week 3–4), keep them opted in continuously, ship 2–3 test builds and visibly respond to feedback — engagement is the top rejection reason.

Also needed: privacy policy URL (static page is fine), target Android API 35+, age rating questionnaires, 6.5"/13" iOS screenshots + Play feature graphic.

---

## 7. Roadmap

| Phase | Weeks | Outcome |
|---|---|---|
| 0 — Setup | 1 | Repo, CLAUDE.md, Expo scaffold, CI, board with S1–S11 |
| 1 — Core loop | 2–3 | S1–S5: smashing feels *good* on a real device |
| 2 — Calm shell | 4 | S6–S8 + design polish pass |
| 3 — Play closed test | 5–6 | 12+ testers, 14 days, tune feel from feedback |
| 4 — Launch | 7 | S9–S10, submit both stores |
| 5 — v1.x | 8+ | Zen Pack IAP, new materials, soundscapes |

~7 weeks part-time to stores, dominated by Google's mandatory 14-day test window — start it as early as the core loop is fun.

---

## 8. Next actions

1. Confirm this architecture (playbook rule: explicit sign-off before code).
2. Create repo + GitHub Project, file S1–S11 as Issues.
3. `npx create-expo-app zensmash` and run `analyze-story` on S1.

Sources: [Expo: Matter.js + Skia physics](https://expo.dev/blog/build-2d-game-style-physics-with-matter-js-and-react-native-skia) · [RN game engine landscape 2026](https://dev.to/grzott/the-react-native-game-engine-gap-in-2026-rnge-skia-phaser-in-webview-expo-gl-55hp) · [Store fees 2026](https://weekonelabs.com/blog/app-store-fees-explained-2026) · [Play closed-testing rule](https://support.google.com/googleplay/android-developer/answer/14151465?hl=en) · [Apple Small Business Program](https://www.revenuecat.com/blog/engineering/small-business-program/)
