import { createFileRoute } from '@tanstack/react-router'

import { ConditionsBoard } from '@/components/brand/ConditionsBoard'
import {
  BrandButton,
  DisplayHeading,
  Eyebrow,
  Panel,
  Section,
  Shell,
  TickRow,
} from '@/components/brand/primitives'
import { CONTACT, ROUTES, WEATHER_GUIDES } from '@/lib/brand-content'

export const Route = createFileRoute('/weather/')({
  head: () => ({
    meta: [
      { title: "Jet Ski Conditions & Availability | Gordon's Bay" },
      {
        name: 'description',
        content:
          "Live Gordon's Bay Harbour weather, seven-day wind and swell outlook, and jet ski launch availability.",
      },
    ],
  }),
  component: ConditionsPage,
})

function ConditionsPage() {
  return (
    <div>
      <Shell className="pt-12 sm:pt-16">
        <Eyebrow>CONDITIONS &amp; AVAILABILITY</Eyebrow>
        <DisplayHeading as="h1" className="mt-3 max-w-[900px]" size="xl">
          We&apos;re weather-bound. So we make the weather obvious.
        </DisplayHeading>
        <p className="mt-4 max-w-[720px] text-[17px] leading-[1.65] text-brand-muted">
          Wind, swell and visibility decide whether a session is comfortable and
          safe. Use the live board to shortlist a day; our skipper still makes the
          final call at the harbour.
        </p>
      </Shell>

      <Section>
        <ConditionsBoard />
      </Section>

      <Section>
        <div className="grid gap-5 lg:grid-cols-2">
          {WEATHER_GUIDES.map((guide) => (
            <Panel key={guide.title} className="p-7 sm:p-8">
              <h2 className="font-display text-[21px] font-bold text-brand-ink">
                {guide.title}
              </h2>
              <p className="mt-1 text-[14px] font-semibold text-brand-faint">
                {guide.sub}
              </p>
              <div className="mt-5 space-y-2">
                {guide.points.map((point) => (
                  <TickRow key={point}>{point}</TickRow>
                ))}
              </div>
            </Panel>
          ))}
        </div>
      </Section>

      <Section>
        <div className="flex flex-wrap items-center justify-between gap-8 rounded-[20px] bg-brand-deep p-8 sm:p-11">
          <div className="max-w-[680px]">
            <h2 className="font-display text-[28px] font-extrabold leading-[1.15] tracking-[-0.02em] text-white sm:text-[30px]">
              If we call it off, you don&apos;t lose your money.
            </h2>
            <p className="mt-3 text-[16px] leading-[1.65] text-brand-on-dark">
              Sessions we cancel for unsafe weather move to the next suitable slot.
              If travel makes that impossible, contact us and we&apos;ll resolve the
              booking under the confirmed booking terms.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <BrandButton href={CONTACT.whatsapp} tone="amber" size="lg">
              Reschedule help
            </BrandButton>
            <BrandButton to={ROUTES.rides} tone="ghost-dark" size="lg">
              See pricing
            </BrandButton>
          </div>
        </div>
      </Section>
    </div>
  )
}
