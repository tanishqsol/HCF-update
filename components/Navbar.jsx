"use client"

import { useState, useEffect } from "react"
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

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
      setIsMobileMenuOpen(false)
    }
  }

  return (
    <nav className={`navbar ${isScrolled ? "navbar--scrolled" : ""}`}>
      <div className="navbar__container">
        <div className="navbar__logo" onClick={() => scrollToSection("hero")}>
          <div className="navbar__logo-icon-wrapper">
            <img
              src="/images/hcf-logo.png"
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
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <ul className={`navbar__menu ${isMobileMenuOpen ? "navbar__menu--open" : ""}`}>
          <li>
            <button onClick={() => scrollToSection("hero")}>Home</button>
          </li>
          <li>
            <button onClick={() => scrollToSection("vision")}>Vision</button>
          </li>
          <li>
            <button onClick={() => scrollToSection("values")}>Core Values</button>
          </li>
          {isAuthenticated && (
            <>
              <li className="navbar__menu-item--auth">
                <button class="authButtons" onClick={onTeamsClick}>Team</button>
              </li>
              <li className="navbar__menu-item--auth">
                <button class="authButtons" onClick={onResourcesClick}>Volunteer</button>
              </li>
              <li className="navbar__menu-item--auth">
                <button class="authButtons" onClick={onMusicClick}>Music Videos</button>
              </li>
            </>
          )}
          <li>
            <button onClick={() => scrollToSection("meetings")}>Meetings</button>
          </li>
          <li>
            <button onClick={() => scrollToSection("festivals")}>Festivals</button>
          </li>
          <li>
            <button onClick={() => scrollToSection("contact")}>Contact</button>
          </li>
        </ul>

        <div className="navbar__actions">
          {!isAuthenticated ? (
            <button className="navbar__signin-btn" onClick={onSignIn}>
              Sign In
            </button>
          ) : (
            <button className="navbar__signout-btn" onClick={onSignOut}>
              Sign Out
            </button>
          )}
          <button className="navbar__theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
            <span className="theme-icon">{isDarkMode ? "☀" : "🌙"}</span>
          </button>
        </div>
      </div>
    </nav>
  )
}
