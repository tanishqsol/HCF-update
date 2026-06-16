"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { CalendarDays, MapPin, X } from "lucide-react"

import Navbar from "@/components/Navbar"
import Hero from "@/components/Hero"
// import VisionSection from "@/components/VisionSection"
import CoreValuesSection from "@/components/CoreValuesSection"
import MeetingsSection from "@/components/MeetingsSection"
// import CreativeAvenuesSection from "@/components/CreativeAvenuesSection"
import ContactSection from "@/components/ContactSection"
import Footer from "@/components/Footer"
import StatusDialog from "@/components/StatusDialog"
import ScrollProgressRail from "@/components/ScrollProgressRail"
import { FacebookIcon, InstagramIcon, YouTubeIcon } from "@/components/SocialIcons"
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
const POPUP_SESSION_KEY = "hcf_meeting_popup_seen_v2"
const FELLOWSHIP_DATE = "Saturday, June 20, 2026"
const RSVP_URL = "https://forms.gle/ihJBZ4aNjRGWdPTf8"
const RSVP_DISPLAY_URL = "https://forms.gle/ihJBZ4aNjRGWdPTf8"
const FACEBOOK_URL = "https://www.facebook.com/share/1BiW5JdifG/"
const YOUTUBE_URL = "https://www.youtube.com/@HindiChristianFellowshipHCF"
const INSTAGRAM_URL = "https://www.instagram.com/hcfgreaterboston/"
const FELLOWSHIP_LOCATION = ["Mt. Hope Christian Church", "51 Lexington Street", "Belmont, MA 02478"]

export default function HomePage() {
  const router = useRouter()
  const { isDarkMode, toggleTheme } = useThemeMode()
  const { isAuthenticated, signOut } = useHcfAuth()
  const [meetingPopupOpen, setMeetingPopupOpen] = useState(false)
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

  const buildLinkCardStyle = (accentColor) => ({
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    padding: "12px 14px",
    borderRadius: 14,
    background: "rgba(255, 255, 255, 0.86)",
    border: `1px solid ${accentColor}`,
    color: "#1a365d",
    fontWeight: 700,
    textDecoration: "none",
  })

  const showFellowshipDialog = () => {
    const storedName = (localStorage.getItem(USER_NAME_STORAGE_KEY) || "").trim()
    const displayName = toTitleCase(storedName || "Friend")

    openDialog({
      variant: "info",
      title: "Upcoming Fellowship",
      content: (
        <div style={{ display: "grid", gap: 18, color: "#374151" }}>
          <div
            style={{
              padding: "16px 18px",
              borderRadius: 18,
              background: "linear-gradient(135deg, rgba(255, 209, 102, 0.18), rgba(255, 153, 51, 0.12), rgba(19, 136, 8, 0.12))",
              border: "1px solid rgba(255, 153, 51, 0.14)",
            }}
          >
            <div style={{ fontSize: 14, fontWeight: 700, color: "#b45309", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>
              Next Gathering
            </div>
            <div style={{ fontSize: 15, lineHeight: 1.7 }}>
              <div style={{ marginBottom: 10 }}>Hello {displayName},</div>
              <div style={{ marginBottom: 10 }}>
                Join us for our upcoming fellowship on <strong>{FELLOWSHIP_DATE}</strong>.
              </div>
              <div style={{ marginBottom: 4 }}>
                <strong>Location:</strong>
              </div>
              {FELLOWSHIP_LOCATION.map((line) => (
                <div key={line}>{line}</div>
              ))}
            </div>
          </div>

          <div style={{ display: "grid", gap: 10 }}>
            <a
              href={RSVP_URL}
              target="_blank"
              rel="noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "13px 16px",
                borderRadius: 999,
                background: "linear-gradient(135deg, #ff9933, #d97706)",
                color: "#fff",
                fontWeight: 800,
                textDecoration: "none",
                boxShadow: "0 12px 28px rgba(217, 119, 6, 0.24)",
              }}
            >
              RSVP For Fellowship
            </a>
            <div style={{ fontSize: 13, color: "#6b7280", textAlign: "center" }}>{RSVP_DISPLAY_URL}</div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 10 }}>
            <a
              href={FACEBOOK_URL}
              target="_blank"
              rel="noreferrer"
              style={buildLinkCardStyle("rgba(24, 119, 242, 0.12)")}
            >
              <FacebookIcon className="social-link__icon" />
              Facebook
            </a>
            <a
              href={YOUTUBE_URL}
              target="_blank"
              rel="noreferrer"
              style={buildLinkCardStyle("rgba(220, 38, 38, 0.12)")}
            >
              <YouTubeIcon className="social-link__icon" />
              YouTube
            </a>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noreferrer"
              style={buildLinkCardStyle("rgba(236, 72, 153, 0.12)")}
            >
              <InstagramIcon className="social-link__icon" />
              Instagram
            </a>
          </div>

          <iframe
            title="Mt. Hope Christian Church map"
            src="https://www.google.com/maps?q=Mt.%20Hope%20Christian%20Church%2051%20Lexington%20Street%20Belmont%20MA%2002478&z=15&output=embed"
            width="100%"
            height="220"
            style={{ border: 0, borderRadius: 16 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      ),
      primaryLabel: "Close",
      onPrimary: closeDialog,
    })
  }

  const handleNotificationsClick = () => {
    showFellowshipDialog()
  }

  const dismissMeetingPopup = () => {
    setMeetingPopupOpen(false)
    window.sessionStorage.setItem(POPUP_SESSION_KEY, "seen")
  }

  useEffect(() => {
    if (typeof window === "undefined") return

    if (window.sessionStorage.getItem(POPUP_SESSION_KEY) === "seen") {
      return
    }

    const timer = window.setTimeout(() => {
      setMeetingPopupOpen(true)
    }, 2000)

    return () => window.clearTimeout(timer)
  }, [])

  return (
    <AppShell>
      <StatusDialog {...dialog} />
      {meetingPopupOpen && (
        <aside className="meeting-popup" aria-label="Upcoming meeting reminder">
          <button
            type="button"
            className="meeting-popup__close"
            aria-label="Close meeting reminder"
            onClick={dismissMeetingPopup}
          >
            <X size={18} aria-hidden="true" />
          </button>

          <div className="meeting-popup__eyebrow">Next meeting</div>
          <h2 className="meeting-popup__title">June 20</h2>
          <p className="meeting-popup__copy">A warm time of fellowship, prayer, and connection awaits.</p>

          <div className="meeting-popup__details">
            <div className="meeting-popup__detail">
              <CalendarDays size={18} aria-hidden="true" />
              <span>{FELLOWSHIP_DATE}</span>
            </div>
            <div className="meeting-popup__detail">
              <MapPin size={18} aria-hidden="true" />
              <span>Mt. Hope Christian Church, Belmont</span>
            </div>
          </div>

          <div className="meeting-popup__actions">
            <a href={RSVP_URL} target="_blank" rel="noreferrer" className="meeting-popup__primary">
              RSVP
            </a>
            <button type="button" className="meeting-popup__secondary" onClick={showFellowshipDialog}>
              Details
            </button>
          </div>
        </aside>
      )}
      <ScrollProgressRail />

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
        onGalleryClick={() => router.push("/gallery")}
      />

      <Hero isDarkMode={isDarkMode} onNotificationsClick={handleNotificationsClick} />
      {/* <VisionSection /> */}
      <CoreValuesSection />
      <MeetingsSection />
      {/* <CreativeAvenuesSection /> */}
      <ContactSection />
      <Footer />
    </AppShell>
  )
}
