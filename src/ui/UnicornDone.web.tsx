// Web entry point: UnicornDone is rendered inside GameCanvas, which is an
// earlier sibling of the 🌿/🎁 buttons in App.tsx. On web, CSS z-index only
// competes within the same stacking context, so no zIndex inside
// GameCanvas's own subtree can paint above those later siblings — they'd
// visually cross the finale card. Portalling straight to document.body
// sidesteps the whole tree position and guarantees it's always on top.
// Native doesn't have this problem (see UnicornDone.tsx), and has no DOM
// to portal into anyway.
import { createPortal } from 'react-dom';

import { UnicornDoneCard, UnicornDoneProps } from './UnicornDoneCard';

export function UnicornDone(props: UnicornDoneProps) {
  return createPortal(<UnicornDoneCard {...props} />, document.body);
}
