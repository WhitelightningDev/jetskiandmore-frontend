
import { createFileRoute, Link } from '@tanstack/react-router'
import { Wind, Sun, CloudRain, Waves, Info, MapPin, CalendarDays, Umbrella } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

export const Route = createFileRoute('/weather/')({
  component: RouteComponent,
})

function Bullet({ children }: { children: React.ReactNode }) {
  return <p className="text-sm text-muted-foreground">• {children}</p>
}

function RouteComponent() {
  return (
    <div className="bg-white">
      <section className="mx-auto max-w-6xl px-4 py-10 md:py-14">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl md:text-4xl font-bold">Weather tips for a great ride</h1>
          <Badge variant="secondary" className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            Gordon&apos;s Bay Harbour
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Best times */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sun className="h-5 w-5" />
                Best time windows
              </CardTitle>
              <CardDescription>When the bay is usually calmest</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Bullet><strong>Early mornings</strong> are typically smoother before daily winds pick up.</Bullet>
              <Bullet><strong>Late afternoons</strong> can also be good on lower‑wind days.</Bullet>
              <Bullet>We recommend choosing a slot when forecast wind speeds are in a comfortable range for you.</Bullet>
            </CardContent>
            <CardFooter className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Ask us for the day’s sweet spot.</span>
              <Link to="/Bookings">
                <Button size="sm" className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4" />
                  Book a calm slot
                </Button>
              </Link>
            </CardFooter>
          </Card>

          {/* Wind & swell */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wind className="h-5 w-5" />
                Wind &amp; swell basics
              </CardTitle>
              <CardDescription>Comfort and control improve as wind drops</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Bullet>Higher wind speeds create choppier water and shorter, steeper waves.</Bullet>
              <Bullet>On stronger wind days we keep you within the most sheltered parts of the bay.</Bullet>
              <Bullet>We’ll brief you on riding posture and throttle control for bumpy water.</Bullet>
            </CardContent>
            <CardFooter className="flex items-center justify-between">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge variant="outline" className="cursor-help flex items-center gap-1">
                      <Info className="h-3.5 w-3.5" />
                      Tip
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    Keep a relaxed bend in your knees and stand slightly when crossing chop.
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <Link to="/safety">
                <Button variant="outline" size="sm">Safety &amp; rider tips</Button>
              </Link>
            </CardFooter>
          </Card>

          {/* Rain & visibility */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CloudRain className="h-5 w-5" />
                Rain &amp; visibility
              </CardTitle>
              <CardDescription>We’re weather‑flexible</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Bullet>Light rain isn’t a problem, but heavy rain or poor visibility may pause rides.</Bullet>
              <Bullet>We continually assess the harbour and sea state before and during sessions.</Bullet>
            </CardContent>
            <CardFooter className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">We’ll only launch when it’s safe and fun.</span>
              <Link to="/contact">
                <Button variant="ghost" size="sm">Ask about today</Button>
              </Link>
            </CardFooter>
          </Card>

          {/* What to bring */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Umbrella className="h-5 w-5" />
                What to bring
              </CardTitle>
              <CardDescription>Be ready for changing conditions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Bullet>Sunscreen, sunglasses with a strap, and a towel.</Bullet>
              <Bullet>Swimwear or a light wetsuit on cooler/windy days.</Bullet>
              <Bullet>We provide life jackets for all riders and passengers.</Bullet>
            </CardContent>
            <CardFooter className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Arrive 15 minutes early to gear up.</span>
              <Link to="/Bookings">
                <Button size="sm">Pick a time</Button>
              </Link>
            </CardFooter>
          </Card>
        </div>

        <Separator className="my-8" />

        {/* If conditions change */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Waves className="h-5 w-5" />
              If conditions change
            </CardTitle>
            <CardDescription>Simple rescheduling when the wind kicks up</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Bullet>Your safety comes first — we may delay or move sessions if wind and swell get unsafe.</Bullet>
            <Bullet>If you need to adjust your booking, let us know at least 24 hours ahead and we’ll find another slot.</Bullet>
          </CardContent>
          <CardFooter className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">We’ll guide you to the best window on the day.</span>
            <Link to="/Bookings">
              <Button size="sm" className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4" />
                Reschedule help
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </section>
    </div>
  )
}
