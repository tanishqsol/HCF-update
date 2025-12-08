"use client"

import { useEffect, useRef, useState } from "react"
import "./ContactSection.css"

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
        setSubmitStatus({ type: "success", message: "Thank you! Your message has been sent successfully." })
        setFormData({ name: "", email: "", message: "" })
      } else {
        setSubmitStatus({ type: "error", message: data.error || "Failed to send message. Please try again." })
      }
    } catch (error) {
      setSubmitStatus({ type: "error", message: "Network error. Please check your connection and try again." })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="contact" className="contact-section" ref={sectionRef}>
      <div className="contact-section__container">
        <div className={`contact-section__header ${isVisible ? "contact-section__header--visible" : ""}`}>
          <h2 className="contact-section__title">Get In Touch</h2>
          <p className="contact-section__intro">
            We'd love to hear from you. Reach out to join our fellowship or learn more.
          </p>
        </div>
        <div className="contact-section__content">
          <div className={`contact-section__info ${isVisible ? "contact-section__info--visible" : ""}`}>
            <h3 className="contact-section__subtitle">Contact Information</h3>
            <div className="contact-info">
              <div className="contact-info__item">
                <span className="contact-info__icon">📧</span>
                <div className="contact-info__details">
                  <strong>Email</strong>
                  <p>sjatiani@gmail.com</p>
                </div>
              </div>
              <div className="contact-info__item">
                <span className="contact-info__icon">📱</span>
                <div className="contact-info__details">
                  <strong>Phone</strong>
                  <p>215-360-6673 - Shashi Jatiani</p>
                </div>
              </div>
              <div className="contact-info__item">
                <span className="contact-info__icon">📍</span>
                <div className="contact-info__details">
                  <strong>Location</strong>
                  <p>Greater Boston Area, MA</p>
                </div>
              </div>
            </div>
            <div className="contact-section__social">
              <h4 className="contact-section__social-title">Follow Us</h4>
              <div className="contact-section__social-links">
                <a href="#facebook" className="social-link">
                  Facebook
                </a>
                <a href="#youtube" className="social-link">
                  YouTube
                </a>
                <a href="#instagram" className="social-link">
                  Instagram
                </a>
              </div>
              <p className="contact-section__social-note">(Social media links coming soon!)</p>
            </div>
          </div>
          <form
            className={`contact-section__form ${isVisible ? "contact-section__form--visible" : ""}`}
            onSubmit={handleSubmit}
          >
            {submitStatus && (
              <div className={`form-status form-status--${submitStatus.type}`}>{submitStatus.message}</div>
            )}
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Your name"
                disabled={isSubmitting}
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
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
            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows="5"
                placeholder="How can we help you?"
                disabled={isSubmitting}
              />
            </div>
            <button type="submit" className="contact-section__button" disabled={isSubmitting}>
              {isSubmitting ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
