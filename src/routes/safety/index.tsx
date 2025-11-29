import { createFileRoute, Link } from '@tanstack/react-router'
import { ShieldCheck, MapPin, CalendarDays, Wind, Info, LifeBuoy as Buoy } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'

export const Route = createFileRoute('/safety/')({
  component: RouteComponent,
})

function Bullet({ children }: { children: React.ReactNode }) {
  return <p className="text-sm text-muted-foreground">• {children}</p>
}

function RouteComponent() {
  return (
    <div className="bg-gradient-to-b from-emerald-50 via-white to-white">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-50 via-white to-cyan-50" />
        <div className="relative mx-auto max-w-6xl px-4 py-10 md:py-14">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-2">
              <Badge className="bg-white/80 text-emerald-800 border-emerald-200">Safety first</Badge>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900">Safety &amp; Rider Info</h1>
              <p className="text-sm md:text-base text-slate-600 max-w-2xl">
                Briefing, gear, and clear riding zones so every session stays safe and fun.
              </p>
            </div>
            <Badge variant="secondary" className="flex items-center gap-1 bg-white/80 text-slate-800 border-emerald-200">
              <MapPin className="h-4 w-4" />
              Gordon&apos;s Bay Harbour
            </Badge>
          </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* What we provide */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5" />
                What we provide before you ride
              </CardTitle>
              <CardDescription>Included with every session</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Bullet>A comprehensive safety briefing on arrival.</Bullet>
              <Bullet>A demo on using the throttle, steering and kill‑switch lanyard.</Bullet>
              <Bullet>Clear guidance on harbour rules, riding zones, and where you can / cannot go.</Bullet>
              <Bullet>Important tips for riding in open water.</Bullet>
              <Bullet>Life jackets for every rider and passenger — at no extra cost.</Bullet>
            </CardContent>
            <CardFooter className="flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs text-muted-foreground">Professional team focused on fun &amp; safety.</span>
              <Link to="/Bookings">
                <Button size="sm" className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4" />
                  Book now
                </Button>
              </Link>
            </CardFooter>
          </Card>

          {/* Weather policy */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wind className="h-5 w-5" />
                Weather &amp; sea conditions
              </CardTitle>
              <CardDescription>We actively monitor conditions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Bullet>We check wind and swell throughout the day and before every launch.</Bullet>
              <Bullet>Strong South‑East (SE) winds above ~30&nbsp;km/h can make Gordon’s Bay rough and unsafe — we may pause or reschedule riding during these periods.</Bullet>
              <Bullet>Your safety comes first — we’ll guide you on the best time windows to ride.</Bullet>
            </CardContent>
            <CardFooter className="flex flex-wrap items-center justify-between gap-3">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge variant="outline" className="cursor-help flex items-center gap-1">
                      <Info className="h-3.5 w-3.5" />
                      Why wind matters
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    Strong onshore SE wind builds short, steep waves in the bay that reduce control and visibility.
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <Link to="/weather">
                <Button variant="outline" size="sm">View weather tips</Button>
              </Link>
            </CardFooter>
          </Card>

          {/* Who can ride */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Buoy className="h-5 w-5" />
                Who can ride?
              </CardTitle>
              <CardDescription>Options for all confidence levels</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Bullet>Confident riders can rent and ride within our marked zone after the briefing.</Bullet>
              <Bullet>New to jet skis? Choose a guided pace with our team keeping you in the safe zones.</Bullet>
              <Bullet>Under‑aged or prefer not to drive? Our short Joy Ride lets you experience the thrill with an instructor.</Bullet>
            </CardContent>
            <CardFooter className="flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs text-muted-foreground">Talk to us if you have any questions.</span>
              <Link to="/contact">
                <Button variant="ghost" size="sm">Chat to the team</Button>
              </Link>
            </CardFooter>
          </Card>

          {/* Location & map */}
          <Card>
            <CardHeader>
              <CardTitle>Where we launch</CardTitle>
              <CardDescription>We operate only from Gordon&apos;s Bay Harbour</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <span className="flex items-center gap-2"><MapPin className="h-4 w-4" /> 159 Beach Road, Gordon&apos;s Bay Harbour</span>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="sm">View map</Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <div className="text-sm">Map embed placeholder</div>
                  </PopoverContent>
                </Popover>
              </div>
            </CardContent>
            <CardFooter className="flex flex-wrap items-center justify-between gap-3">
              <Link to="/Bookings">
                <Button size="sm">Book now</Button>
              </Link>
            </CardFooter>
          </Card>
        </div>

        <Separator className="my-8" />

        {/* FAQs / Policies */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>What to bring</CardTitle>
              <CardDescription>Make the most of your session</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Bullet>Swimwear or wetsuit (optional). We have life jackets on site.</Bullet>
              <Bullet>Sunscreen and sunglasses with a strap.</Bullet>
              <Bullet>A towel and a change of clothes.</Bullet>
              <Bullet>Arrive 15 minutes early to complete briefing and gear up.</Bullet>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Rescheduling &amp; cancellations</CardTitle>
              <CardDescription>Be weather‑flexible</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Bullet>If weather turns unsafe, we’ll help you move your booking to the next suitable slot.</Bullet>
              <Bullet>If you need to change your time, please contact us at least 24 hours beforehand and we’ll accommodate you where possible.</Bullet>
            </CardContent>
            <CardFooter className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Full details provided during checkout.</span>
              <Link to="/contact">
                <Button variant="outline" size="sm">Contact us</Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
        </div>
      </section>
    </div>
  )
}
