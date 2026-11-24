"use client"

import { useEffect, useMemo, useState } from "react"

import GalleryAdminPanel from "@/components/GalleryAdminPanel"
import { galleryItems as builtInItems } from "@/lib/galleryItems"
import { deleteGalleryItem, useIsGalleryAdmin, useRemoteGallery } from "@/lib/remoteGallery"

import "./GalleryPage.css"
import "./GalleryAdmin.css"

function GalleryImage({ item, className, priority = false }) {
  const [src, setSrc] = useState(item.src)
  const [isFallback, setIsFallback] = useState(false)

  useEffect(() => {
    setSrc(item.src)
    setIsFallback(false)
  }, [item.src])

  return (
    <div className={`gallery-image ${isFallback ? "gallery-image--fallback" : ""}`}>
      <img
        src={src}
        alt={item.alt}
        className={className}
        loading={priority ? "eager" : "lazy"}
        onError={() => {
          if (src !== "/placeholder.jpg") {
            setSrc("/placeholder.jpg")
            setIsFallback(true)
          }
        }}
      />
      {isFallback && <span className="gallery-image__fallback-badge">Add image file</span>}
    </div>
  )
}

export default function GalleryPage({ onBack }) {
  const [isReady, setIsReady] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)
  // Uploaded photos/videos (shared live with the HCF app), newest first, then the built-in photos.
  const { items: remoteItems } = useRemoteGallery()
  const isAdmin = useIsGalleryAdmin()
  const galleryItems = useMemo(() => [...remoteItems, ...builtInItems], [remoteItems])

  // Keep the lightbox valid if an item is removed while it's open.
  useEffect(() => {
    if (selectedIndex !== null && selectedIndex >= galleryItems.length) {
      setSelectedIndex(galleryItems.length ? galleryItems.length - 1 : null)
    }
  }, [galleryItems.length, selectedIndex])

  const handleDelete = async (item) => {
    if (!window.confirm("Remove this from the gallery? It will disappear from the website and the app.")) return
    setIsDeleting(true)
    try {
      await deleteGalleryItem(item)
      setSelectedIndex(null)
    } catch (error) {
      console.error("Gallery delete failed:", error)
      window.alert("Couldn't remove it. Please try again.")
    } finally {
      setIsDeleting(false)
    }
  }

  useEffect(() => {
    setIsReady(true)
  }, [])

  useEffect(() => {
    if (selectedIndex === null) return undefined

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setSelectedIndex(null)
      }

      if (event.key === "ArrowRight") {
        setSelectedIndex((current) => (current + 1) % galleryItems.length)
      }

      if (event.key === "ArrowLeft") {
        setSelectedIndex((current) => (current - 1 + galleryItems.length) % galleryItems.length)
      }
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [selectedIndex, galleryItems.length])

  const selectedItem = selectedIndex !== null ? galleryItems[selectedIndex] : null

  return (
    <div className="gallery-page">
      <button className="gallery-page__back" onClick={onBack} aria-label="Go back to home" type="button">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        Back to Home
      </button>

      <div className="gallery-page__container">
        <section className={`gallery-hero ${isReady ? "gallery-hero--visible" : ""}`}>
          <div className="gallery-hero__copy">
            <div className="gallery-hero__eyebrow">Members Gallery</div>
            <h1 className="gallery-hero__title">Gathered Moments</h1>
            <p className="gallery-hero__subtitle">
              A living gallery of worship, fellowship, shared meals, and the stories God is shaping through HCF.
            </p>

            <div className="gallery-hero__chips">
              <span>Signed-in members only</span>
              <span>{galleryItems.length} moments so far</span>
              <span>Updated as the fellowship grows</span>
            </div>
          </div>

          <div className="gallery-hero__panel">
            <div className="gallery-hero__panel-label">Gallery Flow</div>
            <p>
              Tap any photo to open the lightbox, browse with the arrows, and revisit each gathering in a calmer,
              more cinematic view.
            </p>
          </div>
        </section>

        {isAdmin && <GalleryAdminPanel />}

        <section className="gallery-mosaic" aria-label="Fellowship photo gallery">
          {galleryItems.map((item, index) => (
            <button
              key={item.id}
              className={`gallery-card gallery-card--${item.layout || "standard"} ${
                isReady ? "gallery-card--visible" : ""
              }`}
              style={{ transitionDelay: `${index * 90}ms` }}
              onClick={() => setSelectedIndex(index)}
              aria-label={`Open ${item.kind === "image" || !item.kind ? "photo" : "video"}: ${item.title || item.alt}`}
              type="button"
            >
              <GalleryImage item={item} className="gallery-card__image" priority={index < 2} />
              {(item.kind === "video" || item.kind === "youtube") && (
                <span className="gallery-card__play" aria-hidden="true">
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </span>
              )}
              <div className="gallery-card__veil" />
              <div className="gallery-card__content">
                <span className="gallery-card__tag">{item.tag}</span>
                <h2 className="gallery-card__title">{item.title}</h2>
                <p className="gallery-card__description">{item.description}</p>
              </div>
            </button>
          ))}
        </section>
      </div>

      {selectedItem && (
        <div
          className="gallery-lightbox"
          onClick={() => setSelectedIndex(null)}
          role="dialog"
          aria-modal="true"
          aria-label={selectedItem.title}
        >
          <div className="gallery-lightbox__panel" onClick={(event) => event.stopPropagation()}>
            <button className="gallery-lightbox__close" onClick={() => setSelectedIndex(null)} aria-label="Close gallery view" type="button">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>

            <div className="gallery-lightbox__media">
              {selectedItem.kind === "youtube" ? (
                <iframe
                  key={selectedItem.id}
                  className="gallery-lightbox__video gallery-lightbox__video--youtube"
                  src={`https://www.youtube-nocookie.com/embed/${selectedItem.youtubeId}?autoplay=1&rel=0`}
                  title={selectedItem.title || "Fellowship video"}
                  allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                  allowFullScreen
                />
              ) : selectedItem.kind === "video" ? (
                <video
                  key={selectedItem.id}
                  className="gallery-lightbox__video"
                  src={selectedItem.videoSrc}
                  poster={selectedItem.src}
                  controls
                  autoPlay
                  playsInline
                />
              ) : (
                <GalleryImage item={selectedItem} className="gallery-lightbox__image" priority />
              )}
            </div>

            <div className="gallery-lightbox__footer">
              <div>
                <div className="gallery-lightbox__counter">
                  {selectedIndex + 1} / {galleryItems.length}
                </div>
                <h2 className="gallery-lightbox__title">{selectedItem.title}</h2>
                <p className="gallery-lightbox__description">{selectedItem.description}</p>
              </div>

              <div className="gallery-lightbox__actions">
                {isAdmin && selectedItem.remote && (
                  <button
                    className="gallery-lightbox__delete"
                    onClick={() => handleDelete(selectedItem)}
                    disabled={isDeleting}
                    type="button"
                  >
                    {isDeleting ? "Removing…" : "Remove"}
                  </button>
                )}
                <button
                  className="gallery-lightbox__nav"
                  onClick={() => setSelectedIndex((selectedIndex - 1 + galleryItems.length) % galleryItems.length)}
                  type="button"
                >
                  Previous
                </button>
                <button
                  className="gallery-lightbox__nav gallery-lightbox__nav--primary"
                  onClick={() => setSelectedIndex((selectedIndex + 1) % galleryItems.length)}
                  type="button"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
