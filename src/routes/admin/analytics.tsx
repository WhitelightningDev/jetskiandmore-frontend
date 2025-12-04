import * as React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from 'recharts'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import type { Booking } from '@/admin/types'
import { useAdminContext } from '@/admin/context'

export const Route = createFileRoute('/admin/analytics')({
  component: AdminAnalyticsPage,
})

const bookingsChartConfig: ChartConfig = {
  bookings: {
    label: 'Bookings',
    color: '#22d3ee',
  },
  revenue: {
    label: 'Revenue (ZAR)',
    color: '#f97316',
  },
}

function AdminAnalyticsPage() {
  const { analytics, bookings, loadingBookings, loadingMeta } = useAdminContext()
  const { dailyData, monthLabel } = React.useMemo(() => buildDailyData(bookings), [bookings])

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <p className="text-[11px] uppercase tracking-[0.22em] text-cyan-200/80">Analytics</p>
        <h1 className="text-xl font-semibold text-white">Performance this month</h1>
        <p className="text-sm text-slate-300">Daily breakdowns and ride-level revenue.</p>
      </header>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr),minmax(0,2fr)]">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="border-white/10 bg-white/5 text-white shadow-lg shadow-cyan-500/10">
            <CardHeader>
              <CardTitle className="text-base">Total bookings</CardTitle>
              <CardDescription className="text-slate-300">All time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">
                {loadingBookings ? '—' : analytics ? analytics.totalBookings : '—'}
              </div>
            </CardContent>
          </Card>
          <Card className="border-white/10 bg-white/5 text-white shadow-lg shadow-cyan-500/10">
            <CardHeader>
              <CardTitle className="text-base">Total revenue</CardTitle>
              <CardDescription className="text-slate-300">All time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">
                {loadingMeta ? '—' : analytics ? `ZAR ${analytics.totalRevenueZar.toFixed(0)}` : '—'}
              </div>
            </CardContent>
          </Card>
          <Card className="border-white/10 bg-white/5 text-white shadow-lg shadow-cyan-500/10">
            <CardHeader>
              <CardTitle className="text-base">Top ride</CardTitle>
              <CardDescription className="text-slate-300">By bookings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm">
                {analytics && analytics.rides.length > 0
                  ? `${analytics.rides[0].rideId} (${analytics.rides[0].bookings} bookings)`
                  : '—'}
              </div>
            </CardContent>
          </Card>
          <Card className="border-white/10 bg-white/5 text-white shadow-lg shadow-cyan-500/10">
            <CardHeader>
              <CardTitle className="text-base">Site visitors</CardTitle>
              <CardDescription className="text-slate-300">All time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">
                {loadingMeta ? '—' : analytics ? analytics.totalPageViews.toLocaleString() : '—'}
              </div>
            </CardContent>
          </Card>
        </div>

        {dailyData.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="border-white/10 bg-slate-900/90 shadow-lg shadow-cyan-500/10">
              <CardHeader className="flex flex-col items-stretch border-b border-white/10 !p-0 sm:flex-row">
                <div className="flex flex-1 flex-col justify-center gap-1 px-6 pt-4 pb-3 sm:!py-0">
                  <CardTitle className="text-white">Bookings this month</CardTitle>
                  <CardDescription className="text-slate-300">
                    {monthLabel || 'Latest month'} daily counts.
                  </CardDescription>
                </div>
                <div className="flex">
                  <div className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t border-white/10 px-6 py-4 text-left sm:border-l sm:border-t-0 sm:px-8 sm:py-6">
                    <span className="text-slate-400 text-xs">Total</span>
                    <span className="text-lg leading-none font-bold text-white sm:text-3xl">
                      {analytics?.totalBookings.toLocaleString() ?? '—'}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="px-2 sm:p-6">
                <ChartContainer
                  config={{ bookings: bookingsChartConfig.bookings }}
                  className="rounded-xl border border-white/10 bg-gradient-to-b from-slate-900 to-slate-950"
                >
                  <div className="h-72 w-full px-1">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart accessibilityLayer data={dailyData} margin={{ left: 12, right: 12, top: 12 }}>
                        <defs>
                          <linearGradient id="fillBookingsTotal" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="var(--color-bookings)" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="var(--color-bookings)" stopOpacity={0.1} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid vertical={false} strokeOpacity={0.12} strokeDasharray="3 3" />
                        <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(v) => `${v}`} />
                        <YAxis
                          tickLine={false}
                          axisLine={false}
                          tickFormatter={(v) => formatNumber(Number(v))}
                          width={42}
                          tickMargin={6}
                        />
                        <ChartTooltip
                          cursor={false}
                          content={
                            <ChartTooltipContent
                              indicator="dot"
                              labelFormatter={(value) => `${monthLabel || 'Day'} ${value}`}
                              valueFormatter={(value) => `${Number(value ?? 0)} bookings`}
                            />
                          }
                        />
                        <Area
                          name="Bookings"
                          dataKey="bookings"
                          type="monotone"
                          fill="url(#fillBookingsTotal)"
                          stroke="var(--color-bookings)"
                          strokeWidth={2.25}
                          activeDot={{ r: 4 }}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card className="border-white/10 bg-slate-900/90 shadow-lg shadow-cyan-500/10">
              <CardHeader>
                <CardTitle className="text-white">Revenue this month</CardTitle>
                <CardDescription className="text-slate-300">
                  {monthLabel || 'Latest month'} daily revenue (ZAR).
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{ revenue: bookingsChartConfig.revenue }}
                  className="rounded-xl border border-white/10 bg-gradient-to-b from-slate-900 to-slate-950"
                >
                  <div className="h-72 w-full px-1">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart accessibilityLayer data={dailyData} margin={{ left: 12, right: 12, top: 12 }}>
                        <defs>
                          <linearGradient id="fillRevenueTotal" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="var(--color-revenue)" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="var(--color-revenue)" stopOpacity={0.1} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid vertical={false} strokeOpacity={0.12} strokeDasharray="3 3" />
                        <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(v) => `${v}`} />
                        <YAxis
                          tickLine={false}
                          axisLine={false}
                          tickFormatter={(v) => `Z${formatNumber(Number(v))}`}
                          width={50}
                          tickMargin={6}
                        />
                        <ChartTooltip
                          cursor={false}
                          content={
                            <ChartTooltipContent
                              indicator="dot"
                              labelFormatter={(value) => `${monthLabel || 'Day'} ${value}`}
                              valueFormatter={(value) => `ZAR ${Number(value ?? 0).toLocaleString('en-ZA')}`}
                            />
                          }
                        />
                        <Area
                          name="Revenue"
                          dataKey="revenue"
                          type="monotone"
                          fill="url(#fillRevenueTotal)"
                          stroke="var(--color-revenue)"
                          strokeWidth={2.25}
                          activeDot={{ r: 4 }}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card className="border-white/10 bg-slate-900/80 text-white shadow-lg shadow-cyan-500/10">
            <CardContent className="p-6 text-sm text-slate-300">
              {loadingBookings ? 'Loading analytics…' : 'No booking data available yet.'}
            </CardContent>
          </Card>
        )}
      </div>

      {analytics && analytics.rides.length > 0 && (
        <Card className="border-white/10 bg-slate-900/80 text-white shadow-lg shadow-cyan-500/10">
          <CardHeader>
            <CardTitle className="text-base">Bookings by ride</CardTitle>
            <CardDescription className="text-slate-300">Sorted by volume</CardDescription>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ride</TableHead>
                  <TableHead>Bookings</TableHead>
                  <TableHead className="text-right">Revenue (ZAR)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {analytics.rides.map((r) => (
                  <TableRow key={r.rideId}>
                    <TableCell>{r.rideId}</TableCell>
                    <TableCell>{r.bookings}</TableCell>
                    <TableCell className="text-right">
                      {(r.revenueInCents / 100).toFixed(0)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function buildDailyData(bookings: Booking[]) {
  if (!bookings || bookings.length === 0) return { dailyData: [], monthLabel: '' }

  let latest: Date | null = null
  for (const b of bookings) {
    const raw = b.date || b.createdAt
    if (!raw) continue
    const d = new Date(raw)
    if (Number.isNaN(d.getTime())) continue
    if (!latest || d > latest) latest = d
  }
  if (!latest) return { dailyData: [], monthLabel: '' }

  const targetYear = latest.getFullYear()
  const targetMonth = latest.getMonth()
  const daysInMonth = new Date(targetYear, targetMonth + 1, 0).getDate()
  const labelForMonth = latest.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

  const aggregates: Record<number, { bookings: number; revenue: number }> = {}
  bookings.forEach((b) => {
    const raw = b.date || b.createdAt
    if (!raw) return
    const d = new Date(raw)
    if (Number.isNaN(d.getTime())) return
    if (d.getFullYear() !== targetYear || d.getMonth() !== targetMonth) return
    const day = d.getDate()
    if (!aggregates[day]) {
      aggregates[day] = { bookings: 0, revenue: 0 }
    }
    aggregates[day].bookings += 1
    aggregates[day].revenue += Math.round((b.amountInCents ?? 0) / 100)
  })

  const dailyData = Array.from({ length: daysInMonth }, (_, idx) => {
    const day = idx + 1
    const aggregate = aggregates[day] ?? { bookings: 0, revenue: 0 }
    return {
      day,
      label: `${labelForMonth.split(' ')[0].slice(0, 3)} ${day}`,
      bookings: aggregate.bookings,
      revenue: aggregate.revenue,
    }
  })

  return { dailyData, monthLabel: labelForMonth }
}

function formatNumber(value: number) {
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}m`
  if (value >= 1000) return `${(value / 1000).toFixed(1)}k`
  return `${value}`
}
