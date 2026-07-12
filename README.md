# ZenSmash 🌱

A stress-relief mobile game. Tap cubes, watch them shatter into rainbows, and leave calmer than you came.

No scores. No timers. No fail state. Just smashing — and a world that blooms as your stress leaves.

## The loop

- **Smash** — 3×5 grid of glassy green cubes, 5 taps each. Cracks spread from exactly where you tap, ice chips fly, cubes squash under your finger.
- **Get rewarded** — every break gives you something: a hidden emoji surprise pops free (🦆🧦🍩 — collected in your 🎁 treasures), or a joke floats up on a little cloud (native phrases in EN/SK/CZ/HU/PL/DE/FR/ES).
- **Watch the world wake up** — the rainbow fills with color stripe by stripe, a lotus mandala blooms petal by petal behind the cubes, meadow flowers open, fireflies appear. A smiling sun levitates, clouds drift, sometimes it gently rains. Animals drop by to wave at you ("hello!").
- **Finish** — after 30 breaks (two full fields) the mandala shines in full rainbow color to a blooming chord, then your results: blocks broken, treasures found, and a rhyming compliment. *"Stres je fuč, od dúhy máš kľúč 🌈"*

All sounds are synthesized in-house: marimba taps, six music-box shatter melodies, a character voice, a Cmaj9 bloom.

## Getting started

```bash
npm install
npx expo start -c
```

Scan the QR with your phone's **Camera app** and open in **Expo Go** — use a real device, haptics don't work in simulators.

Emulators (optional): press `i` for the iOS Simulator (needs Xcode) or `a` for the Android emulator (needs Android Studio + a virtual device). Good for layout checks; feel checks stay on real hardware.

### Important: SDK version

This project is pinned to **Expo SDK 54** because the Expo Go build available on the team's test iPhone supports SDK 54.

Rules learned the hard way:

- **Always add packages with `npx expo install <pkg>`**, never plain `npm install <pkg>` — it picks versions compatible with the installed SDK. A mismatched `babel-preset-expo` (v57 on SDK 54) causes the runtime error `private properties are not supported`.
- After dependency or asset changes, restart with `npx expo start -c` (clears Metro cache).
- If Expo Go says "Project is incompatible with this version of Expo Go", realign with `npm install expo@^54.0.0 && npx expo install --fix`.
- `expo-status-bar` is a component, not a config plugin — it must NOT be listed in `plugins` in `app.json`.

### Quality gate (run before every commit)

```bash
npm run lint && npm run typecheck && npm test
```

## Project structure

```
src/
  engine/   pure logic: blocks, procedural cracks, moments, rng (unit-tested)
  render/   Skia scene: GameCanvas, Lotus, HappyRainbow, FloatingMoment, PrizePop, Visitor
  feel/     the juice API: feelHit/feelShatter/feelHello/feelPrize/feelBloom
  i18n/     8 languages: phrase pools + UI strings (5 celebration variants)
  state/    settings + treasure collection (in-memory)
  theme/    green/white palette; rainbow reserved for rewards
  ui/       ZenMenu 🌿, CollectionModal 🎁, UnicornDone (results)
assets/sounds/  synthesized WAVs (crack, shatter1-6, hello, prize, bloom)
```

## Project docs

- `docs/project-plan.md` — full plan (vision, stories, architecture, store release)
- `AGENTS.md` — conventions, design rules, game facts (read natively by most AI coding tools; `CLAUDE.md` is a one-line import of it for Claude Code)

## Status

**MVP feature-complete** — core loop, session arc, rewards, ambience, sound, 8 languages, settings, treasures. Verified on a real iPhone via Expo Go.

- **Web** — released, live at [zensmash.mikulas-frenak.workers.dev](https://zensmash.mikulas-frenak.workers.dev), auto-deploys on push to `main`.
- **iOS (App Store)** — in progress. App icon + store assets (S9) done; hosted privacy policy + submission still open.
- **Android (Google Play)** — in progress. Needs a 12-tester, 14-day closed test before production access.

Also open: persistence (AsyncStorage for settings & treasures). See the plan for details.
