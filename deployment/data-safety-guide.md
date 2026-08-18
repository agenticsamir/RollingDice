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

## Bottom line
Answer "No" to data collection up front, answer the two follow-up security questions as above, and this section is done in under a minute.
