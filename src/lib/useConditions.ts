import * as React from 'react'

import type { Rating } from '@/components/brand/primitives'
import type {
  HarbourAssessment,
  HarbourConditionsResponse,
  HarbourForecastHour,
  HarbourRideWindow,
} from '@/lib/api'
import { getAvailableTimes, getHarbourConditions } from '@/lib/api'

const LATITUDE = -34.165
const LONGITUDE = 18.866
const TIMEZONE = 'Africa/Johannesburg'
const TURNAROUND_MINUTES = 15
const FLEET_SIZE = 2

export type ForecastDay = {
  date: string
  day: string
  dateLabel: string
  temperatureMax: number | null
  temperatureMin: number | null
  windSpeed: number | null
  windGust: number | null
  swell: number | null
  wavePeriod: number | null
  swellHeight: number | null
  swellPeriod: number | null
  precipitationProbability: number | null
  sunrise: string | null
  sunset: string | null
  assessment: HarbourAssessment | null
  rating: Rating
}

export type CurrentConditions = {
  temperature: number | null
  windSpeed: number | null
  windGust: number | null
  windDirection: number | null
  swell: number | null
  wavePeriod: number | null
  swellHeight: number | null
  swellPeriod: number | null
  seaSurfaceTemperature: number | null
  precipitation: number | null
  visibility: number | null
  weatherCode: number | null
  observedAt: string | null
  assessment: HarbourAssessment | null
}

export type LaunchSlot = {
  time: string
  status: 'open' | 'unavailable' | 'enquire' | 'seasonal'
}

type ConditionsState = {
  current: CurrentConditions | null
  days: Array<ForecastDay>
  hourly: Array<HarbourForecastHour>
  bestWindows: Array<HarbourRideWindow>
  stale: boolean
  disclaimer: string | null
  source: 'backend' | 'direct'
  loading: boolean
  error: string | null
}

type AvailabilityState = {
  slots: Array<LaunchSlot>
  loading: boolean
  error: string | null
}

type Season = 'winter' | 'summer'
type SessionLength = 15 | 30 | 60

function numberAt(value: unknown, index?: number): number | null {
  const candidate = index == null && !Array.isArray(value) ? value : Array.isArray(value) ? value[index ?? 0] : null
  return typeof candidate === 'number' && Number.isFinite(candidate) ? candidate : null
}

function textAt(value: unknown, index: number): string | null {
  if (!Array.isArray(value)) return null
  return typeof value[index] === 'string' ? value[index] : null
}

export function ratingFromWind(windSpeed: number | null, windGust: number | null): Rating {
  const wind = windSpeed ?? 0
  const gust = windGust ?? wind
  if (wind < 15 && gust < 25) return 'prime'
  if (wind <= 25 && gust <= 35) return 'fair'
  return 'rough'
}

export function launchTimes(
  sessionLength: SessionLength,
  season: Season,
): Array<string> {
  const open = 9 * 60
  const close = season === 'winter' ? 17 * 60 : 19 * 60 + 45
  const result: Array<string> = []

  for (
    let time = open;
    time + sessionLength <= close;
    time += sessionLength + TURNAROUND_MINUTES
  ) {
    const hours = Math.floor(time / 60)
    const minutes = time % 60
    result.push(`${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`)
  }

  return result
}

function defaultSeason(): Season {
  const month = new Date().getMonth() + 1
  return month >= 11 || month <= 4 ? 'summer' : 'winter'
}

function advancedState(data: HarbourConditionsResponse): ConditionsState {
  const days = data.daily.map((day) => {
    const parsedDate = new Date(`${day.date}T12:00:00`)
    return {
      date: day.date,
      day: new Intl.DateTimeFormat('en-ZA', { weekday: 'short' }).format(parsedDate),
      dateLabel: new Intl.DateTimeFormat('en-ZA', {
        day: 'numeric',
        month: 'short',
      }).format(parsedDate),
      temperatureMax: day.temperatureMaxC ?? null,
      temperatureMin: day.temperatureMinC ?? null,
      windSpeed: day.windSpeedMaxKmh ?? null,
      windGust: day.windGustMaxKmh ?? null,
      swell: day.waveHeightMaxM ?? null,
      wavePeriod: day.wavePeriodMaxS ?? null,
      swellHeight: day.swellHeightMaxM ?? null,
      swellPeriod: day.swellPeriodMaxS ?? null,
      precipitationProbability: day.precipitationProbabilityMaxPct ?? null,
      sunrise: day.sunrise ?? null,
      sunset: day.sunset ?? null,
      assessment: day.assessment,
      rating: day.assessment.rating,
    } satisfies ForecastDay
  })

  return {
    current: {
      temperature: data.current.temperatureC ?? null,
      windSpeed: data.current.windSpeedKmh ?? null,
      windGust: data.current.windGustKmh ?? null,
      windDirection: data.current.windDirectionDeg ?? null,
      swell: data.current.waveHeightM ?? null,
      wavePeriod: data.current.wavePeriodS ?? null,
      swellHeight: data.current.swellHeightM ?? null,
      swellPeriod: data.current.swellPeriodS ?? null,
      seaSurfaceTemperature: data.current.seaSurfaceTemperatureC ?? null,
      precipitation: data.current.precipitationMm ?? null,
      visibility: data.current.visibilityM ?? null,
      weatherCode: data.current.weatherCode ?? null,
      observedAt: data.current.time ?? null,
      assessment: data.current.assessment,
    },
    days,
    hourly: data.hourly,
    bestWindows: data.bestWindows,
    stale: data.stale,
    disclaimer: data.disclaimer,
    source: 'backend',
    loading: false,
    error: null,
  }
}

export function useConditions() {
  const [state, setState] = React.useState<ConditionsState>({
    current: null,
    days: [],
    hourly: [],
    bestWindows: [],
    stale: false,
    disclaimer: null,
    source: 'direct',
    loading: true,
    error: null,
  })

  React.useEffect(() => {
    const controller = new AbortController()

    async function load() {
      try {
        const advanced = await getHarbourConditions()
        if (!controller.signal.aborted) setState(advancedState(advanced))
        return
      } catch {
        // Keep the public page operational until the backend revision carrying
        // the advanced endpoint is deployed, or during a backend outage.
      }

      const weatherParams = new URLSearchParams({
        latitude: String(LATITUDE),
        longitude: String(LONGITUDE),
        current:
          'temperature_2m,wind_speed_10m,wind_gusts_10m,weather_code',
        daily:
          'weather_code,temperature_2m_max,temperature_2m_min,wind_speed_10m_max,wind_gusts_10m_max',
        timezone: TIMEZONE,
        forecast_days: '7',
      })
      const marineParams = new URLSearchParams({
        latitude: String(LATITUDE),
        longitude: String(LONGITUDE),
        current: 'wave_height',
        daily: 'wave_height_max',
        timezone: TIMEZONE,
        forecast_days: '7',
      })

      try {
        const [weatherResponse, marineResponse] = await Promise.all([
          fetch(`https://api.open-meteo.com/v1/forecast?${weatherParams}`, {
            signal: controller.signal,
          }),
          fetch(`https://marine-api.open-meteo.com/v1/marine?${marineParams}`, {
            signal: controller.signal,
          }),
        ])

        if (!weatherResponse.ok) {
          throw new Error(`Weather service returned ${weatherResponse.status}`)
        }

        const weather = (await weatherResponse.json()) as Record<string, unknown>
        const marine = marineResponse.ok
          ? ((await marineResponse.json()) as Record<string, unknown>)
          : {}
        const current = (weather.current ?? {}) as Record<string, unknown>
        const marineCurrent = (marine.current ?? {}) as Record<string, unknown>
        const daily = (weather.daily ?? {}) as Record<string, unknown>
        const marineDaily = (marine.daily ?? {}) as Record<string, unknown>
        const dates = Array.isArray(daily.time) ? daily.time : []

        const days = dates.flatMap((_, index) => {
          const date = textAt(daily.time, index)
          if (!date) return []
          const parsedDate = new Date(`${date}T12:00:00`)
          const windSpeed = numberAt(daily.wind_speed_10m_max, index)
          const windGust = numberAt(daily.wind_gusts_10m_max, index)

          return [
            {
              date,
              day: new Intl.DateTimeFormat('en-ZA', { weekday: 'short' }).format(parsedDate),
              dateLabel: new Intl.DateTimeFormat('en-ZA', {
                day: 'numeric',
                month: 'short',
              }).format(parsedDate),
              temperatureMax: numberAt(daily.temperature_2m_max, index),
              temperatureMin: numberAt(daily.temperature_2m_min, index),
              windSpeed,
              windGust,
              swell: numberAt(marineDaily.wave_height_max, index),
              wavePeriod: null,
              swellHeight: null,
              swellPeriod: null,
              precipitationProbability: null,
              sunrise: null,
              sunset: null,
              assessment: null,
              rating: ratingFromWind(windSpeed, windGust),
            } satisfies ForecastDay,
          ]
        })

        setState({
          current: {
            temperature: numberAt(current.temperature_2m),
            windSpeed: numberAt(current.wind_speed_10m),
            windGust: numberAt(current.wind_gusts_10m),
            windDirection: null,
            swell: numberAt(marineCurrent.wave_height),
            wavePeriod: null,
            swellHeight: null,
            swellPeriod: null,
            seaSurfaceTemperature: null,
            precipitation: null,
            visibility: null,
            weatherCode: numberAt(current.weather_code),
            observedAt:
              typeof current.time === 'string' ? current.time : null,
            assessment: null,
          },
          days,
          hourly: [],
          bestWindows: [],
          stale: false,
          disclaimer:
            'Direct provider fallback. Final launch decision is made by the skipper at the harbour.',
          source: 'direct',
          loading: false,
          error: null,
        })
      } catch (error) {
        if (controller.signal.aborted) return
        setState((previous) => ({
          ...previous,
          loading: false,
          error:
            error instanceof Error
              ? error.message
              : 'Conditions are temporarily unavailable.',
        }))
      }
    }

    void load()
    return () => controller.abort()
  }, [])

  return state
}

export function useLaunchAvailability({
  date,
  sessionLength,
  season,
  bookingEnabled,
}: {
  date: string | null
  sessionLength: SessionLength
  season: Season
  bookingEnabled: boolean
}) {
  const [state, setState] = React.useState<AvailabilityState>({
    slots: [],
    loading: false,
    error: null,
  })

  React.useEffect(() => {
    let cancelled = false
    const schedule = launchTimes(sessionLength, season)

    if (!date || !bookingEnabled) {
      setState({
        slots: schedule.map((time) => ({ time, status: 'seasonal' })),
        loading: false,
        error: null,
      })
      return
    }

    if (sessionLength === 15) {
      setState({
        slots: schedule.map((time) => ({ time, status: 'enquire' })),
        loading: false,
        error: null,
      })
      return
    }

    setState((previous) => ({ ...previous, loading: true, error: null }))

    void getAvailableTimes(`${sessionLength}-1`, date, 1)
      .then((response) => {
        if (cancelled) return
        const openTimes = new Set(
          response.times.map((slot) =>
            typeof slot === 'string' ? slot : slot.time,
          ),
        )
        setState({
          slots: schedule.map((time) => ({
            time,
            status: openTimes.has(time) ? 'open' : 'unavailable',
          })),
          loading: false,
          error: null,
        })
      })
      .catch((error) => {
        if (cancelled) return
        setState({
          slots: schedule.map((time) => ({ time, status: 'unavailable' })),
          loading: false,
          error:
            error instanceof Error
              ? error.message
              : 'Availability is temporarily unavailable.',
        })
      })

    return () => {
      cancelled = true
    }
  }, [bookingEnabled, date, season, sessionLength])

  return state
}

export const CONDITIONS_DEFAULTS = {
  fleetSize: FLEET_SIZE,
  turnaroundMinutes: TURNAROUND_MINUTES,
  season: defaultSeason(),
} as const

export type { Season, SessionLength }
