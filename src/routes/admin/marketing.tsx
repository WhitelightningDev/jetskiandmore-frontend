import * as React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Download, Mail, Plus, Send, Trash2 } from 'lucide-react'

import { API_BASE } from '@/lib/api'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { useAdminContext } from '@/admin/context'

export const Route = createFileRoute('/admin/marketing')({
  component: AdminMarketingPage,
})

type CampaignAudience = {
  rideId?: string | null
  status?: string | null
  lastNDays?: number | null
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

function AdminMarketingPage() {
  const { token, bookings, setError } = useAdminContext()
  const [campaigns, setCampaigns] = React.useState<MarketingCampaign[]>([])
  const [audience, setAudience] = React.useState<AudienceSummary | null>(null)
  const [loading, setLoading] = React.useState(false)
  const [loadingAudience, setLoadingAudience] = React.useState(false)

  const rideIds = React.useMemo(() => {
    const ids = Array.from(new Set(bookings.map((b) => b.rideId).filter(Boolean))).sort()
    return ids.length > 0 ? ids : ['joy', 'group', '30-1', '60-1']
  }, [bookings])

  const [composerOpen, setComposerOpen] = React.useState(false)
  const [editing, setEditing] = React.useState<MarketingCampaign | null>(null)

  React.useEffect(() => {
    if (!token) return
    ;(async () => {
      try {
        setLoading(true)
        const res = await fetch(`${API_BASE}/api/admin/marketing/campaigns?limit=50`, {
          headers: { Authorization: `Bearer ${token}` },
        })
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
    })()
  }, [setError, token])

  React.useEffect(() => {
    if (!token) return
    ;(async () => {
      try {
        setLoadingAudience(true)
        const res = await fetch(`${API_BASE}/api/admin/marketing/audience/summary`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!res.ok) {
          const data = await res.json().catch(() => null)
          throw new Error(data?.detail || data?.message || res.statusText)
        }
        const data = (await res.json()) as AudienceSummary
        setAudience(data)
      } catch (e: any) {
        // Non-blocking: show the rest of the page even if this fails.
        setAudience(null)
      } finally {
        setLoadingAudience(false)
      }
    })()
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
    const url = isUpdate
      ? `${API_BASE}/api/admin/marketing/campaigns/${encodeURIComponent(String(input.id))}`
      : `${API_BASE}/api/admin/marketing/campaigns`

    const res = await fetch(url, {
      method: isUpdate ? 'PUT' : 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
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
    if (!window.confirm('Delete this campaign?')) return
    const res = await fetch(`${API_BASE}/api/admin/marketing/campaigns/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!res.ok) {
      const data = await res.json().catch(() => null)
      throw new Error(data?.detail || data?.message || res.statusText)
    }
    setCampaigns((prev) => prev.filter((c) => c.id !== id))
  }

  async function sendTest(id: string) {
    if (!token) return
    const toEmail = window.prompt('Send test email to:')
    if (!toEmail) return
    const res = await fetch(`${API_BASE}/api/admin/marketing/campaigns/${encodeURIComponent(id)}/send-test`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ toEmail }),
    })
    if (!res.ok) {
      const data = await res.json().catch(() => null)
      throw new Error(data?.detail || data?.message || res.statusText)
    }
    window.alert('Test email sent (check inbox/spam).')
  }

  async function sendCampaign(id: string) {
    if (!token) return
    const previewRes = await fetch(`${API_BASE}/api/admin/marketing/campaigns/${encodeURIComponent(id)}/recipients-preview`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!previewRes.ok) {
      const data = await previewRes.json().catch(() => null)
      throw new Error(data?.detail || data?.message || previewRes.statusText)
    }
    const preview = (await previewRes.json()) as { count: number; sample: string[] }
    if (!window.confirm(`Send this campaign to ${preview.count} recipients now?`)) return

    const res = await fetch(`${API_BASE}/api/admin/marketing/campaigns/${encodeURIComponent(id)}/send`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    })
    if (!res.ok) {
      const data = await res.json().catch(() => null)
      throw new Error(data?.detail || data?.message || res.statusText)
    }
    const updated = (await res.json()) as MarketingCampaign
    setCampaigns((prev) => prev.map((c) => (c.id === updated.id ? updated : c)))
    window.alert(`Sent: ${updated.stats?.sent ?? 0}, failed: ${updated.stats?.failed ?? 0}`)
  }

  async function downloadRecipientsCsv() {
    if (!token) return
    const rideId = window.prompt('Ride filter (optional), e.g. joy / group / 30-1:', '')
    const daysRaw = window.prompt('Last N days (optional):', '90')
    const lastNDays = daysRaw ? Number(daysRaw) : null

    const res = await fetch(`${API_BASE}/api/admin/marketing/recipients/export`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        rideId: (rideId || '').trim() || null,
        lastNDays: Number.isFinite(lastNDays as any) ? lastNDays : null,
      }),
    })
    if (!res.ok) {
      const data = await res.json().catch(() => null)
      throw new Error(data?.detail || data?.message || res.statusText)
    }
    const data = (await res.json()) as { emails: string[] }
    const csv = ['email', ...(data.emails || [])].join('\n')
    downloadTextFile(csv, `jetskiandmore-recipients-${new Date().toISOString().slice(0, 10)}.csv`)
  }

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

              <Dialog open={composerOpen} onOpenChange={setComposerOpen}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    New campaign
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl">
                  <DialogHeader>
                    <DialogTitle>{editing ? 'Edit campaign' : 'New campaign'}</DialogTitle>
                    <DialogDescription>Build a clean email (HTML is generated automatically).</DialogDescription>
                  </DialogHeader>
                  <CampaignComposer
                    rideIds={rideIds}
                    initial={editing}
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
                            <Button variant="outline" size="sm" onClick={() => sendTest(c.id)}>
                              <Send className="mr-2 h-4 w-4" />
                              Test
                            </Button>
                            <Button size="sm" onClick={() => sendCampaign(c.id)} disabled={c.status === 'sent'}>
                              <Mail className="mr-2 h-4 w-4" />
                              Send
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => deleteCampaign(c.id)}>
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
                <Button variant="outline" size="sm" onClick={downloadRecipientsCsv}>
                  <Download className="mr-2 h-4 w-4" />
                  Export CSV
                </Button>
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
  onCancel,
  onSave,
}: {
  initial: MarketingCampaign | null
  rideIds: string[]
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
  const [lastNDays, setLastNDays] = React.useState<string>(String(initial?.audience?.lastNDays ?? 90))

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

      <div className="space-y-2">
        <Label htmlFor="camp-content">Email content</Label>
        <Textarea
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
      </div>

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
  const paragraphs = String(content || '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => `<p style="margin:0 0 12px 0;line-height:1.55;">${escapeHtml(line)}</p>`)
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
    `<div style="font-size:14px;color:#334155;">${paragraphs || '<p style="margin:0;color:#64748b;">(No content)</p>'}</div>`,
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
