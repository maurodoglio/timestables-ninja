import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { Question, Answer } from '@timestables-ninja/core'
import { useT } from '../i18n/useT'
import { NumberPad } from './NumberPad'

export interface DrillConfig {
  questions: Question[]
  /** Seconds allowed per question; 0 or undefined means untimed. */
  secondsPerQuestion?: number
  /** Total seconds for the whole run (sparring); undefined means no cap. */
  totalSeconds?: number
  showTimer: boolean
  /** Show the correct answer after a mistake instead of moving straight on. */
  teachOnMistake: boolean
  /** Endless mode keeps generating questions until the total timer runs out. */
  more?: (index: number) => Question | null
}

interface DrillProps extends DrillConfig {
  onFinish: (answers: Answer[]) => void
  onQuit: () => void
}

const FEEDBACK_MS = 900
const TEACH_MS = 1900

export function Drill({
  questions,
  secondsPerQuestion,
  totalSeconds,
  showTimer,
  teachOnMistake,
  more,
  onFinish,
  onQuit,
}: DrillProps) {
  const { t, fmt } = useT()
  const [queue, setQueue] = useState<Question[]>(questions)
  const [index, setIndex] = useState(0)
  const [entry, setEntry] = useState('')
  const [answers, setAnswers] = useState<Answer[]>([])
  const [status, setStatus] = useState<'asking' | 'correct' | 'wrong'>('asking')
  const [remaining, setRemaining] = useState(secondsPerQuestion ?? 0)
  const [totalLeft, setTotalLeft] = useState(totalSeconds ?? 0)
  const askedAt = useRef(Date.now())
  const finished = useRef(false)

  const question = queue[index]

  const finish = useCallback(
    (all: Answer[]) => {
      if (finished.current) return
      finished.current = true
      onFinish(all)
    },
    [onFinish],
  )

  const advance = useCallback(
    (all: Answer[]) => {
      setAnswers(all)
      const nextIndex = index + 1
      if (nextIndex >= queue.length) {
        const extra = more?.(nextIndex)
        if (extra) {
          setQueue((q) => [...q, extra])
        } else {
          finish(all)
          return
        }
      }
      setIndex(nextIndex)
      setEntry('')
      setStatus('asking')
      setRemaining(secondsPerQuestion ?? 0)
      askedAt.current = Date.now()
    },
    [index, queue.length, more, finish, secondsPerQuestion],
  )

  const submit = useCallback(
    (given: number | null) => {
      if (status !== 'asking' || !question) return
      const correct = given !== null && given === question.answer
      const answer: Answer = {
        question,
        given,
        correct,
        ms: Date.now() - askedAt.current,
      }
      const all = [...answers, answer]
      setStatus(correct ? 'correct' : 'wrong')
      setAnswers(all)
      const delay = correct ? FEEDBACK_MS : teachOnMistake ? TEACH_MS : FEEDBACK_MS
      window.setTimeout(() => advance(all), delay)
    },
    [status, question, answers, advance, teachOnMistake],
  )

  // Per-question countdown: running out counts as an unanswered attempt.
  useEffect(() => {
    if (!secondsPerQuestion || status !== 'asking') return
    const id = window.setInterval(() => {
      setRemaining((r) => {
        if (r <= 0.1) {
          submit(null)
          return 0
        }
        return r - 0.1
      })
    }, 100)
    return () => window.clearInterval(id)
  }, [secondsPerQuestion, status, submit])

  // Whole-run countdown for sparring.
  useEffect(() => {
    if (!totalSeconds) return
    const id = window.setInterval(() => {
      setTotalLeft((t) => {
        if (t <= 0.1) {
          window.clearInterval(id)
          finish(answers)
          return 0
        }
        return t - 0.1
      })
    }, 100)
    return () => window.clearInterval(id)
  }, [totalSeconds, answers, finish])

  useEffect(() => {
    askedAt.current = Date.now()
  }, [])

  const progress = useMemo(
    () => (secondsPerQuestion ? remaining / secondsPerQuestion : totalSeconds ? totalLeft / totalSeconds : 1),
    [remaining, secondsPerQuestion, totalLeft, totalSeconds],
  )

  if (!question) return null

  const symbol = question.kind === 'divide' ? fmt.divideSymbol : fmt.multiplySymbol
  const boxClass =
    status === 'correct' ? 'answer-box correct' : status === 'wrong' ? 'answer-box wrong' : 'answer-box'

  return (
    <div className="stack">
      <div className="row spread">
        <button type="button" className="btn btn-ghost btn-small" onClick={onQuit}>
          {t('common', 'leaveMat')}
        </button>
        <span className="chip" aria-live="off">
          {totalSeconds
            ? t('drill', 'secondsLeft', { seconds: Math.ceil(totalLeft) })
            : t('drill', 'questionOf', {
                current: Math.min(index + 1, queue.length),
                total: queue.length,
              })}
        </span>
      </div>

      {showTimer && (secondsPerQuestion || totalSeconds) ? (
        <div className="timer-track" aria-hidden="true">
          <div
            className="timer-fill"
            style={{ transform: `scaleX(${Math.max(0, Math.min(1, progress))})` }}
          />
        </div>
      ) : null}

      <div className="panel question">
        <div className="prompt">
          {question.left} {symbol} {question.right} = ?
        </div>
        <div className={boxClass} aria-live="polite">
          {status === 'wrong' && entry === '' ? '—' : entry || '?'}
        </div>
        <div className={`feedback ${status === 'correct' ? 'good' : 'calm'}`} role="status">
          {status === 'correct' && t('drill', 'correct')}
          {status === 'wrong' &&
            (teachOnMistake
              ? t('drill', 'wrongTeach', {
                  left: question.left,
                  symbol,
                  right: question.right,
                  answer: question.answer,
                })
              : t('drill', 'wrongQuick'))}
        </div>
        <NumberPad
          value={entry}
          onChange={setEntry}
          onSubmit={() => submit(entry === '' ? null : Number(entry))}
          disabled={status !== 'asking'}
        />
      </div>

      <div className="progress-dots" aria-hidden="true">
        {answers.slice(-40).map((a, i) => (
          <span key={i} className={`dot ${a.correct ? 'correct' : 'wrong'}`} />
        ))}
      </div>
    </div>
  )
}
