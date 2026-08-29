import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AVATARS, LANGUAGES } from '@timestables-ninja/core'
import { useT } from '../i18n/useT'
import { localT } from '../i18n/local'
import { useProfile, useRequiredProfile } from '../state/ProfileContext'
import { exportProfile, importProfile } from '../state/storage'

interface ToggleProps {
  label: string
  hint?: string
  onLabel: string
  offLabel: string
  value: boolean
  onChange: (next: boolean) => void
}

function Toggle({ label, hint, onLabel, offLabel, value, onChange }: ToggleProps) {
  return (
    <div className="switch">
      <span>
        {label}
        {hint && (
          <div className="muted" style={{ fontSize: '0.85rem' }}>
            {hint}
          </div>
        )}
      </span>
      <button
        type="button"
        className={`btn btn-small ${value ? 'btn-primary' : ''}`}
        aria-pressed={value}
        onClick={() => onChange(!value)}
      >
        {value ? onLabel : offLabel}
      </button>
    </div>
  )
}

export function Settings() {
  const profile = useRequiredProfile()
  const { updateSettings, renameProfile, setAvatar, setProfile, resetProfile } = useProfile()
  const navigate = useNavigate()
  const { t, language } = useT()
  const fileRef = useRef<HTMLInputElement>(null)
  const [message, setMessage] = useState('')
  const [nameDraft, setNameDraft] = useState(profile.name)
  const [nameMessage, setNameMessage] = useState('')

  const saveName = () => {
    renameProfile(nameDraft)
    setNameMessage(localT(language, 'nameSaved'))
  }

  const on = t('common', 'on')
  const off = t('common', 'off')

  const download = () => {
    const blob = new Blob([exportProfile(profile)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${profile.name.replace(/\s+/g, '-').toLowerCase()}-ninja-scroll.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const upload = async (file: File) => {
    try {
      setProfile(importProfile(await file.text()))
      setMessage(t('settings', 'restored'))
    } catch (err) {
      setMessage(
        err instanceof Error && err.message === 'NOT_A_PROFILE'
          ? t('settings', 'notAScroll')
          : t('settings', 'restoreFailed'),
      )
    }
  }

  return (
    <div className="stack">
      <div className="panel stack">
        <h1>{t('settings', 'title')}</h1>

        <div className="switch">
          <span id="language-label">{t('settings', 'language')}</span>
          <div className="row" role="group" aria-labelledby="language-label">
            {LANGUAGES.map((l) => (
              <button
                key={l.id}
                type="button"
                className={`btn btn-small ${language === l.id ? 'btn-primary' : ''}`}
                aria-pressed={language === l.id}
                onClick={() => updateSettings({ language: l.id })}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>

        <Toggle
          label={t('settings', 'showTimer')}
          hint={t('settings', 'showTimerHint')}
          onLabel={on}
          offLabel={off}
          value={profile.settings.showTimer}
          onChange={(v) => updateSettings({ showTimer: v })}
        />
        <Toggle
          label={t('settings', 'sound')}
          onLabel={on}
          offLabel={off}
          value={profile.settings.sound}
          onChange={(v) => updateSettings({ sound: v })}
        />
        <Toggle
          label={t('settings', 'reducedMotion')}
          hint={t('settings', 'reducedMotionHint')}
          onLabel={on}
          offLabel={off}
          value={profile.settings.reducedMotion}
          onChange={(v) => updateSettings({ reducedMotion: v })}
        />
        <Toggle
          label={t('settings', 'readableFont')}
          onLabel={on}
          offLabel={off}
          value={profile.settings.readableFont}
          onChange={(v) => updateSettings({ readableFont: v })}
        />
      </div>

      <div className="panel stack">
        <h2>{localT(language, 'nameTitle')}</h2>
        <label htmlFor="display-name">{localT(language, 'nameLabel')}</label>
        <div className="row">
          <input
            id="display-name"
            type="text"
            value={nameDraft}
            placeholder={localT(language, 'namePlaceholder')}
            onChange={(e) => {
              setNameDraft(e.target.value)
              setNameMessage('')
            }}
          />
          <button type="button" className="btn btn-primary" onClick={saveName}>
            {localT(language, 'nameSave')}
          </button>
        </div>
        {nameMessage && <p role="status">{nameMessage}</p>}
      </div>

      <div className="panel stack">
        <h2 id="avatar-label">{localT(language, 'avatarTitle')}</h2>
        <p className="muted">{localT(language, 'avatarHint')}</p>
        <div className="row" role="group" aria-labelledby="avatar-label">
          {AVATARS.map((avatar) => {
            const selected = profile.avatarId === avatar.id
            return (
              <button
                key={avatar.id}
                type="button"
                className={`btn btn-small ${selected ? 'btn-primary' : ''}`}
                aria-pressed={selected}
                aria-label={selected ? `${avatar.label} — ${localT(language, 'avatarSelected')}` : avatar.label}
                style={{ borderColor: avatar.color }}
                onClick={() => setAvatar(avatar.id)}
              >
                <span aria-hidden="true">{avatar.label}</span>
                <span className="muted" style={{ marginLeft: '0.35rem', fontSize: '0.8rem' }}>
                  ⭐ {avatar.starCost}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="panel stack">
        <h2>{t('settings', 'scrollTitle')}</h2>
        <p>{t('settings', 'scrollBody')}</p>
        <div className="row">
          <button type="button" className="btn" onClick={download}>
            {t('settings', 'save')}
          </button>
          <button type="button" className="btn" onClick={() => fileRef.current?.click()}>
            {t('settings', 'restore')}
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json"
            className="visually-hidden"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) void upload(file)
              e.target.value = ''
            }}
          />
        </div>
        {message && <p role="status">{message}</p>}
      </div>

      <div className="panel stack">
        <h2>{t('settings', 'resetTitle')}</h2>
        <p>{t('settings', 'resetBody')}</p>
        <button
          type="button"
          className="btn"
          onClick={() => {
            if (window.confirm(t('settings', 'resetConfirm'))) {
              resetProfile()
              navigate('/')
            }
          }}
        >
          {t('settings', 'reset')}
        </button>
      </div>

      <button type="button" className="btn btn-ghost" onClick={() => navigate('/')}>
        {t('common', 'backToDojo')}
      </button>
    </div>
  )
}
