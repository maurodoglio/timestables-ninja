import { useState } from 'react'
import { useT } from '../i18n/useT'
import { useProfile } from '../state/ProfileContext'

export function Welcome() {
  const { startProfile } = useProfile()
  const { t } = useT()
  const [name, setName] = useState('')

  return (
    <div className="stack">
      <div className="panel stack" style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '3.5rem' }} aria-hidden="true">
          🥷
        </div>
        <h1>{t('welcome', 'title')}</h1>
        <p>{t('welcome', 'intro')}</p>
        <form
          className="stack"
          onSubmit={(e) => {
            e.preventDefault()
            startProfile(name.trim() || t('welcome', 'defaultName'))
          }}
        >
          <label htmlFor="name">{t('welcome', 'nameLabel')}</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t('welcome', 'namePlaceholder')}
            maxLength={20}
            autoComplete="off"
          />
          <button type="submit" className="btn btn-primary">
            {t('welcome', 'join')}
          </button>
        </form>
        <p className="muted" style={{ fontSize: '0.85rem' }}>
          {t('welcome', 'privacy')}
        </p>
      </div>
    </div>
  )
}
