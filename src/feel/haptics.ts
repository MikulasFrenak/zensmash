/**
 * The "juice" API (S4). One place for everything that makes a hit feel good.
 * Sound is added here later — callers never change.
 */
import * as Haptics from 'expo-haptics';

export function feelHit() {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
}

export function feelShatter() {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
}
