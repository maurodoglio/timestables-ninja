import { useState } from 'react'
import { useProfile } from '../state/ProfileContext'

export function Welcome() {
  const { startProfile } = useProfile()
  const [name, setName] = useState('')

  return (
    <div className="stack">
      <div className="panel stack" style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '3.5rem' }} aria-hidden="true">
          🥷
        </div>
        <h1>Welcome to the Dojo</h1>
        <p>
          Every ninja master started as a novice. Train your times tables, pass your gradings,
          and climb from white belt to Ninja Master.
        </p>
        <form
          className="stack"
          onSubmit={(e) => {
            e.preventDefault()
            startProfile(name)
          }}
        >
          <label htmlFor="name">What shall the sensei call you?</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your ninja name"
            maxLength={20}
            autoComplete="off"
          />
          <button type="submit" className="btn btn-primary">
            Join the dojo
          </button>
        </form>
        <p className="muted" style={{ fontSize: '0.85rem' }}>
          Everything stays on this device. No accounts, no data sent anywhere.
        </p>
      </div>
    </div>
  )
}
