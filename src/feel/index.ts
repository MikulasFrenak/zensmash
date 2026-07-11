/**
 * The "juice" API (S4). One call per game event — haptics + sound together,
 * respecting user settings. This is the only feel entry point for game code.
 */
import { getSettings } from '@/state/settings';
import { hapticHit, hapticShatter } from './haptics';
import { playCrack, playHello, playShatter } from './sound';

export function feelHit() {
  const s = getSettings();
  if (s.haptics) hapticHit();
  if (s.sound) playCrack();
}

export function feelShatter() {
  const s = getSettings();
  if (s.haptics) hapticShatter();
  if (s.sound) playShatter();
}

/** A visitor waves hello — cing cing klang 🔔 */
export function feelHello() {
  if (getSettings().sound) playHello();
}
