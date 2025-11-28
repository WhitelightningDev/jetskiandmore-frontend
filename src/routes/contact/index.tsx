import * as React from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageSquare,
  CalendarDays,
  Info,
  CheckCircle2,
  ShieldCheck,
  LifeBuoy,
  CloudSun,
  Anchor,
  Users,
} from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Button, buttonVariants } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { postJSON } from '@/lib/api'

export const Route = createFileRoute('/contact/')({
  component: RouteComponent,
})

function RouteComponent() {
  const [fullName, setFullName] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [phone, setPhone] = React.useState('')
  const [message, setMessage] = React.useState('')
  const [successOpen, setSuccessOpen] = React.useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      await postJSON<{ ok: boolean; id: string }>('/api/contact', {
        fullName,
        email,
        phone,
        message,
      })
      setFullName('')
      setEmail('')
      setPhone('')
      setMessage('')
      setSuccessOpen(true)
    } catch (err: any) {
      alert(`Sorry, we couldn't send your message: ${err?.message || 'Unknown error'}`)
    }
  }

  return (
    <div className="bg-slate-50">
      <section className="mx-auto max-w-6xl px-4 py-10 md:py-16">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-600">
              Get in touch
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
              Contact us
            </h1>
            <p className="mt-2 max-w-xl text-sm text-muted-foreground">
              Ask about availability, weather conditions, special occasions, or group bookings.
              We&apos;re happy to help you plan the perfect time on the water.
            </p>
          </div>
          <Badge
            variant="secondary"
            className="flex items-center gap-2 self-start rounded-full bg-sky-50 text-sky-900"
          >
            <MapPin className="h-4 w-4" />
            Gordon&apos;s Bay Harbour • Western Cape
          </Badge>
        </div>

        {/* Quick info pills */}
        <div className="mb-8 flex flex-wrap items-center gap-2 text-xs">
          <Badge variant="secondary" className="flex items-center gap-1 rounded-full">
            <ShieldCheck className="h-3 w-3" />
            Safety briefing included
          </Badge>
          <Badge variant="secondary" className="flex items-center gap-1 rounded-full">
            <LifeBuoy className="h-3 w-3" />
            Life jackets provided
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1 rounded-full">
            <Clock className="h-3 w-3" />
            Arrive 15 min early
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1 rounded-full">
            <CloudSun className="h-3 w-3" />
            Weather‑flexible
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1 rounded-full">
            <Anchor className="h-3 w-3" />
            Gordon&apos;s Bay only
          </Badge>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Contact form */}
          <Card className="lg:col-span-2 border-slate-200/80 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-sky-50">
                  <MessageSquare className="h-4 w-4 text-sky-700" />
                </span>
                <span>Send us a message</span>
              </CardTitle>
              <CardDescription>We usually reply within a few hours during operating times.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full name</Label>
                    <Input
                      id="fullName"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Jane Doe"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone / WhatsApp</Label>
                    <Input
                      id="phone"
                      inputMode="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+27 74 658 8885"
                      required
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="jetskiadventures1@gmail.com"
                      required
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="message">How can we help?</Label>
                    <Textarea
                      id="message"
                      placeholder="Ask about availability, sunrise/sunset slots, weather, or group bookings…"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                      className="min-h-[120px]"
                    />
                    <p className="text-xs text-muted-foreground">
                      The more detail you share, the easier it is for us to tailor the perfect ride.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <Badge className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Info className="h-4 w-4 bg-yellow-500 rounded" />
                    <span className='text-white'>We’ll never share your contact details with anyone else.</span>
                  </Badge>
                  <div className="flex gap-3">
                    <Link
                      to="/Bookings"
                      className={buttonVariants({ variant: 'outline', size: 'sm' })}
                    >
                      Browse bookings
                    </Link>
                    <Button type="submit" size="sm">
                      Send message
                    </Button>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Contact details / map */}
          <Card className="border-slate-200/80 bg-linear-to-b from-sky-50/60 via-white to-white shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-sky-50">
                  <MapPin className="h-4 w-4 text-sky-700" />
                </span>
                <span>Find us</span>
              </CardTitle>
              <CardDescription>We launch directly from Gordon&apos;s Bay Harbour.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5 text-sm text-muted-foreground">
              <div>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="space-y-1">
                    <p className="font-medium text-foreground">
                      159 Beach Road, Gordon&apos;s Bay Harbour
                    </p>
                    <p className="text-xs">
                      Easy parking nearby and a short walk to the launch point.
                    </p>
                  </div>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="sm">
                        View map
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                      <div className="space-y-3 text-xs">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          <span>Map preview</span>
                        </div>
                        <div className="flex h-40 items-center justify-center rounded-md border bg-slate-100">
                          <span className="max-w-[220px] text-center text-[11px] text-muted-foreground">
                            Map embed coming soon. For now, search &quot;Jetski &amp; More Gordon&apos;s
                            Bay&quot; in your maps app.
                          </span>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <a
                  href="tel:+27XXXXXXXXX"
                  className="flex items-center gap-2 transition hover:text-foreground"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100">
                    <Phone className="h-4 w-4" />
                  </span>
                  <div className="space-y-0.5">
                    <p className="text-xs font-medium text-foreground">Phone / WhatsApp</p>
                    <p className="text-xs text-muted-foreground">+27 74 658 8885</p>
                  </div>
                </a>

                <a
                  href="mailto:info@example.com"
                  className="flex items-center gap-2 transition hover:text-foreground"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100">
                    <Mail className="h-4 w-4" />
                  </span>
                  <div className="space-y-0.5">
                    <p className="text-xs font-medium text-foreground">Email</p>
                    <p className="text-xs text-muted-foreground">jetskiadventures1@gmail.com</p>
                  </div>
                </a>

                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100">
                    <Clock className="h-4 w-4" />
                  </span>
                  <div className="space-y-0.5">
                    <p className="text-xs font-medium text-foreground">Typical hours</p>
                    <p className="text-xs text-muted-foreground">
                      08:00–17:00 (weather dependent) • Sunrise and sunset rides on request.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100">
                    <Users className="h-4 w-4" />
                  </span>
                  <div className="space-y-0.5">
                    <p className="text-xs font-medium text-foreground">Groups &amp; events</p>
                    <p className="text-xs text-muted-foreground">
                      Ask us about birthdays, team events, and special occasions.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-2 border-t bg-white/60 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
              <Link
                to="/safety"
                className={buttonVariants({ variant: 'outline', size: 'sm' })}
              >
                Safety &amp; rider info
              </Link>
              <Link to="/weather" className={buttonVariants({ size: 'sm' })}>
                <CalendarDays className="mr-2 h-4 w-4" />
                Weather tips
              </Link>
            </CardFooter>
          </Card>
        </div>
      </section>

      {/* Success dialog */}
      <Dialog open={successOpen} onOpenChange={setSuccessOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              Message sent
            </DialogTitle>
            <DialogDescription>
              Thanks! We&apos;ve received your message and will get back to you shortly.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setSuccessOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
