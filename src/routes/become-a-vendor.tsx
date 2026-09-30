import * as React from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowLeft, Check } from 'lucide-react'

import { DisplayHeading, Eyebrow, Panel, Shell } from '@/components/brand/primitives'
import { CONTACT, ROUTES } from '@/lib/brand-content'
import { postJSON } from '@/lib/api'

export const Route = createFileRoute('/become-a-vendor')({
  head: () => ({ meta: [{ title: 'Apply to Become a Vendor | Jet Ski & More' }, { name: 'description', content: 'Apply for a reviewed local partner listing with Jet Ski & More.' }] }),
  component: BecomeVendorPage,
})

const CATEGORIES = [
  'Accommodation', 'Airport shuttle or transfer', 'Tour guide or tour operator', 'Travel agency',
  'Local activity or attraction', 'Restaurant or local venue', 'Car hire or mobility', 'Travel creator or photographer', 'Other visitor service',
]
const inputClass = 'mt-2 w-full rounded-xl border border-brand-line-strong bg-white px-4 py-3 text-[15px] text-brand-ink outline-none transition placeholder:text-brand-faint focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/15'

function BecomeVendorPage() {
  const [form, setForm] = React.useState({ category: CATEGORIES[0], business: '', contactName: '', email: '', phone: '', area: '', link: '', details: '', offer: '', consent: false, fee: false })
  const [submitting, setSubmitting] = React.useState(false)
  const [success, setSuccess] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  async function submitApplication(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitting(true); setSuccess(false); setError(null)
    try {
      await postJSON<{ ok: boolean; id: string }>('/api/contact', {
        fullName: form.contactName,
        phone: form.phone,
        email: form.email,
        subject: `Local partner application · ${form.category} · ${form.business}`,
        message: [
          'Local partner vendor application', `Service category: ${form.category}`, `Business: ${form.business}`,
          `Contact: ${form.contactName}`, `Email: ${form.email}`, `Phone / WhatsApp: ${form.phone}`,
          `Operating area: ${form.area}`, `Website / booking link: ${form.link || 'Not provided'}`,
          '', 'Relevant credentials and operating details:', form.details || 'Not provided',
          '', 'Guest offer, inclusions, capacity, indicative pricing and availability:', form.offer,
          '', 'Contact consent: Yes', 'R1,200 monthly listing fee acknowledged if approved: Yes',
        ].join('\n'),
      })
      setSuccess(true)
      setForm({ category: CATEGORIES[0], business: '', contactName: '', email: '', phone: '', area: '', link: '', details: '', offer: '', consent: false, fee: false })
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'We could not send your application. Please contact our team.')
    } finally { setSubmitting(false) }
  }

  return <Shell className="py-10 sm:py-14">
    <Link to={ROUTES.vendors} className="inline-flex items-center gap-2 text-sm font-bold text-brand-teal underline"><ArrowLeft className="h-4 w-4" />Back to local partners</Link>
    <div className="mt-7 grid gap-8 lg:grid-cols-[.72fr_1.28fr] lg:items-start">
      <aside className="lg:sticky lg:top-28">
        <Eyebrow>VENDOR APPLICATION</Eyebrow>
        <DisplayHeading as="h1" className="mt-2" size="lg">Apply to join the network.</DisplayHeading>
        <p className="mt-3 text-sm leading-6 text-brand-muted">We review each service for local fit, guest-ready information and the credentials relevant to its category. If approved, we’ll contact you with activation and payment details.</p>
        <Panel className="mt-6 border-brand-teal/20 bg-brand-tint/45 p-5">
          <p className="text-xs font-extrabold uppercase tracking-[.14em] text-brand-teal">Monthly listing fee</p>
          <p className="mt-1 font-display text-3xl font-extrabold text-brand-ink">R1,200 <span className="text-sm font-bold text-brand-muted">/ month</span></p>
          <p className="mt-2 text-sm leading-6 text-brand-muted">Pay after approval to activate your listing. Applying does not charge you. Travellers add services to their itinerary for free and pay providers directly.</p>
        </Panel>
        <p className="mt-4 text-xs leading-5 text-brand-faint">A listing offers visibility, not guaranteed impressions, enquiries or bookings. Don’t submit identity documents or sensitive records in this form.</p>
      </aside>

      <Panel className="p-5 sm:p-8">
        <form onSubmit={submitApplication} className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-semibold text-brand-ink">Service category<select required value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} className={inputClass}>{CATEGORIES.map((category) => <option key={category}>{category}</option>)}</select></label>
            <label className="text-sm font-semibold text-brand-ink">Business or public name<input required maxLength={150} value={form.business} onChange={(event) => setForm({ ...form, business: event.target.value })} className={inputClass} /></label>
            <label className="text-sm font-semibold text-brand-ink">Contact name<input required maxLength={120} value={form.contactName} onChange={(event) => setForm({ ...form, contactName: event.target.value })} className={inputClass} /></label>
            <label className="text-sm font-semibold text-brand-ink">Email<input required type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} className={inputClass} /></label>
            <label className="text-sm font-semibold text-brand-ink">Phone or WhatsApp<input required type="tel" maxLength={50} value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} className={inputClass} /></label>
            <label className="text-sm font-semibold text-brand-ink">Where you operate<input required maxLength={180} placeholder="e.g. Gordon’s Bay, Cape Town" value={form.area} onChange={(event) => setForm({ ...form, area: event.target.value })} className={inputClass} /></label>
          </div>
          <label className="block text-sm font-semibold text-brand-ink">Website, social profile or booking link <span className="font-normal text-brand-faint">(optional)</span><input type="url" maxLength={500} placeholder="https://" value={form.link} onChange={(event) => setForm({ ...form, link: event.target.value })} className={inputClass} /></label>
          <label className="block text-sm font-semibold text-brand-ink">Relevant credentials <span className="font-normal text-brand-faint">(where applicable)</span><textarea maxLength={1200} rows={3} placeholder="For example: guide registration, transport authorisation, grading or safety procedures." value={form.details} onChange={(event) => setForm({ ...form, details: event.target.value })} className={inputClass} /></label>
          <label className="block text-sm font-semibold text-brand-ink">What can a visitor book with you?<textarea required minLength={20} maxLength={2200} rows={4} placeholder="Describe the service, inclusions, capacity, indicative prices and how guests book." value={form.offer} onChange={(event) => setForm({ ...form, offer: event.target.value })} className={inputClass} /></label>
          <div className="space-y-3 border-t border-brand-line pt-4">
            <label className="flex items-start gap-3 text-sm leading-5 text-brand-muted"><input required type="checkbox" checked={form.consent} onChange={(event) => setForm({ ...form, consent: event.target.checked })} className="mt-1 accent-brand-teal" /><span>Jet Ski &amp; More may contact me about this application.</span></label>
            <label className="flex items-start gap-3 text-sm leading-5 text-brand-muted"><input required type="checkbox" checked={form.fee} onChange={(event) => setForm({ ...form, fee: event.target.checked })} className="mt-1 accent-brand-teal" /><span>I understand that an approved listing costs R1,200 per month and is activated after payment. Submitting this application does not charge me.</span></label>
          </div>
          {success && <p role="status" className="rounded-xl bg-emerald-50 p-3 text-sm font-semibold text-emerald-800">Application received. Our team will review it and contact you about the next step.</p>}
          {error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-800">{error} You can reach us at <a className="underline" href={CONTACT.emailHref}>{CONTACT.email}</a>.</p>}
          <button disabled={submitting} type="submit" className="inline-flex items-center gap-2 rounded-xl bg-brand-teal px-5 py-3 text-sm font-bold text-white hover:bg-brand-teal-dark disabled:opacity-60">{submitting ? 'Sending application…' : 'Submit application'} <Check className="h-4 w-4" /></button>
        </form>
      </Panel>
    </div>
  </Shell>
}
