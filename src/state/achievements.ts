import { beltIndex } from '../game/belts'
import { masteryLevel } from '../game/questions'
import type { Translations } from '../i18n/en'
import type { Profile, SessionResult } from '../game/types'

type AchievementKey = keyof Translations['achievements']

export interface Achievement {
  id: string
  /** Translation key for this achievement's name and description. */
  key: AchievementKey
  /** Translation key for the description. */
  descKey: AchievementKey
  icon: string
  earned: (profile: Profile, session?: SessionResult) => boolean
}

const masteredCount = (profile: Profile): number =>
  Object.values(profile.facts).filter((s) => masteryLevel(s) === 'mastered').length

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first-steps',
    key: 'firstSteps',
    descKey: 'firstStepsDesc',
    icon: '🥋',
    earned: (p) => p.history.length >= 1,
  },
  {
    id: 'perfect-kata',
    key: 'perfectKata',
    descKey: 'perfectKataDesc',
    icon: '🎯',
    earned: (_p, s) => !!s && s.total >= 10 && s.correct === s.total,
  },
  {
    id: 'dawn-trainer',
    key: 'dawnTrainer',
    descKey: 'dawnTrainerDesc',
    icon: '🌅',
    earned: (p) => p.streakDays >= 7,
  },
  {
    id: 'swift-hands',
    key: 'swiftHands',
    descKey: 'swiftHandsDesc',
    icon: '💨',
    earned: (_p, s) => !!s && s.total >= 10 && s.averageMs > 0 && s.averageMs < 3000,
  },
  {
    id: 'belt-collector',
    key: 'beltCollector',
    descKey: 'beltCollectorDesc',
    icon: '🟢',
    earned: (p) => beltIndex(p.belt) >= beltIndex('green'),
  },
  {
    id: 'sparring-star',
    key: 'sparringStar',
    descKey: 'sparringStarDesc',
    icon: '⚡',
    earned: (p) => p.sparringBest >= 30,
  },
  {
    id: 'fact-hunter',
    key: 'factHunter',
    descKey: 'factHunterDesc',
    icon: '📜',
    earned: (p) => masteredCount(p) >= 50,
  },
  {
    id: 'grandmaster',
    key: 'grandmaster',
    descKey: 'grandmasterDesc',
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
