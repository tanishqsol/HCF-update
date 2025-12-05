"use client"

import "./MusicVideosPage.css"

export default function MusicVideosPage({ onBack, isDarkMode }) {
  const videos = [
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
          <h1 className="music-videos-page__title">Music Videos</h1>
          <p className="music-videos-page__subtitle">Original compositions and worship songs from our fellowship</p>
        </div>

        <div className="music-videos-page__grid">
          {videos.map((video, index) => (
            <div key={index} className="video-card" style={{ animationDelay: `${index * 0.2}s` }}>
              <div className="video-card__embed">
                <iframe
                  src={`https://www.youtube.com/embed/${video.id}`}
                  title={video.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
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
