import * as React from 'react'
import {
  CloudRain,
  CloudSun,
  Eye,
  Navigation,
  RefreshCw,
  ThermometerSun,
  Waves,
  Wind,
} from 'lucide-react'

import type {
  ForecastDay,
  Season,
  SessionLength,
} from '@/lib/useConditions'
import { BrandButton, Panel, RatingPill } from '@/components/brand/primitives'
import { useBookingControls } from '@/lib/bookingControls'
import {
  CONDITIONS_DEFAULTS,
  launchTimes,
  useConditions,
  useLaunchAvailability,
} from '@/lib/useConditions'
import { cn } from '@/lib/utils'

function metric(value: number | null | undefined, suffix: string, digits = 0) {
  return value == null ? '—' : `${value.toFixed(digits)}${suffix}`
}

function direction(value: number | null | undefined) {
  if (value == null) return '—'
  const labels = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
  return `${labels[Math.round(value / 45) % 8]} ${value.toFixed(0)}°`
}

function windowTime(value: string) {
  const [date, time = ''] = value.split('T')
  const label = new Intl.DateTimeFormat('en-ZA', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    timeZone: 'UTC',
  }).format(new Date(`${date}T12:00:00Z`))
  return `${label}, ${time.slice(0, 5)}`
}

function hourTime(value: string) {
  return value.split('T')[1]?.slice(0, 5) ?? value
}

export function ConditionsBoard({ compact = false }: { compact?: boolean }) {
  const conditions = useConditions()
  const { controls } = useBookingControls()
  const [selectedDate, setSelectedDate] = React.useState<string | null>(null)
  const [sessionLength, setSessionLength] = React.useState<SessionLength>(30)
  const [season, setSeason] = React.useState<Season>(CONDITIONS_DEFAULTS.season)
  const fallbackDay = conditions.days.at(0) ?? null
  const selectedDay: ForecastDay | null = selectedDate
    ? conditions.days.find((day) => day.date === selectedDate) ?? fallbackDay
    : fallbackDay
  const schedule = launchTimes(sessionLength, season)
  const availability = useLaunchAvailability({
    date: selectedDay ? selectedDay.date : null,
    sessionLength,
    season,
    bookingEnabled: controls.jetSkiBookingsEnabled,
  })
  const openSlots = availability.slots.filter((slot) => slot.status === 'open').length
  const capacity = schedule.length * CONDITIONS_DEFAULTS.fleetSize
  const selectedHours = selectedDay
    ? conditions.hourly.filter((hour) => hour.time.startsWith(selectedDay.date))
    : []

  return (
    <div className="space-y-5">
      <Panel className="overflow-hidden">
        <div className="grid gap-0 lg:grid-cols-[0.74fr_2.26fr]">
          <div className="border-b border-brand-line bg-brand-surface-alt p-6 lg:border-b-0 lg:border-r sm:p-7">
            <div className="flex items-center gap-2 text-[11.5px] font-bold tracking-[0.14em] text-brand-teal">
              <CloudSun className="h-4 w-4" aria-hidden />
              NOW AT THE HARBOUR
            </div>
            {conditions.loading ? (
              <div className="mt-5 space-y-3" aria-label="Loading current conditions">
                <div className="h-10 w-28 animate-pulse rounded-lg bg-brand-line" />
                <div className="h-4 w-40 animate-pulse rounded bg-brand-line-soft" />
              </div>
            ) : (
              <>
                <div className="mt-4 font-display text-[36px] font-extrabold tracking-[-0.03em] text-brand-ink">
                  {metric(conditions.current?.temperature, '°C')}
                </div>
                {conditions.current?.assessment ? (
                  <div className="mt-3 flex items-center gap-2">
                    <RatingPill rating={conditions.current.assessment.rating} />
                    <span className="text-[12px] font-bold text-brand-body">
                      {conditions.current.assessment.score}/100 ·{' '}
                      {conditions.current.assessment.confidence} confidence
                    </span>
                  </div>
                ) : null}
                <div className="mt-4 grid grid-cols-2 gap-4 text-[13px] text-brand-muted">
                  <div>
                    <div className="flex items-center gap-1.5 font-semibold text-brand-faint">
                      <Wind className="h-3.5 w-3.5" aria-hidden />
                      Wind
                    </div>
                    <div className="mt-1 font-bold text-brand-ink">
                      {metric(conditions.current?.windSpeed, ' km/h')}
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 font-semibold text-brand-faint">
                      <Waves className="h-3.5 w-3.5" aria-hidden />
                      Waves
                    </div>
                    <div className="mt-1 font-bold text-brand-ink">
                      {metric(conditions.current?.swell, ' m', 1)}
                    </div>
                  </div>
                </div>
                <div className="mt-4 space-y-1.5 border-t border-brand-line-soft pt-4 text-[12.5px] text-brand-muted">
                  <div className="flex items-center justify-between gap-3">
                    <span className="flex items-center gap-1.5">
                      <Navigation className="h-3.5 w-3.5" aria-hidden />
                      Wind direction
                    </span>
                    <strong className="text-brand-ink">
                      {direction(conditions.current?.windDirection)}
                    </strong>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="flex items-center gap-1.5">
                      <Eye className="h-3.5 w-3.5" aria-hidden />
                      Visibility
                    </span>
                    <strong className="text-brand-ink">
                      {metric(
                        conditions.current?.visibility == null
                          ? null
                          : conditions.current.visibility / 1000,
                        ' km',
                        1,
                      )}
                    </strong>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="flex items-center gap-1.5">
                      <ThermometerSun className="h-3.5 w-3.5" aria-hidden />
                      Sea temperature
                    </span>
                    <strong className="text-brand-ink">
                      {metric(conditions.current?.seaSurfaceTemperature, '°C', 1)}
                    </strong>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="flex items-center gap-1.5">
                      <CloudRain className="h-3.5 w-3.5" aria-hidden />
                      Precipitation
                    </span>
                    <strong className="text-brand-ink">
                      {metric(conditions.current?.precipitation, ' mm', 1)}
                    </strong>
                  </div>
                </div>
                <p className="mt-5 text-[12.5px] leading-relaxed text-brand-faint">
                  {conditions.stale ? 'Cached last-known guidance. ' : ''}
                  Final launch decision is always made at the harbour.
                </p>
              </>
            )}
          </div>

          <div className="p-5 sm:p-7">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <div className="text-[11.5px] font-bold tracking-[0.14em] text-brand-teal">
                  NEXT 7 DAYS
                </div>
                <p className="mt-1.5 text-[13.5px] text-brand-muted">
                  Select a day to inspect conditions and launch times.
                </p>
              </div>
              {conditions.error ? (
                <span className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-rough-fg">
                  <RefreshCw className="h-3.5 w-3.5" aria-hidden />
                  Live forecast unavailable
                </span>
              ) : null}
            </div>

            <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4 xl:grid-cols-7">
              {conditions.loading
                ? Array.from({ length: 7 }, (_, index) => (
                    <div
                      key={index}
                      className="h-[150px] animate-pulse rounded-[14px] bg-brand-line-soft"
                    />
                  ))
                : conditions.days.map((day) => {
                    const active = selectedDay ? selectedDay.date === day.date : false
                    return (
                      <button
                        key={day.date}
                        type="button"
                        onClick={() => setSelectedDate(day.date)}
                        className={cn(
                          'rounded-[14px] border p-3.5 text-left transition-colors',
                          active
                            ? 'border-brand-teal bg-brand-tint shadow-[0_0_0_1px_#0E7C8B]'
                            : 'border-brand-line bg-white hover:border-brand-teal',
                        )}
                      >
                        <div className="font-display text-[15px] font-bold text-brand-ink">
                          {day.day}
                        </div>
                        <div className="mt-0.5 text-[12px] text-brand-faint">
                          {day.dateLabel}
                        </div>
                        <RatingPill rating={day.rating} className="mt-3" />
                        <div className="mt-3 text-[12.5px] leading-[1.65] text-brand-muted">
                          <div>
                            Wind{' '}
                            <strong className="text-brand-ink">
                              {metric(day.windSpeed, ' km/h')}
                            </strong>
                          </div>
                          <div>
                            Gusts{' '}
                            <strong className="text-brand-ink">
                              {metric(day.windGust, ' km/h')}
                            </strong>
                          </div>
                          <div>
                            Waves{' '}
                            <strong className="text-brand-ink">
                              {metric(day.swell, ' m', 1)}
                            </strong>
                          </div>
                          <div>
                            Rain{' '}
                            <strong className="text-brand-ink">
                              {metric(day.precipitationProbability, '%')}
                            </strong>
                          </div>
                        </div>
                      </button>
                    )
                  })}
            </div>
          </div>
        </div>
      </Panel>

      {!compact && conditions.bestWindows.length > 0 ? (
        <Panel className="p-5 sm:p-8">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <div className="text-[11.5px] font-bold tracking-[0.16em] text-brand-teal">
                BEST RIDING WINDOWS
              </div>
              <h3 className="mt-2 font-display text-[23px] font-extrabold tracking-[-0.02em] text-brand-ink sm:text-[28px]">
                Strongest two-hour forecast windows
              </h3>
            </div>
            <span className="text-[12.5px] font-semibold text-brand-faint">
              Ranked by wind, gusts, waves, rain and visibility
            </span>
          </div>
          <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {conditions.bestWindows.map((window) => (
              <div
                key={`${window.startsAt}-${window.endsAt}`}
                className="rounded-[16px] border border-brand-line-cool bg-brand-surface p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-display text-[16px] font-extrabold text-brand-ink">
                      {windowTime(window.startsAt)}
                    </div>
                    <div className="mt-1 text-[12.5px] text-brand-faint">
                      Until {hourTime(window.endsAt)}
                    </div>
                  </div>
                  <RatingPill rating={window.rating} />
                </div>
                <div className="mt-4 text-[13.5px] leading-relaxed text-brand-muted">
                  {window.summary}
                </div>
                <div className="mt-4 text-[12px] font-bold tracking-[0.08em] text-brand-teal">
                  PLANNING SCORE {window.score}/100
                </div>
              </div>
            ))}
          </div>
        </Panel>
      ) : null}

      {!compact && selectedHours.length > 0 ? (
        <Panel className="overflow-hidden">
          <div className="flex flex-wrap items-end justify-between gap-3 border-b border-brand-line-soft px-5 py-6 sm:px-8">
            <div>
              <div className="text-[11.5px] font-bold tracking-[0.16em] text-brand-teal">
                HOURLY DETAIL
              </div>
              <h3 className="mt-2 font-display text-[23px] font-extrabold tracking-[-0.02em] text-brand-ink sm:text-[28px]">
                {selectedDay
                  ? `${selectedDay.day} ${selectedDay.dateLabel}`
                  : 'Selected day'}
              </h3>
            </div>
            <span className="text-[12.5px] font-semibold text-brand-faint">
              Harbour operating hours · local time
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] border-collapse text-left">
              <thead className="bg-brand-surface-alt text-[11px] font-bold tracking-[0.1em] text-brand-faint">
                <tr>
                  <th className="px-5 py-3 sm:pl-8">TIME</th>
                  <th className="px-4 py-3">GUIDANCE</th>
                  <th className="px-4 py-3">WIND / GUST</th>
                  <th className="px-4 py-3">WAVE / PERIOD</th>
                  <th className="px-4 py-3">SWELL</th>
                  <th className="px-4 py-3">RAIN</th>
                  <th className="px-4 py-3 sm:pr-8">VISIBILITY</th>
                </tr>
              </thead>
              <tbody>
                {selectedHours
                  .filter((hour) => {
                    const localHour = Number(hour.time.slice(11, 13))
                    return localHour >= 8 && localHour <= 20
                  })
                  .map((hour) => (
                    <tr
                      key={hour.time}
                      className="border-t border-brand-line-soft text-[13px] text-brand-body"
                    >
                      <td className="whitespace-nowrap px-5 py-4 font-display font-extrabold text-brand-ink sm:pl-8">
                        {hourTime(hour.time)}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <RatingPill rating={hour.assessment.rating} />
                          <span className="font-bold text-brand-muted">
                            {hour.assessment.score}
                          </span>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-4 py-4">
                        <strong className="text-brand-ink">
                          {metric(hour.windSpeedKmh, '')}
                        </strong>
                        {' / '}
                        {metric(hour.windGustKmh, ' km/h')}
                      </td>
                      <td className="whitespace-nowrap px-4 py-4">
                        <strong className="text-brand-ink">
                          {metric(hour.waveHeightM, ' m', 1)}
                        </strong>
                        {' / '}
                        {metric(hour.wavePeriodS, ' s', 1)}
                      </td>
                      <td className="whitespace-nowrap px-4 py-4">
                        {metric(hour.swellHeightM, ' m', 1)}
                        {' / '}
                        {metric(hour.swellPeriodS, ' s', 1)}
                      </td>
                      <td className="whitespace-nowrap px-4 py-4">
                        {metric(hour.precipitationProbabilityPct, '%')}
                      </td>
                      <td className="whitespace-nowrap px-4 py-4 sm:pr-8">
                        {metric(
                          hour.visibilityM == null ? null : hour.visibilityM / 1000,
                          ' km',
                          1,
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-brand-line-soft bg-brand-surface-alt px-5 py-4 text-[12.5px] leading-relaxed text-brand-faint sm:px-8">
            <span>{conditions.disclaimer}</span>
            <span className="font-bold text-brand-muted">
              {conditions.source === 'backend'
                ? 'Server-cached advanced forecast'
                : 'Direct weather fallback'}
            </span>
          </div>
        </Panel>
      ) : null}

      <Panel className="overflow-hidden">
        <div className="flex flex-wrap items-start justify-between gap-5 border-b border-brand-line-soft px-5 py-6 sm:px-8">
          <div>
            <div className="text-[11.5px] font-bold tracking-[0.16em] text-brand-teal">
              LAUNCH BOARD
            </div>
            <h3 className="mt-2 font-display text-[23px] font-extrabold tracking-[-0.02em] text-brand-ink sm:text-[28px]">
              {selectedDay
                ? `${selectedDay.day} ${selectedDay.dateLabel}`
                : 'Choose a forecast day'}
              {' · '}
              {!controls.jetSkiBookingsEnabled
                ? 'seasonal enquiries'
                : availability.loading
                  ? 'checking availability'
                  : `${openSlots} launch times open`}
            </h3>
            <p className="mt-2 text-[14px] text-brand-muted">
              {season === 'winter' ? 'Winter' : 'Summer'} hours ·{' '}
              {season === 'winter' ? '09:00–17:00' : '09:00–19:45'} ·{' '}
              {CONDITIONS_DEFAULTS.fleetSize} skis per launch · {sessionLength} minute session.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <div className="flex items-center rounded-xl bg-brand-tint-cool p-1">
              {[15, 30, 60].map((minutes) => (
                <button
                  key={minutes}
                  type="button"
                  onClick={() => setSessionLength(minutes as SessionLength)}
                  className={cn(
                    'rounded-lg px-3 py-2 text-[13px] font-bold transition-colors',
                    sessionLength === minutes
                      ? 'bg-brand-teal text-white'
                      : 'text-brand-muted hover:text-brand-ink',
                  )}
                >
                  {minutes} min
                </button>
              ))}
            </div>
            <div className="flex items-center rounded-xl bg-brand-tint-cool p-1">
              {(['winter', 'summer'] as const).map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setSeason(option)}
                  className={cn(
                    'rounded-lg px-3 py-2 text-[13px] font-bold capitalize transition-colors',
                    season === option
                      ? 'bg-brand-deep text-white'
                      : 'text-brand-muted hover:text-brand-ink',
                  )}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div
          className={cn(
            'grid gap-2.5 px-5 py-5 sm:px-8',
            compact
              ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'
              : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4',
          )}
        >
          {(compact ? availability.slots.slice(0, 8) : availability.slots).map(
            (slot) => (
              <div
                key={slot.time}
                className="rounded-[14px] border border-brand-line-cool bg-brand-surface px-4 py-4"
              >
                <div className="font-display text-[16px] font-extrabold text-brand-ink">
                  {slot.time}
                </div>
                <span
                  className={cn(
                    'mt-2.5 inline-block rounded-full px-2.5 py-1 text-[11px] font-bold',
                    slot.status === 'open' && 'bg-prime-bg text-prime-fg',
                    slot.status === 'unavailable' && 'bg-rough-bg text-rough-fg',
                    slot.status === 'enquire' && 'bg-fair-bg text-fair-fg',
                    slot.status === 'seasonal' &&
                      'bg-brand-tint-cool text-brand-muted',
                  )}
                >
                  {slot.status === 'open'
                    ? 'OPEN'
                    : slot.status === 'unavailable'
                      ? 'UNAVAILABLE'
                      : slot.status === 'enquire'
                        ? 'ENQUIRE'
                        : 'SEASONAL'}
                </span>
              </div>
            ),
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-brand-line-soft bg-brand-surface-alt px-5 py-5 text-[13.5px] text-brand-body sm:px-8">
          <p className="max-w-[760px] leading-relaxed">
            Capacity model: {schedule.length} launches × {CONDITIONS_DEFAULTS.fleetSize}{' '}
            skis = <strong className="text-brand-ink">{capacity} craft slots</strong>.
            Live availability is checked against the booking system for 30 and 60
            minute rides; 15 minute tasters are confirmed manually.
          </p>
          <div className="flex flex-wrap gap-2">
            <BrandButton to="/weather" tone="outline" size="sm">
              Full forecast
            </BrandButton>
            <BrandButton
              to={
                controls.jetSkiBookingsEnabled && sessionLength !== 15
                  ? '/Bookings'
                  : '/contact'
              }
              size="sm"
            >
              {controls.jetSkiBookingsEnabled && sessionLength !== 15
                ? 'Hold this slot'
                : 'Ask about a slot'}
            </BrandButton>
          </div>
        </div>
      </Panel>
    </div>
  )
}
