'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { initializeApp, getApps, getApp } from 'firebase/app'
import AppShell from '@/components/AppShell'
import './donate.css'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyACe9qO583jAkoQrJsvX_Dp0tYdPtlgTsQ",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "hcfprod.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "hcfprod",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "hcfprod.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "158540586016",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:158540586016:web:3070f5ac072c372f20f045",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-Z68X6R3RTQ",
}

const firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig)
const auth = getAuth(firebaseApp)

export default function DonatePage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const [provider, setProvider] = useState(null)
  const [amount, setAmount] = useState(0)
  const [freq, setFreq] = useState('once')
  const [currentScreen, setCurrentScreen] = useState('s1')
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    customAmount: '',
  })

  const [stepStates, setStepStates] = useState({ 1: 'active', 2: 'inactive', 3: 'inactive', 4: 'inactive' })

  const setSteps = (n) => {
    const map = { 1: 1, 2: 2, 4: 4 }
    const cur = map[n] || (n === 3 ? 3 : n)
    const newStates = {}
    for (let i = 1; i <= 4; i++) {
      if (i < cur) newStates[i] = 'done'
      else if (i === cur) newStates[i] = 'active'
      else newStates[i] = 'inactive'
    }
    setStepStates(newStates)
  }

  useEffect(() => {
    setSteps(1)
  }, [])

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true)
      } else {
        setIsAuthenticated(false)
        router.push('/') // Redirect to home if not authenticated
      }
      setIsLoading(false)
    })

    return () => unsubscribe()
  }, [router])

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <AppShell showShapes={false}>
        <div className="donate-page-body" style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh' 
        }}>
          <div style={{ color: 'var(--cream)', fontSize: '1.2rem' }}>Loading...</div>
        </div>
      </AppShell>
    )
  }

  // Don't render anything if not authenticated (will redirect)
  if (!isAuthenticated) {
    return null
  }

  const handleNavClick = () => {
    window.history.back()
  }

  const pickProvider = (p) => {
    setProvider(p)
  }

  const setAmount_btn = (a) => {
    setAmount(a)
    setFormData({ ...formData, customAmount: '' })
  }

  const setCustomAmount = (value) => {
    const n = parseFloat(value)
    if (!isNaN(n) && n > 0) {
      setAmount(n)
    }
    setFormData({ ...formData, customAmount: value })
  }

  const goPayment = () => {
    if (provider === 'stripe') {
      setCurrentScreen('s3-stripe')
    } else {
      setCurrentScreen('s3-paypal')
    }
    setSteps(3)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const goScreen = (screenNum) => {
    if (screenNum === 1) {
      setCurrentScreen('s1')
    } else if (screenNum === 2) {
      setCurrentScreen('s2')
    } else if (screenNum === 4) {
      setCurrentScreen('s4')
    }
    setSteps(screenNum)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const processPayment = () => {
    goScreen(4)
  }

  const resetForm = () => {
    setProvider(null)
    setAmount(0)
    setFreq('once')
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      customAmount: '',
    })
    goScreen(1)
  }

  const renderStepDot = (stepNum) => {
    const state = stepStates[stepNum]
    if (state === 'done') return '✓'
    return stepNum
  }

  const formattedAmount = '$' + parseFloat(amount).toFixed(2)

  return (
    <AppShell showShapes={false}>
      <div className="donate-page-body">
      {/* NAV */}
      <nav className="donate-nav">
        <div className="donate-nav-logo" onClick={handleNavClick} style={{ cursor: 'pointer' }}>
          <div className="donate-nav-logo-wrapper">
            <img
              src="final_logo.png"
              alt="Hindi Christian Fellowship of Greater Boston logo"
              className="donate-nav-logo-image"
            />
          </div>
        </div>
        <div className="donate-nav-links">
          <a onClick={handleNavClick}>Home</a>
          <a href="#vision">Vision</a>
          <a href="#values">Values</a>
          <a href="#meetings">Meetings</a>
          <a className="donate-nav-btn">Donate</a>
        </div>
      </nav>

      {/* HERO */}
      <div className="donate-hero">
        <div className="donate-hero-tag">✝ Support Our Fellowship</div>
        <h1>
          Give to <em>Hindi Christian<br />Fellowship</em>
        </h1>
        <p className="donate-hero-sub">
          Your generosity helps us share the good news of Jesus with Hindi-speaking Indians
          across Greater Boston.
        </p>
      </div>

      {/* STEPS */}
      <div className="donate-steps-bar">
        {[1, 2, 3, 4].map((step) => (
          <div key={step}>
            <div className={`donate-step-item ${stepStates[step]}`}>
              <div className="donate-step-dot">{renderStepDot(step)}</div>
              <div className="donate-step-text">
                {step === 1 && 'Method'}
                {step === 2 && 'Amount'}
                {step === 3 && 'Payment'}
                {step === 4 && 'Done'}
              </div>
            </div>
            {step < 4 && <div className={`donate-step-connector ${stepStates[step] === 'done' ? 'done' : ''}`} />}
          </div>
        ))}
      </div>

      {/* MAIN CARD */}
      <div className="donate-main">
        <div className="donate-card">
          {/* SCREEN 1: CHOOSE METHOD */}
          {currentScreen === 's1' && (
            <div className="donate-screen active">
              <div className="donate-sec-label">Step 1 of 4</div>
              <div className="donate-sec-title">How would you like to give?</div>
              <div className="donate-sec-desc">Both options are fully secure. Your developer can set up either one.</div>

              <div className="donate-provider-grid">
                <div
                  className={`donate-provider-card ${provider === 'stripe' ? 'sel-stripe' : ''}`}
                  onClick={() => pickProvider('stripe')}
                >
                  <span className="donate-p-logo stripe">stripe</span>
                  <span className="donate-p-tag stripe">⭐ Recommended</span>
                  <p className="donate-p-desc">Pay right here on the HCF website — you never leave.</p>
                  <ul className="donate-p-features">
                    <li>Card form stays on your site</li>
                    <li>2.9% + 30¢ per donation</li>
                    <li>Recurring monthly giving</li>
                    <li>Auto email receipts</li>
                  </ul>
                </div>
                <div
                  className={`donate-provider-card ${provider === 'paypal' ? 'sel-paypal' : ''}`}
                  onClick={() => pickProvider('paypal')}
                >
                  <span className="donate-p-logo paypal">PayPal</span>
                  <span className="donate-p-tag paypal">Easiest Launch</span>
                  <p className="donate-p-desc">Donor clicks a button and pays on PayPal's secure site.</p>
                  <ul className="donate-p-features">
                    <li>No developer needed</li>
                    <li>3.49% + 49¢ per donation</li>
                    <li>Trusted by millions</li>
                    <li>Redirects off your site</li>
                  </ul>
                </div>
              </div>

              <div className="donate-callout">
                💡 <strong>Plain English:</strong> With <strong>Stripe</strong>, the donor pays without leaving your
                website — professional and seamless. With <strong>PayPal</strong>, they're taken to PayPal, then
                brought back — simpler to set up but less polished.
              </div>

              <div className="donate-btn-row">
                <button
                  className="donate-btn-gold"
                  disabled={!provider}
                  onClick={() => {
                    goScreen(2)
                  }}
                >
                  See Donor Experience →
                </button>
              </div>
            </div>
          )}

          {/* SCREEN 2: AMOUNT + DETAILS */}
          {currentScreen === 's2' && (
            <div className="donate-screen active">
              <div className="donate-sec-label">Step 2 of 4 · {provider === 'stripe' ? 'Stripe' : 'PayPal'}</div>
              <div className="donate-sec-title">Choose your gift</div>
              <div className="donate-sec-desc">This is exactly what a donor sees after clicking "Donate" on the HCF website.</div>

              <div className="donate-freq-toggle">
                <button
                  className={`donate-freq-btn ${freq === 'once' ? 'active' : ''}`}
                  onClick={() => setFreq('once')}
                >
                  Give Once
                </button>
                <button
                  className={`donate-freq-btn ${freq === 'monthly' ? 'active' : ''}`}
                  onClick={() => setFreq('monthly')}
                >
                  Give Monthly
                </button>
              </div>

              <div className="donate-amount-grid">
                {[10, 25, 50, 100].map((amt) => (
                  <button
                    key={amt}
                    className={`donate-amt-btn ${amount === amt ? 'selected' : ''}`}
                    onClick={() => setAmount_btn(amt)}
                  >
                    ${amt}
                  </button>
                ))}
              </div>
              <input
                className="donate-custom-input"
                type="text"
                placeholder="Or enter a custom amount: $___"
                value={formData.customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
              />

              <div className="donate-divider" />

              <div className="donate-form-grid">
                <div className="donate-fgroup">
                  <label>First Name</label>
                  <input
                    type="text"
                    placeholder="Priya"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  />
                </div>
                <div className="donate-fgroup">
                  <label>Last Name</label>
                  <input
                    type="text"
                    placeholder="Sharma"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  />
                </div>
                <div className="donate-fgroup full">
                  <label>Email Address — for your receipt</label>
                  <input
                    type="email"
                    placeholder="priya@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="donate-btn-row">
                <button className="donate-btn-back" onClick={() => goScreen(1)}>
                  ← Back
                </button>
                <button className="donate-btn-gold" disabled={amount === 0} onClick={goPayment}>
                  Continue to Payment →
                </button>
              </div>
            </div>
          )}

          {/* SCREEN 3A: STRIPE */}
          {currentScreen === 's3-stripe' && (
            <div className="donate-screen active">
              <div className="donate-sec-label">Step 3 of 4 · Stripe Payment</div>
              <div className="donate-sec-title">Enter your card details</div>
              <div className="donate-sec-desc">
                This secure form is powered by Stripe and appears directly on the HCF website.
              </div>

              <div className="donate-stripe-secure-banner">
                🔒 Secured by Stripe · 256-bit encryption · Your card data never touches HCF's servers
              </div>

              <div className="donate-card-box">
                <div className="donate-card-row-top">
                  <div className="donate-card-chip-icons">
                    <div className="donate-chip donate-chip-visa">VISA</div>
                    <div className="donate-chip donate-chip-mc"></div>
                    <div className="donate-chip donate-chip-amex">AX</div>
                  </div>
                  <div className="donate-card-placeholder">•••• •••• •••• ____</div>
                </div>
                <div className="donate-card-expiry-cvc">
                  <div>
                    <div className="donate-card-mini-label">Expiry Date</div>
                    <div className="donate-card-mini-val">MM / YY</div>
                  </div>
                  <div>
                    <div className="donate-card-mini-label">Security Code</div>
                    <div className="donate-card-mini-val">• • •</div>
                  </div>
                </div>
              </div>

              <button className="donate-btn-stripe" onClick={processPayment}>
                🔒 Donate {formattedAmount} Securely
              </button>
              <div className="donate-security">
                <div className="donate-security-dot"></div>
                PCI DSS Compliant · No card data stored by HCF
              </div>

              <div className="donate-callout" style={{ marginTop: '16px' }}>
                💡 <strong>Plain English:</strong> The donor stays on your website the whole time. Stripe handles the
                security. Money lands in HCF's bank account within 2–3 business days.
              </div>
            </div>
          )}

          {/* SCREEN 3B: PAYPAL */}
          {currentScreen === 's3-paypal' && (
            <div className="donate-screen active">
              <div className="donate-sec-label">Step 3 of 4 · PayPal Redirect</div>
              <div className="donate-sec-title">Donor is taken to PayPal</div>
              <div className="donate-sec-desc">
                When a donor clicks "Donate", this PayPal window opens. Below is what they see.
              </div>

              <div className="donate-paypal-redirect">
                <div className="donate-paypal-win-header">
                  <div className="donate-paypal-win-logo">PayPal</div>
                  <div className="donate-paypal-win-secure">🔒 Secure Checkout</div>
                </div>
                <div className="donate-paypal-win-body">
                  <div style={{ fontSize: '0.83rem', color: '#444', marginBottom: '16px', fontFamily: "'DM Sans',sans-serif" }}>
                    Log in to donate <strong>{formattedAmount}</strong> to{' '}
                    <strong>Hindi Christian Fellowship of Greater Boston</strong>
                  </div>
                  <div className="donate-paypal-field">📧 Email or phone number</div>
                  <div className="donate-paypal-field">🔒 Password</div>
                  <button className="donate-btn-paypal" onClick={processPayment}>
                    Log In & Donate {formattedAmount}
                  </button>
                  <div className="donate-paypal-win-note">Pay with debit or credit card instead →</div>
                </div>
              </div>

              <div className="donate-callout">
                💡 <strong>Plain English:</strong> The donor leaves your site, pays on PayPal, and is then sent back to
                HCF's website. Safe, but less seamless — especially for donors without a PayPal account.
              </div>

              <div className="donate-btn-row" style={{ marginTop: '16px' }}>
                <button className="donate-btn-back" onClick={() => goScreen(2)}>
                  ← Back
                </button>
              </div>
            </div>
          )}

          {/* SCREEN 4: SUCCESS */}
          {currentScreen === 's4' && (
            <div className="donate-screen active">
              <div className="donate-success-ring">✓</div>
              <div className="donate-success-title">Shukrya! Thank You.</div>
              <p className="donate-success-sub">
                The donation has been received. An automatic receipt<br />
                was emailed to the donor instantly.
              </p>

              <div className="donate-receipt">
                <div className="donate-receipt-header">✝ Donation Receipt — Hindi Christian Fellowship</div>
                <div className="donate-receipt-row">
                  <span className="donate-receipt-label">Payment Method</span>
                  <span className="donate-receipt-val">
                    {provider === 'stripe' ? 'Stripe (Visa ••4242)' : 'PayPal (priya@email.com)'}
                  </span>
                </div>
                <div className="donate-receipt-row">
                  <span className="donate-receipt-label">Giving Frequency</span>
                  <span className="donate-receipt-val">
                    {freq === 'monthly' ? 'Monthly recurring' : 'One-time gift'}
                  </span>
                </div>
                <div className="donate-receipt-row">
                  <span className="donate-receipt-label">Transaction ID</span>
                  <span className="donate-receipt-val" style={{ fontFamily: 'monospace', fontSize: '0.78rem' }}>
                    #HCF-{Math.floor(10000 + Math.random() * 90000)}
                  </span>
                </div>
                <div className="donate-receipt-row">
                  <span className="donate-receipt-label">Amount Donated</span>
                  <span className="donate-receipt-val donate-receipt-total">{formattedAmount}</span>
                </div>
              </div>

              <div className="donate-outcome-grid">
                <div className="donate-outcome-card">
                  <span className="donate-outcome-icon">📧</span>
                  <div className="donate-outcome-text">
                    <strong>Auto Receipt</strong>Emailed to donor instantly
                  </div>
                </div>
                <div className="donate-outcome-card">
                  <span className="donate-outcome-icon">🏦</span>
                  <div className="donate-outcome-text">
                    <strong>Bank Deposit</strong>In 2–3 business days
                  </div>
                </div>
                <div className="donate-outcome-card">
                  <span className="donate-outcome-icon">📊</span>
                  <div className="donate-outcome-text">
                    <strong>Dashboard</strong>Recorded in your reports
                  </div>
                </div>
              </div>

              <button className="donate-btn-reset" onClick={resetForm}>
                ↺ Try the Other Payment Method
              </button>
            </div>
          )}
        </div>

        <div className="donate-scripture">
          "For God so loved the world that he gave his one and only Son"<br />
          <span>— John 3:16</span>
        </div>
      </div>
      </div>
    </AppShell>
  )
}
