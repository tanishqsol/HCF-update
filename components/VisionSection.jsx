"use client"

import { useEffect, useRef, useState } from "react"
import "./VisionSection.css"

const VISION_TEXT = {
  en: {
    headingOur: "Our",
    headingVision: "Vision",
    intro: "We are committed to building a thriving community centered on Christ",
    items: [
      {
        title: "Evangelism & Discipleship",
        description:
          "To share the good news of Jesus Christ with Hindi-speaking Indians in Boston, and to equip them to become faithful followers and leaders.",
        icon: "📖",
      },
      {
        title: "Community & Fellowship",
        description:
          "To create a vibrant, multi-generational community where North Indians can experience genuine fellowship, grow in their faith, and find support as they navigate life in Boston.",
        icon: "🤝",
      },
      {
        title: "Service & Outreach",
        description:
          "To serve the local Hindi-speaking Indian community through acts of love and service, helping newcomers adjust to life in a new country and building bridges through cultural connection.",
        icon: "❤️",
      },
      {
        title: "Holistic Growth",
        description:
          "To provide opportunities for spiritual growth, biblical development, and a deeper understanding of how to integrate faith with their cultural identity.",
        icon: "🌱",
      },
    ],
  },
  hi: {
    headingOur: "हमारा",
    headingVision: "दृष्टिकोण",
    intro: "हम मसीह-केंद्रित एक फलती-फूलती संगति बनाने के लिए प्रतिबद्ध हैं",
    items: [
      {
        title: "सुसमाचार प्रचार और शिष्यत्व",
        description:
          "बोस्टन में हिंदी-भाषी भारतीयों के साथ यीशु मसीह का शुभ समाचार साझा करना और उन्हें विश्वासयोग्य अनुयायी व अगुवा बनने के लिए तैयार करना।",
        icon: "📖",
      },
      {
        title: "समुदाय और संगति",
        description:
          "एक जीवंत, बहु-पीढ़ी समुदाय बनाना जहाँ उत्तर भारतीय सच्ची संगति का अनुभव करें, विश्वास में बढ़ें, और बोस्टन के जीवन में मार्गदर्शन व सहारा पाएँ।",
        icon: "🤝",
      },
      {
        title: "सेवा और पहुँच",
        description:
          "प्रेम और सेवा के कार्यों के माध्यम से स्थानीय हिंदी-भाषी भारतीय समुदाय की सेवा करना, नए लोगों को नए देश में ढलने में मदद करना, और सांस्कृतिक जुड़ाव से पुल बनाना।",
        icon: "❤️",
      },
      {
        title: "समग्र विकास",
        description:
          "आत्मिक विकास, बाइबल-आधारित निर्माण, और विश्वास को सांस्कृतिक पहचान के साथ जोड़ने की गहरी समझ के लिए अवसर प्रदान करना।",
        icon: "🌱",
      },
    ],
  },
}

export default function VisionSection() {
  // ----- Language sync (reads Navbar's toggle) -----
  const LANG_STORAGE_KEY = "hcf_lang"
  const LANG_EVENT = "hcf:lang"

  const [lang, setLang] = useState(() => {
    if (typeof window === "undefined") return "en"
    return window.localStorage.getItem(LANG_STORAGE_KEY) || "en"
  })

  useEffect(() => {
    if (typeof window === "undefined") return

    // initialize from storage
    setLang(window.localStorage.getItem(LANG_STORAGE_KEY) || "en")

    // listen to Navbar events
    const handler = (e) => {
      const next = e?.detail?.lang
      if (next) setLang(next)
    }

    window.addEventListener(LANG_EVENT, handler)
    return () => window.removeEventListener(LANG_EVENT, handler)
  }, [])

  const t = VISION_TEXT[lang] || VISION_TEXT.en
  const visionItems = t.items

  const [isVisible, setIsVisible] = useState(false)
  const [tiltStates, setTiltStates] = useState(() => visionItems.map(() => ({ x: 0, y: 0 })))
  const sectionRef = useRef(null)

  useEffect(() => {
    // Reset tilt states when language changes (keeps animations stable)
    setTiltStates(visionItems.map(() => ({ x: 0, y: 0 })))
  }, [lang])

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

  const handleMouseMove = (e, index) => {
    const card = e.currentTarget
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const centerX = rect.width / 2
    const centerY = rect.height / 2

    const rotateX = (y - centerY) / 10
    const rotateY = (centerX - x) / 10

    setTiltStates((prev) => {
      const newStates = [...prev]
      newStates[index] = { x: rotateX, y: rotateY }
      return newStates
    })
  }

  const handleMouseLeave = (index) => {
    setTiltStates((prev) => {
      const newStates = [...prev]
      newStates[index] = { x: 0, y: 0 }
      return newStates
    })
  }

  return (
    <section id="vision" className="vision-section" ref={sectionRef}>
      <div className="vision-section__bg-gradient" />

      <div className="vision-section__container">
        <div className={`vision-section__header ${isVisible ? "vision-section__header--visible" : ""}`}>
          <h2 className="vision-section__title">
            <span className="text-reveal-word" style={{ animationDelay: "0s" }}>
              {t.headingOur}
            </span>{" "}
            <span className="text-reveal-word" style={{ animationDelay: "0.1s" }}>
              {t.headingVision}
            </span>
          </h2>
          <p className="vision-section__intro">{t.intro}</p>
        </div>

        <div className="vision-section__grid">
          {visionItems.map((item, index) => (
            <div
              key={index}
              className={`vision-card vision-card-3d ${isVisible ? "vision-card--visible" : ""}`}
              style={{
                transitionDelay: `${index * 0.1}s`,
                transform: `perspective(1000px) rotateX(${tiltStates[index]?.x || 0}deg) rotateY(${tiltStates[index]?.y || 0}deg) translateZ(10px)`,
              }}
              onMouseMove={(e) => handleMouseMove(e, index)}
              onMouseLeave={() => handleMouseLeave(index)}
            >
              <div className="vision-card__glow" />
              <div className="vision-card__icon">{item.icon}</div>
              <h3 className="vision-card__title">{item.title}</h3>
              <p className="vision-card__description">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}