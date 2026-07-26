import * as React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { AlertTriangle, CheckCircle2, Loader2, PlayCircle, ShieldCheck } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { getIndemnityContext, submitIndemnity } from '@/lib/api'
import type { IndemnityContext, IndemnitySubmitResult } from '@/lib/api'
import { SITE_ORIGIN } from '@/lib/site'

export const Route = createFileRoute('/indemnity/')({
  head: () => {
    const pageUrl = `${SITE_ORIGIN}/indemnity`
    const description =
      'Complete your indemnity form for your Jet Ski & More booking. Every person on the water must sign their own form before arrival.'
    return {
      title: 'Complete your indemnity | Jet Ski & More',
      meta: [
        { name: 'description', content: description },
        // Personal, booking-specific link — keep it out of search results.
        { name: 'robots', content: 'noindex, nofollow' },
      ],
      links: [{ rel: 'canonical', href: pageUrl }],
    }
  },
  component: IndemnityRoute,
})

const RANDS = (cents: number) =>
  `R${(cents / 100).toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

type SwimAnswer = 'yes' | 'no' | null

type FormState = {
  fullName: string
  email: string
  idNumber: string
  phone: string
  dateOfBirth: string
  emergencyContactName: string
  emergencyContactPhone: string
  medicalConditions: string
  hasWatchedVideo: boolean
  hasAcceptedIndemnity: boolean
  signatureName: string
}

const EMPTY_FORM: FormState = {
  fullName: '',
  email: '',
  idNumber: '',
  phone: '',
  dateOfBirth: '',
  emergencyContactName: '',
  emergencyContactPhone: '',
  medicalConditions: '',
  hasWatchedVideo: false,
  hasAcceptedIndemnity: false,
  signatureName: '',
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 lg:py-14">{children}</div>
  )
}

function IndemnityRoute() {
  // Read the token straight off the URL. Declaring validateSearch here would
  // tighten the router-wide search schema and break other pages' links.
  const token = React.useMemo(() => {
    if (typeof window === 'undefined') return ''
    return new URLSearchParams(window.location.search).get('token') || ''
  }, [])

  const [context, setContext] = React.useState<IndemnityContext | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [loadError, setLoadError] = React.useState<string | null>(null)

  const [values, setValues] = React.useState<FormState>(EMPTY_FORM)
  const [canSwim, setCanSwim] = React.useState<SwimAnswer>(null)
  const [errors, setErrors] = React.useState<Record<string, string>>({})
  const [submitting, setSubmitting] = React.useState(false)
  const [submitError, setSubmitError] = React.useState<string | null>(null)
  const [result, setResult] = React.useState<IndemnitySubmitResult | null>(null)
  const [confirmSwimOpen, setConfirmSwimOpen] = React.useState(false)

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => (prev[key] ? { ...prev, [key]: '' } : prev))
  }

  React.useEffect(() => {
    let cancelled = false
    if (!token) {
      setLoading(false)
      setLoadError('This link is missing its booking code. Please use the exact link from your confirmation email.')
      return
    }
    setLoading(true)
    getIndemnityContext(token)
      .then((ctx) => {
        if (cancelled) return
        setContext(ctx)
        setValues((prev) => ({
          ...prev,
          fullName: ctx.participant.fullName || '',
          email: ctx.participant.email || '',
        }))
        setLoadError(null)
      })
      .catch((e: unknown) => {
        if (cancelled) return
        setLoadError(e instanceof Error ? e.message : 'This indemnity link is not valid.')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [token])

  const validate = (): boolean => {
    const next: Record<string, string> = {}
    if (!values.fullName.trim()) next.fullName = 'Please enter your full name'
    if (!values.idNumber.trim()) next.idNumber = 'Please enter your ID or passport number'
    if (!values.phone.trim()) next.phone = 'Please enter a contact number'
    if (!values.emergencyContactName.trim()) next.emergencyContactName = 'Please enter an emergency contact'
    if (!values.emergencyContactPhone.trim()) next.emergencyContactPhone = 'Please enter their number'
    if (canSwim === null) next.canSwim = 'Please answer the swim question'

    // Someone who cannot swim is removed from the booking, so we do not ask them
    // to watch the video, accept the indemnity, or sign.
    if (canSwim === 'yes') {
      if (!values.hasWatchedVideo) next.hasWatchedVideo = 'Please confirm you have watched the safety video'
      if (!values.hasAcceptedIndemnity) next.hasAcceptedIndemnity = 'Please accept the indemnity to continue'
      if (!values.signatureName.trim()) next.signatureName = 'Please type your full name to sign'
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const doSubmit = async () => {
    if (!context) return
    setSubmitting(true)
    setSubmitError(null)
    try {
      const res = await submitIndemnity({
        token,
        fullName: values.fullName.trim(),
        email: values.email.trim() || undefined,
        idNumber: values.idNumber.trim() || undefined,
        phone: values.phone.trim() || undefined,
        dateOfBirth: values.dateOfBirth || undefined,
        emergencyContactName: values.emergencyContactName.trim() || undefined,
        emergencyContactPhone: values.emergencyContactPhone.trim() || undefined,
        medicalConditions: values.medicalConditions.trim() || undefined,
        canSwim: canSwim === 'yes',
        hasWatchedVideo: values.hasWatchedVideo,
        hasAcceptedIndemnity: canSwim === 'yes' ? values.hasAcceptedIndemnity : false,
        signatureName: values.signatureName.trim() || undefined,
      })
      setResult(res)
    } catch (e: unknown) {
      setSubmitError(e instanceof Error ? e.message : 'Could not submit your form. Please try again.')
    } finally {
      setSubmitting(false)
      setConfirmSwimOpen(false)
    }
  }

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    // Declaring you cannot swim removes you from the booking — confirm first.
    if (canSwim === 'no') {
      setConfirmSwimOpen(true)
      return
    }
    void doSubmit()
  }

  if (loading) {
    return (
      <Shell>
        <div className="flex items-center gap-3 text-slate-600">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Loading your booking…</span>
        </div>
      </Shell>
    )
  }

  if (loadError) {
    return (
      <Shell>
        <Card className="border-rose-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-rose-700">
              <AlertTriangle className="h-5 w-5" />
              We could not open this form
            </CardTitle>
            <CardDescription>{loadError}</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-slate-600">
            <p>
              Please open the link directly from your booking confirmation email. If it still does not work,
              contact us on{' '}
              <a className="font-semibold text-sky-700" href="tel:+27746588885">
                074 658 8885
              </a>{' '}
              and we will sort it out.
            </p>
          </CardContent>
        </Card>
      </Shell>
    )
  }

  if (!context) return null

  // Already removed on a previous visit.
  if (context.isRemoved && !result) {
    return (
      <Shell>
        <Card className="border-amber-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-800">
              <AlertTriangle className="h-5 w-5" />
              You are no longer on this booking
            </CardTitle>
            <CardDescription>
              You were removed from booking {context.bookingReference} because swim competency is required for
              everyone on the water. There is nothing further to complete.
            </CardDescription>
          </CardHeader>
        </Card>
      </Shell>
    )
  }

  if (result) {
    const removed = result.removed
    return (
      <Shell>
        <Card className={removed ? 'border-amber-200' : 'border-emerald-200'}>
          <CardHeader>
            <CardTitle className={`flex items-center gap-2 ${removed ? 'text-amber-800' : 'text-emerald-700'}`}>
              {removed ? <AlertTriangle className="h-5 w-5" /> : <CheckCircle2 className="h-5 w-5" />}
              {removed ? 'You have been removed from this booking' : 'Indemnity received'}
            </CardTitle>
            <CardDescription>{result.message}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-slate-600">
            {removed ? (
              <>
                {result.bookingCancelled ? (
                  <p>
                    No riders who can swim remained on this booking, so the whole booking has been cancelled.
                  </p>
                ) : (
                  <p>The rest of the booking goes ahead as planned.</p>
                )}
                {result.refundAmountInCents > 0 ? (
                  <p>
                    {result.refundStatus === 'refunded' ? (
                      <>
                        A refund of <strong>{RANDS(result.refundAmountInCents)}</strong> has been sent back to the
                        original payment method. Banks usually take 3–10 working days to reflect it.
                      </>
                    ) : (
                      <>
                        A refund of <strong>{RANDS(result.refundAmountInCents)}</strong> is due. Our team will process
                        it manually and be in touch.
                      </>
                    )}
                  </p>
                ) : null}
                <p>
                  Swim competency is a safety requirement for everyone on the water, riders and passengers alike.
                  Life jackets are mandatory but are not a substitute for being comfortable in water.
                </p>
              </>
            ) : (
              <>
                <p>
                  Your form is now linked to booking <strong>{context.bookingReference}</strong>. You are checked off
                  for {context.date} at {context.time}.
                </p>
                <p>Please arrive 15 minutes early so we can brief you and fit your life jacket.</p>
              </>
            )}
          </CardContent>
        </Card>
      </Shell>
    )
  }

  const alreadySigned = context.participant.indemnityStatus === 'SIGNED'

  return (
    <Shell>
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-slate-900 sm:text-3xl">Indemnity form</h1>
          <p className="text-sm text-slate-600">
            This link was created specifically for you, so your signed form is recorded against the correct booking.
            Every person on the water completes their own.
          </p>
        </div>

        {alreadySigned ? (
          <Card className="border-emerald-200 bg-emerald-50/50">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base text-emerald-800">
                <CheckCircle2 className="h-5 w-5" />
                You have already signed
              </CardTitle>
              <CardDescription className="text-emerald-800/80">
                We have your indemnity on file for this booking. You can submit again to update your details.
              </CardDescription>
            </CardHeader>
          </Card>
        ) : null}

        {/* Booking context, so the guest can confirm this is the right ride */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Your booking</CardTitle>
            <CardDescription>
              Booked by {context.primaryRiderName} · Reference {context.bookingReference}
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm sm:grid-cols-3">
            <div>
              <div className="text-xs uppercase tracking-wide text-slate-500">You are</div>
              <div className="font-semibold text-slate-900">{context.participant.roleLabel}</div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-wide text-slate-500">Ride</div>
              <div className="font-medium text-slate-900">{context.rideLabel}</div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-wide text-slate-500">Date &amp; time</div>
              <div className="font-medium text-slate-900">
                {context.date} · {context.time}
              </div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-wide text-slate-500">Jet skis</div>
              <div className="font-medium text-slate-900">{context.numberOfJetSkis}</div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-wide text-slate-500">Riders</div>
              <div className="font-medium text-slate-900">{context.totalRiders}</div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-wide text-slate-500">Passengers</div>
              <div className="font-medium text-slate-900">{context.totalPassengers}</div>
            </div>
          </CardContent>
        </Card>

        <form onSubmit={onSubmit} className="space-y-6" noValidate>
          {/* Safety video */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">1. Watch the safety briefing</CardTitle>
              <CardDescription>
                {context.participant.isRider
                  ? 'Required before you may operate a jet ski.'
                  : 'Required for passengers too — it covers what to do if you come off.'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button asChild variant="outline" type="button">
                <a href={context.safetyVideoUrl || '#'} target="_blank" rel="noreferrer">
                  <PlayCircle className="mr-2 h-4 w-4" />
                  Watch the safety video
                </a>
              </Button>
              <label className="flex items-start gap-2 text-sm">
                <Checkbox
                  id="hasWatchedVideo"
                  checked={values.hasWatchedVideo}
                  onCheckedChange={(v) => set('hasWatchedVideo', Boolean(v))}
                />
                <span className="text-slate-800">I have watched the full safety briefing video.</span>
              </label>
              {errors.hasWatchedVideo ? (
                <p className="text-sm text-rose-600">{errors.hasWatchedVideo}</p>
              ) : null}
            </CardContent>
          </Card>

          {/* Personal details */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">2. Your details</CardTitle>
              <CardDescription>We use these for check-in and in an emergency.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="fullName">Full name</Label>
                <Input id="fullName" value={values.fullName} onChange={(e) => set('fullName', e.target.value)} />
                {errors.fullName ? <p className="text-sm text-rose-600">{errors.fullName}</p> : null}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={values.email}
                  onChange={(e) => set('email', e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="idNumber">ID / passport number</Label>
                <Input id="idNumber" value={values.idNumber} onChange={(e) => set('idNumber', e.target.value)} />
                {errors.idNumber ? <p className="text-sm text-rose-600">{errors.idNumber}</p> : null}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="phone">Contact number</Label>
                <Input id="phone" value={values.phone} onChange={(e) => set('phone', e.target.value)} />
                {errors.phone ? <p className="text-sm text-rose-600">{errors.phone}</p> : null}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="dateOfBirth">Date of birth</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={values.dateOfBirth}
                  onChange={(e) => set('dateOfBirth', e.target.value)}
                />
                <p className="text-xs text-slate-500">Riders under 18 must be assisted by a parent or guardian.</p>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="emergencyContactName">Emergency contact name</Label>
                <Input
                  id="emergencyContactName"
                  value={values.emergencyContactName}
                  onChange={(e) => set('emergencyContactName', e.target.value)}
                />
                {errors.emergencyContactName ? (
                  <p className="text-sm text-rose-600">{errors.emergencyContactName}</p>
                ) : null}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="emergencyContactPhone">Emergency contact number</Label>
                <Input
                  id="emergencyContactPhone"
                  value={values.emergencyContactPhone}
                  onChange={(e) => set('emergencyContactPhone', e.target.value)}
                />
                {errors.emergencyContactPhone ? (
                  <p className="text-sm text-rose-600">{errors.emergencyContactPhone}</p>
                ) : null}
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="medicalConditions">Medical conditions or allergies (optional)</Label>
                <Textarea
                  id="medicalConditions"
                  rows={3}
                  placeholder="Anything our skippers should know about"
                  value={values.medicalConditions}
                  onChange={(e) => set('medicalConditions', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Swim declaration — the gate */}
          <Card className="border-sky-200">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <ShieldCheck className="h-5 w-5 text-sky-600" />
                3. Swim competency
              </CardTitle>
              <CardDescription>
                Everyone on the water must be able to swim — riders and passengers alike. Life jackets are mandatory
                but are not a substitute for being comfortable in water. Please answer honestly.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => {
                    setCanSwim('yes')
                    setErrors((prev) => ({ ...prev, canSwim: '' }))
                  }}
                  className={`rounded-lg border p-3 text-left text-sm transition ${
                    canSwim === 'yes'
                      ? 'border-emerald-500 bg-emerald-50 ring-1 ring-emerald-500'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="font-semibold text-slate-900">Yes, I can swim</div>
                  <div className="text-slate-600">I am comfortable and able to swim unaided in open water.</div>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCanSwim('no')
                    setErrors((prev) => ({ ...prev, canSwim: '' }))
                  }}
                  className={`rounded-lg border p-3 text-left text-sm transition ${
                    canSwim === 'no'
                      ? 'border-rose-500 bg-rose-50 ring-1 ring-rose-500'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="font-semibold text-slate-900">No, I cannot swim</div>
                  <div className="text-slate-600">
                    You will be removed from this booking and refunded for your place.
                  </div>
                </button>
              </div>
              {errors.canSwim ? <p className="text-sm text-rose-600">{errors.canSwim}</p> : null}
              {canSwim === 'no' ? (
                <div className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800">
                  <p className="font-semibold">This will change your booking.</p>
                  <p className="mt-1">
                    Because you cannot swim, we cannot take you onto the water. Submitting this form removes you from
                    the booking and refunds your portion automatically. If you are the only rider, the whole booking
                    is cancelled and refunded.
                  </p>
                </div>
              ) : null}
            </CardContent>
          </Card>

          {/* Indemnity — only relevant if they are actually riding */}
          {canSwim !== 'no' ? (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">4. Waiver and indemnity</CardTitle>
                <CardDescription>Please read in full before accepting.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="max-h-64 overflow-y-auto rounded border border-slate-200 bg-slate-50 p-3 text-sm leading-relaxed text-slate-700">
                  <p className="mb-3">
                    I hereby state that I have chosen to take part in the activity being offered by Jet ski and more
                    (Jet ski and more Gordon’s Bay) of my own free will.
                  </p>
                  <p className="mb-3">
                    I indemnify Jet ski and more, its members, directors and employees against all claims, losses,
                    demands, actions, damages and causes of action whatsoever arising directly or indirectly out of my
                    acts connected with or arising out of the Activity, whether suffered by me or any other third
                    party, and I hold Jet ski and more harmless there from.
                  </p>
                  <p className="mb-3">
                    I understand that the Activity may be inherently dangerous and may create certain risks to persons
                    that can result in property damage and serious physical injury. I further understand that Jet ski
                    and more, its officers, employees, and agents will not be and/or are not responsible for any
                    injuries, property damage or liability that may arise from my participation in the Activity. I
                    assume full responsibility for the decision, and the consequences thereof, to take part in the
                    Activity.
                  </p>
                  <p className="mb-3">
                    I confirm that I am able to swim and am comfortable in open water, and I understand that a life
                    jacket is mandatory at all times but is not a substitute for swim competency.
                  </p>
                  <p className="mb-3 font-semibold">Minors</p>
                  <p className="mb-3">
                    Where the Indemnifying Party is a minor (younger than 18 (eighteen) years), the Indemnifying Party
                    agrees to be and has been assisted by a parent/guardian in agreeing to this agreement and such
                    parent/guardian has consented to the Indemnifying Party participating in the Activity.
                  </p>
                  <p className="mb-3 font-semibold">Acceptance</p>
                  <p className="mb-3">
                    I have read this agreement and understand all its terms, and I have executed this instrument
                    voluntarily and with full knowledge of its significance. I confirm that I fully appreciate the
                    risks that I may be exposed to during my participation in the Activity and that I voluntarily
                    accept such risks.
                  </p>
                  <p>
                    I hereby consent to Jet ski and more and its officers, employees, agents, and third-party service
                    providers lawfully collecting, processing, storing and transferring my personal information, as
                    defined in the Protection of Personal Information Act 4 of 2013 (POPI) in accordance with POPI and
                    to process such information insofar as necessary. If you do not understand the meaning or effect
                    of any clause, please contact Daniel Mommsen on 074 658 8885 before accepting.
                  </p>
                </div>

                <label className="flex items-start gap-2 text-sm">
                  <Checkbox
                    id="hasAcceptedIndemnity"
                    checked={values.hasAcceptedIndemnity}
                    onCheckedChange={(v) => set('hasAcceptedIndemnity', Boolean(v))}
                  />
                  <span className="text-slate-800">
                    I confirm that I have read, understood and agree to the indemnity and conditions above.
                  </span>
                </label>
                {errors.hasAcceptedIndemnity ? (
                  <p className="text-sm text-rose-600">{errors.hasAcceptedIndemnity}</p>
                ) : null}

                <div className="space-y-1.5">
                  <Label htmlFor="signatureName">Type your full name to sign</Label>
                  <Input
                    id="signatureName"
                    placeholder="Your full legal name"
                    value={values.signatureName}
                    onChange={(e) => set('signatureName', e.target.value)}
                  />
                  {errors.signatureName ? (
                    <p className="text-sm text-rose-600">{errors.signatureName}</p>
                  ) : null}
                </div>
              </CardContent>
            </Card>
          ) : null}

          {submitError ? (
            <div className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
              {submitError}
            </div>
          ) : null}

          <div className="flex justify-end">
            <Button type="submit" size="lg" disabled={submitting}>
              {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {canSwim === 'no' ? 'Submit and remove me' : 'Submit indemnity'}
            </Button>
          </div>
        </form>
      </div>

      {/* Confirming the irreversible path */}
      <Dialog open={confirmSwimOpen} onOpenChange={setConfirmSwimOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove you from this booking?</DialogTitle>
            <DialogDescription>
              You have said you cannot swim. For your safety we cannot take you onto the water. Continuing removes you
              from booking {context.bookingReference} and refunds your portion. This cannot be undone from this page.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmSwimOpen(false)} disabled={submitting}>
              Go back
            </Button>
            <Button variant="destructive" onClick={() => void doSubmit()} disabled={submitting}>
              {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Yes, remove me
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Shell>
  )
}
