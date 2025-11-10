import * as React from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/payments/cancelled')({
  component: CancelledPage,
})

function CancelledPage() {
  React.useEffect(() => {
    // Keep booking context so user can retry
  }, [])
  return (
    <div className="mx-auto max-w-xl p-6">
      <h1 className="text-2xl font-bold mb-2">Payment cancelled</h1>
      <p className="text-sm text-muted-foreground mb-6">Your payment was cancelled. You can try again any time.</p>
      <div className="flex gap-2 items-center">
        <Link to="/Bookings/" className="underline">Back to bookings</Link>
        <Button onClick={() => history.back()} variant="outline">Go back</Button>
      </div>
    </div>
  )
}

