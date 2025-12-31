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
  BadgePercent,
  CalendarX2,
} from 'lucide-react'
import Reveal from '@/components/Reveal'

import { Button, buttonVariants } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

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
import { BOOKINGS_PAUSED, BOOKINGS_PAUSED_MESSAGE } from '@/lib/bookingStatus'

const GBAY_LAT = -34.165
const GBAY_LON = 18.866

export const Route = createFileRoute('/home/')({
  component: App,
})

function App() {
  const [ready] = React.useState(true)
  const [discountOpen, setDiscountOpen] = React.useState(false)

  React.useEffect(() => {
    if (!BOOKINGS_PAUSED) {
      setDiscountOpen(true)
    }
  }, [])

  const bookingButton = ({
    label = 'Book now',
    size = 'sm',
    variant,
    className,
    showIcon = true,
  }: {
    label?: string
    size?: NonNullable<Parameters<typeof buttonVariants>[0]>['size']
    variant?: NonNullable<Parameters<typeof buttonVariants>[0]>['variant']
    className?: string
    showIcon?: boolean
  }) => {
    const iconSize = size === 'lg' ? 'h-5 w-5' : 'h-4 w-4'
    if (BOOKINGS_PAUSED) {
      return (
        <span
          className={buttonVariants({
            size,
            variant: variant ?? 'outline',
            className: cn('cursor-not-allowed select-none opacity-80', className),
          })}
          aria-disabled="true"
        >
          {showIcon && <CalendarX2 className={`mr-2 ${iconSize}`} />}
          Bookings paused
        </span>
      )
    }
    return (
      <Link to="/Bookings" className={buttonVariants({ size, variant, className })}>
        {showIcon && <CalendarDays className={`mr-2 ${iconSize}`} />}
        {label}
      </Link>
    )
  }

  const heroCopy = BOOKINGS_PAUSED
    ? 'Bookings are temporarily paused while we complete maintenance. Reach out and we’ll line up your slot manually.'
    : 'Premium skis, safety-first briefings, and flexible slots from sunrise to sunset. Book online, arrive 15 minutes early, and we’ll handle the rest.'
  return (
    <div className="bg-background">
      <Dialog open={discountOpen} onOpenChange={setDiscountOpen}>
        <DialogContent className="top-8 sm:top-12 translate-y-0 sm:max-w-lg border-emerald-100/80 bg-white/95 text-slate-900 shadow-2xl shadow-emerald-200/60">
          <DialogHeader className="space-y-1 text-center">
            <DialogTitle className="flex items-center justify-center gap-2 text-xl text-emerald-800">
              <BadgePercent className="h-5 w-5" />
              15% off jet ski rentals
            </DialogTitle>
            <DialogDescription className="text-slate-600">
              Save on every jet ski session today. Book your slot and the discount is applied automatically.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center gap-3">
            <Badge variant="outline" className="rounded-full border-emerald-200 bg-emerald-50 text-emerald-800">
              Auto-applied — limited time
            </Badge>
            <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
              <Link
                to="/rides"
                className={buttonVariants({
                  size: 'sm',
                  className: 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm w-full sm:w-auto',
                })}
              >
                View jet ski rentals
              </Link>
              <Button variant="ghost" size="sm" className="w-full sm:w-auto" onClick={() => setDiscountOpen(false)}>
                Maybe later
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
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
                {heroCopy}
              </p>
            </Reveal>

            <Reveal delay={320} offset={4} duration={900}>
              <div className="flex flex-col sm:flex-row gap-3">
                {bookingButton({ label: 'Book now', size: 'lg' })}
                <Link to="/rides" className={buttonVariants({ variant: 'outline', size: 'lg' })}>
                  <Waves className="mr-2 h-5 w-5 text-black" />
                  <p className='text-black'>See rides &amp; pricing</p>
                </Link>
              </div>
            </Reveal>
            {BOOKINGS_PAUSED && (
              <p className="mt-2 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-2 text-sm text-amber-50 ring-1 ring-white/20">
                <CalendarX2 className="h-4 w-4" /> Online bookings are paused for maintenance. Contact us to schedule.
              </p>
            )}

            <Reveal delay={380} offset={4} duration={900}>
              <div className="flex flex-wrap gap-3 text-sm text-slate-100/80">
                <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 ring-1 ring-slate-200 text-black">
                  <Clock className="h-4 w-4 text-black" /> 30–120 min sessions
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 ring-1 ring-slate-200 text-black">
                  <ShieldCheck className="h-4 w-4 text-black" /> Safety briefing &amp; life jackets
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 ring-1 ring-slate-200 text-black">
                  <MapPin className="h-4 w-4 text-black" /> Gordon&apos;s Bay Harbour only
                </span>
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

      <section className="mx-auto max-w-6xl px-4 py-12 space-y-12">
        {/* BOOKING ESSENTIALS */}
        <div className="relative overflow-hidden rounded-3xl border border-primary/10 bg-gradient-to-b from-white/95 via-white to-primary/10 shadow-[0_30px_90px_-50px_rgba(14,116,144,0.5)]">
          <div className="absolute -left-12 -top-24 h-52 w-52 rounded-full bg-primary/15 blur-3xl" />
          <div className="absolute -right-14 top-10 h-64 w-64 rounded-full bg-sky-400/15 blur-3xl" />
          <div className="absolute bottom-0 left-1/3 h-24 w-48 rounded-full bg-primary/10 blur-3xl" />

          <div className="relative p-6 md:p-10">
            <Reveal direction="down" offset={4} duration={850}>
              <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-2">
                  <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary ring-1 ring-primary/20">
                    Booking essentials
                  </span>
                  <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Booking essentials (at a glance)</h2>
                  <p className="text-sm md:text-base text-slate-600 max-w-2xl">
                    Everything you need to know before you lock in a slot — clear, fast, and ready to ride.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {bookingButton({ label: 'Book now', size: 'sm' })}
                  <Link to="/contact" className={buttonVariants({ variant: 'outline', size: 'sm' })}>
                    Questions? Chat to us
                  </Link>
                </div>
              </div>
            </Reveal>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              <Reveal duration={800}>
                <Card className="h-full rounded-2xl border border-slate-200/80 bg-white/90 shadow-[0_20px_50px_-30px_rgba(15,23,42,0.35)] backdrop-blur-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2">
                      <CalendarDays className="h-5 w-5 text-primary" />
                      How booking works
                    </CardTitle>
                    <CardDescription>3 quick steps to ride</CardDescription>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground space-y-2">
                    <p>1) Pick a ride and time in the booking form.</p>
                    <p>2) Add extras like GoPro footage or wetsuits if you want.</p>
                    <p>3) Pay securely online — you’ll get confirmation instantly.</p>
                  </CardContent>
                  <CardFooter className="flex flex-wrap gap-2">
                    {bookingButton({ label: 'Open booking form', variant: 'outline', size: 'sm', showIcon: false })}
                  </CardFooter>
                </Card>
              </Reveal>

              <Reveal delay={80} duration={800}>
                <Card className="h-full rounded-2xl border border-emerald-200/80 bg-emerald-50/70 shadow-[0_18px_45px_-30px_rgba(16,185,129,0.55)]">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2">
                      <ShieldCheck className="h-5 w-5 text-emerald-600" />
                      What’s included
                    </CardTitle>
                    <CardDescription>Every ride, every time</CardDescription>
                  </CardHeader>
                  <CardContent className="text-sm text-slate-700 space-y-2">
                    <p>• Safety briefing on arrival.</p>
                    <p>• Life jackets for riders and passengers.</p>
                    <p>• Clearly marked riding zone for comfort and safety.</p>
                    <p>• Optional add‑ons (GoPro footage, wetsuits, boat rides).</p>
                  </CardContent>
                  <CardFooter>
                    <Link to="/safety" className={buttonVariants({ size: 'sm', variant: 'outline' })}>
                      View safety info
                    </Link>
                  </CardFooter>
                </Card>
              </Reveal>

              <Reveal delay={160} duration={800}>
                <Card className="h-full rounded-2xl border border-amber-200/80 bg-amber-50/70 shadow-[0_18px_45px_-30px_rgba(245,158,11,0.45)]">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-amber-600" />
                      Before you arrive
                    </CardTitle>
                    <CardDescription>So check‑in is smooth</CardDescription>
                  </CardHeader>
                  <CardContent className="text-sm text-slate-700 space-y-2">
                    <p>• Arrive 15 minutes early at Gordon’s Bay Harbour.</p>
                    <p>• Bring a towel, sunscreen, and swimwear (or hire a wetsuit).</p>
                    <p>• Riders must be 16+ to drive; passengers 8+.</p>
                    <p>• We reschedule if weather turns unsafe — no fuss.</p>
                  </CardContent>
                  <CardFooter className="flex flex-wrap items-center gap-2">
                    <Badge variant="secondary" className="rounded-full">
                      Gordon&apos;s Bay only
                    </Badge>
                    <Link to="/contact" className={buttonVariants({ size: 'sm', variant: 'outline' })}>
                      Need directions?
                    </Link>
                  </CardFooter>
                </Card>
              </Reveal>
            </div>
          </div>
        </div>

        {/* OFFER CARDS */}
        <div className="relative overflow-hidden rounded-3xl border border-primary/10 bg-gradient-to-b from-white via-white to-sky-50 shadow-[0_30px_90px_-50px_rgba(14,116,144,0.5)]">
          <div className="absolute -left-16 top-10 h-60 w-60 rounded-full bg-primary/15 blur-3xl" />
          <div className="absolute -right-20 bottom-12 h-72 w-72 rounded-full bg-sky-400/15 blur-3xl" />
          <div className="relative p-6 md:p-10">
            <Reveal direction="down" offset={4} duration={850}>
              <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-3">
                  <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary ring-1 ring-primary/20">
                    Popular experiences
                  </span>
                  <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Choose your ride</h2>
                  <p className="text-sm md:text-base text-slate-600 max-w-2xl">
                    Pick a session length or stack on extras. You can tweak the details during checkout.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Link to="/rides" className={buttonVariants({ variant: 'outline', size: 'sm' })}>
                    View full lineup
                  </Link>
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
              </div>
            </Reveal>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <Reveal offset={4} duration={900}>
                <Card className="flex flex-col rounded-2xl border border-slate-200/80 bg-white/90 shadow-[0_20px_50px_-30px_rgba(15,23,42,0.35)] backdrop-blur-sm hover:-translate-y-1 hover:shadow-[0_24px_70px_-40px_rgba(14,116,144,0.45)] transition-all">
                  <CardHeader className="pb-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <CardTitle className="flex items-center gap-2">
                        <Ship className="h-5 w-5 text-primary" />
                        30‑min Rental (1 Jet‑Ski)
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="rounded-full">
                          Quick thrill
                        </Badge>
                        <Badge variant="secondary" className="flex items-center gap-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-sm">
                          <BadgePercent className="h-3.5 w-3.5" />
                          15% off
                        </Badge>
                      </div>
                    </div>
                    <CardDescription>Perfect for a quick burst of fun.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm text-muted-foreground">
                    <div className="h-32 w-full rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50 to-primary/10 flex items-center justify-center overflow-hidden">
                      <img
                        src={jetskiLogo}
                        alt="JetSki & More"
                        className="h-24 w-auto object-contain"
                        loading="lazy"
                      />
                    </div>
                    <p>
                      Launch from Gordon&apos;s Bay Harbour and ride within the marked zone. Safety briefing and life jackets included.
                    </p>
                  </CardContent>
                  <CardFooter className="mt-auto flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="flex items-center gap-1.5 rounded-full border-emerald-200 bg-emerald-50 text-emerald-800">
                        <BadgePercent className="h-3.5 w-3.5" />
                        15% off applied
                      </Badge>
                      <Badge className="bg-emerald-600 text-white shadow-sm">From ZAR 1,488</Badge>
                    </div>
                    {bookingButton({ label: 'Select', size: 'sm', showIcon: false })}
                  </CardFooter>
                </Card>
              </Reveal>

              <Reveal delay={120} offset={4} duration={900}>
                <Card className="flex flex-col rounded-2xl border border-slate-200/80 bg-white/90 shadow-[0_20px_50px_-30px_rgba(15,23,42,0.35)] backdrop-blur-sm hover:-translate-y-1 hover:shadow-[0_24px_70px_-40px_rgba(14,116,144,0.45)] transition-all">
                  <CardHeader className="pb-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <CardTitle className="flex items-center gap-2">
                        <Clock className="h-5 w-5 text-primary" />
                        60‑min Rental (1 Jet‑Ski)
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="rounded-full border-primary/30 text-primary">
                          Most booked
                        </Badge>
                        <Badge variant="secondary" className="flex items-center gap-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-sm">
                          <BadgePercent className="h-3.5 w-3.5" />
                          15% off
                        </Badge>
                      </div>
                    </div>
                    <CardDescription>Extra time to explore the bay.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm text-muted-foreground">
                    <div className="h-32 w-full rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50 to-primary/10 flex items-center justify-center overflow-hidden">
                      <img
                        src={jetskiLogo}
                        alt="JetSki & More"
                        className="h-24 w-auto object-contain"
                        loading="lazy"
                      />
                    </div>
                    <p>
                      More freedom on the water with the same safety‑first setup. Great for confident riders or pairs (passenger optional).
                    </p>
                  </CardContent>
                  <CardFooter className="mt-auto flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="flex items-center gap-1.5 rounded-full border-emerald-200 bg-emerald-50 text-emerald-800">
                        <BadgePercent className="h-3.5 w-3.5" />
                        15% off applied
                      </Badge>
                      <Badge className="bg-emerald-600 text-white shadow-sm">From ZAR 2,210</Badge>
                    </div>
                    {bookingButton({ label: 'Select', size: 'sm', showIcon: false })}
                  </CardFooter>
                </Card>
              </Reveal>

              <Reveal delay={240} offset={4} duration={900}>
                <Card className="flex flex-col rounded-2xl border border-amber-300/60 bg-gradient-to-br from-amber-50 via-white to-amber-100/70 shadow-[0_22px_60px_-38px_rgba(245,158,11,0.5)] hover:-translate-y-1 transition-all">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Gift className="h-5 w-5 text-amber-600" />
                        Add‑ons &amp; Extras
                      </CardTitle>
                      <Badge className="rounded-full bg-amber-500/15 text-amber-700">Customize</Badge>
                    </div>
                    <CardDescription>Make it unforgettable.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm text-muted-foreground">
                    <div className="h-32 w-full rounded-xl border border-amber-200 bg-gradient-to-br from-amber-50 to-amber-100 flex items-center justify-center overflow-hidden">
                      <img
                        src={jetskiLogo}
                        alt="JetSki & More"
                        className="h-24 w-auto object-contain"
                        loading="lazy"
                      />
                    </div>
                    <p>
                      Drone video, GoPro footage, waterproof phone pouch, and premium wetsuit hire available at checkout. Joy Ride (10 min) available from ZAR 595.
                    </p>
                  </CardContent>
                  <CardFooter className="mt-auto flex flex-wrap items-center justify-between gap-3">
                    <Badge className="bg-amber-500/15 text-amber-700">Popular</Badge>
                    <Link to="/add-ons" className={buttonVariants({ variant: 'outline', size: 'sm' })}>
                      See options
                    </Link>
                  </CardFooter>
                </Card>
              </Reveal>
            </div>
          </div>
        </div>

        {/* TESTIMONIALS */}
        <div className="relative overflow-hidden rounded-3xl border border-primary/10 bg-gradient-to-b from-white via-white to-primary/8 shadow-[0_30px_90px_-50px_rgba(14,116,144,0.5)]">
          <div className="absolute -left-16 top-4 h-48 w-48 rounded-full bg-primary/15 blur-3xl" />
          <div className="absolute -right-14 bottom-6 h-56 w-56 rounded-full bg-sky-400/15 blur-3xl" />
          <div className="relative p-6 md:p-10">
            <Reveal direction="down" offset={4} duration={850}>
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
                <div className="space-y-3">
                  <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary ring-1 ring-primary/20">
                    What riders say
                  </span>
                  <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Real smiles, real rides</h2>
                  <p className="mt-1 text-sm text-slate-600 max-w-md">
                    Solo riders, couples, groups — all leaving the harbour with the same grin.
                  </p>
                </div>
                <Badge variant="outline" className="self-start rounded-full border-primary/30 text-primary">
                  Verified Google reviews
                </Badge>
              </div>
            </Reveal>
            <div className="overflow-hidden rounded-2xl border border-primary/15 bg-white/80 backdrop-blur shadow-[0_24px_70px_-40px_rgba(14,116,144,0.45)]">
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
          </div>
        </div>

        {/* SAFETY & INFO */}
        <div className="relative overflow-hidden rounded-3xl border border-primary/10 bg-gradient-to-b from-white via-white to-primary/10 shadow-[0_30px_90px_-50px_rgba(14,116,144,0.5)]">
          <div className="absolute -left-10 top-0 h-52 w-52 rounded-full bg-amber-300/25 blur-3xl" />
          <div className="absolute -right-12 bottom-0 h-60 w-60 rounded-full bg-cyan-400/15 blur-3xl" />
          <div className="relative p-6 md:p-10">
            <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-2">
                <span className="inline-flex items-center gap-2 rounded-full bg-amber-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-700 ring-1 ring-amber-400/30">
                  Safety first
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Safety &amp; harbour info</h2>
                <p className="text-sm md:text-base text-slate-600 max-w-2xl">
                  Clear guidelines, simple steps, and a single launch point so you know exactly what to expect.
                </p>
              </div>
              <Link to="/safety" className={buttonVariants({ variant: 'outline', size: 'sm' })}>
                View full guide
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1.3fr),minmax(0,1fr)] gap-6 items-stretch">
              <Reveal>
                <Card className="border-amber-200/70 bg-amber-50/75 h-full flex flex-col rounded-2xl shadow-[0_18px_45px_-30px_rgba(245,158,11,0.45)]">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span className="inline-flex items-center justify-center size-7 rounded-md bg-amber-500/10 text-amber-700">
                        <ShieldCheck className="size-4" />
                      </span>
                      Safety &amp; requirements
                    </CardTitle>
                    <CardDescription>Read before you ride</CardDescription>
                  </CardHeader>
                  <CardContent className="text-sm text-slate-700 space-y-3">
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
                        <p>All Joy Rides are instructed rides — an instructor drives with the client seated behind.</p>
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
                <Card className="border-cyan-200/70 bg-cyan-50/70 h-full flex flex-col rounded-2xl shadow-[0_18px_45px_-30px_rgba(14,165,233,0.45)]">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-cyan-700" />
                      Where we launch
                    </CardTitle>
                    <CardDescription>We operate only from Gordon&apos;s Bay Harbour.</CardDescription>
                  </CardHeader>
                  <CardContent className="text-sm text-slate-700 space-y-4">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <span className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-cyan-700" /> Gordon&apos;s Bay Harbour
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
                              Coordinates: {GBAY_LAT.toFixed(5)}, {GBAY_LON.toFixed(5)} (Gordon&apos;s Bay Harbour)
                            </p>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>

                    {/* Harbour image */}
                    <div className="rounded-xl overflow-hidden border border-cyan-300 bg-gradient-to-br from-cyan-50 to-white">
                      <img
                        src={harbourImg}
                        alt="Gordon's Bay Harbour"
                        className="h-70 w-full object-cover"
                        loading="lazy"
                      />
                    </div>

                    <p className="text-xs text-muted-foreground">
                      Parking is available nearby. Please follow on‑site signage and staff directions for launching and exiting the harbour.
                    </p>
                  </CardContent>
                  <CardFooter className="mt-auto flex flex-wrap items-center justify-between gap-3">
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
          </div>
        </div>

        {/* FINAL CTA */}
        <div className="relative overflow-hidden rounded-3xl border border-primary/10 bg-gradient-to-br from-primary/10 via-white to-cyan-50 shadow-[0_36px_90px_-52px_rgba(14,116,144,0.6)] px-6 py-10 sm:px-10 text-center">
          <div className="absolute -left-10 -bottom-10 h-44 w-44 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute -right-16 top-0 h-52 w-52 rounded-full bg-cyan-400/15 blur-3xl" />
          <Card className="border-transparent bg-transparent shadow-none">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl md:text-4xl font-bold text-slate-900">
                {BOOKINGS_PAUSED ? 'Bookings temporarily paused' : 'Ready to ride?'}
              </CardTitle>
              <CardDescription className="text-base md:text-lg text-slate-600">
                {BOOKINGS_PAUSED
                  ? BOOKINGS_PAUSED_MESSAGE
                  : 'Pick a time. We’ll handle the rest.'}
              </CardDescription>
            </CardHeader>
            <CardFooter className="flex flex-col sm:flex-row items-center justify-center gap-3">
              {bookingButton({ label: 'Book now', size: 'lg' })}
              <Link to="/contact" className={buttonVariants({ variant: 'outline', size: 'lg' })}>
                Questions? Contact us
              </Link>
            </CardFooter>
          </Card>
        </div>
      </section>
    </div>
  )
}
