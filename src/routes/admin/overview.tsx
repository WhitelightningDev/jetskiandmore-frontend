import * as React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { CalendarClock, ShieldCheck, TrendingUp, Users } from 'lucide-react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useAdminContext } from '@/admin/context'

export const Route = createFileRoute('/admin/overview')({
  component: AdminOverviewPage,
})

function AdminOverviewPage() {
  const { analytics, quizSubs, bookings, loadingMeta, loadingBookings } = useAdminContext()
  const recent = bookings.slice(0, 4)

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-white/10 bg-gradient-to-r from-cyan-500/10 via-slate-900/80 to-slate-900 shadow-2xl shadow-cyan-500/10">
        <div className="flex flex-col gap-6 p-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-3">
            <Badge variant="outline" className="border-cyan-300/40 bg-white/10 text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-100">
              Control center
            </Badge>
            <h1 className="text-3xl font-bold text-white lg:text-4xl">Operations dashboard</h1>
            <p className="max-w-2xl text-sm text-slate-200">
              Quick glance of revenue, bookings, and compliance signals. Use the left menu to dive deeper into each area.
            </p>
          </div>
          <div className="grid w-full max-w-sm gap-3 sm:grid-cols-2 lg:max-w-md">
            <Card className="border-white/10 bg-white/5 text-white">
              <CardHeader className="space-y-1 pb-2">
                <CardDescription className="text-xs uppercase tracking-[0.16em] text-cyan-100">
                  Total bookings
                </CardDescription>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Users className="h-5 w-5 text-cyan-200" />
                  {loadingBookings ? '—' : analytics ? analytics.totalBookings.toLocaleString() : '—'}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-slate-200/80">
                Latest pull from admin API.
              </CardContent>
            </Card>
            <Card className="border-white/10 bg-white/5 text-white">
              <CardHeader className="space-y-1 pb-2">
                <CardDescription className="text-xs uppercase tracking-[0.16em] text-cyan-100">
                  Revenue to date
                </CardDescription>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <TrendingUp className="h-5 w-5 text-emerald-300" />
                  {loadingMeta ? '—' : analytics ? `ZAR ${analytics.totalRevenueZar.toFixed(0)}` : '—'}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-slate-200/80">
                Gross revenue across all rides.
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Bookings"
          icon={<Users className="h-4 w-4 text-cyan-200" />}
          value={
            loadingBookings
              ? 'Loading…'
              : analytics
              ? analytics.totalBookings.toLocaleString()
              : '—'
          }
          hint="All time"
        />
        <StatCard
          title="Revenue"
          icon={<TrendingUp className="h-4 w-4 text-emerald-300" />}
          value={loadingMeta ? 'Loading…' : analytics ? `ZAR ${analytics.totalRevenueZar.toFixed(0)}` : '—'}
          hint="All time"
        />
        <StatCard
          title="Top ride"
          icon={<CalendarClock className="h-4 w-4 text-indigo-200" />}
          value={
            analytics && analytics.rides.length > 0
              ? `${analytics.rides[0].rideId}`
              : '—'
          }
          hint={analytics && analytics.rides.length > 0 ? `${analytics.rides[0].bookings} bookings` : 'Highest volume'}
        />
        <StatCard
          title="Quiz submissions"
          icon={<ShieldCheck className="h-4 w-4 text-amber-200" />}
          value={loadingMeta ? 'Loading…' : quizSubs.length}
          hint="Interim skipper"
        />
      </section>

      <section className="rounded-2xl border border-white/10 bg-slate-900/80 text-white shadow-lg shadow-cyan-500/10">
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.22em] text-cyan-200/80">Recent</p>
            <h2 className="text-lg font-semibold">Latest bookings</h2>
            <p className="text-sm text-slate-300">Newest requests across all rides.</p>
          </div>
          <Badge variant="outline" className="border-white/10 bg-white/5 text-slate-200">
            {loadingBookings ? 'Refreshing…' : `${bookings.length} loaded`}
          </Badge>
        </div>
        <div className="divide-y divide-white/5">
          {recent.length === 0 ? (
            <div className="px-6 py-5 text-sm text-slate-300">
              {loadingBookings ? 'Loading bookings…' : 'No bookings yet.'}
            </div>
          ) : (
            recent.map((b) => (
              <div key={b.id} className="flex items-center justify-between px-6 py-4">
                <div className="flex flex-col">
                  <span className="font-semibold">{b.fullName}</span>
                  <span className="text-xs text-slate-400">
                    {b.date ||
                      (b.createdAt ? new Date(b.createdAt).toLocaleDateString('en-ZA') : '—')}
                    {' • '}
                    {b.rideId}
                  </span>
                </div>
                <div className="text-right text-sm text-slate-200">
                  <p className="font-semibold">ZAR {(b.amountInCents / 100).toFixed(0)}</p>
                  <p className="text-xs capitalize text-slate-400">{b.status || 'created'}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  )
}

function StatCard({
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
    <Card className="border-white/10 bg-white/5 text-white shadow-lg shadow-cyan-500/10">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          {icon}
          {title}
        </CardTitle>
        <CardDescription className="text-slate-300">{hint}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-semibold">{value}</div>
      </CardContent>
    </Card>
  )
}
