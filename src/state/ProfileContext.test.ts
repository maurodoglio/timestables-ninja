import { describe, expect, it } from 'vitest'
import { renameProfile, type AvatarId } from '@timestables-ninja/core'
import { createProfile } from './storage'
import { applyAvatar } from './ProfileContext'

describe('renameProfile (core helper wired into ProfileContext.renameProfile)', () => {
  it('trims and applies a new display name', () => {
    const profile = createProfile('Kai')
    const renamed = renameProfile(profile, '  Aiko  ')
    expect(renamed.name).toBe('Aiko')
  })

  it('falls back to Young Ninja for a blank name', () => {
    const profile = createProfile('Kai')
    const renamed = renameProfile(profile, '   ')
    expect(renamed.name).toBe('Young Ninja')
  })

  it('bumps updatedAt', () => {
    const profile = { ...createProfile('Kai'), updatedAt: 0 }
    const renamed = renameProfile(profile, 'Aiko')
    expect(renamed.updatedAt).toBeGreaterThan(0)
  })
})

describe('applyAvatar (backing ProfileContext.setAvatar)', () => {
  it('updates the avatarId', () => {
    const profile = createProfile('Kai')
    const next = applyAvatar(profile, 'red-mask' as AvatarId)
    expect(next.avatarId).toBe('red-mask')
  })

  it('bumps updatedAt and leaves other fields untouched', () => {
    const profile = { ...createProfile('Kai'), updatedAt: 0 }
    const next = applyAvatar(profile, 'blue-mask' as AvatarId)
    expect(next.updatedAt).toBeGreaterThan(0)
    expect(next.name).toBe(profile.name)
    expect(next.belt).toBe(profile.belt)
  })
})
