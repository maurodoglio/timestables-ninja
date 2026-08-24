import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { unlockedTables } from '../game/belts'
import { makeQuestion, weakestFacts } from '../game/questions'
import type { Answer } from '../game/scoring'
import { Drill } from '../components/Drill'
import { ResultSummary } from '../components/ResultSummary'
import { useRequiredProfile } from '../state/ProfileContext'
import { useFinishSession } from '../state/useFinishSession'

const DRILL_LENGTH = 15

export function WeakStances() {
  const profile = useRequiredProfile()
  const navigate = useNavigate()
  const finish = useFinishSession()

  const [phase, setPhase] = useState<'brief' | 'drill' | 'done'>('brief')
  const [answers, setAnswers] = useState<Answer[]>([])
  const [xp, setXp] = useState(0)
  const [seed, setSeed] = useState(0)

  const weak = useMemo(
    () => weakestFacts(unlockedTables(profile.belt), profile.facts, 5),
    [profile.belt, profile.facts],
  )

  // Cycle through the weakest facts so each one comes round several times.
  const questions = useMemo(() => {
    if (weak.length === 0) return []
    return Array.from({ length: DRILL_LENGTH }, (_, i) =>
      makeQuestion(weak[i % weak.length], 'multiply'),
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seed, phase])

  if (weak.length === 0) {
    return (
      <div className="panel stack">
        <h1>🎯 Weak Stances</h1>
        <p>The sensei has not seen you fight yet. Train first, then come back.</p>
        <button type="button" className="btn btn-primary" onClick={() => navigate('/training')}>
          Go to the Training Hall
        </button>
      </div>
    )
  }

  if (phase === 'drill') {
    return (
      <Drill
        questions={questions}
        showTimer={false}
        teachOnMistake
        onQuit={() => navigate('/')}
        onFinish={(all) => {
          const outcome = finish({ mode: 'weak', answers: all })
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
        title="Stances strengthened"
        answers={answers}
        xpEarned={xp}
        onAgain={() => {
          setSeed((s) => s + 1)
          setPhase('drill')
        }}
        onHome={() => navigate('/')}
      />
    )
  }

  return (
    <div className="panel stack">
      <h1>🎯 Weak Stances</h1>
      <p>
        These are the facts you miss most or answer slowest. Untimed, with the answer shown
        whenever you slip — repetition is the technique here.
      </p>
      <div className="row">
        {weak.map((f, i) => (
          <span className="chip" key={i}>
            {f.a} × {f.b}
          </span>
        ))}
      </div>
      <button type="button" className="btn btn-primary" onClick={() => setPhase('drill')}>
        Drill {DRILL_LENGTH} repetitions
      </button>
      <button type="button" className="btn btn-ghost" onClick={() => navigate('/')}>
        Back to the dojo
      </button>
    </div>
  )
}
