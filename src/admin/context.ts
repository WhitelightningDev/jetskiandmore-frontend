import * as React from 'react'

import type { AdminOutletContext } from './types'

export const AdminContext = React.createContext<AdminOutletContext | null>(null)

export function useAdminContext() {
  const ctx = React.useContext(AdminContext)
  if (!ctx) throw new Error('Admin context missing')
  return ctx
}
