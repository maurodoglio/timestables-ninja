import { detectLanguage } from '../i18n'
import { isBeltId } from '../game/belts'
import type { Profile, Settings } from '../game/types'

const STORAGE_KEY = 'ninja.profile'
export const SCHEMA_VERSION = 1

interface Envelope {
  version: number
  profile: Profile
}

export const DEFAULT_SETTINGS: Settings = {
  language: 'en',
  showTimer: true,
  sound: true,
  reducedMotion: false,
  readableFont: false,
}

export function createProfile(name: string): Profile {
  return {
    id: `ninja-${Date.now().toString(36)}`,
    name: name.trim() || 'Young Ninja',
    belt: 'white',
    xp: 0,
    streakDays: 0,
    lastTrainedOn: null,
    facts: {},
    achievements: [],
    history: [],
    sparringBest: 0,
    settings: { ...DEFAULT_SETTINGS, language: detectLanguage() },
    createdAt: Date.now(),
  }
}

/** Bring an older stored profile up to the current schema. */
function migrate(envelope: Envelope): Profile {
  const profile = envelope.profile
  return {
    ...createProfile(profile.name ?? 'Young Ninja'),
    ...profile,
    belt: isBeltId(profile.belt) ? profile.belt : 'white',
    settings: { ...DEFAULT_SETTINGS, ...(profile.settings ?? {}) },
    facts: profile.facts ?? {},
    achievements: profile.achievements ?? [],
    history: profile.history ?? [],
  }
}

export function loadProfile(): Profile | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Envelope
    if (!parsed?.profile) return null
    return migrate(parsed)
  } catch {
    return null
  }
}

export function saveProfile(profile: Profile): void {
  try {
    const envelope: Envelope = { version: SCHEMA_VERSION, profile }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(envelope))
  } catch {
    // Storage may be full or blocked; training can continue in memory.
  }
}

export function clearProfile(): void {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // ignore
  }
}

export function exportProfile(profile: Profile): string {
  return JSON.stringify({ version: SCHEMA_VERSION, profile }, null, 2)
}

export function importProfile(json: string): Profile {
  const parsed = JSON.parse(json) as Envelope
  if (!parsed?.profile?.id) throw new Error('NOT_A_PROFILE')
  return migrate(parsed)
}
