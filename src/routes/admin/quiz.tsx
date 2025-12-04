import { createFileRoute } from '@tanstack/react-router'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useAdminContext } from '@/admin/context'

export const Route = createFileRoute('/admin/quiz')({
  component: AdminQuizPage,
})

function AdminQuizPage() {
  const { quizSubs, loadingMeta } = useAdminContext()

  return (
    <div className="space-y-4">
      <header className="space-y-1">
        <p className="text-[11px] uppercase tracking-[0.22em] text-cyan-200/80">Safety & quiz</p>
        <h1 className="text-xl font-semibold text-white">Interim Skipper Quiz submissions</h1>
        <p className="text-sm text-slate-300">Recent quiz + indemnity responses</p>
      </header>

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
                    {q.passengerName || q.passengerSurname || q.passengerEmail ? (
                      <div className="space-y-1">
                        <div>
                          {q.passengerName} {q.passengerSurname}
                        </div>
                        {q.passengerEmail ? (
                          <div className="text-slate-400">{q.passengerEmail}</div>
                        ) : null}
                        {q.passengerIdNumber ? (
                          <div className="text-slate-400">ID: {q.passengerIdNumber}</div>
                        ) : null}
                      </div>
                    ) : (
                      <span className="text-slate-500">—</span>
                    )}
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
