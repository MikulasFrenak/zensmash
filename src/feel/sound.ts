/** Raw sound playback (S4). Use via feel/index.ts, never directly. */
import { createAudioPlayer, type AudioPlayer } from 'expo-audio';

let crack: AudioPlayer | null = null;
let shatter: AudioPlayer | null = null;

function ensure() {
  if (!crack) {
    crack = createAudioPlayer(require('../../assets/sounds/crack.wav'));
    crack.volume = 0.5;
  }
  if (!shatter) {
    shatter = createAudioPlayer(require('../../assets/sounds/shatter.wav'));
    shatter.volume = 0.6;
  }
}

export function playCrack() {
  try {
    ensure();
    crack!.seekTo(0);
    crack!.play();
  } catch {}
}

export function playShatter() {
  try {
    ensure();
    shatter!.seekTo(0);
    shatter!.play();
  } catch {}
}
