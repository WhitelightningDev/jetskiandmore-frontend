import * as React from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { CalendarDays, Clock, Users, Gift, MapPin, Info } from 'lucide-react'
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
import { getPaymentQuote, chargeWithBooking, initiatePayment, createPaymentLink, createCheckout, getAvailableTimes } from '@/lib/api'
import { createYocoToken } from '@/lib/yoco'
import { AddOnsSection } from '@/features/bookings/AddOnsSection'
import { WeatherSnapshot } from '@/features/weather/WeatherSnapshot'

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

  // Payment state
  const [quoteCents, setQuoteCents] = React.useState<number | null>(null)
  const [paying, setPaying] = React.useState(false)
  const [, setPaidId] = React.useState<string | null>(null)
  const [payOpen, setPayOpen] = React.useState(false)

  // Timeslot availability
  const [availableTimes, setAvailableTimes] = React.useState<string[]>([])
  const [timesLoading, setTimesLoading] = React.useState(false)
  const [timesError, setTimesError] = React.useState<string | null>(null)

  // Step-by-step flow
  const [step, setStep] = React.useState<1 | 2 | 3 | 4>(1)
  const [passengers, setPassengers] = React.useState<{ name: string }[]>([])

  // Limit additional passenger counts based on ride selection
  const maxExtraPeople = React.useMemo(() => {
    if (rideId === '30-1' || rideId === '60-1') return 1
    if (rideId === '30-2' || rideId === '60-2') return 2
    return 0
  }, [rideId])

  React.useEffect(() => {
    setAddons((a) => ({ ...a, extraPeople: Math.min(a.extraPeople, maxExtraPeople) }))
  }, [maxExtraPeople])

  // Keep passenger detail fields in sync with extraPeople count
  React.useEffect(() => {
    const count = addons.extraPeople || 0
    setPassengers((prev) => {
      const next = prev.slice(0, count)
      while (next.length < count) {
        next.push({ name: '' })
      }
      return next
    })
  }, [addons.extraPeople])

  // Fetch available times when ride or date changes
  React.useEffect(() => {
    setTime('')
    setAvailableTimes([])
    setTimesError(null)
    if (!date) return
    const dateStr = date.toISOString().split('T')[0]
    setTimesLoading(true)
    ;(async () => {
      try {
        const res = await getAvailableTimes(rideId, dateStr)
        setAvailableTimes(res.times || [])
      } catch (e: any) {
        setTimesError(e?.message || 'Failed to load available times')
        setAvailableTimes([])
      } finally {
        setTimesLoading(false)
      }
    })()
  }, [rideId, date])

  // Fetch authoritative payment quote from backend when inputs change
  React.useEffect(() => {
    (async () => {
      try {
        const q = await getPaymentQuote(rideId, addons as any)
        setQuoteCents(q.amountInCents)
      } catch {
        setQuoteCents(null)
      }
    })()
  }, [rideId, addons])

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

  // Fixed location: Gordon's Bay Harbour (do NOT replace with geolocation)
  const GBAY = { lat: -34.165, lon: 18.866, tz: 'Africa/Johannesburg' as const }
  // Weather for Gordon's Bay via Open-Meteo (current + selected day)
  type Severity = 'good' | 'ok' | 'bad'
  type Weather = {
    temperature: number | null
    wind: number | null
    gust: number | null
    direction: number | null
    code: number | null
    label: string
    severity: Severity
  } | null
  type Forecast = {
    date: string
    tempMax: number | null
    tempMin: number | null
    windMax: number | null
    gustMax: number | null
    direction: number | null
    code: number | null
    label: string
    severity: Severity
  } | null

  const [weather, setWeather] = React.useState<Weather>(null)
  const [forecast, setForecast] = React.useState<Forecast>(null)

function classifySeverity(speed?: number | null, gust?: number | null): Severity {
  const s = Number(speed ?? 0)
  const g = Number(gust ?? 0)
  // Align thresholds with Weather page: tuned for rider comfort
  // bad: strong winds/gusts
  if (s >= 25 || g >= 35) return 'bad'
  // ok: moderate winds/gusts
  if (s >= 12 || g >= 20) return 'ok'
  // good: calm to light breeze
  return 'good'
}

 

 

  React.useEffect(() => {
    const controller = new AbortController()
    ;(async () => {
      try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${GBAY.lat}&longitude=${GBAY.lon}&current=temperature_2m,wind_speed_10m,wind_gusts_10m,wind_direction_10m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,wind_speed_10m_max,wind_gusts_10m_max,wind_direction_10m_dominant&timezone=${encodeURIComponent(GBAY.tz)}&forecast_days=7`
        const res = await fetch(url, { signal: controller.signal })
        if (!res.ok) return
        const data = await res.json()
        const curCode = Number(data?.current?.weather_code ?? NaN)
        const curLabel = weatherCodeToText(curCode)
        const curWind = Number(data?.current?.wind_speed_10m ?? NaN)
        const curGust = Number(data?.current?.wind_gusts_10m ?? NaN)
        const curDir = Number(data?.current?.wind_direction_10m ?? NaN)
        setWeather({
          temperature: Number(data?.current?.temperature_2m ?? NaN),
          wind: curWind,
          gust: curGust,
          direction: curDir,
          code: curCode,
          label: curLabel,
          severity: classifySeverity(curWind, curGust),
        })

        // Selected date daily forecast
        const dayStr = date ? new Date(date).toISOString().split('T')[0] : undefined
        const days: string[] = data?.daily?.time ?? []
        const idx = dayStr ? days.indexOf(dayStr) : 0
        if (idx > 0 && days[idx]) {
          const dCode = Number(data?.daily?.weather_code?.[idx] ?? NaN)
          const dLabel = weatherCodeToText(dCode)
          const dWind = Number(data?.daily?.wind_speed_10m_max?.[idx] ?? NaN)
          const dGust = Number(data?.daily?.wind_gusts_10m_max?.[idx] ?? NaN)
          const dDir = Number(data?.daily?.wind_direction_10m_dominant?.[idx] ?? NaN)
          setForecast({
            date: days[idx],
            tempMax: Number(data?.daily?.temperature_2m_max?.[idx] ?? NaN),
            tempMin: Number(data?.daily?.temperature_2m_min?.[idx] ?? NaN),
            windMax: dWind,
            gustMax: dGust,
            direction: dDir,
            code: dCode,
            label: dLabel,
            severity: classifySeverity(dWind, dGust),
          })
        } else {
          setForecast(null)
        }
      } catch {}
    })()
    return () => controller.abort()
  }, [date])

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

  // Step validation helpers
  const basicsComplete = Boolean(rideId && date && time)
  const contactComplete = Boolean(fullName.trim() && phone.trim() && email.trim())
  const passengersComplete = (addons.extraPeople || 0) === 0 || passengers.every((p) => p.name.trim())
  const step1Valid = basicsComplete
  const step2Valid = contactComplete && passengersComplete
  const allRequiredComplete = step1Valid && step2Valid

  const goNext = () => {
    if (step === 1 && !step1Valid) {
      alert('Please choose a date and time to continue.')
      return
    }
    if (step === 2 && !step2Valid) {
      alert('Please fill in your contact details and passenger names.')
      return
    }
    setStep((prev) => (prev < 4 ? ((prev + 1) as 1 | 2 | 3 | 4) : prev))
  }

  const goBack = () => {
    setStep((prev) => (prev > 1 ? ((prev - 1) as 1 | 2 | 3 | 4) : prev))
  }

  // Terms modal control
  const [confirmOpen, setConfirmOpen] = React.useState(false)
  const [ack, setAck] = React.useState(false)

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
                Step-by-step booking
              </CardTitle>
              <CardDescription>Follow the steps to complete your booking and pay securely.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Step indicator */}
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between text-xs md:text-sm">
                    {[
                      { id: 1, label: 'Ride & time' },
                      { id: 2, label: 'Rider details' },
                      { id: 3, label: 'Extras' },
                      { id: 4, label: 'Review & pay' },
                    ].map((s, idx, arr) => (
                      <div key={s.id} className="flex items-center gap-2 flex-1">
                        <div
                          className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold ${
                            step >= s.id ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          {s.id}
                        </div>
                        <span className={step === s.id ? 'font-semibold' : ''}>{s.label}</span>
                        {idx < arr.length - 1 && <div className="hidden md:block h-px flex-1 bg-border ml-2" />}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Step 1: ride, date, time, passengers */}
                {step === 1 && (
                  <div className="space-y-6">
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
                              {date
                                ? date.toLocaleDateString('en-ZA', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                  })
                                : <span>Pick a date</span>}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={date}
                              onSelect={setDate}
                              disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0))}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="time">Preferred time</Label>
                        <Select
                          value={time}
                          onValueChange={setTime}
                          disabled={!date || timesLoading || availableTimes.length === 0}
                        >
                          <SelectTrigger id="time">
                            <SelectValue
                              placeholder={
                                !date
                                  ? 'Select a date first'
                                  : timesLoading
                                  ? 'Loading times…'
                                  : availableTimes.length === 0
                                  ? 'No slots available'
                                  : 'Select a time'
                              }
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {availableTimes.map((t) => (
                              <SelectItem key={t} value={t}>
                                {t}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {timesError && (
                          <p className="text-xs text-red-500">{timesError}</p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Passenger(s)</Label>
                      {maxExtraPeople <= 0 ? (
                        <p className="text-xs text-muted-foreground">
                          No additional passengers for this selection.
                        </p>
                      ) : maxExtraPeople === 1 ? (
                        <div className="flex items-center gap-2">
                          <Button
                            type="button"
                            variant={(addons.extraPeople || 0) === 0 ? 'default' : 'outline'}
                            onClick={() => setAddons((a) => ({ ...a, extraPeople: 0 }))}
                          >
                            Just me (1)
                          </Button>
                          <Button
                            type="button"
                            variant={(addons.extraPeople || 0) === 1 ? 'default' : 'outline'}
                            onClick={() => setAddons((a) => ({ ...a, extraPeople: 1 }))}
                          >
                            +1 Passenger (2)
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          {[0, 1, 2].map((n) => (
                            <Button
                              key={n}
                              type="button"
                              variant={(addons.extraPeople || 0) === n ? 'default' : 'outline'}
                              onClick={() => setAddons((a) => ({ ...a, extraPeople: n }))}
                            >
                              {n} passenger{n === 1 ? '' : 's'}
                            </Button>
                          ))}
                        </div>
                      )}
                      <p className="text-xs text-muted-foreground">
                        Each jet ski can carry up to 2 people. Extra passengers cost R{EXTRA_PERSON_PRICE} each.
                      </p>
                    </div>
                  </div>
                )}

                {/* Step 2: contact + passenger details */}
                {step === 2 && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="fullName">Full name</Label>
                        <Input
                          id="fullName"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          inputMode="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="notes">Notes (optional)</Label>
                        <Textarea
                          id="notes"
                          placeholder="Any special requests or questions?"
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                        />
                      </div>
                    </div>

                    {addons.extraPeople > 0 && (
                      <div className="space-y-3">
                        <Label>Additional passenger details</Label>
                        <p className="text-xs text-muted-foreground">
                          We use this for safety and check‑in. One field per extra passenger.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {passengers.map((p, idx) => (
                            <div key={idx} className="space-y-1">
                              <Label htmlFor={`passenger-${idx}`}>Passenger {idx + 1} full name</Label>
                              <Input
                                id={`passenger-${idx}`}
                                value={p.name}
                                onChange={(e) =>
                                  setPassengers((prev) => {
                                    const next = [...prev]
                                    next[idx] = { ...next[idx], name: e.target.value }
                                    return next
                                  })
                                }
                                placeholder="Full name"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Step 3: extras */}
                {step === 3 && (
                  <div className="space-y-4">
                    <AddOnsSection rideId={rideId} addons={addons} setAddons={setAddons} />
                    <p className="text-xs text-muted-foreground">
                      Add-ons are optional. You can skip this step or adjust extras later by contacting us,
                      subject to availability.
                    </p>
                  </div>
                )}

                {/* Step 4: review & pay */}
                {step === 4 && (
                  <div className="space-y-4 text-sm text-muted-foreground">
                    <p>
                      Review your ride, date, time, passengers and extras in the summary on the right. When you&apos;re
                      ready, continue to secure payment.
                    </p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Payments are processed securely via Yoco.</li>
                      <li>Our weather policy allows rescheduling if conditions are unsafe.</li>
                    </ul>
                  </div>
                )}

                {/* Footer actions */}
                <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between pt-2">
                  <div className="text-xs text-muted-foreground flex items-center gap-2">
                    <Info className="h-4 w-4" />
                    <span>By booking you acknowledge our safety briefing and weather policy.</span>
                  </div>
                  <div className="flex gap-2 flex-wrap justify-end">
                    <Link to="/safety" className={buttonVariants({ variant: 'outline', size: 'sm' })}>
                      Safety &amp; info
                    </Link>
                    {step > 1 && (
                      <Button type="button" variant="outline" size="sm" onClick={goBack}>
                        Back
                      </Button>
                    )}
                    {step < 4 && (
                      <Button
                        type="button"
                        size="sm"
                        onClick={goNext}
                        disabled={(step === 1 && !step1Valid) || (step === 2 && !step2Valid)}
                      >
                        Next
                      </Button>
                    )}
                    {step === 4 && (
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => setConfirmOpen(true)}
                        disabled={!allRequiredComplete}
                      >
                        Book &amp; Pay
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Summary</CardTitle>
              <CardDescription>Review your selection</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Weather snapshot: current + selected day with severity */}
              <WeatherSnapshot weather={weather} forecast={forecast} date={date} />
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
            <CardFooter className="flex gap-2">
              <Link to="/weather/calm-slots" className={buttonVariants({ size: 'sm' })}>Find calm day</Link>
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
            <Button onClick={() => { if (!ack) return; setConfirmOpen(false); setPayOpen(true) }} disabled={!ack}>Proceed</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Payment modal */}
      <Dialog open={payOpen} onOpenChange={(o) => { setPayOpen(o) }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Pay securely with Yoco</DialogTitle>
            <DialogDescription>
              Amount: {quoteCents != null ? `ZAR ${(quoteCents/100).toFixed(0)}` : 'Loading...'}
            </DialogDescription>
          </DialogHeader>
          <div className="text-sm text-muted-foreground">A secure Yoco payment window will open. Your card details are handled by Yoco.</div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPayOpen(false)}>Cancel</Button>
            <Button onClick={async () => {
              setPaying(true)
                  const formattedDate = date ? date.toISOString().split('T')[0] : null
                  const booking = { rideId, date: formattedDate, time, fullName, email, phone, notes, addons, passengers }
              try {
                // Preferred: Checkout API (Bearer token)
                const co = await createCheckout(booking)
                if (!co?.redirectUrl) throw new Error('Failed to obtain checkout link')
                try { window.localStorage.setItem('jsm_last_payment', JSON.stringify({ checkoutId: co.id, booking })) } catch {}
                window.location.href = co.redirectUrl
              } catch (err: any) {
                // Fallback: Payment Link (OAuth)
                try {
                  const link = await createPaymentLink(booking)
                  if (!link?.linkUrl) throw new Error('Failed to obtain payment link')
                  try { window.localStorage.setItem('jsm_last_payment', JSON.stringify({ orderId: link.orderId, booking })) } catch {}
                  window.location.href = link.linkUrl
                  return
                } catch {}
                // Fallback: tokenize via Yoco popup and charge server-side (no OAuth required)
                try {
                  const { amountInCents, currency, reference } = await initiatePayment(booking)
                  const token = await createYocoToken(amountInCents || 0, currency, { productName: selectedRide.title, description: reference, customerName: fullName, customerEmail: email })
                  const res = await chargeWithBooking(token, booking)
                  setPaidId(res.id)
                  setPayOpen(false)
                  alert("Payment successful — booking confirmed! We've emailed your receipt.")
                } catch (inner: any) {
                  alert(inner?.message || 'Payment failed')
                }
              } finally {
                setPaying(false)
              }
            }} disabled={paying || !quoteCents}>
              {paying ? 'Processing…' : 'Proceed to payment'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
