"use client"

import { useEffect, useRef, useState } from "react"

const clamp = (value, min, max) => Math.min(Math.max(value, min), max)

const getPageOffset = (element) => element.getBoundingClientRect().top + window.scrollY

export default function ScrollProgressRail({ startId = "hero", endId = "site-footer" }) {
  const [progress, setProgress] = useState(0)
  const frameRef = useRef(0)

  useEffect(() => {
    const startElement = document.getElementById(startId)
    const endElement = document.getElementById(endId)

    if (!startElement || !endElement) {
      return undefined
    }

    const updateProgress = () => {
      const start = getPageOffset(startElement)
      const end = getPageOffset(endElement) + endElement.offsetHeight - window.innerHeight

      if (end <= start) {
        setProgress(window.scrollY > start ? 1 : 0)
        return
      }

      const nextProgress = clamp((window.scrollY - start) / (end - start), 0, 1)
      setProgress((current) => (Math.abs(current - nextProgress) > 0.001 ? nextProgress : current))
    }

    const requestProgressUpdate = () => {
      cancelAnimationFrame(frameRef.current)
      frameRef.current = window.requestAnimationFrame(updateProgress)
    }

    requestProgressUpdate()

    window.addEventListener("scroll", requestProgressUpdate, { passive: true })
    window.addEventListener("resize", requestProgressUpdate)
    window.addEventListener("load", requestProgressUpdate)

    const resizeObserver = typeof ResizeObserver !== "undefined" ? new ResizeObserver(requestProgressUpdate) : null
    resizeObserver?.observe(document.body)
    resizeObserver?.observe(startElement)
    resizeObserver?.observe(endElement)

    return () => {
      cancelAnimationFrame(frameRef.current)
      window.removeEventListener("scroll", requestProgressUpdate)
      window.removeEventListener("resize", requestProgressUpdate)
      window.removeEventListener("load", requestProgressUpdate)
      resizeObserver?.disconnect()
    }
  }, [endId, startId])

  const progressPercent = Math.round(progress * 100)

  return (
    <div
      className="scroll-progress-rail"
      role="progressbar"
      aria-label="Homepage scroll progress"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={progressPercent}
    >
      <span className="scroll-progress-rail__label">{progressPercent}%</span>
      <div className="scroll-progress-rail__track" aria-hidden="true">
        <span className="scroll-progress-rail__fill" style={{ height: `${progressPercent}%` }} />
        <span className="scroll-progress-rail__thumb" style={{ top: `${progressPercent}%` }} />
      </div>
    </div>
  )
}
