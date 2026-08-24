import { describe, expect, it } from 'vitest'
import {
  factWeight,
  factsForTables,
  makeQuestion,
  masteryLevel,
  selectQuestions,
  weakestFacts,
} from './questions'
import type { FactStat } from './types'
import { factKey } from './types'

const stat = (over: Partial<FactStat> = {}): FactStat => ({
  attempts: 10,
  correct: 10,
  avgMs: 2000,
  lastSeen: Date.now(),
  streak: 5,
  ...over,
})

describe('facts and questions', () => {
  it('builds every fact for the chosen tables', () => {
    expect(factsForTables([3])).toHaveLength(12)
    expect(factsForTables([3, 4])).toHaveLength(24)
  })

  it('builds a multiplication question', () => {
    const q = makeQuestion({ a: 6, b: 7 }, 'multiply')
    expect(q.left).toBe(6)
    expect(q.right).toBe(7)
    expect(q.answer).toBe(42)
  })

  it('builds a division question as the reverse of the fact', () => {
    const q = makeQuestion({ a: 6, b: 7 }, 'divide')
    expect(q.left).toBe(42)
    expect(q.right).toBe(7)
    expect(q.answer).toBe(6)
  })
})

describe('mastery', () => {
  it('classifies levels', () => {
    expect(masteryLevel(undefined)).toBe('unseen')
    expect(masteryLevel(stat({ attempts: 2, correct: 2 }))).toBe('learning')
    expect(masteryLevel(stat({ attempts: 10, correct: 4 }))).toBe('learning')
    expect(masteryLevel(stat())).toBe('mastered')
    expect(masteryLevel(stat({ avgMs: 9000 }))).toBe('solid')
  })

  it('weights struggling facts above mastered ones', () => {
    const now = Date.now()
    const hard = factWeight(stat({ correct: 2, avgMs: 9000 }), now)
    const easy = factWeight(stat(), now)
    expect(hard).toBeGreaterThan(easy)
  })

  it('boosts facts that have not been seen for days', () => {
    const now = Date.now()
    const stale = factWeight(stat({ lastSeen: now - 10 * 86_400_000 }), now)
    expect(stale).toBeGreaterThan(factWeight(stat({ lastSeen: now }), now))
  })
})

describe('selectQuestions', () => {
  it('returns the requested number of questions from the chosen tables', () => {
    const qs = selectQuestions({ tables: [4], count: 20, stats: {} })
    expect(qs).toHaveLength(20)
    expect(qs.every((q) => q.fact.a === 4)).toBe(true)
  })

  it('never repeats the same question twice in a row', () => {
    const qs = selectQuestions({ tables: [2, 3], count: 100, stats: {} })
    for (let i = 1; i < qs.length; i += 1) {
      expect(qs[i].id).not.toBe(qs[i - 1].id)
    }
  })

  it('favours the fact the student keeps missing', () => {
    const stats = {
      [factKey('multiply', 7, 8)]: stat({ attempts: 20, correct: 1, avgMs: 9000 }),
    }
    const qs = selectQuestions({ tables: [7], count: 200, stats })
    const hits = qs.filter((q) => q.fact.b === 8).length
    // One of twelve facts would be ~16 by chance; weighting should beat that.
    expect(hits).toBeGreaterThan(25)
  })

  it('asks division questions only when requested', () => {
    const none = selectQuestions({ tables: [5], count: 50, stats: {} })
    expect(none.every((q) => q.kind === 'multiply')).toBe(true)
    const mixed = selectQuestions({
      tables: [5],
      count: 200,
      stats: {},
      includeDivision: true,
    })
    expect(mixed.some((q) => q.kind === 'divide')).toBe(true)
  })

  it('returns nothing for an empty table selection', () => {
    expect(selectQuestions({ tables: [], count: 10, stats: {} })).toEqual([])
  })
})

describe('weakestFacts', () => {
  it('only considers facts already attempted, hardest first', () => {
    const stats = {
      [factKey('multiply', 6, 7)]: stat({ attempts: 10, correct: 1, avgMs: 9000 }),
      [factKey('multiply', 6, 2)]: stat(),
    }
    const weak = weakestFacts([6], stats, 5)
    expect(weak).toHaveLength(2)
    expect(weak[0]).toEqual({ a: 6, b: 7 })
  })
})
