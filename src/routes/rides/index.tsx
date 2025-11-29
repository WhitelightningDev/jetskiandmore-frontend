
import * as React from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {  buttonVariants } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { MapPin, Clock, Users, Ship, Gift, CalendarDays } from 'lucide-react'

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

function RideCard({ ride, addons }: { ride: Ride; addons: { drone: boolean; wetsuit: boolean; boat: boolean; boatCount: number; extraPeople: number } }) {
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
            search={{
              rideId: ride.id,
              drone: addons.drone,
              wetsuit: addons.wetsuit,
              boat: addons.boat,
              boatCount: addons.boat ? addons.boatCount : undefined,
              extraPeople: addons.extraPeople || undefined,
            }}
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
  const [addons, setAddons] = React.useState({
    drone: false,
    wetsuit: false,
    boat: false,
    boatCount: 1,
    extraPeople: 0,
  })
  return (
    <div className="bg-gradient-to-b from-sky-50 via-white to-white text-slate-900">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-sky-100 via-white to-emerald-50 opacity-90" />
        <div className="mx-auto max-w-6xl px-4 py-10 md:py-14 relative">
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-2">
              <Badge className="bg-white/90 text-sky-900 border-sky-200">Premium skis • Guided or solo</Badge>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900">Rides &amp; Experiences</h1>
              <p className="text-sm md:text-base text-slate-700 max-w-2xl">
                Choose a slot, add extras, and launch from Gordon&apos;s Bay Harbour. Safety briefing and life jackets are always included.
              </p>
            </div>
            <Badge variant="secondary" className="flex items-center gap-1 bg-white/90 text-slate-900 border-sky-200">
              <MapPin className="h-4 w-4" />
              Gordon&apos;s Bay only
            </Badge>
          </div>

          {/* Quick booking CTA for immediate navigation */}
          <div className="mb-10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 rounded-2xl border border-sky-100 bg-white/90 p-4 text-slate-900 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-sky-100 ring-1 ring-sky-200">
                <CalendarDays className="h-5 w-5" />
              </span>
              <p className="text-sm md:text-base text-slate-700">
                Ready to ride? Book your slot or ask us about the calmest window today.
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                to="/Bookings"
                search={{
                  drone: addons.drone,
                  wetsuit: addons.wetsuit,
                  boat: addons.boat,
                  boatCount: addons.boat ? addons.boatCount : undefined,
                }}
                className={buttonVariants({ className: 'bg-sky-600 text-white hover:bg-sky-700' })}
              >
                <CalendarDays className="mr-2 h-4 w-4" /> Book now
              </Link>
              <Link to="/contact" className={buttonVariants({ variant: 'outline', className: 'border-sky-200 text-slate-900 hover:bg-sky-50' })}>
                Questions? Contact us
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 md:py-14">

        {/* Add-ons quick pick */}
        <Card className="mb-8 shadow-lg border-primary/15 bg-white/95">
          <CardHeader>
            <CardTitle className="text-lg">Choose your add‑ons</CardTitle>
            <CardDescription>Selections carry into the booking form</CardDescription>
          </CardHeader>
          <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <label className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-md border p-3">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={addons.drone}
                    onChange={(e) => setAddons((a) => ({ ...a, drone: e.target.checked }))}
                  />
                  <span className="text-sm">Drone video</span>
                </div>
                <Badge variant="secondary"
          className="bg-green-500 text-white dark:bg-green-600">+ ZAR 700 (or included)</Badge>
              </label>
              <label className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-md border p-3">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={addons.wetsuit}
                    onChange={(e) => setAddons((a) => ({ ...a, wetsuit: e.target.checked }))}
                  />
                  <span className="text-sm">Wetsuit hire</span>
                </div>
                <Badge variant="secondary"
          className="bg-green-500 text-white dark:bg-green-600">+ ZAR 150</Badge>
              </label>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-md border p-3">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={addons.boat}
                    onChange={(e) => setAddons((a) => ({ ...a, boat: e.target.checked }))}
                  />
                  <span className="text-sm">Boat ride</span>
                </label>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Badge variant="secondary"
          className="bg-green-500 text-white dark:bg-green-600">R450 pp</Badge>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={addons.boatCount}
                    disabled={!addons.boat}
                    onChange={(e) =>
                      setAddons((a) => ({ ...a, boatCount: Math.max(1, Math.min(10, Number(e.target.value) || 1)) }))
                    }
                    className="w-16 px-2 py-1 border rounded disabled:opacity-60"
                  />
                </div>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-1 gap-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-md border p-3">
                <label className="flex items-center gap-2">
                  <span className="text-sm">Additional passenger(s)</span>
                </label>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Badge variant="secondary"
          className="bg-green-500 text-white dark:bg-green-600">R350 each</Badge>
                  <input
                    type="number"
                    min={0}
                    max={2}
                    value={addons.extraPeople}
                    onChange={(e) =>
                      setAddons((a) => ({ ...a, extraPeople: Math.max(0, Math.min(2, Number(e.target.value) || 0)) }))
                    }
                    className="w-16 px-2 py-1 border rounded"
                  />
                </div>
              </div>
              <Badge variant="secondary"
          className="bg-blue-500 text-white dark:bg-blue-600">Single rides may add up to 1 passenger; 2‑ski sessions up to 2 passengers. Limit is enforced on the booking page.</Badge>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {rides.map((r) => <RideCard key={r.title} ride={r} addons={addons} />)}

          {/* Add-ons */}
          <Card className="border-primary/30 flex flex-col shadow-md bg-white/90">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gift className="h-5 w-5" />
                Add‑ons &amp; Extras
              </CardTitle>
              <CardDescription>Make it unforgettable</CardDescription>
            </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <p>• Drone video &amp; GoPro footage</p>
            <p>• Waterproof phone pouch</p>
            <p>• Premium wetsuit hire</p>
          </CardContent>
            <CardFooter className="mt-auto flex flex-wrap items-center justify-between gap-3">
              <Badge>Popular</Badge>
              <Link to="/add-ons" className={buttonVariants({ variant: 'outline', size: 'sm' })}>See options</Link>
            </CardFooter>
          </Card>
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
      </section>

      {/* Floating book-now for mobile to improve conversion */}
      <Link
        to="/Bookings"
        search={{
          drone: addons.drone,
          wetsuit: addons.wetsuit,
          boat: addons.boat,
          boatCount: addons.boat ? addons.boatCount : undefined,
          extraPeople: addons.extraPeople || undefined,
        }}
        className="md:hidden fixed bottom-5 right-5 z-40 rounded-full shadow-lg "
      >
        <span className={buttonVariants({ size: 'lg' })}>
          <CalendarDays className="mr-2 h-5 w-5" /> Book now
        </span>
      </Link>
    </div>
  )
}
