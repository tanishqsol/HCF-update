"use client"

import { useEffect, useState } from "react"
import { onAuthStateChanged } from "firebase/auth"
import { addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query, serverTimestamp } from "firebase/firestore"

import { GALLERY_ADMIN_EMAILS, auth, db } from "@/lib/hcfFirebase"

// Live gallery shared with the HCF mobile app.
//   photos  → Vercel Blob, uploaded through /api/gallery-upload (admins only)
//   videos  → YouTube links (upload to the HCF channel, Unlisted is fine)
//   details → Firestore collection "gallery" in the "hcflogins" database
// Built-in photos in lib/galleryItems.js still show after the added ones.

export const UPLOAD_API = "/api/gallery-upload"

/** Pulls the 11-character video id out of any YouTube link (watch, youtu.be, shorts, live, embed). */
export function parseYouTubeId(input = "") {
  const text = String(input).trim()
  if (/^[\w-]{11}$/.test(text)) return text
  try {
    const url = new URL(text.startsWith("http") ? text : `https://${text}`)
    const host = url.hostname.replace(/^www\.|^m\./, "")
    if (host === "youtu.be") return url.pathname.slice(1, 12) || null
    if (host.endsWith("youtube.com") || host.endsWith("youtube-nocookie.com")) {
      const v = url.searchParams.get("v")
      if (v) return v.slice(0, 11)
      const parts = url.pathname.split("/").filter(Boolean)
      const i = parts.findIndex((p) => ["shorts", "live", "embed", "v"].includes(p))
      if (i >= 0 && parts[i + 1]) return parts[i + 1].slice(0, 11)
    }
  } catch {
    // not a URL
  }
  return null
}

const toItem = (snapshot) => {
  const d = snapshot.data()
  const isYouTube = d.kind === "youtube" && d.youtubeId
  const isVideo = isYouTube || d.kind === "video"
  return {
    id: snapshot.id,
    remote: true,
    kind: isYouTube ? "youtube" : isVideo ? "video" : "image",
    src: isYouTube ? `https://img.youtube.com/vi/${d.youtubeId}/hqdefault.jpg` : isVideo ? d.thumbUrl || "/placeholder.jpg" : d.url,
    videoSrc: d.kind === "video" ? d.url : null,
    youtubeId: isYouTube ? d.youtubeId : null,
    alt: d.title || d.description || (isVideo ? "Fellowship video" : "Fellowship photo"),
    title: d.title || "",
    description: d.description || "",
    tag: d.tag || (isVideo ? "Video" : "Photo"),
    layout: "standard",
    blobUrl: d.kind === "image" ? d.url : null,
  }
}

/** Added gallery items, newest first, updated live. */
export function useRemoteGallery() {
  const [items, setItems] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    const q = query(collection(db, "gallery"), orderBy("createdAt", "desc"))
    return onSnapshot(
      q,
      (snap) => {
        setError(null)
        setItems(snap.docs.map(toItem).filter((item) => item.src))
      },
      (err) => {
        console.error("Gallery load failed:", err)
        setError(err)
      },
    )
  }, [])

  return { items, error }
}

/** True only while one of GALLERY_ADMIN_EMAILS is signed in with Firebase. */
export function useIsGalleryAdmin() {
  const [isAdmin, setIsAdmin] = useState(false)
  useEffect(
    () =>
      onAuthStateChanged(auth, (user) => {
        setIsAdmin(GALLERY_ADMIN_EMAILS.includes((user?.email || "").toLowerCase()))
      }),
    [],
  )
  return isAdmin
}

async function authHeader() {
  const user = auth.currentUser
  if (!user) throw new Error("Please sign in again.")
  return { Authorization: `Bearer ${await user.getIdToken()}` }
}

/** Shrinks a photo to at most 2000px and JPEG ~82% so it uploads fast and stays under 4 MB. */
export function shrinkPhoto(file, maxSide = 2000) {
  return new Promise((resolve) => {
    if (file.type === "image/gif") return resolve(file)
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      const scale = Math.min(1, maxSide / Math.max(img.naturalWidth, img.naturalHeight))
      const canvas = document.createElement("canvas")
      canvas.width = Math.round(img.naturalWidth * scale)
      canvas.height = Math.round(img.naturalHeight * scale)
      canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height)
      canvas.toBlob(
        (blob) => {
          URL.revokeObjectURL(url)
          resolve(blob ? new File([blob], "photo.jpg", { type: "image/jpeg" }) : file)
        },
        "image/jpeg",
        0.82,
      )
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      resolve(file) // e.g. HEIC in a browser that can't read it; the server will say if it's unsupported
    }
    img.src = url
  })
}

/** Admin only: uploads a photo to Vercel Blob and creates the gallery entry. */
export async function addGalleryPhoto(file, { title = "", description = "", tag = "" }) {
  const photo = await shrinkPhoto(file)
  const form = new FormData()
  form.append("file", photo)
  const res = await fetch(UPLOAD_API, { method: "POST", headers: await authHeader(), body: form })
  const data = await res.json().catch(() => ({}))
  if (!res.ok || !data.url) throw new Error(data.error || "Upload failed.")

  await addDoc(collection(db, "gallery"), {
    kind: "image",
    url: data.url,
    title: title.trim(),
    description: description.trim(),
    tag: tag.trim(),
    createdAt: serverTimestamp(),
    createdBy: auth.currentUser?.email ?? null,
    source: "website",
  })
}

/** Admin only: adds a YouTube video by link. */
export async function addGalleryYouTube(link, { title = "", description = "", tag = "" }) {
  const youtubeId = parseYouTubeId(link)
  if (!youtubeId) throw new Error("That doesn't look like a YouTube link.")
  await addDoc(collection(db, "gallery"), {
    kind: "youtube",
    youtubeId,
    url: `https://www.youtube.com/watch?v=${youtubeId}`,
    title: title.trim(),
    description: description.trim(),
    tag: tag.trim() || "Video",
    createdAt: serverTimestamp(),
    createdBy: auth.currentUser?.email ?? null,
    source: "website",
  })
}

/** Admin only: removes an added item (and its photo file, if it has one). */
export async function deleteGalleryItem(item) {
  if (!item?.remote) return
  await deleteDoc(doc(db, "gallery", item.id))
  if (item.blobUrl) {
    await fetch(UPLOAD_API, {
      method: "DELETE",
      headers: { ...(await authHeader()), "Content-Type": "application/json" },
      body: JSON.stringify({ url: item.blobUrl }),
    }).catch(() => {})
  }
}
