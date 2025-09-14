import { createFileRoute } from '@tanstack/react-router'
import { UseDefaultShippingButton } from "@/components/testbutton";

export const Route = createFileRoute('/_layout/testing')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div> <UseDefaultShippingButton/></div>
}
