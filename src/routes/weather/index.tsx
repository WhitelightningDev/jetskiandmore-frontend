import { createFileRoute, Link } from '@tanstack/react-router'
import { Wind, Sun, CloudRain, Waves, Info, MapPin, CalendarDays, Umbrella } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

// Live conditions for Gordon's Bay via Open-Meteo (no API key, CORS-friendly)
// Coords: ~-34.165, 18.866 (Gordon's Bay Harbour)

type Conditions = {
  loading: boolean
  error?: string
  temperature?: number
  windSpeed?: number
  windGusts?: number
  precipitation?: number
}

function severityFromWind(windSpeed?: number, windGusts?: number): 'bad' | 'ok' | 'good' {
  const s = windSpeed ?? 0
  const g = windGusts ?? 0
  // Tune thresholds for small craft comfort
  if (s >= 25 || g >= 35) return 'bad'
  if (s >= 12 || g >= 20) return 'ok'
  return 'good'
}

function severityClasses(sev: 'bad' | 'ok' | 'good') {
  if (sev === 'bad') return 'bg-gradient-to-r from-rose-50 to-rose-100 border-rose-200'
  if (sev === 'ok') return 'bg-gradient-to-r from-amber-50 to-amber-100 border-amber-200'
  return 'bg-gradient-to-r from-emerald-50 to-emerald-100 border-emerald-200'
}

function CurrentConditionsCard() {
  const [cond, setCond] = useState<Conditions>({ loading: true })

  useEffect(() => {
    const ac = new AbortController()
    const url = 'https://api.open-meteo.com/v1/forecast?latitude=-34.165&longitude=18.866&current=temperature_2m,wind_speed_10m,wind_gusts_10m,precipitation&timezone=Africa%2FJohannesburg'
    fetch(url, { signal: ac.signal })
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return r.json()
      })
      .then((j) => {
        const c = j.current || {}
        setCond({
          loading: false,
          temperature: typeof c.temperature_2m === 'number' ? c.temperature_2m : undefined,
          windSpeed: typeof c.wind_speed_10m === 'number' ? c.wind_speed_10m : undefined,
          windGusts: typeof c.wind_gusts_10m === 'number' ? c.wind_gusts_10m : undefined,
          precipitation: typeof c.precipitation === 'number' ? c.precipitation : undefined,
        })
      })
      .catch((e) => {
        if (e.name === 'AbortError') return
        setCond((prev) => ({ ...prev, loading: false, error: e.message || 'Failed to load weather' }))
      })
    return () => ac.abort()
  }, [])

  const sev = severityFromWind(cond.windSpeed, cond.windGusts)

  return (
    <Card className={`border mb-4 ${severityClasses(sev)}`}>
      <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Sun className="h-5 w-5" />
            Today’s conditions
          </CardTitle>
          <CardDescription>Live snapshot for Gordon's Bay Harbour</CardDescription>
        </div>
        <Badge variant="outline" className="capitalize">
          {sev === 'good' ? 'good' : sev}
        </Badge>
      </CardHeader>
      <CardContent>
        {cond.loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="h-12 rounded-md bg-muted animate-pulse" />
            <div className="h-12 rounded-md bg-muted animate-pulse" />
            <div className="h-12 rounded-md bg-muted animate-pulse" />
            <div className="h-12 rounded-md bg-muted animate-pulse" />
          </div>
        ) : cond.error ? (
          <div className="text-sm text-destructive">{cond.error}</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2 text-sm p-3 rounded-md border bg-background">
              <Sun className="h-4 w-4" />
              <div>
                <div className="text-muted-foreground">Temp</div>
                <div className="font-medium">{cond.temperature?.toFixed(0)}°C</div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm p-3 rounded-md border bg-background">
              <Wind className="h-4 w-4" />
              <div>
                <div className="text-muted-foreground">Wind</div>
                <div className="font-medium">{cond.windSpeed?.toFixed(0)} km/h</div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm p-3 rounded-md border bg-background">
              <Wind className="h-4 w-4 rotate-12" />
              <div>
                <div className="text-muted-foreground">Gusts</div>
                <div className="font-medium">{cond.windGusts?.toFixed(0)} km/h</div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm p-3 rounded-md border bg-background">
              <CloudRain className="h-4 w-4" />
              <div>
                <div className="text-muted-foreground">Precip</div>
                <div className="font-medium">{(cond.precipitation ?? 0).toFixed(1)} mm</div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground">
        Updated for the current hour. Thresholds tuned for rider comfort.
      </CardFooter>
    </Card>
  )
}

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
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-3xl md:text-4xl font-bold">Weather tips for a great ride</h1>
          <Badge variant="secondary" className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            Gordon&apos;s Bay Harbour
          </Badge>
        </div>

        <CurrentConditionsCard />
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
            <CardFooter className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <span className="text-xs text-muted-foreground">Ask us for the day’s sweet spot.</span>
              <Link to="/weather/calm-slots">
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
            <CardFooter className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
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
            <CardFooter className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
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
            <CardFooter className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
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
          <CardFooter className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
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
