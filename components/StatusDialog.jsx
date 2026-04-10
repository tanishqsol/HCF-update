"use client"

export default function StatusDialog({
  open,
  variant = "info",
  title,
  message,
  content,
  primaryLabel = "OK",
  onPrimary,
  secondaryLabel,
  onSecondary,
}) {
  if (!open) return null

  const accent =
    variant === "success"
      ? "#16a34a"
      : variant === "error"
      ? "#dc2626"
      : variant === "warning"
      ? "#d97706"
      : "#2563eb"

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.45)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        padding: 16,
      }}
    >
      <div
        style={{
          width: "min(520px, 100%)",
          background: "white",
          borderRadius: 14,
          boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
          overflow: "hidden",
        }}
      >
        <div style={{ padding: 16, borderTop: `6px solid ${accent}` }}>
          <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 6 }}>{title}</div>
          {content ? content : <div style={{ fontSize: 14, lineHeight: 1.5, color: "#444" }}>{message}</div>}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 10,
            padding: 16,
            background: "#fafafa",
            borderTop: "1px solid #eee",
          }}
        >
          {secondaryLabel && (
            <button
              type="button"
              onClick={onSecondary}
              style={{
                padding: "10px 14px",
                borderRadius: 10,
                border: "1px solid #ddd",
                background: "white",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              {secondaryLabel}
            </button>
          )}

          <button
            type="button"
            onClick={onPrimary}
            style={{
              padding: "10px 14px",
              borderRadius: 10,
              border: "none",
              background: accent,
              color: "white",
              fontWeight: 800,
              cursor: "pointer",
            }}
          >
            {primaryLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
