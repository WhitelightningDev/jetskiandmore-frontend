import * as React from 'react'

import { API_BASE } from '@/lib/api'

export type BookingControls = {
  jetSkiBookingsEnabled: boolean
  boatRideBookingsEnabled: boolean
  fishingChartersBookingsEnabled: boolean
  updatedAt?: string | null
}

export const DEFAULT_BOOKING_CONTROLS: BookingControls = {
  // Match backend defaults (and the site's current "closed season" posture).
  jetSkiBookingsEnabled: false,
  boatRideBookingsEnabled: true,
  fishingChartersBookingsEnabled: true,
  updatedAt: null,
}

type BookingControlsContextValue = {
  controls: BookingControls
  loading: boolean
  error: string | null
  refresh: () => Promise<void>
}

const BookingControlsContext = React.createContext<BookingControlsContextValue | null>(null)

function readStoredControls(): BookingControls | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem('jsm_booking_controls')
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') return null
    return {
      jetSkiBookingsEnabled: Boolean((parsed as any).jetSkiBookingsEnabled),
      boatRideBookingsEnabled: Boolean((parsed as any).boatRideBookingsEnabled),
      fishingChartersBookingsEnabled: Boolean((parsed as any).fishingChartersBookingsEnabled),
      updatedAt: (parsed as any).updatedAt ?? null,
    }
  } catch {
    return null
  }
}

export function BookingControlsProvider({ children }: { children: React.ReactNode }) {
  const [controls, setControls] = React.useState<BookingControls>(() => readStoredControls() ?? DEFAULT_BOOKING_CONTROLS)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  const refresh = React.useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await fetch(`${API_BASE}/api/booking-controls`)
      if (!res.ok) {
        const data = await res.json().catch(() => null)
        const msg = data?.detail || data?.message || res.statusText
        throw new Error(msg)
      }
      const data = (await res.json()) as BookingControls
      setControls((prev) => ({ ...prev, ...data }))
      try {
        if (typeof window !== 'undefined') {
          window.localStorage.setItem('jsm_booking_controls', JSON.stringify({ ...DEFAULT_BOOKING_CONTROLS, ...data }))
        }
      } catch {
        /* ignore storage errors */
      }
    } catch (e: any) {
      setError(e?.message ?? 'Failed to load booking controls')
      setControls(DEFAULT_BOOKING_CONTROLS)
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    refresh()
  }, [refresh])

  return (
    <BookingControlsContext.Provider value={{ controls, loading, error, refresh }}>
      {children}
    </BookingControlsContext.Provider>
  )
}

export function useBookingControls() {
  const ctx = React.useContext(BookingControlsContext)
  if (!ctx) throw new Error('BookingControlsProvider missing')
  return ctx
}

export function pickPrimaryBookingAction(controls: BookingControls): { enabled: boolean; to: string; label: string } {
  if (controls.jetSkiBookingsEnabled) return { enabled: true, to: '/Bookings', label: 'Book jet skis' }
  if (controls.boatRideBookingsEnabled) return { enabled: true, to: '/boat-ride', label: 'Request a boat ride' }
  if (controls.fishingChartersBookingsEnabled) return { enabled: true, to: '/fishing-charters', label: 'Enquire fishing charters' }
  return { enabled: false, to: '/contact', label: 'Contact us' }
}
