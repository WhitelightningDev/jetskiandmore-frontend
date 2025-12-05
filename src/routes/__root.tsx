import { useEffect, useRef } from 'react'
import { Outlet, createRootRoute, useRouterState } from '@tanstack/react-router'

import Header from '../components/Header'
import ContactFab from '../components/ContactFab'
import Breadcrumbs from '../components/Breadcrumbs'
import Footer from '../components/Footer'
import { API_BASE } from '@/lib/api'

export const Route = createRootRoute({
  component: RootLayout,
})

function RootLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const isAdmin = pathname.startsWith('/admin')
  useTrackPageView(pathname, isAdmin)

  if (isAdmin) {
    return <Outlet />
  }

  return (
    <>
      <Header />
      <Breadcrumbs />
      <Outlet />
      <ContactFab />
      <Footer />
    </>
  )
}

function useTrackPageView(pathname: string, isAdmin: boolean) {
  const sessionIdRef = useRef<string | null>(null)
  const visitorIdRef = useRef<string | null>(null)
  const currentPathRef = useRef<string | null>(null)
  const startTimeRef = useRef<number | null>(null)
  const entryReferrerRef = useRef<string | null>(null)
  const lastSentRef = useRef<{ path: string | null; start: number | null }>({
    path: null,
    start: null,
  })

  useEffect(() => {
    if (typeof window === 'undefined' || isAdmin) return

    if (!sessionIdRef.current) {
      const key = 'jsm_session_id'
      const stored =
        window.sessionStorage.getItem(key) ||
        window.localStorage.getItem(key) ||
        null
      const generated =
        typeof crypto !== 'undefined' && 'randomUUID' in crypto
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random().toString(16).slice(2)}`
      const sessionId = stored || generated
      sessionIdRef.current = sessionId
      try {
        window.sessionStorage.setItem(key, sessionId)
        window.localStorage.setItem(key, sessionId)
      } catch {
        /* ignore storage errors */
      }
    }

    if (!visitorIdRef.current) {
      const key = 'jsm_visitor_id'
      const stored = window.localStorage.getItem(key) || null
      const generated =
        typeof crypto !== 'undefined' && 'randomUUID' in crypto
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random().toString(16).slice(2)}`
      const visitorId = stored || generated
      visitorIdRef.current = visitorId
      try {
        window.localStorage.setItem(key, visitorId)
      } catch {
        /* ignore storage errors */
      }
    }

    const now = () =>
      typeof performance !== 'undefined' && performance.now
        ? performance.now()
        : Date.now()

    const sendForCurrent = () => {
      const path = currentPathRef.current
      const start = startTimeRef.current
      if (!path || start == null) return
      if (lastSentRef.current.path === path && lastSentRef.current.start === start) {
        return
      }
      const durationSeconds = Math.max(0, (now() - start) / 1000)
      const uaInfo = parseUserAgent(navigator.userAgent || '')
      const language =
        (navigator.languages && navigator.languages[0]) || navigator.language || undefined
      const payload = {
        path,
        referrer: entryReferrerRef.current || document.referrer || undefined,
        userAgent: navigator.userAgent,
        sessionId: sessionIdRef.current,
        visitorId: visitorIdRef.current,
        durationSeconds,
        deviceType: uaInfo.deviceType,
        os: uaInfo.os,
        browser: uaInfo.browser,
        language,
      }
      fetch(`${API_BASE}/api/metrics/pageview`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        keepalive: true,
      }).catch(() => {
        /* ignore analytics errors */
      })
      lastSentRef.current = { path, start }
    }

    const previousPath = currentPathRef.current
    sendForCurrent()
    currentPathRef.current = pathname
    startTimeRef.current = now()
    entryReferrerRef.current = previousPath || document.referrer || null

    const handleVisibility = () => {
      if (document.visibilityState === 'hidden') {
        sendForCurrent()
      } else if (document.visibilityState === 'visible') {
        startTimeRef.current = now()
      }
    }

    const handlePageHide = () => sendForCurrent()

    window.addEventListener('pagehide', handlePageHide)
    document.addEventListener('visibilitychange', handleVisibility)

    return () => {
      sendForCurrent()
      window.removeEventListener('pagehide', handlePageHide)
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [pathname, isAdmin])
}

function parseUserAgent(ua: string) {
  const lower = ua.toLowerCase()
  let deviceType: 'Mobile' | 'Desktop' | 'Tablet' = 'Desktop'
  if (lower.includes('ipad') || lower.includes('tablet')) {
    deviceType = 'Tablet'
  } else if (lower.includes('mobi') || lower.includes('android') || lower.includes('iphone')) {
    deviceType = 'Mobile'
  }

  let os: string | undefined
  if (lower.includes('windows')) os = 'Windows'
  else if (lower.includes('mac os') || lower.includes('macintosh')) os = 'Mac'
  else if (lower.includes('android')) os = 'Android'
  else if (lower.includes('iphone') || lower.includes('ipad') || lower.includes('ios')) os = 'iOS'
  else if (lower.includes('linux')) os = 'Linux'

  let browser: string | undefined
  if (lower.includes('edg')) browser = 'Edge'
  else if (lower.includes('brave')) browser = 'Brave'
  else if (lower.includes('chrome') && lower.includes('safari')) browser = 'Chrome'
  else if (lower.includes('safari') && !lower.includes('chrome')) browser = 'Safari'
  else if (lower.includes('firefox')) browser = 'Firefox'

  return { deviceType, os, browser }
}
