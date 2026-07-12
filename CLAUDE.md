# ZenSmash — project conventions

Stress-relief mobile game: tap to break cubes, watch the world bloom, leave calmer. Methodology: [ai-delivery-playbook](https://github.com/MikulasFrenak/ai-delivery-playbook). Full plan: `docs/project-plan.md`.

## Stack

Expo SDK 54 + TypeScript (strict). Rendering: @shopify/react-native-skia. Animations: react-native-reanimated (+ react-native-worklets) and RN Animated for overlays. Input: react-native-gesture-handler. Audio: expo-audio (synthesized WAV assets in `assets/sounds/`). Haptics: expo-haptics.

Web target: `app.json` sets `web.output: "single"` (a plain SPA bundle — no expo-router) so the game can be iframe-embedded on the portfolio site. `index.ts` loads Skia's CanvasKit (WASM) on `Platform.OS === 'web'` before registering the root component, since Skia needs it there but not on native.

## Structure

- `src/engine/` — pure game logic, no React/rendering imports (blocks, cracks, moments, rng). Everything here must be unit-tested.
- `src/render/` — Skia + overlay components (GameCanvas, Lotus, HappyRainbow, FloatingMoment, PrizePop, Visitor). No game rules here.
- `src/feel/` — the "juice" API. Game code calls ONLY `feelHit() / feelShatter() / feelHello() / feelPrize() / feelBloom()` from `@/feel`; never touch expo-haptics or expo-audio directly elsewhere. All feel respects user settings.
- `src/i18n/` — 8 locales (en, sk, cs, hu, pl, de, fr, es): `moments.ts` (flying-cloud phrase pools, native not translated) and `ui.ts` (menu/celebration strings, celebration has 5 random variants).
- `src/state/` — tiny `useSyncExternalStore` stores: `settings` (sound/haptics/particles), `collection` (treasures). In-memory only; AsyncStorage persistence is an open task.
- `src/theme/` — colors. Green/white base; rainbow colors are ONLY for reward moments (rainbow arcs, bursts, charge sparks, shining mandala).
- `src/ui/` — RN overlays: ZenMenu (🌿 stats + toggles + language), CollectionModal (🎁 treasures), UnicornDone (session results).
- `.tasks/` — per-ticket plan files (playbook `create-task`).

## Game design facts

- Grid 3×5, `TAPS_TO_BREAK = 5`. Session = `RAINBOW_FULL = 30` breaks (two full fields), then finale: no refill, mandala shines vivid for 4.5 s with bloom sound, then results, then fresh cycle.
- Every break rewards something: hidden emoji prize (~1 in 6 cubes, revealed through the glass as damage grows) or a joke line on a flying cloud.
- Ambience: levitating sun, 5 random clouds, occasional 5 s rain, 9-tuft meadow whose flowers bloom with progress, fireflies, waving animal visitors every 12–32 s.

## Conventions

- Branching: short-lived feature branches off `main`, named `feat/S<n>-slug` or `fix/slug`. PRs into `main`, no direct pushes.
- Commits: conventional commits (`feat:`, `fix:`, `chore:`, `test:`).
- Dependencies: pinned to Expo SDK 54 (test device's Expo Go). Add packages with `npx expo install <pkg>`, never plain `npm install <pkg>`. See README "SDK version".
- Quality gate before commit: `npm run lint && npm run typecheck && npm test`.
- Architecture rule (playbook): present options + get explicit agreement before non-trivial implementation.
- Design rules: no screen shake, no timers, no fail states, no scores/leaderboards. Calm is a feature. Squash-and-stretch stays subtle (≤4%). Rainbow = reward only.
- Sounds are generated (Python stdlib, no deps) — see git history for the synth scripts; keep new sounds soft, musical, pentatonic-friendly.

## Verification

Automated tests cover `src/engine` and `src/state`. Game feel (haptics, audio latency, 60 fps with particles + ambient 20 fps tick) is verified on a real device via Expo Go — simulator sign-off is not sufficient. Watch battery/thermals: the ambient sky tick redraws continuously.
