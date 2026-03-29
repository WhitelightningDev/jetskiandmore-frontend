
import * as React from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { MapPin, Clock, Users, Ship, CalendarDays, ShieldCheck, Fish, CalendarX2, Waves } from 'lucide-react'
import { pickPrimaryBookingAction, useBookingControls } from '@/lib/bookingControls'

export const Route = createFileRoute('/rides/')({
  component: RouteComponent,
})

type Ride = {
  id: string
  icon: React.ReactNode
  title: string
  subtitle: string
  bullets: string[]
  price: string
  cta?: { to: string; label: string; variant?: 'default' | 'outline' | 'ghost' }
  badge?: string
}

const rides: Ride[] = [
  {
    id: '30-1',
    icon: <Clock className="h-5 w-5" />,
    title: '30‑min Rental (1 Jet‑Ski)',
    subtitle: "Quick burst of fun",
    bullets: [
      "Safety briefing & life jackets included",
      "Ride inside our marked zone",
      "Ideal taster session",
    ],
    price: 'From ZAR 1,488',
    cta: { to: '/Bookings', label: 'Book 30‑min' },
  },
  {
    id: '60-1',
    icon: <Clock className="h-5 w-5" />,
    title: '60‑min Rental (1 Jet‑Ski)',
    subtitle: "Extra time to explore",
    bullets: [
      "More time on the water",
      "Passenger optional",
      "Sheltered areas on windy days",
    ],
    price: 'From ZAR 2,210',
    cta: { to: '/Bookings', label: 'Book 60‑min' },
  },
  {
    id: '30-2',
    icon: <Users className="h-5 w-5" />,
    title: '30‑min Rental (2 Jet‑Skis)',
    subtitle: "Ride together",
    bullets: [
      "Two skis launched together",
      "Great for friends or couples",
      "Stay within marked riding zone",
    ],
    price: 'From ZAR 2,635',
    cta: { to: '/Bookings', label: 'Book 2 skis (30m)' },
  },
  {
    id: '60-2',
    icon: <Users className="h-5 w-5" />,
    title: '60‑min Rental (2 Jet‑Skis)',
    subtitle: "Double the fun, more time",
    bullets: [
      "Two skis for a full hour",
      "Plenty of time for swapping riders",
      "Briefing & gear included",
    ],
    price: 'From ZAR 4,080',
    cta: { to: '/Bookings', label: 'Book 2 skis (60m)' },
  },
  {
    id: 'joy',
    icon: <Ship className="h-5 w-5" />,
    title: 'Joy Ride (Instructed) • 10 min',
    subtitle: "Instructor drives / assisted",
    bullets: [
      "Perfect for under‑aged guests or first‑timers",
      "Experience the thrill with an expert",
      "Photos/video add‑on available",
    ],
    price: 'ZAR 595',
    cta: { to: '/Bookings', label: 'Book Joy Ride' },
  },
  {
    id: 'group',
    icon: <Users className="h-5 w-5" />,
    title: 'Group Session • 2 hr 30 min',
    subtitle: "For 5+ people (events & teams)",
    bullets: [
      "Multiple skis rotated among your group",
      "Briefing, gear and supervision included",
      "Great for parties & team‑builds",
    ],
    price: 'From ZAR 6,375',
    cta: { to: '/Bookings', label: 'Enquire / Book' },
  },
  {
    id: 'coastal-cruise',
    icon: <Ship className="h-5 w-5" />,
    title: 'Coastal Cruise • 60 min',
    subtitle: 'Guided group ride along the bay',
    bullets: [
      'Requires minimum 4 jet skis to operate',
      'Price per jet ski, up to 6 skis',
      'Ideal for teams or friends riding together',
    ],
    price: 'From ZAR 8,840 (4 skis)',
    badge: 'Group experience',
    cta: { to: '/Bookings', label: 'Book Coastal Cruise' },
  },
]

function RideCard({ ride }: { ride: Ride }) {
  return (
    <Card className="flex flex-col bg-white/95 shadow-md hover:shadow-lg transition-shadow border border-primary/10">
      <CardHeader className="space-y-2">
        <div className="flex items-start justify-between gap-3">
          <CardTitle className="flex items-center gap-2">
            {ride.icon}
            {ride.title}
          </CardTitle>
          <Badge variant="secondary" className="bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-sm">
            {ride.badge || 'Featured'}
          </Badge>
        </div>
        <CardDescription>{ride.subtitle}</CardDescription>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        <ul className="list-disc pl-5 space-y-1">
          {ride.bullets.map((b, i) => (
            <li key={i}>{b}</li>
          ))}
        </ul>
      </CardContent>
      <CardFooter className="mt-auto flex flex-wrap items-center justify-between gap-3">
        <Badge className="bg-emerald-600 text-white shadow-sm hover:bg-emerald-600">
          {ride.price}
        </Badge>
        {ride.cta ? (
          <Link
            to={ride.cta.to}
            search={{ rideId: ride.id }}
            className={buttonVariants({ size: 'sm', variant: ride.cta.variant })}
          >
            {ride.cta.label}
          </Link>
        ) : null}
      </CardFooter>
    </Card>
  )
}

function RouteComponent() {
  const { controls } = useBookingControls()
  const primary = React.useMemo(() => pickPrimaryBookingAction(controls), [controls])
  const jetSkisOpen = controls.jetSkiBookingsEnabled
  const boatRidesOpen = controls.boatRideBookingsEnabled
  const fishingOpen = controls.fishingChartersBookingsEnabled

  const rides30 = rides.filter((r) => r.id.startsWith('30'))
  const rides60 = rides.filter((r) => r.id.startsWith('60'))
  const otherRides = rides.filter((r) => !r.id.startsWith('30') && !r.id.startsWith('60'))
  const heroImage = '/Asunnydayofjetskiing.png'

  const anyServiceOpen = primary.enabled
  const primaryIcon =
    primary.to === '/Bookings'
      ? CalendarDays
      : primary.to === '/boat-ride'
        ? Ship
        : primary.to === '/fishing-charters'
          ? Fish
          : CalendarDays

  const HeroIcon = jetSkisOpen ? Waves : boatRidesOpen ? Ship : fishingOpen ? Fish : Ship
  const heroLabel = jetSkisOpen
    ? 'Jet ski rides & rentals'
    : boatRidesOpen
      ? 'Boat rides in False Bay'
      : fishingOpen
        ? 'Fishing charters (enquiry)'
        : 'Water experiences'

  const chips = jetSkisOpen
    ? [
        { icon: Clock, label: '30–60 min sessions' },
        { icon: ShieldCheck, label: 'Safety briefing & life jackets' },
        { icon: MapPin, label: "Gordon's Bay Harbour" },
      ]
    : [
        { icon: ShieldCheck, label: 'Structured onboarding' },
        { icon: MapPin, label: "Gordon's Bay Harbour" },
        { icon: Ship, label: boatRidesOpen ? 'Boat rides available' : 'Condition-aware operation' },
      ]

  return (
    <div className="bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 text-white">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Jet ski riders launching from Gordon's Bay"
            className="h-full w-full object-cover"
            loading="eager"
            decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-900/75 to-slate-900/30" />
        </div>

        <div className="relative mx-auto max-w-6xl px-4 py-12 md:py-16 lg:py-20">
          <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-5">
              <Badge className="bg-white/85 text-slate-900 border-white/40 flex items-center gap-2 w-fit">
                <HeroIcon className="h-4 w-4" />
                {heroLabel}
              </Badge>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight drop-shadow">
                {jetSkisOpen ? 'Choose your jet ski session and hit the water' : 'Choose your Gordon’s Bay water experience'}
              </h1>
              <p className="text-base md:text-lg text-slate-100/85 max-w-2xl">
                {jetSkisOpen
                  ? "Premium skis, guided safety, and flexible slots from sunrise to sunset. Pick a 30‑minute thrill or a full hour to explore Gordon&apos;s Bay."
                  : 'Jet ski rides are seasonal. What you can book on this page updates dynamically based on the Admin availability switches.'}
              </p>

              <div className="flex flex-wrap gap-2 text-xs sm:text-sm text-slate-100/80">
                {chips.map((c) => (
                  <span
                    key={c.label}
                    className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 ring-1 ring-white/20"
                  >
                    <c.icon className="h-4 w-4" /> {c.label}
                  </span>
                ))}
              </div>

              <div className="flex flex-wrap gap-3">
                {anyServiceOpen ? (
                  <Link
                    to={primary.to}
                    className={buttonVariants({ size: 'lg', className: 'bg-white text-slate-900 hover:bg-slate-100' })}
                  >
                    {React.createElement(primaryIcon, { className: 'mr-2 h-5 w-5' })}
                    {primary.label}
                  </Link>
                ) : (
                  <span
                    className={buttonVariants({
                      size: 'lg',
                      variant: 'outline',
                      className: 'cursor-not-allowed select-none opacity-80 border-white/40 text-white',
                    })}
                    aria-disabled="true"
                  >
                    <CalendarX2 className="mr-2 h-5 w-5" />
                    Bookings closed
                  </span>
                )}
                <Link
                  to="#available"
                  className={buttonVariants({
                    variant: 'outline',
                    size: 'lg',
                    className: 'border-white/40 text-white hover:bg-white/10',
                  })}
                >
                  See what’s available
                </Link>
              </div>
              <p className="text-sm text-slate-100/80">
                {jetSkisOpen
                  ? 'Add extras like GoPro footage, wetsuits, or spectator boat rides in the booking form.'
                  : 'If jet skis are closed, boat rides and fishing enquiries may still be available.'}
              </p>
            </div>

            <Card className="relative border-white/15 bg-white/10 text-white shadow-xl backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <ShieldCheck className="h-5 w-5" />
                  Why ride with us
                </CardTitle>
                <CardDescription className="text-slate-100/80">
                  Operating since 2020 with structured onboarding before riding.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-slate-100">
                <div className="flex items-start gap-2">
                  <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/15 text-white">
                    <ShieldCheck className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="font-semibold text-white">Structured onboarding</p>
                    <p className="text-slate-100/80">Briefing, life jackets, and clear riding-zone boundaries.</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/15 text-white">
                    <MapPin className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="font-semibold text-white">Gordon&apos;s Bay Harbour</p>
                    <p className="text-slate-100/80">Easy logistics with a consistent meeting point.</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/15 text-white">
                    <Waves className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="font-semibold text-white">Guided format</p>
                    <p className="text-slate-100/80">Safety-led ride windows designed for tourists and first-timers.</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-wrap gap-2">
                <Link
                  to="/why-ride-with-us"
                  className={buttonVariants({ size: 'sm', variant: 'outline', className: 'border-white/40 text-white hover:bg-white/10' })}
                >
                  Proof pillars
                </Link>
                <Link
                  to="/safety-requirements-jet-ski-rides"
                  className={buttonVariants({ size: 'sm', variant: 'outline', className: 'border-white/40 text-white hover:bg-white/10' })}
                >
                  Safety requirements
                </Link>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-b from-sky-50 via-white to-white text-slate-900">
        <div id="available" className="mx-auto max-w-6xl px-4 py-10 md:py-14">
          <div className="mb-8 grid gap-4 md:grid-cols-3">
            <ServiceCard
              title="Jet skis"
              subtitle="Guided jet ski rides & rentals"
              icon={<Waves className="h-5 w-5" aria-hidden />}
              enabled={jetSkisOpen}
              status={jetSkisOpen ? 'Open for online booking' : 'Closed for the season'}
              to={jetSkisOpen ? '/Bookings' : '/jet-ski-rental-gordons-bay'}
              ctaLabel={jetSkisOpen ? 'Book jet skis' : 'See details'}
            />
            <ServiceCard
              title="Boat rides"
              subtitle="False Bay boat rides"
              icon={<Ship className="h-5 w-5" aria-hidden />}
              enabled={boatRidesOpen}
              status={boatRidesOpen ? 'Available' : 'Unavailable'}
              to="/boat-ride"
              ctaLabel={boatRidesOpen ? 'Request a boat ride' : 'View boat rides'}
            />
            <ServiceCard
              title="Fishing"
              subtitle="Fishing charters (enquiry)"
              icon={<Fish className="h-5 w-5" aria-hidden />}
              enabled={fishingOpen}
              status={fishingOpen ? 'Available on enquiry' : 'Unavailable'}
              to="/fishing-charters"
              ctaLabel={fishingOpen ? 'Enquire fishing' : 'View fishing'}
            />
          </div>

          <div className="mb-8 rounded-2xl border border-sky-100 bg-white/95 p-5 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-slate-900">Want extras like GoPro footage, wetsuits or boat rides?</p>
              <p className="text-sm text-muted-foreground">
                Browse the add‑ons page; you’ll pick them in the booking form (when jet skis are open).
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link
                to="/add-ons"
                className={buttonVariants({ size: 'sm', className: 'bg-sky-600 text-white hover:bg-sky-700' })}
              >
                View add‑ons
              </Link>
              {boatRidesOpen ? (
                <Link to="/boat-ride" className={buttonVariants({ size: 'sm', variant: 'outline' })}>
                  Boat rides
                </Link>
              ) : null}
            </div>
          </div>

          {jetSkisOpen ? (
            <div className="space-y-8">
              <div className="relative overflow-hidden rounded-2xl border border-sky-100 bg-white/95 p-5 shadow-sm">
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-sky-50/80 via-white to-emerald-50/70" />
                <div className="relative mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-sky-100 text-sky-800 ring-1 ring-sky-200">
                      <Clock className="h-5 w-5" />
                    </span>
                    <div>
                      <h2 className="text-xl font-semibold">30‑minute sessions</h2>
                      <p className="text-sm text-muted-foreground">Fast, high-energy rides if you&apos;re short on time.</p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-white/90 text-sky-800 border-sky-200">Quick thrill</Badge>
                </div>
                <div className="relative grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {rides30.map((r) => (
                    <RideCard key={r.title} ride={r} />
                  ))}
                </div>
              </div>

              <div className="relative overflow-hidden rounded-2xl border border-amber-100 bg-white/95 p-5 shadow-sm">
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-amber-50/80 via-white to-orange-50/70" />
                <div className="relative mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-amber-800 ring-1 ring-amber-200">
                      <Clock className="h-5 w-5" />
                    </span>
                    <div>
                      <h2 className="text-xl font-semibold">1‑hour sessions</h2>
                      <p className="text-sm text-muted-foreground">Extra time to explore, swap riders, and settle in.</p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-white/90 text-amber-800 border-amber-200">More time</Badge>
                </div>
                <div className="relative grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {rides60.map((r) => (
                    <RideCard key={r.title} ride={r} />
                  ))}
                </div>
              </div>

              {otherRides.length ? (
                <div className="relative overflow-hidden rounded-2xl border border-indigo-100 bg-white/95 p-5 shadow-sm">
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-indigo-50/70 via-white to-sky-50/70" />
                  <div className="relative mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-indigo-800 ring-1 ring-indigo-200">
                        <Ship className="h-5 w-5" />
                      </span>
                      <div>
                        <h2 className="text-xl font-semibold">Other jet ski experiences</h2>
                        <p className="text-sm text-muted-foreground">Joy rides and group sessions tailored to your crew.</p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="bg-white/90 text-indigo-800 border-indigo-200">Special</Badge>
                  </div>
                  <div className="relative grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {otherRides.map((r) => (
                      <RideCard key={r.title} ride={r} />
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          ) : (
            <Card className="shadow-md bg-white/95 border border-amber-100">
              <CardHeader>
                <CardTitle>Jet skis are closed for the season</CardTitle>
                <CardDescription>Boat rides and fishing enquiries can still be available.</CardDescription>
              </CardHeader>
              <CardFooter className="flex flex-wrap gap-2">
                {boatRidesOpen ? (
                  <Link to="/boat-ride" className={buttonVariants({ size: 'sm' })}>
                    <Ship className="mr-2 h-4 w-4" />
                    Request a boat ride
                  </Link>
                ) : null}
                {fishingOpen ? (
                  <Link to="/fishing-charters" className={buttonVariants({ size: 'sm', variant: 'outline' })}>
                    <Fish className="mr-2 h-4 w-4" />
                    Enquire fishing
                  </Link>
                ) : null}
                <Link to="/why-ride-with-us" className={buttonVariants({ size: 'sm', variant: 'outline' })}>
                  Why ride with us
                </Link>
              </CardFooter>
            </Card>
          )}

          <Separator className="my-8" />

          <Card className="shadow-md bg-white/95">
            <CardHeader>
              <CardTitle>Good to know</CardTitle>
              <CardDescription>Safety-first, condition-aware operations</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <p>• Mandatory safety briefing before every jet ski session.</p>
              <p>• Life jackets included for riders and passengers.</p>
              <p>• Conditions in False Bay can change quickly; we pause or reschedule if unsafe.</p>
            </CardContent>
            <CardFooter className="flex flex-wrap items-center justify-between gap-3">
              <Link to="/safety" className={buttonVariants({ variant: 'outline', size: 'sm' })}>
                Safety &amp; tips
              </Link>
              {anyServiceOpen ? (
                <Link to={primary.to} className={buttonVariants({ size: 'sm' })}>
                  {React.createElement(primaryIcon, { className: 'mr-2 h-4 w-4' })}
                  {primary.label}
                </Link>
              ) : null}
            </CardFooter>
          </Card>
        </div>
      </section>

      {anyServiceOpen ? (
        <Link to={primary.to} className="md:hidden fixed bottom-5 right-5 z-40 rounded-full shadow-lg">
          <span className={buttonVariants({ size: 'lg' })}>
            {React.createElement(primaryIcon, { className: 'mr-2 h-5 w-5' })} {primary.label}
          </span>
        </Link>
      ) : null}
    </div>
  )
}

function ServiceCard({
  title,
  subtitle,
  icon,
  enabled,
  status,
  to,
  ctaLabel,
}: {
  title: string
  subtitle: string
  icon: React.ReactNode
  enabled: boolean
  status: string
  to: string
  ctaLabel: string
}) {
  return (
    <Card className="border-slate-200 bg-white shadow-sm">
      <CardHeader className="space-y-2">
        <div className="flex items-start justify-between gap-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/15 text-primary">
              {icon}
            </span>
            {title}
          </CardTitle>
          <Badge
            variant="secondary"
            className={
              enabled
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-slate-100 text-slate-700 border border-slate-200'
            }
          >
            {enabled ? 'Available' : 'Off'}
          </Badge>
        </div>
        <CardDescription className="text-slate-600">{subtitle}</CardDescription>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        <p>{status}</p>
      </CardContent>
      <CardFooter>
        <Link to={to} className={buttonVariants({ variant: 'outline', size: 'sm' })}>
          {ctaLabel}
        </Link>
      </CardFooter>
    </Card>
  )
}
