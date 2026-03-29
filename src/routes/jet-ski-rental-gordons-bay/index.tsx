import * as React from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { BadgeCheck, CalendarDays, Camera, MapPin, ShieldCheck, Waves } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { buttonVariants } from '@/components/ui/button'
import { SITE_ORIGIN } from '@/lib/site'
import { pickPrimaryBookingAction, useBookingControls } from '@/lib/bookingControls'
import rideImg from '@/lib/images/IMG_3203.jpg'

export const Route = createFileRoute('/jet-ski-rental-gordons-bay/')({
  head: () => {
    const origin = SITE_ORIGIN
    const pageUrl = `${origin}/jet-ski-rental-gordons-bay`
    const image = `${origin}/Asunnydayofjetskiing.png`
    const description =
      "Jet ski rental in Gordon’s Bay: safety-first guided sessions from Gordon’s Bay Harbour, structured onboarding, and optional GoPro/drone add-ons."

    return {
      title: "Jet Ski Rental Gordon's Bay | Jet Ski & More",
      meta: [
        { name: 'description', content: description },
        { property: 'og:title', content: "Jet Ski Rental Gordon's Bay | Jet Ski & More" },
        { property: 'og:description', content: description },
        { property: 'og:image', content: image },
        { property: 'og:url', content: pageUrl },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: "Jet Ski Rental Gordon's Bay | Jet Ski & More" },
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
          <div className="lg:col-span-6 space-y-4">
            <Badge className="w-fit bg-slate-900 text-white hover:bg-slate-900">Local guide</Badge>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900">
              Jet Ski Rental in Gordon&apos;s Bay
            </h1>
            <p className="text-base md:text-lg text-slate-600">
              Safety-first guided jet ski experiences from Gordon&apos;s Bay Harbour — with structured onboarding before
              you ride and optional GoPro/drone content.
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
              <Link to="/terms" className={buttonVariants({ variant: 'outline', size: 'sm' })}>
                FAQs &amp; terms
              </Link>
              <Link to="/safety" className={buttonVariants({ variant: 'outline', size: 'sm' })}>
                Safety &amp; compliance
              </Link>
            </div>

            {!controls.jetSkiBookingsEnabled ? (
              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
                <p className="font-semibold">Jet ski bookings are currently closed for the season.</p>
                <p className="mt-1 text-amber-900/80">
                  Boat rides are still available. We reopen on 1 November.
                </p>
                {controls.boatRideBookingsEnabled ? (
                  <Link to="/boat-ride" className={`${buttonVariants({ size: 'sm' })} mt-3 inline-flex`}>
                    <CalendarDays className="mr-2 h-4 w-4" aria-hidden />
                    Request a boat ride
                  </Link>
                ) : null}
              </div>
            ) : null}
          </div>

          <div className="lg:col-span-6">
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              <img
                src={rideImg}
                alt="Jet ski riders in Gordon’s Bay"
                className="h-64 w-full object-cover md:h-80"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <InfoCard
            icon={<MapPin className="h-5 w-5 text-primary" aria-hidden />}
            title="Launch point"
            description="We operate from Gordon’s Bay Harbour — close to Harbour Island and Bikini Beach."
          />
          <InfoCard
            icon={<ShieldCheck className="h-5 w-5 text-primary" aria-hidden />}
            title="Structured onboarding"
            description="Briefing + controls demo before every session, with clear operating-zone boundaries."
          />
          <InfoCard
            icon={<Waves className="h-5 w-5 text-primary" aria-hidden />}
            title="Guided format"
            description="A safety-led format with support — ideal for tourists, first-timers, and groups."
          />
          <InfoCard
            icon={<Camera className="h-5 w-5 text-primary" aria-hidden />}
            title="Optional media add-ons"
            description="Add GoPro or drone content when conditions allow (availability varies by day)."
          />
          <InfoCard
            icon={<BadgeCheck className="h-5 w-5 text-primary" aria-hidden />}
            title="Operating since 2020"
            description="A long-running operation focused on process, safety, and clear communication."
          />
          <InfoCard
            icon={<CalendarDays className="h-5 w-5 text-primary" aria-hidden />}
            title="Booking"
            description="Online booking when open; contact us for larger groups, events, or tailored sessions."
          />
        </div>

        <Separator className="my-10" />

        <div className="grid gap-6 lg:grid-cols-12">
          <Card className="lg:col-span-7 border-slate-200">
            <CardHeader>
              <CardTitle>Where we operate (local context)</CardTitle>
              <CardDescription>Helpful for visitors searching “jet ski Cape Town”.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-slate-600">
              <p>
                Gordon&apos;s Bay sits on the edge of False Bay near Somerset West and Strand, within driving distance of
                Cape Town. Our launch point is Gordon&apos;s Bay Harbour — a clear, central meeting location.
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Nearby landmarks: Harbour Island, Bikini Beach, Clarence Drive (R44) viewpoint route.</li>
                <li>Bay context: False Bay conditions vary — we monitor wind and sea state before launches.</li>
                <li>Tour-friendly: clear meeting instructions and a structured briefing before you ride.</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="lg:col-span-5 border-slate-200 bg-slate-50/40">
            <CardHeader>
              <CardTitle>Quick answers</CardTitle>
              <CardDescription>More details on the FAQ page.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-slate-600">
              <div>
                <p className="font-semibold text-slate-900">Is it guided?</p>
                <p>Yes — sessions follow a guided format with onboarding and clear riding-zone boundaries.</p>
              </div>
              <div>
                <p className="font-semibold text-slate-900">Do you do GoPro/drone?</p>
                <p>Optional add-ons are available when conditions and scheduling allow.</p>
              </div>
              <div>
                <p className="font-semibold text-slate-900">Where do we meet?</p>
                <p>Gordon&apos;s Bay Harbour. Arrive early to allow time for onboarding and gear fitting.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}

function InfoCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <Card className="border-slate-200">
      <CardHeader className="space-y-3">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/15">
          {icon}
        </span>
        <div className="space-y-1">
          <CardTitle className="text-base">{title}</CardTitle>
          <CardDescription className="text-slate-600">{description}</CardDescription>
        </div>
      </CardHeader>
    </Card>
  )
}
