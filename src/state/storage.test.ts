import { describe, expect, it } from 'vitest'
import { importProfile, exportProfile, createProfile } from './storage'

describe('importProfile', () => {
  it('keeps a belt that is on the ladder', () => {
    const profile = { ...createProfile('Kai'), belt: 'green' as const }
    expect(importProfile(exportProfile(profile)).belt).toBe('green')
  })

  it('falls back to white when the stored belt is unknown', () => {
    const profile = { ...createProfile('Kai'), belt: 'rainbow' as unknown as 'white' }
    expect(importProfile(exportProfile(profile)).belt).toBe('white')
  })

  it('falls back to white when the belt is missing', () => {
    const { belt: _belt, ...rest } = createProfile('Kai')
    const json = JSON.stringify({ version: 1, profile: rest })
    expect(importProfile(json).belt).toBe('white')
  })
})
