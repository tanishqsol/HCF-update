"use client"

import { useEffect, useRef, useState } from "react"

const clamp = (value, min, max) => Math.min(Math.max(value, min), max)
const getPageOffset = (element) => element.getBoundingClientRect().top + window.scrollY

const RAIL_VIEWBOX = {
  width: 64,
  height: 430,
}

const RAIL_PATH = "M 32 12 C 10 56, 54 102, 32 148 S 10 238, 32 328 S 54 418, 32 548"
const DEFAULT_POINT = { x: 32, y: 12 }

export default function ScrollProgressRail({ startId = "hero", endId = "site-footer" }) {
  const [isPhone, setIsPhone] = useState(false)
  const [progress, setProgress] = useState(0)
  const [pathLength, setPathLength] = useState(0)
  const [thumbPoint, setThumbPoint] = useState(DEFAULT_POINT)
  const frameRef = useRef(0)
  const pathRef = useRef(null)
  const progressRef = useRef(0)

  useEffect(() => {
    progressRef.current = progress
  }, [progress])

  useEffect(() => {
    const updateIsPhone = () => {
      const viewportWidth = window.visualViewport?.width ?? window.innerWidth
      const screenWidth = window.screen?.width ?? viewportWidth
      const effectiveWidth = Math.min(viewportWidth, screenWidth)

      setIsPhone(effectiveWidth <= 767)
    }

    updateIsPhone()

    window.addEventListener("resize", updateIsPhone)
    window.addEventListener("orientationchange", updateIsPhone)
    window.visualViewport?.addEventListener("resize", updateIsPhone)

    return () => {
      window.removeEventListener("resize", updateIsPhone)
      window.removeEventListener("orientationchange", updateIsPhone)
      window.visualViewport?.removeEventListener("resize", updateIsPhone)
    }
  }, [])

  useEffect(() => {
    if (isPhone) {
      return undefined
    }

    const startElement = document.getElementById(startId)
    const endElement = document.getElementById(endId)

    if (!startElement || !endElement) {
      return undefined
    }

    const syncPathMetrics = () => {
      const pathNode = pathRef.current
      if (!pathNode) return

      const nextLength = pathNode.getTotalLength()
      setPathLength((current) => (Math.abs(current - nextLength) > 0.01 ? nextLength : current))

      const point = pathNode.getPointAtLength(nextLength * progressRef.current)
      setThumbPoint({ x: point.x, y: point.y })
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
      frameRef.current = window.requestAnimationFrame(() => {
        updateProgress()
        syncPathMetrics()
      })
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
  }, [endId, isPhone, startId])

  useEffect(() => {
    if (isPhone) return

    const pathNode = pathRef.current
    if (!pathNode || !pathLength) return

    const point = pathNode.getPointAtLength(pathLength * progress)
    setThumbPoint({ x: point.x, y: point.y })
  }, [isPhone, pathLength, progress])

  if (isPhone) {
    return null
  }

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
        <svg
          className="scroll-progress-rail__svg"
          viewBox={`0 0 ${RAIL_VIEWBOX.width} ${RAIL_VIEWBOX.height}`}
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="scroll-progress-rail-gradient" x1="50%" y1="0%" x2="50%" y2="100%">
              <stop offset="0%" stopColor="#ffd166" />
              <stop offset="48%" stopColor="#ff9933" />
              <stop offset="100%" stopColor="#138808" />
            </linearGradient>
          </defs>
          <path className="scroll-progress-rail__path scroll-progress-rail__path--base" d={RAIL_PATH} />
          <path
            ref={pathRef}
            className="scroll-progress-rail__path scroll-progress-rail__path--fill"
            d={RAIL_PATH}
            pathLength="1"
            strokeDasharray="1"
            strokeDashoffset={1 - progress}
          />
        </svg>

        <span
          className="scroll-progress-rail__thumb"
          style={{
            left: `${(thumbPoint.x / RAIL_VIEWBOX.width) * 100}%`,
            top: `${(thumbPoint.y / RAIL_VIEWBOX.height) * 100}%`,
          }}
        >
          <svg className="scroll-progress-rail__cross" viewBox="0 0 24 32" aria-hidden="true">
            <path
              d="M10 0.75C10 0.336 10.336 0 10.75 0H13.25C13.664 0 14 0.336 14 0.75V8.5H20.25C20.664 8.5 21 8.836 21 9.25V11.75C21 12.164 20.664 12.5 20.25 12.5H14V31.25C14 31.664 13.664 32 13.25 32H10.75C10.336 32 10 31.664 10 31.25V12.5H3.75C3.336 12.5 3 12.164 3 11.75V9.25C3 8.836 3.336 8.5 3.75 8.5H10V0.75Z"
              fill="currentColor"
            />
          </svg>
        </span>
      </div>
    </div>
  )
}
