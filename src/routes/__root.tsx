import { Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'

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
      <TanStackDevtools
        config={{
          position: 'bottom-right',
        }}
        plugins={[
          {
            name: 'Tanstack Router',
            render: <TanStackRouterDevtoolsPanel />,
          },
        ]}
      />
    </>
  ),
})
