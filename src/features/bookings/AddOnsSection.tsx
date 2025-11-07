import * as React from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Gift, Camera, Droplets, Ship } from 'lucide-react'

// Local copies of pricing + formatter to avoid coupling to the page.
// (If you prefer to centralize, we can move these to a shared constants module.)
export const FREE_DRONE_RIDE_ID = '60-2' // 2 Jet-Skis • 60 min
export const DRONE_PRICE = 700
export const WETSUIT_PRICE = 150
export const BOAT_PRICE_PER_PERSON = 450
export const EXTRA_PERSON_PRICE = 350

export function formatZAR(n: number) {
  try {
    return new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR', maximumFractionDigits: 0 }).format(n)
  } catch {
    return `ZAR ${n.toFixed(0)}`
  }
}

export type AddonsState = {
  drone: boolean
  gopro: boolean
  wetsuit: boolean
  boat: boolean
  boatCount: number
  extraPeople: number
}

export function AddOnsSection({
  rideId,
  addons,
  setAddons,
}: {
  rideId: string
  addons: AddonsState
  setAddons: React.Dispatch<React.SetStateAction<AddonsState>>
}) {
  return (
    <section aria-labelledby="addons-title" className="space-y-3">
      <div className="rounded-lg border-amber-300/60 bg-gradient-to-br from-amber-50 to-amber-100/40 ring-1 ring-amber-200/50 p-4">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center size-7 rounded-md bg-amber-500/15 text-amber-700">
              <Gift className="size-4" />
            </span>
            <Label id="addons-title" className="text-base font-semibold">Optional extras</Label>
          </div>
          <span className="text-xs text-muted-foreground">Make it unforgettable</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Drone */}
        <label className="flex items-center justify-between gap-2 rounded-md border p-3 bg-white/70 hover:border-amber-300 transition-colors">
          <div className="flex items-center gap-2">
            <Checkbox checked={addons.drone} onCheckedChange={(v: any) => setAddons(a => ({ ...a, drone: Boolean(v) }))} />
            <span className="text-sm inline-flex items-center gap-1">
              <Camera className="h-4 w-4 text-amber-700" /> Drone video
            </span>
          </div>
          {rideId === FREE_DRONE_RIDE_ID ? (
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200">Included</span>
          ) : (
            <span className="text-xs text-muted-foreground">{formatZAR(DRONE_PRICE)}</span>
          )}
        </label>

        {/* GoPro */}
        <label className="flex items-center justify-between gap-2 rounded-md border p-3 bg-white/70 hover:border-amber-300 transition-colors">
          <div className="flex items-center gap-2">
            <Checkbox checked={addons.gopro} onCheckedChange={(v: any) => setAddons(a => ({ ...a, gopro: Boolean(v) }))} />
            <span className="text-sm inline-flex items-center gap-1">
              <Camera className="h-4 w-4 text-amber-700" /> GoPro footage
            </span>
          </div>
          <span className="text-xs text-muted-foreground">On request</span>
        </label>

        {/* Wetsuit */}
        <label className="flex items-center justify-between gap-2 rounded-md border p-3 bg-white/70 hover:border-amber-300 transition-colors">
          <div className="flex items-center gap-2">
            <Checkbox checked={addons.wetsuit} onCheckedChange={(v: any) => setAddons(a => ({ ...a, wetsuit: Boolean(v) }))} />
            <span className="text-sm inline-flex items-center gap-1">
              <Droplets className="h-4 w-4 text-amber-700" /> Wetsuit hire
            </span>
          </div>
          <span className="text-xs text-muted-foreground">{formatZAR(WETSUIT_PRICE)}</span>
        </label>

        {/* Boat ride */}
        <div className="flex items-center justify-between gap-2 rounded-md border p-3 bg-white/70 hover:border-amber-300 transition-colors">
          <label className="flex items-center gap-2">
            <Checkbox
              checked={addons.boat}
              onCheckedChange={(v: any) => setAddons((a) => ({ ...a, boat: Boolean(v) }))}
            />
            <span className="text-sm inline-flex items-center gap-1">
              <Ship className="h-4 w-4 text-amber-700" /> Boat ride
            </span>
          </label>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>R{BOAT_PRICE_PER_PERSON} pp</span>
            <input
              type="number"
              min={1}
              max={10}
              value={addons.boatCount}
              disabled={!addons.boat}
              onChange={(e) => setAddons((a) => ({ ...a, boatCount: Math.max(1, Math.min(10, Number(e.target.value) || 1)) }))}
              className="w-16 px-2 py-1 border rounded disabled:opacity-60"
            />
          </div>
        </div>

        {/* Additional passengers moved next to ride selection for clarity */}
        </div>

        <p className="mt-3 text-xs text-muted-foreground">
          Drone footage is <strong>free</strong> for the <em>2 Jet‑Skis • 60 min</em> ride, otherwise {formatZAR(DRONE_PRICE)}. Wetsuit hire is
          {" "}{formatZAR(WETSUIT_PRICE)}. Boat ride costs R{BOAT_PRICE_PER_PERSON} per person. Set passengers in the booking details above.
        </p>
      </div>
    </section>
  )
}
