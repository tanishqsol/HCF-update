"use client"

import { useEffect, useState } from "react"

const THEME_STORAGE_KEY = "hcf_dark_mode"

export function useThemeMode() {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isThemeReady, setIsThemeReady] = useState(false)

  useEffect(() => {
    if (typeof window === "undefined") return

    const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY)
    setIsDarkMode(storedTheme === "true")
    setIsThemeReady(true)
  }, [])

  useEffect(() => {
    if (typeof window === "undefined" || !isThemeReady) return

    document.documentElement.classList.toggle("dark-mode", isDarkMode)
    window.localStorage.setItem(THEME_STORAGE_KEY, String(isDarkMode))
  }, [isDarkMode, isThemeReady])

  return {
    isDarkMode,
    setIsDarkMode,
    toggleTheme: () => setIsDarkMode((value) => !value),
  }
}
