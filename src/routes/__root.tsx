import { Outlet, createRootRoute } from '@tanstack/react-router'

import Header from '../components/Header'
import ContactFab from '../components/ContactFab'
import Breadcrumbs from '../components/Breadcrumbs'

export const Route = createRootRoute({
  component: () => (
    <>
      <Header />
      <Breadcrumbs />
      <Outlet />
      <ContactFab />
    </>
  ),
})
