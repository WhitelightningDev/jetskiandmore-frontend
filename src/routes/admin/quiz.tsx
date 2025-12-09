import * as React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Copy, Link2, Sparkles } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useAdminContext } from '@/admin/context'
import { SITE_ORIGIN } from '@/lib/site'

export const Route = createFileRoute('/admin/quiz')({
  component: AdminQuizPage,
})

function AdminQuizPage() {
  const { quizSubs, loadingMeta } = useAdminContext()
  const [inviteName, setInviteName] = React.useState('')
  const [inviteEmail, setInviteEmail] = React.useState('')
  const [quizLink, setQuizLink] = React.useState<string | null>(null)
  const [copied, setCopied] = React.useState(false)

  const shareBase = SITE_ORIGIN

  function generateLink() {
    const params = new URLSearchParams({
      utm_source: 'admin',
      utm_medium: 'portal',
      utm_campaign: 'safety-quiz',
      intent: 'complete-safety-quiz',
    })
    if (inviteName.trim()) params.set('prefill_name', inviteName.trim())
    if (inviteEmail.trim()) params.set('prefill_email', inviteEmail.trim())
    const url = `${shareBase}/interim-skipper-quiz?${params.toString()}`
    setQuizLink(url)
    setCopied(false)
  }

  async function copyLink() {
    if (!quizLink) return
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(quizLink)
      } else {
        throw new Error('Clipboard unavailable')
      }
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      window.prompt('Copy this quiz link', quizLink)
    }
  }

  return (
    <div className="space-y-4">
      <header className="space-y-1">
        <p className="text-[11px] uppercase tracking-[0.22em] text-cyan-200/80">Safety & quiz</p>
        <h1 className="text-xl font-semibold text-white">Interim Skipper Quiz submissions</h1>
        <p className="text-sm text-slate-300">Recent quiz + indemnity responses</p>
      </header>

      <Card className="border-cyan-400/30 bg-slate-900/80 text-white shadow-lg shadow-cyan-500/15">
        <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-base">Share the safety quiz</CardTitle>
            <CardDescription className="text-slate-300">
              Generate a tracked link you can send to guests to complete the briefing and quiz.
            </CardDescription>
          </div>
          <Badge variant="secondary" className="border-cyan-400/40 bg-cyan-500/10 text-cyan-100">
            <Sparkles className="h-3.5 w-3.5" />
            SEO preview ready
          </Badge>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-[1.15fr,0.85fr]">
            <div className="space-y-3 rounded-xl border border-white/10 bg-slate-900/70 p-4 shadow-inner shadow-cyan-500/10">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1">
                  <Label htmlFor="quiz-invite-name" className="text-xs uppercase tracking-wide text-slate-300">
                    Guest name (optional)
                  </Label>
                  <Input
                    id="quiz-invite-name"
                    value={inviteName}
                    onChange={(e) => setInviteName(e.target.value)}
                    placeholder="e.g. Sam Boatman"
                    className="bg-slate-950/80 text-white"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="quiz-invite-email" className="text-xs uppercase tracking-wide text-slate-300">
                    Guest email (optional)
                  </Label>
                  <Input
                    id="quiz-invite-email"
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="name@email.com"
                    className="bg-slate-950/80 text-white"
                  />
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Button onClick={generateLink} className="bg-cyan-500 text-slate-950 hover:bg-cyan-400">
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate quiz link
                </Button>
                {quizLink ? (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={copyLink}
                    className="gap-2 border-cyan-500/50 bg-cyan-500/10 text-cyan-100 hover:bg-cyan-500/20"
                  >
                    <Copy className="h-4 w-4" />
                    {copied ? 'Copied' : 'Copy link'}
                  </Button>
                ) : null}
                <p className="text-xs text-slate-400">
                  Link pre-fills guest details and tags traffic for reporting.
                </p>
              </div>
            </div>
            <div className="rounded-xl border border-white/10 bg-gradient-to-br from-slate-900/80 via-slate-900/60 to-cyan-900/50 p-4 shadow-lg shadow-cyan-500/15">
              <div className="flex items-center gap-2 text-cyan-100">
                <Sparkles className="h-4 w-4" />
                <p className="text-xs font-semibold uppercase tracking-[0.2em]">Link preview</p>
              </div>
              <div className="mt-3 space-y-2">
                <p className="text-sm font-semibold text-white">Safety quiz & indemnity</p>
                <p className="text-sm text-slate-200">
                  Guests land on a page that explains the tutorial, indemnity, and quiz so they know exactly
                  what they are completing.
                </p>
                <div className="rounded-lg border border-white/10 bg-black/30 p-3 text-xs text-slate-300">
                  <div className="flex items-center gap-2 text-cyan-100">
                    <Link2 className="h-4 w-4" />
                    <span className="truncate">{quizLink || `${shareBase}/interim-skipper-quiz`}</span>
                  </div>
                  <p className="mt-2 text-[13px] text-slate-400">
                    {quizLink
                      ? 'Rich preview + UTM tags help guests and analytics know this is the safety quiz link.'
                      : 'Generate a link to see the exact URL you can share with guests.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-white/10 bg-slate-900/80 text-white shadow-lg shadow-cyan-500/10">
        <CardHeader>
          <CardTitle className="text-base">Submissions</CardTitle>
          <CardDescription className="text-slate-300">
            Compliance signals from recent guests.
          </CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto px-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-6">Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>ID number</TableHead>
                <TableHead>Passenger</TableHead>
                <TableHead>Checks</TableHead>
                <TableHead className="pr-6">Submitted</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {quizSubs.map((q) => (
                <TableRow key={q.id}>
                  <TableCell className="pl-6 font-medium">
                    {q.name} {q.surname}
                  </TableCell>
                  <TableCell>{q.email}</TableCell>
                  <TableCell>{q.idNumber}</TableCell>
                  <TableCell className="text-sm">
                    {(() => {
                      const passengers =
                        q.passengers && q.passengers.length > 0
                          ? q.passengers
                          : q.passengerName || q.passengerSurname || q.passengerEmail || q.passengerIdNumber
                              ? [
                                  {
                                    name: q.passengerName,
                                    surname: q.passengerSurname,
                                    email: q.passengerEmail,
                                    idNumber: q.passengerIdNumber,
                                  },
                                ]
                              : []
                      if (passengers.length === 0) return <span className="text-slate-500">—</span>
                      return (
                        <div className="space-y-2">
                          {passengers.map((p, idx) => (
                            <div key={idx} className="rounded border border-white/10 bg-white/5 p-2">
                              <div>{[p?.name, p?.surname].filter(Boolean).join(' ').trim() || '—'}</div>
                              {p?.email ? <div className="text-slate-400">{p.email}</div> : null}
                              {p?.idNumber ? <div className="text-slate-400">ID: {p.idNumber}</div> : null}
                            </div>
                          ))}
                        </div>
                      )
                    })()}
                  </TableCell>
                  <TableCell className="text-xs">
                    <div className={q.hasWatchedTutorial ? 'text-emerald-400' : 'text-rose-400'}>
                      Tutorial: {q.hasWatchedTutorial ? 'Yes' : 'No'}
                    </div>
                    <div className={q.hasAcceptedIndemnity ? 'text-emerald-400' : 'text-rose-400'}>
                      Indemnity: {q.hasAcceptedIndemnity ? 'Yes' : 'No'}
                    </div>
                  </TableCell>
                  <TableCell className="pr-6 text-sm text-slate-400">
                    {q.createdAt ? new Date(q.createdAt).toLocaleString() : '—'}
                  </TableCell>
                </TableRow>
              ))}
              {quizSubs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-6 text-center text-sm text-slate-400">
                    {loadingMeta ? 'Loading submissions…' : 'No submissions yet.'}
                  </TableCell>
                </TableRow>
              ) : null}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
