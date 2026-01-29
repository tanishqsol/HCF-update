"use client"

import { useState } from "react"
import "./AuthPages.css"

export default function SignIn({ onSignIn, onGoogleSignIn, onBack, onSignUp }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (isSubmitting) return

    setError("")

    if (!email || !password) {
      setError("Please fill in all fields")
      return
    }

    setIsSubmitting(true)
    try {
      const ok = await onSignIn(email, password)
      if (!ok) setError("Invalid email or password")
    } catch (err) {
      setError(err?.message || "Sign in failed")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleGoogle = async () => {
    if (isSubmitting) return
    setError("")
    setIsSubmitting(true)

    try {
      const ok = await onGoogleSignIn?.()
      if (!ok) setError("Google sign-in failed. Please try again.")
    } catch (err) {
      setError(err?.message || "Google sign-in failed")
      console.error("Google sign-in failed:", err?.code, err?.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="auth-page">
      <button className="auth-page__back" onClick={onBack} aria-label="Go back" type="button" disabled={isSubmitting}>
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
              disabled={isSubmitting}
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
              disabled={isSubmitting}
            />
          </div>

          <button type="submit" className="auth-form__submit" disabled={isSubmitting}>
            {isSubmitting ? "Signing in..." : "Sign In"}
          </button>

          <div className="auth-form__divider">
            <span>Don't have an account?</span>
          </div>

          <button type="button" className="auth-form__link" onClick={onSignUp} disabled={isSubmitting}>
            Create an account
          </button>

          <button
  type="button"
  className="google-btn"
  onClick={handleGoogle}
  disabled={isSubmitting}
>
  <span className="google-btn__icon" aria-hidden="true">
    {/* Google "G" SVG */}
    <svg width="20" height="20" viewBox="0 0 48 48">
      <path fill="#EA4335" d="M24 9.5c3.1 0 5.9 1.1 8 3.1l6-6C34.4 3.3 29.6 1.5 24 1.5 14.6 1.5 6.5 7 2.7 15l7 5.4C11.5 14 17.2 9.5 24 9.5z"/>
      <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-2.8-.4-4.1H24v7.8h12.7c-.3 2-1.9 5-5.2 7l8 6.2c4.7-4.3 7-10.6 7-17.9z"/>
      <path fill="#FBBC05" d="M9.7 28.4c-.5-1.4-.8-2.9-.8-4.4s.3-3 .8-4.4l-7-5.4C1.4 17 0.5 20.4 0.5 24s.9 7 2.2 10l7-5.6z"/>
      <path fill="#34A853" d="M24 46.5c5.6 0 10.4-1.9 13.9-5.2l-8-6.2c-2.1 1.5-4.9 2.6-8 2.6-6.8 0-12.5-4.5-14.4-10.6l-7 5.6C6.5 41 14.6 46.5 24 46.5z"/>
    </svg>
  </span>

  <span className="google-btn__text">
    {isSubmitting ? "Please wait..." : "Sign in with Google"}
  </span>
</button>
        </form>
      </div>
    </div>
  )
}