"use client"

import "./Footer.css"

export default function Footer() {
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <footer className="footer">
      <div className="footer__container">
        <div className="footer__main">
          <div className="footer__brand">
            <div className="footer__logo">
              <span className="footer__logo-icon">✝</span>
              <span className="footer__logo-text">HCF of Greater Boston</span>
            </div>
            <p className="footer__tagline">Speaking the truth about Jesus to North Indians in Greater Boston</p>
          </div>
          <div className="footer__links">
            <div className="footer__column">
              <h4 className="footer__column-title">Quick Links</h4>
              <ul className="footer__menu">
                <li>
                  <button onClick={() => scrollToSection("vision")}>Vision</button>
                </li>
                <li>
                  <button onClick={() => scrollToSection("values")}>Core Values</button>
                </li>
                <li>
                  <button onClick={() => scrollToSection("team")}>Team</button>
                </li>
                <li>
                  <button onClick={() => scrollToSection("meetings")}>Meetings</button>
                </li>
              </ul>
            </div>
            <div className="footer__column">
              <h4 className="footer__column-title">Connect</h4>
              <ul className="footer__menu">
                <li>
                  <button onClick={() => scrollToSection("festivals")}>Festivals</button>
                </li>
                <li>
                  <button onClick={() => scrollToSection("contact")}>Contact Us</button>
                </li>
                <li>
                  <a href="#facebook">Facebook</a>
                </li>
                <li>
                  <a href="#youtube">YouTube</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="footer__bottom">
          <p className="footer__copyright">
            © {new Date().getFullYear()} Hindu Christian Fellowship of Greater Boston. All rights reserved.
          </p>
          <p className="footer__verse">"For God so loved the world that he gave his one and only Son" - John 3:16</p>
        </div>
      </div>
    </footer>
  )
}
