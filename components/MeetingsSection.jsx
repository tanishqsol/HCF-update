"use client"

import { useEffect, useRef, useState } from "react"
import "./MeetingsSection.css"

const TEXT = {
  en: {
    title: "HCF Meetings",
    subtitle: "What We Will Do",
    prayer: "Let us pray together and seek God's will for our fellowship",
    join: "Join a Meeting",
    activities: [
      {
        name: "Worship",
        icon: "🎵",
        description:
          "Lifestyle of adoration, surrender, obedient action and kingdom-orienting existence",
      },
      { name: "Prayer", icon: "🙏", description: "Seeking God in all aspects; outreach tool" },
      {
        name: "Word",
        icon: "📖",
        description: "Thematic training, visiting local and global speakers",
      },
      {
        name: "Songs",
        icon: "🎶",
        description: (
          <>
            Hindi/Urdu, English: songs, hymns, <em>bhajan/zaboor</em>, <em>geet</em>, <em>ghazals</em>
          </>
        ),
      },
      {
        name: "Giving",
        icon: "💝",
        description: "Using time, treasure and talent for the kingdom of Jesus Christ",
      },
      {
        name: "Fellowship",
        icon: "☕",
        description: "Doing life together: food, games, retreats, hanging out, concerts, conferences",
      },
    ],
  },
  hi: {
    title: "HCF सभाएँ",
    subtitle: "हम क्या करेंगे",
    prayer: "आइए साथ प्रार्थना करें और अपनी संगति के लिए परमेश्वर की इच्छा खोजें",
    join: "सभा में जुड़ें",
    activities: [
      {
        name: "आराधना",
        icon: "🎵",
        description: "आराधना, समर्पण, आज्ञाकारी जीवन और परमेश्वर के राज्य-केंद्रित जीवनशैली",
      },
      { name: "प्रार्थना", icon: "🙏", description: "जीवन के हर क्षेत्र में परमेश्वर को खोजना; पहुँच का साधन" },
      {
        name: "वचन",
        icon: "📖",
        description: "थीम-आधारित प्रशिक्षण, स्थानीय और वैश्विक वक्ताओं का आगमन",
      },
      {
        name: "गीत",
        icon: "🎶",
        description: (
          <>
            हिंदी/उर्दू, अंग्रेज़ी: गीत, भजन, <em>bhajan/zaboor</em>, <em>geet</em>, <em>ghazals</em>
          </>
        ),
      },
      {
        name: "दान",
        icon: "💝",
        description: "यीशु मसीह के राज्य के लिए समय, धन और प्रतिभा का उपयोग",
      },
      {
        name: "संगति",
        icon: "☕",
        description: "एक साथ जीवन: भोजन, खेल, रिट्रीट, साथ समय, कॉन्सर्ट, कॉन्फ्रेंस",
      },
    ],
  },
}

export default function MeetingsSection() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef(null)

  // ----- Language sync (reads Navbar's toggle) -----
  const LANG_STORAGE_KEY = "hcf_lang"
  const LANG_EVENT = "hcf:lang"

  const [lang, setLang] = useState(() => {
    if (typeof window === "undefined") return "en"
    return window.localStorage.getItem(LANG_STORAGE_KEY) || "en"
  })

  useEffect(() => {
    if (typeof window === "undefined") return

    setLang(window.localStorage.getItem(LANG_STORAGE_KEY) || "en")

    const handler = (e) => {
      const next = e?.detail?.lang
      if (next) setLang(next)
    }

    window.addEventListener(LANG_EVENT, handler)
    return () => window.removeEventListener(LANG_EVENT, handler)
  }, [])

  const t = TEXT[lang] || TEXT.en
  const activities = t.activities

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true)
          }
        })
      },
      { threshold: 0.1 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current)
      }
    }
  }, [])

  return (
    <section id="meetings" className="meetings-section" ref={sectionRef}>
      <div className="meetings-section__container">
        <div className={`meetings-section__header ${isVisible ? "meetings-section__header--visible" : ""}`}>
          <h2 className="meetings-section__title">{t.title}</h2>
          <p className="meetings-section__subtitle">{t.subtitle}</p>
        </div>
        <div className="meetings-section__grid">
          {activities.map((activity, index) => (
            //3x3 grid
            <div
              key={index}
              className={`activity-card ${isVisible ? "activity-card--visible" : ""}`}
              style={{ transitionDelay: `${index * 0.1}s` }}
            >
              <div className="activity-card__icon">{activity.icon}</div>
              <h3 className="activity-card__name">{activity.name}</h3>
              <p className="activity-card__description">{activity.description}</p>
            </div>
          ))}
        </div>
        <div className={`meetings-section__cta ${isVisible ? "meetings-section__cta--visible" : ""}`}>
          <p className="meetings-section__prayer">{t.prayer}</p>
          <button
            className="meetings-section__button"
            onClick={() => document.getElementById("contact").scrollIntoView({ behavior: "smooth" })}
            type="button"
          >
            {t.join}
          </button>
        </div>
      </div>
    </section>
  )
}
