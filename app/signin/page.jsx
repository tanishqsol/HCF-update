"use client"

import { useRouter } from "next/navigation"

import AppShell from "@/components/AppShell"
import SignIn from "@/components/SignIn"
import { useHcfAuth } from "@/hooks/useHcfAuth"
import { useThemeMode } from "@/hooks/useThemeMode"

export default function SignInPage() {
  const router = useRouter()
  useThemeMode()
  const { signIn, signInWithGoogle } = useHcfAuth({ redirectAuthenticatedTo: "/", redirectAfterAuth: "/" })

  return (
    <AppShell>
      <SignIn
        onSignIn={signIn}
        onGoogleSignIn={signInWithGoogle}
        onBack={() => router.push("/")}
        onSignUp={() => router.push("/signup")}
      />
    </AppShell>
  )
}
