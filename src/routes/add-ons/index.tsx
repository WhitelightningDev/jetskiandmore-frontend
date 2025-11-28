import * as React from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Camera, Droplets, Ship, Users, Gift, MapPin } from 'lucide-react'
import droneImg from '@/lib/images/drone-video.png'
import goproImg from '@/lib/images/gopro-footage.png'
import wetsuitImg from '@/lib/images/wetsuit-hire.png'
import boatImg from '@/lib/images/Spectatorboatride.png'
import passengersImg from '@/lib/images/additional-passengers.png'
import { formatZAR, DRONE_PRICE, WETSUIT_PRICE, BOAT_PRICE_PER_PERSON, EXTRA_PERSON_PRICE } from '@/features/bookings/AddOnsSection'

export const Route = createFileRoute('/add-ons/')({
  component: RouteComponent,
})

type AddOn = {
  id: string
  icon: React.ReactNode
  title: string
  subtitle: string
  priceLabel: string
  bullets: string[]
  highlight?: string
  image?: string
}

const addons: AddOn[] = [
  {
    id: 'drone',
    icon: <Camera className="h-5 w-5" />,
    title: 'Drone video',
    subtitle: 'Aerial footage of your ride',
    priceLabel: `${formatZAR(DRONE_PRICE)} (free on select rides)`,
    bullets: [
      'Professional angles from above the water',
      'Perfect for sharing on social or as a keepsake',
      'Included with some 2‑ski sessions; otherwise priced per ride',
    ],
    highlight: 'Most popular',
    image: droneImg,
  },
  {
    id: 'gopro',
    icon: <Camera className="h-5 w-5" />,
    title: 'GoPro footage',
    subtitle: 'On-board action camera',
    priceLabel: 'Priced on request',
    bullets: [
      'Mounted on the ski for immersive POV',
      'Capture splashes, speed and smiles up close',
      'Ideal for birthdays, proposals and group outings',
    ],
    image: goproImg,
  },
  {
    id: 'wetsuit',
    icon: <Droplets className="h-5 w-5" />,
    title: 'Wetsuit hire',
    subtitle: 'Stay warm and comfortable',
    priceLabel: formatZAR(WETSUIT_PRICE),
    bullets: [
      'Selection of sizes available on site',
      'Recommended for early mornings and cooler days',
      'Helps you stay out longer and enjoy the ride',
    ],
    image: wetsuitImg,
  },
  {
    id: 'boat',
    icon: <Ship className="h-5 w-5" />,
    title: 'Spectator boat ride',
    subtitle: 'Bring friends along on the water',
    priceLabel: `From ZAR ${BOAT_PRICE_PER_PERSON} per person`,
    bullets: [
      'Ideal for family and friends who prefer not to ride',
      'Stay close to the action with great photo angles',
      'Subject to weather and availability',
    ],
    image: boatImg,
  },
  {
    id: 'passengers',
    icon: <Users className="h-5 w-5" />,
    title: 'Additional passengers',
    subtitle: 'Share the experience on one ski',
    priceLabel: `R${EXTRA_PERSON_PRICE} per additional passenger`,
    bullets: [
      'Up to 2 people per ski (including rider)',
      'Great for couples, friends or parents with kids',
      'Limits and safety rules confirmed during briefing',
    ],
    highlight: 'Family favourite',
    image: passengersImg,
  },
]

function RouteComponent() {
  return (
    <div className="bg-white">
      <section className="mx-auto max-w-6xl px-4 py-10 md:py-14">
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-3xl md:text-4xl font-bold">Add‑ons &amp; Extras</h1>
          <Badge variant="secondary" className="flex items-center gap-1 self-start">
            <MapPin className="h-4 w-4" />
            Gordon&apos;s Bay Harbour • Western Cape
          </Badge>
        </div>

        <div className="mb-8 grid gap-4 md:grid-cols-[minmax(0,2fr)_minmax(0,1.2fr)]">
          <Card className="border-amber-300/60 bg-linear-to-br from-amber-50 to-amber-100/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gift className="h-5 w-5 text-amber-700" />
                Make your session unforgettable
              </CardTitle>
              <CardDescription>
                Choose from professional video, comfort upgrades and spectator options that you can add when you book.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <p>All add‑ons are optional and subject to availability and weather. You can confirm them in the booking form or with our team on the day.</p>
              <p>Pricing below is a guide; we&apos;ll confirm final totals before you pay.</p>
            </CardContent>
            <CardFooter className="flex flex-wrap gap-3">
              <Link to="/Bookings" className={buttonVariants({})}>
                View availability &amp; book
              </Link>
              <Link to="/contact" className={buttonVariants({ variant: 'outline' })}>
                Ask a question
              </Link>
            </CardFooter>
          </Card>

          {/* Simple image / media placeholder */}
          <div className="relative rounded-xl border border-dashed border-amber-200 bg-gradient-to-br from-sky-50 to-amber-50/60 p-4 flex items-center justify-center">
            <div className="w-full max-w-xs aspect-[4/3] rounded-lg bg-black/5 flex items-center justify-center">
              <span className="text-xs text-muted-foreground text-center px-4">
                Image or highlight reel placeholder.
                <br />
                Show your favourite drone shot or group photo here.
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {addons.map((addon) => (
            <Card key={addon.id} className="flex flex-col">
              <CardHeader>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex size-8 items-center justify-center rounded-md bg-amber-500/10 text-amber-700">
                      {addon.icon}
                    </span>
                    <div>
                      <CardTitle className="text-base">{addon.title}</CardTitle>
                      <CardDescription>{addon.subtitle}</CardDescription>
                    </div>
                  </div>
                  {addon.highlight ? (
                    <Badge variant="outline" className="text-[11px] px-2 py-0.5">
                      {addon.highlight}
                    </Badge>
                  ) : null}
                </div>

                {/* Per‑add‑on media */}
                {addon.image ? (
                  <div className="mt-4 rounded-md border border-muted bg-black/5 aspect-[16/9] overflow-hidden">
                    <img
                      src={addon.image}
                      alt={addon.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                ) : (
                  <div className="mt-4 rounded-md border border-dashed border-muted bg-muted/30 aspect-[16/9] flex items-center justify-center">
                    <span className="text-[11px] text-muted-foreground">
                      Visual placeholder – add a photo or frame from this add‑on.
                    </span>
                  </div>
                )}
              </CardHeader>

              <CardContent className="flex-1">
                <p className="mb-3 text-xs font-medium uppercase tracking-wide text-amber-800">
                  {addon.priceLabel}
                </p>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-4">
                  {addon.bullets.map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter className="mt-auto flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs text-muted-foreground">
                  Add this when you book your ride.
                </span>
                <Link to="/Bookings" className={buttonVariants({ size: 'sm', variant: 'outline' })}>
                  Book with add‑ons
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>

        <Separator className="my-8" />

        <Card>
          <CardHeader>
            <CardTitle>How add‑ons work</CardTitle>
            <CardDescription>Simple, transparent and flexible</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <p>• Select your ride first, then choose add‑ons in the booking form.</p>
            <p>• We&apos;ll confirm availability and exact pricing before you pay.</p>
            <p>• Weather, sea conditions and safety always come first – some extras may be adjusted or postponed if conditions change.</p>
          </CardContent>
          <CardFooter className="flex flex-wrap gap-3 justify-between">
            <span className="text-xs text-muted-foreground">
              Unsure which add‑on suits you best? Our team will recommend options based on your group and the day&apos;s conditions.
            </span>
            <Link to="/rides" className={buttonVariants({ variant: 'outline', size: 'sm' })}>
              View ride options
            </Link>
          </CardFooter>
        </Card>
      </section>
    </div>
  )
}
