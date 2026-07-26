import { createFileRoute } from '@tanstack/react-router'
import { Anchor, Check, Fish, LifeBuoy } from 'lucide-react'

import {
  BrandButton,
  ClosingCta,
  DisplayHeading,
  Eyebrow,
  Panel,
  Section,
  Shell,
  Shot,
} from '@/components/brand/primitives'
import { useBookingControls } from '@/lib/bookingControls'
import { CONTACT, ROUTES, boatImg, waterImg } from '@/lib/brand-content'

export const Route = createFileRoute('/fishing-charters/')({
  head: () => ({
    meta: [
      { title: "Fishing Charters | Gordon's Bay & False Bay" },
      {
        name: 'description',
        content:
          "Half-day and full-day skippered fishing charters from Gordon's Bay Harbour with tackle, bait and safety gear.",
      },
    ],
  }),
  component: FishingPage,
})

const trips = [
  {
    title: 'Half-day charter',
    duration: '4 hours · up to 6 guests',
    price: 'From ZAR 4 900',
    body: 'A focused morning or afternoon trip targeting seasonal False Bay species with a local skipper.',
  },
  {
    title: 'Full-day charter',
    duration: '8 hours · up to 6 guests',
    price: 'From ZAR 8 900',
    body: 'More range, more marks and time to follow conditions across the bay.',
  },
  {
    title: 'Custom crew trip',
    duration: 'Flexible timing',
    price: 'On quote',
    body: 'Private groups, content shoots, team days or a fishing leg added to a wider harbour itinerary.',
  },
]

function FishingPage() {
  const { controls } = useBookingControls()

  return (
    <div>
      <section className="relative isolate overflow-hidden bg-brand-deep">
        <img
          src={waterImg}
          alt="Open water in False Bay"
          className="absolute inset-0 -z-20 h-full w-full object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(6,32,47,0.96),rgba(6,32,47,0.72),rgba(6,32,47,0.35))]" />
        <Shell className="py-16 sm:py-20">
          <Eyebrow tone="amber">FISHING · FALSE BAY ADVENTURES</Eyebrow>
          <h1 className="mt-4 max-w-[850px] text-balance font-display text-[38px] font-extrabold leading-[1.05] tracking-[-0.03em] text-white sm:text-[54px]">
            Skippered fishing charters from Gordon&apos;s Bay.
          </h1>
          <p className="mt-5 max-w-[690px] text-[17px] leading-[1.65] text-brand-on-dark">
            Bring your crew. The boat, skipper, tackle, bait and safety equipment
            are coordinated from the same harbour.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <BrandButton
              to={controls.fishingChartersBookingsEnabled ? ROUTES.contact : ROUTES.boats}
              tone="amber"
              size="lg"
            >
              {controls.fishingChartersBookingsEnabled
                ? 'Enquire about a charter'
                : 'View current water experiences'}
            </BrandButton>
            <BrandButton to={ROUTES.boats} tone="ghost-dark" size="lg">
              Boat rides
            </BrandButton>
          </div>
        </Shell>
      </section>

      <Section>
        <div className="grid gap-5 lg:grid-cols-3">
          {trips.map((trip) => (
            <Panel key={trip.title} className="flex flex-col p-7">
              <Fish className="h-6 w-6 text-brand-teal" aria-hidden />
              <h2 className="mt-4 font-display text-[21px] font-bold text-brand-ink">
                {trip.title}
              </h2>
              <p className="mt-1.5 text-[13px] font-semibold text-brand-faint">
                {trip.duration}
              </p>
              <p className="mt-3 flex-1 text-[14.5px] leading-[1.6] text-brand-muted">
                {trip.body}
              </p>
              <div className="mt-5 font-display text-[23px] font-extrabold text-brand-ink">
                {trip.price}
              </div>
              <BrandButton to={ROUTES.contact} className="mt-5">
                Request this trip
              </BrandButton>
            </Panel>
          ))}
        </div>

        <Panel className="mt-5 grid overflow-hidden lg:grid-cols-2">
          <div className="min-h-[320px]">
            <Shot src={boatImg} alt="Fishing charter vessel and passengers" />
          </div>
          <div className="p-8 sm:p-10">
            <Eyebrow>WHAT IS INCLUDED</Eyebrow>
            <DisplayHeading className="mt-3" size="md">
              The practical pieces are handled.
            </DisplayHeading>
            <div className="mt-5 space-y-3">
              {[
                ['Licensed vessel and local skipper', Anchor],
                ['Tackle and bait for the planned trip', Fish],
                ['Life jackets and required safety gear', LifeBuoy],
                ['Same Gordon’s Bay Harbour meeting point', Check],
              ].map(([label, Icon]) => {
                const IconComponent = Icon as typeof Check
                return (
                  <div
                    key={label as string}
                    className="flex items-center gap-3 border-t border-brand-line-soft pt-3 text-[14.5px] text-brand-body"
                  >
                    <IconComponent className="h-4 w-4 text-brand-teal" aria-hidden />
                    {label as string}
                  </div>
                )
              })}
            </div>
          </div>
        </Panel>
      </Section>

      <ClosingCta
        title="Tell us the date and the kind of day you want."
        body="The team will confirm the vessel, target trip, weather window and final quote."
      >
        <BrandButton href={CONTACT.whatsapp} tone="amber" size="lg">
          Ask on WhatsApp
        </BrandButton>
      </ClosingCta>
    </div>
  )
}
