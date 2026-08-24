import { GRADING_LENGTH, GRADING_PASS_RATIO, getBelt } from './belts'
import type { BeltId, FactStat, Question, SessionMode } from './types'
import { factKey } from './types'

export interface Answer {
  question: Question
  given: number | null
  correct: boolean
  ms: number
}

export const EMPTY_STAT: FactStat = {
  attempts: 0,
  correct: 0,
  avgMs: 0,
  lastSeen: 0,
  streak: 0,
}

/** Fold one answer into a fact's rolling statistics. */
export function updateStat(
  prev: FactStat | undefined,
  answer: Answer,
  now: number = Date.now(),
): FactStat {
  const base = prev ?? EMPTY_STAT
  const attempts = base.attempts + 1
  return {
    attempts,
    correct: base.correct + (answer.correct ? 1 : 0),
    avgMs: Math.round(base.avgMs + (answer.ms - base.avgMs) / attempts),
    lastSeen: now,
    streak: answer.correct ? base.streak + 1 : 0,
  }
}

export function applyAnswers(
  stats: Record<string, FactStat>,
  answers: Answer[],
  now: number = Date.now(),
): Record<string, FactStat> {
  const next = { ...stats }
  for (const answer of answers) {
    const key = factKey(answer.question.kind, answer.question.fact.a, answer.question.fact.b)
    next[key] = updateStat(next[key], answer, now)
  }
  return next
}

const MODE_MULTIPLIER: Record<SessionMode, number> = {
  training: 1,
  weak: 1.5,
  sparring: 1.5,
  grading: 2,
}

/**
 * XP for one answer: correct answers are worth 10, with a speed bonus of up to
 * 5 for answering under four seconds. Wrong answers still earn 1 for trying.
 */
export function xpForAnswer(answer: Answer, mode: SessionMode): number {
  if (!answer.correct) return 1
  const speedBonus = Math.max(0, Math.round(5 * (1 - answer.ms / 4000)))
  return Math.round((10 + speedBonus) * MODE_MULTIPLIER[mode])
}

export function xpForSession(answers: Answer[], mode: SessionMode): number {
  return answers.reduce((sum, a) => sum + xpForAnswer(a, mode), 0)
}

export function averageMs(answers: Answer[]): number {
  if (answers.length === 0) return 0
  return Math.round(answers.reduce((s, a) => s + a.ms, 0) / answers.length)
}

export interface GradingOutcome {
  passed: boolean
  correct: number
  total: number
  accuracy: number
  averageMs: number
  accuracyMet: boolean
  speedMet: boolean
  missed: Question[]
}

/** A grading is passed on accuracy AND speed; both must be met. */
export function evaluateGrading(answers: Answer[], target: BeltId): GradingOutcome {
  const belt = getBelt(target)
  const total = answers.length
  const correct = answers.filter((a) => a.correct).length
  const accuracy = total === 0 ? 0 : correct / total
  const avg = averageMs(answers)
  const accuracyMet = accuracy >= GRADING_PASS_RATIO
  const speedMet = total > 0 && avg <= belt.targetAverageSeconds * 1000
  return {
    passed: accuracyMet && speedMet && total >= GRADING_LENGTH,
    correct,
    total,
    accuracy,
    averageMs: avg,
    accuracyMet,
    speedMet,
    missed: answers.filter((a) => !a.correct).map((a) => a.question),
  }
}

export function toDayKey(date: Date | number): string {
  const d = typeof date === 'number' ? new Date(date) : date
  const m = `${d.getMonth() + 1}`.padStart(2, '0')
  const day = `${d.getDate()}`.padStart(2, '0')
  return `${d.getFullYear()}-${m}-${day}`
}

/** Streak grows on consecutive days, holds on the same day, resets otherwise. */
export function nextStreak(
  streakDays: number,
  lastTrainedOn: string | null,
  today: string,
): number {
  if (lastTrainedOn === today) return Math.max(streakDays, 1)
  if (lastTrainedOn === null) return 1
  const yesterday = toDayKey(new Date(`${today}T12:00:00`).getTime() - 86_400_000)
  return lastTrainedOn === yesterday ? streakDays + 1 : 1
}
