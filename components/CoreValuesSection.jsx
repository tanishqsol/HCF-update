"use client"

import { useEffect, useRef, useState } from "react"
import "./CoreValuesSection.css"

const coreValues = [
  {
    hindi: "Shishyata",
    english: "Christ-Centered Discipleship",
    title_hi: "मसीह-केंद्रित शिष्यत्व",
    description_hi:
      "हम यीशु मसीह के साथ गहरे और बढ़ते संबंध को जीवन और सेवकाई की नींव मानते हैं। हमारा संकल्प है कि हम बाइबल को विश्वासयोग्य रूप से सिखाएँ और विश्वासियों को अगुवा तथा आजीवन यीशु के शिष्य (शिष्य) बनने के लिए तैयार करें।",
    description: "We prioritize a deep, growing relationship with Jesus Christ as the foundation for all life and ministry. Our commitment is to teaching the Bible faithfully and equipping believers to become leaders and lifelong followers of Jesus (shishya).",
    icon: "✝️",
  },
  {
    hindi: "Samudaay",
    english: "Authentic Fellowship",
    title_hi: "सच्ची संगति",
    description_hi:
      "हम एक जीवंत, बहु-पीढ़ी, बाइबल-आधारित और समावेशी परिवार बनाने के लिए प्रतिबद्ध हैं, जहाँ बोस्टन का हर हिंदी-भाषी भारतीय सच्चा प्रेम, सहारा और अपनापन पाए। हम पारदर्शिता, परस्पर उत्साहवर्धन और आत्मिक प्रामाणिकता को महत्व देते हैं।",
    description: "We commit to creating a vibrant, multi-generational, biblical and inclusive family where every Hindi-speaking Indian in Boston finds genuine love, support, and belonging. We value transparency, mutual encouragement, and spiritual authenticity.",
    icon: "🧑‍🤝‍🧑",
  },
  {
    hindi: "Sanskriti",
    english: "Cultural Integration",
    title_hi: "सांस्कृतिक एकीकरण",
    description_hi:
      "हम उत्तर भारतीय सांस्कृतिक पहचान की समृद्ध विरासत का सम्मान और उत्सव करते हैं, और साथ ही यह भी खोजते हैं कि मसीह में विश्वास उसे कैसे पूर्ण रूप से जोड़ता और रूपांतरित करता है। हमारा विश्वास है कि विश्वास हमारी संस्कृति को मिटाता नहीं, बल्कि उसे और समृद्ध करता है।",
    description: "We honor and celebrate the rich North Indian cultural identity while intentionally exploring how faith in Christ fully integrates with and transforms it. We believe faith should enrich, not erase, our cultural heritage.",
    icon: "🪔",
  },
  {
    hindi: "Sewa",
    english: "Selfless Service",
    title_hi: "निस्वार्थ सेवा",
    description_hi:
      "हम स्थानीय हिंदी-भाषी भारतीय समुदाय में मसीह जैसी सेवा (सेवा) के व्यावहारिक कार्यों के माध्यम से परमेश्वर का प्रेम दिखाते हैं। हम नए लोगों को नए देश में जीवन के अनुकूल होने में मदद करते हैं और मित्रता व जुड़ाव के पुल बनाते हैं।",
    description: "We demonstrate God's love through practical acts of Christlike service (Sewa) within the local Hindi-speaking Indian community, actively helping newcomers adjust to life in a new country and building bridges of friendship and connection.",
    icon: "🙏",
  },
  {
    hindi: "Sampurnata",
    english: "Holistic Growth",
    title_hi: "समग्र विकास",
    description_hi:
      "हम हर व्यक्ति के सम्पूर्ण (सम्पूर्णता) विकास (विकास) के लिए समर्पित हैं, अर्थात आत्मिक, बौद्धिक, भावनात्मक और शारीरिक रूप से। हम समझते हैं कि यीशु में सच्चा विश्वास हमारे जीवन के हर क्षेत्र को प्रभावित करता है।",
    description: "We are dedicated to the total (Sampurna) development (Vikas) of every individual—spiritually, intellectually, emotionally, and physically—understanding that true faith in Jesus impacts every part of our lives.",
    icon: "💫",
  },
]

export default function CoreValuesSection() {
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
    <section id="values" className="core-values-section" ref={sectionRef}>
      <div className="core-values-section__container">
        <div className={`core-values-section__header ${isVisible ? "core-values-section__header--visible" : ""}`}>
          <h2 className="core-values-section__title">{lang === "hi" ? "मुख्य मूल्य" : "Core Values"}</h2>
          {/* <p className="core-values-section__subtitle">मूल्य • Moolya</p> */}
          <p className="core-values-section__intro">
            {lang === "hi" ? "वे आधारभूत सिद्धांत जो हमारी संगति का मार्गदर्शन करते हैं" : "The foundational principles that guide our fellowship"}
          </p>
        </div>
        <div className="core-values-section__grid">
          {/* //make grid changes */}
          {coreValues.map((value, index) => (
            <div
              key={index}
              className={`value-card ${isVisible ? "value-card--visible" : ""}`}
              style={{ transitionDelay: `${index * 0.1}s` }}
            >
              <div className="value-card__icon">{value.icon}</div>
              <h4 className="value-card__english">{lang === "hi" ? value.title_hi : value.english}</h4>
              <h3 className="value-card__hindi"><i>{value.hindi}</i></h3>
              <p className="value-card__description">{lang === "hi" ? value.description_hi : value.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
