import { Link } from '@tanstack/react-router'
import { Flower2, Leaf, Snowflake, Sun, type LucideIcon } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { pickPrimaryBookingAction, useBookingControls } from '@/lib/bookingControls'

type SeasonKey = 'summer' | 'autumn' | 'winter' | 'spring'

function getSeasonKey(d: Date): SeasonKey {
  // Southern Hemisphere (South Africa)
  const m = d.getMonth() // 0-11
  if (m === 11 || m === 0 || m === 1) return 'summer'
  if (m === 2 || m === 3 || m === 4) return 'autumn'
  if (m === 5 || m === 6 || m === 7) return 'winter'
  return 'spring'
}

function nextReopenDate(d: Date) {
  // Reopen on 1 November; keep it in the future.
  const year = d.getFullYear()
  const reopenThisYear = new Date(year, 10, 1) // Nov 1
  if (d.getTime() < reopenThisYear.getTime()) return reopenThisYear
  return new Date(year + 1, 10, 1)
}

function formatReopenDate(d: Date) {
  try {
    return new Intl.DateTimeFormat('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' }).format(d)
  } catch {
    return d.toDateString()
  }
}

function getSeasonTheme(season: SeasonKey): {
  label: string
  gradient: string
  Icon: LucideIcon
  decoClass: string
} {
  switch (season) {
    case 'autumn':
      return {
        label: 'Autumn',
        gradient: 'from-amber-950 via-orange-700 to-amber-950',
        Icon: Leaf,
        decoClass: 'text-amber-200/25',
      }
    case 'winter':
      return {
        label: 'Winter',
        gradient: 'from-slate-950 via-sky-900 to-slate-950',
        Icon: Snowflake,
        decoClass: 'text-sky-200/20',
      }
    case 'spring':
      return {
        label: 'Spring',
        gradient: 'from-emerald-950 via-lime-700 to-emerald-950',
        Icon: Flower2,
        decoClass: 'text-lime-200/20',
      }
    case 'summer':
    default:
      return {
        label: 'Summer',
        gradient: 'from-cyan-950 via-sky-700 to-cyan-950',
        Icon: Sun,
        decoClass: 'text-yellow-200/20',
      }
  }
}

export default function BookingPauseBanner() {
  const { controls } = useBookingControls()
  if (controls.jetSkiBookingsEnabled) return null

  const now = new Date()
  const season = getSeasonKey(now)
  const theme = getSeasonTheme(season)
  const reopenDate = nextReopenDate(now)
  const primary = pickPrimaryBookingAction(controls)

  const primaryLabel =
    primary.to === '/boat-ride'
      ? 'Book a boat ride'
      : primary.to === '/fishing-charters'
        ? 'Enquire fishing'
        : 'Contact us'

  return (
    <div className={`relative overflow-hidden bg-gradient-to-r ${theme.gradient} text-white`}>
      <div className="pointer-events-none absolute inset-0">
        <theme.Icon className={`absolute -right-8 -top-8 h-24 w-24 rotate-12 ${theme.decoClass}`} aria-hidden />
        <theme.Icon className={`absolute right-24 -bottom-10 h-28 w-28 -rotate-12 ${theme.decoClass}`} aria-hidden />
        <theme.Icon className={`absolute left-10 -top-10 h-20 w-20 rotate-6 ${theme.decoClass}`} aria-hidden />
      </div>

      <div className="relative mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 sm:px-6 lg:px-8 py-3 text-sm">
        <div className="flex items-start gap-3">
          <theme.Icon className="mt-0.5 h-5 w-5 shrink-0" aria-hidden />
          <div className="leading-tight">
            <p className="font-semibold">Jet ski bookings closed • {theme.label}</p>
            <p className="text-white/80">
              {primary.enabled
                ? `Other experiences are still available. We'll be open again on ${formatReopenDate(reopenDate)}.`
                : `We’ll be open again on ${formatReopenDate(reopenDate)}.`}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {primary.enabled ? (
            <Link
              to={primary.to}
              className={buttonVariants({
                size: 'sm',
                className: 'bg-white/95 text-slate-900 hover:bg-white',
              })}
            >
              {primaryLabel}
            </Link>
          ) : null}
          <Link
            to="/contact"
            className={buttonVariants({
              variant: 'outline',
              size: 'sm',
              className: 'border-white/50 text-white hover:bg-white/10',
            })}
          >
            Contact us
          </Link>
        </div>
      </div>
    </div>
  )
}
