import { describe, expect, it } from 'vitest'
import { GRADING_LENGTH } from './belts'
import {
  applyAnswers,
  evaluateGrading,
  nextStreak,
  toDayKey,
  updateStat,
  xpForAnswer,
  type Answer,
} from './scoring'
import { makeQuestion } from './questions'

const answer = (correct: boolean, ms = 2000): Answer => ({
  question: makeQuestion({ a: 3, b: 4 }, 'multiply'),
  given: correct ? 12 : 11,
  correct,
  ms,
})

const gradingAnswers = (correct: number, ms: number): Answer[] =>
  Array.from({ length: GRADING_LENGTH }, (_, i) => answer(i < correct, ms))

describe('updateStat', () => {
  it('tracks attempts, accuracy and a rolling average time', () => {
    const first = updateStat(undefined, answer(true, 4000), 1000)
    expect(first).toMatchObject({ attempts: 1, correct: 1, avgMs: 4000, streak: 1 })
    const second = updateStat(first, answer(true, 2000), 2000)
    expect(second.avgMs).toBe(3000)
    expect(second.streak).toBe(2)
  })

  it('resets the streak on a wrong answer', () => {
    const s = updateStat(updateStat(undefined, answer(true)), answer(false))
    expect(s.streak).toBe(0)
    expect(s.correct).toBe(1)
    expect(s.attempts).toBe(2)
  })
})

describe('applyAnswers', () => {
  it('does not mutate the incoming stats', () => {
    const stats = {}
    const next = applyAnswers(stats, [answer(true)])
    expect(stats).toEqual({})
    expect(Object.keys(next)).toHaveLength(1)
  })
})

describe('xp', () => {
  it('rewards correct and fast answers most, but never punishes trying', () => {
    expect(xpForAnswer(answer(false), 'training')).toBe(1)
    const fast = xpForAnswer(answer(true, 500), 'training')
    const slow = xpForAnswer(answer(true, 8000), 'training')
    expect(fast).toBeGreaterThan(slow)
    expect(slow).toBeGreaterThanOrEqual(10)
  })

  it('pays more for a grading than for practice', () => {
    expect(xpForAnswer(answer(true, 2000), 'grading')).toBeGreaterThan(
      xpForAnswer(answer(true, 2000), 'training'),
    )
  })
})

describe('evaluateGrading', () => {
  it('passes on high accuracy and good speed', () => {
    const out = evaluateGrading(gradingAnswers(25, 3000), 'yellow')
    expect(out.passed).toBe(true)
    expect(out.accuracy).toBe(1)
  })

  it('fails when accuracy is below ninety percent', () => {
    const out = evaluateGrading(gradingAnswers(20, 2000), 'yellow')
    expect(out.passed).toBe(false)
    expect(out.accuracyMet).toBe(false)
    expect(out.missed).toHaveLength(5)
  })

  it('fails when answers are accurate but too slow', () => {
    const out = evaluateGrading(gradingAnswers(25, 20000), 'yellow')
    expect(out.passed).toBe(false)
    expect(out.accuracyMet).toBe(true)
    expect(out.speedMet).toBe(false)
  })

  it('fails a short test even if every answer was right', () => {
    expect(evaluateGrading([answer(true)], 'yellow').passed).toBe(false)
  })
})

describe('streaks', () => {
  it('starts, holds, grows and resets', () => {
    expect(nextStreak(0, null, '2026-03-10')).toBe(1)
    expect(nextStreak(4, '2026-03-10', '2026-03-10')).toBe(4)
    expect(nextStreak(4, '2026-03-09', '2026-03-10')).toBe(5)
    expect(nextStreak(4, '2026-03-01', '2026-03-10')).toBe(1)
  })

  it('grows across a month boundary', () => {
    expect(nextStreak(3, '2026-02-28', '2026-03-01')).toBe(4)
  })

  it('formats day keys with padding', () => {
    expect(toDayKey(new Date(2026, 0, 5))).toBe('2026-01-05')
  })
})
