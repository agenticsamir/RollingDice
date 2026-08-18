const { withAndroidManifest } = require('expo/config-plugins');

// These are declared unconditionally by native modules we depend on
// (expo-audio, expo-sensors) even though our app never exercises the
// underlying features (background/media-session audio, recording,
// pedometer/activity recognition). We only play a one-shot sound effect
// and read the raw Accelerometer for shake detection, so none of this
// is needed — Play Console's own review flags ACTIVITY_RECOGNITION
// specifically as something to remove if unused.
const PERMISSIONS_TO_REMOVE = [
  'android.permission.RECORD_AUDIO',
  'android.permission.FOREGROUND_SERVICE',
  'android.permission.FOREGROUND_SERVICE_MEDIA_PLAYBACK',
  'android.permission.ACTIVITY_RECOGNITION',
];

const SERVICES_TO_REMOVE = [
  'expo.modules.audio.service.AudioControlsService',
  'expo.modules.audio.service.AudioRecordingService',
];

function withStripUnusedPermissions(config) {
  return withAndroidManifest(config, (config) => {
    const manifest = config.modResults.manifest;
    manifest.$['xmlns:tools'] = 'http://schemas.android.com/tools';

    if (!Array.isArray(manifest['uses-permission'])) {
      manifest['uses-permission'] = [];
    }
    for (const name of PERMISSIONS_TO_REMOVE) {
      manifest['uses-permission'] = manifest['uses-permission'].filter(
        (entry) => entry.$['android:name'] !== name
      );
      manifest['uses-permission'].push({
        $: { 'android:name': name, 'tools:node': 'remove' },
      });
    }

    const app = manifest.application && manifest.application[0];
    if (app) {
      if (!Array.isArray(app.service)) {
        app.service = [];
      }
      for (const name of SERVICES_TO_REMOVE) {
        app.service = app.service.filter((entry) => entry.$['android:name'] !== name);
        app.service.push({
          $: { 'android:name': name, 'tools:node': 'remove' },
        });
      }
    }

    return config;
  });
}

module.exports = withStripUnusedPermissions;
