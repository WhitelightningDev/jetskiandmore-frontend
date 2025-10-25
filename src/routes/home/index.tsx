import { createFileRoute } from '@tanstack/react-router'
import { Link } from '@tanstack/react-router'
import { Waves, CalendarDays, MapPin, Clock, ShieldCheck, Ship, Gift } from 'lucide-react'

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
    <div className="bg-white">
      {/* HERO */}
      <section className="relative mx-auto max-w-6xl px-4 py-16 md:py-24">
        <div className="flex flex-col items-center text-center gap-6">
          <Badge className="uppercase tracking-wide" variant="secondary">
            Gordon&apos;s Bay Harbour • Western Cape
          </Badge>
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
            Jet Ski Rentals &amp; Guided Rides
          </h1>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl">
            Book a thrilling ride on crystal waters. Flexible time slots, safety-first briefings,
            and optional drone video add‑ons.
          </p>

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

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
            <Card>
              <CardHeader className="space-y-1">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Clock className="h-5 w-5" />
                  Flexible sessions
                </CardTitle>
                <CardDescription>30, 60 or 90-minute options</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="space-y-1">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <ShieldCheck className="h-5 w-5" />
                  Safety included
                </CardTitle>
                <CardDescription>Briefing + life jackets</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="space-y-1">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <MapPin className="h-5 w-5" />
                  Our launch spot
                </CardTitle>
                <CardDescription>Gordon&apos;s Bay Harbour only</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      <Separator className="my-2" />

      {/* OFFER CARDS */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl md:text-3xl font-bold">Popular experiences</h2>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge variant="outline" className="cursor-help">What’s included?</Badge>
              </TooltipTrigger>
              <TooltipContent>
                Life jackets, safety briefing &amp; fuel. Skipper on request.
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="flex flex-col">
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

          <Card className="flex flex-col">
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

          <Card className="flex flex-col">
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
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-6">What riders say</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
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
          <Card>
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
          <Card>
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
        </div>
      </section>

      <Separator className="my-2" />

      {/* SAFETY & INFO */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
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

          <Card>
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
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="mx-auto max-w-6xl px-4 pb-20">
        <Card className="border-primary/30">
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
      </section>
    </div>
  )
}
