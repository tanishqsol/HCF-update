"use client"

export default function AppShell({ children, showShapes = true }) {
  return (
    <div className="app-container">
      <div className="animated-mesh-bg" />
      {showShapes && (
        <div className="floating-shapes">
          <div className="shape shape-1" />
          <div className="shape shape-2" />
          <div className="shape shape-3" />
        </div>
      )}
      {children}
    </div>
  )
}
