import * as React from 'react'
import { Link, createFileRoute } from '@tanstack/react-router'
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  CalendarCheck2,
  CircleDollarSign,
  ClipboardCheck,
  Clock3,
  Eye,
  Gauge,
  Receipt,
  Search,
  Users,
} from 'lucide-react'
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts'

import type { Booking, MonthlyBookingStat } from '@/admin/types'
import type {ChartConfig} from '@/components/ui/chart';
import { useAdminContext } from '@/admin/context'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {  ChartContainer, ChartTooltipContent } from '@/components/ui/chart'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/admin/overview')({
  component: AdminOverviewPage,
})

type TrendRange = '3m' | '6m' | '12m'

const dashboardChartConfig: ChartConfig = {
  revenue: { label: 'Revenue', color: '#0f766e' },
  bookings: { label: 'Bookings', color: '#2563eb' },
}

const paidStatuses = new Set(['approved', 'paid', 'captured'])

function AdminOverviewPage() {
  const { analytics, pageViews, bookings, error, loadingBookings, loadingMeta } = useAdminContext()
  const [range, setRange] = React.useState<TrendRange>('12m')
  const [customerSearch, setCustomerSearch] = React.useState('')

  const statusMap = React.useMemo(
    () =>
      new Map(
        (analytics?.statusCounts ?? []).map((item) => [
          item.status.toLowerCase(),
          item.bookings,
        ]),
      ),
    [analytics?.statusCounts],
  )

  const paidBookings = React.useMemo(
    () => Array.from(paidStatuses).reduce((total, status) => total + (statusMap.get(status) ?? 0), 0),
    [statusMap],
  )
  const pendingBookings = (statusMap.get('pending') ?? 0) + (statusMap.get('processing') ?? 0)
  const unsuccessfulBookings = (statusMap.get('failed') ?? 0) + (statusMap.get('cancelled') ?? 0)
  const unsignedIndemnities = Math.max(
    0,
    (analytics?.indemnitiesRequired ?? 0) - (analytics?.indemnitiesSigned ?? 0),
  )

  const monthlySeries = React.useMemo(
    () => buildMonthlySeries(analytics?.monthly ?? [], range),
    [analytics?.monthly, range],
  )

  const monthRevenueDelta = percentageDelta(
    analytics?.revenueThisMonthInCents ?? 0,
    analytics?.revenuePreviousMonthInCents ?? 0,
  )
  const monthBookingDelta = percentageDelta(
    analytics?.bookingsThisMonth ?? 0,
    analytics?.bookingsPreviousMonth ?? 0,
  )

  const bookingIntentSessions = React.useMemo(
    () =>
      (pageViews?.items ?? [])
        .filter((item) => item.path.toLowerCase().replace(/\/$/, '') === '/bookings')
        .reduce((total, item) => total + item.uniqueSessions, 0),
    [pageViews?.items],
  )
  const bookingConversion =
    bookingIntentSessions > 0 ? (paidBookings / bookingIntentSessions) * 100 : 0
  const returnVisitorRate = React.useMemo(() => {
    const returning = pageViews?.breakdowns.returning
    if (!returning?.totalVisitors) return 0
    return (returning.returningVisitors / returning.totalVisitors) * 100
  }, [pageViews?.breakdowns.returning])
  const safetyCompletion =
    (analytics?.indemnitiesRequired ?? 0) > 0
      ? ((analytics?.indemnitiesSigned ?? 0) / (analytics?.indemnitiesRequired ?? 1)) * 100
      : 0

  const recentRows = React.useMemo(() => {
    const sorted = [...bookings].sort((a, b) => {
      const at = parseBookingTimestamp(a)?.getTime() ?? 0
      const bt = parseBookingTimestamp(b)?.getTime() ?? 0
      return bt - at
    })
    const query = customerSearch.trim().toLowerCase()
    const filtered = query
      ? sorted.filter(
          (booking) =>
            (booking.fullName || '').toLowerCase().includes(query) ||
            (booking.email || '').toLowerCase().includes(query) ||
            (booking.bookingReference || '').toLowerCase().includes(query),
        )
      : sorted
    return filtered.slice(0, 8)
  }, [bookings, customerSearch])

  const topRides = React.useMemo(
    () => [...(analytics?.rides ?? [])].sort((a, b) => b.revenueInCents - a.revenueInCents).slice(0, 5),
    [analytics?.rides],
  )
  const topRideRevenue = topRides[0]?.revenueInCents ?? 0

  return (
    <div className="space-y-7 pb-8">
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-950 text-white shadow-sm">
        <div className="relative px-5 py-6 sm:px-7">
          <div className="absolute inset-y-0 right-0 hidden w-1/2 bg-[radial-gradient(circle_at_80%_20%,rgba(34,211,238,0.2),transparent_55%)] lg:block" />
          <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300">
                <Activity className="h-4 w-4" />
                Command center
              </div>
              <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Operations overview</h1>
              <p className="mt-2 max-w-xl text-sm leading-6 text-slate-300">
                Revenue, demand, customer movement, safety readiness, and the work that needs attention.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge
                className={cn(
                  'border',
                  error
                    ? 'border-amber-400/30 bg-amber-400/10 text-amber-200'
                    : 'border-emerald-400/30 bg-emerald-400/10 text-emerald-200',
                )}
              >
                <span
                  className={cn(
                    'mr-2 h-1.5 w-1.5 rounded-full',
                    error ? 'bg-amber-300' : 'bg-emerald-300',
                  )}
                />
                {error ? 'Data needs attention' : loadingMeta ? 'Syncing live data' : 'Live production data'}
              </Badge>
              <Link
                to="/admin/bookings"
                className={cn(buttonVariants({ size: 'sm' }), 'bg-white text-slate-950 hover:bg-slate-100')}
              >
                Manage bookings
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          icon={<CircleDollarSign className="h-5 w-5" />}
          label="Captured revenue"
          value={loadingMeta ? '—' : formatZar(analytics?.totalRevenueZar ?? 0)}
          detail={`${formatZar((analytics?.revenueThisMonthInCents ?? 0) / 100)} this month`}
          delta={formatDelta(monthRevenueDelta)}
          tone="teal"
        />
        <MetricCard
          icon={<Receipt className="h-5 w-5" />}
          label="Paid bookings"
          value={loadingMeta ? '—' : paidBookings.toLocaleString()}
          detail={`${analytics?.bookingsThisMonth ?? 0} created this month`}
          delta={formatDelta(monthBookingDelta)}
          tone="blue"
        />
        <MetricCard
          icon={<Gauge className="h-5 w-5" />}
          label="Average booking value"
          value={
            loadingMeta
              ? '—'
              : formatZar((analytics?.averageBookingValueInCents ?? 0) / 100)
          }
          detail={`${analytics?.jetSkisBooked ?? 0} jet skis booked`}
          tone="violet"
        />
        <MetricCard
          icon={<ArrowUpRight className="h-5 w-5" />}
          label="Booking-page conversion"
          value={loadingMeta ? '—' : formatPercent(bookingConversion)}
          detail={`${bookingIntentSessions.toLocaleString()} booking-page sessions`}
          tone="amber"
        />
        <MetricCard
          icon={<Users className="h-5 w-5" />}
          label="Unique customers"
          value={loadingMeta ? '—' : (analytics?.uniqueCustomers ?? 0).toLocaleString()}
          detail={`${analytics?.repeatCustomers ?? 0} repeat customers`}
          tone="slate"
        />
        <MetricCard
          icon={<Eye className="h-5 w-5" />}
          label="Site traffic"
          value={loadingMeta ? '—' : (pageViews?.totalViews ?? analytics?.totalPageViews ?? 0).toLocaleString()}
          detail={`${pageViews?.totalUniqueVisitors ?? 0} visitors · ${formatPercent(returnVisitorRate)} returning`}
          tone="slate"
        />
        <MetricCard
          icon={<CalendarCheck2 className="h-5 w-5" />}
          label="Upcoming bookings"
          value={loadingMeta ? '—' : (analytics?.upcomingBookings ?? 0).toLocaleString()}
          detail={`${pendingBookings} awaiting payment or review`}
          tone="blue"
        />
        <MetricCard
          icon={<ClipboardCheck className="h-5 w-5" />}
          label="Safety completion"
          value={loadingMeta ? '—' : formatPercent(safetyCompletion)}
          detail={`${analytics?.indemnitiesSigned ?? 0}/${analytics?.indemnitiesRequired ?? 0} indemnities signed`}
          tone={unsignedIndemnities > 0 ? 'amber' : 'teal'}
        />
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.65fr)_minmax(300px,0.75fr)]">
        <Card className="border-slate-200 bg-white shadow-sm">
          <CardHeader className="flex flex-col gap-4 border-b border-slate-100 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <CardDescription>Revenue performance</CardDescription>
              <CardTitle className="mt-1 text-xl text-slate-950">
                {formatZar(monthlySeries.reduce((total, month) => total + month.revenue, 0))}
              </CardTitle>
              <p className="mt-1 text-xs text-slate-500">Captured revenue across the selected period</p>
            </div>
            <TrendRangePills value={range} onChange={setRange} />
          </CardHeader>
          <CardContent className="pt-5">
            <ChartContainer config={dashboardChartConfig} className="h-[330px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={monthlySeries} margin={{ left: 4, right: 4, top: 8, bottom: 4 }}>
                  <CartesianGrid vertical={false} stroke="#e2e8f0" strokeDasharray="3 3" />
                  <XAxis
                    dataKey="label"
                    axisLine={false}
                    tickLine={false}
                    tickMargin={10}
                    tick={{ fill: '#64748b', fontSize: 12 }}
                  />
                  <YAxis
                    yAxisId="revenue"
                    axisLine={false}
                    tickLine={false}
                    width={64}
                    tickFormatter={(value) => `R${formatCompact(Number(value))}`}
                    tick={{ fill: '#64748b', fontSize: 12 }}
                  />
                  <YAxis yAxisId="bookings" orientation="right" hide />
                  <RechartsTooltip
                    cursor={{ fill: '#f8fafc' }}
                    content={
                      <ChartTooltipContent
                        indicator="line"
                        valueFormatter={(value, name) =>
                          name === 'Revenue'
                            ? formatZar(Number(value || 0))
                            : `${Number(value || 0).toLocaleString()} bookings`
                        }
                      />
                    }
                  />
                  <Bar
                    yAxisId="revenue"
                    name="Revenue"
                    dataKey="revenue"
                    fill="var(--color-revenue)"
                    radius={[5, 5, 0, 0]}
                    maxBarSize={34}
                  />
                  <Line
                    yAxisId="bookings"
                    name="Bookings"
                    type="monotone"
                    dataKey="bookings"
                    stroke="var(--color-bookings)"
                    strokeWidth={2.5}
                    dot={{ r: 3, fill: '#fff', strokeWidth: 2 }}
                    activeDot={{ r: 5 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white shadow-sm">
          <CardHeader className="border-b border-slate-100">
            <CardDescription>Customer funnel</CardDescription>
            <CardTitle className="mt-1 text-lg text-slate-950">Demand to booking</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5 pt-5">
            <FunnelStep
              label="Unique visitors"
              value={pageViews?.totalUniqueVisitors ?? 0}
              percent={100}
              color="bg-slate-900"
            />
            <FunnelStep
              label="Booking-page sessions"
              value={bookingIntentSessions}
              percent={ratio(bookingIntentSessions, pageViews?.totalUniqueVisitors ?? 0)}
              color="bg-cyan-600"
            />
            <FunnelStep
              label="Paid bookings"
              value={paidBookings}
              percent={ratio(paidBookings, bookingIntentSessions)}
              color="bg-blue-600"
            />
            <Separator />
            <div className="grid grid-cols-2 gap-3">
              <MiniStat label="Repeat rate" value={formatPercent(ratio(analytics?.repeatCustomers ?? 0, analytics?.uniqueCustomers ?? 0))} />
              <MiniStat label="Booking CVR" value={formatPercent(bookingConversion)} />
            </div>
            <p className="text-xs leading-5 text-slate-500">
              Conversion uses captured bookings divided by unique sessions on the booking page.
            </p>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <Card className="border-slate-200 bg-white shadow-sm">
          <CardHeader>
            <CardDescription>Operations</CardDescription>
            <CardTitle className="text-base text-slate-950">Attention queue</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <AttentionRow
              icon={<Clock3 className="h-4 w-4" />}
              label="Pending bookings"
              value={pendingBookings}
              href="/admin/bookings"
              urgent={pendingBookings > 0}
            />
            <AttentionRow
              icon={<ClipboardCheck className="h-4 w-4" />}
              label="Unsigned indemnities"
              value={unsignedIndemnities}
              href="/admin/bookings"
              urgent={unsignedIndemnities > 0}
            />
            <AttentionRow
              icon={<CalendarCheck2 className="h-4 w-4" />}
              label="Upcoming experiences"
              value={analytics?.upcomingBookings ?? 0}
              href="/admin/calendar"
            />
            <AttentionRow
              icon={<Receipt className="h-4 w-4" />}
              label="Failed or cancelled"
              value={unsuccessfulBookings}
              href="/admin/bookings"
              urgent={unsuccessfulBookings > 0}
            />
            <Separator />
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500">Refunded value</span>
              <span className="font-semibold text-slate-900">
                {formatZar((analytics?.refundedAmountInCents ?? 0) / 100)}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white shadow-sm">
          <CardHeader>
            <CardDescription>Product mix</CardDescription>
            <CardTitle className="text-base text-slate-950">Top experiences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {topRides.length ? (
              topRides.map((ride) => (
                <div key={ride.rideId} className="space-y-2">
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <div className="min-w-0">
                      <p className="truncate font-medium text-slate-900">{rideLabel(ride.rideId)}</p>
                      <p className="text-xs text-slate-500">{ride.bookings} bookings</p>
                    </div>
                    <span className="font-semibold text-slate-900">
                      {formatZar(ride.revenueInCents / 100)}
                    </span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-cyan-600"
                      style={{ width: `${Math.max(5, ratio(ride.revenueInCents, topRideRevenue))}%` }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <EmptyState label="No experience data yet." />
            )}
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white shadow-sm">
          <CardHeader>
            <CardDescription>Traffic</CardDescription>
            <CardTitle className="text-base text-slate-950">Top pages</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {(pageViews?.items ?? []).slice(0, 5).map((page, index) => (
              <div
                key={page.path || `page-${index}`}
                className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50/70 px-3 py-2.5"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-slate-900">{page.path || '/'}</p>
                  <p className="text-xs text-slate-500">{page.uniqueSessions.toLocaleString()} sessions</p>
                </div>
                <Badge variant="outline" className="bg-white text-slate-700">
                  {page.views.toLocaleString()}
                </Badge>
              </div>
            ))}
            {!pageViews?.items.length ? <EmptyState label="No traffic data yet." /> : null}
          </CardContent>
        </Card>
      </section>

      <section className="space-y-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-950">Recent customers</h2>
            <p className="mt-1 text-sm text-slate-500">Latest booking activity and payment state.</p>
          </div>
          <div className="flex w-full items-center gap-2 sm:w-auto">
            <div className="relative flex-1 sm:w-[300px]">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" aria-hidden />
              <Input
                value={customerSearch}
                onChange={(event) => setCustomerSearch(event.target.value)}
                placeholder="Search customer or reference"
                className="h-9 bg-white pl-9"
              />
            </div>
            <Link to="/admin/bookings" className={buttonVariants({ variant: 'outline', size: 'sm' })}>
              View all
            </Link>
          </div>
        </div>

        <Card className="overflow-hidden border-slate-200 bg-white shadow-sm">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/80">
                  <TableHead>Customer</TableHead>
                  <TableHead className="hidden md:table-cell">Experience</TableHead>
                  <TableHead className="hidden lg:table-cell">Ride date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Value</TableHead>
                  <TableHead className="w-20" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentRows.length ? (
                  recentRows.map((booking) => {
                    return (
                      <TableRow key={booking.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9 border border-slate-200">
                              <AvatarFallback className="bg-slate-100 text-xs text-slate-700">
                                {initialsFromName(booking.fullName)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0">
                              <p className="truncate font-medium text-slate-900">{booking.fullName || 'Customer'}</p>
                              <p className="truncate text-xs text-slate-500">
                                {booking.bookingReference || booking.email}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-slate-600">
                          {rideLabel(booking.rideId)}
                        </TableCell>
                        <TableCell className="hidden lg:table-cell text-slate-600">
                          {formatRideDate(booking.date)}
                        </TableCell>
                        <TableCell>{statusBadge(booking.status)}</TableCell>
                        <TableCell className="text-right font-semibold text-slate-900">
                          {formatZar((booking.amountInCents || 0) / 100)}
                        </TableCell>
                        <TableCell>
                          <Link
                            to="/admin/bookings"
                            className={cn(buttonVariants({ variant: 'ghost', size: 'icon-sm' }), 'h-8 w-8')}
                            aria-label={`Open booking for ${booking.fullName || 'customer'}`}
                          >
                            <ArrowRight className="h-4 w-4" />
                          </Link>
                        </TableCell>
                      </TableRow>
                    )
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="py-12 text-center text-sm text-slate-500">
                      {loadingBookings ? 'Loading booking activity…' : 'No booking activity found.'}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
          <Separator />
          <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 text-xs text-slate-500">
            <span>{bookings.length.toLocaleString()} recent records loaded</span>
            <span>Full totals are calculated by the analytics service</span>
          </div>
        </Card>
      </section>
    </div>
  )
}

function MetricCard({
  icon,
  label,
  value,
  detail,
  delta,
  tone,
}: {
  icon: React.ReactNode
  label: string
  value: React.ReactNode
  detail: string
  delta?: string | null
  tone: 'teal' | 'blue' | 'violet' | 'amber' | 'slate'
}) {
  const toneClass = {
    teal: 'bg-teal-50 text-teal-700 ring-teal-100',
    blue: 'bg-blue-50 text-blue-700 ring-blue-100',
    violet: 'bg-violet-50 text-violet-700 ring-violet-100',
    amber: 'bg-amber-50 text-amber-700 ring-amber-100',
    slate: 'bg-slate-100 text-slate-700 ring-slate-200',
  }[tone]

  return (
    <Card className="border-slate-200 bg-white shadow-sm">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">{label}</p>
            <p className="mt-2 truncate text-2xl font-semibold tracking-tight text-slate-950">{value}</p>
          </div>
          <span className={cn('inline-flex h-10 w-10 flex-none items-center justify-center rounded-xl ring-1', toneClass)}>
            {icon}
          </span>
        </div>
        <div className="mt-4 flex items-center justify-between gap-2 text-xs">
          <span className="truncate text-slate-500">{detail}</span>
          {delta ? (
            <span
              className={cn(
                'flex-none rounded-full px-2 py-1 font-semibold',
                delta.startsWith('-') ? 'bg-rose-50 text-rose-700' : 'bg-emerald-50 text-emerald-700',
              )}
            >
              {delta}
            </span>
          ) : null}
        </div>
      </CardContent>
    </Card>
  )
}

function TrendRangePills({
  value,
  onChange,
}: {
  value: TrendRange
  onChange: (value: TrendRange) => void
}) {
  const options: Array<{ value: TrendRange; label: string }> = [
    { value: '3m', label: '3M' },
    { value: '6m', label: '6M' },
    { value: '12m', label: '12M' },
  ]
  return (
    <div className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-1">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={cn(
            'rounded-md px-3 py-1.5 text-xs font-semibold transition',
            value === option.value
              ? 'bg-white text-slate-950 shadow-sm'
              : 'text-slate-500 hover:text-slate-900',
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}

function FunnelStep({
  label,
  value,
  percent,
  color,
}: {
  label: string
  value: number
  percent: number
  color: string
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3 text-sm">
        <span className="text-slate-600">{label}</span>
        <span className="font-semibold text-slate-950">{value.toLocaleString()}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          className={cn('h-full rounded-full', color)}
          style={{ width: `${Math.max(value > 0 ? 3 : 0, Math.min(100, percent))}%` }}
        />
      </div>
    </div>
  )
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 text-lg font-semibold text-slate-950">{value}</p>
    </div>
  )
}

function AttentionRow({
  icon,
  label,
  value,
  href,
  urgent = false,
}: {
  icon: React.ReactNode
  label: string
  value: number
  href: '/admin/bookings' | '/admin/calendar'
  urgent?: boolean
}) {
  return (
    <Link
      to={href}
      className="group flex items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50/70 px-3 py-3 transition hover:border-slate-200 hover:bg-slate-50"
    >
      <span className="flex items-center gap-2 text-sm text-slate-700">
        <span className={cn('text-slate-500', urgent ? 'text-amber-600' : undefined)}>{icon}</span>
        {label}
      </span>
      <span className="flex items-center gap-2">
        <Badge
          className={cn(
            urgent
              ? 'border border-amber-200 bg-amber-50 text-amber-700'
              : 'border border-slate-200 bg-white text-slate-700',
          )}
        >
          {value}
        </Badge>
        <ArrowRight className="h-4 w-4 text-slate-400 transition group-hover:translate-x-0.5" />
      </span>
    </Link>
  )
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="flex min-h-28 items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 text-sm text-slate-500">
      {label}
    </div>
  )
}

function buildMonthlySeries(monthly: Array<MonthlyBookingStat>, range: TrendRange) {
  const count = range === '3m' ? 3 : range === '6m' ? 6 : 12
  return monthly.slice(-count).map((item) => ({
    month: item.month,
    label: monthLabel(item.month),
    bookings: item.bookings,
    revenue: item.revenueInCents / 100,
  }))
}

function monthLabel(month: string) {
  const parsed = new Date(`${month}-01T00:00:00Z`)
  if (Number.isNaN(parsed.getTime())) return month
  return parsed.toLocaleDateString('en-ZA', { month: 'short' })
}

function percentageDelta(current: number, previous: number): number | null {
  if (previous <= 0) return current > 0 ? 1 : null
  return (current - previous) / previous
}

function formatDelta(delta: number | null): string | null {
  if (delta === null) return null
  const value = delta * 100
  return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`
}

function ratio(value: number, total: number) {
  if (total <= 0) return 0
  return (value / total) * 100
}

function parseBookingTimestamp(booking: Booking): Date | null {
  const created = booking.createdAt ? new Date(booking.createdAt) : null
  if (created && !Number.isNaN(created.getTime())) return created
  if (!booking.date) return null
  const combined = booking.time ? `${booking.date}T${String(booking.time).trim()}` : booking.date
  const parsed = new Date(combined)
  return Number.isNaN(parsed.getTime()) ? null : parsed
}

function formatRideDate(value?: string | null) {
  if (!value) return '—'
  const parsed = new Date(`${value}T12:00:00`)
  if (Number.isNaN(parsed.getTime())) return value
  return parsed.toLocaleDateString('en-ZA', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function formatZar(value: number) {
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
    maximumFractionDigits: 0,
  }).format(Number(value) || 0)
}

function formatPercent(value: number) {
  return `${Math.max(0, Number(value) || 0).toFixed(1)}%`
}

function formatCompact(value: number) {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}m`
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}k`
  return `${Math.round(value)}`
}

function initialsFromName(name?: string | null) {
  const parts = String(name || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
  return parts.length ? parts.map((part) => part[0].toUpperCase()).join('') : '—'
}

function rideLabel(rideId?: string | null) {
  const value = String(rideId || '').trim()
  const match = value.match(/^(\d+)-(\d+)$/)
  if (!match) return value || 'Jet ski experience'
  const minutes = Number(match[1])
  const skis = Number(match[2])
  return `${minutes} min · ${skis} ${skis === 1 ? 'jet ski' : 'jet skis'}`
}

function statusBadge(status?: string | null) {
  const key = String(status || '').toLowerCase()
  if (paidStatuses.has(key)) {
    return <Badge className="border border-emerald-200 bg-emerald-50 text-emerald-700">Paid</Badge>
  }
  if (key === 'processing' || key === 'pending') {
    return <Badge className="border border-amber-200 bg-amber-50 text-amber-700">Pending</Badge>
  }
  if (key === 'failed') {
    return <Badge className="border border-rose-200 bg-rose-50 text-rose-700">Failed</Badge>
  }
  if (key === 'cancelled') {
    return <Badge className="border border-slate-200 bg-slate-100 text-slate-700">Cancelled</Badge>
  }
  return <Badge className="border border-slate-200 bg-slate-100 text-slate-700">Review</Badge>
}
