# ZenSmash — App Store release checklist

Work through top to bottom. Items marked 🤖 are ready/automated; ⚠️ needs you.

> **STATUS (2026-07-18):** Both platforms built & submitted once; first builds crashed at startup
> (transitive expo-asset@57 — fixed, see README) and were rebuilt with the fix + rainbow Android icon.
> Android fix verified in emulator ✅. **Now:** re-submit iOS to TestFlight (step 5) and verify on
> iPhone, then screenshots (4) → ASC listing (3) → review (6). Android: production build + closed
> test with 12 testers (7) — recruit them NOW, their 14-day clock is the critical path.

## 0. Prerequisites ✅ all done

- [x] 🤖 App icon, adaptive icon (now with rainbow 🌈), splash (`assets/`), wired in `app.json`
- [x] 🤖 `eas.json` build profiles, version 1.0.0
- [x] 🤖 Privacy policy text (`docs/store/privacy-policy.md`)
- [x] 🤖 Listing copy EN/SK/CZ (`docs/store/listing.md`)
- [x] ⚠️ Apple Developer enrollment approved 2026-07-18
- [x] ⚠️ Expo account: logged in, project linked (`@mikulasfrenak/zensmash`, EAS project 7da7e437)

## 1. Host the privacy policy ✅

Served by our own Cloudflare Worker (`worker/index.ts`, route `GET /privacy`) — deploys with the web build on push to `main`.

- [x] Public URL for both stores: **https://zensmash.mikulas-frenak.workers.dev/privacy**
- [ ] Open the URL once to verify it renders

## 2. First cloud build

**Pre-build sanity (EVERY build):**

```bash
npm ls expo-asset expo-constants   # must show single 12.x/18.x — a 57.x here = startup crash (see README)
npm run lint && npm run typecheck && npm test
```

```bash
npx eas-cli build --platform ios --profile production
```

- [x] Apple ID login + EAS-generated certificates/profiles (done during first build)
- [x] First iOS + Android builds completed — **crashed at startup** (expo-asset@57, see README) → fixed
- [ ] Rebuild iOS with the fix and re-submit (Android fix already verified in emulator ✅)

## 3. App Store Connect setup (once)

At [appstoreconnect.apple.com](https://appstoreconnect.apple.com):

- [x] App record created — EAS submit auto-created **ZenSmash**, ASC App ID `6792247615`, TestFlight group "Team (Expo)" with mikulas.frenak@gmail.com
- [ ] App Information: category Games/Casual, age rating questionnaire (all "No" → 4+)
- [ ] App Privacy: **not** "Data Not Collected" anymore (S8 added an opt-in analytics toggle — see `privacy-policy.md`). Declare data type **"Product Interaction"** under Usage Data: Collected: Yes · Linked to Identity: **No** · Used for Tracking: **No** (events carry no identifier of any kind — see `AGENTS.md` "Analytics"). If the toggle stays off by default this may also qualify for "Data Not Collected" only if Apple's form allows conditioning on an opt-in switch — check current App Store Connect wording before submitting
- [ ] Pricing: Free, all territories
- [ ] Paste description/keywords/subtitle from `listing.md` (EN primary; add SK/CZ localizations)
- [ ] Privacy policy URL from step 1

## 4. Screenshots (on your iPhone)

Required: 6.9" (iPhone Pro Max) or 6.5" set, minimum 3 shots. Take in Expo Go via a production-like build (better: TestFlight build from step 5).

Suggested shots: fresh field with sun+clouds · mid-session with rainbow half full + lotus + joke cloud · prize emoji popping · shining mandala finale · results screen · treasures modal.

- [ ] Screenshots taken and uploaded

## 5. TestFlight first (recommended)

```bash
npx eas-cli submit --platform ios --latest
```

- [x] First submit done (build 2 — the crashing one; superseded)
- [ ] Submit the FIXED build; lands in TestFlight (processing ~15 min)
- [x] TestFlight access enabled for mikulas.frenak@gmail.com (auto via EAS)
- [ ] Play a full session on the fixed TestFlight build (haptics, audio, 60fps, battery)

## 6. Submit for review

- [ ] Attach the build to version 1.0.0, fill "What's New"
- [ ] Review notes: "Relaxation game. No account needed. Optional anonymous usage stats, off by default. Tap cubes to break them."
- [ ] Submit — typical review 24–48 h

## 7. Android (parallel track)

- [x] Google Play Console account created; identity verification (passport + address) submitted
- [x] Preview APK built, crash found via Android Studio emulator + adb, fix verified ✅
- [ ] `npx eas-cli build --platform android --profile production` (AAB with the fix)
- [ ] Closed test: **12 testers opted in for 14 consecutive days** (new personal accounts) — recruit now, this is the critical path
- [ ] Data safety form: declare **"App activity"** data type collected, purpose "Analytics," **not** shared with third parties for their own use (Cloudflare is infrastructure we operate, not a data buyer), encrypted in transit (HTTPS), collection is **optional/user-controlled** (off by default) — no persistent user identifier exists so there's nothing to delete on request. Play listing from `listing.md`

## Open dev tasks before/with release

- [ ] Persist settings + treasures (AsyncStorage) — nice for v1.0, required feel for v1.1
- [ ] Respect reduce-motion (S8 leftover)

## Deferred to v1.1

- [ ] **Native iPad support** — v1.0 ships iPhone-only (`ios.supportsTablet: false` in `app.json`), because Apple then doesn't require 13" iPad screenshots and we had no way to take proper ones. iPads can still install and play the app in scaled iPhone-compatibility mode. For 1.1: design a real iPad layout (wider grid, more sky), flip `supportsTablet: true`, take 13" screenshots (2064×2752) in the iPad Simulator, add them to ASC.
