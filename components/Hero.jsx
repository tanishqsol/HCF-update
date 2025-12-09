"use client"

import { useEffect, useState } from "react"
import "./Hero.css"

export default function Hero({ isDarkMode }) {
  const [isVisible, setIsVisible] = useState(false)
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    setIsVisible(true)

    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <section id="hero" className="hero">
      <div
        className="hero__background"
        style={{
          backgroundImage: isDarkMode ? `url(/images/jesus-night.jpeg)` : `url(/images/jesus-day.jpeg)`,
          transform: `translateY(${scrollY * 0.5}px) scale(${1 + scrollY * 0.0002})`,
        }}
      />
      <div className="hero__overlay" style={{ opacity: 0.4 + scrollY * 0.0005 }} />
      <div
        className={`hero__content ${isVisible ? "hero__content--visible" : ""}`}
        style={{ transform: `translateY(${-scrollY * 0.3}px)` }}
      >
        <h1 className="hero__title">
          Hindi Christian Fellowship
          <span className="hero__subtitle">of Greater Boston</span>
        </h1>
        <p className="hero__tagline">Speaking the truth about Jesus to Hindi speakers in Greater Boston</p>
        <div className="hero__buttons">
          <button
            className="hero__button hero__button--primary"
            onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
          >
            Join Our Fellowship
          </button>
          <button
            className="hero__button hero__button--secondary"
            onClick={() => document.getElementById("vision")?.scrollIntoView({ behavior: "smooth" })}
          >
            Learn More
          </button>
        </div>
      </div>
      <div className="hero__scroll-indicator">
        <span>Scroll to explore</span>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 5L12 19M12 19L19 12M12 19L5 12"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </section>
  )
}
