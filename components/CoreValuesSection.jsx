"use client"

import { useEffect, useRef, useState } from "react"
import "./CoreValuesSection.css"

const coreValues = [
  {
    hindi: "Shishyata",
    english: "Discipleship",
    description: "We prioritize a deep, growing relationship with Jesus Christ as the foundation for all life and ministry. Our commitment is to teaching the Bible faithfully and equipping believers to become leaders and lifelong followers of Jesus (shishya).",
    icon: "✝️",
  },
  {
    hindi: "Samudaay",
    english: "Community",
    description: "We commit to creating a vibrant, multi-generational, biblical and inclusive family where every North Indian in Boston finds genuine love, support, and belonging. We value transparency, mutual encouragement, and spiritual authenticity.",
    icon: "🧑‍🤝‍🧑",
  },
  {
    hindi: "Sanskriti",
    english: "Culture",
    description: "We honor and celebrate the rich North Indian cultural identity while intentionally exploring how faith in Christ fully integrates with and transforms it. We believe faith should enrich, not erase, our cultural heritage.",
    icon: "🪔",
  },
  {
    hindi: "Sewa",
    english: "Service",
    description: "We demonstrate God's love through practical acts of Christlike service (Sewa) within the local North Indian community, actively helping newcomers adjust to life in a new country and building bridges of friendship and connection.",
    icon: "🙏",
  },
  {
    hindi: "Sampurnata",
    english: "Wholeness",
    description: "We are dedicated to the total (Sampurna) development (Vikas) of every individual—spiritually, intellectually, emotionally, and physically—understanding that true faith in Jesus impacts every part of our lives.",
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
