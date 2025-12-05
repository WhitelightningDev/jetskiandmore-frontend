import * as React from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import {
  CalendarDays,
  CheckCircle2,
  Info,
  MapPin,
  Phone,
  Ship,
  Users,
  Waves,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button, buttonVariants } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import boatImg from '@/lib/images/Spectatorboatride.png'
import { sendBoatRideRequest } from '@/lib/api'

export const Route = createFileRoute('/boat-ride/')({
  component: RouteComponent,
})

const maxPeople = 12

function RouteComponent() {
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [successOpen, setSuccessOpen] = React.useState(false)
  const [submitting, setSubmitting] = React.useState(false)
  const [selectedDate, setSelectedDate] = React.useState<Date>()
  const [error, setError] = React.useState<string | null>(null)
  const [form, setForm] = React.useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    people: 2,
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (!selectedDate) {
      setError('Please choose a date for your boat ride.')
      return
    }

    const people = Math.min(maxPeople, Math.max(1, Number(form.people) || 1))
    const date = selectedDate.toISOString().split('T')[0]

    try {
      setSubmitting(true)
      await sendBoatRideRequest({
        ...form,
        people,
        date,
      })
      setForm({ firstName: '', lastName: '', phone: '', email: '', people: 2 })
      setSelectedDate(undefined)
      setDialogOpen(false)
      setSuccessOpen(true)
    } catch (err: any) {
      setError(err?.message || 'Sorry, something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="bg-gradient-to-b from-sky-50 via-white to-white">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-sky-100 via-white to-emerald-50" />
        <div className="relative mx-auto max-w-6xl px-4 py-10 md:py-14">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] items-center">
            <div className="space-y-5">
              <Badge className="bg-white/70 text-sky-800 border-sky-200 flex items-center gap-2 w-fit">
                <Ship className="h-4 w-4" />
                Spectator experience
              </Badge>
              <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-slate-900">
                Book a spectator boat ride
              </h1>
              <p className="text-slate-700 max-w-2xl">
                Bring friends or family along to watch the action from the water. Our spectator boat keeps you close to the jet skis for great views and photos while we handle the skipper and safety.
              </p>

              <div className="flex flex-wrap gap-3 text-sm text-slate-700">
                <Badge variant="secondary" className="flex items-center gap-2 rounded-full">
                  <Users className="h-4 w-4" />
                  Up to {maxPeople} people
                </Badge>
                <Badge variant="secondary" className="flex items-center gap-2 rounded-full">
                  <MapPin className="h-4 w-4" />
                  Gordon&apos;s Bay Harbour launch
                </Badge>
                <Badge variant="outline" className="flex items-center gap-2 rounded-full">
                  <Waves className="h-4 w-4" />
                  Weather &amp; sea conditions apply
                </Badge>
              </div>

              <div className="flex flex-wrap gap-3">
                <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); setError(null) }}>
                  <DialogTrigger asChild>
                    <Button size="lg">
                      <CalendarDays className="mr-2 h-5 w-5" />
                      Request a boat ride
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Request a boat ride</DialogTitle>
                      <DialogDescription>
                        Share your details and preferred date. We&apos;ll confirm availability and email {`info@falsebayoceandaventures.co.za`}.
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">Name</Label>
                          <Input
                            id="firstName"
                            value={form.firstName}
                            onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Surname</Label>
                          <Input
                            id="lastName"
                            value={form.lastName}
                            onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Cell number</Label>
                          <Input
                            id="phone"
                            inputMode="tel"
                            value={form.phone}
                            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                            placeholder="+27"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email address</Label>
                          <Input
                            id="email"
                            type="email"
                            value={form.email}
                            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                            placeholder="you@example.com"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Label htmlFor="people">How many people? (max {maxPeople})</Label>
                          <Input
                            id="people"
                            type="number"
                            min={1}
                            max={maxPeople}
                            value={form.people}
                            onChange={(e) =>
                              setForm((f) => ({
                                ...f,
                                people: Math.min(maxPeople, Math.max(1, Number(e.target.value) || 1)),
                              }))
                            }
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="boat-date">Choose a date</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button id="boat-date" variant="outline" className="w-full justify-start font-normal">
                                <CalendarDays className="mr-2 h-4 w-4" />
                                {selectedDate
                                  ? selectedDate.toLocaleDateString('en-ZA', {
                                      weekday: 'short',
                                      year: 'numeric',
                                      month: 'short',
                                      day: 'numeric',
                                    })
                                  : 'Pick a date'}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={selectedDate}
                                onSelect={setSelectedDate}
                                disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0))}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <p className="text-xs text-muted-foreground">We&apos;ll match times to weather and harbour slots.</p>
                        </div>
                      </div>

                      {error ? <p className="text-sm text-red-600">{error}</p> : null}

                      <DialogFooter className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-xs text-muted-foreground flex items-center gap-2">
                          <Info className="h-3.5 w-3.5" />
                          Subject to skipper availability and sea conditions.
                        </p>
                        <div className="flex gap-2">
                          <Button type="button" variant="ghost" onClick={() => setDialogOpen(false)}>
                            Cancel
                          </Button>
                          <Button type="submit" disabled={submitting}>
                            {submitting ? 'Sending...' : 'Send request'}
                          </Button>
                        </div>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>

                <Link to="/contact" className={buttonVariants({ variant: 'outline', size: 'lg' })}>
                  <Phone className="mr-2 h-5 w-5" />
                  Talk to us
                </Link>
              </div>
            </div>

            <Card className="border-sky-200/70 shadow-lg shadow-sky-200/60">
              <CardContent className="p-0">
                <div className="relative aspect-[4/3] overflow-hidden rounded-t-xl">
                  <img
                    src={boatImg}
                    alt="Spectator boat ride"
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
                  <div className="absolute bottom-3 left-3 flex items-center gap-2 text-xs text-white">
                    <Badge variant="secondary" className="bg-white/90 text-slate-900">
                      Safe &amp; skippered
                    </Badge>
                    <Badge variant="secondary" className="bg-emerald-400/90 text-emerald-900">
                      Great for photos
                    </Badge>
                  </div>
                </div>
                <div className="p-5 space-y-3">
                  <div className="flex items-center gap-2 text-slate-700">
                    <Users className="h-4 w-4 text-sky-700" />
                    <span className="text-sm">Family-friendly spectator boat with shade and life jackets.</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700">
                    <MapPin className="h-4 w-4 text-sky-700" />
                    <span className="text-sm">Launches from Gordon&apos;s Bay Harbour alongside the jet skis.</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700">
                    <CalendarDays className="h-4 w-4 text-sky-700" />
                    <span className="text-sm">Choose your date and we&apos;ll confirm the best weather window.</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2">
            {[
              {
                icon: <Users className="h-5 w-5 text-sky-700" />,
                title: 'Perfect for spectators',
                desc: 'Ideal for family, friends or content teams who want to stay close without getting wet.',
              },
              {
                icon: <Waves className="h-5 w-5 text-sky-700" />,
                title: 'Comfort & safety',
                desc: 'Experienced skipper, life jackets provided, and we stay within agreed calm zones.',
              },
              {
                icon: <CalendarDays className="h-5 w-5 text-sky-700" />,
                title: 'Flexible timing',
                desc: 'We will align with your jet ski booking or create a stand-alone slot.',
              },
              {
                icon: <Phone className="h-5 w-5 text-sky-700" />,
                title: 'Simple confirmation',
                desc: 'Send your request and we&apos;ll reply with timing, price and next steps.',
              },
            ].map((item) => (
              <Card key={item.title} className="h-full border-slate-200/80">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-sky-50 border border-sky-100">
                      {item.icon}
                    </span>
                    {item.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-slate-600 pt-0">
                  {item.desc}
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="mt-8 border-slate-200/80 bg-linear-to-br from-white to-sky-50/60">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                How it works
              </CardTitle>
              <CardDescription>Quick steps to arrange your spectator boat.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-3 text-sm text-slate-700">
              {[
                'Send your request with your details and preferred date.',
                'We confirm availability, ideal time and weather with you.',
                'Arrive 15 minutes early for life jackets and a short briefing.',
              ].map((step, idx) => (
                <div key={step} className="flex items-start gap-3">
                  <span className="mt-0.5 inline-flex h-7 w-7 items-center justify-center rounded-full bg-emerald-50 text-emerald-800 border border-emerald-100 text-sm font-semibold">
                    {idx + 1}
                  </span>
                  <p>{step}</p>
                </div>
              ))}
            </CardContent>
            <CardFooter className="flex flex-wrap gap-3 items-center justify-between">
              <p className="text-xs text-muted-foreground flex items-center gap-2">
                <Info className="h-4 w-4" />
                If seas look rough, we may shift your slot to a calmer window.
              </p>
              <Button variant="outline" onClick={() => setDialogOpen(true)}>
                <CalendarDays className="mr-2 h-4 w-4" />
                Request a boat ride
              </Button>
            </CardFooter>
          </Card>
        </div>
      </section>

      <Dialog open={successOpen} onOpenChange={setSuccessOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              Request sent
            </DialogTitle>
            <DialogDescription>
              Thanks for your interest! We&apos;ve sent your details to info@falsebayoceandaventures.co.za and will confirm availability soon.
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
