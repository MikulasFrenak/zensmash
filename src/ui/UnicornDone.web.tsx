// GameCanvas (which renders this) is an earlier sibling of the 🌿/🎁
// buttons in App.tsx, and CSS z-index only competes within the same
// stacking context — no zIndex here could paint above those buttons on
// web. Portalling to document.body sidesteps the tree position entirely.
import { createPortal } from 'react-dom';

import { UnicornDoneCard, UnicornDoneProps } from './UnicornDoneCard';

export function UnicornDone(props: UnicornDoneProps) {
  return createPortal(<UnicornDoneCard {...props} />, document.body);
}
