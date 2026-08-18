# Play Console deployment kit

Everything in this folder is the material for the parts of shipping Rolling Dice that **can't be done via the EAS CLI** — Google Play Console's manual "App content" and store listing steps. For the CLI side (building and submitting the app itself), see `../DEPLOYMENT.md`.

Work through this checklist top to bottom in Play Console for the Rolling Dice app. Google renames/reshuffles this navigation periodically — as of writing (Aug 2026), the fastest way to reach every "App content" item (privacy policy, content rating, data safety, ads, target audience) is the **Dashboard → "Finish setting up your game" → "Provide game information and create your store listing"** checklist, which links straight to each one. The same items also live under the left sidebar's **Monitor and improve → Policy and programs → App content**. If neither exists by the time you read this, use the Play Console search icon in the top nav and search for the item name directly (e.g. "privacy policy").

## 1. Main store listing
In the left sidebar, go to **Grow users → Store presence → Store listings** (this section gets renamed by Google periodically — as of writing it's "Store listings," previously "Main store listing"; if it's moved again, use the search icon in the top nav or check under whichever top-level item covers store presence/growth), then **Create default store listing** (a two-step Assets → Review form) and paste in:
- App name, short description, full description, category → all in [`store-listing.md`](./store-listing.md)
- App icon (512×512) → [`graphics/icon-512.png`](./graphics/icon-512.png)
- Feature graphic (1024×500) → [`graphics/feature-graphic-1024x500.png`](./graphics/feature-graphic-1024x500.png)
- Phone screenshots (min. 2) → [`graphics/screenshot-1-roll.png`](./graphics/screenshot-1-roll.png), [`graphics/screenshot-2-history.png`](./graphics/screenshot-2-history.png)

> **Note on the screenshots:** these are stylized mockups built to match the real app's colors and layout exactly (`src/components/Die.tsx`'s palette), not live device captures. They're good enough to submit as-is, but swap in real screenshots from a physical device once you've tested the app if you want pixel-perfect accuracy — see `../DEPLOYMENT.md` for how to test on-device via Expo Go.

## 2. App content → Privacy policy
Dashboard checklist item **"Set privacy policy"** (URL path `app-content/privacy-policy`) — a single-field form. Paste this URL into it:
```
https://agenticsamir.github.io/RollingDice/
```
This is published live from [`../docs/index.html`](../docs/index.html) via GitHub Pages (already enabled on this repo — see below). Already filled in on this form as of Aug 18, 2026 — just needs **Save** clicked.

## 3. App content → Content rating
Walk through the questionnaire using [`content-rating-guide.md`](./content-rating-guide.md) — every answer is "No," landing the app in the lowest rating tier.

## 4. App content → Data safety
Walk through the form using [`data-safety-guide.md`](./data-safety-guide.md) — declare zero data collection, which is accurate since the app has no network access at all.

## 5. App content → Ads, target audience, government apps, etc.
The remaining short declarations in Play Console's "App content" section all get straightforward answers for this app:
- **Ads:** No ads.
- **Target audience:** Everyone / not primarily designed for children (see `content-rating-guide.md` for detail).
- **Government apps / COVID-19 apps / financial features:** No to all — not applicable.

## 6. App category & contact details
Left sidebar → **Grow users → Store presence → Store settings**. Two things live here:
- **App category** — "App or game" is already set to "Game"; pick a **Category** (Not selected yet) — e.g. Casual, matching the recommendation in `store-listing.md`.
- **Store listing contact details** — an email address shown to users on the store listing.

This is the last item in the Dashboard's "Finish setting up your game" checklist (item 11 of 11) — once it's done, that checklist is fully complete, but **that alone does not unlock Production** (see §7).

## GitHub Pages hosting (already set up)
`docs/index.html` is served by GitHub Pages from the `main` branch's `/docs` folder at `https://agenticsamir.github.io/RollingDice/`. If you ever need to re-enable it (e.g. after a repo transfer), go to the repo's **Settings → Pages** and set Source to "Deploy from a branch," branch `main`, folder `/docs`.

## 7. Closed testing → apply for production
**This is the real remaining gate, and it's calendar-time-bound, not a checklist item.** Google requires personal Play Console accounts created after Nov 13, 2023 to run a closed test before Production access unlocks at all — confirmed live in this account's Dashboard ("Apply for access to production" is disabled until the criteria below are met) and in Google's own help article: [*App testing requirements for new personal developer accounts*](https://support.google.com/googleplay/android-developer/answer/14151465). Skipping straight to `eas submit`/production builds doesn't bypass this — it's a Play Console gate independent of how the binary gets there.

**Requirement:** at least **12 testers opted in continuously for at least 14 days** on a closed test, then apply and pass a Google review (typically ≤7 days).

Steps, in order:
1. **Set up the closed track** — left sidebar → **Test and release → Testing → Closed testing**. A default **"Closed testing - Alpha"** track already exists for this app (currently empty/inactive).
2. **Add testers** — open the track → **Testers** tab → **Email lists** (a list named "Samir Gupta" with 1 user already exists from setup) or **Google Groups**. Add emails until you have **12+ real testers**. Recruit from your personal/professional network (friends, family, colleagues) — this is Google's own recommended approach, not just a formality; they need to actually opt in and use the app, not just be listed.
3. **Publish a release to this track** — track → **Releases** tab → **Create new release** → attach an AAB (the same one from `eas build --profile production` works fine) → roll out. This is a separate rollout from Internal testing/Production; it doesn't affect those tracks.
4. **Get testers opted in** — once published, the track's **Testers** tab shows **"Join on Android"** and **"Join on the web"** links. Share one with your 12+ testers and ask them to actually open it and opt in (not just receive it). They must **stay opted in continuously for 14 days** — warn testers not to opt out early, since that resets the clock for the whole cohort's continuous-opt-in requirement.
5. **Wait out the 14 days**, then go to the **Dashboard** → **"Apply for production"** (only clickable once the 12-tester/14-day criteria are met). It's a 3-part form: *About your closed test*, *About your app/game*, *About your production readiness* — answer honestly based on what actually happened during the test (feedback received, issues fixed, etc.).
6. **Google reviews the application** (usually ≤7 days; an email goes to the account owner when done). If approved, **Production** and **Open testing** both unlock in the left sidebar.

Once Production is unlocked, go back to `../DEPLOYMENT.md` §3–4 (`eas build --profile production` → `eas submit`) to actually ship a release there — this closed-testing process is a one-time Play Console gate to unlock the track, not a replacement for the normal build/submit flow. **This whole section only happens once** — it does not repeat for future updates. For what shipping a later update actually looks like, see `../DEPLOYMENT.md` §4.5.

## Once everything above is filled in
The App content checklist (§1–6) can be done today. §7 (closed testing) is the long pole — it takes 14+ days minimum plus review time, so start it as early as possible rather than saving it for last. Once Production is unlocked, use `../DEPLOYMENT.md` §2–4 to build and submit the app itself via EAS.
