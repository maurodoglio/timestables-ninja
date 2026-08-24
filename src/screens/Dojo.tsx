import { useNavigate } from 'react-router-dom'
import { getBelt, nextBelt, unlockedTables } from '../game/belts'
import { weakestFacts } from '../game/questions'
import { BeltBadge, NinjaAvatar } from '../components/Belt'
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
  const belt = getBelt(profile.belt)
  const next = nextBelt(profile.belt)
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
            <span className="chip">🔥 {profile.streakDays} day streak</span>
            <span className="chip">⭐ {profile.xp} points</span>
          </div>
        </div>
        <p>“{belt.senseiTip}” — Sensei</p>
      </div>

      <div className="panel stack">
        <h2>{next ? `Next grading: ${next.name}` : 'You are a Ninja Master'}</h2>
        <p>
          {next
            ? `Master the ${next.cumulativeTables.join(', ')} times tables, then take the grading to earn your ${next.name.toLowerCase()}.`
            : 'Keep your skills sharp — sparring and weak stances still await.'}
        </p>
        {next && (
          <div className="row">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => navigate('/grading')}
            >
              Take the {next.name} grading
            </button>
          </div>
        )}
      </div>

      <div className="grid">
        <ModeCard
          icon="🏯"
          title="Training Hall"
          desc="Practise any table you have unlocked, at your own pace."
          onClick={() => navigate('/training')}
        />
        <ModeCard
          icon="🎯"
          title="Weak Stances"
          desc={
            weak.length > 0
              ? `Drill the facts you keep missing, starting with ${weak[0].a} × ${weak[0].b}.`
              : 'Train a little first, then the sensei will find your weak spots.'
          }
          onClick={() => navigate('/weak')}
          disabled={weak.length === 0}
        />
        <ModeCard
          icon="⚡"
          title="Sparring"
          desc={`Sixty seconds, as many strikes as you can. Best: ${profile.sparringBest}.`}
          onClick={() => navigate('/sparring')}
        />
        <ModeCard
          icon="📜"
          title="Progress Scroll"
          desc="See your mastery grid, history and earned scrolls."
          onClick={() => navigate('/progress')}
        />
      </div>
    </div>
  )
}
