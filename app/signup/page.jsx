"use client"

import { useRouter } from "next/navigation"

import AppShell from "@/components/AppShell"
import SignUp from "@/components/SignUp"
import { useHcfAuth } from "@/hooks/useHcfAuth"
import { useThemeMode } from "@/hooks/useThemeMode"

export default function SignUpPage() {
  const router = useRouter()
  useThemeMode()
  const { signUp } = useHcfAuth({ redirectAuthenticatedTo: "/", redirectAfterAuth: "/" })

  return (
    <AppShell>
      <SignUp onSignUp={signUp} onBack={() => router.push("/")} onSignIn={() => router.push("/signin")} />
    </AppShell>
  )
}
