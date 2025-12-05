"use client"

import { useState, useEffect } from "react"
import Navbar from "@/components/Navbar"
import Hero from "@/components/Hero"
import VisionSection from "@/components/VisionSection"
import CoreValuesSection from "@/components/CoreValuesSection"
import MeetingsSection from "@/components/MeetingsSection"
import CreativeAvenuesSection from "@/components/CreativeAvenuesSection"
import ContactSection from "@/components/ContactSection"
import Footer from "@/components/Footer"
import SignIn from "@/components/SignIn"
import SignUp from "@/components/SignUp"
import TeamsPage from "@/components/TeamsPage"
import ResourcesPage from "@/components/ResourcesPage"
import MusicVideosPage from "@/components/MusicVideosPage"
import CongratsModal from "@/components/CongratsModal"

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [scrollProgress, setScrollProgress] = useState(0)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [currentPage, setCurrentPage] = useState("home") // home, signin, signup, teams, resources, music
  const [showCongratsModal, setShowCongratsModal] = useState(false)

  useEffect(() => {
    document.documentElement.classList.toggle("dark-mode", isDarkMode)
  }, [isDarkMode])

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY })

      const xPercent = (e.clientX / window.innerWidth) * 100
      const yPercent = (e.clientY / window.innerHeight) * 100
      document.documentElement.style.setProperty("--mouse-x", `${xPercent}%`)
      document.documentElement.style.setProperty("--mouse-y", `${yPercent}%`)
    }

    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = (window.scrollY / totalHeight) * 100
      setScrollProgress(progress)
    }

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("scroll", handleScroll)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
  }

  const handleSignIn = (email, password) => {
    if (email === "admin@admin.com" && password === "12345") {
      setIsAuthenticated(true)
      setCurrentPage("home")
      setShowCongratsModal(true)
      return true
    }
    return false
  }

  const handleSignUp = (formData) => {
    setIsAuthenticated(true)
    setCurrentPage("home")
    setShowCongratsModal(true)
    return true
  }

  const handleSignOut = () => {
    setIsAuthenticated(false)
    setCurrentPage("home")
  }

  const navigateTo = (page) => {
    setCurrentPage(page)
    window.scrollTo(0, 0)
  }

  if (currentPage === "signin") {
    return (
      <div className="app-container">
        <div className="animated-mesh-bg" />
        <div className="floating-shapes">
          <div className="shape shape-1" />
          <div className="shape shape-2" />
          <div className="shape shape-3" />
        </div>
        <SignIn onSignIn={handleSignIn} onBack={() => navigateTo("home")} onSignUp={() => navigateTo("signup")} />
      </div>
    )
  }

  if (currentPage === "signup") {
    return (
      <div className="app-container">
        <div className="animated-mesh-bg" />
        <div className="floating-shapes">
          <div className="shape shape-1" />
          <div className="shape shape-2" />
          <div className="shape shape-3" />
        </div>
        <SignUp onSignUp={handleSignUp} onBack={() => navigateTo("home")} onSignIn={() => navigateTo("signin")} />
      </div>
    )
  }

  if (currentPage === "teams") {
    return (
      <div className="app-container">
        <div className="animated-mesh-bg" />
        <div className="floating-shapes">
          <div className="shape shape-1" />
          <div className="shape shape-2" />
          <div className="shape shape-3" />
        </div>
        <TeamsPage onBack={() => navigateTo("home")} isDarkMode={isDarkMode} />
      </div>
    )
  }

  if (currentPage === "resources") {
    return (
      <div className="app-container">
        <div className="animated-mesh-bg" />
        <div className="floating-shapes">
          <div className="shape shape-1" />
          <div className="shape shape-2" />
          <div className="shape shape-3" />
        </div>
        <ResourcesPage onBack={() => navigateTo("home")} isDarkMode={isDarkMode} />
      </div>
    )
  }

  if (currentPage === "music") {
    return (
      <div className="app-container">
        <div className="animated-mesh-bg" />
        <div className="floating-shapes">
          <div className="shape shape-1" />
          <div className="shape shape-2" />
          <div className="shape shape-3" />
        </div>
        <MusicVideosPage onBack={() => navigateTo("home")} isDarkMode={isDarkMode} />
      </div>
    )
  }

  return (
    <div className="app-container">
      <div className="animated-mesh-bg" />

      <div className="floating-shapes">
        <div className="shape shape-1" />
        <div className="shape shape-2" />
        <div className="shape shape-3" />
      </div>

      <div className="scroll-progress">
        <svg className="scroll-progress__circle" width="60" height="60">
          <circle className="scroll-progress__bg" cx="30" cy="30" r="26" fill="none" strokeWidth="3" />
          <circle
            className="scroll-progress__fill"
            cx="30"
            cy="30"
            r="26"
            fill="none"
            strokeWidth="3"
            strokeDasharray={`${2 * Math.PI * 26}`}
            strokeDashoffset={`${2 * Math.PI * 26 * (1 - scrollProgress / 100)}`}
          />
        </svg>
        <svg className="scroll-progress__cross" width="20" height="26" viewBox="0 0 20 26">
          <rect x="8" y="0" width="4" height="26" rx="1" fill="currentColor" />
          <rect x="3" y="7" width="14" height="4" rx="1" fill="currentColor" />
        </svg>
      </div>

      {showCongratsModal && <CongratsModal onClose={() => setShowCongratsModal(false)} />}

      <Navbar
        isDarkMode={isDarkMode}
        toggleTheme={toggleTheme}
        isAuthenticated={isAuthenticated}
        onSignIn={() => navigateTo("signin")}
        onSignOut={handleSignOut}
        onTeamsClick={() => navigateTo("teams")}
        onResourcesClick={() => navigateTo("resources")}
        onMusicClick={() => navigateTo("music")}
      />
      <Hero isDarkMode={isDarkMode} />
      <VisionSection />
      <CoreValuesSection />
      <MeetingsSection />
      <CreativeAvenuesSection />
      <ContactSection />
      <Footer />
    </div>
  )
}
