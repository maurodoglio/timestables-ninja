import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { GRADING_LENGTH, gradingTables, nextBelt } from '../game/belts'
import { selectQuestions } from '../game/questions'
import { evaluateGrading, type Answer, type GradingOutcome } from '../game/scoring'
import { Drill } from '../components/Drill'
import { ResultSummary } from '../components/ResultSummary'
import { BeltBadge, NinjaAvatar } from '../components/Belt'
import { useT } from '../i18n/useT'
import { useRequiredProfile } from '../state/ProfileContext'
import { useFinishSession } from '../state/useFinishSession'

export function Grading() {
  const profile = useRequiredProfile()
  const navigate = useNavigate()
  const finish = useFinishSession()
  const { t, fmt } = useT()
  // Freeze the belt being graded at mount time: passing promotes
  // `profile.belt`, which would otherwise make `nextBelt` point one belt
  // further and show the wrong belt on the results screen.
  const [target] = useState(() => nextBelt(profile.belt))
  const targetName = target ? t('belts', target.id) : ''

  const [phase, setPhase] = useState<'brief' | 'drill' | 'done'>('brief')
  const [answers, setAnswers] = useState<Answer[]>([])
  const [outcome, setOutcome] = useState<GradingOutcome | null>(null)
  const [xp, setXp] = useState(0)
  const [seed, setSeed] = useState(0)

  const questions = useMemo(
    () =>
      target && phase === 'drill'
        ? selectQuestions({
            tables: gradingTables(target.id),
            count: GRADING_LENGTH,
            stats: profile.facts,
            includeDivision: target.includeDivision,
          })
        : [],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [phase, seed],
  )

  if (!target) {
    return (
      <div className="panel stack">
        <h1>{t('grading', 'noneLeftTitle')}</h1>
        <p>{t('grading', 'noneLeftBody')}</p>
        <button type="button" className="btn" onClick={() => navigate('/')}>
          {t('common', 'backToDojo')}
        </button>
      </div>
    )
  }

  if (phase === 'drill') {
    return (
      <Drill
        questions={questions}
        secondsPerQuestion={target.secondsPerQuestion}
        showTimer={profile.settings.showTimer}
        teachOnMistake={false}
        onQuit={() => navigate('/')}
        onFinish={(all) => {
          const result = evaluateGrading(all, target.id)
          const recorded = finish({ mode: 'grading', answers: all, passed: result.passed })
          setAnswers(all)
          setOutcome(result)
          setXp(recorded?.result.xpEarned ?? 0)
          setPhase('done')
        }}
      />
    )
  }

  if (phase === 'done' && outcome) {
    return (
      <ResultSummary
        title={
          outcome.passed
            ? t('grading', 'passedTitle', { belt: targetName })
            : t('grading', 'failedTitle')
        }
        answers={answers}
        xpEarned={xp}
        onAgain={
          outcome.passed
            ? undefined
            : () => {
                setSeed((s) => s + 1)
                setOutcome(null)
                setPhase('drill')
              }
        }
        onHome={() => navigate('/')}
      >
        {outcome.passed ? (
          <div className="ceremony">
            <div className="big" aria-hidden="true">
              🎉
            </div>
            <NinjaAvatar belt={target.id} size={110} />
            <p style={{ marginTop: 12 }}>
              {t('grading', 'ceremony', { belt: targetName })}
            </p>
            <BeltBadge belt={target.id} />
          </div>
        ) : (
          <div className="stack">
            <p>
              {!outcome.accuracyMet && t('grading', 'needAccuracy')}
              {outcome.accuracyMet &&
                !outcome.speedMet &&
                t('grading', 'needSpeed', {
                  seconds: fmt.number(target.targetAverageSeconds, 1),
                })}
              {t('grading', 'failedAdvice')}
            </p>
            <button type="button" className="btn" onClick={() => navigate('/weak')}>
              {t('grading', 'goToWeak')}
            </button>
          </div>
        )}
      </ResultSummary>
    )
  }

  return (
    <div className="stack">
      <div className="panel stack">
        <h1>{t('grading', 'title', { belt: targetName })}</h1>
        <BeltBadge belt={target.id} />
        <p>{t('dojo', 'senseiQuote', { tip: t('senseiTips', target.id) })}</p>
        <div className="grid">
          <div className="stat">
            <div className="value">{GRADING_LENGTH}</div>
            <div className="label">{t('grading', 'questions')}</div>
          </div>
          <div className="stat">
            <div className="value">{target.secondsPerQuestion}s</div>
            <div className="label">{t('grading', 'perQuestion')}</div>
          </div>
          <div className="stat">
            <div className="value">90%</div>
            <div className="label">{t('grading', 'toPass')}</div>
          </div>
          <div className="stat">
            <div className="value">{fmt.number(target.targetAverageSeconds, 1)}s</div>
            <div className="label">{t('grading', 'averageNeeded')}</div>
          </div>
        </div>
        <p>
          {t('grading', 'tablesCovered', { tables: fmt.list(gradingTables(target.id)) })}
          {target.includeDivision ? t('grading', 'withDivision') : '.'}
        </p>
        <p className="muted">
          {t('grading', 'retakeNote', { belt: t('belts', profile.belt) })}
        </p>
        <button type="button" className="btn btn-primary" onClick={() => setPhase('drill')}>
          {t('grading', 'begin')}
        </button>
        <button type="button" className="btn btn-ghost" onClick={() => navigate('/')}>
          {t('common', 'notYet')}
        </button>
      </div>
    </div>
  )
}
