"use client"

import { useState, useEffect } from "react"
import { initializeApp, getApps, getApp } from "firebase/app"
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
} from "firebase/auth"
import { getFirestore, doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore"

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

const ADMIN_EMAILS = new Set([
  "mike@admin.com",
  "tom@admin.com",
  "shashi@admin.com",
  "tanishq@admin.com",
  "kundan@admin.com",
  "swaroop@admin.com",
])

const ADMIN_PASSWORD = "1234"
const USER_NAME_STORAGE_KEY = "hcf_user_name"
const USER_EVENT = "hcf:user"

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

// Simple reusable dialog
function StatusDialog({
  open,
  variant = "info",
  title,
  message,
  primaryLabel = "OK",
  onPrimary,
  secondaryLabel,
  onSecondary,
}) {
  if (!open) return null

  const accent =
    variant === "success"
      ? "#16a34a"
      : variant === "error"
      ? "#dc2626"
      : variant === "warning"
      ? "#d97706"
      : "#2563eb"

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.45)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        padding: 16,
      }}
    >
      <div
        style={{
          width: "min(520px, 100%)",
          background: "white",
          borderRadius: 14,
          boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
          overflow: "hidden",
        }}
      >
        <div style={{ padding: 16, borderTop: `6px solid ${accent}` }}>
          <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 6 }}>{title}</div>
          <div style={{ fontSize: 14, lineHeight: 1.5, color: "#444" }}>{message}</div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 10,
            padding: 16,
            background: "#fafafa",
            borderTop: "1px solid #eee",
          }}
        >
          {secondaryLabel && (
            <button
              type="button"
              onClick={onSecondary}
              style={{
                padding: "10px 14px",
                borderRadius: 10,
                border: "1px solid #ddd",
                background: "white",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              {secondaryLabel}
            </button>
          )}

          <button
            type="button"
            onClick={onPrimary}
            style={{
              padding: "10px 14px",
              borderRadius: 10,
              border: "none",
              background: accent,
              color: "white",
              fontWeight: 800,
              cursor: "pointer",
            }}
          >
            {primaryLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [scrollProgress, setScrollProgress] = useState(0)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [currentPage, setCurrentPage] = useState("home") // home, signin, signup, teams, resources, music

  const [dialog, setDialog] = useState({
    open: false,
    variant: "info",
    title: "",
    message: "",
    primaryLabel: "OK",
    onPrimary: null,
    secondaryLabel: null,
    onSecondary: null,
  })

  const closeDialog = () =>
    setDialog((d) => ({
      ...d,
      open: false,
    }))

  const openDialog = (cfg) =>
    setDialog({
      open: true,
      variant: cfg.variant || "info",
      title: cfg.title || "",
      message: cfg.message || "",
      primaryLabel: cfg.primaryLabel || "OK",
      onPrimary: cfg.onPrimary || closeDialog,
      secondaryLabel: cfg.secondaryLabel || null,
      onSecondary: cfg.onSecondary || null,
    })

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

      const existingName = (localStorage.getItem(USER_NAME_STORAGE_KEY) || "").trim()
      if (existingName) {
        window.dispatchEvent(new CustomEvent(USER_EVENT, { detail: { name: existingName } }))
      }
    }
  }, [])

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
  }

  const navigateTo = (page) => {
    setCurrentPage(page)
    window.scrollTo(0, 0)
  }

  const handleSignIn = async (email, password) => {
    const normalizedEmail = (email || "").trim().toLowerCase()

    // Admin bypass
    if (ADMIN_EMAILS.has(normalizedEmail) && password === ADMIN_PASSWORD) {
      setIsAuthenticated(true)
      localStorage.setItem("isAuthenticated", "true")
      localStorage.setItem("adminEmail", normalizedEmail)
      const adminName = (normalizedEmail.split("@")[0] || "").trim()
      if (adminName) {
        localStorage.setItem(USER_NAME_STORAGE_KEY, adminName)
        window.dispatchEvent(new CustomEvent(USER_EVENT, { detail: { name: adminName } }))
      }

      openDialog({
        variant: "success",
        title: "Signed in ✅",
        message: "Welcome back!",
        primaryLabel: "Continue",
        onPrimary: () => {
          closeDialog()
          setCurrentPage("home")
        },
      })
      return true
    }

    // Firebase sign-in
    try {
      const cred = await signInWithEmailAndPassword(auth, normalizedEmail, password)

      setIsAuthenticated(true)
      localStorage.setItem("isAuthenticated", "true")
      localStorage.setItem("userUid", cred.user.uid)
      localStorage.setItem("userEmail", normalizedEmail)

      // Hydrate name for Hero
      try {
        const snap = await getDoc(doc(db, "users", cred.user.uid))
        if (snap.exists()) {
          const fetchedName = (snap.data()?.name || "").trim()
          if (fetchedName) {
            localStorage.setItem(USER_NAME_STORAGE_KEY, fetchedName)
            window.dispatchEvent(new CustomEvent(USER_EVENT, { detail: { name: fetchedName } }))
          }
        }
      } catch (e) {
        console.error("Failed to fetch user name on sign-in:", e)
      }

      openDialog({
        variant: "success",
        title: "Signed in ✅",
        message: "You’re signed in successfully.",
        primaryLabel: "Continue",
        onPrimary: () => {
          closeDialog()
          setCurrentPage("home")
        },
      })
      return true
    } catch (err) {
      console.error("Firebase sign-in failed:", err)

      const friendly =
        err?.code === "auth/user-not-found"
          ? "No account found with this email."
          : err?.code === "auth/wrong-password"
          ? "Incorrect password."
          : err?.code === "auth/invalid-email"
          ? "That email looks invalid. Please check it."
          : err?.message || "Sign in failed."

      openDialog({
        variant: "error",
        title: "Sign in failed",
        message: friendly,
        primaryLabel: "Close",
        onPrimary: () => closeDialog(),
      })
      return false
    }
  }

  const handleSignUp = async (formData) => {
    try {
      const name = (formData?.name || "").trim()
      const email = (formData?.email || "").trim().toLowerCase()
      const password = formData?.password || ""
      const phone = (formData?.phone || "").trim()

      // 1) Create auth user first (this is the main thing)
      const cred = await createUserWithEmailAndPassword(auth, email, password)

      // 2) Mark user as logged in right away
      setIsAuthenticated(true)
      localStorage.setItem("isAuthenticated", "true")
      localStorage.setItem("userUid", cred.user.uid)
      localStorage.setItem("userEmail", email)
      if (name) {
        localStorage.setItem(USER_NAME_STORAGE_KEY, name)
        window.dispatchEvent(new CustomEvent(USER_EVENT, { detail: { name } }))
      }

      // 3) Show success immediately
      openDialog({
        variant: "success",
        title: "Signup successful ✅",
        message: "Welcome to HCF! Your account has been created.",
        primaryLabel: "Continue",
        onPrimary: () => {
          closeDialog()
          setCurrentPage("home")
        },
      })

      // 4) Save profile in Firestore in background (don’t block UI)
      setDoc(doc(db, "users", cred.user.uid), {
        name,
        email,
        phone: phone || null,
        createdAt: serverTimestamp(),
      }).catch((e) => {
        console.error("Firestore write failed:", e)
        // optional: you can show a warning dialog if you want
        // openDialog({ variant: "warning", title: "Saved account, but profile not saved", message: "Account created, but we couldn't save profile details. Try again later." })
      })

      return true
    } catch (err) {
      console.error("Firebase sign-up failed:", err)

      if (err?.code === "auth/email-already-in-use") {
        openDialog({
          variant: "warning",
          title: "Email already in use",
          message: "This email already has an account. Please sign in instead (or use a different email).",
          primaryLabel: "Sign in",
          onPrimary: () => {
            closeDialog()
            setCurrentPage("signin")
          },
          secondaryLabel: "Close",
          onSecondary: () => closeDialog(),
        })
        return false
      }

      const friendly =
        err?.code === "auth/invalid-email"
          ? "That email looks invalid. Please check it."
          : err?.code === "auth/weak-password"
          ? "Password is too weak. Use at least 6 characters."
          : err?.message || "Sign up failed."

      openDialog({
        variant: "error",
        title: "Signup failed",
        message: friendly,
        primaryLabel: "Close",
        onPrimary: () => closeDialog(),
      })

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
    localStorage.removeItem(USER_NAME_STORAGE_KEY)
    window.dispatchEvent(new CustomEvent(USER_EVENT, { detail: { name: "" } }))

    openDialog({
      variant: "success",
      title: "Signed out",
      message: "You’ve been signed out successfully.",
      primaryLabel: "OK",
      onPrimary: () => closeDialog(),
    })

    setCurrentPage("home")
  }

  // ----- Pages -----
  if (currentPage === "signin") {
    return (
      <div className="app-container">
        <StatusDialog {...dialog} />
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
        <StatusDialog {...dialog} />
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
        <StatusDialog {...dialog} />
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
        <StatusDialog {...dialog} />
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
        <StatusDialog {...dialog} />
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

  // Home
  return (
    <div className="app-container">
      <StatusDialog {...dialog} />
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