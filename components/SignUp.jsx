"use client"

import { useState } from "react"
import "./AuthPages.css"

export default function SignUp({ onSignUp, onBack, onSignIn }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  })
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (isSubmitting) return

    setError("")

    if (!formData.name || !formData.email || !formData.password) {
      setError("Please fill in all required fields")
      return
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }

    setIsSubmitting(true)
    try {
      // Make sure we always await a Promise (even if onSignUp is not async)
      // Also add a timeout so UI never gets stuck forever.
      const ok = await Promise.race([
        Promise.resolve(onSignUp(formData)),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Signup is taking too long. Please try again.")), 15000)
        ),
      ])

      // if ok is false, parent likely showed dialog; we just stay here
      if (!ok) return
    } catch (err) {
      setError(err?.message || "Sign up failed")
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
          <h1 className="auth-card__title">Join HCF</h1>
          <p className="auth-card__subtitle">Create your account to get started</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {error && <div className="auth-form__error">{error}</div>}

          <div className="auth-form__field">
            <label htmlFor="name">
              Full Name <span className="required">*</span>
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              autoComplete="name"
              disabled={isSubmitting}
            />
          </div>

          <div className="auth-form__field">
            <label htmlFor="email">
              Email <span className="required">*</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              autoComplete="email"
              disabled={isSubmitting}
            />
          </div>

          <div className="auth-form__field">
            <label htmlFor="password">
              Password <span className="required">*</span>
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password (min 6 characters)"
              autoComplete="new-password"
              disabled={isSubmitting}
            />
          </div>

          <div className="auth-form__field">
            <label htmlFor="phone">Phone Number (Optional)</label>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter your phone number"
              autoComplete="tel"
              disabled={isSubmitting}
            />
          </div>

          <button type="submit" className="auth-form__submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating account..." : "Sign Up"}
          </button>

          <div className="auth-form__divider">
            <span>Already have an account?</span>
          </div>

          <button type="button" className="auth-form__link" onClick={onSignIn} disabled={isSubmitting}>
            Sign in instead
          </button>
        </form>
      </div>
    </div>
  )
}