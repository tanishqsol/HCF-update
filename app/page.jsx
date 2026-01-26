"use client"

import { useState, useEffect } from "react"
import { initializeApp, getApps, getApp } from "firebase/app"
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
} from "firebase/auth"
import { getFirestore, doc, setDoc, serverTimestamp } from "firebase/firestore"
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

const ADMIN_EMAILS = new Set([
  "mike@admin.com",
  "tom@admin.com",
  "shashi@admin.com",
  "tanishq@admin.com",
  "kundan@admin.com",
  "swaroop@admin.com"
])

const ADMIN_PASSWORD = "1234"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyACe9qO583jAkoQrJsvX_Dp0tYdPtlgTsQ",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "hcfprod.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "hcfprod",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "hcfprod.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "158540586016",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:158540586016:web:3070f5ac072c372f20f045",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-Z68X6R3RTQ",
}

const firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig)
const auth = getAuth(firebaseApp)
const db = getFirestore(firebaseApp)

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

  useEffect(() => {
    const saved = localStorage.getItem("isAuthenticated")
    if (saved === "true") {
      setIsAuthenticated(true)
    }
  }, [])

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
  }

  const handleSignIn = async (email, password) => {
    const normalizedEmail = (email || "").trim().toLowerCase()

    // Admin bypass (your existing behavior)
    if (ADMIN_EMAILS.has(normalizedEmail) && password === ADMIN_PASSWORD) {
      setIsAuthenticated(true)
      localStorage.setItem("isAuthenticated", "true")
      localStorage.setItem("adminEmail", normalizedEmail)
      setCurrentPage("home")
      setShowCongratsModal(true)
      return true
    }

    // Firebase sign-in
    try {
      const cred = await signInWithEmailAndPassword(auth, normalizedEmail, password)
      setIsAuthenticated(true)
      localStorage.setItem("isAuthenticated", "true")
      localStorage.setItem("userUid", cred.user.uid)
      localStorage.setItem("userEmail", normalizedEmail)
      setCurrentPage("home")
      setShowCongratsModal(true)
      return true
    } catch (err) {
      console.error("Firebase sign-in failed:", err)
      alert(err?.message || "Sign in failed")
      return false
    }
  }

  const handleSignUp = async (formData) => {
    try {
      const name = (formData?.name || "").trim()
      const email = (formData?.email || "").trim().toLowerCase()
      const password = formData?.password || ""
      const phone = (formData?.phone || "").trim()

      const cred = await createUserWithEmailAndPassword(auth, email, password)

      await setDoc(doc(db, "users", cred.user.uid), {
        name,
        email,
        phone: phone || null,
        createdAt: serverTimestamp(),
      })

      setIsAuthenticated(true)
      localStorage.setItem("isAuthenticated", "true")
      localStorage.setItem("userUid", cred.user.uid)
      localStorage.setItem("userEmail", email)

      setCurrentPage("home")
      setShowCongratsModal(true)
      return true
    } catch (err) {
      console.error("Firebase sign-up failed:", err)
      alert(err?.message || "Sign up failed")
      return false
    }
  }

  const handleSignOut = async () => {
    try {
      await firebaseSignOut(auth)
    } catch (e) {
      // ignore
    }
    setIsAuthenticated(false)
    localStorage.removeItem("isAuthenticated")
    localStorage.removeItem("adminEmail")
    localStorage.removeItem("userUid")
    localStorage.removeItem("userEmail")
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
