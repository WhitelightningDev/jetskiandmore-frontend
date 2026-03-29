import * as React from 'react'
import { Link, createFileRoute } from '@tanstack/react-router'
import { Line, LineChart, CartesianGrid, ResponsiveContainer, Tooltip as RechartsTooltip, XAxis, YAxis } from 'recharts'
import { Eye, Receipt, Users as UsersIcon, Search, Trash2, Pencil, Filter } from 'lucide-react'

import { Button, buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { type ChartConfig, ChartContainer, ChartTooltipContent } from '@/components/ui/chart'
import { useAdminContext } from '@/admin/context'
import type { Booking } from '@/admin/types'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/admin/overview')({
  component: AdminOverviewPage,
})

function AdminOverviewPage() {
  const { analytics, pageViews, bookings, loadingBookings, loadingMeta, deleteBooking } = useAdminContext()
  const [range, setRange] = React.useState<RangeKey>('12m')
  const [customerSearch, setCustomerSearch] = React.useState('')

  const now = React.useMemo(() => new Date(), [])
  const { chartData, periodRevenueZar, periodBookings, revenueDeltaPct } = React.useMemo(
    () => buildDashboardSeries(bookings, range, now),
    [bookings, now, range],
  )

  const allRevenueZar = analytics?.totalRevenueZar ?? sumRevenueZar(bookings)
  const pageViewsTotal = pageViews?.totalViews ?? analytics?.totalPageViews ?? 0
  const uniqueSessions = pageViews?.totalUniqueSessions ?? 0
  const avgViewSeconds = React.useMemo(() => {
    if (!pageViews || !pageViews.items || pageViews.items.length === 0 || pageViewsTotal <= 0) return 0
    const total = pageViews.items.reduce((acc, item) => acc + (Number(item.totalDurationSeconds) || 0), 0)
    return total / Math.max(1, pageViewsTotal)
  }, [pageViews, pageViewsTotal])

  const rows = React.useMemo(() => {
    const sorted = [...bookings].sort((a, b) => {
      const at = parseBookingTimestamp(a)?.getTime() ?? 0
      const bt = parseBookingTimestamp(b)?.getTime() ?? 0
      return bt - at
    })
    const q = customerSearch.trim().toLowerCase()
    const filtered = q
      ? sorted.filter((b) => (b.fullName || '').toLowerCase().includes(q) || (b.email || '').toLowerCase().includes(q))
      : sorted
    return filtered.slice(0, 12)
  }, [bookings, customerSearch])

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">My dashboard</h1>
        <p className="text-sm text-slate-600">
          {loadingMeta || loadingBookings ? 'Loading…' : 'Bookings, revenue, and site traffic at a glance.'}
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        <MetricCard
          highlighted
          icon={<Receipt className="h-4 w-4 text-slate-700" />}
          label="All revenue"
          value={loadingMeta ? '—' : formatZar(allRevenueZar)}
          sub={analytics ? `${analytics.totalBookings.toLocaleString()} bookings` : undefined}
        />
        <MetricCard
          icon={<Eye className="h-4 w-4 text-slate-700" />}
          label="Page views"
          value={loadingMeta ? '—' : pageViewsTotal.toLocaleString()}
          sub={pageViews ? `${pageViews.totalUniqueVisitors.toLocaleString()} unique visitors` : undefined}
        />
        <MetricCard
          icon={<UsersIcon className="h-4 w-4 text-slate-700" />}
          label="Unique sessions"
          value={loadingMeta ? '—' : uniqueSessions.toLocaleString()}
          sub={pageViews ? `Avg ${formatSeconds(avgViewSeconds)} per view` : undefined}
        />
      </section>

      <Card className="border-slate-200 bg-white shadow-sm">
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <p className="text-xs font-medium text-slate-600">Net revenue</p>
              <Badge variant="outline" className="border-slate-200 bg-white text-slate-600">
                {rangeLabel(range)}
              </Badge>
            </div>
            <div className="flex flex-wrap items-end gap-3">
              <p className="text-2xl font-semibold text-slate-900">{formatZar(periodRevenueZar)}</p>
              <Badge className={cn('rounded-full', revenueDeltaPct >= 0 ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200')}>
                {formatDeltaPct(revenueDeltaPct)}
              </Badge>
            </div>
            <p className="text-sm text-slate-600">{periodBookings.toLocaleString()} bookings in this period.</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <RangePills value={range} onChange={setRange} />
            <Button variant="outline" size="sm" disabled>
              <Filter className="mr-2 h-4 w-4" />
              Filters
            </Button>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <ChartContainer config={dashboardChartConfig} className="rounded-xl border border-slate-200 bg-white">
            <div className="h-[320px] w-full p-3">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ left: 12, right: 12, top: 14, bottom: 6 }}>
                  <CartesianGrid vertical={false} strokeOpacity={0.12} />
                  <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={10} />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    width={72}
                    tickMargin={10}
                    tickFormatter={(v) => `Z${formatCompact(Number(v))}`}
                  />
                  <RechartsTooltip
                    cursor={{ stroke: '#e2e8f0', strokeDasharray: '3 3' }}
                    content={
                      <ChartTooltipContent
                        indicator="line"
                        labelFormatter={(value) => String(value)}
                        valueFormatter={(value, name) =>
                          name === 'Revenue'
                            ? `ZAR ${Number(value || 0).toLocaleString('en-ZA')}`
                            : `${Number(value || 0).toLocaleString()} bookings`
                        }
                      />
                    }
                  />
                  <Line
                    name="Revenue"
                    type="monotone"
                    dataKey="revenue"
                    stroke="var(--color-revenue)"
                    strokeWidth={2.25}
                    dot={false}
                    activeDot={{ r: 4 }}
                  />
                  <Line
                    name="Bookings"
                    type="monotone"
                    dataKey="bookings"
                    stroke="var(--color-bookings)"
                    strokeWidth={2}
                    strokeDasharray="3 4"
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </ChartContainer>
        </CardContent>
      </Card>

      <section className="space-y-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <h2 className="text-base font-semibold text-slate-900">Customers</h2>
            <p className="text-sm text-slate-600">Recent bookings (latest first).</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative w-full sm:w-[280px]">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" aria-hidden />
              <Input
                value={customerSearch}
                onChange={(e) => setCustomerSearch(e.target.value)}
                placeholder="Search"
                className="h-9 pl-9 pr-10"
              />
              <kbd className="pointer-events-none absolute right-2 top-2 rounded border border-slate-200 bg-slate-50 px-1.5 text-[10px] text-slate-500">
                ⌘K
              </kbd>
            </div>
          </div>
        </div>

        <Card className="border-slate-200 bg-white shadow-sm">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10">
                    <Checkbox disabled aria-label="Select all" />
                  </TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead className="hidden md:table-cell">Email</TableHead>
                  <TableHead className="hidden lg:table-cell">Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="w-20" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="py-10 text-center text-sm text-slate-600">
                      {loadingBookings ? 'Loading bookings…' : 'No bookings found.'}
                    </TableCell>
                  </TableRow>
                ) : (
                  rows.map((b) => {
                    const d = parseBookingTimestamp(b)
                    const initials = initialsFromName(b.fullName)
                    return (
                      <TableRow key={b.id} className="hover:bg-slate-50/60">
                        <TableCell>
                          <Checkbox disabled aria-label="Select row" />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9">
                              <AvatarFallback className="text-xs">{initials}</AvatarFallback>
                            </Avatar>
                            <div className="leading-tight">
                              <p className="font-medium text-slate-900">{b.fullName || '—'}</p>
                              <p className="text-xs text-slate-500">{b.rideId}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-slate-600">{b.email}</TableCell>
                        <TableCell className="hidden lg:table-cell text-slate-600">
                          {d ? d.toLocaleDateString('en-ZA', { year: 'numeric', month: 'short', day: 'numeric' }) : b.date || '—'}
                        </TableCell>
                        <TableCell>{statusBadge(b.status)}</TableCell>
                        <TableCell className="text-right font-medium text-slate-900">
                          {formatZar((b.amountInCents || 0) / 100)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-end gap-1">
                            <Link
                              to="/admin/bookings"
                              className={cn(buttonVariants({ variant: 'ghost', size: 'icon-sm' }), 'h-8 w-8')}
                              aria-label="Open bookings"
                            >
                              <Pencil className="h-4 w-4" />
                            </Link>
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              className="h-8 w-8"
                              aria-label="Delete booking"
                              onClick={() => {
                                if (!confirm('Delete this booking?')) return
                                deleteBooking(b.id)
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </CardContent>
          <Separator />
          <div className="flex items-center justify-between px-4 py-3 text-xs text-slate-500">
            <span>{loadingBookings ? 'Refreshing…' : `${bookings.length.toLocaleString()} total bookings loaded`}</span>
            <span>Showing {Math.min(rows.length, 12)} rows</span>
          </div>
        </Card>
      </section>
    </div>
  )
}

type RangeKey = '12m' | '30d' | '7d' | '24h'

const dashboardChartConfig: ChartConfig = {
  revenue: { label: 'Revenue', color: '#7c3aed' },
  bookings: { label: 'Bookings', color: '#a78bfa' },
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
          <CardTitle className="text-2xl font-semibold tracking-tight text-slate-900">{value}</CardTitle>
        </div>
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white">
          {icon}
        </span>
      </CardHeader>
      {sub ? <CardContent className="pt-0 text-xs text-slate-500">{sub}</CardContent> : <CardContent className="pt-0" />}
    </Card>
  )
}

function RangePills({ value, onChange }: { value: RangeKey; onChange: (v: RangeKey) => void }) {
  const items: Array<{ key: RangeKey; label: string }> = [
    { key: '12m', label: '12 months' },
    { key: '30d', label: '30 days' },
    { key: '7d', label: '7 days' },
    { key: '24h', label: '24 hours' },
  ]
  return (
    <div className="flex max-w-full flex-wrap items-center gap-1 rounded-md border border-slate-200 bg-white p-1">
      {items.map((it) => {
        const active = it.key === value
        return (
          <button
            key={it.key}
            type="button"
            onClick={() => onChange(it.key)}
            className={cn(
              'whitespace-nowrap rounded-md px-2.5 py-1 text-xs font-medium transition',
              active ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-50',
            )}
          >
            {it.label}
          </button>
        )
      })}
    </div>
  )
}

function buildDashboardSeries(bookings: Booking[], range: RangeKey, now: Date) {
  const { start, bucket, buckets, labelForBucket } = rangeConfig(range, now)
  const inRange = bookings.filter((b) => {
    const t = parseBookingTimestamp(b)
    return t ? t.getTime() >= start.getTime() : false
  })

  const previousStart = new Date(start.getTime() - (now.getTime() - start.getTime()))
  const prevRange = bookings.filter((b) => {
    const t = parseBookingTimestamp(b)
    if (!t) return false
    const ms = t.getTime()
    return ms >= previousStart.getTime() && ms < start.getTime()
  })

  const periodRevenueZar = sumRevenueZar(inRange)
  const prevRevenueZar = sumRevenueZar(prevRange)
  const revenueDeltaPct = prevRevenueZar > 0 ? (periodRevenueZar - prevRevenueZar) / prevRevenueZar : 0

  const bucketMap = new Map<string, { revenue: number; bookings: number; label: string }>()
  for (const b of buckets) {
    bucketMap.set(b, { revenue: 0, bookings: 0, label: labelForBucket(b) })
  }

  for (const b of inRange) {
    const t = parseBookingTimestamp(b)
    if (!t) continue
    const key = bucket(t)
    const entry = bucketMap.get(key)
    if (!entry) continue
    entry.revenue += (b.amountInCents || 0) / 100
    entry.bookings += 1
  }

  const chartData = buckets.map((k) => {
    const e = bucketMap.get(k)!
    return { key: k, label: e.label, revenue: round2(e.revenue), bookings: e.bookings }
  })

  return {
    chartData,
    periodRevenueZar: round2(periodRevenueZar),
    periodBookings: inRange.length,
    revenueDeltaPct,
  }
}

function rangeConfig(range: RangeKey, now: Date) {
  const end = new Date(now)
  if (range === '12m') {
    const startMonth = new Date(end.getFullYear(), end.getMonth() - 11, 1)
    const buckets: string[] = []
    for (let i = 0; i < 12; i++) {
      const d = new Date(startMonth.getFullYear(), startMonth.getMonth() + i, 1)
      buckets.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`)
    }
    return {
      start: startMonth,
      buckets,
      bucket: (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`,
      labelForBucket: (k: string) => {
        const [y, m] = k.split('-').map((n) => Number(n))
        const date = new Date(y, (m || 1) - 1, 1)
        return date.toLocaleString('en-ZA', { month: 'short' })
      },
    }
  }

  if (range === '24h') {
    const start = new Date(end.getTime() - 24 * 60 * 60 * 1000)
    const buckets: string[] = []
    for (let i = 0; i < 24; i++) {
      const d = new Date(start.getTime() + i * 60 * 60 * 1000)
      buckets.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}T${String(d.getHours()).padStart(2, '0')}`)
    }
    return {
      start,
      buckets,
      bucket: (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}T${String(d.getHours()).padStart(2, '0')}`,
      labelForBucket: (k: string) => {
        const hour = Number(k.split('T')[1] || 0)
        return `${String(hour).padStart(2, '0')}:00`
      },
    }
  }

  const days = range === '7d' ? 7 : 30
  const start = new Date(end.getTime() - days * 24 * 60 * 60 * 1000)
  const buckets: string[] = []
  for (let i = 0; i < days; i++) {
    const d = new Date(start.getTime() + i * 24 * 60 * 60 * 1000)
    buckets.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`)
  }
  return {
    start,
    buckets,
    bucket: (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`,
    labelForBucket: (k: string) => {
      const [y, m, dd] = k.split('-').map((n) => Number(n))
      const date = new Date(y, (m || 1) - 1, dd || 1)
      return date.toLocaleDateString('en-ZA', { month: 'short', day: 'numeric' })
    },
  }
}

function rangeLabel(r: RangeKey) {
  switch (r) {
    case '24h':
      return 'Last 24 hours'
    case '7d':
      return 'Last 7 days'
    case '30d':
      return 'Last 30 days'
    case '12m':
    default:
      return 'Last 12 months'
  }
}

function parseBookingTimestamp(b: Booking): Date | null {
  const created = b.createdAt ? new Date(b.createdAt) : null
  if (created && !Number.isNaN(created.getTime())) return created
  if (b.date) {
    const combined = b.time ? `${b.date}T${String(b.time).trim()}` : b.date
    const d = new Date(combined)
    if (!Number.isNaN(d.getTime())) return d
  }
  return null
}

function sumRevenueZar(bookings: Booking[]) {
  return bookings.reduce((acc, b) => acc + (b.amountInCents || 0) / 100, 0)
}

function round2(v: number) {
  return Math.round(v * 100) / 100
}

function formatZar(value: number) {
  try {
    return new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR' }).format(value)
  } catch {
    return `ZAR ${value.toFixed(2)}`
  }
}

function formatCompact(value: number) {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`
  return `${Math.round(value)}`
}

function formatDeltaPct(delta: number) {
  const pct = delta * 100
  const sign = pct >= 0 ? '+' : ''
  return `${sign}${pct.toFixed(1)}%`
}

function initialsFromName(name?: string | null) {
  const s = String(name || '').trim()
  if (!s) return '—'
  const parts = s.split(/\s+/).slice(0, 2)
  return parts.map((p) => p.slice(0, 1).toUpperCase()).join('')
}

function statusBadge(status?: string | null) {
  const key = String(status || '').toLowerCase()
  if (key === 'approved' || key === 'paid' || key === 'captured') {
    return <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200">Paid</Badge>
  }
  if (key === 'processing') {
    return <Badge className="bg-amber-50 text-amber-700 border border-amber-200">Processing</Badge>
  }
  if (key === 'failed') {
    return <Badge className="bg-rose-50 text-rose-700 border border-rose-200">Failed</Badge>
  }
  if (key === 'cancelled') {
    return <Badge className="bg-slate-100 text-slate-700 border border-slate-200">Cancelled</Badge>
  }
  return <Badge className="bg-slate-100 text-slate-700 border border-slate-200">Pending</Badge>
}

function formatSeconds(s: number) {
  const value = Math.max(0, Number(s) || 0)
  if (value < 60) return `${Math.round(value)}s`
  const m = Math.floor(value / 60)
  const r = Math.round(value % 60)
  return `${m}m ${r}s`
}
