import * as React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Link } from '@tanstack/react-router'
import { CalendarClock, CalendarDays, Search, ShieldCheck, TrendingUp, Users } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { useAdminContext } from '@/admin/context'
import { formatDateLabel, formatRideTime, statusLabel, statusTone, withBookingMeta } from '@/admin/booking-utils'

export const Route = createFileRoute('/admin/overview')({
  component: AdminOverviewPage,
})

function AdminOverviewPage() {
  const { analytics, quizSubs, bookings, loadingMeta, loadingBookings } = useAdminContext()
  const recent = React.useMemo(() => withBookingMeta(bookings).slice(0, 5), [bookings])
  const [search, setSearch] = React.useState('')
  const lastUpdated = React.useMemo(() => formatDateLabel(new Date()), [])

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="space-y-1">
          <p className="text-[11px] uppercase tracking-[0.22em] text-cyan-700">Dashboard</p>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Overview</h1>
          <p className="text-sm text-slate-600">Last updated: {lastUpdated}</p>
        </div>
        <div className="flex w-full max-w-xl items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 shadow-sm">
          <Search className="h-4 w-4 text-slate-500" aria-hidden />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search customer, email, ride… (visual only)"
            className="h-8 border-0 bg-transparent p-0 text-sm shadow-none focus-visible:ring-0"
          />
        </div>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <ModernStatCard
          title="Total bookings"
          icon={<Users className="h-4 w-4 text-cyan-700" />}
          value={loadingBookings ? '—' : analytics ? analytics.totalBookings.toLocaleString() : '—'}
          hint="All time"
        />
        <ModernStatCard
          title="Total revenue"
          icon={<TrendingUp className="h-4 w-4 text-emerald-700" />}
          value={loadingMeta ? '—' : analytics ? `ZAR ${analytics.totalRevenueZar.toFixed(0)}` : '—'}
          hint="All time"
        />
        <ModernStatCard
          title="Top ride"
          icon={<CalendarClock className="h-4 w-4 text-indigo-700" />}
          value={analytics && analytics.rides.length > 0 ? `${analytics.rides[0].rideId}` : '—'}
          hint={analytics && analytics.rides.length > 0 ? `${analytics.rides[0].bookings} bookings` : 'Highest volume'}
        />
        <ModernStatCard
          title="Quiz submissions"
          icon={<ShieldCheck className="h-4 w-4 text-amber-700" />}
          value={loadingMeta ? '—' : quizSubs.length}
          hint="Interim skipper"
        />
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.3fr,0.7fr]">
        <Card className="border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
            <div>
              <p className="text-[11px] uppercase tracking-[0.22em] text-cyan-700">Recent</p>
              <h2 className="text-lg font-semibold text-slate-900">Latest bookings</h2>
              <p className="text-sm text-slate-600">Newest requests across all rides.</p>
            </div>
            <Badge variant="outline" className="border-slate-200 bg-white text-slate-700">
              {loadingBookings ? 'Refreshing…' : `${bookings.length} loaded`}
            </Badge>
          </div>
          <div className="divide-y divide-slate-100">
            {recent.length === 0 ? (
              <div className="px-6 py-5 text-sm text-slate-600">
                {loadingBookings ? 'Loading bookings…' : 'No bookings yet.'}
              </div>
            ) : (
              recent
                .filter((b) => {
                  if (!search.trim()) return true
                  const s = search.trim().toLowerCase()
                  return (
                    (b.fullName || '').toLowerCase().includes(s) ||
                    (b.email || '').toLowerCase().includes(s) ||
                    (b.rideId || '').toLowerCase().includes(s)
                  )
                })
                .map((b) => (
                  <div key={b.id} className="flex flex-col gap-2 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-col">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-semibold text-slate-900">{b.fullName}</span>
                        <Badge variant="outline" className={statusTone(b.status)}>
                          {statusLabel(b.status)}
                        </Badge>
                      </div>
                      <span className="text-xs text-slate-500">
                        {formatDateLabel(b.parsedDate ?? b.date ?? null)}
                        {' • '}
                        {formatRideTime(b.time)}
                        {' • '}
                        {b.rideId}
                      </span>
                    </div>
                    <div className="text-left text-sm text-slate-700 sm:text-right">
                      <p className="font-semibold">ZAR {(b.amountInCents / 100).toLocaleString('en-ZA')}</p>
                      <p className="text-xs text-slate-500">{b.email}</p>
                    </div>
                  </div>
                ))
            )}
          </div>
        </Card>

        <Card className="border-slate-200 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-base text-slate-900">Quick actions</CardTitle>
            <CardDescription className="text-slate-600">Jump to the most used admin pages.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            <Button asChild variant="outline" className="justify-between border-slate-200 bg-white hover:bg-slate-50">
              <Link to="/admin/bookings">
                Bookings
                <span className="text-slate-500">{bookings.length}</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="justify-between border-slate-200 bg-white hover:bg-slate-50">
              <Link to="/admin/calendar">
                Calendar
                <CalendarDays className="h-4 w-4 text-slate-500" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="justify-between border-slate-200 bg-white hover:bg-slate-50">
              <Link to="/admin/analytics">
                Analytics
                <TrendingUp className="h-4 w-4 text-slate-500" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="justify-between border-slate-200 bg-white hover:bg-slate-50">
              <Link to="/admin/quiz">
                Safety & quiz
                <ShieldCheck className="h-4 w-4 text-slate-500" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}

function ModernStatCard({
  title,
  value,
  hint,
  icon,
}: {
  title: string
  value: React.ReactNode
  hint: string
  icon: React.ReactNode
}) {
  return (
    <Card className="border-slate-200 bg-white shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="text-sm font-semibold text-slate-700">{title}</CardTitle>
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-slate-50">
            {icon}
          </span>
        </div>
        <CardDescription className="text-slate-500">{hint}</CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="text-3xl font-semibold tracking-tight text-slate-900">{value}</div>
      </CardContent>
    </Card>
  )
}
