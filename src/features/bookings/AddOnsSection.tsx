import * as React from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'

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
  maxExtraPeople,
}: {
  rideId: string
  addons: AddonsState
  setAddons: React.Dispatch<React.SetStateAction<AddonsState>>
  maxExtraPeople: number
}) {
  return (
    <div className="space-y-3">
      <Label>Optional add-ons</Label>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Drone */}
        <label className="flex items-center justify-between gap-2 rounded-md border p-3">
          <div className="flex items-center gap-2">
            <Checkbox checked={addons.drone} onCheckedChange={(v: any) => setAddons(a => ({ ...a, drone: Boolean(v) }))} />
            <span className="text-sm">Drone video</span>
          </div>
          <span className="text-xs text-muted-foreground">
            {rideId === FREE_DRONE_RIDE_ID ? 'Included with 2 skis (60m)' : formatZAR(DRONE_PRICE)}
          </span>
        </label>

        {/* GoPro */}
        <label className="flex items-center justify-between gap-2 rounded-md border p-3">
          <div className="flex items-center gap-2">
            <Checkbox checked={addons.gopro} onCheckedChange={(v: any) => setAddons(a => ({ ...a, gopro: Boolean(v) }))} />
            <span className="text-sm">GoPro footage</span>
          </div>
          <span className="text-xs text-muted-foreground">On request</span>
        </label>

        {/* Wetsuit */}
        <label className="flex items-center justify-between gap-2 rounded-md border p-3">
          <div className="flex items-center gap-2">
            <Checkbox checked={addons.wetsuit} onCheckedChange={(v: any) => setAddons(a => ({ ...a, wetsuit: Boolean(v) }))} />
            <span className="text-sm">Wetsuit hire</span>
          </div>
          <span className="text-xs text-muted-foreground">{formatZAR(WETSUIT_PRICE)}</span>
        </label>

        {/* Boat ride */}
        <div className="flex items-center justify-between gap-2 rounded-md border p-3">
          <label className="flex items-center gap-2">
            <Checkbox
              checked={addons.boat}
              onCheckedChange={(v: any) => setAddons((a) => ({ ...a, boat: Boolean(v) }))}
            />
            <span className="text-sm">Boat ride</span>
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

        {/* Additional passengers */}
        <div className="flex items-center justify-between gap-2 rounded-md border p-3">
          <div className="flex flex-col gap-1">
            <span className="text-sm">Additional passenger(s)</span>
            <span className="text-xs text-muted-foreground">R{EXTRA_PERSON_PRICE} each • Max {maxExtraPeople}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <input
              type="number"
              min={0}
              max={maxExtraPeople}
              value={addons.extraPeople || 0}
              onChange={(e) => setAddons((a) => ({ ...a, extraPeople: Math.max(0, Math.min(maxExtraPeople, Number(e.target.value) || 0)) }))}
              className="w-16 px-2 py-1 border rounded"
            />
          </div>
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        Drone footage is <strong>free</strong> for the <em>2 Jet-Skis • 60 min</em> ride, otherwise {formatZAR(DRONE_PRICE)}.
        Wetsuit hire is {formatZAR(WETSUIT_PRICE)}. Boat ride costs R{BOAT_PRICE_PER_PERSON} per person.
        Additional passenger(s) cost R{EXTRA_PERSON_PRICE} each.
      </p>
    </div>
  )
}