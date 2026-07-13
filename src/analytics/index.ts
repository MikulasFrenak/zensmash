/**
 * Opt-in, anonymous session analytics — POSTs to the zensmash Worker's
 * /api/track route (worker/index.ts), which writes to Cloudflare Analytics
 * Engine. No PII, no per-tap events, no cookies. Respects settings.analytics
 * (off by default) and never fires in dev, so local testing doesn't pollute
 * real counts.
 */
import { Platform } from 'react-native';

import { getSettings } from '@/state/settings';

// same-origin on web (works both standalone and iframed into review-spa);
// native has no origin of its own, so it always needs the absolute URL.
const TRACK_URL =
  Platform.OS === 'web' ? '/api/track' : 'https://zensmash.mikulas-frenak.workers.dev/api/track';

type TrackPayload = Record<string, string | number | boolean | undefined>;

function send(event: string, payload: TrackPayload) {
  if (__DEV__) return;
  if (!getSettings().analytics) return;

  fetch(TRACK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ event, platform: Platform.OS, ...payload }),
    ...(Platform.OS === 'web' ? { keepalive: true } : {}),
  }).catch(() => {
    // analytics must never affect gameplay
  });
}

export function trackSessionStart(locale: string) {
  send('session_start', { locale });
}

export function trackSessionComplete(params: {
  locale: string;
  durationMs: number;
  totalTaps: number;
  focusedHits: number;
  prizesFound: number;
  flowerSpecies: string;
}) {
  send('session_complete', params);
}

export function trackSettingChanged(setting: string, value: boolean) {
  send('settings_changed', { setting, value });
}
