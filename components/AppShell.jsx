"use client"

export default function AppShell({ children, showShapes = true }) {
  const particles = Array.from({ length: 44 }, (_, index) => {
    const size = 2.2 + (index % 4) * 1.15
    const left = `${-8 - (index % 6) * 4}%`
    const top = `${18 + ((index * 9) % 74)}%`
    const delay = `${(index % 14) * -1.25}s`
    const duration = `${16 + (index % 6) * 2.4}s`

    return {
      id: `particle-${index}`,
      style: {
        "--particle-size": `${size}px`,
        "--particle-left": left,
        "--particle-top": top,
        "--particle-delay": delay,
        "--particle-duration": duration,
      },
    }
  })

  return (
    <div className="app-container">
      <div className="animated-mesh-bg" />
      <div className="floating-particles" aria-hidden="true">
        {particles.map((particle) => (
          <span key={particle.id} className="particle" style={particle.style} />
        ))}
      </div>
      {showShapes && (
        <div className="floating-shapes">
          <div className="shape shape-1" />
          <div className="shape shape-2" />
          <div className="shape shape-3" />
        </div>
      )}
      <div className="app-shell__content">{children}</div>
    </div>
  )
}
