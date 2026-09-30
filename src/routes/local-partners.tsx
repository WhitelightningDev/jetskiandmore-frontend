import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowRight, BedDouble, BusFront, Camera, Compass, MapPin, Utensils, Waves } from 'lucide-react'

import { BrandButton, ClosingCta, DisplayHeading, Eyebrow, Panel, Shell, Shot } from '@/components/brand/primitives'
import { CONTACT, harbourImg, ROUTES, TRAVEL_PARTNERS } from '@/lib/brand-content'

export const Route = createFileRoute('/local-partners')({
  head: () => ({
    meta: [
      { title: 'Local Partners | Jet Ski & More' },
      { name: 'description', content: 'Plan your Gordon’s Bay and Cape Town trip with reviewed local stays, transfers, guides and experiences.' },
    ],
  }),
  component: LocalPartnersPage,
})

const VENDOR_TYPES = [
  { icon: BedDouble, title: 'Places to stay', body: 'Guesthouses, B&Bs and holiday stays.', image: '/images/vendor-network/stays.jpg' },
  { icon: BusFront, title: 'Airport & local rides', body: 'Shuttles, transfers and car hire.', image: '/images/vendor-network/transfers.jpg' },
  { icon: Compass, title: 'Guides & tour planners', body: 'Registered guides and travel agencies.', image: '/images/vendor-network/guides.jpg' },
  { icon: Waves, title: 'Things to do', body: 'Water, outdoor and local experiences.', image: '/images/vendor-network/experiences.jpg' },
  { icon: Utensils, title: 'Food & local places', body: 'Restaurants, markets and tasting rooms.', image: '/images/vendor-network/food.jpg' },
  { icon: Camera, title: 'Travel creators', body: 'Creators and destination partners.', image: '/images/vendor-network/creators.jpg' },
]

function LocalPartnersPage() {
  return <div>
    <Shell className="pt-10 sm:pt-14">
      <section className="grid items-center gap-8 lg:grid-cols-[1fr_.9fr]">
        <div>
          <Eyebrow>GORDON’S BAY · FALSE BAY · CAPE TOWN</Eyebrow>
          <DisplayHeading as="h1" className="mt-3 max-w-[690px]" size="xl">Find trusted local stays, rides and guides.</DisplayHeading>
          <p className="mt-4 max-w-[590px] text-[17px] leading-[1.6] text-brand-muted">Plan more of your South African visit around your time on the water. Browse reviewed local services and add them to a route.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <BrandButton href="#services">Explore services</BrandButton>
            <BrandButton to={ROUTES.vendorJoin} tone="outline">List your business</BrandButton>
          </div>
        </div>
        <div className="relative h-[250px] overflow-hidden rounded-[24px] sm:h-[310px]">
          <Shot src={harbourImg} alt="Gordon’s Bay Harbour on False Bay" className="absolute inset-0" position="center 55%" />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-deep/75 via-transparent to-transparent" />
          <p className="absolute bottom-5 left-5 font-display text-xl font-bold text-white">Start in Gordon’s Bay. Explore further.</p>
        </div>
      </section>

      <section id="services" className="mt-14 scroll-mt-28" aria-label="Local service categories">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div><Eyebrow>LOCAL SERVICES</Eyebrow><DisplayHeading as="h2" className="mt-2" size="md">A useful network takes more than one kind of local business.</DisplayHeading></div>
          <Link to={ROUTES.plan} className="inline-flex items-center gap-2 text-sm font-bold text-brand-teal underline">Open your day plan <ArrowRight className="h-4 w-4" /></Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {VENDOR_TYPES.map(({ icon: Icon, title, body, image }) => <article key={title} className="group relative isolate flex min-h-[210px] items-end overflow-hidden rounded-2xl bg-brand-deep p-5 text-white shadow-sm">
            <img src={image} alt="" aria-hidden="true" loading="lazy" className="absolute inset-0 -z-20 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]" />
            <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#071b27]/95 via-[#071b27]/40 to-[#071b27]/5" />
            <div><span className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/30 bg-white/15 backdrop-blur-sm"><Icon className="h-4 w-4" /></span><h3 className="font-display text-lg font-extrabold">{title}</h3><p className="mt-1 text-sm text-white/80">{body}</p></div>
          </article>)}
        </div>
      </section>

      <section className="mt-14 grid gap-6 rounded-[26px] bg-brand-deep p-6 text-white sm:p-8 lg:grid-cols-[1.05fr_1fr] lg:items-center" aria-label="Vendor reach and listing fee">
        <div className="border-b border-white/15 pb-5 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-8">
          <p className="text-xs font-bold uppercase tracking-[.15em] text-white/65">International site reach · past 3 years</p>
          <p className="mt-2 font-display text-4xl font-extrabold sm:text-5xl">1.7M+</p>
          <p className="mt-1 text-sm text-white/75">reported overseas site traffic · historical Google Ads accounts</p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl bg-white/10 p-3">
              <p className="text-[10px] font-bold uppercase tracking-[.12em] text-white/60">Google Ads export · 2022–23</p>
              <p className="mt-1 text-lg font-extrabold">144,670 <span className="text-xs font-semibold text-white/70">impressions</span></p>
              <p className="mt-1 text-xs text-white/75">4,888 interactions · 3.38% interaction rate</p>
              <p className="mt-1.5 text-[11px] leading-4 text-white/55">Mobile 4,216 · computer 343 · tablet 329</p>
            </div>
            <div className="rounded-xl bg-white/10 p-3">
              <p className="text-[10px] font-bold uppercase tracking-[.12em] text-white/60">Jet Ski &amp; More admin analytics · 2023–26</p>
              <p className="mt-1 text-lg font-extrabold">18,185 <span className="text-xs font-semibold text-white/70">page views</span></p>
              <p className="mt-1 text-xs text-white/75">3,976 tracked sessions</p>
              <p className="mt-1.5 text-[11px] leading-4 text-white/55">First-party activity recorded by our site analytics.</p>
            </div>
          </div>
          <p className="mt-3 text-[11px] leading-4 text-white/55">Google Ads reports and first-party analytics have different coverage and are not added together. These are whole-site figures, not Jet Ski customers or guaranteed vendor enquiries.</p>
        </div>
        <div>
          <div className="flex flex-wrap items-baseline justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[.15em] text-white/65">Vendor listing</p><p className="mt-1 font-display text-3xl font-extrabold">R1,200 <span className="text-base font-semibold text-white/70">per month</span></p></div><BrandButton to={ROUTES.vendorJoin} tone="amber">Apply to join</BrandButton></div>
          <div className="mt-5 grid gap-3 text-sm sm:grid-cols-3"><p className="rounded-xl bg-white/10 p-3">Reviewed profile in your service category</p><p className="rounded-xl bg-white/10 p-3">Eligible to be added to relevant visitor itineraries</p><p className="rounded-xl bg-white/10 p-3">Logo and booking link in printable plans</p></div>
          <p className="mt-4 text-xs leading-5 text-white/60">Visitors plan for free and pay you directly. Reach is platform-wide; no impressions or bookings are guaranteed.</p>
        </div>
      </section>

      <section className="mt-12" aria-label="Reviewed local listings">
        <div className="flex flex-wrap items-end justify-between gap-4"><div><Eyebrow>REVIEWED FOR RELEVANCE</Eyebrow><DisplayHeading as="h2" className="mt-2" size="md">Local recommendations, added with care.</DisplayHeading><p className="mt-2 max-w-2xl text-sm leading-6 text-brand-muted">Listings are checked for guest-ready details and the credentials relevant to the service. Travellers confirm availability and terms directly with each provider.</p></div><BrandButton to={ROUTES.plan} tone="outline">Plan your day</BrandButton></div>
        {TRAVEL_PARTNERS.length ? <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{TRAVEL_PARTNERS.map((partner) => <Panel key={partner.id} className="overflow-hidden p-0">{partner.imageUrl && <img src={partner.imageUrl} alt={partner.imageAlt || ''} className="h-40 w-full object-cover" />}<div className="p-5"><div className="flex items-start justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-wider text-brand-teal">{partner.category} · reviewed</p><h3 className="mt-1 font-display text-lg font-extrabold text-brand-ink">{partner.name}</h3></div>{partner.logoUrl && <img src={partner.logoUrl} alt={partner.logoAlt || `${partner.name} logo`} className="h-11 w-11 rounded-lg border border-brand-line object-contain p-1" />}</div><p className="mt-2 text-sm leading-6 text-brand-muted">{partner.summary}</p><p className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-brand-faint"><MapPin className="h-4 w-4" />{partner.location}</p><Link to={ROUTES.plan} search={{ add: `partner:${partner.id}` } as never} className="mt-4 inline-flex text-sm font-bold text-brand-teal underline">Add to your day</Link></div></Panel>)}</div> : <Panel className="mt-5 flex flex-wrap items-center justify-between gap-4 border-dashed p-5"><p className="text-sm text-brand-muted">The first reviewed local listings are being onboarded now.</p><a href={CONTACT.whatsapp} className="inline-flex items-center gap-2 text-sm font-bold text-brand-teal underline">Ask about the network <ArrowRight className="h-4 w-4" /></a></Panel>}
      </section>
    </Shell>
    <ClosingCta gradient title="Plan a day around Gordon’s Bay." body="Build a route, add local stops and take your itinerary with you."><BrandButton to={ROUTES.plan} tone="amber" size="lg">Plan your day</BrandButton></ClosingCta>
  </div>
}
