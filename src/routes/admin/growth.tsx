import * as React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { ChevronLeft, ChevronRight, Pencil, Plus, RotateCcw, Search, Trash2 } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { toast } from '@/components/ui/use-toast'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/admin/growth')({
  component: AdminGrowthBoardPage,
})

type TaskStatus = 'backlog' | 'planned' | 'in_progress' | 'blocked' | 'done'
type TaskPriority = 'low' | 'medium' | 'high' | 'urgent'
type TaskSeason = 'winter' | 'spring' | 'summer' | 'any'
type TaskCategory = 'Digital' | 'Harbour' | 'Brand' | 'Partnerships' | 'Compliance' | 'Operations'

type GrowthTask = {
  id: string
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  season: TaskSeason
  category: TaskCategory
  tags: string[]
  dueDate?: string
  createdAt: string
  updatedAt: string
}

const STORAGE_KEY = 'jsm_growth_board_v1'

const STATUSES: Array<{ id: TaskStatus; label: string; hint: string }> = [
  { id: 'backlog', label: 'Backlog', hint: 'Ideas and research' },
  { id: 'planned', label: 'Planned', hint: 'Next up' },
  { id: 'in_progress', label: 'In progress', hint: 'Being executed' },
  { id: 'blocked', label: 'Blocked', hint: 'Waiting on something' },
  { id: 'done', label: 'Done', hint: 'Shipped' },
]

const CATEGORIES: TaskCategory[] = ['Digital', 'Harbour', 'Brand', 'Partnerships', 'Compliance', 'Operations']
const SEASONS: TaskSeason[] = ['winter', 'spring', 'summer', 'any']
const PRIORITIES: TaskPriority[] = ['urgent', 'high', 'medium', 'low']

function nowIso() {
  return new Date().toISOString()
}

function uuid() {
  try {
    return globalThis.crypto?.randomUUID?.() ?? `t_${Math.random().toString(16).slice(2)}_${Date.now()}`
  } catch {
    return `t_${Math.random().toString(16).slice(2)}_${Date.now()}`
  }
}

function loadStoredTasks(): GrowthTask[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return []
    return parsed.filter(Boolean) as GrowthTask[]
  } catch {
    return []
  }
}

function storeTasks(tasks: GrowthTask[]) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
  } catch {
    // ignore storage failures
  }
}

function seedTasks(): GrowthTask[] {
  const createdAt = nowIso()
  const mk = (t: Omit<GrowthTask, 'id' | 'createdAt' | 'updatedAt'>): GrowthTask => ({
    ...t,
    id: uuid(),
    createdAt,
    updatedAt: createdAt,
  })

  return [
    mk({
      title: 'End-of-season relationship: thank-you + service recovery email',
      description:
        'Goal:\nSend a factual thank-you + service recovery message to protect reputation and keep your list warm through winter.\n\nWhy it matters:\nCustomers, partners, and authorities compare operators. This positions Jet Ski & More as professional, safety-led, and accountable.\n\nSteps:\n1) Segment audience: completed rides vs cancelled/rescheduled.\n2) Write 2 variations (same tone, different apology line).\n3) Use 1 CTA (early access / stay in touch).\n\nDeliverables:\n- Campaign v1 (completed riders)\n- Campaign v2 (cancelled/rescheduled riders)\n- Follow-up (7 days later): review request + media consent\n\nKPIs:\n- Low complaints/unsubscribes\n- Replies + early-access signups\n- Review volume increase',
      status: 'planned',
      priority: 'high',
      season: 'winter',
      category: 'Digital',
      tags: ['email', 'service-recovery'],
    }),
    mk({
      title: 'Winter ramp: early-access list + voucher enquiries',
      description:
        'Goal:\nKeep marketing active in winter with a single conversion action that makes sense when bookings are closed.\n\nWhat to build:\n- Early-access signup (email + optional phone)\n- Voucher enquiry (date, recipient, message)\n- Partner enquiry (hotels/tour desks/corporate)\n\nDeliverables:\n- Landing CTA: “Join early access”\n- Admin view/export list + tags (lead / past rider / partner)\n- Auto-reply email: confirmation + expectations\n\nKPIs:\n- New contacts/week\n- Voucher enquiries/month\n- Partner leads/month',
      status: 'in_progress',
      priority: 'urgent',
      season: 'winter',
      category: 'Digital',
      tags: ['list-building', 'winter-ramp'],
    }),
    mk({
      title: 'Partner planning: tourism desks + hotels partner pack',
      description:
        'Goal:\nGet listed and recommended while the season is closed, so summer opens with distribution already in place.\n\nPack contents:\n- 1-page brochure (what you offer + durations + location)\n- Safety & compliance credibility section\n- Booking process (QR + contact)\n- Commission/referral process (optional)\n\nDeliverables:\n- PDF partner pack (print + email versions)\n- 1 partner blurb paragraph for listings\n- Short FAQ (age rules, swim competency, weather rules)\n\nKPIs:\n- Partners onboarded\n- Referrals at season opening',
      status: 'planned',
      priority: 'high',
      season: 'winter',
      category: 'Partnerships',
      tags: ['partners', 'offline-to-online'],
    }),
    mk({
      title: 'Credibility assets: Safety & Compliance positioning everywhere',
      description:
        'Goal:\nLook like the most credible operator in the harbour (not an informal operator).\n\nWhat to publish:\n- Safety & Compliance page (briefing, onboarding, swim competency, operator requirements, equipment, weather rules)\n- Short version for brochures/partners\n- Internal SOP summary for staff consistency\n\nDeliverables:\n- Public page + link from footer/header\n- Partner pack snippet\n- Standard line: “Operating procedures designed around commercial safety requirements”\n\nKPIs:\n- Partner trust\n- Higher conversion vs competitors\n- Fewer pre-ride questions',
      status: 'planned',
      priority: 'high',
      season: 'any',
      category: 'Compliance',
      tags: ['credibility', 'seo'],
    }),
    mk({
      title: 'Google Business Profile refresh (winter visibility)',
      description:
        'Goal:\nOwn local discovery in Gordon’s Bay even in winter.\n\nActions:\n- Upload new winter assets (harbour + gear + fleet)\n- Post cadence: 2/week (winter updates, safety-led operations, improvements)\n- Update Q&A: age rules, swim competency, safety equipment, weather go/no-go\n\nDeliverables:\n- 20 new photos\n- 8 posts/month\n- Updated services + categories\n\nKPIs:\n- Calls/website clicks\n- Direction requests\n- Review velocity',
      status: 'backlog',
      priority: 'medium',
      season: 'winter',
      category: 'Digital',
      tags: ['google', 'local-seo'],
    }),
    mk({
      title: 'Harbour presence: branded A-frame + QR code to “Join early access”',
      description:
        'Goal:\nConvert foot traffic into early-access signups and partner leads during winter.\n\nDesign notes:\n- Simple message: “Jet Ski & More — guided rides (seasonal)”\n- Credibility line: “Safety-led procedures”\n- QR → early access / contact\n\nDeliverables:\n- A-frame artwork (print-ready)\n- QR landing page\n- Placement plan (high visibility spots)\n\nKPIs:\n- QR scans/week\n- Email signups/week',
      status: 'planned',
      priority: 'high',
      season: 'winter',
      category: 'Harbour',
      tags: ['qr', 'walk-ins'],
    }),
    mk({
      title: 'Jet skis: visual refresh (decals, numbering, consistent look)',
      description:
        'Goal:\nMake the fleet instantly recognisable and “premium” in the harbour and on camera.\n\nActions:\n- Standardise decals + numbering\n- Refresh faded parts\n- Implement a “photo-ready clean” checklist\n\nDeliverables:\n- Decal design + print order\n- Numbering scheme\n- Cleaning/maintenance checklist\n\nKPIs:\n- Better ad performance\n- Better partner confidence',
      status: 'backlog',
      priority: 'medium',
      season: 'winter',
      category: 'Brand',
      tags: ['fleet', 'photography'],
    }),
    mk({
      title: 'Apparel: staff winter layer (jackets/beanies) + branded PFD details',
      description:
        'Goal:\nCorporate, consistent look at the harbour (improves trust + content quality).\n\nActions:\n- Choose brand colour system (purple/black/white)\n- Staff kit: jacket + beanie + optional rash-vest for summer\n- PFD branding only if it does not affect safety/compliance\n\nDeliverables:\n- Jacket option (supplier + price)\n- Beanie option\n- Simple uniform guide (what staff wear when)\n\nKPIs:\n- Better photos\n- Higher “professional operator” perception',
      status: 'backlog',
      priority: 'medium',
      season: 'winter',
      category: 'Brand',
      tags: ['uniform', 'harbour'],
    }),
    mk({
      title: 'UGC pipeline: reviews + photo/video consent',
      description:
        'Goal:\nBuild a reusable library of social proof to fuel spring/summer marketing.\n\nProcess:\n- Review request + Google link\n- Consent wording for marketing use\n- Asset organisation by month + ride type\n\nDeliverables:\n- Review email template\n- Consent snippet\n- “Approved assets” folder structure\n\nKPIs:\n- Reviews/month\n- Reusable clips/month',
      status: 'planned',
      priority: 'high',
      season: 'winter',
      category: 'Digital',
      tags: ['ugc', 'reviews'],
    }),
    mk({
      title: 'Spring ramp: opening-weekend early access campaign',
      description:
        'Goal:\nConvert the winter list into bookings as spring approaches.\n\nActions:\n- “Early access” email to the list first\n- Weekend scarcity messaging (limited slots)\n- Booking-ready FAQ (swim competency, age rules, arrival time, weather)\n\nDeliverables:\n- 2-email sequence\n- Booking page checklist\n\nKPIs:\n- Bookings from list\n- Reply rate for group enquiries',
      status: 'backlog',
      priority: 'high',
      season: 'spring',
      category: 'Digital',
      tags: ['email', 'spring'],
    }),
    mk({
      title: 'Summer peak: holiday urgency + group packages',
      description:
        'Goal:\nMaximise revenue during peak demand without damaging premium positioning.\n\nBuild:\n- Holiday urgency email (availability)\n- Group packages (birthday/corporate)\n- Referral offer (bring-a-friend)\n\nDeliverables:\n- 3 campaign templates\n- 1 group booking one-pager\n\nKPIs:\n- Group booking count\n- Peak-week revenue',
      status: 'backlog',
      priority: 'high',
      season: 'summer',
      category: 'Digital',
      tags: ['summer', 'packages'],
    }),
    mk({
      title: 'Harbour photoshoot day (brand + compliance)',
      description:
        'Goal:\nCreate a content library that screams “commercial-grade operator”.\n\nShot list:\n- Fleet hero shots + decals\n- Briefing/onboarding in action\n- Safety gear close-ups\n- Harbour presence (A-frame, staff uniform)\n\nDeliverables:\n- 30 photos\n- 10 short clips (reels)\n- 1 hero image for Safety & Compliance page\n\nKPIs:\n- Higher ad CTR\n- Better partner conversion',
      status: 'backlog',
      priority: 'medium',
      season: 'winter',
      category: 'Operations',
      tags: ['content', 'photoshoot'],
    }),
  ]
}

function AdminGrowthBoardPage() {
  const [tasks, setTasks] = React.useState<GrowthTask[]>(() => {
    const stored = loadStoredTasks()
    return stored.length ? stored : seedTasks()
  })
  const [query, setQuery] = React.useState('')
  const [seasonFilter, setSeasonFilter] = React.useState<TaskSeason | 'all'>('all')
  const [categoryFilter, setCategoryFilter] = React.useState<TaskCategory | 'all'>('all')
  const [hideDone, setHideDone] = React.useState(true)

  const [editorOpen, setEditorOpen] = React.useState(false)
  const [editing, setEditing] = React.useState<GrowthTask | null>(null)

  React.useEffect(() => {
    storeTasks(tasks)
  }, [tasks])

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase()
    return tasks.filter((t) => {
      if (hideDone && t.status === 'done') return false
      if (seasonFilter !== 'all' && t.season !== seasonFilter) return false
      if (categoryFilter !== 'all' && t.category !== categoryFilter) return false
      if (!q) return true
      return (
        t.title.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.tags.some((tag) => tag.toLowerCase().includes(q))
      )
    })
  }, [categoryFilter, hideDone, query, seasonFilter, tasks])

  const byStatus = React.useMemo(() => {
    const map: Record<TaskStatus, GrowthTask[]> = {
      backlog: [],
      planned: [],
      in_progress: [],
      blocked: [],
      done: [],
    }
    for (const t of filtered) map[t.status].push(t)
    for (const key of Object.keys(map) as TaskStatus[]) {
      map[key].sort((a, b) => scorePriority(b.priority) - scorePriority(a.priority))
    }
    return map
  }, [filtered])

  function resetToSample() {
    const next = seedTasks()
    setTasks(next)
    toast({ title: 'Reset board', description: 'Loaded the sample growth plan tasks.' })
  }

  function openCreate() {
    const createdAt = nowIso()
    setEditing({
      id: uuid(),
      title: '',
      description: '',
      status: 'backlog',
      priority: 'medium',
      season: 'any',
      category: 'Digital',
      tags: [],
      createdAt,
      updatedAt: createdAt,
    })
    setEditorOpen(true)
  }

  function openEdit(t: GrowthTask) {
    setEditing(t)
    setEditorOpen(true)
  }

  function upsertTask(next: GrowthTask) {
    if (!next.title.trim()) {
      toast({ title: 'Title required', description: 'Add a short title for this task.', variant: 'destructive' })
      return
    }
    setTasks((prev) => {
      const exists = prev.some((t) => t.id === next.id)
      const stamped = { ...next, updatedAt: nowIso() }
      return exists ? prev.map((t) => (t.id === next.id ? stamped : t)) : [stamped, ...prev]
    })
    setEditorOpen(false)
    setEditing(null)
    toast({ title: 'Saved', description: 'Growth board task updated.' })
  }

  function deleteTask(id: string) {
    setTasks((prev) => prev.filter((t) => t.id !== id))
    toast({ title: 'Deleted', description: 'Task removed from the board.' })
  }

  function moveTask(id: string, direction: -1 | 1) {
    const order = STATUSES.map((s) => s.id)
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t
        const idx = order.indexOf(t.status)
        const nextStatus = order[Math.max(0, Math.min(order.length - 1, idx + direction))] as TaskStatus
        return nextStatus === t.status ? t : { ...t, status: nextStatus, updatedAt: nowIso() }
      }),
    )
  }

  const totalShown = filtered.length
  const totalAll = tasks.length

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Growth board</h1>
            <p className="text-sm text-slate-600">
              Jira-style pipeline for winter visibility → spring ramp → summer peak, across digital + harbour presence.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" size="sm" onClick={resetToSample}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset sample
            </Button>
            <Button size="sm" onClick={openCreate}>
              <Plus className="mr-2 h-4 w-4" />
              Add task
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 items-center gap-2">
            <Search className="h-4 w-4 text-slate-500" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search tasks, tags, or keywords…"
              className="h-9 border-slate-200 bg-white"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Select value={seasonFilter} onValueChange={(v) => setSeasonFilter(v as any)}>
              <SelectTrigger className="h-9 w-[150px] border-slate-200 bg-white">
                <SelectValue placeholder="Season" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All seasons</SelectItem>
                {SEASONS.map((s) => (
                  <SelectItem key={s} value={s}>
                    {labelSeason(s)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={categoryFilter} onValueChange={(v) => setCategoryFilter(v as any)}>
              <SelectTrigger className="h-9 w-[170px] border-slate-200 bg-white">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                {CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              size="sm"
              variant={hideDone ? 'outline' : 'secondary'}
              onClick={() => setHideDone((v) => !v)}
              className={cn('h-9', hideDone ? 'border-slate-200 bg-white' : '')}
            >
              {hideDone ? 'Hide done' : 'Show done'}
            </Button>

            <Badge variant="outline" className="border-slate-200 bg-white text-slate-600">
              Showing {totalShown}/{totalAll}
            </Badge>
          </div>
        </div>
      </header>

      <div className="flex gap-4 overflow-x-auto pb-2">
        {STATUSES.map((col) => {
          const items = byStatus[col.id]
          return (
            <div key={col.id} className="w-[340px] shrink-0">
              <Card className="border-slate-200 bg-white shadow-sm">
                <CardHeader className="space-y-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base text-slate-900">{col.label}</CardTitle>
                    <Badge variant="outline" className="border-slate-200 bg-white text-slate-600">
                      {items.length}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-600">{col.hint}</p>
                </CardHeader>
                <Separator />
                <CardContent className="space-y-3 p-4">
                  {items.length === 0 ? (
                    <div className="rounded-lg border border-dashed border-slate-200 p-4 text-xs text-slate-500">
                      No tasks here yet.
                    </div>
                  ) : null}
                  {items.map((t) => (
                    <TaskCard
                      key={t.id}
                      task={t}
                      onEdit={() => openEdit(t)}
                      onDelete={() => deleteTask(t.id)}
                      onMoveLeft={() => moveTask(t.id, -1)}
                      onMoveRight={() => moveTask(t.id, 1)}
                    />
                  ))}
                </CardContent>
              </Card>
            </div>
          )
        })}
      </div>

      <Dialog open={editorOpen} onOpenChange={(open) => (open ? setEditorOpen(true) : (setEditorOpen(false), setEditing(null)))}>
        <DialogTrigger asChild>
          <span className="hidden" />
        </DialogTrigger>
        <DialogContent className="sm:max-w-xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{tasks.some((t) => t.id === editing?.id) ? 'Edit task' : 'Create task'}</DialogTitle>
          </DialogHeader>
          {editing ? (
            <TaskEditor
              task={editing}
              onCancel={() => {
                setEditorOpen(false)
                setEditing(null)
              }}
              onSave={upsertTask}
              onChange={setEditing}
            />
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  )
}

function TaskCard({
  task,
  onEdit,
  onDelete,
  onMoveLeft,
  onMoveRight,
}: {
  task: GrowthTask
  onEdit: () => void
  onDelete: () => void
  onMoveLeft: () => void
  onMoveRight: () => void
}) {
  return (
    <Card className="overflow-hidden border-slate-200 bg-white shadow-sm">
      <CardHeader className="space-y-2 p-4 pb-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 space-y-1">
            <p className="truncate text-sm font-semibold text-slate-900">{task.title}</p>
            <div className="flex flex-wrap gap-1.5">
              <Badge className={cn('max-w-full min-w-0 shrink truncate rounded-full border', categoryClass(task.category))} variant="outline">
                <span className="min-w-0 truncate">{task.category}</span>
              </Badge>
              <Badge className={cn('max-w-full min-w-0 shrink truncate rounded-full border', seasonClass(task.season))} variant="outline">
                <span className="min-w-0 truncate">{labelSeason(task.season)}</span>
              </Badge>
              <Badge className={cn('max-w-full min-w-0 shrink truncate rounded-full border', priorityClass(task.priority))} variant="outline">
                <span className="min-w-0 truncate">{labelPriority(task.priority)}</span>
              </Badge>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onMoveLeft} aria-label="Move left">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onMoveRight} aria-label="Move right">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 p-4 pt-3">
        <p className="line-clamp-3 max-w-full break-words whitespace-pre-line text-xs text-slate-600 [overflow-wrap:anywhere]">
          {task.description}
        </p>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap gap-1.5">
            {task.tags.slice(0, 3).map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="max-w-full min-w-0 shrink truncate rounded-full bg-slate-100 text-slate-700"
              >
                <span className="min-w-0 truncate">{tag}</span>
              </Badge>
            ))}
            {task.tags.length > 3 ? (
              <Badge variant="secondary" className="rounded-full bg-slate-100 text-slate-700">
                +{task.tags.length - 3}
              </Badge>
            ) : null}
          </div>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="sm" className="h-8 border-slate-200 bg-white" onClick={onEdit}>
              <Pencil className="mr-2 h-3.5 w-3.5" />
              Edit
            </Button>
            <Button variant="outline" size="sm" className="h-8 border-slate-200 bg-white" onClick={onDelete}>
              <Trash2 className="mr-2 h-3.5 w-3.5" />
              Delete
            </Button>
          </div>
        </div>
        {task.dueDate ? (
          <p className="text-xs text-slate-500">
            Due: <span className="font-medium text-slate-700">{task.dueDate}</span>
          </p>
        ) : null}
      </CardContent>
    </Card>
  )
}

function TaskEditor({
  task,
  onChange,
  onSave,
  onCancel,
}: {
  task: GrowthTask
  onChange: (t: GrowthTask) => void
  onSave: (t: GrowthTask) => void
  onCancel: () => void
}) {
  const [tagDraft, setTagDraft] = React.useState('')

  const tags = task.tags ?? []

  function addTag() {
    const next = tagDraft.trim()
    if (!next) return
    const normalized = next.toLowerCase()
    if (tags.some((t) => t.toLowerCase() === normalized)) {
      setTagDraft('')
      return
    }
    onChange({ ...task, tags: [...tags, next] })
    setTagDraft('')
  }

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={task.title}
            onChange={(e) => onChange({ ...task, title: e.target.value })}
            placeholder="Short and specific…"
          />
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="desc">Description</Label>
          <Textarea
            id="desc"
            value={task.description}
            onChange={(e) => onChange({ ...task, description: e.target.value })}
            placeholder="What’s the goal, and what deliverables make it “done”?"
            className="min-h-[140px]"
          />
        </div>

        <div className="space-y-2">
          <Label>Status</Label>
          <Select value={task.status} onValueChange={(v) => onChange({ ...task, status: v as TaskStatus })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUSES.map((s) => (
                <SelectItem key={s.id} value={s.id}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Priority</Label>
          <Select value={task.priority} onValueChange={(v) => onChange({ ...task, priority: v as TaskPriority })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PRIORITIES.map((p) => (
                <SelectItem key={p} value={p}>
                  {labelPriority(p)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Season</Label>
          <Select value={task.season} onValueChange={(v) => onChange({ ...task, season: v as TaskSeason })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SEASONS.map((s) => (
                <SelectItem key={s} value={s}>
                  {labelSeason(s)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Category</Label>
          <Select value={task.category} onValueChange={(v) => onChange({ ...task, category: v as TaskCategory })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="due">Due date (optional)</Label>
          <Input
            id="due"
            type="date"
            value={task.dueDate ?? ''}
            onChange={(e) => onChange({ ...task, dueDate: e.target.value || undefined })}
          />
        </div>
      </div>

      <Separator />

      <div className="space-y-2">
        <Label>Tags</Label>
        <div className="flex flex-wrap gap-2">
          {tags.length ? (
            tags.map((t) => (
              <Button
                key={t}
                type="button"
                variant="secondary"
                className="h-8 max-w-full rounded-full bg-slate-100 px-3 text-xs text-slate-700 hover:bg-slate-200"
                onClick={() => onChange({ ...task, tags: tags.filter((x) => x !== t) })}
              >
                <span className="max-w-[240px] truncate">{t}</span> <span className="ml-2 shrink-0 text-slate-500">×</span>
              </Button>
            ))
          ) : (
            <p className="text-xs text-slate-500">Add tags like “email”, “partners”, “fleet”, “photoshoot”.</p>
          )}
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Input
            value={tagDraft}
            onChange={(e) => setTagDraft(e.target.value)}
            placeholder="Add tag…"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                addTag()
              }
            }}
          />
          <Button type="button" variant="outline" className="border-slate-200 bg-white" onClick={addTag}>
            Add tag
          </Button>
        </div>
      </div>

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button type="button" variant="outline" className="border-slate-200 bg-white" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="button" onClick={() => onSave(task)}>
          Save task
        </Button>
      </div>
    </div>
  )
}

function scorePriority(p: TaskPriority) {
  switch (p) {
    case 'urgent':
      return 4
    case 'high':
      return 3
    case 'medium':
      return 2
    case 'low':
      return 1
    default:
      return 0
  }
}

function labelSeason(s: TaskSeason) {
  switch (s) {
    case 'winter':
      return 'Winter'
    case 'spring':
      return 'Spring'
    case 'summer':
      return 'Summer'
    default:
      return 'Any'
  }
}

function labelPriority(p: TaskPriority) {
  switch (p) {
    case 'urgent':
      return 'Urgent'
    case 'high':
      return 'High'
    case 'medium':
      return 'Medium'
    default:
      return 'Low'
  }
}

function priorityClass(p: TaskPriority) {
  switch (p) {
    case 'urgent':
      return 'border-rose-200 bg-rose-50 text-rose-700'
    case 'high':
      return 'border-amber-200 bg-amber-50 text-amber-700'
    case 'medium':
      return 'border-slate-200 bg-white text-slate-700'
    default:
      return 'border-emerald-200 bg-emerald-50 text-emerald-700'
  }
}

function seasonClass(s: TaskSeason) {
  switch (s) {
    case 'winter':
      return 'border-sky-200 bg-sky-50 text-sky-700'
    case 'spring':
      return 'border-emerald-200 bg-emerald-50 text-emerald-700'
    case 'summer':
      return 'border-orange-200 bg-orange-50 text-orange-700'
    default:
      return 'border-slate-200 bg-white text-slate-700'
  }
}

function categoryClass(c: TaskCategory) {
  switch (c) {
    case 'Digital':
      return 'border-violet-200 bg-violet-50 text-violet-700'
    case 'Harbour':
      return 'border-cyan-200 bg-cyan-50 text-cyan-700'
    case 'Brand':
      return 'border-fuchsia-200 bg-fuchsia-50 text-fuchsia-700'
    case 'Partnerships':
      return 'border-indigo-200 bg-indigo-50 text-indigo-700'
    case 'Compliance':
      return 'border-slate-200 bg-slate-50 text-slate-700'
    case 'Operations':
      return 'border-amber-200 bg-amber-50 text-amber-700'
    default:
      return 'border-slate-200 bg-white text-slate-700'
  }
}
