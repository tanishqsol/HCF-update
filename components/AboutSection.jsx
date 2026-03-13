"use client"

import { useState } from "react"
import "./AboutSection.css"

export default function AboutSection({ onBack, isDarkMode }) {
  return (
    <div className="page-container">
      <div className="page-header">
        <button className="back-button" onClick={onBack} type="button">
          ← Back to Home
        </button>
      </div>

      <section id="about" className="about-section">
      <div className="about-container">
        <div className="about-content">
          <h2 className="about-title">About Us</h2>

          <div className="about-text">
            <p>
              Welcome to <strong>Hindi Christian Fellowship of Greater Boston (HCF)</strong>,
              a vibrant community dedicated to sharing the love of Jesus Christ with Hindi-speaking
              people in the Greater Boston area.
            </p>

            <p>
              Our mission is to create a welcoming space where individuals from Hindi-speaking
              backgrounds can grow in their faith, build meaningful relationships, and serve
              together in God's kingdom. We believe that everyone deserves to hear the good news
              of Jesus in a language and cultural context they understand.
            </p>

            <div className="about-highlights">
              <div className="highlight-item">
                <h3>Our Vision</h3>
                <p>
                  To be a thriving community of Hindi-speaking believers who actively share
                  Christ's love and truth throughout Greater Boston and beyond.
                </p>
              </div>

              <div className="highlight-item">
                <h3>Our Values</h3>
                <p>
                  We are committed to biblical truth, cultural sensitivity, authentic relationships,
                  and serving our community with love and compassion.
                </p>
              </div>

              <div className="highlight-item">
                <h3>Our Community</h3>
                <p>
                  Join us for worship, fellowship, Bible study, and outreach activities that
                  strengthen our faith and impact our world for Christ.
                </p>
              </div>
            </div>

            <p className="about-closing">
              Whether you're new to faith, seeking deeper spiritual growth, or looking for
              a community that understands your cultural background, HCF welcomes you with
              open arms. Come join us as we journey together in faith!
            </p>
          </div>
        </div>
      </div>
    </section>
    </div>
  )
}