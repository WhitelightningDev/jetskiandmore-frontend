import * as React from 'react'
import { Link, useRouterState } from '@tanstack/react-router'

import { cn } from '@/lib/utils'
import { useBookingControls } from '@/lib/bookingControls'
import { CONTACT, MOBILE_NAV_ITEMS, NAV_ITEMS, ROUTES, logoBadge } from '@/lib/brand-content'

/** True when `to` is the active route (treating /home as /). */
function useIsActive() {
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const normalised = pathname === '/home' || pathname === '/home/' ? '/' : pathname.replace(/\/$/, '') || '/'
  return (to: string) => {
    const target = to.replace(/\/$/, '') || '/'
    return normalised === target
  }
}

/** Thin dark bar above the header carrying the season message. */
export function StatusBar() {
  const { controls } = useBookingControls()
  const open = controls.jetSkiBookingsEnabled

  const headline = open
    ? 'Jet ski bookings are open'
    : 'Winter season: boat rides & charters running daily'
  const detail = open
    ? 'Launching daily from Gordon’s Bay Harbour, weather permitting'
    : 'Jet ski bookings reopen 1 November — join the waitlist'

  return (
    <div className="w-full bg-brand-deep py-2.5 text-[12px] sm:text-[13px] tracking-[0.01em] text-[#BFD6E2]">
      <div className="mx-auto flex max-w-[1240px] flex-wrap items-center justify-between gap-x-6 gap-y-1 px-5 sm:px-8">
        <div className="flex items-center gap-2.5">
          <span className="inline-block h-[7px] w-[7px] flex-none rounded-full bg-brand-amber" />
          <span className="font-semibold text-[#EAF3F7]">{headline}</span>
          <span className="hidden text-[#5E7E92] sm:inline">·</span>
          <span className="hidden sm:inline">{detail}</span>
        </div>
        <div className="hidden items-center gap-5 lg:flex">
          <span>{CONTACT.place}</span>
          <span className="text-[#5E7E92]">·</span>
          <a href={CONTACT.phoneHref} className="font-semibold text-[#EAF3F7] no-underline hover:underline">
            {CONTACT.phone}
          </a>
        </div>
      </div>
    </div>
  )
}

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = React.useState(false)
  const isActive = useIsActive()
  const pathname = useRouterState({ select: (s) => s.location.pathname })

  // Close the drawer whenever navigation happens.
  React.useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  React.useEffect(() => {
    if (!menuOpen) return
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }
    document.addEventListener('keydown', closeOnEscape)
    return () => document.removeEventListener('keydown', closeOnEscape)
  }, [menuOpen])

  return (
    <header className="sticky top-0 z-50 border-b border-brand-line bg-white/92 backdrop-blur-[14px]">
      <div className="mx-auto flex h-[76px] max-w-[1240px] items-center justify-between gap-5 px-5 sm:px-8 xl:gap-7">
        <Link to={ROUTES.home} className="flex flex-none items-center gap-3 no-underline">
          <img src={logoBadge} alt="Jet Ski &amp; More" className="block h-12 w-12" />
          <span className="hidden text-left leading-[1.05] min-[480px]:block">
            <span className="block font-display text-[15px] font-extrabold tracking-[0.02em] text-brand-ink sm:text-[16px]">
              JET SKI &amp; MORE
            </span>
            <span className="mt-0.5 hidden text-[11px] font-semibold tracking-[0.14em] text-brand-faint min-[420px]:block">
              GORDON&apos;S BAY · EST. 2020
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-0.5 min-[1180px]:flex">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                'relative px-3 py-2.5 text-[14.5px] font-semibold no-underline transition-colors',
                isActive(item.to) ? 'text-brand-teal' : 'text-brand-body hover:text-brand-teal',
              )}
            >
              {item.label}
              {isActive(item.to) ? (
                <span className="absolute inset-x-3 bottom-0.5 h-0.5 rounded-sm bg-brand-teal" />
              ) : null}
            </Link>
          ))}
        </nav>

        <div className="flex flex-none items-center gap-2.5">
          <button
            type="button"
            aria-expanded={menuOpen}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMenuOpen((v) => !v)}
            className="flex items-center gap-2.5 rounded-[10px] border border-brand-line-strong bg-white px-3 py-2.5 text-[14px] font-bold text-brand-ink transition-colors hover:border-brand-teal min-[1180px]:hidden"
          >
            <span className="flex flex-col gap-[3px]">
              <span className="block h-0.5 w-4 rounded-sm bg-brand-ink" />
              <span className="block h-0.5 w-4 rounded-sm bg-brand-ink" />
              <span className="block h-0.5 w-4 rounded-sm bg-brand-ink" />
            </span>
            <span className="hidden min-[620px]:inline">{menuOpen ? 'Close' : 'Menu'}</span>
          </button>

          <Link
            to={ROUTES.contact}
            className="hidden items-center gap-2 rounded-[10px] border border-brand-line-strong bg-white px-4 py-2.5 text-[14px] font-semibold text-brand-ink no-underline transition-colors hover:border-brand-teal hover:text-brand-teal min-[860px]:flex"
          >
            Contact
          </Link>
          <Link
            to={ROUTES.rides}
            className="flex items-center gap-2 rounded-[10px] border border-brand-teal bg-brand-teal px-3.5 py-2.5 text-[13.5px] font-bold text-white no-underline shadow-[0_6px_16px_rgba(14,124,139,0.28)] transition-colors hover:border-brand-teal-dark hover:bg-brand-teal-dark sm:px-[18px] sm:text-[14px]"
          >
            Check availability
          </Link>
        </div>
      </div>

      {menuOpen ? (
        <div className="border-t border-brand-line bg-white min-[1180px]:hidden">
          <div className="mx-auto flex max-w-[1240px] flex-col gap-1 px-5 pb-5 pt-3.5">
            {MOBILE_NAV_ITEMS.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  'block rounded-xl px-4 py-3.5 text-[16px] no-underline',
                  isActive(item.to)
                    ? 'bg-brand-tint font-bold text-brand-teal-dark'
                    : 'font-semibold text-brand-body',
                )}
              >
                {item.label}
              </Link>
            ))}
            <a
              href={CONTACT.whatsapp}
              target="_blank"
              rel="noreferrer"
              className="mt-2 block rounded-xl bg-brand-teal p-4 text-center text-[15.5px] font-bold text-white no-underline"
            >
              WhatsApp us · {CONTACT.whatsappLabel}
            </a>
          </div>
        </div>
      ) : null}
    </header>
  )
}

function FooterLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <Link
      to={to}
      className="text-[14.5px] text-brand-on-dark no-underline transition-colors hover:text-white"
    >
      {children}
    </Link>
  )
}

export function SiteFooter() {
  return (
    <footer className="mt-[88px] bg-brand-deep text-brand-on-dark">
      <div className="mx-auto grid max-w-[1240px] gap-10 px-5 pt-16 sm:px-8 md:grid-cols-2 xl:grid-cols-[1.4fr_1fr_1fr_1.1fr]">
        <div>
          <div className="flex items-center gap-3">
            <img src={logoBadge} alt="Jet Ski &amp; More" className="block h-[52px] w-[52px]" />
            <span className="font-display text-[16px] font-extrabold tracking-[0.02em] text-white">
              JET SKI &amp; MORE
            </span>
          </div>
          <div className="mt-5 font-display text-[24px] font-extrabold leading-[1.2] tracking-[-0.02em] text-white">
            Ride the waves, skip the hassle.
          </div>
          <p className="mt-3 max-w-[340px] text-[14.5px] leading-[1.65]">
            Guided jet ski rides, skippered boat trips and fishing charters from Gordon&apos;s Bay Harbour,
            False Bay. Operating since 2020.
          </p>
          <div className="mt-5 max-w-[360px] rounded-[14px] border border-white/[0.14] bg-white/5 px-[18px] py-4">
            <div className="text-[11px] font-bold tracking-[0.14em] text-brand-amber">SAMSA CERTIFIED</div>
            <div className="mt-1.5 text-[13.5px] leading-[1.55] text-brand-on-dark">
              Registered with the South African Maritime Safety Authority and recertified every year.
              Certified skippers on every launch.
            </div>
          </div>
        </div>

        <div>
          <div className="text-[11px] font-bold tracking-[0.16em] text-brand-amber">EXPLORE</div>
          <div className="mt-[18px] flex flex-col items-start gap-2.5">
            <FooterLink to={ROUTES.home}>Home</FooterLink>
            <FooterLink to={ROUTES.rides}>Rides &amp; pricing</FooterLink>
            <FooterLink to={ROUTES.weather}>Ride conditions</FooterLink>
            <FooterLink to={ROUTES.safety}>Safety standard</FooterLink>
          </div>
        </div>

        <div>
          <div className="text-[11px] font-bold tracking-[0.16em] text-brand-amber">MORE</div>
          <div className="mt-[18px] flex flex-col items-start gap-2.5">
            <FooterLink to={ROUTES.boats}>Boat &amp; fishing</FooterLink>
            <FooterLink to={ROUTES.plan}>Plan your day</FooterLink>
            <FooterLink to={ROUTES.faq}>FAQs</FooterLink>
            <FooterLink to={ROUTES.legal}>Terms &amp; privacy</FooterLink>
          </div>
        </div>

        <div>
          <div className="text-[11px] font-bold tracking-[0.16em] text-brand-amber">NEED A HAND?</div>
          <div className="mt-[18px] flex flex-col gap-2.5 text-[14.5px]">
            <a href={CONTACT.phoneHref} className="font-semibold text-white no-underline hover:underline">
              {CONTACT.phone}
            </a>
            <a href={CONTACT.emailHref} className="break-words text-brand-on-dark no-underline hover:text-white">
              {CONTACT.email}
            </a>
            <span>Gordon&apos;s Bay Harbour, Western Cape</span>
            <span>Daily launches, weather permitting.</span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1240px] px-5 pb-10 pt-9 sm:px-8">
        <div className="flex flex-wrap items-center justify-between gap-5 border-t border-white/[0.12] pt-[22px] text-[13.5px]">
          <span>© {new Date().getFullYear()} Jet Ski &amp; More. All wakes reserved.</span>
          <span className="text-brand-on-dark-faint">
            Site by Jet Ski &amp; More · In partnership with False Bay Adventures
          </span>
        </div>
      </div>
    </footer>
  )
}
