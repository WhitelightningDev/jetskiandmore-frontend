import * as React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { CheckCircle2, Mail, MapPin, MessageCircle, Phone } from 'lucide-react'

import {
  BrandButton,
  DisplayHeading,
  Eyebrow,
  Panel,
  Shell,
} from '@/components/brand/primitives'
import { CONTACT } from '@/lib/brand-content'
import { postJSON } from '@/lib/api'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/contact/')({
  head: () => ({
    meta: [
      { title: "Contact Jet Ski & More | Gordon's Bay" },
      {
        name: 'description',
        content:
          "Request a jet ski, boat ride, fishing charter or group slot from Gordon's Bay Harbour.",
      },
    ],
  }),
  component: ContactPage,
})

const INTERESTS = [
  'Jet ski',
  'Boat ride',
  'Fishing charter',
  'Group day',
  'Not sure yet',
]

const fieldClass =
  'mt-2 w-full rounded-xl border border-brand-line-strong bg-brand-surface px-4 py-3 text-[15px] text-brand-ink outline-none transition placeholder:text-brand-faint focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/15'

function ContactPage() {
  const [form, setForm] = React.useState({
    fullName: '',
    phone: '',
    email: '',
    date: '',
    people: '',
    interest: 'Jet ski',
    notes: '',
  })
  const [submitting, setSubmitting] = React.useState(false)
  const [success, setSuccess] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSuccess(false)
    setError(null)

    try {
      setSubmitting(true)
      await postJSON<{ ok: boolean; id: string }>('/api/contact', {
        fullName: form.fullName,
        phone: form.phone,
        email: form.email,
        message: [
          `Interest: ${form.interest}`,
          `Preferred date: ${form.date || 'Flexible'}`,
          `People: ${form.people || 'Not specified'}`,
          '',
          form.notes || 'No additional notes.',
        ].join('\n'),
        subject: `${form.interest} website enquiry`,
      })
      setSuccess(true)
      setForm({
        fullName: '',
        phone: '',
        email: '',
        date: '',
        people: '',
        interest: 'Jet ski',
        notes: '',
      })
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : 'We could not send your request. Please use WhatsApp instead.',
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Shell className="pt-12 sm:pt-16">
      <div className="grid gap-7 lg:grid-cols-2 lg:items-start">
        <div>
          <Eyebrow>CONTACT</Eyebrow>
          <DisplayHeading as="h1" className="mt-3" size="xl">
            Tell us your date. We&apos;ll tell you the truth about it.
          </DisplayHeading>
          <p className="mt-4 max-w-[560px] text-[16.5px] leading-[1.65] text-brand-muted">
            Give us your preferred day and group size. We&apos;ll come back with
            availability, a price and an honest read on the conditions.
          </p>

          <div className="mt-7 space-y-3">
            <ContactMethod
              href={CONTACT.whatsapp}
              icon={MessageCircle}
              title="WhatsApp"
              detail="Fastest — usually within the hour"
              value={CONTACT.whatsappLabel}
            />
            <ContactMethod
              href={CONTACT.phoneHref}
              icon={Phone}
              title="Call us"
              detail="08:00–18:00, seven days in season"
              value={CONTACT.phone}
            />
            <ContactMethod
              href={CONTACT.emailHref}
              icon={Mail}
              title="Email"
              detail="Best for group and corporate quotes"
              value={CONTACT.email}
            />
          </div>

          <div className="mt-3 rounded-[18px] bg-brand-deep p-7 text-white">
            <div className="flex items-center gap-2 text-[11.5px] font-bold tracking-[0.16em] text-brand-amber">
              <MapPin className="h-4 w-4" aria-hidden />
              WHERE TO MEET US
            </div>
            <h2 className="mt-2.5 font-display text-[20px] font-bold">
              Gordon&apos;s Bay Harbour slipway
            </h2>
            <p className="mt-2 text-[15px] leading-[1.6] text-brand-on-dark">
              One launch point, every session. Park at the harbour and look for the
              trailer — arrive 15 minutes before your slot.
            </p>
          </div>
        </div>

        <Panel className="p-7 sm:p-9">
          <DisplayHeading size="md">Request a slot</DisplayHeading>
          <p className="mt-2 text-[15px] text-brand-muted">
            No payment taken here — we confirm availability first.
          </p>

          <form onSubmit={submit} className="mt-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-[13px] font-bold text-brand-body">
                Your name
                <input
                  required
                  value={form.fullName}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      fullName: event.target.value,
                    }))
                  }
                  placeholder="Full name"
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
                  placeholder="+27 …"
                  inputMode="tel"
                  className={fieldClass}
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
                  placeholder="you@example.com"
                  className={fieldClass}
                />
              </label>
              <label className="text-[13px] font-bold text-brand-body">
                Preferred date
                <input
                  type="date"
                  value={form.date}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, date: event.target.value }))
                  }
                  className={fieldClass}
                />
              </label>
              <label className="text-[13px] font-bold text-brand-body sm:col-span-2">
                People joining
                <input
                  min={1}
                  type="number"
                  value={form.people}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, people: event.target.value }))
                  }
                  placeholder="e.g. 4"
                  className={fieldClass}
                />
              </label>
            </div>

            <fieldset className="mt-5">
              <legend className="text-[13px] font-bold text-brand-body">
                What are you after?
              </legend>
              <div className="mt-2.5 flex flex-wrap gap-2">
                {INTERESTS.map((interest) => (
                  <button
                    key={interest}
                    type="button"
                    onClick={() =>
                      setForm((current) => ({ ...current, interest }))
                    }
                    className={cn(
                      'rounded-full border px-4 py-2 text-[13.5px] font-semibold transition-colors',
                      form.interest === interest
                        ? 'border-brand-teal bg-brand-tint text-brand-teal-dark'
                        : 'border-brand-line-strong bg-brand-surface text-brand-body hover:border-brand-teal',
                    )}
                  >
                    {interest}
                  </button>
                ))}
              </div>
            </fieldset>

            <label className="mt-5 block text-[13px] font-bold text-brand-body">
              Anything else
              <textarea
                rows={4}
                value={form.notes}
                onChange={(event) =>
                  setForm((current) => ({ ...current, notes: event.target.value }))
                }
                placeholder="Group type, experience level, whether you want the boat alongside…"
                className={fieldClass}
              />
            </label>

            {success ? (
              <div className="mt-5 flex items-start gap-2 rounded-xl bg-prime-bg p-4 text-[14px] font-semibold text-prime-fg">
                <CheckCircle2 className="h-5 w-5 flex-none" aria-hidden />
                Request sent. We&apos;ll reply with availability and next steps.
              </div>
            ) : null}
            {error ? (
              <div className="mt-5 rounded-xl bg-rough-bg p-4 text-[14px] font-semibold text-rough-fg">
                {error}
              </div>
            ) : null}

            <BrandButton
              type="submit"
              className="mt-5 w-full"
              size="lg"
              disabled={submitting}
            >
              {submitting ? 'Sending…' : 'Send request'}
            </BrandButton>
            <p className="mt-3 text-center text-[13px] text-brand-faint">
              We&apos;ll reply with availability, a price and a conditions read.
            </p>
          </form>
        </Panel>
      </div>
    </Shell>
  )
}

function ContactMethod({
  href,
  icon: Icon,
  title,
  detail,
  value,
}: {
  href: string
  icon: React.ComponentType<{ className?: string; 'aria-hidden'?: boolean }>
  title: string
  detail: string
  value: string
}) {
  return (
    <a
      href={href}
      target={href.startsWith('http') ? '_blank' : undefined}
      rel="noreferrer"
      className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-brand-line bg-white px-5 py-5 no-underline transition-colors hover:border-brand-teal"
    >
      <span className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-tint text-brand-teal">
          <Icon className="h-5 w-5" aria-hidden />
        </span>
        <span>
          <span className="block font-display text-[17px] font-bold text-brand-ink">
            {title}
          </span>
          <span className="mt-0.5 block text-[13.5px] text-brand-muted">{detail}</span>
        </span>
      </span>
      <span className="break-all text-[14px] font-bold text-brand-teal">{value}</span>
    </a>
  )
}
