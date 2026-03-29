import * as React from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import {
  BadgeCheck,
  ClipboardList,
  CloudSun,
  LifeBuoy,
  MapPin,
  ShieldCheck,
  UserCheck,
  Wind,
} from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { pickPrimaryBookingAction, useBookingControls } from '@/lib/bookingControls'

export const Route = createFileRoute('/safety/')({
  component: RouteComponent,
})

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2 text-sm text-muted-foreground">
      <span className="mt-[7px] h-1.5 w-1.5 rounded-full bg-emerald-600/70" aria-hidden />
      <span>{children}</span>
    </li>
  )
}

function Step({ n, title, desc }: { n: number; title: string; desc: string }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm">
      <span className="mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-emerald-800 border border-emerald-100 text-sm font-semibold">
        {n}
      </span>
      <div className="space-y-1">
        <p className="text-sm font-semibold text-slate-900">{title}</p>
        <p className="text-sm text-slate-600">{desc}</p>
      </div>
    </div>
  )
}

function RouteComponent() {
  React.useEffect(() => {
    if (typeof document !== 'undefined') {
      document.title = 'Safety & Compliance | Jet Ski & More'
    }
  }, [])

  const { controls } = useBookingControls()
  const primary = pickPrimaryBookingAction(controls)

  return (
    <div className="bg-gradient-to-b from-emerald-50 via-white to-white">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-50 via-white to-cyan-50" />
        <div className="relative mx-auto max-w-6xl px-4 py-10 md:py-14">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-2">
              <Badge className="bg-white/80 text-emerald-800 border-emerald-200">Safety &amp; Compliance</Badge>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900">Safety &amp; Compliance</h1>
              <p className="text-sm md:text-base text-slate-600 max-w-2xl">
                This page is a factual overview of our operating procedures, designed around commercial safety requirements — for customers,
                tourism partners, and authorities.
              </p>
            </div>
            <Badge variant="secondary" className="flex items-center gap-1 bg-white/80 text-slate-800 border-emerald-200">
              <MapPin className="h-4 w-4" />
              Gordon&apos;s Bay Harbour
            </Badge>
          </div>

          <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-emerald-100 bg-white/80 p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 border border-emerald-100">
                <ShieldCheck className="h-5 w-5 text-emerald-700" />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">SAMSA certified</p>
                <p className="text-sm text-slate-700 max-w-2xl">
                  Registered with the South African Maritime Safety Authority with certified skippers supervising every launch and recovery.
                </p>
              </div>
            </div>
            <img
              src="/samsa-logo.png"
              alt="South African Maritime Safety Authority"
              className="h-12 w-auto object-contain drop-shadow-sm"
            />
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <Card className="lg:col-span-7">
              <CardHeader className="space-y-2">
                <CardTitle className="flex items-center gap-2">
                  <ClipboardList className="h-5 w-5 text-emerald-700" />
                  Structured briefing &amp; onboarding
                </CardTitle>
                <CardDescription>Every session follows a repeatable, safety-led process.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3">
                <Step n={1} title="Check-in & verification" desc="Confirm booking details, rider count, and any special notes or needs." />
                <Step n={2} title="Rider suitability checks" desc="Confirm basic swim competency and ability to understand and follow instructions." />
                <Step n={3} title="Gear fitting" desc="Fit life jackets and check correct sizing before heading to the launch area." />
                <Step n={4} title="Controls & kill-switch demo" desc="Explain throttle, steering, stopping distance, and mandatory kill-switch lanyard use." />
                <Step n={5} title="Operating area briefing" desc="Explain harbour rules, right-of-way basics, and the marked riding zone boundaries." />
                <Step n={6} title="Safe launch & recovery" desc="Crew supervises launch, return, and dock procedures to reduce collision and slip risks." />
              </CardContent>
              <CardFooter className="flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs text-muted-foreground">Operating procedures designed around commercial safety requirements.</span>
                {primary.enabled ? (
                  <Link to={primary.to}>
                    <Button size="sm">View booking options</Button>
                  </Link>
                ) : (
                  <Link to="/contact">
                    <Button size="sm" variant="outline">Contact us</Button>
                  </Link>
                )}
              </CardFooter>
            </Card>

            <Card className="lg:col-span-5">
              <CardHeader className="space-y-2">
                <CardTitle className="flex items-center gap-2">
                  <UserCheck className="h-5 w-5 text-emerald-700" />
                  Rider requirements
                </CardTitle>
                <CardDescription>Eligibility, conduct, and competency expectations.</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <Bullet>Swim competency is required. Life jackets are mandatory, but they are not a substitute for basic comfort in water.</Bullet>
                  <Bullet>Minimum age and supervision rules apply per experience. We may request ID and/or allocate an assisted option where appropriate.</Bullet>
                  <Bullet>No alcohol or drugs before or during a session.</Bullet>
                  <Bullet>Riders must be able to follow instructions; we may refuse service if safety can’t be assured.</Bullet>
                  <Bullet>Disclose relevant medical conditions that could affect safety in open water.</Bullet>
                </ul>
              </CardContent>
              <CardFooter className="flex flex-wrap items-center justify-between gap-3">
                <Link to="/terms">
                  <Button size="sm" variant="outline">Terms &amp; policies</Button>
                </Link>
                <Link to="/contact">
                  <Button size="sm" variant="ghost">Ask a question</Button>
                </Link>
              </CardFooter>
            </Card>
          </div>

          <Separator className="my-8" />

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Card>
              <CardHeader className="space-y-2">
                <CardTitle className="flex items-center gap-2">
                  <LifeBuoy className="h-5 w-5 text-emerald-700" />
                  Safety equipment &amp; controls
                </CardTitle>
                <CardDescription>What we use to reduce risk during normal operations.</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <Bullet>Life jackets provided and required for riders and passengers.</Bullet>
                  <Bullet>Mandatory kill-switch lanyard use for operators.</Bullet>
                  <Bullet>Clearly defined riding zone guidance to reduce traffic conflict.</Bullet>
                  <Bullet>Supervision by certified skippers during launch, riding windows, and recovery.</Bullet>
                  <Bullet>Commercial safety checklists and briefings before each session.</Bullet>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="space-y-2">
                <CardTitle className="flex items-center gap-2">
                  <CloudSun className="h-5 w-5 text-emerald-700" />
                  Weather &amp; sea-condition rules
                </CardTitle>
                <CardDescription>We actively monitor conditions and adjust operations.</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <Bullet>Conditions are reviewed throughout the day and before launches.</Bullet>
                  <Bullet>Strong South‑East (SE) winds above ~30&nbsp;km/h can make Gordon’s Bay rough and unsafe — we may pause, shorten, or reschedule.</Bullet>
                  <Bullet>If conditions are unsafe, safety overrides schedules and refunds/reschedules are handled case-by-case.</Bullet>
                </ul>
              </CardContent>
              <CardFooter className="flex flex-wrap items-center justify-between gap-3">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge variant="outline" className="cursor-help flex items-center gap-1">
                        <Wind className="h-3.5 w-3.5" />
                        Why wind matters
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      Strong onshore SE wind builds short, steep waves that reduce control and visibility.
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <Link to="/weather">
                  <Button variant="outline" size="sm">Weather guidance</Button>
                </Link>
              </CardFooter>
            </Card>
          </div>

          <Separator className="my-8" />

          <Card className="border-emerald-100/80 bg-white shadow-sm">
            <CardHeader className="space-y-2">
              <CardTitle className="flex items-center gap-2">
                <BadgeCheck className="h-5 w-5 text-emerald-700" />
                Operating procedures (commercial safety-led)
              </CardTitle>
              <CardDescription>How we run the day-to-day operation to stay consistent and accountable.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-2">
              <ul className="space-y-2">
                <Bullet>Pre-ride briefing and controls demo before every session.</Bullet>
                <Bullet>Rider suitability checks and safety rule acknowledgement.</Bullet>
                <Bullet>Time-slot scheduling to reduce congestion and rushed launches.</Bullet>
                <Bullet>Supervised launch and recovery to reduce dock/harbour incidents.</Bullet>
              </ul>
              <ul className="space-y-2">
                <Bullet>Weather monitoring and conservative stop/reschedule rules.</Bullet>
                <Bullet>Incident response process and escalation to medical/emergency services when needed.</Bullet>
                <Bullet>Ongoing improvement: procedures reviewed based on observations and feedback.</Bullet>
                <Bullet>Safety-first enforcement: sessions may be stopped if rules are ignored.</Bullet>
              </ul>
            </CardContent>
            <CardFooter className="flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs text-muted-foreground">We operate only from Gordon&apos;s Bay Harbour.</span>
              <Link to="/contact">
                <Button size="sm">Partner / authority enquiries</Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </section>
    </div>
  )
}
