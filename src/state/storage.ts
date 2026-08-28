import {
  createProfile,
  exportProfile,
  importProfile,
  type Profile,
} from '@timestables-ninja/core'

export { createProfile, exportProfile, importProfile }

const STORAGE_KEY = 'ninja.profile'

export function loadProfile(): Profile | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return importProfile(raw)
  } catch {
    return null
  }
}

export function saveProfile(profile: Profile): void {
  try {
    localStorage.setItem(STORAGE_KEY, exportProfile(profile))
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
