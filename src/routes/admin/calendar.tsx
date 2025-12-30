import * as React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { CalendarRange, Clock3, Mail, Phone, UserRound } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useAdminContext } from '@/admin/context'
import {
  formatDateLabel,
  formatRideTime,
  timeSortValue,
  toDateKey,
  withBookingMeta,
  statusLabel,
  statusTone,
  type BookingWithMeta,
} from '@/admin/booking-utils'

export const Route = createFileRoute('/admin/calendar')({
  component: AdminCalendarPage,
})

function AdminCalendarPage() {
  const { bookings, loadingBookings } = useAdminContext()

  const bookingsWithDates = React.useMemo(
    () => withBookingMeta(bookings).filter((b) => b.dateKey),
    [bookings],
  )
  const bookedDates = React.useMemo(() => {
    const keys = Array.from(
      new Set(bookingsWithDates.map((b) => b.dateKey).filter(Boolean) as string[]),
    )
    return keys.map((key) => keyToDate(key)).filter(Boolean) as Date[]
  }, [bookingsWithDates])

  const startOfToday = React.useMemo(() => {
    const d = new Date()
    d.setHours(0, 0, 0, 0)
    return d
  }, [])

  const nextBookingDate = React.useMemo(() => {
    return bookingsWithDates
      .filter((b) => b.parsedDate && b.parsedDate >= startOfToday)
      .sort((a, b) => (a.parsedDate?.getTime() || 0) - (b.parsedDate?.getTime() || 0))[0]
      ?.parsedDate
  }, [bookingsWithDates, startOfToday])

  const nextBooking = React.useMemo(() => {
    return bookingsWithDates
      .filter((b) => b.parsedDate && b.parsedDate >= startOfToday)
      .sort((a, b) => {
        const dateDiff = (a.parsedDate?.getTime() || 0) - (b.parsedDate?.getTime() || 0)
        if (dateDiff !== 0) return dateDiff
        const timeDiff = timeSortValue(a.time) - timeSortValue(b.time)
        return Number.isNaN(timeDiff) ? 0 : timeDiff
      })[0]
  }, [bookingsWithDates, startOfToday])

  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(
    () => nextBookingDate || bookedDates[0] || new Date(),
  )

  React.useEffect(() => {
    if (nextBookingDate) {
      setSelectedDate((prev) => {
        if (!prev) return nextBookingDate
        const prevKey = toDateKey(prev)
        const nextKey = toDateKey(nextBookingDate)
        return prevKey === nextKey ? prev : nextBookingDate
      })
      return
    }
    if (!selectedDate && bookedDates.length > 0) {
      setSelectedDate(bookedDates[0])
    }
  }, [bookedDates, nextBookingDate, selectedDate])

  const selectedKey = selectedDate ? toDateKey(selectedDate) : null
  const bookingsForDay = React.useMemo(() => {
    if (!selectedKey) return [] as BookingWithMeta[]
    return bookingsWithDates
      .filter((b) => b.dateKey === selectedKey)
      .sort((a, b) => {
        const diff = timeSortValue(a.time) - timeSortValue(b.time)
        return Number.isNaN(diff) ? 0 : diff
      })
  }, [bookingsWithDates, selectedKey])

  const dayLabel = selectedDate ? formatDateLabel(selectedDate) : 'Select a date'

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <p className="text-[11px] uppercase tracking-[0.22em] text-cyan-700">Bookings</p>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Calendar</h1>
        <p className="text-sm text-slate-600">
          Pick a day to see which slots are booked and who is riding.
        </p>
      </header>

      <Card className="border-slate-200 bg-gradient-to-r from-cyan-50 via-white to-indigo-50 shadow-sm">
        <CardHeader className="flex flex-row items-start justify-between gap-3">
          <div>
            <CardTitle className="text-base text-slate-900">Next ride</CardTitle>
            <CardDescription className="text-slate-600">
              {nextBooking
                ? 'Earliest upcoming booking with a date.'
                : 'No future bookings captured yet.'}
            </CardDescription>
          </div>
          <Badge variant="secondary" className="bg-white text-slate-700 border border-slate-200">
            <CalendarRange className="mr-1 h-4 w-4" />
            Auto-focus date
          </Badge>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center gap-4 text-sm sm:text-base">
          {nextBooking ? (
            <>
              <Badge variant="outline" className={statusTone(nextBooking.status)}>
                {statusLabel(nextBooking.status)}
              </Badge>
              <span className="font-semibold text-slate-900">
                {formatDateLabel(nextBooking.parsedDate ?? nextBooking.date)}
              </span>
              <Badge variant="outline" className="border-slate-200 bg-white text-slate-800">
                {formatRideTime(nextBooking.time)}
              </Badge>
              <span className="text-slate-700">{nextBooking.rideId}</span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-700">{nextBooking.fullName}</span>
            </>
          ) : (
            <span className="text-slate-700">No upcoming dated bookings.</span>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-[360px,1fr]">
        <Card className="border-slate-200 bg-white shadow-sm">
          <CardHeader className="flex flex-row items-start justify-between gap-3">
            <div>
              <CardTitle className="text-base text-slate-900">Bookings calendar</CardTitle>
              <CardDescription className="text-slate-600">
                Tap a date to see the rides and times.
              </CardDescription>
            </div>
            <Badge variant="outline" className="border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-700">
              {bookedDates.length} dates
            </Badge>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-2">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(day) => setSelectedDate(day || selectedDate)}
                modifiers={{ booked: bookedDates }}
                modifiersClassNames={{
                  booked:
                    'bg-cyan-50 text-cyan-900 border border-cyan-200 data-[selected-single=true]:bg-cyan-600 data-[selected-single=true]:text-white',
                }}
                classNames={{
                  caption_label: 'text-slate-900',
                  dropdowns:
                    'flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 shadow-inner',
                  dropdown_root:
                    'text-slate-900 border-slate-200 bg-white flex-1 rounded-lg px-2 py-1.5 min-w-[120px]',
                  dropdown: 'text-slate-900',
                  day: 'text-slate-900',
                  day_button:
                    'text-slate-900 hover:bg-slate-100 hover:text-slate-900 data-[selected-single=true]:bg-cyan-600 data-[selected-single=true]:text-white data-[outside=true]:text-slate-400',
                }}
                captionLayout="dropdown"
              />
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600">
              <span className="inline-flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-cyan-500" />
                Dates with bookings
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-slate-900" />
                Selected day
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white shadow-sm">
          <CardHeader className="flex flex-row items-start justify-between gap-3">
            <div>
              <CardTitle className="text-base text-slate-900">{dayLabel}</CardTitle>
              <CardDescription className="text-slate-600">
                {bookingsForDay.length > 0
                  ? `${bookingsForDay.length} ride${bookingsForDay.length === 1 ? '' : 's'} scheduled`
                  : loadingBookings
                  ? 'Loading bookings…'
                  : 'No bookings on this date yet.'}
              </CardDescription>
            </div>
            <Badge variant="secondary" className="bg-slate-100 text-slate-700">
              <Clock3 className="mr-1 h-4 w-4" />
              {bookingsForDay.length > 0 ? 'Times locked in' : 'Awaiting bookings'}
            </Badge>
          </CardHeader>
          <CardContent className="px-0">
            {bookingsForDay.length === 0 ? (
              <div className="px-6 py-8 text-sm text-slate-600">
                {loadingBookings ? 'Loading bookings…' : 'No bookings for this date.'}
              </div>
            ) : (
              <ScrollArea className="h-[520px]">
                <div className="space-y-3 px-6 py-4">
                  {bookingsForDay.map((b) => {
                    const tone = statusTone(b.status)
                    return (
                      <div
                        key={b.id}
                        className="flex items-start justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:bg-slate-50"
                      >
                        <div className="flex flex-col gap-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className={`h-2.5 w-2.5 rounded-full border ${tone}`} />
                            <Badge variant="outline" className="border-slate-200 bg-slate-50 text-xs font-semibold text-slate-800">
                              {formatRideTime(b.time)}
                            </Badge>
                            <span className="text-sm font-semibold text-slate-900">{b.rideId}</span>
                            <Badge variant="outline" className={tone + ' capitalize'}>
                              {statusLabel(b.status)}
                            </Badge>
                          </div>
                          <p className="text-sm font-medium text-slate-900">{b.fullName}</p>
                          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600">
                            {b.email && (
                              <span className="inline-flex items-center gap-1">
                                <Mail className="h-3.5 w-3.5" />
                                {b.email}
                              </span>
                            )}
                            {b.phone && (
                              <span className="inline-flex items-center gap-1">
                                <Phone className="h-3.5 w-3.5" />
                                {b.phone}
                              </span>
                            )}
                            <span className="inline-flex items-center gap-1">
                              <UserRound className="h-3.5 w-3.5" />
                              {b.passengers?.length ? `${b.passengers.length} extra` : 'Solo/unspecified'}
                            </span>
                          </div>
                        </div>
                        <div className="text-right text-sm text-slate-700">
                          <div className="font-semibold text-slate-900">ZAR {(b.amountInCents / 100).toLocaleString('en-ZA')}</div>
                          {b.parsedDate && (
                            <p className="text-[11px] text-slate-500">
                              {formatDateLabel(b.parsedDate)}
                            </p>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function keyToDate(key: string) {
  const [y, m, d] = key.split('-').map((part) => Number(part))
  if (!y || !m || !d) return null
  const date = new Date(y, m - 1, d)
  return Number.isNaN(date.getTime()) ? null : date
}
