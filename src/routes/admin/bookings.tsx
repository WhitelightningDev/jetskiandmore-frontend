import * as React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Filter, Mail, Phone, Trash2 } from 'lucide-react'

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
import { Badge } from '@/components/ui/badge'
import type { Booking } from '@/admin/types'
import { useAdminContext } from '@/admin/context'
import {
  formatDateLabel,
  formatRideTime,
  statusLabel,
  statusTone,
  timeSortValue,
  withBookingMeta,
  type BookingWithMeta,
} from '@/admin/booking-utils'

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

  const bookingsWithMeta = React.useMemo(() => withBookingMeta(bookings), [bookings])
  const startOfToday = React.useMemo(() => {
    const d = new Date()
    d.setHours(0, 0, 0, 0)
    return d
  }, [])

  const upcomingBookings = React.useMemo(() => {
    return bookingsWithMeta
      .filter((b) => !b.parsedDate || b.parsedDate >= startOfToday)
      .sort((a, b) => {
        const aDate = a.parsedDate ? a.parsedDate.getTime() : Number.POSITIVE_INFINITY
        const bDate = b.parsedDate ? b.parsedDate.getTime() : Number.POSITIVE_INFINITY
        if (aDate !== bDate) return aDate - bDate
        const timeDiff = timeSortValue(a.time) - timeSortValue(b.time)
        return Number.isNaN(timeDiff) ? 0 : timeDiff
      })
  }, [bookingsWithMeta, startOfToday])

  const pastBookings = React.useMemo(() => {
    return bookingsWithMeta
      .filter((b) => b.parsedDate && b.parsedDate < startOfToday)
      .sort((a, b) => {
        const aDate = a.parsedDate ? a.parsedDate.getTime() : 0
        const bDate = b.parsedDate ? b.parsedDate.getTime() : 0
        if (aDate !== bDate) return bDate - aDate
        const timeDiff = timeSortValue(a.time) - timeSortValue(b.time)
        return Number.isNaN(timeDiff) ? 0 : timeDiff
      })
  }, [bookingsWithMeta, startOfToday])

  const bookingSections: {
    key: string
    title: string
    subtitle: string
    entries: BookingWithMeta[]
    emptyLabel: string
  }[] = [
    {
      key: 'upcoming',
      title: 'Upcoming rides',
      subtitle: 'Future and undated bookings',
      entries: upcomingBookings,
      emptyLabel: loadingBookings ? 'Loading bookings…' : 'No upcoming bookings yet.',
    },
    {
      key: 'past',
      title: 'Past rides',
      subtitle: 'Completed bookings',
      entries: pastBookings,
      emptyLabel: loadingBookings ? 'Loading bookings…' : 'No past bookings yet.',
    },
  ]

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

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-white/10 bg-gradient-to-br from-cyan-500/15 via-slate-900 to-slate-950 text-white shadow-lg shadow-cyan-500/15">
          <CardHeader className="pb-2">
            <p className="text-xs uppercase tracking-[0.18em] text-cyan-100/80">Total</p>
            <CardTitle className="text-lg">All bookings</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 text-3xl font-semibold">{bookings.length}</CardContent>
        </Card>
        <Card className="border-white/10 bg-white/5 text-white shadow-lg shadow-cyan-500/10">
          <CardHeader className="pb-2">
            <p className="text-xs uppercase tracking-[0.18em] text-cyan-100/70">Upcoming</p>
            <CardTitle className="text-lg">Future + undated</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 text-3xl font-semibold">{upcomingBookings.length}</CardContent>
        </Card>
        <Card className="border-white/10 bg-white/5 text-white shadow-lg shadow-cyan-500/10">
          <CardHeader className="pb-2">
            <p className="text-xs uppercase tracking-[0.18em] text-cyan-100/70">Past</p>
            <CardTitle className="text-lg">Completed rides</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 text-3xl font-semibold">{pastBookings.length}</CardContent>
        </Card>
        <Card className="border-white/10 bg-white/5 text-white shadow-lg shadow-cyan-500/10">
          <CardHeader className="pb-2">
            <p className="text-xs uppercase tracking-[0.18em] text-cyan-100/70">Filter</p>
            <CardTitle className="text-lg">Showing</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 text-lg">
            {statusFilter === 'all' ? 'All statuses' : statusLabel(statusFilter)}
          </CardContent>
        </Card>
      </div>

      <div className="space-y-5">
        {bookingSections.map((section) => (
          <Card
            key={section.key}
            className="border-white/10 bg-slate-900/80 text-white shadow-lg shadow-cyan-500/10"
          >
            <CardHeader className="flex flex-row items-start justify-between gap-3">
              <div>
                <CardTitle className="text-base">{section.title}</CardTitle>
                <p className="text-sm text-slate-300">{section.subtitle}</p>
              </div>
              <Badge variant="outline" className="border-cyan-400/50 bg-white/5 text-xs uppercase tracking-wide text-cyan-100">
                {section.entries.length} loaded
              </Badge>
            </CardHeader>
            <CardContent className="px-0">
              <div className="hidden overflow-x-auto md:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="pl-6">Date</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Ride</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead className="pr-6 text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {section.entries.map((b) => {
                      const dateLabel = formatDateLabel(b.parsedDate ?? b.date ?? b.createdAt ?? null)
                      const timeLabel = formatRideTime(b.time)
                      return (
                        <TableRow key={`${section.key}-${b.id}`}>
                          <TableCell className="pl-6">
                            <div className="flex flex-col leading-tight">
                              <span className="font-medium">{dateLabel}</span>
                              <span className="text-[11px] text-slate-400">
                                {b.date ? 'Ride date' : 'Date not captured'}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className="bg-white/5 text-xs font-semibold text-slate-50"
                            >
                              {timeLabel}
                            </Badge>
                          </TableCell>
                          <TableCell className="max-w-[180px] truncate">
                            <div className="flex flex-col gap-1">
                              <span className="font-semibold">{b.rideId}</span>
                              <span className="text-[11px] text-slate-400">
                                {b.addons ? 'With add-ons' : 'Standard ride'}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="font-medium">{b.fullName}</span>
                              <span className="text-xs text-slate-400 flex items-center gap-1">
                                <Mail className="h-3 w-3" />
                                {b.email}
                              </span>
                              {b.phone && (
                                <span className="text-xs text-slate-400 flex items-center gap-1">
                                  <Phone className="h-3 w-3" />
                                  {b.phone}
                                </span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="capitalize">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className={statusTone(b.status)}>
                                {statusLabel(b.status)}
                              </Badge>
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
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            ZAR {(b.amountInCents / 100).toLocaleString('en-ZA')}
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
                      )
                    })}
                    {section.entries.length === 0 && (
                      <TableRow>
                        <TableCell
                          colSpan={7}
                          className="py-8 text-center text-sm text-slate-400"
                        >
                          {section.emptyLabel}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              <div className="space-y-3 px-4 md:hidden">
                {section.entries.length === 0 && (
                  <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-center text-sm text-slate-300">
                    {section.emptyLabel}
                  </div>
                )}
                {section.entries.map((b) => {
                  const dateLabel = formatDateLabel(b.parsedDate ?? b.date ?? b.createdAt ?? null)
                  const timeLabel = formatRideTime(b.time)
                  return (
                    <div
                      key={`mobile-${section.key}-${b.id}`}
                      className="rounded-xl border border-white/10 bg-white/5 p-4 shadow-lg shadow-cyan-500/5"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <p className="text-sm font-semibold text-white">{dateLabel}</p>
                          <p className="text-xs text-slate-300">{timeLabel}</p>
                        </div>
                        <Badge variant="outline" className={statusTone(b.status)}>
                          {statusLabel(b.status)}
                        </Badge>
                      </div>
                      <div className="mt-2 flex flex-col gap-1">
                        <p className="text-sm font-semibold text-white">{b.rideId}</p>
                        <p className="text-xs text-slate-400">{b.addons ? 'With add-ons' : 'Standard ride'}</p>
                        <p className="text-sm font-medium text-white mt-1">{b.fullName}</p>
                        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300">
                          <span className="inline-flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {b.email}
                          </span>
                          {b.phone && (
                            <span className="inline-flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {b.phone}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="mt-4 flex flex-wrap items-center gap-3">
                        <Select
                          value={b.status}
                          onValueChange={(value) => {
                            setPendingStatus({ booking: b, status: value })
                          }}
                          disabled={updatingId === b.id}
                        >
                          <SelectTrigger className="w-full border-white/10 bg-slate-900">
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
                        <Button
                          variant="destructive"
                          size="sm"
                          className="flex-1"
                          onClick={async () => {
                            const confirmed = window.confirm('Delete this booking? This cannot be undone.')
                            if (!confirmed) return
                            setDeletingId(b.id)
                            await deleteBooking(b.id)
                            setDeletingId(null)
                          }}
                          disabled={deletingId === b.id}
                        >
                          {deletingId === b.id ? 'Deleting…' : 'Delete'}
                        </Button>
                        <div className="ml-auto text-sm font-semibold text-white">
                          ZAR {(b.amountInCents / 100).toLocaleString('en-ZA')}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

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
