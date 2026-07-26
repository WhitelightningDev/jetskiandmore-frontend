# Jet Ski & More — rebrand handoff

**Status:** redesign implemented across all primary public marketing routes.
**Last verified:** 2026-07-26 — changed-file ESLint clean, `npm run build` clean, TypeScript clean.
**Nothing is committed.** All work below is in the working tree.

There are two independent workstreams in this branch. §A is finished. §B is the one you're picking up.

---

# §A — Indemnity + swim-competency feature (COMPLETE, verified)

Already done and end-to-end tested. Listed so you don't re-do it or break it.

Spans two repos: `jetskiandmore-frontend` and `../jetskiandmore-backend`.

### What it does
Booking → confirmation email carries a **per-participant tokenised link** → `/indemnity?token=…` renders a form shaped by that person's role → signing is tracked against the booking → admin sees `2/3 signed`. Declaring "I cannot swim" removes that person, reprices the booking, and auto-refunds the difference via Yoco.

### Backend files changed (`../jetskiandmore-backend/app/`)
| File | Change |
|---|---|
| `yoco.py` | Added `refund_payment()`, `get_checkout()`, `resolve_payment_id()`. Uses `POST /api/payments/{id}/refund` with an `Idempotency-Key`. |
| `pricing.py` | Added `ride_ski_count()`, `ride_id_for_ski_count()` — lets a booking be repriced when a rider is removed (`30-2` → `30-1`). |
| `schemas.py` | `BookingRequest.allParticipantsCanSwim`; widened `IndemnitySubmitRequest`; new `IndemnityContextResponse`, `IndemnityParticipantContext`, `IndemnitySubmitResponse`; indemnity counters on `BookingAdminResponse`. |
| `routers.py` | New `GET /api/indemnities/context`; reworked `POST /api/indemnities/submit`; new `_handle_cannot_swim()`, `_participant_counts()`, `_indemnity_progress()`, `_require_swim_declaration()` (wired into all 5 booking/payment entry points). |
| `emailer.py` | `_safety_section()` now takes a tokenised link; `format_booking_confirmation_email()` takes `primary_indemnity_link`; new `format_swim_removal_email()` and `format_swim_removal_admin_email()`. |

### Three pre-existing bugs fixed along the way
1. **Confirmation emails never sent.** `_ride_label` was used in `_send_booking_notifications` but never imported into `routers.py` → `NameError` inside a bare `except`, silently swallowing the whole participant/indemnity email. Fixed by adding it to the `.emailer` import.
2. **Rider details discarded.** `_create_participants` read `passengers` but never `riders`, so extra riders got blank names and no email.
3. **Passengers double-counted.** Named `passengers[]` were created *in addition to* `addons.extraPeople`, doubling every guest. Now only the unnamed shortfall is created.

### Frontend files changed
- `src/routes/indemnity/index.tsx` — **new**, the tokenised form.
- `src/lib/api.ts` — `getIndemnityContext()`, `submitIndemnity()`, related types.
- `src/routes/Bookings/index.tsx` — swim declaration gate in the pre-payment dialog (`swimAck`), sends `allParticipantsCanSwim`.
- `src/admin/types.ts`, `src/routes/admin/bookings.tsx` — `IndemnityCell` showing `n/n signed` + removal/refund state.

### Open risk
The Yoco refund endpoint has **never run against live credentials**. It degrades safely (flags `refundPending`, emails staff) but do a sandbox refund before trusting it unattended.

---

# §B — Rebrand (IMPLEMENTED)

## 1. Source of truth

The design is a Claude Design canvas, **checked into this repo** at:

```
design/Jet Ski & More.dc.html        # 1428 lines — read this first
```

Re-fetch the latest from the design project with the `DesignSync` tool:

```
DesignSync { method: "get_file",
             projectId: "39d9cf08-5701-45ec-8f55-6490b7b0af9e",
             path: "Jet Ski & More.dc.html" }
```
Project name: *Jet Ski Rentals Redesign*. Other paths: `image-slot.js`, `support.js`, `img/logo-badge.png`, `img/hero-bay.png`, `ref/*.png` (screenshots of the OLD site, for before/after reference).

### Reading the design DSL
It is not plain HTML. Translate as follows:

| Design construct | Means |
|---|---|
| `<x-dc>` / `<helmet>` / `support.js` | Canvas runtime scaffolding — **ignore, do not port** |
| `{{ expr }}` | Value from `renderVals()` at the bottom of the file (line ~1134) |
| `<sc-if value="{{ x }}">` | Conditional render |
| `<sc-for list="{{ xs }}" as="x">` | `xs.map(x => …)` |
| `style-hover="…"` | A `hover:` variant |
| `<image-slot id="…" placeholder="…">` | An `<img>` — see §4 for which photo |
| `hint-placeholder-count/val` | Editor hints only — ignore |

**All the copy and data lives in `renderVals()` (lines 1134–1424).** It has already been transcribed into `src/lib/brand-content.ts` — use that, don't re-transcribe.

## 2. What is already built

| File | State |
|---|---|
| `index.html` | ✅ Archivo + Public Sans `<link>`s, `theme-color` → `#06202F` |
| `src/styles.css` | ✅ `@theme` brand tokens + shadcn light palette remapped to brand |
| `public/brand/logo-badge.png` | ✅ 500×500, from the design project |
| `src/components/brand/primitives.tsx` | ✅ `Shell` `Section` `Eyebrow` `DisplayHeading` `Lede` `Panel` `BrandButton` `RatingPill` `Shot` `TickRow` `ClosingCta` |
| `src/components/brand/SiteChrome.tsx` | ✅ `StatusBar` `SiteHeader` (+ mobile drawer) `SiteFooter` |
| `src/lib/brand-content.ts` | ✅ All design copy/data + `ROUTES`, `NAV_ITEMS`, `CONTACT`, image exports |
| `src/routes/__root.tsx` | ✅ Rewired to the new chrome |

### Tokens (use the named utilities, not hex)
`bg-brand-teal` `bg-brand-teal-dark` `bg-brand-amber` `bg-brand-deep` `bg-brand-canvas` `bg-brand-surface` `bg-brand-tint`
`text-brand-ink` `text-brand-body` `text-brand-muted` `text-brand-faint` `text-brand-on-dark`
`border-brand-line` `border-brand-line-soft` `border-brand-line-strong`
Ratings: `bg-prime-bg/text-prime-fg`, `fair-*`, `rough-*`
Fonts: `font-display` (Archivo, headings) — body inherits Public Sans.

## 3. Implemented pages

| Design page | Design lines | Target route file |
|---|---|---|
| Home (variant A) | 130–432 | ✅ `src/routes/home/index.tsx` |
| Rides & pricing | 581–672 | ✅ `src/routes/rides/index.tsx` |
| Conditions | 674–786 | ✅ `src/routes/weather/index.tsx` |
| Safety | 788–860 | ✅ `src/routes/safety/index.tsx` |
| Boat & fishing | 862–903 | ✅ `src/routes/boat-ride/index.tsx` |
| Fishing charters | Existing route | ✅ `src/routes/fishing-charters/index.tsx` |
| Plan your day | 905–939 | ✅ `src/routes/things-to-do-gordons-bay-on-the-water/index.tsx` |
| FAQs | 941–965 | ✅ `src/routes/jet-ski-faqs-gordons-bay/index.tsx` |
| Contact | 967–1044 | ✅ `src/routes/contact/index.tsx` |
| Legal | 1046–1060 | ✅ `src/routes/terms/index.tsx` + `/privacy` |

### Conditions engine
Home and Conditions share `src/lib/useConditions.ts` and
`src/components/brand/ConditionsBoard.tsx`, providing:
- **Real 7-day forecast.** The design hardcodes July-2026 sample values — **do not ship those.** The app already calls open-meteo in `src/components/HeroWeatherCard.tsx:141` (weather) and `:145` (marine/swell), and `src/routes/weather/calm-slots/index.tsx:81`. Reuse that.
- **Rating derivation:** `prime` / `fair` / `rough` from wind. Design thresholds (from `weatherGuides`): `<15 km/h` comfortable, `15–25` choppy, `>30` no launch.
- **Capacity calculator**, ported from design lines 1119–1202:
  ```
  launchTimes(): for (t = open; t + session <= close; t += session + turnaround)
  capacity = launchTimes().length * fleetSize
  ```
  Defaults: `open 09:00`, `winterClose 17:00`, `summerClose 19:45`, `fleetSize 2`, `turnaround 15min`, session ∈ {15,30,60}.
- **State:** `season` (winter|summer), `sessionLen`, `selectedDay` — all three drive UI toggles that ARE product features, keep them.
- Live 30/60-minute availability from `GET /api/timeslots`. The 15-minute
  concept remains an enquiry until checkout has a matching product and pricing
  contract; no fake booked-load data is shown.

## 4. Image mapping (decided — the design's slots were empty)

`img/hero-bay.png` from the design **could not be used**: `DesignSync.get_file` caps at 256 KiB and truncated it mid-file (no IEND chunk). It was deleted. Per the user's instruction, empty slots use existing project photos:

| Design slot | Use |
|---|---|
| `a-hero` / `b-hero` | `@/lib/images/IMG_3202.jpg` — harbour drone shot, matches the slot brief exactly |
| `a-ride1`, `a-fleet`, `safety-video` | `/Asunnydayofjetskiing.png` — jet ski action |
| `a-ride2`, `a-partner`, `boats-hero` | `@/lib/images/Spectatorboatride.png` — boat with passengers |
| `a-ride3` | `@/lib/images/IMG_3203.jpg` — turquoise water |
| `p-1`…`p-6` | mix of the above (already mapped in `THINGS_TO_DO`) |
| Add-on tiles | `drone-video.png`, `gopro-footage.png`, `wetsuit-hire.png`, `additional-passengers.png` — 1:1 match with the design's four add-ons |

All are already wired in `src/lib/brand-content.ts`. If real photography arrives later, swap there only.

## 5. Deliberate deviations from the design

1. **Dropped the A/B "DIRECTION" switcher** (design lines 133–145). It is a design-review device, not a product feature. **Implement variant A only** (it is the design's default via `hint-placeholder-val`). Variant B markup (lines 434–577) is an alternative hero treatment — ignore unless the user asks.
2. **Kept** the Winter/Summer and 15/30/60 session toggles — those are real features driving the capacity maths.
3. **`validateSearch` is deliberately not used** on `/indemnity`. Adding it tightened the router-wide search schema and broke `src/routes/rides/index.tsx:150` (`<Link search={{ rideId }}>`). The token is read from `window.location.search` instead. **Don't "fix" this** without also giving `/Bookings` an explicit search schema.
4. Header CTA "Check availability" → `/rides`, per the design. The real booking engine is `/Bookings`; consider using `pickPrimaryBookingAction()` from `src/lib/bookingControls.tsx` to point at `/Bookings` when `jetSkiBookingsEnabled`.

## 6. Remaining cleanup

1. Legacy `Header.tsx`, `Footer.tsx`, `Breadcrumbs.tsx`,
   `HolidayBanner.tsx`, `BookingPauseBanner.tsx` and `HeroWeatherCard.tsx` are
   no longer used by the redesigned public shell. They are intentionally left in
   place for a separate dead-code cleanup.
2. The full-repository lint command still reports pre-existing errors outside
   the redesign surface. The redesign files themselves pass ESLint.
3. Vitest currently has no test files and exits with code 1 for that reason.

## 7. Verification

1. `npm run build`
2. Run ESLint against the changed redesign files.
3. Verify the public routes at desktop and mobile widths before deployment.

### Do not break
`/Bookings`, `/indemnity`, `/admin/*`, `/payments/*` are functional, not marketing. They inherit the new tokens automatically via the shadcn palette remap. Restyle only; don't touch their logic.

### Verification commands
```bash
npx vite build          # also regenerates routeTree.gen.ts — run after adding routes
npx tsc --noEmit
npm run dev             # port 3000
```
Playwright is not a project dep; the previous session used a scratch install with `chromium.launch({ channel: 'chrome' })` because the bundled browser build was missing.
