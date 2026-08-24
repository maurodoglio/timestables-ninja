import { useMemo } from 'react'
import { useProfile } from '../state/ProfileContext'
import {
  detectLanguage,
  formatters,
  translate,
  type Key,
  type Language,
  type Section,
} from './index'

export interface Translator {
  language: Language
  t: <S extends Section>(
    section: S,
    key: Key<S>,
    params?: Record<string, string | number>,
  ) => string
  fmt: ReturnType<typeof formatters>
}

/**
 * Reads the language from the active profile, falling back to the browser's
 * preference before a profile exists (the welcome screen).
 */
export function useT(): Translator {
  const { profile } = useProfile()
  const language = profile?.settings.language ?? detectLanguage()

  return useMemo(
    () => ({
      language,
      t: (section, key, params) => translate(language, section, key, params),
      fmt: formatters(language),
    }),
    [language],
  )
}
