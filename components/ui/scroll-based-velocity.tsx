"use client"

import * as React from "react"
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "motion/react"

import { cn } from "@/lib/utils"

type ScrollVelocityContainerProps = React.HTMLAttributes<HTMLDivElement>

type ScrollVelocityRowProps = React.HTMLAttributes<HTMLDivElement> & {
  baseVelocity?: number
  direction?: 1 | -1
  scrollReactivity?: boolean
  children: React.ReactNode
}

export function ScrollVelocityContainer({
  className,
  children,
  ...props
}: ScrollVelocityContainerProps) {
  return (
    <div
      className={cn(
        "relative flex w-full flex-col items-start justify-start overflow-hidden whitespace-nowrap",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function ScrollVelocityRow({
  className,
  children,
  baseVelocity = 5,
  direction = 1,
  scrollReactivity = true,
  ...props
}: ScrollVelocityRowProps) {
  const rowRef = React.useRef<HTMLDivElement | null>(null)
  const segmentRef = React.useRef<HTMLSpanElement | null>(null)
  const contentWidthRef = React.useRef(0)
  const directionFactor = React.useRef(direction)
  const [isVisible, setIsVisible] = React.useState(true)
  const [isDocumentVisible, setIsDocumentVisible] = React.useState(true)
  const [repeatCount, setRepeatCount] = React.useState(6)

  const prefersReducedMotion = useReducedMotion()
  const baseX = useMotionValue(0)
  const { scrollY } = useScroll()
  const scrollVelocity = useVelocity(scrollY)
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400,
  })
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 4], {
    clamp: false,
  })

  React.useEffect(() => {
    const measure = () => {
      const contentWidth = segmentRef.current?.offsetWidth ?? 0
      const rowWidth = rowRef.current?.offsetWidth ?? 0

      contentWidthRef.current = contentWidth

      if (contentWidth > 0) {
        baseX.set(direction === 1 ? 0 : -contentWidth)
      }

      if (contentWidth > 0 && rowWidth > 0) {
        setRepeatCount(Math.max(Math.ceil((rowWidth * 2) / contentWidth) + 2, 6))
      }
    }

    measure()

    const observer = new ResizeObserver(measure)
    if (rowRef.current) observer.observe(rowRef.current)
    if (segmentRef.current) observer.observe(segmentRef.current)

    window.addEventListener("resize", measure)

    return () => {
      observer.disconnect()
      window.removeEventListener("resize", measure)
    }
  }, [])

  React.useEffect(() => {
    const row = rowRef.current
    if (!row) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry?.isIntersecting ?? true)
      },
      { threshold: 0.05 }
    )

    observer.observe(row)

    return () => observer.disconnect()
  }, [])

  React.useEffect(() => {
    const handleVisibility = () => {
      setIsDocumentVisible(document.visibilityState !== "hidden")
    }

    handleVisibility()
    document.addEventListener("visibilitychange", handleVisibility)

    return () => {
      document.removeEventListener("visibilitychange", handleVisibility)
    }
  }, [])

  useAnimationFrame((_, delta) => {
    if (prefersReducedMotion || !isVisible || !isDocumentVisible) return

    const contentWidth = contentWidthRef.current
    if (!contentWidth) return

    const pixelsPerSecond = baseVelocity * 6
    let moveBy = directionFactor.current * pixelsPerSecond * (delta / 1000)

    if (scrollReactivity) {
      const factor = velocityFactor.get()

      if (factor < 0) directionFactor.current = -Math.abs(direction)
      else if (factor > 0) directionFactor.current = Math.abs(direction)

      moveBy += directionFactor.current * Math.abs(moveBy) * Math.abs(factor)
    }

    let nextX = baseX.get() + moveBy

    if (directionFactor.current === 1 && nextX >= contentWidth) {
      nextX -= contentWidth
    } else if (directionFactor.current === -1 && nextX <= -contentWidth) {
      nextX += contentWidth
    }

    baseX.set(nextX)
  })

  const repeatedSegments = React.useMemo(() => Array.from({ length: repeatCount }), [repeatCount])

  return (
    <div
      ref={rowRef}
      className={cn("relative flex w-full overflow-hidden", className)}
      {...props}
    >
      <motion.div
        className="flex w-max shrink-0 will-change-transform"
        style={{
          x: prefersReducedMotion ? 0 : baseX,
        }}
      >
        {repeatedSegments.map((_, index) => (
          <span
            key={index}
            ref={index === 0 ? segmentRef : undefined}
            className="inline-flex shrink-0 items-center pr-10"
          >
            {children}
          </span>
        ))}
      </motion.div>
    </div>
  )
}
