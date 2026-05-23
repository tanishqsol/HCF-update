"use client"

import { useEffect, useState } from "react"

import { galleryItems } from "@/lib/galleryItems"

import "./GalleryPage.css"

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
  }, [selectedIndex])

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

        <section className="gallery-mosaic" aria-label="Fellowship photo gallery">
          {galleryItems.map((item, index) => (
            <button
              key={item.id}
              className={`gallery-card gallery-card--${item.layout || "standard"} ${
                isReady ? "gallery-card--visible" : ""
              }`}
              style={{ transitionDelay: `${index * 90}ms` }}
              onClick={() => setSelectedIndex(index)}
              aria-label={`Open photo: ${item.title}`}
              type="button"
            >
              <GalleryImage item={item} className="gallery-card__image" priority={index < 2} />
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
              <GalleryImage item={selectedItem} className="gallery-lightbox__image" priority />
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
