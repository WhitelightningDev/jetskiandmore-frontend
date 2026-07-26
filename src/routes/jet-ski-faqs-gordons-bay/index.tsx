import * as React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Minus, Plus } from 'lucide-react'

import {
  BrandButton,
  DisplayHeading,
  Eyebrow,
  Panel,
  Shell,
} from '@/components/brand/primitives'
import { CONTACT, FAQS, ROUTES } from '@/lib/brand-content'

export const Route = createFileRoute('/jet-ski-faqs-gordons-bay/')({
  head: () => ({
    meta: [
      { title: "Jet Ski FAQs | Gordon's Bay" },
      {
        name: 'description',
        content:
          "Answers about booking, pricing, licences, safety, weather, children and group jet ski sessions in Gordon's Bay.",
      },
    ],
  }),
  component: FaqPage,
})

function FaqPage() {
  const [openIndex, setOpenIndex] = React.useState(0)

  return (
    <Shell className="pt-12 sm:pt-16">
      <div className="grid gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:gap-14">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <Eyebrow>FAQS</Eyebrow>
          <DisplayHeading as="h1" className="mt-3" size="xl">
            The questions we get every day.
          </DisplayHeading>
          <p className="mt-4 text-[16px] leading-[1.65] text-brand-muted">
            Still stuck? WhatsApp is the fastest way to reach us — usually
            answered within the hour.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            <BrandButton href={CONTACT.whatsapp}>Ask us directly</BrandButton>
            <BrandButton to={ROUTES.rides} tone="outline">
              See pricing
            </BrandButton>
          </div>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, index) => {
            const open = openIndex === index
            return (
              <Panel key={faq.q} className="overflow-hidden">
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-5 px-5 py-5 text-left transition-colors hover:bg-brand-surface sm:px-6"
                  aria-expanded={open}
                  onClick={() => setOpenIndex(open ? -1 : index)}
                >
                  <span className="font-display text-[16.5px] font-bold text-brand-ink sm:text-[17px]">
                    {faq.q}
                  </span>
                  <span className="flex h-8 w-8 flex-none items-center justify-center rounded-lg bg-brand-tint text-brand-teal">
                    {open ? (
                      <Minus className="h-4 w-4" aria-hidden />
                    ) : (
                      <Plus className="h-4 w-4" aria-hidden />
                    )}
                  </span>
                </button>
                {open ? (
                  <div className="px-5 pb-6 text-[15.5px] leading-[1.65] text-brand-muted sm:px-6">
                    {faq.a}
                  </div>
                ) : null}
              </Panel>
            )
          })}
        </div>
      </div>
    </Shell>
  )
}
