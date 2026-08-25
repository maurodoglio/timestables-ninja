import { describe, expect, test } from 'vitest'
import { sparringVerdict } from './Sparring'

describe('sparringVerdict', () => {
  test('celebrates only when the previous best is beaten', () => {
    expect(sparringVerdict(27, 26)).toBe('newBest')
    expect(sparringVerdict(1, 0)).toBe('newBest')
  })

  test('reports a tie as a match, not a new best', () => {
    expect(sparringVerdict(26, 26)).toBe('matchedBest')
  })

  test('reports a lower score as a plain landing', () => {
    expect(sparringVerdict(20, 26)).toBe('landed')
  })

  test('never celebrates a scoreless round', () => {
    expect(sparringVerdict(0, 0)).toBe('landed')
    expect(sparringVerdict(0, 26)).toBe('landed')
  })
})
