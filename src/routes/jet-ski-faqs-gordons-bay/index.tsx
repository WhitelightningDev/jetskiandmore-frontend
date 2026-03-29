import * as React from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { BadgeCheck, CalendarDays, CloudSun, MapPin, ShieldCheck, Waves } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { buttonVariants } from '@/components/ui/button'
import { SITE_ORIGIN } from '@/lib/site'
import { pickPrimaryBookingAction, useBookingControls } from '@/lib/bookingControls'
import goproImg from '@/lib/images/gopro-footage.png'

export const Route = createFileRoute('/jet-ski-faqs-gordons-bay/')({
  head: () => {
    const origin = SITE_ORIGIN
    const pageUrl = `${origin}/jet-ski-faqs-gordons-bay`
    const image = `${origin}/Asunnydayofjetskiing.png`
    const description =
      "Jet ski FAQs for Gordon’s Bay: launch point, booking, guided format, safety briefing, weather rules, and optional GoPro/drone add-ons."

    return {
      title: "Jet Ski FAQs Gordon's Bay | Jet Ski & More",
      meta: [
        { name: 'description', content: description },
        { property: 'og:title', content: "Jet Ski FAQs Gordon's Bay | Jet Ski & More" },
        { property: 'og:description', content: description },
        { property: 'og:image', content: image },
        { property: 'og:url', content: pageUrl },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: "Jet Ski FAQs Gordon's Bay | Jet Ski & More" },
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
    <div className="bg-background">
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-10 pb-12">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-7 space-y-4">
            <Badge className="w-fit bg-slate-900 text-white hover:bg-slate-900">Local guide</Badge>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900">
              Jet Ski FAQs (Gordon&apos;s Bay)
            </h1>
            <p className="text-base md:text-lg text-slate-600">
              Quick answers to common questions about guided jet ski rides in Gordon&apos;s Bay Harbour and False Bay — booking,
              safety briefing, onboarding, and what to expect on the day.
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
              <Link to="/jet-ski-rental-gordons-bay" className={buttonVariants({ variant: 'outline', size: 'sm' })}>
                Rental guide
              </Link>
              <Link to="/safety" className={buttonVariants({ variant: 'outline', size: 'sm' })}>
                Safety &amp; compliance
              </Link>
            </div>
          </div>
          <div className="lg:col-span-5">
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              <img
                src={goproImg}
                alt="Optional GoPro footage add-on"
                className="h-64 w-full object-cover md:h-80"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid gap-6 lg:grid-cols-12">
          <Card className="lg:col-span-7 border-slate-200">
            <CardHeader>
              <CardTitle>Booking & logistics</CardTitle>
              <CardDescription>Where to meet, when to arrive, and how booking works.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-slate-600">
              <QA
                icon={<MapPin className="h-4 w-4 text-primary" aria-hidden />}
                q="Where do we meet?"
                a="Gordon’s Bay Harbour. We’ll confirm the meeting point and check-in flow on your booking or enquiry."
              />
              <QA
                icon={<CalendarDays className="h-4 w-4 text-primary" aria-hidden />}
                q="How do I book?"
                a="When jet skis are open you can book online. For larger groups (5+), events, or tailored timing, contact us and we’ll help."
              />
              <QA
                icon={<Waves className="h-4 w-4 text-primary" aria-hidden />}
                q="Is it guided or free riding?"
                a="We run a safety-led format with a structured briefing, defined operating boundaries, and support during the ride window."
              />
            </CardContent>
          </Card>

          <Card className="lg:col-span-5 border-slate-200 bg-slate-50/40">
            <CardHeader>
              <CardTitle>Quick proof pillars</CardTitle>
              <CardDescription>Why tourists and locals choose us.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-slate-600">
              <div className="flex items-start gap-3">
                <BadgeCheck className="mt-0.5 h-4 w-4 text-primary" aria-hidden />
                <p>
                  <span className="font-semibold text-slate-900">Operating since 2020</span> with a repeatable onboarding process.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <ShieldCheck className="mt-0.5 h-4 w-4 text-primary" aria-hidden />
                <p>
                  <span className="font-semibold text-slate-900">Structured briefing</span> before every ride.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 text-primary" aria-hidden />
                <p>
                  <span className="font-semibold text-slate-900">One launch point</span>: Gordon&apos;s Bay Harbour.
                </p>
              </div>
              <div className="pt-2">
                <Link to="/why-ride-with-us" className={buttonVariants({ variant: 'outline', size: 'sm' })}>
                  Why ride with us
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        <Separator className="my-10" />

        <div className="grid gap-6 lg:grid-cols-12">
          <Card className="lg:col-span-7 border-slate-200">
            <CardHeader>
              <CardTitle>Safety & conditions</CardTitle>
              <CardDescription>What to expect before you ride and how we handle weather.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-slate-600">
              <QA
                icon={<ShieldCheck className="h-4 w-4 text-primary" aria-hidden />}
                q="Do you do a safety briefing?"
                a="Yes — every session includes a structured onboarding with rules, operating boundaries, and a controls demo."
              />
              <QA
                icon={<CloudSun className="h-4 w-4 text-primary" aria-hidden />}
                q="What happens if the weather is bad?"
                a="False Bay can change quickly. If conditions are unsafe, we pause/shorten sessions or reschedule. Safety overrides schedules."
              />
              <QA
                icon={<Waves className="h-4 w-4 text-primary" aria-hidden />}
                q="Do I need experience?"
                a="No prior experience is required for most riders. We’ll guide you through the onboarding and confirm suitability on the day."
              />
            </CardContent>
          </Card>

          <Card className="lg:col-span-5 border-slate-200 bg-slate-50/40">
            <CardHeader>
              <CardTitle>What to bring</CardTitle>
              <CardDescription>Simple checklist.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-slate-600">
              <ul className="list-disc pl-5 space-y-1">
                <li>Towel and a change of clothes</li>
                <li>Sunscreen and water</li>
                <li>Warm layer for wind (season-dependent)</li>
                <li>Phone in a waterproof pouch if bringing it along</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <Separator className="my-10" />

        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle>Still unsure?</CardTitle>
            <CardDescription>We’ll answer quickly and point you to the right booking flow.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Link to="/contact" className={buttonVariants({ size: 'sm' })}>
              Contact us
            </Link>
            <Link to="/things-to-do-gordons-bay-on-the-water" className={buttonVariants({ variant: 'outline', size: 'sm' })}>
              Things to do on the water
            </Link>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}

function QA({
  icon,
  q,
  a,
}: {
  icon: React.ReactNode
  q: string
  a: string
}) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4">
      <span className="mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/15">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="font-semibold text-slate-900">{q}</p>
        <p className="mt-1">{a}</p>
      </div>
    </div>
  )
}
