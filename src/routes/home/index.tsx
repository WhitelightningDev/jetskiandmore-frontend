import { createFileRoute } from '@tanstack/react-router'
import { ArrowRight, BadgeCheck, Check, ShieldCheck } from 'lucide-react'

import { ConditionsBoard } from '@/components/brand/ConditionsBoard'
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
import { pickPrimaryBookingAction, useBookingControls } from '@/lib/bookingControls'
import {
  CONTACT,
  FAQS,
  HERO_PROOF,
  MAINTENANCE,
  RIDE_CARDS,
  ROUTES,
  STEPS,
  boatImg,
  harbourImg,
  rideImg,
} from '@/lib/brand-content'

export const Route = createFileRoute('/home/')({
  head: () => ({
    meta: [
      {
        title:
          "Guided Jet Ski Rides in Gordon's Bay | Jet Ski & More",
      },
      {
        name: 'description',
        content:
          "Guided jet ski rides, skippered boat trips and fishing charters from Gordon's Bay Harbour. View live conditions and availability.",
      },
    ],
  }),
  component: HomePage,
})

function HomePage() {
  const { controls } = useBookingControls()
  const primary = pickPrimaryBookingAction(controls)

  return (
    <div>
      <section className="relative isolate min-h-[650px] overflow-hidden bg-brand-deep">
        <img
          src={harbourImg}
          alt="Aerial view of Gordon's Bay Harbour and False Bay"
          className="absolute inset-0 -z-20 h-full w-full object-cover"
          loading="eager"
          decoding="async"
          fetchPriority="high"
        />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(6,32,47,0.94)_0%,rgba(6,32,47,0.78)_48%,rgba(6,32,47,0.28)_100%)]" />
        <Shell className="flex min-h-[650px] items-center py-16 sm:py-20">
          <div className="max-w-[790px]">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-2 text-[11.5px] font-bold tracking-[0.13em] text-white backdrop-blur">
              <BadgeCheck className="h-4 w-4 text-brand-amber" aria-hidden />
              SAMSA CERTIFIED · RECERTIFIED EVERY YEAR
            </div>
            <h1 className="mt-6 max-w-[780px] text-balance font-display text-[40px] font-extrabold leading-[1.03] tracking-[-0.035em] text-white drop-shadow-2xl sm:text-[56px] lg:text-[66px]">
              Five years of safe launches from Gordon&apos;s Bay Harbour.
            </h1>
            <p className="mt-5 max-w-[690px] text-pretty text-[17px] leading-[1.65] text-[#D7E7EE] sm:text-[19px]">
              Guided jet ski rides, skippered boat trips and fishing charters.
              Certified skippers, a maintained fleet, and a straight answer about
              conditions before you leave home.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <BrandButton to={ROUTES.rides} tone="amber" size="lg">
                See rides &amp; pricing
                <ArrowRight className="h-4 w-4" aria-hidden />
              </BrandButton>
              <BrandButton to={ROUTES.weather} tone="ghost-dark" size="lg">
                Check the next 7 days
              </BrandButton>
            </div>
            <div className="mt-10 grid max-w-[780px] grid-cols-2 gap-x-5 gap-y-6 border-t border-white/20 pt-7 sm:grid-cols-4">
              {HERO_PROOF.map((proof) => (
                <div key={proof.label}>
                  <div className="font-display text-[23px] font-extrabold tracking-[-0.01em] text-white sm:text-[26px]">
                    {proof.value}
                  </div>
                  <div className="mt-1 text-[10.5px] font-semibold tracking-[0.08em] text-[#AFC7D3]">
                    {proof.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Shell>
      </section>

      <Section className="relative z-10 -mt-8">
        <Panel className="mb-5 px-6 py-5 shadow-[0_18px_50px_-36px_rgba(6,32,47,0.55)] sm:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <Eyebrow>CONDITIONS &amp; LIVE AVAILABILITY</Eyebrow>
              <DisplayHeading className="mt-2" size="md">
                Book a day the bay agrees with.
              </DisplayHeading>
            </div>
            <p className="max-w-[470px] text-[14.5px] leading-relaxed text-brand-muted">
              Live harbour weather, a seven-day outlook, and launch times from
              the same booking system used at checkout.
            </p>
          </div>
        </Panel>
        <ConditionsBoard compact />
      </Section>

      <Section>
        <div className="grid gap-9 lg:grid-cols-[0.88fr_1.12fr] lg:items-start">
          <div>
            <Eyebrow>BEFORE THE THROTTLE</Eyebrow>
            <DisplayHeading className="mt-3" size="lg">
              Three steps, done properly, every single launch.
            </DisplayHeading>
            <p className="mt-4 max-w-[520px] text-[16.5px] leading-[1.65] text-brand-muted">
              No rushed paperwork and no learning the controls in open water.
              Every rider follows the same short, repeatable safety flow.
            </p>
            <BrandButton to={ROUTES.safety} tone="outline" className="mt-6">
              See our full safety standard
            </BrandButton>
          </div>
          <div className="grid gap-3">
            {STEPS.map((step) => (
              <Panel
                key={step.n}
                className="flex gap-4 p-5 transition-transform hover:-translate-y-0.5 sm:p-6"
              >
                <div className="flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-brand-tint font-display text-[16px] font-extrabold text-brand-teal">
                  {step.n}
                </div>
                <div>
                  <h3 className="font-display text-[18px] font-bold text-brand-ink">
                    {step.title}
                  </h3>
                  <p className="mt-1.5 text-[14.5px] leading-[1.6] text-brand-muted">
                    {step.body}
                  </p>
                </div>
              </Panel>
            ))}
          </div>
        </div>
      </Section>

      <Section>
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <Eyebrow>WHAT YOU CAN BOOK</Eyebrow>
            <DisplayHeading className="mt-3" size="lg">
              Rides &amp; pricing, no guessing.
            </DisplayHeading>
          </div>
          <BrandButton to={ROUTES.rides} tone="outline">
            Full lineup
          </BrandButton>
        </div>

        <div className="mt-7 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {RIDE_CARDS.map((ride) => (
            <Panel key={ride.title} className="flex overflow-hidden">
              <article className="flex w-full flex-col">
                <div className="h-[210px] overflow-hidden">
                  <Shot src={ride.img} alt={ride.title} />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <Eyebrow>{ride.tag}</Eyebrow>
                  <h3 className="mt-2 font-display text-[20px] font-bold text-brand-ink">
                    {ride.title}
                  </h3>
                  <p className="mt-2 flex-1 text-[14.5px] leading-[1.6] text-brand-muted">
                    {ride.body}
                  </p>
                  <div className="mt-5 flex items-end justify-between gap-3 border-t border-brand-line-soft pt-4">
                    <div>
                      <div className="text-[12px] font-semibold text-brand-faint">
                        {ride.duration}
                      </div>
                      <div className="font-display text-[19px] font-extrabold text-brand-ink">
                        {ride.price}
                      </div>
                    </div>
                    <BrandButton to={ride.to} size="sm">
                      {ride.cta}
                    </BrandButton>
                  </div>
                </div>
              </article>
            </Panel>
          ))}
        </div>
      </Section>

      <Section>
        <div className="grid overflow-hidden rounded-3xl bg-brand-deep lg:grid-cols-2 lg:items-center">
          <div className="p-8 sm:p-12 lg:p-14">
            <Eyebrow tone="amber">THE FLEET</Eyebrow>
            <DisplayHeading className="mt-3 text-white" size="lg">
              Older skis. Obsessively maintained.
            </DisplayHeading>
            <p className="mt-4 text-[16px] leading-[1.65] text-brand-on-dark">
              We would rather run a machine we know inside out than a new one we
              don&apos;t. Every ski is stripped, serviced and water-tested before the
              season, and checked again before it leaves the slipway.
            </p>
            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              {MAINTENANCE.map((item) => (
                <div
                  key={item.title}
                  className="rounded-[14px] border border-white/15 bg-white/5 p-4"
                >
                  <div className="flex items-center gap-2 text-[14px] font-bold text-white">
                    <Check className="h-4 w-4 text-brand-amber" aria-hidden />
                    {item.title}
                  </div>
                  <p className="mt-1.5 text-[13px] leading-[1.5] text-brand-on-dark-muted">
                    {item.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="h-[320px] lg:h-[520px]">
            <Shot src={rideImg} alt="Jet ski being prepared for a launch" />
          </div>
        </div>
      </Section>

      <Section>
        <Panel className="grid overflow-hidden lg:grid-cols-[1.05fr_1fr]">
          <div className="p-8 sm:p-12">
            <div className="flex items-center gap-3">
              <Eyebrow>IN PARTNERSHIP WITH</Eyebrow>
              <span className="h-px flex-1 bg-brand-line" />
            </div>
            <div className="mt-6 flex items-center gap-4">
              <span className="flex h-14 w-14 items-center justify-center rounded-[14px] bg-fba font-display text-[14px] font-extrabold text-white">
                FBA
              </span>
              <div>
                <h2 className="font-display text-[24px] font-extrabold text-brand-ink">
                  False Bay Adventures
                </h2>
                <p className="text-[13.5px] font-semibold text-brand-faint">
                  Skippered boat rides &amp; fishing charters
                </p>
              </div>
            </div>
            <p className="mt-6 text-[16px] leading-[1.65] text-brand-muted">
              When the wind is up, or the group is bigger than the skis, our
              partner boat runs from the same harbour. Spectators, families and
              corporate groups ride on a licensed vessel with its own skipper.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <BrandButton to={ROUTES.boats}>Boat rides &amp; charters</BrandButton>
              <BrandButton to={ROUTES.contact} tone="outline">
                Ask about a group
              </BrandButton>
            </div>
          </div>
          <div className="min-h-[330px]">
            <Shot src={boatImg} alt="False Bay Adventures spectator boat" />
          </div>
        </Panel>
      </Section>

      <Section>
        <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <Eyebrow>ASKED EVERY DAY</Eyebrow>
            <DisplayHeading className="mt-3" size="lg">
              Can I book? How much? What else is there to do?
            </DisplayHeading>
            <p className="mt-4 text-[16px] leading-[1.65] text-brand-muted">
              The questions we answer most on WhatsApp, answered before you
              message.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <BrandButton to={ROUTES.faq} tone="outline">
                All FAQs
              </BrandButton>
              <BrandButton to={ROUTES.plan} tone="outline">
                Plan your day
              </BrandButton>
            </div>
          </div>
          <div className="grid gap-3">
            {FAQS.slice(0, 4).map((faq) => (
              <Panel key={faq.q} className="p-5 sm:p-6">
                <h3 className="font-display text-[16.5px] font-bold text-brand-ink">
                  {faq.q}
                </h3>
                <p className="mt-2 text-[14.5px] leading-[1.6] text-brand-muted">
                  {faq.a}
                </p>
              </Panel>
            ))}
          </div>
        </div>
      </Section>

      <ClosingCta
        gradient
        title="Tell us the date. We'll tell you honestly whether the bay will play along."
        body="Reply within the hour, most days. WhatsApp is quickest."
      >
        <BrandButton href={CONTACT.whatsapp} tone="amber" size="lg">
          WhatsApp us
        </BrandButton>
        <BrandButton to={ROUTES.rides} tone="ghost-dark" size="lg">
          See pricing
        </BrandButton>
      </ClosingCta>

      {!primary.enabled ? (
        <Shell className="pt-6">
          <div className="flex items-center gap-3 rounded-2xl border border-brand-line bg-white p-5 text-[14px] text-brand-muted">
            <ShieldCheck className="h-5 w-5 flex-none text-brand-teal" aria-hidden />
            Online bookings are currently closed. Contact us and we&apos;ll confirm the
            next available water experience.
          </div>
        </Shell>
      ) : null}
    </div>
  )
}
