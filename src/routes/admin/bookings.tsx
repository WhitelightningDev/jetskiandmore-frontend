import * as React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Filter, Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Textarea } from '@/components/ui/textarea'
import type { Booking } from '@/admin/types'
import { useAdminContext } from '@/admin/context'

export const Route = createFileRoute('/admin/bookings')({
  component: AdminBookingsPage,
})

function AdminBookingsPage() {
  const {
    bookings,
    loadingBookings,
    statusFilter,
    setStatusFilter,
    updateBookingStatus,
    deleteBooking,
  } = useAdminContext()

  const [pendingStatus, setPendingStatus] = React.useState<{ booking: Booking; status: string } | null>(null)
  const [statusMessage, setStatusMessage] = React.useState('')
  const [updatingId, setUpdatingId] = React.useState<string | null>(null)
  const [deletingId, setDeletingId] = React.useState<string | null>(null)

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-[0.22em] text-cyan-200/80">Bookings</p>
          <h1 className="text-xl font-semibold text-white">Latest bookings</h1>
          <p className="text-sm text-slate-300">Update statuses, send messages, and manage customers.</p>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-200">
          <Filter className="h-4 w-4 text-cyan-200" />
          Status filter
          <Select
            value={statusFilter}
            onValueChange={(v) => setStatusFilter(v as typeof statusFilter)}
          >
            <SelectTrigger className="w-36 border-none bg-transparent text-white focus:ring-0">
              <SelectValue placeholder="Filter status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="created">Created</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card className="border-white/10 bg-slate-900/80 text-white shadow-lg shadow-cyan-500/10">
        <CardHeader>
          <CardTitle className="text-base">Recent bookings</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto px-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-6">Date</TableHead>
                <TableHead>Ride</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="pr-6 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.map((b) => (
                <TableRow key={b.id}>
                  <TableCell className="pl-6">
                    {b.date ||
                      (b.createdAt
                        ? new Date(b.createdAt).toLocaleDateString('en-ZA')
                        : '—')}
                  </TableCell>
                  <TableCell>{b.rideId}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{b.fullName}</span>
                      <span className="text-xs text-slate-400">
                        {b.email}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="capitalize">
                    <Select
                      value={b.status}
                      onValueChange={(value) => {
                        setPendingStatus({ booking: b, status: value })
                      }}
                      disabled={updatingId === b.id}
                    >
                      <SelectTrigger className="w-32 border-white/10 bg-slate-900">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="created">Created</SelectItem>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="failed">Failed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-right">
                    ZAR {(b.amountInCents / 100).toFixed(0)}
                  </TableCell>
                  <TableCell className="pr-6 text-right">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={async () => {
                        const confirmed = window.confirm('Delete this booking? This cannot be undone.')
                        if (!confirmed) return
                        setDeletingId(b.id)
                        await deleteBooking(b.id)
                        setDeletingId(null)
                      }}
                      disabled={deletingId === b.id}
                      className="gap-1"
                    >
                      <Trash2 className="h-4 w-4" />
                      {deletingId === b.id ? 'Deleting…' : 'Delete'}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {bookings.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="py-8 text-center text-sm text-slate-400"
                  >
                    {loadingBookings ? 'Loading bookings…' : 'No bookings yet.'}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {pendingStatus && (
        <Dialog
          open={!!pendingStatus}
          onOpenChange={(open) => {
            if (!open) setPendingStatus(null)
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm status update</DialogTitle>
              <DialogDescription>
                This will update the booking status and send the message below to the customer.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 text-sm">
              <div>
                <p className="font-medium">{pendingStatus.booking.fullName}</p>
                <p className="text-xs text-muted-foreground">
                  Current status: {pendingStatus.booking.status || '—'} → New status:{' '}
                  {pendingStatus.status || '—'}
                </p>
              </div>
              <div className="space-y-1">
                <Label htmlFor="status-popup-message" className="text-xs">
                  Message to customer
                </Label>
                <Textarea
                  id="status-popup-message"
                  value={statusMessage}
                  onChange={(e) => setStatusMessage(e.target.value)}
                  placeholder="Short message explaining this status change"
                  className="text-xs min-h-[80px]"
                />
                <p className="text-[11px] text-muted-foreground">
                  This message will be included in the email / notification sent with this status update.
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setPendingStatus(null)}>
                Cancel
              </Button>
              <Button
                onClick={async () => {
                  if (!pendingStatus) return
                  setUpdatingId(pendingStatus.booking.id)
                  const ok = await updateBookingStatus(pendingStatus.booking.id, pendingStatus.status, statusMessage)
                  setUpdatingId(null)
                  if (ok) {
                    setStatusMessage('')
                    setPendingStatus(null)
                  }
                }}
                disabled={updatingId === pendingStatus.booking.id}
              >
                {updatingId === pendingStatus.booking.id ? 'Sending…' : 'Send & update'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
