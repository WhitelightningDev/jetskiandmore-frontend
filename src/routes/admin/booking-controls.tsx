import * as React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { CalendarClock, Fish, Ship } from 'lucide-react'

import { API_BASE } from '@/lib/api'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { useAdminContext } from '@/admin/context'

export const Route = createFileRoute('/admin/booking-controls')({
  component: BookingControlsAdminPage,
})

type BookingControls = {
  jetSkiBookingsEnabled: boolean
  boatRideBookingsEnabled: boolean
  fishingChartersBookingsEnabled: boolean
  updatedAt?: string | null
}

const DEFAULT_CONTROLS: BookingControls = {
  jetSkiBookingsEnabled: false,
  boatRideBookingsEnabled: true,
  fishingChartersBookingsEnabled: true,
  updatedAt: null,
}

function BookingControlsAdminPage() {
  const { token, setError } = useAdminContext()
  const [loading, setLoading] = React.useState(true)
  const [saving, setSaving] = React.useState(false)
  const [controls, setControls] = React.useState<BookingControls>(DEFAULT_CONTROLS)
  const [savedAt, setSavedAt] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (!token) return
    ;(async () => {
      try {
        setLoading(true)
        setError(null)
        const res = await fetch(`${API_BASE}/api/admin/booking-controls`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (res.status === 401) throw new Error('Session expired. Please sign in again.')
        if (!res.ok) {
          const data = await res.json().catch(() => null)
          const msg = data?.detail || data?.message || res.statusText
          throw new Error(msg)
        }
        const data = (await res.json()) as BookingControls
        setControls((prev) => ({ ...prev, ...data }))
      } catch (e: any) {
        setError(e?.message ?? 'Failed to load booking controls')
      } finally {
        setLoading(false)
      }
    })()
  }, [setError, token])

  async function save() {
    if (!token) return
    try {
      setSaving(true)
      setError(null)
      const res = await fetch(`${API_BASE}/api/admin/booking-controls`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          jetSkiBookingsEnabled: controls.jetSkiBookingsEnabled,
          boatRideBookingsEnabled: controls.boatRideBookingsEnabled,
          fishingChartersBookingsEnabled: controls.fishingChartersBookingsEnabled,
        }),
      })
      if (res.status === 401) throw new Error('Session expired. Please sign in again.')
      if (!res.ok) {
        const data = await res.json().catch(() => null)
        const msg = data?.detail || data?.message || res.statusText
        throw new Error(msg)
      }
      const data = (await res.json()) as BookingControls
      setControls((prev) => ({ ...prev, ...data }))
      setSavedAt(new Date().toLocaleString('en-ZA'))
    } catch (e: any) {
      setError(e?.message ?? 'Failed to save booking controls')
    } finally {
      setSaving(false)
    }
  }

  const updatedAtLabel = controls.updatedAt ? new Date(controls.updatedAt).toLocaleString('en-ZA') : '—'

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="space-y-1">
          <p className="text-[11px] uppercase tracking-[0.22em] text-cyan-700">Settings</p>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Booking controls</h1>
          <p className="text-sm text-slate-600">Turn booking buttons on/off per service.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" className="border-slate-200 bg-white text-slate-700">
            Updated: {updatedAtLabel}
          </Badge>
          {savedAt ? <Badge className="bg-emerald-600 text-white">Saved {savedAt}</Badge> : null}
        </div>
      </header>

      <Card className="border-slate-200 bg-white shadow-sm">
        <CardHeader className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle className="text-base text-slate-900">Website booking switches</CardTitle>
            <CardDescription className="text-slate-600">
              These affect which “Book” buttons show on the website and which booking flows are allowed.
            </CardDescription>
          </div>
          <Button onClick={save} disabled={loading || saving}>
            {saving ? 'Saving…' : 'Save changes'}
          </Button>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <ToggleCard
            icon={<CalendarClock className="h-4 w-4 text-cyan-700" />}
            title="Jet ski bookings"
            description="Online jet ski bookings & payments."
            checked={controls.jetSkiBookingsEnabled}
            disabled={loading}
            onCheckedChange={(v) => setControls((c) => ({ ...c, jetSkiBookingsEnabled: v }))}
          />
          <ToggleCard
            icon={<Ship className="h-4 w-4 text-sky-700" />}
            title="Boat ride requests"
            description="Boat ride request form & email."
            checked={controls.boatRideBookingsEnabled}
            disabled={loading}
            onCheckedChange={(v) => setControls((c) => ({ ...c, boatRideBookingsEnabled: v }))}
          />
          <ToggleCard
            icon={<Fish className="h-4 w-4 text-emerald-700" />}
            title="Fishing charters"
            description="Fishing charter enquiry buttons."
            checked={controls.fishingChartersBookingsEnabled}
            disabled={loading}
            onCheckedChange={(v) => setControls((c) => ({ ...c, fishingChartersBookingsEnabled: v }))}
          />
        </CardContent>
      </Card>
    </div>
  )
}

function ToggleCard({
  icon,
  title,
  description,
  checked,
  disabled,
  onCheckedChange,
}: {
  icon: React.ReactNode
  title: string
  description: string
  checked: boolean
  disabled?: boolean
  onCheckedChange: (next: boolean) => void
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50/40 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white">
              {icon}
            </span>
            {title}
          </div>
          <p className="text-xs text-slate-600">{description}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-700">{checked ? 'On' : 'Off'}</span>
          <Checkbox
            checked={checked}
            disabled={disabled}
            onCheckedChange={(v) => onCheckedChange(v === true)}
            aria-label={`${title} enabled`}
          />
        </div>
      </div>
    </div>
  )
}

