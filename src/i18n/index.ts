import type { Language } from '../game/types'
import { en, type Translations } from './en'
import { it } from './it'

export type { Language }

export const LANGUAGES: { id: Language; label: string }[] = [
  { id: 'en', label: 'English' },
  { id: 'it', label: 'Italiano' },
]

const CATALOGUES: Record<Language, Translations> = {
  en: en as unknown as Translations,
  it,
}

export type { Translations }

export function isLanguage(value: unknown): value is Language {
  return value === 'en' || value === 'it'
}

/** Best guess at the reader's language from the browser, defaulting to English. */
export function detectLanguage(): Language {
  if (typeof navigator === 'undefined') return 'en'
  const tags = navigator.languages?.length ? navigator.languages : [navigator.language]
  for (const tag of tags) {
    if (tag?.toLowerCase().startsWith('it')) return 'it'
    if (tag?.toLowerCase().startsWith('en')) return 'en'
  }
  return 'en'
}

export function getCatalogue(language: Language): Translations {
  return CATALOGUES[language] ?? CATALOGUES.en
}

export type Section = keyof Translations
export type Key<S extends Section> = keyof Translations[S]

/** Fill `{placeholder}` tokens in a translated string. */
export function interpolate(
  template: string,
  params?: Record<string, string | number>,
): string {
  if (!params) return template
  return template.replace(/\{(\w+)\}/g, (match, name: string) =>
    name in params ? String(params[name]) : match,
  )
}

export function translate<S extends Section>(
  language: Language,
  section: S,
  key: Key<S>,
  params?: Record<string, string | number>,
): string {
  const catalogue = getCatalogue(language)
  const fallback = (en as unknown as Translations)[section][key]
  const template = (catalogue[section][key] ?? fallback) as string
  return interpolate(template, params)
}

/** Symbols and separators that differ between locales. */
export function formatters(language: Language) {
  return {
    /** Italian primary schools write division with a colon. */
    divideSymbol: language === 'it' ? ':' : '÷',
    multiplySymbol: '×',
    number: (value: number, digits = 0): string =>
      value.toLocaleString(language === 'it' ? 'it-IT' : 'en-GB', {
        minimumFractionDigits: digits,
        maximumFractionDigits: digits,
      }),
    date: (at: number): string =>
      new Date(at).toLocaleDateString(language === 'it' ? 'it-IT' : 'en-GB', {
        day: 'numeric',
        month: 'short',
      }),
    /** "1, 2 and 10" / "1, 2 e 10" */
    list: (items: (string | number)[]): string => {
      const parts = items.map(String)
      if (parts.length <= 1) return parts.join('')
      const conjunction = language === 'it' ? 'e' : 'and'
      return `${parts.slice(0, -1).join(', ')} ${conjunction} ${parts[parts.length - 1]}`
    },
  }
}
