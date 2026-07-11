/**
 * S8: tiny in-memory settings store (no deps). Persistence comes later
 * with AsyncStorage — see .tasks note.
 */
import { useSyncExternalStore } from 'react';

export interface Settings {
  sound: boolean;
  haptics: boolean;
  particles: boolean;
}

let settings: Settings = { sound: true, haptics: true, particles: true };
const listeners = new Set<() => void>();

export const getSettings = (): Settings => settings;

export function setSetting<K extends keyof Settings>(key: K, value: Settings[K]) {
  settings = { ...settings, [key]: value };
  listeners.forEach((l) => l());
}

export function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useSettings(): Settings {
  return useSyncExternalStore(subscribe, getSettings);
}
