"use client"

import "./ResourcesPage.css"

export default function ResourcesPage({ onBack, isDarkMode, onContactRedirect }) {
  const neededRoles = [
    {
      title: "Pianist",
      description: "We're looking for a talented pianist to accompany worship sessions and special events.",
      icon: "🎹",
    },
    {
      title: "Guitarist",
      description: "Join our music team as a guitarist to lead worship and enhance our musical ministry.",
      icon: "🎸",
    },
    {
      title: "Video Editor",
      description: "Help us create compelling visual content for our ministry and social media presence.",
      icon: "🎬",
    },
    {
      title: "Keyboardist",
      description: "Musicians of all instruments are welcome to contribute to our worship and fellowship.",
      icon: "🎹",
    },
    {
      title: "Bookkeeper",
      description: "Assist in maintaining financial records and managing the fellowship's accounts.",
      icon: "💰",
    },
    {
      title: "Facilitators",
      description: "Assist in maintaining financial records and managing the fellowship's accounts.",
      icon: "🤝",
    },
    {
      title: "Kitchen/Food team",
      description: "Assist in maintaining financial records and managing the fellowship's accounts.",
      icon: "🍽️",
    },
    {
      title: "Event Manager",
      description: "Assist in maintaining financial records and managing the fellowship's accounts.",
      icon: "📅",
    }
  ]
  const handleExpressInterest = () => {
    onBack()
    setTimeout(() => {
      const contactSection = document.getElementById("contact")
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: "smooth", block: "start" })
      }
    }, 100)
  }
  return (
    <div className="resources-page">
      <button className="resources-page__back" onClick={onBack} aria-label="Go back">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        Back to Home
      </button>

      <div className="resources-page__container">
        <div className="resources-page__header">
          <h1 className="resources-page__title">Volunteers Needed</h1>
          <p className="resources-page__subtitle">Join our team and use your gifts to serve the fellowship</p>
        </div>

        <div className="resources-page__grid">
          {neededRoles.map((role, index) => (
            <div key={index} className="resource-card" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="resource-card__icon">{role.icon}</div>
              <h3 className="resource-card__title">{role.title}</h3>
              <p className="resource-card__description">{role.description}</p>
              <button className="resource-card__button" onClick={handleExpressInterest}>
                Express Interest
              </button>
            </div>
          ))}
        </div>

        <div className="resources-page__footer">
          <p>Interested in any of these roles?</p>
          <button onClick={handleExpressInterest} className="resources-page__contact-link">            Contact Us
          </button>
        </div>
      </div>
    </div>
  )
}
