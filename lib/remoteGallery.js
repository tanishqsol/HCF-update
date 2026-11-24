"use client"

import { useEffect, useState } from "react"
import { onAuthStateChanged } from "firebase/auth"
import { addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query, serverTimestamp } from "firebase/firestore"
import { deleteObject, getDownloadURL, ref, uploadBytesResumable } from "firebase/storage"

import { GALLERY_ADMIN_EMAIL, auth, db, storage } from "@/lib/hcfFirebase"

// Live gallery shared with the HCF mobile app.
//   files   → Firebase Storage, gallery/…
//   details → Firestore collection "gallery"
// Built-in photos in lib/galleryItems.js still show after the uploaded ones.

const toItem = (snapshot) => {
  const d = snapshot.data()
  const isVideo = d.kind === "video"
  return {
    id: snapshot.id,
    remote: true,
    kind: isVideo ? "video" : "image",
    src: isVideo ? d.thumbUrl || "/placeholder.jpg" : d.url,
    videoSrc: isVideo ? d.url : null,
    alt: d.title || d.description || (isVideo ? "Fellowship video" : "Fellowship photo"),
    title: d.title || "",
    description: d.description || "",
    tag: d.tag || (isVideo ? "Video" : "Photo"),
    layout: "standard",
    storagePath: d.storagePath || null,
    thumbPath: d.thumbPath || null,
  }
}

/** Uploaded gallery items, newest first, updated live. */
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

/** True only while admin@hcfgreaterboston.com is signed in with Firebase. */
export function useIsGalleryAdmin() {
  const [isAdmin, setIsAdmin] = useState(false)
  useEffect(
    () =>
      onAuthStateChanged(auth, (user) => {
        setIsAdmin((user?.email || "").toLowerCase() === GALLERY_ADMIN_EMAIL)
      }),
    [],
  )
  return isAdmin
}

const EXT = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/gif": "gif", "image/heic": "heic", "video/mp4": "mp4", "video/quicktime": "mov", "video/webm": "webm" }

function uploadBlob(blob, path, contentType, onProgress) {
  const fileRef = ref(storage, path)
  const task = uploadBytesResumable(fileRef, blob, { contentType })
  return new Promise((resolve, reject) => {
    task.on(
      "state_changed",
      (s) => onProgress?.(s.totalBytes ? s.bytesTransferred / s.totalBytes : 0),
      reject,
      () => getDownloadURL(fileRef).then(resolve, reject),
    )
  })
}

/** Grabs a frame ~1s into a video file as a JPEG poster. Resolves null if the browser can't. */
export function makeVideoPoster(file) {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file)
    const video = document.createElement("video")
    const done = (blob) => {
      URL.revokeObjectURL(url)
      resolve(blob)
    }
    video.preload = "metadata"
    video.muted = true
    video.playsInline = true
    video.src = url
    video.onloadedmetadata = () => {
      video.currentTime = Math.min(1, (video.duration || 2) / 2)
    }
    video.onseeked = () => {
      try {
        const scale = Math.min(1, 1280 / (video.videoWidth || 1280))
        const canvas = document.createElement("canvas")
        canvas.width = Math.round((video.videoWidth || 1280) * scale)
        canvas.height = Math.round((video.videoHeight || 720) * scale)
        canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height)
        canvas.toBlob((blob) => done(blob), "image/jpeg", 0.82)
      } catch {
        done(null)
      }
    }
    video.onerror = () => done(null)
    setTimeout(() => done(null), 15000)
  })
}

/** Admin only: uploads a photo/video (+ video poster) and creates the gallery entry. */
export async function uploadGalleryItem(file, { title = "", description = "", tag = "" }, onProgress) {
  const isVideo = file.type.startsWith("video/")
  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
  const ext = EXT[file.type] || (isVideo ? "mp4" : "jpg")
  const storagePath = `gallery/${id}.${ext}`

  let thumbUrl = null
  let thumbPath = null
  if (isVideo) {
    const poster = await makeVideoPoster(file)
    if (poster) {
      thumbPath = `gallery/thumbs/${id}.jpg`
      thumbUrl = await uploadBlob(poster, thumbPath, "image/jpeg")
    }
  }
  const url = await uploadBlob(file, storagePath, file.type || (isVideo ? "video/mp4" : "image/jpeg"), onProgress)

  await addDoc(collection(db, "gallery"), {
    kind: isVideo ? "video" : "image",
    url,
    storagePath,
    thumbUrl,
    thumbPath,
    title: title.trim(),
    description: description.trim(),
    tag: tag.trim(),
    createdAt: serverTimestamp(),
    createdBy: auth.currentUser?.email ?? null,
    source: "website",
  })
}

/** Admin only: removes an uploaded item and its files. */
export async function deleteGalleryItem(item) {
  if (!item?.remote) return
  await deleteDoc(doc(db, "gallery", item.id))
  for (const path of [item.storagePath, item.thumbPath]) {
    if (path) await deleteObject(ref(storage, path)).catch(() => {})
  }
}
