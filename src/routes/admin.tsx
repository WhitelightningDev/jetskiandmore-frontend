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
  Search,
  Settings,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
} from 'lucide-react'

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
import type { AnalyticsSummary, Booking, PageViewAnalytics, QuizSubmission } from '@/admin/types'
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
  const [bookings, setBookings] = React.useState<Booking[]>([])
  const [analytics, setAnalytics] = React.useState<AnalyticsSummary | null>(null)
  const [pageViews, setPageViews] = React.useState<PageViewAnalytics | null>(null)
  const [quizSubs, setQuizSubs] = React.useState<QuizSubmission[]>([])
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
        const data = (await res.json()) as Booking[]
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
        const qData = (await qRes.json()) as QuizSubmission[]
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
    <div className="h-screen overflow-hidden bg-white text-slate-900">
      <div className="grid h-screen grid-cols-1 md:grid-cols-[280px_1fr]">
        <aside className="hidden h-screen overflow-y-auto border-r border-slate-200 bg-white md:block">
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between px-4 py-4">
              <div className="flex items-center gap-2">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-sm font-semibold">
                  JM
                </span>
                <div className="leading-tight">
                  <p className="text-sm font-semibold">Jet Ski &amp; More</p>
                  <p className="text-xs text-slate-500">Admin</p>
                </div>
              </div>
              <Badge variant="outline" className="border-slate-200 bg-white text-slate-600">
                Online
              </Badge>
            </div>

            <div className="px-4 pb-3">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" aria-hidden />
                <Input
                  placeholder="Search"
                  className="h-9 pl-9 pr-10"
                  disabled
                />
                <kbd className="pointer-events-none absolute right-2 top-2 rounded border border-slate-200 bg-slate-50 px-1.5 text-[10px] text-slate-500">
                  ⌘K
                </kbd>
              </div>
            </div>

            <nav className="flex-1 px-2 pb-4">
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
                        'group flex items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm transition',
                        active ? 'bg-slate-100 text-slate-900' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900',
                      )}
                    >
                      <span className="flex items-center gap-2">
                        <item.icon className={cn('h-4 w-4', active ? 'text-slate-900' : 'text-slate-500')} />
                        <span className="font-medium">{item.label}</span>
                        {typeof count === 'number' && count > 0 ? (
                          <span className="ml-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-slate-100 px-1.5 text-[11px] font-semibold text-slate-700">
                            {count > 99 ? '99+' : count}
                          </span>
                        ) : null}
                      </span>
                      <ChevronRight className="h-4 w-4 text-slate-400 opacity-0 transition group-hover:opacity-100" aria-hidden />
                    </Link>
                  )
                })}
              </div>

              <Separator className="my-4" />

              <div className="space-y-1">
                <Link
                  to="/admin/booking-controls"
                  className="flex items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                >
                  <span className="flex items-center gap-2">
                    <SlidersHorizontal className="h-4 w-4 text-slate-500" />
                    Settings
                  </span>
                  <ChevronRight className="h-4 w-4 text-slate-400" aria-hidden />
                </Link>
                <Link
                  to={'/admin/support' as any}
                  className="flex items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                >
                  <span className="flex items-center gap-2">
                    <Settings className="h-4 w-4 text-slate-500" />
                    Support
                  </span>
                  <ChevronRight className="h-4 w-4 text-slate-400" aria-hidden />
                </Link>
                <Link
                  to={'/partner-pack' as any}
                  className="flex items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                >
                  <span className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-slate-500" />
                    Partner pack (PDF)
                  </span>
                  <ChevronRight className="h-4 w-4 text-slate-400" aria-hidden />
                </Link>
              </div>
            </nav>

            <div className="border-t border-slate-200 p-4">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-xs">A</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 leading-tight">
                    <p className="truncate text-sm font-medium">{email || 'Admin'}</p>
                    <p className="text-xs text-slate-500">Signed in</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={handleLogout} aria-label="Logout">
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
              <Button
                variant="outline"
                className="w-full justify-between"
                onClick={() => window.open('/home', '_blank', 'noopener,noreferrer')}
              >
                Visit site
                <ExternalLink className="h-4 w-4 text-slate-500" />
              </Button>
            </div>
          </div>
        </aside>

        <div className="flex min-w-0 flex-col overflow-hidden">
          <header className="border-b border-slate-200 bg-white">
            <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 items-center gap-2 text-sm text-slate-500">
                <span className="font-medium text-slate-700">Jet Ski &amp; More</span>
                <ChevronRight className="h-4 w-4" aria-hidden />
                <span className="truncate">{activeNav}</span>
              </div>
              <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                <Dialog open={whatsNewOpen} onOpenChange={setWhatsNewOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
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
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Refresh
                </Button>
                <Button variant="outline" size="sm" onClick={handleCopyLink}>
                  <Copy className="mr-2 h-4 w-4" />
                  Copy link
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open('/home', '_blank', 'noopener,noreferrer')}
                >
                  Visit site
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </header>

          <main className="mx-auto w-full max-w-7xl flex-1 space-y-6 overflow-y-auto px-4 py-6">
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
