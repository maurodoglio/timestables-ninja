import { describe, expect, it } from 'vitest'
import { BELTS, gradingTables, nextBelt, unlockedTables } from './belts'

describe('belts', () => {
  it('accumulates tables across the ladder', () => {
    expect(unlockedTables('white')).toEqual([1, 2, 10])
    expect(unlockedTables('yellow')).toEqual([1, 2, 5, 10])
    expect(unlockedTables('green')).toEqual([1, 2, 3, 4, 5, 10])
  })

  it('covers all twelve tables by black belt', () => {
    expect(unlockedTables('black')).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])
  })

  it('walks the ladder in order and ends at master', () => {
    expect(nextBelt('white')?.id).toBe('yellow')
    expect(nextBelt('black')?.id).toBe('master')
    expect(nextBelt('master')).toBeNull()
  })

  it('introduces every table exactly once', () => {
    const introduced = BELTS.flatMap((b) => b.newTables)
    expect(new Set(introduced).size).toBe(introduced.length)
    expect(introduced.sort((a, b) => a - b)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])
  })

  it('grades a belt on its own tables plus everything earned before', () => {
    expect(gradingTables('orange')).toEqual([1, 2, 3, 5, 10])
    expect(gradingTables('master')).toHaveLength(12)
  })

  it('tightens the time limit as belts get harder', () => {
    for (let i = 1; i < BELTS.length; i += 1) {
      expect(BELTS[i].secondsPerQuestion).toBeLessThanOrEqual(BELTS[i - 1].secondsPerQuestion)
      expect(BELTS[i].targetAverageSeconds).toBeLessThanOrEqual(BELTS[i - 1].targetAverageSeconds)
    }
  })
})
