"use client"

import { useEffect, useMemo, useState } from "react"
import "./Hero.css"

export default function Hero({ isDarkMode }) {
  const [isVisible, setIsVisible] = useState(false)
  const [scrollY, setScrollY] = useState(0)

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
        welcomeSub: "Welcome",
        welcomeTitle: "Welcome to Hindi Christian Fellowship",
      },
      hi: {
        subtitle: "ग्रेटर बोस्टन",
        tagline: "ग्रेटर बोस्टन में हिंदी भाषियों के बीच यीशु के सत्य को साझा करना",
        join: "हमारी संगति में जुड़ें",
        learn: "और जानें",
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
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
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

  return (
    <section
      id="hero"
      className="hero"
      // Push everything slightly lower to avoid mobile navbar overlap
      style={{ paddingTop: "clamp(72px, 9vh, 140px)" }}
    >
      <div
        className="hero__background"
        style={{
          backgroundImage: isDarkMode ? `url(/images/jesus-night.jpeg)` : `url(/images/jesus-day.jpeg)`,
          transform: `translateY(${scrollY * 0.5}px) scale(${1 + scrollY * 0.0002})`,
        }}
      />

      <div className="hero__overlay" style={{ opacity: 0.4 + scrollY * 0.0005 }} />

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
          transform: `translateY(${-scrollY * 0.3}px)`,
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
          <button
            className="hero__button hero__button--secondary"
            onClick={() => document.getElementById("vision")?.scrollIntoView({ behavior: "smooth" })}
          >
            {t.learn}
          </button>
        </div>
      </div>
    </section>
  )
}