import { nextBelt } from '../game/belts'
import { applyAnswers, averageMs, nextStreak, toDayKey, xpForSession } from '../game/scoring'
import type { Answer } from '../game/scoring'
import type { Profile, SessionMode, SessionResult } from '../game/types'
import { newlyEarned } from './achievements'

export interface RecordOptions {
  mode: SessionMode
  answers: Answer[]
  /** Set for grading sessions: whether the belt test was passed. */
  passed?: boolean
  /** Sparring score, used to update the personal best. */
  sparringScore?: number
  now?: number
}

export interface RecordedSession {
  profile: Profile
  result: SessionResult
  unlockedAchievements: string[]
  promotedTo: Profile['belt'] | null
}

const HISTORY_LIMIT = 50

/**
 * Fold a finished session into the profile: fact stats, XP, streak, belt
 * promotion, history and achievements. Pure, so it is easy to test.
 */
export function recordSession(
  profile: Profile,
  { mode, answers, passed, sparringScore, now = Date.now() }: RecordOptions,
): RecordedSession {
  const today = toDayKey(now)
  const xpEarned = xpForSession(answers, mode)

  const result: SessionResult = {
    mode,
    belt: profile.belt,
    total: answers.length,
    correct: answers.filter((a) => a.correct).length,
    averageMs: averageMs(answers),
    xpEarned,
    passed,
    at: now,
  }

  const promotion = mode === 'grading' && passed ? nextBelt(profile.belt) : null

  let next: Profile = {
    ...profile,
    facts: applyAnswers(profile.facts, answers, now),
    xp: profile.xp + xpEarned,
    streakDays: answers.length > 0
      ? nextStreak(profile.streakDays, profile.lastTrainedOn, today)
      : profile.streakDays,
    lastTrainedOn: answers.length > 0 ? today : profile.lastTrainedOn,
    belt: promotion ? promotion.id : profile.belt,
    sparringBest:
      sparringScore !== undefined
        ? Math.max(profile.sparringBest, sparringScore)
        : profile.sparringBest,
    history: [result, ...profile.history].slice(0, HISTORY_LIMIT),
  }

  const unlocked = newlyEarned(next, result)
  if (unlocked.length > 0) {
    next = { ...next, achievements: [...next.achievements, ...unlocked] }
  }

  return {
    profile: next,
    result,
    unlockedAchievements: unlocked,
    promotedTo: promotion ? promotion.id : null,
  }
}
