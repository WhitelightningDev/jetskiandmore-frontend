import * as React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Search } from 'lucide-react'

import type { PageViewAnalyticsItem } from '@/admin/types'
import { useAdminContext } from '@/admin/context'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export const Route = createFileRoute('/admin/top-pages')({
  component: AdminTopPagesPage,
})

type SortKey = 'views' | 'sessions' | 'duration' | 'recent'

function AdminTopPagesPage() {
  const { pageViews, loadingPageViews } = useAdminContext()
  const [query, setQuery] = React.useState('')
  const [sort, setSort] = React.useState<SortKey>('views')
  const pages = React.useMemo(() => {
    const needle = query.trim().toLowerCase()
    return (pageViews?.items ?? [])
      .filter((page) => !page.path.startsWith('/admin'))
      .filter((page) => !needle || page.path.toLowerCase().includes(needle))
      .sort((a, b) => comparePages(a, b, sort))
  }, [pageViews?.items, query, sort])

  const topPage = pages[0]
  const trackedPublicViews = React.useMemo(
    () => (pageViews?.items ?? []).filter((page) => !page.path.startsWith('/admin')),
    [pageViews?.items],
  )
  const trackedPublicViewCount = trackedPublicViews.reduce((sum, page) => sum + page.views, 0)
  const averageSecondsPerView = trackedPublicViewCount
    ? (trackedPublicViews.reduce((sum, page) => sum + (page.totalDurationSeconds || 0), 0) / trackedPublicViewCount)
    : null

  return (
    <div className="space-y-6 pb-8">
      <header className="space-y-2">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-cyan-700">Traffic</p>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-950">Top pages</h1>
        <p className="max-w-3xl text-sm leading-6 text-slate-600">
          Compare page views, sessions and time on page to see what visitors use and where to improve the booking journey.
        </p>
      </header>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard label="Public page views" value={loadingPageViews ? '—' : trackedPublicViewCount.toLocaleString()} />
        <SummaryCard label="Unique sessions" value={loadingPageViews ? '—' : (pageViews?.totalUniqueSessions ?? 0).toLocaleString()} />
        <SummaryCard label="Unique visitors" value={loadingPageViews ? '—' : (pageViews?.totalUniqueVisitors ?? 0).toLocaleString()} />
        <SummaryCard label="Avg. time per view" value={loadingPageViews ? '—' : formatDuration(averageSecondsPerView)} />
      </section>

      <Card className="border-slate-200 bg-white shadow-sm">
        <CardHeader className="gap-4 border-b border-slate-100 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <CardTitle className="text-base text-slate-950">Page performance</CardTitle>
            <CardDescription className="mt-1 text-slate-600">
              {loadingPageViews ? 'Loading tracked pages…' : `${pages.length.toLocaleString()} public paths · analytics feed contains up to 50 paths`}
            </CardDescription>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search page paths"
                aria-label="Search page paths"
                className="pl-9 sm:w-64"
              />
            </div>
            <label className="sr-only" htmlFor="top-pages-sort">Sort pages</label>
            <select
              id="top-pages-sort"
              value={sort}
              onChange={(event) => setSort(event.target.value as SortKey)}
              className="h-10 rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="views">Most views</option>
              <option value="sessions">Most sessions</option>
              <option value="duration">Longest average time</option>
              <option value="recent">Recently seen</option>
            </select>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loadingPageViews ? (
            <p className="p-6 text-sm text-slate-600">Loading page analytics…</p>
          ) : pages.length === 0 ? (
            <p className="p-6 text-sm text-slate-600">{query ? 'No pages match that search.' : 'No public page view data is available yet.'}</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-64">Page</TableHead>
                    <TableHead className="text-right">Views</TableHead>
                    <TableHead className="text-right">Sessions</TableHead>
                    <TableHead className="text-right">Views / session</TableHead>
                    <TableHead className="text-right">Avg. time</TableHead>
                    <TableHead className="text-right">Last seen</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pages.map((page, index) => (
                    <TableRow key={`${page.path}-${index}`}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="min-w-8 justify-center">{index + 1}</Badge>
                          <a href={safePagePath(page.path)} target="_blank" rel="noreferrer" className="font-medium text-slate-900 underline-offset-4 hover:underline">
                            {page.path || '/'}
                          </a>
                        </div>
                      </TableCell>
                      <TableCell className="text-right tabular-nums">{page.views.toLocaleString()}</TableCell>
                      <TableCell className="text-right tabular-nums">{page.uniqueSessions.toLocaleString()}</TableCell>
                      <TableCell className="text-right tabular-nums">{page.uniqueSessions ? (page.views / page.uniqueSessions).toFixed(2) : '—'}</TableCell>
                      <TableCell className="text-right tabular-nums">{formatDuration(page.avgDurationSeconds)}</TableCell>
                      <TableCell className="whitespace-nowrap text-right text-slate-500">{formatDate(page.lastSeen)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {topPage ? (
        <p className="text-xs leading-5 text-slate-500">
          Highest-traffic public page in this snapshot: <strong className="font-semibold text-slate-700">{topPage.path || '/'}</strong> with {topPage.views.toLocaleString()} views.
          Time on page is aggregated from recorded sessions; it is directional and should be read alongside bookings and enquiries.
        </p>
      ) : null}
    </div>
  )
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <Card className="border-slate-200 bg-white shadow-sm">
      <CardContent className="p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
        <p className="mt-2 text-2xl font-semibold tabular-nums text-slate-950">{value}</p>
      </CardContent>
    </Card>
  )
}

function comparePages(a: PageViewAnalyticsItem, b: PageViewAnalyticsItem, sort: SortKey) {
  if (sort === 'sessions') return b.uniqueSessions - a.uniqueSessions || b.views - a.views
  if (sort === 'duration') return (b.avgDurationSeconds ?? 0) - (a.avgDurationSeconds ?? 0) || b.views - a.views
  if (sort === 'recent') return toTimestamp(b.lastSeen) - toTimestamp(a.lastSeen) || b.views - a.views
  return b.views - a.views || b.uniqueSessions - a.uniqueSessions
}

function toTimestamp(value?: string | null) {
  if (!value) return 0
  const date = new Date(value).getTime()
  return Number.isNaN(date) ? 0 : date
}

function formatDuration(value?: number | null) {
  if (value == null || !Number.isFinite(value) || value < 0) return '—'
  const seconds = Math.round(value)
  if (seconds < 60) return `${seconds}s`
  return `${Math.floor(seconds / 60)}m ${String(seconds % 60).padStart(2, '0')}s`
}

function formatDate(value?: string | null) {
  const timestamp = toTimestamp(value)
  if (!timestamp) return '—'
  return new Intl.DateTimeFormat('en-ZA', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Africa/Johannesburg',
  }).format(timestamp)
}

function safePagePath(path: string) {
  return path.startsWith('/') && !path.startsWith('//') ? path : '/'
}
