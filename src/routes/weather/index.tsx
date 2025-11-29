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
    <div className="bg-gradient-to-b from-sky-50 via-white to-white">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-sky-100 via-white to-slate-50" />
        <div className="relative mx-auto max-w-6xl px-4 py-10 md:py-14">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-2">
              <Badge className="bg-white/70 text-sky-900 border-sky-200">Live &amp; forecast</Badge>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900">Weather tips for a great ride</h1>
              <p className="text-sm md:text-base text-slate-600 max-w-2xl">
                Check today’s wind and plan for the calmest window. We’ll guide you on the best slot when you arrive.
              </p>
            </div>
            <Badge variant="secondary" className="flex items-center gap-1 bg-white/80 text-slate-800 border-sky-200">
              <MapPin className="h-4 w-4" />
              Gordon&apos;s Bay Harbour
            </Badge>
          </div>
          <CurrentConditionsCard />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-10 md:pb-14">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Best times */}
          <Card className="relative overflow-hidden border-amber-200/80 bg-gradient-to-br from-amber-50 via-orange-50 to-orange-100/70">
            <div className="pointer-events-none absolute inset-0 opacity-15">
              <svg viewBox="0 0 320 200" className="w-full h-full">
                <defs>
                  <radialGradient id="sunrise" cx="25%" cy="25%" r="60%">
                    <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
                  </radialGradient>
                  <linearGradient id="horizon" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#fdba74" stopOpacity="0.7" />
                    <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <circle cx="80" cy="70" r="90" fill="url(#sunrise)" />
                <path d="M-10 150c40-25 110-25 150 0s90 25 140 0l40-25v100H-10Z" fill="url(#horizon)" />
              </svg>
            </div>
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
          <Card className="relative overflow-hidden border-sky-200/80 bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-100/60">
            <div className="pointer-events-none absolute inset-0 opacity-18">
              <svg viewBox="0 0 320 200" className="w-full h-full">
                <defs>
                  <linearGradient id="wave1" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.3" />
                  </linearGradient>
                  <linearGradient id="wave2" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#2563eb" stopOpacity="0.55" />
                    <stop offset="100%" stopColor="#1d4ed8" stopOpacity="0.35" />
                  </linearGradient>
                </defs>
                <path d="M-20 120c50-35 120-35 170 0s100 35 150 0v120H-20Z" fill="url(#wave1)" />
                <path d="M-30 160c40-25 100-25 140 0s90 25 140 0v80H-30Z" fill="url(#wave2)" />
              </svg>
            </div>
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
          <Card className="relative overflow-hidden border-slate-200/80 bg-gradient-to-br from-slate-50 via-slate-100 to-blue-100/50">
            <div className="pointer-events-none absolute inset-0 opacity-16">
              <svg viewBox="0 0 320 200" className="w-full h-full">
                <defs>
                  <linearGradient id="clouds" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#cbd5e1" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#e2e8f0" stopOpacity="0.6" />
                  </linearGradient>
                </defs>
                <ellipse cx="90" cy="90" rx="80" ry="45" fill="url(#clouds)" />
                <ellipse cx="190" cy="80" rx="90" ry="50" fill="url(#clouds)" />
                <ellipse cx="250" cy="110" rx="70" ry="40" fill="url(#clouds)" />
                <g fill="#60a5fa">
                  <circle cx="230" cy="155" r="10" />
                  <circle cx="255" cy="145" r="7" />
                  <circle cx="205" cy="168" r="9" />
                </g>
              </svg>
            </div>
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
          <Card className="relative overflow-hidden border-emerald-200/80 bg-gradient-to-br from-emerald-50 via-teal-50 to-blue-50/60">
            <div className="pointer-events-none absolute inset-0 opacity-16">
              <svg viewBox="0 0 320 200" className="w-full h-full">
                <defs>
                  <linearGradient id="shore" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#a7f3d0" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="#6ee7b7" stopOpacity="0.8" />
                  </linearGradient>
                </defs>
                <rect x="-10" y="120" width="340" height="90" fill="url(#shore)" />
                <circle cx="80" cy="70" r="22" fill="#22d3ee" />
                <circle cx="140" cy="60" r="18" fill="#2dd4bf" />
                <circle cx="210" cy="80" r="24" fill="#34d399" />
              </svg>
            </div>
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
