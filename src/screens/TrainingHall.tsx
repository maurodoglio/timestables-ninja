import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MULTIPLIERS, unlockedTables } from '../game/belts'
import { selectQuestions } from '../game/questions'
import type { Answer } from '../game/scoring'
import { Drill } from '../components/Drill'
import { ResultSummary } from '../components/ResultSummary'
import { useRequiredProfile } from '../state/ProfileContext'
import { useFinishSession } from '../state/useFinishSession'

const LENGTHS = [10, 20, 30]

export function TrainingHall() {
  const profile = useRequiredProfile()
  const navigate = useNavigate()
  const finish = useFinishSession()
  const unlocked = unlockedTables(profile.belt)

  const [selected, setSelected] = useState<number[]>(unlocked)
  const [length, setLength] = useState(10)
  const [timed, setTimed] = useState(false)
  const [phase, setPhase] = useState<'setup' | 'drill' | 'done'>('setup')
  const [answers, setAnswers] = useState<Answer[]>([])
  const [xp, setXp] = useState(0)
  const [seed, setSeed] = useState(0)

  const questions = useMemo(
    () =>
      phase === 'drill'
        ? selectQuestions({ tables: selected, count: length, stats: profile.facts })
        : [],
    // Regenerated deliberately per run via `seed`.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [phase, seed],
  )

  const toggle = (t: number) =>
    setSelected((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]))

  const start = () => {
    setSeed((s) => s + 1)
    setPhase('drill')
  }

  if (phase === 'drill') {
    return (
      <Drill
        questions={questions}
        secondsPerQuestion={timed ? 10 : undefined}
        showTimer={profile.settings.showTimer}
        teachOnMistake
        onQuit={() => navigate('/')}
        onFinish={(all) => {
          const outcome = finish({ mode: 'training', answers: all })
          setAnswers(all)
          setXp(outcome?.result.xpEarned ?? 0)
          setPhase('done')
        }}
      />
    )
  }

  if (phase === 'done') {
    return (
      <ResultSummary
        title="Training complete"
        answers={answers}
        xpEarned={xp}
        onAgain={start}
        onHome={() => navigate('/')}
      />
    )
  }

  return (
    <div className="stack">
      <div className="panel stack">
        <h1>🏯 Training Hall</h1>
        <p>Choose your tables and train at your own pace. Nothing here affects your belt.</p>

        <h3>Tables</h3>
        <div className="table-picker">
          {MULTIPLIERS.map((t) => {
            const locked = !unlocked.includes(t)
            return (
              <button
                key={t}
                type="button"
                aria-pressed={selected.includes(t)}
                disabled={locked}
                title={locked ? 'Earn a higher belt to unlock this table' : `${t} times table`}
                onClick={() => toggle(t)}
              >
                {t}
                {locked ? ' 🔒' : ''}
              </button>
            )
          })}
        </div>
        <div className="row">
          <button
            type="button"
            className="btn btn-small btn-ghost"
            onClick={() => setSelected(unlocked)}
          >
            Select all unlocked
          </button>
          <button
            type="button"
            className="btn btn-small btn-ghost"
            onClick={() => setSelected([])}
          >
            Clear
          </button>
        </div>

        <h3>How many questions?</h3>
        <div className="row">
          {LENGTHS.map((n) => (
            <button
              key={n}
              type="button"
              className={`btn btn-small ${length === n ? 'btn-primary' : ''}`}
              onClick={() => setLength(n)}
            >
              {n}
            </button>
          ))}
        </div>

        <div className="switch">
          <span>Use a gentle timer (10 seconds per question)</span>
          <button
            type="button"
            className={`btn btn-small ${timed ? 'btn-primary' : ''}`}
            aria-pressed={timed}
            onClick={() => setTimed((v) => !v)}
          >
            {timed ? 'On' : 'Off'}
          </button>
        </div>

        <button
          type="button"
          className="btn btn-primary"
          disabled={selected.length === 0}
          onClick={start}
        >
          Begin training
        </button>
      </div>
    </div>
  )
}
