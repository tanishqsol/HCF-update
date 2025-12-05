"use client"

import { useEffect, useRef, useState } from "react"
import "./TeamsPage.css"

const coreTeam = [
  {
    name: "Dr. Shashi Jatiani",
    role: "Founder",
    description: "Leading HCF with vision and passion for reaching North Indians with the gospel.",
    email: "shashi@hcfboston.org",
    about:
      "Dr. Shashi Jatiani is the visionary founder of Hindu Christian Fellowship (HCF) of Greater Boston. With a deep passion for reaching North Indians with the transformative message of the gospel, he has dedicated his life to building bridges between cultures and faith communities. His leadership has been instrumental in establishing HCF as a welcoming community for spiritual seekers and believers alike.",
  },
  {
    name: "Asavari Jatiani",
    role: "Co-founder",
    description: "Co-leading the ministry with dedication to building community and discipleship.",
    email: "asavari@hcfboston.org",
    about:
      "Asavari Jatiani serves as the co-founder of HCF, bringing warmth, compassion, and dedication to the ministry. She plays a vital role in fostering community connections and nurturing discipleship among members. Her heart for hospitality and spiritual growth creates an environment where people feel welcomed and encouraged in their faith journey.",
  },
  {
    name: "Tom Kane",
    role: "Partner",
    description: "Supporting the ministry with strategic partnership and guidance.",
    about:
      "Tom Kane brings valuable strategic partnership and guidance to HCF. His wisdom and experience in ministry leadership help shape the direction and effectiveness of the fellowship. Tom's commitment to the mission ensures that HCF remains focused on its core values while adapting to meet the evolving needs of the community.",
  },
  {
    name: "Swaroop Pidakala",
    role: "Partner",
    description: "Partnering in ministry to expand the reach and impact of HCF.",
    about:
      "Swaroop Pidakala is a dedicated partner in HCF's ministry, working tirelessly to expand the fellowship's reach and impact. His passion for outreach and community building helps connect more people with the message of hope and faith. Swaroop's enthusiasm and commitment inspire others to get involved in the mission.",
  },
  {
    name: "Mike Frost",
    role: "Partner",
    description: "Contributing partnership and support to the HCF mission.",
    about:
      "Mike Frost contributes invaluable partnership and support to HCF's mission. His dedication to the ministry and his collaborative spirit strengthen the fellowship's foundation. Mike's involvement ensures that HCF has the resources and support needed to thrive and grow in its outreach efforts.",
  },
  {
    name: "Gary McCann",
    role: "Networker, Prayer Partner",
    description: "Building connections and leading prayer ministry for HCF.",
    about:
      "Gary McCann serves as a vital networker and prayer partner for HCF. His gift for building connections brings together believers from various backgrounds to support the ministry. Gary's dedication to prayer creates a spiritual foundation that undergirds all of HCF's activities, ensuring that the work is rooted in faith and dependence on God.",
  },
]

const keyVolunteers = [
  {
    name: "Kundan Srivastava",
    role: "Key Volunteer Leader",
    areas: "Prayer laborer, Outreach, Strategy",
    about:
      "Kundan Srivastava is a key volunteer leader who serves with excellence in multiple areas of ministry. As a dedicated prayer laborer, he intercedes for the fellowship and its members. His strategic thinking and passion for outreach help HCF reach new people and communities with the gospel message.",
  },
  {
    name: "Tanishq Solanki",
    role: "Key Volunteer Leader",
    areas: "Prayer laborer, Website designer & developer, Social Media",
    about:
      "Tanishq Solanki brings a unique blend of technical skills and spiritual dedication to HCF. As a talented website designer and developer, he ensures that HCF has a strong online presence. His expertise in social media helps spread the message far and wide, while his commitment to prayer keeps the ministry grounded in faith.",
  },
]

export default function TeamsPage({ onBack, isDarkMode }) {
  const [isVisible, setIsVisible] = useState(false)
  const [selectedMember, setSelectedMember] = useState(null)
  const pageRef = useRef(null)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const handleCardClick = (member) => {
    setSelectedMember(member)
  }

  const handleCloseModal = () => {
    setSelectedMember(null)
  }

  return (
    <div className="teams-page" ref={pageRef}>
      <button className="teams-page__back" onClick={onBack} aria-label="Go back">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        Back to Home
      </button>

      <div className="teams-page__container">
        <div className={`teams-page__header ${isVisible ? "teams-page__header--visible" : ""}`}>
          <h1 className="teams-page__title">Meet Our Team</h1>
          <p className="teams-page__subtitle">The dedicated people behind HCF of Greater Boston</p>
        </div>

        <section className="teams-page__section">
          <h2 className="teams-page__section-title">Core Leadership</h2>
          <div className="teams-grid">
            {coreTeam.map((member, index) => (
              <div
                key={index}
                className={`team-profile ${isVisible ? "team-profile--visible" : ""}`}
                style={{ transitionDelay: `${index * 0.1}s` }}
                onClick={() => handleCardClick(member)}
              >
                <div className="team-profile__avatar">
                  <span className="team-profile__initial">{member.name.charAt(0)}</span>
                  <div className="team-profile__ring"></div>
                </div>
                <div className="team-profile__content">
                  <h3 className="team-profile__name">{member.name}</h3>
                  <p className="team-profile__role">{member.role}</p>
                  <p className="team-profile__description">{member.description}</p>
                  {member.email && (
                    <a href={`mailto:${member.email}`} className="team-profile__email">
                      {member.email}
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="teams-page__section">
          <h2 className="teams-page__section-title">Key Volunteer Leaders</h2>
          <div className="volunteers-grid">
            {keyVolunteers.map((volunteer, index) => (
              <div
                key={index}
                className={`volunteer-profile ${isVisible ? "volunteer-profile--visible" : ""}`}
                style={{ transitionDelay: `${(coreTeam.length + index) * 0.1}s` }}
                onClick={() => handleCardClick(volunteer)}
              >
                <div className="volunteer-profile__avatar">
                  <span className="volunteer-profile__initial">{volunteer.name.charAt(0)}</span>
                </div>
                <div className="volunteer-profile__content">
                  <h3 className="volunteer-profile__name">{volunteer.name}</h3>
                  <p className="volunteer-profile__role">{volunteer.role}</p>
                  <p className="volunteer-profile__areas">{volunteer.areas}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {selectedMember && (
        <div className="team-modal" onClick={handleCloseModal}>
          <div className="team-modal__content" onClick={(e) => e.stopPropagation()}>
            <button className="team-modal__close" onClick={handleCloseModal} aria-label="Close modal">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>

            <div className="team-modal__avatar">
              <span className="team-modal__initial">{selectedMember.name.charAt(0)}</span>
            </div>

            <h2 className="team-modal__name">{selectedMember.name}</h2>
            <p className="team-modal__role">{selectedMember.role}</p>

            {selectedMember.areas && <p className="team-modal__areas">{selectedMember.areas}</p>}

            <div className="team-modal__divider"></div>

            <div className="team-modal__about">
              <h3 className="team-modal__about-title">About</h3>
              <p className="team-modal__about-text">{selectedMember.about}</p>
            </div>

            {selectedMember.email && (
              <a href={`mailto:${selectedMember.email}`} className="team-modal__email">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                {selectedMember.email}
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
