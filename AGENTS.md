# ZenSmash — project conventions

Stress-relief mobile game: tap to break cubes, watch the world bloom, leave calmer. Methodology: [ai-delivery-playbook](https://github.com/MikulasFrenak/ai-delivery-playbook). Full plan: `docs/project-plan.md`.

## Stack

Expo SDK 54 + TypeScript (strict). Rendering: @shopify/react-native-skia. Animations: react-native-reanimated (+ react-native-worklets) and RN Animated for overlays. Input: react-native-gesture-handler. Audio: expo-audio (synthesized WAV assets in `assets/sounds/`). Haptics: expo-haptics.

Web target: `app.json` sets `web.output: "single"` (a plain SPA bundle — no expo-router) so the game can be iframe-embedded on the portfolio site. `index.ts`/`index.web.ts` split the native vs web entry point (Metro's platform-extension resolution) — web loads Skia's CanvasKit (WASM, served same-origin from `public/canvaskit.wasm` — a CDN version mismatched against the bundled JS glue breaks every Skia call) before registering the root component. Deploys as its own Cloudflare Worker (`wrangler.jsonc`), auto-deploying on push to `main` via `.github/workflows/deploy.yml`. The Worker isn't pure static hosting: `worker/index.ts` (its own isolated `worker/tsconfig.json` — Workers runtime types, not RN/DOM, see `npm run typecheck`) intercepts `POST /api/track` and falls through to `env.ASSETS.fetch(request)` for everything else.

Web-only input handling in `GameCanvas.tsx`: taps go through a plain `click` DOM listener on the canvas, not `GestureDetector`/`Gesture.Tap()` (RNGH's web Tap gesture doesn't reliably recognize a MacBook trackpad's tap-to-click). A themed hammer cursor (custom SVG, positioned via direct DOM manipulation, not React state) replaces the OS cursor while hovering a cube. Native is unaffected by any of this — both are Platform-gated.

## Structure

- `src/engine/` — pure game logic, no React/rendering imports (blocks, cracks, cubeMotion, mandala, moments, rng). Everything here must be unit-tested.
- `src/render/` — Skia + overlay components (GameCanvas, Cube, Lotus, HappyRainbow, FloatingMoment, PrizePop, Visitor). No game rules here — `Cube.tsx`/`Lotus.tsx` are thin Skia mappers over `cubeMotion.ts`/`mandala.ts`'s pure math; that split exists specifically so drop/squash/bloom logic is unit-testable without needing to render real Skia components (attempted — `@shopify/react-native-skia`'s Jest helpers need a real `canvaskit-wasm` instance, which collides with jest-expo's `TextDecoder` shim).
- `src/feel/` — the "juice" API. Game code calls ONLY `feelHit() / feelShatter() / feelHello() / feelPrize() / feelBloom()` from `@/feel`; never touch expo-haptics or expo-audio directly elsewhere. All feel respects user settings.
- `src/analytics/` — opt-in session analytics. Game code calls ONLY `trackSessionStart() / trackSessionComplete() / trackSettingChanged()` from `@/analytics`; see the "Analytics" section below.
- `src/locales/` — 8 locales (en, sk, cs, hu, pl, de, fr, es), plain hand-written `Record<Locale, Strings>` dictionaries (no i18n library — small enough not to need one): `moments.ts` (flying-cloud phrase pools, native not translated) and `ui.ts` (menu/celebration strings, celebration has 5 random variants).
- `src/state/` — tiny `useSyncExternalStore` stores: `settings` (sound/haptics/particles/analytics), `collection` (treasures). In-memory only; AsyncStorage persistence is an open task.
- `src/theme/` — colors. Green/white base; rainbow colors are ONLY for reward moments (rainbow arcs, bursts, charge sparks, shining mandala).
- `src/ui/` — RN overlays: ZenMenu (🌿 stats + toggles + language), CollectionModal (🎁 treasures), UnicornDone (session results). `UnicornDone.tsx`/`UnicornDone.web.tsx`/`UnicornDoneCard.tsx` split the actual card content (`UnicornDoneCard`) from how it mounts: native renders it in place, web portals it to `document.body` (via `react-dom`'s `createPortal`) since a modal nested inside `GameCanvas`'s own subtree can't out-rank later App-level siblings in CSS stacking on web — see the comment on `UnicornDone.web.tsx` for the full reasoning.
- `worker/` — the Cloudflare Worker script (see "Stack" above). Not under `src/`, not part of the Expo/RN app — own isolated `tsconfig.json` since it runs in the Workers runtime.
- `.tasks/` — per-ticket plan files (playbook `create-task`).

## Game design facts

- Grid 3×5, `TAPS_TO_BREAK = 5`. Session = `RAINBOW_FULL = 30` breaks (two full fields), then finale: no refill, mandala shines vivid for 4.5 s with bloom sound, then results, then fresh cycle.
- Focused hit (`isFocusedHit` in `src/engine/blocks.ts`): a repeat tap on the same cube, within `FOCUS_WINDOW_MS` (450ms) and `FOCUS_PROXIMITY` (15% of the cube) of the previous tap, deals `FOCUS_BONUS_DAMAGE` (2) instead of 1 — rapid, precise tapping breaks a cube in as few as 3 taps instead of 5. No combo counter/UI; a focused hit always spawns chips (vs. the usual 75% chance) as the only visible cue.
- Mandala is one of `FLOWER_SPECIES` (`src/engine/mandala.ts`, 13 species — different petal counts/proportions/outer+inner shape combos + a themed pastel palette each, re-exported from `src/render/Lotus.tsx` for convenience), re-picked (never repeating the previous one, `pickDifferent` in `src/engine/rng.ts`) at game start and every fresh cycle. Outer ring is always `teardrop` (leaf-shaped) so it reads as a flower — `circle`/`triangle`/`rect` only ever appear as a small inner-ring accent, never as the whole flower (tried, looked bad). Finale shine is always full rainbow regardless of species.
- Every break rewards something: hidden emoji prize (~1 in 6 cubes, revealed through the glass as damage grows) or a joke line on a flying cloud.
- Ambience: levitating sun, 5 random clouds, occasional 5 s rain, 9-tuft meadow whose flowers bloom with progress, fireflies, waving animal visitors every 12–32 s.

## Analytics

Opt-in, off by default (`settings.analytics`, toggled in ZenMenu next to sound/haptics/particles) — matches the app's no-pressure design stance and needs no cookie-banner-style consent flow since it's anonymous and default-off. Three events, no per-tap tracking, no PII: `session_start` (mount + every fresh RAINBOW_FULL cycle), `session_complete` (finale — `durationMs`, `totalTaps`, `focusedHits`, `prizesFound`, `flowerSpecies`, all tallied in `GameCanvas.tsx` refs), `settings_changed` (any toggle flip, fired from `ZenMenu.tsx`). `src/analytics/index.ts` no-ops in `__DEV__` (so local testing never pollutes real counts) and whenever the toggle is off — flipping analytics off makes even that toggle's own `settings_changed` event not fire, which is deliberate: the moment someone opts out, nothing else can slip through afterward.

Client posts to `/api/track` — same-origin path on web (works both standalone and iframed into review-spa), the absolute `zensmash.mikulas-frenak.workers.dev` URL on native (no origin of its own). `worker/index.ts` validates the event name against an allowlist and writes to a Cloudflare Analytics Engine dataset (`zensmash_events`, auto-provisions on first write — no manual dashboard setup) via `env.ANALYTICS.writeDataPoint()`. Fixed blob/double slots, documented in `worker/index.ts` itself, so the dataset stays easy to query later.

## Conventions

- Branching: short-lived feature branches off `main`, named `feat/S<n>-slug` or `fix/slug`. PRs into `main`, no direct pushes.
- Commits: conventional commits (`feat:`, `fix:`, `chore:`, `test:`).
- Dependencies: pinned to Expo SDK 54 (test device's Expo Go). Add packages with `npx expo install <pkg>`, never plain `npm install <pkg>`. See README "SDK version".
- Quality gate before commit: `npm run lint && npm run typecheck && npm test`.
- Architecture rule (playbook): present options + get explicit agreement before non-trivial implementation.
- Design rules: no screen shake, no timers, no fail states, no scores/leaderboards. Calm is a feature. Squash-and-stretch stays subtle (≤4%). Rainbow = reward only.
- Sounds are generated (Python stdlib, no deps) — see git history for the synth scripts; keep new sounds soft, musical, pentatonic-friendly.

## Verification

Automated tests cover `src/engine` and `src/state`. Game feel (haptics, audio latency, 60 fps with particles + ambient tick) is verified on a real device via Expo Go — simulator sign-off is not sufficient. Watch battery/thermals: the ambient sky tick redraws continuously — 20fps on native, halved to 10fps on web (CanvasKit's JS↔WASM marshalling makes web re-renders meaningfully more expensive) and paused entirely via the Page Visibility API when the tab/iframe isn't visible. Note: Safari's CanvasKit/WebGL performance is inherently heavier than Chrome's — an upstream react-native-skia/Safari characteristic, not something fixable in this codebase.

The `worker/index.ts` route and the analytics pipeline aren't exercised by `npm test` (no runtime Workers surface in Jest) — verify with `npx expo export -p web && npx wrangler dev`, then drive the served build (Playwright or a browser) and check for a `/api/track` request with the expected payload. `__DEV__` no-ops analytics, so this only works against the exported production bundle, not `expo start`.
