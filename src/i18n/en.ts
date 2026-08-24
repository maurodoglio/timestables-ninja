export const en = {
  common: {
    appName: 'Times Tables Ninja',
    backToDojo: 'Back to the dojo',
    trainAgain: 'Train again',
    leaveMat: '← Leave the mat',
    settings: 'Dojo settings',
    on: 'On',
    off: 'Off',
    notYet: 'Not yet',
  },

  welcome: {
    title: 'Welcome to the Dojo',
    intro:
      'Every ninja master started as a novice. Train your times tables, pass your gradings, and climb from white belt to Ninja Master.',
    nameLabel: 'What shall the sensei call you?',
    namePlaceholder: 'Your ninja name',
    join: 'Join the dojo',
    privacy: 'Everything stays on this device. No accounts, no data sent anywhere.',
    defaultName: 'Young Ninja',
  },

  dojo: {
    streak: '🔥 {count} day streak',
    points: '⭐ {count} points',
    nextGrading: 'Next grading: {belt}',
    masterTitle: 'You are a Ninja Master',
    nextGradingBody:
      'Master the {tables} times tables, then take the grading to earn your {belt}.',
    masterBody: 'Keep your skills sharp — sparring and weak stances still await.',
    takeGrading: 'Take the {belt} grading',
    trainingHall: 'Training Hall',
    trainingHallDesc: 'Practise any table you have unlocked, at your own pace.',
    weakStances: 'Weak Stances',
    weakStancesDesc: 'Drill the facts you keep missing, starting with {a} × {b}.',
    weakStancesEmpty: 'Train a little first, then the sensei will find your weak spots.',
    sparring: 'Sparring',
    sparringDesc: 'Sixty seconds, as many strikes as you can. Best: {best}.',
    progressScroll: 'Progress Scroll',
    progressScrollDesc: 'See your mastery grid, history and earned scrolls.',
    senseiQuote: '“{tip}” — Sensei',
  },

  drill: {
    questionOf: 'Question {current} of {total}',
    secondsLeft: '⏱ {seconds}s left',
    correct: 'Clean strike!',
    wrongTeach: 'Not yet — {left} {symbol} {right} = {answer}. Remember it.',
    wrongQuick: 'Keep your stance. Next!',
    submit: 'Strike!',
    deleteDigit: 'Delete last digit',
    submitAnswer: 'Submit answer',
  },

  result: {
    strikesLanded: 'Strikes landed',
    averageSpeed: 'Average speed',
    trainingPoints: 'Training points',
    stancesToPractise: 'Stances to practise',
    trainingComplete: 'Training complete',
    stancesStrengthened: 'Stances strengthened',
  },

  training: {
    title: '🏯 Training Hall',
    intro: 'Choose your tables and train at your own pace. Nothing here affects your belt.',
    tables: 'Tables',
    selectAll: 'Select all unlocked',
    clear: 'Clear',
    howMany: 'How many questions?',
    gentleTimer: 'Use a gentle timer (10 seconds per question)',
    begin: 'Begin training',
    lockedHint: 'Earn a higher belt to unlock this table',
    tableTitle: '{n} times table',
  },

  grading: {
    title: '🥋 Grading: {belt}',
    questions: 'Questions',
    perQuestion: 'Per question',
    toPass: 'To pass',
    averageNeeded: 'Average needed',
    tablesCovered: 'Tables covered: {tables}',
    withDivision: ' — including division facts.',
    retakeNote:
      'You can retake a grading as many times as you like, and you never lose a belt you have earned. Your current rank is {belt}.',
    begin: 'Bow and begin',
    passedTitle: 'You earned the {belt}!',
    failedTitle: 'Sensei says: train more',
    ceremony: 'Bow to your sensei. You now wear the {belt}.',
    needAccuracy: 'You need at least 90% correct. ',
    needSpeed: 'Your accuracy was excellent, but you must average under {seconds}s per answer. ',
    failedAdvice: 'Head to Weak Stances and drill the facts below — the belt will come.',
    goToWeak: 'Drill my weak stances',
    noneLeftTitle: '🏆 No grading left',
    noneLeftBody: 'You already hold the highest rank in the dojo. Keep sparring to stay sharp.',
  },

  weak: {
    title: '🎯 Weak Stances',
    intro:
      'These are the facts you miss most or answer slowest. Untimed, with the answer shown whenever you slip — repetition is the technique here.',
    drill: 'Drill {count} repetitions',
    emptyBody: 'The sensei has not seen you fight yet. Train first, then come back.',
    goTraining: 'Go to the Training Hall',
  },

  sparringScreen: {
    title: '⚡ Sparring',
    intro:
      'Sixty seconds. Land as many clean strikes as you can across your unlocked tables ({tables}). No penalties, just speed.',
    roundLength: 'Round length',
    personalBest: 'Personal best',
    start: 'Start the round',
    newBest: 'New personal best: {score}!',
    landed: 'You landed {score} strikes',
    best: 'Personal best: {best}',
  },

  progress: {
    title: '📜 Progress Scroll',
    trainingPoints: 'Training points',
    dayStreak: 'Day streak',
    factsMastered: 'Facts mastered',
    sparringBest: 'Sparring best',
    masteryGrid: 'Mastery grid',
    masteryLegend:
      'Orange = learning, blue = solid, green = mastered. Locked tables unlock as you earn belts.',
    masteryCaption: 'Mastery of every multiplication fact from 1 to 12',
    beltPath: 'Belt path',
    scrolls: 'Scrolls',
    recentSessions: 'Recent sessions',
    noHistory: 'No training recorded yet.',
    locked: 'locked',
    historyLine: '{date} — {mode}: {correct}/{total} correct, {avg}s average, +{xp} points',
    passedSuffix: ' — passed!',
    failedSuffix: ' — not yet',
  },

  settings: {
    title: '⚙️ Dojo settings',
    language: 'Language',
    showTimer: 'Show the timer bar',
    showTimerHint:
      'Turn this off if counting down feels stressful. Timing still counts during gradings.',
    sound: 'Sound effects',
    reducedMotion: 'Reduce motion',
    reducedMotionHint: 'Removes animations across the app.',
    readableFont: 'Easier-to-read font',
    scrollTitle: 'Your ninja scroll',
    scrollBody:
      'Progress lives only on this device. Save a scroll file to move to another device, or to keep a backup.',
    save: 'Save my scroll',
    restore: 'Restore a scroll',
    restored: 'Scroll restored. Welcome back.',
    restoreFailed: 'That scroll could not be read.',
    notAScroll: 'That scroll is not a ninja profile.',
    resetTitle: 'Start over',
    resetBody: 'This erases every belt, point and scroll. It cannot be undone.',
    reset: 'Erase my progress',
    resetConfirm: 'Leave the dojo and erase all progress?',
  },

  modes: {
    training: 'Training',
    grading: 'Grading',
    sparring: 'Sparring',
    weak: 'Weak stances',
  },

  belts: {
    white: 'White Belt',
    yellow: 'Yellow Belt',
    orange: 'Orange Belt',
    green: 'Green Belt',
    blue: 'Blue Belt',
    purple: 'Purple Belt',
    brown: 'Brown Belt',
    red: 'Red Belt',
    black: 'Black Belt',
    master: 'Ninja Master',
  },

  senseiTips: {
    white: 'Every master began by counting in twos. Start slow, stay calm.',
    yellow: 'Fives always land on 0 or 5. Listen for the rhythm.',
    orange: 'Threes hide inside sixes and nines. Learn them well.',
    green: 'Four is double-double. Double once, then double again.',
    blue: 'Six is double three. Your old training still serves you.',
    purple: 'Eight is double four, which is double double two.',
    brown: 'Sevens are the toughest stance. Repetition defeats them.',
    red: 'The digits of every nine-fact add up to nine. A secret technique.',
    black: 'Twelve is ten plus two. Split the fact, then add.',
    master: 'Now you must undo what you know: division is multiplication reversed.',
  },

  errorScreen: {
    title: 'Your scroll is damaged',
    body:
      'Something went wrong and the dojo could not open. Reloading may help. If it keeps happening, you can erase your progress and start over.',
    reload: 'Try again',
    reset: 'Erase my progress',
    resetConfirm: 'Leave the dojo and erase all progress?',
  },

  achievements: {
    scrollEarned: 'Scroll earned: {name}',
    firstSteps: 'First Steps',
    firstStepsDesc: 'Finish your first training session.',
    perfectKata: 'Perfect Kata',
    perfectKataDesc: 'Answer every question in a session correctly.',
    dawnTrainer: 'Dawn Trainer',
    dawnTrainerDesc: 'Train seven days in a row.',
    swiftHands: 'Swift Hands',
    swiftHandsDesc: 'Average under three seconds per answer in a session.',
    beltCollector: 'Belt Collector',
    beltCollectorDesc: 'Earn the green belt.',
    sparringStar: 'Sparring Star',
    sparringStarDesc: 'Score 30 or more in a sparring run.',
    factHunter: 'Fact Hunter',
    factHunterDesc: 'Master 50 different facts.',
    grandmaster: 'Grandmaster',
    grandmasterDesc: 'Reach the rank of Ninja Master.',
  },
} as const

/**
 * Shape every locale must satisfy. A missing or misnamed key in another
 * language becomes a TypeScript error rather than a runtime "undefined".
 */
export type Translations = {
  [Section in keyof typeof en]: Record<keyof (typeof en)[Section], string>
}
