/**
 * zensmash's Worker: serves the static web build for everything, and
 * handles POST /api/track itself for opt-in, anonymous session analytics
 * (see src/analytics/index.ts for the client side). Isolated tsconfig
 * (worker/tsconfig.json) — this runs in the Workers runtime, not RN/DOM.
 */

export interface Env {
  ASSETS: Fetcher;
  ANALYTICS: AnalyticsEngineDataset;
}

const TRACKED_EVENTS = new Set(['session_start', 'session_complete', 'settings_changed']);

interface TrackPayload {
  event: string;
  platform?: string;
  locale?: string;
  flowerSpecies?: string;
  durationMs?: number;
  totalTaps?: number;
  focusedHits?: number;
  prizesFound?: number;
  setting?: string;
  value?: boolean;
}

function isTrackPayload(body: unknown): body is TrackPayload {
  return typeof body === 'object' && body !== null && typeof (body as TrackPayload).event === 'string';
}

async function handleTrack(request: Request, env: Env): Promise<Response> {
  if (request.method !== 'POST') return new Response('method not allowed', { status: 405 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return new Response('bad request', { status: 400 });
  }
  if (!isTrackPayload(body) || !TRACKED_EVENTS.has(body.event)) {
    return new Response('bad request', { status: 400 });
  }

  // fixed blob/double slots so the dataset stays easy to query later
  env.ANALYTICS.writeDataPoint({
    indexes: [body.event],
    blobs: [body.event, body.platform ?? '', body.locale ?? '', body.flowerSpecies ?? body.setting ?? '', String(body.value ?? '')],
    doubles: [body.durationMs ?? 0, body.totalTaps ?? 0, body.focusedHits ?? 0, body.prizesFound ?? 0],
  });

  return new Response(null, { status: 204 });
}

/** Privacy policy, served at /privacy — the public URL both app stores require. */
const PRIVACY_HTML = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>ZenSmash — Privacy Policy</title>
<style>
  body { font-family: -apple-system, system-ui, sans-serif; background: #F6FBF7; color: #2E4B3C;
         max-width: 680px; margin: 0 auto; padding: 32px 20px 64px; line-height: 1.6; }
  h1 { font-size: 28px; } h2 { font-size: 20px; margin-top: 32px; }
  .updated { color: #7BA08C; font-size: 14px; }
  strong { color: #1F6D4C; }
  li { margin-bottom: 10px; }
  a { color: #1F6D4C; }
</style>
</head>
<body>
<h1>ZenSmash — Privacy Policy 🌱</h1>
<p class="updated">Last updated: July 13, 2026</p>
<p>ZenSmash is a stress-relief game made by Mikulas Frenak.</p>
<h2>The short version</h2>
<p><strong>By default, ZenSmash collects no data.</strong> If you turn on “Usage data” in the 🌿 menu,
it sends a few anonymous numbers (like session length and taps) — never anything that identifies you.</p>
<h2>The full version</h2>
<ul>
<li><strong>No accounts.</strong> There is nothing to sign up for, ever.</li>
<li><strong>No third-party services.</strong> No advertising SDKs, no third-party trackers, no data
brokers. No cross-app or cross-site tracking of any kind.</li>
<li><strong>Local settings only.</strong> Your preferences (sound, haptics, particles, language,
analytics) and collected in-game treasures are stored only on your device and never leave it.
Deleting the app deletes them.</li>
<li><strong>Optional, anonymous usage analytics — off by default.</strong> ZenSmash has one settings
toggle, “Usage data 📊”, that is <strong>off unless you turn it on</strong>. When it's on, the app
sends three kinds of anonymous event to a service we operate (Cloudflare Analytics Engine): a session
starting, a session finishing (with session length, taps, and how many rewards you found), and a
settings toggle changing. These events carry no name, account, device ID, advertising ID, or
IP-derived identifier — nothing in the data lets us link an event back to a specific person or
device, or to any other event from the same person. Turning the toggle off stops all future events
immediately.</li>
<li><strong>No internet access required to play.</strong> The game itself runs entirely on-device.
Only the optional analytics toggle causes any network request.</li>
<li><strong>Children.</strong> With analytics off (the default), the app collects nothing and is
compliant with COPPA/GDPR-K by design. With analytics on, only anonymous, non-identifying, aggregate
gameplay counters are sent — no personal data is ever collected regardless of the toggle.</li>
</ul>
<h2>Contact</h2>
<p>Questions? Email <a href="mailto:mikulas.frenak@gmail.com">mikulas.frenak@gmail.com</a>.</p>
</body>
</html>`;

export default {
  async fetch(request, env): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname === '/api/track') return handleTrack(request, env);
    if (url.pathname === '/privacy') {
      return new Response(PRIVACY_HTML, {
        headers: { 'content-type': 'text/html; charset=utf-8' },
      });
    }
    return env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<Env>;
