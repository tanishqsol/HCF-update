"use client"

import "./StatusDialog.css"

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
    <div role="dialog" aria-modal="true" className="status-dialog">
      <div
        className="status-dialog__panel"
        style={{
          borderTop: `6px solid ${accent}`,
        }}
      >
        <div className="status-dialog__content">
          <div className="status-dialog__title">{title}</div>
          {content ? content : <div className="status-dialog__message">{message}</div>}
        </div>

        <div className="status-dialog__actions">
          {secondaryLabel && (
            <button
              type="button"
              onClick={onSecondary}
              className="status-dialog__secondary"
            >
              {secondaryLabel}
            </button>
          )}

          <button
            type="button"
            onClick={onPrimary}
            className="status-dialog__primary"
            style={{
              background: accent,
            }}
          >
            {primaryLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
