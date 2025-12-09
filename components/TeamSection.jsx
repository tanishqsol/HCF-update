"use client"

import { useEffect, useRef, useState } from "react"
import "./TeamSection.css"

const coreTeam = [
  {
    name: "Dr. Shashi Jatiani",
    role: "Founder",
    description: "Leading HCF with vision and passion for reaching Hindi Speakers with the gospel.",
  },
  {
    name: "Asavari Jatiani",
    role: "Co-founder",
    description: "Co-leading the ministry with dedication to building community and discipleship.",
  },
  {
    name: "Tom Kane",
    role: "Partner",
    description: "Supporting the ministry with strategic partnership and guidance.",
  },
  {
    name: "Swaroop Pidakala",
    role: "Partner",
    description: "Partnering in ministry to expand the reach and impact of HCF.",
  },
  {
    name: "Mike Frost",
    role: "Partner",
    description: "Contributing partnership and support to the HCF mission.",
  },
  {
    name: "Gary McCann",
    role: "Networker, Prayer Partner",
    description: "Building connections and leading prayer ministry for HCF.",
  },
]

const keyVolunteers = [
  {
    name: "Kundan Srivastava",
    role: "Key Volunteer Leader",
    areas: "Prayer laborer, Outreach, Strategy",
  },
  {
    name: "Tanishq Solanki",
    role: "Key Volunteer Leader",
    areas: "Prayer laborer, Website designer & developer, Social Media",
  },
]

const volunteersNeeded = [
  "Keyboardist",
  "Guitarist",
  "Bookkeeper",
  "Facilitators",
  "Kitchen/food team",
  "Internal Auditor",
  "Graphic designer",
  "Event manager",
]

export default function TeamSection() {
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
    <section id="team" className="team-section" ref={sectionRef}>
      <div className="team-section__container">
        <div className={`team-section__header ${isVisible ? "team-section__header--visible" : ""}`}>
          <h2 className="team-section__title">HCF Core Team</h2>
          <p className="team-section__intro">Who we are</p>
        </div>

        <div className="team-section__core">
          <h3 className="team-section__subtitle">Leadership & Partners</h3>
          <div className="team-section__grid">
            {coreTeam.map((member, index) => (
              <div
                key={index}
                className={`team-card ${isVisible ? "team-card--visible" : ""}`}
                style={{ transitionDelay: `${index * 0.1}s` }}
              >
                <div className="team-card__avatar">
                  <span className="team-card__initial">{member.name.charAt(0)}</span>
                </div>
                <h4 className="team-card__name">{member.name}</h4>
                <p className="team-card__role">{member.role}</p>
                <p className="team-card__description">{member.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="team-section__volunteers">
          <h3 className="team-section__subtitle">Key Volunteer Leaders</h3>
          <div className="volunteer-list">
            {keyVolunteers.map((volunteer, index) => (
              <div
                key={index}
                className={`volunteer-card ${isVisible ? "volunteer-card--visible" : ""}`}
                style={{ transitionDelay: `${(coreTeam.length + index) * 0.1}s` }}
              >
                <div className="volunteer-card__avatar">
                  <span className="volunteer-card__initial">{volunteer.name.charAt(0)}</span>
                </div>
                <div className="volunteer-card__info">
                  <h5 className="volunteer-card__name">{volunteer.name}</h5>
                  <p className="volunteer-card__role">{volunteer.role}</p>
                  <p className="volunteer-card__areas">{volunteer.areas}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="team-section__needed">
          <h3 className="team-section__subtitle">Leaders/Volunteers Still Needed</h3>
          <div className="needed-list">
            {volunteersNeeded.map((role, index) => (
              <div
                key={index}
                className={`needed-item ${isVisible ? "needed-item--visible" : ""}`}
                style={{ transitionDelay: `${(coreTeam.length + keyVolunteers.length + index) * 0.08}s` }}
              >
                <span className="needed-item__icon">🔍</span>
                <span className="needed-item__text">{role}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
