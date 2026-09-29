import * as React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { BriefcaseBusiness, BusFront, Check, Compass, Hotel, Instagram, MapPinned, Send, ShieldCheck, UsersRound } from 'lucide-react'

import { BrandButton, ClosingCta, DisplayHeading, Eyebrow, Panel, Shell, Shot } from '@/components/brand/primitives'
import { CONTACT, harbourImg, ROUTES } from '@/lib/brand-content'
import { postJSON } from '@/lib/api'

export const Route = createFileRoute('/careers-collaborations')({
  head: () => ({
    meta: [
      { title: 'Careers & Collaborations | Jet Ski & More' },
      { name: 'description', content: 'Explore careers, travel trade partnerships, local providers and creator collaborations with Jet Ski & More in Gordon’s Bay and the Western Cape.' },
    ],
  }),
  component: CareersCollaborationsPage,
})

type ApplicationType = 'business' | 'creator' | 'career'

const CATEGORY_OPTIONS: Record<ApplicationType, string[]> = {
  business: [
    'B&B, guesthouse or accommodation',
    'Travel agency, tour operator or itinerary planner',
    'Airport shuttle, driver or local transfer',
    'Tour guide or local experience',
    'Concierge, hotel or destination partner',
    'Referral or affiliate collaboration',
    'Other tourism business',
  ],
  creator: [
    'Instagram, TikTok or YouTube creator',
    'Travel blogger or publisher',
    'Photographer or videographer',
    'Other creator or media collaboration',
  ],
  career: [
    'Skipper or marine operations',
    'Guest experience, bookings or harbour operations',
    'Marketing, partnerships or content',
    'Other role or future opportunity',
  ],
}

const APPLICATION_TYPES: Array<{ id: ApplicationType; label: string; note: string }> = [
  { id: 'business', label: 'Business partner', note: 'Stay, travel, transport, tours or referrals' },
  { id: 'creator', label: 'Creator & media', note: 'Social creators, photographers and publishers' },
  { id: 'career', label: 'Careers', note: 'Marine, guest operations, marketing and more' },
]

const PARTNER_CATEGORIES = [
  { icon: Hotel, title: 'Stays & hospitality', body: 'B&Bs, guesthouses, hotels and self-catering stays.' },
  { icon: BusFront, title: 'Travel & transport', body: 'Travel agencies, tour operators, airport shuttles and local drivers.' },
  { icon: Compass, title: 'Guides & experiences', body: 'Local guides and visitor experiences that help guests make the most of the Cape.' },
  { icon: Instagram, title: 'Creators & media', body: 'Instagram and TikTok creators, travel storytellers, photographers and publishers.' },
  { icon: UsersRound, title: 'Referrals & destination partners', body: 'Concierges, hospitality teams and businesses who help visitors plan their stay.' },
  { icon: BriefcaseBusiness, title: 'Careers', body: 'Skippers, marine operations, guest experience, bookings, marketing and content.' },
]

const fieldClass = 'mt-2 w-full rounded-xl border border-brand-line-strong bg-brand-surface px-4 py-3 text-[15px] text-brand-ink outline-none transition placeholder:text-brand-faint focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/15'

function CareersCollaborationsPage() {
  const [applicationType, setApplicationType] = React.useState<ApplicationType>('business')
  const [form, setForm] = React.useState({
    category: CATEGORY_OPTIONS.business[0],
    name: '',
    organization: '',
    email: '',
    phone: '',
    area: '',
    profileUrl: '',
    logoUrl: '',
    details: '',
    consent: false,
  })
  const [submitting, setSubmitting] = React.useState(false)
  const [success, setSuccess] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const isCareer = applicationType === 'career'
  const isCreator = applicationType === 'creator'

  function changeApplicationType(nextType: ApplicationType) {
    setApplicationType(nextType)
    setForm((current) => ({ ...current, category: CATEGORY_OPTIONS[nextType][0] }))
    setSuccess(false)
    setError(null)
  }

  async function submitApplication(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSuccess(false)
    setError(null)
    try {
      setSubmitting(true)
      await postJSON<{ ok: boolean; id: string }>('/api/contact', {
        fullName: form.name,
        phone: form.phone,
        email: form.email,
        subject: `${isCareer ? 'Careers expression of interest' : 'Travel collaboration application'} · ${form.category}`,
        message: [
          `Application type: ${APPLICATION_TYPES.find((item) => item.id === applicationType)?.label}`,
          `Category: ${form.category}`,
          `${isCareer ? 'Role or relevant experience' : 'Business, channel or creator name'}: ${form.organization || 'Not provided'}`,
          `Applicant: ${form.name}`,
          `Area or audience: ${form.area || 'Not provided'}`,
          `Website or social profile: ${form.profileUrl || 'Not provided'}`,
          `Public logo image URL: ${form.logoUrl || 'Not provided'}`,
          '',
          'Introduction and proposal:',
          form.details,
          '',
          'Contact consent: Yes',
        ].join('\n'),
      })
      setSuccess(true)
      setForm({ category: CATEGORY_OPTIONS[applicationType][0], name: '', organization: '', email: '', phone: '', area: '', profileUrl: '', logoUrl: '', details: '', consent: false })
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'We could not send your application. Please contact us directly.')
    } finally {
      setSubmitting(false)
    }
  }

  return <div>
    <Shell className="pt-10 sm:pt-14">
      <section className="grid items-center gap-8 lg:grid-cols-[1.05fr_.95fr]">
        <div>
          <Eyebrow>CAREERS &amp; COLLABORATIONS · WESTERN CAPE</Eyebrow>
          <DisplayHeading as="h1" className="mt-3 max-w-[760px]" size="xl">Let’s make more of every visit to the Cape.</DisplayHeading>
          <p className="mt-4 max-w-[650px] text-[17px] leading-[1.65] text-brand-muted">Jet Ski &amp; More is building a better way for visitors to discover Gordon’s Bay and False Bay. We’re interested in practical partnerships with local businesses, travel professionals and creators—and in hearing from people who want to build their career with us.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <BrandButton href="#apply">Share an application</BrandButton>
            <BrandButton to={ROUTES.plan} tone="outline">See the day planner</BrandButton>
          </div>
          <p className="mt-4 text-sm text-brand-faint">We’re starting in Gordon’s Bay and the Helderberg, with room to grow across Cape Town and the Western Cape.</p>
        </div>
        <div className="relative h-[260px] overflow-hidden rounded-[24px] sm:h-[340px]">
          <Shot src={harbourImg} alt="Gordon’s Bay Harbour, where visitors start their day on False Bay" className="absolute inset-0" position="center 55%" />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-deep/80 via-brand-deep/5 to-transparent" />
          <div className="absolute bottom-5 left-5 text-white"><p className="text-xs font-bold uppercase tracking-[0.16em] text-white/75">Local roots · visitor-ready</p><p className="mt-1 font-display text-xl font-bold">Gordon’s Bay Harbour</p></div>
        </div>
      </section>

      <section className="mt-14" aria-labelledby="collaboration-options-title">
        <Eyebrow>WHO WE’D LOVE TO HEAR FROM</Eyebrow>
        <DisplayHeading as="h2" className="mt-2" size="md">Bring your part of the trip.</DisplayHeading>
        <p id="collaboration-options-title" className="mt-2 max-w-3xl text-sm leading-6 text-brand-muted">A visitor’s holiday involves more than one activity. We’re creating a curated network that makes it easier to plan a stay, find transport and choose memorable local experiences.</p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {PARTNER_CATEGORIES.map(({ icon: Icon, title, body }) => <Panel key={title} className="p-5 sm:p-6">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-tint text-brand-teal"><Icon className="h-5 w-5" /></span>
            <h3 className="mt-4 font-display text-lg font-bold text-brand-ink">{title}</h3>
            <p className="mt-2 text-sm leading-6 text-brand-muted">{body}</p>
          </Panel>)}
        </div>
      </section>

      <section className="mt-14 grid gap-6 lg:grid-cols-[.85fr_1.15fr]" aria-labelledby="careers-interest-title">
        <Panel className="h-fit overflow-hidden">
          <div className="bg-brand-deep p-6 text-white sm:p-8">
            <Eyebrow>CAREERS</Eyebrow>
            <h2 id="careers-interest-title" className="mt-3 font-display text-2xl font-extrabold">Build the guest experience with us.</h2>
            <p className="mt-3 text-sm leading-6 text-white/75">We’re welcoming expressions of interest across skipper and marine operations, guest service, bookings, partnerships, marketing and content.</p>
          </div>
          <div className="space-y-3 p-6 sm:p-8">
            <div className="flex gap-3 text-sm leading-6 text-brand-muted"><ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-brand-teal" /><p>Marine roles should include current qualifications and relevant operating experience.</p></div>
            <p className="text-xs leading-5 text-brand-faint">There are no specific vacancies listed on this page today. Use the form to share your background for future openings; we’ll contact you if there’s a suitable opportunity.</p>
            <a href="#apply" onClick={() => changeApplicationType('career')} className="inline-flex items-center gap-2 text-sm font-bold text-brand-teal underline">Send a career expression of interest <MapPinned className="h-4 w-4" /></a>
          </div>
        </Panel>

        <Panel id="apply" className="scroll-mt-28 p-6 sm:p-8">
          <Eyebrow>START A CONVERSATION</Eyebrow>
          <h2 className="mt-2 font-display text-2xl font-extrabold text-brand-ink">Tell us what you have in mind.</h2>
          <p className="mt-2 text-sm leading-6 text-brand-muted">Choose the route that fits you. We’ll review your details and get back to you if there’s a fit.</p>

          <div className="mt-5 grid gap-2 sm:grid-cols-3" role="group" aria-label="Application type">
            {APPLICATION_TYPES.map((type) => <button key={type.id} type="button" onClick={() => changeApplicationType(type.id)} aria-pressed={applicationType === type.id} className={`rounded-xl border p-3 text-left transition-colors ${applicationType === type.id ? 'border-brand-teal bg-brand-tint/70' : 'border-brand-line hover:border-brand-teal/50'}`}>
              <span className="block text-sm font-bold text-brand-ink">{type.label}</span><span className="mt-1 block text-xs leading-5 text-brand-muted">{type.note}</span>
            </button>)}
          </div>

          <form onSubmit={submitApplication} className="mt-5 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-semibold text-brand-ink">{isCareer ? 'Area of interest' : 'Collaboration type'}<select value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} className={fieldClass}>{CATEGORY_OPTIONS[applicationType].map((category) => <option key={category}>{category}</option>)}</select></label>
              <label className="text-sm font-semibold text-brand-ink">{isCareer ? 'Role or relevant background' : isCreator ? 'Creator, channel or publication' : 'Business or organisation'}<input maxLength={160} value={form.organization} onChange={(event) => setForm({ ...form, organization: event.target.value })} className={fieldClass} /></label>
              <label className="text-sm font-semibold text-brand-ink">Your name<input required maxLength={120} value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className={fieldClass} /></label>
              <label className="text-sm font-semibold text-brand-ink">Email<input required type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} className={fieldClass} /></label>
              <label className="text-sm font-semibold text-brand-ink">Phone or WhatsApp<input required type="tel" maxLength={50} value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} className={fieldClass} /></label>
              <label className="text-sm font-semibold text-brand-ink">{isCreator ? 'Audience or region' : 'Area served'}<input maxLength={180} placeholder={isCreator ? 'e.g. Cape Town travel audience' : 'e.g. Gordon’s Bay, Cape Town'} value={form.area} onChange={(event) => setForm({ ...form, area: event.target.value })} className={fieldClass} /></label>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm font-semibold text-brand-ink">Website or social profile <span className="font-normal text-brand-faint">(optional)</span><input type="url" maxLength={500} placeholder="https://" value={form.profileUrl} onChange={(event) => setForm({ ...form, profileUrl: event.target.value })} className={fieldClass} /></label>
              {!isCareer && <label className="block text-sm font-semibold text-brand-ink">Public logo image URL <span className="font-normal text-brand-faint">(optional)</span><input type="url" maxLength={500} placeholder="https://yourbusiness.co.za/logo.png" value={form.logoUrl} onChange={(event) => setForm({ ...form, logoUrl: event.target.value })} className={fieldClass} /></label>}
            </div>
            <label className="block text-sm font-semibold text-brand-ink">{isCareer ? 'Tell us about your experience, qualifications and the work you’re looking for' : 'Describe your service, audience or collaboration idea'}<textarea required minLength={20} maxLength={2200} rows={5} value={form.details} onChange={(event) => setForm({ ...form, details: event.target.value })} className={fieldClass} /></label>
            <label className="flex items-start gap-3 text-sm leading-5 text-brand-muted"><input required type="checkbox" checked={form.consent} onChange={(event) => setForm({ ...form, consent: event.target.checked })} className="mt-1 accent-brand-teal" /><span>I agree Jet Ski &amp; More may contact me about this application.</span></label>
            <p className="text-xs leading-5 text-brand-faint">Applications go to our team for manual review. Partner listings and commercial terms are agreed directly before publication. Sending an application doesn’t guarantee a role, listing or paid collaboration.</p>
            {success && <p role="status" className="rounded-xl bg-emerald-50 p-3 text-sm font-semibold text-emerald-800">Thanks — your message has reached our team. We’ll follow up using the contact details you provided.</p>}
            {error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-800">{error} You can also reach us at <a className="underline" href={CONTACT.emailHref}>{CONTACT.email}</a>.</p>}
            <button disabled={submitting} type="submit" className="inline-flex items-center gap-2 rounded-xl bg-brand-teal px-5 py-3 text-sm font-bold text-white hover:bg-brand-teal-dark disabled:opacity-60">{submitting ? 'Sending…' : isCareer ? 'Send career interest' : 'Send collaboration proposal'} <Send className="h-4 w-4" /></button>
          </form>
        </Panel>
      </section>
    </Shell>

    <ClosingCta gradient title="A stronger visitor journey starts with good local connections." body="Planning a trip or interested in working together? We’d be glad to hear from you.">
      <BrandButton to={ROUTES.plan} tone="amber" size="lg">Plan a day in Gordon’s Bay</BrandButton>
      <BrandButton href={CONTACT.whatsapp} tone="ghost-dark" size="lg">Talk to our team</BrandButton>
    </ClosingCta>
  </div>
}
