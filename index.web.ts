import { registerRootComponent } from 'expo';
// Skia on web needs CanvasKit (WASM) loaded before the app renders.
// This file only ever enters the web bundle (Metro's .web extension
// resolution) — native builds use index.ts and never see this import,
// which is what keeps canvaskit-wasm's Node "fs" require out of their graph.
import { LoadSkiaWeb } from '@shopify/react-native-skia/lib/module/web';

LoadSkiaWeb({
  locateFile: (file: string) =>
    `https://cdn.jsdelivr.net/npm/canvaskit-wasm@0.39.1/bin/full/${file}`,
}).then(() => {
  const App = require('./App').default;
  registerRootComponent(App);
});
