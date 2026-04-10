"use client"

import { useRouter } from "next/navigation"

import AppShell from "@/components/AppShell"
import ResourcesPage from "@/components/ResourcesPage"
import { useHcfAuth } from "@/hooks/useHcfAuth"
import { useThemeMode } from "@/hooks/useThemeMode"

export default function ResourcesRoutePage() {
  const router = useRouter()
  useThemeMode()
  const { isAuthenticated, isReady } = useHcfAuth({ requireAuth: true, redirectUnauthenticatedTo: "/signin" })

  if (!isReady || !isAuthenticated) {
    return <AppShell showShapes={false} />
  }

  return (
    <AppShell showShapes={false}>
      <ResourcesPage onBack={() => router.push("/")} onContactRedirect={() => router.push("/#contact")} />
    </AppShell>
  )
}
