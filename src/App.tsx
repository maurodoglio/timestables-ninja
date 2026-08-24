import { useEffect } from 'react'
import { Link, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { useProfile } from './state/ProfileContext'
import { BeltBadge } from './components/Belt'
import { Welcome } from './screens/Welcome'
import { Dojo } from './screens/Dojo'
import { TrainingHall } from './screens/TrainingHall'
import { Grading } from './screens/Grading'
import { WeakStances } from './screens/WeakStances'
import { Sparring } from './screens/Sparring'
import { ProgressScroll } from './screens/ProgressScroll'
import { Settings } from './screens/Settings'

export default function App() {
  const { profile } = useProfile()
  const location = useLocation()

  useEffect(() => {
    const root = document.documentElement
    root.dataset.readableFont = String(profile?.settings.readableFont ?? false)
    root.dataset.reducedMotion = String(profile?.settings.reducedMotion ?? false)
  }, [profile?.settings.readableFont, profile?.settings.reducedMotion])

  if (!profile) {
    return (
      <div className="app">
        <main className="shell">
          <Welcome />
        </main>
      </div>
    )
  }

  return (
    <div className="app">
      <header className="header">
        <div className="header-inner">
          <Link to="/" className="brand">
            <span aria-hidden="true">🥷</span> Times Tables Ninja
          </Link>
          <div className="row">
            <BeltBadge belt={profile.belt} />
            {location.pathname !== '/settings' && (
              <Link to="/settings" className="btn btn-small btn-ghost" aria-label="Dojo settings">
                ⚙️
              </Link>
            )}
          </div>
        </div>
      </header>
      <main className="shell">
        <Routes>
          <Route path="/" element={<Dojo />} />
          <Route path="/training" element={<TrainingHall />} />
          <Route path="/grading" element={<Grading />} />
          <Route path="/weak" element={<WeakStances />} />
          <Route path="/sparring" element={<Sparring />} />
          <Route path="/progress" element={<ProgressScroll />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  )
}
