import { createFileRoute } from '@tanstack/react-router'
import { Check, Clock3, FileSignature, PlayCircle, ShieldCheck, X } from 'lucide-react'

import {
  BrandButton,
  ClosingCta,
  DisplayHeading,
  Eyebrow,
  Panel,
  Section,
  Shell,
  Shot,
  TickRow,
} from '@/components/brand/primitives'
import {
  CONTACT,
  DONTS,
  DOS,
  REQUIREMENTS,
  ROUTES,
  rideImg,
} from '@/lib/brand-content'

export const Route = createFileRoute('/safety/')({
  head: () => ({
    meta: [
      { title: "Jet Ski Safety Standard | Gordon's Bay" },
      {
        name: 'description',
        content:
          'See the video, digital indemnity, harbour briefing and on-water rules used for every Jet Ski & More launch.',
      },
    ],
  }),
  component: SafetyPage,
})

function SafetyPage() {
  return (
    <div>
      <Shell className="pt-12 sm:pt-16">
        <Eyebrow>SAFETY STANDARD</Eyebrow>
        <DisplayHeading as="h1" className="mt-3 max-w-[900px]" size="xl">
          Watch. Sign. Get briefed. Then ride.
        </DisplayHeading>
        <p className="mt-4 max-w-[720px] text-[17px] leading-[1.65] text-brand-muted">
          SAMSA registered and recertified every year, with certified skippers on
          every launch. Here is exactly what happens between booking and riding.
        </p>

        <div className="mt-8 grid gap-5 lg:grid-cols-[1.1fr_1fr] lg:items-start">
          <Panel className="overflow-hidden">
            <div className="relative h-[310px]">
              <Shot src={rideImg} alt="Jet ski safety video preview" />
              <div className="absolute inset-0 grid place-items-center bg-brand-deep/25">
                <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/40 bg-white/90 text-brand-teal shadow-xl">
                  <PlayCircle className="h-8 w-8" aria-hidden />
                </div>
              </div>
            </div>
            <div className="p-7 sm:p-8">
              <Eyebrow>STEP 1 · BEFORE YOU ARRIVE</Eyebrow>
              <DisplayHeading className="mt-2.5" size="md">
                The safety video
              </DisplayHeading>
              <p className="mt-3 text-[15.5px] leading-[1.65] text-brand-muted">
                Sent with your booking confirmation. It covers throttle and
                steering behaviour, the riding zone, no-wake areas, hand signals,
                and what to do if you come off.
              </p>
            </div>
          </Panel>

          <div className="grid gap-5">
            <Panel className="p-7 sm:p-8">
              <div className="flex items-center justify-between gap-4">
                <Eyebrow>STEP 2 · DIGITAL INDEMNITY</Eyebrow>
                <FileSignature className="h-5 w-5 text-brand-teal" aria-hidden />
              </div>
              <DisplayHeading className="mt-2.5" size="sm">
                Sign once, on your phone
              </DisplayHeading>
              <p className="mt-3 text-[15px] leading-[1.65] text-brand-muted">
                Every participant receives a secure personal link after booking.
                Their signature and swim declaration are tracked against the group,
                so staff can see when everyone is ready.
              </p>
              <div className="mt-5 flex items-center justify-between gap-4 rounded-[14px] border border-dashed border-brand-line-strong bg-brand-surface p-4">
                <div>
                  <div className="font-bold text-brand-ink">Indemnity · participant link</div>
                  <div className="mt-1 text-[13px] text-brand-faint">
                    Opens from the confirmation email
                  </div>
                </div>
                <span className="rounded-full bg-prime-bg px-3 py-1.5 text-[11.5px] font-bold text-prime-fg">
                  SECURE
                </span>
              </div>
            </Panel>

            <Panel className="p-7 sm:p-8">
              <div className="flex items-center justify-between gap-4">
                <Eyebrow>STEP 3 · AT THE HARBOUR</Eyebrow>
                <Clock3 className="h-5 w-5 text-brand-teal" aria-hidden />
              </div>
              <DisplayHeading className="mt-2.5" size="sm">
                In-person briefing on the slipway
              </DisplayHeading>
              <p className="mt-3 text-[15px] leading-[1.65] text-brand-muted">
                Meet us at Gordon&apos;s Bay Harbour 15 minutes early. We cover
                controls, boarding, the riding zone, hand signals and the absolute
                don&apos;ts on the actual machine.
              </p>
            </Panel>
          </div>
        </div>
      </Shell>

      <Section>
        <div className="grid gap-5 lg:grid-cols-2">
          <Panel className="p-7 sm:p-8">
            <div className="flex items-center gap-2">
              <Check className="h-5 w-5 text-prime-fg" aria-hidden />
              <DisplayHeading size="sm">On the water — do</DisplayHeading>
            </div>
            <div className="mt-5 space-y-2">
              {DOS.map((item) => (
                <TickRow key={item} mark="✓" tone="green">
                  {item}
                </TickRow>
              ))}
            </div>
          </Panel>
          <Panel className="p-7 sm:p-8">
            <div className="flex items-center gap-2">
              <X className="h-5 w-5 text-rough-fg" aria-hidden />
              <DisplayHeading size="sm">On the water — don&apos;t</DisplayHeading>
            </div>
            <div className="mt-5 space-y-2">
              {DONTS.map((item) => (
                <TickRow key={item} mark="✕" tone="red">
                  {item}
                </TickRow>
              ))}
            </div>
          </Panel>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {REQUIREMENTS.map((requirement) => (
            <Panel key={requirement.title} className="p-6">
              <ShieldCheck className="h-5 w-5 text-brand-teal" aria-hidden />
              <h3 className="mt-4 font-bold text-brand-ink">{requirement.title}</h3>
              <p className="mt-2 text-[14px] leading-[1.6] text-brand-muted">
                {requirement.body}
              </p>
            </Panel>
          ))}
        </div>
      </Section>

      <ClosingCta
        title="Ready to ride the safe way?"
        body="Check the conditions, choose a session, and complete the safety steps from your booking email."
      >
        <BrandButton to={ROUTES.rides} tone="amber" size="lg">
          See rides &amp; pricing
        </BrandButton>
        <BrandButton href={CONTACT.whatsapp} tone="ghost-dark" size="lg">
          Ask a safety question
        </BrandButton>
      </ClosingCta>
    </div>
  )
}
