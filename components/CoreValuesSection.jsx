"use client"

import { useEffect, useRef, useState } from "react"
import "./CoreValuesSection.css"

const coreValues = [
  {
    hindi: "Shishyata",
    english: "Discipleship",
    description: "Growing in Christ through learning, obedience, and spiritual transformation.",
    icon: "✝️",
  },
  {
    hindi: "Samudaay",
    english: "Community",
    description: "Building authentic relationships rooted in love, trust, and mutual support.",
    icon: "🧑‍🤝‍🧑",
  },
  {
    hindi: "Sanskriti",
    english: "Culture",
    description: "Honoring our Indian heritage while embracing the gospel of Jesus Christ.",
    icon: "🪔",
  },
  {
    hindi: "Sewa",
    english: "Service",
    description: "Serving others selflessly as an expression of Christ's love.",
    icon: "🙏",
  },
  {
    hindi: "Sampurnata",
    english: "Wholeness",
    description: "Pursuing complete spiritual, mental, and emotional well-being in Christ.",
    icon: "💫",
  },
]

export default function CoreValuesSection() {
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
    <section id="values" className="core-values-section" ref={sectionRef}>
      <div className="core-values-section__container">
        <div className={`core-values-section__header ${isVisible ? "core-values-section__header--visible" : ""}`}>
          <h2 className="core-values-section__title">Core Values</h2>
          {/* <p className="core-values-section__subtitle">मूल्य • Moolya</p> */}
          <p className="core-values-section__intro">The foundational principles that guide our fellowship</p>
        </div>
        <div className="core-values-section__grid">
          {coreValues.map((value, index) => (
            <div
              key={index}
              className={`value-card ${isVisible ? "value-card--visible" : ""}`}
              style={{ transitionDelay: `${index * 0.1}s` }}
            >
              <div className="value-card__icon">{value.icon}</div>
              <h4 className="value-card__english">{value.english}</h4>
              <h3 className="value-card__hindi"><i>{value.hindi}</i></h3>
              <p className="value-card__description">{value.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
