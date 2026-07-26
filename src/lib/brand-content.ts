import harbourImg from '@/lib/images/IMG_3202.jpg'
import waterImg from '@/lib/images/IMG_3203.jpg'
import boatImg from '@/lib/images/Spectatorboatride.png'
import droneImg from '@/lib/images/drone-video.png'
import goproImg from '@/lib/images/gopro-footage.png'
import wetsuitImg from '@/lib/images/wetsuit-hire.png'
import passengersImg from '@/lib/images/additional-passengers.png'

/**
 * Copy and data for the rebranded marketing pages, transcribed from the
 * "Jet Ski & More" design canvas so pages stay presentational.
 */

export const rideImg = '/Asunnydayofjetskiing.png'
export const logoBadge = '/brand/logo-badge.png'
export { harbourImg, waterImg, boatImg }

export const CONTACT = {
  phone: '+27 (074) 658 8885',
  phoneHref: 'tel:+27746588885',
  whatsapp: 'https://wa.me/27746588885',
  whatsappLabel: '+27 74 658 8885',
  email: 'jetskiadventures1@gmail.com',
  emailHref: 'mailto:jetskiadventures1@gmail.com',
  place: "Gordon's Bay Harbour · Western Cape",
}

export const ROUTES = {
  home: '/',
  rides: '/rides',
  weather: '/weather',
  safety: '/safety',
  boats: '/boat-ride',
  plan: '/things-to-do-gordons-bay-on-the-water',
  faq: '/jet-ski-faqs-gordons-bay',
  contact: '/contact',
  legal: '/terms',
  book: '/Bookings',
} as const

export const NAV_ITEMS = [
  { label: 'Home', to: ROUTES.home },
  { label: 'Rides & pricing', to: ROUTES.rides },
  { label: 'Conditions', to: ROUTES.weather },
  { label: 'Safety', to: ROUTES.safety },
  { label: 'Boat & fishing', to: ROUTES.boats },
  { label: 'Plan your day', to: ROUTES.plan },
  { label: 'FAQs', to: ROUTES.faq },
]

/** Mobile menu adds Contact and spells "Conditions" out in full. */
export const MOBILE_NAV_ITEMS = [
  { label: 'Home', to: ROUTES.home },
  { label: 'Rides & pricing', to: ROUTES.rides },
  { label: 'Conditions & availability', to: ROUTES.weather },
  { label: 'Safety', to: ROUTES.safety },
  { label: 'Boat & fishing', to: ROUTES.boats },
  { label: 'Plan your day', to: ROUTES.plan },
  { label: 'FAQs', to: ROUTES.faq },
  { label: 'Contact', to: ROUTES.contact },
]

export const HERO_PROOF = [
  { value: '5 yrs', label: 'OPERATING SINCE 2020' },
  { value: '4.9★', label: 'GOOGLE REVIEWS' },
  { value: 'SAMSA', label: 'RECERTIFIED YEARLY' },
  { value: '100%', label: 'BRIEFED BEFORE RIDING' },
]

export const STEPS = [
  {
    n: '1',
    title: 'Watch the safety video',
    body: 'Six minutes, sent with your confirmation. Controls, the riding zone, hand signals and what to do if you come off.',
  },
  {
    n: '2',
    title: 'Sign the digital indemnity',
    body: 'Every rider signs on their phone after the video. Guardian signature for under-18s. No paperwork at the slipway.',
  },
  {
    n: '3',
    title: 'Get briefed at the harbour',
    body: 'We meet you 15 minutes early and walk it through on the machine — the do’s and the absolute don’ts, on and off the water.',
  },
]

export const RIDE_CARDS = [
  {
    tag: 'JET SKI',
    title: 'Guided ride',
    body: 'Your own machine inside a marked zone with a skipper watching. 15, 30 or 60 minutes, first-timers welcome.',
    duration: '15, 30 or 60 min',
    price: 'From R650',
    cta: 'Enquire',
    to: ROUTES.rides,
    img: rideImg,
  },
  {
    tag: 'BOAT RIDE · FBA',
    title: 'False Bay boat ride',
    body: 'Skippered trip from the same harbour — for spectators, families and anyone who would rather watch.',
    duration: '60–90 min',
    price: 'From ZAR 650 pp',
    cta: 'Request',
    to: ROUTES.boats,
    img: boatImg,
  },
  {
    tag: 'FISHING · FBA',
    title: 'Fishing charters',
    body: 'Half-day and full-day skippered trips with tackle and safety gear included.',
    duration: 'Half or full day',
    price: 'From ZAR 4 900',
    cta: 'Enquire',
    to: ROUTES.boats,
    img: waterImg,
  },
]

export const MAINTENANCE = [
  { title: 'Pre-season strip & service', body: 'Impeller, hull, hoses and electronics checked and logged.' },
  { title: 'Flushed after every session', body: 'Salt water out, fresh water in — same day, every day.' },
  { title: 'Pre-launch checklist', body: 'Signed off before the ski leaves the trailer.' },
  { title: 'Certified skipper on site', body: 'Eyes on the zone for the whole session.' },
]

export const FAQS = [
  {
    q: 'Can I book right now, and how far ahead should I?',
    a: 'Yes — send us your date and group size and we hold the slot while we confirm conditions. In peak season (December to February) two to three days ahead is safest; out of season the same morning is often fine.',
  },
  {
    q: 'How much does it cost?',
    a: 'Jet ski prices are per booking, not per person: R650 for a 15-minute taster, R1 400 for 30 minutes on one ski, R2 600 for 30 minutes with two riders, and R2 200 for a full hour on one ski. Two skis for an hour with two riders is R5 200. The full grid is on the Rides & pricing page. Boat rides with our partner False Bay Adventures start at ZAR 650 per person and fishing charters from ZAR 4 900.',
  },
  {
    q: 'Do I need a licence or any experience?',
    a: 'No licence and no experience needed for a guided ride — we brief you, you ride within a marked zone with a skipper watching. If you would rather not drive, a Joy Ride puts an instructor on the ski with you seated behind.',
  },
  {
    q: 'What do I have to do before I ride?',
    a: 'Three things: watch the six-minute safety video sent with your confirmation, sign the digital indemnity form, then meet us at the harbour 15 minutes early for the in-person briefing on the machine.',
  },
  {
    q: 'What happens if the weather turns?',
    a: 'We only launch when it is safe. If we call it off, your session moves to the next suitable slot. If travel makes that impossible because you do not live in Cape Town, we issue a voucher valid for two years under the confirmed booking terms. Check the Conditions page before you pick a date.',
  },
  {
    q: 'What should I bring, and what do you provide?',
    a: 'Bring swimwear, a towel, sunscreen and sunglasses with a strap. We provide life jackets for every rider and passenger. Wetsuits can be hired as an add-on on cooler days.',
  },
  {
    q: 'Can children ride?',
    a: 'Riders must be 16 or older to drive, with guardian consent under 18. Passengers from 8 years old can ride behind an adult or instructor. Younger family members are welcome on the partner boat.',
  },
  {
    q: 'Do you take corporate groups and team days?',
    a: 'Regularly — 5 to 25 people, with rotating ski sessions and the partner boat alongside for everyone waiting. One invoice, one meeting point, one briefing. Email us for a quote.',
  },
  {
    q: 'What else is there to do in Gordon’s Bay?',
    a: 'Plenty within 20 minutes of the slipway: Bikini Beach, the harbour restaurants, Clarence Drive towards Rooi Els, and whale watching in season. See the Plan your day page.',
  },
  {
    q: 'Your skis look older — are they reliable?',
    a: 'They are older machines and we are upfront about it. Every ski is stripped, serviced and water-tested before each season, flushed after every session and checked before it leaves the slipway. We would rather run a machine we know inside out.',
  },
]

export const PRICE_GROUPS = [
  {
    duration: '15 minutes',
    sub: 'The taster',
    popular: false,
    rows: [
      { label: '1 jet ski · 1 rider', price: 'R650' },
      { label: '1 jet ski · 2 riders', price: 'R1 200' },
      { label: '2 jet skis · 2 riders', price: 'R1 300' },
    ],
  },
  {
    duration: '30 minutes',
    sub: 'Most booked',
    popular: true,
    rows: [
      { label: '1 jet ski · 1 rider', price: 'R1 400' },
      { label: '1 jet ski · 2 riders', price: 'R2 600' },
      { label: '2 jet skis · 2 riders', price: 'R2 800' },
      { label: '2 jet skis · 3 riders', price: 'R4 000' },
      { label: '2 jet skis · 4 riders', price: 'R5 200' },
    ],
  },
  {
    duration: '60 minutes',
    sub: 'The full session',
    popular: false,
    rows: [
      { label: '1 jet ski · 1 rider', price: 'R2 200' },
      { label: '1 jet ski · 2 riders', price: 'R3 400' },
      { label: '2 jet skis · 2 riders', price: 'R5 200' },
      { label: '2 jet skis · 3 riders', price: 'R6 400' },
      { label: '2 jet skis · 4 riders', price: 'R7 600' },
    ],
  },
]

export const PRICE_CARDS = [
  {
    title: 'False Bay boat ride',
    duration: '60–90 min · per person',
    price: 'From ZAR 650',
    body: 'Skippered boat trip with False Bay Adventures. Great for spectators, families and whale season.',
    includes: ['Licensed vessel and skipper', 'Same harbour meeting point', 'Group rates available'],
  },
  {
    title: 'Fishing charter',
    duration: 'Half or full day',
    price: 'From ZAR 4 900',
    body: 'Skippered charter with False Bay Adventures — tackle, bait and safety gear included.',
    includes: ['Tackle and bait provided', 'Experienced local skipper', 'Half or full day options'],
  },
  {
    title: 'Corporate / team day',
    duration: '5–25 people · half day',
    price: 'On quote',
    body: 'Rotating ski sessions with the partner boat alongside for everyone between turns. One invoice.',
    includes: [
      'Dedicated coordinator on the day',
      'Boat alongside for spectators',
      'Optional drone and GoPro package',
    ],
  },
]

export const ADDONS = [
  { title: 'GoPro footage', body: 'On-ski footage of your session, sent the same day.', price: 'ZAR 250', img: goproImg },
  { title: 'Drone video', body: 'Aerial clips of your ride, conditions permitting.', price: 'ZAR 450', img: droneImg },
  { title: 'Wetsuit hire', body: 'Recommended on cooler and windier days.', price: 'ZAR 150', img: wetsuitImg },
  { title: 'Waterproof phone pouch', body: 'Keep your phone with you, dry.', price: 'ZAR 150', img: passengersImg },
]

export const BEFORE_YOU_PAY = [
  'We confirm conditions before taking payment — no deposit lost to weather.',
  'Riders must be 16+ to drive; passengers from 8 years old.',
  'You must be able to swim to operate a jet ski.',
  'Arrive 15 minutes early — the briefing is part of your slot, not on top of it.',
]

export const WEATHER_GUIDES = [
  {
    title: 'Best time windows',
    sub: 'When the bay is usually calmest',
    points: [
      'Early mornings are consistently smoother, before the daily wind builds.',
      'Late afternoons can work on low-wind days.',
      'South-easterly days: we stay on the sheltered Gordon’s Bay side.',
    ],
  },
  {
    title: 'Wind & swell, plainly',
    sub: 'Comfort and control improve as wind drops',
    points: [
      'Under 15 km/h is comfortable for first-timers.',
      '15–25 km/h is rideable but choppy — expect a workout.',
      'Above 30 km/h we usually do not launch skis at all.',
    ],
  },
  {
    title: 'Rain & visibility',
    sub: 'We are weather-flexible, not weather-blind',
    points: [
      'Light rain is not a problem; heavy rain or poor visibility pauses rides.',
      'We reassess the harbour and sea state before and during every session.',
    ],
  },
  {
    title: 'What to bring',
    sub: 'Be ready for changing conditions',
    points: [
      'Sunscreen, sunglasses with a strap, and a towel.',
      'Swimwear, or hire a wetsuit on cooler and windy days.',
      'Life jackets are provided for all riders and passengers.',
    ],
  },
]

export const DOS = [
  'Stay inside the marked riding zone at all times.',
  'Keep the safety lanyard clipped to your life jacket.',
  'Watch for the skipper’s hand signals — they mean stop, slow, or come in.',
  'Keep a full ski-length between you and any other craft.',
  'Tell us immediately if anything feels wrong with the machine.',
]

export const DONTS = [
  'No riding near swimmers, moored boats or the harbour mouth.',
  'No alcohol before or during your session — zero tolerance.',
  'Never jump another ski’s wake or ride directly behind one.',
  'Do not restart the ski before checking behind you.',
  'No swapping riders on the water without the skipper alongside.',
]

export const REQUIREMENTS = [
  { title: 'Age', body: '16+ to drive with guardian consent under 18. Passengers from 8 years old.' },
  { title: 'Swimming', body: 'You must be able to swim to operate a jet ski.' },
  { title: 'Life jackets', body: 'Mandatory and provided free for every rider and passenger.' },
  { title: 'Arrival', body: '15 minutes before your slot at the Gordon’s Bay Harbour slipway.' },
]

export const BOAT_OFFERINGS = [
  {
    tag: 'BOAT RIDE',
    title: 'False Bay cruise',
    body: 'A skippered loop of the bay from Gordon’s Bay Harbour — the coastline, the harbour wall, and whales in season.',
    price: 'From ZAR 650 pp',
    duration: '60–90 minutes',
    cta: 'Request a boat ride',
  },
  {
    tag: 'GROUPS',
    title: 'Spectator boat alongside',
    body: 'Runs next to your jet ski session so families, colleagues and photographers are part of the day.',
    price: 'On quote',
    duration: 'Matched to your session',
    cta: 'Ask about groups',
  },
  {
    tag: 'FISHING',
    title: 'Fishing charter',
    body: 'Half-day and full-day skippered charters with tackle, bait and safety gear included.',
    price: 'From ZAR 4 900',
    duration: 'Half or full day',
    cta: 'Enquire about fishing',
  },
]

export const PARTNER_HOW = [
  {
    title: 'One booking, two operators',
    body: 'You deal with us. We coordinate the boat with False Bay Adventures so the timings line up.',
  },
  {
    title: 'Same harbour, same briefing',
    body: 'Both craft launch from Gordon’s Bay Harbour and everyone hears the same safety brief.',
  },
  {
    title: 'Their skipper, their vessel',
    body: 'The boat is licensed, crewed and insured by False Bay Adventures. Jet skis stay with us.',
  },
]

export const ITINERARY = [
  { time: '07:30', title: 'Meet at the slipway', body: 'Briefing on the machine while the bay is at its calmest.' },
  { time: '08:00', title: 'Your session', body: '30 or 60 minutes on the water, skipper watching the zone.' },
  { time: '09:30', title: 'Breakfast at the harbour', body: 'Coffee and something hot a two-minute walk from the trailer.' },
  { time: '11:00', title: 'Clarence Drive', body: 'The coastal road towards Rooi Els — one of the best drives in the country.' },
]

export const THINGS_TO_DO = [
  { tag: 'BEACH', title: 'Bikini Beach', body: 'Blue Flag beach, sheltered and shallow — five minutes from the harbour.', img: waterImg },
  { tag: 'DRIVE', title: 'Clarence Drive (R44)', body: 'Cliff-edge coastal road to Rooi Els and Betty’s Bay, with whale lookouts on the way.', img: harbourImg },
  { tag: 'FOOD', title: 'Harbour restaurants', body: 'Fresh seafood and sundowners a short walk from where you launch.', img: harbourImg },
  { tag: 'WILDLIFE', title: 'Whale watching (Jun–Nov)', body: 'Southern rights come right into False Bay — best seen from the partner boat.', img: boatImg },
  { tag: 'HIKE', title: 'Steenbras River Gorge', body: 'A proper Cape hike with river pools, 25 minutes up the pass.', img: waterImg },
  { tag: 'VIEW', title: 'Gordon’s Bay Old Harbour', body: 'The working harbour, the fishing fleet, and the walk out along the wall.', img: harbourImg },
]
