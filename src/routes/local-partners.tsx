import * as React from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowRight, BadgeCheck, BedDouble, BusFront, Camera, Check, Compass, MapPin, ShieldCheck, Utensils, Waves } from 'lucide-react'

import { BrandButton, ClosingCta, DisplayHeading, Eyebrow, Panel, Shell, Shot } from '@/components/brand/primitives'
import { CONTACT, harbourImg, ROUTES, TRAVEL_PARTNERS } from '@/lib/brand-content'
import { postJSON } from '@/lib/api'

export const Route = createFileRoute('/local-partners')({
  head: () => ({
    meta: [
      { title: 'Local Stays, Rides & Guides | Jet Ski & More' },
      { name: 'description', content: 'Discover reviewed local stays, transfers, guides and experiences around Gordon’s Bay and Cape Town—or apply to join the Jet Ski & More visitor network.' },
    ],
  }),
  component: LocalPartnersPage,
})

const VENDOR_TYPES = [
  { icon: BedDouble, title: 'Stays & hospitality', body: 'B&Bs, guesthouses, boutique hotels, self-catering stays and holiday rentals.' },
  { icon: BusFront, title: 'Transfers & mobility', body: 'Airport shuttles, local drivers, car hire and visitor transport.' },
  { icon: Compass, title: 'Travel trade & guides', body: 'Travel agencies, tour operators, registered guides and itinerary planners.' },
  { icon: Waves, title: 'Experiences & activities', body: 'Water activities, attractions, outdoor experiences and local operators.' },
  { icon: Utensils, title: 'Food & places', body: 'Restaurants, tasting rooms, markets and visitor-friendly local venues.' },
  { icon: Camera, title: 'Creators & destination partners', body: 'Travel creators, photographers, concierges, hotels and tourism organisations.' },
]

const REVIEW_STANDARDS = [
  { title: 'Identity & location', detail: 'Trading name, accountable contact, service area and a working guest contact or booking route.' },
  { title: 'Right evidence for the service', detail: 'We check relevant registrations, guide credentials, transport authorisations or operating permissions where they apply. Optional quality schemes are displayed only when verified.' },
  { title: 'Guest-ready information', detail: 'Clear inclusions, capacity, price basis, availability, accessibility, cancellation terms and what guests should expect.' },
  { title: 'Safety & local value', detail: 'Proportionate safety procedures, complaint contact, respectful visitor conduct and meaningful local participation.' },
]

const VENDOR_CATEGORIES = [
  'B&B, guesthouse, hotel or holiday rental',
  'Airport shuttle, transfer or local driver',
  'Travel agency, tour operator or itinerary planner',
  'Tour guide or cultural guide',
  'Local activity, attraction or outdoor experience',
  'Restaurant, tasting room or local venue',
  'Car hire or visitor mobility service',
  'Travel creator, influencer or photographer',
  'Concierge, destination partner or referral partner',
  'Other visitor service',
]

const EVIDENCE_PROMPTS: Record<string, string> = {
  [VENDOR_CATEGORIES[0]]: 'If held: TGCSA grading and expiry. Also note occupancy, guest facilities, accessibility, emergency arrangements and your booking/cancellation terms.',
  [VENDOR_CATEGORIES[1]]: 'Vehicle type and passenger capacity; operating authorisation and driver credentials where required; insurance and accessibility details relevant to the service.',
  [VENDOR_CATEGORIES[2]]: 'Business and supplier credentials, memberships or accreditation you hold, booking terms, and how you handle changes or cancellations.',
  [VENDOR_CATEGORIES[3]]: 'Provincial guide registration and expiry, guiding category/area, languages, first-aid credential and relevant experience.',
  [VENDOR_CATEGORIES[4]]: 'Operating permissions relevant to the activity, safety briefing and emergency procedures, equipment, capacity, age limits and weather policy.',
  [VENDOR_CATEGORIES[5]]: 'Trading details, seating/capacity, opening hours, accessibility, dietary information and any permits relevant to the service.',
  [VENDOR_CATEGORIES[6]]: 'Vehicle and passenger capacity, operating authorisation and driver credentials where required, insurance and pickup/drop-off coverage.',
  [VENDOR_CATEGORIES[7]]: 'Platforms and audience location, recent reach/engagement, past travel work, media kit or rate card, and how sponsored content is disclosed.',
  [VENDOR_CATEGORIES[8]]: 'Guest services offered, business contact, operating area, partner references and how you resolve visitor issues.',
  [VENDOR_CATEGORIES[9]]: 'Describe any registrations, permissions, safety arrangements, insurance or quality marks that apply to your service.',
}

const fieldClass = 'mt-2 w-full rounded-xl border border-brand-line-strong bg-brand-surface px-4 py-3 text-[15px] text-brand-ink outline-none transition placeholder:text-brand-faint focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/15'

function LocalPartnersPage() {
  const [form, setForm] = React.useState({ category: VENDOR_CATEGORIES[0], name: '', business: '', email: '', phone: '', area: '', bookingUrl: '', credentials: '', offer: '', consent: false, feeAcknowledged: false })
  const [submitting, setSubmitting] = React.useState(false)
  const [success, setSuccess] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const isCreator = form.category === VENDOR_CATEGORIES[7]

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
        subject: `Local partner application · ${form.category} · ${form.business}`,
        message: [
          'Local partner / vendor application',
          `Service category: ${form.category}`,
          `Business or public name: ${form.business}`,
          `Contact person: ${form.name}`,
          `Email: ${form.email}`,
          `Phone or WhatsApp: ${form.phone}`,
          `Service area: ${form.area}`,
          `Website or booking link: ${form.bookingUrl || 'Not provided'}`,
          '',
          'Registrations, permits, guide credentials, insurance or quality grading relevant to this service (include issuer and expiry where applicable; do not send identity documents here):',
          form.credentials || 'Not provided yet',
          '',
          'Guest offer, inclusions, capacity, indicative pricing and availability:',
          form.offer,
          '',
          'Contact consent: Yes',
          'Monthly listing fee acknowledgement: R1,200/month if approved; no charge at application: Yes',
        ].join('\n'),
      })
      setSuccess(true)
      setForm({ category: VENDOR_CATEGORIES[0], name: '', business: '', email: '', phone: '', area: '', bookingUrl: '', credentials: '', offer: '', consent: false, feeAcknowledged: false })
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'We could not send the application. Please contact our team directly.')
    } finally {
      setSubmitting(false)
    }
  }

  return <div>
    <Shell className="pt-10 sm:pt-14">
      <section className="grid items-center gap-8 lg:grid-cols-[1.05fr_.95fr]">
        <div>
          <Eyebrow>THE FALSE BAY VISITOR NETWORK</Eyebrow>
          <DisplayHeading as="h1" className="mt-3 max-w-[760px]" size="xl">Find trusted local stays, rides and guides.</DisplayHeading>
          <p className="mt-4 max-w-[650px] text-[17px] leading-[1.65] text-brand-muted">Build a better Cape Town day around the people who know it best. Discover visitor-ready places to stay, transport, local guides and experiences—and plan them alongside your time on the water.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <BrandButton href="#vendors">Browse local partners</BrandButton>
            <BrandButton href="#become-a-vendor" tone="outline">Become a vendor</BrandButton>
          </div>
          <p className="mt-4 text-sm text-brand-faint">Starting in Gordon’s Bay and the Helderberg, with a focus on useful, locally rooted services across Cape Town and the Western Cape.</p>
        </div>
        <div className="relative h-[260px] overflow-hidden rounded-[24px] sm:h-[340px]">
          <Shot src={harbourImg} alt="Gordon’s Bay Harbour, a starting point for exploring False Bay" className="absolute inset-0" position="center 55%" />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-deep/80 via-brand-deep/5 to-transparent" />
          <div className="absolute bottom-5 left-5 text-white"><p className="text-xs font-bold uppercase tracking-[0.16em] text-white/75">Start local · explore further</p><p className="mt-1 font-display text-xl font-bold">Gordon’s Bay &amp; False Bay</p></div>
        </div>
      </section>

      <section id="vendors" className="mt-14 scroll-mt-28" aria-label="Local partner directory">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div><Eyebrow>PLAN THE WHOLE VISIT</Eyebrow><DisplayHeading as="h2" className="mt-2" size="md">Local services, all in one trip plan.</DisplayHeading><p className="mt-2 max-w-3xl text-sm leading-6 text-brand-muted">Choose a place to stay, a ride, a guide or something to do. Approved listings can be added to the day planner and mapped as part of one route.</p></div>
          <Link to={ROUTES.plan} className="inline-flex items-center gap-2 text-sm font-bold text-brand-teal underline">Open your day plan <ArrowRight className="h-4 w-4" /></Link>
        </div>
        {TRAVEL_PARTNERS.length > 0 ? <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {TRAVEL_PARTNERS.map((partner) => <Panel key={partner.id} className="overflow-hidden p-0">
            {partner.imageUrl ? <img src={partner.imageUrl} alt={partner.imageAlt || ''} className="h-44 w-full object-cover" /> : null}
            <div className="p-5">
              <div className="flex items-start justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-wider text-brand-teal">{partner.category} · reviewed listing</p><h3 className="mt-1 font-display text-lg font-extrabold text-brand-ink">{partner.name}</h3></div>{partner.logoUrl ? <img src={partner.logoUrl} alt={partner.logoAlt || `${partner.name} logo`} className="h-12 w-12 rounded-lg border border-brand-line object-contain p-1" /> : null}</div>
              <p className="mt-2 text-sm leading-6 text-brand-muted">{partner.summary}</p>
              <p className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-brand-faint"><MapPin className="h-4 w-4" />{partner.location}</p>
              <div className="mt-4 flex flex-wrap items-center gap-4"><a href={`${ROUTES.plan}?add=${encodeURIComponent(`partner:${partner.id}`)}`} className="text-sm font-bold text-brand-teal underline">Add to your day</a>{(partner.bookingUrl || partner.websiteUrl) ? <a href={partner.bookingUrl || partner.websiteUrl} target="_blank" rel="noreferrer" className="text-sm font-bold text-brand-teal underline">{partner.bookingUrl ? 'Book with provider' : 'Visit provider'}</a> : null}</div>
            </div>
          </Panel>)}
        </div> : <Panel className="mt-6 grid gap-6 border-dashed p-6 sm:grid-cols-[1fr_auto] sm:items-center sm:p-8">
          <div><div className="flex items-center gap-2 text-brand-teal"><BadgeCheck className="h-5 w-5" /><p className="text-xs font-extrabold uppercase tracking-[.14em]">Curated network · opening soon</p></div><h3 id="directory-title" className="mt-2 font-display text-xl font-extrabold text-brand-ink">We’re reviewing our first local partners.</h3><p className="mt-2 max-w-2xl text-sm leading-6 text-brand-muted">No vendors are published yet. We’ll list a business only after checking its service details and the credentials relevant to what it offers. When a listing is live, you’ll be able to view its booking details and add it to your route.</p></div>
          <BrandButton href="#become-a-vendor">List your venture</BrandButton>
        </Panel>}
      </section>

      <section className="mt-14" aria-label="Venture categories">
        <Eyebrow>WHO CAN JOIN</Eyebrow>
        <DisplayHeading as="h2" className="mt-2" size="md">A useful network takes more than one kind of local business.</DisplayHeading>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {VENDOR_TYPES.map(({ icon: Icon, title, body }) => <Panel key={title} className="p-5 sm:p-6"><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-tint text-brand-teal"><Icon className="h-5 w-5" /></span><h3 className="mt-4 font-display text-lg font-bold text-brand-ink">{title}</h3><p className="mt-2 text-sm leading-6 text-brand-muted">{body}</p></Panel>)}
        </div>
      </section>

      <section className="mt-14 grid gap-6 overflow-hidden rounded-[28px] bg-brand-deep p-6 text-white sm:p-9 lg:grid-cols-[1.1fr_.9fr] lg:items-center" aria-label="Vendor listing value and price">
        <div>
          <Eyebrow>REACH VISITORS PLANNING A CAPE TOWN TRIP</Eyebrow>
          <h2 className="mt-2 max-w-2xl font-display text-3xl font-extrabold leading-tight sm:text-4xl">Be part of the trip they’re already planning.</h2>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-white/75">Jet Ski &amp; More has recorded more than 1.7 million visits from overseas audiences across the site over the last three years. That is platform-wide reach—not a claim that those visitors booked a jet ski or will choose a vendor. We’re building useful local discovery around that audience, starting in Gordon’s Bay and the Helderberg.</p>
        </div>
        <div className="rounded-2xl border border-white/15 bg-white/10 p-5 sm:p-6">
          <p className="text-xs font-extrabold uppercase tracking-[.14em] text-white/65">Vendor listing</p>
          <p className="mt-2 font-display text-4xl font-extrabold">R1,200 <span className="text-lg font-semibold text-white/70">/ month</span></p>
          <ul className="mt-4 space-y-2 text-sm leading-6 text-white/85">
            <li>• A reviewed listing in the relevant local service category</li>
            <li>• A place in relevant visitor day plans and mapped itineraries</li>
            <li>• Your logo and booking/contact link shown with your listing in itinerary PDFs</li>
            <li>• Visitors plan with you for free; they arrange and pay you directly</li>
          </ul>
          <p className="mt-4 border-t border-white/15 pt-4 text-xs leading-5 text-white/60">Applications are reviewed first. If accepted, the monthly fee is due to activate your listing. A listing does not guarantee impressions, enquiries or bookings.</p>
          <a href="#become-a-vendor" className="mt-5 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-bold text-brand-deep no-underline hover:bg-white/90">Apply to join <ArrowRight className="h-4 w-4" /></a>
        </div>
      </section>

      <section className="mt-14 grid gap-6 lg:grid-cols-[.9fr_1.1fr]" aria-label="Partner review standards and vendor application">
        <div><Eyebrow>HOW WE EARN GUEST TRUST</Eyebrow><DisplayHeading as="h2" className="mt-2" size="md">Clear checks, matched to the service.</DisplayHeading><p className="mt-3 text-sm leading-6 text-brand-muted">This is a curated referral and itinerary network, not a regulator or blanket certification. We review the details guests rely on, verify relevant evidence with the provider, and show only status we can substantiate.</p>
          <div className="mt-6 space-y-4">{REVIEW_STANDARDS.map((item, index) => <div key={item.title} className="flex gap-3"><span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-tint text-xs font-extrabold text-brand-teal">{index + 1}</span><div><h3 className="font-bold text-brand-ink">{item.title}</h3><p className="mt-1 text-sm leading-6 text-brand-muted">{item.detail}</p></div></div>)}</div>
          <div className="mt-6 border-t border-brand-line pt-5"><p className="text-xs font-bold uppercase tracking-wider text-brand-faint">Official starting points for sector checks</p><div className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-xs font-semibold"><a href="https://itks.tourism.gov.za/content/page/26/registration-requirements" target="_blank" rel="noreferrer" className="text-brand-teal underline">Tourist guide registration</a><a href="https://www.tourism.gov.za/AboutNDT/Publications/NPTR%20Tourism%20Operating%20License%20Handbook.pdf" target="_blank" rel="noreferrer" className="text-brand-teal underline">Tourist transport licensing</a><a href="https://www.tourismgrading.co.za/about-the-tgcsa" target="_blank" rel="noreferrer" className="text-brand-teal underline">Accommodation grading</a><a href="https://tkp.tourism.gov.za/rt/what/Pages/default.aspx" target="_blank" rel="noreferrer" className="text-brand-teal underline">Responsible tourism guidance</a></div><p className="mt-2 text-xs leading-5 text-brand-faint">Confirm current requirements with the relevant authority; they depend on the activity and area you operate in.</p></div>
          <div className="mt-6 rounded-2xl bg-brand-tint/60 p-4"><div className="flex gap-2 text-sm font-bold text-brand-ink"><ShieldCheck className="h-5 w-5 shrink-0 text-brand-teal" />A listing is not a guarantee of a guest’s experience.</div><p className="mt-2 text-xs leading-5 text-brand-muted">We show the business’s own booking route and terms. Guests should check availability, inclusions and cancellation terms with the provider before paying.</p></div>
        </div>
        <Panel id="become-a-vendor" className="scroll-mt-28 p-6 sm:p-8">
          <Eyebrow>FOR LOCAL VENTURES</Eyebrow><h2 className="mt-2 font-display text-2xl font-extrabold text-brand-ink">Become a vendor and be part of the trip.</h2><p className="mt-2 text-sm leading-6 text-brand-muted">Apply for a reviewed listing at R1,200 per month. We check service fit and relevant credentials first; if accepted, you pay the monthly fee to activate your listing. Travellers can add your service to their itinerary at no charge and book/pay you directly.</p>
          <form onSubmit={submitApplication} className="mt-5 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-semibold text-brand-ink">Venture type<select required value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} className={fieldClass}>{VENDOR_CATEGORIES.map((category) => <option key={category}>{category}</option>)}</select></label>
              <label className="text-sm font-semibold text-brand-ink">{isCreator ? 'Creator, channel or public name' : 'Business or public name'}<input required maxLength={150} value={form.business} onChange={(event) => setForm({ ...form, business: event.target.value })} className={fieldClass} /></label>
              <label className="text-sm font-semibold text-brand-ink">Your name<input required maxLength={120} value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className={fieldClass} /></label>
              <label className="text-sm font-semibold text-brand-ink">Email<input required type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} className={fieldClass} /></label>
              <label className="text-sm font-semibold text-brand-ink">Phone or WhatsApp<input required type="tel" maxLength={50} value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} className={fieldClass} /></label>
              <label className="text-sm font-semibold text-brand-ink">Where you operate<input required maxLength={180} placeholder="e.g. Gordon’s Bay, Stellenbosch, Cape Town" value={form.area} onChange={(event) => setForm({ ...form, area: event.target.value })} className={fieldClass} /></label>
            </div>
            <label className="block text-sm font-semibold text-brand-ink">Website, social profile or booking page <span className="font-normal text-brand-faint">(optional)</span><input type="url" maxLength={500} placeholder="https://" value={form.bookingUrl} onChange={(event) => setForm({ ...form, bookingUrl: event.target.value })} className={fieldClass} /></label>
            <label className="block text-sm font-semibold text-brand-ink">{isCreator ? 'Audience, track record & partnership fit' : 'Credentials and operating details'} <span className="font-normal text-brand-faint">(where applicable)</span><textarea maxLength={1200} rows={3} placeholder={EVIDENCE_PROMPTS[form.category]} value={form.credentials} onChange={(event) => setForm({ ...form, credentials: event.target.value })} className={fieldClass} /></label>
            <label className="block text-sm font-semibold text-brand-ink">{isCreator ? 'What could you create with us?' : 'What can a visitor book with you?'}<textarea required minLength={20} maxLength={2200} rows={4} placeholder={isCreator ? 'Describe your audience, content idea, deliverables, usage rights, expected fee and how you disclose paid partnerships.' : 'Describe your service, inclusions, typical capacity, indicative price range and how guests enquire or book.'} value={form.offer} onChange={(event) => setForm({ ...form, offer: event.target.value })} className={fieldClass} /></label>
            <p className="rounded-xl bg-brand-surface p-3 text-xs leading-5 text-brand-muted">Please don’t attach identity documents or sensitive records here. We’ll tell you which supporting evidence is needed and arrange a suitable way to verify it. Applying does not guarantee approval, a listing, bookings or paid work.</p>
            <label className="flex items-start gap-3 text-sm leading-5 text-brand-muted"><input required type="checkbox" checked={form.consent} onChange={(event) => setForm({ ...form, consent: event.target.checked })} className="mt-1 accent-brand-teal" /><span>I agree Jet Ski &amp; More may contact me about this vendor application.</span></label>
            <label className="flex items-start gap-3 text-sm leading-5 text-brand-muted"><input required type="checkbox" checked={form.feeAcknowledged} onChange={(event) => setForm({ ...form, feeAcknowledged: event.target.checked })} className="mt-1 accent-brand-teal" /><span>I understand that, if approved, my listing costs R1,200 per month and only goes live once the fee is paid. This application does not charge me.</span></label>
            {success && <p role="status" className="rounded-xl bg-emerald-50 p-3 text-sm font-semibold text-emerald-800">Thanks—your application has reached our team. We’ll follow up using the details you provided.</p>}
            {error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-800">{error} You can also reach us at <a className="underline" href={CONTACT.emailHref}>{CONTACT.email}</a>.</p>}
            <button disabled={submitting} type="submit" className="inline-flex items-center gap-2 rounded-xl bg-brand-teal px-5 py-3 text-sm font-bold text-white hover:bg-brand-teal-dark disabled:opacity-60">{submitting ? 'Sending…' : 'Apply to join the network'} <Check className="h-4 w-4" /></button>
          </form>
        </Panel>
      </section>
    </Shell>

    <ClosingCta gradient title="Build your Cape Town day with local people." body="Use the day planner to map a route, then add partner services as the network grows.">
      <BrandButton to={ROUTES.plan} tone="amber" size="lg">Plan a day in Gordon’s Bay</BrandButton>
      <BrandButton href={CONTACT.whatsapp} tone="ghost-dark" size="lg">Talk to our team</BrandButton>
    </ClosingCta>
  </div>
}
