import { createFileRoute, Navigate } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  // Redirect root path to the Home page
  return <Navigate to="/home" />
}

