"use client"

// Shared Firebase client for the live gallery (Firestore + the signed-in user).
// Uses the same "hcfprod" project as hooks/useHcfAuth.js and the HCF mobile app,
// so sign-ins and gallery uploads are shared between the website and the app.
import { getApp, getApps, initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyACe9qO583jAkoQrJsvX_Dp0tYdPtlgTsQ",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "hcfprod.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "hcfprod",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "hcfprod.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "158540586016",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:158540586016:web:3070f5ac072c372f20f045",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-Z68X6R3RTQ",
}

export const firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig)
export const auth = getAuth(firebaseApp)
// The project's Firestore database is the Enterprise database named "hcflogins" (there is no "(default)").
export const FIRESTORE_DATABASE_ID = "hcflogins"
export const db = getFirestore(firebaseApp, FIRESTORE_DATABASE_ID)

// Accounts that can add or remove gallery items (shared with the upload API and the app).
export { GALLERY_ADMIN_EMAILS } from "@/lib/galleryAdmins"
