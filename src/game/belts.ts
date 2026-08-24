import type { Belt, BeltId } from './types'

/** Number of questions in a grading test. */
export const GRADING_LENGTH = 25
/** Fraction of questions that must be correct to pass a grading. */
export const GRADING_PASS_RATIO = 0.9
/** Length of a sparring speed run, in seconds. */
export const SPARRING_SECONDS = 60
/** Facts are practised against multipliers 1..12. */
export const MULTIPLIERS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]

interface BeltSeed {
  id: BeltId
  name: string
  newTables: number[]
  color: string
  ink: string
  secondsPerQuestion: number
  targetAverageSeconds: number
  includeDivision?: boolean
  senseiTip: string
}

const SEEDS: BeltSeed[] = [
  {
    id: 'white',
    name: 'White Belt',
    newTables: [1, 2, 10],
    color: '#f4f4f2',
    ink: '#1b2233',
    secondsPerQuestion: 10,
    targetAverageSeconds: 8,
    senseiTip: 'Every master began by counting in twos. Start slow, stay calm.',
  },
  {
    id: 'yellow',
    name: 'Yellow Belt',
    newTables: [5],
    color: '#ffd83d',
    ink: '#1b2233',
    secondsPerQuestion: 9,
    targetAverageSeconds: 7,
    senseiTip: 'Fives always land on 0 or 5. Listen for the rhythm.',
  },
  {
    id: 'orange',
    name: 'Orange Belt',
    newTables: [3],
    color: '#ff9636',
    ink: '#1b2233',
    secondsPerQuestion: 9,
    targetAverageSeconds: 7,
    senseiTip: 'Threes hide inside sixes and nines. Learn them well.',
  },
  {
    id: 'green',
    name: 'Green Belt',
    newTables: [4],
    color: '#3fbf6f',
    ink: '#0d2318',
    secondsPerQuestion: 8,
    targetAverageSeconds: 6.5,
    senseiTip: 'Four is double-double. Double once, then double again.',
  },
  {
    id: 'blue',
    name: 'Blue Belt',
    newTables: [6],
    color: '#3d8bff',
    ink: '#f4f8ff',
    secondsPerQuestion: 8,
    targetAverageSeconds: 6,
    senseiTip: 'Six is double three. Your old training still serves you.',
  },
  {
    id: 'purple',
    name: 'Purple Belt',
    newTables: [8],
    color: '#8d5cf6',
    ink: '#f6f2ff',
    secondsPerQuestion: 7,
    targetAverageSeconds: 5.5,
    senseiTip: 'Eight is double four, which is double double two.',
  },
  {
    id: 'brown',
    name: 'Brown Belt',
    newTables: [7],
    color: '#8a5a33',
    ink: '#fdf3ea',
    secondsPerQuestion: 7,
    targetAverageSeconds: 5.5,
    senseiTip: 'Sevens are the toughest stance. Repetition defeats them.',
  },
  {
    id: 'red',
    name: 'Red Belt',
    newTables: [9],
    color: '#e2453c',
    ink: '#fff0ef',
    secondsPerQuestion: 6,
    targetAverageSeconds: 5,
    senseiTip: 'The digits of every nine-fact add up to nine. A secret technique.',
  },
  {
    id: 'black',
    name: 'Black Belt',
    newTables: [11, 12],
    color: '#20242f',
    ink: '#f2f4fb',
    secondsPerQuestion: 6,
    targetAverageSeconds: 4.5,
    senseiTip: 'Twelve is ten plus two. Split the fact, then add.',
  },
  {
    id: 'master',
    name: 'Ninja Master',
    newTables: [],
    color: '#d4af37',
    ink: '#2a2005',
    secondsPerQuestion: 5,
    targetAverageSeconds: 4,
    includeDivision: true,
    senseiTip: 'Now you must undo what you know: division is multiplication reversed.',
  },
]

function buildBelts(): Belt[] {
  const seen: number[] = []
  return SEEDS.map((seed) => {
    for (const t of seed.newTables) if (!seen.includes(t)) seen.push(t)
    return {
      ...seed,
      includeDivision: seed.includeDivision ?? false,
      cumulativeTables: [...seen].sort((a, b) => a - b),
    }
  })
}

export const BELTS: Belt[] = buildBelts()

export const BELT_ORDER: BeltId[] = BELTS.map((b) => b.id)

export function getBelt(id: BeltId): Belt {
  const belt = BELTS.find((b) => b.id === id)
  if (!belt) throw new Error(`Unknown belt: ${id}`)
  return belt
}

export function beltIndex(id: BeltId): number {
  return BELT_ORDER.indexOf(id)
}

/** The belt a student is currently training towards, or null once a master. */
export function nextBelt(current: BeltId): Belt | null {
  const i = beltIndex(current)
  return i >= 0 && i < BELTS.length - 1 ? BELTS[i + 1] : null
}

/** Tables the student has already earned the right to practise. */
export function unlockedTables(current: BeltId): number[] {
  return getBelt(current).cumulativeTables
}

/**
 * Tables a grading covers: everything already earned plus the new belt's tables,
 * so earlier facts keep resurfacing.
 */
export function gradingTables(target: BeltId): number[] {
  const belt = getBelt(target)
  return belt.id === 'master' ? MULTIPLIERS : belt.cumulativeTables
}

export function isMaster(id: BeltId): boolean {
  return id === 'master'
}
