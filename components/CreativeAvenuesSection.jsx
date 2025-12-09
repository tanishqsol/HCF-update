"use client"

import { useEffect, useRef, useState } from "react"
import "./CreativeAvenuesSection.css"

const festivals = [
  {
    name: "Roshni (Diwali)",
    description: "Diwali-themed gathering celebrating the light of Christ in our homes and community.",
    icon: "🪔",
  },
  {
    name: "Bhai-Behen Diwas (Raksha Bandhan)",
    description: "Raksha Bandhan / Rakhi–style celebration honoring the bond of brothers and sisters in Christ.",
    icon: "🎀",
  },
  {
    name: "Rangoli (Holi)",
    description: "Colorful Holi-inspired gathering rejoicing in the joy and grace of God.",
    icon: "🎨",
  },
  {
    name: "Vasant (Spring Festival)",
    description: "Spring festival alternative drawing from Baisaakhi, and Cheti Chand to celebrate new beginnings.",
    icon: "🌸",
  },
  {
    name: "Naya Saal (New Year)",
    description: "New Year gathering to pray, worship, and dedicate the year to God.",
    icon: "🎉",
  },
  {
    name: "Sewa (Feet Washing)",
    description: "Service-focused gathering centered on Jesus’ example of humility and serving others.",
    icon: "🦶",
  },
  {
    name: "Balidaan (Good Friday)",
    description: "Reflective service remembering the sacrifice of Jesus on Good Friday.",
    icon: "✝️",
  },
  {
    name: "Punahrithaan (Resurrection Sunday)",
    description: "Resurrection Sunday celebration of Christ’s victory over death.",
    icon: "🌅",
  },
  {
    name: "Phasal (Harvest Festival - Halloween)",
    description: "Harvest-themed alternative to Halloween, thanking God for His provision.",
    icon: "🌾",
  },
  {
    name: "Bada Din (Christmas)",
    description: "Christmas celebration focusing on the birth of Jesus, our Savior.",
    icon: "🎄",
  },
  {
    name: "Swantratra (India Independence Day)",
    description: "All-night prayer gathering seeking God together as a community.",
    icon: "🇮🇳",
  },
  {
    name: "Cricket World Cups",
    description: "Watch parties and gatherings around major Cricket World Cup matches.",
    icon: "🏏",
  },
  {
    name: "Career Counseling - Christian Professionals Day",
    description: "Events supporting students and professionals in their career journeys.",
    icon: "💼",
  },
  {
    name: "Jagran (All night prayer)",
    description: "All-night prayer gathering seeking God together as a community.",
    icon: "🌙",
  },
];

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
          <h2 className="creative-section__title">Cultural Activities</h2>
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
