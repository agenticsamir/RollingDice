# Content rating questionnaire guide

Play Console → App content → Content rating. Answer via the IARC questionnaire. This app has no violence, sexual content, profanity, controlled substances, or user-generated content, and — importantly — **no gambling mechanics**: it never involves real or simulated currency, wagering, or payouts, so it should not trip the "simulated gambling" flag that some dice/card apps hit.

| Section | Question (paraphrased) | Answer | Why |
|---|---|---|---|
| Violence | Does the app contain violence? | No | No violence of any kind |
| Sexuality | Sexual content or nudity? | No | None |
| Language | Profanity or crude humor? | No | None |
| Controlled substances | References to drugs/alcohol/tobacco? | No | None |
| Gambling | Simulated gambling, or real-money/prize wagering? | No | Rolling Dice has no currency, stakes, betting, or payouts of any kind — it's a plain dice roller, not a casino-style app |
| User-generated content | Does the app let users share content with others? | No | No accounts, no sharing, no multiplayer |
| Personal info sharing | Does the app share the user's location or personal info with other users? | No | No data collection at all (see `data-safety-guide.md`) |
| Digital purchases | In-app purchases? | No | Fully free, no IAP |
| Ads | Does the app show ads? | No | No ad SDKs integrated |

Expected result: **Everyone / PEGI 3** (or equivalent lowest tier) across all rating boards Play Console generates the rating for (ESRB, PEGI, USK, etc. — the questionnaire produces all of them from these same answers).

## Target audience & content
A separate short section in "App content" asks for the target age group:
- **Recommended: "13+" or "Everyone"** — pick "Everyone" unless you want to explicitly exclude a younger audience; there's nothing in the app that requires an age gate.
- If prompted about whether the app appeals to children specifically, answer based on your actual intent — a dice utility isn't inherently a kids' app, so "No, it's not primarily designed for children" is accurate unless you intend otherwise.

## Health apps declaration
A separate "Health apps" item may ask which health features your app uses. **Answer: none of the listed features apply** — Rolling Dice has no health, fitness, or medical functionality of any kind.

## Foreground service / permissions declarations
Play Console's automated scan may separately ask you to justify specific manifest permissions (e.g. `ACTIVITY_RECOGNITION`, foreground service types). As of Aug 18, 2026 these are no longer declared at all — `expo-audio` and `expo-sensors`' native modules were bundling permissions for features this app never uses (media-session audio controls, recording, pedometer/activity recognition), and they're now stripped via a manifest-merge override (see `plugins/withStripUnusedPermissions.js` and the note in `data-safety-guide.md`). If Play Console still shows a declaration prompt for one of these, it means you're looking at an older uploaded build — rebuild with `eas build --profile production` and it should be resolved in the new upload.
