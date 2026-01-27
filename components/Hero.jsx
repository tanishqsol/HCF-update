"use client"

import { useEffect, useState } from "react"
import "./Hero.css"

import { initializeApp, getApps, getApp } from "firebase/app"
import { getAuth, onAuthStateChanged } from "firebase/auth"
import { getFirestore, doc, getDoc } from "firebase/firestore"

export default function Hero({ isDarkMode }) {
  const [isVisible, setIsVisible] = useState(false)
  const [scrollY, setScrollY] = useState(0)

  // ----- Language + user sync -----
  const LANG_STORAGE_KEY = "hcf_lang"
  const LANG_EVENT = "hcf:lang"
  const USER_NAME_STORAGE_KEY = "hcf_user_name"
  const USER_EVENT = "hcf:user"

  const [lang, setLang] = useState(() => {
    if (typeof window === "undefined") return "en"
    return window.localStorage.getItem(LANG_STORAGE_KEY) || "en"
  })

  const [userName, setUserName] = useState(() => {
    if (typeof window === "undefined") return ""
    return window.localStorage.getItem(USER_NAME_STORAGE_KEY) || ""
  })

  // Firebase (used only as a fallback to fetch name if it's missing in localStorage)
  const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyACe9qO583jAkoQrJsvX_Dp0tYdPtlgTsQ",
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "hcfprod.firebaseapp.com",
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "hcfprod",
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "hcfprod.firebasestorage.app",
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "158540586016",
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:158540586016:web:3070f5ac072c372f20f045",
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-Z68X6R3RTQ",
  }

  useEffect(() => {
    if (typeof window === "undefined") return

    // init from storage
    setLang(window.localStorage.getItem(LANG_STORAGE_KEY) || "en")
    const storedName = (window.localStorage.getItem(USER_NAME_STORAGE_KEY) || "").trim()
    setUserName(storedName)

    // listen to Navbar events
    const langHandler = (e) => {
      const next = e?.detail?.lang
      if (next) setLang(next)
    }

    // listen to auth/user events
    const userHandler = (e) => {
      const nextName = (e?.detail?.name || "").trim()
      setUserName(nextName)
      window.localStorage.setItem(USER_NAME_STORAGE_KEY, nextName)
    }

    window.addEventListener(LANG_EVENT, langHandler)
    window.addEventListener(USER_EVENT, userHandler)

    // Fallback: if name isn't in localStorage, try to fetch it from Firestore for the signed-in user
    let unsubscribeAuth = null
    if (!storedName) {
      try {
        const app = getApps().length ? getApp() : initializeApp(firebaseConfig)
        const auth = getAuth(app)
        const db = getFirestore(app)

        unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
          try {
            if (!user) return

            // If we already got a name meanwhile, don't fetch again
            const current = (window.localStorage.getItem(USER_NAME_STORAGE_KEY) || "").trim()
            if (current) {
              setUserName(current)
              return
            }

            const snap = await getDoc(doc(db, "users", user.uid))
            if (snap.exists()) {
              const fetchedName = (snap.data()?.name || "").trim()
              if (fetchedName) {
                window.localStorage.setItem(USER_NAME_STORAGE_KEY, fetchedName)
                setUserName(fetchedName)
                window.dispatchEvent(new CustomEvent(USER_EVENT, { detail: { name: fetchedName } }))
              }
            }
          } catch (err) {
            console.error("Hero name hydration failed:", err)
          }
        })
      } catch (err) {
        console.error("Firebase init failed in Hero:", err)
      }
    }

    return () => {
      window.removeEventListener(LANG_EVENT, langHandler)
      window.removeEventListener(USER_EVENT, userHandler)
      if (typeof unsubscribeAuth === "function") unsubscribeAuth()
    }
  }, [])

  const TEXT = {
    en: {
      title: "Hindi Christian Fellowship",
      subtitle: "of Greater Boston",
      tagline: "Speaking the truth about Jesus to Hindi speakers in Greater Boston",
      join: "Join Our Fellowship",
      learn: "Learn More",
      scroll: "Scroll to explore!!",
    },
    hi: {
      title: "हिंदी मसीही संगति",
      subtitle: "ग्रेटर बोस्टन",
      tagline: "ग्रेटर बोस्टन में हिंदी भाषियों के बीच यीशु के सत्य को साझा करना",
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
          {userName ? (lang === "hi" ? `स्वागत है ${userName} • ${t.title}` : `Welcome ${userName} to ${t.title}`) : t.title}
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
