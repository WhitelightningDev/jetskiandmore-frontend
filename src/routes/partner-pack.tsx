import * as React from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { ExternalLink, Mail, MapPin, Phone, Printer, ShieldCheck, Sparkles } from 'lucide-react'

import jetskiLogo from '@/lib/images/JetSkiLogo.png'
import { API_BASE } from '@/lib/api'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

export const Route = createFileRoute('/partner-pack')({
  component: PartnerPackPage,
})

function PartnerPackPage() {
  const isPrintMode = React.useMemo(() => {
    if (typeof window === 'undefined') return false
    return new URLSearchParams(window.location.search).has('print')
  }, [])
  const personalization = React.useMemo(() => {
    if (typeof window === 'undefined') return { partnerCode: '', propertyName: '' }
    const sp = new URLSearchParams(window.location.search)
    return {
      partnerCode: (sp.get('partnerCode') || '').trim(),
      propertyName: (sp.get('property') || '').trim(),
    }
  }, [])

  const pdfUrl = React.useMemo(() => {
    const sp = new URLSearchParams()
    if (personalization.partnerCode) sp.set('partnerCode', personalization.partnerCode)
    if (personalization.propertyName) sp.set('property', personalization.propertyName)
    const qs = sp.toString()
    return `${API_BASE}/api/partner-pack.pdf${qs ? `?${qs}` : ''}`
  }, [personalization.partnerCode, personalization.propertyName])

  function handlePrint() {
    try {
      window.print()
    } catch {
      // ignore
    }
  }

  if (isPrintMode) {
    return (
      <div className="bg-white px-0 py-0">
        <style>{`
@page { size: A4; margin: 0; }
@media print {
  html, body {
    background: #ffffff !important;
    margin: 0 !important;
    padding: 0 !important;
    width: 210mm !important;
    height: 297mm !important;
  }
  body { overflow: hidden !important; }
}
        `}</style>
        <div className="mx-auto h-[297mm] w-[210mm] overflow-hidden bg-white p-[10mm]">
          <PartnerPackOnePager partnerCode={personalization.partnerCode} propertyName={personalization.propertyName} />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 print:bg-white print:px-0 print:py-0">
      <style>{`
@page { size: A4; margin: 10mm; }
@media print {
  html, body { background: #ffffff !important; }
}
      `}</style>
      <div className="mx-auto w-full max-w-[900px] space-y-4 print:space-y-0">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <h1 className="text-xl font-semibold tracking-tight text-slate-900">Corporate partner pack</h1>
            <p className="text-sm text-slate-600">One-page brochure for hotels, Airbnbs, and tourism desks.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button asChild size="sm">
              <a href={pdfUrl} target="_blank" rel="noreferrer">
                Download PDF
              </a>
            </Button>
            <Button variant="outline" size="sm" onClick={handlePrint}>
              <Printer className="mr-2 h-4 w-4" />
              Print / Save PDF
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link to="/safety">
                Safety &amp; compliance <ExternalLink className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        <Card className="border-slate-200 bg-white shadow-sm print:shadow-none print:border-slate-200">
          <CardHeader className="space-y-4 pb-4 print:space-y-2 print:pb-2">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex min-w-0 items-center gap-3">
                <img src={jetskiLogo} alt="Jet Ski & More" className="h-10 w-auto" />
                <div className="min-w-0">
                  <CardTitle className="truncate text-lg text-slate-900">Jet Ski &amp; More</CardTitle>
                  <CardDescription className="text-slate-600 print:text-[11px] print:leading-snug">
                    Guided water activities from Gordon&apos;s Bay Harbour (False Bay) — safety-led, weather-dependent operations.
                  </CardDescription>
                </div>
              </div>

              <div className="flex w-full flex-col gap-3 sm:w-[340px]">
                <div className="flex items-start justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <div className="min-w-0">
                    <p className="text-xs font-medium uppercase tracking-widest text-slate-600">Partner booking link</p>
                    <p className="mt-1 truncate text-sm font-semibold text-slate-900">Scan to book / enquire</p>
                    <p className="mt-1 text-xs text-slate-600 print:text-[11px]">
                      <span className="font-mono">jetskiandmore.com/Bookings</span> (UTM-tracked)
                    </p>
                  </div>
                  <img
                    src="/partner-pack/qr-bookings.png"
                    alt="QR code to Jet Ski & More bookings"
                    className="h-20 w-20 rounded-lg border border-slate-200 bg-white p-1"
                    loading="lazy"
                  />
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  <InfoPill icon={<Phone className="h-4 w-4" />} value="+27 (074) 658 8885" />
                  <InfoPill icon={<Mail className="h-4 w-4" />} value="info@jetskiandmore.com" />
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="rounded-full bg-slate-100 text-slate-700">Tourism-ready</Badge>
              <Badge variant="secondary" className="rounded-full bg-slate-100 text-slate-700">Corporate presentation</Badge>
              <Badge variant="secondary" className="rounded-full bg-slate-100 text-slate-700">Safety-led procedures</Badge>
              <Badge variant="secondary" className="rounded-full bg-slate-100 text-slate-700">Gordon&apos;s Bay Harbour</Badge>
            </div>
          </CardHeader>

          <Separator className="print:hidden" />

          <CardContent className="space-y-5 pt-5 print:space-y-3 print:pt-3 print:text-[11px] print:leading-snug">
            <div className="grid gap-4 md:grid-cols-3">
              <SectionCard
                title="What guests can book"
                subtitle="Seasonal availability updates via Admin."
                icon={<Sparkles className="h-4 w-4 text-slate-600" />}
              >
                <ul className="space-y-1.5 text-sm text-slate-700">
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400" />
                    <span className="min-w-0 break-words [overflow-wrap:anywhere]">Guided jet ski rides (seasonal)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400" />
                    <span className="min-w-0 break-words [overflow-wrap:anywhere]">Boat rides (spectator / harbour + bay)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400" />
                    <span className="min-w-0 break-words [overflow-wrap:anywhere]">Fishing charter enquiries</span>
                  </li>
                </ul>
                <p className="mt-3 text-xs text-slate-500 print:mt-2 print:text-[11px]">
                  If jet ski bookings are closed for winter or conditions, guests can still scan the QR to enquire and join early access.
                </p>
              </SectionCard>

              <SectionCard
                title="Safety & compliance blurb"
                subtitle="Factual credibility for partners."
                icon={<ShieldCheck className="h-4 w-4 text-slate-600" />}
              >
                <ul className="space-y-1.5 text-sm text-slate-700">
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                    <span className="min-w-0 break-words [overflow-wrap:anywhere]">Structured customer briefing + onboarding before sessions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                    <span className="min-w-0 break-words [overflow-wrap:anywhere]">Swim competency requirement (where applicable) + life jackets mandatory</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                    <span className="min-w-0 break-words [overflow-wrap:anywhere]">Weather and sea-condition stop/reschedule rules</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                    <span className="min-w-0 break-words [overflow-wrap:anywhere]">Operating procedures designed around commercial safety requirements</span>
                  </li>
                </ul>
                <p className="mt-3 text-xs text-slate-500 print:mt-2 print:text-[11px]">
                  Full detail: <span className="font-mono">jetskiandmore.com/safety</span>
                </p>
              </SectionCard>

              <SectionCard
                title="Booking process (partner)"
                subtitle="Simple handover for guests."
                icon={<MapPin className="h-4 w-4 text-slate-600" />}
              >
                <ol className="space-y-2 text-sm text-slate-700">
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-xs font-semibold text-slate-700">1</span>
                    <span className="min-w-0 break-words [overflow-wrap:anywhere]">Guest scans QR and selects an experience (or submits an enquiry).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-xs font-semibold text-slate-700">2</span>
                    <span className="min-w-0 break-words [overflow-wrap:anywhere]">We confirm availability, onboarding steps, and meeting point.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-xs font-semibold text-slate-700">3</span>
                    <span className="min-w-0 break-words [overflow-wrap:anywhere]">Payment handled online; confirmations sent to guest.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-xs font-semibold text-slate-700">4</span>
                    <span className="min-w-0 break-words [overflow-wrap:anywhere]">Partner code (optional): ____ (we can set one per property).</span>
                  </li>
                </ol>
              </SectionCard>
            </div>

            <Separator />

            <div className="grid gap-4 md:grid-cols-3">
              <div className="md:col-span-2">
                <h2 className="text-sm font-semibold text-slate-900">Commission / referral</h2>
                <div className="mt-2 rounded-xl border border-slate-200 bg-white p-4">
                  <ul className="space-y-1.5 text-sm text-slate-700">
                    <li className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400" />
                      <span className="min-w-0 break-words [overflow-wrap:anywhere]">
                        Standard listing: guests book direct via QR; no commission required.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400" />
                      <span className="min-w-0 break-words [overflow-wrap:anywhere]">
                        Referral option: partner code + monthly commission (confirmed per property).
                      </span>
                    </li>
                  </ul>
                    <div className="mt-3 grid gap-2 sm:grid-cols-2 text-xs text-slate-600">
                      <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                        Commission %: <span className="font-semibold text-slate-900">20%</span>
                      </div>
                      <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                        Partner code: <span className="font-semibold text-slate-900">{personalization.partnerCode || '_____'}</span>
                      </div>
                    </div>
                  <p className="mt-3 text-xs text-slate-500">
                    Commission applies to verified partner referrals on completed rides; settlement schedule confirmed per property.
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-medium uppercase tracking-widest text-slate-600">Launch point</p>
                <p className="mt-1 text-sm text-slate-700">
                  Gordon&apos;s Bay Harbour, Western Cape.
                </p>
                <p className="mt-2 text-xs text-slate-600">
                  Check-in instructions are sent on confirmation. Arrive 15 minutes early.
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-600">
                  <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1">
                    <MapPin className="h-3.5 w-3.5" />
                    One location
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    Safety-first
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <p className="text-xs text-slate-500">
          Tip: open <span className="font-mono">jetskiandmore.com/partner-pack?print=1</span> for a clean one-page PDF export.
        </p>
      </div>
    </div>
  )
}

function PartnerPackOnePager({ partnerCode, propertyName }: { partnerCode?: string; propertyName?: string }) {
  return (
    <div className="h-full w-full overflow-hidden bg-white text-[10px] leading-tight text-slate-900">
      <div className="flex items-start justify-between gap-6">
        <div className="flex min-w-0 items-center gap-3">
          <img src={jetskiLogo} alt="Jet Ski & More" className="h-9 w-auto" />
          <div className="min-w-0">
            <div className="truncate text-[15px] font-semibold">Jet Ski &amp; More</div>
            <div className="text-slate-600">
              Guided water activities from Gordon&apos;s Bay Harbour (False Bay) — safety-led, weather-dependent operations.
            </div>
          </div>
        </div>

        <div className="flex shrink-0 items-start gap-3">
          <img
            src="/partner-pack/qr-bookings.png"
            alt="QR code to Jet Ski & More bookings"
            className="h-[84px] w-[84px] rounded-lg border border-slate-200 bg-white p-1"
          />
          <div className="w-[78mm] text-slate-700">
            <div>
              <span className="font-semibold text-slate-900">Book / enquire:</span>{' '}
              <span className="font-mono">jetskiandmore.com/Bookings</span>
            </div>
            <div className="mt-1">
              <span className="font-semibold text-slate-900">Call:</span> +27 (074) 658 8885
            </div>
            <div className="mt-1">
              <span className="font-semibold text-slate-900">Email:</span> info@jetskiandmore.com
            </div>
            <div className="mt-1.5 text-[10px] text-slate-500">
              Partner code (optional): {partnerCode || '__________________'}
            </div>
            <div className="mt-1 text-[10px] text-slate-700">
              <span className="font-semibold text-slate-900">Commission:</span> 20% (optional referral)
            </div>
            {propertyName ? (
              <div className="mt-1 text-[10px] text-slate-700">
                <span className="font-semibold text-slate-900">Property:</span> {propertyName}
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <div className="mt-2 grid grid-cols-3 gap-2">
        <div className="rounded-lg border border-slate-200 p-2.5">
          <div className="text-[10px] font-semibold uppercase tracking-widest text-slate-600">Experiences</div>
          <ul className="mt-1.5 list-disc space-y-0.5 pl-4 text-slate-700">
            <li>Guided jet ski rides (seasonal)</li>
            <li>Boat rides (spectator / harbour + bay)</li>
            <li>Fishing charter enquiries</li>
          </ul>
          <div className="mt-2 text-[10px] text-slate-500">
            If jet ski bookings are closed, guests can still scan and enquire / join early access.
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 p-2.5">
          <div className="text-[10px] font-semibold uppercase tracking-widest text-slate-600">Safety &amp; Compliance</div>
          <ul className="mt-1.5 list-disc space-y-0.5 pl-4 text-slate-700">
            <li>Structured briefing + onboarding</li>
            <li>Life jackets mandatory</li>
            <li>Weather / sea-condition stop rules</li>
            <li>Commercial safety-led procedures</li>
          </ul>
          <div className="mt-2 text-[10px] text-slate-500">
            Full details: <span className="font-mono">jetskiandmore.com/safety</span>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 p-2.5">
          <div className="text-[10px] font-semibold uppercase tracking-widest text-slate-600">How to Book</div>
          <ol className="mt-1.5 list-decimal space-y-0.5 pl-4 text-slate-700">
            <li>Guest scans QR and selects an experience (or enquires).</li>
            <li>We confirm availability + check-in steps.</li>
            <li>Payment handled online; confirmations sent.</li>
          </ol>
          <div className="mt-2 text-[10px] text-slate-500">
            Launch point: Gordon&apos;s Bay Harbour (Western Cape).
          </div>
        </div>
      </div>

      <div className="mt-2 rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-slate-700">
        <div className="flex items-center justify-between gap-3">
          <div className="text-[10px] font-semibold uppercase tracking-widest text-slate-600">Commission (optional)</div>
          <div className="text-[10px] text-slate-600">
            Commission %: <span className="font-semibold text-slate-900">20%</span>
          </div>
        </div>
        <div className="mt-1 text-slate-700">
          Referral option available via partner code + monthly commission terms (confirmed per property).
        </div>
      </div>
    </div>
  )
}

function InfoPill({ icon, value }: { icon: React.ReactNode; value: string }) {
  return (
    <div className="flex min-w-0 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700">
      <span className="shrink-0 text-slate-500">{icon}</span>
      <span className="min-w-0 truncate">{value}</span>
    </div>
  )
}

function SectionCard({
  title,
  subtitle,
  icon,
  children,
}: {
  title: string
  subtitle?: string
  icon?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-900">{title}</p>
          {subtitle ? <p className="mt-1 text-xs text-slate-600">{subtitle}</p> : null}
        </div>
        {icon ? (
          <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white">
            {icon}
          </span>
        ) : null}
      </div>
      <div className="mt-3">{children}</div>
    </div>
  )
}
