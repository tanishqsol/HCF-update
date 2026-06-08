"use client"

import { useEffect, useMemo, useState } from "react"
import MagicRings from "./MagicRings"
import "./Hero.css"

export default function Hero({ isDarkMode, onNotificationsClick }) {
  const [isVisible, setIsVisible] = useState(false)

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

  const TEXT = useMemo(
    () => ({
      en: {
        subtitle: "of Greater Boston",
        tagline: "Revealing the truth about Jesus to Hindi speakers in Greater Boston and beyond",
        join: "Join Our Fellowship",
        learn: "Learn More",
        notifications: "Fellowship Schedule",
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

  return (
    <section
      id="hero"
      className={`hero ${showProfile ? "hero--profile-visible" : ""}`}
      // Push everything slightly lower to avoid mobile navbar overlap
      style={{ paddingTop: "clamp(72px, 9vh, 140px)" }}
    >
      <div
        className="hero__background hero__background--base"
        style={{
          backgroundImage: `url(${baseHeroImage})`,
        }}
      />

      <div className="hero__overlay" />

      <div className="hero__magic-rings" aria-hidden="true">
        <div className="hero__magic-ringsInner">
          <MagicRings
            lineThickness={3}
            speed={0.5}
            baseRadius={0.25}
            noiseAmount={0}
            blur={0}
            ringGap={1.3}
            mouseInfluence={0.55}
            parallax={0.045}
            fadeIn={0.5}
            color="#ffad5a"
            colorTwo="#ffffff"
            colorThree="#138808"
            ringCount={6}
            attenuation={11}
            opacity={0.42}
            radiusStep={0.09}
            scaleRate={0.09}
            followMouse={false}
            clickBurst={false}
            hoverScale={1.04}
          />
        </div>
      </div>

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
