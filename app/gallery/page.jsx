"use client"

import { useRouter } from "next/navigation"

import AppShell from "@/components/AppShell"
import GalleryPage from "@/components/GalleryPage"
import { useHcfAuth } from "@/hooks/useHcfAuth"
import { useThemeMode } from "@/hooks/useThemeMode"

export default function GalleryRoutePage() {
  const router = useRouter()
  useThemeMode()
  const { isAuthenticated, isReady } = useHcfAuth({ requireAuth: true, redirectUnauthenticatedTo: "/signin" })

  if (!isReady || !isAuthenticated) {
    return <AppShell showShapes={false} />
  }

  return (
    <AppShell showShapes={false}>
      <GalleryPage onBack={() => router.push("/")} />
    </AppShell>
  )
}
