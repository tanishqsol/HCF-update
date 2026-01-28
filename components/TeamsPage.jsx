"use client"

import { useEffect, useRef, useState } from "react"
import "./TeamsPage.css"

const Silhouette = ({ gender = "male" }) => {
  // Simple inline SVG placeholder (no external image files needed)
  const isFemale = gender === "female"

  return (
    <svg viewBox="0 0 64 64" width="100%" height="100%" aria-hidden="true">
      {/* head */}
      <circle cx="32" cy="22" r="12" fill="#b0b0b0" />

      {/* shoulders/body */}
      <path
        d="M10 58c0-14.5 10.5-22 22-22s22 7.5 22 22"
        fill="#b0b0b0"
      />

      {/* small hair hint for female */}
      {isFemale && (
        <path
          d="M20 20c3-10 21-10 24 0 0 0-4-6-12-6s-12 6-12 6z"
          fill="#9f9f9f"
        />
      )}
    </svg>
  )
}

const coreTeam = [
  {
    name: "Dr. Shashi Jatiani",
    role: "Founder",
    photo: "/images/team/shashi_prof.jpeg",
    description: "Leading HCF with vision and passion for reaching North Indians with the gospel.",
    email: "sjatiani@gmail.com",
    about:
      "Dr. Shashi Jatiani’s journey of faith began as a teenager in India, sparking a lifelong commitment to serve the Lord Jesus globally in various capacities. As the visionary founder of the Hindi Christian Fellowship (HCF) of Greater Boston, Dr. Jatiani leverages his multilingual expertise to reach North Indians with the transformative message of the Gospel in their own heart-language. He is deeply dedicated to building bridges between faith in Christ and God-ordained culture, establishing HCF as a premier, welcoming community for both spiritual seekers and seasoned believers.",
  },
  // {
  //   name: "Asavari Jatiani",
  //   role: "Co-founder",
  //   gender: "female",
  //   photo: "",
  //   description: "Co-leading the ministry with dedication to building community and discipleship.",
  //   email: "ajatiani@gmail.com",
  //   about:
  //     "Asavari Jatiani serves as the co-founder of HCF, bringing warmth, compassion, and dedication to the ministry. She plays a vital role in fostering community connections and nurturing discipleship among members. Her heart for hospitality and spiritual growth creates an environment where people feel welcomed and encouraged in their faith journey.",
  // },
  {
    name: "Tom Kane",
    role: "Partner",
    photo: "images/team/tom_profile-2.jpeg",
    description: "Supporting the ministry with strategic partnership and guidance.",
    email: "t_kane_123@yahoo.com", 
    about: "I grew up on Long Island, New York in a suburban community with my four brothersand my parents. I attended Stony Brook University where I graduated with a degree ineconomics and did some graduate work at Purdue University. I became a born-again Christian at the age of 19. I moved up to Boston in 2006, where I am a member of Park Street Church, attending there since 2007. I work in the financial services industry for a large life insurance company that is headquartered in Boston. My ministry interests are in the areas of evangelism, discipleship and corporate prayer. I am a lifelong bachelor and currently live in Everett, MA",
  },
  {
    name: "Swaroop Pidakala",
    role: "Partner",
    photo: "/images/team/swaroop_prof.png",
    description: "Partnering in ministry to expand the reach and impact of HCF.",
    email: "swaroopk2@gmail.com",
    about: "Swaroop is deeply committed to discipling students from every nation and equipping them to follow Jesus faithfully. Based in the Boston area, he serves among international students, walking alongside them as they grow as disciples and develop a clear, missional vision for their lives. He carries a particular burden for the Indian student community, especially Hindi-speaking students, and longs to see them come to faith in Christ, mature spiritually, and be formed into servant leaders. Swaroop’s desire is that the Hindi Christian Fellowship of Boston would be used as an instrument to lead North Indian students in Boston to the light of Jesus, strengthening and multiplying Christ-centered fellowships and contributing to the planting and growth of healthy churches among Indian communities in the U.S. and beyond."
  },
  {
    name: "Mike Frost",
    role: "Partner",
    photo: "/images/team/mike_prof.png",
    description: "Contributing partnership and support to the HCF mission.",
    email: "Mike.frost@bridgesinternational.com",
    about:
      "Mike is passionate about helping people from every nation learn what it means to be a disciple of Jesus. In 2022, Mike and his family moved to Boston to serve as one of the team leaders with Bridges International, helping international students in the Boston area find a home away from home and thrive spiritually. Mike would love to see the North Indian students he meets in Boston get connected to HCF so they can grow spiritually and experience fellowship with North Indian families in the Boston area.",
  },
  {
    name: "Gary McCann",
    role: "Networker, Prayer Partner",
    gender: "male",
    photo: "/images/team/gary_profile.png",
    description: "Building connections and leading prayer ministry for HCF.",
    email: "garyrmccann@outlook.com",
    about:
      "Gary McCann serves as a vital networker and prayer partner for HCF. His gift for building connections brings together believers from various backgrounds to support the ministry. Gary's dedication to prayer creates a spiritual foundation that undergirds all of HCF's activities, ensuring that the work is rooted in faith and dependence on God.",
  },
  {
  name: "Tanishq Solanki",
  role: "Key Volunteer Leader",
  gender: "male",
  photo: "/images/team/tanishq_profile.png",
  description: "Built and maintains HCF’s website and digital presence, supporting outreach through web and media.",
  email: "tanishqsolanki7@gmail.com",
  about:
    "Tanishq Solanki brings a strong blend of software engineering skill and a sincere commitment to Jesus to HCF. As a software developer, he builds and maintains key parts of HCF’s digital presence, making sure the website is reliable, clear, and easy for people to connect with. He also supports outreach through thoughtful content and social media, helping the message reach more Hindi-speaking friends and families. Above all, his faith and prayerful dependence on Jesus keep his work centered on serving God and strengthening the fellowship.",
},
]

const keyVolunteers = [
  {
    name: "Tanishq Solanki",
    role: "Key Volunteer Leader",
    gender: "male",
    photo: "/images/team/tanishq_profile.png",
    areas: "Prayer laborer, Website designer & developer, Social Media",
    // email:"srishtu03@gmail.com",
    about:
      "Tanishq Solanki brings a strong blend of software engineering skill and a sincere commitment to Jesus to HCF. As a software developer, he builds and maintains key parts of HCF’s digital presence, making sure the website is reliable, clear, and easy for people to connect with. He also supports outreach through thoughtful content and social media, helping the message reach more Hindi-speaking friends and families. Above all, his faith and prayerful dependence on Jesus keep his work centered on serving God and strengthening the fellowship.",
  },
  {
    name: "Kundan Srivastava",
    role: "Key Volunteer Leader",
    gender: "male",
    photo: "",
    areas: "Prayer laborer, Outreach, Strategy",
    about:
      "Kundan Srivastava is a key volunteer leader who serves with excellence in multiple areas of ministry. As a dedicated prayer laborer, he intercedes for the fellowship and its members. His strategic thinking and passion for outreach help HCF reach new people and communities with the gospel message.",
  },
   {
    name: "Dale Alphonso",
    role: "Key Volunteer Leader",
    gender: "male",
    photo: "/images/team/dale_profile.png",
    areas: "Prayer laborer",
    about:"Dale Alphonso is originally from Mumbai, India, and came to this country as an international student. She is currently studying at Northeastern University. Not only does Dale have a goal for her future, but she also has a calling on her heart to serve the Lord Jesus and work for His Kingdom. She feels that God has called her to be an intercessor in prayer, to be a watchman, and to be a witness to the truth, wanting to be behind the scenes, standing in the gap for others through prayer. She has a desire to know the Lord more intimately, to get close to Him, and she has a passion to help others know Him so that they too can taste and see that the Lord is good."
   },
   {
    name: "Srishti Michael",
    role: "Key Volunteer Leader",
    gender: "male",
    photo: "/images/team/srishti_profile.png",
    areas: "Prayer laborer",
    about:
      "She is currently studying at Northeastern University. Srishti seek to walk in Lord’s will and serve him by loving people and sharing his truth. Her desire is to grow in faith and be a witness of God’s love at HCF.",
  },
]

export default function TeamsPage({ onBack }) {
  const [isVisible, setIsVisible] = useState(false)
  const [selectedMember, setSelectedMember] = useState(null)
  const pageRef = useRef(null)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const handleCardClick = (member) => setSelectedMember(member)
  const handleCloseModal = () => setSelectedMember(null)

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
                key={`${member.name}-${index}`}
                className={`team-profile ${isVisible ? "team-profile--visible" : ""}`}
                style={{ transitionDelay: `${index * 0.1}s` }}
                onClick={() => handleCardClick(member)}
              >
                <div className="team-profile__avatar">
                  {member.photo ? (
                    <img
                      src={member.photo}
                      alt={member.name}
                      style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover", display: "block" }}
                    />
                  ) : (
                    <Silhouette gender={member.gender} />
                  )}
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
          <h2 className="teams-page__section-title">Key Volunteers</h2>
          <div className="volunteers-grid">
            {keyVolunteers.map((volunteer, index) => (
              <div
                key={`${volunteer.name}-${index}`}
                className={`volunteer-profile ${isVisible ? "volunteer-profile--visible" : ""}`}
                style={{ transitionDelay: `${(coreTeam.length + index) * 0.1}s` }}
                onClick={() => handleCardClick(volunteer)}
              >
                <div className="volunteer-profile__avatar">
                  {volunteer.photo ? (
                    <img
                      src={volunteer.photo}
                      alt={volunteer.name}
                      style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover", display: "block" }}
                    />
                  ) : (
                    <Silhouette gender={volunteer.gender} />
                  )}
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
              {selectedMember.photo ? (
                <img
                  src={selectedMember.photo}
                  alt={selectedMember.name}
                  style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover", display: "block" }}
                />
              ) : (
                <Silhouette gender={selectedMember.gender} />
              )}
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