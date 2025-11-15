import * as React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { TrendingUp } from 'lucide-react'
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts'

import { API_BASE } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
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
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'

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
  const [loading, setLoading] = React.useState(false)
  const [statusFilter, setStatusFilter] = React.useState<string | 'all'>('all')
  const [updatingId, setUpdatingId] = React.useState<string | null>(null)
  const [deletingId, setDeletingId] = React.useState<string | null>(null)
  const [statusMessage, setStatusMessage] = React.useState<string>('')
  const [pendingStatus, setPendingStatus] = React.useState<{ booking: Booking; status: string } | null>(null)

  const bookingsChartData = React.useMemo(
    () =>
      analytics
        ? analytics.rides.map((r) => ({
            label: r.rideId,
            bookings: r.bookings,
          }))
        : [],
    [analytics],
  )

  const bookingsChartConfig: ChartConfig = {
    bookings: {
      label: 'Bookings',
      color: 'hsl(var(--primary))',
    },
  }

  React.useEffect(() => {
    if (!token) return
    ;(async () => {
      try {
        setLoading(true)
        const statusParam = statusFilter !== 'all' ? `&status_filter=${encodeURIComponent(statusFilter)}` : ''
        const [bRes, aRes] = await Promise.all([
          fetch(`${API_BASE}/api/admin/bookings?limit=100${statusParam}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${API_BASE}/api/admin/analytics/summary`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ])
        if (!bRes.ok) throw new Error('Failed to load bookings')
        if (!aRes.ok) throw new Error('Failed to load analytics')
        const bData = (await bRes.json()) as Booking[]
        const aData = (await aRes.json()) as AnalyticsSummary
        setBookings(bData)
        setAnalytics(aData)
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
    <div className="mx-auto max-w-6xl px-4 py-8 space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Admin dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Manage bookings and view revenue.
          </p>
        </div>
        <Button variant="outline" onClick={handleLogout}>
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
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Total bookings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">
                {analytics ? analytics.totalBookings : '—'}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Total revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">
                {analytics ? `ZAR ${analytics.totalRevenueZar.toFixed(0)}` : '—'}
              </div>
            </CardContent>
          </Card>
          <Card>
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
        {bookingsChartData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Bookings by ride</CardTitle>
              <p className="text-xs text-muted-foreground">
                Based on analytics summary for recent bookings.
              </p>
            </CardHeader>
            <CardContent>
              <ChartContainer config={bookingsChartConfig}>
                <AreaChart
                  accessibilityLayer
                  data={bookingsChartData}
                  margin={{ left: 12, right: 12 }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="label"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="line" />}
                  />
                  <Area
                    dataKey="bookings"
                    type="natural"
                    fill="var(--color-bookings)"
                    fillOpacity={0.4}
                    stroke="var(--color-bookings)"
                  />
                </AreaChart>
              </ChartContainer>
            </CardContent>
            <CardFooter>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1 font-medium text-foreground">
                  Trend overview
                  <TrendingUp className="h-3 w-3" />
                </span>
                <span>Booking counts per ride</span>
              </div>
            </CardFooter>
          </Card>
        )}
      </div>

      {analytics && analytics.rides.length > 0 && (
        <Card>
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

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-4">
          <CardTitle className="text-base">Recent bookings</CardTitle>
          <div className="flex items-center gap-3">
            <div className="flex flex-col gap-1">
              <Label htmlFor="status-message" className="text-xs">
                Status change message
              </Label>
              <Input
                id="status-message"
                placeholder="Reason shown to the customer"
                value={statusMessage}
                onChange={(e) => setStatusMessage(e.target.value)}
                className="w-56"
              />
            </div>
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
                <Label className="text-xs">Message to customer</Label>
                <div className="rounded-md border bg-muted/40 px-3 py-2 text-xs whitespace-pre-line">
                  {statusMessage.trim() ||
                    'No message entered yet. Close this and add a short status change message in the field above the table.'}
                </div>
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
  )
}
