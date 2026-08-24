import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { GRADING_LENGTH, getBelt, gradingTables, nextBelt } from '../game/belts'
import { selectQuestions } from '../game/questions'
import { evaluateGrading, type Answer, type GradingOutcome } from '../game/scoring'
import { Drill } from '../components/Drill'
import { ResultSummary } from '../components/ResultSummary'
import { BeltBadge, NinjaAvatar } from '../components/Belt'
import { useRequiredProfile } from '../state/ProfileContext'
import { useFinishSession } from '../state/useFinishSession'

export function Grading() {
  const profile = useRequiredProfile()
  const navigate = useNavigate()
  const finish = useFinishSession()
  const target = nextBelt(profile.belt)

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
        <h1>🏆 No grading left</h1>
        <p>You already hold the highest rank in the dojo. Keep sparring to stay sharp.</p>
        <button type="button" className="btn" onClick={() => navigate('/')}>
          Back to the dojo
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
        title={outcome.passed ? `You earned the ${target.name}!` : 'Sensei says: train more'}
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
              Bow to your sensei. You now wear the <strong>{target.name}</strong>.
            </p>
            <BeltBadge belt={target.id} />
          </div>
        ) : (
          <div className="stack">
            <p>
              {!outcome.accuracyMet && 'You need at least 90% correct. '}
              {outcome.accuracyMet && !outcome.speedMet &&
                `Your accuracy was excellent, but you must average under ${target.targetAverageSeconds}s per answer. `}
              Head to Weak Stances and drill the facts below — the belt will come.
            </p>
            <button
              type="button"
              className="btn"
              onClick={() => navigate('/weak')}
            >
              Drill my weak stances
            </button>
          </div>
        )}
      </ResultSummary>
    )
  }

  return (
    <div className="stack">
      <div className="panel stack">
        <h1>🥋 Grading: {target.name}</h1>
        <BeltBadge belt={target.id} />
        <p>“{target.senseiTip}” — Sensei</p>
        <div className="grid">
          <div className="stat">
            <div className="value">{GRADING_LENGTH}</div>
            <div className="label">Questions</div>
          </div>
          <div className="stat">
            <div className="value">{target.secondsPerQuestion}s</div>
            <div className="label">Per question</div>
          </div>
          <div className="stat">
            <div className="value">90%</div>
            <div className="label">To pass</div>
          </div>
          <div className="stat">
            <div className="value">{target.targetAverageSeconds}s</div>
            <div className="label">Average needed</div>
          </div>
        </div>
        <p>
          Tables covered: {gradingTables(target.id).join(', ')}
          {target.includeDivision ? ' — including division facts.' : '.'}
        </p>
        <p className="muted">
          You can retake a grading as many times as you like, and you never lose a belt you have
          earned. Your current rank is{' '}
          <strong>{getBelt(profile.belt).name}</strong>.
        </p>
        <button type="button" className="btn btn-primary" onClick={() => setPhase('drill')}>
          Bow and begin
        </button>
        <button type="button" className="btn btn-ghost" onClick={() => navigate('/')}>
          Not yet
        </button>
      </div>
    </div>
  )
}
