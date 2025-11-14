import * as React from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { MapPin, CalendarDays, CloudSun, Wind, Thermometer, Info } from 'lucide-react'

type Severity = 'good' | 'ok' | 'bad'

type DayInfo = {
  date: string // YYYY-MM-DD
  tempMax: number | null
  tempMin: number | null
  windMax: number | null
  gustMax: number | null
  direction: number | null
  code: number | null
  label: string
  severity: Severity
}

export const Route = createFileRoute('/weather/calm-slots/')({
  component: CalmSlotsPage,
})

function degToCompass(deg?: number | null): string {
  const d = Number(deg)
  if (!Number.isFinite(d)) return '—'
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
  return dirs[Math.round(d / 45) % 8]
}

function severityClasses(sev: Severity) {
  if (sev === 'bad') return 'bg-rose-100 text-rose-900 border-rose-200'
  if (sev === 'ok') return 'bg-amber-100 text-amber-900 border-amber-200'
  return 'bg-emerald-100 text-emerald-900 border-emerald-200'
}

function classifySeverity(wind?: number | null, gust?: number | null): Severity {
  const s = Number(wind ?? 0)
  const g = Number(gust ?? 0)
  // Align with site-wide thresholds (Weather & Booking pages)
  if (s >= 25 || g >= 35) return 'bad'
  if (s >= 12 || g >= 20) return 'ok'
  return 'good'
}

function codeToText(code: number): string {
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

function CalmSlotsPage() {
  const [days, setDays] = React.useState<DayInfo[]>([])
  const [selected, setSelected] = React.useState<Date | undefined>(undefined)
  const [open, setOpen] = React.useState(false)

  React.useEffect(() => {
    const ac = new AbortController()
    ;(async () => {
      try {
        // Gordon's Bay Harbour (accurate fixed location)
        const lat = -34.165
        const lon = 18.866
        const tz = 'Africa/Johannesburg'
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=weather_code,temperature_2m_max,temperature_2m_min,wind_speed_10m_max,wind_gusts_10m_max,wind_direction_10m_dominant&timezone=${encodeURIComponent(tz)}&forecast_days=16`
        const res = await fetch(url, { signal: ac.signal })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const j = await res.json()
        const times: string[] = j?.daily?.time ?? []
        const out: DayInfo[] = times.map((t: string, i: number) => {
          const wind = Number(j?.daily?.wind_speed_10m_max?.[i] ?? NaN)
          const gust = Number(j?.daily?.wind_gusts_10m_max?.[i] ?? NaN)
          const code = Number(j?.daily?.weather_code?.[i] ?? NaN)
          const sev = classifySeverity(wind, gust)
          return {
            date: t,
            tempMax: Number(j?.daily?.temperature_2m_max?.[i] ?? NaN),
            tempMin: Number(j?.daily?.temperature_2m_min?.[i] ?? NaN),
            windMax: wind,
            gustMax: gust,
            direction: Number(j?.daily?.wind_direction_10m_dominant?.[i] ?? NaN),
            code,
            label: codeToText(code),
            severity: sev,
          }
        })
        setDays(out)
      } catch (e) {
        // ignore
      }
    })()
    return () => ac.abort()
  }, [])

  const good = React.useMemo(() => days.filter(d => d.severity === 'good').map(d => new Date(d.date)), [days])
  const ok = React.useMemo(() => days.filter(d => d.severity === 'ok').map(d => new Date(d.date)), [days])
  const bad = React.useMemo(() => days.filter(d => d.severity === 'bad').map(d => new Date(d.date)), [days])

  const selectedInfo = React.useMemo(() => {
    if (!selected) return undefined
    const key = selected.toISOString().split('T')[0]
    return days.find(d => d.date === key)
  }, [selected, days])

  React.useEffect(() => {
    if (selectedInfo) setOpen(true)
  }, [selectedInfo])

  return (
    <div className="bg-background">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary/10 via-cyan-50 to-background" />
        <div className="absolute -top-28 left-1/2 -translate-x-1/2 -z-10 blur-3xl opacity-30 size-[600px] rounded-full bg-[radial-gradient(circle_at_center,theme(colors.cyan.300),transparent_60%)]" />
        <div className="mx-auto max-w-6xl px-4 py-10 md:py-14">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-3xl md:text-4xl font-extrabold leading-tight bg-gradient-to-r from-primary to-cyan-600 bg-clip-text text-transparent">
              Book a calm slot
            </h1>
            <Badge variant="secondary" className="flex items-center gap-1">
              <MapPin className="h-4 w-4" /> Gordon&apos;s Bay Harbour
            </Badge>
          </div>

          <Card className="border-primary/30 bg-white/90 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5" />
                Pick a day
              </CardTitle>
              <CardDescription>Colors indicate expected wind and gusts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Calendar + legend */}
                <div className="lg:col-span-2">
                  <div className="rounded-lg border p-3 w-fit bg-background">
                    <Calendar
                      mode="single"
                      selected={selected}
                      onSelect={setSelected}
                      captionLayout="dropdown"
                      modifiers={{ good, ok, bad }}
                      modifiersClassNames={{
                        good: 'bg-emerald-50 text-emerald-900 ring-1 ring-emerald-200',
                        ok: 'bg-amber-50 text-amber-900 ring-1 ring-amber-200',
                        bad: 'bg-rose-50 text-rose-900 ring-1 ring-rose-200',
                      }}
                    />
                    <div className="mt-3 flex flex-wrap items-center gap-3 text-xs">
                      <span className="inline-flex items-center gap-1"><span className="size-3 rounded-sm bg-emerald-400" /> Good</span>
                      <span className="inline-flex items-center gap-1"><span className="size-3 rounded-sm bg-amber-400" /> Okay</span>
                      <span className="inline-flex items-center gap-1"><span className="size-3 rounded-sm bg-rose-400" /> Bad</span>
                      <span className="inline-flex items-center gap-1 text-muted-foreground"><Info className="h-3.5 w-3.5" /> Early mornings are usually calmer</span>
                    </div>
                  </div>

                  {/* Mobile: details popover */}
                  <div className="mt-4 lg:hidden">
                    <Popover open={open} onOpenChange={setOpen}>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="self-start">{selected ? `Details for ${selected.toLocaleDateString('en-ZA', { year: 'numeric', month: 'short', day: 'numeric' })}` : 'Select a date'}</Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-80">
                        {!selectedInfo ? (
                          <div className="text-sm text-muted-foreground">Select a date to see forecast details.</div>
                        ) : (
                          <div className={`rounded-md border p-3 ${severityClasses(selectedInfo.severity)}`}>
                            <div className="flex items-center gap-2 mb-2">
                              <CloudSun className="h-5 w-5" />
                              <span className="font-medium">{new Date(selectedInfo.date).toLocaleDateString('en-ZA', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                              <Badge variant="outline" className="ml-auto capitalize">{selectedInfo.severity}</Badge>
                            </div>
                            <div className="text-sm space-y-1">
                              <div className="flex items-center gap-2"><Thermometer className="h-4 w-4" /> Temp: {Number.isFinite(selectedInfo.tempMin) ? selectedInfo.tempMin!.toFixed(0) : '—'}°C – {Number.isFinite(selectedInfo.tempMax) ? selectedInfo.tempMax!.toFixed(0) : '—'}°C</div>
                              <div className="flex items-center gap-2"><Wind className="h-4 w-4" /> Max wind: {Number.isFinite(selectedInfo.windMax) ? selectedInfo.windMax!.toFixed(0) : '—'} km/h</div>
                              <div className="flex items-center gap-2"><Wind className="h-4 w-4 rotate-45" /> Max gusts: {Number.isFinite(selectedInfo.gustMax) ? selectedInfo.gustMax!.toFixed(0) : '—'} km/h</div>
                              <div className="flex items-center gap-2"><Info className="h-4 w-4" /> Sky: {selectedInfo.label}</div>
                              <div className="flex items-center gap-2">Dir: {degToCompass(selectedInfo.direction)}</div>
                              {selectedInfo.severity === 'bad' ? (
                                <p className="text-xs mt-1"><strong>Warning:</strong> Ocean may be rough. South‑easter (SE) winds in Gordon&apos;s Bay are typically the worst.</p>
                              ) : selectedInfo.severity === 'ok' ? (
                                <p className="text-xs mt-1">Caution: moderate winds; conditions may be choppy at times.</p>
                              ) : (
                                <p className="text-xs mt-1">Looks calm — great for comfort and control.</p>
                              )}
                            </div>
                            <Separator className="my-3" />
                            <Link to="/Bookings" search={{ date: selectedInfo.date }}>
                              <Button className="w-full"><CalendarDays className="h-4 w-4 mr-2" /> Book this day</Button>
                            </Link>
                          </div>
                        )}
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                {/* Desktop: sticky details card */}
                <div className="hidden lg:block">
                  <div className="sticky top-24">
                    <Card className="border-primary/30">
                      <CardHeader>
                        <CardTitle className="text-lg">Day details</CardTitle>
                        <CardDescription>Tap a day to preview conditions</CardDescription>
                      </CardHeader>
                      <CardContent>
                        {!selectedInfo ? (
                          <div className="text-sm text-muted-foreground">Select a date on the calendar to see temperature, wind, and gusts.</div>
                        ) : (
                          <div className={`rounded-md border p-3 ${severityClasses(selectedInfo.severity)}`}>
                            <div className="flex items-center gap-2 mb-2">
                              <CloudSun className="h-5 w-5" />
                              <span className="font-medium">{new Date(selectedInfo.date).toLocaleDateString('en-ZA', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                              <Badge variant="outline" className="ml-auto capitalize">{selectedInfo.severity}</Badge>
                            </div>
                            <div className="text-sm space-y-1">
                              <div className="flex items-center gap-2"><Thermometer className="h-4 w-4" /> Temp: {Number.isFinite(selectedInfo.tempMin) ? selectedInfo.tempMin!.toFixed(0) : '—'}°C – {Number.isFinite(selectedInfo.tempMax) ? selectedInfo.tempMax!.toFixed(0) : '—'}°C</div>
                              <div className="flex items-center gap-2"><Wind className="h-4 w-4" /> Max wind: {Number.isFinite(selectedInfo.windMax) ? selectedInfo.windMax!.toFixed(0) : '—'} km/h</div>
                              <div className="flex items-center gap-2"><Wind className="h-4 w-4 rotate-45" /> Max gusts: {Number.isFinite(selectedInfo.gustMax) ? selectedInfo.gustMax!.toFixed(0) : '—'} km/h</div>
                              <div className="flex items-center gap-2"><Info className="h-4 w-4" /> Sky: {selectedInfo.label}</div>
                              <div className="flex items-center gap-2">Dir: {degToCompass(selectedInfo.direction)}</div>
                              {selectedInfo.severity === 'bad' ? (
                                <p className="text-xs mt-1"><strong>Warning:</strong> Ocean may be rough. South‑easter (SE) winds in Gordon&apos;s Bay are typically the worst.</p>
                              ) : selectedInfo.severity === 'ok' ? (
                                <p className="text-xs mt-1">Caution: moderate winds; conditions may be choppy at times.</p>
                              ) : (
                                <p className="text-xs mt-1">Looks calm — great for comfort and control.</p>
                              )}
                            </div>
                            <Separator className="my-3" />
                            <Link to="/Bookings" search={{ date: selectedInfo.date }}>
                              <Button className="w-full"><CalendarDays className="h-4 w-4 mr-2" /> Book this day</Button>
                            </Link>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Separator className="my-8" />

          <div className="text-sm text-muted-foreground">
            Colors are based on forecasted maximum wind and gusts for each day. We’ll always assess actual conditions on the day and steer you to the calmest window.
          </div>
        </div>
      </section>
    </div>
  )
}
