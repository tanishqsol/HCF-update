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

  const handleSubmit = (e) => {
    e.preventDefault()
    alert("Thank you for your message! We will get back to you soon.")
    setFormData({ name: "", email: "", message: "" })
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
                  <p> Shashi Jatiani (215-360-6673)</p>
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
              />
            </div>
            <button type="submit" className="contact-section__button">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
