import { createFileRoute } from '@tanstack/react-router'
import { Check, Database, Lock, ShieldCheck } from 'lucide-react'

import {
  BrandButton,
  ClosingCta,
  DisplayHeading,
  Eyebrow,
  Panel,
  Shell,
} from '@/components/brand/primitives'
import { CONTACT } from '@/lib/brand-content'

export const Route = createFileRoute('/privacy/')({
  head: () => ({
    meta: [
      { title: 'Privacy Policy | Jet Ski & More' },
      {
        name: 'description',
        content:
          'How Jet Ski & More collects, uses, protects and retains booking and rider information.',
      },
    ],
  }),
  component: PrivacyPage,
})

const sections = [
  {
    title: 'Information we collect',
    icon: Database,
    points: [
      'Booking details such as your name, contact information and preferred dates.',
      'Participant information needed for safety, communication and indemnity tracking.',
      'Payment confirmation details from our provider; we do not store your card details.',
      'Basic site usage data used to improve reliability and customer journeys.',
    ],
  },
  {
    title: 'How we use it',
    icon: ShieldCheck,
    points: [
      'Confirm and manage bookings, changes, safety briefings and participant readiness.',
      'Meet operational, safety, accounting and legal requirements.',
      'Send service updates you request and respond to enquiries.',
      'Improve site performance, onboarding and support.',
    ],
  },
  {
    title: 'Sharing & security',
    icon: Lock,
    points: [
      'We do not sell personal information.',
      'We share only what trusted payment, email, hosting and operational providers need to deliver the service.',
      'Access is limited to authorised staff and records are retained only as long as required.',
    ],
  },
]

function PrivacyPage() {
  return (
    <div>
      <Shell narrow className="pt-12 sm:pt-16">
        <Eyebrow>PRIVACY</Eyebrow>
        <DisplayHeading as="h1" className="mt-3" size="xl">
          Your information supports the booking — not somebody else&apos;s marketing list.
        </DisplayHeading>
        <p className="mt-4 text-[16.5px] leading-[1.65] text-brand-muted">
          We collect what is needed to manage a booking, keep participants safe,
          meet operational obligations and improve the service. We do not sell
          personal information.
        </p>

        <div className="mt-8 space-y-4">
          {sections.map((section) => (
            <Panel key={section.title} className="p-7 sm:p-8">
              <section.icon className="h-6 w-6 text-brand-teal" aria-hidden />
              <h2 className="mt-4 font-display text-[20px] font-bold text-brand-ink">
                {section.title}
              </h2>
              <div className="mt-4 space-y-3">
                {section.points.map((point) => (
                  <div
                    key={point}
                    className="flex items-start gap-3 border-t border-brand-line-soft pt-3 text-[15px] leading-[1.6] text-brand-muted"
                  >
                    <Check className="mt-1 h-4 w-4 flex-none text-brand-teal" aria-hidden />
                    {point}
                  </div>
                ))}
              </div>
            </Panel>
          ))}

          <Panel className="p-7 sm:p-8">
            <h2 className="font-display text-[20px] font-bold text-brand-ink">
              Retention and your choices
            </h2>
            <p className="mt-3 text-[15px] leading-[1.65] text-brand-muted">
              Booking, indemnity and payment records are retained for as long as
              legal, tax, safety and dispute-resolution needs require. You may ask
              to access, correct or remove information we no longer need to keep.
              Service-critical booking updates still apply if you opt out of
              marketing communication.
            </p>
          </Panel>
        </div>
      </Shell>

      <ClosingCta
        title="Want to access, correct or remove your information?"
        body="Contact the team with the booking email address so we can verify and action the request."
      >
        <BrandButton href={CONTACT.emailHref} tone="amber" size="lg">
          Email the team
        </BrandButton>
        <BrandButton to="/terms" tone="ghost-dark" size="lg">
          Read terms
        </BrandButton>
      </ClosingCta>
    </div>
  )
}
