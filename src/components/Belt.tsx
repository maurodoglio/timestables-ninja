import { getBelt } from '../game/belts'
import type { BeltId } from '../game/types'

export function BeltBadge({ belt, label }: { belt: BeltId; label?: string }) {
  const b = getBelt(belt)
  return (
    <span
      className="belt-badge"
      style={{ background: b.color, color: b.ink }}
      title={b.name}
    >
      {label ?? b.name}
    </span>
  )
}

export function NinjaAvatar({ belt, size = 96 }: { belt: BeltId; size?: number }) {
  const b = getBelt(belt)
  return (
    <div
      className="avatar"
      style={{ color: b.color, width: size, height: size, fontSize: size * 0.38 }}
      role="img"
      aria-label={`Ninja wearing the ${b.name}`}
    >
      <span className="belt-ring" aria-hidden="true" />
      <span aria-hidden="true">{belt === 'master' ? '🥷' : '🥷'}</span>
    </div>
  )
}
