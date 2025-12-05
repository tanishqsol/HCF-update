"use client"

import { useEffect, useRef, useState } from "react"
import "./CreativeAvenuesSection.css"

const festivals = [
  {
    name: "Roshni (Diwali)",
    description: "Celebrating Jesus as the true Light of the World during the festival of lights",
    icon: "🪔",
  },
  {
    name: "Raksha Bandhan",
    description: "Honoring the bond of protection and love in Christ",
    icon: "🎀",
  },
  {
    name: "Holi",
    description: "Rejoicing in the triumph of good over evil through Christ's victory",
    icon: "🎨",
  },
  {
    name: "Harvest Festival",
    description: "Giving thanks for God's provision and blessings",
    icon: "🌾",
  },
  {
    name: "Christmas",
    description: "Celebrating the birth of our Savior, Jesus Christ",
    icon: "🎄",
  },
  {
    name: "Easter",
    description: "Commemorating the resurrection and new life in Christ",
    icon: "✨",
  },
]

export default function CreativeAvenuesSection() {
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
    <section id="festivals" className="creative-section" ref={sectionRef}>
      <div className="creative-section__container">
        <div className={`creative-section__header ${isVisible ? "creative-section__header--visible" : ""}`}>
          <h2 className="creative-section__title">Creative Avenues</h2>
          <p className="creative-section__subtitle">Festivals & Gatherings</p>
          <p className="creative-section__intro">
            Celebrating our faith through culture, bringing together Indian traditions and Christian values
          </p>
        </div>
        <div className="creative-section__grid">
          {festivals.map((festival, index) => (
            <div
              key={index}
              className={`festival-card ${isVisible ? "festival-card--visible" : ""}`}
              style={{ transitionDelay: `${index * 0.1}s` }}
            >
              <div className="festival-card__icon">{festival.icon}</div>
              <h3 className="festival-card__name">{festival.name}</h3>
              <p className="festival-card__description">{festival.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
