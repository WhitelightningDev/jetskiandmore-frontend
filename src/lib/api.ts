export const API_BASE =
  import.meta.env.VITE_API_BASE || 'https://jetskiandmore-backend.onrender.com'

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
  drone: boolean
  gopro: boolean
  wetsuit: boolean
  boat: boolean
  boatCount: number
  extraPeople: number
}

export async function getPaymentQuote(rideId: string, addons: Addons) {
  return postJSON<{ currency: 'ZAR'; amountInCents: number }>(
    '/api/payments/quote',
    { rideId, addons }
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
