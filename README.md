# Jet Ski & More Frontend

Customer-facing website, booking journey, payment return flow, weather experience,
and operations dashboard for Jet Ski & More in Gordon's Bay, South Africa.

The application is a React single-page app built with Vite and TanStack Router. It
talks to the separate FastAPI service in the sibling `jetskiandmore-backend`
repository.

## What this application includes

- Marketing and SEO landing pages for jet-ski rides, boat rides, fishing charters,
  safety, locations, add-ons, and FAQs
- Availability-aware jet-ski booking flow
- Server-authoritative quotes and Yoco payment checkout
- Boat-ride enquiry flow
- Weather and marine-condition views powered by Open-Meteo
- Interim skipper quiz and safety onboarding
- Partner-pack landing page and downloadable brochure
- Admin login and dashboard
- Booking, calendar, revenue, and page-view analytics
- Booking enable/disable controls
- Email campaign, audience, recipient, asset, and marketing-advisor tools
- Client-side page-view collection for public pages

## System context

```text
Customer or admin browser
        |
        | HTTPS / JSON
        v
React + Vite frontend (this repository)
        |
        +---- Open-Meteo weather and marine APIs
        |
        v
FastAPI backend (jetskiandmore-backend)
        |
        +---- MongoDB
        +---- Yoco
        +---- Gmail SMTP
```

The frontend never calculates the final payable amount on its own. Display prices
exist in the UI, but the backend recalculates the authoritative quote before
creating or capturing a payment.

## Technology

- React 19 and TypeScript
- Vite 7
- TanStack Router with file-based routing and generated route types
- Tailwind CSS 4
- Radix UI primitives and local shadcn-style components
- React Hook Form and Zod
- Recharts
- Lucide icons
- Vitest and Testing Library
- ESLint and Prettier
- Vercel Analytics dependency and Vercel SPA deployment configuration

## Prerequisites

- Node.js 20.19+ or 22.12+
- npm 10+ recommended
- A running backend for local end-to-end work
- Yoco credentials on the backend for live payment testing

The committed lockfile is npm lockfile version 3. Use `npm ci` for deterministic
installs.

## Quick start

```bash
git clone <frontend-repository-url>
cd jetskiandmore-frontend
npm ci
```

Create `.env.local`:

```dotenv
VITE_API_BASE=http://localhost:8000
```

Start the development server:

```bash
npm run dev
```

Open:

- Website: <http://localhost:3000>
- Admin: <http://localhost:3000/admin>

The backend should be listening on `http://localhost:8000`. See the backend
README for MongoDB, SMTP, Yoco, seeding, and admin configuration.

## Environment variables

All Vite variables are embedded in the browser bundle. Never put secret keys,
passwords, OAuth client secrets, or SMTP credentials in a `VITE_*` variable.

| Variable               | Required    | Default                                      | Purpose                               |
| ---------------------- | ----------- | -------------------------------------------- | ------------------------------------- |
| `VITE_API_BASE`        | Recommended | `https://jetskiandmore-backend.onrender.com` | FastAPI origin with no trailing `/`   |
| `VITE_YOCO_PUBLIC_KEY` | No          | Loaded from `GET /api/payments/config`       | Optional browser-safe Yoco public key |

Use separate values per environment:

```dotenv
# .env.local
VITE_API_BASE=http://localhost:8000
```

```dotenv
# Vercel production environment
VITE_API_BASE=https://your-api.example.com
```

Restart the Vite development server after changing an environment file.

## Available commands

| Command                       | Purpose                                                        |
| ----------------------------- | -------------------------------------------------------------- |
| `npm run dev`                 | Run Vite on port 3000                                          |
| `npm run build`               | Build the production bundle, then run TypeScript checks        |
| `npm run serve`               | Preview the production build locally                           |
| `npm run test`                | Run Vitest once                                                |
| `npm run lint`                | Run ESLint                                                     |
| `npm run format -- --write .` | Format the repository with Prettier                            |
| `npm run check`               | Rewrite formatting and apply ESLint fixes; this modifies files |

The bare `npm run format` script has no file target and currently exits with a
Prettier error. Supply `--write .` as shown above, or use `npx prettier --check
.` for a non-mutating check.

The intended non-mutating CI gate is:

```bash
npx prettier --check .
npm run lint
npm run test
npm run build
```

## Application routes

TanStack Router derives routes from `src/routes`. `src/routeTree.gen.ts` is
generated and must not be edited by hand.

### Customer and content routes

| Route                                    | Purpose                                                                    |
| ---------------------------------------- | -------------------------------------------------------------------------- |
| `/`                                      | Redirects to the home experience                                           |
| `/home`                                  | Main landing page                                                          |
| `/Bookings`                              | Jet-ski selection, availability, participant details, add-ons, and payment |
| `/rides`                                 | Ride catalogue                                                             |
| `/boat-ride`                             | Boat-ride request form                                                     |
| `/fishing-charters`                      | Fishing-charter information and enquiry path                               |
| `/add-ons`                               | Add-on products                                                            |
| `/locations`                             | Operating location information                                             |
| `/contact`                               | General contact form                                                       |
| `/weather`                               | Current Gordon's Bay conditions                                            |
| `/weather/calm-slots`                    | Forecast-based calm-slot view                                              |
| `/safety`                                | Safety information                                                         |
| `/interim-skipper-quiz`                  | Tutorial acknowledgement, indemnity acceptance, and quiz submission        |
| `/partner-pack`                          | Tourism and referral partner page                                          |
| `/privacy`                               | Privacy policy                                                             |
| `/terms`                                 | Terms                                                                      |
| `/jet-ski-rental-gordons-bay`            | Gordon's Bay rental SEO landing page                                       |
| `/guided-jet-ski-rides-false-bay`        | False Bay guided-rides SEO landing page                                    |
| `/jet-ski-faqs-gordons-bay`              | Gordon's Bay FAQ landing page                                              |
| `/safety-requirements-jet-ski-rides`     | Safety-requirements SEO landing page                                       |
| `/things-to-do-gordons-bay-on-the-water` | Local activities SEO landing page                                          |
| `/why-ride-with-us`                      | Product trust and differentiation page                                     |

### Payment return routes

| Route                 | Purpose                                                         |
| --------------------- | --------------------------------------------------------------- |
| `/payments/success`   | Reconcile a checkout, payment, or order and confirm the booking |
| `/payments/result`    | Alternate payment/order verification result page                |
| `/payments/cancelled` | Preserve booking context so the customer can retry              |
| `/payments/failed`    | Explain failed payment and provide retry navigation             |

### Admin routes

| Route                     | Purpose                                                      |
| ------------------------- | ------------------------------------------------------------ |
| `/admin`                  | Login and authenticated admin layout                         |
| `/admin/overview`         | Operational summary                                          |
| `/admin/bookings`         | Search, inspect, update, and delete bookings                 |
| `/admin/calendar`         | Booking calendar                                             |
| `/admin/analytics`        | Revenue, booking, and page-view analysis                     |
| `/admin/booking-controls` | Enable or disable booking categories                         |
| `/admin/marketing`        | Campaigns, audiences, uploads, assets, sending, and insights |
| `/admin/quiz`             | Review interim skipper quiz submissions                      |
| `/admin/growth`           | Browser-local growth planning board                          |
| `/admin/support`          | Admin usage and troubleshooting guidance                     |

The admin bearer token is stored in browser `localStorage` under
`jsm_admin_token`. The backend token expires after 60 minutes.

## Core flows

### Booking and payment

1. The public layout loads `/api/booking-controls`.
2. The customer selects a ride, a weekend date, a server-returned time slot,
   participants, and add-ons.
3. The frontend requests `/api/payments/quote`.
4. The backend recalculates the amount from MongoDB-backed or fallback pricing.
5. The frontend first requests a hosted Yoco Checkout session.
6. If Checkout cannot be created, it tries a Yoco OAuth Payment Link.
7. If that also fails, it loads the Yoco Web SDK, tokenizes payment details, and
   asks the backend to charge the token.
8. Hosted payment context is temporarily stored in browser `localStorage` as
   `jsm_last_payment`.
9. The return page asks the backend to verify the payment.
10. On approval, the backend persists the booking, marks the slot booked, creates
    participants and indemnity tokens, and sends notifications.

The booking UI currently limits selectable dates to Saturdays and Sundays and
contains a hard-coded exclusion for `2026-01-17`. Review this rule before each
operating season.

The backend currently generates token links to `/indemnity`, but this repository
has no matching frontend route. The existing interim skipper quiz is a separate
flow. Do not claim that per-participant indemnity links work until the route is
implemented and tested.

### Booking controls

Public booking controls come from MongoDB through
`GET /api/booking-controls`. The frontend caches the most recent response under
`jsm_booking_controls`, but falls back to these safe defaults:

- Jet-ski bookings disabled
- Boat-ride bookings enabled
- Fishing-charter bookings enabled

Only an authenticated admin can change the persisted controls.

### Weather

Weather views prefer the backend's cached `GET /api/weather/harbour` aggregation,
which combines Open-Meteo weather and marine guidance into current, hourly, and
seven-day conditions. The response includes wind and gusts, wave and swell
height/period, precipitation, visibility, sea temperature, explainable
prime/fair/rough scores, and ranked two-hour riding windows.

Until that backend revision is reachable—or during a backend outage—the public
page falls back to a smaller direct Open-Meteo weather and marine request so the
forecast does not disappear completely. Harbour coordinates and the
`Africa/Johannesburg` timezone are shared with the backend configuration.

Weather data is advisory. The business's operational go/no-go decision remains
the source of truth.

### Analytics

The public root layout records route visits, duration, referrer, browser, OS,
device type, language, session ID, and visitor ID through
`POST /api/metrics/pageview`. Admin routes are excluded.

Identifiers are stored as:

- `jsm_session_id` in session and local storage
- `jsm_visitor_id` in local storage

Keep the privacy policy aligned with the fields collected by this implementation.

### Growth board

The `/admin/growth` board is stored only in that browser's local storage. It is
not shared between admins and is not backed up by the API.

## Project structure

```text
.
├── public/
│   ├── partner-pack/       # Static brochure and booking QR asset
│   ├── robots.txt
│   ├── sitemap.xml
│   └── manifest.json
├── src/
│   ├── admin/              # Shared admin types, context, and booking helpers
│   ├── components/         # Site shell, banners, weather card, and UI components
│   ├── features/
│   │   ├── bookings/       # Booking add-ons
│   │   └── weather/        # Weather presentation
│   ├── lib/
│   │   ├── api.ts          # Backend client and API types
│   │   ├── bookingControls.tsx
│   │   ├── site.ts
│   │   └── yoco.ts         # Browser-side Yoco SDK loader
│   ├── routes/             # File-based public, payment, and admin routes
│   ├── main.tsx            # Router and React bootstrap
│   ├── routeTree.gen.ts    # Generated TanStack route tree
│   └── styles.css
├── index.html
├── package.json
├── vite.config.ts
└── vercel.json
```

## Adding or changing a route

1. Add or edit a file under `src/routes`.
2. Export a `Route` created with `createFileRoute`.
3. Let the TanStack Vite plugin regenerate `src/routeTree.gen.ts`.
4. Add navigation where appropriate.
5. Update `public/sitemap.xml` for a public indexable page.
6. Add title, description, canonical, and structured metadata where needed.
7. Run lint, tests, and the production build.

Do not manually edit `src/routeTree.gen.ts`.

## Backend integration

The shared API wrapper is `src/lib/api.ts`. Public and admin screens also use
direct `fetch` calls where specialized response handling is required.

The frontend depends on these backend capability groups:

- Booking controls and availability
- Contact and booking requests
- Yoco quote, checkout, link, charge, and verification
- Admin authentication and booking management
- Booking and page-view analytics
- Interim skipper quiz
- Participant indemnities
- Marketing campaigns, recipients, assets, events, insights, and advisor status

FastAPI exposes live OpenAPI documentation at the backend's `/docs` and
`/redoc` routes.

## Testing

Vitest is configured through the Vite toolchain, but the repository currently
contains no committed `*.test.*` or `*.spec.*` files. `npm run test` currently
exits with code 1 because it finds no tests.

The production build passes. The repository-wide ESLint command currently has a
large pre-existing error baseline, including configuration-file parser errors,
import ordering, array-style rules, and missing `react-hooks/exhaustive-deps`
rule registration. Treat lint and tests as required gates to repair, not as
passing checks today.

Highest-value tests to add:

1. Server quote vs displayed booking totals
2. Booking control fallback and refresh behavior
3. Checkout-to-payment-link-to-token fallback order
4. Payment return reconciliation with and without local storage
5. Admin token expiry and unauthorized behavior
6. Weekend and blocked-date rules
7. Analytics exclusion for admin routes

For payment work, use Yoco test credentials and a non-production MongoDB
database. A successful frontend redirect alone does not prove that the booking,
slot, participant records, and emails were created.

## Production build

```bash
npm ci
npm run build
npm run serve
```

The build output is written to `dist/`. Test key SPA routes directly in preview,
not only through client-side navigation:

```text
/Bookings
/payments/success
/admin
/admin/bookings
```

## Deployment on Vercel

`vercel.json` rewrites extensionless paths to `index.html`, which is required for
direct navigation to TanStack Router routes.

Recommended project settings:

| Setting          | Value                                        |
| ---------------- | -------------------------------------------- |
| Framework preset | Vite                                         |
| Install command  | `npm ci`                                     |
| Build command    | `npm run build`                              |
| Output directory | `dist`                                       |
| Environment      | `VITE_API_BASE=https://your-api.example.com` |

After deployment:

1. Add the production frontend origin to the backend's
   `JSM_ALLOWED_ORIGINS`.
2. Set the backend `JSM_SITE_BASE_URL` to the canonical frontend origin.
3. Verify direct navigation to nested routes.
4. Run a test contact request.
5. Run a Yoco test transaction end to end.
6. Confirm the booking, participant, timeslot, and email results.
7. Confirm `/robots.txt` and `/sitemap.xml` use the correct canonical domain.

## Security and privacy

- Only Yoco's public key may be exposed to the frontend.
- The backend must calculate all payable totals.
- Never log or store raw card details.
- Admin tokens in local storage are exposed to any successful XSS attack; keep
  dependencies and HTML rendering paths reviewed.
- Booking context in local storage contains customer PII. It is removed after a
  successful verification, but can remain after abandonment or failure.
- Marketing HTML and uploaded assets need careful review before widening admin
  access.
- Keep the privacy policy consistent with analytics, contact, booking, quiz, and
  participant data collection.

## Troubleshooting

### The UI is calling the hosted API during local development

`VITE_API_BASE` is missing or was not loaded. Create `.env.local`, then restart
`npm run dev`.

### The browser reports a CORS error

Add the exact frontend origin, including scheme and port, to
`JSM_ALLOWED_ORIGINS` on the backend. Restart or redeploy the API.

### Bookings appear closed

Check `/api/booking-controls`, then verify the admin control and the
`site_settings` document in MongoDB. When the API cannot be reached, the
frontend deliberately falls back to jet-ski bookings disabled.

### No time slots appear

Confirm the selected date is a future Saturday or Sunday, the backend is
reachable, the timeslot collection is seeded or bookings permit the slot, and
the requested fleet capacity is available.

### The payment redirects but the booking is missing

Check the browser's `jsm_last_payment` value, the return-page request, backend
logs, Yoco payment status, and MongoDB `bookings`, `timeslots`, and
`participants` collections. Payment approval and booking persistence are
separate checks.

### Admin login succeeds and then requests return 401

The token expires after 60 minutes. Log in again. If the issue is immediate,
confirm `JSM_ADMIN_EMAIL`, `JSM_ADMIN_PASSWORD`, and `JSM_ADMIN_JWT_SECRET` are
consistent on the active backend instance.

### Direct links return 404 in production

Confirm the deployment is using the committed Vercel rewrite and that all
extensionless routes are served from `index.html`.

## Operational checklist

Before opening bookings:

- Confirm booking controls
- Confirm current ride and add-on pricing in MongoDB
- Review the frontend's seasonal date rules
- Seed or inspect availability
- Verify Yoco test and then live credentials in the correct environment
- Verify SMTP delivery to both admin and customer addresses
- Confirm the canonical site URL and CORS origins
- Complete one physical end-to-end booking reconciliation
- Review privacy, terms, cancellation, and weather messaging

## Related repository

The FastAPI service is maintained separately in `jetskiandmore-backend`. Both
repositories must be configured and deployed for booking, payment, admin,
analytics, email, and marketing features to work.
