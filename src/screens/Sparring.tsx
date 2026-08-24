import { useCallback, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { SPARRING_SECONDS, unlockedTables } from '../game/belts'
import { selectQuestions } from '../game/questions'
import type { Answer } from '../game/scoring'
import { Drill } from '../components/Drill'
import { ResultSummary } from '../components/ResultSummary'
import { useT } from '../i18n/useT'
import { useRequiredProfile } from '../state/ProfileContext'
import { useFinishSession } from '../state/useFinishSession'

const INITIAL_BATCH = 40

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
          const outcome = finish({ mode: 'sparring', answers: all, sparringScore: correct })
          setAnswers(all)
          setScore(correct)
          setXp(outcome?.result.xpEarned ?? 0)
          setPhase('done')
        }}
      />
    )
  }

  if (phase === 'done') {
    const isBest = score >= profile.sparringBest && score > 0
    return (
      <ResultSummary
        title={
          isBest
            ? t('sparringScreen', 'newBest', { score })
            : t('sparringScreen', 'landed', { score })
        }
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
