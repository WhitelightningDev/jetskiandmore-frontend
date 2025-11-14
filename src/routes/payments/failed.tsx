import { createFileRoute, Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/payments/failed')({
  component: FailedPage,
})

function FailedPage() {
  return (
    <div className="mx-auto max-w-xl p-6">
      <h1 className="text-2xl font-bold mb-2">Payment failed</h1>
      <p className="text-sm text-muted-foreground mb-6">We couldn’t complete your payment. This can happen due to bank declines or network issues. No funds were captured.</p>
      <div className="flex gap-2 items-center">
        <Link to="/Bookings" className="underline">Back to bookings</Link>
        <Button onClick={() => history.back()} variant="outline">Try again</Button>
      </div>
    </div>
  )
}
