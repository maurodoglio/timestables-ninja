import type { Answer } from '@timestables-ninja/core'
import { formatStars } from '@timestables-ninja/core'
import { useT } from '../i18n/useT'

interface Props {
  title: string
  answers: Answer[]
  xpEarned: number
  children?: React.ReactNode
  onAgain?: () => void
  onHome: () => void
}

export function ResultSummary({ title, answers, xpEarned, children, onAgain, onHome }: Props) {
  const { t, fmt } = useT()
  const correct = answers.filter((a) => a.correct).length
  const avg = answers.length
    ? Math.round(answers.reduce((s, a) => s + a.ms, 0) / answers.length) / 1000
    : 0
  const missed = answers.filter((a) => !a.correct)

  return (
    <div className="stack">
      <div className="panel stack">
        <h1>{title}</h1>
        {children}
        <div className="grid">
          <div className="stat">
            <div className="value">
              {correct}/{answers.length}
            </div>
            <div className="label">{t('result', 'strikesLanded')}</div>
          </div>
          <div className="stat">
            <div className="value">{fmt.number(avg, 1)}s</div>
            <div className="label">{t('result', 'averageSpeed')}</div>
          </div>
          <div className="stat">
            <div className="value">{formatStars(xpEarned)}</div>
            <div className="label">{t('result', 'trainingPoints')}</div>
          </div>
        </div>

        {missed.length > 0 && (
          <div>
            <h3>{t('result', 'stancesToPractise')}</h3>
            <div className="row">
              {missed.slice(0, 12).map((a, i) => (
                <span className="chip" key={i}>
                  {a.question.left}{' '}
                  {a.question.kind === 'divide' ? fmt.divideSymbol : fmt.multiplySymbol}{' '}
                  {a.question.right} = {a.question.answer}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="row">
          {onAgain && (
            <button type="button" className="btn btn-primary" onClick={onAgain}>
              {t('common', 'trainAgain')}
            </button>
          )}
          <button type="button" className="btn" onClick={onHome}>
            {t('common', 'backToDojo')}
          </button>
        </div>
      </div>
    </div>
  )
}
