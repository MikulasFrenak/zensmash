/**
 * Collected surprises (in-memory, like settings — persistence is a follow-up).
 */
import { useSyncExternalStore } from 'react';

export type Collection = ReadonlyMap<string, number>;

let collection = new Map<string, number>();
const listeners = new Set<() => void>();

export const getCollection = (): Collection => collection;

export function addToCollection(emoji: string) {
  collection = new Map(collection);
  collection.set(emoji, (collection.get(emoji) ?? 0) + 1);
  listeners.forEach((l) => l());
}

export function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useCollection(): Collection {
  return useSyncExternalStore(subscribe, getCollection);
}

export function totalCollected(c: Collection): number {
  let n = 0;
  c.forEach((count) => (n += count));
  return n;
}
