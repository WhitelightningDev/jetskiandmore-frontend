import * as React from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { Anchor, Camera, Fish, Ship, Waves } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { buttonVariants } from '@/components/ui/button'
import { SITE_ORIGIN } from '@/lib/site'
import { pickPrimaryBookingAction, useBookingControls } from '@/lib/bookingControls'
import boatImg from '@/lib/images/Spectatorboatride.png'

export const Route = createFileRoute('/things-to-do-gordons-bay-on-the-water/')({
  head: () => {
    const origin = SITE_ORIGIN
    const pageUrl = `${origin}/things-to-do-gordons-bay-on-the-water`
    const image = `${origin}/Asunnydayofjetskiing.png`
    const description =
      "Things to do in Gordon’s Bay on the water: guided jet ski rides (seasonal), boat rides in False Bay, and fishing charter enquiries — all launching from Gordon’s Bay Harbour."

    return {
      title: "Things to Do in Gordon's Bay on the Water | Jet Ski & More",
      meta: [
        { name: 'description', content: description },
        { property: 'og:title', content: "Things to Do in Gordon's Bay on the Water | Jet Ski & More" },
        { property: 'og:description', content: description },
        { property: 'og:image', content: image },
        { property: 'og:url', content: pageUrl },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: "Things to Do in Gordon's Bay on the Water | Jet Ski & More" },
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
              Things to Do in Gordon&apos;s Bay on the Water
            </h1>
            <p className="text-base md:text-lg text-slate-600">
              Gordon&apos;s Bay is one of the Western Cape&apos;s easiest launch points into False Bay. Here are water activities
              we run from Gordon&apos;s Bay Harbour — designed for tourists, locals, and groups.
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
              <Link to="/rides" className={buttonVariants({ variant: 'outline', size: 'sm' })}>
                See rides &amp; pricing
              </Link>
              <Link to="/contact" className={buttonVariants({ variant: 'outline', size: 'sm' })}>
                Ask availability
              </Link>
            </div>
          </div>
          <div className="lg:col-span-6">
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              <img
                src={boatImg}
                alt="Boat rides launching from Gordon’s Bay Harbour"
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
          <ActivityCard
            icon={<Waves className="h-5 w-5 text-primary" aria-hidden />}
            title="Guided jet ski rides (seasonal)"
            description="Safety-led sessions with structured onboarding and optional media add-ons."
            cta={{
              label: controls.jetSkiBookingsEnabled ? 'Book jet skis' : 'Jet skis closed (seasonal)',
              to: controls.jetSkiBookingsEnabled ? '/Bookings' : '/why-ride-with-us',
            }}
          />
          <ActivityCard
            icon={<Ship className="h-5 w-5 text-primary" aria-hidden />}
            title="False Bay boat rides"
            description="A scenic outing for tourists, couples, and families — great as a stand-alone activity."
            cta={{
              label: controls.boatRideBookingsEnabled ? 'Request a boat ride' : 'Boat rides',
              to: '/boat-ride',
            }}
          />
          <ActivityCard
            icon={<Fish className="h-5 w-5 text-primary" aria-hidden />}
            title="Fishing charters (enquiry)"
            description="Enquire for dates and conditions with an experienced skipper and local knowledge."
            cta={{
              label: controls.fishingChartersBookingsEnabled ? 'Enquire fishing' : 'Fishing charters',
              to: '/fishing-charters',
            }}
          />
        </div>

        <Separator className="my-10" />

        <div className="grid gap-6 lg:grid-cols-12">
          <Card className="lg:col-span-7 border-slate-200">
            <CardHeader>
              <CardTitle>Local landmarks & planning tips</CardTitle>
              <CardDescription>Useful context for visitors searching “Gordon&apos;s Bay water activities”.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-slate-600">
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <span className="font-semibold text-slate-900">Gordon&apos;s Bay Harbour</span>: your meeting point for launches.
                </li>
                <li>
                  <span className="font-semibold text-slate-900">Harbour Island</span>: a nearby spot for coffee/food after your session.
                </li>
                <li>
                  <span className="font-semibold text-slate-900">Bikini Beach</span>: a popular family-friendly beach close to the harbour.
                </li>
                <li>
                  <span className="font-semibold text-slate-900">Clarence Drive (R44)</span>: one of the best coastal roads for False Bay viewpoints.
                </li>
              </ul>
              <p>
                Conditions in False Bay can change quickly, especially with South‑East winds. If conditions are unsafe we
                pause or reschedule — safety overrides schedules.
              </p>
            </CardContent>
          </Card>

          <Card className="lg:col-span-5 border-slate-200 bg-slate-50/40">
            <CardHeader>
              <CardTitle>Photo add-ons</CardTitle>
              <CardDescription>Make it shareable when conditions allow.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-slate-600">
              <div className="flex items-start gap-3">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/15">
                  <Camera className="h-4 w-4 text-primary" aria-hidden />
                </span>
                <div>
                  <p className="font-semibold text-slate-900">GoPro footage</p>
                  <p>Available as an add-on (subject to availability and conditions).</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/15">
                  <Anchor className="h-4 w-4 text-primary" aria-hidden />
                </span>
                <div>
                  <p className="font-semibold text-slate-900">Drone clips</p>
                  <p>When wind permits, drone content is an optional extra for special occasions.</p>
                </div>
              </div>
              <div className="pt-2">
                <Link to="/why-ride-with-us" className={buttonVariants({ variant: 'outline', size: 'sm' })}>
                  Why ride with us
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-10 rounded-3xl border border-slate-200 bg-white p-6 md:p-10">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="space-y-1">
              <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">Next step</p>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">Pick your water activity</h2>
              <p className="text-sm text-slate-600">
                Prefer jet skis? Want a calmer boat ride? Or planning a fishing day? We&apos;ll point you to the right flow.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link to="/rides" className={buttonVariants({ size: 'sm' })}>
                See rides
              </Link>
              <Link to="/boat-ride" className={buttonVariants({ variant: 'outline', size: 'sm' })}>
                Boat rides
              </Link>
              <Link to="/fishing-charters" className={buttonVariants({ variant: 'outline', size: 'sm' })}>
                Fishing
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

function ActivityCard({
  icon,
  title,
  description,
  cta,
}: {
  icon: React.ReactNode
  title: string
  description: string
  cta: { label: string; to: string }
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
      <CardContent>
        <Link to={cta.to} className={buttonVariants({ variant: 'outline', size: 'sm' })}>
          {cta.label}
        </Link>
      </CardContent>
    </Card>
  )
}
