"use client"

import { useState } from "react"

import { addYouTubeVideo, parseYouTubeId } from "@/lib/remoteGallery"

import "./GalleryAdmin.css"

// Admin-only "Add YouTube link" box on the Music Videos page.
// section = "music" (Music Videos tab) or "services" (Our Services tab).
// Videos added here (or in the HCF app) appear in that tab on the website and in the app.
export default function VideoAdminPanel({ section }) {
  const isServices = section === "services"
  const [open, setOpen] = useState(false)
  const [link, setLink] = useState("")
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [busy, setBusy] = useState(false)
  const [status, setStatus] = useState(null)
  const youtubeId = parseYouTubeId(link)

  const reset = () => {
    setLink("")
    setTitle("")
    setDescription("")
  }

  const onSubmit = async (event) => {
    event.preventDefault()
    if (!youtubeId) return setStatus({ type: "error", text: "Paste a YouTube link first." })
    setBusy(true)
    setStatus(null)
    try {
      await addYouTubeVideo(link, section, { title, description })
      reset()
      setStatus({ type: "success", text: `Added to ${isServices ? "Our Services" : "Music Videos"} on the website and in the app.` })
    } catch (error) {
      console.error("Add video failed:", error)
      setStatus({ type: "error", text: error?.message || "Something went wrong. Please try again." })
    } finally {
      setBusy(false)
    }
  }

  if (!open) {
    return (
      <div className="video-admin__bar">
        <button type="button" className="gallery-admin__submit" onClick={() => { setOpen(true); setStatus(null) }}>
          + Add YouTube link{isServices ? " (service)" : " (music video)"}
        </button>
        {status?.type === "success" && <p className="gallery-admin__status gallery-admin__status--success">{status.text}</p>}
      </div>
    )
  }

  return (
    <section className="gallery-admin" aria-labelledby={`video-admin-${section}`}>
      <div className="gallery-admin__head">
        <span className="gallery-admin__badge">Admin</span>
        <h2 id={`video-admin-${section}`} className="gallery-admin__title">
          {isServices ? "Add a service recording" : "Add a music video"}
        </h2>
        <p className="gallery-admin__hint">
          Paste any YouTube link (videos, Shorts, Unlisted).{" "}
          {isServices ? "To start at the message, use a link with a time, e.g. …?t=7m37s (YouTube's Share → “Start at”)." : ""}
        </p>
      </div>

      <form className="gallery-admin__form" onSubmit={onSubmit}>
        <div className={`gallery-admin__drop ${youtubeId ? "gallery-admin__drop--filled" : ""}`}>
          {youtubeId ? (
            <img src={`https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`} alt="YouTube video preview" className="gallery-admin__preview" />
          ) : (
            <span className="gallery-admin__drop-text">
              <strong>Paste a YouTube link</strong>
              <span>The preview appears here</span>
            </span>
          )}
        </div>

        <div className="gallery-admin__fields">
          <label className="gallery-admin__field gallery-admin__field--wide">
            <span>YouTube link</span>
            <input value={link} onChange={(e) => setLink(e.target.value)} placeholder="https://youtu.be/…" disabled={busy} inputMode="url" />
          </label>
          <label className="gallery-admin__field gallery-admin__field--wide">
            <span>Title</span>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={isServices ? "The Mind of Christ" : "Hindi Worship Song"}
              disabled={busy}
            />
          </label>
          <label className="gallery-admin__field gallery-admin__field--wide">
            <span>Description (optional)</span>
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={isServices ? "5th Service - 19 December, 2026" : ""}
              disabled={busy}
            />
          </label>

          {status && <p className={`gallery-admin__status gallery-admin__status--${status.type}`}>{status.text}</p>}

          <div className="gallery-admin__actions">
            {!busy && (
              <button type="button" className="gallery-admin__ghost" onClick={() => { reset(); setOpen(false); setStatus(null) }}>
                Cancel
              </button>
            )}
            <button type="submit" className="gallery-admin__submit" disabled={busy || !youtubeId}>
              {busy ? "Adding…" : isServices ? "Add to Our Services" : "Add to Music Videos"}
            </button>
          </div>
        </div>
      </form>
    </section>
  )
}
