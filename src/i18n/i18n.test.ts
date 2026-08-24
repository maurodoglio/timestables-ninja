import { describe, expect, it as test } from 'vitest'
import { en } from './en'
import { it } from './it'
import { detectLanguage, formatters, interpolate, translate } from './index'

const sections = Object.keys(en) as (keyof typeof en)[]

const tokens = (value: string): string[] =>
  (value.match(/\{(\w+)\}/g) ?? []).sort()

describe('translation catalogues', () => {
  test('every locale has the same sections', () => {
    expect(Object.keys(it).sort()).toEqual([...sections].sort())
  })

  test('every locale has the same keys in each section', () => {
    for (const section of sections) {
      const enKeys = Object.keys(en[section]).sort()
      const itKeys = Object.keys(it[section]).sort()
      expect(itKeys, `section ${section}`).toEqual(enKeys)
    }
  })

  test('placeholders match between locales', () => {
    for (const section of sections) {
      for (const key of Object.keys(en[section])) {
        const source = (en[section] as Record<string, string>)[key]
        const target = (it[section] as Record<string, string>)[key]
        expect(tokens(target), `${section}.${key}`).toEqual(tokens(source))
      }
    }
  })

  test('no translated string is empty', () => {
    for (const section of sections) {
      for (const [key, value] of Object.entries(it[section])) {
        expect(value.trim().length, `${section}.${key}`).toBeGreaterThan(0)
      }
    }
  })

  test('every belt and sensei tip is translated', () => {
    const beltIds = Object.keys(en.belts)
    expect(Object.keys(en.senseiTips).sort()).toEqual([...beltIds].sort())
    expect(Object.keys(it.belts).sort()).toEqual([...beltIds].sort())
  })
})

describe('interpolate', () => {
  test('replaces named placeholders', () => {
    expect(interpolate('Question {current} of {total}', { current: 2, total: 10 })).toBe(
      'Question 2 of 10',
    )
  })

  test('leaves unknown placeholders untouched', () => {
    expect(interpolate('Hello {who}', {})).toBe('Hello {who}')
  })
})

describe('translate', () => {
  test('returns the requested locale', () => {
    expect(translate('it', 'belts', 'white')).toBe('Cintura Bianca')
    expect(translate('en', 'belts', 'white')).toBe('White Belt')
  })

  test('interpolates parameters', () => {
    expect(translate('it', 'dojo', 'points', { count: 42 })).toContain('42')
  })

  test('falls back to English for an unknown language', () => {
    expect(translate('de' as 'en', 'belts', 'black')).toBe('Black Belt')
  })
})

describe('formatters', () => {
  test('Italian uses a colon for division', () => {
    expect(formatters('it').divideSymbol).toBe(':')
    expect(formatters('en').divideSymbol).toBe('÷')
  })

  test('Italian uses a comma as the decimal separator', () => {
    expect(formatters('it').number(3.5, 1)).toBe('3,5')
    expect(formatters('en').number(3.5, 1)).toBe('3.5')
  })

  test('lists are joined with the right conjunction', () => {
    expect(formatters('en').list([1, 2, 10])).toBe('1, 2 and 10')
    expect(formatters('it').list([1, 2, 10])).toBe('1, 2 e 10')
    expect(formatters('it').list([7])).toBe('7')
  })
})

describe('detectLanguage', () => {
  test('defaults to English without a navigator', () => {
    expect(detectLanguage()).toBe('en')
  })
})
