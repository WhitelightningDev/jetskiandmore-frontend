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
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'

export const Route = createFileRoute('/home/')({
  component: App,
})

function App() {
  return (
    <div className="bg-background">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary/10 via-cyan-50 to-background" />
        <div className="absolute -top-28 left-1/2 -translate-x-1/2 -z-10 blur-3xl opacity-40 size-[600px] rounded-full bg-[radial-gradient(circle_at_center,theme(colors.cyan.300),transparent_60%)] motion-safe:animate-pulse" />
        <div className="mx-auto max-w-6xl px-4 py-16 md:py-24">
          <div className="grid gap-10 md:grid-cols-[minmax(0,3fr),minmax(0,2.4fr)] items-center">
            {/* Left column: copy + CTAs */}
            <div className="flex flex-col gap-6 text-center md:text-left items-center md:items-start">
              <Reveal direction="down" offset={4} duration={900}>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                  <Badge className="uppercase tracking-wide" variant="secondary">
                    Gordon&apos;s Bay Harbour • Western Cape
                  </Badge>
                  <Badge className="bg-primary/15 text-primary border-primary/30">Summer season open</Badge>
                </div>
              </Reveal>

              <Reveal delay={120} offset={4} duration={900}>
                <h1 className="text-4xl md:text-6xl font-extrabold leading-tight bg-gradient-to-r from-primary to-cyan-600 bg-clip-text text-transparent">
                  Jet Ski Rentals &amp; Guided Rides
                </h1>
              </Reveal>

              <Reveal delay={240} offset={4} duration={900}>
                <p className="text-base md:text-lg text-muted-foreground max-w-xl">
                  Book a thrilling ride on crystal waters. Flexible time slots, safety‑first briefings,
                  and optional drone video add‑ons.
                </p>
              </Reveal>

              <Reveal delay={320} offset={4} duration={900}>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link to="/Bookings" className={buttonVariants({ size: 'lg' })}>
                    <CalendarDays className="mr-2 h-5 w-5" />
                    Book now
                  </Link>
                  <Link to="/rides" className={buttonVariants({ variant: 'outline', size: 'lg' })}>
                    <Waves className="mr-2 h-5 w-5" />
                    Explore rides
                  </Link>
                </div>
              </Reveal>
              
                <div className="mt-4 grid w-full gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
                  <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-cyan-50">
                    <CardHeader className="space-y-1">
                      <CardTitle className="flex items-center gap-2 text-sm md:text-base">
                        <span className="inline-flex items-center justify-center size-7 rounded-md bg-primary/15 text-primary">
                          <Clock className="size-4" />
                        </span>
                        Flexible sessions
                      </CardTitle>
                      <CardDescription>
                        30 and 60 minutes, and up to 2 hours for group bookings.
                      </CardDescription>
                    </CardHeader>
                  </Card>
                  <Card className="border-emerald-300/40 bg-gradient-to-br from-emerald-50 to-emerald-100/40">
                    <CardHeader className="space-y-1">
                      <CardTitle className="flex items-center gap-2 text-sm md:text-base">
                        <span className="inline-flex items-center justify-center size-7 rounded-md bg-emerald-600/15 text-emerald-700">
                          <ShieldCheck className="size-4" />
                        </span>
                        Safety included
                      </CardTitle>
                      <CardDescription>Briefing + life jackets for every rider.</CardDescription>
                    </CardHeader>
                  </Card>
                  <Card className="border-cyan-300/40 bg-gradient-to-br from-cyan-50 to-cyan-100/40">
                    <CardHeader className="space-y-1">
                      <CardTitle className="flex items-center gap-2 text-sm md:text-base">
                        <span className="inline-flex items-center justify-center size-7 rounded-md bg-cyan-600/15 text-cyan-700">
                          <MapPin className="size-4" />
                        </span>
                        Our launch spot
                      </CardTitle>
                      <CardDescription>Gordon&apos;s Bay Harbour only.</CardDescription>
                    </CardHeader>
                  </Card>
                </div>
            

              {/* Stats row */}
              <Reveal offset={2} duration={700}>
                <div className="mt-4 grid grid-cols-1 gap-4 text-xs md:text-sm text-muted-foreground sm:grid-cols-3">
                  <div className="flex items-center gap-3 md:items-start">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-50">
                      <Star className="h-4 w-4 text-amber-500" />
                    </span>
                    <div className="flex flex-col">
                      <span className="font-semibold text-foreground">4.9★</span>
                      <span>Average rating</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 md:items-start">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                      <Users className="h-4 w-4 text-primary" />
                    </span>
                    <div className="flex flex-col">
                      <span className="font-semibold text-foreground">1,000+</span>
                      <span>Riders hosted</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 md:items-start">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-cyan-50">
                      <Wind className="h-4 w-4 text-cyan-600" />
                    </span>
                    <div className="flex flex-col">
                      <span className="font-semibold text-foreground">Safety‑first</span>
                      <span>Briefing every ride</span>
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>

            {/* Right column: rich hero card with media placeholder */}
            <Reveal delay={160} offset={4} duration={900}>
              <Card className="relative overflow-hidden bg-white/80 backdrop-blur border-primary/20 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="inline-flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Ship className="size-4" />
                    </span>
                    Experience Gordon&apos;s Bay from the water
                  </CardTitle>
                  <CardDescription>
                    A quick overview of what to expect on arrival — from safety briefing to throttling out of the harbour.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 text-sm text-muted-foreground">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-md bg-slate-50 border text-xs p-3 space-y-1">
                      <p className="font-medium text-foreground flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" /> Before you ride
                      </p>
                      <p>Arrive 15 minutes early for check‑in and a full safety briefing.</p>
                    </div>
                    <div className="rounded-md bg-slate-50 border text-xs p-3 space-y-1">
                      <p className="font-medium text-foreground flex items-center gap-1">
                        <LifeBuoy className="h-3.5 w-3.5" /> Gear provided
                      </p>
                      <p>Life jackets and basic wetsuits available. Bring a towel and sunscreen.</p>
                    </div>
                    <div className="rounded-md bg-slate-50 border text-xs p-3 space-y-1">
                      <p className="font-medium text-foreground flex items-center gap-1">
                        <Waves className="h-3.5 w-3.5" /> Ride zone
                      </p>
                      <p>Rides stay within a clearly‑marked bay zone for safety.</p>
                    </div>
                    <div className="rounded-md bg-slate-50 border text-xs p-3 space-y-1">
                      <p className="font-medium text-foreground flex items-center gap-1">
                        <Gift className="h-3.5 w-3.5" /> Add‑ons
                      </p>
                      <p>Optional drone footage and GoPro add‑ons for unforgettable memories.</p>
                    </div>
                  </div>

                  {/* Media placeholder */}
                  <div className="mt-3 rounded-lg border border-dashed border-slate-400 bg-slate-100/70 h-40 flex items-center justify-center">
                    <span className="max-w-[260px] text-[11px] text-slate-600 text-center">
                      Hero media placeholder — image or short clip of riders launching from Gordon&apos;s Bay
                      will display here.
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Reveal>
          </div>
        </div>

        {/* Wave divider */}
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

      <Separator className="my-2" />

      {/* OFFER CARDS */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <Reveal direction="down" offset={4} duration={850}>
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold">Popular experiences</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Choose a rental that matches your vibe. You can always add extras during booking.
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
                <CardDescription>Perfect for a quick burst of fun.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                {/* Image placeholder */}
                <div className="h-32 w-full rounded-md border border-dashed border-slate-300 bg-slate-100 flex items-center justify-center">
                  <span className="text-[11px] text-slate-600 text-center px-4">
                    Package image placeholder — harbour shot or action photo for 30‑minute rentals.
                  </span>
                </div>
                <p>
                  Launch from Gordon&apos;s Bay Harbour and ride within the marked zone. Safety briefing and
                  life jackets included.
                </p>
              </CardContent>
              <CardFooter className="mt-auto flex items-center justify-between">
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
                <CardDescription>Extra time to explore the bay.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                {/* Image placeholder */}
                <div className="h-32 w-full rounded-md border border-dashed border-slate-300 bg-slate-100 flex items-center justify-center">
                  <span className="text-[11px] text-slate-600 text-center px-4">
                    Package image placeholder — longer‑ride imagery or sunset session photo.
                  </span>
                </div>
                <p>
                  More freedom on the water with the same safety‑first setup. Great for confident riders or
                  pairs (passenger optional).
                </p>
              </CardContent>
              <CardFooter className="mt-auto flex items-center justify-between">
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
                {/* Image placeholder */}
                <div className="h-32 w-full rounded-md border border-dashed border-amber-300 bg-amber-50 flex items-center justify-center">
                  <span className="text-[11px] text-amber-800 text-center px-4">
                    Add‑ons media placeholder — drone footage, GoPro clips, and Joy Ride preview.
                  </span>
                </div>
                <p>
                  Drone video, GoPro footage, waterproof phone pouch, and premium wetsuit hire available at
                  checkout. Joy Ride (10 min) available from ZAR 700.
                </p>
              </CardContent>
              <CardFooter className="mt-auto flex items-center justify-between">
                <Badge>Popular</Badge>
                <Link to="/add-ons" className={buttonVariants({ variant: 'outline', size: 'sm' })}>
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
              <h2 className="text-2xl md:text-3xl font-bold">What riders say</h2>
              <p className="mt-1 text-sm text-muted-foreground max-w-md">
                A mix of solo riders, couples and groups — all sharing the same big grins afterwards.
              </p>
            </div>
          </div>
        </Reveal>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Reveal offset={4} duration={850}>
            <Card className="bg-gradient-to-br from-primary/5 to-cyan-50 border-primary/20">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src="/avatars/1.png" />
                    <AvatarFallback>DM</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">Daniel M.</p>
                    <p className="text-xs text-muted-foreground">Guided Ride • Gordon&apos;s Bay</p>
                  </div>
                </div>
                <p className="mt-4 text-sm">
                  “Super professional team. The briefing made us feel safe and then it was pure fun!”
                </p>
              </CardContent>
            </Card>
          </Reveal>
          <Reveal delay={120} offset={4} duration={850}>
            <Card className="bg-gradient-to-br from-amber-50 to-amber-100/60 border-amber-200/60">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src="/avatars/2.png" />
                    <AvatarFallback>SK</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">Sipho K.</p>
                    <p className="text-xs text-muted-foreground">Solo Rental • Gordon&apos;s Bay</p>
                  </div>
                </div>
                <p className="mt-4 text-sm">
                  “Great gear and friendly staff. Booking was quick and the skis are mint.”
                </p>
              </CardContent>
            </Card>
          </Reveal>
          <Reveal delay={240} offset={4} duration={850}>
            <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 border-emerald-200/60">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src="/avatars/3.png" />
                    <AvatarFallback>AZ</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">Aisha Z.</p>
                    <p className="text-xs text-muted-foreground">Guided Ride • Gordon&apos;s Bay</p>
                  </div>
                </div>
                <p className="mt-4 text-sm">
                  “Views for days. The drone video add‑on is 100% worth it.”
                </p>
              </CardContent>
            </Card>
          </Reveal>
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
                    <p className="font-medium text-foreground">Age &amp; passengers</p>
                    <p>Minimum age 16 to drive (with guardian consent). Passengers: 8+.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 inline-flex items-center justify-center size-6 rounded-full bg-amber-500/10 text-amber-700">
                    <Waves className="size-3.5" />
                  </span>
                  <div>
                    <p className="font-medium text-foreground">Briefing &amp; zones</p>
                    <p>Briefing covers throttle control, safe distances, and no‑wake zones.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 inline-flex items-center justify-center size-6 rounded-full bg-amber-500/10 text-amber-700">
                    <LifeBuoy className="size-3.5" />
                  </span>
                  <div>
                    <p className="font-medium text-foreground">Life jackets</p>
                    <p>Life jackets are mandatory and provided free for every rider and passenger.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 inline-flex items-center justify-center size-6 rounded-full bg-amber-500/10 text-amber-700">
                    <Wind className="size-3.5" />
                  </span>
                  <div>
                    <p className="font-medium text-foreground">Weather conditions</p>
                    <p>Weather can shift quickly; we may reschedule if conditions are unsafe.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 inline-flex items-center justify-center size-6 rounded-full bg-amber-500/10 text-amber-700">
                    <Users className="size-3.5" />
                  </span>
                  <div>
                    <p className="font-medium text-foreground">Swimming ability</p>
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
                      All Joy Rides are instructed rides — an instructor drives with the client seated
                      behind for a safe, guided experience.
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="mt-auto">
                <Link to="/safety" className={buttonVariants({ variant: 'outline' })}>
                  Full safety guide
                </Link>
              </CardFooter>
            </Card>
          </Reveal>

          <Reveal delay={100}>
            <Card className="border-cyan-200 bg-cyan-50/60 h-full flex flex-col">
              <CardHeader>
                <CardTitle>Where we launch</CardTitle>
                <CardDescription>We operate only from Gordon&apos;s Bay Harbour.</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-4">
                <div className="flex items-center justify-between">
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
                        <div className="flex h-40 items-center justify-center rounded-md border bg-slate-100">
                          <span className="max-w-[220px] text-center text-[11px] text-muted-foreground">
                            Map embed coming soon. For now, search &quot;Jetski &amp; More Gordon&apos;s
                            Bay&quot; in your maps app.
                          </span>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Image / harbour placeholder */}
                <div className="rounded-lg border border-dashed border-cyan-400 bg-cyan-50/80 h-36 flex items-center justify-center">
                  <span className="max-w-[220px] text-[11px] text-cyan-900 text-center px-4">
                    Harbour image placeholder — aerial view or dockside photo of Gordon&apos;s Bay Harbour.
                  </span>
                </div>

                <p className="text-xs text-muted-foreground">
                  Parking is available nearby. Please follow on‑site signage and staff directions for launching
                  and exiting the harbour.
                </p>
              </CardContent>
              <CardFooter className="mt-auto flex justify-between gap-2">
                <Link to="/safety" className={buttonVariants({ size: 'sm', variant: 'outline' })}>
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
              <CardTitle className="text-2xl md:text-3xl">Ready to ride?</CardTitle>
              <CardDescription>Pick a time. We’ll handle the rest.</CardDescription>
            </CardHeader>
            <CardFooter className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link to="/Bookings" className={buttonVariants({ size: 'lg' })}>
                <CalendarDays className="mr-2 h-5 w-5" />
                Book now
              </Link>
              <Link to="/contact" className={buttonVariants({ variant: 'outline', size: 'lg' })}>
                Questions? Contact us
              </Link>
            </CardFooter>
          </Card>
        </Reveal>
      </section>
    </div>
  )
}
