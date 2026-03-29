import * as React from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { BadgeCheck, Camera, MapPin, ShieldCheck, Waves, Wind } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { buttonVariants } from '@/components/ui/button'
import { SITE_ORIGIN } from '@/lib/site'
import { pickPrimaryBookingAction, useBookingControls } from '@/lib/bookingControls'
import harbourImg from '@/lib/images/IMG_3202.jpg'

export const Route = createFileRoute('/guided-jet-ski-rides-false-bay/')({
  head: () => {
    const origin = SITE_ORIGIN
    const pageUrl = `${origin}/guided-jet-ski-rides-false-bay`
    const image = `${origin}/Asunnydayofjetskiing.png`
    const description =
      "Guided jet ski rides in False Bay launching from Gordon’s Bay Harbour. Structured onboarding, safety-led boundaries, and optional GoPro/drone add-ons when conditions allow."

    return {
      title: 'Guided Jet Ski Rides in False Bay | Jet Ski & More',
      meta: [
        { name: 'description', content: description },
        { property: 'og:title', content: 'Guided Jet Ski Rides in False Bay | Jet Ski & More' },
        { property: 'og:description', content: description },
        { property: 'og:image', content: image },
        { property: 'og:url', content: pageUrl },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'Guided Jet Ski Rides in False Bay | Jet Ski & More' },
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
              Guided Jet Ski Rides in False Bay
            </h1>
            <p className="text-base md:text-lg text-slate-600">
              False Bay conditions can change quickly — a guided format helps first-timers and tourists ride confidently.
              We launch from Gordon&apos;s Bay Harbour with structured onboarding and clear operating-zone boundaries.
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

          <div className="lg:col-span-6">
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              <img
                src={harbourImg}
                alt="False Bay conditions near Gordon’s Bay"
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
            icon={<ShieldCheck className="h-5 w-5 text-primary" aria-hidden />}
            title="Structured onboarding"
            description="Briefing + controls demo before every session, with clear rules and expectations."
          />
          <InfoCard
            icon={<Waves className="h-5 w-5 text-primary" aria-hidden />}
            title="Guided format"
            description="A safety-led ride window with defined boundaries and support — designed for confidence."
          />
          <InfoCard
            icon={<MapPin className="h-5 w-5 text-primary" aria-hidden />}
            title="Gordon’s Bay Harbour launch"
            description="Clear meeting logistics for visitors, groups, and tourism partners."
          />
          <InfoCard
            icon={<Wind className="h-5 w-5 text-primary" aria-hidden />}
            title="Condition-aware decisions"
            description="If wind or swell makes False Bay unsafe, safety overrides schedules and we pause/reschedule."
          />
          <InfoCard
            icon={<Camera className="h-5 w-5 text-primary" aria-hidden />}
            title="Optional GoPro / drone"
            description="Add media extras when conditions allow (availability varies by day)."
          />
          <InfoCard
            icon={<BadgeCheck className="h-5 w-5 text-primary" aria-hidden />}
            title="Operating since 2020"
            description="A long-running operation focused on repeatable procedures and clear communication."
          />
        </div>

        <Separator className="my-10" />

        <div className="grid gap-6 lg:grid-cols-12">
          <Card className="lg:col-span-7 border-slate-200">
            <CardHeader>
              <CardTitle>What “guided” means (in plain language)</CardTitle>
              <CardDescription>A format that makes riding simpler and safer for more people.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-slate-600">
              <ul className="list-disc pl-5 space-y-2">
                <li>You&apos;re briefed before launch, with a clear explanation of the riding zone and right-of-way basics.</li>
                <li>We run a defined riding window and area to reduce traffic conflict and keep support close.</li>
                <li>We monitor conditions and can shorten, pause, or stop sessions when it&apos;s not safe to continue.</li>
                <li>First-timers get a structure that reduces stress and improves confidence on the water.</li>
              </ul>
              <p>
                False Bay is beautiful — but it&apos;s not a theme park. A guided format helps keep the experience fun without
                gambling on conditions.
              </p>
            </CardContent>
          </Card>

          <Card className="lg:col-span-5 border-slate-200 bg-slate-50/40">
            <CardHeader>
              <CardTitle>Related pages</CardTitle>
              <CardDescription>Useful context for planning.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              <Link to="/jet-ski-rental-gordons-bay" className={buttonVariants({ variant: 'outline', size: 'sm' })}>
                Jet Ski Rental Gordon’s Bay
              </Link>
              <Link to="/things-to-do-gordons-bay-on-the-water" className={buttonVariants({ variant: 'outline', size: 'sm' })}>
                Things to do on the water
              </Link>
              <Link to="/safety" className={buttonVariants({ variant: 'outline', size: 'sm' })}>
                Safety &amp; compliance
              </Link>
              <Link to="/why-ride-with-us" className={buttonVariants({ variant: 'outline', size: 'sm' })}>
                Why ride with us
              </Link>
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
