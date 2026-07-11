/** UI strings for the zen menu (S7/S8), all supported locales. */
import { Locale } from './moments';

export interface UiStrings {
  sessionTitle: string;
  blocksBroken: (n: number) => string;
  nothingYet: string;
  feelLighter: string;
  sound: string;
  haptics: string;
  particles: string;
  keepSmashing: string;
  doneTitle: string;
  doneText: string;
  doneButton: string;
}

export const UI: Record<Locale, UiStrings> = {
  en: {
    sessionTitle: 'Your session 🌿',
    blocksBroken: (n) => `Blocks broken: ${n} 🌈`,
    nothingYet: 'Nothing yet — go gently.',
    feelLighter: 'Feel a bit lighter?',
    sound: 'Sound',
    haptics: 'Haptics',
    particles: 'Particles',
    keepSmashing: 'Keep smashing',
    doneTitle: 'Stress is gone 🌈',
    doneText: "You did it — you're a little unicorn 🦄",
    doneButton: 'Begin again',
  },
  sk: {
    sessionTitle: 'Tvoje sedenie 🌿',
    blocksBroken: (n) => `Rozbité bloky: ${n} 🌈`,
    nothingYet: 'Zatiaľ nič — len pokojne.',
    feelLighter: 'Cítiš sa ľahšie?',
    sound: 'Zvuk',
    haptics: 'Vibrácie',
    particles: 'Častice',
    keepSmashing: 'Rozbíjaj ďalej',
    doneTitle: 'Stres je preč 🌈',
    doneText: 'Dokázal si to — si malý jednorožec 🦄',
    doneButton: 'Začať odznova',
  },
  cs: {
    sessionTitle: 'Tvé sezení 🌿',
    blocksBroken: (n) => `Rozbité bloky: ${n} 🌈`,
    nothingYet: 'Zatím nic — jen klidně.',
    feelLighter: 'Cítíš se lehčeji?',
    sound: 'Zvuk',
    haptics: 'Vibrace',
    particles: 'Částice',
    keepSmashing: 'Rozbíjej dál',
    doneTitle: 'Stres je pryč 🌈',
    doneText: 'Dokázal jsi to — jsi malý jednorožec 🦄',
    doneButton: 'Začít znovu',
  },
  hu: {
    sessionTitle: 'A te meneted 🌿',
    blocksBroken: (n) => `Törött kockák: ${n} 🌈`,
    nothingYet: 'Még semmi — csak nyugodtan.',
    feelLighter: 'Könnyebbnek érzed magad?',
    sound: 'Hang',
    haptics: 'Rezgés',
    particles: 'Részecskék',
    keepSmashing: 'Törj tovább',
    doneTitle: 'A stressz elszállt 🌈',
    doneText: 'Megcsináltad — kis unikornis vagy 🦄',
    doneButton: 'Újrakezdés',
  },
  pl: {
    sessionTitle: 'Twoja sesja 🌿',
    blocksBroken: (n) => `Rozbite bloki: ${n} 🌈`,
    nothingYet: 'Jeszcze nic — spokojnie.',
    feelLighter: 'Czujesz się lżej?',
    sound: 'Dźwięk',
    haptics: 'Wibracje',
    particles: 'Cząsteczki',
    keepSmashing: 'Rozbijaj dalej',
    doneTitle: 'Stres zniknął 🌈',
    doneText: 'Udało ci się — jesteś małym jednorożcem 🦄',
    doneButton: 'Zacznij od nowa',
  },
  de: {
    sessionTitle: 'Deine Session 🌿',
    blocksBroken: (n) => `Zerbrochene Blöcke: ${n} 🌈`,
    nothingYet: 'Noch nichts — ganz ruhig.',
    feelLighter: 'Fühlst du dich leichter?',
    sound: 'Ton',
    haptics: 'Vibration',
    particles: 'Partikel',
    keepSmashing: 'Weiter zertrümmern',
    doneTitle: 'Der Stress ist weg 🌈',
    doneText: 'Geschafft — du bist ein kleines Einhorn 🦄',
    doneButton: 'Von vorn beginnen',
  },
  fr: {
    sessionTitle: 'Ta séance 🌿',
    blocksBroken: (n) => `Blocs brisés : ${n} 🌈`,
    nothingYet: 'Rien encore — tout doux.',
    feelLighter: 'Tu te sens plus léger ?',
    sound: 'Son',
    haptics: 'Vibrations',
    particles: 'Particules',
    keepSmashing: 'Continue à casser',
    doneTitle: 'Le stress est parti 🌈',
    doneText: 'Bravo — tu es une petite licorne 🦄',
    doneButton: 'Recommencer',
  },
  es: {
    sessionTitle: 'Tu sesión 🌿',
    blocksBroken: (n) => `Bloques rotos: ${n} 🌈`,
    nothingYet: 'Nada aún — con calma.',
    feelLighter: '¿Te sientes más ligero?',
    sound: 'Sonido',
    haptics: 'Vibración',
    particles: 'Partículas',
    keepSmashing: 'Sigue rompiendo',
    doneTitle: 'El estrés se fue 🌈',
    doneText: 'Lo lograste — eres un pequeño unicornio 🦄',
    doneButton: 'Empezar de nuevo',
  },
};
