import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProfile, useRequiredProfile } from '../state/ProfileContext'
import { exportProfile, importProfile } from '../state/storage'

interface ToggleProps {
  label: string
  hint?: string
  value: boolean
  onChange: (next: boolean) => void
}

function Toggle({ label, hint, value, onChange }: ToggleProps) {
  return (
    <div className="switch">
      <span>
        {label}
        {hint && <div className="muted" style={{ fontSize: '0.85rem' }}>{hint}</div>}
      </span>
      <button
        type="button"
        className={`btn btn-small ${value ? 'btn-primary' : ''}`}
        aria-pressed={value}
        onClick={() => onChange(!value)}
      >
        {value ? 'On' : 'Off'}
      </button>
    </div>
  )
}

export function Settings() {
  const profile = useRequiredProfile()
  const { updateSettings, setProfile, resetProfile } = useProfile()
  const navigate = useNavigate()
  const fileRef = useRef<HTMLInputElement>(null)
  const [message, setMessage] = useState('')

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
      setMessage('Scroll restored. Welcome back.')
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'That scroll could not be read.')
    }
  }

  return (
    <div className="stack">
      <div className="panel stack">
        <h1>⚙️ Dojo settings</h1>
        <Toggle
          label="Show the timer bar"
          hint="Turn this off if counting down feels stressful. Timing still counts during gradings."
          value={profile.settings.showTimer}
          onChange={(v) => updateSettings({ showTimer: v })}
        />
        <Toggle
          label="Sound effects"
          value={profile.settings.sound}
          onChange={(v) => updateSettings({ sound: v })}
        />
        <Toggle
          label="Reduce motion"
          hint="Removes animations across the app."
          value={profile.settings.reducedMotion}
          onChange={(v) => updateSettings({ reducedMotion: v })}
        />
        <Toggle
          label="Easier-to-read font"
          value={profile.settings.readableFont}
          onChange={(v) => updateSettings({ readableFont: v })}
        />
      </div>

      <div className="panel stack">
        <h2>Your ninja scroll</h2>
        <p>
          Progress lives only on this device. Save a scroll file to move to another device, or to
          keep a backup.
        </p>
        <div className="row">
          <button type="button" className="btn" onClick={download}>
            Save my scroll
          </button>
          <button type="button" className="btn" onClick={() => fileRef.current?.click()}>
            Restore a scroll
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
        <h2>Start over</h2>
        <p>This erases every belt, point and scroll. It cannot be undone.</p>
        <button
          type="button"
          className="btn"
          onClick={() => {
            if (window.confirm('Leave the dojo and erase all progress?')) {
              resetProfile()
              navigate('/')
            }
          }}
        >
          Erase my progress
        </button>
      </div>

      <button type="button" className="btn btn-ghost" onClick={() => navigate('/')}>
        Back to the dojo
      </button>
    </div>
  )
}
