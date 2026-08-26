import { useCallback, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { SPARRING_SECONDS, unlockedTables, selectQuestions, type Answer } from '@timestables-ninja/core'
import { Drill } from '../components/Drill'
import { ResultSummary } from '../components/ResultSummary'
import { useT } from '../i18n/useT'
import { useRequiredProfile } from '../state/ProfileContext'
import { useFinishSession } from '../state/useFinishSession'

const INITIAL_BATCH = 40

export type SparringVerdict = 'newBest' | 'matchedBest' | 'landed'

/**
 * Compare a finished round against the best held *before* it was recorded, so
 * a tie is reported as a match rather than a new personal best.
 */
export function sparringVerdict(score: number, previousBest: number): SparringVerdict {
  if (score <= 0) return 'landed'
  if (score > previousBest) return 'newBest'
  if (score === previousBest) return 'matchedBest'
  return 'landed'
}

export function Sparring() {
  const profile = useRequiredProfile()
  const navigate = useNavigate()
  const finish = useFinishSession()
  const { t, fmt } = useT()
  const tables = unlockedTables(profile.belt)

  const [phase, setPhase] = useState<'brief' | 'drill' | 'done'>('brief')
  const [answers, setAnswers] = useState<Answer[]>([])
  const [xp, setXp] = useState(0)
  const [score, setScore] = useState(0)
  const [previousBest, setPreviousBest] = useState(0)
  const [seed, setSeed] = useState(0)

  const questions = useMemo(
    () => selectQuestions({ tables, count: INITIAL_BATCH, stats: profile.facts }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [seed, phase],
  )

  // Sparring is endless within its 60 seconds, so top the queue up on demand.
  const more = useCallback(
    () => selectQuestions({ tables, count: 1, stats: profile.facts })[0] ?? null,
    [tables, profile.facts],
  )

  if (phase === 'drill') {
    return (
      <Drill
        questions={questions}
        totalSeconds={SPARRING_SECONDS}
        showTimer
        teachOnMistake={false}
        more={more}
        onQuit={() => navigate('/')}
        onFinish={(all) => {
          const correct = all.filter((a) => a.correct).length
          const best = profile.sparringBest
          const outcome = finish({ mode: 'sparring', answers: all, sparringScore: correct })
          setAnswers(all)
          setScore(correct)
          setPreviousBest(best)
          setXp(outcome?.result.xpEarned ?? 0)
          setPhase('done')
        }}
      />
    )
  }

  if (phase === 'done') {
    const verdict = sparringVerdict(score, previousBest)
    return (
      <ResultSummary
        title={t('sparringScreen', verdict, { score })}
        answers={answers}
        xpEarned={xp}
        onAgain={() => {
          setSeed((s) => s + 1)
          setPhase('drill')
        }}
        onHome={() => navigate('/')}
      >
        <p>{t('sparringScreen', 'best', { best: profile.sparringBest })}</p>
      </ResultSummary>
    )
  }

  return (
    <div className="panel stack">
      <h1>{t('sparringScreen', 'title')}</h1>
      <p>{t('sparringScreen', 'intro', { tables: fmt.list(tables) })}</p>
      <div className="grid">
        <div className="stat">
          <div className="value">{SPARRING_SECONDS}s</div>
          <div className="label">{t('sparringScreen', 'roundLength')}</div>
        </div>
        <div className="stat">
          <div className="value">{profile.sparringBest}</div>
          <div className="label">{t('sparringScreen', 'personalBest')}</div>
        </div>
      </div>
      <button type="button" className="btn btn-primary" onClick={() => setPhase('drill')}>
        {t('sparringScreen', 'start')}
      </button>
      <button type="button" className="btn btn-ghost" onClick={() => navigate('/')}>
        {t('common', 'backToDojo')}
      </button>
    </div>
  )
}
