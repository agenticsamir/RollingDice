# Deployment guide — Rolling Dice (Android / Google Play)

This app has no backend. EAS handles building, signing, and submission. The EAS project is already linked (`app.json` → `extra.eas.projectId`), and this repo's `eas.json` defines three build profiles: `development`, `preview`, and `production`.

## 0. One-time prerequisites

- Google Play Developer account (already set up).
- EAS account, logged in via `eas login` (already set up — verify with `eas whoami`).
- A Google Play **service account JSON key**, needed the first time you run `eas submit`:
  1. Play Console → **Setup → API access** → link/create a Google Cloud project → create a service account.
  2. Play Console → **Users and permissions** → find that service account (email like `xxx@xxx.iam.gserviceaccount.com`) → grant it, at minimum, for the Rolling Dice app specifically:
     - **Release to testing tracks**
     - **Release to production, exclude devices, and use Play App Signing** (needed for `eas submit --profile production`)
     - **View app information** (usually included by default)
  3. Download the JSON key. `eas submit` will prompt for its path the first time and store the reference for reuse.

  > **Permissions are scoped per app.** If this service account already existed before Rolling Dice was created (e.g. reused from another app), it won't automatically have access to the new app — check "Users and permissions" and explicitly add Rolling Dice to that service account's app permissions if it's missing. Symptom of a missing/insufficient grant: `eas submit` fails with a 403/permission-denied style error (different from the "Package not found" error below, which is the *manual-first-upload* issue, not a permissions one).

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
- `eas.json`'s `appVersionSource: "remote"` stores `android.versionCode` on EAS's servers instead of in `app.json`, but **by itself it does not auto-increment anything** — that only happens because the `production` profile also sets `"autoIncrement": true`. Without that flag, every build silently reuses the same remote version code (this bit us once already — see the gotcha below). `eas build:version:get --platform android --profile production` shows the current remote value if you ever need to check it. Bump the human-readable `"version"` in `app.json` yourself for each release (e.g. `1.0.0` → `1.0.1`) — that one isn't auto-managed.
- `--local` (compiling on your own machine instead of EAS's cloud infra) doesn't change any of the above — version resolution/incrementing is a call to EAS's servers that happens either way, only where the actual build compiles differs.

## 4. Submit to Google Play

```bash
eas submit --platform android --profile production
```

Defaults to submitting the latest production build. On first run it will ask for the Google service account JSON key path (see step 0).

> **The very first release of a brand-new app can't go through this command.** The Google Play Developer API (which `eas submit` uses) refuses to create an app's first release — Google requires the first build of a new package to be uploaded **manually** through the Play Console web UI before the API can be used at all. If `eas submit` fails with `Google Api Error: Invalid request - Package not found: <package name>`, that's this — not a config problem. To unblock:
> 1. Play Console → **Create app** (if not already created): name "Rolling Dice", package `com.agenticsamir.rollingdice` (must match `app.json` exactly).
> 2. Go to **Testing → Internal testing** → **Create new release** (internal testing doesn't require the store listing to be finished first, unlike Production).
> 3. Manually upload the `.aab` that `eas build --profile production` downloaded to your machine (or download it again from `eas build:list` / the build's Expo dashboard page).
> 4. Roll out that release.
>
> Once that first manual upload exists, `eas submit` works normally for every release after — this is strictly a one-time step for a new app.
>
> **Follow-up gotcha (root cause, now fixed):** after doing the manual upload above, running `eas submit` again on a new build could still fail with `You've already submitted this version of the app`. The real cause: `eas.json`'s `production` profile was missing `"autoIncrement": true`, so `appVersionSource: "remote"` alone was **not** bumping `versionCode` — every build, including `--local` ones, kept reusing the same version code Play already had from the manual upload. This is now fixed in `eas.json` (`autoIncrement: true` added to the `production` profile), so every future `eas build --profile production` gets a fresh version code automatically. If you ever see this error again, run `eas build:version:get --platform android --profile production` to check the current remote value against what's already live in Play Console.

## 5. Manual Google Play Console setup (cannot be done via CLI)

Required before the first release can go out, even to internal testing. Everything needed for this step — store listing copy, icon/feature graphic/screenshots, content rating answers, data safety answers, and a live privacy policy URL — is already prepared in **[`deployment/`](./deployment/README.md)**. Start there and work through its checklist.

> **Android manifest permission hygiene:** `expo-audio` and `expo-sensors`' native Android modules unconditionally bundle several permissions this app never actually uses (foreground-service audio/recording, `ACTIVITY_RECOGNITION`). Play Console will flag these — `ACTIVITY_RECOGNITION` specifically under its Health apps policy — if left in. They're stripped via a manifest-merge override in [`plugins/withStripUnusedPermissions.js`](./plugins/withStripUnusedPermissions.js). To verify this (or any future permission change) actually took effect in a real build **without** waiting on a full EAS cloud build, run a local Gradle manifest-merge check — it's fast (~20s) and doesn't require a device or full app compile:
> ```bash
> npx expo prebuild --platform android --clean
> cd android && ./gradlew :app:processReleaseManifest
> grep -E "uses-permission|<service" app/build/intermediates/merged_manifests/release/processReleaseManifest/AndroidManifest.xml
> cd .. && rm -rf android   # this project stays in the managed workflow — don't commit the generated native folder
> ```

## Notes

- The package name (`com.agenticsamir.rollingdice`, set in `app.json`) is **permanent** once the first version is published to Play — it cannot be changed later.
- The placeholder icon/splash assets (`assets/icon.png`, `assets/android-icon-*.png`, `assets/splash-icon.png`) and the synthesized placeholder sound (`assets/sounds/dice-roll.mp3`) are functional but not polished — swap in final versions before the production submission if desired. Regenerate icons with `python3` + Pillow, or replace with designed assets; replace the sound with any royalty-free dice-clatter clip (e.g. from freesound.org or Pixabay Sound Effects) at the same path.
