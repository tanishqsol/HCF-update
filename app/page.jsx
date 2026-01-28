"use client"

import { useEffect, useState } from "react"
import { initializeApp, getApps, getApp } from "firebase/app"
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  onAuthStateChanged,
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

// ⚠️ IMPORTANT: Make sure these files exist in /public/images/team/...
// If your file is actually named "silloutte_male.png", change the path below to match exactly.
const ADMIN_PHOTOS = {
  "mike@admin.com": "/images/team/mike_prof.png",
  "tom@admin.com": "images/team/tom_profile-2.jpeg",
  "shashi@admin.com": "/images/team/shashi_prof.jpeg",
  "swaroop@admin.com": "/images/team/swaroop_prof.png",
  "tanishq@admin.com": "/images/team/tanishq_profile.png",
  "kundan@admin.com": "",
} 
const USER_NAME_STORAGE_KEY = "hcf_user_name"
const USER_PHOTO_STORAGE_KEY = "hcf_user_photo"
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
const toTitleCase = (str = "") =>
  str
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ")
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

  const closeDialog = () => setDialog((d) => ({ ...d, open: false }))

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

  const navigateTo = (page) => {
    setCurrentPage(page)
    window.scrollTo(0, 0)
  }

  // ✅ Persist user helper (email/pass + google)
  const persistSignedInUser = async (user, providerName) => {
    setIsAuthenticated(true)
    localStorage.setItem("isAuthenticated", "true")
    localStorage.setItem("userUid", user.uid)
    localStorage.setItem("userEmail", (user.email || "").toLowerCase())
const rawName = (user.displayName || "").trim()
const name = toTitleCase(rawName)
    const photoURL = (user.photoURL || "").trim()

    if (name) localStorage.setItem(USER_NAME_STORAGE_KEY, name)
    if (photoURL) localStorage.setItem(USER_PHOTO_STORAGE_KEY, photoURL)

    window.dispatchEvent(
      new CustomEvent(USER_EVENT, {
        detail: { name: name || "", photoURL: photoURL || "" },
      })
    )

    await setDoc(
      doc(db, "users", user.uid),
      {
        name: name || null,
        email: (user.email || "").toLowerCase() || null,
        photoURL: photoURL || null,
        provider: providerName || null,
        lastLoginAt: serverTimestamp(),
        createdAt: serverTimestamp(),
      },
      { merge: true }
    )
  }

  useEffect(() => {
    document.documentElement.classList.toggle("dark-mode", isDarkMode)
  }, [isDarkMode])

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = totalHeight > 0 ? (window.scrollY / totalHeight) * 100 : 0
      setScrollProgress(progress)
    }

    window.addEventListener("scroll", handleScroll)
    handleScroll()
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // ✅ Rehydrate auth on refresh
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      const saved = localStorage.getItem("isAuthenticated") === "true"

      if (!user && !saved) {
        setIsAuthenticated(false)
        return
      }

      if (user) {
        setIsAuthenticated(true)
        localStorage.setItem("isAuthenticated", "true")
        localStorage.setItem("userUid", user.uid)
        localStorage.setItem("userEmail", (user.email || "").toLowerCase())

        const existingName = (localStorage.getItem(USER_NAME_STORAGE_KEY) || "").trim()
        const existingPhoto = (localStorage.getItem(USER_PHOTO_STORAGE_KEY) || "").trim()

        // If photo missing, try Firebase user.photoURL first
        if (!existingPhoto && user.photoURL) {
          localStorage.setItem(USER_PHOTO_STORAGE_KEY, user.photoURL)
        }

        // If still missing name/photo, fetch Firestore once
        const afterPhoto = (localStorage.getItem(USER_PHOTO_STORAGE_KEY) || "").trim()
        if (!existingName || !afterPhoto) {
          try {
            const snap = await getDoc(doc(db, "users", user.uid))
            if (snap.exists()) {
              const fetchedName = (snap.data()?.name || "").trim()
              const fetchedPhoto = (snap.data()?.photoURL || "").trim()

              if (fetchedName) localStorage.setItem(USER_NAME_STORAGE_KEY, fetchedName)
              if (fetchedPhoto) localStorage.setItem(USER_PHOTO_STORAGE_KEY, fetchedPhoto)
            }
          } catch (e) {
            console.error("Auth rehydrate Firestore fetch failed:", e)
          }
        }

        window.dispatchEvent(
          new CustomEvent(USER_EVENT, {
            detail: {
              name: (localStorage.getItem(USER_NAME_STORAGE_KEY) || "").trim(),
              photoURL: (localStorage.getItem(USER_PHOTO_STORAGE_KEY) || "").trim(),
            },
          })
        )
      } else if (saved) {
        // Admin bypass session (no firebase user)
        setIsAuthenticated(true)
      }
    })

    return () => unsub()
  }, [])

  // ✅ Handle redirect result (Google fallback)
  useEffect(() => {
    ;(async () => {
      try {
        const res = await getRedirectResult(auth)
        if (!res?.user) return
        await persistSignedInUser(res.user, "google")
        setCurrentPage("home")
      } catch (err) {
        if (!err) return
        console.error("Google redirect result failed:", err)
        openDialog({
          variant: "error",
          title: "Google sign-in failed",
          message: err?.message || "Please try again.",
          primaryLabel: "Close",
          onPrimary: closeDialog,
        })
      }
    })()
  }, [])

  // ✅ If authenticated, never stay on auth pages
  useEffect(() => {
    if (isAuthenticated && (currentPage === "signin" || currentPage === "signup")) {
      setCurrentPage("home")
    }
  }, [isAuthenticated, currentPage])

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider()
      provider.setCustomParameters({ prompt: "select_account" })

      try {
        const cred = await signInWithPopup(auth, provider)
        await persistSignedInUser(cred.user, "google")
        setCurrentPage("home")
        return true
      } catch (popupErr) {
        const code = popupErr?.code
        if (
          code === "auth/popup-blocked" ||
          code === "auth/popup-closed-by-user" ||
          code === "auth/cancelled-popup-request" ||
          code === "auth/operation-not-supported-in-this-environment"
        ) {
          await signInWithRedirect(auth, provider)
          return true
        }
        throw popupErr
      }
    } catch (err) {
      console.error("Google sign-in failed:", err)
      return false
    }
  }

  const handleSignIn = async (email, password) => {
    const normalizedEmail = (email || "").trim().toLowerCase()

    // ✅ Admin bypass
    if (ADMIN_EMAILS.has(normalizedEmail) && password === ADMIN_PASSWORD) {
      setIsAuthenticated(true)
      localStorage.setItem("isAuthenticated", "true")
      localStorage.setItem("adminEmail", normalizedEmail)

const adminName = toTitleCase((normalizedEmail.split("@")[0] || "").trim())      
const adminPhoto = (ADMIN_PHOTOS[normalizedEmail] || "").trim()

      localStorage.setItem(USER_NAME_STORAGE_KEY, adminName)
      localStorage.setItem(USER_PHOTO_STORAGE_KEY, adminPhoto)

      window.dispatchEvent(new CustomEvent(USER_EVENT, { detail: { name: adminName, photoURL: adminPhoto } }))

      setCurrentPage("home")
      return true
    }

    // ✅ Firebase email/pass
    try {
      const cred = await signInWithEmailAndPassword(auth, normalizedEmail, password)

      setIsAuthenticated(true)
      localStorage.setItem("isAuthenticated", "true")
      localStorage.setItem("userUid", cred.user.uid)
      localStorage.setItem("userEmail", normalizedEmail)

      // hydrate name/photo
      try {
        const snap = await getDoc(doc(db, "users", cred.user.uid))
        if (snap.exists()) {
          const fetchedName = (snap.data()?.name || "").trim()
          const fetchedPhoto = (snap.data()?.photoURL || "").trim()

          if (fetchedName) localStorage.setItem(USER_NAME_STORAGE_KEY, fetchedName)
          if (fetchedPhoto) localStorage.setItem(USER_PHOTO_STORAGE_KEY, fetchedPhoto)

          window.dispatchEvent(
            new CustomEvent(USER_EVENT, { detail: { name: fetchedName || "", photoURL: fetchedPhoto || "" } })
          )
        }
      } catch (e) {
        console.error("Failed to fetch user profile on sign-in:", e)
      }

      setCurrentPage("home")
      return true
    } catch (err) {
      console.error("Firebase sign-in failed:", err)
      return false
    }
  }

  const handleSignUp = async (formData) => {
    try {
const name = toTitleCase((formData?.name || "").trim())      
const email = (formData?.email || "").trim().toLowerCase()
      const password = formData?.password || ""
      const phone = (formData?.phone || "").trim()

      const cred = await createUserWithEmailAndPassword(auth, email, password)

      setIsAuthenticated(true)
      localStorage.setItem("isAuthenticated", "true")
      localStorage.setItem("userUid", cred.user.uid)
      localStorage.setItem("userEmail", email)

      if (name) localStorage.setItem(USER_NAME_STORAGE_KEY, name)
      localStorage.removeItem(USER_PHOTO_STORAGE_KEY)

      window.dispatchEvent(new CustomEvent(USER_EVENT, { detail: { name: name || "", photoURL: "" } }))

      setCurrentPage("home")

      setDoc(
        doc(db, "users", cred.user.uid),
        {
          name,
          email,
          phone: phone || null,
          photoURL: null,
          createdAt: serverTimestamp(),
        },
        { merge: true }
      ).catch((e) => console.error("Firestore write failed:", e))

      return true
    } catch (err) {
      console.error("Firebase sign-up failed:", err)
      return false
    }
  }

  const handleSignOut = async () => {
    try {
      await firebaseSignOut(auth)
    } catch (e) {}

    setIsAuthenticated(false)

    localStorage.removeItem("isAuthenticated")
    localStorage.removeItem("adminEmail")
    localStorage.removeItem("userUid")
    localStorage.removeItem("userEmail")
    localStorage.removeItem(USER_NAME_STORAGE_KEY)
    localStorage.removeItem(USER_PHOTO_STORAGE_KEY)

    window.dispatchEvent(new CustomEvent(USER_EVENT, { detail: { name: "", photoURL: "" } }))

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
        <SignIn
          onSignIn={handleSignIn}
          onGoogleSignIn={handleGoogleSignIn}
          onBack={() => navigateTo("home")}
          onSignUp={() => navigateTo("signup")}
        />
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
        <div className="animated-mesh-bg" />
        <TeamsPage onBack={() => navigateTo("home")} isDarkMode={isDarkMode} />
      </div>
    )
  }

  if (currentPage === "resources") {
    return (
      <div className="app-container">
        <div className="animated-mesh-bg" />
        <ResourcesPage onBack={() => navigateTo("home")} isDarkMode={isDarkMode} />
      </div>
    )
  }

  if (currentPage === "music") {
    return (
      <div className="app-container">
        <div className="animated-mesh-bg" />
        <MusicVideosPage onBack={() => navigateTo("home")} isDarkMode={isDarkMode} />
      </div>
    )
  }

  // Home
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

      <Navbar
        isDarkMode={isDarkMode}
        toggleTheme={() => setIsDarkMode((v) => !v)}
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