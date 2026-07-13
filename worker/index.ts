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

export default {
  async fetch(request, env): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname === '/api/track') return handleTrack(request, env);
    return env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<Env>;
