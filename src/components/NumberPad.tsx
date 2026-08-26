import { useEffect } from 'react'
import { useT } from '../i18n/useT'

interface NumberPadProps {
  value: string
  /**
   * Functional updater, mirroring React's setState signature. Rapid taps on a
   * tablet can fire several click events before a re-render happens, so
   * button handlers must derive the next value from the latest state rather
   * than from a `value` closed over at render time - otherwise fast taps get
   * silently dropped when later updates overwrite earlier ones.
   */
  onChange: (updater: (prev: string) => string) => void
  onSubmit: () => void
  disabled?: boolean
}

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9']
const MAX_LENGTH = 4

/**
 * Big-target keypad for tablets, with physical keyboard support so it also
 * works well on a school laptop.
 */
export function NumberPad({ value, onChange, onSubmit, disabled }: NumberPadProps) {
  const { t } = useT()
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (disabled) return
      if (e.key >= '0' && e.key <= '9') {
        onChange((prev) => (prev + e.key).slice(0, MAX_LENGTH))
      } else if (e.key === 'Backspace') {
        onChange((prev) => prev.slice(0, -1))
      } else if (e.key === 'Enter' && value.length > 0) {
        onSubmit()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [value, onChange, onSubmit, disabled])

  const press = (digit: string) => onChange((prev) => (prev + digit).slice(0, MAX_LENGTH))

  return (
    <div className="pad">
      {KEYS.map((k) => (
        <button key={k} type="button" onClick={() => press(k)} disabled={disabled}>
          {k}
        </button>
      ))}
      <button
        type="button"
        className="wide"
        onClick={() => onChange((prev) => prev.slice(0, -1))}
        disabled={disabled}
        aria-label={t('drill', 'deleteDigit')}
      >
        ⌫
      </button>
      <button type="button" onClick={() => press('0')} disabled={disabled}>
        0
      </button>
      <button
        type="button"
        className="wide"
        onClick={onSubmit}
        disabled={disabled || value.length === 0}
        aria-label={t('drill', 'submitAnswer')}
      >
        {t('drill', 'submit')}
      </button>
    </div>
  )
}
