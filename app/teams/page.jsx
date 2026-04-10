"use client"

import { useRouter } from "next/navigation"

import AppShell from "@/components/AppShell"
import TeamsPage from "@/components/TeamsPage"
import { useHcfAuth } from "@/hooks/useHcfAuth"
import { useThemeMode } from "@/hooks/useThemeMode"

export default function TeamRoutePage() {
  const router = useRouter()
  useThemeMode()
  const { isAuthenticated, isReady } = useHcfAuth({ requireAuth: true, redirectUnauthenticatedTo: "/signin" })

  if (!isReady || !isAuthenticated) {
    return <AppShell showShapes={false} />
  }

  return (
    <AppShell showShapes={false}>
      <TeamsPage onBack={() => router.push("/")} />
    </AppShell>
  )
}
