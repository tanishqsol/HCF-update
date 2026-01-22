// lib/lang.js
export const LANG_STORAGE_KEY = "hcf_lang"
export const LANG_EVENT = "hcf:lang"

export const getInitialLang = () => {
  if (typeof window === "undefined") return "en"
  return window.localStorage.getItem(LANG_STORAGE_KEY) || "en"
}

export const setLangGlobal = (lang) => {
  if (typeof window === "undefined") return
  window.localStorage.setItem(LANG_STORAGE_KEY, lang)
  window.dispatchEvent(new CustomEvent(LANG_EVENT, { detail: { lang } }))
}

export const toggleLangGlobal = () => {
  const current = getInitialLang()
  const next = current === "en" ? "hi" : "en"
  setLangGlobal(next)
  return next
}