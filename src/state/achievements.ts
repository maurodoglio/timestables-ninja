import { beltIndex } from '../game/belts'
import { masteryLevel } from '../game/questions'
import type { Profile, SessionResult } from '../game/types'

export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  earned: (profile: Profile, session?: SessionResult) => boolean
}

const masteredCount = (profile: Profile): number =>
  Object.values(profile.facts).filter((s) => masteryLevel(s) === 'mastered').length

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first-steps',
    name: 'First Steps',
    description: 'Finish your first training session.',
    icon: '🥋',
    earned: (p) => p.history.length >= 1,
  },
  {
    id: 'perfect-kata',
    name: 'Perfect Kata',
    description: 'Answer every question in a session correctly.',
    icon: '🎯',
    earned: (_p, s) => !!s && s.total >= 10 && s.correct === s.total,
  },
  {
    id: 'dawn-trainer',
    name: 'Dawn Trainer',
    description: 'Train seven days in a row.',
    icon: '🌅',
    earned: (p) => p.streakDays >= 7,
  },
  {
    id: 'swift-hands',
    name: 'Swift Hands',
    description: 'Average under three seconds per answer in a session.',
    icon: '💨',
    earned: (_p, s) => !!s && s.total >= 10 && s.averageMs > 0 && s.averageMs < 3000,
  },
  {
    id: 'belt-collector',
    name: 'Belt Collector',
    description: 'Earn the green belt.',
    icon: '🟢',
    earned: (p) => beltIndex(p.belt) >= beltIndex('green'),
  },
  {
    id: 'sparring-star',
    name: 'Sparring Star',
    description: 'Score 30 or more in a sparring run.',
    icon: '⚡',
    earned: (p) => p.sparringBest >= 30,
  },
  {
    id: 'fact-hunter',
    name: 'Fact Hunter',
    description: 'Master 50 different facts.',
    icon: '📜',
    earned: (p) => masteredCount(p) >= 50,
  },
  {
    id: 'grandmaster',
    name: 'Grandmaster',
    description: 'Reach the rank of Ninja Master.',
    icon: '🏆',
    earned: (p) => p.belt === 'master',
  },
]

/** Achievement ids newly unlocked by the given profile state. */
export function newlyEarned(profile: Profile, session?: SessionResult): string[] {
  return ACHIEVEMENTS.filter(
    (a) => !profile.achievements.includes(a.id) && a.earned(profile, session),
  ).map((a) => a.id)
}

export function getAchievement(id: string): Achievement | undefined {
  return ACHIEVEMENTS.find((a) => a.id === id)
}
