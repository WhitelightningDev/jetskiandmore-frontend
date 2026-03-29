import * as React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from 'recharts'
import { Eye, Receipt, Trophy } from 'lucide-react'

import { Button } from '@/components/ui/button'
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type {
  Booking,
  CountStat,
  TimeOfDayStat,
} from '@/admin/types'
import { useAdminContext } from '@/admin/context'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/admin/analytics')({
  component: AdminAnalyticsPage,
})

const bookingsChartConfig: ChartConfig = {
  bookings: {
    label: 'Bookings',
    color: '#a78bfa',
  },
  revenue: {
    label: 'Revenue (ZAR)',
    color: '#7c3aed',
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
  } = React.useMemo(() => {
    const items = pageViews?.items || []
    const publicPages = items.filter((p) => !String(p.path || '').startsWith('/admin'))
    const adminPages = items.filter((p) => String(p.path || '').startsWith('/admin'))
    return {
      publicPages,
      adminPages,
    }
  }, [pageViews])
  const topPages = React.useMemo(() => publicPages.slice(0, 8), [publicPages])
  const topAdminPages = React.useMemo(() => adminPages.slice(0, 8), [adminPages])
  const breakdown = pageViews?.breakdowns
  const topCountries = React.useMemo(() => takeTop(breakdown?.countries), [breakdown])
  const topCities = React.useMemo(() => takeTop(breakdown?.cities), [breakdown])
  const topDevices = React.useMemo(() => takeTop(breakdown?.deviceTypes), [breakdown])
  const topOS = React.useMemo(() => takeTop(breakdown?.os), [breakdown])
  const topBrowsers = React.useMemo(() => takeTop(breakdown?.browsers), [breakdown])
  const topLanguages = React.useMemo(() => takeTop(breakdown?.languages), [breakdown])
  const timeOfDay: TimeOfDayStat[] = breakdown?.timeOfDay || []
  const returning = breakdown?.returning
  const allRevenueZar = analytics?.totalRevenueZar ?? bookings.reduce((acc, b) => acc + (b.amountInCents || 0) / 100, 0)
  const totalBookings = analytics?.totalBookings ?? bookings.length
  const pageViewsTotal = pageViews?.totalViews ?? analytics?.totalPageViews ?? 0
  const uniqueSessions = pageViews?.totalUniqueSessions ?? 0
  const uniqueVisitors = pageViews?.totalUniqueVisitors ?? 0

  const customerSummary = React.useMemo(() => {
    const byEmail = new Map<string, { email: string; name: string; bookings: number; revenueZar: number; last: Date | null }>()
    for (const b of bookings) {
      const email = String(b.email || '').trim().toLowerCase()
      if (!email) continue
      const name = String(b.fullName || '').trim() || email
      const entry = byEmail.get(email) || { email, name, bookings: 0, revenueZar: 0, last: null }
      entry.bookings += 1
      entry.revenueZar += (b.amountInCents || 0) / 100
      const dtRaw = b.createdAt || b.date
      const dt = dtRaw ? new Date(dtRaw) : null
      if (dt && !Number.isNaN(dt.getTime())) {
        if (!entry.last || dt > entry.last) entry.last = dt
      }
      byEmail.set(email, entry)
    }
    const customers = Array.from(byEmail.values()).sort((a, b) => (b.revenueZar - a.revenueZar) || (b.bookings - a.bookings))
    const repeatCustomers = customers.filter((c) => c.bookings > 1).length
    return {
      uniqueCustomers: customers.length,
      repeatCustomers,
      customersTop: customers.slice(0, 8),
    }
  }, [bookings])

  const addonSummary = React.useMemo(() => {
    const counts = {
      gopro: 0,
      drone: 0,
      wetsuit: 0,
      boat: 0,
      extraPeople: 0,
    }
    let total = 0
    for (const b of bookings) {
      const addons = (b as any).addons || {}
      if (!addons || typeof addons !== 'object') continue
      total += 1
      if (addons.gopro) counts.gopro += 1
      if (addons.drone) counts.drone += 1
      if (addons.wetsuit) counts.wetsuit += 1
      if (addons.boat) counts.boat += 1
      const extra = Number(addons.extraPeople || 0)
      if (!Number.isNaN(extra) && extra > 0) counts.extraPeople += 1
    }
    return { total: Math.max(1, total), counts }
  }, [bookings])

  const marketingSnapshot = React.useMemo(() => {
    const topCity = topCities[0]?.key || '—'
    const topCountry = topCountries[0]?.key || '—'
    const topDevice = topDevices[0]?.key || '—'
    const peakHour = timeOfDay.reduce((best, cur) => (cur.views > (best?.views ?? -1) ? cur : best), null as any as TimeOfDayStat | null)
    const peakHourLabel = peakHour ? `${formatHour(peakHour.hour)} (${peakHour.views})` : '—'

    const mostEngaged = [...publicPages]
      .filter((p) => (p.views || 0) >= 10 && (p.avgDurationSeconds || 0) > 0)
      .sort((a, b) => (b.avgDurationSeconds || 0) - (a.avgDurationSeconds || 0))[0]

    const bookingTrafficSessions = [...publicPages]
      .filter((p) => /bookings/i.test(p.path || '') || /boat-ride/i.test(p.path || '') || /fishing/i.test(p.path || ''))
      .reduce((sum, p) => sum + (p.uniqueSessions || 0), 0)

    const estimatedConversion = bookingTrafficSessions > 0 ? (totalBookings / bookingTrafficSessions) * 100 : null

    return {
      topCity,
      topCountry,
      topDevice,
      peakHourLabel,
      topLandingPage: publicPages[0]?.path || '—',
      topLandingViews: publicPages[0]?.views || 0,
      mostEngagedPage: mostEngaged?.path || '—',
      mostEngagedTime: mostEngaged ? formatDuration(mostEngaged.avgDurationSeconds) : '—',
      estimatedConversion,
    }
  }, [publicPages, timeOfDay, topCities, topCountries, topDevices, totalBookings])

  async function copyMarketingSummary() {
    try {
      const lines = [
        'Jet Ski & More — marketing snapshot',
        `Revenue: ZAR ${allRevenueZar.toFixed(0)} (${totalBookings} bookings, AOV ~ ZAR ${totalBookings ? (allRevenueZar / totalBookings).toFixed(0) : '0'})`,
        `Audience: ${customerSummary.uniqueCustomers} unique customers (${customerSummary.repeatCustomers} repeat)`,
        `Top demand: ${marketingSnapshot.topCity}, ${marketingSnapshot.topCountry}`,
        `Top device: ${marketingSnapshot.topDevice}`,
        `Peak browsing hour: ${marketingSnapshot.peakHourLabel}`,
        `Top landing page: ${marketingSnapshot.topLandingPage} (${marketingSnapshot.topLandingViews} views)`,
        `Most engaged page: ${marketingSnapshot.mostEngagedPage} (${marketingSnapshot.mostEngagedTime} avg)`,
        marketingSnapshot.estimatedConversion == null
          ? 'Estimated conversion: —'
          : `Estimated conversion: ${marketingSnapshot.estimatedConversion.toFixed(1)}% (bookings / booking-intent sessions)`,
        `Add-ons: GoPro ${Math.round((addonSummary.counts.gopro / addonSummary.total) * 100)}% • Wetsuit ${Math.round((addonSummary.counts.wetsuit / addonSummary.total) * 100)}% • Drone ${Math.round((addonSummary.counts.drone / addonSummary.total) * 100)}%`,
      ]
      await navigator.clipboard.writeText(lines.join('\n'))
    } catch {
      // ignore
    }
  }

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Analytics</h1>
        <p className="text-sm text-slate-600">Bookings, revenue, and page-view breakdowns.</p>
      </header>

      <section className="grid gap-4 md:grid-cols-4">
        <MetricCard
          highlighted
          icon={<Receipt className="h-4 w-4 text-slate-700" />}
          label="All revenue"
          value={loadingMeta ? '—' : `ZAR ${allRevenueZar.toFixed(0)}`}
          sub={
            loadingBookings
              ? 'Loading bookings…'
              : `${totalBookings.toLocaleString()} bookings • AOV ZAR ${totalBookings ? (allRevenueZar / totalBookings).toFixed(0) : '0'}`
          }
        />
        <MetricCard
          icon={<Trophy className="h-4 w-4 text-slate-700" />}
          label="Customers"
          value={loadingBookings ? '—' : customerSummary.uniqueCustomers.toLocaleString()}
          sub={loadingBookings ? 'Loading customers…' : `${customerSummary.repeatCustomers.toLocaleString()} repeat customers`}
        />
        <MetricCard
          icon={<Eye className="h-4 w-4 text-slate-700" />}
          label="Page views"
          value={loadingPageViews ? '—' : pageViewsTotal.toLocaleString()}
          sub={loadingPageViews ? 'Loading sessions…' : `${uniqueSessions.toLocaleString()} sessions • ${uniqueVisitors.toLocaleString()} visitors`}
        />
        <MetricCard
          icon={<Eye className="h-4 w-4 text-slate-700" />}
          label="Top landing page"
          value={loadingPageViews ? '—' : marketingSnapshot.topLandingPage}
          sub={loadingPageViews ? 'Loading…' : `${(marketingSnapshot.topLandingViews || 0).toLocaleString()} views`}
        />
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <Card className="border-slate-200 bg-white shadow-sm">
          <CardHeader className="flex flex-row items-start justify-between gap-3">
            <div>
              <CardTitle className="text-base text-slate-900">Marketing snapshot</CardTitle>
              <CardDescription className="text-slate-600">Copy-ready stats for posts, partners, and ads.</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={copyMarketingSummary} className="shrink-0">
              Copy summary
            </Button>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-slate-700">
            <div className="flex items-center justify-between gap-3">
              <span className="text-slate-600">Top demand</span>
              <span className="font-semibold text-slate-900">{marketingSnapshot.topCity}, {marketingSnapshot.topCountry}</span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-slate-600">Peak browsing hour</span>
              <span className="font-semibold text-slate-900">{marketingSnapshot.peakHourLabel}</span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-slate-600">Most engaged page</span>
              <span className="font-semibold text-slate-900">{marketingSnapshot.mostEngagedPage}</span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-slate-600">Est. conversion</span>
              <span className="font-semibold text-slate-900">
                {marketingSnapshot.estimatedConversion == null ? '—' : `${marketingSnapshot.estimatedConversion.toFixed(1)}%`}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-base text-slate-900">Add-on popularity</CardTitle>
            <CardDescription className="text-slate-600">What customers choose most (for bundles and upsells).</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3 text-sm text-slate-700">
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">GoPro</p>
              <p className="text-lg font-semibold text-slate-900">{Math.round((addonSummary.counts.gopro / addonSummary.total) * 100)}%</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Wetsuit</p>
              <p className="text-lg font-semibold text-slate-900">{Math.round((addonSummary.counts.wetsuit / addonSummary.total) * 100)}%</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Drone</p>
              <p className="text-lg font-semibold text-slate-900">{Math.round((addonSummary.counts.drone / addonSummary.total) * 100)}%</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Boat</p>
              <p className="text-lg font-semibold text-slate-900">{Math.round((addonSummary.counts.boat / addonSummary.total) * 100)}%</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-base text-slate-900">Top customers</CardTitle>
            <CardDescription className="text-slate-600">High-value customers for testimonials and referrals.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {customerSummary.customersTop.length === 0 ? (
              <p className="text-slate-600">{loadingBookings ? 'Loading customers…' : 'No customer data yet.'}</p>
            ) : (
              customerSummary.customersTop.map((c) => (
                <div key={c.email} className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                  <div className="min-w-0">
                    <p className="truncate font-medium text-slate-900">{c.name}</p>
                    <p className="truncate text-xs text-slate-500">{c.email}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-slate-900">Z{Math.round(c.revenueZar).toLocaleString('en-ZA')}</p>
                    <p className="text-xs text-slate-500">{c.bookings} booking{c.bookings === 1 ? '' : 's'}</p>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </section>

      {dailyData.length > 0 ? (
        <section className="grid gap-4 lg:grid-cols-2">
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
        </section>
      ) : (
        <Card className="border-slate-200 bg-white shadow-sm">
          <CardContent className="p-6 text-sm text-slate-600">
            {loadingBookings ? 'Loading analytics…' : 'No booking data available yet.'}
          </CardContent>
        </Card>
      )}

      <Card className="border-slate-200 bg-white shadow-sm">
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-base">Top pages</CardTitle>
            <CardDescription className="text-slate-600">Views, sessions, and engagement (public + admin).</CardDescription>
          </div>
          <div className="text-sm text-slate-700 sm:text-right">
            <div>{loadingPageViews ? 'Loading…' : `${pageViewsTotal.toLocaleString()} total views`}</div>
            <div className="text-xs text-slate-500">
              {loadingPageViews ? '' : `${uniqueSessions.toLocaleString()} sessions • ${uniqueVisitors.toLocaleString()} visitors`}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="public">
            <TabsList className="mb-3">
              <TabsTrigger value="public">Public</TabsTrigger>
              <TabsTrigger value="admin">Admin</TabsTrigger>
            </TabsList>
            <TabsContent value="public">
              <div className="overflow-x-auto">
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
                        <TableHead>Avg time</TableHead>
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
                          <TableCell className="text-right text-slate-500">{formatDateTime(p.lastSeen)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </div>
            </TabsContent>
            <TabsContent value="admin">
              <div className="overflow-x-auto">
                {loadingPageViews ? (
                  <div className="p-4 text-sm text-slate-600">Loading admin page analytics…</div>
                ) : topAdminPages.length === 0 ? (
                  <div className="p-4 text-sm text-slate-600">No admin page view data yet.</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Page</TableHead>
                        <TableHead>Views</TableHead>
                        <TableHead>Sessions</TableHead>
                        <TableHead>Avg time</TableHead>
                        <TableHead className="text-right">Last seen</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {topAdminPages.map((p, idx) => (
                        <TableRow key={`${p.path || 'admin'}-${idx}`}>
                          <TableCell className="font-medium">{p.path || '/admin'}</TableCell>
                          <TableCell>{p.views.toLocaleString()}</TableCell>
                          <TableCell>{p.uniqueSessions.toLocaleString()}</TableCell>
                          <TableCell>{formatDuration(p.avgDurationSeconds)}</TableCell>
                          <TableCell className="text-right text-slate-500">{formatDateTime(p.lastSeen)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </div>
            </TabsContent>
          </Tabs>
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

function MetricCard({
  icon,
  label,
  value,
  sub,
  highlighted,
}: {
  icon: React.ReactNode
  label: string
  value: React.ReactNode
  sub?: string
  highlighted?: boolean
}) {
  return (
    <Card className={cn('border-slate-200 bg-white shadow-sm', highlighted ? 'ring-1 ring-violet-500/60' : undefined)}>
      <CardHeader className="flex flex-row items-start justify-between gap-3 pb-2">
        <div className="space-y-1">
          <CardDescription className="text-slate-600">{label}</CardDescription>
          <CardTitle className={cn('tracking-tight text-slate-900', typeof value === 'string' && value.length > 12 ? 'text-lg' : 'text-2xl')}>
            {value}
          </CardTitle>
        </div>
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white">
          {icon}
        </span>
      </CardHeader>
      {sub ? <CardContent className="pt-0 text-xs text-slate-500">{sub}</CardContent> : <CardContent className="pt-0" />}
    </Card>
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

function formatHour(hour: number) {
  const h = ((hour % 24) + 24) % 24
  const suffix = h >= 12 ? 'PM' : 'AM'
  const displayHour = h % 12 === 0 ? 12 : h % 12
  return `${displayHour}${suffix}`
}
