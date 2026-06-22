"use client"

import { useRouter, useSearchParams } from "next/navigation"

import AppShell from "@/components/AppShell"
import MusicVideosPage from "@/components/MusicVideosPage"
import { useHcfAuth } from "@/hooks/useHcfAuth"
import { useThemeMode } from "@/hooks/useThemeMode"

export default function MusicRoutePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  useThemeMode()
  const { isAuthenticated, isReady } = useHcfAuth({ requireAuth: true, redirectUnauthenticatedTo: "/signin" })

  if (!isReady || !isAuthenticated) {
    return <AppShell showShapes={false} />
  }

  return (
    <AppShell showShapes={false}>
      <MusicVideosPage initialTab={searchParams.get("tab")} onBack={() => router.push("/")} />
    </AppShell>
  )
}
