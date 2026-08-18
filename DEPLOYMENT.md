# Deployment guide — Rolling Dice (Android / Google Play)

This app has no backend. EAS handles building, signing, and submission. The EAS project is already linked (`app.json` → `extra.eas.projectId`), and this repo's `eas.json` defines three build profiles: `development`, `preview`, and `production`.

## 0. One-time prerequisites

- Google Play Developer account (already set up).
- EAS account, logged in via `eas login` (already set up — verify with `eas whoami`).
- A Google Play **service account JSON key**, needed the first time you run `eas submit`:
  1. Play Console → **Setup → API access** → link/create a Google Cloud project → create a service account.
  2. Grant it at least **Release Manager** access under Play Console → Users and permissions.
  3. Download the JSON key. `eas submit` will prompt for its path the first time and store the reference for reuse.

## 1. Local verification before any cloud build

```bash
cd /Users/samirgupta/Documents/ClaudeCode/RollingDice
eas whoami                     # confirm logged in; if not: eas login
npx expo install --check       # confirm all Expo package versions match the SDK
npx expo-doctor                # should report 21/21 checks passed
npx tsc --noEmit                # type-check
```

Run the app via Expo Go on a **physical Android device** (shake gesture, haptics, and real audio playback don't work meaningfully on an emulator):

```bash
npx expo start
```

Scan the QR code with Expo Go, then manually verify:
- Rolling 1 vs. 6 dice — layout doesn't overflow or wrap awkwardly.
- Sum total is correct for every dice count.
- Rapid tapping the Roll button doesn't trigger overlapping rolls.
- Shaking the phone triggers a roll (and is a no-op mid-roll).
- Force-stop and reopen the app — roll history persisted.
- Airplane mode — app works fully offline (sanity check; no network is ever used).

## 2. Preview build (installable APK, not submitted to any store)

```bash
eas build --platform android --profile preview
```

EAS prints a download link/QR when done. Install the APK directly on a physical device and re-run the manual test matrix above **outside** Expo Go — this is the closest pre-production check to the real Play Store build.

## 3. Production build (AAB for the Play Store)

```bash
eas build --platform android --profile production
```

- First time on this project, EAS will offer to generate and manage an Android upload keystore in the cloud — accept, unless an existing keystore for this project should be reused.
- `eas.json`'s `appVersionSource: "remote"` means EAS auto-increments `android.versionCode` on each production build — no manual bumping needed. Bump the human-readable `"version"` in `app.json` yourself for each release (e.g. `1.0.0` → `1.0.1`).

## 4. Submit to Google Play

```bash
eas submit --platform android --profile production
```

Defaults to submitting the latest production build. On first run it will ask for the Google service account JSON key path (see step 0).

## 5. Manual Google Play Console setup (cannot be done via CLI)

Required before the first release can go out, even to internal testing. Everything needed for this step — store listing copy, icon/feature graphic/screenshots, content rating answers, data safety answers, and a live privacy policy URL — is already prepared in **[`deployment/`](./deployment/README.md)**. Start there and work through its checklist.

## Notes

- The package name (`com.agenticsamir.rollingdice`, set in `app.json`) is **permanent** once the first version is published to Play — it cannot be changed later.
- The placeholder icon/splash assets (`assets/icon.png`, `assets/android-icon-*.png`, `assets/splash-icon.png`) and the synthesized placeholder sound (`assets/sounds/dice-roll.mp3`) are functional but not polished — swap in final versions before the production submission if desired. Regenerate icons with `python3` + Pillow, or replace with designed assets; replace the sound with any royalty-free dice-clatter clip (e.g. from freesound.org or Pixabay Sound Effects) at the same path.
