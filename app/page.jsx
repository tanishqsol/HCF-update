"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

import Navbar from "@/components/Navbar"
import Hero from "@/components/Hero"
import VisionSection from "@/components/VisionSection"
import CoreValuesSection from "@/components/CoreValuesSection"
import MeetingsSection from "@/components/MeetingsSection"
import CreativeAvenuesSection from "@/components/CreativeAvenuesSection"
import ContactSection from "@/components/ContactSection"
import Footer from "@/components/Footer"
import StatusDialog from "@/components/StatusDialog"
import AppShell from "@/components/AppShell"
import { useHcfAuth } from "@/hooks/useHcfAuth"
import { useThemeMode } from "@/hooks/useThemeMode"

const toTitleCase = (str = "") =>
  str
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")

const USER_NAME_STORAGE_KEY = "hcf_user_name"

export default function HomePage() {
  const router = useRouter()
  const { isDarkMode, toggleTheme } = useThemeMode()
  const { isAuthenticated, signOut } = useHcfAuth()
  const [scrollProgress, setScrollProgress] = useState(0)
  const [dialog, setDialog] = useState({
    open: false,
    variant: "info",
    title: "",
    message: "",
    content: null,
    primaryLabel: "OK",
    onPrimary: null,
    secondaryLabel: null,
    onSecondary: null,
  })

  const closeDialog = () => setDialog((current) => ({ ...current, open: false }))

  const openDialog = (config) =>
    setDialog({
      open: true,
      variant: config.variant || "info",
      title: config.title || "",
      message: config.message || "",
      content: config.content || null,
      primaryLabel: config.primaryLabel || "OK",
      onPrimary: config.onPrimary || closeDialog,
      secondaryLabel: config.secondaryLabel || null,
      onSecondary: config.onSecondary || null,
    })

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

  const handleNotificationsClick = () => {
    const storedName = (localStorage.getItem(USER_NAME_STORAGE_KEY) || "").trim()
    const displayName = toTitleCase(storedName || "Friend")

    openDialog({
      variant: "info",
      title: "Upcoming Fellowship",
      content: (
        <div style={{ display: "grid", gap: 14, color: "#444" }}>
          <div style={{ fontSize: 14, lineHeight: 1.6 }}>
            <div style={{ marginBottom: 10 }}>Hello {displayName},</div>
            <div style={{ marginBottom: 10 }}>
              We are excited to share that our next fellowship gathering is on <strong>Saturday, May 16, 2026</strong>.
            </div>
            <div style={{ marginBottom: 10 }}>
              <strong>RSVP:</strong>{" "}
              <a
                href="https://forms.gle/2wczNLEatvQ242kk8"
                target="_blank"
                rel="noreferrer"
                style={{ color: "#1d4ed8", fontWeight: 700 }}
              >
                https://forms.gle/ihJBZ4aNjRGWdPTf8
              </a>
            </div>
            <div style={{ marginBottom: 10 }}>
              <strong>Location:</strong>
              <br />
              Mt. Hope Christian Church
              <br />
              51 Lexington Street
              <br />
              Belmont, MA 02478
            </div>
            <div>We would love for you to join us for fellowship, worship, and community.</div>
          </div>
          <iframe
            title="Mt. Hope Christian Church map"
            src="https://www.google.com/maps?q=Mt.%20Hope%20Christian%20Church%2051%20Lexington%20Street%20Belmont%20MA%2002478&z=15&output=embed"
            width="100%"
            height="240"
            style={{ border: 0, borderRadius: 12 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      ),
      primaryLabel: "Close",
      onPrimary: closeDialog,
    })
  }

  return (
    <AppShell>
      <StatusDialog {...dialog} />

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
        onSignIn={() => router.push("/signin")}
        onSignOut={signOut}
        onTeamsClick={() => router.push("/teams")}
        onAboutClick={() => router.push("/about")}
        onResourcesClick={() => router.push("/resources")}
        onMusicClick={() => router.push("/music")}
      />

      <Hero isDarkMode={isDarkMode} onNotificationsClick={handleNotificationsClick} />
      <VisionSection />
      <CoreValuesSection />
      <MeetingsSection />
      <CreativeAvenuesSection />
      <ContactSection />
      <Footer />
    </AppShell>
  )
}
