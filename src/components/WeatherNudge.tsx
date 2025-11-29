import { useEffect, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { CloudSun, X } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export default function WeatherNudge() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 1200)
    return () => clearTimeout(timer)
  }, [])

  if (!visible) return null

  return (
    <aside className="fixed bottom-28 right-4 z-50 w-[320px] max-w-[88vw] drop-shadow-xl">
      <div className="rounded-2xl border border-white/20 bg-slate-900/90 text-white backdrop-blur p-4 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-white/5 via-transparent to-white/10" />
        <div className="flex items-start gap-3 relative">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/20">
            <CloudSun className="h-5 w-5 text-amber-200" />
          </span>
          <div className="space-y-1 text-sm">
            <p className="font-semibold leading-snug">Check the weather before booking</p>
            <p className="text-white/80 leading-snug">
              Gordon&apos;s Bay conditions change quickly. Please peek at today&apos;s wind &amp; swell before you lock in a time.
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              <Link to="/weather" className={cn(buttonVariants({ size: 'sm', variant: 'secondary' }), 'bg-white text-slate-900 hover:bg-white/90')}>
                View weather
              </Link>
              <Link to="/Bookings" className={cn(buttonVariants({ size: 'sm', variant: 'outline' }), 'border-white/50 text-black hover:bg-gray/10')}>
                Book anyway
              </Link>
            </div>
          </div>
          <button
            onClick={() => setVisible(false)}
            className="ml-auto p-1 rounded-lg text-white/70 hover:text-white hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
            aria-label="Dismiss weather reminder"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  )
}
