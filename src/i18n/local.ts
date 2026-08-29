import type { Language } from '@timestables-ninja/core'

/**
 * Strings for UI that ships in this app ahead of the shared `core` package's
 * translation catalogues (avatar picker + display-name editing in Settings).
 * Once `@timestables-ninja/core` grows matching `settings.*` keys, these can
 * move there and this file can be removed.
 */
export const localStrings = {
  en: {
    nameTitle: 'Display name',
    nameLabel: 'What shall the sensei call you?',
    namePlaceholder: 'Your ninja name',
    nameSave: 'Save name',
    nameSaved: 'Name saved!',
    avatarTitle: 'Avatar',
    avatarHint: 'Choose the mask your fellow ninjas will see.',
    avatarSelected: 'Selected',
    ninjaStars: 'Ninja Stars',
  },
  it: {
    nameTitle: 'Nome visualizzato',
    nameLabel: 'Come ti chiamerà il maestro?',
    namePlaceholder: 'Il tuo nome ninja',
    nameSave: 'Salva nome',
    nameSaved: 'Nome salvato!',
    avatarTitle: 'Avatar',
    avatarHint: 'Scegli la maschera che vedranno gli altri ninja.',
    avatarSelected: 'Selezionato',
    ninjaStars: 'Stelle Ninja',
  },
} as const satisfies Record<Language, Record<string, string>>

export type LocalKey = keyof (typeof localStrings)['en']

export function localT(language: Language, key: LocalKey): string {
  return localStrings[language]?.[key] ?? localStrings.en[key]
}
