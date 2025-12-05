import { Link, useRouterState } from '@tanstack/react-router'
import { ChevronRight, Home as HomeIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import Reveal from '@/components/Reveal'

type Crumb = {
  href: string
  label: string
}

const LABEL_MAP: Record<string, string> = {
  '': 'Home',
  home: 'Home',
  bookings: 'Bookings',
  'bookings/': 'Bookings',
  weather: 'Weather',
  'calm-slots': 'Calm Slots',
  rides: 'Rides',
  'add-ons': 'Add-ons',
  'boat-ride': 'Boat ride',
  locations: 'Locations',
  safety: 'Safety',
  contact: 'Contact',
}

function buildCrumbs(pathname: string): Crumb[] {
  // Normalize leading/trailing slashes and split
  const parts = pathname.replace(/(^\/+|\/+?$)/g, '').split('/')
  if (parts.length === 1 && (parts[0] === '' || parts[0] === 'home')) {
    return [{ href: '/home', label: 'Home' }]
  }

  const crumbs: Crumb[] = []
  let accum = ''
  for (let i = 0; i < parts.length; i++) {
    const seg = parts[i]
    accum += `/${seg}`
    // Map labels; handle uppercase routes like "/Bookings"
    const key = seg.toLowerCase()
    const label = LABEL_MAP[key] ?? seg.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
    crumbs.push({ href: accum || '/', label })
  }

  // Ensure first crumb is Home
  if (crumbs.length && crumbs[0].label !== 'Home') {
    crumbs.unshift({ href: '/home', label: 'Home' })
  }

  return crumbs
}

export default function Breadcrumbs({ className }: { className?: string }) {
  const state = useRouterState()
  const pathname = state.location.pathname || '/home'
  const crumbs = buildCrumbs(pathname)

  // Hide breadcrumbs on the Home page (and during root redirect)
  const isHome = pathname === '/home' || pathname === '/home/' || pathname === '/'
  if (isHome) return null

  return (
    <Reveal offset={2} duration={500}>
      <nav aria-label="Breadcrumb" className={cn('w-full bg-background/80 backdrop-blur', className)}>
        <ol className="mx-auto max-w-6xl px-4 py-2 flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
          {crumbs.map((c, idx) => {
            const isLast = idx === crumbs.length - 1
            return (
              <li key={c.href} className="inline-flex items-center gap-1">
                {idx === 0 ? (
                  <Link to={c.href} className="inline-flex items-center gap-1 hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm px-1">
                    <HomeIcon className="h-4 w-4" aria-hidden />
                    <span className="sr-only">Home</span>
                  </Link>
                ) : (
                  <>
                    <ChevronRight className="h-4 w-4 opacity-60" aria-hidden />
                    {isLast ? (
                      <span aria-current="page" className="px-1 text-foreground">
                        {c.label}
                      </span>
                    ) : (
                      <Link to={c.href} className="px-1 hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm">
                        {c.label}
                      </Link>
                    )}
                  </>
                )}
              </li>
            )
          })}
        </ol>
      </nav>
    </Reveal>
  )
}
