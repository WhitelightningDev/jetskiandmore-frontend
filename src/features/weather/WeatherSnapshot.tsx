import { CloudSun, Thermometer, Wind } from 'lucide-react'
import { WeatherCardSkeleton } from '@/features/weather/WeatherCardSkeleton'

export type Severity = 'good' | 'ok' | 'bad'
export type Weather = {
  temperature: number | null
  wind: number | null
  gust: number | null
  direction: number | null
  code: number | null
  label: string
  severity: Severity
} | null

export type Forecast = {
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

// Must mirror the page helpers so colors match site-wide
export function severityClasses(sev: Severity) {
  if (sev === 'bad') return 'bg-gradient-to-r from-rose-50 to-rose-100 border-rose-200'
  if (sev === 'ok') return 'bg-gradient-to-r from-amber-50 to-amber-100 border-amber-200'
  return 'bg-gradient-to-r from-emerald-50 to-emerald-100 border-emerald-200'
}
export function degToCompass(deg?: number | null): string {
  const d = Number(deg)
  if (!Number.isFinite(d)) return '—'
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
  return dirs[Math.round(d / 45) % 8]
}

function WeatherLegend() {
  return (
    <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
      <span className="flex items-center gap-2">
        <span aria-hidden className="inline-block h-3 w-3 rounded-full bg-emerald-500/80 ring-2 ring-emerald-200" />
        Good (calm / light winds)
      </span>
      <span className="flex items-center gap-2">
        <span aria-hidden className="inline-block h-3 w-3 rounded-full bg-amber-500/80 ring-2 ring-amber-200" />
        Ok (moderate winds)
      </span>
      <span className="flex items-center gap-2">
        <span aria-hidden className="inline-block h-3 w-3 rounded-full bg-rose-500/80 ring-2 ring-rose-200" />
        Bad (strong winds / rough)
      </span>
    </div>
  )
}

export function WeatherSnapshot({ weather, forecast, date }: { weather: Weather; forecast: Forecast; date?: Date }) {
  const loadingWeather = weather === null
  const wantsForecast = Boolean(date)
  const showForecast = Boolean(forecast) || wantsForecast

  return (
    <div className="space-y-2">
      <div className={`grid grid-cols-1 ${showForecast ? 'md:grid-cols-2' : ''} gap-3`}>
        <div className={`rounded-md border p-3 ${weather ? severityClasses(weather.severity) : 'border-muted bg-muted'}`}>
          <div className="flex items-center gap-2 mb-1">
            <CloudSun className="h-5 w-5" />
            <span className="font-medium">Now</span>
          </div>
          {loadingWeather ? <WeatherCardSkeleton /> : weather ? (
            <div className="text-sm flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="text-muted-foreground">{weather.label}</span>
              <span className="flex items-center gap-1"><Thermometer className="h-4 w-4" /> {Number.isFinite(weather.temperature) ? weather.temperature!.toFixed(0) : '—'}°C</span>
              <span className="flex items-center gap-1"><Wind className="h-4 w-4" /> {Number.isFinite(weather.wind) ? weather.wind!.toFixed(0) : '—'} km/h</span>
              <span className="flex items-center gap-1"><Wind className="h-4 w-4 rotate-45" /> Gusts {Number.isFinite(weather.gust) ? weather.gust!.toFixed(0) : '—'} km/h</span>
              <span className="flex items-center gap-1">Dir {degToCompass(weather.direction)}</span>
            </div>
          ) : null}
        </div>

        {showForecast ? (
          <div className={`rounded-md border p-3 ${forecast ? severityClasses(forecast.severity) : 'border-muted bg-muted'}`}>
            <div className="flex items-center gap-2 mb-1">
              <CloudSun className="h-5 w-5" />
              <span className="font-medium">Selected day</span>
            </div>
            {!forecast ? <WeatherCardSkeleton /> : (
              <div className="text-sm flex flex-wrap items-center gap-x-3 gap-y-1">
                <span className="text-muted-foreground">{forecast.label}</span>
                <span className="flex items-center gap-1"><Thermometer className="h-4 w-4" /> {Number.isFinite(forecast.tempMax) ? forecast.tempMax!.toFixed(0) : '—'}°C max</span>
                <span className="flex items-center gap-1"><Wind className="h-4 w-4" /> Max wind {Number.isFinite(forecast.windMax) ? forecast.windMax!.toFixed(0) : '—'} km/h</span>
                <span className="flex items-center gap-1"><Wind className="h-4 w-4 rotate-45" /> Max gusts {Number.isFinite(forecast.gustMax) ? forecast.gustMax!.toFixed(0) : '—'} km/h</span>
                <span className="flex items-center gap-1">Dir {degToCompass(forecast.direction)}</span>
              </div>
            )}
          </div>
        ) : null}
      </div>
      <WeatherLegend />
    </div>
  )
}