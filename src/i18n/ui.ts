/** UI strings for the zen menu, treasures and celebration (S7/S8), all locales. */
import { Locale } from './moments';

export interface DoneVariant {
  title: string;
  text: string;
}

export interface UiStrings {
  sessionTitle: string;
  blocksBroken: (n: number) => string;
  nothingYet: string;
  feelLighter: string;
  sound: string;
  haptics: string;
  particles: string;
  keepSmashing: string;
  doneVariants: readonly DoneVariant[];
  doneButton: string;
  collectionTitle: string;
  collectionEmpty: string;
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
    doneVariants: [
      {
        title: 'Cubes are gone, little unicorn! 🦄',
        text: 'Stress flew away, you saved the day 🌈 Now go shine, sunshine! ☀️',
      },
      {
        title: 'Rainbow complete! 🌈',
        text: "Stress called. It's not coming back. Ever. 🦄✨",
      },
      {
        title: 'You did it, magic human! ✨',
        text: 'Somewhere a unicorn is proud of you. This one, actually. 🦄',
      },
      {
        title: 'All smashed, all calm 🌿',
        text: 'Warning: you may now sparkle uncontrollably ✨ Happy as a unicorn eating cake on a rainbow 🦄🍰',
      },
      {
        title: 'Stress has left the chat 👋',
        text: 'Achievement unlocked: inner peace 🏆 Rainbow: 100%. You: priceless. 🌈',
      },
    ],
    doneButton: 'One more rainbow 🌈',
    collectionTitle: 'Your treasures 🎁',
    collectionEmpty: 'Nothing yet — surprises hide inside the cubes!',
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
    doneVariants: [
      {
        title: 'Kocky sú preč, jednorožec! 🦄',
        text: 'Stres je fuč, od dúhy máš kľúč 🌈 Svieť ďalej, slniečko! ☀️',
      },
      {
        title: 'Dúha hotová! 🌈',
        text: 'Stres volal. Už sa nevráti. Nikdy. 🦄✨',
      },
      {
        title: 'Zvládol si to, čarovný človek! ✨',
        text: 'Niekde je na teba hrdý jednorožec. Presne tento. 🦄',
      },
      {
        title: 'Všetko rozbité, všade pokoj 🌿',
        text: 'Pozor: odteraz sa môžeš nekontrolovane trblietať ✨ Šťastný ako jednorožec na dúhe s tortou 🦄🍰',
      },
      {
        title: 'Stres opustil skupinu 👋',
        text: 'Úspech odomknutý: vnútorný pokoj 🏆 Dúha: 100 %. Ty: na nezaplatenie. 🌈',
      },
    ],
    doneButton: 'Ešte jednu dúhu 🌈',
    collectionTitle: 'Tvoje poklady 🎁',
    collectionEmpty: 'Zatiaľ nič — prekvapenia sa skrývajú v kockách!',
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
    doneVariants: [
      {
        title: 'Kostky jsou pryč, jednorožče! 🦄',
        text: 'Stres je fuč, od duhy máš klíč 🌈 Sviť dál, sluníčko! ☀️',
      },
      {
        title: 'Duha hotová! 🌈',
        text: 'Stres volal. Už se nevrátí. Nikdy. 🦄✨',
      },
      {
        title: 'Zvládl jsi to, kouzelný člověče! ✨',
        text: 'Někde je na tebe hrdý jednorožec. Přesně tenhle. 🦄',
      },
      {
        title: 'Všechno rozbité, všude klid 🌿',
        text: 'Pozor: teď se můžeš nekontrolovaně třpytit ✨ Šťastný jako jednorožec s dortem na duze 🦄🍰',
      },
      {
        title: 'Stres opustil skupinu 👋',
        text: 'Úspěch odemčen: vnitřní klid 🏆 Duha: 100 %. Ty: k nezaplacení. 🌈',
      },
    ],
    doneButton: 'Ještě jednu duhu 🌈',
    collectionTitle: 'Tvé poklady 🎁',
    collectionEmpty: 'Zatím nic — překvapení se schovávají v kostkách!',
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
    doneVariants: [
      {
        title: 'A kockák elfogytak, kis unikornis! 🦄',
        text: 'A stressz elszállt, a szivárvány rád várt 🌈 Ragyogj tovább, napsugár! ☀️',
      },
      {
        title: 'Szivárvány kész! 🌈',
        text: 'A stressz hívott. Nem jön vissza. Soha. 🦄✨',
      },
      {
        title: 'Megcsináltad, varázslatos ember! ✨',
        text: 'Valahol büszke rád egy unikornis. Pontosan ez. 🦄',
      },
      {
        title: 'Minden törve, minden csendes 🌿',
        text: 'Figyelem: mostantól kontrollálatlanul csilloghatsz ✨ Boldog, mint egy unikornis tortával a szivárványon 🦄🍰',
      },
      {
        title: 'A stressz kilépett a csoportból 👋',
        text: 'Teljesítmény feloldva: belső béke 🏆 Szivárvány: 100%. Te: megfizethetetlen. 🌈',
      },
    ],
    doneButton: 'Még egy szivárványt 🌈',
    collectionTitle: 'Kincseid 🎁',
    collectionEmpty: 'Még semmi — a meglepetések a kockákban bújnak!',
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
    doneVariants: [
      {
        title: 'Kostki znikły, mały jednorożcu! 🦄',
        text: 'Stres poszedł spać, czas tęczą się stać 🌈 Świeć dalej, słonko! ☀️',
      },
      {
        title: 'Tęcza gotowa! 🌈',
        text: 'Stres dzwonił. Nie wróci. Nigdy. 🦄✨',
      },
      {
        title: 'Dałeś radę, magiczny człowieku! ✨',
        text: 'Gdzieś jest z ciebie dumny jednorożec. Dokładnie ten. 🦄',
      },
      {
        title: 'Wszystko rozbite, wszędzie spokój 🌿',
        text: 'Uwaga: możesz teraz niekontrolowanie błyszczeć ✨ Szczęśliwy jak jednorożec z tortem na tęczy 🦄🍰',
      },
      {
        title: 'Stres opuścił czat 👋',
        text: 'Osiągnięcie odblokowane: wewnętrzny spokój 🏆 Tęcza: 100%. Ty: bezcenny. 🌈',
      },
    ],
    doneButton: 'Jeszcze jedna tęcza 🌈',
    collectionTitle: 'Twoje skarby 🎁',
    collectionEmpty: 'Jeszcze nic — niespodzianki kryją się w kostkach!',
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
    doneVariants: [
      {
        title: 'Würfel weg, kleines Einhorn! 🦄',
        text: 'Der Stress ist fort, die Sonne dein Ort 🌈 Strahl weiter! ☀️',
      },
      {
        title: 'Regenbogen fertig! 🌈',
        text: 'Der Stress hat angerufen. Er kommt nie wieder. 🦄✨',
      },
      {
        title: 'Geschafft, magischer Mensch! ✨',
        text: 'Irgendwo ist ein Einhorn stolz auf dich. Genau dieses. 🦄',
      },
      {
        title: 'Alles zerlegt, alles ruhig 🌿',
        text: 'Achtung: Du funkelst jetzt unkontrolliert ✨ Glücklich wie ein Einhorn mit Kuchen auf dem Regenbogen 🦄🍰',
      },
      {
        title: 'Der Stress hat den Chat verlassen 👋',
        text: 'Erfolg freigeschaltet: innere Ruhe 🏆 Regenbogen: 100 %. Du: unbezahlbar. 🌈',
      },
    ],
    doneButton: 'Noch ein Regenbogen 🌈',
    collectionTitle: 'Deine Schätze 🎁',
    collectionEmpty: 'Noch nichts — Überraschungen verstecken sich in den Würfeln!',
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
    doneVariants: [
      {
        title: 'Les blocs sont partis, petite licorne ! 🦄',
        text: "Le stress s'enfuit, l'arc-en-ciel sourit 🌈 Brille, petit soleil ! ☀️",
      },
      {
        title: 'Arc-en-ciel terminé ! 🌈',
        text: 'Le stress a appelé. Il ne reviendra pas. Jamais. 🦄✨',
      },
      {
        title: 'Bravo, humain magique ! ✨',
        text: 'Quelque part, une licorne est fière de toi. Celle-ci, en fait. 🦄',
      },
      {
        title: 'Tout cassé, tout calme 🌿',
        text: "Attention : tu scintilles maintenant sans contrôle ✨ Heureux comme une licorne mangeant un gâteau sur un arc-en-ciel 🦄🍰",
      },
      {
        title: 'Le stress a quitté le chat 👋',
        text: 'Succès débloqué : paix intérieure 🏆 Arc-en-ciel : 100 %. Toi : inestimable. 🌈',
      },
    ],
    doneButton: 'Encore un arc-en-ciel 🌈',
    collectionTitle: 'Tes trésors 🎁',
    collectionEmpty: 'Rien encore — les surprises se cachent dans les blocs !',
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
    doneVariants: [
      {
        title: '¡Los cubos se fueron, pequeño unicornio! 🦄',
        text: 'El estrés voló, el arcoíris brilló 🌈 ¡Sigue brillando, sol! ☀️',
      },
      {
        title: '¡Arcoíris completo! 🌈',
        text: 'El estrés llamó. No volverá. Nunca. 🦄✨',
      },
      {
        title: '¡Lo lograste, humano mágico! ✨',
        text: 'En algún lugar un unicornio está orgulloso de ti. Este, de hecho. 🦄',
      },
      {
        title: 'Todo roto, todo en calma 🌿',
        text: 'Atención: ahora brillas sin control ✨ Feliz como un unicornio comiendo tarta sobre el arcoíris 🦄🍰',
      },
      {
        title: 'El estrés salió del chat 👋',
        text: 'Logro desbloqueado: paz interior 🏆 Arcoíris: 100%. Tú: invaluable. 🌈',
      },
    ],
    doneButton: 'Otro arcoíris 🌈',
    collectionTitle: 'Tus tesoros 🎁',
    collectionEmpty: '¡Nada aún — las sorpresas se esconden en los cubos!',
  },
};
