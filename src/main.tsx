import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './App'
import { ProfileProvider } from './state/ProfileContext'
import { ToastProvider } from './components/Toast'
import './styles/theme.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <ProfileProvider>
        <ToastProvider>
          <App />
        </ToastProvider>
      </ProfileProvider>
    </HashRouter>
  </StrictMode>,
)
