/** Raw sound playback (S4). Use via feel/index.ts, never directly. */
import { createAudioPlayer, type AudioPlayer } from 'expo-audio';

let crack: AudioPlayer | null = null;
let shatters: AudioPlayer[] = [];
let hello: AudioPlayer | null = null;
let prize: AudioPlayer | null = null;
let bloom: AudioPlayer | null = null;

function ensure() {
  if (!crack) {
    crack = createAudioPlayer(require('../../assets/sounds/crack.wav'));
    crack.volume = 0.5;
  }
  if (shatters.length === 0) {
    shatters = [
      createAudioPlayer(require('../../assets/sounds/shatter1.wav')),
      createAudioPlayer(require('../../assets/sounds/shatter2.wav')),
      createAudioPlayer(require('../../assets/sounds/shatter3.wav')),
      createAudioPlayer(require('../../assets/sounds/shatter4.wav')),
      createAudioPlayer(require('../../assets/sounds/shatter5.wav')),
      createAudioPlayer(require('../../assets/sounds/shatter6.wav')),
    ];
    shatters.forEach((p) => (p.volume = 0.6));
  }
  if (!hello) {
    hello = createAudioPlayer(require('../../assets/sounds/hello.wav'));
    hello.volume = 0.55;
  }
  if (!prize) {
    prize = createAudioPlayer(require('../../assets/sounds/prize.wav'));
    prize.volume = 0.65;
  }
  if (!bloom) {
    bloom = createAudioPlayer(require('../../assets/sounds/bloom.wav'));
    bloom.volume = 0.7;
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
    // a different little melody every time — fun stays fresh
    const p = shatters[Math.floor(Math.random() * shatters.length)];
    p.seekTo(0);
    p.play();
  } catch {}
}

export function playHello() {
  try {
    ensure();
    hello!.seekTo(0);
    hello!.play();
  } catch {}
}

export function playPrize() {
  try {
    ensure();
    prize!.seekTo(0);
    prize!.play();
  } catch {}
}

export function playBloom() {
  try {
    ensure();
    bloom!.seekTo(0);
    bloom!.play();
  } catch {}
}
