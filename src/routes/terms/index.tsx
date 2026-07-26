import { createFileRoute } from '@tanstack/react-router'
import { AlertTriangle, Check, ShieldCheck } from 'lucide-react'

import {
  BrandButton,
  ClosingCta,
  DisplayHeading,
  Eyebrow,
  Panel,
  Shell,
} from '@/components/brand/primitives'
import { CONTACT, ROUTES } from '@/lib/brand-content'

export const Route = createFileRoute('/terms/')({
  head: () => ({
    meta: [
      { title: 'Terms & Conditions | Jet Ski & More' },
      {
        name: 'description',
        content:
          'Booking, weather, rider responsibility, conduct and equipment terms for Jet Ski & More.',
      },
    ],
  }),
  component: TermsPage,
})

const sections = [
  {
    title: 'Bookings & payments',
    points: [
      'A confirmed booking reserves the selected slot and equipment.',
      'Full payment or an agreed deposit is required to secure a session. Any balance is due before launch.',
      'Prices include the safety briefing, harbour fees and life jackets unless stated otherwise.',
    ],
  },
  {
    title: 'Cancellations & weather',
    points: [
      'If conditions are unsafe, we may pause, reschedule or shorten a session.',
      'Same-day changes may be necessary when harbour or sea conditions shift suddenly.',
      'Customer changes should be requested at least 24 hours before launch where possible.',
    ],
  },
  {
    title: 'Rider responsibilities',
    points: [
      'Follow the briefing, harbour rules and skipper instructions at all times.',
      'Life jackets are mandatory. Alcohol or drugs before or during a session are not permitted.',
      'Disclose relevant medical conditions and comply with age, swim and supervision requirements.',
    ],
  },
  {
    title: 'Liability & conduct',
    points: [
      'Water activities carry inherent risk; our process is designed to reduce, not eliminate, that risk.',
      'Intentional misuse or negligence that damages equipment may result in repair or replacement charges.',
      'We may refuse or end a session when safety rules are ignored.',
    ],
  },
]

function TermsPage() {
  return (
    <div>
      <Shell narrow className="pt-12 sm:pt-16">
        <Eyebrow>LEGAL</Eyebrow>
        <DisplayHeading as="h1" className="mt-3" size="xl">
          Terms, weather and rider responsibilities.
        </DisplayHeading>
        <p className="mt-4 text-[16.5px] leading-[1.65] text-brand-muted">
          Plain-language operating terms for a smooth, safe session. Your booking
          confirmation and personal indemnity link carry the specific terms that
          apply to your booking.
        </p>

        <div className="mt-8 space-y-4">
          {sections.map((section) => (
            <Panel key={section.title} className="p-7 sm:p-8">
              <h2 className="font-display text-[20px] font-bold text-brand-ink">
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
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-brand-amber" aria-hidden />
              <h2 className="font-display text-[20px] font-bold text-brand-ink">
                Damage, deposits &amp; safety holds
              </h2>
            </div>
            <p className="mt-4 text-[15px] leading-[1.65] text-brand-muted">
              A refundable hold or deposit may apply to selected rides. Equipment
              damage caused by misuse or ignored instructions may be charged at
              repair or replacement cost. Report any problem to the crew
              immediately.
            </p>
          </Panel>

          <Panel className="p-7 sm:p-8">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-brand-teal" aria-hidden />
              <h2 className="font-display text-[20px] font-bold text-brand-ink">
                Compliance &amp; jurisdiction
              </h2>
            </div>
            <p className="mt-4 text-[15px] leading-[1.65] text-brand-muted">
              Operations follow applicable SAMSA and harbour requirements. These
              terms are governed by South African law. By booking or participating,
              you agree to these terms, the applicable indemnity and our privacy
              policy.
            </p>
            <BrandButton to="/privacy" tone="outline" className="mt-5">
              Read the privacy policy
            </BrandButton>
          </Panel>
        </div>
      </Shell>

      <ClosingCta
        title="Questions before you commit?"
        body="Ask us about a booking term, weather call or rider requirement."
      >
        <BrandButton href={CONTACT.whatsapp} tone="amber" size="lg">
          Ask the team
        </BrandButton>
        <BrandButton to={ROUTES.rides} tone="ghost-dark" size="lg">
          View rides
        </BrandButton>
      </ClosingCta>
    </div>
  )
}
