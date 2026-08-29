import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { AvatarId, Profile, Settings } from '@timestables-ninja/core'
import {
  recordSession,
  renameProfile as renameProfileHelper,
  type RecordOptions,
  type RecordedSession,
} from '@timestables-ninja/core'
import {
  createProfile,
  clearProfile,
  loadProfile,
  saveProfile,
} from './storage'

interface ProfileContextValue {
  profile: Profile | null
  startProfile: (name: string) => void
  setProfile: (profile: Profile) => void
  updateSettings: (patch: Partial<Settings>) => void
  renameProfile: (name: string) => void
  setAvatar: (avatarId: AvatarId) => void
  finishSession: (options: RecordOptions) => RecordedSession | null
  resetProfile: () => void
}

export function applyAvatar(profile: Profile, avatarId: AvatarId): Profile {
  return { ...profile, avatarId, updatedAt: Date.now() }
}

const ProfileContext = createContext<ProfileContextValue | null>(null)

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfileState] = useState<Profile | null>(() => loadProfile())

  useEffect(() => {
    if (profile) saveProfile(profile)
  }, [profile])

  const setProfile = useCallback((next: Profile) => setProfileState(next), [])

  const startProfile = useCallback((name: string) => {
    setProfileState(createProfile(name))
  }, [])

  const updateSettings = useCallback((patch: Partial<Settings>) => {
    setProfileState((prev) =>
      prev ? { ...prev, settings: { ...prev.settings, ...patch } } : prev,
    )
  }, [])

  const renameProfile = useCallback((name: string) => {
    setProfileState((prev) => (prev ? renameProfileHelper(prev, name) : prev))
  }, [])

  const setAvatar = useCallback((avatarId: AvatarId) => {
    setProfileState((prev) => (prev ? applyAvatar(prev, avatarId) : prev))
  }, [])

  const finishSession = useCallback((options: RecordOptions) => {
    let outcome: RecordedSession | null = null
    setProfileState((prev) => {
      if (!prev) return prev
      outcome = recordSession(prev, options)
      return outcome.profile
    })
    return outcome
  }, [])

  const resetProfile = useCallback(() => {
    clearProfile()
    setProfileState(null)
  }, [])

  const value = useMemo(
    () => ({
      profile,
      startProfile,
      setProfile,
      updateSettings,
      renameProfile,
      setAvatar,
      finishSession,
      resetProfile,
    }),
    [
      profile,
      startProfile,
      setProfile,
      updateSettings,
      renameProfile,
      setAvatar,
      finishSession,
      resetProfile,
    ],
  )

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
}

export function useProfile(): ProfileContextValue {
  const ctx = useContext(ProfileContext)
  if (!ctx) throw new Error('useProfile must be used inside a ProfileProvider')
  return ctx
}

/** Convenience hook for screens that require a profile to exist. */
export function useRequiredProfile(): Profile {
  const { profile } = useProfile()
  if (!profile) throw new Error('No ninja profile found')
  return profile
}
