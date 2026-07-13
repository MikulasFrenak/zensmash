# ZenSmash — App Store release checklist

Work through top to bottom. Items marked 🤖 are ready/automated; ⚠️ needs you.

## 0. Prerequisites

- [x] 🤖 App icon, adaptive icon, splash (`assets/`), wired in `app.json`
- [x] 🤖 `eas.json` build profiles, version 1.0.0
- [x] 🤖 Privacy policy text (`docs/store/privacy-policy.md`)
- [x] 🤖 Listing copy EN/SK/CZ (`docs/store/listing.md`)
- [ ] ⚠️ Apple Developer enrollment approved (email from Apple, ~2 days)
- [ ] ⚠️ Expo account: `npx eas-cli login`

## 1. Host the privacy policy (5 min)

Both stores require a public URL. Easiest: GitHub Pages.

- [ ] Repo Settings → Pages → Deploy from branch `main`, folder `/docs`
- [ ] Convert `docs/store/privacy-policy.md` → `docs/privacy.html` (or keep .md — GitHub Pages renders it)
- [ ] URL will be: `https://mikulasfrenak.github.io/zensmash/store/privacy-policy`

## 2. First cloud build

```bash
npx eas-cli build --platform ios --profile production
```

- [ ] When asked, log in with your Apple ID and let EAS create certificates/profiles automatically
- [ ] Wait ~20 min; build appears at expo.dev

## 3. App Store Connect setup (once)

At [appstoreconnect.apple.com](https://appstoreconnect.apple.com):

- [ ] My Apps → **+ New App** — platform iOS, name **ZenSmash**, bundle ID `com.mikulasfrenak.zensmash`, SKU `zensmash`
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

- [ ] Build lands in App Store Connect → TestFlight (processing ~15 min)
- [ ] Add yourself + friends as internal testers — instant, no review
- [ ] Play a full session on the TestFlight build (haptics, audio, 60fps, battery)

## 6. Submit for review

- [ ] Attach the build to version 1.0.0, fill "What's New"
- [ ] Review notes: "Relaxation game. No account needed. Optional anonymous usage stats, off by default. Tap cubes to break them."
- [ ] Submit — typical review 24–48 h

## 7. Android (parallel track)

- [ ] Google Play Console account ($25 one-time)
- [ ] `npx eas-cli build --platform android --profile production`
- [ ] Closed test: **12 testers opted in for 14 consecutive days** (new personal accounts) — recruit now, this is the critical path
- [ ] Data safety form: declare **"App activity"** data type collected, purpose "Analytics," **not** shared with third parties for their own use (Cloudflare is infrastructure we operate, not a data buyer), encrypted in transit (HTTPS), collection is **optional/user-controlled** (off by default) — no persistent user identifier exists so there's nothing to delete on request. Play listing from `listing.md`

## Open dev tasks before/with release

- [ ] Persist settings + treasures (AsyncStorage) — nice for v1.0, required feel for v1.1
- [ ] Respect reduce-motion (S8 leftover)
