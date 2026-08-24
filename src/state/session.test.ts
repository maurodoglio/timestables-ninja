import { describe, expect, it } from 'vitest'
import { GRADING_LENGTH } from '../game/belts'
import { makeQuestion } from '../game/questions'
import type { Answer } from '../game/scoring'
import { recordSession } from './session'
import { createProfile } from './storage'

const answer = (correct: boolean, ms = 2000): Answer => ({
  question: makeQuestion({ a: 3, b: 4 }, 'multiply'),
  given: correct ? 12 : 11,
  correct,
  ms,
})

const full = (correct: number): Answer[] =>
  Array.from({ length: GRADING_LENGTH }, (_, i) => answer(i < correct))

describe('recordSession', () => {
  it('promotes on a passed grading', () => {
    const p = createProfile('Kai')
    const out = recordSession(p, { mode: 'grading', answers: full(25), passed: true })
    expect(out.promotedTo).toBe('yellow')
    expect(out.profile.belt).toBe('yellow')
  })

  it('does not promote on a failed grading and never demotes', () => {
    const p = { ...createProfile('Kai'), belt: 'green' as const }
    const out = recordSession(p, { mode: 'grading', answers: full(10), passed: false })
    expect(out.promotedTo).toBeNull()
    expect(out.profile.belt).toBe('green')
  })

  it('does not promote from practice, however good', () => {
    const p = createProfile('Kai')
    const out = recordSession(p, { mode: 'training', answers: full(25) })
    expect(out.profile.belt).toBe('white')
  })

  it('leaves the original profile untouched', () => {
    const p = createProfile('Kai')
    recordSession(p, { mode: 'training', answers: full(25) })
    expect(p.xp).toBe(0)
    expect(p.history).toHaveLength(0)
  })

  it('accumulates xp, stats and history', () => {
    const p = createProfile('Kai')
    const out = recordSession(p, { mode: 'training', answers: [answer(true), answer(false)] })
    expect(out.profile.xp).toBeGreaterThan(0)
    expect(out.profile.history).toHaveLength(1)
    expect(out.profile.facts['multiply:3x4'].attempts).toBe(2)
  })

  it('only raises the sparring best', () => {
    const p = { ...createProfile('Kai'), sparringBest: 30 }
    const out = recordSession(p, { mode: 'sparring', answers: [answer(true)], sparringScore: 12 })
    expect(out.profile.sparringBest).toBe(30)
    const better = recordSession(p, {
      mode: 'sparring',
      answers: [answer(true)],
      sparringScore: 44,
    })
    expect(better.profile.sparringBest).toBe(44)
  })

  it('awards achievements once', () => {
    const p = createProfile('Kai')
    const first = recordSession(p, { mode: 'training', answers: full(25) })
    expect(first.unlockedAchievements).toContain('first-steps')
    const second = recordSession(first.profile, { mode: 'training', answers: full(25) })
    expect(second.unlockedAchievements).not.toContain('first-steps')
    expect(second.profile.achievements.filter((a) => a === 'first-steps')).toHaveLength(1)
  })

  it('caps stored history', () => {
    let p = createProfile('Kai')
    for (let i = 0; i < 60; i += 1) {
      p = recordSession(p, { mode: 'training', answers: [answer(true)] }).profile
    }
    expect(p.history.length).toBeLessThanOrEqual(50)
  })
})
