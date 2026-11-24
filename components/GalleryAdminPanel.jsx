"use client"

import { useRef, useState } from "react"

import { uploadGalleryItem } from "@/lib/remoteGallery"

import "./GalleryAdmin.css"

// Shown on the Gallery page only to admin@hcfgreaterboston.com.
// Uploads go to Firebase and appear immediately here and in the HCF mobile app.
export default function GalleryAdminPanel() {
  const inputRef = useRef(null)
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState("")
  const [title, setTitle] = useState("")
  const [tag, setTag] = useState("")
  const [description, setDescription] = useState("")
  const [progress, setProgress] = useState(null)
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
    if (!next.type.startsWith("image/") && !next.type.startsWith("video/")) {
      setStatus({ type: "error", text: "Please choose a photo or a video." })
      return
    }
    if (preview) URL.revokeObjectURL(preview)
    setFile(next)
    setPreview(URL.createObjectURL(next))
    setStatus(null)
  }

  const onSubmit = async (event) => {
    event.preventDefault()
    if (!file) {
      setStatus({ type: "error", text: "Choose a photo or video first." })
      return
    }
    setStatus(null)
    setProgress(0)
    try {
      await uploadGalleryItem(file, { title, description, tag }, setProgress)
      reset()
      setStatus({ type: "success", text: "Added to the gallery. It's now live on the website and in the app." })
    } catch (error) {
      console.error("Gallery upload failed:", error)
      setStatus({ type: "error", text: `Upload failed. ${error?.code === "storage/unauthorized" ? "This account isn't allowed to upload." : "Please try again."}` })
    } finally {
      setProgress(null)
    }
  }

  const uploading = progress !== null
  const isVideo = file?.type.startsWith("video/")

  return (
    <section className="gallery-admin" aria-labelledby="gallery-admin-title">
      <div className="gallery-admin__head">
        <span className="gallery-admin__badge">Admin</span>
        <h2 id="gallery-admin-title" className="gallery-admin__title">Add to the gallery</h2>
        <p className="gallery-admin__hint">Photos and videos appear here and in the HCF app right away.</p>
      </div>

      <form className="gallery-admin__form" onSubmit={onSubmit}>
        <label className={`gallery-admin__drop ${preview ? "gallery-admin__drop--filled" : ""}`}>
          <input ref={inputRef} type="file" accept="image/*,video/*" onChange={onPick} disabled={uploading} />
          {preview ? (
            isVideo ? (
              <video src={preview} muted playsInline controls className="gallery-admin__preview" />
            ) : (
              <img src={preview} alt="Selected file preview" className="gallery-admin__preview" />
            )
          ) : (
            <span className="gallery-admin__drop-text">
              <strong>Choose a photo or video</strong>
              <span>JPG, PNG, HEIC, MP4 or MOV</span>
            </span>
          )}
        </label>

        <div className="gallery-admin__fields">
          <label className="gallery-admin__field">
            <span>Title (optional)</span>
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Christmas Fellowship 2026" disabled={uploading} />
          </label>
          <label className="gallery-admin__field">
            <span>Tag (optional)</span>
            <input value={tag} onChange={(e) => setTag(e.target.value)} placeholder="Worship" disabled={uploading} />
          </label>
          <label className="gallery-admin__field gallery-admin__field--wide">
            <span>Description (optional)</span>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} disabled={uploading} />
          </label>

          {uploading && (
            <div className="gallery-admin__progress" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress * 100)}>
              <div style={{ width: `${Math.round(progress * 100)}%` }} />
            </div>
          )}
          {status && <p className={`gallery-admin__status gallery-admin__status--${status.type}`}>{status.text}</p>}

          <div className="gallery-admin__actions">
            {file && !uploading && (
              <button type="button" className="gallery-admin__ghost" onClick={reset}>
                Clear
              </button>
            )}
            <button type="submit" className="gallery-admin__submit" disabled={!file || uploading}>
              {uploading ? `Uploading… ${Math.round(progress * 100)}%` : "Add to gallery"}
            </button>
          </div>
        </div>
      </form>
    </section>
  )
}
