"use client"

import { useEffect, useState } from "react"
import "./Hero.css"

export default function Hero({ isDarkMode }) {
  const [isVisible, setIsVisible] = useState(false)
  const [scrollY, setScrollY] = useState(0)

  // ----- Language sync (reads Navbar's toggle) -----
  const LANG_STORAGE_KEY = "hcf_lang"
  const LANG_EVENT = "hcf:lang"

  const [lang, setLang] = useState(() => {
    if (typeof window === "undefined") return "en"
    return window.localStorage.getItem(LANG_STORAGE_KEY) || "en"
  })

  useEffect(() => {
    if (typeof window === "undefined") return

    // init from storage
    setLang(window.localStorage.getItem(LANG_STORAGE_KEY) || "en")

    // listen to Navbar events
    const handler = (e) => {
      const next = e?.detail?.lang
      if (next) setLang(next)
    }

    window.addEventListener(LANG_EVENT, handler)
    return () => window.removeEventListener(LANG_EVENT, handler)
  }, [])

  const TEXT = {
    en: {
      title: "Hindi Christian Fellowship",
      subtitle: "of Greater Boston",
      tagline: "Speaking the truth about Jesus to Hindi speakers in Greater Boston",
      join: "Join Our Fellowship",
      learn: "Learn More",
      scroll: "Scroll to explore",
    },
    hi: {
      title: "हिंदी मसीही संगति",
      subtitle: "ग्रेटर बोस्टन",
      tagline: "ग्रेटर बोस्टन में हिंदी बोलने वालों तक यीशु के बारे में सत्य पहुँचाना",
      join: "हमारी संगति में जुड़ें",
      learn: "और जानें",
      scroll: "स्क्रॉल करें",
    },
  }

  const t = TEXT[lang] || TEXT.en

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
          {t.title}
          <span className="hero__subtitle">{t.subtitle}</span>
        </h1>
        <p className="hero__tagline">{t.tagline}</p>
        <div className="hero__buttons">
          <button
            className="hero__button hero__button--primary"
            onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
          >
            {t.join}
          </button>
          <button
            className="hero__button hero__button--secondary"
            onClick={() => document.getElementById("vision")?.scrollIntoView({ behavior: "smooth" })}
          >
            {t.learn}
          </button>
        </div>
      </div>
      <div className="hero__scroll-indicator">
        <span>{t.scroll}</span>
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
