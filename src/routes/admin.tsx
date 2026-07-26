import * as React from 'react'
import { Link, Outlet, createFileRoute, useRouter, useRouterState } from '@tanstack/react-router'
import {
  BarChart3,
  CalendarClock,
  CalendarRange,
  ChevronRight,
  Copy,
  ExternalLink,
  FileText,
  Home,
  Kanban,
  LayoutDashboard,
  LogOut,
  Mail,
  RefreshCw,
  Settings,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
} from 'lucide-react'

import type { AnalyticsSummary, Booking, PageViewAnalytics, QuizSubmission } from '@/admin/types'
import { API_BASE } from '@/lib/api'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription as DialogDesc, DialogHeader as DialogHeaderUI, DialogTitle as DialogTitleUI, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { AdminContext } from '@/admin/context'
import { cn } from '@/lib/utils'
import { toast } from '@/components/ui/use-toast'

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
  { id: 'home', label: 'Home', to: '/home', icon: Home, description: 'Public site' },
  { id: 'overview', label: 'Dashboard', to: '/admin/overview', icon: LayoutDashboard, description: 'Pulse & alerts' },
  { id: 'analytics', label: 'Analytics', to: '/admin/analytics', icon: BarChart3, description: 'Bookings & revenue' },
  { id: 'bookings', label: 'Bookings', to: '/admin/bookings', icon: CalendarClock, description: 'Manage customers' },
  { id: 'calendar', label: 'Calendar', to: '/admin/calendar', icon: CalendarRange, description: 'Date & time grid' },
  { id: 'marketing', label: 'Marketing', to: '/admin/marketing', icon: Mail, description: 'Email campaigns' },
  { id: 'growth', label: 'Growth board', to: '/admin/growth', icon: Kanban, description: 'Winter → summer plan' },
  { id: 'quiz', label: 'Safety & quiz', to: '/admin/quiz', icon: ShieldCheck, description: 'Compliance review' },
]

function AdminLayout() {
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [token, setToken] = React.useState<string | null>(() => getStoredToken())
  const [error, setError] = React.useState<string | null>(null)
  const [bookings, setBookings] = React.useState<Array<Booking>>([])
  const [analytics, setAnalytics] = React.useState<AnalyticsSummary | null>(null)
  const [pageViews, setPageViews] = React.useState<PageViewAnalytics | null>(null)
  const [quizSubs, setQuizSubs] = React.useState<Array<QuizSubmission>>([])
  const [loadingBookings, setLoadingBookings] = React.useState(false)
  const [loadingMeta, setLoadingMeta] = React.useState(false)
  const [loadingPageViews, setLoadingPageViews] = React.useState(false)
  const [statusFilter, setStatusFilter] = React.useState<string | 'all'>('all')
  const [refreshNonce, setRefreshNonce] = React.useState(0)
  const [whatsNewOpen, setWhatsNewOpen] = React.useState(false)

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
        const data = (await res.json()) as Array<Booking>
        setBookings(data)
      } catch (e: any) {
        setError(e?.message ?? 'Failed to load bookings')
      } finally {
        setLoadingBookings(false)
      }
    })()
  }, [refreshNonce, statusFilter, token])

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
        const qData = (await qRes.json()) as Array<QuizSubmission>
        setAnalytics(aData)
        setQuizSubs(qData)
      } catch (e: any) {
        setError(e?.message ?? 'Failed to load admin data')
      } finally {
        setLoadingMeta(false)
      }
    })()
  }, [refreshNonce, token])

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
  }, [refreshNonce, token])

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
    } catch (loginError: any) {
      setError(loginError?.message ?? 'Login failed')
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

  const activeNav = React.useMemo(() => {
    if (pathname.startsWith('/admin/booking-controls')) return 'Settings'
    if (pathname.startsWith('/admin/support')) return 'Support'
    const found = navItems.find((i) => pathname.startsWith(i.to))
    return found?.label ?? 'Dashboard'
  }, [pathname])

  function handleRefresh() {
    setRefreshNonce((n) => n + 1)
  }

  async function handleCopyLink() {
    try {
      const href = typeof window !== 'undefined' ? window.location.href : ''
      if (!href) return
      await navigator.clipboard.writeText(href)
    } catch {
      // ignore clipboard errors
    }
  }

  async function updateBookingStatus(id: string, status: string, message: string) {
    if (!token) return false
    if (!message.trim()) {
      toast({
        title: 'Message required',
        description: 'Please provide a short message explaining this status change.',
        variant: 'destructive',
      })
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
    <div className="h-screen overflow-hidden bg-slate-50 text-slate-900">
      <div className="grid h-screen grid-cols-1 md:grid-cols-[252px_1fr]">
        <aside className="hidden h-screen overflow-y-auto border-r border-slate-800 bg-slate-950 text-white md:block">
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between px-4 py-5">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 text-sm font-bold text-white shadow-lg shadow-cyan-950">
                  JM
                </span>
                <div className="leading-tight">
                  <p className="text-sm font-semibold">Jet Ski &amp; More</p>
                  <p className="text-xs text-slate-400">Operations OS</p>
                </div>
              </div>
            </div>

            <div className="px-3 pb-5">
              <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/80 px-3 py-2.5">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                    Workspace
                  </p>
                  <p className="mt-0.5 text-xs font-medium text-slate-200">Durban operations</p>
                </div>
                <Badge className="border border-emerald-400/20 bg-emerald-400/10 px-2 text-[10px] text-emerald-300">
                  Live
                </Badge>
              </div>
            </div>

            <nav className="flex-1 px-3 pb-4">
              <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-600">
                Workspace
              </p>
              <div className="space-y-1">
                {navItems.map((item) => {
                  const active = pathname.startsWith(item.to)
                  const count =
                    item.id === 'bookings'
                      ? bookings.length
                      : item.id === 'quiz'
                        ? quizSubs.length
                        : null
                  return (
                    <Link
                      key={item.id}
                      to={item.to as any}
                      preload="intent"
                      className={cn(
                        'group flex items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-sm transition',
                        active
                          ? 'bg-white/10 text-white shadow-sm ring-1 ring-white/10'
                          : 'text-slate-400 hover:bg-white/5 hover:text-white',
                      )}
                    >
                      <span className="flex items-center gap-2">
                        <item.icon
                          className={cn('h-4 w-4', active ? 'text-cyan-300' : 'text-slate-500')}
                        />
                        <span className="font-medium">{item.label}</span>
                        {typeof count === 'number' && count > 0 ? (
                          <span className="ml-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-cyan-400/10 px-1.5 text-[11px] font-semibold text-cyan-200">
                            {count > 99 ? '99+' : count}
                          </span>
                        ) : null}
                      </span>
                      <ChevronRight
                        className={cn(
                          'h-4 w-4 text-slate-500 transition',
                          active ? 'opacity-100' : 'opacity-0 group-hover:opacity-100',
                        )}
                        aria-hidden
                      />
                    </Link>
                  )
                })}
              </div>

              <Separator className="my-5 bg-slate-800" />

              <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-600">
                Configuration
              </p>
              <div className="space-y-1">
                <Link
                  to="/admin/booking-controls"
                  className={cn(
                    'flex items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-sm transition',
                    pathname.startsWith('/admin/booking-controls')
                      ? 'bg-white/10 text-white ring-1 ring-white/10'
                      : 'text-slate-400 hover:bg-white/5 hover:text-white',
                  )}
                >
                  <span className="flex items-center gap-2">
                    <SlidersHorizontal className="h-4 w-4 text-slate-500" />
                    Settings
                  </span>
                  <ChevronRight className="h-4 w-4 text-slate-600" aria-hidden />
                </Link>
                <Link
                  to={'/admin/support' as any}
                  className={cn(
                    'flex items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-sm transition',
                    pathname.startsWith('/admin/support')
                      ? 'bg-white/10 text-white ring-1 ring-white/10'
                      : 'text-slate-400 hover:bg-white/5 hover:text-white',
                  )}
                >
                  <span className="flex items-center gap-2">
                    <Settings className="h-4 w-4 text-slate-500" />
                    Support
                  </span>
                  <ChevronRight className="h-4 w-4 text-slate-600" aria-hidden />
                </Link>
                <Link
                  to={'/partner-pack' as any}
                  className="flex items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-sm text-slate-400 transition hover:bg-white/5 hover:text-white"
                >
                  <span className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-slate-500" />
                    Partner pack (PDF)
                  </span>
                  <ChevronRight className="h-4 w-4 text-slate-600" aria-hidden />
                </Link>
              </div>
            </nav>

            <div className="border-t border-slate-800 p-4">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8 border border-slate-700">
                    <AvatarFallback className="bg-slate-800 text-xs text-slate-200">A</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 leading-tight">
                    <p className="max-w-32 truncate text-sm font-medium text-slate-200">
                      {email || 'Administrator'}
                    </p>
                    <p className="text-xs text-slate-500">Secure session</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-slate-400 hover:bg-white/10 hover:text-white"
                  onClick={handleLogout}
                  aria-label="Logout"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
              <Button
                variant="outline"
                className="w-full justify-between border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800 hover:text-white"
                onClick={() => window.open('/home', '_blank', 'noopener,noreferrer')}
              >
                Visit site
                <ExternalLink className="h-4 w-4 text-slate-400" />
              </Button>
            </div>
          </div>
        </aside>

        <div className="flex min-w-0 flex-col overflow-hidden">
          <header className="z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
            <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-3 px-4 py-3 lg:px-6">
              <div className="flex min-w-0 items-center gap-2 text-sm text-slate-500">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-slate-950 text-[10px] font-bold text-white md:hidden">
                  JM
                </span>
                <span className="hidden font-medium text-slate-700 sm:inline">Operations</span>
                <ChevronRight className="hidden h-4 w-4 sm:block" aria-hidden />
                <span className="truncate">{activeNav}</span>
              </div>
              <div className="flex items-center gap-2">
                <Dialog open={whatsNewOpen} onOpenChange={setWhatsNewOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="hidden lg:inline-flex">
                      <Sparkles className="mr-2 h-4 w-4" />
                      What&apos;s new?
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeaderUI>
                      <DialogTitleUI>What&apos;s new</DialogTitleUI>
                      <DialogDesc>
                        Recent improvements for Jet Ski &amp; More.
                      </DialogDesc>
                    </DialogHeaderUI>
                    <div className="space-y-3 text-sm text-slate-700">
                      <div>
                        <p className="font-semibold">Booking controls</p>
                        <p className="text-slate-600">
                          Turn jet ski bookings, boat ride requests, and fishing charter enquiries on/off from Admin.
                        </p>
                      </div>
                      <div>
                        <p className="font-semibold">Safety &amp; Compliance page</p>
                        <p className="text-slate-600">
                          A dedicated credibility page for customers, partners, and authorities.
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button asChild size="sm">
                        <Link to="/admin/booking-controls">Open booking controls</Link>
                      </Button>
                      <Button asChild size="sm" variant="outline">
                        <Link to="/safety">Open safety page</Link>
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
                <Button variant="outline" size="sm" onClick={handleRefresh}>
                  <RefreshCw className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Refresh</span>
                </Button>
                <Button variant="outline" size="sm" className="hidden xl:inline-flex" onClick={handleCopyLink}>
                  <Copy className="mr-2 h-4 w-4" />
                  Copy link
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="hidden sm:inline-flex"
                  onClick={() => window.open('/home', '_blank', 'noopener,noreferrer')}
                >
                  Visit site
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  onClick={handleLogout}
                  aria-label="Logout"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <nav
              className="flex gap-1 overflow-x-auto border-t border-slate-100 px-3 py-2 md:hidden"
              aria-label="Admin navigation"
            >
              {navItems
                .filter((item) => item.id !== 'home')
                .map((item) => {
                  const active = pathname.startsWith(item.to)
                  return (
                    <Link
                      key={item.id}
                      to={item.to as any}
                      preload="intent"
                      className={cn(
                        'inline-flex flex-none items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition',
                        active
                          ? 'bg-slate-950 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-950',
                      )}
                    >
                      <item.icon className="h-3.5 w-3.5" />
                      {item.label}
                    </Link>
                  )
                })}
              <Link
                to="/admin/booking-controls"
                className={cn(
                  'inline-flex flex-none items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition',
                  pathname.startsWith('/admin/booking-controls')
                    ? 'bg-slate-950 text-white'
                    : 'bg-slate-100 text-slate-600',
                )}
              >
                <SlidersHorizontal className="h-3.5 w-3.5" />
                Settings
              </Link>
            </nav>
          </header>

          <main className="mx-auto w-full max-w-[1600px] flex-1 space-y-6 overflow-y-auto px-4 py-5 lg:px-6 lg:py-6">
            {error ? (
              <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ) : null}

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
