"use client"

import { useState } from "react"
import "./AuthPages.css"

export default function SignIn({ onSignIn, onBack, onSignUp }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    setError("")

    if (!email || !password) {
      setError("Please fill in all fields")
      return
    }

    const success = onSignIn(email, password)
    if (!success) {
      setError("Invalid email or password")
    }
  }

  return (
    <div className="auth-page">
      <button className="auth-page__back" onClick={onBack} aria-label="Go back">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        Back to Home
      </button>

      <div className="auth-card">
        <div className="auth-card__header">
          <div className="auth-card__logo">
            <svg width="60" height="70" viewBox="0 0 120 140" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="57" y="20" width="6" height="60" rx="1" fill="var(--color-primary)" />
              <rect x="45" y="40" width="30" height="6" rx="1" fill="var(--color-primary)" />
            </svg>
          </div>
          <h1 className="auth-card__title">Welcome Back</h1>
          <p className="auth-card__subtitle">Sign in to your HCF account</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {error && <div className="auth-form__error">{error}</div>}

          <div className="auth-form__field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              autoComplete="email"
            />
          </div>

          <div className="auth-form__field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              autoComplete="current-password"
            />
          </div>

          <button type="submit" className="auth-form__submit">
            Sign In
          </button>

          <div className="auth-form__divider">
            <span>Don't have an account?</span>
          </div>

          <button type="button" className="auth-form__link" onClick={onSignUp}>
            Create an account
          </button>
        </form>
      </div>
    </div>
  )
}
