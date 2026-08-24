import { useEffect } from 'react'
import { useT } from '../i18n/useT'

interface NumberPadProps {
  value: string
  onChange: (next: string) => void
  onSubmit: () => void
  disabled?: boolean
}

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9']

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
        onChange((value + e.key).slice(0, 4))
      } else if (e.key === 'Backspace') {
        onChange(value.slice(0, -1))
      } else if (e.key === 'Enter') {
        onSubmit()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [value, onChange, onSubmit, disabled])

  const press = (digit: string) => onChange((value + digit).slice(0, 4))

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
        onClick={() => onChange(value.slice(0, -1))}
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
