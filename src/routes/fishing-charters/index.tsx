import { createFileRoute, Link } from '@tanstack/react-router'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Anchor, Fish, Waves, Ship, Compass, CalendarDays, LifeBuoy } from 'lucide-react'

export const Route = createFileRoute('/fishing-charters/')({
  component: RouteComponent,
})

function RouteComponent() {
  const highlights = [
    { icon: <Anchor className="h-4 w-4" />, label: 'Skippered' },
    { icon: <Fish className="h-4 w-4" />, label: 'Tackle on board' },
    { icon: <Waves className="h-4 w-4" />, label: 'False Bay & Atlantic options' },
    { icon: <LifeBuoy className="h-4 w-4" />, label: 'Safety gear included' },
  ]

  const trips = [
    {
      title: 'Half-day charter',
      desc: 'Target snoek, yellowtail, or reef fish with a seasoned skipper guiding the marks.',
      price: 'From ZAR 4,900 (boat)',
      duration: '4 hours | up to 6 guests',
    },
    {
      title: 'Full-day charter',
      desc: 'Chase pelagics, run multiple spots, and settle in for a full day on the water.',
      price: 'From ZAR 8,900 (boat)',
      duration: '8 hours | up to 6 guests',
    },
    {
      title: 'Custom crew trips',
      desc: 'Content shoots, team days, or first-timer coaching — we tailor the route and pace.',
      price: 'Quote on request',
      duration: 'Flexible timing & stops',
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(14,165,233,0.12),transparent_30%),radial-gradient(circle_at_80%_0%,rgba(16,185,129,0.12),transparent_30%)]" />
        <div className="relative mx-auto max-w-6xl px-4 py-14 md:py-18">
          <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="space-y-5">
              <Badge className="bg-white/10 text-white border-white/20 w-fit">Fishing charters</Badge>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight drop-shadow">
                Skippered fishing charters from Gordon&apos;s Bay & False Bay
              </h1>
              <p className="text-base md:text-lg text-slate-100/85 max-w-2xl">
                Bring your crew, we handle the boat, bait, tackle, and safety. Choose a half-day strike mission or a full-day chase for pelagics and reef fish.
              </p>
              <div className="flex flex-wrap gap-2 text-xs sm:text-sm text-slate-100/80">
                {highlights.map((h) => (
                  <span key={h.label} className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 ring-1 ring-white/20">
                    {h.icon}
                    {h.label}
                  </span>
                ))}
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  to="/contact"
                  className={buttonVariants({ size: 'lg', className: 'bg-white text-slate-900 hover:bg-slate-100' })}
                >
                  <CalendarDays className="mr-2 h-5 w-5" />
                  Enquire &amp; book
                </Link>
                <Link
                  to="/boat-ride"
                  className={buttonVariants({ variant: 'outline', size: 'lg', className: 'border-white/40 text-white hover:bg-white/10' })}
                >
                  View boat rides
                </Link>
              </div>
              <p className="text-sm text-slate-100/80">Licences, fuel, bait, and gear can be arranged — we confirm final pricing per trip.</p>
            </div>

            <Card className="relative border-white/15 bg-white/10 text-white shadow-xl backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Ship className="h-5 w-5" />
                  What&apos;s included
                </CardTitle>
                <CardDescription className="text-slate-100/80">Crewed vessel, safety checks, and session planning.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-slate-100">
                {[
                  'Skipper & deck support',
                  'Safety briefing, life jackets, and emergency gear',
                  'Route and weather planning for the day',
                  'Cooler space for your catch; filleting on request',
                ].map((item) => (
                  <div key={item} className="flex items-start gap-2">
                    <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/15 text-white">
                      <Compass className="h-4 w-4" />
                    </span>
                    <p className="text-slate-100/85">{item}</p>
                  </div>
                ))}
              </CardContent>
              <CardFooter className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="bg-white/90 text-slate-900 border-white/40">
                  Max 6 guests
                </Badge>
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                  Launches from Gordon&apos;s Bay
                </Badge>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-b from-sky-50 via-white to-white text-slate-900">
        <div className="mx-auto max-w-6xl px-4 py-12 md:py-16 space-y-8">
          <div className="flex flex-col gap-3">
            <Badge variant="outline" className="w-fit border-sky-200 bg-sky-50 text-sky-800">Trips</Badge>
            <h2 className="text-2xl md:text-3xl font-semibold">Choose your charter</h2>
            <p className="text-muted-foreground max-w-2xl">
              Tell us your target species and timing; we&apos;ll align weather, tackle, and route. Prices shown are guide rates and confirmed on enquiry.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {trips.map((trip) => (
              <Card key={trip.title} className="h-full border-slate-200/80 bg-white/95 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Fish className="h-5 w-5 text-sky-700" />
                    {trip.title}
                  </CardTitle>
                  <CardDescription>{trip.duration}</CardDescription>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground space-y-3">
                  <p>{trip.desc}</p>
                  <Badge className="bg-emerald-600 text-white">{trip.price}</Badge>
                </CardContent>
                <CardFooter>
                  <Link to="/contact" className={buttonVariants({ size: 'sm', className: 'w-full' })}>
                    Enquire now
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>

          <div className="space-y-3">
            <h3 className="text-xl font-semibold text-slate-900">Charter Rates</h3>
            <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-2">
              <li>Half-day charter: From ZAR 4,900 per boat (approx. 4 hours, up to 6 guests).</li>
              <li>Full-day charter: From ZAR 8,900 per boat (approx. 8 hours, up to 6 guests).</li>
              <li>Offshore / Tuna-Game Charter: Recent market comps — shared charters ≈ ZAR 5,500 per person for ~8 hours, or ≈ ZAR 25,000 per boat for private groups.</li>
              <li>Final quotes vary by vessel, date, and extras (bait, fuel, crew, amenities).</li>
            </ul>
          </div>

          <Separator />

          <Card className="shadow-md bg-white/95">
            <CardHeader>
              <CardTitle>Good to know</CardTitle>
              <CardDescription>Safety-first fishing</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <p>• Weather-dependent departures; we confirm timing 24 hours prior.</p>
              <p>• Bring sun protection and non-slip shoes. We provide life jackets.</p>
              <p>• Alcohol in moderation only; safety briefing is mandatory.</p>
            </CardContent>
            <CardFooter className="flex flex-wrap items-center justify-between gap-3">
              <Link to="/safety" className={buttonVariants({ variant: 'outline', size: 'sm' })}>
                Safety &amp; tips
              </Link>
              <Link to="/contact" className={buttonVariants({ size: 'sm' })}>
                Talk to the team
              </Link>
            </CardFooter>
          </Card>
        </div>
      </section>
    </div>
  )
}
