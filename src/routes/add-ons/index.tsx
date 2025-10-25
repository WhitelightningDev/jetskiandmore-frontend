import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/add-ons/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/add-ons/"!</div>
}
