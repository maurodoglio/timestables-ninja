import { getBelt } from '../game/belts'
import { useT } from '../i18n/useT'
import type { BeltId } from '../game/types'

export function BeltBadge({ belt, label }: { belt: BeltId; label?: string }) {
  const b = getBelt(belt)
  const { t } = useT()
  const name = t('belts', belt)
  return (
    <span className="belt-badge" style={{ background: b.color, color: b.ink }} title={name}>
      {label ?? name}
    </span>
  )
}

export function NinjaAvatar({ belt, size = 96 }: { belt: BeltId; size?: number }) {
  const b = getBelt(belt)
  const { t } = useT()
  return (
    <div
      className="avatar"
      style={{ color: b.color, width: size, height: size, fontSize: size * 0.38 }}
      role="img"
      aria-label={t('belts', belt)}
    >
      <span className="belt-ring" aria-hidden="true" />
      <span aria-hidden="true">🥷</span>
    </div>
  )
}
