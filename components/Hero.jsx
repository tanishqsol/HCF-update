"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import "./Hero.css"

export default function Hero({ isDarkMode, onNotificationsClick }) {
  const [isVisible, setIsVisible] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const heroRef = useRef(null)
  const [mouse, setMouse] = useState({ x: 0, y: 0 })
  const [isPointerActive, setIsPointerActive] = useState(false)

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

    const handleScroll = () => setScrollY(window.scrollY)

    const handlePointerMove = (event) => {
      const rect = heroRef.current?.getBoundingClientRect()
      if (!rect) return

      const x = (event.clientX - rect.left) / rect.width - 0.5
      const y = (event.clientY - rect.top) / rect.height - 0.5
      setMouse({ x, y })
      setIsPointerActive(true)
    }

    const resetPointer = () => {
      setMouse({ x: 0, y: 0 })
      setIsPointerActive(false)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })

    const section = heroRef.current
    section?.addEventListener("pointermove", handlePointerMove)
    section?.addEventListener("pointerleave", resetPointer)

    return () => {
      window.removeEventListener("scroll", handleScroll)
      section?.removeEventListener("pointermove", handlePointerMove)
      section?.removeEventListener("pointerleave", resetPointer)
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

  const pointerX = mouse.x * 24
  const pointerY = mouse.y * 24
  const contentLift = Math.min(scrollY * 0.22, 90)
  const orbShiftX = isPointerActive ? pointerX : 0
  const orbShiftY = isPointerActive ? pointerY : 0

  return (
    <section
      ref={heroRef}
      id="hero"
      className={`hero ${showProfile ? "hero--profile-visible" : ""}`}
      // Push everything slightly lower to avoid mobile navbar overlap
      style={{ paddingTop: "clamp(72px, 9vh, 140px)" }}
    >
      <div
        className="hero__ambient hero__ambient--one"
        aria-hidden="true"
        style={{ transform: `translate3d(${orbShiftX * 0.55}px, ${scrollY * 0.1 + orbShiftY * 0.4}px, 0)` }}
      />
      <div
        className="hero__ambient hero__ambient--two"
        aria-hidden="true"
        style={{ transform: `translate3d(${-orbShiftX * 0.4}px, ${scrollY * 0.16 - orbShiftY * 0.3}px, 0)` }}
      />
      <div className="hero__grid" aria-hidden="true" />

      <div
        className="hero__background"
        style={{
          backgroundImage: isDarkMode ? `url(/images/jesus-night.jpeg)` : `url(/images/jesus-day.jpeg)`,
          transform: `translate3d(${pointerX * -0.35}px, ${scrollY * 0.34 + pointerY * -0.25}px, 0) scale(${1 + scrollY * 0.00018})`,
        }}
      />

      <div
        className="hero__overlay"
        style={{
          opacity: 0.42 + scrollY * 0.00035,
          transform: `translate3d(${pointerX * -0.18}px, ${pointerY * -0.18}px, 0)`,
        }}
      />

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
          transform: `translate3d(${pointerX * 0.28}px, ${-contentLift + pointerY * 0.18}px, 0)`,
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
