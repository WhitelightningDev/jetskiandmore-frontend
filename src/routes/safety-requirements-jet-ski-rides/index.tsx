import * as React from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { BadgeCheck, LifeBuoy, MapPin, ShieldCheck, UserCheck, Wind } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { buttonVariants } from '@/components/ui/button'
import { SITE_ORIGIN } from '@/lib/site'
import { pickPrimaryBookingAction, useBookingControls } from '@/lib/bookingControls'

export const Route = createFileRoute('/safety-requirements-jet-ski-rides/')({
  head: () => {
    const origin = SITE_ORIGIN
    const pageUrl = `${origin}/safety-requirements-jet-ski-rides`
    const image = `${origin}/Asunnydayofjetskiing.png`
    const description =
      'Safety requirements for jet ski rides in Gordon’s Bay: structured onboarding, rider suitability checks, life jacket rules, and weather/sea-condition stop rules.'

    return {
      title: 'Safety Requirements for Jet Ski Rides | Jet Ski & More',
      meta: [
        { name: 'description', content: description },
        { property: 'og:title', content: 'Safety Requirements for Jet Ski Rides | Jet Ski & More' },
        { property: 'og:description', content: description },
        { property: 'og:image', content: image },
        { property: 'og:url', content: pageUrl },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'Safety Requirements for Jet Ski Rides | Jet Ski & More' },
        { name: 'twitter:description', content: description },
        { name: 'twitter:image', content: image },
      ],
      links: [{ rel: 'canonical', href: pageUrl }],
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { controls } = useBookingControls()
  const primary = React.useMemo(() => pickPrimaryBookingAction(controls), [controls])

  return (
    <div className="bg-gradient-to-b from-emerald-50 via-white to-white">
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-10 pb-12">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-7 space-y-4">
            <Badge className="w-fit bg-slate-900 text-white hover:bg-slate-900">Safety guide</Badge>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900">
              Safety Requirements for Jet Ski Rides
            </h1>
            <p className="text-base md:text-lg text-slate-600">
              This page summarises what we require before riding — designed for clarity for tourists, first-timers, and group
              organisers. For formal procedures and compliance context, see our Safety &amp; Compliance page.
            </p>
            <div className="flex flex-wrap gap-2">
              {primary.enabled ? (
                <Link to={primary.to} className={buttonVariants({ size: 'sm' })}>
                  {primary.label}
                </Link>
              ) : (
                <Link to="/contact" className={buttonVariants({ size: 'sm' })}>
                  Contact us
                </Link>
              )}
              <Link to="/safety" className={buttonVariants({ variant: 'outline', size: 'sm' })}>
                Safety &amp; compliance
              </Link>
              <Link to="/jet-ski-faqs-gordons-bay" className={buttonVariants({ variant: 'outline', size: 'sm' })}>
                FAQs
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-3xl border border-emerald-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-4">
                <img src="/samsa-logo.png" alt="SAMSA certified operator" className="h-12 w-auto object-contain" />
                <div className="leading-tight">
                  <p className="text-[11px] uppercase tracking-[0.22em] text-emerald-700 font-semibold">SAMSA certified</p>
                  <p className="text-sm text-slate-700">
                    We operate from Gordon&apos;s Bay Harbour with safety-led briefings and supervised launches.
                  </p>
                </div>
              </div>
              <Separator className="my-4" />
              <div className="flex items-start gap-3 text-sm text-slate-600">
                <MapPin className="mt-0.5 h-4 w-4 text-emerald-700" aria-hidden />
                <p>
                  <span className="font-semibold text-slate-900">Launch point:</span> Gordon&apos;s Bay Harbour (False Bay).
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid gap-6 lg:grid-cols-12">
          <Card className="lg:col-span-7 border-emerald-200 bg-white">
            <CardHeader>
              <CardTitle>Minimum rider requirements</CardTitle>
              <CardDescription>What we need to confirm before you ride.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-slate-600">
              <Requirement
                icon={<UserCheck className="h-4 w-4 text-emerald-700" aria-hidden />}
                title="Ability to follow instructions"
                description="You must be able to understand and follow our briefing, signals, and riding-zone boundaries."
              />
              <Requirement
                icon={<LifeBuoy className="h-4 w-4 text-emerald-700" aria-hidden />}
                title="Basic swim competency"
                description="We confirm basic swim competency as part of rider suitability checks."
              />
              <Requirement
                icon={<ShieldCheck className="h-4 w-4 text-emerald-700" aria-hidden />}
                title="Safety gear rules"
                description="Life jackets are mandatory. Kill-switch use is mandatory for operators where applicable."
              />
              <Requirement
                icon={<BadgeCheck className="h-4 w-4 text-emerald-700" aria-hidden />}
                title="Structured onboarding"
                description="Every session includes a briefing + controls demo before launch. No skipping the onboarding."
              />
            </CardContent>
          </Card>

          <Card className="lg:col-span-5 border-emerald-200 bg-emerald-50/40">
            <CardHeader>
              <CardTitle>Arrive prepared</CardTitle>
              <CardDescription>Simple checklist for a smoother session.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-slate-700">
              <ul className="list-disc pl-5 space-y-1">
                <li>Arrive early for check-in and gear fitting</li>
                <li>Bring a towel + a change of clothes</li>
                <li>Bring sunscreen and water</li>
                <li>Bring a warm layer for wind (season-dependent)</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <Separator className="my-10" />

        <div className="grid gap-6 lg:grid-cols-12">
          <Card className="lg:col-span-7 border-emerald-200 bg-white">
            <CardHeader>
              <CardTitle>Weather & sea-condition rules</CardTitle>
              <CardDescription>False Bay is real ocean — we run conservative stop rules.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-slate-600">
              <div className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-white p-4">
                <span className="mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 ring-1 ring-emerald-200">
                  <Wind className="h-4 w-4 text-emerald-700" aria-hidden />
                </span>
                <div className="min-w-0">
                  <p className="font-semibold text-slate-900">Wind + swell can pause operations</p>
                  <p className="mt-1">
                    Strong South‑East wind can build steep chop quickly. If conditions are unsafe we pause, shorten, or reschedule.
                  </p>
                </div>
              </div>
              <p>
                The goal is simple: keep riders safe and avoid “pushing through” when the bay turns. If you’re travelling from
                Cape Town, message us for a same-day conditions check.
              </p>
            </CardContent>
          </Card>

          <Card className="lg:col-span-5 border-emerald-200 bg-emerald-50/40">
            <CardHeader>
              <CardTitle>Helpful links</CardTitle>
              <CardDescription>More context for planning your ride.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              <Link to="/weather" className={buttonVariants({ variant: 'outline', size: 'sm' })}>
                Weather guidance
              </Link>
              <Link to="/jet-ski-rental-gordons-bay" className={buttonVariants({ variant: 'outline', size: 'sm' })}>
                Rental guide
              </Link>
              <Link to="/guided-jet-ski-rides-false-bay" className={buttonVariants({ variant: 'outline', size: 'sm' })}>
                Guided rides in False Bay
              </Link>
              <Link to="/contact" className={buttonVariants({ variant: 'outline', size: 'sm' })}>
                Contact us
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}

function Requirement({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-white p-4">
      <span className="mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 ring-1 ring-emerald-200">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="font-semibold text-slate-900">{title}</p>
        <p className="mt-1">{description}</p>
      </div>
    </div>
  )
}

