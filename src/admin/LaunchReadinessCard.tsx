import * as React from 'react'
import { AlertTriangle, CalendarClock, CheckCircle2 } from 'lucide-react'
import { Link } from '@tanstack/react-router'

import { API_BASE } from '@/lib/api'
import { OPENING_DATE_ISO, OPENING_DATE_LABEL } from '@/lib/site'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

type BookingControls = {
  jetSkiBookingsEnabled: boolean
  jetSkiBookingsOpenAt?: string | null
}

function dateInJohannesburg(value?: string | null): string | null {
  if (!value) return null
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return null
  const parts = new Intl.DateTimeFormat('en-CA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone: 'Africa/Johannesburg',
  }).formatToParts(date)
  const get = (type: Intl.DateTimeFormatPartTypes) => parts.find((part) => part.type === type)?.value ?? ''
  return `${get('year')}-${get('month')}-${get('day')}`
}

function dateLabel(value?: string | null): string {
  if (!value) return 'No scheduled opening date'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Invalid scheduled opening date'
  return new Intl.DateTimeFormat('en-ZA', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Africa/Johannesburg',
  }).format(date)
}

export default function LaunchReadinessCard() {
  const [controls, setControls] = React.useState<BookingControls | null>(null)
  const [loadFailed, setLoadFailed] = React.useState(false)

  React.useEffect(() => {
    let active = true
    fetch(`${API_BASE}/api/booking-controls`)
      .then((response) => {
        if (!response.ok) throw new Error('Could not load booking controls')
        return response.json() as Promise<BookingControls>
      })
      .then((data) => {
        if (active) setControls(data)
      })
      .catch(() => {
        if (active) setLoadFailed(true)
      })
    return () => {
      active = false
    }
  }, [])

  const apiDate = dateInJohannesburg(controls?.jetSkiBookingsOpenAt)
  const dateMismatch = Boolean(controls && apiDate !== OPENING_DATE_ISO)

  return (
    <Card className={dateMismatch ? 'border-amber-300 bg-amber-50/50 shadow-sm' : 'border-slate-200 bg-white shadow-sm'}>
      <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <CardTitle className="flex items-center gap-2 text-base text-slate-950">
            {dateMismatch ? <AlertTriangle className="h-4 w-4 text-amber-600" /> : <CalendarClock className="h-4 w-4 text-cyan-700" />}
            Launch readiness
          </CardTitle>
          <CardDescription className="mt-1 text-slate-600">The public opening announcement and live booking schedule.</CardDescription>
        </div>
        <Button asChild size="sm" variant="outline">
          <Link to="/admin/booking-controls">Review booking controls</Link>
        </Button>
      </CardHeader>
      <CardContent className="grid gap-3 text-sm sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-3">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Site opening announcement</p>
          <p className="mt-1 font-semibold text-slate-900">{OPENING_DATE_LABEL}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-3">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Booking API schedule</p>
          <p className="mt-1 font-semibold text-slate-900">
            {loadFailed ? 'Could not load' : controls ? dateLabel(controls.jetSkiBookingsOpenAt) : 'Loading…'}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-3">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Jet ski online bookings</p>
          <p className="mt-1">
            {loadFailed || !controls ? (
              <Badge variant="outline">Status unavailable</Badge>
            ) : controls.jetSkiBookingsEnabled ? (
              <Badge className="bg-emerald-600 text-white">Open</Badge>
            ) : (
              <Badge variant="outline">Closed</Badge>
            )}
          </p>
        </div>
        {dateMismatch ? (
          <div className="rounded-xl border border-amber-300 bg-amber-100/70 p-3 text-amber-950 sm:col-span-3">
            <p className="flex items-start gap-2 font-semibold">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
              Booking schedule conflicts with the public opening date.
            </p>
            <p className="mt-1 pl-6 text-sm">
              The site says operations start {OPENING_DATE_LABEL}, but the API has a different scheduled opening. Align the schedule so jet ski bookings cannot open before launch day.
            </p>
          </div>
        ) : controls ? (
          <p className="flex items-center gap-2 text-emerald-800 sm:col-span-3">
            <CheckCircle2 className="h-4 w-4" />
            The public opening date and booking schedule match.
          </p>
        ) : null}
      </CardContent>
    </Card>
  )
}
