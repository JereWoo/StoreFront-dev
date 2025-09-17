import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout/settings/security")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/_layout/settings/security"!</div>;
}
