import * as React from 'react'
import { Link } from '@tanstack/react-router'

import { cn } from '@/lib/utils'

/**
 * Shared building blocks for the rebranded marketing pages.
 * Mirrors the "Jet Ski & More" design canvas so pages stay declarative.
 */

/** Page-width container. The design uses a 1240px measure with 32px gutters. */
export function Shell({
  className,
  children,
  narrow,
}: {
  className?: string
  children: React.ReactNode
  narrow?: boolean
}) {
  return (
    <div
      className={cn(
        'mx-auto w-full px-5 sm:px-8',
        narrow ? 'max-w-[900px]' : 'max-w-[1240px]',
        className,
      )}
    >
      {children}
    </div>
  )
}

/** Vertical rhythm between major sections (72px in the design). */
export function Section({
  className,
  children,
  narrow,
}: {
  className?: string
  children: React.ReactNode
  narrow?: boolean
}) {
  return (
    <Shell narrow={narrow} className={cn('pt-12 sm:pt-[72px]', className)}>
      {children}
    </Shell>
  )
}

/** Small uppercase kicker above a heading. */
export function Eyebrow({
  children,
  tone = 'teal',
  className,
}: {
  children: React.ReactNode
  tone?: 'teal' | 'amber'
  className?: string
}) {
  return (
    <div
      className={cn(
        'text-[11.5px] font-bold tracking-[0.16em]',
        tone === 'amber' ? 'text-brand-amber' : 'text-brand-teal',
        className,
      )}
    >
      {children}
    </div>
  )
}

export function DisplayHeading({
  as: Tag = 'h2',
  size = 'md',
  className,
  children,
}: {
  as?: 'h1' | 'h2' | 'h3'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  children: React.ReactNode
}) {
  const sizes = {
    sm: 'text-[22px] sm:text-[26px]',
    md: 'text-[26px] sm:text-[30px]',
    lg: 'text-[30px] sm:text-[42px]',
    xl: 'text-[36px] sm:text-[52px]',
  }
  return (
    <Tag
      className={cn(
        'font-display font-extrabold tracking-[-0.025em] text-brand-ink text-balance',
        size === 'xl' ? 'leading-[1.05]' : 'leading-[1.1]',
        sizes[size],
        className,
      )}
    >
      {children}
    </Tag>
  )
}

export function Lede({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return (
    <p className={cn('mt-3.5 text-[16px] sm:text-[17px] leading-[1.6] text-brand-muted text-pretty', className)}>
      {children}
    </p>
  )
}

/** White panel used for nearly every content block in the design. */
export function Panel({
  className,
  children,
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('rounded-[18px] border border-brand-line bg-white', className)}
      {...rest}
    >
      {children}
    </div>
  )
}

type ButtonTone = 'teal' | 'amber' | 'deep' | 'outline' | 'ghost-dark'

const toneClasses: Record<ButtonTone, string> = {
  teal: 'bg-brand-teal text-white border border-brand-teal hover:bg-brand-teal-dark hover:border-brand-teal-dark',
  amber: 'bg-brand-amber text-brand-deep border border-brand-amber hover:bg-brand-amber-light hover:border-brand-amber-light',
  deep: 'bg-brand-deep text-white border border-brand-deep hover:bg-brand-deep-soft hover:border-brand-deep-soft',
  outline:
    'bg-white text-brand-ink border border-brand-line-strong hover:border-brand-teal hover:text-brand-teal',
  'ghost-dark':
    'bg-white/10 text-white border border-white/30 hover:bg-white/20',
}

const sizeClasses = {
  sm: 'px-4 py-2.5 text-[14px]',
  md: 'px-5 py-3 text-[14.5px]',
  lg: 'px-6 py-4 text-[15.5px]',
}

/**
 * Brand button. Renders as a router Link when `to` is given, an anchor for
 * `href`, otherwise a plain button — the design uses all three.
 */
export function BrandButton({
  tone = 'teal',
  size = 'md',
  to,
  href,
  className,
  children,
  ...rest
}: {
  tone?: ButtonTone
  size?: 'sm' | 'md' | 'lg'
  to?: string
  href?: string
  className?: string
  children: React.ReactNode
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const classes = cn(
    'inline-flex items-center justify-center gap-2 rounded-xl font-bold no-underline transition-colors disabled:cursor-not-allowed disabled:opacity-50',
    toneClasses[tone],
    sizeClasses[size],
    className,
  )
  if (to) {
    return (
      <Link to={to} className={classes}>
        {children}
      </Link>
    )
  }
  if (href) {
    return (
      <a href={href} className={classes} target={href.startsWith('http') ? '_blank' : undefined} rel="noreferrer">
        {children}
      </a>
    )
  }
  return (
    <button type="button" className={classes} {...rest}>
      {children}
    </button>
  )
}

export type Rating = 'prime' | 'fair' | 'rough'

const ratingClasses: Record<Rating, string> = {
  prime: 'bg-prime-bg text-prime-fg border-prime-line',
  fair: 'bg-fair-bg text-fair-fg border-fair-line',
  rough: 'bg-rough-bg text-rough-fg border-rough-line',
}

/** PRIME / FAIR / ROUGH condition chip. */
export function RatingPill({ rating, className }: { rating: Rating; className?: string }) {
  return (
    <span
      className={cn(
        'inline-block rounded-full border px-2.5 py-1 text-[11.5px] font-bold tracking-[0.04em]',
        ratingClasses[rating],
        className,
      )}
    >
      {rating.toUpperCase()}
    </span>
  )
}

/** Rounded image frame that always fills its container. */
export function Shot({
  src,
  alt,
  className,
  position = 'center',
}: {
  src: string
  alt: string
  className?: string
  position?: string
}) {
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      className={cn('h-full w-full object-cover', className)}
      style={{ objectPosition: position }}
    />
  )
}

/** Bulleted row used in "do / don't" and guidance lists. */
export function TickRow({
  mark = '·',
  tone = 'teal',
  children,
}: {
  mark?: string
  tone?: 'teal' | 'green' | 'red'
  children: React.ReactNode
}) {
  const toneClass =
    tone === 'green' ? 'text-prime-fg' : tone === 'red' ? 'text-rough-fg' : 'text-brand-teal'
  return (
    <div className="flex gap-2.5 border-t border-brand-line-soft pt-2.5 text-[15px] leading-[1.6] text-brand-body">
      <span className={cn('flex-none font-extrabold', toneClass)}>{mark}</span>
      <span>{children}</span>
    </div>
  )
}

/** Dark full-bleed CTA band that closes several pages. */
export function ClosingCta({
  title,
  body,
  children,
  gradient,
}: {
  title: string
  body?: string
  children?: React.ReactNode
  gradient?: boolean
}) {
  return (
    <Section>
      <div
        className={cn(
          'flex flex-wrap items-center justify-between gap-8 rounded-3xl p-8 sm:p-14',
          gradient
            ? 'bg-[linear-gradient(120deg,#0E7C8B_0%,#0A5F6B_60%,#06202F_100%)]'
            : 'bg-brand-deep',
        )}
      >
        <div className="max-w-[620px]">
          <h2 className="m-0 font-display text-[26px] sm:text-[38px] font-extrabold leading-[1.12] tracking-[-0.025em] text-white text-balance">
            {title}
          </h2>
          {body ? <p className="mt-3.5 text-[16.5px] text-[#CBE6EB]">{body}</p> : null}
        </div>
        {children ? <div className="flex flex-wrap gap-3">{children}</div> : null}
      </div>
    </Section>
  )
}
