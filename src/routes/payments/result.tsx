import * as React from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { verifyPayment, verifyPaymentById } from '@/lib/api'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/payments/result')({
  component: ResultPage,
})

function ResultPage() {
  const [status, setStatus] = React.useState<'idle'|'checking'|'approved'|'failed'|'pending'>('idle')
  const [message, setMessage] = React.useState<string>('')

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const paymentId = params.get('paymentId') || params.get('payment_id') || undefined
    const stored = window.localStorage.getItem('jsm_last_payment')
    const data = stored ? JSON.parse(stored) : null
    const booking = data?.booking
    if (!booking) return
    ;(async () => {
      try {
        setStatus('checking')
        if (paymentId) {
          const res = await verifyPaymentById(paymentId, booking)
          if (res.ok) {
            setStatus('approved')
            setMessage('Payment confirmed! A confirmation email has been sent.')
            window.localStorage.removeItem('jsm_last_payment')
            return
          }
          if (res.status === 'failed' || res.status === 'cancelled') {
            setStatus('failed')
            setMessage('Payment failed or cancelled. Please try again.')
            return
          }
          setStatus('pending')
          setMessage('Payment is pending. Please check again in a moment.')
          return
        }
        if (data?.orderId) {
          const res = await verifyPayment(data.orderId, booking)
          if (res.ok) {
            setStatus('approved')
            setMessage('Payment confirmed! A confirmation email has been sent.')
            window.localStorage.removeItem('jsm_last_payment')
          } else if (res.status === 'failed' || res.status === 'cancelled') {
            setStatus('failed')
            setMessage('Payment failed or cancelled. Please try again.')
          } else {
            setStatus('pending')
            setMessage('Payment is pending. Please check again in a moment.')
          }
        }
      } catch (e: any) {
        setStatus('failed')
        setMessage(e?.message || 'Could not verify payment')
      }
    })()
  }, [])

  return (
    <div className="mx-auto max-w-xl p-6">
      <h1 className="text-2xl font-bold mb-2">Payment result</h1>
      <p className="text-sm text-muted-foreground mb-6">Use this page after returning from Yoco to confirm your payment status.</p>
      <div className="mb-4 text-sm">{message || 'No pending payment found.'}</div>
      <div className="flex gap-2">
        <Link to="/Bookings" className="underline">Back to bookings</Link>
        {status === 'pending' || status === 'failed' || status === 'idle' ? (
          <Button onClick={() => window.location.reload()}>Check again</Button>
        ) : null}
      </div>
    </div>
  )
}
