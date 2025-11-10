import * as React from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { verifyPayment, verifyPaymentById } from '@/lib/api'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/payments/success')({
  component: SuccessPage,
})

function SuccessPage() {
  const [status, setStatus] = React.useState<'checking'|'approved'|'pending'|'failed'>('checking')
  const [msg, setMsg] = React.useState<string>('Confirming your payment…')

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const paymentId = params.get('paymentId') || params.get('payment_id') || undefined
    const stored = window.localStorage.getItem('jsm_last_payment')
    const data = stored ? JSON.parse(stored) : null
    const booking = data?.booking
    if (!booking) {
      setStatus('pending')
      setMsg('Payment received. We could not find your booking context to email a receipt, but we will reconcile shortly.')
      return
    }
    ;(async () => {
      try {
        if (paymentId) {
          const res = await verifyPaymentById(paymentId, booking)
          if (res.ok) {
            setStatus('approved')
            setMsg('Payment confirmed! We\'ve emailed your receipt and booking confirmation.')
            window.localStorage.removeItem('jsm_last_payment')
            return
          }
          setStatus('pending')
          setMsg('Payment is processing. Please refresh in a moment.')
          return
        }
        const orderId = data?.orderId
        if (orderId) {
          const res = await verifyPayment(orderId, booking)
          if (res.ok) {
            setStatus('approved')
            setMsg('Payment confirmed! We\'ve emailed your receipt and booking confirmation.')
            window.localStorage.removeItem('jsm_last_payment')
          } else {
            setStatus('pending')
            setMsg('Payment is processing. Please refresh in a moment.')
          }
        } else {
          setStatus('pending')
          setMsg('Payment received. We will email your receipt shortly.')
        }
      } catch (e: any) {
        setStatus('pending')
        setMsg(e?.message || 'Payment confirmed. We will email your receipt shortly.')
      }
    })()
  }, [])

  return (
    <div className="mx-auto max-w-xl p-6">
      <h1 className="text-2xl font-bold mb-2">Thank you!</h1>
      <p className="text-sm text-muted-foreground mb-6">{msg}</p>
      <div className="flex gap-2 items-center">
        <Link to="/Bookings/" className="underline">Back to bookings</Link>
        <Button variant="outline" onClick={() => window.location.reload()} disabled={status==='approved'}>Refresh</Button>
      </div>
    </div>
  )
}

