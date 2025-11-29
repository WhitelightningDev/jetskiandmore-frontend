import * as React from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { verifyPayment, verifyPaymentById, verifyCheckout } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { CheckCircle2, Clock, Loader2, Mail, RefreshCw, ShieldCheck } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'

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
    const checkoutId = data?.checkoutId
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
          return
        }
        if (checkoutId) {
          const res = await verifyCheckout(checkoutId, booking)
          if (res.ok) {
            setStatus('approved')
            setMsg('Payment confirmed! We\'ve emailed your receipt and booking confirmation.')
            window.localStorage.removeItem('jsm_last_payment')
          } else {
            setStatus('pending')
            setMsg('Payment is processing. Please refresh in a moment.')
          }
          return
        }
        setStatus('pending')
        setMsg('Payment received. We will email your receipt shortly.')
      } catch (e: any) {
        setStatus('pending')
        setMsg(e?.message || 'Payment confirmed. We will email your receipt shortly.')
      }
    })()
  }, [])

  const statusMeta = {
    checking: {
      icon: <Loader2 className="h-5 w-5 animate-spin text-sky-600" />,
      label: 'Verifying payment',
      note: 'We are confirming your payment and booking details.',
    },
    approved: {
      icon: <CheckCircle2 className="h-5 w-5 text-emerald-600" />,
      label: 'Payment confirmed',
      note: 'Receipt and booking email sent.',
    },
    pending: {
      icon: <Clock className="h-5 w-5 text-amber-600" />,
      label: 'Processing…',
      note: 'Still waiting for confirmation. Please stay on this page.',
    },
    failed: {
      icon: <RefreshCw className="h-5 w-5 text-rose-600" />,
      label: 'Could not confirm',
      note: 'Please retry verification or contact us.',
    },
  }[status]

  return (
    <div className="min-h-[70vh] bg-gradient-to-b from-sky-50 via-white to-white flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-2xl rounded-2xl border border-sky-100 bg-white/90 shadow-lg p-6 md:p-8">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-100">
            {statusMeta.icon}
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-slate-900">Thank you!</h1>
            <p className="text-sm text-slate-600">{statusMeta.label}</p>
          </div>
        </div>

        <div className="mt-4 rounded-lg border border-sky-100 bg-sky-50/50 p-4 text-sm text-slate-700">
          <p className="font-medium text-slate-800 flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-sky-600" />
            {msg}
          </p>
          <p className="mt-1 text-slate-600">{statusMeta.note}</p>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <Button
            variant="outline"
            onClick={() => window.location.reload()}
            disabled={status === 'approved'}
            className="border-sky-200 text-slate-900 hover:bg-sky-50"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh status
          </Button>
          <Link
            to="/Bookings"
            className={buttonVariants({
              className: 'w-full text-center bg-sky-600 text-white hover:bg-sky-700',
            })}
          >
            Back to bookings
          </Link>
        </div>

        <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
          <Mail className="h-4 w-4" />
          <span>Stay on this page until we’ve sent your confirmation email.</span>
        </div>
      </div>
    </div>
  )
}
