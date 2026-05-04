"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import "./Hero.css"

export default function Hero({ isDarkMode, onNotificationsClick }) {
  const [isVisible, setIsVisible] = useState(false)
  const heroRef = useRef(null)
  const baseBgRef = useRef(null)
  const altBgRef = useRef(null)
  const overlayRef = useRef(null)

  const LANG_STORAGE_KEY = "hcf_lang"
  const LANG_EVENT = "hcf:lang"

  const USER_NAME_STORAGE_KEY = "hcf_user_name"
  const USER_PHOTO_STORAGE_KEY = "hcf_user_photo"
  const USER_EVENT = "hcf:user"

  const [mounted, setMounted] = useState(false)
  const [lang, setLang] = useState("en")

  const [userName, setUserName] = useState("")
  const [userPhoto, setUserPhoto] = useState("")
  const [centerProfile, setCenterProfile] = useState(false)

  const floatingOrnaments = useMemo(
    () => [
      { symbol: "✦", type: "star", left: "10%", top: "18%", size: "1.1rem", duration: "10s", delay: "-1.2s", drift: "14px" },
      { symbol: "✦", type: "star", left: "74%", top: "16%", size: "1.2rem", duration: "11s", delay: "-4.2s", drift: "16px" },
      { symbol: "❀", type: "flower", left: "13%", top: "42%", size: "1.35rem", duration: "13s", delay: "-2.4s", drift: "16px" },
      { symbol: "❁", type: "flower", left: "78%", top: "56%", size: "1.45rem", duration: "12s", delay: "-5.1s", drift: "18px" },
    ],
    []
  )

  const risingParticles = useMemo(
    () => [
      { left: "4%", size: "3px", duration: "4.8s", delay: "-1.4s", travel: "156px", opacity: 0.24 },
      { left: "9%", size: "4px", duration: "4.4s", delay: "-3.9s", travel: "168px", opacity: 0.3 },
      { left: "14%", size: "3px", duration: "5.1s", delay: "-2.2s", travel: "160px", opacity: 0.24 },
      { left: "20%", size: "4px", duration: "4.6s", delay: "-5.1s", travel: "176px", opacity: 0.32 },
      { left: "27%", size: "3px", duration: "4.9s", delay: "-1.8s", travel: "162px", opacity: 0.22 },
      { left: "33%", size: "4px", duration: "4.3s", delay: "-4.7s", travel: "178px", opacity: 0.3 },
      { left: "40%", size: "3px", duration: "5.2s", delay: "-2.7s", travel: "166px", opacity: 0.24 },
      { left: "46%", size: "4px", duration: "4.5s", delay: "-5.5s", travel: "182px", opacity: 0.32 },
      { left: "53%", size: "3px", duration: "4.7s", delay: "-3.1s", travel: "164px", opacity: 0.24 },
      { left: "59%", size: "4px", duration: "4.2s", delay: "-1.2s", travel: "174px", opacity: 0.3 },
      { left: "65%", size: "3px", duration: "5s", delay: "-4.1s", travel: "160px", opacity: 0.22 },
      { left: "71%", size: "4px", duration: "4.6s", delay: "-2.5s", travel: "180px", opacity: 0.32 },
      { left: "77%", size: "3px", duration: "4.8s", delay: "-5.8s", travel: "166px", opacity: 0.24 },
      { left: "83%", size: "4px", duration: "4.3s", delay: "-3.3s", travel: "176px", opacity: 0.3 },
      { left: "88%", size: "3px", duration: "5.1s", delay: "-1.6s", travel: "162px", opacity: 0.22 },
      { left: "92%", size: "4px", duration: "4.4s", delay: "-4.9s", travel: "184px", opacity: 0.32 },
      { left: "96%", size: "3px", duration: "4.7s", delay: "-2.9s", travel: "170px", opacity: 0.24 },
      { left: "98%", size: "4px", duration: "4.2s", delay: "-5.3s", travel: "178px", opacity: 0.3 },
    ],
    []
  )

  const TEXT = useMemo(
    () => ({
      en: {
        subtitle: "of Greater Boston",
        tagline: "Speaking the truth about Jesus to Hindi speakers in Greater Boston",
        join: "Join Our Fellowship",
        learn: "Learn More",
        notifications: "Get Event Alerts",
        notificationsBadge: "New",
        welcomeSub: "Welcome",
        welcomeTitle: "Welcome to Hindi Christian Fellowship",
      },
      hi: {
        subtitle: "ग्रेटर बोस्टन",
        tagline: "ग्रेटर बोस्टन की हिंदी मसीही संगति",
        join: "हमारी संगति में जुड़ें",
        learn: "और जानें",
        notifications: "इवेंट अलर्ट पाएं",
        notificationsBadge: "नया",
        welcomeSub: "स्वागत",
        welcomeTitle: "हिंदी क्रिस्टियन फेलोशिप में स्वागत",
      },
    }),
    []
  )

  const t = TEXT[lang] || TEXT.en

  const toTitleCase = (str = "") =>
    str
      .trim()
      .toLowerCase()
      .split(/\s+/)
      .filter(Boolean)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ")

  useEffect(() => {
    setMounted(true)

    // Read localStorage AFTER mount (prevents hydration mismatch)
    const storedLang = (window.localStorage.getItem(LANG_STORAGE_KEY) || "en").trim()
    setLang(storedLang)

    const storedName = toTitleCase(window.localStorage.getItem(USER_NAME_STORAGE_KEY) || "")
    const storedPhoto = (window.localStorage.getItem(USER_PHOTO_STORAGE_KEY) || "").trim()
    setUserName(storedName)
    setUserPhoto(storedPhoto)

    const langHandler = (e) => {
      const next = e?.detail?.lang
      if (!next) return

      // Preserve scroll position to avoid jump when language/text reflows
      const y = window.scrollY
      setLang(next)
      requestAnimationFrame(() => {
        window.scrollTo({ top: y, left: 0, behavior: "auto" })
      })
    }

    const userHandler = (e) => {
      const nextName = toTitleCase(e?.detail?.name || "")
      const nextPhoto = (e?.detail?.photoURL || "").trim()

      setUserName(nextName)
      setUserPhoto(nextPhoto)

      window.localStorage.setItem(USER_NAME_STORAGE_KEY, nextName)
      if (nextPhoto) window.localStorage.setItem(USER_PHOTO_STORAGE_KEY, nextPhoto)
    }

    window.addEventListener(LANG_EVENT, langHandler)
    window.addEventListener(USER_EVENT, userHandler)

    return () => {
      window.removeEventListener(LANG_EVENT, langHandler)
      window.removeEventListener(USER_EVENT, userHandler)
    }
  }, [])

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 900px)")
    const onChange = () => setCenterProfile(mq.matches)
    onChange()

    // Safari fallback
    if (mq.addEventListener) mq.addEventListener("change", onChange)
    else mq.addListener(onChange)

    return () => {
      if (mq.removeEventListener) mq.removeEventListener("change", onChange)
      else mq.removeListener(onChange)
    }
  }, [])

  useEffect(() => {
    setIsVisible(true)
  }, [])

  useEffect(() => {
    const preloadHandsDownImage = () => {
      const img = new window.Image()
      img.src = "/images/handsDown.png"
    }

    if ("requestIdleCallback" in window) {
      const idleId = window.requestIdleCallback(preloadHandsDownImage, { timeout: 1200 })
      return () => window.cancelIdleCallback(idleId)
    }

    const timeoutId = window.setTimeout(preloadHandsDownImage, 180)
    return () => window.clearTimeout(timeoutId)
  }, [])

  useEffect(() => {
    const hero = heroRef.current
    const baseBg = baseBgRef.current
    const altBg = altBgRef.current
    const overlay = overlayRef.current

    if (!hero || !baseBg || !altBg || !overlay) return

    let rafId = 0
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const isPhoneViewport = window.matchMedia("(max-width: 768px)").matches
    const enableBackgroundDrift = !prefersReducedMotion && !isPhoneViewport

    const updateHeroVisuals = () => {
      const scrollTop = window.scrollY
      const heroTop = hero.offsetTop
      const localScroll = Math.max(scrollTop - heroTop, 0)
      const transitionDistance = Math.max(hero.offsetHeight * (isPhoneViewport ? 0.42 : 0.52), 1)
      const progress = Math.min(localScroll / transitionDistance, 1)
      const backgroundShift = enableBackgroundDrift ? localScroll * 0.05 : 0
      const backgroundScale = enableBackgroundDrift ? 1 + localScroll * 0.00003 : 1
      const transformValue = `translate3d(0, ${backgroundShift}px, 0) scale(${backgroundScale})`

      baseBg.style.opacity = `${1 - progress}`
      altBg.style.opacity = `${progress}`
      baseBg.style.transform = transformValue
      altBg.style.transform = transformValue
      overlay.style.opacity = `${enableBackgroundDrift ? 0.42 + progress * 0.08 : 0.46 + progress * 0.04}`
    }

    const requestUpdate = () => {
      if (rafId) return
      rafId = window.requestAnimationFrame(() => {
        updateHeroVisuals()
        rafId = 0
      })
    }

    updateHeroVisuals()
    window.addEventListener("scroll", requestUpdate, { passive: true })
    window.addEventListener("resize", requestUpdate)

    return () => {
      window.removeEventListener("scroll", requestUpdate)
      window.removeEventListener("resize", requestUpdate)
      if (rafId) window.cancelAnimationFrame(rafId)
    }
  }, [])

  const fallbackAvatar = "/images/team/silhouette_male.png" // make sure this file exists

  const heroTitle = userName
    ? // when signed in we use the localized welcome title
      t.welcomeTitle
    : lang === "hi"
    ? "हिंदी क्रिस्टियन फेलोशिप में स्वागत है"
    : "Hindi Christian Fellowship"
  // const heroTitle = userName ? `Welcome ${userName} to Hindi Christian Fellowship` : "Hindi Christian Fellowship"

  // Don’t render the chip until mounted (avoids weird first paint)
  const showProfile = mounted && !!userName

  const baseHeroImage = isDarkMode ? "/images/jesus-night.jpeg" : "/images/jesus-day.jpeg"
  const handsDownImage = "/images/handsDown.png"

  return (
    <section
      ref={heroRef}
      id="hero"
      className={`hero ${showProfile ? "hero--profile-visible" : ""}`}
      // Push everything slightly lower to avoid mobile navbar overlap
      style={{ paddingTop: "clamp(72px, 9vh, 140px)" }}
    >
      <div
        ref={baseBgRef}
        className="hero__background hero__background--base"
        style={{
          backgroundImage: `url(${baseHeroImage})`,
          transform: "translate3d(0, 0, 0)",
        }}
      />

      <div
        ref={altBgRef}
        className="hero__background hero__background--alternate"
        style={{
          backgroundImage: `url(${handsDownImage})`,
          transform: "translate3d(0, 0, 0)",
        }}
      />

      <div ref={overlayRef} className="hero__overlay" />

      <div className="hero__ornaments" aria-hidden="true">
        {floatingOrnaments.map((ornament, index) => (
          <span
            key={`${ornament.type}-${index}`}
            className={`hero__ornament hero__ornament--${ornament.type}`}
            style={{
              left: ornament.left,
              top: ornament.top,
              fontSize: ornament.size,
              animationDuration: ornament.duration,
              animationDelay: ornament.delay,
              ["--hero-ornament-drift"]: ornament.drift,
            }}
          >
            {ornament.symbol}
          </span>
        ))}
      </div>

      <div className="hero__particles" aria-hidden="true">
        {risingParticles.map((particle, index) => (
          <span
            key={`particle-${index}`}
            className="hero__particle"
            style={{
              left: particle.left,
              width: particle.size,
              height: particle.size,
              animationDuration: particle.duration,
              animationDelay: particle.delay,
              opacity: particle.opacity,
              ["--hero-particle-travel"]: particle.travel,
            }}
          />
        ))}
      </div>

      {showProfile && (
        <div
          className="hero__profile"
          aria-label="Signed in user"
          style={
            centerProfile
              ? { left: "50%", right: "auto", transform: "translateX(-50%)", justifyContent: "center" }
              : undefined
          }
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="hero__profileImg"
            src={userPhoto || fallbackAvatar}
            alt={userName}
            onError={(e) => {
              // If stored photo fails, fall back to local avatar
              e.currentTarget.src = fallbackAvatar
            }}
          />
          <div className="hero__profileText">
            <div className="hero__profileName">{userName}</div>
            <div className="hero__profileSub">{t.welcomeSub}</div>
          </div>
        </div>
      )}

      <div
        className={`hero__content ${isVisible ? "hero__content--visible" : ""}`}
        style={{
          paddingBottom: "clamp(90px, 14vh, 160px)",
        }}
      >
        <h1 className="hero__title">
          {heroTitle}
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
          {/* <button
            className="hero__button hero__button--secondary"
            onClick={() => document.getElementById("vision")?.scrollIntoView({ behavior: "smooth" })}
          >
            {t.learn}
          </button> */}
          {onNotificationsClick && (
            <button
              className="hero__button hero__button--secondary hero__button--notifications"
              onClick={onNotificationsClick}
            >
              <span>{t.notifications}</span>
              <span className="hero__button-badge">{t.notificationsBadge}</span>
            </button>
          )}
        </div>
      </div>
    </section>
  )
}
