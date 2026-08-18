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

## GitHub Pages hosting (already set up)
`docs/index.html` is served by GitHub Pages from the `main` branch's `/docs` folder at `https://agenticsamir.github.io/RollingDice/`. If you ever need to re-enable it (e.g. after a repo transfer), go to the repo's **Settings → Pages** and set Source to "Deploy from a branch," branch `main`, folder `/docs`.

## Once everything above is filled in
Move on to `../DEPLOYMENT.md` §2–4 to build and submit the app itself via EAS.
