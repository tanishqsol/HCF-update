"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
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

const ADMIN_EMAILS = new Set([
  "mike@admin.com",
  "tom@admin.com",
  "shashi@admin.com",
  "tanishq@admin.com",
  "kundan@admin.com",
  "swaroop@admin.com",
])

const ADMIN_PASSWORD = "1234"

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
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")

const dispatchUserEvent = ({ name = "", photoURL = "" } = {}) => {
  if (typeof window === "undefined") return

  window.dispatchEvent(new CustomEvent(USER_EVENT, { detail: { name, photoURL } }))
}

const clearStoredSession = () => {
  if (typeof window === "undefined") return

  window.localStorage.removeItem("isAuthenticated")
  window.localStorage.removeItem("adminEmail")
  window.localStorage.removeItem("userUid")
  window.localStorage.removeItem("userEmail")
  window.localStorage.removeItem(USER_NAME_STORAGE_KEY)
  window.localStorage.removeItem(USER_PHOTO_STORAGE_KEY)
  dispatchUserEvent()
}

const persistStoredSession = ({ uid = "", email = "", name = "", photoURL = "", adminEmail = "" } = {}) => {
  if (typeof window === "undefined") return

  window.localStorage.setItem("isAuthenticated", "true")

  if (uid) window.localStorage.setItem("userUid", uid)
  else window.localStorage.removeItem("userUid")

  if (email) window.localStorage.setItem("userEmail", email)
  else window.localStorage.removeItem("userEmail")

  if (adminEmail) window.localStorage.setItem("adminEmail", adminEmail)
  else window.localStorage.removeItem("adminEmail")

  if (name) window.localStorage.setItem(USER_NAME_STORAGE_KEY, name)
  else window.localStorage.removeItem(USER_NAME_STORAGE_KEY)

  if (photoURL) window.localStorage.setItem(USER_PHOTO_STORAGE_KEY, photoURL)
  else window.localStorage.removeItem(USER_PHOTO_STORAGE_KEY)

  dispatchUserEvent({ name, photoURL })
}

const getStoredAuthSnapshot = () => {
  if (typeof window === "undefined") {
    return { isAuthenticated: false, isAdmin: false }
  }

  const isAuthenticated = window.localStorage.getItem("isAuthenticated") === "true"
  const isAdmin = !!(window.localStorage.getItem("adminEmail") || "").trim()

  return { isAuthenticated, isAdmin }
}

const getStoredUserProfile = () => {
  if (typeof window === "undefined") {
    return { name: "", photoURL: "" }
  }

  return {
    name: (window.localStorage.getItem(USER_NAME_STORAGE_KEY) || "").trim(),
    photoURL: (window.localStorage.getItem(USER_PHOTO_STORAGE_KEY) || "").trim(),
  }
}

const loadFirestoreProfile = async (uid) => {
  try {
    const snap = await getDoc(doc(db, "users", uid))
    if (!snap.exists()) return { name: "", photoURL: "" }

    return {
      name: (snap.data()?.name || "").trim(),
      photoURL: (snap.data()?.photoURL || "").trim(),
    }
  } catch (error) {
    console.error("Failed to load user profile:", error)
    return { name: "", photoURL: "" }
  }
}

const saveSignedInUserProfile = (user, providerName) => {
  const name = toTitleCase((user.displayName || "").trim())
  const photoURL = (user.photoURL || "").trim()
  const email = (user.email || "").trim().toLowerCase()

  persistStoredSession({
    uid: user.uid,
    email,
    name,
    photoURL,
  })

  setDoc(
    doc(db, "users", user.uid),
    {
      name: name || null,
      email: email || null,
      photoURL: photoURL || null,
      provider: providerName || null,
      lastLoginAt: serverTimestamp(),
      createdAt: serverTimestamp(),
    },
    { merge: true },
  ).catch((error) => {
    console.error("Persist signed-in user failed:", error)
  })
}

const sendWelcomeEmail = async ({ name, email }) => {
  if (!email) return

  const safeName = toTitleCase((name || "").trim()) || "Friend"
  const normalizedEmail = email.trim().toLowerCase()

  try {
    const response = await fetch("/api/send-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: safeName,
        email: normalizedEmail,
        message: `Dear ${safeName},

Welcome to HCF. We're so glad you joined our online community.

By registering, you now have access to more of our website, including our story, beliefs, team, original song videos, and volunteer opportunities.

We'd also love to meet you in person every 3rd Saturday, 12:00 PM to 3:00 PM, at Mt. Hope Christian Church, 51 Lexington Street, Belmont, MA 02478.

We're grateful to have you with us and pray this fellowship will be a blessing to you.

With love and prayers,
HCF`,
        subject: "Welcome to Hindi Christian Fellowship",
        isWelcome: true,
      }),
    })

    if (!response.ok) {
      const data = await response.json().catch(() => ({}))
      console.error("Welcome email failed:", data)
    }
  } catch (error) {
    console.error("Welcome email request failed:", error)
  }
}

export function useHcfAuth({
  redirectAfterAuth = "/",
  redirectAuthenticatedTo = null,
  requireAuth = false,
  redirectUnauthenticatedTo = "/signin",
  handleGoogleRedirect = false,
} = {}) {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isReady, setIsReady] = useState(false)
  const authInitializedRef = useRef(false)
  const previousAuthUidRef = useRef(null)

  useEffect(() => {
    const stored = getStoredAuthSnapshot()
    setIsAuthenticated(stored.isAuthenticated)
  }, [])

  useEffect(() => {
    let cancelled = false

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      const isFirstAuthEvent = !authInitializedRef.current
      const previousUid = previousAuthUidRef.current
      authInitializedRef.current = true
      previousAuthUidRef.current = user?.uid || null

      if (!user) {
        const stored = getStoredAuthSnapshot()
        const allowAdminBypass = stored.isAuthenticated && stored.isAdmin

        if (!allowAdminBypass) clearStoredSession()

        if (!cancelled) {
          setIsAuthenticated(allowAdminBypass)
          setIsReady(true)
        }
        return
      }

      const existingProfile = getStoredUserProfile()
      let name = existingProfile.name
      let photoURL = existingProfile.photoURL

      if (!name || !photoURL) {
        const profile = await loadFirestoreProfile(user.uid)
        if (!name) name = profile.name
        if (!photoURL) photoURL = profile.photoURL
      }

      const fallbackName = toTitleCase((user.displayName || "").trim())
      const fallbackPhoto = (user.photoURL || "").trim()

      persistStoredSession({
        uid: user.uid,
        email: (user.email || "").trim().toLowerCase(),
        name: name || fallbackName,
        photoURL: photoURL || fallbackPhoto,
      })

      if (!cancelled) {
        setIsAuthenticated(true)
        setIsReady(true)
      }

    })

    return () => {
      cancelled = true
      unsubscribe()
    }
  }, [])

  useEffect(() => {
    if (!handleGoogleRedirect) return

    let cancelled = false

    ;(async () => {
      try {
        const result = await getRedirectResult(auth)
        if (!result?.user || cancelled) return

        saveSignedInUserProfile(result.user, "google")

        if (!cancelled) {
          setIsAuthenticated(true)
          router.replace(redirectAfterAuth)
        }
      } catch (error) {
        if (!cancelled && error) {
          console.error("Google redirect result failed:", error)
        }
      } finally {
        if (!cancelled) setIsReady(true)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [handleGoogleRedirect, redirectAfterAuth, router])

  useEffect(() => {
    if (!isReady || !redirectAuthenticatedTo || !isAuthenticated) return
    router.replace(redirectAuthenticatedTo)
  }, [isAuthenticated, isReady, redirectAuthenticatedTo, router])

  useEffect(() => {
    if (!isReady || !requireAuth || isAuthenticated) return
    router.replace(redirectUnauthenticatedTo)
  }, [isAuthenticated, isReady, redirectUnauthenticatedTo, requireAuth, router])

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider()
      provider.setCustomParameters({ prompt: "select_account" })

      try {
        const cred = await signInWithPopup(auth, provider)
        saveSignedInUserProfile(cred.user, "google")
        setIsAuthenticated(true)
        router.replace(redirectAfterAuth)
        return true
      } catch (popupError) {
        const code = popupError?.code
        if (
          code === "auth/popup-blocked" ||
          code === "auth/popup-closed-by-user" ||
          code === "auth/cancelled-popup-request" ||
          code === "auth/operation-not-supported-in-this-environment"
        ) {
          await signInWithRedirect(auth, provider)
          return true
        }

        throw popupError
      }
    } catch (error) {
      console.error("Google sign-in failed:", error)
      return false
    }
  }

  const signIn = async (email, password) => {
    const normalizedEmail = (email || "").trim().toLowerCase()

    if (ADMIN_EMAILS.has(normalizedEmail) && password === ADMIN_PASSWORD) {
      const name = toTitleCase((normalizedEmail.split("@")[0] || "").trim())
      const photoURL = (ADMIN_PHOTOS[normalizedEmail] || "").trim()

      persistStoredSession({
        email: normalizedEmail,
        name,
        photoURL,
        adminEmail: normalizedEmail,
      })

      setIsAuthenticated(true)
      router.replace(redirectAfterAuth)
      return true
    }

    try {
      const credential = await signInWithEmailAndPassword(auth, normalizedEmail, password)
      const profile = await loadFirestoreProfile(credential.user.uid)
      const fallbackName = toTitleCase((credential.user.displayName || "").trim())
      const fallbackPhoto = (credential.user.photoURL || "").trim()

      persistStoredSession({
        uid: credential.user.uid,
        email: normalizedEmail,
        name: profile.name || fallbackName,
        photoURL: profile.photoURL || fallbackPhoto,
      })

      setIsAuthenticated(true)
      router.replace(redirectAfterAuth)
      return true
    } catch (error) {
      console.error("Firebase sign-in failed:", error)
      return false
    }
  }

  const signUp = async (formData) => {
    try {
      const name = toTitleCase((formData?.name || "").trim())
      const email = (formData?.email || "").trim().toLowerCase()
      const password = formData?.password || ""
      const phone = (formData?.phone || "").trim()

      const credential = await createUserWithEmailAndPassword(auth, email, password)

      persistStoredSession({
        uid: credential.user.uid,
        email,
        name,
        photoURL: "",
      })

      setIsAuthenticated(true)
      router.replace(redirectAfterAuth)

      setDoc(
        doc(db, "users", credential.user.uid),
        {
          name,
          email,
          phone: phone || null,
          photoURL: null,
          createdAt: serverTimestamp(),
        },
        { merge: true },
      ).catch((error) => console.error("Firestore write failed:", error))

      await sendWelcomeEmail({
        name: name || credential.user.email?.split("@")[0] || "",
        email,
      })

      return true
    } catch (error) {
      console.error("Firebase sign-up failed:", error)
      return false
    }
  }

  const signOut = async () => {
    try {
      await firebaseSignOut(auth)
    } catch (error) {
      console.error("Firebase sign-out warning:", error)
    }

    previousAuthUidRef.current = null
    clearStoredSession()
    setIsAuthenticated(false)
    router.replace("/")
  }

  return {
    isAuthenticated,
    isReady,
    signIn,
    signInWithGoogle,
    signOut,
    signUp,
  }
}
