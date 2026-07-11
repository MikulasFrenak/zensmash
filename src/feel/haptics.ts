/** Raw haptic impacts. Use via feel/index.ts, never directly. */
import * as Haptics from 'expo-haptics';

export function hapticHit() {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
}

export function hapticShatter() {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
}
