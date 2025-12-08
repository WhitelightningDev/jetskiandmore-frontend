import { createFileRoute, Link } from '@tanstack/react-router'
import { Shield, Lock, Globe2, Mail, Database, Timer, CheckCircle2, Phone } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/privacy/')({
  component: RouteComponent,
})

type Item = {
  title: string
  icon: React.ReactNode
  points: string[]
}

const sections: Item[] = [
  {
    title: 'Information we collect',
    icon: <Database className="h-5 w-5" />,
    points: [
      'Booking details such as your name, contact information, and preferred dates.',
      'Rider information required for safety compliance (e.g. age, experience level).',
      'Payment confirmation details processed securely by our payment provider—no card details are stored by us.',
      'Basic usage data about how you interact with our site to improve the experience.',
    ],
  },
  {
    title: 'How we use it',
    icon: <Shield className="h-5 w-5" />,
    points: [
      'To confirm and manage bookings, communicate changes, and deliver safety briefings.',
      'To meet SAMSA and harbour safety requirements for launching and supervising rides.',
      'To send service updates you request (e.g. weather changes) and respond to support queries.',
      'To improve our site performance, reliability, and rider onboarding.',
    ],
  },
  {
    title: 'Sharing & security',
    icon: <Lock className="h-5 w-5" />,
    points: [
      'We do not sell your data. Limited sharing happens only with trusted processors (payments, email/SMS) needed to deliver your booking.',
      'Data is stored with reputable providers; access is restricted to authorised staff who need it to serve you.',
      'We retain records only as long as needed for legal, safety, and operational reasons, then delete or anonymise them.',
    ],
  },
]

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2 text-sm text-muted-foreground">
      <CheckCircle2 className="h-4 w-4 mt-[2px] text-emerald-600" />
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
          <Badge className="bg-white/90 text-emerald-800 border-emerald-200 mb-3">Privacy Policy</Badge>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900">Your data stays secure while you ride</h1>
          <p className="mt-3 max-w-3xl text-slate-600">
            Jet Ski &amp; More collects only what&apos;s needed to confirm your booking, comply with SAMSA safety rules,
            and keep you informed. We never sell your data.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-slate-700">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 border border-emerald-100 shadow-sm">
              <Lock className="h-4 w-4 text-emerald-700" /> Secure processing
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 border border-emerald-100 shadow-sm">
              <Globe2 className="h-4 w-4 text-emerald-700" /> POPIA aligned
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 border border-emerald-100 shadow-sm">
              <Shield className="h-4 w-4 text-emerald-700" /> SAMSA compliant operations
            </span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-10 md:py-12">
        <div className="grid gap-6 md:grid-cols-3">
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
                <Timer className="h-5 w-5 text-emerald-700" />
                How long we keep information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                Booking and compliance records are kept for as long as we need them for legal, tax, safety, or dispute
                resolution purposes. Operational analytics is kept in aggregate form to improve our service.
              </p>
              <p className="rounded-lg border border-emerald-100 bg-emerald-50/50 p-3 text-emerald-900">
                If you want us to remove identifiable information that&apos;s no longer required, reach out and we&apos;ll
                confirm once it&apos;s deleted or anonymised.
              </p>
            </CardContent>
          </Card>

          <Card className="border-emerald-100/80">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe2 className="h-5 w-5 text-emerald-700" />
                Your choices &amp; rights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <ul className="space-y-2">
                <Bullet>Access, update, or correct your booking and rider info.</Bullet>
                <Bullet>Ask for deletion of data we no longer need to keep.</Bullet>
                <Bullet>Opt out of non-essential comms; service-critical updates still apply.</Bullet>
                <Bullet>Request a copy of the information we hold about you.</Bullet>
              </ul>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-8 border-emerald-100/80 bg-emerald-50/60">
          <CardContent className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between py-6">
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-[0.18em] text-emerald-700 font-semibold">Need to talk?</p>
              <h2 className="text-xl font-semibold text-slate-900">We&apos;ll help with any privacy question</h2>
              <p className="text-sm text-slate-700">
                Contact us and we&apos;ll respond promptly with the details you need.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link to="/contact">
                <Button className="flex items-center gap-2" size="sm">
                  <Mail className="h-4 w-4" /> Email the team
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Phone className="h-4 w-4" /> Call +27 (074) 658 8885
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
