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
import type {
  Booking,
  CountStat,
  PageViewAnalyticsItem,
  TimeOfDayStat,
} from '@/admin/types'
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
  const {
    analytics,
    bookings,
    pageViews,
    loadingBookings,
    loadingMeta,
    loadingPageViews,
  } = useAdminContext()
  const { dailyData, monthLabel } = React.useMemo(() => buildDailyData(bookings), [bookings])
  const {
    publicPages,
    adminPages,
    publicSummary,
    adminSummary,
  } = React.useMemo(() => {
    const items = pageViews?.items || []
    const publicPages = items.filter((p) => !String(p.path || '').startsWith('/admin'))
    const adminPages = items.filter((p) => String(p.path || '').startsWith('/admin'))
    return {
      publicPages,
      adminPages,
      publicSummary: summarizePages(publicPages),
      adminSummary: summarizePages(adminPages),
    }
  }, [pageViews])
  const topPages = React.useMemo(() => publicPages.slice(0, 8), [publicPages])
  const breakdown = pageViews?.breakdowns
  const topCountries = React.useMemo(() => takeTop(breakdown?.countries), [breakdown])
  const topCities = React.useMemo(() => takeTop(breakdown?.cities), [breakdown])
  const topDevices = React.useMemo(() => takeTop(breakdown?.deviceTypes), [breakdown])
  const topOS = React.useMemo(() => takeTop(breakdown?.os), [breakdown])
  const topBrowsers = React.useMemo(() => takeTop(breakdown?.browsers), [breakdown])
  const topLanguages = React.useMemo(() => takeTop(breakdown?.languages), [breakdown])
  const timeOfDay: TimeOfDayStat[] = breakdown?.timeOfDay || []
  const returning = breakdown?.returning

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <p className="text-[11px] uppercase tracking-[0.22em] text-cyan-700">Analytics</p>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Analytics</h1>
        <p className="text-sm text-slate-600">Daily breakdowns and ride-level revenue.</p>
      </header>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr),minmax(0,2fr)]">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="border-slate-200 bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">Total bookings</CardTitle>
              <CardDescription className="text-slate-600">All time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold text-slate-900">
                {loadingBookings ? '—' : analytics ? analytics.totalBookings : '—'}
              </div>
            </CardContent>
          </Card>
          <Card className="border-slate-200 bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">Total revenue</CardTitle>
              <CardDescription className="text-slate-600">All time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold text-slate-900">
                {loadingMeta ? '—' : analytics ? `ZAR ${analytics.totalRevenueZar.toFixed(0)}` : '—'}
              </div>
            </CardContent>
          </Card>
          <Card className="border-slate-200 bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">Top ride</CardTitle>
              <CardDescription className="text-slate-600">By bookings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-slate-700">
                {analytics && analytics.rides.length > 0
                  ? `${analytics.rides[0].rideId} (${analytics.rides[0].bookings} bookings)`
                  : '—'}
              </div>
            </CardContent>
          </Card>
          <Card className="border-slate-200 bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">Site visitors</CardTitle>
              <CardDescription className="text-slate-600">All time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold text-slate-900">
                {loadingMeta ? '—' : analytics ? analytics.totalPageViews.toLocaleString() : '—'}
              </div>
              <p className="text-xs text-slate-600">
                {loadingPageViews
                  ? 'Loading sessions…'
                  : pageViews
                  ? `${pageViews.totalUniqueSessions.toLocaleString()} unique sessions`
                  : '—'}
              </p>
            </CardContent>
          </Card>
        </div>

        {dailyData.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="border-slate-200 bg-white shadow-sm">
              <CardHeader className="flex flex-col items-stretch border-b border-slate-200 !p-0 sm:flex-row">
                <div className="flex flex-1 flex-col justify-center gap-1 px-6 pt-4 pb-3 sm:!py-0">
                  <CardTitle className="text-slate-900">Bookings this month</CardTitle>
                  <CardDescription className="text-slate-600">
                    {monthLabel || 'Latest month'} daily counts.
                  </CardDescription>
                </div>
                <div className="flex">
                  <div className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t border-slate-200 px-6 py-4 text-left sm:border-l sm:border-t-0 sm:px-8 sm:py-6">
                    <span className="text-xs text-slate-500">Total</span>
                    <span className="text-lg leading-none font-bold text-slate-900 sm:text-3xl">
                      {analytics?.totalBookings.toLocaleString() ?? '—'}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="px-2 sm:p-6">
                <ChartContainer
                  config={{ bookings: bookingsChartConfig.bookings }}
                  className="rounded-xl border border-slate-200 bg-gradient-to-b from-white to-slate-50"
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

            <Card className="border-slate-200 bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-slate-900">Revenue this month</CardTitle>
                <CardDescription className="text-slate-600">
                  {monthLabel || 'Latest month'} daily revenue (ZAR).
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{ revenue: bookingsChartConfig.revenue }}
                  className="rounded-xl border border-slate-200 bg-gradient-to-b from-white to-slate-50"
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
          <Card className="border-slate-200 bg-white shadow-sm">
            <CardContent className="p-6 text-sm text-slate-600">
              {loadingBookings ? 'Loading analytics…' : 'No booking data available yet.'}
            </CardContent>
          </Card>
        )}
      </div>

      <Card className="border-slate-200 bg-white shadow-sm">
        <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-base">Top pages & time on page</CardTitle>
            <CardDescription className="text-slate-600">
              Page views grouped by path with average time spent.
            </CardDescription>
          </div>
          <div className="text-sm text-slate-700 sm:text-right">
            <div>
              {loadingPageViews
                ? 'Loading…'
                : publicSummary
                ? `${publicSummary.views.toLocaleString()} total views`
                : '—'}
            </div>
            <div className="text-xs text-slate-500">
              {publicSummary
                ? `${publicSummary.uniqueSessions.toLocaleString()} unique sessions • ${pageViews?.totalUniqueVisitors.toLocaleString() ?? '—'} unique visitors`
                : ''}
            </div>
          </div>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          {loadingPageViews ? (
            <div className="p-4 text-sm text-slate-600">Loading page analytics…</div>
          ) : topPages.length === 0 ? (
            <div className="p-4 text-sm text-slate-600">No page view data yet.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Page</TableHead>
                  <TableHead>Views</TableHead>
                  <TableHead>Sessions</TableHead>
                  <TableHead>Avg time on page</TableHead>
                  <TableHead className="text-right">Last seen</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topPages.map((p, idx) => (
                  <TableRow key={`${p.path || 'unknown'}-${idx}`}>
                    <TableCell className="font-medium">{p.path || '/'}</TableCell>
                    <TableCell>{p.views.toLocaleString()}</TableCell>
                    <TableCell>{p.uniqueSessions.toLocaleString()}</TableCell>
                    <TableCell>{formatDuration(p.avgDurationSeconds)}</TableCell>
                    <TableCell className="text-right text-slate-500">
                      {formatDateTime(p.lastSeen)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Card className="border-slate-200 bg-white shadow-sm">
        <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-base">Admin pages</CardTitle>
            <CardDescription className="text-slate-600">
              Internal routes separated from public traffic.
            </CardDescription>
          </div>
          <div className="text-sm text-slate-700 sm:text-right">
            <div>
              {loadingPageViews
                ? 'Loading…'
                : adminSummary
                ? `${adminSummary.views.toLocaleString()} total views`
                : '—'}
            </div>
            <div className="text-xs text-slate-500">
              {adminSummary ? `${adminSummary.uniqueSessions.toLocaleString()} unique sessions (admin)` : ''}
            </div>
          </div>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          {loadingPageViews ? (
            <div className="p-4 text-sm text-slate-600">Loading admin page analytics…</div>
          ) : adminPages.length === 0 ? (
            <div className="p-4 text-sm text-slate-600">No admin page view data yet.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Page</TableHead>
                  <TableHead>Views</TableHead>
                  <TableHead>Sessions</TableHead>
                  <TableHead>Avg time on page</TableHead>
                  <TableHead className="text-right">Last seen</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {adminPages.map((p, idx) => (
                  <TableRow key={`${p.path || 'admin'}-${idx}`}>
                    <TableCell className="font-medium">{p.path || '/admin'}</TableCell>
                    <TableCell>{p.views.toLocaleString()}</TableCell>
                    <TableCell>{p.uniqueSessions.toLocaleString()}</TableCell>
                    <TableCell>{formatDuration(p.avgDurationSeconds)}</TableCell>
                    <TableCell className="text-right text-slate-500">
                      {formatDateTime(p.lastSeen)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="border-slate-200 bg-white shadow-sm">
          <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-base">Demand by location</CardTitle>
              <CardDescription className="text-slate-600">
                Countries and cities where traffic originates.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Countries</p>
              <BreakdownList items={topCountries} emptyLabel={loadingPageViews ? 'Loading…' : 'No data yet'} />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Cities</p>
              <BreakdownList items={topCities} emptyLabel={loadingPageViews ? 'Loading…' : 'No data yet'} />
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white shadow-sm">
          <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-base">Tech split</CardTitle>
              <CardDescription className="text-slate-600">
                Device types, operating systems, and browsers.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-3">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Device</p>
              <BreakdownList items={topDevices} emptyLabel={loadingPageViews ? 'Loading…' : '—'} />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">OS</p>
              <BreakdownList items={topOS} emptyLabel={loadingPageViews ? 'Loading…' : '—'} />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Browser</p>
              <BreakdownList items={topBrowsers} emptyLabel={loadingPageViews ? 'Loading…' : '—'} />
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white shadow-sm">
          <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-base">Language & loyalty</CardTitle>
              <CardDescription className="text-slate-600">
                Preferred languages and new vs returning visitors.
              </CardDescription>
            </div>
            <div className="text-sm text-slate-700 sm:text-right">
              {returning ? (
                <>
                  <div>{returning.totalVisitors.toLocaleString()} total visitors</div>
                  <div className="text-xs text-slate-500">
                    {returning.returningVisitors.toLocaleString()} returning • {returning.newVisitors.toLocaleString()} new
                  </div>
                </>
              ) : (
                <div className="text-xs text-slate-500">
                  {loadingPageViews ? 'Loading…' : 'No visitor data'}
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Languages</p>
              <BreakdownList items={topLanguages} emptyLabel={loadingPageViews ? 'Loading…' : '—'} />
            </div>
            <div className="flex flex-col justify-center gap-1">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Returning ratio</p>
              {returning ? (
                <>
                  <div className="text-lg font-semibold text-slate-900">
                    {returning.returningVisitors + returning.newVisitors > 0
                      ? Math.round((returning.returningVisitors / Math.max(1, returning.returningVisitors + returning.newVisitors)) * 100)
                      : 0}
                    %
                  </div>
                  <p className="text-sm text-slate-600">
                    {returning.returningVisitors.toLocaleString()} returning vs {returning.newVisitors.toLocaleString()} new
                  </p>
                </>
              ) : (
                <p className="text-sm text-slate-600">{loadingPageViews ? 'Loading…' : '—'}</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white shadow-sm">
          <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-base">Active hours</CardTitle>
              <CardDescription className="text-slate-600">
                Hour-of-day activity to time promos.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            {timeOfDay.length === 0 ? (
              <p className="text-sm text-slate-600">{loadingPageViews ? 'Loading…' : 'No time-of-day data yet.'}</p>
            ) : (
              (() => {
                const maxViews = Math.max(1, ...timeOfDay.map((v) => v.views || 0))
                return (
              <div className="grid grid-cols-4 gap-2 text-xs text-slate-700 sm:grid-cols-6 md:grid-cols-8">
                {timeOfDay.map((t) => (
                  <div key={t.hour} className="flex flex-col gap-1 rounded-md border border-slate-200 bg-slate-50 p-2">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">{formatHour(t.hour)}</span>
                      <span className="text-[11px] text-slate-500">{t.views}</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-slate-200">
                      <div
                        className="h-full rounded-full bg-cyan-400/80"
                        style={{
                          width: `${Math.min(100, (t.views / maxViews) * 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
                )
              })()
            )}
          </CardContent>
        </Card>
      </div>

      {analytics && analytics.rides.length > 0 && (
        <Card className="border-slate-200 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Bookings by ride</CardTitle>
            <CardDescription className="text-slate-600">Sorted by volume</CardDescription>
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
                      {(r.revenueInCents / 100).toLocaleString('en-ZA')}
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

function takeTop(items?: CountStat[], limit = 5): CountStat[] {
  if (!items) return []
  return items.slice(0, limit)
}

function BreakdownList({ items, emptyLabel }: { items: CountStat[]; emptyLabel?: string }) {
  if (!items || items.length === 0) {
    return <p className="text-sm text-slate-600">{emptyLabel || 'No data'}</p>
  }
  return (
    <ul className="space-y-1 text-sm text-slate-700">
      {items.map((item) => (
        <li key={item.key} className="flex items-center justify-between rounded-md border border-slate-200 bg-slate-50 px-3 py-2">
          <span className="truncate">{item.key || 'Unknown'}</span>
          <span className="text-right font-semibold text-slate-900">{item.count.toLocaleString()}</span>
        </li>
      ))}
    </ul>
  )
}

function formatDuration(seconds?: number | null) {
  if (seconds == null || Number.isNaN(seconds)) return '—'
  if (seconds < 1) return '<1s'
  const mins = Math.floor(seconds / 60)
  const secs = Math.round(seconds % 60)
  if (mins === 0) return `${secs}s`
  return `${mins}m ${secs.toString().padStart(2, '0')}s`
}

function formatDateTime(value?: string | null) {
  if (!value) return '—'
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return '—'
  return d.toLocaleString('en-ZA', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function formatNumber(value: number) {
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}m`
  if (value >= 1000) return `${(value / 1000).toFixed(1)}k`
  return `${value}`
}

function summarizePages(items: PageViewAnalyticsItem[]) {
  return {
    views: items.reduce((sum, p) => sum + (p.views || 0), 0),
    uniqueSessions: items.reduce((sum, p) => sum + (p.uniqueSessions || 0), 0),
  }
}

function formatHour(hour: number) {
  const h = ((hour % 24) + 24) % 24
  const suffix = h >= 12 ? 'PM' : 'AM'
  const displayHour = h % 12 === 0 ? 12 : h % 12
  return `${displayHour}${suffix}`
}
