import { Flower2, Leaf, Snowflake, Sun, type LucideIcon } from 'lucide-react'
import { useBookingControls } from '@/lib/bookingControls'

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
  bg: string
  Icon: LucideIcon
} {
  switch (season) {
    case 'autumn':
      return {
        label: 'Autumn',
        bg: 'bg-sky-950',
        Icon: Leaf,
      }
    case 'winter':
      return {
        label: 'Winter',
        bg: 'bg-sky-950',
        Icon: Snowflake,
      }
    case 'spring':
      return {
        label: 'Spring',
        bg: 'bg-sky-950',
        Icon: Flower2,
      }
    case 'summer':
    default:
      return {
        label: 'Summer',
        bg: 'bg-sky-950',
        Icon: Sun,
      }
  }
}

function formatReopenLabel(reopenDate: Date, now: Date) {
  const sameYear = reopenDate.getFullYear() === now.getFullYear()
  try {
    return new Intl.DateTimeFormat('en-ZA', sameYear ? { day: 'numeric', month: 'long' } : { day: 'numeric', month: 'long', year: 'numeric' }).format(
      reopenDate,
    )
  } catch {
    return sameYear ? formatReopenDate(reopenDate).replace(/\s*\d{4}\s*$/, '') : formatReopenDate(reopenDate)
  }
}

export default function BookingPauseBanner() {
  const { controls } = useBookingControls()
  if (controls.jetSkiBookingsEnabled) return null

  const now = new Date()
  const season = getSeasonKey(now)
  const theme = getSeasonTheme(season)
  const reopenDate = nextReopenDate(now)

  return (
    <div className={`border-b border-white/10 ${theme.bg} text-white`}>
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-2 px-4 sm:px-6 lg:px-8 py-2 text-xs sm:text-sm">
        <theme.Icon className="h-4 w-4 text-white/85" aria-hidden />
        <span className="font-semibold">Jet ski bookings closed for the season</span>
        <span className="text-white/40">•</span>
        <span className="text-white/90">
          {controls.boatRideBookingsEnabled ? 'Boat rides still available' : 'Other experiences may be limited'}
        </span>
        <span className="text-white/40">•</span>
        <span className="text-white/90">Reopening {formatReopenLabel(reopenDate, now)}</span>
      </div>
    </div>
  )
}
