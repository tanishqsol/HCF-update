"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import "./Hero.css"

export default function Hero({ isDarkMode, onNotificationsClick }) {
  const [isVisible, setIsVisible] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const [viewportHeight, setViewportHeight] = useState(0)
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

  const floatingOrnaments = useMemo(
    () => [
      { symbol: "✦", type: "star", left: "7%", top: "16%", size: "1.35rem", duration: "7.5s", delay: "-1.2s", drift: "20px" },
      { symbol: "✶", type: "star", left: "14%", top: "60%", size: "1.05rem", duration: "9.5s", delay: "-4s", drift: "26px" },
      { symbol: "✦", type: "star", left: "22%", top: "28%", size: "1rem", duration: "8.6s", delay: "-6.5s", drift: "16px" },
      { symbol: "✧", type: "star", left: "31%", top: "72%", size: "0.95rem", duration: "7.8s", delay: "-2.8s", drift: "18px" },
      { symbol: "✦", type: "star", left: "68%", top: "14%", size: "1.2rem", duration: "8.8s", delay: "-5.2s", drift: "18px" },
      { symbol: "✶", type: "star", left: "76%", top: "18%", size: "1.55rem", duration: "8.2s", delay: "-3.1s", drift: "22px" },
      { symbol: "✧", type: "star", left: "82%", top: "52%", size: "1rem", duration: "7.4s", delay: "-7.1s", drift: "16px" },
      { symbol: "✦", type: "star", left: "90%", top: "30%", size: "1.15rem", duration: "9.1s", delay: "-2.3s", drift: "20px" },
      { symbol: "❀", type: "flower", left: "10%", top: "40%", size: "1.6rem", duration: "10.8s", delay: "-3.4s", drift: "22px" },
      { symbol: "✿", type: "flower", left: "19%", top: "78%", size: "1.3rem", duration: "11.6s", delay: "-6.2s", drift: "18px" },
      { symbol: "❁", type: "flower", left: "62%", top: "58%", size: "1.4rem", duration: "9.8s", delay: "-1.2s", drift: "24px" },
      { symbol: "✾", type: "flower", left: "67%", top: "36%", size: "1.35rem", duration: "10.2s", delay: "-4.7s", drift: "22px" },
      { symbol: "❀", type: "flower", left: "71%", top: "68%", size: "1.55rem", duration: "11.4s", delay: "-2.6s", drift: "26px" },
      { symbol: "✿", type: "flower", left: "75%", top: "43%", size: "1.2rem", duration: "9.4s", delay: "-5.6s", drift: "18px" },
      { symbol: "❁", type: "flower", left: "79%", top: "60%", size: "1.7rem", duration: "10.7s", delay: "-3.8s", drift: "24px" },
      { symbol: "✾", type: "flower", left: "85%", top: "36%", size: "1.15rem", duration: "8.9s", delay: "-6.9s", drift: "20px" },
      { symbol: "❀", type: "flower", left: "88%", top: "66%", size: "1.28rem", duration: "11.1s", delay: "-2.1s", drift: "20px" },
    ],
    []
  )

  const risingParticles = useMemo(
    () => [
      { left: "2%", size: "5px", duration: "5.8s", delay: "-0.8s", travel: "190px", opacity: 0.38 },
      { left: "5%", size: "7px", duration: "6.1s", delay: "-3.6s", travel: "220px", opacity: 0.54 },
      { left: "8%", size: "4px", duration: "4.9s", delay: "-1.9s", travel: "168px", opacity: 0.3 },
      { left: "11%", size: "6px", duration: "5.4s", delay: "-5.1s", travel: "205px", opacity: 0.42 },
      { left: "14%", size: "8px", duration: "6.4s", delay: "-2.2s", travel: "230px", opacity: 0.58 },
      { left: "17%", size: "5px", duration: "5.2s", delay: "-4.7s", travel: "176px", opacity: 0.36 },
      { left: "20%", size: "7px", duration: "6.7s", delay: "-0.5s", travel: "214px", opacity: 0.5 },
      { left: "23%", size: "4px", duration: "4.7s", delay: "-3.4s", travel: "160px", opacity: 0.28 },
      { left: "26%", size: "6px", duration: "5.6s", delay: "-2.9s", travel: "188px", opacity: 0.41 },
      { left: "29%", size: "8px", duration: "6.2s", delay: "-5.8s", travel: "224px", opacity: 0.55 },
      { left: "32%", size: "5px", duration: "5.1s", delay: "-1.6s", travel: "180px", opacity: 0.35 },
      { left: "35%", size: "7px", duration: "6.5s", delay: "-4.2s", travel: "216px", opacity: 0.48 },
      { left: "38%", size: "4px", duration: "4.8s", delay: "-0.9s", travel: "164px", opacity: 0.29 },
      { left: "41%", size: "6px", duration: "5.5s", delay: "-3.1s", travel: "194px", opacity: 0.4 },
      { left: "44%", size: "9px", duration: "6.9s", delay: "-5.4s", travel: "238px", opacity: 0.62 },
      { left: "47%", size: "5px", duration: "5s", delay: "-2.7s", travel: "174px", opacity: 0.34 },
      { left: "50%", size: "7px", duration: "6.3s", delay: "-4.9s", travel: "208px", opacity: 0.52 },
      { left: "53%", size: "4px", duration: "4.6s", delay: "-1.3s", travel: "156px", opacity: 0.27 },
      { left: "56%", size: "6px", duration: "5.7s", delay: "-3.8s", travel: "198px", opacity: 0.39 },
      { left: "59%", size: "8px", duration: "6.6s", delay: "-0.4s", travel: "228px", opacity: 0.57 },
      { left: "62%", size: "5px", duration: "5.3s", delay: "-5.6s", travel: "184px", opacity: 0.37 },
      { left: "65%", size: "7px", duration: "6.1s", delay: "-2.5s", travel: "212px", opacity: 0.49 },
      { left: "68%", size: "9px", duration: "6.8s", delay: "-4.4s", travel: "242px", opacity: 0.64 },
      { left: "71%", size: "4px", duration: "4.9s", delay: "-1.7s", travel: "162px", opacity: 0.31 },
      { left: "74%", size: "6px", duration: "5.8s", delay: "-3.3s", travel: "202px", opacity: 0.43 },
      { left: "77%", size: "8px", duration: "6.4s", delay: "-5s", travel: "222px", opacity: 0.56 },
      { left: "80%", size: "5px", duration: "5.2s", delay: "-0.6s", travel: "178px", opacity: 0.35 },
      { left: "83%", size: "7px", duration: "6s", delay: "-2.8s", travel: "206px", opacity: 0.47 },
      { left: "86%", size: "4px", duration: "4.5s", delay: "-4.6s", travel: "150px", opacity: 0.25 },
      { left: "89%", size: "6px", duration: "5.6s", delay: "-1.1s", travel: "192px", opacity: 0.4 },
      { left: "92%", size: "8px", duration: "6.3s", delay: "-3.9s", travel: "226px", opacity: 0.54 },
      { left: "95%", size: "5px", duration: "5.1s", delay: "-5.2s", travel: "172px", opacity: 0.33 },
      { left: "98%", size: "4px", duration: "4.7s", delay: "-2.4s", travel: "158px", opacity: 0.24 },
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

    const syncViewport = () => setViewportHeight(window.innerHeight)
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

    syncViewport()
    window.addEventListener("scroll", handleScroll, { passive: true })
    window.addEventListener("resize", syncViewport)

    const section = heroRef.current
    section?.addEventListener("pointermove", handlePointerMove)
    section?.addEventListener("pointerleave", resetPointer)

    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("resize", syncViewport)
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
  const heroScrollDistance = Math.max((heroRef.current?.offsetHeight || 0) - viewportHeight, 1)
  const heroTransitionDistance = Math.max(heroScrollDistance * 0.82, 1)
  const heroImageProgress = Math.min(scrollY / heroTransitionDistance, 1)
  const baseHeroImage = isDarkMode ? "/images/jesus-night.jpeg" : "/images/jesus-day.jpeg"
  const handsDownImage = "/images/handsDown.png"
  const backgroundTransform = `translate3d(${pointerX * -0.35}px, ${scrollY * 0.34 + pointerY * -0.25}px, 0) scale(${1 + scrollY * 0.00018})`

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
        className="hero__background hero__background--base"
        style={{
          backgroundImage: `url(${baseHeroImage})`,
          transform: backgroundTransform,
          opacity: 1 - heroImageProgress,
        }}
      />

      <div
        className="hero__background hero__background--alternate"
        style={{
          backgroundImage: `url(${handsDownImage})`,
          transform: backgroundTransform,
          opacity: heroImageProgress,
        }}
      />

      <div
        className="hero__overlay"
        style={{
          opacity: 0.42 + scrollY * 0.00035,
          transform: `translate3d(${pointerX * -0.18}px, ${pointerY * -0.18}px, 0)`,
        }}
      />

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
