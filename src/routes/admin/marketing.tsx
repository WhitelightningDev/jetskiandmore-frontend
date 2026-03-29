import * as React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from 'recharts'
import { Copy, Download, Eye, Mail, Plus, RefreshCw, Send, Trash2 } from 'lucide-react'

import { API_BASE } from '@/lib/api'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { useAdminContext } from '@/admin/context'
import { toast } from '@/components/ui/use-toast'
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'

export const Route = createFileRoute('/admin/marketing')({
  component: AdminMarketingPage,
})

const sendHoursChartConfig: ChartConfig = {
  count: { label: 'Emails sent', color: '#a78bfa' },
}

const bookingHoursChartConfig: ChartConfig = {
  count: { label: 'Bookings', color: '#22c55e' },
}

type CampaignAudience = {
  rideId?: string | null
  status?: string | null
  lastNDays?: number | null
  includeManual?: boolean | null
}

type MarketingCampaign = {
  id: string
  name: string
  subject: string
  preheader?: string | null
  content?: string | null
  ctaLabel?: string | null
  ctaUrl?: string | null
  audience?: CampaignAudience | null
  html?: string | null
  status: 'draft' | 'sent'
  createdAt?: string | null
  updatedAt?: string | null
  sentAt?: string | null
  stats?: { attempted: number; sent: number; failed: number } | null
}

type AudienceSummary = {
  totalUniqueEmails: number
  uniqueEmailsLast30Days: number
  uniqueEmailsLast90Days: number
  byRide: { key: string; count: number }[]
  topDomains: { key: string; count: number }[]
}

type MarketingEmailEvent = {
  id: string
  campaignId: string
  email: string
  kind: string
  ok: boolean
  error?: string | null
  subject?: string | null
  sentAt: string
}

type HourStat = { hour: number; count: number }
type DayOfWeekStat = { day: number; count: number }

type MarketingSendStats = {
  totalAttempted: number
  totalSent: number
  totalFailed: number
  byHour: HourStat[]
  byDayOfWeek: DayOfWeekStat[]
}

type HolidayItem = { date: string; name: string }

type CampaignIdea = {
  title: string
  subject: string
  preheader?: string | null
  content: string
  ctaLabel?: string | null
  ctaUrl?: string | null
  audience?: CampaignAudience | null
}

type MarketingInsights = {
  industry: string
  location: string
  upcomingHolidays: HolidayItem[]
  recommendedSendHours: number[]
  bookingByHour: HourStat[]
  bookingByDayOfWeek: DayOfWeekStat[]
  whatToSend: string[]
  whatNotToSend: string[]
  ideas: CampaignIdea[]
}

type MarketingAsset = {
  id: string
  filename: string
  contentType: string
  size: number
  url: string
  createdAt?: string | null
}

function AdminMarketingPage() {
  const { token, bookings, setError, handleLogout } = useAdminContext()
  const [campaigns, setCampaigns] = React.useState<MarketingCampaign[]>([])
  const [audience, setAudience] = React.useState<AudienceSummary | null>(null)
  const [recipients, setRecipients] = React.useState<string[]>([])
  const [recipientsUpdatedAt, setRecipientsUpdatedAt] = React.useState<Date | null>(null)
  const [loading, setLoading] = React.useState(false)
  const [loadingAudience, setLoadingAudience] = React.useState(false)
  const [loadingRecipients, setLoadingRecipients] = React.useState(false)
  const [manualEmails, setManualEmails] = React.useState<string[]>([])
  const [manualUpdatedAt, setManualUpdatedAt] = React.useState<Date | null>(null)
  const [loadingManual, setLoadingManual] = React.useState(false)
  const fileInputRef = React.useRef<HTMLInputElement | null>(null)
  const [loadingPerformance, setLoadingPerformance] = React.useState(false)
  const [sendStats, setSendStats] = React.useState<MarketingSendStats | null>(null)
  const [insights, setInsights] = React.useState<MarketingInsights | null>(null)
  const [emailEvents, setEmailEvents] = React.useState<MarketingEmailEvent[]>([])

  const rideIds = React.useMemo(() => {
    const ids = Array.from(new Set(bookings.map((b) => b.rideId).filter(Boolean))).sort()
    return ids.length > 0 ? ids : ['joy', 'group', '30-1', '60-1']
  }, [bookings])

  const [composerOpen, setComposerOpen] = React.useState(false)
  const [editing, setEditing] = React.useState<MarketingCampaign | null>(null)
  const [previewTarget, setPreviewTarget] = React.useState<MarketingCampaign | null>(null)
  const [previewOpen, setPreviewOpen] = React.useState(false)

  const [deleteTarget, setDeleteTarget] = React.useState<MarketingCampaign | null>(null)
  const [deleteOpen, setDeleteOpen] = React.useState(false)

  const [testTarget, setTestTarget] = React.useState<MarketingCampaign | null>(null)
  const [testOpen, setTestOpen] = React.useState(false)
  const [testEmail, setTestEmail] = React.useState('')
  const [testSending, setTestSending] = React.useState(false)

  const [sendTarget, setSendTarget] = React.useState<MarketingCampaign | null>(null)
  const [sendPreview, setSendPreview] = React.useState<{ count: number; sample: string[] } | null>(null)
  const [sendOpen, setSendOpen] = React.useState(false)
  const [sendSending, setSendSending] = React.useState(false)

  const [recipientRideId, setRecipientRideId] = React.useState<string>('all')
  const [recipientStatus, setRecipientStatus] = React.useState<string>('all')
  const [recipientLastNDays, setRecipientLastNDays] = React.useState<string>('')

  async function fetchAdmin(path: string, init?: RequestInit) {
    if (!token) throw new Error('Session expired. Please sign in again.')
    const res = await fetch(`${API_BASE}${path}`, {
      ...init,
      headers: {
        ...(init?.headers || {}),
        Authorization: `Bearer ${token}`,
      },
    })
    if (res.status === 401) {
      setError('Session expired. Please sign in again.')
      handleLogout()
      throw new Error('Unauthorized')
    }
    return res
  }

  async function refreshCampaigns() {
    if (!token) return
    try {
      setLoading(true)
      const res = await fetchAdmin(`/api/admin/marketing/campaigns?limit=50`)
      if (!res.ok) {
        const data = await res.json().catch(() => null)
        throw new Error(data?.detail || data?.message || res.statusText)
      }
      const data = (await res.json()) as { items: MarketingCampaign[] }
      setCampaigns(data.items || [])
    } catch (e: any) {
      setError(e?.message ?? 'Failed to load campaigns')
    } finally {
      setLoading(false)
    }
  }

  async function refreshAudienceSummary() {
    if (!token) return
    try {
      setLoadingAudience(true)
      const res = await fetchAdmin(`/api/admin/marketing/audience/summary`)
      if (!res.ok) {
        const data = await res.json().catch(() => null)
        throw new Error(data?.detail || data?.message || res.statusText)
      }
      const data = (await res.json()) as AudienceSummary
      setAudience(data)
    } catch {
      // Non-blocking: show the rest of the page even if this fails.
      setAudience(null)
    } finally {
      setLoadingAudience(false)
    }
  }

  async function loadBookingEmails(): Promise<string[]> {
    const limit = 100
    const maxPages = 50
    const statusFilter = recipientStatus === 'all' ? '' : `&status_filter=${encodeURIComponent(recipientStatus)}`

    const bookingsRaw: Array<{ email?: string; rideId?: string; createdAt?: string | null }> = []
    for (let page = 0; page < maxPages; page += 1) {
      const skip = page * limit
      const res = await fetchAdmin(`/api/admin/bookings?limit=${limit}&skip=${skip}${statusFilter}`)
      if (!res.ok) {
        const data = await res.json().catch(() => null)
        throw new Error(data?.detail || data?.message || res.statusText)
      }
      const items = (await res.json()) as Array<{ email?: string; rideId?: string; createdAt?: string | null }>
      if (!items || items.length === 0) break
      bookingsRaw.push(...items)
      if (items.length < limit) break
    }

    const lastNDaysNum = recipientLastNDays.trim() ? Number(recipientLastNDays) : null
    const cutoff =
      Number.isFinite(lastNDaysNum as any) && (lastNDaysNum as any) > 0
        ? Date.now() - Number(lastNDaysNum) * 86400000
        : null
    const rideFilter = recipientRideId === 'all' ? null : recipientRideId

    const seen = new Set<string>()
    const out: string[] = []
    for (const b of bookingsRaw) {
      if (rideFilter && String(b.rideId || '') !== rideFilter) continue
      if (cutoff && b.createdAt) {
        const dt = new Date(b.createdAt)
        if (!Number.isNaN(dt.getTime()) && dt.getTime() < cutoff) continue
      }
      const email = String(b.email || '').trim().toLowerCase()
      if (!email || !email.includes('@')) continue
      if (seen.has(email)) continue
      seen.add(email)
      out.push(email)
    }
    return out
  }

  async function refreshRecipients() {
    if (!token) return
    try {
      setLoadingRecipients(true)
      const out = await loadBookingEmails()
      setRecipients(out)
      setRecipientsUpdatedAt(new Date())
      toast({ title: 'Emails updated', description: `${out.length.toLocaleString()} emails loaded from bookings.`, variant: 'success' })
    } catch (e: any) {
      setError(e?.message ?? 'Failed to load recipients')
      toast({ title: 'Update failed', description: e?.message ?? 'Could not load booking emails.', variant: 'destructive' })
    } finally {
      setLoadingRecipients(false)
    }
  }

  async function refreshAudienceAll() {
    await Promise.allSettled([refreshAudienceSummary(), refreshRecipients()])
  }

  async function refreshManualEmails() {
    if (!token) return
    try {
      setLoadingManual(true)
      const res = await fetchAdmin(`/api/admin/marketing/manual-recipients?limit=50000`)
      if (!res.ok) {
        const data = await res.json().catch(() => null)
        throw new Error(data?.detail || data?.message || res.statusText)
      }
      const data = (await res.json()) as { emails: string[]; total: number }
      setManualEmails((data.emails || []).filter(Boolean))
      setManualUpdatedAt(new Date())
    } catch (e: any) {
      setError(e?.message ?? 'Failed to load uploaded emails')
      toast({ title: 'Load failed', description: e?.message ?? 'Could not load uploaded emails.', variant: 'destructive' })
    } finally {
      setLoadingManual(false)
    }
  }

  async function uploadManualCsv(file: File) {
    if (!token) return
    const fd = new FormData()
    fd.append('file', file)
    const res = await fetchAdmin(`/api/admin/marketing/manual-recipients/upload`, {
      method: 'POST',
      body: fd,
    })
    if (!res.ok) {
      const data = await res.json().catch(() => null)
      throw new Error(data?.detail || data?.message || res.statusText)
    }
    return (await res.json()) as { added: number; total: number; invalid: number }
  }

  async function refreshPerformanceAll() {
    if (!token) return
    try {
      setLoadingPerformance(true)
      const [statsRes, insightsRes, eventsRes] = await Promise.all([
        fetchAdmin(`/api/admin/marketing/send-stats?days=180`),
        fetchAdmin(`/api/admin/marketing/insights?lookbackDays=365`),
        fetchAdmin(`/api/admin/marketing/email-events?limit=50`),
      ])

      if (statsRes.ok) {
        const data = (await statsRes.json()) as MarketingSendStats
        setSendStats(data)
      } else {
        setSendStats(null)
      }

      if (insightsRes.ok) {
        const data = (await insightsRes.json()) as MarketingInsights
        setInsights(data)
      } else {
        setInsights(null)
      }

      if (eventsRes.ok) {
        const data = (await eventsRes.json()) as { items: MarketingEmailEvent[] }
        setEmailEvents(data.items || [])
      } else {
        setEmailEvents([])
      }
    } catch (e: any) {
      setError(e?.message ?? 'Failed to load marketing performance')
      toast({ title: 'Performance refresh failed', description: e?.message ?? 'Please try again.', variant: 'destructive' })
    } finally {
      setLoadingPerformance(false)
    }
  }

  React.useEffect(() => {
    if (!token) return
    refreshCampaigns()
    refreshAudienceAll()
    refreshManualEmails()
    refreshPerformanceAll()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  async function upsertCampaign(input: Partial<MarketingCampaign>): Promise<MarketingCampaign> {
    if (!token) throw new Error('Session expired. Please sign in again.')
    const payload = {
      name: input.name,
      subject: input.subject,
      preheader: input.preheader ?? null,
      content: input.content ?? null,
      ctaLabel: input.ctaLabel ?? null,
      ctaUrl: input.ctaUrl ?? null,
      audience: input.audience ?? null,
      html: renderEmailHtml({
        title: input.subject || input.name || 'Jet Ski & More',
        preheader: input.preheader ?? null,
        content: input.content ?? null,
        ctaLabel: input.ctaLabel ?? null,
        ctaUrl: input.ctaUrl ?? null,
      }),
    }

    const isUpdate = Boolean(input.id)
    const path = isUpdate
      ? `/api/admin/marketing/campaigns/${encodeURIComponent(String(input.id))}`
      : `/api/admin/marketing/campaigns`

    const res = await fetchAdmin(path, {
      method: isUpdate ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (!res.ok) {
      const data = await res.json().catch(() => null)
      throw new Error(data?.detail || data?.message || res.statusText)
    }
    const saved = (await res.json()) as MarketingCampaign
    setCampaigns((prev) => {
      const next = prev.filter((c) => c.id !== saved.id)
      return [saved, ...next].sort((a, b) => (String(b.updatedAt || b.createdAt || '')).localeCompare(String(a.updatedAt || a.createdAt || '')))
    })
    return saved
  }

  async function deleteCampaign(id: string) {
    if (!token) return
    const res = await fetchAdmin(`/api/admin/marketing/campaigns/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    })
    if (!res.ok) {
      const data = await res.json().catch(() => null)
      throw new Error(data?.detail || data?.message || res.statusText)
    }
    setCampaigns((prev) => prev.filter((c) => c.id !== id))
    toast({ title: 'Campaign deleted', variant: 'success' })
  }

  async function sendTest(id: string, toEmail: string) {
    if (!token) return
    const res = await fetchAdmin(`/api/admin/marketing/campaigns/${encodeURIComponent(id)}/send-test`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ toEmail }),
    })
    if (!res.ok) {
      const data = await res.json().catch(() => null)
      throw new Error(data?.detail || data?.message || res.statusText)
    }
    toast({
      title: 'Test email sent',
      description: `Sent to ${toEmail}. Check inbox/spam.`,
      variant: 'success',
    })
  }

  async function getSendPreview(id: string) {
    if (!token) return
    const previewRes = await fetchAdmin(`/api/admin/marketing/campaigns/${encodeURIComponent(id)}/recipients-preview`, {
      method: 'GET',
    })
    if (!previewRes.ok) {
      const data = await previewRes.json().catch(() => null)
      throw new Error(data?.detail || data?.message || previewRes.statusText)
    }
    return (await previewRes.json()) as { count: number; sample: string[] }
  }

  async function sendCampaign(id: string) {
    if (!token) return
    const res = await fetchAdmin(`/api/admin/marketing/campaigns/${encodeURIComponent(id)}/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    })
    if (!res.ok) {
      const data = await res.json().catch(() => null)
      throw new Error(data?.detail || data?.message || res.statusText)
    }
    const updated = (await res.json()) as MarketingCampaign
    setCampaigns((prev) => prev.map((c) => (c.id === updated.id ? updated : c)))
    toast({
      title: 'Campaign sent',
      description: `Sent: ${updated.stats?.sent ?? 0} • Failed: ${updated.stats?.failed ?? 0}`,
      variant: 'success',
    })
  }

  async function downloadRecipientsCsv() {
    if (!token) return
    const emails = await loadBookingEmails()
    setRecipients(emails)
    setRecipientsUpdatedAt(new Date())
    downloadCsvFromEmails(emails, `jetskiandmore-recipients-${new Date().toISOString().slice(0, 10)}.csv`)
    toast({ title: 'CSV exported', description: 'Downloaded recipients list.', variant: 'success' })
  }

  async function copyAllRecipients() {
    try {
      await navigator.clipboard.writeText((recipients || []).join('\n'))
    } catch {}
  }

  async function openSendDialog(campaign: MarketingCampaign) {
    try {
      setSendTarget(campaign)
      setSendPreview(null)
      setSendOpen(true)
      const preview = await getSendPreview(campaign.id)
      setSendPreview(preview || null)
    } catch (e: any) {
      setError(e?.message ?? 'Failed to load recipient preview')
      toast({ title: 'Could not load recipients', description: e?.message ?? 'Please try again.', variant: 'destructive' })
    }
  }

  function openPreview(campaign: MarketingCampaign) {
    setPreviewTarget(campaign)
    setPreviewOpen(true)
  }

  const previewHtml = React.useMemo(() => {
    if (!previewTarget) return ''
    return (
      previewTarget.html ??
      renderEmailHtml({
        title: previewTarget.subject || previewTarget.name || 'Jet Ski & More',
        preheader: previewTarget.preheader ?? null,
        content: previewTarget.content ?? null,
        ctaLabel: previewTarget.ctaLabel ?? null,
        ctaUrl: previewTarget.ctaUrl ?? null,
      })
    )
  }, [previewTarget])

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Marketing</h1>
        <p className="text-sm text-slate-600">
          Create email campaigns, export customer lists, and produce copy-ready marketing material.
        </p>
      </header>

      <Tabs defaultValue="campaigns">
        <TabsList>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="audience">Audience</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="assets">Assets</TabsTrigger>
        </TabsList>

	        <TabsContent value="campaigns">
	          <Card className="border-slate-200 bg-white shadow-sm">
	            <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
	              <div>
	                <CardTitle className="text-base text-slate-900">Email campaigns</CardTitle>
	                <CardDescription className="text-slate-600">
	                  Draft, test, and send campaigns to your customer list.
	                </CardDescription>
	              </div>

	              <div className="flex flex-wrap items-center justify-end gap-2">
	                <Button
	                  variant="outline"
	                  size="sm"
	                  onClick={async () => {
	                    try {
	                      const saved = await upsertCampaign(buildThankYouCampaignDraft())
	                      setEditing(saved)
	                      setComposerOpen(true)
	                    } catch (e: any) {
	                      setError(e?.message ?? 'Failed to create campaign')
	                    }
	                  }}
	                >
	                  Create thank-you campaign
	                </Button>
	                <Button variant="outline" size="sm" onClick={refreshCampaigns} disabled={loading}>
	                  <RefreshCw className="mr-2 h-4 w-4" />
	                  Refresh
	                </Button>
	                <Dialog open={composerOpen} onOpenChange={setComposerOpen}>
	                  <DialogTrigger asChild>
	                    <Button
	                      size="sm"
	                      onClick={() => {
	                        setEditing(null)
	                      }}
	                    >
	                      <Plus className="mr-2 h-4 w-4" />
	                      New campaign
	                    </Button>
	                  </DialogTrigger>
	                <DialogContent className="w-[95vw] max-w-5xl max-h-[calc(100vh-2rem)] overflow-y-auto">
	                  <DialogHeader>
	                    <DialogTitle>{editing ? 'Edit campaign' : 'New campaign'}</DialogTitle>
	                    <DialogDescription>Build a clean email (HTML is generated automatically).</DialogDescription>
	                  </DialogHeader>
                  <CampaignComposer
                    rideIds={rideIds}
                    initial={editing}
                    fetchAdmin={fetchAdmin}
                    onCancel={() => {
                      setEditing(null)
                      setComposerOpen(false)
                    }}
	                    onSave={async (draft) => {
	                      const saved = await upsertCampaign({ ...editing, ...draft })
	                      setEditing(null)
	                      setComposerOpen(false)
	                      return saved
	                    }}
	                  />
	                </DialogContent>
	                </Dialog>
	              </div>
	            </CardHeader>
	            <CardContent className="overflow-x-auto">
	              {loading ? (
	                <div className="p-4 text-sm text-slate-600">Loading campaigns…</div>
	              ) : campaigns.length === 0 ? (
	                <div className="p-4 text-sm text-slate-600">No campaigns yet.</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Audience</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {campaigns.map((c) => (
                      <TableRow key={c.id}>
                        <TableCell className="font-medium">{c.name}</TableCell>
                        <TableCell className="max-w-[380px] truncate text-slate-700">{c.subject}</TableCell>
                        <TableCell>
                          <Badge variant={c.status === 'sent' ? 'default' : 'secondary'}>
                            {c.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-slate-600">
                          {formatAudience(c.audience)}
                        </TableCell>
	                        <TableCell className="text-right">
	                          <div className="inline-flex flex-wrap justify-end gap-2">
	                            <Button
	                              variant="outline"
	                              size="sm"
	                              onClick={() => {
	                                setEditing(c)
	                                setComposerOpen(true)
	                              }}
	                            >
	                              Edit
	                            </Button>
	                            <Button variant="outline" size="sm" onClick={() => openPreview(c)}>
	                              <Eye className="mr-2 h-4 w-4" />
	                              Preview
	                            </Button>
	                            <Button
	                              variant="outline"
	                              size="sm"
	                              onClick={() => {
	                                setTestTarget(c)
                                setTestEmail('')
                                setTestOpen(true)
                              }}
                            >
                              <Send className="mr-2 h-4 w-4" />
                              Test
                            </Button>
		                            <Button size="sm" onClick={() => openSendDialog(c)} disabled={c.status === 'sent'}>
		                              <Mail className="mr-2 h-4 w-4" />
		                              Send
		                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setDeleteTarget(c)
                                setDeleteOpen(true)
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
	          </Card>
	        </TabsContent>

	        <TabsContent value="audience">
	          <div className="grid gap-4 lg:grid-cols-2">
	            <Card className="border-slate-200 bg-white shadow-sm">
	              <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
	                <div>
	                  <CardTitle className="text-base text-slate-900">Audience summary</CardTitle>
	                  <CardDescription className="text-slate-600">Unique customer emails derived from bookings.</CardDescription>
	                </div>
	                <div className="flex flex-wrap items-center justify-end gap-2">
	                  <Button variant="outline" size="sm" onClick={refreshAudienceAll} disabled={loadingAudience || loadingRecipients}>
	                    <RefreshCw className="mr-2 h-4 w-4" />
	                    Update
	                  </Button>
	                  <Button variant="outline" size="sm" onClick={downloadRecipientsCsv}>
	                    <Download className="mr-2 h-4 w-4" />
	                    Export CSV
	                  </Button>
	                </div>
	              </CardHeader>
	              <CardContent className="space-y-4">
	                {loadingAudience ? (
	                  <p className="text-sm text-slate-600">Loading audience…</p>
                ) : !audience ? (
                  <p className="text-sm text-slate-600">No audience data yet.</p>
                ) : (
                  <>
                    <div className="grid gap-3 sm:grid-cols-3">
                      <MiniStat label="Unique emails" value={audience.totalUniqueEmails} />
                      <MiniStat label="Last 30 days" value={audience.uniqueEmailsLast30Days} />
                      <MiniStat label="Last 90 days" value={audience.uniqueEmailsLast90Days} />
                    </div>
                    <Separator />
                    <div className="grid gap-6 sm:grid-cols-2">
                      <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">By ride</p>
                        <MiniList items={audience.byRide} />
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Top email domains</p>
                        <MiniList items={audience.topDomains} />
                      </div>
                    </div>
                  </>
                )}
	              </CardContent>
	            </Card>

	            <Card className="border-slate-200 bg-white shadow-sm">
	              <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
	                <div>
	                  <CardTitle className="text-base text-slate-900">All booking emails</CardTitle>
	                  <CardDescription className="text-slate-600">
	                    This list updates from the bookings database (used for campaign recipients).
	                  </CardDescription>
	                </div>
	                <div className="flex flex-wrap items-center justify-end gap-2">
	                  <Button
	                    variant="outline"
	                    size="sm"
	                    onClick={() => downloadRecipientsCsv().catch(() => {})}
	                    disabled={loadingRecipients}
	                  >
	                    <Download className="mr-2 h-4 w-4" />
	                    Export CSV
	                  </Button>
	                  <Button variant="outline" size="sm" onClick={refreshRecipients} disabled={loadingRecipients}>
	                    <RefreshCw className="mr-2 h-4 w-4" />
	                    Update list
	                  </Button>
	                  <Button variant="outline" size="sm" onClick={copyAllRecipients} disabled={recipients.length === 0}>
	                    <Copy className="mr-2 h-4 w-4" />
	                    Copy all
	                  </Button>
	                </div>
	              </CardHeader>
		              <CardContent className="space-y-3">
		                <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-slate-700">
		                  <span className="font-semibold text-slate-900">
		                    {loadingRecipients ? 'Loading…' : `${recipients.length.toLocaleString()} emails`}
		                  </span>
		                  <span className="text-xs text-slate-500">
		                    {recipientsUpdatedAt ? `Updated ${formatUpdatedAt(recipientsUpdatedAt)}` : ''}
		                  </span>
		                </div>
		                <div className="grid gap-3 sm:grid-cols-3">
		                  <div className="space-y-1">
		                    <Label className="text-xs uppercase tracking-wide text-slate-600">Ride</Label>
		                    <Select value={recipientRideId} onValueChange={setRecipientRideId}>
		                      <SelectTrigger>
		                        <SelectValue />
		                      </SelectTrigger>
		                      <SelectContent>
		                        <SelectItem value="all">All rides</SelectItem>
		                        {rideIds.map((id) => (
		                          <SelectItem key={id} value={id}>
		                            {id}
		                          </SelectItem>
		                        ))}
		                      </SelectContent>
		                    </Select>
		                  </div>
		                  <div className="space-y-1">
		                    <Label className="text-xs uppercase tracking-wide text-slate-600">Status</Label>
		                    <Select value={recipientStatus} onValueChange={setRecipientStatus}>
		                      <SelectTrigger>
		                        <SelectValue />
		                      </SelectTrigger>
		                      <SelectContent>
		                        <SelectItem value="all">All statuses</SelectItem>
		                        <SelectItem value="approved">Approved</SelectItem>
		                        <SelectItem value="pending">Pending</SelectItem>
		                        <SelectItem value="failed">Failed</SelectItem>
		                        <SelectItem value="cancelled">Cancelled</SelectItem>
		                      </SelectContent>
		                    </Select>
		                  </div>
		                  <div className="space-y-1">
		                    <Label htmlFor="recipient-days" className="text-xs uppercase tracking-wide text-slate-600">
		                      Last N days
		                    </Label>
		                    <Input
		                      id="recipient-days"
		                      inputMode="numeric"
		                      placeholder="e.g. 90"
		                      value={recipientLastNDays}
		                      onChange={(e) => setRecipientLastNDays(e.target.value)}
		                    />
		                  </div>
		                </div>
		                <Textarea
		                  readOnly
		                  value={
		                    loadingRecipients
		                      ? 'Loading…'
	                      : recipients.length === 0
	                      ? 'No booking emails yet.'
	                      : recipients.join('\n')
	                  }
	                  className="min-h-[240px] font-mono text-xs"
	                />
	                <p className="text-xs text-slate-500">
	                  Tip: Click “Update list” after new bookings are added. Campaign sending also pulls the latest bookings automatically.
	                </p>
	              </CardContent>
	            </Card>

	            <Card className="border-slate-200 bg-white shadow-sm">
	              <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
	                <div>
	                  <CardTitle className="text-base text-slate-900">Uploaded emails (CSV)</CardTitle>
	                  <CardDescription className="text-slate-600">
	                    Upload a CSV and save extra recipients to the system.
	                  </CardDescription>
	                </div>
	                <div className="flex flex-wrap items-center justify-end gap-2">
	                  <input
	                    ref={fileInputRef}
	                    type="file"
	                    accept=".csv,text/csv"
	                    className="hidden"
	                    onChange={async (e) => {
	                      const file = e.target.files?.[0]
	                      if (!file) return
	                      try {
	                        const result = await uploadManualCsv(file)
	                        toast({
	                          title: 'CSV uploaded',
	                          description: `Added ${result?.added ?? 0} • Invalid ${result?.invalid ?? 0} • Total ${result?.total ?? 0}`,
	                          variant: 'success',
	                        })
	                        await refreshManualEmails()
	                      } catch (err: any) {
	                        toast({ title: 'Upload failed', description: err?.message ?? 'Please try again.', variant: 'destructive' })
	                      } finally {
	                        if (fileInputRef.current) fileInputRef.current.value = ''
	                      }
	                    }}
	                  />
	                  <Button
	                    variant="outline"
	                    size="sm"
	                    onClick={() => fileInputRef.current?.click()}
	                  >
	                    Upload CSV
	                  </Button>
	                  <Button
	                    variant="outline"
	                    size="sm"
	                    onClick={() => {
	                      downloadCsvFromEmails(manualEmails, `jetskiandmore-uploaded-emails-${new Date().toISOString().slice(0, 10)}.csv`)
	                    }}
	                    disabled={manualEmails.length === 0}
	                  >
	                    <Download className="mr-2 h-4 w-4" />
	                    Download
	                  </Button>
	                  <Button variant="outline" size="sm" onClick={refreshManualEmails} disabled={loadingManual}>
	                    <RefreshCw className="mr-2 h-4 w-4" />
	                    Refresh
	                  </Button>
	                </div>
	              </CardHeader>
	              <CardContent className="space-y-3">
	                <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-slate-700">
	                  <span className="font-semibold text-slate-900">
	                    {loadingManual ? 'Loading…' : `${manualEmails.length.toLocaleString()} emails`}
	                  </span>
	                  <span className="text-xs text-slate-500">
	                    {manualUpdatedAt ? `Updated ${formatUpdatedAt(manualUpdatedAt)}` : ''}
	                  </span>
	                </div>
	                <Textarea
	                  readOnly
	                  value={loadingManual ? 'Loading…' : manualEmails.length === 0 ? 'No uploaded emails yet.' : manualEmails.join('\n')}
	                  className="min-h-[240px] font-mono text-xs"
	                />
	                <p className="text-xs text-slate-500">
	                  CSV formats supported: one email per line, or a column header named “email”.
	                </p>
	              </CardContent>
	            </Card>

	            <Card className="border-slate-200 bg-white shadow-sm">
	              <CardHeader>
	                <CardTitle className="text-base text-slate-900">How to use this</CardTitle>
	                <CardDescription className="text-slate-600">Practical marketing workflows.</CardDescription>
	              </CardHeader>
              <CardContent className="space-y-3 text-sm text-slate-700">
                <p>Export CSV and upload to Mailchimp / Brevo / Klaviyo for advanced automations.</p>
                <p>Use campaigns here for quick broadcasts: weather windows, weekday specials, partner updates.</p>
                <p>Keep emails factual: schedules, safety, pricing changes, and booking links.</p>
                <Separator />
                <p className="text-xs text-slate-500">
                  Note: Always follow local marketing / consent requirements and offer an unsubscribe path if sending promotions.
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance">
          <div className="space-y-4">
            <Card className="border-slate-200 bg-white shadow-sm">
              <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle className="text-base text-slate-900">Email performance</CardTitle>
                  <CardDescription className="text-slate-600">
                    Send history, best send windows, and next-campaign ideas.
                  </CardDescription>
                </div>
                <div className="flex flex-wrap items-center justify-end gap-2">
                  <Button variant="outline" size="sm" onClick={refreshPerformanceAll} disabled={loadingPerformance}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Refresh
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {loadingPerformance ? (
                  <p className="text-sm text-slate-600">Loading performance…</p>
                ) : (
                  <>
                    <div className="grid gap-3 md:grid-cols-4">
                      <MiniStat label="Attempted" value={sendStats?.totalAttempted ?? 0} />
                      <MiniStat label="Sent" value={sendStats?.totalSent ?? 0} />
                      <MiniStat label="Failed" value={sendStats?.totalFailed ?? 0} />
                      <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Failure rate</p>
                        <p className="text-2xl font-semibold tracking-tight text-slate-900">
                          {sendStats && sendStats.totalAttempted > 0
                            ? `${Math.round((sendStats.totalFailed / sendStats.totalAttempted) * 100)}%`
                            : '0%'}
                        </p>
                      </div>
                    </div>

                    <div className="grid gap-4 lg:grid-cols-2">
                      <Card className="border-slate-200 bg-white shadow-sm">
                        <CardHeader>
                          <CardTitle className="text-base text-slate-900">Send activity (hour of day)</CardTitle>
                          <CardDescription className="text-slate-600">Counts based on emails sent in the admin.</CardDescription>
                        </CardHeader>
                        <CardContent className="h-[260px]">
                          <ChartContainer config={sendHoursChartConfig} className="h-full">
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart
                                data={(sendStats?.byHour || []).map((h) => ({
                                  hour: formatHourLabel(h.hour),
                                  count: h.count,
                                }))}
                              >
                                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                                <XAxis dataKey="hour" tickLine={false} axisLine={false} interval={2} />
                                <YAxis tickLine={false} axisLine={false} width={34} />
                                <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                                <Bar dataKey="count" fill="var(--color-count)" radius={[6, 6, 0, 0]} />
                              </BarChart>
                            </ResponsiveContainer>
                          </ChartContainer>
                        </CardContent>
                      </Card>

                      <Card className="border-slate-200 bg-white shadow-sm">
                        <CardHeader>
                          <CardTitle className="text-base text-slate-900">Booking activity (hour of day)</CardTitle>
                          <CardDescription className="text-slate-600">Proxy for when customers are most likely to book.</CardDescription>
                        </CardHeader>
                        <CardContent className="h-[260px]">
                          <ChartContainer config={bookingHoursChartConfig} className="h-full">
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart
                                data={(insights?.bookingByHour || []).map((h) => ({
                                  hour: formatHourLabel(h.hour),
                                  count: h.count,
                                }))}
                              >
                                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                                <XAxis dataKey="hour" tickLine={false} axisLine={false} interval={2} />
                                <YAxis tickLine={false} axisLine={false} width={34} />
                                <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                                <Bar dataKey="count" fill="var(--color-count)" radius={[6, 6, 0, 0]} />
                              </BarChart>
                            </ResponsiveContainer>
                          </ChartContainer>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="grid gap-4 lg:grid-cols-3">
                      <Card className="border-slate-200 bg-white shadow-sm lg:col-span-2">
                        <CardHeader>
                          <CardTitle className="text-base text-slate-900">AI-style guidance (no repeats)</CardTitle>
                          <CardDescription className="text-slate-600">
                            Recommendations are based on your booking patterns + upcoming South African public holidays.
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-2">
                            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Recommended send hours</p>
                            <div className="flex flex-wrap gap-2">
                              {(insights?.recommendedSendHours || []).length === 0 ? (
                                <Badge variant="secondary">—</Badge>
                              ) : (
                                (insights?.recommendedSendHours || []).map((h) => (
                                  <Badge key={h} variant="secondary">
                                    {formatHourLabel(h)}
                                  </Badge>
                                ))
                              )}
                            </div>
                            <p className="text-xs text-slate-500">
                              Tip: run promos 1–2 hours before your peak booking hours, and avoid late-night sends.
                            </p>
                          </div>

                          <Separator />

                          <div className="grid gap-4 md:grid-cols-2">
                            <div>
                              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">What to send</p>
                              <ul className="mt-2 space-y-2 text-sm text-slate-700">
                                {(insights?.whatToSend || []).slice(0, 6).map((t) => (
                                  <li key={t} className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2">
                                    {t}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">What not to send</p>
                              <ul className="mt-2 space-y-2 text-sm text-slate-700">
                                {(insights?.whatNotToSend || []).slice(0, 6).map((t) => (
                                  <li key={t} className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2">
                                    {t}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="border-slate-200 bg-white shadow-sm">
                        <CardHeader>
                          <CardTitle className="text-base text-slate-900">Upcoming holidays</CardTitle>
                          <CardDescription className="text-slate-600">Good anchors for “limited slots” campaigns.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                          {(insights?.upcomingHolidays || []).length === 0 ? (
                            <p className="text-slate-600">—</p>
                          ) : (
                            (insights?.upcomingHolidays || []).map((h) => (
                              <div key={`${h.date}-${h.name}`} className="flex items-center justify-between rounded-md border border-slate-200 bg-slate-50 px-3 py-2">
                                <span className="text-slate-700">{h.name}</span>
                                <span className="font-mono text-xs text-slate-500">{h.date}</span>
                              </div>
                            ))
                          )}
                        </CardContent>
                      </Card>
                    </div>

                    <Card className="border-slate-200 bg-white shadow-sm">
                      <CardHeader>
                        <CardTitle className="text-base text-slate-900">Next campaign ideas</CardTitle>
                        <CardDescription className="text-slate-600">Turn any idea into a draft and adjust copy.</CardDescription>
                      </CardHeader>
                      <CardContent className="grid gap-3 lg:grid-cols-2">
                        {(insights?.ideas || []).length === 0 ? (
                          <p className="text-sm text-slate-600">No ideas yet.</p>
                        ) : (
                          (insights?.ideas || []).slice(0, 6).map((idea) => (
                            <div key={idea.title} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                              <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                  <p className="truncate font-semibold text-slate-900">{idea.title}</p>
                                  <p className="mt-1 truncate text-xs text-slate-500">{idea.subject}</p>
                                </div>
                                <Button
                                  size="sm"
                                  onClick={() => {
                                    setEditing({
                                      id: '',
                                      name: idea.title,
                                      subject: idea.subject,
                                      preheader: idea.preheader ?? null,
                                      content: idea.content,
                                      ctaLabel: idea.ctaLabel ?? 'Book now',
                                      ctaUrl: idea.ctaUrl ?? 'https://www.jetskiandmore.com/Bookings',
                                      audience: (idea.audience as any) ?? null,
                                      html: null,
                                      status: 'draft',
                                    })
                                    setComposerOpen(true)
                                  }}
                                >
                                  Use template
                                </Button>
                              </div>
                              <p className="mt-3 whitespace-pre-wrap text-sm text-slate-700">{idea.preheader || idea.content.slice(0, 180) + (idea.content.length > 180 ? '…' : '')}</p>
                            </div>
                          ))
                        )}
                      </CardContent>
                    </Card>

                    <Card className="border-slate-200 bg-white shadow-sm">
                      <CardHeader>
                        <CardTitle className="text-base text-slate-900">Send log</CardTitle>
                        <CardDescription className="text-slate-600">Latest test/bulk sends (for proof and debugging).</CardDescription>
                      </CardHeader>
                      <CardContent className="overflow-x-auto">
                        {emailEvents.length === 0 ? (
                          <p className="text-sm text-slate-600">No sends logged yet.</p>
                        ) : (
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Sent at</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Kind</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Error</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {emailEvents.map((ev) => (
                                <TableRow key={ev.id}>
                                  <TableCell className="whitespace-nowrap text-slate-700">{formatDateTime(ev.sentAt)}</TableCell>
                                  <TableCell className="max-w-[360px] truncate font-mono text-xs text-slate-700">{ev.email}</TableCell>
                                  <TableCell>
                                    <Badge variant="secondary">{ev.kind}</Badge>
                                  </TableCell>
                                  <TableCell>
                                    <Badge variant={ev.ok ? 'default' : 'destructive'}>{ev.ok ? 'Sent' : 'Failed'}</Badge>
                                  </TableCell>
                                  <TableCell className="max-w-[380px] truncate text-xs text-slate-500">{ev.error || '—'}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        )}
                      </CardContent>
                    </Card>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="assets">
          <Card className="border-slate-200 bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-base text-slate-900">Marketing assets</CardTitle>
              <CardDescription className="text-slate-600">
                Copy blocks you can paste into email, WhatsApp, Facebook, and partner listings.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-slate-700">
              <CopyBlock
                title="Partner blurb"
                text={[
                  'Jet Ski & More offers structured, safety-led guided jet ski rides in Gordon’s Bay Harbour and False Bay.',
                  'All sessions include a customer briefing process, ride onboarding, and operating procedures designed around commercial safety requirements.',
                  'Weather and sea conditions are monitored continuously and sessions can be shortened or stopped when conditions change.',
                ].join(' ')}
              />
              <CopyBlock
                title="Promo message (short)"
                text="Weekend slots open in Gordon’s Bay. Book early to secure your preferred time. Safety briefing and onboarding included."
              />
              <CopyBlock
                title="Safety & compliance"
                text="We run structured briefings, ride onboarding, swim competency requirements, safety equipment checks, and weather/sea-condition rules designed around commercial safety requirements."
              />
            </CardContent>
          </Card>
	        </TabsContent>
	      </Tabs>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete campaign?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteTarget
                ? `This will permanently delete “${deleteTarget.name}”. This cannot be undone.`
                : 'This will permanently delete the selected campaign.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteTarget(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 text-white hover:bg-red-700"
              onClick={async () => {
                if (!deleteTarget) return
                try {
                  await deleteCampaign(deleteTarget.id)
                } finally {
                  setDeleteTarget(null)
                  setDeleteOpen(false)
                }
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog
        open={testOpen}
        onOpenChange={(open) => {
          setTestOpen(open)
          if (!open) {
            setTestTarget(null)
            setTestSending(false)
            setTestEmail('')
          }
        }}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Send test email</DialogTitle>
            <DialogDescription>
              Sends this campaign to a single address for previewing formatting.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="test-email">Recipient email</Label>
              <Input
                id="test-email"
                type="email"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                placeholder="name@email.com"
              />
            </div>
            <div className="flex items-center justify-end gap-2">
              <Button variant="outline" onClick={() => setTestOpen(false)} disabled={testSending}>
                Cancel
              </Button>
              <Button
                onClick={async () => {
                  if (!testTarget) return
                  if (!testEmail.trim()) {
                    toast({ title: 'Email required', description: 'Enter a valid email address.', variant: 'destructive' })
                    return
                  }
                  try {
                    setTestSending(true)
                    await sendTest(testTarget.id, testEmail.trim())
                    setTestOpen(false)
                  } catch (e: any) {
                    toast({ title: 'Test email failed', description: e?.message ?? 'Please try again.', variant: 'destructive' })
                  } finally {
                    setTestSending(false)
                  }
                }}
                disabled={testSending}
              >
                {testSending ? 'Sending…' : 'Send test'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={sendOpen}
        onOpenChange={(open) => {
          setSendOpen(open)
          if (!open) {
            setSendTarget(null)
            setSendPreview(null)
            setSendSending(false)
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Send campaign now?</AlertDialogTitle>
            <AlertDialogDescription>
              {sendTarget ? `Campaign: “${sendTarget.name}”` : 'This will send the selected campaign.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-2 text-sm text-slate-700">
            {!sendPreview ? (
              <p className="text-slate-600">Loading recipient preview…</p>
            ) : (
              <>
                <p>
                  Recipients: <span className="font-semibold text-slate-900">{sendPreview.count.toLocaleString()}</span>
                  {sendPreview.count > 300 ? (
                    <span className="text-slate-500"> (send is capped at 300 per campaign)</span>
                  ) : null}
                </p>
                {sendPreview.sample?.length ? (
                  <p className="text-xs text-slate-500">
                    Sample: {sendPreview.sample.slice(0, 3).join(', ')}
                    {sendPreview.sample.length > 3 ? '…' : ''}
                  </p>
                ) : null}
              </>
            )}
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={sendSending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={!sendTarget || !sendPreview || sendSending}
              onClick={async () => {
                if (!sendTarget) return
                try {
                  setSendSending(true)
                  await sendCampaign(sendTarget.id)
                  setSendOpen(false)
                } catch (e: any) {
                  toast({ title: 'Send failed', description: e?.message ?? 'Please try again.', variant: 'destructive' })
                } finally {
                  setSendSending(false)
                }
              }}
            >
              {sendSending ? 'Sending…' : 'Send now'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog
        open={previewOpen}
        onOpenChange={(open) => {
          setPreviewOpen(open)
          if (!open) setPreviewTarget(null)
        }}
      >
        <DialogContent className="w-[95vw] max-w-5xl max-h-[calc(100vh-2rem)] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Email preview</DialogTitle>
            <DialogDescription>
              {previewTarget ? `${previewTarget.name} • ${previewTarget.subject}` : 'Preview the selected campaign.'}
            </DialogDescription>
          </DialogHeader>

          {previewTarget ? (
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm">
                <div className="min-w-0">
                  <p className="truncate font-semibold text-slate-900">{previewTarget.subject}</p>
                  <p className="truncate text-xs text-slate-500">
                    Audience: {formatAudience(previewTarget.audience)}
                    {previewTarget.preheader ? ` • Preheader: ${previewTarget.preheader}` : ''}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={async () => {
                      try {
                        await navigator.clipboard.writeText(previewHtml)
                        toast({ title: 'HTML copied', description: 'Email HTML copied to clipboard.', variant: 'success' })
                      } catch {
                        toast({ title: 'Copy failed', description: 'Could not copy HTML.', variant: 'destructive' })
                      }
                    }}
                  >
                    <Copy className="mr-2 h-4 w-4" />
                    Copy HTML
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      try {
                        openHtmlPreview(previewHtml)
                      } catch {
                        toast({ title: 'Preview failed', description: 'Could not open preview.', variant: 'destructive' })
                      }
                    }}
                  >
                    Open preview
                  </Button>
                </div>
              </div>

              <Tabs defaultValue="desktop">
                <TabsList>
                  <TabsTrigger value="desktop">Desktop</TabsTrigger>
                  <TabsTrigger value="mobile">Mobile</TabsTrigger>
                </TabsList>
                <TabsContent value="desktop">
                  <div className="rounded-xl border border-slate-200 bg-white p-3">
                    <div className="mx-auto w-full max-w-[640px] overflow-hidden rounded-lg border border-slate-200">
                      <iframe
                        key={`${previewTarget.id || previewTarget.name}-desktop`}
                        title="Email preview (desktop)"
                        className="h-[620px] w-full bg-white"
                        srcDoc={previewHtml}
                      />
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="mobile">
                  <div className="rounded-xl border border-slate-200 bg-white p-3">
                    <div className="mx-auto w-full max-w-[380px] overflow-hidden rounded-lg border border-slate-200">
                      <iframe
                        key={`${previewTarget.id || previewTarget.name}-mobile`}
                        title="Email preview (mobile)"
                        className="h-[620px] w-full bg-white"
                        srcDoc={previewHtml}
                      />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          ) : (
            <p className="text-sm text-slate-600">No campaign selected.</p>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

function MiniStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{label}</p>
      <p className="text-2xl font-semibold tracking-tight text-slate-900">{value.toLocaleString()}</p>
    </div>
  )
}

function MiniList({ items }: { items: { key: string; count: number }[] }) {
  if (!items || items.length === 0) return <p className="text-sm text-slate-600">—</p>
  return (
    <ul className="mt-2 space-y-1">
      {items.slice(0, 8).map((i) => (
        <li key={i.key} className="flex items-center justify-between rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm">
          <span className="truncate text-slate-700">{i.key || 'Unknown'}</span>
          <span className="font-semibold text-slate-900">{i.count.toLocaleString()}</span>
        </li>
      ))}
    </ul>
  )
}

function CopyBlock({ title, text }: { title: string; text: string }) {
  async function copy() {
    try {
      await navigator.clipboard.writeText(text)
    } catch {}
  }
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-semibold text-slate-900">{title}</p>
          <p className="mt-1 text-xs text-slate-500">Copy and paste anywhere.</p>
        </div>
        <Button variant="outline" size="sm" onClick={copy}>Copy</Button>
      </div>
      <p className="mt-3 whitespace-pre-wrap text-sm text-slate-700">{text}</p>
    </div>
  )
}

function CampaignComposer({
  initial,
  rideIds,
  fetchAdmin,
  onCancel,
  onSave,
}: {
  initial: MarketingCampaign | null
  rideIds: string[]
  fetchAdmin: (path: string, init?: RequestInit) => Promise<Response>
  onCancel: () => void
  onSave: (draft: Partial<MarketingCampaign>) => Promise<MarketingCampaign>
}) {
  const [saving, setSaving] = React.useState(false)
  const [name, setName] = React.useState(initial?.name || '')
  const [subject, setSubject] = React.useState(initial?.subject || '')
  const [preheader, setPreheader] = React.useState(initial?.preheader || '')
  const [content, setContent] = React.useState(initial?.content || '')
  const [ctaLabel, setCtaLabel] = React.useState(initial?.ctaLabel || 'Book now')
  const [ctaUrl, setCtaUrl] = React.useState(initial?.ctaUrl || 'https://www.jetskiandmore.com/Bookings')

  const [rideId, setRideId] = React.useState<string>(initial?.audience?.rideId || 'all')
  const [status, setStatus] = React.useState<string>(initial?.audience?.status || 'all')
  const [includeManual, setIncludeManual] = React.useState<boolean>(initial?.audience?.includeManual ?? true)
  const [lastNDays, setLastNDays] = React.useState<string>(
    initial?.audience?.lastNDays != null ? String(initial.audience.lastNDays) : '',
  )
  const contentRef = React.useRef<HTMLTextAreaElement | null>(null)
  const [assets, setAssets] = React.useState<MarketingAsset[]>([])
  const [assetsLoading, setAssetsLoading] = React.useState(false)
  const [imageUrl, setImageUrl] = React.useState('')
  const [imageAlt, setImageAlt] = React.useState('')

  async function refreshAssets() {
    try {
      setAssetsLoading(true)
      const res = await fetchAdmin(`/api/admin/marketing/assets?limit=50`)
      if (!res.ok) {
        const data = await res.json().catch(() => null)
        throw new Error(data?.detail || data?.message || res.statusText)
      }
      const data = (await res.json()) as { items: MarketingAsset[] }
      setAssets(data.items || [])
    } catch (e: any) {
      toast({ title: 'Could not load images', description: e?.message ?? 'Please try again.', variant: 'destructive' })
      setAssets([])
    } finally {
      setAssetsLoading(false)
    }
  }

  async function uploadAsset(file: File) {
    const fd = new FormData()
    fd.append('file', file)
    const res = await fetchAdmin(`/api/admin/marketing/assets/upload`, { method: 'POST', body: fd })
    if (!res.ok) {
      const data = await res.json().catch(() => null)
      throw new Error(data?.detail || data?.message || res.statusText)
    }
    return (await res.json()) as MarketingAsset
  }

  function insertImageToken(url: string, alt?: string) {
    const token = `[[IMAGE:${url}${alt ? `|${alt}` : ''}]]`
    const el = contentRef.current
    if (!el) {
      setContent((prev) => `${(prev || '').trim()}\n\n${token}\n`.trim())
      return
    }
    const start = el.selectionStart ?? el.value.length
    const end = el.selectionEnd ?? el.value.length
    const before = el.value.slice(0, start)
    const after = el.value.slice(end)
    const insert = `${before && !before.endsWith('\n') ? '\n' : ''}${token}${after && !after.startsWith('\n') ? '\n' : ''}`
    const next = `${before}${insert}${after}`
    setContent(next)
    window.setTimeout(() => {
      try {
        el.focus()
      } catch {}
    }, 0)
  }

  React.useEffect(() => {
    refreshAssets()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function handleSave() {
    setSaving(true)
    try {
      await onSave({
        name: name.trim() || 'Campaign',
        subject: subject.trim() || 'Jet Ski & More',
        preheader: preheader.trim() || null,
        content: content.trim() || null,
        ctaLabel: ctaLabel.trim() || null,
        ctaUrl: ctaUrl.trim() || null,
        audience: {
          rideId: rideId === 'all' ? null : rideId,
          status: status === 'all' ? null : status,
          includeManual,
          lastNDays: Number(lastNDays) > 0 ? Number(lastNDays) : null,
        },
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="camp-name">Campaign name</Label>
          <Input id="camp-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Weekend slots – April" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="camp-subject">Email subject</Label>
          <Input id="camp-subject" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Weekend jet ski slots open in Gordon’s Bay" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="camp-preheader">Preheader (optional)</Label>
        <Input id="camp-preheader" value={preheader} onChange={(e) => setPreheader(e.target.value)} placeholder="Book early to secure your preferred time." />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <Label>Ride filter</Label>
          <Select value={rideId} onValueChange={setRideId}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All rides</SelectItem>
              {rideIds.map((id) => (
                <SelectItem key={id} value={id}>{id}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Status</Label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="camp-days">Last N days</Label>
          <Input id="camp-days" value={lastNDays} onChange={(e) => setLastNDays(e.target.value)} inputMode="numeric" />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Checkbox
          id="camp-include-manual"
          checked={includeManual}
          onCheckedChange={(v) => setIncludeManual(Boolean(v))}
        />
        <Label htmlFor="camp-include-manual" className="text-sm text-slate-700">
          Include uploaded emails
        </Label>
      </div>

      <div className="space-y-2">
        <Label htmlFor="camp-content">Email content</Label>
        <Textarea
          ref={contentRef}
          id="camp-content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={[
            'Example:',
            '',
            'Weekend slots are open in Gordon’s Bay.',
            '• Structured safety briefing and onboarding',
            '• Weather-dependent operations',
            '',
            'Reply to this email for group bookings.',
          ].join('\n')}
          className="min-h-[180px]"
        />
        <p className="text-xs text-slate-500">
          Tip: Use images anywhere by inserting a line like <span className="font-mono">[[IMAGE:https://...|Alt text]]</span>.
        </p>
      </div>

      <Card className="border-slate-200 bg-white shadow-sm">
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-base text-slate-900">Images</CardTitle>
            <CardDescription className="text-slate-600">Upload an image and insert it into the email content.</CardDescription>
          </div>
          <div className="flex flex-wrap items-center justify-end gap-2">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              id="camp-image-upload"
              onChange={async (e) => {
                const file = e.target.files?.[0]
                if (!file) return
                try {
                  const asset = await uploadAsset(file)
                  toast({ title: 'Image uploaded', description: asset.filename, variant: 'success' })
                  await refreshAssets()
                } catch (err: any) {
                  toast({ title: 'Upload failed', description: err?.message ?? 'Please try again.', variant: 'destructive' })
                } finally {
                  ;(e.target as HTMLInputElement).value = ''
                }
              }}
            />
            <Button variant="outline" size="sm" onClick={() => document.getElementById('camp-image-upload')?.click()}>
              Upload image
            </Button>
            <Button variant="outline" size="sm" onClick={refreshAssets} disabled={assetsLoading}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="camp-image-url">Image URL (optional)</Label>
              <Input
                id="camp-image-url"
                placeholder="https://..."
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="camp-image-alt">Alt text (optional)</Label>
              <Input
                id="camp-image-alt"
                placeholder="Jet ski ride in Gordon’s Bay"
                value={imageAlt}
                onChange={(e) => setImageAlt(e.target.value)}
              />
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => {
                const url = imageUrl.trim()
                if (!url) {
                  toast({ title: 'Image URL required', description: 'Paste an image URL or upload an image.', variant: 'destructive' })
                  return
                }
                insertImageToken(url, imageAlt.trim() || undefined)
                setImageUrl('')
                setImageAlt('')
              }}
            >
              Insert image URL
            </Button>
          </div>

          {assetsLoading ? (
            <p className="text-sm text-slate-600">Loading images…</p>
          ) : assets.length === 0 ? (
            <p className="text-sm text-slate-600">No uploaded images yet.</p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {assets.map((a) => {
                const absolute = `${API_BASE}${a.url}`
                return (
                  <div key={a.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                    <div className="aspect-video overflow-hidden rounded-lg border border-slate-200 bg-white">
                      <img src={absolute} alt={a.filename} className="h-full w-full object-cover" />
                    </div>
                    <div className="mt-2 flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-slate-900">{a.filename}</p>
                        <p className="truncate font-mono text-[11px] text-slate-500">{a.url}</p>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => {
                          insertImageToken(absolute, a.filename)
                        }}
                      >
                        Insert
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="camp-cta-label">CTA label</Label>
          <Input id="camp-cta-label" value={ctaLabel} onChange={(e) => setCtaLabel(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="camp-cta-url">CTA URL</Label>
          <Input id="camp-cta-url" value={ctaUrl} onChange={(e) => setCtaUrl(e.target.value)} />
        </div>
      </div>

      <Separator />

      <div className="flex flex-wrap items-center justify-end gap-2">
        <Button variant="outline" onClick={onCancel} disabled={saving}>Cancel</Button>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? 'Saving…' : 'Save campaign'}
        </Button>
      </div>
    </div>
  )
}

function formatAudience(audience?: CampaignAudience | null) {
  if (!audience) return 'All customers'
  const parts: string[] = []
  if (audience.rideId) parts.push(`Ride: ${audience.rideId}`)
  if (audience.status) parts.push(`Status: ${audience.status}`)
  if (audience.lastNDays) parts.push(`Last ${audience.lastNDays}d`)
  return parts.length > 0 ? parts.join(' • ') : 'All customers'
}

function renderEmailHtml({
  title,
  preheader,
  content,
  ctaLabel,
  ctaUrl,
}: {
  title: string
  preheader: string | null
  content: string | null
  ctaLabel: string | null
  ctaUrl: string | null
}) {
  const safeTitle = escapeHtml(title || 'Jet Ski & More')
  const safePreheader = escapeHtml(preheader || '')
  const blocks = String(content || '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const m = line.match(/^\[\[IMAGE:(.+?)(?:\|(.+?))?\]\]$/i)
      if (m) {
        const url = (m[1] || '').trim()
        const alt = (m[2] || '').trim()
        if (!url) return ''
        return [
          '<div style="margin:0 0 12px 0;">',
          `<img src="${escapeAttr(url)}" alt="${escapeAttr(alt)}" style="display:block;max-width:100%;height:auto;border-radius:12px;border:1px solid #e2e8f0;" />`,
          '</div>',
        ].join('')
      }
      return `<p style="margin:0 0 12px 0;line-height:1.55;">${escapeHtml(line)}</p>`
    })
    .filter(Boolean)
    .join('')

  const buttonHtml =
    ctaLabel && ctaUrl
      ? `<a href="${escapeAttr(ctaUrl)}" style="display:inline-block;background:#0f172a;color:#ffffff;text-decoration:none;padding:12px 16px;border-radius:10px;font-weight:700;">${escapeHtml(ctaLabel)}</a>`
      : ''

  return [
    '<!doctype html>',
    '<html><head><meta charset="utf-8" />',
    '<meta name="viewport" content="width=device-width, initial-scale=1" />',
    `<title>${safeTitle}</title>`,
    '</head>',
    '<body style="margin:0;background:#f8fafc;font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial;">',
    `<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${safePreheader}</div>`,
    '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">',
    '<tr><td align="center" style="padding:24px 12px;">',
    '<table role="presentation" width="600" cellspacing="0" cellpadding="0" style="border-collapse:collapse;width:100%;max-width:600px;">',
    '<tr><td style="padding:18px 20px;border:1px solid #e2e8f0;border-radius:16px;background:#ffffff;">',
    '<div style="font-size:12px;letter-spacing:0.24em;text-transform:uppercase;color:#64748b;margin-bottom:8px;">Jet Ski &amp; More</div>',
    `<h1 style="font-size:20px;margin:0 0 10px 0;color:#0f172a;">${safeTitle}</h1>`,
    `<div style="font-size:14px;color:#334155;">${blocks || '<p style="margin:0;color:#64748b;">(No content)</p>'}</div>`,
    buttonHtml ? `<div style="margin-top:14px;">${buttonHtml}</div>` : '',
    '<div style="margin-top:18px;padding-top:14px;border-top:1px solid #e2e8f0;font-size:12px;color:#64748b;">',
    'Gordon’s Bay Harbour • False Bay',
    '</div>',
    '</td></tr></table>',
    '</td></tr></table>',
    '</body></html>',
  ].join('')
}

function escapeHtml(input: string) {
  return String(input)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}

function escapeAttr(input: string) {
  return escapeHtml(input).replaceAll('`', '&#096;')
}

function downloadTextFile(text: string, filename: string) {
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

function downloadCsvFromEmails(emails: string[], filename: string) {
  const csv = ['email', ...(emails || [])].join('\n')
  downloadTextFile(csv, filename)
}

function openHtmlPreview(html: string) {
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  window.open(url, '_blank', 'noopener,noreferrer')
  window.setTimeout(() => {
    try {
      URL.revokeObjectURL(url)
    } catch {}
  }, 60_000)
}

function buildThankYouCampaignDraft(): MarketingCampaign {
  return {
    id: '',
    name: 'Thank you + apology (supporters)',
    subject: 'Thank you for your support — Jet Ski & More',
    preheader: 'We appreciate you. We’re improving after weather and technical disruptions.',
    content: [
      'Hi there,',
      '',
      'Thank you for supporting Jet Ski & More.',
      '',
      'We also want to apologise to anyone we could not help on the day due to technical difficulties, or because weather and sea conditions were not safe to operate. Safety comes first — and we know it’s frustrating when plans change.',
      '',
      'We’re improving our systems and operations so that communication is clearer, bookings are smoother, and you get the best possible experience when conditions allow.',
      '',
      'If you were impacted and you’d like us to prioritise you for a future slot, reply to this email with your name and the date you tried to ride.',
      '',
      'Thank you again — we truly appreciate your support and we strive to deliver a great, safe experience every time.',
      '',
      'Jet Ski & More',
      '',
      'If you prefer not to receive updates, reply “unsubscribe” and we will remove you manually.',
    ].join('\n'),
    ctaLabel: 'Book again',
    ctaUrl: 'https://www.jetskiandmore.com/Bookings',
    audience: { rideId: null, status: null, lastNDays: null },
    status: 'draft',
  }
}

function formatUpdatedAt(date: Date) {
  try {
    return date.toLocaleString('en-ZA', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
  } catch {
    return String(date)
  }
}

function formatHourLabel(hour: number) {
  const h = Math.max(0, Math.min(23, Math.floor(Number(hour))))
  return `${String(h).padStart(2, '0')}:00`
}

function formatDateTime(value: string) {
  try {
    const dt = new Date(value)
    if (Number.isNaN(dt.getTime())) return value
    return dt.toLocaleString('en-ZA', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return value
  }
}
