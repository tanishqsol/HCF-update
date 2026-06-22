"use client"

import { useEffect, useState } from "react"
import "./MusicVideosPage.css"

export default function MusicVideosPage({ onBack, initialTab = "music", isDarkMode }) {
  const normalizeTab = (tab) => (tab === "archives" ? "archives" : "music")
  const [activeTab, setActiveTab] = useState(() => normalizeTab(initialTab))
  const videos = [
    {
      id: "uKEAVkwCumY",
      title: "Hindi Worship Song",
      description: ".",
    },
    {
      id: "6zq-pDlAwbg",
      title: "First Hindi Song - November 2017",
      description:
        "."
    },
    {
      id: "96pB-BK7YRk",
      title: "Urdu Song",
      description:
        "."
    },
  ]
  const serviceArchives = [
    {
      id: "epmgyTnpJfI",
      start: 457,
      title: "Relationship Above Reward",
      description: "4th Service - 20 June, 2026",
    },
    {
      id: "6cGiQk-j7ms",
      start: 4438,
      title: "The Mind of Christ",
      description: "3rd Service - 16 May, 2026",
      watchOnYoutube: true,
    },
    {
      id: "RWST3Ob71nE",
      start: 2284,
      title: "Continually Filled with the Holy Spirit",
      description: "2nd Service - 18 April, 2026",
    },
  ]
  const activeVideos = activeTab === "music" ? videos : serviceArchives

  useEffect(() => {
    const urlTab =
      typeof window === "undefined" ? initialTab : new URLSearchParams(window.location.search).get("tab")

    setActiveTab(normalizeTab(urlTab || initialTab))
  }, [initialTab])

  return (
    <div className="music-videos-page">
      <button className="music-videos-page__back" onClick={onBack} aria-label="Go back">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        Back to Home
      </button>

      <div className="music-videos-page__container">
        <div className="music-videos-page__header">
          <h1 className="music-videos-page__title">{activeTab === "music" ? "Music Videos" : "Our Services"}</h1>
          <p className="music-videos-page__subtitle">
            {activeTab === "music"
              ? "Original compositions and worship songs from our fellowship"
              : "Watch previous HCF services and messages"}
          </p>
          <div className="music-videos-page__tabs" aria-label="Video categories">
            <button
              type="button"
              className={`music-videos-page__tab ${activeTab === "music" ? "music-videos-page__tab--active" : ""}`}
              onClick={() => setActiveTab("music")}
            >
              Music Videos
            </button>
            <button
              type="button"
              className={`music-videos-page__tab ${activeTab === "archives" ? "music-videos-page__tab--active" : ""}`}
              onClick={() => setActiveTab("archives")}
            >
              Our Services
            </button>
          </div>
        </div>

        <div className="music-videos-page__grid">
          {activeVideos.map((video, index) => (
            <div key={`${activeTab}-${video.id}`} className="video-card" style={{ animationDelay: `${index * 0.2}s` }}>
              <div className="video-card__embed">
                {video.watchOnYoutube ? (
                  <a
                    className="video-card__youtube-link"
                    href={`https://www.youtube.com/watch?v=${video.id}${video.start ? `&t=${video.start}s` : ""}`}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`Watch ${video.title} on YouTube`}
                  >
                    <img src={`https://img.youtube.com/vi/${video.id}/hqdefault.jpg`} alt="" />
                    <span className="video-card__play-button">Watch on YouTube</span>
                  </a>
                ) : (
                  <iframe
                    src={`https://www.youtube.com/embed/${video.id}${video.start ? `?start=${video.start}` : ""}`}
                    title={video.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                )}
              </div>
              <div className="video-card__content">
                <h3 className="video-card__title">{video.title}</h3>
                <p className="video-card__description">{video.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
