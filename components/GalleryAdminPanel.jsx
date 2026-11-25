"use client"

import { useRef, useState } from "react"

import { addGalleryPhoto } from "@/lib/remoteGallery"

import "./GalleryAdmin.css"

// Shown on the Gallery page only to the admin accounts in lib/galleryAdmins.js.
// Photos go to Vercel Blob and appear immediately here and in the HCF mobile app.
// (YouTube videos are added on the Music Videos page instead.)
export default function GalleryAdminPanel() {
  const inputRef = useRef(null)
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState("")
  const [title, setTitle] = useState("")
  const [tag, setTag] = useState("")
  const [description, setDescription] = useState("")
  const [busy, setBusy] = useState(false)
  const [status, setStatus] = useState(null)

  const reset = () => {
    if (preview) URL.revokeObjectURL(preview)
    setFile(null)
    setPreview("")
    setTitle("")
    setTag("")
    setDescription("")
    if (inputRef.current) inputRef.current.value = ""
  }

  const onPick = (event) => {
    const next = event.target.files?.[0]
    if (!next) return
    if (!next.type.startsWith("image/")) {
      setStatus({ type: "error", text: "Please choose a photo. YouTube videos are added on the Music Videos page." })
      return
    }
    if (preview) URL.revokeObjectURL(preview)
    setFile(next)
    setPreview(URL.createObjectURL(next))
    setStatus(null)
  }

  const onSubmit = async (event) => {
    event.preventDefault()
    setStatus(null)
    if (!file) return setStatus({ type: "error", text: "Choose a photo first." })
    setBusy(true)
    try {
      await addGalleryPhoto(file, { title, description, tag })
      reset()
      setStatus({ type: "success", text: "Added to the gallery. It's now live on the website and in the app." })
    } catch (error) {
      console.error("Gallery add failed:", error)
      setStatus({ type: "error", text: error?.message || "Something went wrong. Please try again." })
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="gallery-admin" aria-labelledby="gallery-admin-title">
      <div className="gallery-admin__head">
        <span className="gallery-admin__badge">Admin</span>
        <h2 id="gallery-admin-title" className="gallery-admin__title">Add a photo</h2>
        <p className="gallery-admin__hint">Photos appear here and in the HCF app right away. To add YouTube videos, use the Music Videos page.</p>
      </div>

      <form className="gallery-admin__form" onSubmit={onSubmit}>
        <label className={`gallery-admin__drop ${preview ? "gallery-admin__drop--filled" : ""}`}>
          <input ref={inputRef} type="file" accept="image/*" onChange={onPick} disabled={busy} />
          {preview ? (
            <img src={preview} alt="Selected photo preview" className="gallery-admin__preview" />
          ) : (
            <span className="gallery-admin__drop-text">
              <strong>Choose a photo</strong>
              <span>JPG, PNG or WebP · high quality, resized automatically</span>
            </span>
          )}
        </label>

        <div className="gallery-admin__fields">
          <label className="gallery-admin__field">
            <span>Title (optional)</span>
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Christmas Fellowship 2026" disabled={busy} />
          </label>
          <label className="gallery-admin__field">
            <span>Tag (optional)</span>
            <input value={tag} onChange={(e) => setTag(e.target.value)} placeholder="Worship" disabled={busy} />
          </label>
          <label className="gallery-admin__field gallery-admin__field--wide">
            <span>Description (optional)</span>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} disabled={busy} />
          </label>

          {status && <p className={`gallery-admin__status gallery-admin__status--${status.type}`}>{status.text}</p>}

          <div className="gallery-admin__actions">
            {file && !busy && (
              <button type="button" className="gallery-admin__ghost" onClick={reset}>
                Clear
              </button>
            )}
            <button type="submit" className="gallery-admin__submit" disabled={busy || !file}>
              {busy ? "Uploading…" : "Add to gallery"}
            </button>
          </div>
        </div>
      </form>
    </section>
  )
}
