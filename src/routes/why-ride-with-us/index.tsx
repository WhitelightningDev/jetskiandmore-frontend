import * as React from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { BadgeCheck, Camera, MapPin, ShieldCheck, Users, Waves } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { buttonVariants } from '@/components/ui/button'
import { SITE_ORIGIN } from '@/lib/site'
import { pickPrimaryBookingAction, useBookingControls } from '@/lib/bookingControls'
import harbourImg from '@/lib/images/IMG_3202.jpg'

export const Route = createFileRoute('/why-ride-with-us/')({
  head: () => {
    const origin = SITE_ORIGIN
    const pageUrl = `${origin}/why-ride-with-us`
    const image = `${origin}/Asunnydayofjetskiing.png`
    const description =
      'Why ride with Jet Ski & More: operating since 2020, Gordon’s Bay Harbour launch point, structured onboarding, guided format, and optional drone/GoPro content.'

    return {
      title: "Why ride with us | Jet Ski & More (Gordon's Bay)",
      meta: [
        { name: 'description', content: description },
        { property: 'og:title', content: 'Why ride with us | Jet Ski & More' },
        { property: 'og:description', content: description },
        { property: 'og:image', content: image },
        { property: 'og:url', content: pageUrl },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'Why ride with us | Jet Ski & More' },
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
  const jetSkisOpen = controls.jetSkiBookingsEnabled

  return (
    <div className="bg-background">
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-10 pb-12">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-6 space-y-4">
            <Badge className="w-fit bg-slate-900 text-white hover:bg-slate-900">Proof pillars</Badge>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900">
              Why ride with Jet Ski &amp; More
            </h1>
            <p className="text-base md:text-lg text-slate-600">
              We run a structured, safety-led operation from Gordon&apos;s Bay Harbour. If you&apos;re comparing operators,
              these are the proof points that matter.
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
              <Link to="/jet-ski-faqs-gordons-bay" className={buttonVariants({ variant: 'outline', size: 'sm' })}>
                Read Jet Ski FAQs
              </Link>
            </div>
            {!jetSkisOpen ? (
              <p className="text-sm text-slate-600">
                Jet ski bookings are currently closed for the season. Boat rides and other enquiries remain available.
              </p>
            ) : null}
          </div>

          <div className="lg:col-span-6">
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              <img
                src={harbourImg}
                alt="Gordon’s Bay Harbour launch point"
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
          <PillarCard
            icon={<BadgeCheck className="h-5 w-5 text-primary" aria-hidden />}
            title="Operating since 2020"
            description="We’ve built repeatable operating procedures over multiple seasons — not a pop-up setup."
          />
          <PillarCard
            icon={<MapPin className="h-5 w-5 text-primary" aria-hidden />}
            title="Gordon’s Bay Harbour launch point"
            description="A clear meeting location with parking nearby and a consistent briefing/check-in flow."
          />
          <PillarCard
            icon={<ShieldCheck className="h-5 w-5 text-primary" aria-hidden />}
            title="Structured onboarding before riding"
            description="Controls demo, eligibility rules, operating-zone boundaries, and safety equipment check."
          />
          <PillarCard
            icon={<Waves className="h-5 w-5 text-primary" aria-hidden />}
            title="Guided ride format"
            description="A safety-led ride format with support and boundaries that work for first-timers and tourists."
          />
          <PillarCard
            icon={<Camera className="h-5 w-5 text-primary" aria-hidden />}
            title="Optional drone / GoPro content"
            description="Capture the ride when conditions allow — perfect for birthdays, proposals, and group days."
          />
          <PillarCard
            icon={<Users className="h-5 w-5 text-primary" aria-hidden />}
            title="Family / tourist friendly"
            description="Clear comms, simple logistics, and spectator boat rides for friends and family."
          />
        </div>

        <div className="mt-10 grid gap-4 lg:grid-cols-12">
          <Card className="lg:col-span-7 border-slate-200">
            <CardHeader>
              <CardTitle>How it works on the day</CardTitle>
              <CardDescription>Designed to be clear, repeatable, and safe.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-slate-600">
              <ul className="list-disc pl-5 space-y-2">
                <li>Arrive early at Gordon&apos;s Bay Harbour for check-in and gear fitting.</li>
                <li>Complete a structured safety briefing and controls onboarding.</li>
                <li>Ride within the designated operating zone with staff support and guidance.</li>
                <li>Add-ons like GoPro or drone footage are available when conditions permit.</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="lg:col-span-5 border-slate-200 bg-slate-50/40">
            <CardHeader>
              <CardTitle>Next steps</CardTitle>
              <CardDescription>Helpful pages for first-time riders.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              <Link to="/jet-ski-rental-gordons-bay" className={buttonVariants({ variant: 'outline', size: 'sm' })}>
                Jet Ski Rental Gordon’s Bay
              </Link>
              <Link
                to="/guided-jet-ski-rides-false-bay"
                className={buttonVariants({ variant: 'outline', size: 'sm' })}
              >
                Guided rides in False Bay
              </Link>
              <Link
                to="/safety"
                className={buttonVariants({ variant: 'outline', size: 'sm' })}
              >
                Safety &amp; compliance
              </Link>
              <Link
                to="/things-to-do-gordons-bay-on-the-water"
                className={buttonVariants({ variant: 'outline', size: 'sm' })}
              >
                Things to do on the water
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}

function PillarCard({
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
