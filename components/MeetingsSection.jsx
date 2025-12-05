"use client"

import { useEffect, useRef, useState } from "react"
import "./MeetingsSection.css"

const activities = [
  { name: "Worship", icon: "🎵", description: "Heartfelt praise and adoration" },
  { name: "Prayer", icon: "🙏", description: "Communal intercession and thanksgiving" },
  { name: "Word", icon: "📖", description: "Biblical teaching and reflection" },
  { name: "Songs", icon: "🎶", description: "Hindi, Urdu, and English worship" },
  { name: "Giving", icon: "💝", description: "Generous stewardship and offerings" },
  { name: "Fellowship", icon: "☕", description: "Building authentic relationships" },
]

export default function MeetingsSection() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true)
          }
        })
      },
      { threshold: 0.1 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current)
      }
    }
  }, [])

  return (
    <section id="meetings" className="meetings-section" ref={sectionRef}>
      <div className="meetings-section__container">
        <div className={`meetings-section__header ${isVisible ? "meetings-section__header--visible" : ""}`}>
          <h2 className="meetings-section__title">HCF Meetings</h2>
          <p className="meetings-section__subtitle">What We Will Do</p>
        </div>
        <div className="meetings-section__grid">
          {activities.map((activity, index) => (
            <div
              key={index}
              className={`activity-card ${isVisible ? "activity-card--visible" : ""}`}
              style={{ transitionDelay: `${index * 0.1}s` }}
            >
              <div className="activity-card__icon">{activity.icon}</div>
              <h3 className="activity-card__name">{activity.name}</h3>
              <p className="activity-card__description">{activity.description}</p>
            </div>
          ))}
        </div>
        <div className={`meetings-section__cta ${isVisible ? "meetings-section__cta--visible" : ""}`}>
          <p className="meetings-section__prayer">Let us pray together and seek God's will for our fellowship</p>
          <button
            className="meetings-section__button"
            onClick={() => document.getElementById("contact").scrollIntoView({ behavior: "smooth" })}
          >
            Join a Meeting
          </button>
        </div>
      </div>
    </section>
  )
}
