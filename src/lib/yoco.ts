declare global {
  interface Window {
    YocoSDK?: any
  }
}

export async function loadYoco(): Promise<any> {
  if (window.YocoSDK) return window.YocoSDK
  await new Promise<void>((resolve, reject) => {
    const s = document.createElement('script')
    s.src = 'https://js.yoco.com/sdk/v1/yoco-sdk-web.js'
    s.async = true
    s.onload = () => resolve()
    s.onerror = () => reject(new Error('Failed to load Yoco SDK'))
    document.head.appendChild(s)
  })
  if (!window.YocoSDK) throw new Error('Yoco SDK not available after load')
  return window.YocoSDK
}

export type YocoTokenOptions = {
  productName?: string
  description?: string
  customerName?: string
  customerEmail?: string
}

// Opens Yoco popup if available; falls back to createToken when popup isn't supported.
export async function createYocoToken(
  amountInCents: number,
  currency = 'ZAR',
  options?: YocoTokenOptions,
  card?: { number: string; cvc: string; expiryMonth: string; expiryYear: string }
) {
  const YocoSDK = await loadYoco()
  let publicKey = import.meta.env.VITE_YOCO_PUBLIC_KEY
  if (!publicKey) {
    // Fallback: fetch from backend
    const res = await fetch((import.meta.env.VITE_API_BASE || '') + '/api/payments/config')
    if (!res.ok) throw new Error('Failed to load payment config')
    const data = await res.json()
    publicKey = data?.publicKey
  }
  if (!publicKey) throw new Error('Missing Yoco public key')
  const sdk = new YocoSDK({ publicKey })

  // Prefer hosted popup/portal
  if (typeof sdk.showPopup === 'function') {
    return await new Promise<string>((resolve, reject) => {
      try {
        sdk.showPopup({
          amountInCents,
          currency,
          name: options?.productName,
          description: options?.description,
          email: options?.customerEmail,
          callback: (result: any) => {
            if (result && (result.id || result.token)) {
              resolve(result.id || result.token)
            } else if (result && result.error) {
              reject(new Error(result.error.message || 'Payment failed'))
            } else {
              reject(new Error('Payment cancelled'))
            }
          },
        })
      } catch (err: any) {
        reject(new Error(err?.message || 'Failed to open payment popup'))
      }
    })
  }

  // Fallback to tokenizing manual card details
  if (typeof sdk.createToken === 'function') {
    if (!card) throw new Error('Card details required')
    const res = await sdk.createToken({ amountInCents, currency, cardDetails: card })
    if (res.error) throw new Error(res.error.message || 'Tokenization failed')
    return res.id || res.token
  }

  throw new Error('Yoco SDK does not support tokenization on this page')
}
