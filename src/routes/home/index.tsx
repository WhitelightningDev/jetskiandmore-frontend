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
  CalendarX2,
  Camera,
  BadgeCheck,
  MessageCircle,
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
import HeroWeatherCard from '@/components/HeroWeatherCard'
import { BOOKINGS_PAUSED_MESSAGE, BOOKINGS_PAUSED_TITLE, BOOKINGS_WHATSAPP_URL } from '@/lib/bookingStatus'
import { pickPrimaryBookingAction, useBookingControls } from '@/lib/bookingControls'

const GBAY_LAT = -34.165
const GBAY_LON = 18.866

export const Route = createFileRoute('/home/')({
  component: App,
})

function App() {
  const [ready] = React.useState(true)
  const { controls } = useBookingControls()
  const primary = pickPrimaryBookingAction(controls)
  const jetSkiClosed = !controls.jetSkiBookingsEnabled

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
    if (!primary.enabled) {
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
          Bookings closed
        </span>
      )
    }
    return (
      <Link to={primary.to} className={buttonVariants({ size, variant, className })}>
        {showIcon && <CalendarDays className={`mr-2 ${iconSize}`} />}
        {label}
      </Link>
    )
  }

  const jetSkiButton = ({
    label = 'Book jet skis',
    size = 'sm',
    variant,
    className,
  }: {
    label?: string
    size?: NonNullable<Parameters<typeof buttonVariants>[0]>['size']
    variant?: NonNullable<Parameters<typeof buttonVariants>[0]>['variant']
    className?: string
  }) => {
    const iconSize = size === 'lg' ? 'h-5 w-5' : 'h-4 w-4'
    if (jetSkiClosed) {
      return (
        <span
          className={buttonVariants({
            size,
            variant: variant ?? 'outline',
            className: cn('cursor-not-allowed select-none opacity-80', className),
          })}
          aria-disabled="true"
        >
          <CalendarX2 className={`mr-2 ${iconSize}`} />
          Jet ski bookings closed
        </span>
      )
    }
    return (
      <Link to="/Bookings" className={buttonVariants({ size, variant, className })}>
        <CalendarDays className={`mr-2 ${iconSize}`} />
        {label}
      </Link>
    )
  }

  const heroCopy = jetSkiClosed
    ? BOOKINGS_PAUSED_MESSAGE
    : 'Safety-first guided experiences with structured onboarding, briefing, and online booking.'
  return (
    <div className="bg-background">
      {/* HERO */}
      <section className="relative overflow-hidden bg-slate-950 text-white min-h-[640px] md:min-h-[720px]">
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

        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/25 via-slate-950/55 to-slate-950/80" aria-hidden />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 md:pt-10 lg:pt-12 pb-24 md:pb-28">
          {/* Hero nav (desktop only, homepage replaces the global header) */}
          <div className="hidden md:block">
            <div className="rounded-2xl border border-slate-200/60 bg-white/95 shadow-[0_18px_50px_-35px_rgba(0,0,0,0.65)] backdrop-blur">
              <div className="flex items-center justify-between gap-4 px-4 py-3">
                <Link to="/home" className="inline-flex items-center gap-3 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white ring-1 ring-slate-200 shadow-sm overflow-hidden">
                    <img src={jetskiLogo} alt="JetSki & More" className="h-8 w-8 object-contain" loading="eager" />
                  </span>
                  <span className="text-base font-semibold tracking-tight text-slate-900">Jet Ski &amp; More</span>
                </Link>

                <nav className="hidden md:flex items-center gap-2 rounded-full bg-slate-100 px-2 py-1 text-sm">
                  {[
                    { to: '/home', label: 'Home' },
                    { to: '/rides', label: 'Rides' },
                    { to: '/boat-ride', label: 'Boat rides' },
                    { to: '/safety', label: 'Safety' },
                    { to: '/contact', label: 'Contact' },
                  ].map((item) => (
                    <Link
                      key={item.to}
                      to={item.to as any}
                      className="rounded-full px-3 py-1.5 font-medium text-slate-600 hover:text-slate-900 transition-colors"
                      activeProps={{
                        className:
                          'rounded-full px-3 py-1.5 font-semibold bg-white text-slate-900 shadow-sm ring-1 ring-slate-200',
                      }}
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>

                <div className="flex items-center gap-2">
                  <a
                    href={BOOKINGS_WHATSAPP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={buttonVariants({
                      variant: 'outline',
                      size: 'sm',
                      className: 'bg-white text-slate-900 border-slate-200 hover:bg-slate-50',
                    })}
                  >
                    <MessageCircle className="mr-2 h-4 w-4" aria-hidden />
                    WhatsApp
                  </a>
                  {primary.enabled ? (
                    <Link
                      to={primary.to}
                      className={buttonVariants({
                        size: 'sm',
                        className: 'bg-sky-800 text-white hover:bg-sky-900 shadow-sm',
                      })}
                    >
                      {primary.to === '/boat-ride' ? 'Book a Boat Ride' : primary.label}
                    </Link>
                  ) : (
                    <span
                      className={buttonVariants({
                        size: 'sm',
                        variant: 'outline',
                        className: 'cursor-not-allowed select-none opacity-80 border-slate-200 text-slate-600',
                      })}
                      aria-disabled="true"
                    >
                      Bookings closed
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 md:mt-14 grid items-center gap-10 lg:grid-cols-12">
            <div className="lg:col-span-7 space-y-6">
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
                  Licensed Jet Ski Rides in Gordon&apos;s Bay Harbour
                </h1>
              </Reveal>

              <Reveal delay={220} offset={4} duration={900}>
                <p className="text-base md:text-xl text-slate-100/90 max-w-2xl">{heroCopy}</p>
              </Reveal>

              <Reveal delay={320} offset={4} duration={900}>
                <div className="flex flex-col sm:flex-row gap-3">
                  {bookingButton({
                    label: primary.to === '/boat-ride' ? 'Request a Boat Ride' : primary.label,
                    size: 'lg',
                    className: 'rounded-xl bg-sky-800 text-white hover:bg-sky-900 shadow-sm',
                    showIcon: false,
                  })}
                  <Link
                    to="/rides"
                    className={buttonVariants({
                      size: 'lg',
                      variant: 'outline',
                      className: 'rounded-xl border-white/20 bg-white/10 text-white hover:bg-white/15 hover:text-white',
                    })}
                  >
                    <Waves className="mr-2 h-5 w-5" />
                    See rides &amp; pricing
                  </Link>
                </div>
              </Reveal>

              <p className="text-xs sm:text-sm text-white/70 max-w-2xl">
                Structured onboarding, safety briefing, and clear operating zones — run by a professional team.
              </p>
            </div>

            <div className="hidden lg:block lg:col-span-5" aria-hidden />
          </div>

          {/* Hero stats strip */}
          <div className="mt-10 md:mt-12 rounded-2xl border border-white/10 bg-slate-950/35 backdrop-blur px-4 sm:px-6 py-4 shadow-[0_18px_60px_-45px_rgba(0,0,0,0.75)]">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {[
                { icon: <MapPin className="h-4 w-4" aria-hidden />, value: 'Gordon’s Bay Harbour', label: 'One location' },
                { icon: <ShieldCheck className="h-4 w-4" aria-hidden />, value: 'Safety briefing', label: 'Before every ride' },
                { icon: <CalendarDays className="h-4 w-4" aria-hidden />, value: 'Online booking', label: 'Fast checkout' },
                { icon: <Camera className="h-4 w-4" aria-hidden />, value: 'Photos / drone', label: 'Add‑ons available' },
                { icon: <BadgeCheck className="h-4 w-4" aria-hidden />, value: 'Since 2020', label: 'SAMSA certified' },
              ].map((item) => (
                <div key={item.value} className="flex items-center gap-3">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/10">
                    <span className="text-amber-300">{item.icon}</span>
                  </span>
                  <div className="leading-tight">
                    <p className="text-sm font-semibold text-white">{item.value}</p>
                    <p className="text-xs text-white/70">{item.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <svg
          className="pointer-events-none absolute bottom-0 left-0 z-0 w-full text-background"
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
      <section className="relative z-20 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mt-12 md:-mt-16 pb-10 md:pb-12">
        <HeroWeatherCard />
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16 space-y-12">
        <Reveal offset={4} duration={900}>
          <div
            id="why-ride-with-us"
            className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_30px_80px_-60px_rgba(15,23,42,0.35)]"
          >
            <div className="grid gap-8 p-6 md:p-10 lg:grid-cols-12 lg:gap-10">
              <div className="lg:col-span-4 space-y-4">
                <Badge className="w-fit bg-slate-900 text-white hover:bg-slate-900">Why ride with us</Badge>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900">
                  Proof-led, safety-first experiences in Gordon&apos;s Bay.
                </h2>
                <p className="text-sm md:text-base text-slate-600">
                  Search results already mention our launch point, safety briefings, and media add-ons — here&apos;s the
                  structure behind it. We&apos;ve been operating since 2020 with a guided format and repeatable onboarding.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Link to="/why-ride-with-us" className={buttonVariants({ size: 'sm' })}>
                    See the full breakdown
                  </Link>
                  <Link to="/safety" className={buttonVariants({ variant: 'outline', size: 'sm' })}>
                    Read safety requirements
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-8 grid gap-4 sm:grid-cols-2">
                {(
                  [
                    {
                      icon: <BadgeCheck className="h-5 w-5 text-primary" aria-hidden />,
                      title: 'Operating since 2020',
                      desc: 'A long-running, professional operation with documented procedures and trained staff.',
                    },
                    {
                      icon: <MapPin className="h-5 w-5 text-primary" aria-hidden />,
                      title: 'Gordon’s Bay Harbour',
                      desc: 'One reliable launch point with clear meeting instructions and predictable logistics.',
                    },
                    {
                      icon: <ShieldCheck className="h-5 w-5 text-primary" aria-hidden />,
                      title: 'Structured onboarding',
                      desc: 'Controls demo, riding zone rules, and a safety briefing before every session.',
                    },
                    {
                      icon: <Waves className="h-5 w-5 text-primary" aria-hidden />,
                      title: 'Guided ride format',
                      desc: 'Safety-led sessions with clear boundaries and support — ideal for first-timers.',
                    },
                    {
                      icon: <Camera className="h-5 w-5 text-primary" aria-hidden />,
                      title: 'Optional drone / GoPro',
                      desc: 'Add media extras to capture your ride (subject to conditions and availability).',
                    },
                    {
                      icon: <Users className="h-5 w-5 text-primary" aria-hidden />,
                      title: 'Family & tourist friendly',
                      desc: 'Simple process, clear guidance, and options for spectators via boat rides.',
                    },
                  ] as const
                ).map((p) => (
                  <div key={p.title} className="flex gap-3 rounded-2xl border border-slate-200 bg-slate-50/40 p-5">
                    <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/15">
                      {p.icon}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-900">{p.title}</p>
                      <p className="mt-1 text-sm text-slate-600">{p.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal offset={4} duration={900}>
          <Card className="border-emerald-100 bg-white shadow-[0_30px_80px_-60px_rgba(16,185,129,0.6)]">
            <CardHeader className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <Badge className="bg-emerald-50 text-emerald-800 border-emerald-200">Safety &amp; Compliance</Badge>
                <span className="text-xs text-slate-500">For customers • partners • authorities</span>
              </div>
              <CardTitle className="text-xl md:text-2xl text-slate-900">Commercial safety-led operating procedures</CardTitle>
              <CardDescription className="text-slate-600">
                We follow a repeatable briefing + onboarding process, with clear eligibility rules, safety equipment, and weather/sea-condition stop rules.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <ShieldCheck className="mt-0.5 h-4 w-4 text-emerald-700" />
                  Structured customer briefing process before every session
                </li>
                <li className="flex items-start gap-2">
                  <BadgeCheck className="mt-0.5 h-4 w-4 text-emerald-700" />
                  Ride onboarding steps, controls demo, and operating-zone briefing
                </li>
                <li className="flex items-start gap-2">
                  <LifeBuoy className="mt-0.5 h-4 w-4 text-emerald-700" />
                  Swim competency requirement and mandatory life jackets
                </li>
              </ul>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <Users className="mt-0.5 h-4 w-4 text-emerald-700" />
                  Operator requirements and minimum-age/supervision rules applied per experience
                </li>
                <li className="flex items-start gap-2">
                  <Wind className="mt-0.5 h-4 w-4 text-emerald-700" />
                  Weather and sea-condition rules (pause/reschedule when unsafe)
                </li>
                <li className="flex items-start gap-2">
                  <MapPin className="mt-0.5 h-4 w-4 text-emerald-700" />
                  Gordon&apos;s Bay Harbour operations only
                </li>
              </ul>
            </CardContent>
            <CardFooter className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap gap-2">
                <Link to="/safety" className={buttonVariants({ size: 'sm' })}>
                  Read Safety &amp; Compliance
                </Link>
                <Link to="/terms" className={buttonVariants({ size: 'sm', variant: 'outline' })}>
                  Terms &amp; policies
                </Link>
              </div>
              <Link to="/contact" className={buttonVariants({ size: 'sm', variant: 'ghost' })}>
                Partner enquiries
              </Link>
            </CardFooter>
          </Card>
        </Reveal>

        {/* ENTERPRISE INTRO (Below Hero) */}
        <div className="space-y-10">
          <Reveal direction="down" offset={4} duration={850}>
            <div className="flex flex-col items-center gap-4 text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Built for teams, events &amp; tour groups
              </p>
              <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-sm text-slate-500">
                <span className="inline-flex items-center gap-2">
                  <Users className="h-4 w-4" aria-hidden /> Corporate teams
                </span>
                <span className="inline-flex items-center gap-2">
                  <Gift className="h-4 w-4" aria-hidden /> Event planners
                </span>
                <span className="inline-flex items-center gap-2">
                  <Ship className="h-4 w-4" aria-hidden /> Boat ride add‑ons
                </span>
                <span className="inline-flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4" aria-hidden /> Safety‑first ops
                </span>
                <span className="inline-flex items-center gap-2">
                  <MapPin className="h-4 w-4" aria-hidden /> Gordon&apos;s Bay Harbour
                </span>
              </div>
            </div>
          </Reveal>

          <div className="grid items-start gap-10 lg:grid-cols-12">
            <Reveal offset={4} duration={900} className="lg:col-span-4">
              <div className="space-y-4">
                <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary ring-1 ring-primary/20">
                  Enterprise jet ski rentals
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Enterprise‑ready water experiences. Simple.</h2>
                <p className="text-sm md:text-base text-slate-600">
                  From quick thrill rides to group sessions (5+ people), we run a tight operation with clear comms,
                  safety‑first briefings, and options to add a boat ride for spectators.
                </p>
                <div className="flex flex-wrap gap-2">
                  {jetSkiButton({ label: 'Book jet skis', size: 'sm' })}
                  {controls.boatRideBookingsEnabled ? (
                    <Link to="/boat-ride" className={buttonVariants({ variant: 'outline', size: 'sm' })}>
                      Book a boat ride
                    </Link>
                  ) : null}
                </div>
                {jetSkiClosed ? (
                  <p className="text-sm text-slate-600">Jet ski online bookings are currently closed.</p>
                ) : null}
              </div>
            </Reveal>

            <div className="grid gap-6 sm:grid-cols-2 lg:col-span-8">
              {(
                [
                  {
                    icon: <Users className="h-5 w-5 text-primary" aria-hidden />,
                    title: 'Group capacity',
                    desc: 'Ideal for team days and events — including our 2 hr 30 min group sessions for 5+ people.',
                  },
                  {
                    icon: <ShieldCheck className="h-5 w-5 text-primary" aria-hidden />,
                    title: 'Safety‑first operations',
                    desc: 'On‑arrival safety briefing, life jackets, and a clearly marked riding zone.',
                  },
                  {
                    icon: <CalendarDays className="h-5 w-5 text-primary" aria-hidden />,
                    title: 'Fast scheduling',
                    desc: 'Book online when open, or message us for larger groups and tailored timeslots.',
                  },
                  {
                    icon: <MapPin className="h-5 w-5 text-primary" aria-hidden />,
                    title: 'Simple logistics',
                    desc: 'One location: Gordon’s Bay Harbour. Arrive 15 minutes early and we’ll handle the rest.',
                  },
                  {
                    icon: <Gift className="h-5 w-5 text-primary" aria-hidden />,
                    title: 'Add‑ons & extras',
                    desc: 'GoPro footage, wetsuits, and spectator boat rides to round out the experience.',
                  },
                  {
                    icon: <Ship className="h-5 w-5 text-primary" aria-hidden />,
                    title: 'Boat rides available',
                    desc: 'Book a False Bay boat ride as a stand‑alone outing or alongside your jet ski day.',
                  },
                ] as const
              ).map((f) => (
                <Reveal key={f.title} offset={4} duration={850}>
                  <div className="flex gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/15">
                      {f.icon}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-900">{f.title}</p>
                      <p className="mt-1 text-sm text-slate-600">{f.desc}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          <Reveal offset={4} duration={900}>
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-[#3f2b96] text-white shadow-[0_30px_80px_-55px_rgba(63,43,150,0.75)]">
              <div className="grid md:grid-cols-12">
                <div className="p-8 md:col-span-5 md:p-10">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/70">Enterprise enquiries</p>
                  <h3 className="mt-3 text-2xl md:text-3xl font-bold">Give us a shout</h3>
                  <p className="mt-3 text-white/85">
                    Tell us your group size, preferred dates, and whether you want to add a boat ride. We’ll confirm the
                    best plan and keep it simple.
                  </p>
                  <div className="mt-6 flex flex-wrap gap-2">
                    <Link
                      to="/contact"
                      className={buttonVariants({
                        size: 'sm',
                        className: 'bg-white text-slate-900 hover:bg-white/90',
                      })}
                    >
                      Contact us
                    </Link>
                  <Link
                    to="/boat-ride"
                    className={buttonVariants({
                      size: 'sm',
                      variant: 'outline',
                      className: 'border-white/40 text-white hover:bg-white/10',
                    })}
                  >
                    View boat rides
                  </Link>
                </div>
                {jetSkiClosed ? (
                  <p className="mt-4 text-sm text-white/80">Jet ski online bookings are currently closed.</p>
                ) : null}
                </div>
                <div className="relative md:col-span-7">
                  <img
                    src={harbourImg}
                    alt="Gordon’s Bay Harbour"
                    className="h-64 w-full object-cover md:h-full"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-gradient-to-l from-transparent via-[#3f2b96]/10 to-[#3f2b96]/55" aria-hidden />
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        {/* OFFER CARDS */}
        <div className="relative overflow-hidden rounded-3xl border border-primary/10 bg-gradient-to-b from-white via-white to-sky-50 shadow-[0_30px_90px_-50px_rgba(14,116,144,0.5)]">
          <div className="absolute -left-16 top-10 h-60 w-60 rounded-full bg-primary/15 blur-3xl" />
          <div className="absolute -right-20 bottom-12 h-72 w-72 rounded-full bg-sky-400/15 blur-3xl" />
          <div className="relative p-6 sm:p-8 lg:p-10">
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

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              <Reveal offset={4} duration={900}>
                <Card className="h-full flex flex-col rounded-2xl border border-slate-200/80 bg-white/90 shadow-[0_20px_50px_-30px_rgba(15,23,42,0.35)] backdrop-blur-sm hover:-translate-y-1 hover:shadow-[0_24px_70px_-40px_rgba(14,116,144,0.45)] transition-all">
                  <CardHeader className="pb-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <CardTitle className="flex items-center gap-2">
                        <Ship className="h-5 w-5 text-primary" />
                        30‑min Rental (1 Jet‑Ski)
                      </CardTitle>
                      <Badge variant="secondary" className="rounded-full">
                        Quick thrill
                      </Badge>
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
                    <Badge className="bg-emerald-600 text-white shadow-sm">From ZAR 1,488</Badge>
                    {bookingButton({ label: 'Select', size: 'sm', showIcon: false })}
                  </CardFooter>
                </Card>
              </Reveal>

              <Reveal delay={120} offset={4} duration={900}>
                <Card className="h-full flex flex-col rounded-2xl border border-slate-200/80 bg-white/90 shadow-[0_20px_50px_-30px_rgba(15,23,42,0.35)] backdrop-blur-sm hover:-translate-y-1 hover:shadow-[0_24px_70px_-40px_rgba(14,116,144,0.45)] transition-all">
                  <CardHeader className="pb-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <CardTitle className="flex items-center gap-2">
                        <Clock className="h-5 w-5 text-primary" />
                        60‑min Rental (1 Jet‑Ski)
                      </CardTitle>
                      <Badge variant="outline" className="rounded-full border-primary/30 text-primary">
                        Most booked
                      </Badge>
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
                    <Badge className="bg-emerald-600 text-white shadow-sm">From ZAR 2,210</Badge>
                    {bookingButton({ label: 'Select', size: 'sm', showIcon: false })}
                  </CardFooter>
                </Card>
              </Reveal>

              <Reveal delay={240} offset={4} duration={900}>
                <Card className="h-full flex flex-col rounded-2xl border border-amber-300/60 bg-gradient-to-br from-amber-50 via-white to-amber-100/70 shadow-[0_22px_60px_-38px_rgba(245,158,11,0.5)] hover:-translate-y-1 transition-all">
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
          <div className="relative p-6 sm:p-8 lg:p-10">
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
          <div className="relative p-6 sm:p-8 lg:p-10">
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

            <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] gap-6 items-stretch">
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
                        className="h-64 w-full object-cover sm:h-72"
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
                {jetSkiClosed ? BOOKINGS_PAUSED_TITLE : 'Ready to ride?'}
              </CardTitle>
              <CardDescription className="text-base md:text-lg text-slate-600">
                {jetSkiClosed
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
