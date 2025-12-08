import { createFileRoute, Link } from '@tanstack/react-router'
import {
  Anchor,
  CalendarClock,
  ShieldCheck,
  Waves,
  AlertTriangle,
  ShipWheel,
  FileCheck2,
  LifeBuoy,
  MapPin,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/terms/')({
  component: RouteComponent,
})

type Section = {
  title: string
  icon: React.ReactNode
  points: string[]
}

const sections: Section[] = [
  {
    title: 'Bookings & payments',
    icon: <CalendarClock className="h-5 w-5" />,
    points: [
      'A confirmed booking reserves your slot and equipment for the selected time.',
      'Full payment (or an agreed deposit) is required to secure a session. Outstanding balances must be settled before launch.',
      'Prices include safety briefing, harbour fees, and life jackets unless otherwise stated.',
    ],
  },
  {
    title: 'Cancellations & weather',
    icon: <Waves className="h-5 w-5" />,
    points: [
      'If weather or sea conditions become unsafe, we may pause, reschedule, or shorten rides for safety reasons.',
      'We aim to provide at least 24 hours notice for non-urgent changes; same-day calls may be required for sudden conditions.',
      'Customer-initiated cancellations or changes should be requested at least 24 hours prior to launch where possible.',
    ],
  },
  {
    title: 'Rider responsibilities',
    icon: <ShipWheel className="h-5 w-5" />,
    points: [
      'Follow the safety briefing, harbour rules, and skipper instructions at all times.',
      'Life jackets must be worn for the full duration of the ride; no alcohol or drugs before or during the session.',
      'Report any medical conditions that could impact your safety. Minimum age or supervision rules may apply to specific rides.',
    ],
  },
  {
    title: 'Liability & conduct',
    icon: <ShieldCheck className="h-5 w-5" />,
    points: [
      'You accept the inherent risks of water activities; we supervise and brief riders to mitigate these risks.',
      'Intentional misuse or negligence that damages equipment or property may result in repair/replacement charges.',
      'We reserve the right to refuse service or end a session if safety rules are ignored.',
    ],
  },
]

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2 text-sm text-muted-foreground">
      <FileCheck2 className="h-4 w-4 mt-[2px] text-emerald-600" />
      <span>{children}</span>
    </li>
  )
}

function RouteComponent() {
  return (
    <div className="bg-gradient-to-b from-emerald-50 via-white to-white pb-12">
      <section className="relative overflow-hidden border-b border-emerald-100/70 bg-gradient-to-r from-emerald-50 via-white to-cyan-50">
        <div className="absolute inset-0 opacity-70 bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.12),_transparent_35%)]" />
        <div className="relative mx-auto max-w-5xl px-4 py-12 md:py-16">
          <Badge className="bg-white/90 text-emerald-800 border-emerald-200 mb-3">Terms &amp; conditions</Badge>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900">Ride-ready terms for smooth sessions</h1>
          <p className="mt-3 max-w-3xl text-slate-600">
            These terms keep riders, crew, and equipment safe while we deliver an effortless day on the water. Please
            review them before booking.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-slate-700">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 border border-emerald-100 shadow-sm">
              <Anchor className="h-4 w-4 text-emerald-700" /> SAMSA certified operation
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 border border-emerald-100 shadow-sm">
              <LifeBuoy className="h-4 w-4 text-emerald-700" /> Safety briefing on every ride
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 border border-emerald-100 shadow-sm">
              <MapPin className="h-4 w-4 text-emerald-700" /> Gordon&apos;s Bay Harbour
            </span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-10 md:py-12">
        <div className="grid gap-6 md:grid-cols-2">
          {sections.map((section) => (
            <Card key={section.title} className="border-emerald-100/80 shadow-[0_18px_40px_-30px_rgba(16,185,129,0.55)]">
              <CardHeader className="space-y-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-700">
                  {section.icon}
                </div>
                <CardTitle className="text-lg">{section.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {section.points.map((point) => (
                    <Bullet key={point}>{point}</Bullet>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <Card className="border-emerald-100/80">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-emerald-700" />
                Damage, deposits &amp; safety holds
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                A refundable hold or deposit may be required for certain rides. Any equipment damage caused by misuse or
                ignoring instructions may be charged at repair or replacement cost.
              </p>
              <p className="rounded-lg border border-emerald-100 bg-emerald-50/50 p-3 text-emerald-900">
                If something isn&apos;t working or you notice an issue, alert the crew immediately so we can resolve it
                before it affects your session.
              </p>
            </CardContent>
          </Card>

          <Card className="border-emerald-100/80">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Anchor className="h-5 w-5 text-emerald-700" />
                Compliance &amp; jurisdiction
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <ul className="space-y-2">
                <Bullet>Operations follow SAMSA and harbour regulations for recreational watercraft.</Bullet>
                <Bullet>These terms are governed by South African law. Disputes should first be raised directly with our team.</Bullet>
                <Bullet>By booking or riding with Jet Ski &amp; More, you agree to these terms and our Privacy Policy.</Bullet>
              </ul>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-8 border-emerald-100/80 bg-emerald-50/60">
          <CardContent className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between py-6">
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-[0.18em] text-emerald-700 font-semibold">Questions?</p>
              <h2 className="text-xl font-semibold text-slate-900">Chat with us before you book</h2>
              <p className="text-sm text-slate-700">We&apos;ll clarify anything about bookings, weather calls, or rider requirements.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link to="/Bookings">
                <Button className="flex items-center gap-2" size="sm">
                  <CalendarClock className="h-4 w-4" /> View availability
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4" /> Speak to the team
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
