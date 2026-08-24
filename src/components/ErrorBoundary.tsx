import { Component, type ErrorInfo, type ReactNode } from 'react'
import { detectLanguage, translate } from '../i18n'
import { clearProfile } from '../state/storage'

interface Props {
  children: ReactNode
}

interface State {
  failed: boolean
}

/**
 * Last line of defence: a render-time throw anywhere in the app would otherwise
 * leave a blank page with no way out, so offer a reload and a way to erase a
 * damaged scroll.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { failed: false }

  static getDerivedStateFromError(): State {
    return { failed: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('The dojo crashed:', error, info.componentStack)
  }

  render(): ReactNode {
    if (!this.state.failed) return this.props.children

    const language = detectLanguage()
    const t = (key: 'title' | 'body' | 'reload' | 'reset' | 'resetConfirm') =>
      translate(language, 'errorScreen', key)

    return (
      <div className="app">
        <main className="shell">
          <div className="stack">
            <div className="panel stack" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '3.5rem' }} aria-hidden="true">
                📜
              </div>
              <h1>{t('title')}</h1>
              <p>{t('body')}</p>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => window.location.reload()}
              >
                {t('reload')}
              </button>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => {
                  if (!window.confirm(t('resetConfirm'))) return
                  clearProfile()
                  window.location.reload()
                }}
              >
                {t('reset')}
              </button>
            </div>
          </div>
        </main>
      </div>
    )
  }
}
