"use client"

import { useEffect } from "react"
import "./CongratsModal.css"

export default function CongratsModal({ onClose }) {
  useEffect(() => {
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [])

  return (
    <div className="congrats-modal-overlay" onClick={onClose}>
      <div className="congrats-modal" onClick={(e) => e.stopPropagation()}>
        <div className="congrats-modal__icon">
          <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
            <circle cx="40" cy="40" r="38" stroke="url(#congratsGradient)" strokeWidth="3" />
            <path
              d="M25 40 L35 50 L55 30"
              stroke="url(#congratsGradient)"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <defs>
              <linearGradient id="congratsGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ff9933" />
                <stop offset="100%" stopColor="#138808" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <h2 className="congrats-modal__title">Congratulations!</h2>
        <p className="congrats-modal__message">
          You now have access to Team members, Resources, and other exclusive content.
        </p>

        <button className="congrats-modal__button" onClick={onClose}>
          Get Started
        </button>
      </div>
    </div>
  )
}
