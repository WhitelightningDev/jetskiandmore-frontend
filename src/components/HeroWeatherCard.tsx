import * as React from 'react'
import { Link } from '@tanstack/react-router'
import { CloudSun, Thermometer, Wind, Waves, AlertTriangle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

type Severity = 'good' | 'ok' | 'bad'

type LiveConditions = {
  time?: string
  temperature?: number
  windSpeed?: number
  windGusts?: number
  windDirection?: number
  weatherCode?: number
  label?: string
  waveHeightMin?: number
  waveHeightMax?: number
  severity: Severity
}

function weatherCodeToText(code?: number): string {
  const map: Record<number, string> = {
    0: 'Clear',
    1: 'Mainly clear',
    2: 'Partly cloudy',
    3: 'Overcast',
    45: 'Fog',
    48: 'Rime fog',
    51: 'Light drizzle',
    53: 'Drizzle',
    55: 'Heavy drizzle',
    56: 'Freezing drizzle',
    57: 'Freezing drizzle',
    61: 'Light rain',
    63: 'Rain',
    65: 'Heavy rain',
    66: 'Freezing rain',
    67: 'Freezing rain',
    71: 'Light snow',
    73: 'Snow',
    75: 'Heavy snow',
    77: 'Snow grains',
    80: 'Light showers',
    81: 'Showers',
    82: 'Heavy showers',
    85: 'Snow showers',
    86: 'Heavy snow showers',
    95: 'Thunderstorm',
    96: 'Thunder w/ hail',
    99: 'Thunder w/ hail',
  }
  const c = Number(code)
  return Number.isFinite(c) ? (map[c] ?? 'Unknown') : '—'
}

function degToCompass(deg?: number): string {
  const d = Number(deg)
  if (!Number.isFinite(d)) return '—'
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
  return dirs[Math.round(d / 45) % 8]
}

function compassToWord(compass: string): string {
  const map: Record<string, string> = {
    N: 'North',
    NE: 'Northeast',
    E: 'East',
    SE: 'Southeast',
    S: 'South',
    SW: 'Southwest',
    W: 'West',
    NW: 'Northwest',
  }
  return map[compass] ?? compass
}

function isSouthEasterly(dir?: number): boolean {
  const d = Number(dir)
  if (!Number.isFinite(d)) return false
  const norm = ((d % 360) + 360) % 360
  return norm >= 112.5 && norm <= 157.5
}

function severityFromConditions(
  windSpeed?: number,
  windGusts?: number,
  windDirection?: number,
  waveHeightMax?: number,
): Severity {
  const s = Number(windSpeed ?? 0)
  const g = Number(windGusts ?? 0)
  const w = Number(waveHeightMax ?? 0)
  if (isSouthEasterly(windDirection)) return 'bad'
  if (s >= 40 || g >= 60 || w >= 1.8) return 'bad'
  if (s >= 25 || g >= 45 || w >= 1.2) return 'ok'
  return 'good'
}

function severityPill(sev: Severity) {
  if (sev === 'bad') return { label: 'Not recommended', className: 'bg-rose-100 text-rose-700 border-rose-200' }
  if (sev === 'ok') return { label: 'Caution advised', className: 'bg-rose-50 text-rose-700 border-rose-200' }
  return { label: 'Good conditions', className: 'bg-emerald-50 text-emerald-700 border-emerald-200' }
}

function narrative(c: LiveConditions) {
  const temp = Number.isFinite(c.temperature) ? `${c.temperature!.toFixed(0)}°C` : '—'
  const wind = Number.isFinite(c.windSpeed) ? `${c.windSpeed!.toFixed(0)} km/h` : '—'
  const dir = compassToWord(degToCompass(c.windDirection))
  const waves =
    Number.isFinite(c.waveHeightMin) && Number.isFinite(c.waveHeightMax)
      ? `${c.waveHeightMin!.toFixed(1)} to ${c.waveHeightMax!.toFixed(1)} m`
      : '—'
  const base = `Temperature is around ${temp} with ${c.label ?? 'current'} conditions. Wind is about ${wind} from ${dir}.`

  if (c.severity === 'bad') {
    return `${base} Waves are around ${waves}. Conditions can be rough — we may delay jet ski rides for safety.`
  }
  if (c.severity === 'ok') {
    return `${base} Waves are around ${waves}. Expect moderate conditions — cautious riders should consider the calmest time window.`
  }
  return `${base} Waves are around ${waves}. Looks suitable for a comfortable ride window.`
}

export default function HeroWeatherCard() {
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [cond, setCond] = React.useState<LiveConditions | null>(null)

  React.useEffect(() => {
    const ac = new AbortController()
    ;(async () => {
      try {
        setLoading(true)
        setError(null)

        const tz = 'Africa/Johannesburg'
        const lat = -34.165
        const lon = 18.866
        const weatherUrl =
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
          `&current=temperature_2m,wind_speed_10m,wind_gusts_10m,wind_direction_10m,weather_code` +
          `&timezone=${encodeURIComponent(tz)}`
        const marineUrl =
          `https://marine-api.open-meteo.com/v1/marine?latitude=${lat}&longitude=${lon}` +
          `&hourly=wave_height&timezone=${encodeURIComponent(tz)}&forecast_days=1`

        const [weatherRes, marineRes] = await Promise.all([
          fetch(weatherUrl, { signal: ac.signal }),
          fetch(marineUrl, { signal: ac.signal }),
        ])
        if (!weatherRes.ok) throw new Error(`Weather HTTP ${weatherRes.status}`)
        if (!marineRes.ok) throw new Error(`Marine HTTP ${marineRes.status}`)
        const [weatherJson, marineJson] = await Promise.all([weatherRes.json(), marineRes.json()])

        const cur = weatherJson?.current ?? {}
        const curTime = typeof cur.time === 'string' ? cur.time : undefined
        const temperature = typeof cur.temperature_2m === 'number' ? cur.temperature_2m : undefined
        const windSpeed = typeof cur.wind_speed_10m === 'number' ? cur.wind_speed_10m : undefined
        const windGusts = typeof cur.wind_gusts_10m === 'number' ? cur.wind_gusts_10m : undefined
        const windDirection = typeof cur.wind_direction_10m === 'number' ? cur.wind_direction_10m : undefined
        const weatherCode = typeof cur.weather_code === 'number' ? cur.weather_code : undefined
        const label = weatherCodeToText(weatherCode)

        const marineTimes: string[] = marineJson?.hourly?.time ?? []
        const waves: number[] = marineJson?.hourly?.wave_height ?? []
        const idx = curTime ? marineTimes.indexOf(curTime) : -1
        const sliceStart = idx >= 0 ? idx : 0
        const slice = waves.slice(sliceStart, sliceStart + 3).filter((n) => typeof n === 'number' && Number.isFinite(n))
        const waveHeightMin = slice.length ? Math.min(...slice) : undefined
        const waveHeightMax = slice.length ? Math.max(...slice) : undefined

        const sev = severityFromConditions(windSpeed, windGusts, windDirection, waveHeightMax)

        setCond({
          time: curTime,
          temperature,
          windSpeed,
          windGusts,
          windDirection,
          weatherCode,
          label,
          waveHeightMin,
          waveHeightMax,
          severity: sev,
        })
      } catch (e: any) {
        if (e?.name === 'AbortError') return
        setError(e?.message || 'Failed to load weather')
        setCond(null)
      } finally {
        setLoading(false)
      }
    })()

    return () => ac.abort()
  }, [])

  const sev = cond?.severity ?? 'ok'
  const pill = severityPill(sev)

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_30px_90px_-70px_rgba(15,23,42,0.55)]">
      <div className="flex flex-col gap-3 border-b border-slate-200 bg-slate-50/80 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-0.5">
          <p className="text-base font-semibold text-slate-900">Gordon&apos;s Bay — Live Weather</p>
          <p className="text-xs text-slate-500">Auto-generated conditions snapshot</p>
        </div>
        <Badge variant="outline" className={cn('w-fit rounded-full px-3 py-1 text-xs font-semibold', pill.className)}>
          {sev === 'good' ? (
            <CloudSun className="mr-1.5 h-3.5 w-3.5" />
          ) : (
            <AlertTriangle className="mr-1.5 h-3.5 w-3.5" />
          )}
          {pill.label}
        </Badge>
      </div>

      <div className="px-6 py-5">
        {loading ? (
          <div className="space-y-4">
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="h-16 rounded-2xl bg-slate-100 animate-pulse" />
              <div className="h-16 rounded-2xl bg-slate-100 animate-pulse" />
            </div>
            <div className="h-12 rounded-2xl bg-slate-100 animate-pulse" />
            <div className="h-10 rounded-2xl bg-slate-100 animate-pulse" />
          </div>
        ) : error ? (
          <div className="text-sm text-rose-700">{error}</div>
        ) : cond ? (
          <div className="space-y-4">
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-50 ring-1 ring-amber-100">
                  <Thermometer className="h-5 w-5 text-amber-600" aria-hidden />
                </span>
                <div className="leading-tight">
                  <p className="text-3xl font-semibold text-slate-900">
                    {Number.isFinite(cond.temperature) ? cond.temperature!.toFixed(0) : '—'}°C
                  </p>
                  <p className="text-sm text-slate-500">{cond.label ?? '—'}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 sm:justify-end">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-50 ring-1 ring-sky-100">
                  <Wind className="h-5 w-5 text-sky-700" aria-hidden />
                </span>
                <div className="leading-tight sm:text-right">
                  <p className="text-3xl font-semibold text-slate-900">
                    {Number.isFinite(cond.windSpeed) ? cond.windSpeed!.toFixed(0) : '—'} km/h
                  </p>
                  <p className="text-sm text-slate-500">{compassToWord(degToCompass(cond.windDirection))}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3 ring-1 ring-slate-100">
              <Waves className="h-5 w-5 text-sky-700" aria-hidden />
              <p className="text-sm font-medium text-slate-900">
                Waves:{' '}
                <span className="font-semibold">
                  {Number.isFinite(cond.waveHeightMin) && Number.isFinite(cond.waveHeightMax)
                    ? `${cond.waveHeightMin!.toFixed(1)} - ${cond.waveHeightMax!.toFixed(1)} meters`
                    : '—'}
                </span>
              </p>
            </div>

            <p className="text-sm leading-relaxed text-slate-600">{narrative(cond)}</p>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-slate-500">
                {cond.time ? `Updated for ${cond.time.replace('T', ' ').slice(0, 16)}` : 'Updated for the current hour'}.
              </p>
              <Link to="/weather" className="inline-flex items-center gap-2 text-xs font-semibold text-sky-800 hover:text-sky-900">
                <CloudSun className="h-4 w-4" aria-hidden />
                View full forecast
              </Link>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}
