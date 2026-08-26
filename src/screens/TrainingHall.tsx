import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MULTIPLIERS, unlockedTables, selectQuestions, type Answer } from '@timestables-ninja/core'
import { Drill } from '../components/Drill'
import { ResultSummary } from '../components/ResultSummary'
import { useT } from '../i18n/useT'
import { useRequiredProfile } from '../state/ProfileContext'
import { useFinishSession } from '../state/useFinishSession'

const LENGTHS = [10, 20, 30]

export function TrainingHall() {
  const profile = useRequiredProfile()
  const navigate = useNavigate()
  const finish = useFinishSession()
  const { t } = useT()
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

  const toggle = (table: number) =>
    setSelected((prev) =>
      prev.includes(table) ? prev.filter((x) => x !== table) : [...prev, table],
    )

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
        title={t('result', 'trainingComplete')}
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
        <h1>{t('training', 'title')}</h1>
        <p>{t('training', 'intro')}</p>

        <h3>{t('training', 'tables')}</h3>
        <div className="table-picker">
          {MULTIPLIERS.map((table) => {
            const locked = !unlocked.includes(table)
            return (
              <button
                key={table}
                type="button"
                aria-pressed={selected.includes(table)}
                disabled={locked}
                title={
                  locked
                    ? t('training', 'lockedHint')
                    : t('training', 'tableTitle', { n: table })
                }
                onClick={() => toggle(table)}
              >
                {table}
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
            {t('training', 'selectAll')}
          </button>
          <button
            type="button"
            className="btn btn-small btn-ghost"
            onClick={() => setSelected([])}
          >
            {t('training', 'clear')}
          </button>
        </div>

        <h3>{t('training', 'howMany')}</h3>
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
          <span>{t('training', 'gentleTimer')}</span>
          <button
            type="button"
            className={`btn btn-small ${timed ? 'btn-primary' : ''}`}
            aria-pressed={timed}
            onClick={() => setTimed((v) => !v)}
          >
            {timed ? t('common', 'on') : t('common', 'off')}
          </button>
        </div>

        <button
          type="button"
          className="btn btn-primary"
          disabled={selected.length === 0}
          onClick={start}
        >
          {t('training', 'begin')}
        </button>
      </div>
    </div>
  )
}
