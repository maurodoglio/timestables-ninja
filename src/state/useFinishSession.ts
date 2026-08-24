import { useCallback } from 'react'
import { getAchievement } from '../state/achievements'
import { useProfile } from '../state/ProfileContext'
import { useToast } from '../components/Toast'
import type { RecordOptions } from '../state/session'

/**
 * Records a finished session and raises toasts for anything newly unlocked,
 * so every mode screen shares the same reward behaviour.
 */
export function useFinishSession() {
  const { finishSession } = useProfile()
  const toast = useToast()

  return useCallback(
    (options: RecordOptions) => {
      const outcome = finishSession(options)
      if (!outcome) return null
      for (const id of outcome.unlockedAchievements) {
        const a = getAchievement(id)
        if (a) toast({ icon: a.icon, title: `Scroll earned: ${a.name}`, body: a.description })
      }
      return outcome
    },
    [finishSession, toast],
  )
}
