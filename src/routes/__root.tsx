import { useEffect } from 'react'
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
  useTrackPageView(pathname)

  const isAdmin = pathname.startsWith('/admin')

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

function useTrackPageView(pathname: string) {
  useEffect(() => {
    if (typeof window === 'undefined') return
    const key = `jsm-pv:${pathname}`
    if (sessionStorage.getItem(key)) return
    sessionStorage.setItem(key, '1')
    const referrer = document.referrer || undefined
    const userAgent = navigator.userAgent
    fetch(`${API_BASE}/api/metrics/pageview`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: pathname, referrer, userAgent }),
      keepalive: true,
    }).catch(() => {
      /* ignore analytics errors */
    })
  }, [pathname])
}
