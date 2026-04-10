"use client"

import { useRouter } from "next/navigation"

import AppShell from "@/components/AppShell"
import AboutSection from "@/components/AboutSection"
import { useHcfAuth } from "@/hooks/useHcfAuth"
import { useThemeMode } from "@/hooks/useThemeMode"

export default function AboutPage() {
  const router = useRouter()
  const { isAuthenticated, isReady } = useHcfAuth({ requireAuth: true, redirectUnauthenticatedTo: "/signin" })
  const { isDarkMode } = useThemeMode()

  if (!isReady || !isAuthenticated) {
    return <AppShell showShapes={false} />
  }

  return (
    <AppShell showShapes={false}>
      <AboutSection onBack={() => router.push("/")} isDarkMode={isDarkMode} />
    </AppShell>
  )
}
