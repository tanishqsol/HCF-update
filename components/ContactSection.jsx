"use client"

import { useEffect, useRef, useState } from "react"
import { InstagramIcon, YouTubeIcon } from "./SocialIcons"
import "./ContactSection.css"

const TEXT = {
  en: {
    title: "Get In Touch",
    intro: "We'd love to hear from you. Reach out to join our fellowship or learn more.",
    contactInfo: "Contact Information",
    email: "Email",
    location: "Location",
    locationValue: "Greater Boston Area, MA",
    followUs: "Follow Us",
    socialNote: "Follow along for fellowship updates, worship clips, and community moments.",
    name: "Name",
    namePlaceholder: "Your name",
    message: "Message",
    messagePlaceholder: "How can we help you?",
    send: "Send Message",
    sending: "Sending...",
    success: "Thank you! Your message has been sent successfully.",
    error: "Failed to send message. Please try again.",
    networkError: "Network error. Please check your connection and try again.",
  },
  hi: {
    title: "संपर्क करें",
    intro: "हम आपसे सुनना चाहेंगे। हमारी संगति से जुड़ने या और जानने के लिए हमसे संपर्क करें।",
    contactInfo: "संपर्क जानकारी",
    email: "ईमेल",
    location: "स्थान",
    locationValue: "ग्रेटर बोस्टन क्षेत्र, मैसाचुसेट्स",
    followUs: "हमें फॉलो करें",
    socialNote: "संगति अपडेट, आराधना क्लिप और समुदाय की झलकियों के लिए हमें फॉलो करें।",
    name: "नाम",
    namePlaceholder: "अपना नाम लिखें",
    message: "संदेश",
    messagePlaceholder: "हम आपकी कैसे सहायता कर सकते हैं?",
    send: "संदेश भेजें",
    sending: "भेजा जा रहा है...",
    success: "धन्यवाद! आपका संदेश सफलतापूर्वक भेज दिया गया है।",
    error: "संदेश भेजा नहीं जा सका। कृपया फिर से प्रयास करें।",
    networkError: "नेटवर्क त्रुटि हुई। कृपया अपना कनेक्शन जांचें और फिर से प्रयास करें।",
  },
}

export default function ContactSection() {
  const [isVisible, setIsVisible] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null)
  const sectionRef = useRef(null)

  const LANG_STORAGE_KEY = "hcf_lang"
  const LANG_EVENT = "hcf:lang"

  const [lang, setLang] = useState(() => {
    if (typeof window === "undefined") return "en"
    return window.localStorage.getItem(LANG_STORAGE_KEY) || "en"
  })

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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus(null)

    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        setSubmitStatus({ type: "success", message: t.success })
        setFormData({ name: "", email: "", message: "" })
      } else {
        setSubmitStatus({ type: "error", message: lang === "hi" ? t.error : data.error || t.error })
      }
    } catch (error) {
      setSubmitStatus({ type: "error", message: t.networkError })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="contact" className="contact-section" ref={sectionRef}>
      <div className="contact-section__container">
        <div className={`contact-section__header ${isVisible ? "contact-section__header--visible" : ""}`}>
          <h2 className="contact-section__title">{t.title}</h2>
          <p className="contact-section__intro">{t.intro}</p>
        </div>
        <div className="contact-section__content">
          <div className={`contact-section__info ${isVisible ? "contact-section__info--visible" : ""}`}>
            <h3 className="contact-section__subtitle">{t.contactInfo}</h3>
            <div className="contact-info">
              <div
                className={`contact-info__item ${isVisible ? "contact-info__item--visible" : ""}`}
                style={{ transitionDelay: "0.28s" }}
              >
                <span className="contact-info__icon">📧</span>
                <div className="contact-info__details">
                  <strong>{t.email}</strong>
                  <p>
                    <a href="mailto:hcfgreaterboston@gmail.com">hcfgreaterboston@gmail.com</a>
                  </p>
                </div>
              </div>
              <div
                className={`contact-info__item ${isVisible ? "contact-info__item--visible" : ""}`}
                style={{ transitionDelay: "0.4s" }}
              >
                <span className="contact-info__icon">📍</span>
                <div className="contact-info__details">
                  <strong>{t.location}</strong>
                  <p>{t.locationValue}</p>
                </div>
              </div>
            </div>
            <div className={`contact-section__social ${isVisible ? "contact-section__social--visible" : ""}`}>
              <h4 className="contact-section__social-title">{t.followUs}</h4>
              <div className="contact-section__social-links">
                <a href="https://www.facebook.com/share/1BiW5JdifG/" className="social-link" target="_blank" rel="noreferrer">
                  Facebook
                </a>
                <a href="https://www.youtube.com/@HindiChristianFellowshipHCF" className="social-link" target="_blank" rel="noreferrer">
                  <YouTubeIcon className="social-link__icon" />
                  YouTube
                </a>
                <a href="https://www.instagram.com/hcfgreaterboston/" className="social-link" target="_blank" rel="noreferrer">
                  <InstagramIcon className="social-link__icon" />
                  Instagram
                </a>
              </div>
              <p className="contact-section__social-note">{t.socialNote}</p>
            </div>
          </div>
          <form
            className={`contact-section__form ${isVisible ? "contact-section__form--visible" : ""}`}
            onSubmit={handleSubmit}
          >
            {submitStatus && (
              <div className={`form-status form-status--${submitStatus.type}`}>{submitStatus.message}</div>
            )}
            <div className={`form-group ${isVisible ? "form-group--visible" : ""}`} style={{ transitionDelay: "0.5s" }}>
              <label htmlFor="name">{t.name}</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder={t.namePlaceholder}
                disabled={isSubmitting}
              />
            </div>
            <div className={`form-group ${isVisible ? "form-group--visible" : ""}`} style={{ transitionDelay: "0.6s" }}>
              <label htmlFor="email">{t.email}</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="your.email@example.com"
                disabled={isSubmitting}
              />
            </div>
            <div className={`form-group ${isVisible ? "form-group--visible" : ""}`} style={{ transitionDelay: "0.7s" }}>
              <label htmlFor="message">{t.message}</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows="5"
                placeholder={t.messagePlaceholder}
                disabled={isSubmitting}
              />
            </div>
            <button
              type="submit"
              className={`contact-section__button ${isVisible ? "contact-section__button--visible" : ""}`}
              disabled={isSubmitting}
            >
              {isSubmitting ? t.sending : t.send}
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
