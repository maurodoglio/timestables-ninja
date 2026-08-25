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
  newTables: number[]
  color: string
  ink: string
  secondsPerQuestion: number
  targetAverageSeconds: number
  includeDivision?: boolean
}

const SEEDS: BeltSeed[] = [
  {
    id: 'white',
    newTables: [1, 2, 10],
    color: '#f4f4f2',
    ink: '#1b2233',
    secondsPerQuestion: 10,
    targetAverageSeconds: 8,
  },
  {
    id: 'yellow',
    newTables: [5],
    color: '#ffd83d',
    ink: '#1b2233',
    secondsPerQuestion: 9,
    targetAverageSeconds: 7,
  },
  {
    id: 'orange',
    newTables: [3],
    color: '#ff9636',
    ink: '#1b2233',
    secondsPerQuestion: 9,
    targetAverageSeconds: 7,
  },
  {
    id: 'green',
    newTables: [4],
    color: '#3fbf6f',
    ink: '#0d2318',
    secondsPerQuestion: 8,
    targetAverageSeconds: 6.5,
  },
  {
    id: 'blue',
    newTables: [6],
    color: '#3d8bff',
    ink: '#f4f8ff',
    secondsPerQuestion: 8,
    targetAverageSeconds: 6,
  },
  {
    id: 'purple',
    newTables: [8],
    color: '#8d5cf6',
    ink: '#f6f2ff',
    secondsPerQuestion: 7,
    targetAverageSeconds: 5.5,
  },
  {
    id: 'brown',
    newTables: [7],
    color: '#8a5a33',
    ink: '#fdf3ea',
    secondsPerQuestion: 7,
    targetAverageSeconds: 5.5,
  },
  {
    id: 'red',
    newTables: [9],
    color: '#e2453c',
    ink: '#fff0ef',
    secondsPerQuestion: 6,
    targetAverageSeconds: 5,
  },
  {
    id: 'black',
    newTables: [11, 12],
    color: '#20242f',
    ink: '#f2f4fb',
    secondsPerQuestion: 6,
    targetAverageSeconds: 4.5,
  },
  {
    id: 'master',
    newTables: [],
    color: '#d4af37',
    ink: '#2a2005',
    secondsPerQuestion: 5,
    targetAverageSeconds: 4,
    includeDivision: true,
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

/** Whether a stored value names a belt on the ladder. */
export function isBeltId(value: unknown): value is BeltId {
  return typeof value === 'string' && BELT_ORDER.includes(value as BeltId)
}

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
