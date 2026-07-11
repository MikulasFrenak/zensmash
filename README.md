# ZenSmash 🌱

A stress-relief mobile game. Tap blocks, watch them shatter into rainbows, breathe out.

No scores. No timers. No fail state. Just smashing.

## Getting started

```bash
npm install
npx expo start -c
```

Scan the QR with your phone's **Camera app** and open in **Expo Go** — use a real device, haptics don't work in simulators.

### Important: SDK version

This project is pinned to **Expo SDK 54** because the Expo Go build available on the team's test iPhone supports SDK 54 (`expo@~54.x`, `babel-preset-expo@~54.0.10`, `react-native-worklets` required by Reanimated 4).

Rules learned the hard way:

- **Always add packages with `npx expo install <pkg>`**, never plain `npm install <pkg>` — it picks versions compatible with the installed SDK. A mismatched `babel-preset-expo` (v57 on SDK 54) causes the runtime error `private properties are not supported`.
- After dependency changes, restart with `npx expo start -c` (clears Metro cache).
- If Expo Go says "Project is incompatible with this version of Expo Go", the project SDK and the Expo Go app version don't match — realign with `npm install expo@^54.0.0 && npx expo install --fix`.
- `expo-status-bar` is a component, not a config plugin — it must NOT be listed in `plugins` in `app.json`.

### Quality gate (run before every commit)

```bash
npm run lint && npm run typecheck && npm test
```

## Project docs

- `docs/project-plan.md` — full plan (vision, stories, architecture, store release)
- `CLAUDE.md` — conventions and structure

## Status

MVP in progress — Epic 1 (core smash loop): S1–S3 skeleton runs on device 🎉. Next: game-feel tuning + design pass.
