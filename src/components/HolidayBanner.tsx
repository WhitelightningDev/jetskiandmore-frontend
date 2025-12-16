import * as React from 'react'
import { CalendarX2 } from 'lucide-react'

function isReconciliationDayToday(now: Date) {
  return now.getMonth() === 11 && now.getDate() === 16
}

export default function HolidayBanner() {
  const [visible, setVisible] = React.useState(false)

  React.useEffect(() => {
    const now = new Date()
    const todayIsHoliday = isReconciliationDayToday(now)
    setVisible(todayIsHoliday)
    if (!todayIsHoliday) return

    const midnight = new Date(now)
    midnight.setHours(24, 0, 0, 0)
    const msUntilMidnight = midnight.getTime() - now.getTime()
    const id = window.setTimeout(() => setVisible(false), Math.max(0, msUntilMidnight))
    return () => window.clearTimeout(id)
  }, [])

  if (!visible) return null

  return (
    <div className="bg-gradient-to-r from-amber-500/80 via-rose-500/80 to-indigo-500/80 text-white">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 text-sm font-medium">
        <CalendarX2 className="h-5 w-5 shrink-0" aria-hidden />
        <div className="leading-tight">
          <p>Closed today for Reconciliation Day.</p>
          <p className="text-white/90">Bookings and support resume tomorrow. Thank you!</p>
        </div>
      </div>
    </div>
  )
}
