import { CalendarDays } from 'lucide-react'

import { isBeforeOpeningDate, OPENING_DATE_LABEL } from '@/lib/site'

export default function OpeningDateBanner() {
  if (!isBeforeOpeningDate()) return null

  return (
    <section
      aria-label="Opening date announcement"
      className="border-y-4 border-brand-deep bg-brand-amber text-brand-ink"
      role="status"
    >
      <div className="mx-auto flex max-w-[1240px] flex-col items-center gap-3 px-5 py-6 text-center sm:flex-row sm:justify-center sm:gap-5 sm:px-8 sm:py-7">
        <CalendarDays className="h-9 w-9 shrink-0" strokeWidth={2.4} aria-hidden />
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.16em] sm:text-sm">
            Important opening date
          </p>
          <h2 className="mt-1 font-display text-[27px] font-extrabold leading-tight tracking-[-0.025em] sm:text-[36px]">
            We open {OPENING_DATE_LABEL}
          </h2>
          <p className="mt-1.5 text-sm font-semibold leading-relaxed sm:text-base">
            Jet Ski &amp; More will not be operating before then. Please plan your visit from opening day.
          </p>
        </div>
      </div>
    </section>
  )
}
