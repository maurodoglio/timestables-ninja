import { useNavigate } from 'react-router-dom'
import { nextBelt, unlockedTables, weakestFacts } from '@timestables-ninja/core'
import { BeltBadge, NinjaAvatar } from '../components/Belt'
import { useT } from '../i18n/useT'
import { useRequiredProfile } from '../state/ProfileContext'

interface ModeCardProps {
  icon: string
  title: string
  desc: string
  onClick: () => void
  disabled?: boolean
}

function ModeCard({ icon, title, desc, onClick, disabled }: ModeCardProps) {
  return (
    <button type="button" className="mode-card" onClick={onClick} disabled={disabled}>
      <span className="icon" aria-hidden="true">
        {icon}
      </span>
      <span className="title">{title}</span>
      <span className="desc">{desc}</span>
    </button>
  )
}

export function Dojo() {
  const profile = useRequiredProfile()
  const navigate = useNavigate()
  const { t, fmt } = useT()
  const next = nextBelt(profile.belt)
  const nextName = next ? t('belts', next.id) : ''
  const weak = weakestFacts(unlockedTables(profile.belt), profile.facts, 1)

  return (
    <div className="stack">
      <div className="panel stack">
        <div className="row spread">
          <div className="row">
            <NinjaAvatar belt={profile.belt} />
            <div>
              <h1>{profile.name}</h1>
              <BeltBadge belt={profile.belt} />
            </div>
          </div>
          <div className="row">
            <span className="chip">{t('dojo', 'streak', { count: profile.streakDays })}</span>
            <span className="chip">{t('dojo', 'points', { count: profile.xp })}</span>
          </div>
        </div>
        <p>{t('dojo', 'senseiQuote', { tip: t('senseiTips', profile.belt) })}</p>
      </div>

      <div className="panel stack">
        <h2>
          {next ? t('dojo', 'nextGrading', { belt: nextName }) : t('dojo', 'masterTitle')}
        </h2>
        <p>
          {next
            ? t('dojo', 'nextGradingBody', {
                tables: fmt.list(next.cumulativeTables),
                belt: nextName.toLowerCase(),
              })
            : t('dojo', 'masterBody')}
        </p>
        {next && (
          <div className="row">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => navigate('/grading')}
            >
              {t('dojo', 'takeGrading', { belt: nextName })}
            </button>
          </div>
        )}
      </div>

      <div className="grid">
        <ModeCard
          icon="🏯"
          title={t('dojo', 'trainingHall')}
          desc={t('dojo', 'trainingHallDesc')}
          onClick={() => navigate('/training')}
        />
        <ModeCard
          icon="🎯"
          title={t('dojo', 'weakStances')}
          desc={
            weak.length > 0
              ? t('dojo', 'weakStancesDesc', { a: weak[0].a, b: weak[0].b })
              : t('dojo', 'weakStancesEmpty')
          }
          onClick={() => navigate('/weak')}
          disabled={weak.length === 0}
        />
        <ModeCard
          icon="⚡"
          title={t('dojo', 'sparring')}
          desc={t('dojo', 'sparringDesc', { best: profile.sparringBest })}
          onClick={() => navigate('/sparring')}
        />
        <ModeCard
          icon="📜"
          title={t('dojo', 'progressScroll')}
          desc={t('dojo', 'progressScrollDesc')}
          onClick={() => navigate('/progress')}
        />
      </div>
    </div>
  )
}
