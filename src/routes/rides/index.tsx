import { createFileRoute } from '@tanstack/react-router'
import { Check, Info } from 'lucide-react'

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
import {
  ADDONS,
  BEFORE_YOU_PAY,
  CONTACT,
  PRICE_CARDS,
  PRICE_GROUPS,
  ROUTES,
} from '@/lib/brand-content'

export const Route = createFileRoute('/rides/')({
  head: () => ({
    meta: [
      { title: "Jet Ski Rides & Pricing | Gordon's Bay" },
      {
        name: 'description',
        content:
          "Jet ski, boat ride, fishing charter and group pricing from Gordon's Bay Harbour. Safety briefing and life jackets included.",
      },
    ],
  }),
  component: RidesPage,
})

function RidesPage() {
  const { controls } = useBookingControls()

  return (
    <div>
      <Shell className="pt-12 sm:pt-16">
        <Eyebrow>RIDES &amp; PRICING</Eyebrow>
        <DisplayHeading as="h1" className="mt-3 max-w-[820px]" size="xl">
          Everything we run, and what it costs.
        </DisplayHeading>
        <p className="mt-4 max-w-[680px] text-[17px] leading-[1.65] text-brand-muted">
          Prices are per booking unless stated. Life jackets, the safety briefing,
          fuel and skipper guidance are included in every session.
        </p>

        <div className="mt-9 grid gap-5 lg:grid-cols-3">
          {PRICE_GROUPS.map((group) => (
            <Panel key={group.duration} className="flex flex-col p-7">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="font-display text-[24px] font-extrabold tracking-[-0.02em] text-brand-ink">
                    {group.duration}
                  </h2>
                  <p className="mt-1 text-[13px] font-semibold text-brand-faint">
                    {group.sub}
                  </p>
                </div>
                {group.popular ? (
                  <span className="rounded-full bg-accent px-3 py-1.5 text-[11px] font-bold text-accent-foreground">
                    POPULAR
                  </span>
                ) : null}
              </div>
              <div className="mt-5 flex-1">
                {group.rows.map((row) => (
                  <div
                    key={row.label}
                    className="flex items-center justify-between gap-4 border-t border-brand-line-soft py-3"
                  >
                    <span className="text-[14.5px] text-brand-body">{row.label}</span>
                    <span className="whitespace-nowrap font-display text-[17px] font-extrabold text-brand-ink">
                      {row.price}
                    </span>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-[12.5px] leading-[1.55] text-brand-faint">
                Pricing shown is the redesigned rate card. We confirm the exact
                craft and rider configuration before payment.
              </p>
              <BrandButton
                to={
                  controls.jetSkiBookingsEnabled && group.duration !== '15 minutes'
                    ? ROUTES.book
                    : ROUTES.contact
                }
                className="mt-5 w-full"
              >
                {controls.jetSkiBookingsEnabled && group.duration !== '15 minutes'
                  ? 'Check live slots'
                  : 'Enquire & hold a slot'}
              </BrandButton>
            </Panel>
          ))}
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-3">
          {PRICE_CARDS.map((card) => (
            <Panel key={card.title} className="flex flex-col p-7">
              <h2 className="font-display text-[20px] font-bold text-brand-ink">
                {card.title}
              </h2>
              <p className="mt-1.5 text-[13px] font-semibold text-brand-faint">
                {card.duration}
              </p>
              <div className="mt-4 font-display text-[30px] font-extrabold tracking-[-0.02em] text-brand-ink">
                {card.price}
              </div>
              <p className="mt-3 flex-1 text-[14.5px] leading-[1.6] text-brand-muted">
                {card.body}
              </p>
              <div className="mt-5 space-y-2 border-t border-brand-line-soft pt-4">
                {card.includes.map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-2 text-[14px] text-brand-body"
                  >
                    <Check className="mt-0.5 h-4 w-4 flex-none text-brand-teal" aria-hidden />
                    {item}
                  </div>
                ))}
              </div>
              <BrandButton to={ROUTES.contact} className="mt-6 w-full">
                Enquire &amp; hold a slot
              </BrandButton>
            </Panel>
          ))}
        </div>
      </Shell>

      <Section>
        <Panel className="p-7 sm:p-9">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <DisplayHeading size="md">Add-ons &amp; extras</DisplayHeading>
              <p className="mt-2 text-[15px] text-brand-muted">
                Add to any suitable session, subject to conditions and availability.
              </p>
            </div>
            <span className="text-[13px] font-semibold text-brand-faint">
              From ZAR 150
            </span>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {ADDONS.map((addon) => (
              <div
                key={addon.title}
                className="overflow-hidden rounded-[15px] border border-brand-line-cool bg-brand-surface"
              >
                <div className="h-[145px]">
                  <Shot src={addon.img} alt={addon.title} />
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-brand-ink">{addon.title}</h3>
                  <p className="mt-1.5 text-[13.5px] leading-[1.55] text-brand-muted">
                    {addon.body}
                  </p>
                  <div className="mt-3 font-display text-[16px] font-extrabold text-brand-teal">
                    {addon.price}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </Section>

      <Section>
        <div className="grid gap-5 lg:grid-cols-2">
          <div className="rounded-[20px] bg-brand-deep p-8 text-white sm:p-10">
            <Eyebrow tone="amber">GROUPS &amp; CORPORATE</Eyebrow>
            <h2 className="mt-3 font-display text-[28px] font-extrabold leading-[1.15] tracking-[-0.02em]">
              Team days, 5 to 25 people.
            </h2>
            <p className="mt-3 text-[15.5px] leading-[1.65] text-brand-on-dark">
              Rotating ski sessions with the partner boat alongside for everyone
              waiting their turn. One invoice, one meeting point, one briefing.
            </p>
            <BrandButton to={ROUTES.contact} tone="amber" className="mt-6">
              Request a group quote
            </BrandButton>
          </div>
          <Panel className="p-8 sm:p-10">
            <Eyebrow>GOOD TO KNOW</Eyebrow>
            <DisplayHeading className="mt-3" size="md">
              Before you pay
            </DisplayHeading>
            <div className="mt-5 space-y-3">
              {BEFORE_YOU_PAY.map((item) => (
                <div
                  key={item}
                  className="flex gap-3 border-t border-brand-line-soft pt-3 text-[14.5px] leading-[1.55] text-brand-body"
                >
                  <Info className="mt-0.5 h-4 w-4 flex-none text-brand-teal" aria-hidden />
                  {item}
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </Section>

      <ClosingCta
        title="Not sure which setup fits your group?"
        body="Send the date, number of people and experience level. We'll recommend the simplest option."
      >
        <BrandButton href={CONTACT.whatsapp} tone="amber" size="lg">
          Ask on WhatsApp
        </BrandButton>
      </ClosingCta>
    </div>
  )
}
