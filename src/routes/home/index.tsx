import { createFileRoute } from '@tanstack/react-router'
import { Link } from '@tanstack/react-router'
import { Waves, CalendarDays, MapPin, Clock, ShieldCheck, Ship, Gift, Star, Wind, Users } from 'lucide-react'
import Reveal from '@/components/Reveal'

import { Button, buttonVariants } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"

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
          <div className="flex flex-col items-center text-center gap-6">
            <Reveal direction="down" offset={4} duration={900}>
              <div className="flex flex-wrap items-center justify-center gap-2">
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
              <p className="text-base md:text-lg text-muted-foreground max-w-2xl">
                Book a thrilling ride on crystal waters. Flexible time slots, safety‑first briefings,
                and optional drone video add‑ons.
              </p>
            </Reveal>

            <Reveal delay={360} offset={4} duration={900}>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link to="/Bookings" className={buttonVariants({ size: "lg" })}>
                  <CalendarDays className="mr-2 h-5 w-5" />
                  Book now
                </Link>
                <Link to="/rides" className={buttonVariants({ variant: "outline", size: "lg" })}>
                  <Waves className="mr-2 h-5 w-5" />
                  Explore rides
                </Link>
              </div>
            </Reveal>

            {/* Key highlights */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
              <Reveal offset={4} duration={850}>
                <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-cyan-50">
                  <CardHeader className="space-y-1">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <span className="inline-flex items-center justify-center size-7 rounded-md bg-primary/15 text-primary"><Clock className="size-4" /></span>
                      Flexible sessions
                    </CardTitle>
                    <CardDescription>30 and 60 minute, and up to 2 hours for group bookings</CardDescription>
                  </CardHeader>
                </Card>
              </Reveal>
              <Reveal delay={120} offset={4} duration={850}>
                <Card className="border-emerald-300/40 bg-gradient-to-br from-emerald-50 to-emerald-100/40">
                  <CardHeader className="space-y-1">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <span className="inline-flex items-center justify-center size-7 rounded-md bg-emerald-600/15 text-emerald-700"><ShieldCheck className="size-4" /></span>
                      Safety included
                    </CardTitle>
                    <CardDescription>Briefing + life jackets</CardDescription>
                  </CardHeader>
                </Card>
              </Reveal>
              <Reveal delay={240} offset={4} duration={850}>
                <Card className="border-cyan-300/40 bg-gradient-to-br from-cyan-50 to-cyan-100/40">
                  <CardHeader className="space-y-1">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <span className="inline-flex items-center justify-center size-7 rounded-md bg-cyan-600/15 text-cyan-700"><MapPin className="size-4" /></span>
                      Our launch spot
                    </CardTitle>
                    <CardDescription>Gordon&apos;s Bay Harbour only</CardDescription>
                  </CardHeader>
                </Card>
              </Reveal>
            </div>

            {/* Stats */}
            <Reveal offset={2} duration={700}>
              <div className="mt-4 grid grid-cols-3 gap-6 text-sm text-muted-foreground">
                <div className="flex flex-col items-center"><Star className="h-4 w-4 text-amber-500" /> <span className="font-semibold text-foreground">4.9★</span> Reviews</div>
                <div className="flex flex-col items-center"><Users className="h-4 w-4 text-primary" /> <span className="font-semibold text-foreground">1,000+</span> Riders</div>
                <div className="flex flex-col items-center"><Wind className="h-4 w-4 text-cyan-600" /> <span className="font-semibold text-foreground">Safety‑first</span> Briefings</div>
              </div>
            </Reveal>
          </div>
        </div>
        {/* Wave divider */}
        <svg className="absolute bottom-0 left-0 w-full text-background" viewBox="0 0 1440 80" preserveAspectRatio="none" aria-hidden>
          <path fill="currentColor" d="M0,32L48,37.3C96,43,192,53,288,48C384,43,480,21,576,26.7C672,32,768,64,864,69.3C960,75,1056,53,1152,48C1248,43,1344,53,1392,58.7L1440,64L1440,80L1392,80C1344,80,1248,80,1152,80C1056,80,960,80,864,80C768,80,672,80,576,80C480,80,384,80,288,80C192,80,96,80,48,80L0,80Z" />
        </svg>
      </section>

      <Separator className="my-2" />

      {/* OFFER CARDS */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <Reveal direction="down" offset={4} duration={850}>
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl md:text-3xl font-bold">Popular experiences</h2>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge variant="outline" className="cursor-help bg-primary/5 border-primary/20 text-foreground">What’s included?</Badge>
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
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Ship className="h-5 w-5" />
                  30‑min Rental (1 Jet‑Ski)
                </CardTitle>
                <CardDescription>Perfect for a quick burst of fun</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Launch from Gordon&apos;s Bay Harbour and ride within the marked zone. Safety briefing and life jackets included.
              </CardContent>
              <CardFooter className="mt-auto flex items-center justify-between">
                <Badge>From ZAR 1,750</Badge>
                <Link to="/Bookings" className={buttonVariants({ size: "sm" })}>Select</Link>
              </CardFooter>
            </Card>
          </Reveal>

          <Reveal delay={120} offset={4} duration={900}>
            <Card className="flex flex-col border-primary/30 hover:border-primary/50 hover:shadow-lg transition-all bg-white/80 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  60‑min Rental (1 Jet‑Ski)
                </CardTitle>
                <CardDescription>Extra time to explore the bay</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                More freedom on the water with the same safety‑first setup. Great for confident riders or pairs (passenger optional).
              </CardContent>
              <CardFooter className="mt-auto flex items-center justify-between">
                <Badge>From ZAR 2,600</Badge>
                <Link to="/Bookings" className={buttonVariants({ size: "sm" })}>Select</Link>
              </CardFooter>
            </Card>
          </Reveal>

          <Reveal delay={240} offset={4} duration={900}>
            <Card className="flex flex-col border-amber-300/40 hover:border-amber-500/60 hover:shadow-lg transition-all bg-gradient-to-br from-amber-50 to-amber-100/60">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gift className="h-5 w-5" />
                  Add‑ons &amp; Extras
                </CardTitle>
                <CardDescription>Make it unforgettable</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Drone video, GoPro footage, waterproof phone pouch, and premium
                wetsuit hire available at checkout. Joy Ride (10 min) available from ZAR 700.
              </CardContent>
              <CardFooter className="mt-auto flex items-center justify-between">
                <Badge>Popular</Badge>
                <Link to="/add-ons" className={buttonVariants({ variant: "outline", size: "sm" })}>See options</Link>
              </CardFooter>
            </Card>
          </Reveal>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <Reveal direction="down" offset={4} duration={850}>
          <h2 className="text-2xl md:text-3xl font-bold mb-6">What riders say</h2>
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Reveal>
            <Card className="border-amber-200 bg-amber-50/60">
              <CardHeader>
                <CardTitle>Safety &amp; requirements</CardTitle>
                <CardDescription>Read before you ride</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <p>• Minimum age 16 to drive (with guardian consent). Passengers: 8+.</p>
                <p>• Briefing covers throttle control, safe distances, and no‑wake zones.</p>
                <p>• Life jackets are mandatory and provided free.</p>
                <p>• Weather can shift quickly; we may reschedule if conditions are unsafe.</p>
                <p>• If you cannot swim, you cannot operate a jet ski.</p>
                <p>• All Joy Rides are instructed rides — an instructor drives with the client seated behind for a safe, guided experience.</p>
              </CardContent>
              <CardFooter>
                <Link to="/safety" className={buttonVariants({ variant: "outline" })}>Full safety guide</Link>
              </CardFooter>
            </Card>
          </Reveal>

          <Reveal delay={100}>
            <Card className="border-cyan-200 bg-cyan-50/60">
              <CardHeader>
                <CardTitle>Where we launch</CardTitle>
                <CardDescription>We operate only from Gordon&apos;s Bay Harbour</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2"><MapPin className="h-4 w-4" /> Gordon&apos;s Bay Harbour</span>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="ghost" size="sm">View map</Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-80">
                        <div className="text-sm">Map embed placeholder</div>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Link to="/safety" className={buttonVariants({ size: "sm" })}>Safety &amp; info</Link>
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
              <CardFooter className="flex justify-center gap-3">
                <Link to="/Bookings" className={buttonVariants({ size: "lg" })}>
                  <CalendarDays className="mr-2 h-5 w-5" />
                  Book now
                </Link>
                <Link to="/contact" className={buttonVariants({ variant: "outline", size: "lg" })}>
                  Questions? Contact us
                </Link>
              </CardFooter>
            </Card>
          </Reveal>
      </section>
    </div>
  )
}
