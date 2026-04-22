"use client"

import { useEffect, useRef, useState } from "react"
import "./CreativeAvenuesSection.css"

const TEXT = {
  en: {
    title: "Cultural Activities",
    subtitle: "Festivals & Gatherings",
    intro:
      "Celebrating our faith through culture, bringing together Indian traditions and Christian values",
    festivals: [
      {
        name: "Roshni (Diwali)",
        description: "Diwali-themed gathering celebrating the light of Christ in our homes and community.",
        icon: "🪔",
      },
      {
        name: "Bhai-Behen Diwas (Raksha Bandhan)",
        description: "Raksha Bandhan / Rakhi–style celebration honoring the bond of brothers and sisters in Christ.",
        icon: "🎀",
      },
      {
        name: "Rangoli (Holi)",
        description: "Colorful Holi-inspired gathering rejoicing in the joy and grace of God.",
        icon: "🎨",
      },
      {
        name: "Vasant (Spring Festival)",
        description:
          "Spring festival alternative drawing from Baisaakhi, and Cheti Chand to celebrate new beginnings.",
        icon: "🌸",
      },
      {
        name: "Naya Saal (New Year)",
        description: "New Year gathering to pray, worship, and dedicate the year to God.",
        icon: "🎉",
      },
      {
        name: "Sewa (Feet Washing)",
        description: "Service-focused gathering centered on Jesus’ example of humility and serving others.",
        icon: "🦶",
      },
      {
        name: "Balidaan (Good Friday)",
        description: "Reflective service remembering the sacrifice of Jesus on Good Friday.",
        icon: "✝️",
      },
      {
        name: "Punahrithaan (Resurrection Sunday)",
        description: "Resurrection Sunday celebration of Christ’s victory over death.",
        icon: "🌅",
      },
      {
        name: "Phasal (Harvest Festival - Halloween)",
        description: "Harvest-themed alternative to Halloween, thanking God for His provision.",
        icon: "🌾",
      },
      {
        name: "Bada Din (Christmas)",
        description: "Christmas celebration focusing on the birth of Jesus, our Savior.",
        icon: "🎄",
      },
      {
        name: "Swantratra (India Independence Day)",
        description: "All-night prayer gathering seeking God together as a community.",
        icon: "🇮🇳",
      },
      {
        name: "Cricket World Cups",
        description: "Watch parties and gatherings around major Cricket World Cup matches.",
        icon: "🏏",
      },
      {
        name: "Career Counseling - Christian Professionals Day",
        description: "Events supporting students and professionals in their career journeys.",
        icon: "💼",
      },
      {
        name: "Jagran (All night prayer)",
        description: "All-night prayer gathering seeking God together as a community.",
        icon: "🌙",
      },
    ],
  },
  hi: {
    title: "सांस्कृतिक गतिविधियाँ",
    subtitle: "उत्सव और संगति",
    intro: "संस्कृति के माध्यम से अपने विश्वास का उत्सव, परंपराओं और मसीही मूल्यों को साथ लाना",
    festivals: [
      {
        name: "Roshni (Diwali)",
        description: "दीवाली-थीम संगति, हमारे घरों और समुदाय में मसीह के प्रकाश का उत्सव।",
        icon: "🪔",
      },
      {
        name: "Bhai-Behen Diwas (Raksha Bandhan)",
        description: "रक्षा बंधन/राखी-शैली का आयोजन, मसीह में भाई-बहन के बंधन का सम्मान।",
        icon: "🎀",
      },
      {
        name: "Rangoli (Holi)",
        description: "होली-प्रेरित रंगीन संगति, परमेश्वर की आनंद और अनुग्रह में हर्ष।",
        icon: "🎨",
      },
      {
        name: "Vasant (Spring Festival)",
        description: "बैसाखी और चेती चाँद से प्रेरित वसंत उत्सव, नई शुरुआत का उत्सव।",
        icon: "🌸",
      },
      {
        name: "Naya Saal (New Year)",
        description: "नव वर्ष संगति: प्रार्थना, आराधना, और वर्ष को परमेश्वर को समर्पित करना।",
        icon: "🎉",
      },
      {
        name: "Sewa (Feet Washing)",
        description: "सेवा-केंद्रित संगति, यीशु के नम्रता और सेवा के उदाहरण पर आधारित।",
        icon: "🦶",
      },
      {
        name: "Balidaan (Good Friday)",
        description: "गुड फ्राइडे पर यीशु के बलिदान को स्मरण करने वाली चिंतनशील सभा।",
        icon: "✝️",
      },
      {
        name: "Punahrithaan (Resurrection Sunday)",
        description: "पुनरुत्थान रविवार: मृत्यु पर मसीह की विजय का उत्सव।",
        icon: "🌅",
      },
      {
        name: "Phasal (Harvest Festival - Halloween)",
        description: "हैलोवीन के विकल्प के रूप में फसल-थीम संगति, परमेश्वर की व्यवस्था के लिए धन्यवाद।",
        icon: "🌾",
      },
      {
        name: "Bada Din (Christmas)",
        description: "क्रिसमस: हमारे उद्धारकर्ता यीशु के जन्म का उत्सव।",
        icon: "🎄",
      },
      {
        name: "Swantratra (India Independence Day)",
        description: "रात भर प्रार्थना सभा, समुदाय के रूप में परमेश्वर को साथ खोजते हुए।",
        icon: "🇮🇳",
      },
      {
        name: "Cricket World Cups",
        description: "मुख्य क्रिकेट विश्व कप मैचों के लिए वॉच पार्टी और संगति।",
        icon: "🏏",
      },
      {
        name: "Career Counseling - Christian Professionals Day",
        description: "छात्रों और प्रोफेशनल्स के करियर सफर को समर्थन देने वाले कार्यक्रम।",
        icon: "💼",
      },
      {
        name: "Jagran (All night prayer)",
        description: "रात भर प्रार्थना सभा, समुदाय के रूप में परमेश्वर को साथ खोजते हुए।",
        icon: "🌙",
      },
    ],
  },
}

export default function CreativeAvenuesSection() {
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

    // init from storage
    setLang(window.localStorage.getItem(LANG_STORAGE_KEY) || "en")

    // listen to Navbar events
    const handler = (e) => {
      const next = e?.detail?.lang
      if (next) setLang(next)
    }

    window.addEventListener(LANG_EVENT, handler)
    return () => window.removeEventListener(LANG_EVENT, handler)
  }, [])

  const t = TEXT[lang] || TEXT.en
  const festivals = t.festivals

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
    <section id="festivals" className="creative-section" ref={sectionRef}>
      <div className="creative-section__container">
        <div className={`creative-section__header ${isVisible ? "creative-section__header--visible" : ""}`}>
          <h2 className="creative-section__title">{t.title}</h2>
          <p className="creative-section__subtitle">{t.subtitle}</p>
          <p className="creative-section__intro">{t.intro}</p>
        </div>
        <div className="creative-section__grid">
          {festivals.map((festival, index) => (
            <div
              key={index}
              className={`festival-card ${isVisible ? "festival-card--visible" : ""}`}
              style={{ transitionDelay: `${index * 0.1}s` }}
            >
              <div className="festival-card__icon">{festival.icon}</div>
              <h3 className="festival-card__name">{festival.name}</h3>
              <p className="festival-card__description">{festival.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}