import * as React from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { CalendarDays, CalendarX2, Clock, Users, Gift, MapPin, Info, MessageCircle, Phone, Ship } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Button, buttonVariants } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { getPaymentQuote, chargeWithBooking, initiatePayment, createPaymentLink, createCheckout, getAvailableTimes } from '@/lib/api'
import { createYocoToken } from '@/lib/yoco'
import { AddOnsSection } from '@/features/bookings/AddOnsSection'
import type { AddonsState } from '@/features/bookings/AddOnsSection'
import { WeatherSnapshot } from '@/features/weather/WeatherSnapshot'
import {
  BOOKINGS_PAUSED,
  BOOKINGS_PAUSED_FOLLOWUP,
  BOOKINGS_PAUSED_MESSAGE,
  BOOKINGS_PAUSED_TITLE,
  BOOKINGS_WHATSAPP_URL,
} from '@/lib/bookingStatus'

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
  durationMinutes?: number
  pricePerJetSki?: number
  minJetSkis?: number
  maxJetSkis?: number
  requiresGroup?: boolean
  badge?: string
}

type RiderContact = {
  name: string
  email: string
}

type PassengerContact = {
  name: string
  email: string
}

type AvailableSlot = {
  time: string
  availableJetSkis?: number
}

const RIDES: Ride[] = [
  {
    id: '30-1',
    title: '30‑min Rental (1 Jet‑Ski)',
    subtitle: 'Quick burst of fun',
    price: 1488,
    displayPrice: 'From ZAR 1,488',
    icon: <Clock className="h-4 w-4" />,
    minJetSkis: 1,
    maxJetSkis: 1,
  },
  {
    id: '60-1',
    title: '60‑min Rental (1 Jet‑Ski)',
    subtitle: 'Extra time to explore',
    price: 2210,
    displayPrice: 'From ZAR 2,210',
    icon: <Clock className="h-4 w-4" />,
    minJetSkis: 1,
    maxJetSkis: 1,
  },
  {
    id: '30-2',
    title: '30‑min Rental (2 Jet‑Skis)',
    subtitle: 'Ride together',
    price: 2635,
    displayPrice: 'From ZAR 2,635',
    icon: <Users className="h-4 w-4" />,
    minJetSkis: 2,
    maxJetSkis: 2,
  },
  {
    id: '60-2',
    title: '60‑min Rental (2 Jet‑Skis)',
    subtitle: 'Double the fun, more time',
    price: 4080,
    displayPrice: 'From ZAR 4,080',
    icon: <Users className="h-4 w-4" />,
    minJetSkis: 2,
    maxJetSkis: 2,
  },
  {
    id: 'joy',
    title: 'Joy Ride (Instructed) • 10 min',
    subtitle: 'Instructor drives / assisted',
    price: 595,
    displayPrice: 'ZAR 595',
    icon: <Gift className="h-4 w-4" />,
    minJetSkis: 0,
    maxJetSkis: 0,
  },
  {
    id: 'group',
    title: 'Group Session • 2 hr 30 min',
    subtitle: 'For 5+ people (events & teams)',
    price: 6375,
    displayPrice: 'From ZAR 6,375',
    icon: <Users className="h-4 w-4" />,
    minJetSkis: 0,
    maxJetSkis: 0,
  },
  {
    id: 'coastal-cruise',
    title: 'Coastal Cruise (60 min)',
    subtitle: 'Group ride – explore the bay together',
    price: 2210,
    pricePerJetSki: 2210,
    displayPrice: 'From ZAR 8,840 (4 skis)',
    durationMinutes: 60,
    minJetSkis: 4,
    maxJetSkis: 6,
    requiresGroup: true,
    badge: 'Group experience',
    icon: <Ship className="h-4 w-4" />,
  },
]

// --- Add-on pricing rules ---
const WETSUIT_PRICE = 150
const BOAT_PRICE_PER_PERSON = 450
const EXTRA_PERSON_PRICE = 350

const WEEKEND_ONLY_BLOCKED_DATE = '2026-01-17' // YYYY-MM-DD (local date)

function formatZAR(n: number) {
  try {
    return new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR', maximumFractionDigits: 0 }).format(n)
  } catch {
    return `ZAR ${n.toFixed(0)}`
  }
}

function formatLocalDateKey(d: Date) {
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

function isWeekendDate(d: Date) {
  const day = d.getDay()
  return day === 0 || day === 6
}

function isBlockedBookingDate(d: Date) {
  return formatLocalDateKey(d) === WEEKEND_ONLY_BLOCKED_DATE
}

function startOfLocalDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}

function isPastLocalDate(d: Date) {
  return startOfLocalDay(d).getTime() < startOfLocalDay(new Date()).getTime()
}

function isBookableBookingDate(d: Date) {
  return isWeekendDate(d) && !isBlockedBookingDate(d) && !isPastLocalDate(d)
}

function toBool(v: unknown) {
  return v === true || v === 'true' || v === '1' || v === 1
}

function toInt(v: unknown, fallback: number) {
  const n = typeof v === 'string' ? parseInt(v, 10) : typeof v === 'number' ? Math.floor(v) : NaN
  return Number.isFinite(n) && n > 0 ? n : fallback
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n))
}

function getSkiCount(rideId: string): number {
  const ride = RIDES.find((r) => r.id === rideId)
  if (ride?.minJetSkis != null) return ride.minJetSkis
  const match = rideId.match(/^(?:30|60)-(\d+)/)
  if (match) return Math.min(2, Math.max(1, parseInt(match[1], 10)))
  if (rideId === 'joy' || rideId === 'group') return 0
  return 1
}

function sanitizeRideId(id: unknown): string {
  if (typeof id !== 'string') return '30-1'
  const exists = RIDES.some((r) => r.id === id)
  return exists ? id : '30-1'
}

function RouteComponent() {
  if (BOOKINGS_PAUSED) {
    return (
      <div className="bg-white">
        <section className="mx-auto max-w-4xl px-4 py-10 md:py-14 space-y-6">
          <div className="space-y-3">
            <Badge variant="outline" className="w-fit border-amber-200 bg-amber-50 text-amber-800">
              Maintenance
            </Badge>
            <h1 className="text-3xl md:text-4xl font-bold">{BOOKINGS_PAUSED_TITLE}</h1>
            <p className="text-base text-muted-foreground">{BOOKINGS_PAUSED_MESSAGE}</p>
            <p className="text-sm text-muted-foreground">{BOOKINGS_PAUSED_FOLLOWUP}</p>
          </div>

          <Alert variant="destructive" className="border-amber-200 bg-amber-50 text-amber-900">
            <CalendarX2 className="h-5 w-5" aria-hidden />
            <AlertTitle>Online bookings are offline</AlertTitle>
            <AlertDescription>
              We’re doing maintenance on the booking system. Please contact us and we will confirm a slot manually.
            </AlertDescription>
          </Alert>

          <Card className="border-amber-100">
            <CardHeader>
              <CardTitle className="text-lg">Need a ride?</CardTitle>
              <CardDescription>Reach out and we’ll lock in a time while maintenance is underway.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>WhatsApp is quickest for availability checks. Calls and email work if you prefer.</p>
            </CardContent>
            <CardFooter className="flex flex-wrap gap-3">
              <a
                href={BOOKINGS_WHATSAPP_URL}
                className={buttonVariants({ size: 'sm' })}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                WhatsApp us
              </a>
              <a
                href="tel:+27756588885"
                className={buttonVariants({ variant: 'outline', size: 'sm' })}
              >
                <Phone className="mr-2 h-4 w-4" />
                Call us
              </a>
              <Link
                to="/contact"
                className={buttonVariants({ variant: 'secondary', size: 'sm' })}
              >
                Contact page
              </Link>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Plan ahead while we work</CardTitle>
              <CardDescription>Browse rides and add-ons; we’ll finalise once bookings reopen.</CardDescription>
            </CardHeader>
            <CardFooter className="flex flex-wrap gap-2">
              <Link to="/rides" className={buttonVariants({ variant: 'outline', size: 'sm' })}>
                View rides
              </Link>
              <Link to="/add-ons" className={buttonVariants({ size: 'sm' })}>
                Check add-ons
              </Link>
            </CardFooter>
          </Card>
        </section>
      </div>
    )
  }

  const search = Route.useSearch() as Partial<{
    rideId: string
    wetsuit: unknown
    gopro: unknown
    boat: unknown
    boatCount: unknown
    extraPeople: unknown
  }>

  const [rideId, setRideId] = React.useState<string>(sanitizeRideId(search.rideId))
  const [date, setDate] = React.useState<Date | undefined>(undefined)
  const [dateError, setDateError] = React.useState<string | null>(null)
  const [time, setTime] = React.useState<string>('')
  const [fullName, setFullName] = React.useState<string>('')
  const [email, setEmail] = React.useState<string>('')
  const [phone, setPhone] = React.useState<string>('')
  const [notes, setNotes] = React.useState<string>('')
  const [addons, setAddons] = React.useState<AddonsState>(() => ({
    gopro: toBool(search.gopro),
    wetsuit: toBool(search.wetsuit),
    boat: toBool(search.boat),
    boatCount: toInt(search.boatCount, 1),
    extraPeople: Math.max(0, toInt(search.extraPeople, 0)),
  }))

  // Payment state
  const [quoteCents, setQuoteCents] = React.useState<number | null>(null)
  const [paying, setPaying] = React.useState(false)
  const [, setPaidId] = React.useState<string | null>(null)
  const [payOpen, setPayOpen] = React.useState(false)

  // Timeslot availability
  const [availableSlots, setAvailableSlots] = React.useState<AvailableSlot[]>([])
  const [timesLoading, setTimesLoading] = React.useState(false)
  const [timesError, setTimesError] = React.useState<string | null>(null)
  const timeslotKeyRef = React.useRef<{ rideId: string; dateStr: string } | null>(null)

  // Step-by-step flow
  const [step, setStep] = React.useState<1 | 2 | 3 | 4>(1)
  const [jetSkiQty, setJetSkiQty] = React.useState<number>(() => Math.max(0, getSkiCount(rideId)))
  const [passengers, setPassengers] = React.useState<PassengerContact[]>([])
  const [riders, setRiders] = React.useState<RiderContact[]>([])

  const selectedRide = React.useMemo(() => RIDES.find((r) => r.id === rideId) ?? RIDES[0], [rideId])
  const rideMinJetSkis = Math.max(0, selectedRide?.minJetSkis ?? 1)
  const rideMaxJetSkis = Math.max(rideMinJetSkis, selectedRide?.maxJetSkis ?? rideMinJetSkis)
  const requiresGroup = Boolean(selectedRide?.requiresGroup)
  const requiredJetSkis = Math.max(jetSkiQty, rideMinJetSkis)
  const hasRequiredJetSkis = jetSkiQty >= rideMinJetSkis
  const additionalRidersCount = React.useMemo(() => Math.max(0, jetSkiQty - 1), [jetSkiQty])

  // Limit additional passenger counts based on ride selection
  const maxExtraPeople = React.useMemo(() => {
    if (requiredJetSkis <= 0) return 0
    return requiredJetSkis
  }, [requiredJetSkis])

  // Sync ride/add-ons if user navigates here with new search params (e.g., from Rides page)
  React.useEffect(() => {
    const nextRide = sanitizeRideId(search.rideId)
    setRideId((prev) => (prev === nextRide ? prev : nextRide))
    setAddons((prev) => {
      const next = {
        gopro: toBool(search.gopro),
        wetsuit: toBool(search.wetsuit),
        boat: toBool(search.boat),
        boatCount: toInt(search.boatCount, 1),
        extraPeople: Math.max(0, toInt(search.extraPeople, 0)),
      }
      // Avoid unnecessary re-renders
      const same =
        prev.gopro === next.gopro &&
        prev.wetsuit === next.wetsuit &&
        prev.boat === next.boat &&
        prev.boatCount === next.boatCount &&
        prev.extraPeople === next.extraPeople
      return same ? prev : next
    })
  }, [search.boat, search.boatCount, search.extraPeople, search.gopro, search.rideId, search.wetsuit])

  React.useEffect(() => {
    setJetSkiQty((prev) => clamp(Number.isFinite(prev as number) ? (prev as number) : rideMinJetSkis, rideMinJetSkis, rideMaxJetSkis))
  }, [rideId, rideMinJetSkis, rideMaxJetSkis])

  const filteredSlots = React.useMemo(
    () => availableSlots.filter((slot) => slot.availableJetSkis == null || slot.availableJetSkis >= requiredJetSkis),
    [availableSlots, requiredJetSkis]
  )

  React.useEffect(() => {
    if (!time) return
    const stillValid = filteredSlots.some((slot) => slot.time === time)
    if (!stillValid) setTime('')
  }, [filteredSlots, time])

  React.useEffect(() => {
    setAddons((a) => ({ ...a, extraPeople: Math.min(a.extraPeople, maxExtraPeople) }))
  }, [maxExtraPeople])

  // Keep passenger detail fields in sync with extraPeople count
  React.useEffect(() => {
    const count = addons.extraPeople || 0
    setPassengers((prev) => {
      const next = prev.slice(0, count)
      while (next.length < count) {
        next.push({ name: '', email: '' })
      }
      return next
    })
  }, [addons.extraPeople])

  // Keep rider detail fields in sync with number of jet skis (minus primary)
  React.useEffect(() => {
    setRiders((prev) => {
      const next = prev.slice(0, additionalRidersCount)
      while (next.length < additionalRidersCount) {
        next.push({ name: '', email: '' })
      }
      return next
    })
  }, [additionalRidersCount])

  // Fetch available times when ride or date changes
  React.useEffect(() => {
    const dateStr = date ? formatLocalDateKey(date) : ''
    const prev = timeslotKeyRef.current
    const rideOrDateChanged = !prev || prev.rideId !== rideId || prev.dateStr !== dateStr
    if (rideOrDateChanged) {
      setTime('')
      setAvailableSlots([])
    }
    setTimesError(null)
    if (!date) {
      timeslotKeyRef.current = { rideId, dateStr }
      return
    }
    if (!isBookableBookingDate(date)) {
      setTimesError('Bookings are available on Saturdays and Sundays only (17 Jan 2026 excluded).')
      timeslotKeyRef.current = { rideId, dateStr }
      return
    }
    timeslotKeyRef.current = { rideId, dateStr }
    setTimesLoading(true)
    ;(async () => {
      try {
        const res = await getAvailableTimes(rideId, dateStr, requiredJetSkis)
        const normalized: AvailableSlot[] = Array.isArray(res.times)
          ? res.times
              .map((t: any) => {
                if (typeof t === 'string') return { time: t }
                if (t && typeof t === 'object' && typeof t.time === 'string') {
                  const availableJetSkis =
                    typeof t.availableJetSkis === 'number' ? t.availableJetSkis : undefined
                  return { time: t.time, availableJetSkis }
                }
                return null
              })
              .filter((t): t is AvailableSlot => Boolean(t && t.time))
          : []
        setAvailableSlots(normalized)
      } catch (e: any) {
        setTimesError(e?.message || 'Failed to load available times')
        setAvailableSlots([])
      } finally {
        setTimesLoading(false)
      }
    })()
  }, [rideId, date, requiredJetSkis])

  // Fetch authoritative payment quote from backend when inputs change
  React.useEffect(() => {
    (async () => {
      try {
        const q = await getPaymentQuote(rideId, addons as any, requiredJetSkis)
        setQuoteCents(q.amountInCents)
      } catch {
        setQuoteCents(null)
      }
    })()
  }, [rideId, addons, requiredJetSkis])

  const baseTotal =
    selectedRide?.pricePerJetSki != null
      ? selectedRide.pricePerJetSki * Math.max(0, jetSkiQty)
      : selectedRide?.price ?? 0

  // Add-on cost calculations
  const wetsuitCost = addons.wetsuit ? WETSUIT_PRICE : 0
  const boatCost = addons.boat ? BOAT_PRICE_PER_PERSON * Math.max(1, addons.boatCount || 1) : 0
  const extraPeopleCost = (addons.extraPeople || 0) * EXTRA_PERSON_PRICE
  const goproCost = 0 // priced on request / not included in estimate
  const addonsTotal = wetsuitCost + boatCost + extraPeopleCost + goproCost
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

function classifySeverity(speed?: number | null, gust?: number | null, direction?: number | null): Severity {
  // Align thresholds with Weather page: tuned for rider comfort
  // bad: strong winds/gusts
  const d = Number(direction ?? NaN)
  if (Number.isFinite(d)) {
    const norm = ((d % 360) + 360) % 360
    if (norm >= 112.5 && norm <= 157.5) return 'bad'
  }
  const s = Number(speed ?? 0)
  const g = Number(gust ?? 0)
  if (s >= 40 || g >= 60) return 'bad'
  // ok: moderate winds/gusts
  if (s >= 25 || g >= 45) return 'ok'
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
          severity: classifySeverity(curWind, curGust, curDir),
        })

        // Selected date daily forecast
        const dayStr = date ? formatLocalDateKey(new Date(date)) : undefined
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
            severity: classifySeverity(dWind, dGust, dDir),
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
  const dateIsBookable = Boolean(date && isBookableBookingDate(date))
  const basicsComplete = Boolean(rideId && dateIsBookable && time && hasRequiredJetSkis)
  const contactComplete = Boolean(fullName.trim() && phone.trim() && email.trim())
  const passengersComplete =
    (addons.extraPeople || 0) === 0 ||
    passengers.every((p) => p.name.trim() && p.email.trim())
  const ridersComplete = additionalRidersCount === 0 || riders.every((r) => r.name.trim() && r.email.trim())
  const step1Valid = basicsComplete
  const step2Valid = contactComplete && passengersComplete && ridersComplete
  const allRequiredComplete = step1Valid && step2Valid

  const goNext = () => {
    if (step === 1 && !step1Valid) {
      if (!hasRequiredJetSkis) {
        alert('Please select the minimum number of jet skis required for this experience.')
        return
      }
      if (date && !dateIsBookable) {
        alert('Bookings are available on Saturdays and Sundays only (17 Jan 2026 excluded).')
        return
      }
      alert('Please choose a date and time to continue.')
      return
    }
    if (step === 2 && !step2Valid) {
      alert('Please fill in contact details plus rider and passenger names/emails.')
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
        <Alert className="mb-6 border-amber-200 bg-amber-50 text-amber-900">
          <Info className="h-5 w-5" aria-hidden />
          <AlertTitle>Weekend bookings only</AlertTitle>
          <AlertDescription>
            We&apos;re currently only taking bookings on Saturdays and Sundays. Weekday bookings are unavailable. Note: 17 Jan 2026 is not bookable.
          </AlertDescription>
        </Alert>

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
         
          <Badge className="rounded-full">Wetsuit {formatZAR(WETSUIT_PRICE)}</Badge>
          {(() => {
            const count = Math.max(0, jetSkiQty)
            if (count > 0) {
              return (
                <Badge variant="secondary" className="rounded-full">
                  {count} Jet‑Ski{count === 1 ? '' : 's'}
                </Badge>
              )
            }
            return <Badge variant="secondary" className="rounded-full">Passenger optional</Badge>
          })()}
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
                  <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between text-xs md:text-sm">
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
                          <SelectTrigger id="ride" className="min-w-full text-left whitespace-normal">
                            <SelectValue placeholder="Select a ride" />
                          </SelectTrigger>
                          <SelectContent>
                            {RIDES.map((r) => (
                              <SelectItem key={r.id} value={r.id} className="whitespace-normal leading-tight">
                                {r.title} — {r.displayPrice}
                                {r.badge ? ' • ' + r.badge : ''}
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
                              onSelect={(d) => {
                                setDateError(null)
                                if (!d) {
                                  setDate(undefined)
                                  return
                                }
                                if (isPastLocalDate(d)) {
                                  setDate(undefined)
                                  return
                                }
                                if (!isWeekendDate(d)) {
                                  setDate(undefined)
                                  setDateError('Weekend bookings only — please choose a Saturday or Sunday.')
                                  return
                                }
                                if (isBlockedBookingDate(d)) {
                                  setDate(undefined)
                                  setDateError('17 Jan 2026 is not available.')
                                  return
                                }
                                setDate(d)
                              }}
                              disabled={(d) => isPastLocalDate(d) || !isWeekendDate(d) || isBlockedBookingDate(d)}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <p className="text-xs text-muted-foreground">
                          Bookings are available on Saturdays and Sundays only. 17 Jan 2026 is unavailable.
                        </p>
                        {dateError ? (
                          <p className="text-xs text-red-500">{dateError}</p>
                        ) : null}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="time">Preferred time</Label>
                        <Select
                          value={time}
                          onValueChange={setTime}
                          disabled={!dateIsBookable || timesLoading || filteredSlots.length === 0}
                        >
                          <SelectTrigger id="time">
                            <SelectValue
                              placeholder={
                                !date
                                  ? 'Select a date first'
                                  : !dateIsBookable
                                  ? 'Weekend bookings only'
                                  : timesLoading
                                  ? 'Loading times…'
                                  : filteredSlots.length === 0
                                  ? availableSlots.length === 0
                                    ? 'No slots available'
                                    : 'No slots with enough jet skis'
                                  : 'Select a time'
                              }
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {filteredSlots.map((slot) => (
                              <SelectItem key={slot.time} value={slot.time} className="flex items-center justify-between gap-2">
                                <span>{slot.time}</span>
                                {slot.availableJetSkis != null ? (
                                  <span className="text-xs text-muted-foreground">
                                    {slot.availableJetSkis} ski{slot.availableJetSkis === 1 ? '' : 's'} available
                                  </span>
                                ) : null}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {timesError && (
                          <p className="text-xs text-red-500">{timesError}</p>
                        )}
                        {!timesError && date && !timesLoading && filteredSlots.length === 0 && availableSlots.length > 0 && (
                          <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-md px-2 py-1.5">
                            No slots currently fit {requiredJetSkis} jet ski{requiredJetSkis === 1 ? '' : 's'}. Try a different date or adjust the quantity if flexible.
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="jet-ski-qty">Jet ski quantity</Label>
                        {rideMaxJetSkis <= 0 ? (
                          <p className="text-xs text-muted-foreground">Not required for this experience.</p>
                        ) : (
                          <div className="inline-flex items-center gap-2 rounded-lg border border-border/60 bg-background/50 px-3 py-2 w-fit">
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              disabled={jetSkiQty <= rideMinJetSkis}
                              onClick={() => setJetSkiQty((q) => clamp(q - 1, rideMinJetSkis, rideMaxJetSkis))}
                              aria-label="Decrease jet ski quantity"
                            >
                              -
                            </Button>
                            <div className="min-w-[3ch] text-center font-semibold" aria-live="polite">
                              {jetSkiQty}
                            </div>
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              disabled={jetSkiQty >= rideMaxJetSkis}
                              onClick={() => setJetSkiQty((q) => clamp(q + 1, rideMinJetSkis, rideMaxJetSkis))}
                              aria-label="Increase jet ski quantity"
                            >
                              +
                            </Button>
                            <span className="text-xs text-muted-foreground ml-2">
                              Min {rideMinJetSkis} • Max {rideMaxJetSkis}
                            </span>
                          </div>
                        )}
                        {selectedRide?.id === 'coastal-cruise' ? (
                          <p className="text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-md px-2 py-1.5">
                            Minimum 4 jet skis required for Coastal Cruise. Group experience.
                          </p>
                        ) : (
                          <p className="text-xs text-muted-foreground">
                            {rideMinJetSkis === rideMaxJetSkis
                              ? `Fixed at ${rideMinJetSkis} jet ski${rideMinJetSkis === 1 ? '' : 's'} for this ride.`
                              : requiresGroup
                              ? 'Group experience'
                              : 'Adjust jet ski count as needed for this ride.'}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Passenger(s)</Label>
                      {maxExtraPeople <= 0 ? (
                        <p className="text-xs text-muted-foreground">No additional passengers for this selection.</p>
                      ) : (
                        <div className="flex flex-wrap items-center gap-2">
                          {Array.from({ length: maxExtraPeople + 1 }).map((_, n) => (
                            <Button
                              key={n}
                              type="button"
                              size="sm"
                              variant={(addons.extraPeople || 0) === n ? 'default' : 'outline'}
                              onClick={() => setAddons((a) => ({ ...a, extraPeople: n }))}
                              className="whitespace-nowrap"
                            >
                              {n === 0 ? 'Just me' : `+${n} passenger${n === 1 ? '' : 's'}`}
                            </Button>
                          ))}
                        </div>
                      )}
                      <p className="text-xs text-muted-foreground">
                        Each jet ski can carry up to 2 people. Extra passengers cost R{EXTRA_PERSON_PRICE} each.
                          <span className="ml-1">Up to {maxExtraPeople} additional passenger{maxExtraPeople === 1 ? '' : 's'} for this booking.</span>
                        </p>
                      {rideId === 'joy' && (
                        <Badge
                          variant="outline"
                          className="mt-2 inline-flex items-start gap-2 rounded-full border-amber-300 bg-amber-50 px-3 py-1.5 text-xs font-normal leading-snug text-amber-900 whitespace-normal"
                        >
                          <Info className="mt-0.5 h-3.5 w-3.5" />
                          <span>
                            This Joy Ride is an assisted experience operated by our guide – ideal for guests who can&apos;t ride alone and for under‑aged riders who want to feel what it&apos;s like.
                          </span>
                        </Badge>
                      )}
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

                    {additionalRidersCount > 0 && (
                      <div className="space-y-3">
                        <Label>Additional rider details</Label>
                        <p className="text-xs text-muted-foreground">
                          We email each rider their indemnity link. One row per extra rider.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {riders.map((r, idx) => (
                            <div key={idx} className="space-y-2 rounded-lg border border-border/60 p-3">
                              <div className="space-y-1">
                                <Label htmlFor={`rider-${idx}`}>Rider {idx + 2} full name</Label>
                                <Input
                                  id={`rider-${idx}`}
                                  value={r.name}
                                  onChange={(e) =>
                                    setRiders((prev) => {
                                      const next = [...prev]
                                      next[idx] = { ...next[idx], name: e.target.value }
                                      return next
                                    })
                                  }
                                  placeholder="Full name"
                                  required
                                />
                              </div>
                              <div className="space-y-1">
                                <Label htmlFor={`rider-email-${idx}`}>Rider {idx + 2} email</Label>
                                <Input
                                  id={`rider-email-${idx}`}
                                  type="email"
                                  value={r.email}
                                  onChange={(e) =>
                                    setRiders((prev) => {
                                      const next = [...prev]
                                      next[idx] = { ...next[idx], email: e.target.value }
                                      return next
                                    })
                                  }
                                  placeholder="Email"
                                  required
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {addons.extraPeople > 0 && (
                      <div className="space-y-3">
                        <Label>Additional passenger details</Label>
                        <p className="text-xs text-muted-foreground">
                          We use this for safety and check‑in. One field per extra passenger.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {passengers.map((p, idx) => (
                            <div key={idx} className="space-y-2 rounded-lg border border-border/60 p-3">
                              <div className="space-y-1">
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
                                  required
                                />
                              </div>
                              <div className="space-y-1">
                                <Label htmlFor={`passenger-email-${idx}`}>Passenger {idx + 1} email</Label>
                                <Input
                                  id={`passenger-email-${idx}`}
                                  type="email"
                                  value={p.email}
                                  onChange={(e) =>
                                    setPassengers((prev) => {
                                      const next = [...prev]
                                      next[idx] = { ...next[idx], email: e.target.value }
                                      return next
                                    })
                                  }
                                  placeholder="Email"
                                  required
                                />
                              </div>
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
                    <AddOnsSection addons={addons} setAddons={setAddons} />
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
                        disabled={!allRequiredComplete || !hasRequiredJetSkis}
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
                {(requiresGroup || selectedRide?.badge) && (
                  <Badge variant="outline" className="mt-1">
                    {selectedRide?.badge || 'Group experience'}
                  </Badge>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-muted-foreground">When</p>
                  <p className="font-medium">{date ? date.toLocaleDateString('en-ZA', { year: 'numeric', month: 'short', day: 'numeric' }) : '—'} {time && <span>• {time}</span>}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Location</p>
                  <p className="font-medium">Gordon&apos;s Bay Harbour</p>
                </div>
              </div>
              {rideMaxJetSkis > 0 && (
                <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                  <p className="text-muted-foreground">Jet skis</p>
                  <p className="font-medium">{jetSkiQty}</p>
                </div>
              )}
              <Separator />
              <div className="space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-sm">Subtotal</span>
                  <span className="font-medium">{formatZAR(baseTotal)}</span>
                </div>
                {addons.wetsuit || addons.gopro || addons.boat || (addons.extraPeople || 0) > 0 ? (
                  <div className="space-y-1">
                    {addons.gopro ? (
                      <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                        <span>GoPro footage</span>
                        <span className="text-muted-foreground">On request</span>
                      </div>
                    ) : null}
                    {addons.wetsuit ? (
                      <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                        <span>Wetsuit hire</span>
                        <span className="text-muted-foreground">{formatZAR(wetsuitCost)}</span>
                      </div>
                    ) : null}
                    {addons.boat ? (
                      <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                        <span>Boat ride × {Math.max(1, addons.boatCount || 1)}</span>
                        <span className="text-muted-foreground">{formatZAR(boatCost)}</span>
                      </div>
                    ) : null}
                    {(addons.extraPeople || 0) > 0 ? (
                      <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                        <span>Additional passenger(s) × {addons.extraPeople}</span>
                        <span className="text-muted-foreground">{formatZAR(extraPeopleCost)}</span>
                      </div>
                    ) : null}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-sm">Add‑ons total</span>
                      <span className="font-medium">{formatZAR(addonsTotal)}</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground">No add‑ons selected.</p>
                )}
                <Separator />
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-sm font-semibold">Estimated total</span>
                  <span className="font-semibold">{formatZAR(estimatedTotal)}</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">Prices subject to change. Final total confirmed on booking.</p>
            </CardContent>
            <CardFooter className="flex flex-wrap items-center justify-between gap-3">
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
              if (!hasRequiredJetSkis) {
                alert('Please meet the minimum jet ski requirement before paying.')
                return
              }
              if (!date || !dateIsBookable) {
                alert('Bookings are available on Saturdays and Sundays only (17 Jan 2026 excluded).')
                return
              }
              setPaying(true)
                  const formattedDate = date ? formatLocalDateKey(date) : null
                  const booking = { rideId, date: formattedDate, time, fullName, email, phone, notes, addons, passengers, riders, jetSkiQty: requiredJetSkis }
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
