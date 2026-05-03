"use client"

import "./ResourcesPage.css"

export default function ResourcesPage({ onBack, isDarkMode, onContactRedirect }) {
  const neededRoles = [
    // {
    //   title: "Guitarist",
    //   description: "Join our music team as a guitarist to lead worship and enhance our musical ministry.",
    //   icon: "🎸",
    // },
    // {
    //   title: "Keyboardist",
    //   description: "Musicians of all instruments are welcome to contribute to our worship and fellowship.",
    //   icon: "🎹",
    // },
    {
      title: "Musicians & Singers",
      description: "Use your musical gifts to support worship through singing or instruments and help lead the fellowship in joyful praise.",
      icon: "🎶",
    },
    {
      title: "Bookkeeper",
      description: "Help track donations, expenses, and basic financial records with accuracy, integrity, and good stewardship.",
      icon: "💰",
    },
    {
      title: "Facilitators",
      description: "Welcome people, guide conversations, and help create a warm, organized environment during gatherings and small group moments.",
      icon: "🤝",
    },
    {
      title: "Kitchen/Food team",
      description: "Support meal planning, food setup, serving, and cleanup so our fellowship gatherings feel hospitable and cared for.",
      icon: "🍽️",
    },
    {
      title: "Event Manager",
      description: "Coordinate event details, schedules, volunteers, and logistics to help each gathering run smoothly from start to finish.",
      icon: "📅",
    },
    {
      title: "Graphic Designer",
      description: "Use your creativity to design slides, posters, and digital media that communicate our message clearly and beautifully.",
      icon: "🎨",
    },
    {
      title: "Internal Auditor",
      description: "Support transparency and good stewardship by helping review our financial practices and internal processes.",
      icon: "🧾",
    },
  ]
  const handleExpressInterest = () => {
    if (onContactRedirect) {
      onContactRedirect()
      return
    }

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
