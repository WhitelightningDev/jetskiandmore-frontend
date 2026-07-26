import { createFileRoute } from '@tanstack/react-router'

import {
  BrandButton,
  ClosingCta,
  DisplayHeading,
  Eyebrow,
  Panel,
  Shell,
  Shot,
} from '@/components/brand/primitives'
import { CONTACT, ITINERARY, ROUTES, THINGS_TO_DO } from '@/lib/brand-content'

export const Route = createFileRoute('/things-to-do-gordons-bay-on-the-water/')({
  head: () => ({
    meta: [
      { title: "Plan a Day in Gordon's Bay | Jet Ski & More" },
      {
        name: 'description',
        content:
          "Build a Gordon's Bay day around a morning jet ski or boat session, Bikini Beach, Clarence Drive, harbour food and whale watching.",
      },
    ],
  }),
  component: PlanPage,
})

function PlanPage() {
  return (
    <div>
      <Shell className="pt-12 sm:pt-16">
        <Eyebrow>PLAN YOUR DAY</Eyebrow>
        <DisplayHeading as="h1" className="mt-3 max-w-[860px]" size="xl">
          Make a day of it in Gordon&apos;s Bay.
        </DisplayHeading>
        <p className="mt-4 max-w-[720px] text-[17px] leading-[1.65] text-brand-muted">
          Ride in the calm of the morning, then spend the afternoon on one of the
          best stretches of coast in the Cape. Everything below is within easy
          reach of the harbour.
        </p>

        <Panel className="mt-8 p-7 sm:p-10">
          <DisplayHeading size="md">A day that works</DisplayHeading>
          <div className="mt-7 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {ITINERARY.map((item) => (
              <div key={item.time} className="border-l-2 border-brand-line pl-5">
                <div className="font-display text-[15px] font-extrabold text-brand-teal">
                  {item.time}
                </div>
                <h3 className="mt-2 font-bold text-brand-ink">{item.title}</h3>
                <p className="mt-1.5 text-[14.5px] leading-[1.6] text-brand-muted">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </Panel>

        <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {THINGS_TO_DO.map((item) => (
            <Panel key={item.title} className="overflow-hidden">
              <article>
                <div className="h-[190px]">
                  <Shot src={item.img} alt={item.title} />
                </div>
                <div className="p-6">
                  <Eyebrow>{item.tag}</Eyebrow>
                  <h2 className="mt-2 font-display text-[19px] font-bold text-brand-ink">
                    {item.title}
                  </h2>
                  <p className="mt-2 text-[14.5px] leading-[1.6] text-brand-muted">
                    {item.body}
                  </p>
                </div>
              </article>
            </Panel>
          ))}
        </div>
      </Shell>

      <ClosingCta
        gradient
        title="Start with the water. Build the rest of the day around it."
        body="We’ll suggest the calmest launch window before you plan breakfast, beaches and the coastal drive."
      >
        <BrandButton to={ROUTES.weather} tone="amber" size="lg">
          Check conditions
        </BrandButton>
        <BrandButton href={CONTACT.whatsapp} tone="ghost-dark" size="lg">
          Ask for a local plan
        </BrandButton>
      </ClosingCta>
    </div>
  )
}
