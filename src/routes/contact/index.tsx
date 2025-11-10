import * as React from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { MapPin, Phone, Mail, Clock, MessageSquare, CalendarDays, Info } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Button, buttonVariants } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import { postJSON } from '@/lib/api'

export const Route = createFileRoute('/contact/')({
  component: RouteComponent,
})

function RouteComponent() {
  const [fullName, setFullName] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [phone, setPhone] = React.useState('')
  const [message, setMessage] = React.useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      await postJSON<{ ok: boolean; id: string }>(
        '/api/contact',
        { fullName, email, phone, message }
      )
      alert("Thanks! We've received your message and will get back to you shortly.")
      setFullName(''); setEmail(''); setPhone(''); setMessage('')
    } catch (err: any) {
      alert(`Sorry, we couldn't send your message: ${err?.message || 'Unknown error'}`)
    }
  }

  return (
    <div className="bg-white">
      <section className="mx-auto max-w-6xl px-4 py-10 md:py-14">
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-3xl md:text-4xl font-bold">Contact us</h1>
          <Badge variant="secondary" className="flex items-center gap-1 self-start">
            <MapPin className="h-4 w-4" />
            Gordon&apos;s Bay Harbour • Western Cape
          </Badge>
        </div>

        {/* Quick info pills */}
        <div className="mb-6 flex flex-wrap items-center gap-2">
          <Badge variant="secondary" className="rounded-full">Safety briefing included</Badge>
          <Badge variant="secondary" className="rounded-full">Life jackets included</Badge>
          <Badge variant="outline" className="rounded-full">Arrive 15 min early</Badge>
          <Badge variant="outline" className="rounded-full">Weather‑flexible</Badge>
          <Badge variant="outline" className="rounded-full">Gordon&apos;s Bay only</Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Contact form */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Send us a message
              </CardTitle>
              <CardDescription>We usually reply within a few hours</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full name</Label>
                    <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" inputMode="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="message">How can we help?</Label>
                    <Textarea id="message" placeholder="Ask about availability, weather, group bookings…" value={message} onChange={(e) => setMessage(e.target.value)} required />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
                  <div className="text-xs text-muted-foreground flex items-center gap-2">
                    <Info className="h-4 w-4" />
                    We’ll never share your contact details.
                  </div>
                  <div className="flex gap-3">
                    <Link to="/Bookings" className={buttonVariants({ variant: 'outline' })}>Book a ride</Link>
                    <Button type="submit">Send message</Button>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Contact details / map */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Find us
              </CardTitle>
              <CardDescription>We launch from Gordon&apos;s Bay Harbour</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <div className="flex items-center justify-between">
                <span>159 Beach Road, Gordon&apos;s Bay Harbour</span>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="sm">View map</Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <div className="text-sm">Map embed placeholder</div>
                  </PopoverContent>
                </Popover>
              </div>
              <Separator />
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span>Phone / WhatsApp: add number</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span>Email: add address</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>Typical hours: 08:00–17:00 (weather dependent)</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex items-center justify-between">
              <Link to="/safety" className={buttonVariants({ variant: 'outline', size: 'sm' })}>Safety &amp; rider info</Link>
              <Link to="/weather" className={buttonVariants({ size: 'sm' })}>
                <CalendarDays className="mr-2 h-4 w-4" />
                Weather tips
              </Link>
            </CardFooter>
          </Card>
        </div>
      </section>
    </div>
  )
}
