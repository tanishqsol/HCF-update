"use client"

import { useEffect, useRef, useState } from "react"
import "./VisionSection.css"

const visionItems = [
  {
    title: "Evangelism & Discipleship",
    description:
      "Proclaim Jesus Christ as the only way of salvation, make disciples, and see individuals transformed by the renewing of their minds.",
    icon: "📖",
  },
  {
    title: "Community & Fellowship",
    description: "Build a close-knit spiritual family that supports one another in living out the gospel daily.",
    icon: "🤝",
  },
  {
    title: "Service & Outreach",
    description:
      "Reach out to the lost with compassion, particularly focusing on North Indians in the Greater Boston area.",
    icon: "❤️",
  },
  {
    title: "Holistic Growth",
    description:
      "Foster spiritual, emotional, and relational growth through biblical teaching and authentic relationships.",
    icon: "🌱",
  },
]

export default function VisionSection() {
  const [isVisible, setIsVisible] = useState(false)
  const [tiltStates, setTiltStates] = useState(visionItems.map(() => ({ x: 0, y: 0 })))
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

  const handleMouseMove = (e, index) => {
    const card = e.currentTarget
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const centerX = rect.width / 2
    const centerY = rect.height / 2

    const rotateX = (y - centerY) / 10
    const rotateY = (centerX - x) / 10

    setTiltStates((prev) => {
      const newStates = [...prev]
      newStates[index] = { x: rotateX, y: rotateY }
      return newStates
    })
  }

  const handleMouseLeave = (index) => {
    setTiltStates((prev) => {
      const newStates = [...prev]
      newStates[index] = { x: 0, y: 0 }
      return newStates
    })
  }

  return (
    <section id="vision" className="vision-section" ref={sectionRef}>
      <div className="vision-section__bg-gradient" />

      <div className="vision-section__container">
        <div className={`vision-section__header ${isVisible ? "vision-section__header--visible" : ""}`}>
          <h2 className="vision-section__title">
            <span className="text-reveal-word" style={{ animationDelay: "0s" }}>
              Our
            </span>{" "}
            <span className="text-reveal-word" style={{ animationDelay: "0.1s" }}>
              Vision
            </span>
          </h2>
          <p className="vision-section__intro">We are committed to building a thriving community centered on Christ</p>
        </div>
        <div className="vision-section__grid">
          {visionItems.map((item, index) => (
            <div
              key={index}
              className={`vision-card vision-card-3d ${isVisible ? "vision-card--visible" : ""}`}
              style={{
                transitionDelay: `${index * 0.1}s`,
                transform: `perspective(1000px) rotateX(${tiltStates[index].x}deg) rotateY(${tiltStates[index].y}deg) translateZ(10px)`,
              }}
              onMouseMove={(e) => handleMouseMove(e, index)}
              onMouseLeave={() => handleMouseLeave(index)}
            >
              <div className="vision-card__glow" />
              <div className="vision-card__icon">{item.icon}</div>
              <h3 className="vision-card__title">{item.title}</h3>
              <p className="vision-card__description">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
