import * as React from 'react'
import { createFileRoute, Link, useRouterState } from '@tanstack/react-router'
import { ArrowDown, ArrowUp, CalendarClock, Check, Clock3, Copy, FileDown, MapPinned, Plus, Route as RouteIcon, Waves, Compass } from 'lucide-react'

import {
  BrandButton,
  ClosingCta,
  DisplayHeading,
  Eyebrow,
  Panel,
  Shell,
  Shot,
} from '@/components/brand/primitives'
import { CONTACT, ROUTES, THINGS_TO_DO, TRAVEL_PARTNERS, harbourImg } from '@/lib/brand-content'

export const Route = createFileRoute('/things-to-do-gordons-bay-on-the-water/')({
  head: () => ({
    meta: [
      { title: "Plan a Day in Gordon's Bay | Jet Ski & More" },
      {
        name: 'description',
        content:
          "Build a Gordon's Bay day around a morning jet ski session, local food, beaches and the Clarence Drive coast.",
      },
    ],
  }),
  component: PlanPage,
})

const RIDE_STARTS = ['08:00', '09:00', '10:00', '11:00']
const HARBOUR = 'Gordon’s Bay Harbour, South Africa'
const PLAN_ACTIVITIES = [
  ...THINGS_TO_DO.map((activity) => ({ ...activity, isPartner: false as const, partnerLogoUrl: undefined as string | undefined, partnerLogoAlt: undefined as string | undefined, partnerWebsiteUrl: undefined as string | undefined })),
  ...TRAVEL_PARTNERS.map((partner) => ({
    id: `partner:${partner.id}`,
    tag: partner.category.toUpperCase(),
    title: partner.name,
    body: partner.summary,
    minutes: partner.durationMinutes,
    location: partner.location,
    Icon: Compass,
    img: partner.imageUrl,
    imageAlt: partner.imageAlt || partner.name,
    isPartner: true as const,
    partnerLogoUrl: partner.logoUrl,
    partnerLogoAlt: partner.logoAlt || `${partner.name} logo`,
    partnerWebsiteUrl: partner.bookingUrl || partner.websiteUrl,
  })),
]

function addMinutes(time: string, minutes: number) {
  const [hour, minute] = time.split(':').map(Number)
  const total = hour * 60 + minute + minutes
  return `${String(Math.floor(total / 60) % 24).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`
}

function routeUrl(activities: Array<{ location: string }>) {
  const locations = activities.map((activity) => activity.location)
  const params = new URLSearchParams({ api: '1', origin: HARBOUR, destination: locations.at(-1) || HARBOUR })
  if (locations.length > 1) params.set('waypoints', locations.slice(0, -1).join('|'))
  return `https://www.google.com/maps/dir/?${params.toString()}`
}

function PlanPage() {
  const searchStr = useRouterState({ select: (state) => state.location.searchStr })
  const requestedActivity = new URLSearchParams(searchStr).get('add')
  const [rideStart, setRideStart] = React.useState('08:00')
  const [rideMinutes, setRideMinutes] = React.useState(30)
  const [selectedIds, setSelectedIds] = React.useState<string[]>(() => ['food', 'harbour', ...(requestedActivity && PLAN_ACTIVITIES.some((activity) => activity.id === requestedActivity) ? [requestedActivity] : [])])
  const [copied, setCopied] = React.useState(false)

  const selectedActivities = selectedIds.flatMap((id) => {
    const activity = PLAN_ACTIVITIES.find((item) => item.id === id)
    return activity ? [activity] : []
  })
  const dayPlan = React.useMemo(() => {
    const stops = [{
      time: addMinutes(rideStart, -15),
      end: rideStart,
      title: 'Arrive at Gordon’s Bay Harbour',
      body: 'Check in 15 minutes before launch for your safety briefing. Confirm conditions with the skipper.',
      duration: '15 min',
    }, {
      time: rideStart,
      end: addMinutes(rideStart, rideMinutes),
      title: `${rideMinutes}-minute water session`,
      body: 'Start your day on the water. The skipper makes the final launch decision based on harbour and sea conditions.',
      duration: `${rideMinutes} min`,
    }]
    let nextTime = addMinutes(rideStart, rideMinutes + 30)
    for (const activity of selectedActivities) {
      stops.push({
        time: nextTime,
        end: addMinutes(nextTime, activity.minutes),
        title: activity.title,
        body: activity.body,
        duration: `${activity.minutes >= 60 ? `${Math.floor(activity.minutes / 60)} hr${activity.minutes >= 120 ? 's' : ''}${activity.minutes % 60 ? ` ${activity.minutes % 60} min` : ''}` : `${activity.minutes} min`}`,
      })
      nextTime = addMinutes(nextTime, activity.minutes + 20)
    }
    return stops
  }, [rideStart, rideMinutes, selectedActivities])

  const itineraryText = dayPlan.map((stop) => `${stop.time}–${stop.end} · ${stop.title}\n${stop.body}`).join('\n\n')
  const whatsappPlan = `Hi Jet Ski & More, can you help with this Gordon’s Bay day plan?\n\n${itineraryText}`
  const printablePartners = selectedActivities.filter((activity) => activity.isPartner)

  function toggleActivity(id: string) {
    setSelectedIds((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id])
    setCopied(false)
  }

  function moveActivity(id: string, direction: -1 | 1) {
    setSelectedIds((current) => {
      const index = current.indexOf(id)
      const nextIndex = index + direction
      if (index < 0 || nextIndex < 0 || nextIndex >= current.length) return current
      const next = [...current]
      ;[next[index], next[nextIndex]] = [next[nextIndex], next[index]]
      return next
    })
  }

  async function copyPlan() {
    try {
      await navigator.clipboard.writeText(itineraryText)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2200)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div>
      <div className="print:hidden">
      <Shell className="pt-10 sm:pt-14">
        <div className="grid items-center gap-8 lg:grid-cols-[1.05fr_.95fr]">
          <div>
            <Eyebrow>PLAN YOUR DAY · GORDON’S BAY</Eyebrow>
            <DisplayHeading as="h1" className="mt-3 max-w-[760px]" size="xl">
              Build a day around the bay.
            </DisplayHeading>
            <p className="mt-4 max-w-[650px] text-[17px] leading-[1.65] text-brand-muted">
              Choose your ride time, add the things you want to do, and get a practical schedule and route you can use.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <BrandButton to={ROUTES.weather} tone="outline">Check launch conditions</BrandButton>
              <BrandButton to={ROUTES.rides}>See ride options</BrandButton>
            </div>
            <p className="mt-4 text-sm text-brand-faint">Jet ski sessions are weather-dependent. Forecasts help you plan; the skipper confirms whether it is safe to launch.</p>
          </div>
          <div className="relative h-[260px] overflow-hidden rounded-[24px] sm:h-[340px]">
            <Shot src={harbourImg} alt="Gordon’s Bay Harbour and the breakwater" className="absolute inset-0" position="center 55%" />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-deep/75 via-brand-deep/10 to-transparent" />
            <div className="absolute bottom-5 left-5 text-white">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/75">Your starting point</p>
              <p className="mt-1 font-display text-xl font-bold">Gordon’s Bay Harbour</p>
            </div>
          </div>
        </div>

        <section className="mt-12 grid items-start gap-6 lg:grid-cols-[.9fr_1.1fr]" aria-labelledby="planner-title">
          <Panel className="p-6 sm:p-8">
            <Eyebrow>MAKE IT YOURS</Eyebrow>
            <h2 id="planner-title" className="mt-2 font-display text-2xl font-extrabold text-brand-ink">Choose your day</h2>
            <p className="mt-2 text-sm leading-6 text-brand-muted">Your water session is the anchor. Add as many nearby stops as you like; we’ll fit them into a suggested order.</p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <label className="space-y-2 text-sm font-semibold text-brand-ink">
                <span className="flex items-center gap-2"><CalendarClock className="h-4 w-4 text-brand-teal" /> Ride start</span>
                <select value={rideStart} onChange={(event) => setRideStart(event.target.value)} className="w-full rounded-xl border border-brand-line bg-white px-3 py-3 font-normal">
                  {RIDE_STARTS.map((time) => <option key={time} value={time}>{time}</option>)}
                </select>
              </label>
              <label className="space-y-2 text-sm font-semibold text-brand-ink">
                <span className="flex items-center gap-2"><Waves className="h-4 w-4 text-brand-teal" /> Ride length</span>
                <select value={rideMinutes} onChange={(event) => setRideMinutes(Number(event.target.value))} className="w-full rounded-xl border border-brand-line bg-white px-3 py-3 font-normal">
                  <option value={30}>30 minutes</option>
                  <option value={60}>60 minutes</option>
                </select>
              </label>
            </div>

            <div className="mt-7 flex items-end justify-between gap-3">
              <div>
                <h3 className="font-bold text-brand-ink">Add nearby activities</h3>
                <p className="mt-1 text-xs text-brand-faint">Choose or remove any stop.</p>
              </div>
              <span className="text-xs font-semibold text-brand-teal">{selectedActivities.length} selected</span>
            </div>
            <div className="mt-3 space-y-2">
              {PLAN_ACTIVITIES.map((activity) => {
                const selected = selectedIds.includes(activity.id)
                const Icon = activity.Icon
                return (
                  <div key={activity.id} className={`rounded-xl border p-3 transition-colors ${selected ? 'border-brand-teal bg-teal-50/60' : 'border-brand-line bg-white'}`}>
                    <div className="flex items-center gap-3">
                      <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${selected ? 'bg-brand-teal text-white' : 'bg-brand-deep/5 text-brand-teal'}`}>
                        {selected ? <Check className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                      </span>
                      <button type="button" aria-pressed={selected} onClick={() => toggleActivity(activity.id)} className="min-w-0 flex-1 text-left">
                        <span className="block text-[11px] font-bold tracking-wide text-brand-teal">{activity.tag}</span>
                        <span className="mt-0.5 block font-semibold text-brand-ink">{activity.title}</span>
                        <span className="mt-1 flex items-center gap-1 text-xs text-brand-faint"><Clock3 className="h-3 w-3" /> About {activity.minutes >= 60 ? `${Math.floor(activity.minutes / 60)} hr${activity.minutes >= 120 ? 's' : ''}${activity.minutes % 60 ? ` ${activity.minutes % 60} min` : ''}` : `${activity.minutes} min`}</span>
                      </button>
                      <button type="button" aria-label={`${selected ? 'Remove' : 'Add'} ${activity.title}`} onClick={() => toggleActivity(activity.id)} className="rounded-lg p-2 text-brand-teal hover:bg-white">
                        {selected ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </Panel>

          <Panel className="overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-brand-line-soft p-6 sm:p-8">
              <div>
                <Eyebrow>YOUR DAY PLAN</Eyebrow>
                <h2 className="mt-2 font-display text-2xl font-extrabold text-brand-ink">A schedule you can use</h2>
                <p className="mt-1 text-sm text-brand-muted">Times are estimates; travel and wait times can vary.</p>
                <Link to={ROUTES.vendors} className="mt-2 inline-flex text-xs font-bold text-brand-teal underline">Local venture? Become a vendor</Link>
              </div>
              <span className="rounded-full bg-brand-deep/5 px-3 py-1.5 text-xs font-semibold text-brand-teal">{dayPlan.length} stops</span>
            </div>
            <ol className="space-y-0 px-6 py-2 sm:px-8">
              {dayPlan.map((stop, index) => {
                const activity = selectedActivities.find((item) => item.title === stop.title)
                const selectedIndex = activity ? selectedIds.indexOf(activity.id) : -1
                return (
                  <li key={`${stop.title}-${index}`} className="relative grid grid-cols-[58px_20px_1fr] gap-3 py-4">
                    <div className="pt-0.5 text-sm font-extrabold tabular-nums text-brand-teal">{stop.time}</div>
                    <div className="relative flex justify-center">
                      <span className="relative z-10 mt-1 h-3 w-3 rounded-full border-[3px] border-brand-teal bg-white" />
                      {index < dayPlan.length - 1 && <span className="absolute top-4 h-full w-px bg-brand-line" />}
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-bold text-brand-ink">{stop.title}</h3>
                        <span className="rounded-full bg-brand-deep/5 px-2 py-0.5 text-[11px] text-brand-muted">{stop.duration}</span>
                      </div>
                      <p className="mt-1 text-sm leading-6 text-brand-muted">{stop.body}</p>
                      {selectedIndex >= 0 && <div className="mt-2 flex gap-1">
                        <button type="button" disabled={selectedIndex === 0} onClick={() => moveActivity(activity!.id, -1)} className="rounded-md border border-brand-line p-1.5 text-brand-muted disabled:opacity-30" aria-label={`Move ${activity!.title} earlier`}><ArrowUp className="h-3.5 w-3.5" /></button>
                        <button type="button" disabled={selectedIndex === selectedIds.length - 1} onClick={() => moveActivity(activity!.id, 1)} className="rounded-md border border-brand-line p-1.5 text-brand-muted disabled:opacity-30" aria-label={`Move ${activity!.title} later`}><ArrowDown className="h-3.5 w-3.5" /></button>
                        <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(activity!.location)}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-md border border-brand-line px-2 py-1 text-xs font-semibold text-brand-teal">Directions <MapPinned className="h-3.5 w-3.5" /></a>
                      </div>}
                    </div>
                  </li>
                )
              })}
            </ol>
            <div className="flex flex-wrap gap-2 border-t border-brand-line-soft p-6 sm:px-8">
              <button type="button" onClick={copyPlan} className="inline-flex items-center gap-2 rounded-xl border border-brand-line-strong px-4 py-3 text-sm font-bold text-brand-ink hover:border-brand-teal">
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}{copied ? 'Copied' : 'Copy itinerary'}
              </button>
              <button type="button" title="Choose Save as PDF in the print dialog" onClick={() => window.print()} className="inline-flex items-center gap-2 rounded-xl border border-brand-line-strong px-4 py-3 text-sm font-bold text-brand-ink hover:border-brand-teal">
                <FileDown className="h-4 w-4" /> Print or save PDF
              </button>
              <a href={routeUrl(selectedActivities)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl bg-brand-teal px-4 py-3 text-sm font-bold text-white hover:bg-brand-teal-dark">
                <RouteIcon className="h-4 w-4" /> Open route in Maps
              </a>
              <a href={`${CONTACT.whatsapp}?text=${encodeURIComponent(whatsappPlan)}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl border border-brand-line-strong px-4 py-3 text-sm font-bold text-brand-ink hover:border-brand-teal">Ask us about this plan</a>
            </div>
          </Panel>
        </section>

        <section className="mt-12" aria-label="Local stops">
          <Eyebrow>LOCAL STOPS</Eyebrow>
          <DisplayHeading as="h2" className="mt-2" size="md">Pick what fits your crew.</DisplayHeading>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-brand-muted">Save nearby stops to your plan, change their order and open directions for each place. Check current access, opening times and local conditions before setting off.</p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {THINGS_TO_DO.map((activity) => {
              const Icon = activity.Icon
              return <Panel key={activity.id} className="overflow-hidden">
                {activity.img ? <div className="h-40"><Shot src={activity.img} alt={activity.imageAlt || activity.title} /></div> : <div className="flex h-40 items-center justify-center bg-gradient-to-br from-brand-deep to-brand-teal text-white"><Icon className="h-12 w-12 opacity-90" strokeWidth={1.4} /></div>}
                <div className="p-5">
                  <Eyebrow>{activity.tag}</Eyebrow>
                  <h3 className="mt-2 font-display text-lg font-bold text-brand-ink">{activity.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-brand-muted">{activity.body}</p>
                  <button type="button" onClick={() => toggleActivity(activity.id)} className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-brand-teal hover:underline">
                    {selectedIds.includes(activity.id) ? 'Remove from my day' : 'Add to my day'} {selectedIds.includes(activity.id) ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                  </button>
                </div>
              </Panel>
            })}
          </div>
        </section>

        <section className="mt-14 grid gap-6 lg:grid-cols-[1fr_1.1fr]" aria-labelledby="planner-partners-title">
          <div className="rounded-[26px] bg-brand-deep p-7 text-white sm:p-9">
            <Eyebrow>LOCAL TRAVEL NETWORK</Eyebrow>
            <h2 id="planner-partners-title" className="mt-3 font-display text-3xl font-extrabold">Are you part of the visitor journey?</h2>
            <p className="mt-3 text-sm leading-6 text-white/75">We’re connecting visitors with local stays, transfers, guides, travel planners and creators. Tell us what you do and explore working with Jet Ski &amp; More.</p>
            <BrandButton to={ROUTES.vendors} tone="amber" className="mt-6">Become a vendor</BrandButton>
          </div>

          <div className="rounded-[26px] border border-brand-line bg-white p-7 sm:p-9">
            <Eyebrow>LOCAL PARTNERS IN YOUR PLAN</Eyebrow>
            <h2 className="mt-2 font-display text-2xl font-extrabold text-brand-ink">Find trusted local stays, rides and guides.</h2>
            {TRAVEL_PARTNERS.length > 0 ? <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {TRAVEL_PARTNERS.map((partner) => <article key={partner.id} className="rounded-2xl border border-brand-line p-4">
                <div className="flex items-center gap-3">{partner.logoUrl && <img src={partner.logoUrl} alt={partner.logoAlt || `${partner.name} logo`} className="h-11 w-11 rounded-lg border border-brand-line bg-white object-contain p-1" />}<div><p className="text-[11px] font-bold uppercase tracking-wider text-brand-teal">{partner.category}</p><h3 className="font-bold text-brand-ink">{partner.name}</h3></div></div>
                <p className="mt-2 text-sm leading-5 text-brand-muted">{partner.summary}</p>
                <div className="mt-3 flex flex-wrap gap-3"><button type="button" onClick={() => toggleActivity(`partner:${partner.id}`)} className="text-sm font-bold text-brand-teal hover:underline">{selectedIds.includes(`partner:${partner.id}`) ? 'Added to your day' : 'Add to your day'}</button>{partner.websiteUrl && <a href={partner.websiteUrl} target="_blank" rel="noreferrer" className="text-sm font-bold text-brand-teal underline">Visit provider</a>}</div>
              </article>)}
            </div> : <div className="mt-4 rounded-2xl bg-brand-tint/60 p-5">
              <p className="font-bold text-brand-ink">We’re inviting the first local providers.</p>
              <p className="mt-1 text-sm leading-6 text-brand-muted">Approved partners will appear here so you can add them to your itinerary and Maps route.</p>
              <Link to={ROUTES.vendors} className="mt-3 inline-flex font-bold text-brand-teal underline">Are you a provider? Join the network</Link>
            </div>}
          </div>
        </section>
      </Shell>

      <ClosingCta
        gradient
        title="Start with the water. Build the rest of the day around it."
        body="Check the forecast first, then confirm the launch with our team. Your plan is adjustable if conditions change."
      >
        <BrandButton to={ROUTES.weather} tone="amber" size="lg">Check conditions</BrandButton>
        <BrandButton href={CONTACT.whatsapp} tone="ghost-dark" size="lg">Ask for a local plan</BrandButton>
      </ClosingCta>
      </div>

      <section className="hidden print:block" aria-label="Printable trip itinerary">
        <style>{`@page { size: A4; margin: 15mm; } @media print { html, body { background: #fff !important; color: #102a36 !important; print-color-adjust: exact; -webkit-print-color-adjust: exact; } }`}</style>
        <div className="mx-auto max-w-[760px] font-sans text-slate-800">
          <header className="flex items-center justify-between border-b-2 border-teal-700 pb-5">
            <div className="flex items-center gap-3">
              <img src="/brand/logo-badge.png" alt="Jet Ski & More" className="h-14 w-14 object-contain" />
              <div><p className="text-xs font-bold uppercase tracking-[.18em] text-teal-800">JET SKI &amp; MORE · GORDON’S BAY</p><p className="mt-1 text-xs text-slate-500">A day plan for the Western Cape</p></div>
            </div>
            <div className="text-right"><p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Prepared</p><p className="mt-1 text-sm font-bold">{new Intl.DateTimeFormat('en-ZA', { dateStyle: 'long' }).format(new Date())}</p></div>
          </header>

          <div className="py-6">
            <h1 className="font-display text-3xl font-extrabold text-slate-900">Your Gordon’s Bay itinerary</h1>
            <p className="mt-2 text-sm text-slate-600">Start at Gordon’s Bay Harbour · Ride at {rideStart} · {rideMinutes}-minute water session</p>
          </div>

          <ol className="space-y-0">
            {dayPlan.map((stop, index) => {
              const activity = selectedActivities.find((item) => item.title === stop.title)
              return <li key={`${stop.title}-${index}`} className="flex gap-4 border-t border-slate-200 py-4">
                <div className="w-[58px] shrink-0 pt-0.5 text-sm font-extrabold tabular-nums text-teal-800">{stop.time}</div>
                {activity?.isPartner && activity.partnerLogoUrl ? <img src={activity.partnerLogoUrl} alt={activity.partnerLogoAlt} className="h-12 w-12 shrink-0 rounded-lg border border-slate-200 bg-white object-contain p-1.5" /> : <span className="mt-1 h-3 w-3 shrink-0 rounded-full bg-teal-700" />}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2"><h2 className="font-bold text-slate-900">{stop.title}</h2><span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] text-slate-600">{stop.duration}</span></div>
                  <p className="mt-1 text-sm leading-5 text-slate-600">{stop.body}</p>
                  {activity?.isPartner && <div className="mt-1 flex flex-wrap gap-x-3 text-xs text-teal-800">{activity.partnerWebsiteUrl && <span>{activity.partnerWebsiteUrl}</span>}<span>{activity.location}</span></div>}
                </div>
              </li>
            })}
          </ol>

          <div className="mt-5 rounded-xl bg-slate-50 p-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">Your route</h2>
            <p className="mt-1 break-all text-xs text-slate-600">Gordon’s Bay Harbour{selectedActivities.length ? ` → ${selectedActivities.map((item) => item.title).join(' → ')}` : ''}</p>
            <a href={routeUrl(selectedActivities)} className="mt-2 inline-block text-sm font-bold text-teal-800">Open this route in Google Maps</a>
          </div>

          {printablePartners.length > 0 && <section className="mt-6 break-inside-avoid">
            <h2 className="border-b border-slate-200 pb-2 text-xs font-bold uppercase tracking-wider text-slate-700">Local providers in your plan</h2>
            <div className="mt-3 grid grid-cols-2 gap-3">
              {printablePartners.map((partner) => <article key={partner.id} className="flex items-center gap-3 rounded-xl border border-slate-200 p-3">
                {partner.partnerLogoUrl ? <img src={partner.partnerLogoUrl} alt={partner.partnerLogoAlt} className="h-12 w-12 shrink-0 rounded-lg bg-white object-contain" /> : <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-teal-50 text-xs font-black text-teal-800">{partner.title.slice(0, 2).toUpperCase()}</span>}
                <div className="min-w-0"><p className="text-[10px] font-bold uppercase tracking-wide text-teal-800">{partner.tag}</p><p className="truncate text-sm font-bold">{partner.title}</p>{partner.partnerWebsiteUrl && <p className="truncate text-[10px] text-slate-500">{partner.partnerWebsiteUrl}</p>}</div>
              </article>)}
            </div>
          </section>}

          <footer className="mt-7 border-t border-slate-200 pt-4 text-xs leading-5 text-slate-500">
            <p className="font-semibold text-slate-700">A few helpful notes</p>
            <p className="mt-1">Times and travel durations are estimates. Jet ski sessions are weather-dependent; the skipper confirms whether conditions are safe to launch. Check provider availability and current access before travelling.</p>
            <p className="mt-2">Jet Ski &amp; More · {CONTACT.phone} · {CONTACT.email} · jetskiandmore.com</p>
          </footer>
        </div>
      </section>
    </div>
  )
}
