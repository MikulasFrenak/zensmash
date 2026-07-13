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
    sessionTitle: 'Your zen break 🌿',
    blocksBroken: (n) => `${n} cubes turned into confetti 🎉`,
    nothingYet: 'All cubes still alive. For now. 😏',
    feelLighter: 'Lighter already, right?',
    sound: 'Sound 🔊',
    haptics: 'Haptics 📳',
    particles: 'Effects ✨',
    keepSmashing: 'Back to smashing! 💥',
    doneVariants: [
      {
        title: 'Cubes are gone, little unicorn! 🦄',
        text: 'Stress flew away, you saved the day 🌈 Now go shine, sunshine! ☀️',
      },
      {
        title: 'Rainbow complete! 🌈',
        text: "Stress isn't coming back. It didn't even say goodbye. 👋✨",
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
        text: 'Officially calmer than a cat in a sunbeam. 😌☀️',
      },
    ],
    doneButton: "Let's blow off more steam! 💨",
    collectionTitle: 'Your treasure chest 🎁',
    collectionEmpty: 'Empty… for now. The cubes are hiding goodies! 👀',
  },
  sk: {
    sessionTitle: 'Tvoja zen pauza 🌿',
    blocksBroken: (n) => `${n} kociek sa premenilo na konfety 🎉`,
    nothingYet: 'Všetky kocky zatiaľ žijú. Zatiaľ. 😏',
    feelLighter: 'Už je ti ľahšie, však?',
    sound: 'Zvuk 🔊',
    haptics: 'Vibrácie 📳',
    particles: 'Efekty ✨',
    keepSmashing: 'Späť k rozbíjaniu! 💥',
    doneVariants: [
      {
        title: 'Kocky sú preč, jednorožec! 🦄',
        text: 'Stres je fuč, od dúhy máš kľúč 🌈 Svieť ďalej, slniečko! ☀️',
      },
      {
        title: 'Dúha je hotová! 🌈',
        text: 'Stres sa už nevráti. Ani sa nerozlúčil. 👋✨',
      },
      {
        title: 'Dokázal si to, kúzelník! ✨',
        text: 'Niekde je na teba hrdý jednorožec. Presne tento. 🦄',
      },
      {
        title: 'Všetko rozbité, všade pokoj 🌿',
        text: 'Program dňa: úsmev, pohoda, bodka. A ako dezert ešte jedna bodka. 😄',
      },
      {
        title: 'Stres opustil skupinu 👋',
        text: 'Si oficiálne pokojnejší ako mačka na slnku. 😌☀️',
      },
    ],
    doneButton: 'Poďme vypustiť paru! 💨',
    collectionTitle: 'Tvoja truhlica pokladov 🎁',
    collectionEmpty: 'Zatiaľ prázdna… kocky v sebe skrývajú prekvapenia! 👀',
  },
  cs: {
    sessionTitle: 'Tvá zen pauza 🌿',
    blocksBroken: (n) => `${n} kostek se proměnilo v konfety 🎉`,
    nothingYet: 'Všechny kostky zatím žijí. Zatím. 😏',
    feelLighter: 'Už je ti líp, viď?',
    sound: 'Zvuk 🔊',
    haptics: 'Vibrace 📳',
    particles: 'Efekty ✨',
    keepSmashing: 'Zpátky k rozbíjení! 💥',
    doneVariants: [
      {
        title: 'Kostky jsou pryč, jednorožče! 🦄',
        text: 'Stres je fuč, od duhy máš klíč 🌈 Sviť dál, sluníčko! ☀️',
      },
      {
        title: 'Duha je hotová! 🌈',
        text: 'Stres se už nevrátí. Ani se nerozloučil. 👋✨',
      },
      {
        title: 'Zvládl jsi to, kouzelníku! ✨',
        text: 'Někde je na tebe hrdý jednorožec. Přesně tenhle. 🦄',
      },
      {
        title: 'Všechno rozbité, všude klid 🌿',
        text: 'Program dne: úsměv, pohoda, tečka. A jako dezert ještě jedna tečka. 😄',
      },
      {
        title: 'Stres opustil skupinu 👋',
        text: 'Jsi oficiálně klidnější než kočka na sluníčku. 😌☀️',
      },
    ],
    doneButton: 'Jdeme upustit páru! 💨',
    collectionTitle: 'Tvá truhla pokladů 🎁',
    collectionEmpty: 'Zatím prázdná… kostky v sobě schovávají překvapení! 👀',
  },
  hu: {
    sessionTitle: 'A zen szüneted 🌿',
    blocksBroken: (n) => `${n} kocka lett konfetti 🎉`,
    nothingYet: 'Még minden kocka él. Egyelőre. 😏',
    feelLighter: 'Ugye, már könnyebb?',
    sound: 'Hang 🔊',
    haptics: 'Rezgés 📳',
    particles: 'Effektek ✨',
    keepSmashing: 'Vissza törni! 💥',
    doneVariants: [
      {
        title: 'A kockák elfogytak, kis unikornis! 🦄',
        text: 'A stressz elszállt, a szivárvány rád várt 🌈 Ragyogj tovább, napsugár! ☀️',
      },
      {
        title: 'Szivárvány kész! 🌈',
        text: 'A stressz nem jön vissza. El se köszönt. 👋✨',
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
        text: 'Hivatalosan nyugodtabb vagy, mint egy macska a napon. 😌☀️',
      },
    ],
    doneButton: 'Engedjük ki a gőzt! 💨',
    collectionTitle: 'A kincsesládád 🎁',
    collectionEmpty: 'Még üres… a kockák meglepetéseket rejtenek! 👀',
  },
  pl: {
    sessionTitle: 'Twoja zen przerwa 🌿',
    blocksBroken: (n) => `${n} kostek zmieniło się w konfetti 🎉`,
    nothingYet: 'Wszystkie kostki jeszcze żyją. Na razie. 😏',
    feelLighter: 'Już lżej, prawda?',
    sound: 'Dźwięk 🔊',
    haptics: 'Wibracje 📳',
    particles: 'Efekty ✨',
    keepSmashing: 'Wracamy do rozbijania! 💥',
    doneVariants: [
      {
        title: 'Kostki znikły, mały jednorożcu! 🦄',
        text: 'Stres poszedł spać, czas tęczą się stać 🌈 Świeć dalej, słonko! ☀️',
      },
      {
        title: 'Tęcza gotowa! 🌈',
        text: 'Stres już nie wróci. Nawet się nie pożegnał. 👋✨',
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
        text: 'Oficjalnie spokojniejszy niż kot na słońcu. 😌☀️',
      },
    ],
    doneButton: 'Wypuśćmy parę! 💨',
    collectionTitle: 'Twoja skrzynia skarbów 🎁',
    collectionEmpty: 'Na razie pusta… kostki skrywają niespodzianki! 👀',
  },
  de: {
    sessionTitle: 'Deine Zen-Pause 🌿',
    blocksBroken: (n) => `${n} Würfel wurden zu Konfetti 🎉`,
    nothingYet: 'Alle Würfel leben noch. Noch. 😏',
    feelLighter: 'Schon leichter, oder?',
    sound: 'Ton 🔊',
    haptics: 'Vibration 📳',
    particles: 'Effekte ✨',
    keepSmashing: 'Zurück zum Zertrümmern! 💥',
    doneVariants: [
      {
        title: 'Würfel weg, kleines Einhorn! 🦄',
        text: 'Der Stress ist fort, die Sonne dein Ort 🌈 Strahl weiter! ☀️',
      },
      {
        title: 'Regenbogen fertig! 🌈',
        text: 'Der Stress kommt nie wieder. Er hat sich nicht mal verabschiedet. 👋✨',
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
        text: 'Offiziell entspannter als eine Katze in der Sonne. 😌☀️',
      },
    ],
    doneButton: 'Lass noch mehr Dampf ab! 💨',
    collectionTitle: 'Deine Schatzkiste 🎁',
    collectionEmpty: 'Noch leer … die Würfel verstecken Überraschungen! 👀',
  },
  fr: {
    sessionTitle: 'Ta pause zen 🌿',
    blocksBroken: (n) => `${n} blocs transformés en confettis 🎉`,
    nothingYet: "Tous les blocs sont encore en vie. Pour l'instant. 😏",
    feelLighter: 'Déjà plus léger, non ?',
    sound: 'Son 🔊',
    haptics: 'Vibrations 📳',
    particles: 'Effets ✨',
    keepSmashing: 'Retour au cassage ! 💥',
    doneVariants: [
      {
        title: 'Les blocs sont partis, petite licorne ! 🦄',
        text: "Le stress s'enfuit, l'arc-en-ciel sourit 🌈 Brille, petit soleil ! ☀️",
      },
      {
        title: 'Arc-en-ciel terminé ! 🌈',
        text: "Le stress ne reviendra pas. Il n'a même pas dit au revoir. 👋✨",
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
        text: "Officiellement plus zen qu'un chat au soleil. 😌☀️",
      },
    ],
    doneButton: 'On va se défouler ! 💨',
    collectionTitle: 'Ton coffre aux trésors 🎁',
    collectionEmpty: 'Encore vide… les blocs cachent des surprises ! 👀',
  },
  es: {
    sessionTitle: 'Tu pausa zen 🌿',
    blocksBroken: (n) => `${n} cubos convertidos en confeti 🎉`,
    nothingYet: 'Todos los cubos siguen vivos. Por ahora. 😏',
    feelLighter: '¿Más ligero ya, verdad?',
    sound: 'Sonido 🔊',
    haptics: 'Vibración 📳',
    particles: 'Efectos ✨',
    keepSmashing: '¡A seguir rompiendo! 💥',
    doneVariants: [
      {
        title: '¡Los cubos se fueron, pequeño unicornio! 🦄',
        text: 'El estrés voló, el arcoíris brilló 🌈 ¡Sigue brillando, sol! ☀️',
      },
      {
        title: '¡Arcoíris completo! 🌈',
        text: 'El estrés no volverá. Ni siquiera se despidió. 👋✨',
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
        text: 'Oficialmente más tranquilo que un gato al sol. 😌☀️',
      },
    ],
    doneButton: '¡A soltar vapor! 💨',
    collectionTitle: 'Tu cofre del tesoro 🎁',
    collectionEmpty: 'Vacío… por ahora. ¡Los cubos esconden sorpresas! 👀',
  },
};
