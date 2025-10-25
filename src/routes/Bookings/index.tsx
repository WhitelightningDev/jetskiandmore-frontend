import * as React from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { CalendarDays, Clock, Users, Gift, MapPin, Info, Wind, Thermometer, CloudSun } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Button, buttonVariants } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'

export const Route = createFileRoute('/Bookings/')({
  component: RouteComponent,
})

type Ride = {
  id: string
  title: string
  subtitle: string
  price: number
  displayPrice: string
  icon: React.ReactNode
}

const RIDES: Ride[] = [
  {
    id: '30-1',
    title: '30‑min Rental (1 Jet‑Ski)',
    subtitle: 'Quick burst of fun',
    price: 1750,
    displayPrice: 'From ZAR 1,750',
    icon: <Clock className="h-4 w-4" />,
  },
  {
    id: '60-1',
    title: '60‑min Rental (1 Jet‑Ski)',
    subtitle: 'Extra time to explore',
    price: 2600,
    displayPrice: 'From ZAR 2,600',
    icon: <Clock className="h-4 w-4" />,
  },
  {
    id: '30-2',
    title: '30‑min Rental (2 Jet‑Skis)',
    subtitle: 'Ride together',
    price: 3100,
    displayPrice: 'From ZAR 3,100',
    icon: <Users className="h-4 w-4" />,
  },
  {
    id: '60-2',
    title: '60‑min Rental (2 Jet‑Skis)',
    subtitle: 'Double the fun, more time',
    price: 4800,
    displayPrice: 'From ZAR 4,800',
    icon: <Users className="h-4 w-4" />,
  },
  {
    id: 'joy',
    title: 'Joy Ride (Instructed) • 10 min',
    subtitle: 'Instructor drives / assisted',
    price: 700,
    displayPrice: 'ZAR 700',
    icon: <Gift className="h-4 w-4" />,
  },
  {
    id: 'group',
    title: 'Group Session • 2 hr 30 min',
    subtitle: 'For 5+ people (events & teams)',
    price: 7500,
    displayPrice: 'From ZAR 7,500',
    icon: <Users className="h-4 w-4" />,
  },
]

// --- Add-on pricing rules ---
const FREE_DRONE_RIDE_ID = '60-2' // 2 Jet-Skis • 60 min
const DRONE_PRICE = 700
const WETSUIT_PRICE = 150
const BOAT_PRICE_PER_PERSON = 450
const EXTRA_PERSON_PRICE = 350

function formatZAR(n: number) {
  try {
    return new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR', maximumFractionDigits: 0 }).format(n)
  } catch {
    return `ZAR ${n.toFixed(0)}`
  }
}

function toBool(v: unknown) {
  return v === true || v === 'true' || v === '1' || v === 1
}

function toInt(v: unknown, fallback: number) {
  const n = typeof v === 'string' ? parseInt(v, 10) : typeof v === 'number' ? Math.floor(v) : NaN
  return Number.isFinite(n) && n > 0 ? n : fallback
}

function RouteComponent() {
  const search = Route.useSearch() as Partial<{
    rideId: string
    drone: unknown
    wetsuit: unknown
    gopro: unknown
    boat: unknown
    boatCount: unknown
    extraPeople: unknown
  }>

  const [rideId, setRideId] = React.useState<string>(typeof search.rideId === 'string' ? search.rideId : '30-1')
  const [date, setDate] = React.useState<Date | undefined>(undefined)
  const [time, setTime] = React.useState<string>('')
  const [fullName, setFullName] = React.useState<string>('')
  const [email, setEmail] = React.useState<string>('')
  const [phone, setPhone] = React.useState<string>('')
  const [notes, setNotes] = React.useState<string>('')
  const [addons, setAddons] = React.useState<{ drone: boolean; gopro: boolean; wetsuit: boolean; boat: boolean; boatCount: number; extraPeople: number }>(
    {
      drone: toBool(search.drone),
      gopro: toBool(search.gopro),
      wetsuit: toBool(search.wetsuit),
      boat: toBool(search.boat),
      boatCount: toInt(search.boatCount, 1),
      extraPeople: Math.max(0, Math.min(2, toInt(search.extraPeople, 0))),
    },
  )

  // Limit additional passenger counts based on ride selection
  const maxExtraPeople = React.useMemo(() => {
    if (rideId === '30-1' || rideId === '60-1') return 1
    if (rideId === '30-2' || rideId === '60-2') return 2
    return 0
  }, [rideId])

  React.useEffect(() => {
    setAddons((a) => ({ ...a, extraPeople: Math.min(a.extraPeople, maxExtraPeople) }))
  }, [maxExtraPeople])

  const selectedRide = React.useMemo(() => RIDES.find(r => r.id === rideId) ?? RIDES[0], [rideId])
  const baseTotal = selectedRide?.price ?? 0

  // Add-on cost calculations
  const droneCost = addons.drone ? (rideId === FREE_DRONE_RIDE_ID ? 0 : DRONE_PRICE) : 0
  const wetsuitCost = addons.wetsuit ? WETSUIT_PRICE : 0
  const boatCost = addons.boat ? BOAT_PRICE_PER_PERSON * Math.max(1, addons.boatCount || 1) : 0
  const extraPeopleCost = (addons.extraPeople || 0) * EXTRA_PERSON_PRICE
  const goproCost = 0 // priced on request / not included in estimate
  const addonsTotal = droneCost + wetsuitCost + boatCost + extraPeopleCost + goproCost
  const estimatedTotal = baseTotal + addonsTotal

  // Current weather for Gordon's Bay via Open-Meteo
  type Weather = { temperature: number; wind: number; code: number; label: string } | null
  const [weather, setWeather] = React.useState<Weather>(null)
  React.useEffect(() => {
    const controller = new AbortController()
    ;(async () => {
      try {
        const lat = -34.157
        const lon = 18.884
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,wind_speed_10m,weather_code&timezone=Africa%2FJohannesburg&forecast_days=1`
        const res = await fetch(url, { signal: controller.signal })
        if (!res.ok) return
        const data = await res.json()
        const code = Number(data?.current?.weather_code ?? NaN)
        const label = weatherCodeToText(code)
        setWeather({
          temperature: Number(data?.current?.temperature_2m ?? NaN),
          wind: Number(data?.current?.wind_speed_10m ?? NaN),
          code,
          label,
        })
      } catch {}
    })()
    return () => controller.abort()
  }, [])

  function weatherCodeToText(code: number): string {
    const map: Record<number, string> = {
      0: 'Clear', 1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast',
      45: 'Fog', 48: 'Rime fog', 51: 'Light drizzle', 53: 'Drizzle', 55: 'Heavy drizzle',
      56: 'Freezing drizzle', 57: 'Freezing drizzle', 61: 'Light rain', 63: 'Rain', 65: 'Heavy rain',
      66: 'Freezing rain', 67: 'Freezing rain', 71: 'Light snow', 73: 'Snow', 75: 'Heavy snow',
      77: 'Snow grains', 80: 'Light showers', 81: 'Showers', 82: 'Heavy showers',
      85: 'Snow showers', 86: 'Heavy snow showers', 95: 'Thunderstorm', 96: 'Thunder w/ hail', 99: 'Thunder w/ hail',
    }
    return map[code] ?? 'Unknown'
  }

// Terms modal control
const [confirmOpen, setConfirmOpen] = React.useState(false)
const [ack, setAck] = React.useState(false)

function handleSubmit(e?: React.FormEvent) {
  if (e) e.preventDefault()
  const formattedDate = date ? date.toISOString().split('T')[0] : null
  // For now, just print to console. Hook this up to your backend or email action later.
  console.log({
    rideId, date: formattedDate, time, fullName, email, phone, notes, addons
  })
  alert('Thanks! We\'ve recorded your details. We\'ll confirm availability shortly.')
}

  return (
    <div className="bg-white">
      <section className="mx-auto max-w-6xl px-4 py-10 md:py-14">
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-3xl md:text-4xl font-bold">Book your ride</h1>
          <Badge variant="secondary" className="flex items-center gap-1 self-start">
            <MapPin className="h-4 w-4" />
            Gordon&apos;s Bay Harbour • Western Cape
          </Badge>
        </div>

        {/* Info pills */}
        <div className="mb-6 flex flex-wrap items-center gap-2">
          <Badge variant="secondary" className="rounded-full">Safety briefing included</Badge>
          <Badge variant="secondary" className="rounded-full">Life jackets included</Badge>
          <Badge variant="outline" className="rounded-full">Arrive 15 min early</Badge>
          <Badge variant="outline" className="rounded-full">Best: early mornings</Badge>
          <Badge variant="outline" className="rounded-full">Weather‑flexible</Badge>
          <Badge variant="outline" className="rounded-full">Gordon&apos;s Bay only</Badge>
          {rideId === FREE_DRONE_RIDE_ID ? (
            <Badge className="rounded-full">Drone footage included</Badge>
          ) : (
            <Badge className="rounded-full">Drone + {formatZAR(DRONE_PRICE)}</Badge>
          )}
          <Badge className="rounded-full">Wetsuit {formatZAR(WETSUIT_PRICE)}</Badge>
          {selectedRide?.title.includes('2 Jet‑Skis') ? (
            <Badge variant="secondary" className="rounded-full">2 Jet‑Skis</Badge>
          ) : (
            <Badge variant="secondary" className="rounded-full">Passenger optional</Badge>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Booking form */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5" />
                Your details &amp; preferred time
              </CardTitle>
              <CardDescription>We’ll confirm availability and get you riding</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={(e) => { e.preventDefault(); setConfirmOpen(true) }} className="space-y-6">
                {/* Ride selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="ride">Choose a ride</Label>
                    <Select value={rideId} onValueChange={setRideId}>
                      <SelectTrigger id="ride">
                        <SelectValue placeholder="Select a ride" />
                      </SelectTrigger>
                      <SelectContent>
                        {RIDES.map((r) => (
                          <SelectItem key={r.id} value={r.id}>
                            {r.title} — {r.displayPrice}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="date">Preferred date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button id="date" variant="outline" className="w-full justify-start font-normal">
                          <CalendarDays className="mr-2 h-4 w-4" />
                          {date ? date.toLocaleDateString('en-ZA', { year: 'numeric', month: 'short', day: 'numeric' }) : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={setDate}
                          disabled={(d) => d < new Date(new Date().setHours(0,0,0,0))}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time">Preferred time</Label>
                    <Input id="time" type="time" value={time} onChange={(e) => setTime(e.target.value)} required />
                  </div>
                </div>

                <Separator />

                {/* Contact */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full name</Label>
                    <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" inputMode="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="notes">Notes (optional)</Label>
                    <Textarea id="notes" placeholder="Any special requests or questions?" value={notes} onChange={(e: { target: { value: React.SetStateAction<string> } }) => setNotes(e.target.value)} />
                  </div>
                </div>

                <Separator />

                {/* Add-ons */}
                <div className="space-y-3">
                  <Label>Optional add‑ons</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <label className="flex items-center justify-between gap-2 rounded-md border p-3">
                      <div className="flex items-center gap-2">
                        <Checkbox checked={addons.drone} onCheckedChange={(v: any) => setAddons(a => ({ ...a, drone: Boolean(v) }))} />
                        <span className="text-sm">Drone video</span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {rideId === FREE_DRONE_RIDE_ID ? 'Included with 2 skis (60m)' : formatZAR(DRONE_PRICE)}
                      </span>
                    </label>
                    <label className="flex items-center justify-between gap-2 rounded-md border p-3">
                      <div className="flex items-center gap-2">
                        <Checkbox checked={addons.gopro} onCheckedChange={(v: any) => setAddons(a => ({ ...a, gopro: Boolean(v) }))} />
                        <span className="text-sm">GoPro footage</span>
                      </div>
                      <span className="text-xs text-muted-foreground">On request</span>
                    </label>
                    <label className="flex items-center justify-between gap-2 rounded-md border p-3">
                      <div className="flex items-center gap-2">
                        <Checkbox checked={addons.wetsuit} onCheckedChange={(v: any) => setAddons(a => ({ ...a, wetsuit: Boolean(v) }))} />
                        <span className="text-sm">Wetsuit hire</span>
                      </div>
                      <span className="text-xs text-muted-foreground">{formatZAR(WETSUIT_PRICE)}</span>
                    </label>
                    <div className="flex items-center justify-between gap-2 rounded-md border p-3">
                      <label className="flex items-center gap-2">
                        <Checkbox
                          checked={addons.boat}
                          onCheckedChange={(v: any) => setAddons((a) => ({ ...a, boat: Boolean(v) }))}
                        />
                        <span className="text-sm">Boat ride</span>
                      </label>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>R{BOAT_PRICE_PER_PERSON} pp</span>
                      <input
                        type="number"
                        min={1}
                        max={10}
                        value={addons.boatCount}
                        disabled={!addons.boat}
                        onChange={(e) => setAddons((a) => ({ ...a, boatCount: Math.max(1, Math.min(10, Number(e.target.value) || 1)) }))}
                        className="w-16 px-2 py-1 border rounded disabled:opacity-60"
                      />
                    </div>
                  </div>
                  {/* Additional passengers */}
                  <div className="flex items-center justify-between gap-2 rounded-md border p-3">
                    <div className="flex flex-col gap-1">
                      <span className="text-sm">Additional passenger(s)</span>
                      <span className="text-xs text-muted-foreground">R{EXTRA_PERSON_PRICE} each • Max {maxExtraPeople}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <input
                        type="number"
                        min={0}
                        max={maxExtraPeople}
                        value={addons.extraPeople || 0}
                        onChange={(e) => setAddons((a) => ({ ...a, extraPeople: Math.max(0, Math.min(maxExtraPeople, Number(e.target.value) || 0)) }))}
                        className="w-16 px-2 py-1 border rounded"
                      />
                    </div>
                  </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Drone footage is <strong>free</strong> for the <em>2 Jet‑Skis • 60 min</em> ride, otherwise {formatZAR(DRONE_PRICE)}. Wetsuit hire is {formatZAR(WETSUIT_PRICE)}. Boat ride costs R{BOAT_PRICE_PER_PERSON} per person. Additional passenger(s) cost R{EXTRA_PERSON_PRICE} each.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between pt-2">
                  <div className="text-xs text-muted-foreground flex items-center gap-2">
                    <Info className="h-4 w-4" />
                    By booking you acknowledge our safety briefing and weather policy.
                  </div>
                  <div className="flex gap-3">
                    <Link to="/safety" className={buttonVariants({ variant: 'outline' })}>Safety &amp; info</Link>
                    <Button type="submit">Request booking</Button>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Summary</CardTitle>
              <CardDescription>Review your selection</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Current weather snapshot */}
              <div className="rounded-md border p-3 flex items-center gap-4">
                <CloudSun className="h-5 w-5 text-primary" />
                {weather ? (
                  <div className="text-sm flex flex-wrap gap-x-4 gap-y-1">
                    <span className="font-medium">Current weather:</span>
                    <span className="text-muted-foreground">{weather.label}</span>
                    <span className="flex items-center gap-1"><Thermometer className="h-4 w-4" /> {Number.isFinite(weather.temperature) ? weather.temperature.toFixed(0) : '—'}°C</span>
                    <span className="flex items-center gap-1"><Wind className="h-4 w-4" /> {Number.isFinite(weather.wind) ? weather.wind.toFixed(0) : '—'} km/h</span>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">Fetching current weather for Gordon's Bay…</p>
                )}
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">{selectedRide.title}</p>
                <p className="text-xs text-muted-foreground">{selectedRide.subtitle}</p>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-muted-foreground">When</p>
                  <p className="font-medium">{date ? date.toLocaleDateString('en-ZA', { year: 'numeric', month: 'short', day: 'numeric' }) : '—'} {time && <span>• {time}</span>}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Location</p>
                  <p className="font-medium">Gordon&apos;s Bay Harbour</p>
                </div>
              </div>
              <Separator />
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Subtotal</span>
                  <span className="font-medium">{formatZAR(baseTotal)}</span>
                </div>
                {addons.drone || addons.wetsuit || addons.gopro || addons.boat || (addons.extraPeople || 0) > 0 ? (
                  <div className="space-y-1">
                    {addons.drone ? (
                      <div className="flex items-center justify-between text-sm">
                        <span>Drone video</span>
                        <span className="text-muted-foreground">{droneCost === 0 ? 'Included' : formatZAR(droneCost)}</span>
                      </div>
                    ) : null}
                    {addons.gopro ? (
                      <div className="flex items-center justify-between text-sm">
                        <span>GoPro footage</span>
                        <span className="text-muted-foreground">On request</span>
                      </div>
                    ) : null}
                    {addons.wetsuit ? (
                      <div className="flex items-center justify-between text-sm">
                        <span>Wetsuit hire</span>
                        <span className="text-muted-foreground">{formatZAR(wetsuitCost)}</span>
                      </div>
                    ) : null}
                    {addons.boat ? (
                      <div className="flex items-center justify-between text-sm">
                        <span>Boat ride × {Math.max(1, addons.boatCount || 1)}</span>
                        <span className="text-muted-foreground">{formatZAR(boatCost)}</span>
                      </div>
                    ) : null}
                    {(addons.extraPeople || 0) > 0 ? (
                      <div className="flex items-center justify-between text-sm">
                        <span>Additional passenger(s) × {addons.extraPeople}</span>
                        <span className="text-muted-foreground">{formatZAR(extraPeopleCost)}</span>
                      </div>
                    ) : null}
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Add‑ons total</span>
                      <span className="font-medium">{formatZAR(addonsTotal)}</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground">No add‑ons selected.</p>
                )}
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold">Estimated total</span>
                  <span className="font-semibold">{formatZAR(estimatedTotal)}</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">Prices subject to change. Final total confirmed on booking.</p>
            </CardContent>
            <CardFooter className="flex items-center justify-between">
              <Link to="/rides" className={buttonVariants({ variant: 'outline', size: 'sm' })}>See all rides</Link>
              <Link to="/weather" className={buttonVariants({ size: 'sm' })}>
                <CalendarDays className="mr-2 h-4 w-4" />
                Check weather tips
              </Link>
            </CardFooter>
          </Card>
        </div>

        <Separator className="my-8" />

        {/* Quick reference */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Where we launch
              </CardTitle>
              <CardDescription>Gordon&apos;s Bay Harbour only</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Please arrive 15 minutes early for briefing and gear-up.
            </CardContent>
            <CardFooter>
              <Link to="/safety" className={buttonVariants({ variant: 'outline', size: 'sm' })}>Safety &amp; requirements</Link>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Time windows
              </CardTitle>
              <CardDescription>Pick a calm slot</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Early mornings are typically smoother; late afternoons can be good on low‑wind days.
            </CardContent>
            <CardFooter>
              <Link to="/weather" className={buttonVariants({ variant: 'outline', size: 'sm' })}>Weather tips</Link>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Who can ride?
              </CardTitle>
              <CardDescription>All confidence levels</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Confident riders rent &amp; ride; beginners can opt for a guided pace; under‑aged guests can choose a Joy Ride.
            </CardContent>
            <CardFooter>
              <Link to="/rides" className={buttonVariants({ variant: 'outline', size: 'sm' })}>See options</Link>
            </CardFooter>
          </Card>
        </div>
      </section>

      {/* Terms & confirmation dialog */}
      <Dialog open={confirmOpen} onOpenChange={(o) => { setConfirmOpen(o); if (!o) setAck(false) }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Weather policy & terms</DialogTitle>
            <DialogDescription>
              We do not refund due to bad weather. If conditions are unsafe or poor, we will reschedule your booking to a better day. If you cannot attend because you do not live in Cape Town, you will receive a voucher valid for 2 years.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm">
              <Checkbox checked={ack} onCheckedChange={(v: any) => setAck(Boolean(v))} />
              <span>I acknowledge and accept these terms</span>
            </label>
            <p className="text-xs text-muted-foreground">By proceeding you accept the terms and conditions.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>Cancel</Button>
            <Button onClick={() => { if (!ack) return; setConfirmOpen(false); handleSubmit(); }} disabled={!ack}>Proceed</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
