const envBase = (import.meta.env.VITE_API_BASE || '').trim()

// Always default to the production Cloud Run backend unless explicitly overridden
export const API_BASE =
  envBase || 'https://jetskiandmore-backend-1071528856282.africa-south1.run.app'

export async function postJSON<T>(path: string, body: unknown, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) },
    body: JSON.stringify(body),
    ...init,
  })
  if (!res.ok) {
    let msg = res.statusText
    try {
      const data = await res.json()
      msg = data?.message || data?.detail || msg
    } catch {}
    throw new Error(msg)
  }
  return (await res.json()) as T
}

// Payments
export type Addons = {
  gopro: boolean
  wetsuit: boolean
  boat: boolean
  boatCount: number
  extraPeople: number
}

export async function getPaymentQuote(rideId: string, addons: Addons, jetSkiQty?: number) {
  return postJSON<{ currency: 'ZAR'; amountInCents: number }>(
    '/api/payments/quote',
    { rideId, addons, jetSkiQty }
  )
}

export async function chargeWithBooking(token: string, booking: any) {
  return postJSON<{ ok: boolean; id: string; status: string }>(
    '/api/payments/charge',
    { token, booking }
  )
}

export async function getPaymentConfig() {
  const res = await fetch(`${API_BASE}/api/payments/config`)
  if (!res.ok) throw new Error('Failed to fetch payment config')
  return (await res.json()) as { publicKey: string; currency: 'ZAR' }
}

export async function getAvailableTimes(rideId: string, date: string, jetSkiQty?: number) {
  const params = new URLSearchParams({ rideId, date })
  if (typeof jetSkiQty === 'number' && jetSkiQty >= 0) {
    params.append('jetSkiQty', String(jetSkiQty))
  }
  const res = await fetch(`${API_BASE}/api/timeslots?${params.toString()}`)
  if (!res.ok) throw new Error('Failed to load available times')
  return (await res.json()) as { rideId: string; date: string; times: Array<string | { time: string; availableJetSkis?: number }> }
}

// Advanced harbour weather + marine planning guidance
export type HarbourAssessment = {
  rating: 'prime' | 'fair' | 'rough'
  score: number
  reasons: Array<string>
  confidence: 'high' | 'medium' | 'low'
}

export type HarbourCurrentConditions = {
  time?: string | null
  temperatureC?: number | null
  apparentTemperatureC?: number | null
  windSpeedKmh?: number | null
  windGustKmh?: number | null
  windDirectionDeg?: number | null
  precipitationMm?: number | null
  visibilityM?: number | null
  weatherCode?: number | null
  waveHeightM?: number | null
  waveDirectionDeg?: number | null
  wavePeriodS?: number | null
  swellHeightM?: number | null
  swellDirectionDeg?: number | null
  swellPeriodS?: number | null
  seaSurfaceTemperatureC?: number | null
  assessment: HarbourAssessment
}

export type HarbourForecastHour = {
  time: string
  temperatureC?: number | null
  windSpeedKmh?: number | null
  windGustKmh?: number | null
  windDirectionDeg?: number | null
  precipitationProbabilityPct?: number | null
  precipitationMm?: number | null
  visibilityM?: number | null
  weatherCode?: number | null
  waveHeightM?: number | null
  waveDirectionDeg?: number | null
  wavePeriodS?: number | null
  swellHeightM?: number | null
  swellDirectionDeg?: number | null
  swellPeriodS?: number | null
  seaSurfaceTemperatureC?: number | null
  assessment: HarbourAssessment
}

export type HarbourForecastDay = {
  date: string
  temperatureMaxC?: number | null
  temperatureMinC?: number | null
  windSpeedMaxKmh?: number | null
  windGustMaxKmh?: number | null
  precipitationProbabilityMaxPct?: number | null
  sunrise?: string | null
  sunset?: string | null
  waveHeightMaxM?: number | null
  wavePeriodMaxS?: number | null
  swellHeightMaxM?: number | null
  swellPeriodMaxS?: number | null
  assessment: HarbourAssessment
}

export type HarbourRideWindow = {
  startsAt: string
  endsAt: string
  rating: 'prime' | 'fair'
  score: number
  summary: string
}

export type HarbourConditionsResponse = {
  generatedAt: string
  sourceUpdatedAt?: string | null
  stale: boolean
  cacheTtlSeconds: number
  location: {
    name: string
    latitude: number
    longitude: number
    timezone: string
  }
  current: HarbourCurrentConditions
  hourly: Array<HarbourForecastHour>
  daily: Array<HarbourForecastDay>
  bestWindows: Array<HarbourRideWindow>
  disclaimer: string
}

export async function getHarbourConditions() {
  const res = await fetch(`${API_BASE}/api/weather/harbour`)
  if (!res.ok) throw new Error('Advanced harbour conditions are unavailable')
  return (await res.json()) as HarbourConditionsResponse
}

export async function initiatePayment(booking: any) {
  return postJSON<{ currency: 'ZAR'; amountInCents: number; publicKey: string; reference: string }>(
    '/api/payments/initiate',
    { token: 'init', booking }
  )
}

export async function createPaymentLink(booking: any) {
  return postJSON<{ ok: boolean; linkUrl: string; id?: string; orderId?: string }>(
    '/api/payments/link',
    { token: 'init', booking }
  )
}

export async function verifyPayment(orderId: string, booking: any) {
  return postJSON<{ ok: boolean; orderId: string; status: string }>(
    '/api/payments/verify',
    { orderId, booking }
  )
}

export async function createCheckout(booking: any) {
  return postJSON<{ ok: boolean; id: string; redirectUrl: string }>(
    '/api/payments/checkout',
    { token: 'init', booking }
  )
}

export async function verifyPaymentById(paymentId: string, booking: any) {
  return postJSON<{ ok: boolean; paymentId: string; orderId?: string; status: string }>(
    '/api/payments/verify-by-payment',
    { paymentId, booking }
  )
}

export async function verifyCheckout(checkoutId: string, booking: any) {
  return postJSON<{ ok: boolean; checkoutId: string; status: string; paymentId?: string }>(
    '/api/payments/verify-checkout',
    { checkoutId, booking }
  )
}

// Indemnity (per-participant, resolved from the token emailed after booking)
export type IndemnityParticipantContext = {
  participantId: string
  fullName: string
  email?: string | null
  role: string
  roleLabel: string
  isRider: boolean
  positionNumber: number
  indemnityStatus: 'PENDING' | 'SIGNED' | 'REMOVED'
  signedAt?: string | null
}

export type IndemnityContext = {
  participant: IndemnityParticipantContext
  bookingId: string
  bookingGroupId: string
  bookingReference?: string | null
  bookingStatus?: string | null
  rideId?: string | null
  rideLabel?: string | null
  date?: string | null
  time?: string | null
  numberOfJetSkis: number
  totalRiders: number
  totalPassengers: number
  primaryRiderName?: string | null
  safetyVideoUrl?: string | null
  isRemoved: boolean
}

export type IndemnitySubmitPayload = {
  token: string
  fullName: string
  email?: string
  idNumber?: string
  phone?: string
  dateOfBirth?: string
  emergencyContactName?: string
  emergencyContactPhone?: string
  medicalConditions?: string
  canSwim: boolean
  hasWatchedVideo: boolean
  hasAcceptedIndemnity: boolean
  signatureName?: string
}

export type IndemnitySubmitResult = {
  ok: boolean
  status: 'SIGNED' | 'REMOVED'
  removed: boolean
  bookingCancelled: boolean
  refundAmountInCents: number
  refundStatus?: string | null
  message?: string | null
}

export async function getIndemnityContext(token: string) {
  const res = await fetch(`${API_BASE}/api/indemnities/context?token=${encodeURIComponent(token)}`)
  if (!res.ok) {
    let msg = 'This indemnity link is not valid.'
    try {
      const data = await res.json()
      msg = data?.detail || data?.message || msg
    } catch {}
    throw new Error(msg)
  }
  return (await res.json()) as IndemnityContext
}

export async function submitIndemnity(payload: IndemnitySubmitPayload) {
  return postJSON<IndemnitySubmitResult>('/api/indemnities/submit', payload)
}

// Boat ride requests
export type BoatRideRequest = {
  firstName: string
  lastName: string
  phone: string
  email: string
  people: number
  date: string // ISO date (YYYY-MM-DD)
}

export async function sendBoatRideRequest(payload: BoatRideRequest) {
  const { firstName, lastName, phone, email, people, date } = payload
  const fullName = `${firstName} ${lastName}`.trim()

  return postJSON<{ ok: boolean; id?: string }>('/api/contact', {
    fullName,
    email,
    phone,
    message: [
      'Boat ride request',
      `Name: ${fullName || 'N/A'}`,
      `Email: ${email}`,
      `Cell: ${phone}`,
      `Date: ${date}`,
      `People: ${people} (max 12)`,
    ].join('\n'),
    subject: 'Boat ride request',
    targetEmail: 'heinrichkaiser007@gmail.com',
    type: 'boat-ride',
    date,
    people,
  })
}
