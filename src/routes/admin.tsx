import * as React from 'react'
import { Link, Outlet, createFileRoute, useRouter, useRouterState } from '@tanstack/react-router'
import { BarChart3, CalendarClock, CalendarRange, LayoutDashboard, LogOut, ShieldCheck } from 'lucide-react'

import { API_BASE } from '@/lib/api'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AdminContext } from '@/admin/context'
import type { AnalyticsSummary, Booking, PageViewAnalytics, QuizSubmission } from '@/admin/types'

export { useAdminContext } from '@/admin/context'
export type {
  AdminOutletContext,
  AnalyticsSummary,
  Booking,
  QuizSubmission,
  RideStat,
  PageViewAnalytics,
  PageViewAnalyticsItem,
} from '@/admin/types'

export const Route = createFileRoute('/admin')({
  component: AdminLayout,
})

function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null
  return window.localStorage.getItem('jsm_admin_token')
}

const navItems = [
  { id: 'overview', label: 'Overview', to: '/admin/overview', icon: LayoutDashboard, description: 'Pulse & alerts' },
  { id: 'analytics', label: 'Analytics', to: '/admin/analytics', icon: BarChart3, description: 'Bookings & revenue' },
  { id: 'bookings', label: 'Bookings', to: '/admin/bookings', icon: CalendarClock, description: 'Manage customers' },
  { id: 'calendar', label: 'Calendar', to: '/admin/calendar', icon: CalendarRange, description: 'Date & time grid' },
  { id: 'quiz', label: 'Safety & quiz', to: '/admin/quiz', icon: ShieldCheck, description: 'Compliance review' },
]

function AdminLayout() {
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [token, setToken] = React.useState<string | null>(() => getStoredToken())
  const [error, setError] = React.useState<string | null>(null)
  const [bookings, setBookings] = React.useState<Booking[]>([])
  const [analytics, setAnalytics] = React.useState<AnalyticsSummary | null>(null)
  const [pageViews, setPageViews] = React.useState<PageViewAnalytics | null>(null)
  const [quizSubs, setQuizSubs] = React.useState<QuizSubmission[]>([])
  const [loadingBookings, setLoadingBookings] = React.useState(false)
  const [loadingMeta, setLoadingMeta] = React.useState(false)
  const [loadingPageViews, setLoadingPageViews] = React.useState(false)
  const [statusFilter, setStatusFilter] = React.useState<string | 'all'>('all')

  const router = useRouter()
  const pathname = useRouterState({ select: (s) => s.location.pathname })

  React.useEffect(() => {
    if (token && (pathname === '/admin' || pathname === '/admin/')) {
      router.navigate({ to: '/admin/overview' })
    }
  }, [pathname, router, token])

  React.useEffect(() => {
    if (!token) return
    ;(async () => {
      try {
        setError(null)
        setLoadingBookings(true)
        const statusParam = statusFilter !== 'all' ? `&status_filter=${encodeURIComponent(statusFilter)}` : ''
        const res = await fetch(`${API_BASE}/api/admin/bookings?limit=100${statusParam}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (res.status === 401) {
          handleSessionExpired()
          return
        }
        if (!res.ok) throw new Error('Failed to load bookings')
        const data = (await res.json()) as Booking[]
        setBookings(data)
      } catch (e: any) {
        setError(e?.message ?? 'Failed to load bookings')
      } finally {
        setLoadingBookings(false)
      }
    })()
  }, [statusFilter, token])

  React.useEffect(() => {
    if (!token) return
    ;(async () => {
      try {
        setError(null)
        setLoadingMeta(true)
        const [aRes, qRes] = await Promise.all([
          fetch(`${API_BASE}/api/admin/analytics/summary`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${API_BASE}/api/admin/interim-skipper-quiz?limit=200`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ])
        if (aRes.status === 401 || qRes.status === 401) {
          handleSessionExpired()
          return
        }
        if (!aRes.ok) throw new Error('Failed to load analytics')
        if (!qRes.ok) throw new Error('Failed to load quiz submissions')
        const aData = (await aRes.json()) as AnalyticsSummary
        const qData = (await qRes.json()) as QuizSubmission[]
        setAnalytics(aData)
        setQuizSubs(qData)
      } catch (e: any) {
        setError(e?.message ?? 'Failed to load admin data')
      } finally {
        setLoadingMeta(false)
      }
    })()
  }, [token])

  React.useEffect(() => {
    if (!token) return
    ;(async () => {
      try {
        setLoadingPageViews(true)
        const res = await fetch(`${API_BASE}/api/admin/analytics/pageviews?limit=50`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (res.status === 401) {
          handleSessionExpired()
          return
        }
        if (!res.ok) throw new Error('Failed to load page view analytics')
        const data = (await res.json()) as PageViewAnalytics
        setPageViews(data)
      } catch (e: any) {
        setError((prev) => prev ?? e?.message ?? 'Failed to load page views')
      } finally {
        setLoadingPageViews(false)
      }
    })()
  }, [token])

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    try {
      setError(null)
      const res = await fetch(`${API_BASE}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      if (res.status === 401) {
        handleSessionExpired()
        return false
      }
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
      router.navigate({ to: '/admin/overview' })
    } catch (e: any) {
      setError(e?.message ?? 'Login failed')
    }
  }

  function handleLogout() {
    setToken(null)
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem('jsm_admin_token')
    }
    setBookings([])
    setAnalytics(null)
    setPageViews(null)
    setQuizSubs([])
    router.navigate({ to: '/admin' })
  }

  function handleSessionExpired() {
    setError('Session expired. Please sign in again.')
    handleLogout()
  }

  async function updateBookingStatus(id: string, status: string, message: string) {
    if (!token) return false
    if (!message.trim()) {
      window.alert('Please provide a short message explaining this status change.')
      return false
    }
    try {
      const res = await fetch(`${API_BASE}/api/admin/bookings/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status, message }),
      })
      if (res.status === 401) {
        handleSessionExpired()
        return false
      }
      if (!res.ok) {
        const data = await res.json().catch(() => null)
        const msg = data?.detail || data?.message || res.statusText
        throw new Error(msg)
      }
      const updated = (await res.json()) as Booking
      setBookings((prev) => prev.map((b) => (b.id === updated.id ? { ...b, ...updated } : b)))
      setError(null)
      return true
    } catch (e: any) {
      setError(e?.message ?? 'Failed to update booking')
      return false
    }
  }

  async function deleteBooking(id: string) {
    if (!token) return
    try {
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
    }
  }

  if (!token) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_10%,rgba(34,211,238,0.18),transparent_38%),radial-gradient(circle_at_85%_30%,rgba(59,130,246,0.10),transparent_35%),radial-gradient(circle_at_30%_85%,rgba(99,102,241,0.08),transparent_35%)]" />
        <div className="relative mx-auto flex min-h-screen max-w-6xl items-center justify-center px-4">
          <Card className="w-full max-w-md border-slate-200 bg-white shadow-2xl shadow-cyan-500/10">
            <CardHeader>
              <CardTitle>Admin login</CardTitle>
              <CardDescription>
                Access the control center for bookings, revenue, and safety.
              </CardDescription>
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
                <Button type="submit" className="w-full">
                  Sign in
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen bg-slate-50 text-slate-900">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_10%,rgba(34,211,238,0.14),transparent_38%),radial-gradient(circle_at_90%_20%,rgba(59,130,246,0.10),transparent_35%),radial-gradient(circle_at_30%_80%,rgba(99,102,241,0.07),transparent_35%)]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-3 py-6 lg:py-10">
        <div className="flex flex-col gap-4 md:flex-row md:items-start">
          <aside className="w-full shrink-0 self-start rounded-2xl border border-slate-200 bg-white shadow-xl shadow-cyan-500/10 md:sticky md:top-4 lg:top-6 md:w-60 lg:w-64 md:max-h-[calc(100vh-2rem)] md:overflow-y-auto">
            <div className="flex items-center justify-between gap-3 border-b border-slate-200 px-5 py-4">
              <div>
                <p className="text-[11px] uppercase tracking-[0.2em] text-cyan-700">Control</p>
                <p className="text-lg font-semibold text-slate-900">Admin console</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
            <div className="space-y-1 px-2 py-3">
              {navItems.map((item) => {
                const active = pathname.startsWith(item.to)
                return (
                  <Link
                    key={item.id}
                    to={item.to as '/admin/overview' | '/admin/analytics' | '/admin/bookings' | '/admin/calendar' | '/admin/quiz'}
                    preload="intent"
                    className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition ${
                      active
                        ? 'border border-cyan-200 bg-cyan-50 text-slate-900 shadow-sm'
                        : 'border border-transparent text-slate-700 hover:border-slate-200 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <span
                      className={`inline-flex h-9 w-9 items-center justify-center rounded-lg border ${
                        active ? 'border-cyan-200 bg-cyan-100 text-cyan-800' : 'border-slate-200 bg-white text-slate-700'
                      }`}
                    >
                      <item.icon className="h-4 w-4" />
                    </span>
                    <div className="flex flex-1 flex-col leading-tight">
                      <span className="text-sm font-semibold">{item.label}</span>
                      <span className="text-xs text-slate-500">{item.description}</span>
                    </div>
                  </Link>
                )
              })}
            </div>
            <div className="rounded-b-2xl border-t border-slate-200 bg-slate-50 px-5 py-4 text-xs text-slate-600">
              {analytics ? (
                <div className="space-y-1">
                  <p className="text-[11px] uppercase tracking-[0.12em] text-cyan-700">
                    Snapshot
                  </p>
                  <p className="flex items-center justify-between font-semibold text-slate-900">
                    ZAR {analytics.totalRevenueZar.toFixed(0)}
                  </p>
                  <p className="text-slate-500">Total revenue to date</p>
                </div>
              ) : (
                <p className="text-slate-500">Load analytics to see the quick snapshot.</p>
              )}
            </div>
          </aside>

          <main className="flex-1 space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <AdminContext.Provider
              value={{
                token,
                bookings,
                analytics,
                pageViews,
                quizSubs,
                loadingBookings,
                loadingMeta,
                loadingPageViews,
                error,
                setError,
                statusFilter,
                setStatusFilter,
                updateBookingStatus,
                deleteBooking,
                handleLogout,
              }}
            >
              <Outlet />
            </AdminContext.Provider>
          </main>
        </div>
      </div>
    </div>
  )
}
