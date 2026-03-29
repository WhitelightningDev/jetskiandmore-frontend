import * as React from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowUpRight, BookOpen, CalendarRange, LifeBuoy, Mail, ShieldCheck } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { useAdminContext } from '@/admin/context'

export const Route = createFileRoute('/admin/support')({
  component: AdminSupportPage,
})

function AdminSupportPage() {
  const { analytics, bookings, pageViews } = useAdminContext()

  const bookingCount = bookings?.length ?? 0
  const revenueZar = analytics?.totalRevenueZar ?? bookings.reduce((acc, b) => acc + (b.amountInCents || 0) / 100, 0)
  const pageViewsTotal = pageViews?.totalViews ?? analytics?.totalPageViews ?? 0

  const topPublicPage = React.useMemo(() => {
    const items = pageViews?.items || []
    const publicPages = items.filter((p) => !String(p.path || '').startsWith('/admin'))
    return publicPages[0]?.path || '/home'
  }, [pageViews])
  const topPublicHref = React.useMemo(() => sanitizePathname(topPublicPage), [topPublicPage])

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Admin support</h1>
        <p className="text-sm text-slate-600">
          Corporate operating guidance for Jet Ski &amp; More — how the dashboard works, what customers see, and how to troubleshoot common issues.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        <Card className="border-slate-200 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-base text-slate-900">Operational snapshot</CardTitle>
            <CardDescription className="text-slate-600">Quick context (current admin data).</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-slate-700">
            <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
              <span>Bookings loaded</span>
              <span className="font-semibold text-slate-900">{bookingCount.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
              <span>Revenue (ZAR)</span>
              <span className="font-semibold text-slate-900">{revenueZar.toFixed(0)}</span>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
              <span>Page views</span>
              <span className="font-semibold text-slate-900">{pageViewsTotal.toLocaleString()}</span>
            </div>
            <div className="text-xs text-slate-500">This is an internal summary; use Analytics for deep breakdowns.</div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-base text-slate-900">Core workflows</CardTitle>
            <CardDescription className="text-slate-600">What to do daily.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-slate-700">
            <WorkflowItem title="Confirm and message bookings" desc="Review new bookings, update status, and send a clear note when changes are needed." />
            <WorkflowItem title="Check schedule capacity" desc="Use Calendar to spot busy slots and plan staffing / safety checks." />
            <WorkflowItem title="Control availability" desc="Use Booking controls to pause bookings during unsafe sea conditions or operational constraints." />
            <WorkflowItem title="Send factual updates" desc="Marketing is for service updates, availability windows, and partner communication." />
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-base text-slate-900">Quick links</CardTitle>
            <CardDescription className="text-slate-600">Jump to the right place fast.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2">
            <QuickLink to="/admin/overview" label="Admin dashboard" />
            <QuickLink to="/admin/bookings" label="Manage bookings" />
            <QuickLink to="/admin/booking-controls" label="Booking controls" />
            <QuickLink to="/admin/marketing" label="Email marketing" />
            <QuickLink to="/partner-pack" label="Partner pack (PDF)" />
            <QuickLink to="/admin/quiz" label="Safety & quiz review" />
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <Card className="border-slate-200 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-base text-slate-900">Customer-facing pages</CardTitle>
            <CardDescription className="text-slate-600">What customers and partners see (useful when troubleshooting).</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-slate-700">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="font-semibold text-slate-900">Bookings</p>
              <p className="mt-1 text-slate-600">
                The booking experience runs on the public bookings page. If bookings are paused, the main call-to-action may redirect customers to informational pages.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Button asChild size="sm" variant="outline">
                  <Link to="/Bookings">
                    Open bookings <ArrowUpRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild size="sm" variant="outline">
                  <a href={topPublicHref}>
                    Open top page <ArrowUpRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <PublicLink to="/boat-ride" label="Boat ride enquiries" />
              <PublicLink to="/fishing-charters" label="Fishing charters" />
              <PublicLink to="/safety" label="Safety & compliance" />
              <PublicLink to="/contact" label="Contact page" />
            </div>

            <Separator />

            <div className="space-y-2">
              <p className="font-semibold text-slate-900">If customers report issues</p>
              <ul className="list-disc space-y-1 pl-5 text-slate-700">
                <li>Confirm Booking controls are set correctly (jet ski / boat ride / fishing).</li>
                <li>Confirm timeslots exist for the selected date and ride type.</li>
                <li>Check the Bookings page for the exact error message and date/time combination.</li>
                <li>For weather closures: keep messaging consistent and safety-first.</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-base text-slate-900">How each admin section works</CardTitle>
            <CardDescription className="text-slate-600">Clear purpose and expected outcomes.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-slate-700">
            <SectionRow icon={<BookOpen className="h-4 w-4 text-slate-600" />} title="Dashboard" desc="Fast overview of revenue, bookings, and operational signals." />
            <SectionRow icon={<CalendarRange className="h-4 w-4 text-slate-600" />} title="Calendar" desc="Schedule view to plan staffing, spot peak days, and reduce clashes." />
            <SectionRow icon={<LifeBuoy className="h-4 w-4 text-slate-600" />} title="Bookings" desc="Customer management: status changes, notes, and communication." />
            <SectionRow icon={<Mail className="h-4 w-4 text-slate-600" />} title="Marketing" desc="Email campaigns, uploaded recipient lists, images, performance stats, and send logs." />
            <SectionRow icon={<ShieldCheck className="h-4 w-4 text-slate-600" />} title="Safety & quiz" desc="Compliance review and record-keeping for onboarding content." />

            <Separator />

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="font-semibold text-slate-900">Corporate expectation</p>
              <p className="mt-1 text-slate-600">
                Keep communications factual, safety-first, and consistent. The Safety &amp; Compliance page is a credibility asset for partners and authorities.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Badge variant="secondary">Audit-ready wording</Badge>
                <Badge variant="secondary">Commercial safety procedures</Badge>
                <Badge variant="secondary">Weather-dependent operations</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <Card className="border-slate-200 bg-white shadow-sm lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base text-slate-900">Troubleshooting</CardTitle>
            <CardDescription className="text-slate-600">Fast checks for common admin issues.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-slate-700">
            <TroubleItem
              title="401 Unauthorized (session expired)"
              steps={[
                'Sign out and sign back in.',
                'If it persists, confirm the admin credentials in the backend environment variables.',
              ]}
            />
            <TroubleItem
              title="Marketing emails not sending"
              steps={[
                'Confirm SMTP settings are configured on the backend (Gmail app password).',
                'Send a test email from Marketing and check the send log.',
                'If failures persist, check spam policies and sending limits.',
              ]}
            />
            <TroubleItem
              title="Recipient list looks empty"
              steps={[
                'Use Marketing → Audience → Update list (pulls from bookings).',
                'Check filters (ride/status/last N days).',
                'If using CSV, upload recipients and enable “Include uploaded emails” on the campaign.',
              ]}
            />
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-base text-slate-900">Contact</CardTitle>
            <CardDescription className="text-slate-600">Internal escalation notes.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-slate-700">
            <p>
              For customer-facing help requests, use the contact page and reply with clear next steps (reschedule options, safety rationale, or missing details needed).
            </p>
            <Button asChild variant="outline" className="w-full">
              <Link to="/contact">
                Open contact page <ArrowUpRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <div className="text-xs text-slate-500">For technical issues, capture the exact URL and error message before escalating.</div>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}

function QuickLink({ to, label }: { to: string; label: string }) {
  return (
    <Button asChild variant="outline" className="w-full justify-between">
      <Link to={to}>
        {label}
        <ArrowUpRight className="h-4 w-4 text-slate-500" />
      </Link>
    </Button>
  )
}

function PublicLink({ to, label }: { to: '/Bookings' | '/boat-ride' | '/fishing-charters' | '/safety' | '/contact'; label: string }) {
  return (
    <Button asChild variant="outline" className="justify-between">
      <Link to={to}>
        <span className="truncate">{label}</span>
        <ArrowUpRight className="h-4 w-4 text-slate-500" />
      </Link>
    </Button>
  )
}

function SectionRow({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
      <div className="mt-0.5">{icon}</div>
      <div className="min-w-0">
        <p className="font-semibold text-slate-900">{title}</p>
        <p className="mt-1 text-slate-600">{desc}</p>
      </div>
    </div>
  )
}

function WorkflowItem({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <p className="font-semibold text-slate-900">{title}</p>
      <p className="mt-1 text-slate-600">{desc}</p>
    </div>
  )
}

function TroubleItem({ title, steps }: { title: string; steps: string[] }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <p className="font-semibold text-slate-900">{title}</p>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-700">
        {steps.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ul>
    </div>
  )
}

function sanitizePathname(input: string) {
  const raw = String(input || '').trim()
  if (!raw) return '/home'
  const noProto = raw.replace(/^https?:\/\/[^/]+/i, '')
  const withoutHash = noProto.split('#')[0] || ''
  const withoutQuery = (withoutHash.split('?')[0] || '').trim()
  if (!withoutQuery.startsWith('/')) return '/home'
  if (withoutQuery.length > 1 && withoutQuery.endsWith('/')) return withoutQuery.slice(0, -1)
  return withoutQuery
}
