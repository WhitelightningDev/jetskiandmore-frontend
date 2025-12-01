import * as React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from 'recharts'

import { API_BASE } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { Textarea } from '@/components/ui/textarea'

type Booking = {
  id: string
  rideId: string
  date?: string | null
  time?: string | null
  fullName: string
  email: string
  phone: string
  notes?: string | null
  addons?: Record<string, any> | null
  passengers?: { name?: string }[] | null
  status: string
  amountInCents: number
  createdAt?: string | null
}

type RideStat = {
  rideId: string
  bookings: number
  revenueInCents: number
}

type AnalyticsSummary = {
  totalBookings: number
  totalRevenueInCents: number
  totalRevenueZar: number
  rides: RideStat[]
}

type QuizSubmission = {
  id: string
  email: string
  name: string
  surname: string
  idNumber: string
  passengerName?: string | null
  passengerSurname?: string | null
  passengerEmail?: string | null
  passengerIdNumber?: string | null
  hasWatchedTutorial: boolean
  hasAcceptedIndemnity: boolean
  quizAnswers: Record<string, any>
  createdAt?: string | null
}

export const Route = createFileRoute('/admin/')({
  component: AdminDashboardRoute,
})

function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null
  return window.localStorage.getItem('jsm_admin_token')
}

function AdminDashboardRoute() {
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [token, setToken] = React.useState<string | null>(() => getStoredToken())
  const [error, setError] = React.useState<string | null>(null)
  const [bookings, setBookings] = React.useState<Booking[]>([])
  const [analytics, setAnalytics] = React.useState<AnalyticsSummary | null>(null)
  const [quizSubs, setQuizSubs] = React.useState<QuizSubmission[]>([])
  const [loading, setLoading] = React.useState(false)
  const [statusFilter, setStatusFilter] = React.useState<string | 'all'>('all')
  const [updatingId, setUpdatingId] = React.useState<string | null>(null)
  const [deletingId, setDeletingId] = React.useState<string | null>(null)
  const [statusMessage, setStatusMessage] = React.useState<string>('')
  const [pendingStatus, setPendingStatus] = React.useState<{ booking: Booking; status: string } | null>(null)

  const { dailyData, monthLabel } = React.useMemo(() => {
    if (!bookings || bookings.length === 0) return { dailyData: [], monthLabel: '' }

    // Find the most recent booking date to pick the month to display
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
  }, [bookings])

  const formatNumber = (value: number) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}m`
    if (value >= 1000) return `${(value / 1000).toFixed(1)}k`
    return `${value}`
  }

  const bookingsChartConfig: ChartConfig = {
    bookings: {
      label: 'Bookings',
      color: '#2563eb', // vivid blue to separate from revenue
    },
    revenue: {
      label: 'Revenue (ZAR)',
      color: '#ea580c', // amber for revenue contrast
    },
  }

  React.useEffect(() => {
    if (!token) return
    ;(async () => {
      try {
        setLoading(true)
        const statusParam = statusFilter !== 'all' ? `&status_filter=${encodeURIComponent(statusFilter)}` : ''
        const [bRes, aRes, qRes] = await Promise.all([
          fetch(`${API_BASE}/api/admin/bookings?limit=100${statusParam}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${API_BASE}/api/admin/analytics/summary`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${API_BASE}/api/admin/interim-skipper-quiz?limit=200`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ])
        if (!bRes.ok) throw new Error('Failed to load bookings')
        if (!aRes.ok) throw new Error('Failed to load analytics')
        if (!qRes.ok) throw new Error('Failed to load quiz submissions')
        const bData = (await bRes.json()) as Booking[]
        const aData = (await aRes.json()) as AnalyticsSummary
        const qData = (await qRes.json()) as QuizSubmission[]
        setBookings(bData)
        setAnalytics(aData)
        setQuizSubs(qData)
        setError(null)
      } catch (e: any) {
        setError(e?.message ?? 'Failed to load admin data')
      } finally {
        setLoading(false)
      }
    })()
  }, [token, statusFilter])

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    try {
      setError(null)
      setLoading(true)
      const res = await fetch(`${API_BASE}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => null)
        const msg = data?.detail || data?.message || res.statusText
        throw new Error(msg)
      }
      const data = await res.json()
      const t = data.token as string
      setToken(t)
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('jsm_admin_token', t)
      }
      setPassword('')
    } catch (e: any) {
      setError(e?.message ?? 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  function handleLogout() {
    setToken(null)
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem('jsm_admin_token')
    }
    setBookings([])
    setAnalytics(null)
    setQuizSubs([])
  }

  async function updateBookingStatus(id: string, status: string) {
    if (!token) return false
    if (!statusMessage.trim()) {
      window.alert('Please provide a short message explaining this status change.')
      return false
    }
    try {
      setUpdatingId(id)
      const res = await fetch(`${API_BASE}/api/admin/bookings/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status, message: statusMessage }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => null)
        const msg = data?.detail || data?.message || res.statusText
        throw new Error(msg)
      }
      const updated = (await res.json()) as Booking
      setBookings((prev) => prev.map((b) => (b.id === updated.id ? { ...b, ...updated } : b)))
      setError(null)
      setStatusMessage('')
      return true
    } catch (e: any) {
      setError(e?.message ?? 'Failed to update booking')
      return false
    } finally {
      setUpdatingId(null)
    }
  }

  async function deleteBooking(id: string) {
    if (!token) return
    if (!window.confirm('Delete this booking? This cannot be undone.')) return
    try {
      setDeletingId(id)
      const res = await fetch(`${API_BASE}/api/admin/bookings/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) {
        const data = await res.json().catch(() => null)
        const msg = data?.detail || data?.message || res.statusText
        throw new Error(msg)
      }
      setBookings((prev) => prev.filter((b) => b.id !== id))
      setError(null)
    } catch (e: any) {
      setError(e?.message ?? 'Failed to delete booking')
    } finally {
      setDeletingId(null)
    }
  }

  if (!token) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-md items-center justify-center px-4">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Admin login</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleLogin}>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {error && (
                <Alert variant="destructive">
                  <AlertTitle>Login failed</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Signing in…' : 'Sign in'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-primary/5">
      <div className="mx-auto max-w-6xl px-4 py-10 space-y-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-[0.22em] text-primary">Control center</p>
            <h1 className="text-3xl font-bold">Admin dashboard</h1>
            <p className="text-sm text-muted-foreground">Manage bookings, revenue, and safety submissions.</p>
          </div>
          <Button variant="outline" onClick={handleLogout} className="border-primary/30">
            Log out
          </Button>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr),minmax(0,2fr)]">
          <div className="grid gap-4 sm:grid-cols-3">
            <Card className="bg-white/80 backdrop-blur border-primary/10 shadow-[0_18px_40px_-28px_rgba(15,23,42,0.5)]">
              <CardHeader>
                <CardTitle className="text-base">Total bookings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold">
                  {analytics ? analytics.totalBookings : '—'}
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white/80 backdrop-blur border-primary/10 shadow-[0_18px_40px_-28px_rgba(15,23,42,0.5)]">
              <CardHeader>
                <CardTitle className="text-base">Total revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold">
                  {analytics ? `ZAR ${analytics.totalRevenueZar.toFixed(0)}` : '—'}
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white/80 backdrop-blur border-primary/10 shadow-[0_18px_40px_-28px_rgba(15,23,42,0.5)]">
              <CardHeader>
                <CardTitle className="text-base">Top ride</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm">
                  {analytics && analytics.rides.length > 0
                    ? `${analytics.rides[0].rideId} (${analytics.rides[0].bookings} bookings)`
                    : '—'}
                </div>
              </CardContent>
            </Card>
          </div>
        {dailyData.length > 0 && (
          <div className="grid gap-4 md:grid-cols-2">
              <Card className="py-0 bg-white/90 backdrop-blur border-primary/10 shadow-[0_20px_60px_-40px_rgba(14,116,144,0.4)]">
              <CardHeader className="flex flex-col items-stretch border-b !p-0 sm:flex-row">
                <div className="flex flex-1 flex-col justify-center gap-1 px-6 pt-4 pb-3 sm:!py-0">
                  <CardTitle>Bookings this month</CardTitle>
                  <CardDescription>{monthLabel || 'Latest month'} daily counts.</CardDescription>
                </div>
                <div className="flex">
                  <div className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left sm:border-l sm:border-t-0 sm:px-8 sm:py-6">
                    <span className="text-muted-foreground text-xs">Total</span>
                    <span className="text-lg leading-none font-bold sm:text-3xl">
                      {analytics?.totalBookings.toLocaleString() ?? '—'}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="px-2 sm:p-6">
                <ChartContainer
                  config={{ bookings: bookingsChartConfig.bookings }}
                  className="rounded-xl border bg-gradient-to-b from-white to-slate-50"
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
                        <CartesianGrid vertical={false} strokeOpacity={0.25} strokeDasharray="3 3" />
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

            <Card className="bg-white/90 backdrop-blur border-primary/10 shadow-[0_20px_60px_-40px_rgba(14,116,144,0.4)]">
              <CardHeader>
                <CardTitle>Revenue this month</CardTitle>
                <CardDescription>{monthLabel || 'Latest month'} daily revenue (ZAR).</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{ revenue: bookingsChartConfig.revenue }}
                  className="rounded-xl border bg-gradient-to-b from-white to-slate-50"
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
                        <CartesianGrid vertical={false} strokeOpacity={0.25} strokeDasharray="3 3" />
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
        )}
      </div>

      {analytics && analytics.rides.length > 0 && (
        <Card className="bg-white/90 backdrop-blur border-primary/10 shadow-[0_18px_50px_-35px_rgba(15,23,42,0.45)]">
          <CardHeader>
            <CardTitle className="text-base">Bookings by ride</CardTitle>
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

      <Card className="bg-white/90 backdrop-blur border-primary/10 shadow-[0_18px_50px_-35px_rgba(15,23,42,0.45)]">
        <CardHeader>
          <CardTitle className="text-base">Interim Skipper Quiz submissions</CardTitle>
          <CardDescription>Recent quiz + indemnity responses</CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>ID number</TableHead>
                <TableHead>Passenger</TableHead>
                <TableHead>Checks</TableHead>
                <TableHead>Submitted</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {quizSubs.map((q) => (
                <TableRow key={q.id}>
                  <TableCell className="font-medium">
                    {q.name} {q.surname}
                  </TableCell>
                  <TableCell>{q.email}</TableCell>
                  <TableCell>{q.idNumber}</TableCell>
                  <TableCell className="text-sm">
                    {q.passengerName || q.passengerSurname || q.passengerEmail ? (
                      <div className="space-y-1">
                        <div>
                          {q.passengerName} {q.passengerSurname}
                        </div>
                        {q.passengerEmail ? (
                          <div className="text-muted-foreground">{q.passengerEmail}</div>
                        ) : null}
                        {q.passengerIdNumber ? (
                          <div className="text-muted-foreground">ID: {q.passengerIdNumber}</div>
                        ) : null}
                      </div>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-xs">
                    <div className={q.hasWatchedTutorial ? 'text-emerald-700' : 'text-rose-700'}>
                      Tutorial: {q.hasWatchedTutorial ? 'Yes' : 'No'}
                    </div>
                    <div className={q.hasAcceptedIndemnity ? 'text-emerald-700' : 'text-rose-700'}>
                      Indemnity: {q.hasAcceptedIndemnity ? 'Yes' : 'No'}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {q.createdAt ? new Date(q.createdAt).toLocaleString() : '—'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {quizSubs.length === 0 ? (
            <p className="text-sm text-muted-foreground mt-3">No submissions yet.</p>
          ) : null}
        </CardContent>
      </Card>

      <Card className="bg-white/90 backdrop-blur border-primary/10 shadow-[0_18px_50px_-35px_rgba(15,23,42,0.45)]">
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-base">Recent bookings</CardTitle>
          <div className="flex items-center gap-3">
           
            <Select
              value={statusFilter}
              onValueChange={(v) => setStatusFilter(v as typeof statusFilter)}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="created">Created</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Ride</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.map((b) => (
                <TableRow key={b.id}>
                  <TableCell>
                    {b.date ||
                      (b.createdAt
                        ? new Date(b.createdAt).toLocaleDateString('en-ZA')
                        : '—')}
                  </TableCell>
                  <TableCell>{b.rideId}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{b.fullName}</span>
                      <span className="text-xs text-muted-foreground">
                        {b.email}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="capitalize">
                    <Select
                      value={b.status}
                      onValueChange={(value) => {
                        setPendingStatus({ booking: b, status: value })
                      }}
                      disabled={updatingId === b.id}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="created">Created</SelectItem>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="failed">Failed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-right">
                    ZAR {(b.amountInCents / 100).toFixed(0)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteBooking(b.id)}
                      disabled={deletingId === b.id}
                    >
                      {deletingId === b.id ? 'Deleting…' : 'Delete'}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {bookings.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center text-sm text-muted-foreground"
                  >
                    {loading ? 'Loading bookings…' : 'No bookings yet.'}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {pendingStatus && (
        <Dialog
          open={!!pendingStatus}
          onOpenChange={(open) => {
            if (!open) setPendingStatus(null)
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm status update</DialogTitle>
              <DialogDescription>
                This will update the booking status and send the message below to the customer.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 text-sm">
              <div>
                <p className="font-medium">{pendingStatus.booking.fullName}</p>
                <p className="text-xs text-muted-foreground">
                  Current status: {pendingStatus.booking.status || '—'} → New status:{' '}
                  {pendingStatus.status || '—'}
                </p>
              </div>
              <div className="space-y-1">
                <Label htmlFor="status-popup-message" className="text-xs">
                  Message to customer
                </Label>
                <Textarea
                  id="status-popup-message"
                  value={statusMessage}
                  onChange={(e) => setStatusMessage(e.target.value)}
                  placeholder="Short message explaining this status change"
                  className="text-xs min-h-[80px]"
                />
                <p className="text-[11px] text-muted-foreground">
                  This message will be included in the email / notification sent with this status update.
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setPendingStatus(null)}>
                Cancel
              </Button>
              <Button
                onClick={async () => {
                  const ok = await updateBookingStatus(pendingStatus.booking.id, pendingStatus.status)
                  if (ok) {
                    setPendingStatus(null)
                  }
                }}
                disabled={updatingId === pendingStatus.booking.id}
              >
                {updatingId === pendingStatus.booking.id ? 'Sending…' : 'Send & update'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  </div>
  )
}
