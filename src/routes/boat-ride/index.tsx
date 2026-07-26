import * as React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { CheckCircle2, Ship } from 'lucide-react'

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
  BOAT_OFFERINGS,
  CONTACT,
  PARTNER_HOW,
  ROUTES,
  boatImg,
} from '@/lib/brand-content'
import { sendBoatRideRequest } from '@/lib/api'

export const Route = createFileRoute('/boat-ride/')({
  head: () => ({
    meta: [
      { title: "Boat Rides & Fishing Charters | Gordon's Bay" },
      {
        name: 'description',
        content:
          "Skippered False Bay boat rides, spectator boats and fishing charters from Gordon's Bay Harbour.",
      },
    ],
  }),
  component: BoatPage,
})

const fieldClass =
  'mt-2 w-full rounded-xl border border-brand-line-strong bg-brand-surface px-4 py-3 text-[15px] text-brand-ink outline-none transition focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/15'

function BoatPage() {
  const { controls } = useBookingControls()
  const [form, setForm] = React.useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    people: 2,
    date: '',
  })
  const [submitting, setSubmitting] = React.useState(false)
  const [success, setSuccess] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setSuccess(false)
    if (!controls.boatRideBookingsEnabled) {
      setError('Boat ride requests are currently closed.')
      return
    }

    try {
      setSubmitting(true)
      await sendBoatRideRequest({
        ...form,
        people: Math.min(12, Math.max(1, Number(form.people) || 1)),
      })
      setSuccess(true)
      setForm({
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        people: 2,
        date: '',
      })
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : 'We could not send this request. Please use WhatsApp instead.',
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <Shell className="pt-12 sm:pt-16">
        <div className="flex items-center gap-4">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-fba font-display text-[13px] font-extrabold text-white">
            FBA
          </span>
          <div>
            <Eyebrow>IN PARTNERSHIP WITH FALSE BAY ADVENTURES</Eyebrow>
            <p className="mt-1 font-display text-[16px] font-bold text-brand-ink">
              Skippered boat rides &amp; fishing charters
            </p>
          </div>
        </div>
        <DisplayHeading as="h1" className="mt-6 max-w-[930px]" size="xl">
          When the group is bigger — or the bay is busier — we take the boat.
        </DisplayHeading>
        <p className="mt-4 max-w-[720px] text-[17px] leading-[1.65] text-brand-muted">
          A licensed vessel with its own skipper, launching from the same harbour.
          Ideal for spectators, families, whale season and anyone who would rather
          watch than ride.
        </p>

        <div className="relative mt-8 h-[380px] overflow-hidden rounded-[22px]">
          <Shot src={boatImg} alt="False Bay Adventures boat with passengers" />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-deep/50 to-transparent" />
          <div className="absolute bottom-6 left-6 rounded-xl bg-white/90 px-4 py-3 backdrop-blur">
            <div className="flex items-center gap-2 font-bold text-brand-ink">
              <Ship className="h-4 w-4 text-brand-teal" aria-hidden />
              Gordon&apos;s Bay Harbour departures
            </div>
          </div>
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-3">
          {BOAT_OFFERINGS.map((offering, index) => (
            <Panel key={offering.title} className="flex flex-col p-7">
              <Eyebrow>{offering.tag}</Eyebrow>
              <h2 className="mt-2.5 font-display text-[21px] font-bold text-brand-ink">
                {offering.title}
              </h2>
              <p className="mt-2.5 flex-1 text-[15px] leading-[1.6] text-brand-muted">
                {offering.body}
              </p>
              <div className="mt-5 font-display text-[22px] font-extrabold text-brand-ink">
                {offering.price}
              </div>
              <div className="mt-1 text-[13px] font-semibold text-brand-faint">
                {offering.duration}
              </div>
              <BrandButton
                to={index === 2 ? '/fishing-charters' : undefined}
                href={index === 2 ? undefined : '#boat-request'}
                className="mt-5"
              >
                {offering.cta}
              </BrandButton>
            </Panel>
          ))}
        </div>
      </Shell>

      <Section>
        <Panel className="p-8 sm:p-10">
          <DisplayHeading size="md">How the partnership works</DisplayHeading>
          <div className="mt-6 grid gap-5 lg:grid-cols-3">
            {PARTNER_HOW.map((item) => (
              <div key={item.title} className="border-t-2 border-brand-teal pt-4">
                <h3 className="font-bold text-brand-ink">{item.title}</h3>
                <p className="mt-2 text-[14.5px] leading-[1.6] text-brand-muted">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </Panel>
      </Section>

      <Section>
        <Panel id="boat-request" className="grid overflow-hidden lg:grid-cols-[0.85fr_1.15fr]">
          <div className="bg-brand-deep p-8 text-white sm:p-10">
            <Eyebrow tone="amber">REQUEST A BOAT</Eyebrow>
            <h2 className="mt-3 font-display text-[30px] font-extrabold leading-[1.12] tracking-[-0.02em]">
              Tell us the date and group size.
            </h2>
            <p className="mt-4 text-[15.5px] leading-[1.65] text-brand-on-dark">
              No payment is taken here. The team confirms the vessel, skipper,
              weather window and final price before you commit.
            </p>
            <BrandButton href={CONTACT.whatsapp} tone="ghost-dark" className="mt-6">
              Prefer WhatsApp?
            </BrandButton>
          </div>

          <form onSubmit={submit} className="p-8 sm:p-10">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-[13px] font-bold text-brand-body">
                First name
                <input
                  required
                  value={form.firstName}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      firstName: event.target.value,
                    }))
                  }
                  className={fieldClass}
                />
              </label>
              <label className="text-[13px] font-bold text-brand-body">
                Last name
                <input
                  required
                  value={form.lastName}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      lastName: event.target.value,
                    }))
                  }
                  className={fieldClass}
                />
              </label>
              <label className="text-[13px] font-bold text-brand-body">
                Mobile / WhatsApp
                <input
                  required
                  value={form.phone}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, phone: event.target.value }))
                  }
                  className={fieldClass}
                  inputMode="tel"
                />
              </label>
              <label className="text-[13px] font-bold text-brand-body">
                Email
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, email: event.target.value }))
                  }
                  className={fieldClass}
                />
              </label>
              <label className="text-[13px] font-bold text-brand-body">
                Preferred date
                <input
                  required
                  type="date"
                  value={form.date}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, date: event.target.value }))
                  }
                  className={fieldClass}
                />
              </label>
              <label className="text-[13px] font-bold text-brand-body">
                Number of people
                <input
                  required
                  min={1}
                  max={12}
                  type="number"
                  value={form.people}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      people: Number(event.target.value),
                    }))
                  }
                  className={fieldClass}
                />
              </label>
            </div>

            {success ? (
              <div className="mt-5 flex gap-2 rounded-xl bg-prime-bg p-4 text-[14px] font-semibold text-prime-fg">
                <CheckCircle2 className="h-5 w-5 flex-none" aria-hidden />
                Request sent. We&apos;ll confirm availability directly.
              </div>
            ) : null}
            {error ? (
              <div className="mt-5 rounded-xl bg-rough-bg p-4 text-[14px] font-semibold text-rough-fg">
                {error}
              </div>
            ) : null}

            <BrandButton
              type="submit"
              className="mt-6 w-full"
              disabled={submitting || !controls.boatRideBookingsEnabled}
            >
              {submitting
                ? 'Sending request…'
                : controls.boatRideBookingsEnabled
                  ? 'Send boat request'
                  : 'Boat requests closed'}
            </BrandButton>
          </form>
        </Panel>
      </Section>

      <ClosingCta
        title="Need both skis and a spectator boat?"
        body="We coordinate the two operators so the group shares one meeting point and one clear plan."
      >
        <BrandButton to={ROUTES.contact} tone="amber" size="lg">
          Plan a group day
        </BrandButton>
      </ClosingCta>
    </div>
  )
}
