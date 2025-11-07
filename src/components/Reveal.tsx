import { useEffect, useMemo, useRef, useState, type PropsWithChildren, type ElementType, type CSSProperties } from 'react'
import { cn } from '@/lib/utils'

type Direction = 'up' | 'down' | 'left' | 'right'
type Offset = 2 | 4 | 8 | 16

type RevealProps = PropsWithChildren<{
  as?: ElementType
  className?: string
  /** Delay in ms before animation starts */
  delay?: number
  /** Animate direction for slide effect */
  direction?: Direction
  /** Slide offset scale (2,4,8,16) */
  offset?: Offset
  /** Animation duration in ms */
  duration?: number
  /** CSS timing function, e.g. cubic-bezier(...) */
  easing?: string
  /** Only animate the first time it enters view */
  once?: boolean
  /** Intersection threshold (0..1) */
  threshold?: number
  /** Root margin for the observer */
  rootMargin?: string
}>

export function Reveal({
  as: Comp = 'div',
  className,
  children,
  delay = 0,
  direction = 'up',
  offset = 4,
  duration = 800,
  easing = 'cubic-bezier(0.22,1,0.36,1)',
  once = true,
  threshold = 0.15,
  rootMargin = '0px 0px -5% 0px',
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setInView(true)
            if (once) obs.unobserve(entry.target)
          } else if (!once) {
            setInView(false)
          }
        }
      },
      { threshold, rootMargin }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold, rootMargin, once])

  const slideClass = useMemo(() => {
    const part = String(offset) as `${Offset}`
    switch (direction) {
      case 'down':
        return `slide-in-from-top-${part}`
      case 'left':
        return `slide-in-from-right-${part}`
      case 'right':
        return `slide-in-from-left-${part}`
      case 'up':
      default:
        return `slide-in-from-bottom-${part}`
    }
  }, [direction])

  const animateClass = inView
    ? cn(
        // Tailwind v4 + tw-animate-css utilities
        'motion-safe:animate-in motion-safe:fade-in',
        slideClass,
        'transform-gpu',
        'motion-reduce:animate-none motion-reduce:opacity-100 motion-reduce:transform-none'
      )
    : 'opacity-0 transform-gpu'

  const style: CSSProperties = {
    willChange: 'transform, opacity',
    animationDelay: `${delay}ms`,
    animationDuration: `${duration}ms`,
    animationTimingFunction: easing,
  }

  return (
    <Comp ref={ref as any} style={style} className={cn(animateClass, className)}>
      {children}
    </Comp>
  )
}

export default Reveal
