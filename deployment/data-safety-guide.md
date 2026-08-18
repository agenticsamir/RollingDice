# Data safety form guide

Play Console → App content → Data safety. This form asks, per data type, whether your app **collects** and/or **shares** it. Rolling Dice collects nothing — it has no network access at all (verify: the app never imports `fetch`, `XMLHttpRequest`, or any networking library; roll history is written only to on-device `AsyncStorage` via `src/lib/historyStorage.ts`).

## Step 1: "Does your app collect or share any of the required user data types?"
**Answer: No.**

This is the fastest path — Play Console lets you declare zero data collection up front, which skips the rest of the per-category questions entirely. This is accurate for Rolling Dice: no accounts, no analytics SDKs, no crash reporting SDKs, no ad SDKs, no network calls of any kind.

## Step 2: Security practices section
Even with "no data collected," Play Console asks a couple of standalone questions:
- **Is all user data encrypted in transit?** — Answer "Not applicable" or leave unanswered if offered, since no data is transmitted at all. If the form forces a Yes/No, "Yes" is defensible (nothing is ever in transit, so there's nothing to leave unencrypted) but "not applicable" is more accurate if that option is present for a zero-collection app.
- **Do you provide a way for users to request data deletion?** — Answer "No" / not applicable — there is no server-side data to delete since nothing is collected. If Play Console requires an account-deletion-request URL regardless, point it at the same privacy policy page (`https://agenticsamir.github.io/RollingDice/`), which explains no data is ever collected in the first place.

## On the permissions this app actually requests
For your own understanding (these don't need individual declaration in the Data Safety form since no data is collected or transmitted from them):
- **VIBRATE** — a "normal" Android permission, not classified as dangerous/sensitive, and not covered by the Data Safety form at all.
- **Motion sensor (accelerometer)**, used by `expo-sensors` for the shake-to-roll gesture (`src/hooks/useShakeGesture.ts`) — read transiently on-device to detect a shake, never written to storage, never transmitted anywhere. Because it's never *collected* in the Play Console sense (collected = stored or transmitted off-device), it does not need to be declared as a collected data type.

**Permission hygiene note (fixed Aug 18, 2026):** `expo-audio` and `expo-sensors`' native Android modules unconditionally declared several permissions our code never actually uses — `RECORD_AUDIO`, `FOREGROUND_SERVICE`, `FOREGROUND_SERVICE_MEDIA_PLAYBACK` (from expo-audio's built-in media-session and recording services, unused since we only play a one-shot sound effect) and `ACTIVITY_RECOGNITION` (from expo-sensors' Pedometer/DeviceMotion sub-modules, unused since we only read the raw Accelerometer). Play Console itself flags `ACTIVITY_RECOGNITION` under the Health apps policy if unused, and foreground-service permissions require a type-by-type justification — so these are now stripped via a manifest-merge override in [`../plugins/withStripUnusedPermissions.js`](../plugins/withStripUnusedPermissions.js), verified against the actual merged Android manifest (`./gradlew :app:processReleaseManifest`), not just assumed from `app.json`.

A few permissions remain present that couldn't be traced to a specific source in the current dependency tree (`INTERNET`, `ACCESS_NETWORK_STATE`, `READ_EXTERNAL_STORAGE`, `WRITE_EXTERNAL_STORAGE`, `SYSTEM_ALERT_WINDOW`) — none of these are flagged by Play Console's own review as requiring a declaration, and none change the "no data collected" answer above, since the app's own code never calls any networking or file-picker API regardless of what's declared in the manifest. If Play Console ever does flag one of these, the fix is the same pattern: add its name to `PERMISSIONS_TO_REMOVE` in `plugins/withStripUnusedPermissions.js` and verify via a fresh `processReleaseManifest` check before rebuilding.

## Bottom line
Answer "No" to data collection up front, answer the two follow-up security questions as above, and this section is done in under a minute.
