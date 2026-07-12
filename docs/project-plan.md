# ZenSmash — Project Plan
*Working title. A stress-relief mobile game: tap, smash, breathe out.*

Structured per the [ai-delivery-playbook](https://github.com/MikulasFrenak/ai-delivery-playbook) lifecycle: **Requirements → Architecture → Implementation → Verification → Release**.

> **Status (2026-07-11): Epics 1 & 2 done and verified on a real iPhone — MVP is feature-complete.**
> Delivered beyond plan: session arc (30 breaks → shining mandala finale → results → new cycle),
> hidden emoji surprises + 🎁 treasure collection, blooming lotus mandala, rainbow-as-progress-bar
> with charge sparks, living sky (levitating sun, random clouds, gentle rain), blooming footer
> meadow, fireflies, waving animal visitors with a synthesized voice, 6 shatter melodies + voices,
> phrases and full UI in 8 languages (EN/SK/CZ/HU/PL/DE/FR/ES), squash-and-stretch game feel.
> **Release status:** Web — **released**, live at [zensmash.mikulas-frenak.workers.dev](https://zensmash.mikulas-frenak.workers.dev) (own Cloudflare Worker, auto-deploys on push to `main`, embedded on the portfolio site's case study). App Store (iOS) — **in progress** (S9 done: icons, EAS build profiles, store docs; submission itself still open). Google Play (Android) — **in progress** (needs the closed-test cohort below before production access). Repo is now public.

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

### Epic 1 — Core smash loop (MVP) ✅ done

| Story | Acceptance criteria (testable) | Delivered |
|---|---|---|
| S1: Block field | Grid of cubes renders at 60fps on mid-range devices | ✅ 3×5 glassy squares: gradient faces, glass bubbles, organic jitter |
| S2: Tap to crack | Tapping damages a block (visual crack states) | ✅ 5 taps to break; procedural cracks from the exact tap point, thicker per hit; subtle squash; ice chips fly |
| S3: Shatter effect | Destruction spawns debris + rainbow burst | ✅ rainbow burst + charge sparks streaming into the sky rainbow |
| S4: Haptics + sound | Hit haptic; destruction haptic + sound | ✅ `feel` API; marimba crack, 6 random music-box shatter melodies (all synthesized in-house) |
| S5: Endless refill | New blocks drop in when field empties | ✅ staggered ease-out drop-in (also on first load); paused for the finale |

### Epic 2 — Calm shell ✅ done

| Story | Acceptance criteria | Delivered |
|---|---|---|
| S6: Home screen | No menu — straight into the field | ✅ plus a living scene: levitating smiling sun, 5 random clouds, occasional rain, blooming meadow, fireflies, waving animal visitors |
| S7: Session end | Gentle summary, no scores | ✅ session arc: 30 breaks (2 fields) → mandala shines in full rainbow to a bloom chord (4.5 s) → results with 5 rhyming variants + treasures → begin again |
| S8: Settings | Sound/haptics/particles toggles | ✅ 🌿 menu with toggles + 8-language selector; 🎁 treasures modal. Still open: respect system reduce-motion; persist settings/treasures (AsyncStorage) |

**Added beyond plan:** hidden emoji prizes (~1 in 6 cubes, revealed through the glass as it cracks, "whooooaaa" pop, collected as treasures); jokes riding flying clouds (native phrase pools, not translations); lotus mandala blooming petal-per-break behind the cubes; rainbow as a color-fill progress bar.

### Epic 3 — Release readiness

| Story | Acceptance criteria | Delivered |
|---|---|---|
| S9: App icon + store assets | Icon, screenshots, store descriptions in EN (+CZ/SK?) | ✅ app/adaptive icons + splash wired in `app.json`, EAS build/submit config (`eas.json`), store listing + release checklist in `docs/store/` |
| S10: Privacy & compliance | Privacy policy URL, Play Data Safety form, App Store privacy labels — accurate (top rejection reason in 2026) | ⏳ `docs/store/privacy-policy.md` drafted, not yet hosted at a public URL |
| S11: Monetization v1 | See §6 | ⏳ |

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

| Phase | Weeks | Outcome | Status |
|---|---|---|---|
| 0 — Setup | 1 | Repo, CLAUDE.md, Expo scaffold, CI, board with S1–S11 | ✅ done (CI/board still optional) |
| 1 — Core loop | 2–3 | S1–S5: smashing feels *good* on a real device | ✅ done — in day 1! |
| 2 — Calm shell | 4 | S6–S8 + design polish pass | ✅ done — plus session arc, prizes, mandala, visitors |
| 3 — Play closed test | 5–6 | 12+ testers, 14 days, tune feel from feedback | ⏳ next — recruit testers now |
| 4 — Launch | 7 | S9–S10, submit both stores + web | ⏳ Web released; iOS App Store in progress (S9 done, S10 + submission left); Android in progress (closed-test cohort needed first) |
| 5 — v1.x | 8+ | Zen Pack IAP, new materials (ice theme is ready in git history), soundscapes | ⏳ |

The 14-day Google Play test window is now the critical path — start recruiting the 12 testers immediately.

---

## 8. Next actions

1. ~~Confirm architecture~~ ✅ · ~~Create repo~~ ✅ · ~~Build MVP~~ ✅
2. Persist settings + treasures with AsyncStorage (`npx expo install @react-native-async-storage/async-storage`).
3. Respect system reduce-motion (S8 leftover).
4. App icon + splash (S9) — the HappyRainbow badge is a natural icon candidate.
5. Privacy policy page + store compliance forms (S10).
6. EAS Build + recruit 12 Play-closed-test friends — start the 14-day clock (Phase 3).

Sources: [Expo: Matter.js + Skia physics](https://expo.dev/blog/build-2d-game-style-physics-with-matter-js-and-react-native-skia) · [RN game engine landscape 2026](https://dev.to/grzott/the-react-native-game-engine-gap-in-2026-rnge-skia-phaser-in-webview-expo-gl-55hp) · [Store fees 2026](https://weekonelabs.com/blog/app-store-fees-explained-2026) · [Play closed-testing rule](https://support.google.com/googleplay/android-developer/answer/14151465?hl=en) · [Apple Small Business Program](https://www.revenuecat.com/blog/engineering/small-business-program/)
