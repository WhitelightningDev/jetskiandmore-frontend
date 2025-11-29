import { createFileRoute } from '@tanstack/react-router'
import { Link } from '@tanstack/react-router'
import {
  Waves,
  CalendarDays,
  MapPin,
  Clock,
  ShieldCheck,
  Ship,
  Gift,
  Star,
  Wind,
  Users,
  LifeBuoy,
  AlertTriangle,
} from 'lucide-react'
import Reveal from '@/components/Reveal'

import { Button, buttonVariants } from '@/components/ui/button'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip'
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover'
import harbourImg from '@/lib/images/IMG_3202.jpg'
import jetskiLogo from '@/lib/images/JetSkiLogo.png'
import React from 'react'
import { cn } from '@/lib/utils'
import WeatherNudge from '@/components/WeatherNudge'

const GBAY_LAT = -34.165
const GBAY_LON = 18.866

export const Route = createFileRoute('/home/')({
  component: App,
})

function App() {
  const [ready] = React.useState(true)
  return (
    <div className="bg-background">
      {/* HERO */}
      <section className="relative overflow-hidden bg-slate-950 text-white">
        <div className="absolute inset-0">
          <img
            src="/Asunnydayofjetskiing.png"
            alt="Riders launching from the dock"
            loading="eager"
            decoding="async"
            className={cn(
              'h-full w-full object-cover transition-opacity duration-700',
              ready ? 'opacity-100' : 'opacity-0',
            )}
          />
        </div>

        <div className="relative mx-auto max-w-6xl px-4 py-16 md:py-24">
          <div className="max-w-3xl space-y-6">
            <Reveal direction="down" offset={4} duration={900}>
              <div className="flex flex-wrap items-center gap-2 text-sm">
                <div className="flex items-center gap-1 rounded-full bg-amber-500/15 px-3 py-1 text-amber-200 ring-1 ring-amber-400/40">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                  <span className="ml-1 font-semibold">4.9</span>
                  <span className="ml-1 text-amber-100/80">Google Reviews</span>
                </div>
                <Badge variant="secondary" className="bg-white/10 text-white border-white/30">
                  Gordon&apos;s Bay Harbour • Western Cape
                </Badge>
              </div>
            </Reveal>

            <Reveal delay={120} offset={4} duration={900}>
              <h1 className="text-4xl leading-[1.05] font-black drop-shadow md:text-6xl">
                Jet Ski Rentals &amp; Guided Rides on Crystal Waters
              </h1>
            </Reveal>

            <Reveal delay={220} offset={4} duration={900}>
              <p className="text-base md:text-xl text-slate-100/90 max-w-2xl">
                Premium skis, safety-first briefings, and flexible slots from sunrise to sunset. Book online, arrive 15 minutes early, and we’ll handle the rest.
              </p>
            </Reveal>

            <Reveal delay={320} offset={4} duration={900}>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link to="/Bookings" className={buttonVariants({ size: 'lg' })}>
                  <CalendarDays className="mr-2 h-5 w-5" />
                  Book now
                </Link>
                <Link to="/rides" className={buttonVariants({ variant: 'outline', size: 'lg' })}>
                  <Waves className="mr-2 h-5 w-5 text-black" />
                  <p className='text-black'>See rides &amp; pricing</p>
                </Link>
              </div>
            </Reveal>

            <Reveal delay={380} offset={4} duration={900}>
              <div className="flex flex-wrap gap-3 text-sm text-slate-100/80">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 ring-1 text-blue-600">
                  <Clock className="h-4 w-4 text-blue-600" /> 30–120 min sessions
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 ring-1  text-blue-600">
                  <ShieldCheck className="h-4 w-4 text-blue-600" /> Safety briefing &amp; life jackets
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 ring-1 ">
                  <MapPin className="h-4 w-4" /> Gordon&apos;s Bay Harbour only
                </span>
              </div>
            </Reveal>

            <Reveal delay={440} offset={4} duration={900}>
              <div className="flex flex-wrap items-center gap-4 pt-2 text-sm uppercase tracking-[0.2em] text-white/70">
                <span className="font-semibold text-gray-600">SEA‑DOO</span>
                <span className="h-px w-10 bg-black/30 " />
                <span className="font-semibold text-gray-600">YAMAHA</span>
                <span className="h-px w-10 bg-black/30" />
                <span className="font-semibold text-gray-600">DRONE VIDEO READY</span>
              </div>
            </Reveal>
          </div>
        </div>

        <svg
          className="absolute bottom-0 left-0 w-full text-background"
          viewBox="0 0 1440 80"
          preserveAspectRatio="none"
          aria-hidden
        >
          <path
            fill="currentColor"
            d="M0,32L48,37.3C96,43,192,53,288,48C384,43,480,21,576,26.7C672,32,768,64,864,69.3C960,75,1056,53,1152,48C1248,43,1344,53,1392,58.7L1440,64L1440,80L1392,80C1344,80,1248,80,1152,80C1056,80,960,80,864,80C768,80,672,80,576,80C480,80,384,80,288,80C192,80,96,80,48,80L0,80Z"
          />
        </svg>
      </section>
      <WeatherNudge />

      

      {/* BOOKING ESSENTIALS */}
      <section className="mx-auto max-w-6xl px-4 py-10">
        <Reveal direction="down" offset={4} duration={850}>
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold">Booking essentials (at a glance)</h2>
              <p className="mt-1 text-sm text-muted-foreground max-w-2xl">
                Everything you need to know before you lock in a slot — one place, no digging.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link to="/Bookings" className={buttonVariants({ size: 'sm' })}>
                <CalendarDays className="mr-2 h-4 w-4" />
                Book now
              </Link>
              <Link to="/contact" className={buttonVariants({ variant: 'outline', size: 'sm' })}>
                Questions? Chat to us
              </Link>
            </div>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          <Reveal duration={800}>
            <Card className="h-full border-primary/30 bg-white/80 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarDays className="h-5 w-5" />
                  How booking works
                </CardTitle>
                <CardDescription>3 quick steps to ride</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <p>1) Pick a ride and time in the booking form.</p>
                <p>2) Add extras like drone video or wetsuits if you want.</p>
                <p>3) Pay securely online — you’ll get confirmation instantly.</p>
              </CardContent>
              <CardFooter>
                <Link to="/Bookings" className={buttonVariants({ variant: 'outline', size: 'sm' })}>
                  Open booking form
                </Link>
              </CardFooter>
            </Card>
          </Reveal>

          <Reveal delay={80} duration={800}>
            <Card className="h-full border-emerald-200 bg-emerald-50/60">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5" />
                  What’s included
                </CardTitle>
                <CardDescription>Every ride, every time</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <p>• Safety briefing on arrival.</p>
                <p>• Life jackets for riders and passengers.</p>
                <p>• Clearly marked riding zone for comfort and safety.</p>
                <p>• Optional add‑ons (drone video, GoPro, wetsuits).</p>
              </CardContent>
              <CardFooter>
                <Link to="/safety" className={buttonVariants({ size: 'sm', variant: 'outline' })}>
                  View safety info
                </Link>
              </CardFooter>
            </Card>
          </Reveal>

          <Reveal delay={160} duration={800}>
            <Card className="h-full border-amber-200 bg-amber-50/60">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Before you arrive
                </CardTitle>
                <CardDescription>So check‑in is smooth</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <p>• Arrive 15 minutes early at Gordon’s Bay Harbour.</p>
                <p>• Bring a towel, sunscreen, and swimwear (or hire a wetsuit).</p>
                <p>• Riders must be 16+ to drive; passengers 8+.</p>
                <p>• We reschedule if weather turns unsafe — no fuss.</p>
              </CardContent>
              <CardFooter className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary" className="rounded-full">Gordon&apos;s Bay only</Badge>
                <Link to="/contact" className={buttonVariants({ size: 'sm', variant: 'outline' })}>
                  Need directions?
                </Link>
              </CardFooter>
            </Card>
          </Reveal>
        </div>
      </section>

      {/* OFFER CARDS */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <Reveal direction="down" offset={4} duration={850}>
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold">
                Popular experiences
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Choose a rental that matches your vibe. You can always add
                extras during booking.
              </p>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge
                    variant="outline"
                    className="cursor-help bg-primary/5 border-primary/20 text-foreground"
                  >
                    What’s included?
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  Life jackets, safety briefing &amp; fuel. Skipper on request.
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Reveal offset={4} duration={900}>
            <Card className="flex flex-col border-primary/30 hover:border-primary/50 hover:shadow-lg transition-all bg-white/80 backdrop-blur">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <Ship className="h-5 w-5" />
                  30‑min Rental (1 Jet‑Ski)
                </CardTitle>
                <CardDescription>
                  Perfect for a quick burst of fun.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <div className="h-32 w-full rounded-md border border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden">
                  <img
                    src={jetskiLogo}
                    alt="JetSki & More"
                    className="h-24 w-auto object-contain"
                    loading="lazy"
                  />
                </div>
                <p>
                  Launch from Gordon&apos;s Bay Harbour and ride within the
                  marked zone. Safety briefing and life jackets included.
                </p>
              </CardContent>
              <CardFooter className="mt-auto flex flex-wrap items-center justify-between gap-3">
                <Badge>From ZAR 1,750</Badge>
                <Link to="/Bookings" className={buttonVariants({ size: 'sm' })}>
                  Select
                </Link>
              </CardFooter>
            </Card>
          </Reveal>

          <Reveal delay={120} offset={4} duration={900}>
            <Card className="flex flex-col border-primary/30 hover:border-primary/50 hover:shadow-lg transition-all bg-white/80 backdrop-blur">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  60‑min Rental (1 Jet‑Ski)
                </CardTitle>
                <CardDescription>
                  Extra time to explore the bay.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <div className="h-32 w-full rounded-md border border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden">
                  <img
                    src={jetskiLogo}
                    alt="JetSki & More"
                    className="h-24 w-auto object-contain"
                    loading="lazy"
                  />
                </div>
                <p>
                  More freedom on the water with the same safety‑first setup.
                  Great for confident riders or pairs (passenger optional).
                </p>
              </CardContent>
              <CardFooter className="mt-auto flex flex-wrap items-center justify-between gap-3">
                <Badge>From ZAR 2,600</Badge>
                <Link to="/Bookings" className={buttonVariants({ size: 'sm' })}>
                  Select
                </Link>
              </CardFooter>
            </Card>
          </Reveal>

          <Reveal delay={240} offset={4} duration={900}>
            <Card className="flex flex-col border-amber-300/40 hover:border-amber-500/60 hover:shadow-lg transition-all bg-gradient-to-br from-amber-50 to-amber-100/60">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <Gift className="h-5 w-5" />
                  Add‑ons &amp; Extras
                </CardTitle>
                <CardDescription>Make it unforgettable.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <div className="h-32 w-full rounded-md border border-amber-300 bg-amber-50 flex items-center justify-center overflow-hidden">
                  <img
                    src={jetskiLogo}
                    alt="JetSki & More"
                    className="h-24 w-auto object-contain"
                    loading="lazy"
                  />
                </div>
                <p>
                  Drone video, GoPro footage, waterproof phone pouch, and
                  premium wetsuit hire available at checkout. Joy Ride (10 min)
                  available from ZAR 700.
                </p>
              </CardContent>
              <CardFooter className="mt-auto flex flex-wrap items-center justify-between gap-3">
                <Badge>Popular</Badge>
                <Link
                  to="/add-ons"
                  className={buttonVariants({ variant: 'outline', size: 'sm' })}
                >
                  See options
                </Link>
              </CardFooter>
            </Card>
          </Reveal>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <Reveal direction="down" offset={4} duration={850}>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold">
                What riders say
              </h2>
              <p className="mt-1 text-sm text-muted-foreground max-w-md">
                A mix of solo riders, couples and groups — all sharing the same
                big grins afterwards.
              </p>
            </div>
          </div>
        </Reveal>
        <div className="w-full rounded-xl border overflow-hidden bg-white/70 backdrop-blur">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3301.284673540187!2d18.858962599999998!3d-34.1646387!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1dcdcb0adfb255cd%3A0xb9bfd0358c62fa90!2sGordon&#39;s%20Bay%20Jet%20Ski%20%26%20More!5e0!3m2!1sen!2sza!4v1763143724401!5m2!1sen!2sza"
            width="600"
            height="450"
            className="w-full h-96 md:h-[450px] border-0"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            loading="lazy"
          ></iframe>
        </div>
      </section>

      <Separator className="my-2" />

      {/* SAFETY & INFO */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1.3fr),minmax(0,1fr)] gap-6 items-stretch">
          <Reveal>
            <Card className="border-amber-200 bg-amber-50/60 h-full flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="inline-flex items-center justify-center size-7 rounded-md bg-amber-500/10 text-amber-700">
                    <ShieldCheck className="size-4" />
                  </span>
                  Safety &amp; requirements
                </CardTitle>
                <CardDescription>Read before you ride</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-3">
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 inline-flex items-center justify-center size-6 rounded-full bg-amber-500/10 text-amber-700">
                    <AlertTriangle className="size-3.5" />
                  </span>
                  <div>
                    <p className="font-medium text-foreground">
                      Age &amp; passengers
                    </p>
                    <p>
                      Minimum age 16 to drive (with guardian consent).
                      Passengers: 8+.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 inline-flex items-center justify-center size-6 rounded-full bg-amber-500/10 text-amber-700">
                    <Waves className="size-3.5" />
                  </span>
                  <div>
                    <p className="font-medium text-foreground">
                      Briefing &amp; zones
                    </p>
                    <p>
                      Briefing covers throttle control, safe distances, and
                      no‑wake zones.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 inline-flex items-center justify-center size-6 rounded-full bg-amber-500/10 text-amber-700">
                    <LifeBuoy className="size-3.5" />
                  </span>
                  <div>
                    <p className="font-medium text-foreground">Life jackets</p>
                    <p>
                      Life jackets are mandatory and provided free for every
                      rider and passenger.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 inline-flex items-center justify-center size-6 rounded-full bg-amber-500/10 text-amber-700">
                    <Wind className="size-3.5" />
                  </span>
                  <div>
                    <p className="font-medium text-foreground">
                      Weather conditions
                    </p>
                    <p>
                      Weather can shift quickly; we may reschedule if conditions
                      are unsafe.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 inline-flex items-center justify-center size-6 rounded-full bg-amber-500/10 text-amber-700">
                    <Users className="size-3.5" />
                  </span>
                  <div>
                    <p className="font-medium text-foreground">
                      Swimming ability
                    </p>
                    <p>If you cannot swim, you cannot operate a jet ski.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 inline-flex items-center justify-center size-6 rounded-full bg-amber-500/10 text-amber-700">
                    <Ship className="size-3.5" />
                  </span>
                  <div>
                    <p className="font-medium text-foreground">Joy Rides</p>
                    <p>
                      All Joy Rides are instructed rides — an instructor drives
                      with the client seated behind for a safe, guided
                      experience.
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="mt-auto">
                <Link
                  to="/safety"
                  className={buttonVariants({ variant: 'outline' })}
                >
                  Full safety guide
                </Link>
              </CardFooter>
            </Card>
          </Reveal>

          <Reveal delay={100}>
            <Card className="border-cyan-200 bg-cyan-50/60 h-full flex flex-col">
              <CardHeader>
                <CardTitle>Where we launch</CardTitle>
                <CardDescription>
                  We operate only from Gordon&apos;s Bay Harbour.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <span className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" /> Gordon&apos;s Bay Harbour
                  </span>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" size="sm">
                        View map
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                      <div className="space-y-3 text-xs">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          <span>Map preview</span>
                        </div>
                        <div className="rounded-md border bg-slate-100 overflow-hidden h-40">
                          <iframe
                            title="Gordon's Bay Harbour map"
                            src={`https://www.google.com/maps?q=${GBAY_LAT},${GBAY_LON}&z=15&output=embed`}
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            className="w-full h-full border-0"
                          />
                        </div>
                        <p className="text-[11px] text-muted-foreground">
                          Coordinates: {GBAY_LAT.toFixed(5)},{' '}
                          {GBAY_LON.toFixed(5)} (Gordon&apos;s Bay Harbour)
                        </p>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Harbour image */}
                <div className="rounded-lg overflow-hidden border border-cyan-400 bg-cyan-50/80">
                  <img
                    src={harbourImg}
                    alt="Gordon's Bay Harbour"
                    className="h-70 w-full object-cover"
                    loading="lazy"
                  />
                </div>

                <p className="text-xs text-muted-foreground">
                  Parking is available nearby. Please follow on‑site signage and
                  staff directions for launching and exiting the harbour.
                </p>
              </CardContent>
              <CardFooter className="mt-auto flex flex-wrap items-center justify-between gap-3">
                <Link
                  to="/safety"
                  className={buttonVariants({ size: 'sm', variant: 'outline' })}
                >
                  Safety &amp; info
                </Link>
                <Link to="/contact" className={buttonVariants({ size: 'sm' })}>
                  Ask about directions
                </Link>
              </CardFooter>
            </Card>
          </Reveal>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="mx-auto max-w-6xl px-4 pb-20">
        <Reveal offset={4} duration={900}>
          <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-cyan-50">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl md:text-3xl">
                Ready to ride?
              </CardTitle>
              <CardDescription>
                Pick a time. We’ll handle the rest.
              </CardDescription>
            </CardHeader>
            <CardFooter className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link to="/Bookings" className={buttonVariants({ size: 'lg' })}>
                <CalendarDays className="mr-2 h-5 w-5" />
                Book now
              </Link>
              <Link
                to="/contact"
                className={buttonVariants({ variant: 'outline', size: 'lg' })}
              >
                Questions? Contact us
              </Link>
            </CardFooter>
          </Card>
        </Reveal>
      </section>
    </div>
  )
}
