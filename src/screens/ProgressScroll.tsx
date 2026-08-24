import { useNavigate } from 'react-router-dom'
import { BELTS, MULTIPLIERS, beltIndex, unlockedTables } from '../game/belts'
import { masteryLevel } from '../game/questions'
import { factKey } from '../game/types'
import { ACHIEVEMENTS } from '../state/achievements'
import { BeltBadge } from '../components/Belt'
import { useRequiredProfile } from '../state/ProfileContext'

const MODE_LABEL: Record<string, string> = {
  training: 'Training',
  grading: 'Grading',
  sparring: 'Sparring',
  weak: 'Weak stances',
}

export function ProgressScroll() {
  const profile = useRequiredProfile()
  const navigate = useNavigate()
  const unlocked = unlockedTables(profile.belt)
  const currentIndex = beltIndex(profile.belt)

  const mastered = Object.values(profile.facts).filter(
    (s) => masteryLevel(s) === 'mastered',
  ).length

  return (
    <div className="stack">
      <div className="panel stack">
        <h1>📜 Progress Scroll</h1>
        <div className="grid">
          <div className="stat">
            <div className="value">{profile.xp}</div>
            <div className="label">Training points</div>
          </div>
          <div className="stat">
            <div className="value">{profile.streakDays}</div>
            <div className="label">Day streak</div>
          </div>
          <div className="stat">
            <div className="value">{mastered}</div>
            <div className="label">Facts mastered</div>
          </div>
          <div className="stat">
            <div className="value">{profile.sparringBest}</div>
            <div className="label">Sparring best</div>
          </div>
        </div>
      </div>

      <div className="panel stack">
        <h2>Mastery grid</h2>
        <p className="muted">
          Orange = learning, blue = solid, green = mastered. Locked tables unlock as you earn belts.
        </p>
        <div style={{ overflowX: 'auto' }}>
          <table className="mastery-table">
            <caption className="visually-hidden">
              Mastery of every multiplication fact from 1 to 12
            </caption>
            <thead>
              <tr>
                <th scope="col">×</th>
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
                          title={`${a} × ${b} — ${locked ? 'locked' : level}`}
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
        <h2>Belt path</h2>
        <div className="row">
          {BELTS.map((b, i) => (
            <span key={b.id} style={{ opacity: i <= currentIndex ? 1 : 0.4 }}>
              <BeltBadge belt={b.id} label={i <= currentIndex ? `✓ ${b.name}` : b.name} />
            </span>
          ))}
        </div>
      </div>

      <div className="panel stack">
        <h2>Scrolls</h2>
        <div className="grid">
          {ACHIEVEMENTS.map((a) => {
            const earned = profile.achievements.includes(a.id)
            return (
              <div className="stat" key={a.id} style={{ opacity: earned ? 1 : 0.45 }}>
                <div className="value" aria-hidden="true">
                  {earned ? a.icon : '🔒'}
                </div>
                <div style={{ fontWeight: 800 }}>{a.name}</div>
                <div className="label" style={{ textTransform: 'none', letterSpacing: 0 }}>
                  {a.description}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="panel stack">
        <h2>Recent sessions</h2>
        {profile.history.length === 0 ? (
          <p>No training recorded yet.</p>
        ) : (
          <ul>
            {profile.history.slice(0, 10).map((h, i) => (
              <li key={i} className="muted">
                {new Date(h.at).toLocaleDateString()} — {MODE_LABEL[h.mode] ?? h.mode}: {h.correct}/
                {h.total} correct, {(h.averageMs / 1000).toFixed(1)}s average, +{h.xpEarned} points
                {h.mode === 'grading' ? (h.passed ? ' — passed!' : ' — not yet') : ''}
              </li>
            ))}
          </ul>
        )}
        <button type="button" className="btn" onClick={() => navigate('/')}>
          Back to the dojo
        </button>
      </div>
    </div>
  )
}
