# ZenSmash — project conventions

Stress-relief mobile game: tap to break blocks, leave calmer. Methodology: [ai-delivery-playbook](https://github.com/MikulasFrenak/ai-delivery-playbook). Full plan: `docs/project-plan.md`.

## Stack

Expo + TypeScript (strict). Rendering: @shopify/react-native-skia. Animations/game loop: react-native-reanimated. Input: react-native-gesture-handler. Physics (debris, later): matter-js. Haptics: expo-haptics.

## Structure

- `src/engine/` — pure game logic, no React/rendering imports. Everything here must be unit-testable.
- `src/render/` — Skia components. No game rules here.
- `src/feel/` — the "juice" API (haptics, sound). Call `feelHit()` / `feelShatter()`; never call expo-haptics directly elsewhere.
- `src/theme/` — colors and motion tokens. Rainbow colors are ONLY for reward moments (shatter bursts); base UI stays green/white.
- `.tasks/` — per-ticket plan files (playbook `create-task`).

## Conventions

- Branching: short-lived feature branches off `main`, named `feat/S<n>-slug` or `fix/slug`. PRs into `main`, no direct pushes.
- Commits: conventional commits (`feat:`, `fix:`, `chore:`, `test:`).
- Dependencies: project is pinned to Expo SDK 54 (test device's Expo Go). Add packages with `npx expo install <pkg>`, never plain `npm install <pkg>`. See README "SDK version".
- Quality gate before commit: `npm run lint && npm run typecheck && npm test`.
- Architecture rule (playbook): present options + get explicit agreement before non-trivial implementation.
- Design rule: no screen shake, no timers, no fail states. Calm is a feature.

## Verification

Automated tests cover `src/engine`. Game feel (haptics, audio latency, 60fps under particle bursts) is verified on a real device via Expo Dev Client — simulator sign-off is not sufficient.
