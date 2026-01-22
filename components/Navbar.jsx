"use client"

import { useState, useEffect, useMemo } from "react"
import "./Navbar.css"

export default function Navbar({
  isDarkMode,
  toggleTheme,
  isAuthenticated,
  onSignIn,
  onSignOut,
  onTeamsClick,
  onResourcesClick,
  onMusicClick,
}) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // ----- Language toggle (EN <-> HI) -----
  const LANG_STORAGE_KEY = "hcf_lang"
  const LANG_EVENT = "hcf:lang"

  const [lang, setLang] = useState("en")

  const TEXT = useMemo(
    () => ({
      en: {
        home: "Home",
        vision: "Vision",
        coreValues: "Core Values",
        team: "Team",
        volunteer: "Volunteer",
        musicVideos: "Music Videos",
        meetings: "Meetings",
        festivals: "Festivals",
        contact: "Contact",
        signIn: "Sign In",
        signOut: "Sign Out",
        toggleMenu: "Toggle menu",
        toggleTheme: "Toggle theme",
        toggleLanguage: "Toggle language",
      },
      hi: {
        home: "होम",
        vision: "दृष्टि",
        coreValues: "मूल्य",
        team: "टीम",
        volunteer: "सेवा",
        musicVideos: "संगीत वीडियो",
        meetings: "सभाएं",
        festivals: "उत्सव",
        contact: "संपर्क",
        signIn: "साइन इन",
        signOut: "साइन आउट",
        toggleMenu: "मेनू",
        toggleTheme: "थीम",
        toggleLanguage: "भाषा बदलें",
      },
    }),
    [],
  )

  const t = (key) => (TEXT[lang] && TEXT[lang][key]) || TEXT.en[key] || key

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    if (typeof window === "undefined") return

    // Default language should be English on load
    const initial = "en"
    setLang(initial)
    window.localStorage.setItem(LANG_STORAGE_KEY, initial)
    window.dispatchEvent(new CustomEvent(LANG_EVENT, { detail: { lang: initial } }))

    const handler = (e) => {
      const next = e?.detail?.lang
      if (next) setLang(next)
    }

    window.addEventListener(LANG_EVENT, handler)
    return () => window.removeEventListener(LANG_EVENT, handler)
  }, [])

  const toggleLang = () => {
    const next = lang === "en" ? "hi" : "en"
    setLang(next)

    if (typeof window !== "undefined") {
      window.localStorage.setItem(LANG_STORAGE_KEY, next)
      window.dispatchEvent(new CustomEvent(LANG_EVENT, { detail: { lang: next } }))
    }
  }

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
      setIsMobileMenuOpen(false)
    }
  }

  const navButtonStyle = isDarkMode ? { color: "#ffffff" } : {}

  return (
    <nav
      className={`navbar ${isScrolled ? "navbar--scrolled" : ""} ${
        isDarkMode ? "navbar--dark" : "navbar--light"
      }`}
    >
      <div className="navbar__container">
        <div className="navbar__logo" onClick={() => scrollToSection("hero")}> 
          <div className="navbar__logo-icon-wrapper">
            <img
              src="/images/HCF_logo_.png"
              alt="Hindi Christian Fellowship of Greater Boston logo"
              className="navbar__logo-image"
            />
          </div>
          <div className="navbar__logo-text">
            <div className="navbar__logo-main">HCF</div>
          </div>
        </div>

        <button
          className="navbar__mobile-toggle"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label={t("toggleMenu")}
          type="button"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <ul className={`navbar__menu ${isMobileMenuOpen ? "navbar__menu--open" : ""}`}>
          <li>
            <button style={navButtonStyle} onClick={() => scrollToSection("hero")} type="button">
              {t("home")}
            </button>
          </li>
          <li>
            <button style={navButtonStyle} onClick={() => scrollToSection("vision")} type="button">
              {t("vision")}
            </button>
          </li>
          <li>
            <button style={navButtonStyle} onClick={() => scrollToSection("values")} type="button">
              {t("coreValues")}
            </button>
          </li>
          {isAuthenticated && (
            <>
              <li className="navbar__menu-item--auth">
                <button className="authButtons" onClick={onTeamsClick} type="button">
                  {t("team")}
                </button>
              </li>
              <li className="navbar__menu-item--auth">
                <button className="authButtons" onClick={onResourcesClick} type="button">
                  {t("volunteer")}
                </button>
              </li>
              <li className="navbar__menu-item--auth">
                <button className="authButtons" onClick={onMusicClick} type="button">
                  {t("musicVideos")}
                </button>
              </li>
            </>
          )}
          <li>
            <button style={navButtonStyle} onClick={() => scrollToSection("meetings")} type="button">
              {t("meetings")}
            </button>
          </li>
          <li>
            <button style={navButtonStyle} onClick={() => scrollToSection("festivals")} type="button">
              {t("festivals")}
            </button>
          </li>
          <li>
            <button style={navButtonStyle} onClick={() => scrollToSection("contact")} type="button">
              {t("contact")}
            </button>
          </li>
        </ul>

        <div className="navbar__actions">
          {!isAuthenticated ? (
            <button className="navbar__signin-btn" onClick={onSignIn} type="button">
              {t("signIn")}
            </button>
          ) : (
            <button className="navbar__signout-btn" onClick={onSignOut} type="button">
              {t("signOut")}
            </button>
          )}

          <button
            className="navbar__lang-toggle"
            onClick={toggleLang}
            aria-label={t("toggleLanguage")}
            type="button"
          >
            {lang === "en" ? "हिंदी" : "English"}
          </button>

          <button
            className="navbar__theme-toggle"
            onClick={toggleTheme}
            aria-label={t("toggleTheme")}
            type="button"
          >
            <span className="theme-icon">{isDarkMode ? "☀" : "🌙"}</span>
          </button>
        </div>
      </div>
    </nav>
  )
}