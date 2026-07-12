import { registerRootComponent } from 'expo';
// Skia on web needs CanvasKit (WASM) loaded before the app renders.
// This file only ever enters the web bundle (Metro's .web extension
// resolution) — native builds use index.ts and never see this import,
// which is what keeps canvaskit-wasm's Node "fs" require out of their graph.
import { LoadSkiaWeb } from '@shopify/react-native-skia/lib/module/web';

LoadSkiaWeb({
  // Serve the .wasm from same-origin public/ (copied verbatim into dist/ on
  // export) instead of a CDN pinned to a canvaskit-wasm version that doesn't
  // match the JS glue code bundled from node_modules — a version mismatch
  // there breaks every CanvasKit call at runtime (e.g. "Cannot read
  // properties of undefined (reading 'PictureRecorder')").
  locateFile: (file: string) => `/${file}`,
}).then(() => {
  const App = require('./App').default;
  registerRootComponent(App);
});
