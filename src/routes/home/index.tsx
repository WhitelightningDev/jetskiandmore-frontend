import { createFileRoute } from '@tanstack/react-router'
import { Link } from '@tanstack/react-router'
import {
  Waves,
  CalendarDays,
  MapPin,
  Clock,
  ShieldCheck,
	  Shield,
	  Ship,
	  Star,
	  Users,
	  UserRound,
	  LifeBuoy,
	  Fish,
	  Cloud,
  CalendarX2,
  Camera,
  BadgeCheck,
  MessageCircle,
  Zap,
  Bike,
} from 'lucide-react'
import Reveal from '@/components/Reveal'

import { buttonVariants } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

import harbourImg from '@/lib/images/IMG_3202.jpg'
import jetskiLogo from '@/lib/images/JetSkiLogo.png'
import spectatorBoatImg from '@/lib/images/Spectatorboatride.png'
import goproImg from '@/lib/images/gopro-footage.png'
	import React from 'react'
	import { cn } from '@/lib/utils'
	import HeroWeatherCard from '@/components/HeroWeatherCard'
	import { BOOKINGS_PAUSED_MESSAGE, BOOKINGS_WHATSAPP_URL } from '@/lib/bookingStatus'
	import { pickPrimaryBookingAction, useBookingControls } from '@/lib/bookingControls'

export const Route = createFileRoute('/home/')({
  component: App,
})

function App() {
  const [ready] = React.useState(true)
  const { controls } = useBookingControls()
  const primary = pickPrimaryBookingAction(controls)
  const jetSkiClosed = !controls.jetSkiBookingsEnabled
  const boatRideClosed = !controls.boatRideBookingsEnabled
  const fishingClosed = !controls.fishingChartersBookingsEnabled

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

  const rideSelectButton = (rideId: string) => {
    const className = 'rounded-full bg-sky-900 text-white shadow-sm hover:bg-sky-950'
    if (jetSkiClosed) {
      return (
        <span
          className={buttonVariants({
            size: 'sm',
            className: `${className} cursor-not-allowed opacity-70 hover:bg-sky-900`,
          })}
          aria-disabled="true"
        >
          Select
        </span>
      )
    }

    return (
      <Link
        to="/Bookings"
        search={{ rideId }}
        className={buttonVariants({
          size: 'sm',
          className,
        })}
      >
        Select
      </Link>
    )
  }

  const ctaButton = ({ to, label }: { to: string; label: string }) => (
    <Link
      to={to as any}
      className={buttonVariants({
        size: 'sm',
        className: 'rounded-full bg-sky-900 text-white shadow-sm hover:bg-sky-950',
      })}
    >
      {label}
    </Link>
  )

  const heroCopy = jetSkiClosed
    ? BOOKINGS_PAUSED_MESSAGE
    : 'Safety-first guided experiences with structured onboarding, briefing, and online booking.'

  const popularExperiences = (() => {
    const cards: Array<{
      key: string
      image: { src: string; alt: string; badge?: string }
      kicker: { icon: React.ReactNode; label: string }
      title: string
      description: string
      footerLeft: string
      cta: React.ReactNode
    }> = []

    if (!jetSkiClosed) {
      cards.push({
        key: 'jetski-30',
        image: { src: '/Asunnydayofjetskiing.png', alt: '30-minute jet ski rental' },
        kicker: { icon: <Zap className="h-4 w-4 text-sky-900" aria-hidden />, label: 'QUICK THRILL' },
        title: '30‑min Rental',
        description:
          "Launch from Gordon's Bay Harbour and ride within the marked zone. Safety briefing and life jackets included.",
        footerLeft: 'From ZAR 1,488',
        cta: rideSelectButton('30-1'),
      })
      cards.push({
        key: 'jetski-60',
        image: { src: harbourImg, alt: '60-minute jet ski rental', badge: 'Popular' },
        kicker: { icon: <Clock className="h-4 w-4 text-sky-900" aria-hidden />, label: 'MOST BOOKED' },
        title: '60‑min Rental',
        description: 'More freedom on the water with the same safety‑first setup. Great for confident riders or pairs.',
        footerLeft: 'From ZAR 2,210',
        cta: rideSelectButton('60-1'),
      })
    } else {
      if (!boatRideClosed) {
        cards.push({
          key: 'boat-ride',
          image: { src: spectatorBoatImg, alt: 'False Bay boat ride', badge: 'Popular' },
          kicker: { icon: <Ship className="h-4 w-4 text-sky-900" aria-hidden />, label: 'BOAT RIDE' },
          title: 'False Bay Boat Ride',
          description: "Skippered boat ride from Gordon's Bay Harbour — great for groups, families, and spectators.",
          footerLeft: 'Requests open',
          cta: ctaButton({ to: '/boat-ride', label: 'Request' }),
        })
      }
      if (!fishingClosed) {
        cards.push({
          key: 'fishing',
          image: { src: harbourImg, alt: 'Fishing charters', badge: 'Popular' },
          kicker: { icon: <Fish className="h-4 w-4 text-sky-900" aria-hidden />, label: 'FISHING' },
          title: 'Fishing Charters',
          description: 'Half‑day and full‑day skippered trips with tackle and safety gear available.',
          footerLeft: 'From ZAR 4,900',
          cta: ctaButton({ to: '/fishing-charters', label: 'Enquire' }),
        })
      }
    }

    cards.push({
      key: 'addons',
      image: { src: goproImg, alt: 'Add-ons and extras', badge: 'Popular' },
      kicker: { icon: <Star className="h-4 w-4 text-sky-900" aria-hidden />, label: 'CUSTOMIZE' },
      title: 'Add‑ons & Extras',
      description: 'Drone video, GoPro footage, waterproof phone pouch, wetsuit hire, and spectator options.',
      footerLeft: 'From ZAR 150',
      cta: ctaButton({ to: '/add-ons', label: 'See options' }),
    })

    return cards.slice(0, 3)
  })()

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

        <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 pt-8 md:pt-10 lg:pt-12 pb-24 md:pb-28">
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

      <section className="w-full px-4 sm:px-6 lg:px-8 py-12 lg:py-16 space-y-12">
        <Reveal offset={4} duration={900}>
          <div
            id="why-ride-with-us"
            className="relative"
          >
            <div className="py-2 md:py-4">
              <p className="text-xs font-semibold tracking-[0.2em] text-sky-900">WHY RIDE WITH US</p>
              <h2 className="mt-3 max-w-3xl text-4xl md:text-5xl font-semibold font-serif tracking-tight text-slate-900">
                Proof-led, safety-first experiences in Gordon&apos;s Bay.
              </h2>
              <p className="mt-4 max-w-3xl text-sm md:text-base text-slate-600">
                We&apos;ve been operating since 2020 with a guided format, repeatable onboarding, and structured safety briefings.
              </p>

              <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {(
                  [
                    {
                      icon: <BadgeCheck className="h-5 w-5" aria-hidden />,
                      title: 'Operating since 2020',
                      desc: 'A long-running, professional operation with documented procedures and trained staff.',
                    },
                    {
                      icon: <MapPin className="h-5 w-5" aria-hidden />,
                      title: "Gordon's Bay Harbour",
                      desc: 'One reliable launch point with clear meeting instructions and predictable logistics.',
                    },
                    {
                      icon: <ShieldCheck className="h-5 w-5" aria-hidden />,
                      title: 'Structured onboarding',
                      desc: 'Controls demo, riding zone rules, and a safety briefing before every session.',
                    },
                    {
                      icon: <Waves className="h-5 w-5" aria-hidden />,
                      title: 'Guided ride format',
                      desc: 'Safety-led sessions with clear boundaries and support — ideal for first-timers.',
                    },
                    {
                      icon: <Camera className="h-5 w-5" aria-hidden />,
                      title: 'Optional drone / GoPro',
                      desc: 'Add media extras to capture your ride (subject to conditions and availability).',
                    },
                    {
                      icon: <Users className="h-5 w-5" aria-hidden />,
                      title: 'Family & tourist friendly',
                      desc: 'Simple process, clear guidance, and options for spectators via boat rides.',
                    },
                  ] as const
                ).map((p) => (
                  <div key={p.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 ring-1 ring-slate-200">
                      <span className="text-sky-800">{p.icon}</span>
                    </div>
                    <p className="text-base font-semibold text-slate-900">{p.title}</p>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">{p.desc}</p>
                  </div>
                ))}
              </div>

              <div className="mt-10 flex flex-wrap items-center gap-3">
                <Link to="/safety" className={buttonVariants({ variant: 'outline', size: 'sm', className: 'rounded-full bg-white' })}>
                  Read Safety Requirements
                </Link>
                <Link to="/why-ride-with-us" className={buttonVariants({ variant: 'ghost', size: 'sm', className: 'rounded-full text-sky-900' })}>
                  See the full breakdown
                </Link>
              </div>
            </div>
          </div>
        </Reveal>

        {/* OFFER CARDS */}
        <div className="-mx-4 sm:-mx-6 lg:-mx-8 bg-slate-50/70 px-4 sm:px-6 lg:px-8 py-12 space-y-8">
          <Reveal direction="down" offset={4} duration={850}>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-700">POPULAR EXPERIENCES</p>
                  <h2 className="text-4xl md:text-5xl font-semibold font-serif tracking-tight text-slate-900">
                    Choose your ride
                  </h2>
                  <p className="text-sm md:text-base text-slate-600 max-w-2xl">
                    Pick a session length or stack on extras.
                  </p>
                </div>
                <Link
                  to="/rides"
                  className={buttonVariants({
                    variant: 'outline',
                    size: 'sm',
                    className: 'rounded-full bg-white border-slate-200 shadow-sm',
                  })}
                >
                  View Full Lineup
                </Link>
              </div>
          </Reveal>

          <div
            className={cn(
              'grid grid-cols-1 gap-6',
              popularExperiences.length === 1 ? 'lg:grid-cols-1' : popularExperiences.length === 2 ? 'md:grid-cols-2' : 'md:grid-cols-2 lg:grid-cols-3',
            )}
          >
            {popularExperiences.map((card, idx) => (
              <Reveal key={card.key} delay={idx * 120} offset={4} duration={900}>
                <div className="flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                  <div className="relative h-56 w-full overflow-hidden">
                    <img
                      src={card.image.src}
                      alt={card.image.alt}
                      className="h-full w-full object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                    {card.image.badge ? (
                      <span className="absolute right-4 top-4 rounded-full bg-amber-400 px-3 py-1 text-xs font-semibold text-white shadow-sm">
                        {card.image.badge}
                      </span>
                    ) : null}
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-sky-900/70">
                      {card.kicker.icon}
                      {card.kicker.label}
                    </div>
                    <h3 className="mt-3 text-xl font-semibold text-slate-900">{card.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-slate-600">{card.description}</p>

                    <div className="mt-auto pt-6">
                      <div className="flex items-center justify-between border-t border-slate-200 pt-4">
                        <p className="text-base font-semibold text-sky-900">{card.footerLeft}</p>
                        {card.cta}
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

	        {/* SAFETY FIRST */}
	        <div className="-mx-4 sm:-mx-6 lg:-mx-8 bg-background px-4 sm:px-6 lg:px-8 py-14">
	          <div className="grid gap-10 lg:grid-cols-12 lg:items-start">
            <Reveal offset={4} duration={900} className="lg:col-span-6">
              <div className="space-y-6">
                <div className="space-y-4">
                  <span className="inline-flex w-fit rounded-sm bg-slate-200 px-2 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-sky-800">
                    Safety first
                  </span>
                  <h2 className="text-4xl md:text-5xl font-semibold font-serif tracking-tight text-slate-900">
                    Safety &amp; harbour info
                  </h2>
                  <p className="text-base text-slate-600 max-w-xl">
                    Clear guidelines, simple steps, and a single launch point so you know exactly what to expect.
                  </p>
                </div>

                <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-slate-100 shadow-sm">
                  <img
                    src={harbourImg}
                    alt="Gordon's Bay Harbour"
                    className="h-72 w-full object-cover md:h-80"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-slate-950/10 to-transparent" aria-hidden />
                  <div className="absolute bottom-5 left-5">
                    <p className="text-white text-base font-semibold">Gordon&apos;s Bay Harbour</p>
                    <p className="text-white/80 text-sm">Our only launch point</p>
                  </div>
                </div>

                <Link
                  to="/safety"
                  className={buttonVariants({
                    size: 'default',
                    className: 'w-fit rounded-full bg-sky-900 text-white hover:bg-sky-950 px-6 shadow-sm',
                  })}
                >
                  View Full Safety Guide
                </Link>
              </div>
            </Reveal>

            <Reveal offset={4} duration={900} delay={120} className="lg:col-span-6">
              <div className="grid gap-5 sm:grid-cols-2">
                {(
                  [
                    {
                      icon: UserRound,
                      title: 'Age & passengers',
                      desc: 'Minimum age 16 to drive (with guardian consent). Passengers: 8+.',
                    },
                    {
                      icon: Shield,
                      title: 'Briefing & zones',
                      desc: 'Briefing covers throttle control, safe distances, and no‑wake zones.',
                    },
                    {
                      icon: LifeBuoy,
                      title: 'Life jackets',
                      desc: 'Life jackets are mandatory and provided free for every rider and passenger.',
                    },
                    {
                      icon: Cloud,
                      title: 'Weather conditions',
                      desc: 'Weather can shift quickly; we may reschedule if conditions are unsafe.',
                    },
                    {
                      icon: Waves,
                      title: 'Swimming ability',
                      desc: 'If you cannot swim, you cannot operate a jet ski.',
                    },
                    {
                      icon: Bike,
                      title: 'Joy Rides',
                      desc: 'All Joy Rides are instructed rides — an instructor drives with the client seated behind.',
                    },
                  ] as const
                ).map((item) => (
                  <div key={item.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <item.icon className="h-5 w-5 text-sky-900" aria-hidden />
                    <p className="mt-4 text-base font-semibold text-slate-900">{item.title}</p>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.desc}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
	        </div>

        {/* GROUPS / ENTERPRISE (above footer) */}
        <div className="-mx-4 sm:-mx-6 lg:-mx-8 bg-sky-950 px-4 sm:px-6 lg:px-8 py-14 md:py-16">
          <div className="w-full">
            <div className="grid gap-10 lg:grid-cols-12 lg:items-start">
              <Reveal offset={4} duration={900} className="lg:col-span-6">
                <div className="space-y-6">
                  <div className="space-y-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-300">
                      Built for teams, events &amp; groups
                    </p>
                    <h2 className="text-4xl md:text-5xl font-semibold font-serif tracking-tight text-white">
                      Enterprise-ready water experiences.
                    </h2>
                    <p className="text-base leading-relaxed text-white/75 max-w-xl">
                      From quick thrill rides to group sessions, we run a tight operation with clear comms, safety-first
                      briefings, and options to add a boat ride for spectators.
                    </p>
                  </div>

                  <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-[0_18px_60px_-48px_rgba(0,0,0,0.8)]">
                    <p className="text-xl font-semibold text-white">Give us a shout</p>
                    <p className="mt-2 text-sm leading-relaxed text-white/70 max-w-xl">
                      Tell us your group size, preferred dates, and whether you want to add a boat ride. We&apos;ll
                      confirm the best plan.
                    </p>
                    <div className="mt-6 flex flex-wrap items-center gap-3">
                      <Link
                        to="/contact"
                        className={buttonVariants({
                          size: 'sm',
                          className: 'rounded-full bg-white text-sky-950 hover:bg-white/90 shadow-sm',
                        })}
                      >
                        Contact Us
                      </Link>
                      {controls.boatRideBookingsEnabled ? (
                        <Link
                          to="/boat-ride"
                          className={buttonVariants({
                            size: 'sm',
                            variant: 'outline',
                            className: 'rounded-full border-white/25 bg-white/10 text-white hover:bg-white/15 hover:text-white',
                          })}
                        >
                          View Boat Rides
                        </Link>
                      ) : (
                        <span
                          className={buttonVariants({
                            size: 'sm',
                            variant: 'outline',
                            className: 'rounded-full cursor-not-allowed select-none opacity-60 border-white/20 bg-white/5 text-white',
                          })}
                          aria-disabled="true"
                        >
                          Boat rides closed
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Reveal>

              <Reveal offset={4} duration={900} delay={120} className="lg:col-span-6">
                <div className="grid gap-5 sm:grid-cols-2">
                  {(
                    [
                      {
                        icon: Users,
                        title: 'Group capacity',
                        desc: 'Ideal for team days and events — including 2.5 hr group sessions for 5+ people.',
                      },
                      {
                        icon: ShieldCheck,
                        title: 'Safety-first ops',
                        desc: 'On-arrival safety briefing, life jackets, and a clearly marked riding zone.',
                      },
                      {
                        icon: CalendarDays,
                        title: 'Fast scheduling',
                        desc: 'Book online when open, or message us for larger groups and tailored timeslots.',
                      },
                      {
                        icon: MapPin,
                        title: 'Simple logistics',
                        desc: "One location: Gordon's Bay Harbour. Arrive 15 minutes early.",
                      },
                      {
                        icon: Star,
                        title: 'Add-ons & extras',
                        desc: 'GoPro footage, wetsuits, and spectator boat rides.',
                      },
                      {
                        icon: Ship,
                        title: 'Boat rides available',
                        desc: 'Book a False Bay boat ride as a stand-alone outing.',
                      },
                    ] as const
                  ).map((item) => (
                    <div key={item.title} className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-sm">
                      <item.icon className="h-5 w-5 text-amber-300" aria-hidden />
                      <p className="mt-4 text-base font-semibold text-white">{item.title}</p>
                      <p className="mt-2 text-sm leading-relaxed text-white/70">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
