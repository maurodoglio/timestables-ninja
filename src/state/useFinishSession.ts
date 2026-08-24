import { useCallback } from 'react'
import { getAchievement } from '../state/achievements'
import { useT } from '../i18n/useT'
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
  const { t } = useT()

  return useCallback(
    (options: RecordOptions) => {
      const outcome = finishSession(options)
      if (!outcome) return null
      for (const id of outcome.unlockedAchievements) {
        const a = getAchievement(id)
        if (a) {
          toast({
            icon: a.icon,
            title: t('achievements', 'scrollEarned', { name: t('achievements', a.key) }),
            body: t('achievements', a.descKey),
          })
        }
      }
      return outcome
    },
    [finishSession, toast, t],
  )
}
