import { useNavigate } from 'react-router-dom'
import {
  BELTS,
  MULTIPLIERS,
  beltIndex,
  unlockedTables,
  masteryLevel,
  factKey,
  ACHIEVEMENTS,
  formatStars,
} from '@timestables-ninja/core'
import { BeltBadge } from '../components/Belt'
import { useT } from '../i18n/useT'
import { useRequiredProfile } from '../state/ProfileContext'
import type { SessionMode } from '@timestables-ninja/core'

export function ProgressScroll() {
  const profile = useRequiredProfile()
  const navigate = useNavigate()
  const { t, fmt } = useT()
  const unlocked = unlockedTables(profile.belt)
  const currentIndex = beltIndex(profile.belt)

  const mastered = Object.values(profile.facts).filter(
    (s) => masteryLevel(s) === 'mastered',
  ).length

  const modeLabel = (mode: SessionMode | string): string =>
    mode === 'training' || mode === 'grading' || mode === 'sparring' || mode === 'weak'
      ? t('modes', mode)
      : String(mode)

  return (
    <div className="stack">
      <div className="panel stack">
        <h1>{t('progress', 'title')}</h1>
        <div className="grid">
          <div className="stat">
            <div className="value">{formatStars(profile.xp)}</div>
            <div className="label">{t('progress', 'trainingPoints')}</div>
          </div>
          <div className="stat">
            <div className="value">{profile.streakDays}</div>
            <div className="label">{t('progress', 'dayStreak')}</div>
          </div>
          <div className="stat">
            <div className="value">{mastered}</div>
            <div className="label">{t('progress', 'factsMastered')}</div>
          </div>
          <div className="stat">
            <div className="value">{profile.sparringBest}</div>
            <div className="label">{t('progress', 'sparringBest')}</div>
          </div>
        </div>
      </div>

      <div className="panel stack">
        <h2>{t('progress', 'masteryGrid')}</h2>
        <p className="muted">{t('progress', 'masteryLegend')}</p>
        <div style={{ overflowX: 'auto' }}>
          <table className="mastery-table">
            <caption className="visually-hidden">{t('progress', 'masteryCaption')}</caption>
            <thead>
              <tr>
                <th scope="col">{fmt.multiplySymbol}</th>
                {MULTIPLIERS.map((b) => (
                  <th scope="col" key={b}>
                    {b}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MULTIPLIERS.map((a) => (
                <tr key={a}>
                  <th scope="row">{a}</th>
                  {MULTIPLIERS.map((b) => {
                    const locked = !unlocked.includes(a)
                    const level = locked
                      ? 'locked'
                      : masteryLevel(profile.facts[factKey('multiply', a, b)])
                    return (
                      <td key={b}>
                        <div
                          className={`cell ${level}`}
                          title={`${a} ${fmt.multiplySymbol} ${b} — ${
                            locked ? t('progress', 'locked') : level
                          }`}
                        >
                          {locked ? '🔒' : a * b}
                        </div>
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="panel stack">
        <h2>{t('progress', 'beltPath')}</h2>
        <div className="row">
          {BELTS.map((b, i) => {
            const name = t('belts', b.id)
            return (
              <span key={b.id} style={{ opacity: i <= currentIndex ? 1 : 0.4 }}>
                <BeltBadge belt={b.id} label={i <= currentIndex ? `✓ ${name}` : name} />
              </span>
            )
          })}
        </div>
      </div>

      <div className="panel stack">
        <h2>{t('progress', 'scrolls')}</h2>
        <div className="grid">
          {ACHIEVEMENTS.map((a) => {
            const earned = profile.achievements.includes(a.id)
            return (
              <div className="stat" key={a.id} style={{ opacity: earned ? 1 : 0.45 }}>
                <div className="value" aria-hidden="true">
                  {earned ? a.icon : '🔒'}
                </div>
                <div style={{ fontWeight: 800 }}>{t('achievements', a.key)}</div>
                <div className="label" style={{ textTransform: 'none', letterSpacing: 0 }}>
                  {t('achievements', a.descKey)}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="panel stack">
        <h2>{t('progress', 'recentSessions')}</h2>
        {profile.history.length === 0 ? (
          <p>{t('progress', 'noHistory')}</p>
        ) : (
          <ul>
            {profile.history.slice(0, 10).map((h, i) => (
              <li key={i} className="muted">
                {t('progress', 'historyLine', {
                  date: fmt.date(h.at),
                  mode: modeLabel(h.mode),
                  correct: h.correct,
                  total: h.total,
                  avg: fmt.number(h.averageMs / 1000, 1),
                  xp: h.xpEarned,
                })}
                {h.mode === 'grading'
                  ? h.passed
                    ? t('progress', 'passedSuffix')
                    : t('progress', 'failedSuffix')
                  : ''}
              </li>
            ))}
          </ul>
        )}
        <button type="button" className="btn" onClick={() => navigate('/')}>
          {t('common', 'backToDojo')}
        </button>
      </div>
    </div>
  )
}
