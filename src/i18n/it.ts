import type { Translations } from './en'

export const it: Translations = {
  common: {
    appName: 'Tabelline Ninja',
    backToDojo: 'Torna al dojo',
    trainAgain: 'Allenati ancora',
    leaveMat: '← Esci dal tatami',
    settings: 'Impostazioni del dojo',
    on: 'Sì',
    off: 'No',
    notYet: 'Non ancora',
  },

  welcome: {
    title: 'Benvenuto nel Dojo',
    intro:
      'Ogni maestro ninja è stato un principiante. Allenati con le tabelline, supera gli esami e passa dalla cintura bianca a Maestro Ninja.',
    nameLabel: 'Come ti chiamerà il maestro?',
    namePlaceholder: 'Il tuo nome ninja',
    join: 'Entra nel dojo',
    privacy:
      'Tutto resta su questo dispositivo. Nessun account, nessun dato inviato altrove.',
    defaultName: 'Giovane Ninja',
  },

  dojo: {
    streak: '🔥 {count} giorni di fila',
    points: '⭐ {count} punti',
    nextGrading: 'Prossimo esame: {belt}',
    masterTitle: 'Sei un Maestro Ninja',
    nextGradingBody:
      'Impara bene le tabelline del {tables}, poi affronta l’esame per conquistare la {belt}.',
    masterBody:
      'Tieni allenate le tue tecniche: il combattimento e le posizioni deboli ti aspettano.',
    takeGrading: 'Affronta l’esame per la {belt}',
    trainingHall: 'Sala di Allenamento',
    trainingHallDesc: 'Allenati con le tabelline che hai sbloccato, al tuo ritmo.',
    weakStances: 'Posizioni Deboli',
    weakStancesDesc: 'Allenati sui calcoli che sbagli più spesso, a partire da {a} × {b}.',
    weakStancesEmpty:
      'Allenati un po’ prima: poi il maestro scoprirà i tuoi punti deboli.',
    sparring: 'Combattimento',
    sparringDesc: 'Sessanta secondi, quanti colpi riesci a mettere a segno. Record: {best}.',
    progressScroll: 'Pergamena dei Progressi',
    progressScrollDesc: 'Guarda la tua griglia, lo storico e le pergamene conquistate.',
    senseiQuote: '«{tip}» — Maestro',
  },

  drill: {
    questionOf: 'Domanda {current} di {total}',
    secondsLeft: '⏱ {seconds}s rimasti',
    correct: 'Colpo perfetto!',
    wrongTeach: 'Non ancora — {left} {symbol} {right} = {answer}. Ricordalo.',
    wrongQuick: 'Mantieni la posizione. Avanti!',
    submit: 'Colpisci!',
    deleteDigit: 'Cancella l’ultima cifra',
    submitAnswer: 'Conferma la risposta',
  },

  result: {
    strikesLanded: 'Colpi a segno',
    averageSpeed: 'Velocità media',
    trainingPoints: 'Punti allenamento',
    stancesToPractise: 'Posizioni da allenare',
    trainingComplete: 'Allenamento completato',
    stancesStrengthened: 'Posizioni rafforzate',
  },

  training: {
    title: '🏯 Sala di Allenamento',
    intro:
      'Scegli le tue tabelline e allenati al tuo ritmo. Qui nulla influisce sulla tua cintura.',
    tables: 'Tabelline',
    selectAll: 'Seleziona tutte le sbloccate',
    clear: 'Deseleziona',
    howMany: 'Quante domande?',
    gentleTimer: 'Usa un timer tranquillo (10 secondi per domanda)',
    begin: 'Inizia l’allenamento',
    lockedHint: 'Conquista una cintura superiore per sbloccare questa tabellina',
    tableTitle: 'Tabellina del {n}',
  },

  grading: {
    title: '🥋 Esame: {belt}',
    questions: 'Domande',
    perQuestion: 'Per domanda',
    toPass: 'Per superarlo',
    averageNeeded: 'Media richiesta',
    tablesCovered: 'Tabelline dell’esame: {tables}',
    withDivision: ' — comprese le divisioni.',
    retakeNote:
      'Puoi ripetere l’esame tutte le volte che vuoi e non perderai mai una cintura già conquistata. Il tuo grado attuale è {belt}.',
    begin: 'Fai l’inchino e inizia',
    passedTitle: 'Hai conquistato la {belt}!',
    failedTitle: 'Il maestro dice: allenati ancora',
    ceremony: 'Fai l’inchino al maestro. Ora indossi la {belt}.',
    needAccuracy: 'Devi rispondere correttamente ad almeno il 90%. ',
    needSpeed:
      'La tua precisione è ottima, ma devi stare sotto una media di {seconds}s per risposta. ',
    failedAdvice:
      'Vai alle Posizioni Deboli e allenati sui calcoli qui sotto: la cintura arriverà.',
    goToWeak: 'Allena le mie posizioni deboli',
    noneLeftTitle: '🏆 Nessun esame rimasto',
    noneLeftBody:
      'Hai già il grado più alto del dojo. Continua a combattere per restare in forma.',
  },

  weak: {
    title: '🎯 Posizioni Deboli',
    intro:
      'Questi sono i calcoli che sbagli più spesso o che risolvi più lentamente. Senza timer e con la risposta mostrata quando sbagli: qui la tecnica è la ripetizione.',
    drill: 'Allenati con {count} ripetizioni',
    emptyBody:
      'Il maestro non ti ha ancora visto combattere. Allenati prima, poi torna qui.',
    goTraining: 'Vai alla Sala di Allenamento',
  },

  sparringScreen: {
    title: '⚡ Combattimento',
    intro:
      'Sessanta secondi. Metti a segno più colpi che puoi sulle tabelline sbloccate ({tables}). Nessuna penalità, solo velocità.',
    roundLength: 'Durata del round',
    personalBest: 'Record personale',
    start: 'Inizia il round',
    newBest: 'Nuovo record personale: {score}!',
    matchedBest: 'Hai eguagliato il tuo record: {score}',
    landed: 'Hai messo a segno {score} colpi',
    best: 'Record personale: {best}',
  },

  progress: {
    title: '📜 Pergamena dei Progressi',
    trainingPoints: 'Punti allenamento',
    dayStreak: 'Giorni di fila',
    factsMastered: 'Calcoli padroneggiati',
    sparringBest: 'Record combattimento',
    masteryGrid: 'Griglia di padronanza',
    masteryLegend:
      'Arancione = in apprendimento, blu = sicuro, verde = padroneggiato. Le tabelline bloccate si sbloccano conquistando le cinture.',
    masteryCaption: 'Padronanza di tutte le moltiplicazioni da 1 a 12',
    beltPath: 'Percorso delle cinture',
    scrolls: 'Pergamene',
    recentSessions: 'Allenamenti recenti',
    noHistory: 'Nessun allenamento registrato.',
    locked: 'bloccata',
    historyLine:
      '{date} — {mode}: {correct}/{total} corrette, media {avg}s, +{xp} punti',
    passedSuffix: ' — superato!',
    failedSuffix: ' — non ancora',
  },

  settings: {
    title: '⚙️ Impostazioni del dojo',
    language: 'Lingua',
    showTimer: 'Mostra la barra del tempo',
    showTimerHint:
      'Disattivala se il conto alla rovescia ti mette ansia. Durante gli esami il tempo conta comunque.',
    sound: 'Effetti sonori',
    reducedMotion: 'Riduci le animazioni',
    reducedMotionHint: 'Elimina le animazioni in tutta l’app.',
    readableFont: 'Carattere più leggibile',
    scrollTitle: 'La tua pergamena ninja',
    scrollBody:
      'I progressi restano solo su questo dispositivo. Salva la pergamena per passare a un altro dispositivo o per farne una copia.',
    save: 'Salva la mia pergamena',
    restore: 'Ripristina una pergamena',
    restored: 'Pergamena ripristinata. Bentornato!',
    restoreFailed: 'Non è stato possibile leggere questa pergamena.',
    notAScroll: 'Questa pergamena non è un profilo ninja.',
    resetTitle: 'Ricomincia da capo',
    resetBody:
      'Questo cancella tutte le cinture, i punti e le pergamene. Non si può annullare.',
    reset: 'Cancella i miei progressi',
    resetConfirm: 'Vuoi lasciare il dojo e cancellare tutti i progressi?',
  },

  modes: {
    training: 'Allenamento',
    grading: 'Esame',
    sparring: 'Combattimento',
    weak: 'Posizioni deboli',
  },

  belts: {
    white: 'Cintura Bianca',
    yellow: 'Cintura Gialla',
    orange: 'Cintura Arancione',
    green: 'Cintura Verde',
    blue: 'Cintura Blu',
    purple: 'Cintura Viola',
    brown: 'Cintura Marrone',
    red: 'Cintura Rossa',
    black: 'Cintura Nera',
    master: 'Maestro Ninja',
  },

  senseiTips: {
    white: 'Ogni maestro ha iniziato contando a due a due. Vai piano e resta calmo.',
    yellow: 'I risultati del cinque finiscono sempre per 0 o 5. Ascolta il ritmo.',
    orange: 'Il tre si nasconde dentro il sei e il nove. Imparalo bene.',
    green: 'Il quattro è il doppio del doppio. Raddoppia una volta, poi ancora.',
    blue: 'Il sei è il doppio del tre. Il vecchio allenamento ti serve ancora.',
    purple: 'L’otto è il doppio del quattro, che è il doppio del doppio di due.',
    brown: 'Il sette è la posizione più difficile. La ripetizione lo sconfigge.',
    red: 'Le cifre di ogni risultato del nove sommate danno nove. Una tecnica segreta.',
    black: 'Il dodici è dieci più due. Dividi il calcolo, poi somma.',
    master: 'Ora devi disfare ciò che sai: la divisione è la moltiplicazione al contrario.',
  },

  achievements: {
    scrollEarned: 'Pergamena conquistata: {name}',
    firstSteps: 'Primi Passi',
    firstStepsDesc: 'Completa il tuo primo allenamento.',
    perfectKata: 'Kata Perfetto',
    perfectKataDesc: 'Rispondi correttamente a tutte le domande di un allenamento.',
    dawnTrainer: 'Allievo dell’Alba',
    dawnTrainerDesc: 'Allenati per sette giorni di fila.',
    swiftHands: 'Mani Veloci',
    swiftHandsDesc: 'Ottieni una media sotto i tre secondi per risposta.',
    beltCollector: 'Collezionista di Cinture',
    beltCollectorDesc: 'Conquista la cintura verde.',
    sparringStar: 'Stella del Combattimento',
    sparringStarDesc: 'Totalizza 30 o più colpi in un combattimento.',
    factHunter: 'Cacciatore di Calcoli',
    factHunterDesc: 'Padroneggia 50 calcoli diversi.',
    grandmaster: 'Gran Maestro',
    grandmasterDesc: 'Raggiungi il grado di Maestro Ninja.',
  },
}
