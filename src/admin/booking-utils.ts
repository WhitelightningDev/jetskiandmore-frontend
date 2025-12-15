import type { Booking } from './types'

export type BookingWithMeta = Booking & {
  parsedDate: Date | null
  dateKey: string | null
}

const STATUS_TONES: Record<string, string> = {
  approved: 'border-emerald-400/50 bg-emerald-500/10 text-emerald-50',
  processing: 'border-amber-400/50 bg-amber-500/10 text-amber-50',
  created: 'border-slate-300/40 bg-white/5 text-slate-100',
  failed: 'border-rose-400/50 bg-rose-500/10 text-rose-50',
  cancelled: 'border-slate-500/50 bg-slate-800 text-slate-100',
}

export function withBookingMeta(bookings: Booking[]): BookingWithMeta[] {
  return bookings.map((booking) => {
    const parsedDate = parseBookingDate(booking)
    return { ...booking, parsedDate, dateKey: parsedDate ? toDateKey(parsedDate) : null }
  })
}

export function formatDateLabel(input?: Date | string | null) {
  if (!input) return '—'
  const date = input instanceof Date ? input : new Date(input)
  if (Number.isNaN(date.getTime())) return typeof input === 'string' ? input : '—'
  const day = date.getDate()
  const suffix = getOrdinalSuffix(day)
  const month = date.toLocaleString('default', { month: 'long' })
  const year = date.getFullYear()
  return `${day}${suffix} ${month} ${year}`
}

export function formatRideTime(value?: string | null) {
  if (!value) return '—'
  const parsed = parseTimeParts(value)
  if (!parsed) return value.trim()
  const { hours24, minutes } = parsed
  const suffix = hours24 >= 12 ? 'PM' : 'AM'
  const hours12 = ((hours24 + 11) % 12) + 1
  return `${hours12}:${String(minutes).padStart(2, '0')} ${suffix}`
}

export function timeSortValue(value?: string | null) {
  const parsed = parseTimeParts(value)
  if (!parsed) return Number.POSITIVE_INFINITY
  return parsed.hours24 * 60 + parsed.minutes
}

function parseBookingDate(booking: Booking): Date | null {
  if (!booking.date) return null
  const d = new Date(booking.date)
  return Number.isNaN(d.getTime()) ? null : d
}

export function toDateKey(date: Date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function statusTone(status?: string | null) {
  const key = (status || '').toLowerCase()
  return STATUS_TONES[key] || 'border-cyan-400/40 bg-cyan-500/10 text-cyan-50'
}

export function statusLabel(status?: string | null) {
  if (!status) return 'Pending'
  return status.slice(0, 1).toUpperCase() + status.slice(1)
}

function getOrdinalSuffix(day: number) {
  if (day >= 11 && day <= 13) return 'th'
  switch (day % 10) {
    case 1:
      return 'st'
    case 2:
      return 'nd'
    case 3:
      return 'rd'
    default:
      return 'th'
  }
}

function parseTimeParts(raw?: string | null) {
  if (!raw) return null
  const value = raw.trim()

  // 09:30, 9:30, 09.30, 09:30am, 9:30 PM
  const colonOrDot = value.match(/^(\d{1,2})[:.](\d{2})(?:\s*(am|pm))?$/i)
  if (colonOrDot) {
    const hours = Number(colonOrDot[1])
    const minutes = Number(colonOrDot[2])
    const suffix = colonOrDot[3]?.toLowerCase()
    if (Number.isNaN(hours) || Number.isNaN(minutes)) return null
    return {
      hours24: to24Hour(hours, minutes, suffix),
      minutes: clampMinutes(minutes),
    }
  }

  // 09h30 or 9h30
  const hSeparator = value.match(/^(\d{1,2})h(\d{2})$/i)
  if (hSeparator) {
    const hours = Number(hSeparator[1])
    const minutes = Number(hSeparator[2])
    if (Number.isNaN(hours) || Number.isNaN(minutes)) return null
    return { hours24: clampHours(hours), minutes: clampMinutes(minutes) }
  }

  // 9am, 9 pm, 12PM
  const hourOnly = value.match(/^(\d{1,2})(?:\s*(am|pm))$/i)
  if (hourOnly) {
    const hours = Number(hourOnly[1])
    const suffix = hourOnly[2]?.toLowerCase()
    if (Number.isNaN(hours)) return null
    return { hours24: to24Hour(hours, 0, suffix), minutes: 0 }
  }

  return null
}

function to24Hour(hours: number, minutes: number, suffix?: string) {
  const clampedMinutes = clampMinutes(minutes)
  if (!suffix) return clampHours(hours)
  const normalized = clampHours(hours % 12)
  return suffix === 'pm' ? normalized + 12 : normalized
}

function clampHours(hours: number) {
  if (Number.isNaN(hours) || hours < 0) return 0
  if (hours > 23) return 23
  return hours
}

function clampMinutes(minutes: number) {
  if (Number.isNaN(minutes) || minutes < 0) return 0
  if (minutes > 59) return 59
  return minutes
}
