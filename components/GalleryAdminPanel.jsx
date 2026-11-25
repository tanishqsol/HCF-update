"use client"

import { useRef, useState } from "react"

import { addGalleryPhoto, addGalleryYouTube, parseYouTubeId } from "@/lib/remoteGallery"

import "./GalleryAdmin.css"

// Shown on the Gallery page only to the admin accounts in lib/galleryAdmins.js.
// Photos go to Vercel Blob, videos are YouTube links. Both appear immediately here
// and in the HCF mobile app.
export default function GalleryAdminPanel() {
  const inputRef = useRef(null)
  const [mode, setMode] = useState("photo")
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState("")
  const [link, setLink] = useState("")
  const [title, setTitle] = useState("")
  const [tag, setTag] = useState("")
  const [description, setDescription] = useState("")
  const [busy, setBusy] = useState(false)
  const [status, setStatus] = useState(null)

  const youtubeId = mode === "video" ? parseYouTubeId(link) : null

  const reset = () => {
    if (preview) URL.revokeObjectURL(preview)
    setFile(null)
    setPreview("")
    setLink("")
    setTitle("")
    setTag("")
    setDescription("")
    if (inputRef.current) inputRef.current.value = ""
  }

  const switchMode = (next) => {
    if (busy) return
    reset()
    setStatus(null)
    setMode(next)
  }

  const onPick = (event) => {
    const next = event.target.files?.[0]
    if (!next) return
    if (!next.type.startsWith("image/")) {
      setStatus({ type: "error", text: "Please choose a photo. For videos, use the YouTube video option." })
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
    if (mode === "photo" && !file) return setStatus({ type: "error", text: "Choose a photo first." })
    if (mode === "video" && !youtubeId) return setStatus({ type: "error", text: "Paste a YouTube link first." })
    setBusy(true)
    try {
      const meta = { title, description, tag }
      if (mode === "photo") await addGalleryPhoto(file, meta)
      else await addGalleryYouTube(link, meta)
      reset()
      setStatus({
        type: "success",
        text: mode === "photo" ? "Added to the gallery. It's now live on the website and in the app." : "Added to Music Videos on the website and in the app.",
      })
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
        <h2 id="gallery-admin-title" className="gallery-admin__title">Add to the gallery</h2>
        <p className="gallery-admin__hint">Photos appear in this gallery; YouTube videos appear in Music Videos. Both show in the HCF app right away.</p>
        <div className="gallery-admin__modes" role="tablist" aria-label="What to add">
          <button type="button" role="tab" aria-selected={mode === "photo"} className={mode === "photo" ? "is-active" : ""} onClick={() => switchMode("photo")}>
            Photo
          </button>
          <button type="button" role="tab" aria-selected={mode === "video"} className={mode === "video" ? "is-active" : ""} onClick={() => switchMode("video")}>
            YouTube video
          </button>
        </div>
      </div>

      <form className="gallery-admin__form" onSubmit={onSubmit}>
        {mode === "photo" ? (
          <label className={`gallery-admin__drop ${preview ? "gallery-admin__drop--filled" : ""}`}>
            <input ref={inputRef} type="file" accept="image/*" onChange={onPick} disabled={busy} />
            {preview ? (
              <img src={preview} alt="Selected photo preview" className="gallery-admin__preview" />
            ) : (
              <span className="gallery-admin__drop-text">
                <strong>Choose a photo</strong>
                <span>JPG, PNG or WebP · resized automatically</span>
              </span>
            )}
          </label>
        ) : (
          <div className={`gallery-admin__drop ${youtubeId ? "gallery-admin__drop--filled" : ""}`}>
            {youtubeId ? (
              <img src={`https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`} alt="YouTube video preview" className="gallery-admin__preview" />
            ) : (
              <span className="gallery-admin__drop-text">
                <strong>Paste a YouTube link</strong>
                <span>Upload the video to the HCF YouTube channel first (Unlisted is fine). It will appear under Music Videos.</span>
              </span>
            )}
          </div>
        )}

        <div className="gallery-admin__fields">
          {mode === "video" && (
            <label className="gallery-admin__field gallery-admin__field--wide">
              <span>YouTube link</span>
              <input value={link} onChange={(e) => setLink(e.target.value)} placeholder="https://youtu.be/…" disabled={busy} inputMode="url" />
            </label>
          )}
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
            {(file || link) && !busy && (
              <button type="button" className="gallery-admin__ghost" onClick={reset}>
                Clear
              </button>
            )}
            <button type="submit" className="gallery-admin__submit" disabled={busy || (mode === "photo" ? !file : !youtubeId)}>
              {busy ? "Adding…" : "Add to gallery"}
            </button>
          </div>
        </div>
      </form>
    </section>
  )
}
