
import * as React from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { MapPin, Clock, Users, Ship, CalendarDays, ShieldCheck } from 'lucide-react'

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
    price: 'From ZAR 1,750',
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
    price: 'From ZAR 2,600',
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
    price: 'From ZAR 3,100',
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
    price: 'From ZAR 4,800',
    cta: { to: '/Bookings', label: 'Book 2 skis (60m)' },
  },
  {
    id: '30-3',
    icon: <Users className="h-5 w-5" />,
    title: '30‑min Rental (3 Jet‑Skis)',
    subtitle: "Triple launch, quick thrill",
    bullets: [
      "Three skis launched together",
      "Perfect for small crews",
      "Safety briefing & jackets included",
    ],
    price: 'From ZAR 4,500',
    cta: { to: '/Bookings', label: 'Book 3 skis (30m)' },
  },
  {
    id: '60-3',
    icon: <Users className="h-5 w-5" />,
    title: '60‑min Rental (3 Jet‑Skis)',
    subtitle: "A full hour for the squad",
    bullets: [
      "Great balance of time and pace",
      "Plenty of room to rotate riders",
      "Briefing & gear included",
    ],
    price: 'From ZAR 6,900',
    cta: { to: '/Bookings', label: 'Book 3 skis (60m)' },
  },
  {
    id: '30-4',
    icon: <Users className="h-5 w-5" />,
    title: '30‑min Rental (4 Jet‑Skis)',
    subtitle: "Squad launch",
    bullets: [
      "Four skis side-by-side",
      "Ideal for friends & families",
      "Stay inside the marked zone",
    ],
    price: 'From ZAR 5,800',
    cta: { to: '/Bookings', label: 'Book 4 skis (30m)' },
  },
  {
    id: '60-4',
    icon: <Users className="h-5 w-5" />,
    title: '60‑min Rental (4 Jet‑Skis)',
    subtitle: "Full hour squad session",
    bullets: [
      "Plenty of time to rotate riders",
      "Briefing & jackets for everyone",
      "Great for team events",
    ],
    price: 'From ZAR 9,000',
    cta: { to: '/Bookings', label: 'Book 4 skis (60m)' },
  },
  {
    id: '30-5',
    icon: <Users className="h-5 w-5" />,
    title: '30‑min Rental (5 Jet‑Skis)',
    subtitle: "Max fleet, fast fun",
    bullets: [
      "All five skis on the water",
      "Coordinated launch and guidance",
      "Great for big groups",
    ],
    price: 'From ZAR 7,100',
    cta: { to: '/Bookings', label: 'Book 5 skis (30m)' },
  },
  {
    id: '60-5',
    icon: <Users className="h-5 w-5" />,
    title: '60‑min Rental (5 Jet‑Skis)',
    subtitle: "Ultimate group session",
    bullets: [
      "Full hour across five skis",
      "Rotations and guidance included",
      "Best for events & celebrations",
    ],
    price: 'From ZAR 11,000',
    cta: { to: '/Bookings', label: 'Book 5 skis (60m)' },
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
    price: 'ZAR 700',
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
    price: 'From ZAR 7,500',
    cta: { to: '/Bookings', label: 'Enquire / Book' },
  },
]

function RideCard({ ride }: { ride: Ride }) {
  return (
    <Card className="flex flex-col bg-white/95 shadow-md hover:shadow-lg transition-shadow border border-primary/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {ride.icon}
          {ride.title}
        </CardTitle>
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
        <Badge>{ride.price}</Badge>
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
  const rides30 = rides.filter((r) => r.id.startsWith('30'))
  const rides60 = rides.filter((r) => r.id.startsWith('60'))
  const otherRides = rides.filter((r) => !r.id.startsWith('30') && !r.id.startsWith('60'))
  const heroImage = '/Asunnydayofjetskiing.png'
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
                <Ship className="h-4 w-4" />
                Jet ski rides &amp; rentals
              </Badge>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight drop-shadow">
                Choose your jet ski session and hit the water
              </h1>
              <p className="text-base md:text-lg text-slate-100/85 max-w-2xl">
                Premium skis, guided safety, and flexible slots from sunrise to sunset. Pick a 30‑minute thrill or a full hour to explore Gordon&apos;s Bay.
              </p>

              <div className="flex flex-wrap gap-2 text-xs sm:text-sm text-slate-100/80">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 ring-1 ring-white/20">
                  <Clock className="h-4 w-4" /> 30–60 min sessions
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 ring-1 ring-white/20">
                  <ShieldCheck className="h-4 w-4" /> Safety briefing &amp; life jackets
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 ring-1 ring-white/20">
                  <MapPin className="h-4 w-4" /> Gordon&apos;s Bay Harbour
                </span>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link to="/Bookings" className={buttonVariants({ size: 'lg', className: 'bg-white text-slate-900 hover:bg-slate-100' })}>
                  <CalendarDays className="mr-2 h-5 w-5" />
                  Book now
                </Link>
                <Link to="/add-ons" className={buttonVariants({ variant: 'outline', size: 'lg', className: 'border-white/40 text-white hover:bg-white/10' })}>
                  View add‑ons
                </Link>
              </div>
              <p className="text-sm text-slate-100/80">
                Add extras like drone footage, wetsuits, or spectator boat rides in the booking form.
              </p>
            </div>

            <Card className="relative border-white/15 bg-white/10 text-white shadow-xl backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Ship className="h-5 w-5" />
                  Why ride with us
                </CardTitle>
                <CardDescription className="text-slate-100/80">Quick launch, safe briefing, unforgettable views.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-slate-100">
                <div className="flex items-start gap-2">
                  <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/15 text-white">
                    <Clock className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="font-semibold text-white">Flexible slots</p>
                    <p className="text-slate-100/80">Pick 30 or 60 minutes; we match you to the best weather window.</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/15 text-white">
                    <ShieldCheck className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="font-semibold text-white">Safety-first</p>
                    <p className="text-slate-100/80">Briefing, life jackets, and calm zones every time.</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/15 text-white">
                    <MapPin className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="font-semibold text-white">Gordon&apos;s Bay launch</p>
                    <p className="text-slate-100/80">Easy parking, quick check-in, and you&apos;re on the water.</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="bg-white/90 text-slate-900 border-white/40">
                  Up to 5 skis per group
                </Badge>
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                  Sunrise &amp; sunset on request
                </Badge>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-b from-sky-50 via-white to-white text-slate-900">

        <div className="mx-auto max-w-6xl px-4 py-10 md:py-14">

        <div className="mb-8 rounded-2xl border border-sky-100 bg-white/95 p-5 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-slate-900">Want extras like drone video, wetsuits or boat rides?</p>
            <p className="text-sm text-muted-foreground">Browse the add‑ons page; you’ll pick them in the booking form.</p>
          </div>
          <Link to="/add-ons" className={buttonVariants({ size: 'sm', className: 'bg-sky-600 text-white hover:bg-sky-700' })}>
            View add‑ons
          </Link>
        </div>

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
                    <h2 className="text-xl font-semibold">Other experiences</h2>
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

        <Separator className="my-8" />

        <Card className="shadow-md bg-white/95">
          <CardHeader>
            <CardTitle>Good to know</CardTitle>
            <CardDescription>Safety-first riding</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <p>• Mandatory safety briefing before every session.</p>
            <p>• Life jackets included for riders and passengers.</p>
            <p>• Riding within marked zones; weather dependent.</p>
          </CardContent>
          <CardFooter className="flex flex-wrap items-center justify-between gap-3">
            <Link to="/safety" className={buttonVariants({ variant: 'outline', size: 'sm' })}>Safety &amp; tips</Link>
            <Link to="/Bookings" className={buttonVariants({ size: 'sm' })}>
              <CalendarDays className="mr-2 h-4 w-4" />
              Book now
            </Link>
          </CardFooter>
        </Card>
      </div>
      </section>

      {/* Floating book-now for mobile to improve conversion */}
      <Link
        to="/Bookings"
        className="md:hidden fixed bottom-5 right-5 z-40 rounded-full shadow-lg "
      >
        <span className={buttonVariants({ size: 'lg' })}>
          <CalendarDays className="mr-2 h-5 w-5" /> Book now
        </span>
      </Link>
    </div>
  )
}
