import { Link } from '@tanstack/react-router'
import { Wrench } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import {
  BOOKINGS_PAUSED,
  BOOKINGS_PAUSED_MESSAGE,
  BOOKINGS_PAUSED_TITLE,
} from '@/lib/bookingStatus'

export default function BookingPauseBanner() {
  if (!BOOKINGS_PAUSED) return null

  return (
    <div className="bg-gradient-to-r from-slate-900 via-amber-700 to-slate-900 text-white">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 text-sm">
        <div className="flex items-start gap-3">
          <Wrench className="mt-0.5 h-5 w-5 shrink-0" aria-hidden />
          <div className="leading-tight">
            <p className="font-semibold">{BOOKINGS_PAUSED_TITLE}</p>
            <p className="text-white/80">{BOOKINGS_PAUSED_MESSAGE}</p>
          </div>
        </div>
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
  )
}
